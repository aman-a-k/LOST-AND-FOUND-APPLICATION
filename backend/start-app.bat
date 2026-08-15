@echo off
echo Starting Lost and Found Application...

REM Create and activate virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing required packages...
python -m pip install -r requirements.txt

REM Set Flask environment variables
set FLASK_APP=app.py
set FLASK_ENV=development
set FLASK_DEBUG=1

REM Create required directories
if not exist "logs" mkdir logs
if not exist "app\static\uploads" mkdir "app\static\uploads"

REM Run the Flask application
echo Starting Flask application...
python app.py

pause