from flask import Blueprint, request, jsonify, current_app, send_file
from flask_login import login_required, current_user
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import os
import csv
import io
from ..models.item import Item
from ..models.user import User
from .. import db
from ..utils.email import send_item_match_notification, send_admin_lost_item_notification
from ..utils.otp import generate_otp, send_otp_email, store_otp, verify_otp, clear_otp
from ..utils.email import send_email

bp = Blueprint('main', __name__)

@bp.route('/api/stats', methods=['GET'])
def get_stats():
    lost_items = Item.query.filter_by(status='lost').order_by(Item.date_reported.desc()).limit(3).all()
    return jsonify({
        'lost_items': [item.to_dict() for item in lost_items]
    })

@bp.route('/api/items/lost', methods=['POST'])
def report_lost_item():
    email = request.form.get('email')
    otp = request.form.get('otp')
    if not verify_otp(email, otp):
        return jsonify({'success': False, 'message': 'Invalid or expired OTP'}), 400
    clear_otp()
    
    name = request.form.get('name')
    category = request.form.get('category')
    description = request.form.get('description')
    location = request.form.get('location')
    date_lost = datetime.strptime(request.form.get('date_lost'), '%Y-%m-%dT%H:%M') if request.form.get('date_lost') else datetime.utcnow()
    
    item = Item(
        name=name,
        category=category,
        description=description,
        location=location,
        date_lost=date_lost,
        status='lost',
    )
    
    if request.form.get('image_url'):
        item.image_path = request.form.get('image_url')
    elif 'image' in request.files:
        file = request.files['image']
        if file.filename:
            filename = secure_filename(file.filename)
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            try:
                file.save(file_path)
            except Exception as e:
                print(f"Upload error: {e}")
            item.image_path = filename
    
    db.session.add(item)
    db.session.commit()
    
    # Try to find matches
    matches = []
    matching_found_items = Item.query.filter_by(status='found', category=category).all()
    for found_item in matching_found_items:
        # Basic text similarity check (if word matches in description or name)
        if (name.lower() in found_item.name.lower() or 
            (description and found_item.description and 
             any(word in found_item.description.lower() for word in description.lower().split() if len(word) > 4))):
            matches.append(found_item.to_dict())
    
    try:
        send_admin_lost_item_notification(item, item)
    except Exception:
        pass
    
    return jsonify({'success': True, 'message': 'Lost item reported successfully', 'item': item.to_dict(), 'matches': matches})

@bp.route('/api/items/found', methods=['POST'])
def report_found_item():
    email = request.form.get('email')
    otp = request.form.get('otp')
    if not verify_otp(email, otp):
        return jsonify({'success': False, 'message': 'Invalid or expired OTP'}), 400
    clear_otp()
    
    name = request.form.get('name')
    category = request.form.get('category')
    description = request.form.get('description')
    location = request.form.get('location')
    date_found = datetime.strptime(request.form.get('date_found'), '%Y-%m-%dT%H:%M') if request.form.get('date_found') else datetime.utcnow()
    
    item = Item(
        name=name,
        category=category,
        description=description,
        location=location,
        date_found=date_found,
        status='found',
    )
    
    if request.form.get('image_url'):
        item.image_path = request.form.get('image_url')
    elif 'image' in request.files:
        file = request.files['image']
        if file.filename:
            filename = secure_filename(file.filename)
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            try:
                file.save(file_path)
            except Exception:
                pass
            item.image_path = filename
            
    db.session.add(item)
    db.session.commit()
    
    matching_items = Item.query.filter_by(status='lost', category=category).all()
    for lost_item in matching_items:
        owner = User.query.get(lost_item.owner_id) if lost_item.owner_id else None
        if owner:
            try:
                send_item_match_notification(owner, item)
            except Exception:
                pass
                
    return jsonify({'success': True, 'message': 'Found item reported successfully', 'item': item.to_dict()})

@bp.route('/api/items', methods=['GET'])
def get_all_items():
    status = request.args.get('status')
    if status:
        items = Item.query.filter_by(status=status).order_by(Item.date_reported.desc()).all()
    else:
        items = Item.query.order_by(Item.date_reported.desc()).all()
    return jsonify({'success': True, 'items': [item.to_dict() for item in items]})

@bp.route('/api/dashboard', methods=['GET'])
@login_required
def dashboard():
    if current_user.role not in ['admin', 'faculty']:
        return jsonify({'success': False, 'message': 'Permission denied'}), 403
        
    lost_items = Item.query.filter_by(status='lost').all()
    found_items = Item.query.filter_by(status='found').all()
    
    today = datetime.utcnow().date()
    returned_today = len([i for i in Item.query.filter_by(status='returned').all() if i.date_claimed and i.date_claimed.date() == today])
    pending_claims = Item.query.filter_by(status='claimed').count()
    
    return jsonify({
        'success': True,
        'stats': {
            'lost_count': len(lost_items),
            'found_count': len(found_items),
            'returned_today': returned_today,
            'pending_claims': pending_claims
        },
        'lost_items': [i.to_dict() for i in lost_items],
        'found_items': [i.to_dict() for i in found_items]
    })

@bp.route('/api/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = Item.query.get_or_404(item_id)
    return jsonify({'success': True, 'item': item.to_dict()})

@bp.route('/api/items/<int:item_id>/return', methods=['POST'])
@login_required
def mark_item_returned(item_id):
    if current_user.role not in ['admin', 'faculty']:
        return jsonify({'success': False, 'error': 'Permission denied'}), 403
        
    item = Item.query.get_or_404(item_id)
    item.status = 'returned'
    item.date_claimed = datetime.utcnow()
    db.session.commit()
    return jsonify({'success': True, 'message': f'Item {item.name} marked as returned'})

@bp.route('/api/otp/send', methods=['POST'])
def send_otp():
    data = request.get_json() or request.form
    email = data.get('email')
    if not email:
        return jsonify({'success': False, 'message': 'Email required'}), 400
    otp = generate_otp()
    store_otp(email, otp)
    send_otp_email(email, otp, send_email)
    return jsonify({'success': True, 'message': 'OTP sent'})