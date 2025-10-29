# SpecterPanel# Stealth Web Injector# Stealth Web Injector# 🥷 Stealth Web Injector



A Chrome extension that injects a persistent floating panel into webpages to extract content, forward data to a local backend for processing (OCR, AI analysis), and display results in-page. Operates with Shadow DOM isolation and runtime scripting to work on pages with strict Content Security Policies.



## Quick LinksA Chrome extension that injects a persistent floating UI into webpages to extract content, forward data to a local backend for processing (OCR, AI analysis), and display results in-page. Operates with Shadow DOM isolation and runtime scripting to work on pages with strict Content Security Policies.



- **Installation**: See [docs/INSTALL.md](docs/INSTALL.md)

- **Architecture**: See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

- **API Reference**: See [docs/API.md](docs/API.md)## Quick LinksA Chrome extension that injects a persistent floating UI into webpages to extract content, forward data to a local backend for processing (OCR, AI analysis), and display results in-page. Operates with Shadow DOM isolation and runtime scripting to work on pages with strict Content Security Policies.A Chrome extension designed to inject minimal, persistent floating UI elements into any webpage while avoiding detection, including heavily protected pages with strict Content Security Policies (CSP).

- **Contributing**: See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)

- **Changelog**: See [CHANGELOG.md](CHANGELOG.md)



## Features- **Installation**: See [docs/INSTALL.md](docs/INSTALL.md)



- **CSP Compatibility**: Works on pages with strict Content Security Policies including nonce requirements- **Architecture**: See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

- **Shadow DOM Isolation**: Uses closed shadow DOM for isolation from page scripts

- **Canvas Data Extraction**: Extracts content from HTML5 canvas elements- **API Reference**: See [docs/API.md](docs/API.md)## Features## 🎯 Features

- **AI-Powered Analysis**: Send questions and data to local backend for intelligent processing

- **OCR Integration**: Optional OCR processing for extracted canvas images- **Contributing**: See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)

- **Local Backend**: Communicates with local Python server (Flask-based)

- **Multiple AI Backends**: Supports Ollama (local), OpenAI API, and intelligent fallbacks- **Changelog**: See [CHANGELOG.md](CHANGELOG.md)

- **All Frames Support**: Works in main frame and all iframes



## Repository Structure

## Features- **CSP Compatibility**: Works on pages with strict Content Security Policies including nonce requirements- **CSP Bypass**: Works on pages with strict Content Security Policies including nonce requirements

```

specter-panel/

├── src/

│   ├── extension/          # Chrome extension files (load this into Chrome)- **CSP Compatibility**: Works on pages with strict Content Security Policies including nonce requirements- **Shadow DOM Isolation**: Uses closed shadow DOM for isolation from page scripts- **Shadow DOM Isolation**: Uses closed shadow DOM for maximum isolation from page scripts

│   │   ├── manifest.json   # Extension manifest V3

│   │   ├── background.js   # Service worker- **Shadow DOM Isolation**: Uses closed shadow DOM for isolation from page scripts

│   │   ├── content.js      # Content script

│   │   ├── popup.html/js   # Extension popup- **Canvas Data Extraction**: Extracts content from HTML5 canvas elements- **Canvas Data Extraction**: Extracts content from HTML5 canvas elements- **Canvas Data Extraction**: Extracts content from HTML5 canvas elements using `toDataURL()`

│   │   └── panel.html/js/css # Injected panel UI

│   └── backend/            # Python Flask backend- **AI-Powered Analysis**: Send questions and data to local backend for intelligent processing

│       ├── example_server.py  # Main server

│       ├── test_server.py     # Environment tests- **OCR Integration**: Optional OCR processing for extracted canvas images- **AI-Powered Analysis**: Send questions and data to local backend for intelligent processing- **AI-Powered Responses**: Ask questions and get intelligent AI responses 

│       └── requirements.txt   # Dependencies

├── scripts/                # Build and setup scripts- **Local Backend**: Communicates with local Python server (Flask-based)

│   ├── install.bat         # Setup script

│   ├── build.bat           # Build release package- **Multiple AI Backends**: Supports Ollama (local), OpenAI API, and intelligent fallbacks- **OCR Integration**: Optional OCR processing for extracted canvas images- **OCR Integration**: Optional OCR processing for extracted canvas images

│   ├── release.bat         # Prepare GitHub release

│   └── start_ai_server.bat # Start backend- **All Frames Support**: Works in main frame and all iframes

├── tests/                  # Test pages and data

│   ├── blindat.html        # Protected exam test page- **Local Backend**: Communicates with local Python server (Flask-based)- **Local Backend**: Communicates with local Python server for data processing

│   └── blindat.txt         # Test data

├── docs/                   # Comprehensive documentation## Repository Structure

│   ├── INSTALL.md          # Installation guide

│   ├── ARCHITECTURE.md     # System design- **Multiple AI Backends**: Supports Ollama (local), OpenAI API, and intelligent fallbacks- **Stealth Operation**: Avoids triggering `visibilitychange`, `blur`, or `focus` events

│   ├── API.md              # Backend API reference

│   └── CONTRIBUTING.md     # Contributing guidelines```

