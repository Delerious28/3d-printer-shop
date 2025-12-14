@echo off
cd /d "c:\Users\beaum\Desktop\Code\3D printer Webshop\3d-printer-shop"
call npm install --legacy-peer-deps
call npx prisma generate
echo Done!
pause
