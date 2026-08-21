@echo off
setlocal
cd /d "%~dp0"
title Hero Content - Preview

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo [ERREUR] Node.js n'est pas installe ou n'est pas accessible dans le PATH.
  echo Installe Node.js puis relance START.bat.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\vite" (
  echo Installation des dependances de la preview...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERREUR] npm install a echoue.
    echo Copie le message ci-dessus si tu veux que je le corrige.
    echo.
    pause
    exit /b 1
  )
)

echo.
echo Lancement de la preview...
echo Ne ferme pas cette fenetre pendant que tu regardes la section.
echo.
call npm run dev

if errorlevel 1 (
  echo.
  echo [ERREUR] La preview s'est arretee avec une erreur.
  echo.
  pause
)
endlocal
