# Stealth Web Injector# 🥷 Stealth Web Injector



A Chrome extension that injects a persistent floating UI into webpages to extract content, forward data to a local backend for processing (OCR, AI analysis), and display results in-page. Operates with Shadow DOM isolation and runtime scripting to work on pages with strict Content Security Policies.A Chrome extension designed to inject minimal, persistent floating UI elements into any webpage while avoiding detection, including heavily protected pages with strict Content Security Policies (CSP).



## Features## 🎯 Features



- **CSP Compatibility**: Works on pages with strict Content Security Policies including nonce requirements- **CSP Bypass**: Works on pages with strict Content Security Policies including nonce requirements

- **Shadow DOM Isolation**: Uses closed shadow DOM for isolation from page scripts- **Shadow DOM Isolation**: Uses closed shadow DOM for maximum isolation from page scripts

- **Canvas Data Extraction**: Extracts content from HTML5 canvas elements- **Canvas Data Extraction**: Extracts content from HTML5 canvas elements using `toDataURL()`

- **AI-Powered Analysis**: Send questions and data to local backend for intelligent processing- **AI-Powered Responses**: Ask questions and get intelligent AI responses 

- **OCR Integration**: Optional OCR processing for extracted canvas images- **OCR Integration**: Optional OCR processing for extracted canvas images

- **Local Backend**: Communicates with local Python server (Flask-based)- **Local Backend**: Communicates with local Python server for data processing

- **Multiple AI Backends**: Supports Ollama (local), OpenAI API, and intelligent fallbacks- **Stealth Operation**: Avoids triggering `visibilitychange`, `blur`, or `focus` events

- **All Frames Support**: Works in main frame and all iframes- **No Focus Stealing**: Does not interfere with page focus or user interactions

- **All Frames Support**: Works in main frame and all iframes (`all_frames: true`)

## Repository Structure- **Multiple AI Backends**: Supports Ollama (local), OpenAI API, and intelligent fallbacks

- **Graceful Degradation**: Falls back to simpler injection methods if advanced techniques fail

```

stealth-ai-chrome/## 📁 Project Structure

├── background.js              # Service worker for extension logic

├── content.js                 # Content script with Shadow DOM injection```

├── popup.html                 # Extension popup interface├── manifest.json          # Extension manifest (Manifest V3)

├── popup.js                   # Popup functionality├── background.js          # Service worker for injection logic

├── panel.html                 # Injected panel template├── content.js            # Content script with Shadow DOM injection

├── panel.js                   # Panel functionality├── popup.html            # Extension popup interface

├── panel.css                  # Panel styles├── popup.js              # Popup functionality

├── blindat.html               # Test page (protected exam simulation)├── panel.css             # Styles for injected panel

├── manifest.json              # Extension manifest (Manifest V3)├── example_server.py     # Python backend server

├── install.bat                # Windows installation script├── requirements.txt      # Python dependencies

├── reorganize_repo.bat        # Script to organize backend into server/ folder├── install.bat          # Windows installation script

├── server/                    # Backend server (optional structure)└── README.md            # This file

│   ├── example_server.py      # Python Flask backend```

│   ├── test_server.py         # Server environment verification

│   ├── requirements.txt       # Python dependencies## 🚀 Quick Start

│   └── start_ai_server.bat    # Server startup script

└── README.md                  # This file### 1. Install the Chrome Extension

```

1. Open Chrome and navigate to `chrome://extensions/`

## Quick Start2. Enable "Developer mode" in the top right

3. Click "Load unpacked" and select this folder

### 1. Install the Chrome Extension4. The extension should now appear in your extensions list



1. Open Chrome and navigate to `chrome://extensions/`### 2. Set Up the Backend (Optional but Recommended for AI)

2. Enable "Developer mode" (toggle in top-right corner)

3. Click "Load unpacked" and select this repository folderThe extension includes a Python backend with AI capabilities:

4. The extension will appear in your extensions list

```cmd

### 2. Set Up the Backend (Optional)# Install Python dependencies

pip install -r requirements.txt

To use AI and OCR features, set up the Python backend:

# Run the backend server

```cmdpython example_server.py

