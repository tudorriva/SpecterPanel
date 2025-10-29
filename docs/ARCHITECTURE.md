# Architecture Overview

## System Components

### 1. Chrome Extension (src/extension/)

The extension operates in two main contexts:

#### Background Service Worker (`background.js`)
- Runs in the background and manages extension lifecycle
- Handles popup communication
- Manages permissions and security

#### Content Script (`content.js`)
- Injects into webpage contexts
- Creates Shadow DOM isolation
- Communicates with backend via fetch API
- Handles canvas extraction
- Manages event propagation

#### UI Components
- `popup.html/popup.js` - Extension popup interface
- `panel.html/panel.js` - Injected floating panel UI
- `panel.css` - Styling for injected panel

#### Manifest (`manifest.json`)
- Manifest V3 format
- Defines permissions and capabilities
- Maps icons and UI elements

### 2. Backend Server (src/backend/)

Flask-based REST API for data processing:

#### Server (`example_server.py`)
- Handles HTTP requests from content script
- Manages AI backend communication
- Processes canvas images
- Provides OCR capabilities

#### Endpoints

| Path | Method | Purpose |
|------|--------|---------|
| `/health` | GET | Server health check |
| `/process` | POST | Process text data |
| `/canvas` | POST | Process canvas images |
| `/analyze` | POST | Advanced analysis |

#### AI Integration
- Ollama (local) - Primary choice
- OpenAI API - Cloud-based alternative
- Fallback mode - Rule-based responses

### 3. Test Suite (tests/)

Test pages simulating protected environments:

- `blindat.html` - Exam page with CSP protection
- `blindat.txt` - Exam content reference

## Data Flow

```
User Action (webpage)
    ↓
Content Script (content.js)
    ↓
Shadow DOM Panel (panel.html)
    ↓
User Input
    ↓
Background Script (background.js)
    ↓
Fetch to Backend (localhost:8000)
    ↓
Backend Server (example_server.py)
    ↓
AI Backend (Ollama/OpenAI)
    ↓
Response JSON
    ↓
Content Script receives
    ↓
Display in Panel
    ↓
User sees result
```

## Communication Protocols

### Content Script ↔ Background Script
- Message passing via `chrome.runtime.sendMessage()`
- Handles tab and frame communication

### Extension ↔ Backend Server
- HTTP POST requests to `http://localhost:8000`
- JSON request/response format
- CORS headers configured in backend

## Security Architecture

### Content Security Policy Bypass
- Uses Shadow DOM with `mode: 'closed'`
- Operates outside page's script context
- Bypasses CSP restrictions through Chrome APIs

### Data Isolation
- Shadow DOM prevents page script access
- No persistent data storage (by default)
- Local processing only (localhost:8000)

### Permissions Model
- `activeTab` - Access current tab
- `scripting` - Run scripts in page
- `tabs` - Tab information
- `storage` - Extension storage
- `host_permissions` - localhost:8000 only

## Extension Loading

### Development Loading
1. Load `src/extension/` as unpacked extension
2. Chrome reads manifest.json
3. Service worker activates
4. Content script injects automatically

### File References
- All extension files must be in `src/extension/`
- Manifest paths are relative to manifest.json location
- External resources require manifest permissions

## Backend Processing Pipeline

```
Request → Validation → Processing → AI Query → Response
    ↓         ↓            ↓           ↓          ↓
  JSON      Check        Extract    Try Ollama  Format
  Parse     Fields        Data      → OpenAI    JSON
                                   → Fallback
```

## Folder Structure Rationale

```
stealth-ai-chrome/
├── src/              # Source code
│   ├── extension/    # Chrome extension (loadable)
│   └── backend/      # Python backend server
├── scripts/          # Utility and setup scripts
├── tests/            # Test pages and test data
├── docs/             # Documentation
├── dist/             # Release packages
└── README.md         # Project overview
```

## Development Workflow

### Making Changes to Extension
1. Edit files in `src/extension/`
2. Reload extension in `chrome://extensions/`
3. Test on webpages
4. Check browser console for errors

### Making Changes to Backend
1. Edit files in `src/backend/`
2. Restart `python example_server.py`
3. Test endpoints (e.g., `localhost:8000/health`)
4. Check server logs for errors

### Adding Features
1. Extend content.js for new injection logic
2. Add backend endpoints in example_server.py
3. Update popup.html/panel.html UI
4. Test thoroughly on various websites

## Performance Considerations

- Shadow DOM creation overhead: minimal
- Canvas extraction: depends on canvas size
- Backend processing: depends on AI model
- Network latency: localhost is fast (~1-5ms)

## Testing Strategy

- `tests/blindat.html` - Test against heavy CSP
- Browser DevTools console - Debug messages
- Network tab - Monitor API calls
- `localhost:8000/health` - Verify backend

## Version Management

- Extension version in `src/extension/manifest.json`
- Backend version referenced in docs
- Release versions in `dist/` folder

## Dependencies

### Extension
- None (pure JavaScript, Chrome APIs)

### Backend
- Flask - Web framework
- Flask-CORS - Cross-origin requests
- Pillow - Image processing
- pytesseract - OCR integration (optional)
- requests - HTTP calls
- openai - OpenAI API (optional)

## Deployment

### For Users
- Load unpacked extension from `src/extension/`
- Run backend from `src/backend/`

### For Release
- Package extension in `dist/stealth-injector-v1.x.zip`
- Include backend setup in release notes
- Provide installation script

## Future Enhancements

- Multi-page frame synchronization
- Persistent data storage options
- Plugin system for custom injectors
- Web-based configuration UI
- Automated testing suite
- Release build pipeline
