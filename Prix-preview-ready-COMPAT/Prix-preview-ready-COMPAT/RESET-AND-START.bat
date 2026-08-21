@echo off
setlocal
cd /d "%~dp0"
title Reset Preview Section Prix

echo Suppression de l'ancienne installation locale...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /q package-lock.json

echo.
echo Relancement avec le launcher compatible...
call START-PREVIEW.bat
endlocal
