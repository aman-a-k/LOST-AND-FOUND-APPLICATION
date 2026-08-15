import os
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail
from flask_migrate import Migrate
from flask_apscheduler import APScheduler
from config import Config

db = SQLAlchemy()
login_manager = LoginManager()
mail = Mail()
scheduler = APScheduler()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Configure logging
    if not app.debug and not app.testing:
        # Create logs directory if it doesn't exist
        logs_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
        os.makedirs(logs_dir, exist_ok=True)
        
        # Set up file handler
        file_handler = RotatingFileHandler(
            os.path.join(logs_dir, 'lost_and_found.log'),
            maxBytes=10240,
            backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        
        # Set up console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(logging.Formatter('%(levelname)s: %(message)s'))
        app.logger.addHandler(console_handler)
        
        app.logger.setLevel(logging.INFO)
        app.logger.info('Lost and Found Application startup')

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    scheduler.init_app(app)
    migrate.init_app(app, db)

    login_manager.login_view = 'auth.login'
    login_manager.login_message_category = 'info'

    # Create upload folder if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Register blueprints
    from .routes import main, auth
    app.register_blueprint(main.bp)
    app.register_blueprint(auth.bp)

    # Initialize database and scheduled tasks
    with app.app_context():
        try:
            app.logger.info('Creating database tables...')
            db.create_all()
            
            app.logger.info('Initializing database...')
            from .utils.init_db import init_db
            init_db()
            
            app.logger.info('Starting scheduler...')
            scheduler.start()
            
            from .utils.tasks import check_unclaimed_items
            scheduler.add_job(
                id='check_unclaimed_items',
                func=check_unclaimed_items,
                trigger='interval',
                hours=24,
                start_date='2025-04-29 00:00:00'
            )
            app.logger.info('Application initialization completed successfully')
            
        except Exception as e:
            app.logger.error(f'Error during application initialization: {e}')
            raise

    return app