├── dist/                   # Release packages

├── CHANGELOG.md            # Version historystealth-ai-chrome/- **All Frames Support**: Works in main frame and all iframes- **No Focus Stealing**: Does not interfere with page focus or user interactions

├── README.md               # This file

└── .git/                   # Git repository├── src/

```

│   ├── extension/          # Chrome extension files (load this into Chrome)- **All Frames Support**: Works in main frame and all iframes (`all_frames: true`)

## Quick Start

│   │   ├── manifest.json   # Extension manifest V3

### 1. Load the Extension

│   │   ├── background.js   # Service worker## Repository Structure- **Multiple AI Backends**: Supports Ollama (local), OpenAI API, and intelligent fallbacks

```

1. Open Chrome and go to chrome://extensions/│   │   ├── content.js      # Content script

2. Enable "Developer mode" (top right)

3. Click "Load unpacked"│   │   ├── popup.html/js   # Extension popup- **Graceful Degradation**: Falls back to simpler injection methods if advanced techniques fail

4. Select the src/extension/ folder

5. Extension appears in your extensions list│   │   └── panel.html/js/css # Injected panel UI

```

│   └── backend/            # Python Flask backend```

### 2. Setup Backend (Optional)

│       ├── example_server.py  # Main server

```cmd

cd src/backend│       ├── test_server.py     # Environment testsstealth-ai-chrome/## 📁 Project Structure

pip install -r requirements.txt

python example_server.py│       └── requirements.txt   # Dependencies

```

├── scripts/                # Build and setup scripts├── background.js              # Service worker for extension logic

Server will run on `http://localhost:8000`

│   ├── install.bat         # Setup script

### 3. Use the Extension

│   ├── build.bat           # Build release package├── content.js                 # Content script with Shadow DOM injection```

1. Click extension icon

2. Click "Inject Panel"│   ├── release.bat         # Prepare GitHub release

3. Use floating UI to extract canvas content or ask questions

4. Results display in the panel│   └── start_ai_server.bat # Start backend├── popup.html                 # Extension popup interface├── manifest.json          # Extension manifest (Manifest V3)



## Installation Guide├── tests/                  # Test pages and data



For detailed installation instructions, see [docs/INSTALL.md](docs/INSTALL.md)│   ├── blindat.html        # Protected exam test page├── popup.js                   # Popup functionality├── background.js          # Service worker for injection logic



This includes:│   └── blindat.txt         # Test data

- Prerequisites (Python, Chrome version)

- Step-by-step installation├── docs/                   # Comprehensive documentation├── panel.html                 # Injected panel template├── content.js            # Content script with Shadow DOM injection

- AI backend configuration (Ollama, OpenAI)

- Troubleshooting│   ├── INSTALL.md          # Installation guide



## System Architecture│   ├── ARCHITECTURE.md     # System design├── panel.js                   # Panel functionality├── popup.html            # Extension popup interface



For detailed system design, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)│   ├── API.md              # Backend API reference



Includes:│   └── CONTRIBUTING.md     # Contributing guidelines├── panel.css                  # Panel styles├── popup.js              # Popup functionality

- Component overview

- Data flow diagrams├── dist/                   # Release packages

- Communication protocols

- Security architecture├── CHANGELOG.md            # Version history├── blindat.html               # Test page (protected exam simulation)├── panel.css             # Styles for injected panel



## Backend API├── README.md               # This file



For API documentation, see [docs/API.md](docs/API.md)└── .git/                   # Git repository├── manifest.json              # Extension manifest (Manifest V3)├── example_server.py     # Python backend server



