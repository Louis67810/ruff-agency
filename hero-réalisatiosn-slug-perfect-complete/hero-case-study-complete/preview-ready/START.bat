@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (
  echo Installation des dependances...
  call npm install
  if errorlevel 1 (
    echo.
    echo ERREUR pendant npm install.
    pause
    exit /b 1
  )
)
call npx vite --host 127.0.0.1 --open
if errorlevel 1 pause
