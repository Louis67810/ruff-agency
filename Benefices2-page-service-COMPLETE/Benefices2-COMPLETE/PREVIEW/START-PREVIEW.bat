@echo off
setlocal
cd /d "%~dp0"

echo.
echo ==========================================
echo   SECTION BENEFICES 2 - PREVIEW
echo ==========================================
echo.

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js / npm n'est pas installe sur ce PC.
  echo Installe Node.js LTS puis relance ce fichier.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installation des dependances de la preview...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERREUR] npm install a echoue.
    pause
    exit /b 1
  )
)

echo.
echo Ouverture de http://127.0.0.1:4173
echo Ferme cette fenetre pour arreter la preview.
echo.

start "" cmd /c "timeout /t 2 /nobreak >nul & start \"\" http://127.0.0.1:4173"
call npm run dev -- --host 127.0.0.1

endlocal