Available endpoints:```

- `GET /health` - Health check

- `POST /process` - Process text├── install.bat                # Windows installation script├── requirements.txt      # Python dependencies

- `POST /canvas` - Process canvas images

- `POST /analyze` - Advanced analysis## Quick Start



## Build and Release├── reorganize_repo.bat        # Script to organize backend into server/ folder├── install.bat          # Windows installation script



### Build a Release Package### 1. Load the Extension



```cmd├── server/                    # Backend server (optional structure)└── README.md            # This file

cd scripts

build.bat```

```

1. Open Chrome and go to chrome://extensions/│   ├── example_server.py      # Python Flask backend```

This creates:

- Organized package in `dist/specter-panel-VERSION/`2. Enable "Developer mode" (top right)

- ZIP archive ready for distribution

- Installation script included3. Click "Load unpacked"│   ├── test_server.py         # Server environment verification



### Create a GitHub Release4. Select the src/extension/ folder



```cmd5. Extension appears in your extensions list│   ├── requirements.txt       # Python dependencies## 🚀 Quick Start

cd scripts

release.bat```

```

│   └── start_ai_server.bat    # Server startup script

This prepares:

- Version bump### 2. Setup Backend (Optional)

- Release notes template

- GitHub release instructions└── README.md                  # This file### 1. Install the Chrome Extension



## Security and Privacy```cmd



### What This Extension Doescd src/backend```

- Injects a floating panel into webpages

- Extracts visible canvas contentpip install -r requirements.txt

- Sends data to local backend

- Operates with user controlpython example_server.py1. Open Chrome and navigate to `chrome://extensions/`



### What This Extension Does NOT Do```

- Access sensitive user data

- Modify webpage functionality## Quick Start2. Enable "Developer mode" in the top right

- Transmit data to external servers (localhost only)

- Interfere with page securityServer will run on `http://localhost:8000`



### Responsible Use3. Click "Load unpacked" and select this folder

Designed for:

- Educational purposes### 3. Use the Extension

- Accessibility improvements

- Content analysis and research### 1. Install the Chrome Extension4. The extension should now appear in your extensions list

- Development and testing

1. Click extension icon

**Users are responsible for ensuring compliance with applicable laws and terms of service.**

2. Click "Inject Panel"

## Contributing

3. Use floating UI to extract canvas content or ask questions

We welcome contributions. See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for:

- Development setup4. Results display in the panel1. Open Chrome and navigate to `chrome://extensions/`### 2. Set Up the Backend (Optional but Recommended for AI)

- Coding standards

- PR process

- Testing guidelines

## Installation Guide2. Enable "Developer mode" (toggle in top-right corner)

## Testing



Test files are in `tests/`:

- `blindat.html` - Protected exam simulationFor detailed installation instructions, see [docs/INSTALL.md](docs/INSTALL.md)3. Click "Load unpacked" and select this repository folderThe extension includes a Python backend with AI capabilities:

- `blindat.txt` - Test content



Load the extension and test on these pages to verify functionality on heavily protected sites.

This includes:4. The extension will appear in your extensions list

## Troubleshooting

- Prerequisites (Python, Chrome version)

### Extension Not Loading

- Check that you're loading `src/extension/` folder- Step-by-step installation```cmd

- Verify `manifest.json` is present

- Reload in `chrome://extensions/`- AI backend configuration (Ollama, OpenAI)



### Backend Connection Issues- Troubleshooting### 2. Set Up the Backend (Optional)# Install Python dependencies

- Verify backend running on `localhost:8000`

- Test with `curl http://localhost:8000/health`

- Check firewall settings

## System Architecturepip install -r requirements.txt

### Python Errors

- Ensure Python 3.8+ installed

- Run `pip install --upgrade pip`

- Reinstall dependenciesFor detailed system design, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)To use AI and OCR features, set up the Python backend:



## Development



### RequirementsIncludes:# Run the backend server

- Chrome 88+

- Python 3.8+- Component overview

- pip package manager

- Data flow diagrams```cmdpython example_server.py

### Setup Development Environment

```cmd- Communication protocols

# Load extension in Chrome

1. Go to chrome://extensions/- Security architecturecd server```

2. Load unpacked -> select src/extension/



# Setup backend

cd src/backend## Backend APIpip install -r requirements.txt

pip install -r requirements.txt

python example_server.py

```

For API documentation, see [docs/API.md](docs/API.md)python example_server.pyThe server will start on `http://localhost:8000` and provide:

### Making Changes

- Extension: Edit files in `src/extension/`, reload in Chrome

- Backend: Edit files in `src/backend/`, restart server

