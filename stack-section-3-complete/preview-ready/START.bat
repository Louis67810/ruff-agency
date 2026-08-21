@echo off
setlocal
cd /d "%~dp0"
title Stack Section 3 Preview

echo ==============================================
echo   Stack Section 3 - Preview autonome
echo ==============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js n'est pas installe ou n'est pas dans le PATH.
  echo Installe Node.js LTS puis relance ce fichier.
  pause
  exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
  echo Installation des dependances locales...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERREUR] npm install a echoue.
    echo Copie le message ci-dessus et envoie-le moi.
    pause
    exit /b 1
  )
)

echo.
echo Lancement de la preview...
echo Le navigateur va s'ouvrir automatiquement sur le bon port.
echo Ne ferme pas cette fenetre pendant la preview.
echo.
call npm run dev

if errorlevel 1 (
  echo.
  echo [ERREUR] Le serveur de preview s'est arrete.
  pause
)
