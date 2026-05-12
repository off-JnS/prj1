# ============================================================
#  PRJ1 – Hostinger Deployment Setup
#  Run this once from the project root:
#    .\scripts\setup-hostinger.ps1
# ============================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path $PSScriptRoot -Parent
$PrivateKeyPath = Join-Path $RepoRoot 'hostinger_deploy_key'
$PublicKeyPath  = "$PrivateKeyPath.pub"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  PRJ1 – Hostinger Deployment Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Check SSH keys exist ──────────────────────────────────────────────
if (-not (Test-Path $PrivateKeyPath)) {
    Write-Host "[ERROR] SSH key not found at $PrivateKeyPath" -ForegroundColor Red
    Write-Host "Please run this from the project root folder." -ForegroundColor Red
    exit 1
}

$PublicKey = Get-Content $PublicKeyPath

# ── Step 2: gh auth check ─────────────────────────────────────────────────────
Write-Host "STEP 1 OF 3: Log in to GitHub" -ForegroundColor Yellow
Write-Host "-------------------------------------------------------"
$ghPath = (Get-Command gh -ErrorAction SilentlyContinue)?.Source
if (-not $ghPath) {
    Write-Host "[ERROR] GitHub CLI (gh) not found. Please restart your terminal after installation." -ForegroundColor Red
    exit 1
}

$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "You need to log in to GitHub. A browser window will open..." -ForegroundColor White
    gh auth login --web --git-protocol https
} else {
    Write-Host "Already logged in to GitHub." -ForegroundColor Green
}

# ── Step 3: Collect Hostinger details ─────────────────────────────────────────
Write-Host ""
Write-Host "STEP 2 OF 3: Enter your Hostinger details" -ForegroundColor Yellow
Write-Host "-------------------------------------------------------"
Write-Host "You can find these in hPanel -> Hosting -> Manage -> SSH Access" -ForegroundColor Gray
Write-Host ""

$HostingerHost = Read-Host "Server hostname or IP (e.g. srv123.hstgr.io)"
$HostingerUser = Read-Host "SSH username (e.g. u123456789)"
$HostingerPath = Read-Host "App path on server (e.g. /home/u123456789/prj1)"

# ── Step 4: Set GitHub Secrets ────────────────────────────────────────────────
Write-Host ""
Write-Host "Setting GitHub secrets..." -ForegroundColor White

$PrivateKeyContent = Get-Content $PrivateKeyPath -Raw

$HostingerHost    | gh secret set HOSTINGER_HOST    --repo off-JnS/prj1
$HostingerUser    | gh secret set HOSTINGER_USER    --repo off-JnS/prj1
$PrivateKeyContent | gh secret set HOSTINGER_SSH_KEY --repo off-JnS/prj1
$HostingerPath    | gh secret set HOSTINGER_APP_PATH --repo off-JnS/prj1

Write-Host "GitHub secrets set successfully." -ForegroundColor Green

# ── Step 5: Show public key ───────────────────────────────────────────────────
Write-Host ""
Write-Host "STEP 3 OF 3: Add the deploy key to Hostinger" -ForegroundColor Yellow
Write-Host "-------------------------------------------------------"
Write-Host "Copy the public key below and add it in:" -ForegroundColor White
Write-Host "  hPanel -> SSH Access -> Manage SSH Keys -> Add SSH Key" -ForegroundColor Gray
Write-Host ""
Write-Host $PublicKey -ForegroundColor Cyan
Write-Host ""
Write-Host "After adding the key on Hostinger, also run these commands" -ForegroundColor White
Write-Host "on the server via hPanel -> Terminal (or SSH):" -ForegroundColor White
Write-Host ""
Write-Host "  cd $HostingerPath" -ForegroundColor Gray
Write-Host "  git clone https://github.com/off-JnS/prj1.git ." -ForegroundColor Gray
Write-Host "  npm ci" -ForegroundColor Gray
Write-Host "  npm run build" -ForegroundColor Gray
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Setup complete! Every push to main will auto-deploy." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