cd server```

pip install -r requirements.txt

python example_server.pyThe server will start on `http://localhost:8000` and provide:

```- **AI Question Answering**: Ask questions and get intelligent responses

- **OCR Processing**: Extract text from canvas images

The server will start on `http://localhost:8000`.- **Data Analysis**: Analyze and process extracted content

- **Multiple AI Backends**: Supports Ollama (local) and OpenAI API

### 3. Using the Extension

### 3. AI Configuration Options

1. Click the extension icon to open the popup

2. Click "Inject Panel" to inject the floating UI into the page#### Option A: Local AI with Ollama (Recommended)

3. Use the panel to:1. Install Ollama from https://ollama.ai

   - Extract canvas content (sent to backend for OCR)2. Pull a model: `ollama pull llama3.2:3b`

   - Ask questions and receive AI responses3. Start Ollama (it runs automatically)

   - View and copy results4. The server will automatically detect and use Ollama



## Backend Setup#### Option B: OpenAI API

1. Get an API key from OpenAI

### Prerequisites2. Edit `example_server.py` and set:

   ```python

- Python 3.8 or higher   AI_CONFIG = {

- pip package manager       'use_openai': True,

       'openai_api_key': 'your-api-key-here',

### Installation       ...

   }

```cmd   ```

cd server

pip install -r requirements.txt#### Option C: Intelligent Fallbacks

```If no AI backend is configured, the server provides intelligent pattern-based responses for common programming questions.



### Running the ServerThe server will start on `http://localhost:8000`



```cmd### 3. Using the Extension

python example_server.py

```1. Click the extension icon to open the popup

2. Click "Inject Panel" to inject the floating UI into the current page

The server provides the following endpoints:3. **Type your question** in the text area (e.g., "What is JavaScript?" or "How do I create a function?")

4. Click **"Send to Backend"** to get an AI-powered response

| Endpoint | Method | Purpose |5. Use "Extract Canvas" to extract data from canvas elements and get OCR processing

|----------|--------|---------|6. Copy text or responses using the "Copy Text" button

| `/health` | GET | Health check and server status |

| `/process` | POST | Process text data |### 4. AI Features Usage

| `/canvas` | POST | Process canvas image data |

| `/analyze` | POST | Advanced content analysis |**Ask Questions:**

- Type any question like "What is the DOM?" or "Explain CSS flexbox"

### AI Configuration- Get intelligent responses based on your backend configuration

- Works with programming questions, general knowledge, and technical concepts

#### Option A: Local Ollama (Recommended)

1. Download and install [Ollama](https://ollama.ai)**Canvas OCR:**

2. Pull a model: `ollama pull llama2`- Click "Extract Canvas" to extract text from images on the page

3. Ollama will automatically start; the server will detect and use it- The backend will process the images and extract readable text

- Useful for capturing text from screenshots, charts, or image-based content

#### Option B: OpenAI API

1. Obtain an API key from [OpenAI](https://openai.com)**Smart Detection:**

2. Edit `server/example_server.py` and set your API key- The system automatically detects if your input is a question and routes it to the appropriate AI endpoint

3. Restart the server- Provides confidence scores and source information for responses



#### Option C: Fallback Mode## 🔧 How It Works

If no AI backend is available, the server provides rule-based responses.

### CSP Bypass Techniques

## File Organization

The extension uses multiple techniques to bypass Content Security Policies:

### Extension Files (Root Directory)

These files should remain in the repository root:1. **Content Script Injection**: Runs at `document_start` with high privileges

- `background.js` - Service worker2. **Shadow DOM**: Creates isolated DOM tree that CSP cannot affect

- `content.js` - Content script3. **chrome.scripting API**: Uses Chrome's scripting API as fallback

- `popup.html`, `popup.js` - Popup UI4. **Inline Styles**: Uses `style.cssText` to avoid external CSS restrictions

- `panel.html`, `panel.js`, `panel.css` - Injected panel UI5. **No External Resources**: All code is self-contained

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