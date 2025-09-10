# Start local MongoDB via docker-compose and then start the frontend + backend dev servers
Write-Host "Starting local MongoDB (docker-compose up -d)..."
docker-compose up -d

Write-Host "Starting dev servers (npm run dev)..."
npm run dev
