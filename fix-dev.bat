@echo off
echo Cleaning old Next.js lock...
if exist .next\dev\lock (
  del /F /Q .next\dev\lock
)
echo Cleaning .next folder if corrupted...
if exist .next (
  echo OK
) else (
  mkdir .next
)

echo Starting Next.js on port 3000...
npm run dev -- -p 3000