Available endpoints:```- **AI Question Answering**: Ask questions and get intelligent responses

## License

- `GET /health` - Health check

This project is provided for educational and research purposes.

- `POST /process` - Process text- **OCR Processing**: Extract text from canvas images

## Disclaimer

- `POST /canvas` - Process canvas images

This extension is provided as-is. Users are responsible for ensuring compliance with applicable laws and terms of service. The authors are not responsible for misuse.

- `POST /analyze` - Advanced analysisThe server will start on `http://localhost:8000`.- **Data Analysis**: Analyze and process extracted content

## Support



- Check [docs/](docs/) for detailed guides

- Review [CHANGELOG.md](CHANGELOG.md) for updates## Build and Release- **Multiple AI Backends**: Supports Ollama (local) and OpenAI API

- Check browser console for error messages

- Test pages in [tests/](tests/) for examples



---### Build a Release Package### 3. Using the Extension



**Version**: 1.1.0  

**Last Updated**: 2024-10-29

```cmd### 3. AI Configuration Options

cd scripts

build.bat1. Click the extension icon to open the popup

```

2. Click "Inject Panel" to inject the floating UI into the page#### Option A: Local AI with Ollama (Recommended)

This creates:

- Organized package in `dist/stealth-injector-VERSION/`3. Use the panel to:1. Install Ollama from https://ollama.ai

- ZIP archive ready for distribution

- Installation script included   - Extract canvas content (sent to backend for OCR)2. Pull a model: `ollama pull llama3.2:3b`



### Create a GitHub Release   - Ask questions and receive AI responses3. Start Ollama (it runs automatically)



```cmd   - View and copy results4. The server will automatically detect and use Ollama

cd scripts

release.bat

```

## Backend Setup#### Option B: OpenAI API

This prepares:

- Version bump1. Get an API key from OpenAI

- Release notes template

- GitHub release instructions### Prerequisites2. Edit `example_server.py` and set:



## Security and Privacy   ```python



### What This Extension Does- Python 3.8 or higher   AI_CONFIG = {

- Injects UI into webpages

- Extracts visible canvas content- pip package manager       'use_openai': True,

- Sends data to local backend

- Operates with user control       'openai_api_key': 'your-api-key-here',



### What This Extension Does NOT Do### Installation       ...

- Access sensitive user data

- Modify webpage functionality   }

- Transmit data to external servers (localhost only)

- Interfere with page security```cmd   ```



### Responsible Usecd server

Designed for:

- Educational purposespip install -r requirements.txt#### Option C: Intelligent Fallbacks

- Accessibility improvements

- Content analysis and research```If no AI backend is configured, the server provides intelligent pattern-based responses for common programming questions.

- Development and testing



**Users are responsible for ensuring compliance with applicable laws and terms of service.**

### Running the ServerThe server will start on `http://localhost:8000`

## Contributing



We welcome contributions. See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for:

- Development setup```cmd### 3. Using the Extension

- Coding standards

- PR processpython example_server.py

- Testing guidelines

```1. Click the extension icon to open the popup

## Testing

2. Click "Inject Panel" to inject the floating UI into the current page

Test files are in `tests/`:

- `blindat.html` - Protected exam simulationThe server provides the following endpoints:3. **Type your question** in the text area (e.g., "What is JavaScript?" or "How do I create a function?")

- `blindat.txt` - Test content

4. Click **"Send to Backend"** to get an AI-powered response

Load the extension and test on these pages to verify functionality on heavily protected sites.

| Endpoint | Method | Purpose |5. Use "Extract Canvas" to extract data from canvas elements and get OCR processing

## Troubleshooting

|----------|--------|---------|6. Copy text or responses using the "Copy Text" button

### Extension Not Loading

- Check that you're loading `src/extension/` folder| `/health` | GET | Health check and server status |

- Verify `manifest.json` is present

- Reload in `chrome://extensions/`| `/process` | POST | Process text data |### 4. AI Features Usage



### Backend Connection Issues| `/canvas` | POST | Process canvas image data |

- Verify backend running on `localhost:8000`

- Test with `curl http://localhost:8000/health`| `/analyze` | POST | Advanced content analysis |**Ask Questions:**

- Check firewall settings

- Type any question like "What is the DOM?" or "Explain CSS flexbox"

### Python Errors

- Ensure Python 3.8+ installed### AI Configuration- Get intelligent responses based on your backend configuration

- Run `pip install --upgrade pip`

- Reinstall dependencies- Works with programming questions, general knowledge, and technical concepts



## Development#### Option A: Local Ollama (Recommended)



### Requirements1. Download and install [Ollama](https://ollama.ai)**Canvas OCR:**

