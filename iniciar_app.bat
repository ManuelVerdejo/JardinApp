@echo off
title Mi Huerto - JardinApp
echo ===================================================
echo           Iniciando Mi Huerto (JardinApp)          
echo ===================================================
echo.

cd /d "%~dp0"

:: Verificar si node_modules existe; si no, instalar dependencias
if not exist "node_modules\" (
    echo [1/3] Instalando dependencias necesarias...
    call npm.cmd install
    if %errorlevel% neq 0 (
        echo [ERROR] Hubo un problema al instalar dependencias.
        pause
        exit /b %errorlevel%
    )
)

echo [2/3] Abriendo la aplicacion en tu navegador...
:: Esperar 2 segundos y abrir la URL por defecto en el navegador predeterminado
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5173"

echo [3/3] Iniciando el servidor Vite...
echo.
echo Para cerrar la aplicacion, cierra esta ventana.
echo.

call npm.cmd run dev -- --open
pause
