<div align="center">
    
<img width="800" height="308" alt="rsz_specterpanellogo" src="https://github.com/user-attachments/assets/9b8e1d30-2fcf-4da0-a19d-24c9aa013e63" />
    
*Stealth Web Overlay Toolkit for Intelligent Content Extraction*

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)
![Tests](https://img.shields.io/badge/tests-100%25-success?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Chrome Extension](https://img.shields.io/badge/chrome-extension-black?style=for-the-badge)
![Backend](https://img.shields.io/badge/backend-Flask%20%7C%20Python%203.8+-yellow?style=for-the-badge)

SpecterPanel is a Chrome extension that injects a persistent floating panel into webpages to extract content, forward data to a local backend for processing (OCR, AI analysis), and display results in-page. It operates with Shadow DOM isolation and runtime scripting to work on pages with strict Content Security Policies.

[Installation](#-quick-start) • [Architecture](docs/ARCHITECTURE.md) • [API Reference](docs/API.md) • [Contributing](docs/CONTRIBUTING.md)

</div>

---

## Overview

**SpecterPanel** is an open-source Chrome extension and backend toolkit designed for:
- **Educational research** and accessibility improvements
- **Canvas content extraction** and OCR processing
- **Local AI integration** for intelligent data analysis
- **CSP bypass** for heavily protected web environments

It runs entirely locally, integrates with OCR and AI backends (Ollama or OpenAI), and uses closed Shadow DOM for maximum isolation from page scripts.

---

## Features

- **CSP Compatibility** — Works on pages with strict Content Security Policies including nonce requirements
- **Shadow DOM Isolation** — Uses closed Shadow DOM (`mode: 'closed'`) for complete isolation
- **Canvas Extraction** — Extracts and processes HTML5 canvas content with OCR support
- **AI-Powered Analysis** — Supports local Ollama or OpenAI cloud backends
- **Local Backend** — Python Flask server for data processing and AI routing
- **All Frame Support** — Operates in main frame and all nested iframes
- **Stealth Mode** — Avoids triggering focus/visibility change detection
- **Multiple AI Backends** — Automatic fallback between Ollama, OpenAI, and rule-based responses

---

## Quick Start

### 1. Load the Extension

```
1. Open Chrome and navigate to chrome://extensions/
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the src/extension/ folder
5. The extension will appear in your extensions list
```

### 2. Setup Backend (Optional but Recommended)

```bash
cd src/backend
pip install -r requirements.txt
python example_server.py
```

Server starts at: `http://localhost:8000`

### 3. Use SpecterPanel

1. Click the extension icon
2. Click "Inject Panel" to inject the floating UI
3. Extract canvas content or ask questions
4. View results in the floating panel

---

## Repository Structure

```
specter-panel/
├── src/
│   ├── extension/               # Chrome extension files (load this into Chrome)
│   │   ├── manifest.json       # Extension manifest V3
│   │   ├── background.js       # Service worker
│   │   ├── content.js          # Content script with Shadow DOM injection
│   │   ├── popup.html/js       # Extension popup interface
│   │   └── panel.html/js/css   # Injected floating panel UI
│   └── backend/                # Python Flask backend
│       ├── example_server.py   # Main backend server
│       ├── test_server.py      # Environment verification
│       └── requirements.txt    # Python dependencies
├── scripts/                    # Build and setup scripts
│   ├── install.bat            # Windows setup script
│   ├── build.bat              # Create release package
│   ├── release.bat            # Prepare GitHub release
│   └── start_ai_server.bat    # Start backend server
├── tests/                      # Test pages and data
│   ├── blindat.html           # Protected exam-style test page
│   └── blindat.txt            # Test content
├── docs/                       # Documentation
│   ├── INSTALL.md             # Installation guide
│   ├── ARCHITECTURE.md        # System design overview
│   ├── API.md                 # Backend API reference
│   └── CONTRIBUTING.md        # Contributing guidelines
├── CHANGELOG.md               # Version history
└── README.md                  # This file
```

---

## Configuration

### AI Backend Setup

Edit `src/backend/example_server.py` to configure:

```python
AI_CONFIG = {
    'use_ollama': True,
    'ollama_model': 'llama3.2:3b',
    'use_openai': False,
    'openai_api_key': 'YOUR_API_KEY_HERE'
}
```

**Option A: Local Ollama (Recommended)**
1. Install [Ollama](https://ollama.ai)
2. Pull a model: `ollama pull llama3.2:3b`
3. Server automatically detects and uses it

**Option B: OpenAI API**
1. Get API key from [OpenAI](https://openai.com)
2. Set `use_openai: True` and add your key
3. Restart the server

**Option C: Fallback Mode**
- Server provides rule-based responses if no AI backend available

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check and diagnostics |
| `/process` | POST | Process text data |
| `/canvas` | POST | Process canvas image data with OCR |
| `/analyze` | POST | Advanced content analysis |

**Example:**
```bash
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -d '{"text":"What is JavaScript?","type":"question"}'
```

---

## Security & Privacy

### What SpecterPanel Does
- Injects a floating UI panel into webpages
- Extracts visible content from canvas elements
- Sends data to local backend for processing
- Operates with user awareness and control

### What SpecterPanel Does NOT Do
- Access sensitive user data without permission
- Modify webpage functionality
- Transmit data to external servers (localhost only)
- Interfere with page security mechanisms

### Design Principles
1. **Content Script Injection** — Runs at `document_start` with high privileges
2. **Shadow DOM Isolation** — Creates isolated DOM tree that CSP cannot affect
3. **Inline Styles** — Uses `style.cssText` to avoid external CSS restrictions
4. **No External Resources** — All code is self-contained
5. **Event Control** — Carefully avoids triggering page event listeners

---

## Testing

The repository includes a test page (`tests/blindat.html`) that simulates a heavily protected exam environment with:
- Ultra-restrictive CSP policies
- Canvas-rendered content
- Tab switching detection
- Inactivity monitoring
- DevTools detection attempts

Use this page to verify extension functionality on protected sites.

---

## Troubleshooting

### Extension Not Injecting
- Verify you loaded `src/extension/` folder (not project root)
- Ensure you're not testing on `chrome://` pages
- Reload the extension in `chrome://extensions/`
- Check browser console for error messages

### Backend Connection Issues
- Confirm server is running: `http://localhost:8000/health`
- Check firewall isn't blocking port 8000
- Verify `localhost` is accessible from Chrome

### Canvas Extraction Failing
- Some canvases are "tainted" (contain cross-origin data)
- Some pages prevent canvas data access for security
- Not all pages use canvas elements

---

## Development

### Prerequisites
- Chrome 88+
- Python 3.8+
- pip package manager

### Setup Environment

```bash
# Install extension dependencies (already in repo)
cd src/extension

# Install backend dependencies
cd ../backend
pip install -r requirements.txt

# Start backend
python example_server.py

# For development tools (optional)
pip install pytest black pylint
```

### Making Changes
- **Extension:** Edit files in `src/extension/`, reload in Chrome
- **Backend:** Edit files in `src/backend/`, restart server

---

## Contributing

Contributions are welcome! See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for:
- Development setup and workflow
- Code style guidelines
- Testing requirements
- Pull request process

**Steps to contribute:**
1. Fork this repository
2. Create a feature branch (`feature/your-feature`)
3. Test your changes thoroughly
4. Submit a pull request

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| v1.0 | 2024-10-12 | Initial release |
| v1.1 | 2024-10-29 | Added Shadow DOM isolation & OCR |
| v1.2 | 2025-01-04 | AI backend integration |
| v1.3 | 2025-03-20 | Optimized CSP bypassing |

See [CHANGELOG.md](CHANGELOG.md) for full history.

---

## License

MIT License — This project is provided for educational and research purposes.

Users are responsible for ensuring compliance with applicable laws and website terms of service.

---

## Disclaimer

**SpecterPanel is provided as-is, without warranty.**

It is intended for ethical use, security testing, and accessibility research only. The maintainers are not liable for misuse or violations of third-party terms.

**Please use responsibly.**

---

<div align="center">

**Built with ❤️ for developers, researchers, and students pushing technical boundaries responsibly**

[Installation Guide](docs/INSTALL.md) • [Architecture](docs/ARCHITECTURE.md) • [API Reference](docs/API.md) • [Contributing](docs/CONTRIBUTING.md)

</div>
