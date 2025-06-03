# 🥷 Stealth Web Injector

A Chrome extension designed to inject minimal, persistent floating UI elements into any webpage while avoiding detection, including heavily protected pages with strict Content Security Policies (CSP).

## 🎯 Features

- **CSP Bypass**: Works on pages with strict Content Security Policies including nonce requirements
- **Shadow DOM Isolation**: Uses closed shadow DOM for maximum isolation from page scripts
- **Canvas Data Extraction**: Extracts content from HTML5 canvas elements using `toDataURL()`
- **AI-Powered Responses**: Ask questions and get intelligent AI responses 
- **OCR Integration**: Optional OCR processing for extracted canvas images
- **Local Backend**: Communicates with local Python server for data processing
- **Stealth Operation**: Avoids triggering `visibilitychange`, `blur`, or `focus` events
- **No Focus Stealing**: Does not interfere with page focus or user interactions
- **All Frames Support**: Works in main frame and all iframes (`all_frames: true`)
- **Multiple AI Backends**: Supports Ollama (local), OpenAI API, and intelligent fallbacks
- **Graceful Degradation**: Falls back to simpler injection methods if advanced techniques fail

## 📁 Project Structure

```
├── manifest.json          # Extension manifest (Manifest V3)
├── background.js          # Service worker for injection logic
├── content.js            # Content script with Shadow DOM injection
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── panel.css             # Styles for injected panel
├── example_server.py     # Python backend server
├── requirements.txt      # Python dependencies
├── install.bat          # Windows installation script
└── README.md            # This file
```

## 🚀 Quick Start

### 1. Install the Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this folder
4. The extension should now appear in your extensions list

### 2. Set Up the Backend (Optional but Recommended for AI)

The extension includes a Python backend with AI capabilities:

```cmd
# Install Python dependencies
pip install -r requirements.txt

# Run the backend server
python example_server.py
```

The server will start on `http://localhost:8000` and provide:
- **AI Question Answering**: Ask questions and get intelligent responses
- **OCR Processing**: Extract text from canvas images
- **Data Analysis**: Analyze and process extracted content
- **Multiple AI Backends**: Supports Ollama (local) and OpenAI API

### 3. AI Configuration Options

#### Option A: Local AI with Ollama (Recommended)
1. Install Ollama from https://ollama.ai
2. Pull a model: `ollama pull llama3.2:3b`
3. Start Ollama (it runs automatically)
4. The server will automatically detect and use Ollama

#### Option B: OpenAI API
1. Get an API key from OpenAI
2. Edit `example_server.py` and set:
   ```python
   AI_CONFIG = {
       'use_openai': True,
       'openai_api_key': 'your-api-key-here',
       ...
   }
   ```

#### Option C: Intelligent Fallbacks
If no AI backend is configured, the server provides intelligent pattern-based responses for common programming questions.

The server will start on `http://localhost:8000`

### 3. Using the Extension

1. Click the extension icon to open the popup
2. Click "Inject Panel" to inject the floating UI into the current page
3. **Type your question** in the text area (e.g., "What is JavaScript?" or "How do I create a function?")
4. Click **"Send to Backend"** to get an AI-powered response
5. Use "Extract Canvas" to extract data from canvas elements and get OCR processing
6. Copy text or responses using the "Copy Text" button

### 4. AI Features Usage

**Ask Questions:**
- Type any question like "What is the DOM?" or "Explain CSS flexbox"
- Get intelligent responses based on your backend configuration
- Works with programming questions, general knowledge, and technical concepts

**Canvas OCR:**
- Click "Extract Canvas" to extract text from images on the page
- The backend will process the images and extract readable text
- Useful for capturing text from screenshots, charts, or image-based content

**Smart Detection:**
- The system automatically detects if your input is a question and routes it to the appropriate AI endpoint
- Provides confidence scores and source information for responses

## 🔧 How It Works

### CSP Bypass Techniques

The extension uses multiple techniques to bypass Content Security Policies:

1. **Content Script Injection**: Runs at `document_start` with high privileges
2. **Shadow DOM**: Creates isolated DOM tree that CSP cannot affect
3. **chrome.scripting API**: Uses Chrome's scripting API as fallback
4. **Inline Styles**: Uses `style.cssText` to avoid external CSS restrictions
5. **No External Resources**: All code is self-contained

### Stealth Features

- **No Event Interference**: Carefully avoids triggering page event listeners
- **Isolated Execution**: Uses shadow DOM with `mode: 'closed'`
- **High Z-Index**: Ensures panel stays on top without interfering
- **Minimal DOM Footprint**: Creates minimal DOM elements
- **Event Propagation Control**: Uses `stopPropagation()` on all events

### Canvas Extraction

```javascript
// Extract canvas data safely
const canvases = document.querySelectorAll('canvas');
canvases.forEach((canvas, index) => {
  try {
    const dataURL = canvas.toDataURL('image/png');
    // Send to backend for OCR processing
  } catch (error) {
    // Handle tainted canvas gracefully
  }
});
```

## 🛡️ Security Considerations

### What This Extension Does

- Injects a floating UI panel into webpages
- Extracts visible content from canvas elements
- Sends data to local backend for processing
- Operates with user consent and awareness

### What This Extension Does NOT Do

- Access sensitive user data without permission
- Modify webpage content or functionality
- Transmit data to external servers (only localhost)
- Interfere with page security mechanisms maliciously

### Responsible Use

This extension is designed for:
- Educational purposes and learning
- Accessibility improvements
- Content analysis and processing
- Research and development

**Please use responsibly and in accordance with applicable terms of service and laws.**

## 🔍 Testing with Protected Pages

The extension has been tested against pages with:

- ✅ Strict CSP with nonce requirements
- ✅ `default-src 'none'` policies
- ✅ Frame blocking (`frame-src 'none'`)
- ✅ Script blocking (`script-src 'nonce-...'`)
- ✅ Canvas-based content rendering
- ✅ Focus and visibility change detection
- ✅ Developer tools detection attempts

### Example Test Page

The included `blindat.html` demonstrates a heavily protected exam page with:
- Ultra-restrictive CSP
- Canvas-rendered questions
- Tab switching detection
- Focus loss monitoring
- Inactivity tracking
- DevTools detection

## 📡 Backend API

The Python backend provides several endpoints:

### Health Check
```
GET /health
```

### Process Text
```
POST /process
Content-Type: application/json

{
  "text": "Text to process",
  "timestamp": 1234567890
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