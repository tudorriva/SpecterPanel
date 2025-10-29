@echo off
REM Build script for SpecterPanel Chrome Extension
REM Creates a release package ready for distribution

setlocal enabledelayedexpansion

echo.
echo =====================================================
echo  SpecterPanel - Build Script
echo =====================================================
echo.

REM Get version from manifest.json
for /f "tokens=*" %%a in ('findstr "version" src\extension\manifest.json ^| findstr /o ":" ^| cut -d: -f1') do (
    set version=%%a
)

REM Parse version more carefully
powershell -Command "& {$manifest = Get-Content 'src\extension\manifest.json' | ConvertFrom-Json; Write-Host $manifest.version}" > temp_version.txt
set /p BUILD_VERSION=<temp_version.txt
del temp_version.txt

if "!BUILD_VERSION!"=="" (
    set BUILD_VERSION=1.1.0
)

echo [INFO] Building version: !BUILD_VERSION!
echo.

REM Create dist folder structure
echo [STEP 1] Creating distribution directories...
if not exist dist mkdir dist
if not exist "dist\specter-panel-!BUILD_VERSION!" mkdir "dist\specter-panel-!BUILD_VERSION!"

echo [DONE] Distribution directories created
echo.

REM Copy extension files
echo [STEP 2] Copying extension files...
xcopy /E /I /Y src\extension "dist\specter-panel-!BUILD_VERSION!\extension" >nul
if %errorlevel% neq 0 (
    echo [ERROR] Failed to copy extension files
    pause
    exit /b 1
)
echo [DONE] Extension files copied
echo.

REM Copy backend files
echo [STEP 3] Copying backend files...
xcopy /E /I /Y src\backend "dist\specter-panel-!BUILD_VERSION!\backend" >nul
if %errorlevel% neq 0 (
    echo [ERROR] Failed to copy backend files
    pause
    exit /b 1
)
echo [DONE] Backend files copied
echo.

REM Copy documentation
echo [STEP 4] Copying documentation...
xcopy /E /I /Y docs "dist\specter-panel-!BUILD_VERSION!\docs" >nul
copy README.md "dist\specter-panel-!BUILD_VERSION!\" >nul
copy CHANGELOG.md "dist\specter-panel-!BUILD_VERSION!\" >nul
copy LICENSE "dist\specter-panel-!BUILD_VERSION!\" >nul 2>&1
echo [DONE] Documentation copied
echo.

REM Create installation script
echo [STEP 5] Creating installation script...
(
    echo @echo off
    echo REM SpecterPanel Installation Script - v!BUILD_VERSION!
    echo REM This script sets up the extension and backend
    echo.
    echo echo Installation directory: %%~dp0
    echo echo Extension location: %%~dp0extension\
    echo echo Backend location: %%~dp0backend\
    echo echo Documentation location: %%~dp0docs\
    echo.
    echo cd backend
    echo pip install -r requirements.txt
    echo cd ..
    echo.
    echo echo.
    echo echo Setup complete^!
    echo echo To load the extension:
    echo echo  1. Open chrome://extensions/
    echo echo  2. Enable Developer mode
    echo echo  3. Click "Load unpacked"
    echo echo  4. Select the "extension" folder
    echo echo.
    echo pause
) > "dist\specter-panel-!BUILD_VERSION!\INSTALL.bat"

echo [DONE] Installation script created
echo.

REM Create README for release
echo [STEP 6] Creating release README...
(
    echo # SpecterPanel v!BUILD_VERSION!
    echo.
    echo ## Quick Start
    echo.
    echo 1. Extract this archive
    echo 2. Read INSTALL.md for detailed instructions
    echo 3. Load "extension" folder into Chrome
    echo 4. Start "backend" server for AI features
    echo.
    echo ## Contents
    echo.
    echo - extension/ - Chrome extension files (load this into Chrome^)
    echo - backend/ - Python backend server
    echo - docs/ - Complete documentation
    echo - README.md - Project overview
    echo - CHANGELOG.md - Version history
    echo - INSTALL.bat - Setup script
    echo.
    echo ## Documentation
    echo.
    echo Read these in order:
    echo 1. README.md - Overview and features
    echo 2. docs/INSTALL.md - Installation guide
    echo 3. docs/ARCHITECTURE.md - How it works
    echo 4. docs/API.md - Backend API reference
    echo 5. docs/CONTRIBUTING.md - How to contribute
    echo.
) > "dist\specter-panel-!BUILD_VERSION!\RELEASE_README.txt"

echo [DONE] Release README created
echo.

REM Create ZIP archive (using PowerShell)
echo [STEP 7] Creating ZIP archive...
powershell -Command "& {Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('dist\specter-panel-!BUILD_VERSION!', 'dist\specter-panel-!BUILD_VERSION!.zip')}"

if exist "dist\specter-panel-!BUILD_VERSION!.zip" (
    echo [DONE] ZIP archive created
) else (
    echo [WARNING] ZIP archive creation failed. Folder is available at dist\specter-panel-!BUILD_VERSION!\
)

echo.
echo =====================================================
echo  Build Complete
echo =====================================================
echo.
echo Build output: dist\specter-panel-!BUILD_VERSION!
echo Archive: dist\specter-panel-!BUILD_VERSION!.zip
echo.
echo Next steps:
echo  1. Test the extension on various websites
echo  2. Verify backend functionality
echo  3. Create GitHub release with the ZIP file
echo  4. Update CHANGELOG with release notes
echo.
pause
