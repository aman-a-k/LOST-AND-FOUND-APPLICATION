from flask import current_app, render_template_string
from flask_mail import Message
from .. import mail

def send_email(subject, recipients, body, html=None):
    """Base function to send emails"""
    try:
        msg = Message(subject,
                     sender=current_app.config['MAIL_DEFAULT_SENDER'],
                     recipients=recipients)
        msg.body = body
        if html:
            msg.html = html
        mail.send(msg)
        current_app.logger.info(f'Email sent to {recipients}')
    except Exception as e:
        current_app.logger.error(f'Failed to send email: {e}')

def send_item_match_notification(user, item):
    """Notify user about a potential match for their lost/found item"""
    subject = "Potential Match Found - Lost & Found System"
    body = f"""
Dear {user.username},

A potential match has been found for your {'lost' if item.status == 'found' else 'found'} item:

Item Details:
- Name: {item.name}
- Category: {item.category}
- Location: {item.location}
- Date: {item.date_reported.strftime('%Y-%m-%d %H:%M')}

Please check your dashboard for more details.

Best regards,
Sahyadri Lost & Found Team
"""
    send_email(subject, [user.email], body)

def send_escalation_notification(user, item, level=1):
    """Send escalation notifications based on urgency level"""
    subject = "Action Required - Unclaimed Item Notification"
    body = f"""
Dear {user.username},

This is a notification regarding the following {'lost' if item.status == 'lost' else 'found'} item:

Item Details:
- Name: {item.name}
- Category: {item.category}
- Status: {item.status}
- Date Reported: {item.date_reported.strftime('%Y-%m-%d %H:%M')}

{'This item has been unclaimed for 7 days. Please take action to resolve this case.' if level == 1 else 
'This item requires immediate attention as it has been unclaimed for an extended period.'}

Please visit the dashboard to update the status or contact the administrative office.

Best regards,
Sahyadri Lost & Found Team
"""
    send_email(subject, [user.email], body)

def send_admin_notification(admin, item, message, level=1):
    """Send notifications to administrators"""
    urgency = "Low" if level == 1 else "Medium" if level == 2 else "High"
    subject = f"[{urgency} Priority] Admin Action Required - Lost & Found System"
    body = f"""
Dear {admin.username},

{message}

Item Details:
- Name: {item.name}
- Category: {item.category}
- Status: {item.status}
- Date Reported: {item.date_reported.strftime('%Y-%m-%d %H:%M')}
{'- URGENT: Item needs immediate review' if level == 3 else ''}

Please take appropriate action through the admin dashboard.

Best regards,
Sahyadri Lost & Found System
"""
    send_email(subject, [admin.email], body)

def send_admin_lost_item_notification(item, user):
    """Notify administrators about new lost item reports"""
    admins = User.query.filter_by(role='admin').all()
    subject = "New Lost Item Reported - Admin Notice"
    for admin in admins:
        body = f"""
Dear {admin.username},

A new item has been reported as lost:

Item Details:
- Name: {item.name}
- Category: {item.category}
- Location: {item.location}
- Reported by: {user.username} ({user.email})
- Date: {item.date_reported.strftime('%Y-%m-%d %H:%M')}

Please review this case on the admin dashboard.

Best regards,
Sahyadri Lost & Found System
"""
        send_email(subject, [admin.email], body)

def send_item_claim_notification(finder, item):
    """Send notification to the finder when an item is claimed"""
    msg = Message(
        "Item Claimed - Sahyadri Lost & Found",
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[finder.email]
    )
    
    msg.html = render_template_string("""
        <h3>Item Has Been Claimed</h3>
        <p>Hello {{ finder.username }},</p>
        <p>The item you found has been claimed by its owner:</p>
        <ul>
            <li><strong>Item:</strong> {{ item.name }}</li>
            <li><strong>Category:</strong> {{ item.category }}</li>
            <li><strong>Found Date:</strong> {{ item.date_found.strftime('%Y-%m-%d') }}</li>
        </ul>
        <p>Thank you for helping return this item to its owner!</p>
        <p>Best regards,<br>Sahyadri Lost & Found Team</p>
    """, finder=finder, item=item)
    
    mail.send(msg)

def send_admin_lost_item_notification(item, user):
    """Send notification to admin when a new item is reported lost"""
    msg = Message(
        "New Lost Item Report - Sahyadri Lost & Found",
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[current_app.config['ADMIN_EMAIL']]
    )
    
    msg.html = render_template_string("""
        <h3>New Lost Item Report</h3>
        <p>A new item has been reported as lost:</p>
        <ul>
            <li><strong>Item:</strong> {{ item.name }}</li>
            <li><strong>Category:</strong> {{ item.category }}</li>
            <li><strong>Location:</strong> {{ item.location }}</li>
            <li><strong>Reported by:</strong> {{ user.username }} ({{ user.email }})</li>
            <li><strong>Department:</strong> {{ user.department }}</li>
            <li><strong>Date Reported:</strong> {{ item.date_reported.strftime('%Y-%m-%d %H:%M') }}</li>
        </ul>
        <p>Please login to the admin dashboard to review this report.</p>
        <p>Best regards,<br>Sahyadri Lost & Found System</p>
    """, item=item, user=user)
    
    mail.send(msg)

