@echo off
REM Reorganize repository: move Python backend files into server/ folder

if not exist server (
    mkdir server
    echo Created server\ folder
) else (
    echo server\ folder already exists
)

if exist example_server.py (
    move /Y example_server.py server\ >nul 2>&1 && echo Moved example_server.py to server\
)

if exist test_server.py (
    move /Y test_server.py server\ >nul 2>&1 && echo Moved test_server.py to server\
)

if exist requirements.txt (
    move /Y requirements.txt server\ >nul 2>&1 && echo Moved requirements.txt to server\
)

if exist start_ai_server.bat (
    move /Y start_ai_server.bat server\ >nul 2>&1 && echo Moved start_ai_server.bat to server\
)

echo.
echo Repository reorganization complete.
echo Note: extension files (background.js, content.js, popup.html, panel.html, blindat.html, etc.) remain in the repository root.
echo.
pause
