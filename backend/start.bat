@echo off
echo Starting Lost and Found Application Setup...

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install or upgrade dependencies
echo Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Set environment variables
echo Setting up environment...
set FLASK_APP=run.py
set FLASK_ENV=development

REM Create necessary directories
if not exist "app\static\uploads" (
    echo Creating upload directory...
    mkdir "app\static\uploads"
)

REM Start the application
echo Starting Flask application...
python run.py

pause