# PersonaLens Backend - Command Reference

## Quick Commands

### Start Backend (Easiest)
```bash
cd personalens-backend && ./run_backend.sh
```

### Start Everything with Docker
```bash
docker-compose up -d
```

### Check if Running
```bash
curl http://localhost:8000/health
```

### View API Documentation
Open in browser: http://localhost:8000/docs

### Stop Services
```bash
# If using Docker Compose
docker-compose down

# If running manually
Ctrl+C in terminal
```

### Common Development Commands
```bash
# Activate virtual environment
source personalens-backend/venv/bin/activate

# Install/Update dependencies
pip install -r personalens-backend/requirements.txt

# Run with specific port
uvicorn app.main:app --port 8001

# Run with debug logging
uvicorn app.main:app --log-level debug

# Check MongoDB status
docker ps | grep mongo
```

## Need More Help?

- **Quick Start**: See [QUICKSTART.md](QUICKSTART.md)
- **Visual Guide**: See [HOW_TO_RUN_BACKEND.txt](HOW_TO_RUN_BACKEND.txt)
- **Full Docs**: See [README.md](README.md)
- **Backend Docs**: See [personalens-backend/README.md](personalens-backend/README.md)
