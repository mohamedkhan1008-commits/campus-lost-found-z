$token = "rnd_wMIVI5mShRkYBLfIOwfwUqme5Sa0"
$repo = "campus-lost-found-z"

Write-Host "🔍 Attempting to trigger Render deployment..." -ForegroundColor Cyan

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Try using curl command instead
Write-Host "`n📡 Using curl to call Render API..." -ForegroundColor Cyan

$curlCmd = @"
curl -X GET https://api.render.com/v1/services `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -s
"@

Invoke-Expression $curlCmd
