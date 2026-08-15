import sys
import pkg_resources
import os
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Flask is working!'

def check_python():
    print(f"Python version: {sys.version}")
    print(f"Python executable: {sys.executable}")
    print(f"Python path: {sys.path}")

def check_packages():
    print("\nInstalled packages:")
    for pkg in pkg_resources.working_set:
        print(f"{pkg.key}=={pkg.version}")

def check_environment():
    print("\nEnvironment variables:")
    for key, value in os.environ.items():
        if 'FLASK' in key or 'PYTHON' in key:
            print(f"{key}={value}")

def main():
    print("=== Flask Application Setup Check ===\n")
    try:
        check_python()
        check_packages()
        check_environment()
        
        print("\nTrying to import key modules...")
        import flask
        print("✓ Flask imported successfully")
        
        import flask_sqlalchemy
        print("✓ Flask-SQLAlchemy imported successfully")
        
        import flask_login
        print("✓ Flask-Login imported successfully")
        
        print("\nAll critical imports successful!")
        
    except ImportError as e:
        print(f"\nError importing module: {e}")
        print("Please install missing packages using:")
        print("pip install -r requirements.txt")
    except Exception as e:
        print(f"\nUnexpected error: {e}")

if __name__ == '__main__':
    main()
    print("Checking Flask setup...")
    print("If Flask is working, you should see the development server start.")
    app.run(debug=True)