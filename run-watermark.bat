@echo off
cd /d "%~dp0"
echo Installing Pillow if needed...
py -m pip install pillow
echo.
echo Running watermark script...
py "%~dp0watermark_images.py"
echo.
pause
