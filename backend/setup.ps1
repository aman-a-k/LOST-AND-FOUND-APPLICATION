# Stop on any error
$ErrorActionPreference = "Stop"

Write-Host "Setting up Lost & Found Application..."

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..."
.\venv\Scripts\Activate.ps1

# Install or upgrade pip and requirements
Write-Host "Installing dependencies..."
python -m pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories
Write-Host "Creating required directories..."
New-Item -ItemType Directory -Force -Path "logs" | Out-Null
New-Item -ItemType Directory -Force -Path "app\static\uploads" | Out-Null

# Set Flask environment variables
$env:FLASK_APP = "app.py"
$env:FLASK_ENV = "development"
$env:FLASK_DEBUG = 1

# Start Flask application
Write-Host "`nStarting Flask application..."
Write-Host "Press Ctrl+C to stop the server`n"
python app.py