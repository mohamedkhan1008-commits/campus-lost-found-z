$token = "rnd_wMIVI5mShRkYBLfIOwfwUqme5Sa0"
$repo = "campus-lost-found-z"

Write-Host "🔍 Finding deployment info for $repo..." -ForegroundColor Cyan

# Try to get services via Render API using a different endpoint
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    # List services - try with proper JSON response parsing
    $response = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Method GET -Headers $headers
    
    Write-Host "✓ API Response received" -ForegroundColor Green
    Write-Host "Response type: $($response.GetType())" -ForegroundColor White
    Write-Host "Full response: $($response | ConvertTo-Json)" -ForegroundColor White
    
} catch {
    Write-Host "✗ Error accessing Render API" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
    
    # Try alternative: check if webhook URL works
    Write-Host "`n🔄 Attempting webhook trigger..." -ForegroundColor Cyan
    
    $webhookUrl = "https://api.render.com/deploy/$repo"
    try {
        $webResponse = Invoke-WebRequest -Uri $webhookUrl -Method POST -Headers $headers
        Write-Host "✓ Webhook response: $($webResponse.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "Webhook attempt: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`n" -ForegroundColor White
Write-Host "📍 MANUAL ACTION: Go to https://dashboard.render.com" -ForegroundColor Yellow
Write-Host "   Then:" -ForegroundColor White
Write-Host "   1. Click on 'campus-lost-found-backend' service" -ForegroundColor White
Write-Host "   2. Scroll down and click 'Redeploy'" -ForegroundColor White
