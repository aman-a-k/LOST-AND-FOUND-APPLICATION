@echo off
echo Installing dependencies...
python -m pip install --upgrade pip
python -m pip install python-dotenv flask flask-sqlalchemy flask-login flask-mail flask-wtf flask-migrate flask-apscheduler pillow email-validator werkzeug pyjwt sqlalchemy apscheduler alembic requests
echo Dependencies installed successfully!
pause