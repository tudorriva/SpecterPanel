@echo off
REM Release helper script for Stealth Injector
REM This script helps prepare a release on GitHub

setlocal enabledelayedexpansion

echo.
echo =====================================================
echo  Stealth Injector - Release Helper
echo =====================================================
echo.

REM Get current version
for /f "tokens=*" %%a in ('powershell -Command "& {$manifest = Get-Content 'src\extension\manifest.json' | ConvertFrom-Json; Write-Host $manifest.version}"') do (
    set VERSION=%%a
)

echo Current version: !VERSION!
echo.

set /p NEW_VERSION="Enter new version (e.g., 1.1.0): "

if "!NEW_VERSION!"=="" (
    echo Error: Version cannot be empty
    pause
    exit /b 1
)

echo.
echo Preparing release for v!NEW_VERSION!...
echo.

REM Update manifest version
echo [STEP 1] Updating manifest.json...
powershell -Command "& {$manifest = Get-Content 'src\extension\manifest.json' | ConvertFrom-Json; $manifest.version = '!NEW_VERSION!'; $manifest | ConvertTo-Json -Depth 10 | Set-Content 'src\extension\manifest.json'}"
echo [DONE] Manifest updated
echo.

REM Run build script
echo [STEP 2] Building release package...
call scripts\build.bat
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo.

REM Create release notes template
echo [STEP 3] Creating release notes template...
(
    echo # Release v!NEW_VERSION!
    echo.
    echo ## What's New
    echo.
    echo - Feature 1: Description
    echo - Feature 2: Description
    echo - Bug fix 1: Description
    echo.
    echo ## Installation
    echo.
    echo 1. Download stealth-injector-!NEW_VERSION!.zip
    echo 2. Extract to a folder
    echo 3. Read INSTALL.md for setup instructions
    echo.
    echo ## Known Issues
    echo.
    echo - Known issue 1: Workaround
    echo.
    echo ## Upgrade Notes
    echo.
    echo - Migration instructions if needed
    echo.
    echo ## Contributors
    echo.
    echo Thanks to all contributors^!
    echo.
) > "dist\RELEASE_NOTES_v!NEW_VERSION!.md"

echo [DONE] Release notes template created at dist\RELEASE_NOTES_v!NEW_VERSION!.md
echo.

echo =====================================================
echo  Release Preparation Complete
echo =====================================================
echo.
echo Next steps:
echo.
echo 1. Edit dist\RELEASE_NOTES_v!NEW_VERSION!.md with actual changes
echo.
echo 2. Commit the changes:
echo    git add -A
echo    git commit -m "chore: prepare release v!NEW_VERSION!"
echo    git push origin main
echo.
echo 3. Create GitHub release:
echo    - Go to: https://github.com/tudorriva/stealth-ai-chrome/releases
echo    - Click "Draft a new release"
echo    - Tag: v!NEW_VERSION!
echo    - Title: Stealth Injector v!NEW_VERSION!
echo    - Description: Use content from dist\RELEASE_NOTES_v!NEW_VERSION!.md
echo    - Upload: dist\stealth-injector-!NEW_VERSION!.zip
echo    - Publish release
echo.
echo 4. Verify release:
echo    - Test downloaded extension
echo    - Verify backend functionality
echo    - Check documentation
echo.
pause
