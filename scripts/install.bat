@echo off
echo.
echo =====================================================
echo  SpecterPanel - Installation Script
echo =====================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    echo.
    pause
    exit /b 1
)

echo [INFO] Python found
python --version

REM Check if pip is available
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] pip is not available
    echo Please ensure pip is installed with Python
    echo.
    pause
    exit /b 1
)

echo [INFO] pip found
echo.

REM Install Python dependencies
echo [STEP 1] Installing Python dependencies...
echo.

if exist server\requirements.txt (
    cd server
    pip install -r requirements.txt
    cd ..
) else (
    pip install -r requirements.txt
)

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies
    echo.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Python dependencies installed successfully
echo.

REM Check if Tesseract is available (optional)
echo [STEP 2] Checking for Tesseract OCR (optional)...
pytesseract --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Tesseract OCR not found
    echo OCR functionality will be limited
    echo To install Tesseract:
    echo 1. Download from: https://github.com/UB-Mannheim/tesseract/wiki
    echo 2. Install and add to PATH
    echo 3. Run this script again
) else (
    echo [SUCCESS] Tesseract OCR found and available
)

echo.
echo =====================================================
echo  Chrome Extension Setup Instructions
echo =====================================================
echo.
echo 1. Open Google Chrome
echo 2. Navigate to: chrome://extensions/
echo 3. Enable "Developer mode" (toggle in top-right)
echo 4. Click "Load unpacked"
echo 5. Select the src\extension\ folder
echo 6. The extension should appear in your extensions list
echo.
echo =====================================================
echo  Testing the Backend Server
echo =====================================================
echo.

set /p start_server="Do you want to start the backend server now? (y/n): "
if /i "%start_server%"=="y" (
    echo.
    echo [INFO] Starting backend server on http://localhost:8000
    echo [INFO] Press Ctrl+C to stop the server
    echo.
    if exist server\example_server.py (
        cd server
        python example_server.py
        cd ..
    ) else (
        python example_server.py
    )
) else (
    echo.
    echo [INFO] Backend server not started
    echo To start it later, run: python server\example_server.py
)

echo.
echo =====================================================
echo  Installation Complete!
echo =====================================================
echo.
echo Extension files are ready in: %~dp0
echo Backend files are in: %~dp0server
echo.
echo Next steps:
echo 1. Load the extension in Chrome (see instructions above)
echo 2. Start the backend server: python server\example_server.py
echo 3. Visit any webpage and click the extension icon
echo 4. Click "Inject Panel" to test the injection
echo.
echo For troubleshooting, check README.md
echo.
pause