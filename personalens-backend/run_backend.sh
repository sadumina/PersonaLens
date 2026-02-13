#!/bin/bash

# PersonaLens Backend Runner Script
# This script helps you quickly start the backend development server

set -e

echo "🚀 PersonaLens Backend Startup Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the correct directory
if [ ! -f "requirements.txt" ]; then
    echo -e "${RED}Error: requirements.txt not found!${NC}"
    echo "Please run this script from the personalens-backend directory"
    echo ""
    echo "  cd personalens-backend"
    echo "  ./run_backend.sh"
    exit 1
fi

echo -e "${BLUE}Step 1: Checking MongoDB...${NC}"
# Check if MongoDB is running
if docker ps | grep -q mongodb; then
    echo -e "${GREEN}✓ MongoDB is already running${NC}"
else
    echo -e "${YELLOW}MongoDB not found. Starting MongoDB with Docker...${NC}"
    
    # Check if container exists but is stopped
    if docker ps -a | grep -q mongodb; then
        echo "Starting existing MongoDB container..."
        docker start mongodb
    else
        echo "Creating new MongoDB container..."
        docker run -d -p 27017:27017 --name mongodb \
          -e MONGO_INITDB_ROOT_USERNAME=admin \
          -e MONGO_INITDB_ROOT_PASSWORD=password \
          mongo:7
    fi
    
    echo -e "${GREEN}✓ MongoDB started successfully${NC}"
    sleep 2  # Give MongoDB time to start
fi
echo ""

echo -e "${BLUE}Step 2: Setting up Python environment...${NC}"
# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
else
    echo -e "${GREEN}✓ Virtual environment already exists${NC}"
fi
echo ""

# Activate virtual environment
echo -e "${BLUE}Step 3: Activating virtual environment...${NC}"
source venv/bin/activate
echo -e "${GREEN}✓ Virtual environment activated${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}Step 4: Installing dependencies...${NC}"
if [ ! -f "venv/.installed" ]; then
    echo "Installing Python packages..."
    pip install -r requirements.txt
    touch venv/.installed
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed (use 'rm venv/.installed' to reinstall)${NC}"
fi
echo ""

# Setup environment file
echo -e "${BLUE}Step 5: Checking environment configuration...${NC}"
if [ ! -f ".env" ]; then
    echo "Copying .env.example to .env..."
    cp .env.example .env
    echo -e "${GREEN}✓ Environment file created${NC}"
    echo -e "${YELLOW}  → You can edit .env to customize configuration${NC}"
else
    echo -e "${GREEN}✓ Environment file exists${NC}"
fi
echo ""

# Start the backend
echo -e "${BLUE}Step 6: Starting FastAPI backend...${NC}"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Backend is starting!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Access points:"
echo -e "  ${BLUE}API:${NC}              http://localhost:8000"
echo -e "  ${BLUE}API Docs:${NC}         http://localhost:8000/docs"
echo -e "  ${BLUE}Health Check:${NC}     http://localhost:8000/health"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

# Run uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
