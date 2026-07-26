$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$backendPython = Join-Path $projectRoot 'backend\.venv\Scripts\python.exe'
$frontendDirectory = Join-Path $projectRoot 'frontend'
$frontendModules = Join-Path $frontendDirectory 'node_modules'

if (-not (Test-Path -LiteralPath $backendPython)) {
    throw 'Backend environment is missing. Create backend\.venv and install backend\requirements.txt first.'
}

if (-not (Test-Path -LiteralPath $frontendModules)) {
    throw 'Frontend dependencies are missing. Run npm install in the frontend directory first.'
}

$backendProcess = $null
$frontendAlreadyRunning = $false

try {
    $frontendResponse = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:3000/' -TimeoutSec 1
    $frontendAlreadyRunning = $frontendResponse.StatusCode -eq 200
} catch {
    $frontendAlreadyRunning = $false
}

try {
    Write-Host 'Starting Sentinel AI backend on http://localhost:8000 ...'
    $backendProcess = Start-Process `
        -FilePath $backendPython `
        -ArgumentList '-m', 'uvicorn', 'backend.app.main:app', '--host', '127.0.0.1', '--port', '8000' `
        -WorkingDirectory $projectRoot `
        -WindowStyle Hidden `
        -PassThru

    $backendReady = $false
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        try {
            $response = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:8000/' -TimeoutSec 1
            if ($response.StatusCode -eq 200) {
                $backendReady = $true
                break
            }
        } catch {
            Start-Sleep -Milliseconds 500
        }
    }

    if (-not $backendReady) {
        throw 'Backend did not become ready on port 8000.'
    }

    if ($frontendAlreadyRunning) {
        Write-Host 'Backend ready. The dashboard is already running on http://localhost:3000.'
        Write-Host 'Press Ctrl+C to stop the backend started by this script.'
        Wait-Process -Id $backendProcess.Id
    } else {
        Write-Host 'Backend ready. Starting dashboard on http://localhost:3000 ...'
        Push-Location $frontendDirectory
        npm run dev
    }
} finally {
    if ((Get-Location).Path -eq $frontendDirectory) {
        Pop-Location
    }

    if ($backendProcess -and -not $backendProcess.HasExited) {
        Stop-Process -Id $backendProcess.Id -Force
        Write-Host 'Sentinel AI backend stopped.'
    }
}