def send_escalation_notification(item, recipient):
    """Send escalation notification for items not claimed within 7 days"""
    msg = Message(
        "Item Escalation Notice - Sahyadri Lost & Found",
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[recipient.email]
    )
    
    msg.html = render_template_string("""
        <h3>Item Requires Attention</h3>
        <p>Hello {{ recipient.username }},</p>
        <p>The following item has been in the Lost & Found for over 7 days:</p>
        <ul>
            <li><strong>Item:</strong> {{ item.name }}</li>
            <li><strong>Category:</strong> {{ item.category }}</li>
            <li><strong>Status:</strong> {{ item.status }}</li>
            <li><strong>Date Reported:</strong> {{ item.date_reported.strftime('%Y-%m-%d') }}</li>
            <li><strong>Current Location:</strong> {{ item.current_location }}</li>
        </ul>
        <p>Please review this item and take appropriate action.</p>
        <p>Best regards,<br>Sahyadri Lost & Found Team</p>
    """, recipient=recipient, item=item)
    
    mail.send(msg)

def notify_admin_new_item(item, reporter):
    """Notify admin when a new item is reported"""
    if not current_app.config['NOTIFY_ADMIN_ON_NEW_ITEM']:
        return
        
    subject = f"New {item.status.title()} Item Report: {item.name}"
    body = f"""
A new item has been {item.status}:

Item Details:
- Name: {item.name}
- Category: {item.category}
- Location: {item.location}
- Description: {item.description}

Reported by:
- Name: {reporter.username}
- Email: {reporter.email}
- Department: {reporter.department}

You can view this item in the admin dashboard.
"""
    send_email(subject, current_app.config['ADMIN_EMAIL'], body)

def notify_admin_claim(item, claimer):
    """Notify admin when an item is claimed"""
    if not current_app.config['NOTIFY_ADMIN_ON_CLAIM']:
        return
        
    subject = f"Item Claim Request: {item.name}"
    body = f"""
An item has been claimed:

Item Details:
- Name: {item.name}
- Category: {item.category}
- Status: {item.status}

Claimed by:
- Name: {claimer.username}
- Email: {claimer.email}
- Department: {claimer.department}

Please verify this claim in the admin dashboard.
"""
    send_email(subject, current_app.config['ADMIN_EMAIL'], body)

def notify_admin_return(item, handler):
    """Notify admin when an item is returned"""
    if not current_app.config['NOTIFY_ADMIN_ON_RETURN']:
        return
        
    subject = f"Item Returned: {item.name}"
    body = f"""
An item has been marked as returned:

Item Details:
- Name: {item.name}
- Category: {item.category}
- Previous Status: {item.status}

Handled by:
- Name: {handler.username}
- Email: {handler.email}

This item will be archived in the system.
"""
    send_email(subject, current_app.config['ADMIN_EMAIL'], body)

def notify_admin_escalation(item):
    """Notify admin about an escalated item"""
    if not current_app.config['NOTIFY_ADMIN_ON_ESCALATION']:
        return
        
    subject = f"Item Escalation: {item.name}"
    body = f"""
An item has been escalated due to being unclaimed for {current_app.config['ESCALATION_DAYS']} days:

Item Details:
- Name: {item.name}
- Category: {item.category}
- Status: {item.status}
- Date Reported: {item.date_reported.strftime('%Y-%m-%d %H:%M')}
- Location: {item.location}

Please review this item in the admin dashboard.
"""
    send_email(subject, current_app.config['ADMIN_EMAIL'], body)

def notify_match(lost_item, found_item, user):
    """Notify user about a potential match"""
    if not current_app.config['NOTIFY_USER_ON_MATCH']:
        return
        
    subject = f"Potential Match Found: {lost_item.name}"
    body = f"""
We found a potential match for your lost item:

Your Lost Item:
- Name: {lost_item.name}
- Category: {lost_item.category}
- Description: {lost_item.description}

Found Item Details:
- Location Found: {found_item.location}
- Date Found: {found_item.date_found.strftime('%Y-%m-%d %H:%M')}
- Current Location: {found_item.current_location}

Please visit the Lost & Found office to verify if this is your item.
"""
    send_email(subject, user.email, body)