import os
from datetime import timedelta

class Config:
    # Basic Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'sahyadri-lost-and-found-2025'
    
    # Database configuration
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_url = os.environ.get('POSTGRES_URL') or os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'instance', 'lost_and_found.db')
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload configuration
    UPLOAD_FOLDER = os.path.join(basedir, 'app', 'static', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    
    # Email configuration
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'True') == 'True'
    MAIL_USE_SSL = os.environ.get('MAIL_USE_SSL', 'False') == 'True'
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', 'aman.kekkar@gmail.com')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')  # Must be set in environment
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'Sahyadri Lost & Found <aman.kekkar@gmail.com>')
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'aman.kekkar@gmail.com')
    
    # Notification settings
    NOTIFY_ADMIN_ON_NEW_ITEM = True
    NOTIFY_ADMIN_ON_CLAIM = True
    NOTIFY_ADMIN_ON_RETURN = True
    NOTIFY_ADMIN_ON_ESCALATION = True
    NOTIFY_USER_ON_MATCH = True
    
    # Escalation settings
    ESCALATION_DAYS = 7
    ADMIN_ESCALATION_DAYS = 14
    DISPOSAL_DAYS = 30
    
    # Session configuration
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    # Logging configuration
    LOG_TO_STDOUT = os.environ.get('LOG_TO_STDOUT')
    LOG_LEVEL = os.environ.get('LOG_LEVEL') or 'INFO'
    
    @staticmethod
    def init_app(app):
        # Create required directories
        try:
            basedir = os.path.abspath(os.path.dirname(__file__))
            os.makedirs(os.path.join(basedir, 'instance'), exist_ok=True)
            os.makedirs(os.path.join(basedir, 'app', 'static', 'uploads'), exist_ok=True)
            os.makedirs(os.path.join(basedir, 'app', 'static', 'images'), exist_ok=True)
        except OSError:
            # Ignore errors on read-only file systems like Vercel
            pass