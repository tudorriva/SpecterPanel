@echo off
echo 🚀 Stealth Injector - Quick Start
echo.

echo Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ❌ Python not found! Please install Python first.
    pause
    exit /b 1
)

echo.
echo Installing Python dependencies...
python -m pip install -r requirements.txt

echo.
echo Testing server configuration...
python test_server.py

echo.
echo 🎉 Setup complete! 
echo.
echo To start the AI-powered backend server, run:
echo   python example_server.py
echo.
echo Then visit localhost:8000 to see the server status.
echo.
pause
