import os
import sys
import subprocess
import venv
from pathlib import Path
from dotenv import load_dotenv

def setup_and_run():
    print("Setting up Lost & Found Application...")
    
    # Ensure we're in the correct directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Load environment variables
    env_path = Path('.env')
    if env_path.exists():
        print("Loading environment variables from .env")
        load_dotenv()
    else:
        print("Warning: .env file not found")
    
    # Create virtual environment if it doesn't exist
    if not os.path.exists('venv'):
        print("Creating virtual environment...")
        venv.create('venv', with_pip=True)
    
    # Get the path to the virtual environment Python executable
    if sys.platform == 'win32':
        venv_python = str(Path('venv/Scripts/python.exe'))
        venv_pip = str(Path('venv/Scripts/pip.exe'))
    else:
        venv_python = str(Path('venv/bin/python'))
        venv_pip = str(Path('venv/bin/pip'))
    
    # Install requirements
    print("Installing requirements...")
    subprocess.run([venv_python, '-m', 'pip', 'install', '--upgrade', 'pip'])
    subprocess.run([venv_python, '-m', 'pip', 'install', '-r', 'requirements.txt'])
    
    # Create necessary directories
    os.makedirs('logs', exist_ok=True)
    os.makedirs('app/static/uploads', exist_ok=True)
    
    print("\nStarting Flask application...")
    try:
        subprocess.run([venv_python, 'app.py'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error starting Flask: {e}", file=sys.stderr)
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nShutting down...")

if __name__ == '__main__':
    setup_and_run()