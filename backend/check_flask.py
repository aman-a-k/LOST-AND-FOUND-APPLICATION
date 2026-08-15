import os
import sys

def check_environment():
    print("=== Environment Check ===")
    print(f"Python version: {sys.version}")
    print(f"Python executable: {sys.executable}")
    print("\n=== Directory Check ===")
    required_dirs = ['venv', 'logs', 'instance', 'app/static/uploads']
    for dir_path in required_dirs:
        exists = os.path.exists(dir_path)
        print(f"{dir_path}: {'✓ exists' if exists else '✗ missing'}")
    
    print("\n=== Package Check ===")
    try:
        import flask
        print("Flask ✓")
    except ImportError:
        print("Flask ✗")
    
    try:
        import flask_sqlalchemy
        print("Flask-SQLAlchemy ✓")
    except ImportError:
        print("Flask-SQLAlchemy ✗")
    
    print("\n=== Database Check ===")
    db_path = os.path.join('instance', 'lost_and_found.db')
    print(f"Database: {'✓ exists' if os.path.exists(db_path) else '✗ missing'}")

if __name__ == '__main__':
    check_environment()