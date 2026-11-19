@echo off
set PATH=C:\Program Files\nodejs;%PATH%
call node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" ci --no-audit --no-fund
exit /b %ERRORLEVEL%
