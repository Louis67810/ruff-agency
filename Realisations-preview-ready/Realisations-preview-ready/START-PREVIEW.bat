@echo off
setlocal
cd /d "%~dp0"

echo.
echo ===============================================
echo   SECTION REALISATIONS - PREVIEW AUTONOME
echo ===============================================
echo.

where npm >nul 2>&1
if errorlevel 1 (
  echo ERREUR: Node.js / npm n'est pas installe.
  echo Installe Node.js puis relance ce fichier.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installation des dependances de la preview...
  call npm install
  if errorlevel 1 (
    echo.
    echo L'installation a echoue.
    pause
    exit /b 1
  )
)

start "" http://127.0.0.1:4173
call npm run dev
endlocal
