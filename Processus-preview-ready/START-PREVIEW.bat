@echo off
setlocal
cd /d "%~dp0"

echo.
echo ==========================================
echo   SECTION PROCESSUS - PREVIEW AUTONOME
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js n'est pas installe.
  echo Installe Node.js puis relance ce fichier.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installation des dependances...
  call npm install
  if errorlevel 1 (
    echo.
    echo Echec de npm install.
    pause
    exit /b 1
  )
)

echo.
echo Ouverture de http://127.0.0.1:4173
start "" http://127.0.0.1:4173
call npm run dev
