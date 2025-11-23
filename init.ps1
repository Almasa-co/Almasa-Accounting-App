# Create .env from example
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.local.example frontend\.env.local

Write-Host "✅ Environment files created!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: Edit backend\.env file with your MySQL credentials!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit backend\.env with your database password"
Write-Host "2. Run: cd backend && npm install && npm run db:generate && npm run db:push && npm run db:seed"
Write-Host "3. Run: cd frontend && npm install"
Write-Host "4. Start backend: cd backend && npm run dev"
Write-Host "5. Start frontend: cd frontend && npm run dev"
Write-Host ""
Write-Host "See SETUP.md for detailed instructions"
