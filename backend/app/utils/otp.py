import random
import string
from datetime import datetime, timedelta
from flask import session, current_app
from flask_mail import Message
from .. import mail

OTP_EXPIRY_MINUTES = 10

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_otp_email(email, otp, mail_sender):
    try:
        subject = "Your OTP for Sahyadri Lost & Found"
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #003366;">Sahyadri Lost & Found - OTP Verification</h2>
                <p>Your OTP for reporting an item is:</p>
                <h1 style="color: #0066cc; font-size: 32px; letter-spacing: 5px;">{otp}</h1>
                <p>This OTP is valid for {OTP_EXPIRY_MINUTES} minutes.</p>
                <p style="color: #666;">If you did not request this OTP, please ignore this email.</p>
                <hr>
                <p style="font-size: 12px; color: #999;">
                    This is an automated message from Sahyadri Lost & Found System.
                    Please do not reply to this email.
                </p>
            </body>
        </html>
        """
        text_body = f"Your OTP for reporting an item is: {otp}\nThis OTP is valid for {OTP_EXPIRY_MINUTES} minutes."
        
        msg = Message(
            subject,
            recipients=[email],
            html=html_body,
            body=text_body,
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg)
        current_app.logger.info(f'OTP sent successfully to {email}')
        return True
    except Exception as e:
        current_app.logger.error(f'Failed to send OTP email: {e}')
        return False

def store_otp(email, otp):
    session['otp'] = otp
    session['otp_email'] = email
    session['otp_expiry'] = (datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)).isoformat()

def verify_otp(email, otp):
    stored_otp = session.get('otp')
    stored_email = session.get('otp_email')
    expiry = session.get('otp_expiry')
    if not (stored_otp and stored_email and expiry):
        return False
    if stored_email != email or stored_otp != otp:
        return False
    if datetime.utcnow() > datetime.fromisoformat(expiry):
        return False
    return True

def clear_otp():
    session.pop('otp', None)
    session.pop('otp_email', None)
    session.pop('otp_expiry', None)
