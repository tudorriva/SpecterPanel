# Installation Guide

## Prerequisites

- **Chrome Browser** (version 88+)
- **Python** (3.8+) - for backend server only
- **pip** - Python package manager

## Quick Installation

### 1. Install the Chrome Extension

#### From File (Development)
1. Download and extract this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right)
4. Click **"Load unpacked"**
5. Select the `src/extension/` folder
6. The extension will appear in your extensions list

#### From Release (When Published)
1. Download the `.crx` file from releases
2. Drag and drop into `chrome://extensions/`

### 2. Set Up the Backend Server (Optional)

The backend server is required for:
- AI-powered question answering
- Canvas content extraction and OCR
- Advanced data analysis

#### Installation Steps

```cmd
# Navigate to backend directory
cd src\backend

# Install Python dependencies
pip install -r requirements.txt

# Verify installation
python test_server.py

# Start the server
python example_server.py
```

The server will start on `http://localhost:8000`

### 3. Configure AI Backend (Optional)

The system supports multiple AI backends:

#### Option A: Local Ollama (Recommended)
1. Install [Ollama](https://ollama.ai)
2. Pull a model: `ollama pull llama2`
3. Start Ollama (runs automatically)
4. Server will auto-detect and use it

#### Option B: OpenAI API
1. Get an API key from [OpenAI](https://platform.openai.com)
2. Edit `src/backend/example_server.py`
3. Set your API key in the configuration
4. Restart the server

#### Option C: No AI Backend
The server provides rule-based responses as fallback

## Automated Installation Scripts

### Windows Installation Script

For automatic setup on Windows:

```cmd
cd scripts
install.bat
```

This script will:
- Check Python installation
- Install dependencies
- Check for optional Tesseract OCR
- Optionally start the backend server

### Server Startup Script

Quick server startup:

```cmd
cd scripts
start_ai_server.bat
```

## Troubleshooting

### Extension Not Loading
- Ensure you're loading `src/extension/` (not the root)
- Check that manifest.json is in that folder
- Try reloading the extension

### Backend Connection Issues
- Verify server is running on `localhost:8000`
- Check firewall settings
- Test health endpoint: `http://localhost:8000/health`

### Python Dependency Errors
- Ensure Python 3.8+ is installed
- Run: `pip install --upgrade pip`
- Reinstall dependencies: `pip install -r src/backend/requirements.txt`

### Tesseract OCR Not Found (Optional Warning)
- OCR functionality is optional
- Download from: https://github.com/UB-Mannheim/tesseract/wiki
- Add to system PATH after installation

## File Structure

```
stealth-ai-chrome/
├── src/
│   ├── extension/          # Chrome extension files
│   │   ├── manifest.json
│   │   ├── background.js
│   │   ├── content.js
│   │   ├── popup.html
│   │   ├── popup.js
│   │   ├── panel.html
│   │   ├── panel.js
│   │   └── panel.css
│   └── backend/            # Python backend
│       ├── example_server.py
│       ├── test_server.py
│       └── requirements.txt
├── scripts/                # Utility scripts
│   ├── install.bat
│   └── start_ai_server.bat
├── tests/                  # Test pages
│   ├── blindat.html
│   └── blindat.txt
├── docs/                   # Documentation
└── dist/                   # Release packages
```

## Next Steps

After installation:

1. **Load the extension** into Chrome (see "Install the Chrome Extension" above)
2. **Start the backend** (optional but recommended)
3. **Test the extension** on any webpage
4. **Read documentation** in `docs/` folder for detailed usage

## Support

- Check `README.md` for overview
- Check `docs/` folder for detailed guides
- Review test pages in `tests/` for examples
- Check browser console for error messages

## Uninstallation

### Chrome Extension
1. Go to `chrome://extensions/`
2. Find "Stealth Injector"
3. Click the trash icon

### Backend Server
```cmd
pip uninstall flask flask-cors pillow pytesseract requests openai
```
