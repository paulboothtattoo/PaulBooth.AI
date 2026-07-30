@echo off
cd /d "%~dp0"
echo Installing Pillow if needed...
py -m pip install pillow
echo.
echo Running PaulBooth.ai Watermarker V2...
py "%~dp0watermark_images_v2.py"
echo.
pause
