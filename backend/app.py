import os
from app import create_app, db
import logging
from app.utils.init_db import init_db

import sys

# Configure logging
try:
    os.makedirs('logs', exist_ok=True)
    handlers = [
        logging.FileHandler('logs/startup.log'),
        logging.StreamHandler(sys.stdout)
    ]
except OSError:
    handlers = [logging.StreamHandler(sys.stdout)]

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=handlers
)

logger = logging.getLogger(__name__)

# Ensure instance directory exists
try:
    os.makedirs('instance', exist_ok=True)
except OSError:
    pass

try:
    app = create_app()
    
    with app.app_context():
        db.create_all()
        init_db()  # Initialize admin user and other required data
    
    if __name__ == '__main__':
        logger.info('Starting Flask application...')
        app.run(debug=True, host='127.0.0.1', port=5000)
except Exception as e:
    logger.error(f"Error starting application: {e}")
    raise