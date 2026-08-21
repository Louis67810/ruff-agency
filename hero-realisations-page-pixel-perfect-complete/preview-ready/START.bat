@echo off
setlocal
cd /d "%~dp0"
title Hero Realisations - Preview

echo ===============================================
echo       HERO REALISATIONS - PREVIEW
echo ===============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js n'est pas installe sur ce PC.
  echo Installe Node.js puis relance START.bat.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
  echo Premier lancement : installation des dependances...
  echo Cela peut prendre un petit moment.
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERREUR] npm install a echoue.
    echo Copie le message affiche ci-dessus si tu veux que je le corrige.
    pause
    exit /b 1
  )
)

echo.
echo Lancement de la preview...
echo Le navigateur va s'ouvrir automatiquement sur le bon port.
echo Ne ferme pas cette fenetre tant que tu regardes la preview.
echo.
call npm run dev

if errorlevel 1 (
  echo.
  echo [ERREUR] Le serveur Vite s'est arrete avec une erreur.
  pause
)
