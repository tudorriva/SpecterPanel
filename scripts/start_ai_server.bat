@echo off
echo Starting SpecterPanel Backend Server
echo.

echo Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python not found! Please install Python first.
    pause
    exit /b 1
)

echo.
echo Installing/verifying Python dependencies...
python -m pip install -r requirements.txt

echo.
echo Starting backend server on http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python example_server.py

pause
