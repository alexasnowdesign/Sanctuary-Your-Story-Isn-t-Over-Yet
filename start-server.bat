@echo off
REM Point and Click Game - Development Server Launcher

echo.
echo ========================================
echo Point and Click Game - Local Server
echo ========================================
echo.

REM Try to use Python
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starting server with Python...
    python -m http.server 8000
    goto end
)

REM Try to use Python3
python3 --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starting server with Python3...
    python3 -m http.server 8000
    goto end
)

REM Try to use Node.js
node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starting server with Node.js (http-server)...
    npx http-server
    goto end
)

REM No server found
echo.
echo ERROR: No suitable server found. Please install one of:
echo  - Python 3: https://www.python.org/downloads/
echo  - Node.js: https://nodejs.org/
echo.
echo Once installed, run this script again.
echo.

:end
pause
