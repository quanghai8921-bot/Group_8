# Test script to verify ShopeeFood API endpoints

Write-Host "================================" -ForegroundColor Green
Write-Host "ShopeeFood API Test" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Test 1: Get all foods
Write-Host "[TEST 1] GET /api/foods (All Available Foods)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4040/api/foods" -Method GET -ContentType "application/json" -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($data | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ FAILED: $($_)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Get user by ID (should fail - no data)
Write-Host "[TEST 2] GET /api/users/USER001 (Get User)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4040/api/users/USER001" -Method GET -ContentType "application/json" -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($data | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️ EXPECTED ERROR: $($_)" -ForegroundColor Yellow
}
Write-Host ""

# Test 3: Register a new user
Write-Host "[TEST 3] POST /api/users/register (Create New User)" -ForegroundColor Yellow
$registerPayload = @{
    userId = "USER001"
    fullName = "John Doe"
    birthDate = "1990-05-15"
    phoneNumber = "0912345678"
    email = "john@example.com"
    passwords = "password123"
    addressDelivery = "123 Main Street"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:4040/api/users/register" -Method POST -Body $registerPayload -ContentType "application/json" -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($data | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ FAILED: $($_)" -ForegroundColor Red
}
Write-Host ""

Write-Host "================================" -ForegroundColor Green
Write-Host "Tests Completed" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
