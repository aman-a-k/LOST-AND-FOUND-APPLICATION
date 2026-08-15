import os
import sys
import subprocess
import platform
import site
from pathlib import Path

def activate_venv():
    """Activate virtual environment in the current Python process"""
    venv_path = Path('venv')
    if platform.system() == "Windows":
        site_packages = venv_path / "Lib" / "site-packages"
        scripts = venv_path / "Scripts"
    else:
        site_packages = venv_path / "lib" / f"python{sys.version_info.major}.{sys.version_info.minor}" / "site-packages"
        scripts = venv_path / "bin"

    # Add virtual environment's site-packages to Python path
    site.addsitedir(str(site_packages))
    
    # Update environment PATH
    os.environ["PATH"] = str(scripts) + os.pathsep + os.environ.get("PATH", "")
    
    # Update virtual env variables
    os.environ["VIRTUAL_ENV"] = str(venv_path)
    
    return str(venv_path / "Scripts" / "python.exe") if platform.system() == "Windows" else str(venv_path / "bin" / "python")

def ensure_venv():
    """Create virtual environment if it doesn't exist"""
    venv_path = Path('venv')
    if not venv_path.exists():
        print("Creating virtual environment...")
        subprocess.check_call([sys.executable, '-m', 'venv', 'venv'])
    return activate_venv()

def install_requirements(venv_python):
    """Install required packages"""
    print("Installing requirements...")
    try:
        # First, upgrade pip
        subprocess.check_call([venv_python, '-m', 'pip', 'install', '--upgrade', 'pip'])
        # Then install all requirements
        subprocess.check_call([venv_python, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error installing requirements: {e}")
        raise

def setup_environment():
    """Set up environment variables"""
    os.environ['FLASK_APP'] = 'run.py'
    os.environ['FLASK_ENV'] = 'development'
    os.environ['FLASK_DEBUG'] = '1'
    
    # Ensure directories exist
    os.makedirs('logs', exist_ok=True)
    os.makedirs(os.path.join('app', 'static', 'uploads'), exist_ok=True)

def main():
    try:
        print("Setting up Lost & Found Application...")
        
        # Ensure virtual environment and activate it
        venv_python = ensure_venv()
        
        # Install requirements
        install_requirements(venv_python)
        
        # Set up environment
        setup_environment()
        
        print("\nStarting Flask application...")
        # Use the activated environment to run the application
        subprocess.check_call([venv_python, 'run.py'])
        
    except subprocess.CalledProcessError as e:
        print(f"Error during setup/execution: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()