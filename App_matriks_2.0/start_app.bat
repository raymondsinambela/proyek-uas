
@echo off
title App Matriks 2.0

cd /d "%~dp0"

echo ====================================
echo       APP MATRIKS 2.0
echo ====================================
echo.
echo Menjalankan aplikasi...

start "App Matriks Server" /min cmd /c "cd /d ""%~dp0"" && python -m backend.app"

echo Menunggu server Flask...

:WAIT_SERVER
timeout /t 1 /nobreak >nul

powershell -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing http://127.0.0.1:5000/api/health -TimeoutSec 1; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"

if errorlevel 1 goto WAIT_SERVER

echo Aplikasi berhasil dijalankan!

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app=http://127.0.0.1:5000
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app=http://127.0.0.1:5000
) else (
    start "" http://127.0.0.1:5000
)

exit