- Chrome 88+

- Python 3.8+2. Pull a model: `ollama pull llama2`- Click "Extract Canvas" to extract text from images on the page

- pip package manager

3. Ollama will automatically start; the server will detect and use it- The backend will process the images and extract readable text

### Setup Development Environment

```cmd- Useful for capturing text from screenshots, charts, or image-based content

# Load extension in Chrome

1. Go to chrome://extensions/#### Option B: OpenAI API

2. Load unpacked -> select src/extension/

1. Obtain an API key from [OpenAI](https://openai.com)**Smart Detection:**

# Setup backend

cd src/backend2. Edit `server/example_server.py` and set your API key- The system automatically detects if your input is a question and routes it to the appropriate AI endpoint

pip install -r requirements.txt

python example_server.py3. Restart the server- Provides confidence scores and source information for responses

```



### Making Changes

- Extension: Edit files in `src/extension/`, reload in Chrome#### Option C: Fallback Mode## 🔧 How It Works

- Backend: Edit files in `src/backend/`, restart server

If no AI backend is available, the server provides rule-based responses.

## License

### CSP Bypass Techniques

This project is provided for educational and research purposes.

## File Organization

## Disclaimer

The extension uses multiple techniques to bypass Content Security Policies:

This extension is provided as-is. Users are responsible for ensuring compliance with applicable laws and terms of service. The authors are not responsible for misuse.

### Extension Files (Root Directory)

## Support

These files should remain in the repository root:1. **Content Script Injection**: Runs at `document_start` with high privileges

- Check [docs/](docs/) for detailed guides

- Review [CHANGELOG.md](CHANGELOG.md) for updates- `background.js` - Service worker2. **Shadow DOM**: Creates isolated DOM tree that CSP cannot affect

- Check browser console for error messages

- Test pages in [tests/](tests/) for examples- `content.js` - Content script3. **chrome.scripting API**: Uses Chrome's scripting API as fallback



---- `popup.html`, `popup.js` - Popup UI4. **Inline Styles**: Uses `style.cssText` to avoid external CSS restrictions



**Version**: 1.1.0  - `panel.html`, `panel.js`, `panel.css` - Injected panel UI5. **No External Resources**: All code is self-contained

**Last Updated**: 2024-10-29

- `manifest.json` - Extension manifest

- `blindat.html` - Test page### Stealth Features



### Backend Files (server/ Directory)- **No Event Interference**: Carefully avoids triggering page event listeners

Run `reorganize_repo.bat` once to move these into the `server/` folder:- **Isolated Execution**: Uses shadow DOM with `mode: 'closed'`

- `example_server.py` - Flask backend- **High Z-Index**: Ensures panel stays on top without interfering

- `test_server.py` - Environment tests- **Minimal DOM Footprint**: Creates minimal DOM elements

- `requirements.txt` - Python dependencies- **Event Propagation Control**: Uses `stopPropagation()` on all events

- `start_ai_server.bat` - Server startup batch file

### Canvas Extraction

## Testing

```javascript

The repository includes a test page (`blindat.html`) that simulates an exam environment with:// Extract canvas data safely

- Ultra-restrictive CSP policiesconst canvases = document.querySelectorAll('canvas');

- Canvas-rendered contentcanvases.forEach((canvas, index) => {

- Tab switching detection  try {

- Inactivity monitoring    const dataURL = canvas.toDataURL('image/png');

    // Send to backend for OCR processing

Use this page to test extension functionality on heavily protected sites.  } catch (error) {

    // Handle tainted canvas gracefully

## Security and Privacy  }

});

### What This Extension Does```

- Injects a floating UI panel into webpages

- Extracts visible content from canvas elements## 🛡️ Security Considerations

- Sends data to a local backend for processing

- Operates with user awareness and control### What This Extension Does



### What This Extension Does NOT Do- Injects a floating UI panel into webpages

- Access sensitive user data without permission- Extracts visible content from canvas elements

- Modify webpage functionality- Sends data to local backend for processing

- Transmit data to external servers (localhost only)- Operates with user consent and awareness

- Interfere with page security mechanisms

### What This Extension Does NOT Do

### Responsible Use

This extension is designed for:- Access sensitive user data without permission

- Educational purposes- Modify webpage content or functionality

- Accessibility improvements- Transmit data to external servers (only localhost)

- Content analysis and research- Interfere with page security mechanisms maliciously

- Development and testing

### Responsible Use

