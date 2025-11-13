Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "All rogue Node.js processes killed."
