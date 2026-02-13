@echo off
REM PersonaLens Backend Runner Script for Windows
REM This script helps you quickly start the backend development server

echo ========================================
echo   PersonaLens Backend Startup Script
echo ========================================
echo.

REM Check if we're in the correct directory
if not exist "requirements.txt" (
    echo [ERROR] requirements.txt not found!
    echo Please run this script from the personalens-backend directory
    echo.
    echo   cd personalens-backend
    echo   run_backend.bat
    pause
    exit /b 1
)

echo [Step 1] Checking MongoDB...
REM Check if MongoDB is running
docker ps | findstr mongodb > nul
if %ERRORLEVEL% == 0 (
    echo [OK] MongoDB is already running
) else (
    echo [INFO] MongoDB not found. Starting MongoDB with Docker...
    
    REM Check if container exists but is stopped
    docker ps -a | findstr mongodb > nul
    if %ERRORLEVEL% == 0 (
        echo Starting existing MongoDB container...
        docker start mongodb
    ) else (
        echo Creating new MongoDB container...
        docker run -d -p 27017:27017 --name mongodb -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:7
    )
    
    echo [OK] MongoDB started successfully
    timeout /t 2 > nul
)
echo.

echo [Step 2] Setting up Python environment...
REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo [OK] Virtual environment created
) else (
    echo [OK] Virtual environment already exists
)
echo.

echo [Step 3] Activating virtual environment...
call venv\Scripts\activate.bat
echo [OK] Virtual environment activated
echo.

echo [Step 4] Installing dependencies...
if not exist "venv\.installed" (
    echo Installing Python packages...
    pip install -r requirements.txt
    type nul > venv\.installed
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies already installed (delete venv\.installed to reinstall)
)
echo.

echo [Step 5] Checking environment configuration...
if not exist ".env" (
    echo Copying .env.example to .env...
    copy .env.example .env > nul
    echo [OK] Environment file created
    echo [INFO] You can edit .env to customize configuration
) else (
    echo [OK] Environment file exists
)
echo.

echo [Step 6] Starting FastAPI backend...
echo.
echo ================================================
echo   Backend is starting!
echo ================================================
echo.
echo Access points:
echo   API:              http://localhost:8000
echo   API Docs:         http://localhost:8000/docs
echo   Health Check:     http://localhost:8000/health
echo.
echo Press Ctrl+C to stop the server
echo.

REM Run uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
