from datetime import datetime, timedelta
from flask import current_app
from .. import db
from ..models.item import Item
from ..models.user import User
from .email import send_escalation_notification, send_admin_notification

def check_unclaimed_items():
    """
    Daily task to check for unclaimed items and send notifications:
    - Items unclaimed for 7 days: Send reminder to owner/finder
    - Items unclaimed for 14 days: Escalate to admin
    - Items unclaimed for 30 days: Mark for disposal/donation
    """
    try:
        current_app.logger.info('Running unclaimed items check...')
        
        now = datetime.utcnow()
        seven_days_ago = now - timedelta(days=7)
        fourteen_days_ago = now - timedelta(days=14)
        thirty_days_ago = now - timedelta(days=30)

        # Check items unclaimed for 7 days
        items_7_days = Item.query.filter(
            Item.status.in_(['lost', 'found']),
            Item.date_reported <= seven_days_ago,
            Item.date_reported > fourteen_days_ago
        ).all()

        for item in items_7_days:
            if item.status == 'lost' and item.owner_id:
                owner = User.query.get(item.owner_id)
                if owner:
                    send_escalation_notification(owner, item, level=1)
            elif item.status == 'found' and item.finder_id:
                finder = User.query.get(item.finder_id)
                if finder:
                    send_escalation_notification(finder, item, level=1)

        # Check items unclaimed for 14 days
        items_14_days = Item.query.filter(
            Item.status.in_(['lost', 'found']),
            Item.date_reported <= fourteen_days_ago,
            Item.date_reported > thirty_days_ago
        ).all()

        admins = User.query.filter_by(role='admin').all()
        for item in items_14_days:
            for admin in admins:
                send_admin_notification(admin, item, 'Item unclaimed for 14 days', level=2)

        # Check items unclaimed for 30 days
        items_30_days = Item.query.filter(
            Item.status.in_(['lost', 'found']),
            Item.date_reported <= thirty_days_ago
        ).all()

        for item in items_30_days:
            item.status = 'archived'
            for admin in admins:
                send_admin_notification(admin, item, 'Item marked for disposal/donation', level=3)

        db.session.commit()
        current_app.logger.info('Unclaimed items check completed successfully')
        
    except Exception as e:
        current_app.logger.error(f'Error in check_unclaimed_items task: {e}')
        raise