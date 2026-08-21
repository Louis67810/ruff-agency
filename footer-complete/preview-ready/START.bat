@echo off
setlocal
cd /d "%~dp0"
echo.
echo ========================================
echo   FOOTER - PREVIEW REACT
echo ========================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js n'est pas installe.
  echo Installe Node.js LTS puis relance START.bat.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installation des dependances de preview...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERREUR] npm install a echoue.
    pause
    exit /b 1
  )
)
echo Lancement de la preview...
echo Ne ferme pas cette fenetre pendant la preview.
call npm run dev
if errorlevel 1 (
  echo.
  echo [ERREUR] La preview s'est arretee.
  pause
)
