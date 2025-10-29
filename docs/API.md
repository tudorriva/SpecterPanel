# Backend API Reference

## Overview

The Stealth Injector backend provides REST endpoints for data processing and AI integration. The server runs on `http://localhost:8000` by default.

## Base URL

```
http://localhost:8000
```

## Endpoints

### 1. Health Check

**Endpoint:** `GET /health`

Check server status and available AI backends.

**Response (200 OK):**
```json
{
  "status": "ok",
  "message": "Stealth Injector Backend",
  "version": "1.0",
  "timestamp": "2024-10-29T12:34:56.789Z",
  "backends": {
    "ollama": "available",
    "openai": "unavailable",
    "fallback": "available"
  }
}
```

**Example:**
```bash
curl http://localhost:8000/health
```

### 2. Process Text

**Endpoint:** `POST /process`

Send text data for processing.

**Request Body:**
```json
{
  "text": "String to process",
  "type": "question|text|command",
  "timestamp": 1234567890
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "result": "Processed result",
  "backend": "ollama|openai|fallback",
  "processing_time_ms": 150
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": "error",
  "error": "Missing required field: text",
  "timestamp": "2024-10-29T12:34:56.789Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -d '{"text":"What is JavaScript?"}'
```

### 3. Process Canvas

**Endpoint:** `POST /canvas`

Extract and process canvas image data.

**Request Body:**
```json
{
  "data": {
    "dataURL": "data:image/png;base64,iVBORw0KGgo...",
    "width": 800,
    "height": 600,
    "index": 0
  },
  "options": {
    "ocr": true,
    "extract_text": true
  }
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "canvas_index": 0,
  "width": 800,
  "height": 600,
  "extracted_text": "Text from image",
  "ocr_confidence": 0.95,
  "processing_time_ms": 250
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/canvas \
  -H "Content-Type: application/json" \
  -d @canvas_payload.json
```

### 4. Advanced Analysis

**Endpoint:** `POST /analyze`

Perform advanced content analysis.

**Request Body:**
```json
{
  "content": "Content to analyze",
  "type": "exam_question|code_analysis|general|academic",
  "context": {
    "subject": "JavaScript",
    "level": "intermediate"
  }
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "type": "exam_question",
  "analysis": {
    "summary": "Brief analysis",
    "key_points": ["point1", "point2"],
    "confidence": 0.87,
    "suggested_answer": "Detailed explanation..."
  },
  "backend": "ollama",
  "processing_time_ms": 350
}
```

## Request/Response Format

### Content-Type
All requests must include:
```
Content-Type: application/json
```

### Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 404 | Endpoint not found |
| 500 | Server error |
| 503 | Service unavailable |

### Timestamps
- Timestamps in requests: Unix timestamp (seconds)
- Timestamps in responses: ISO 8601 format

## AI Backend Priority

The server tries backends in this order:

1. **Ollama** (local, fastest, recommended)
   - No API key needed
   - Runs locally
   - Supports various models

2. **OpenAI API** (cloud, powerful)
   - Requires API key
   - More expensive
   - Higher quality responses

3. **Fallback** (always available)
   - Rule-based responses
   - Pattern matching
   - No external dependencies

## Error Handling

### Common Errors

**Missing Required Field:**
```json
{
  "status": "error",
  "error": "Missing required field: text",
  "code": "MISSING_FIELD",
  "timestamp": "2024-10-29T12:34:56.789Z"
}
```

**Invalid JSON:**
```json
{
  "status": "error",
  "error": "Invalid JSON in request body",
  "code": "INVALID_JSON",
  "timestamp": "2024-10-29T12:34:56.789Z"
}
```

**Backend Unavailable:**
```json
{
  "status": "error",
  "error": "All AI backends unavailable",
  "code": "NO_BACKEND",
  "timestamp": "2024-10-29T12:34:56.789Z"
}
```

**Rate Limited:**
```json
{
  "status": "error",
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT",
  "retry_after_seconds": 60,
  "timestamp": "2024-10-29T12:34:56.789Z"
}
```

## Rate Limiting

- No rate limiting for localhost connections
- Future versions may implement rate limiting
- Check response headers for rate limit info

## Authentication

Currently no authentication required for localhost. When deployed to production:
- API key authentication will be required
- HTTPS will be enforced
- CORS restrictions will be applied

## Examples

### JavaScript (from Chrome Extension)

```javascript
// Send a question to backend
async function askQuestion(question) {
  const response = await fetch('http://localhost:8000/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: question,
      type: 'question',
      timestamp: Math.floor(Date.now() / 1000)
    })
  });
  
  const data = await response.json();
  return data.result;
}

// Extract and process canvas
async function processCanvas(dataURL) {
  const response = await fetch('http://localhost:8000/canvas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: {
        dataURL: dataURL,
        width: 800,
        height: 600,
        index: 0
      },
      options: {
        ocr: true
      }
    })
  });
  
  return await response.json();
}
```

### Python

```python
import requests
import json

# Send a question
response = requests.post(
    'http://localhost:8000/process',
    json={
        'text': 'What is Python?',
        'type': 'question'
    }
)
result = response.json()
print(result['result'])

# Check health
health = requests.get('http://localhost:8000/health')
print(health.json())
```

### cURL

```bash
# Health check
curl http://localhost:8000/health

# Send question
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -d '{"text":"What is REST API?","type":"question"}'

# Process canvas
curl -X POST http://localhost:8000/canvas \
  -H "Content-Type: application/json" \
  -d @canvas.json
```

## Troubleshooting

### Server Not Responding
- Verify server is running: `http://localhost:8000/health`
- Check firewall settings
- Ensure port 8000 is not in use

### Backend Connection Errors
- Check Ollama installation and status
- Verify OpenAI API key if configured
- Check server logs for details

### Timeouts
- Large canvas images may take longer
- Adjust timeout in extension if needed
- Consider smaller images

## Version History

### v1.0
- Initial release
- `/health`, `/process`, `/canvas`, `/analyze` endpoints
- Ollama, OpenAI, and fallback support

## See Also

- [Installation Guide](INSTALL.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Main README](../README.md)
