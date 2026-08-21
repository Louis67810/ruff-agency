@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js / npm n'est pas installe ou n'est pas dans le PATH.
  echo Installe Node.js puis relance START.bat.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installation des dependances de la preview...
  call npm install
  if errorlevel 1 (
    echo.
    echo Echec de npm install. Copie le message ci-dessus si tu veux que je le corrige.
    pause
    exit /b 1
  )
)

echo Lancement de la preview...
call npm run dev
if errorlevel 1 (
  echo.
  echo La preview n'a pas pu demarrer.
  pause
)
