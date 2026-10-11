$health = Invoke-RestMethod -Uri "http://localhost:8080/api/health"
Write-Host "1. Health Status:" ($health | ConvertTo-Json -Compress)

$loginBody = '{"email":"aditya.verma@college.edu","password":"password123"}'
$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
Write-Host "2. Login User:" $loginRes.name
$token = $loginRes.token
$headers = @{ "Authorization" = "Bearer $token" }

$dash = Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard/summary" -Headers $headers
Write-Host "3. Dashboard Summary:"
Write-Host "   - Total Products:" $dash.totalProducts
Write-Host "   - Active Warranties:" $dash.activeWarranties
Write-Host "   - Expiring Warranties:" $dash.expiringWarranties
Write-Host "   - Total Repair Expenses: Rs." $dash.totalRepairExpenses
Write-Host "   - Overall Repair Ratio:" $dash.overallRepairRatioPercent "%"

$prods = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Headers $headers
Write-Host "4. Products from MySQL: Count =" $prods.Count
foreach ($p in $prods) {
    Write-Host "   *" $p.name "[$($p.brand)] - Status:" $p.status ", Price: Rs." $p.price
}

$repairs = Invoke-RestMethod -Uri "http://localhost:8080/api/repairs/user" -Headers $headers
Write-Host "5. User Repairs Count:" $repairs.Count

$notifs = Invoke-RestMethod -Uri "http://localhost:8080/api/notifications" -Headers $headers
Write-Host "6. Notifications Count:" $notifs.Count
