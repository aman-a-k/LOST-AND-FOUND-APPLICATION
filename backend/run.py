import os
import sys
import logging
from pathlib import Path
from dotenv import load_dotenv
from app import create_app

def setup_logging():
    """Set up basic logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(Path('logs/startup.log'))
        ]
    )

def main():
    try:
        # Set up logging first
        setup_logging()
        logger = logging.getLogger(__name__)
        logger.info("Starting Lost & Found Application...")

        # Load environment variables from .env file
        env_path = Path('.env')
        if (env_path.exists()):
            logger.info("Loading environment variables from .env")
            load_dotenv()
        else:
            logger.warning(".env file not found, using default configuration")

        # Create Flask application
        logger.info("Initializing Flask application...")
        app = create_app()
        
        # Get host and port from environment or use defaults
        host = os.environ.get('FLASK_HOST', '127.0.0.1')
        port = int(os.environ.get('FLASK_PORT', 5000))
        
        print(f"\nStarting Lost & Found Application")
        print(f"=" * 40)
        print(f"Server running at: http://{host}:{port}")
        print(f"Press CTRL+C to quit")
        print(f"=" * 40)
        
        # Run the application
        app.run(host=host, port=port, debug=True)
        
    except ImportError as e:
        print(f"Error importing required modules: {e}", file=sys.stderr)
        print("Please make sure all required packages are installed:", file=sys.stderr)
        print("Run: pip install -r requirements.txt", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error starting application: {e}", file=sys.stderr)
        print("For detailed error information, check the logs directory", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='127.0.0.1', port=5000)