@echo off
cd /d "%~dp0"
echo Restoring clean original images...
py "%~dp0restore_original_images.py"
echo.
pause
