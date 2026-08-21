@echo off
setlocal
cd /d "%~dp0"
title Benefits Preview Launcher

echo ========================================
echo   SECTION BENEFICES - PREVIEW ISOLEE
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js n'est pas installe ou n'est pas dans le PATH.
  echo Installe Node.js puis relance ce fichier.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installation des dependances de la preview...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo [ERREUR] npm install a echoue.
    pause
    exit /b 1
  )
)

echo Lancement sur http://127.0.0.1:4173
start "Benefits Preview Server" cmd /k "cd /d ""%~dp0"" && npm run dev"
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:4173"
exit /b 0
