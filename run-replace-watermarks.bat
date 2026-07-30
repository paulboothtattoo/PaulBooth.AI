@echo off
cd /d "%~dp0"
echo Installing Pillow if needed...
py -m pip install pillow
echo.
echo Replacing old site watermarks with the new horned-skull watermark...
py "%~dp0replace_site_watermarks.py"
echo.
pause
