@echo off
setlocal
cd /d "%~dp0"
title Preview Section Prix

echo.
echo ==========================================
echo      SECTION PRIX - PREVIEW COMPAT
echo ==========================================
echo.

where node.exe >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js n'est pas installe ou n'est pas dans le PATH.
  echo Installe Node.js puis relance ce fichier.
  echo.
  pause
  exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] npm.cmd n'est pas trouve.
  echo Reinstalle Node.js avec npm puis relance.
  echo.
  pause
  exit /b 1
)

echo Node detecte.
echo npm detecte.
echo.

if not exist "node_modules\.bin\vite.cmd" (
  echo Installation des dependances de la preview...
  echo Cela peut prendre une minute au premier lancement.
  echo.
  call npm.cmd install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo ==========================================
    echo [ERREUR] npm install a echoue.
    echo Le message exact est affiche au-dessus.
    echo ==========================================
    echo.
    pause
    exit /b 1
  )
)

echo.
echo Lancement de la preview...
echo Le navigateur va s'ouvrir sur :
echo http://127.0.0.1:5173
echo.
echo Garde cette fenetre ouverte pendant la preview.
echo Pour arreter : Ctrl+C.
echo.

start "" cmd /c "timeout /t 3 /nobreak >nul & start \"\" http://127.0.0.1:5173"
call npm.cmd run dev

echo.
echo ==========================================
echo Le serveur s'est arrete.
echo S'il y a une erreur, elle est au-dessus.
echo ==========================================
pause
endlocal
