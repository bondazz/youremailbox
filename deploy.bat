@echo off
SETLOCAL EnableDelayedExpansion

echo.
echo ========================================
echo   Auto-Deploy to GitHub Script
echo ========================================
echo.

:: 1. Build checking
echo [1/3] Running Build Check...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed^! Please fix errors before deploying.
    pause
    exit /b %ERRORLEVEL%
)

:: 2. Git Status & Add
echo.
echo [2/3] Preparing files...
git add .

:: 3. Commit
set "commit_msg=Auto-deploy: %date% %time%"
echo [Commit Message]: !commit_msg!
git commit -m "!commit_msg!"

:: 4. Push
echo.
echo [3/3] Pushing to GitHub...
echo (If you are asked for a password/token, please enter it once.
echo It will be saved by Windows Credential Manager for next time.)
echo.

git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   DEPLOYMENT SUCCESSFUL^!
    echo ========================================
) else (
    echo.
    echo [ERROR] Push failed. Check your internet or GitHub permissions.
)

echo.
pause
