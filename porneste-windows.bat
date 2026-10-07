@echo off
chcp 65001 >nul
title Cesarini - server local
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js nu este instalat. Descarca versiunea LTS de pe https://nodejs.org si ruleaza din nou acest fisier.
  start https://nodejs.org
  pause
  exit /b 1
)
if not exist node_modules (
  echo  Instalez dependintele (doar prima data, 1-2 minute)...
  call npm install
)
echo.
echo  Cesarini porneste pe http://localhost:3000  (inchide fereastra ca sa opresti serverul)
start "" http://localhost:3000
call npm run dev
