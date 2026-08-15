from flask import Blueprint, jsonify, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash
from ..models.user import User
from .. import db

bp = Blueprint('auth', __name__)

@bp.route('/api/auth/me', methods=['GET'])
def me():
    if current_user.is_authenticated:
        return jsonify({'authenticated': True, 'user': {'id': current_user.id, 'role': current_user.role, 'email': current_user.email, 'username': current_user.username}})
    return jsonify({'authenticated': False}), 401

@bp.route('/api/auth/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return jsonify({'success': True, 'message': 'Already logged in', 'user': {'id': current_user.id, 'role': current_user.role, 'email': current_user.email}})
        
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
        
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        login_user(user, remember=True)
        return jsonify({'success': True, 'user': {'id': user.id, 'role': user.role, 'email': user.email, 'username': user.username}})
    
    return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

@bp.route('/api/auth/register', methods=['POST'])
def register():
    if current_user.is_authenticated:
        return jsonify({'success': True, 'message': 'Already logged in'})
        
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
        
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    department = data.get('department')
    phone = data.get('phone')
    
    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'Email already registered'}), 400
        
    if User.query.filter_by(username=username).first():
        return jsonify({'success': False, 'message': 'Username already taken'}), 400
    
    user = User(
        username=username,
        email=email,
        department=department,
        phone=phone,
        role='student'
    )
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Registration successful'})

@bp.route('/api/auth/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'success': True, 'message': 'Logged out successfully'})