@echo off
echo Preparing Campus Lost & Found for deployment...

cd "c:\Users\Dell\Documents\campus lost foundz\campus lost found z"

echo Initializing Git repository...
git init

echo Adding all files...
git add .

echo Committing files...
git commit -m "Initial commit for Campus Lost & Found deployment"

echo.
echo Git repository prepared!
echo.
echo Next steps:
echo 1. Create a new repository on GitHub named 'campus-lost-found'
echo 2. Copy the repository URL
echo 3. Run: git remote add origin [your-repo-url]
echo 4. Run: git push -u origin main
echo 5. Go to render.com and deploy from GitHub
echo.
pause