import sys
import os

# Add the parent directory to Python path so that 'backend' module is accessible
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import create_app

# Vercel requires the app variable to be exposed
app = create_app()

if __name__ == '__main__':
    app.run()
