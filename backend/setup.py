import os
import sys
import venv
import subprocess
import platform
from pathlib import Path

def setup_project():
    print("Setting up Lost and Found Application...")
    
    # Use Path for better path handling
    base_path = Path().absolute()
    venv_path = base_path / 'venv'
    
    # Create virtual environment
    if not venv_path.exists():
        print("Creating virtual environment...")
        venv.create(str(venv_path), with_pip=True)
    
    # Determine the path to the virtual environment's Python executable
    if platform.system() == 'Windows':
        venv_python = str(venv_path / 'Scripts' / 'python.exe')
        venv_pip = str(venv_path / 'Scripts' / 'pip.exe')
        flask_cmd = str(venv_path / 'Scripts' / 'flask.exe')
    else:
        venv_python = str(venv_path / 'bin' / 'python')
        venv_pip = str(venv_path / 'bin' / 'pip')
        flask_cmd = str(venv_path / 'bin' / 'flask')
    
    # Install requirements
    print("Installing dependencies...")
    requirements_path = base_path / 'requirements.txt'
    subprocess.run([venv_python, '-m', 'pip', 'install', '--upgrade', 'pip'], check=True)
    subprocess.run([venv_python, '-m', 'pip', 'install', '-r', str(requirements_path)], check=True)
    
    # Create necessary directories
    uploads_path = base_path / 'app' / 'static' / 'uploads'
    uploads_path.mkdir(parents=True, exist_ok=True)
    
    # Set environment variables
    os.environ['FLASK_APP'] = 'run.py'
    os.environ['FLASK_ENV'] = 'development'
    
    # Initialize database
    print("Initializing database...")
    try:
        subprocess.run([flask_cmd, 'db', 'init'], check=True)
    except subprocess.CalledProcessError:
        print("Migration directory already exists, skipping initialization")
    
    try:
        subprocess.run([flask_cmd, 'db', 'migrate', '-m', "Initial migration"], check=True)
        subprocess.run([flask_cmd, 'db', 'upgrade'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Warning: Database migration failed: {e}")
        print("Continuing with application startup...")
    
    # Run the application
    print("\nStarting Flask application...")
    run_script = base_path / 'run.py'
    subprocess.run([venv_python, str(run_script)], check=True)

if __name__ == '__main__':
    try:
        setup_project()
    except subprocess.CalledProcessError as e:
        print(f"Error during setup: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)