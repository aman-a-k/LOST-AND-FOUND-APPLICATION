import logging
from flask import current_app
from ..models.user import User
from .. import db

logger = logging.getLogger(__name__)

def init_db():
    """Initialize the database with required initial data"""
    try:
        logger.info("Starting database initialization...")
        
        # Create admin user if it doesn't exist
        admin_email = current_app.config['ADMIN_EMAIL']
        admin = User.query.filter_by(email=admin_email).first()
        
        if not admin:
            logger.info(f"Creating admin user with email: {admin_email}")
            admin = User(
                username='amankekkar',
                email=admin_email,
                role='admin',
                department='Administration'
            )
            admin.set_password('*sahyadriadmin2025')  # Default password, should be changed immediately
            db.session.add(admin)
            
            try:
                db.session.commit()
                logger.info("Admin user created successfully!")
            except Exception as e:
                db.session.rollback()
                logger.error(f"Error creating admin user: {e}")
                raise
        else:
            logger.info("Admin user already exists")
        
        # Initialize any other required data here
        
        logger.info("Database initialization completed successfully!")
        
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
        raise