@echo off
setlocal
cd /d "%~dp0"
title Preview - Section Avis + Mission

echo.
echo ==============================================
echo   SECTION AVIS + MISSION - PREVIEW AUTONOME
echo ==============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js n'est pas installe ou n'est pas dans le PATH.
  echo Installe Node.js puis relance ce fichier.
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] npm est introuvable.
  echo Reinstalle Node.js avec npm puis relance ce fichier.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
  echo [1/2] Installation des dependances...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo [ERREUR] npm install a echoue.
    echo La fenetre reste ouverte pour lire le message exact.
    echo.
    pause
    exit /b 1
  )
) else (
  echo [1/2] Dependances deja installees.
)

echo [2/2] Lancement de la preview...
echo Le navigateur sera ouvert par Vite sur LE BON PORT.
echo Ne ferme pas cette fenetre tant que tu regardes la preview.
echo.

call npm run dev -- --host 127.0.0.1 --port 4173 --open

if errorlevel 1 (
  echo.
  echo [ERREUR] Le serveur de preview s'est arrete avec une erreur.
  pause
  exit /b 1
)

echo.
echo Le serveur s'est arrete. Appuie sur une touche pour fermer.
pause >nul
