@echo off
setlocal
cd /d "%~dp0"

echo.
echo ==============================================
echo       SECTION POINTS DE FOCUS - PREVIEW
echo ==============================================
echo.

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js / npm n'est pas installe.
  echo Installe Node.js LTS puis relance ce fichier.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installation des dependances...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo [ERREUR] npm install a echoue.
    pause
    exit /b 1
  )
)

echo.
echo Lancement de la preview sur http://127.0.0.1:4173
echo Ferme cette fenetre pour arreter la preview.
echo.

start "" cmd /c "timeout /t 2 /nobreak >nul & start \"\" http://127.0.0.1:4173"
call npm.cmd run dev -- --host 127.0.0.1

echo.
echo Le serveur s'est arrete.
pause
endlocal