**Users are responsible for ensuring their use complies with applicable laws and terms of service.**

This extension is designed for:

## Troubleshooting- Educational purposes and learning

- Accessibility improvements

### Extension Not Injecting- Content analysis and processing

- Verify the page is not a `chrome://` page- Research and development

- Check the extension is enabled in `chrome://extensions/`

- Check browser console for error messages**Please use responsibly and in accordance with applicable terms of service and laws.**

- Reload the page and try again

## 🔍 Testing with Protected Pages

### Backend Connection Issues

- Verify the Python server is running on `localhost:8000`The extension has been tested against pages with:

- Check that no firewall is blocking the connection

- Test with `http://localhost:8000/health` in a browser- ✅ Strict CSP with nonce requirements

- ✅ `default-src 'none'` policies

### Canvas Extraction Issues- ✅ Frame blocking (`frame-src 'none'`)

- Some canvases are "tainted" if they contain cross-origin data and cannot be extracted- ✅ Script blocking (`script-src 'nonce-...'`)

- Some pages may prevent canvas access for security reasons- ✅ Canvas-based content rendering

- Not all pages use canvas elements- ✅ Focus and visibility change detection

- ✅ Developer tools detection attempts

## Development

### Example Test Page

### Requirements

- Chrome browser (version 88+)The included `blindat.html` demonstrates a heavily protected exam page with:

- Python 3.8+- Ultra-restrictive CSP

- pip- Canvas-rendered questions

- Tab switching detection

### Testing Locally- Focus loss monitoring

1. Load the extension in Chrome via `chrome://extensions/`- Inactivity tracking

2. Start the backend server- DevTools detection

3. Visit a webpage and test the injection

4. Use browser DevTools console to debug## 📡 Backend API



## ContributingThe Python backend provides several endpoints:



Contributions are welcome. Please:### Health Check

1. Fork the repository```

2. Create a feature branchGET /health

3. Test thoroughly```

4. Submit a pull request

### Process Text

## License```

POST /process

This project is provided for educational and research purposes.Content-Type: application/json



## Disclaimer{

  "text": "Text to process",

This extension is provided as-is. Users are responsible for ensuring their use complies with applicable laws and terms of service. The authors are not responsible for misuse of this software.  "timestamp": 1234567890

}
```

### Process Canvas Data
```
POST /canvas
Content-Type: application/json

{
  "data": {
    "dataURL": "data:image/png;base64,iVBOR...",
    "width": 800,
    "height": 600,
    "index": 0
  }
}
```

### Advanced Analysis
```
POST /analyze
Content-Type: application/json

{
  "content": "Content to analyze",
  "type": "exam_question|code_analysis|basic"
}
```

## 🎛️ Configuration

### Extension Settings

The popup interface allows configuration of:
- Auto-injection on all pages
- Stealth mode operation
- Backend server URL
- Panel visibility toggle

### Backend Configuration

Edit `example_server.py` to customize:
- OCR processing options
- Analysis algorithms
- Data storage methods
- API endpoints

## 🐛 Troubleshooting

### Extension Not Injecting

1. Check if the page allows extensions (not `chrome://` pages)
2. Try the fallback injection method
3. Check console for error messages
4. Ensure content script permissions are granted

### Canvas Extraction Failing

1. **Tainted Canvas Error**: Canvas contains cross-origin data
2. **Access Denied**: Page prevents canvas data access
3. **No Canvas Found**: Page doesn't use canvas elements

### Backend Connection Issues

1. Ensure Python server is running on `localhost:8000`
2. Check CORS settings if accessing from different origins
3. Verify firewall isn't blocking connections
4. Test with `/health` endpoint first

## 🔄 Updates and Maintenance

### Version History

- **v1.0**: Initial release with basic injection
- **v1.1**: Added Shadow DOM isolation
- **v1.2**: Enhanced CSP bypass techniques
- **v1.3**: Added OCR and backend integration

### Future Improvements

- [ ] AI-powered content analysis
- [ ] Multiple backend protocol support
- [ ] Enhanced OCR accuracy
- [ ] Mobile browser support
- [ ] Encrypted data transmission

## 📄 License

This project is for educational and research purposes. Use responsibly and in accordance with applicable laws and terms of service.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Test thoroughly
4. Submit a pull request

## ⚠️ Disclaimer

This extension is provided as-is for educational purposes. Users are responsible for ensuring their use complies with applicable laws, terms of service, and ethical guidelines. The authors are not responsible for any misuse of this software.

---

**Built with ❤️ for the web development community**