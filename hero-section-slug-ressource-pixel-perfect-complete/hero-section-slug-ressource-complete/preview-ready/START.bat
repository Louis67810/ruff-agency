@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (
  echo Installation des dependances React/Vite...
  call npm install
  if errorlevel 1 (
    echo.
    echo ERREUR pendant npm install.
    pause
    exit /b 1
  )
)
echo Lancement de la preview...
call npx vite --host 127.0.0.1 --port 4173 --open
if errorlevel 1 pause
