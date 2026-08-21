@echo off
setlocal
cd /d "%~dp0"
title Preview NavBar Services Pixel Perfect
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo [ERREUR] Node.js n'est pas installe ou n'est pas dans le PATH.
  echo Installe Node.js LTS puis relance START.bat.
  echo.
  pause
  exit /b 1
)

set NEED_INSTALL=0
if not exist node_modules\react set NEED_INSTALL=1
if not exist node_modules\react-dom set NEED_INSTALL=1
if not exist node_modules\framer-motion set NEED_INSTALL=1
if not exist node_modules\vite set NEED_INSTALL=1

if "%NEED_INSTALL%"=="1" (
  echo Installation des dependances de preview...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo [ERREUR] npm install a echoue.
    echo Verifie ta connexion Internet puis relance START.bat.
    pause
    exit /b 1
  )
)

echo.
echo Lancement de la preview... Ne ferme pas cette fenetre.
call npm run dev
if errorlevel 1 pause
