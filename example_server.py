#!/usr/bin/env python3
"""
Example backend server for Stealth Injector Chrome Extension
Handles canvas data processing, text analysis, and OCR functionality
"""

import json
import base64
import io
from datetime import datetime
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import logging

# Optional OCR support
try:
    from PIL import Image
    import pytesseract
    OCR_AVAILABLE = True
    print("✓ OCR support available (Tesseract)")
except ImportError:
    OCR_AVAILABLE = False
    print("⚠ OCR support not available (install pillow and pytesseract)")

# Optional AI/ML support
try:
    import requests
    AI_AVAILABLE = True
    print("✓ AI processing support available")
except ImportError:
    AI_AVAILABLE = False
    print("⚠ AI processing support limited")

# Optional OpenAI support
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
    print("✓ OpenAI support available")
except ImportError:
    OPENAI_AVAILABLE = False
    print("⚠ OpenAI support not available")

# AI Configuration - Add your API keys here
AI_CONFIG = {
    'use_openai': False,  # Set to True if you have OpenAI API key
    'openai_api_key': '',  # Add your OpenAI API key here
    'use_local_ollama': True,  # Use local Ollama if available
    'ollama_url': 'http://localhost:11434',
    'default_model': 'llama3.2:3b',  # Default Ollama model
    'fallback_responses': True  # Use intelligent fallbacks if AI unavailable
}

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Storage for received data
data_store = {
    'canvas_data': [],
    'text_data': [],
    'processed_results': []
}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for extension connection testing"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().isoformat(),
        'features': {
            'ocr': OCR_AVAILABLE,
            'ai_processing': AI_AVAILABLE,
            'openai_available': OPENAI_AVAILABLE,
            'ollama_available': check_ollama_available(),
            'openai_configured': bool(AI_CONFIG.get('openai_api_key'))
        }
    })

def check_ollama_available():
    """Check if Ollama is running locally"""
    try:
        response = requests.get(f"{AI_CONFIG['ollama_url']}/api/version", timeout=2)
        return response.status_code == 200
    except:
        return False

def generate_ai_response(text, request_type='question'):
    """Generate AI response for the given text"""
    try:
        # First try Ollama (local AI)
        if AI_CONFIG['use_local_ollama'] and check_ollama_available():
            return generate_ollama_response(text, request_type)
        
        # Then try OpenAI if configured
        elif AI_CONFIG['use_openai'] and AI_CONFIG['openai_api_key']:
            return generate_openai_response(text, request_type)
        
        # Fallback to intelligent pattern-based responses
        elif AI_CONFIG['fallback_responses']:
            return generate_fallback_response(text, request_type)
        
        else:
            return {
                'response': 'AI processing not configured. Please set up Ollama or OpenAI API.',
                'source': 'error',
                'confidence': 0
            }
            
    except Exception as e:
        logger.error(f"AI response generation failed: {str(e)}")
        return {
            'response': f'AI processing error: {str(e)}',
            'source': 'error',
            'confidence': 0
        }

def generate_ollama_response(text, request_type):
    """Generate response using local Ollama"""
    try:
        # ⭐ ENHANCED: Detect exam-style questions and response type
        text_lower = text.lower()
        
        # Detect multiple choice questions
        has_options = any(pattern in text for pattern in ['a)', 'b)', 'c)', 'd)', 'A)', 'B)', 'C)', 'D)', '1)', '2)', '3)', '4)'])
        
        # Detect definition requests
        is_definition = any(word in text_lower for word in ['define', 'definition', 'what is', 'ce este', 'definește', 'definiție'])
        
        # Detect code requests
        is_code_request = any(word in text_lower for word in ['code', 'example', 'syntax', 'cod', 'exemplu', 'sintaxă', 'write', 'create', 'scrie'])
        
        # Create appropriate prompt based on question type
        if has_options:
            prompt = f"""You are answering an exam question with multiple choice options. 

{text}

IMPORTANT: Only respond with the single correct option letter/number/just on separate rows (like "a)" or "1)" or on different rows). Give NO explanation, NO reasoning, NO additional text. Just the answer option."""
        
        elif is_definition:
            prompt = f"""You are providing a technical definition for an exam.

{text}

IMPORTANT: Provide ONLY a short, precise technical definition. Maximum 2-3 sentences. NO examples, NO code, NO additional explanations. Be concise and technical."""
        
        elif is_code_request:
            prompt = f"""You are providing code for an exam question.

{text}

IMPORTANT: Provide ONLY the requested code. NO explanations, NO comments, NO additional text. Just clean, working code."""
        
        else:
            prompt = f"""You are answering an exam question. Be concise and direct.

{text}

Provide a brief, accurate answer suitable for an exam context. Keep it short and to the point."""

        # Make request to Ollama
        response = requests.post(
            f"{AI_CONFIG['ollama_url']}/api/generate",
            json={
                'model': AI_CONFIG['default_model'],
                'prompt': prompt,
                'stream': False,
                'options': {
                    'temperature': 0.1,  # Very low for consistent, factual answers
                    'top_p': 0.8,
                    'max_tokens': 150 if has_options else (100 if is_definition else 300),
                    'stop': ['\n\n'] if has_options or is_definition else None
                }
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            answer = result.get('response', '').strip()
            
            # ⭐ POST-PROCESS: Clean up responses based on type
            if has_options:
                # Extract just the option letter/number
                lines = answer.split('\n')
                for line in lines:
                    line = line.strip()
                    if any(opt in line for opt in ['a)', 'b)', 'c)', 'd)', 'A)', 'B)', 'C)', 'D)', '1)', '2)', '3)', '4)']):
                        # Find the option in the line
                        for opt in ['a)', 'b)', 'c)', 'd)', 'A)', 'B)', 'C)', 'D)', '1)', '2)', '3)', '4)']:
                            if opt in line:
                                answer = opt
                                break
                        break
                
            elif is_definition:
                # Keep only the first sentence if too long
                if len(answer) > 200:
                    sentences = answer.split('. ')
                    answer = sentences[0] + '.' if sentences else answer
                    
            elif is_code_request:
                # Remove any explanatory text, keep only code
                lines = answer.split('\n')
                code_lines = []
                in_code_block = False
                
                for line in lines:
                    if '```' in line:
                        in_code_block = not in_code_block
                        continue
                    if in_code_block or any(char in line for char in ['{', '}', '(', ')', ';', '=', '<', '>']):
                        code_lines.append(line)
                
                if code_lines:
                    answer = '\n'.join(code_lines).strip()
            
            return {
                'response': answer,
                'source': 'ollama',
                'model': AI_CONFIG['default_model'],
                'confidence': 0.9,
                'exam_mode': True
            }
        else:
            raise Exception(f"Ollama returned status {response.status_code}")
            
    except Exception as e:
        logger.error(f"Ollama response failed: {str(e)}")
        return generate_fallback_response(text, request_type)

def generate_openai_response(text, request_type):
    """Generate response using OpenAI API"""
    try:
        if not OPENAI_AVAILABLE:
            raise Exception("OpenAI library not installed")
            
        if not AI_CONFIG['openai_api_key']:
            raise Exception("OpenAI API key not configured")
        
        client = OpenAI(api_key=AI_CONFIG['openai_api_key'])
        
        if request_type == 'question':
            system_prompt = "You are a helpful AI assistant. Answer questions clearly and accurately."
        elif request_type == 'analysis':
            system_prompt = "You are an analytical AI assistant. Provide detailed analysis and insights."
        else:
            system_prompt = "You are a helpful AI assistant."
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        return {
            'response': response.choices[0].message.content,
            'source': 'openai',
            'model': 'gpt-3.5-turbo',
            'confidence': 0.9
        }
        
    except Exception as e:
        logger.error(f"OpenAI response failed: {str(e)}")
        return generate_fallback_response(text, request_type)

def generate_fallback_response(text, request_type):
    """Generate intelligent fallback responses when AI is not available"""
    text_lower = text.lower()
    
    # Programming-related responses
    if any(keyword in text_lower for keyword in ['javascript', 'js', 'function', 'variable', 'code']):
        if 'function' in text_lower:
            return {
                'response': '''JavaScript functions are blocks of reusable code. Here's the basic syntax:

```javascript
function functionName(parameters) {
    // code to execute
    return value; // optional
}

// Example:
function greet(name) {
    return "Hello, " + name + "!";
}
```

Functions can also be written as arrow functions:
```javascript
const greet = (name) => "Hello, " + name + "!";
```''',
                'source': 'pattern_match',
                'confidence': 0.7
            }
        
        elif 'variable' in text_lower:
            return {
                'response': '''JavaScript variables store data values. There are three ways to declare them:

```javascript
var name = "old way"; // function-scoped
let age = 25; // block-scoped, can be reassigned
const city = "New York"; // block-scoped, cannot be reassigned
```

Best practice: Use `const` by default, `let` when you need to reassign, avoid `var`.''',
                'source': 'pattern_match',
                'confidence': 0.7
            }
    
    # HTML/DOM related
    elif any(keyword in text_lower for keyword in ['html', 'dom', 'element', 'tag']):
        return {
            'response': '''HTML (HyperText Markup Language) structures web content using elements:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Page Title</title>
</head>
<body>
    <h1>Main Heading</h1>
    <p>Paragraph text</p>
    <div>Container element</div>
</body>
</html>
```

The DOM (Document Object Model) represents the HTML structure that JavaScript can manipulate.''',
            'source': 'pattern_match',
            'confidence': 0.7
        }
    
    # CSS related
    elif any(keyword in text_lower for keyword in ['css', 'style', 'color', 'background']):
        return {
            'response': '''CSS (Cascading Style Sheets) styles HTML elements:

```css
/* Element selector */
h1 {
    color: blue;
    font-size: 24px;
}

/* Class selector */
.my-class {
    background-color: #f0f0f0;
    padding: 10px;
}

/* ID selector */
#my-id {
    margin: 20px;
    border: 1px solid black;
}
```

CSS can be included inline, in `<style>` tags, or external `.css` files.''',
            'source': 'pattern_match',
            'confidence': 0.7
        }
    
    # General question patterns
    elif text.strip().endswith('?'):
        if 'what is' in text_lower:
            topic = text_lower.replace('what is', '').strip(' ?')
            return {
                'response': f'I understand you\'re asking about "{topic}". While I don\'t have access to real-time AI, this appears to be a definition question. For the most accurate and up-to-date information, I recommend checking official documentation or educational resources related to {topic}.',
                'source': 'pattern_match',
                'confidence': 0.5
            }
        
        elif 'how to' in text_lower or 'how do' in text_lower:
            return {
                'response': 'This appears to be a "how-to" question. For step-by-step instructions, I recommend checking official documentation, tutorials, or educational resources. If this is about programming, consider checking MDN Web Docs, W3Schools, or Stack Overflow.',
                'source': 'pattern_match',
                'confidence': 0.5
            }
    
    # Default intelligent response
    return {
        'response': f'''I've received your text: "{text[:100]}{'...' if len(text) > 100 else ''}"

To provide you with accurate AI-powered responses, please set up one of these options:

1. **Install Ollama locally** (Recommended):
   - Visit https://ollama.ai
   - Install Ollama
   - Run: `ollama pull llama3.2:3b`
   - Start the server

2. **Configure OpenAI API**:
   - Get an API key from OpenAI
   - Add it to the server configuration

3. **For now**, I can provide basic pattern-based responses for common programming questions.

What specific information are you looking for?''',
        'source': 'fallback',
        'confidence': 0.3
    }

@app.route('/process', methods=['POST'])
def process_text():
    """Process text data from the extension and provide AI responses"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        text = data.get('text', '')
        request_type = data.get('type', 'question')  # question, analysis, general
        timestamp = data.get('timestamp', datetime.now().timestamp())
        
        # Store the data
        entry = {
            'id': len(data_store['text_data']) + 1,
            'text': text,
            'type': request_type,
            'timestamp': timestamp,
            'processed_at': datetime.now().isoformat(),
            'length': len(text),
            'word_count': len(text.split()) if text else 0
        }
        
        data_store['text_data'].append(entry)
        
        # Basic text analysis
        analysis = analyze_text(text)
        entry['analysis'] = analysis
        
        # Generate AI response
        ai_response = generate_ai_response(text, request_type)
        entry['ai_response'] = ai_response
        
        logger.info(f"Processed text data: {len(text)} characters, AI response generated")
        
        return jsonify({
            'success': True,
            'id': entry['id'],
            'analysis': analysis,
            'ai_response': ai_response,
            'message': 'Text processed successfully with AI response'
        })
        
    except Exception as e:
        logger.error(f"Error processing text: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/ask', methods=['POST'])
def ask_question():
    """Ask a question and get an AI-powered response"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        question = data.get('question', '')
        context = data.get('context', '')  # Additional context if provided
        
        if not question.strip():
            return jsonify({'error': 'No question provided'}), 400
        
        # Combine question with context if available
        full_text = f"{context}\n\n{question}" if context else question
        
        # Generate AI response
        ai_response = generate_ai_response(full_text, 'question')
        
        # Store the Q&A
        entry = {
            'id': len(data_store['processed_results']) + 1,
            'question': question,
            'context': context,
            'ai_response': ai_response,
            'timestamp': datetime.now().isoformat(),
            'type': 'question_answer'
        }
        
        data_store['processed_results'].append(entry)
        
        logger.info(f"Question answered: {len(question)} characters")
        
        return jsonify({
            'success': True,
            'question': question,
            'answer': ai_response['response'],
            'source': ai_response['source'],
            'confidence': ai_response['confidence'],
            'id': entry['id']
        })
        
    except Exception as e:
        logger.error(f"Error answering question: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/canvas', methods=['POST'])
def process_canvas():
    """Process canvas data from the extension"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        canvas_data = data.get('data', {})
        data_url = canvas_data.get('dataURL', '')
        
        if not data_url.startswith('data:image/'):
            return jsonify({'error': 'Invalid image data'}), 400
        
        # Store the canvas data
        entry = {
            'id': len(data_store['canvas_data']) + 1,
            'canvas_index': canvas_data.get('index', 0),
            'width': canvas_data.get('width', 0),
            'height': canvas_data.get('height', 0),
            'url': canvas_data.get('url', ''),
            'received_at': datetime.now().isoformat(),
            'data_url_length': len(data_url)
        }
        
        # Attempt OCR if available
        if OCR_AVAILABLE:
            try:
                ocr_result = extract_text_from_canvas(data_url)
                entry['ocr_text'] = ocr_result
                logger.info(f"OCR extracted {len(ocr_result)} characters")
            except Exception as e:
                entry['ocr_error'] = str(e)
                logger.warning(f"OCR failed: {str(e)}")
        else:
            entry['ocr_text'] = "OCR not available - install pillow and pytesseract"
        
        data_store['canvas_data'].append(entry)
        
        logger.info(f"Processed canvas: {entry['width']}x{entry['height']}")
        
        return jsonify({
            'success': True,
            'id': entry['id'],
            'ocr_text': entry.get('ocr_text', ''),
            'message': 'Canvas processed successfully'
        })
        
    except Exception as e:
        logger.error(f"Error processing canvas: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/data', methods=['GET'])
def get_data():
    """Retrieve stored data"""
    data_type = request.args.get('type', 'all')
    limit = int(request.args.get('limit', 50))
    
    result = {}
    
    if data_type in ['all', 'text']:
        result['text_data'] = data_store['text_data'][-limit:]
    
    if data_type in ['all', 'canvas']:
        # Don't include full data URLs in listing for performance
        canvas_summary = []
        for item in data_store['canvas_data'][-limit:]:
            summary = item.copy()
            if 'data_url' in summary:
                del summary['data_url']
            canvas_summary.append(summary)
        result['canvas_data'] = canvas_summary
    
    if data_type in ['all', 'processed']:
        result['processed_results'] = data_store['processed_results'][-limit:]
    
    result['counts'] = {
        'text_entries': len(data_store['text_data']),
        'canvas_entries': len(data_store['canvas_data']),
        'processed_entries': len(data_store['processed_results'])
    }
    
    return jsonify(result)

@app.route('/analyze', methods=['POST'])
def analyze_content():
    """Advanced analysis endpoint"""
    try:
        data = request.get_json()
        content = data.get('content', '')
        analysis_type = data.get('type', 'basic')
        
        if analysis_type == 'exam_question':
            result = analyze_exam_question(content)
        elif analysis_type == 'code_analysis':
            result = analyze_code(content)
        else:
            result = analyze_text(content)
        
        # Store the analysis result
        entry = {
            'id': len(data_store['processed_results']) + 1,
            'content': content[:500] + '...' if len(content) > 500 else content,
            'analysis_type': analysis_type,
            'result': result,
            'processed_at': datetime.now().isoformat()
        }
        
        data_store['processed_results'].append(entry)
        
        return jsonify({
            'success': True,
            'result': result,
            'id': entry['id']
        })
        
    except Exception as e:
        logger.error(f"Error in analysis: {str(e)}")
        return jsonify({'error': str(e)}), 500

def extract_text_from_canvas(data_url):
    """Extract text from canvas image using OCR"""
    if not OCR_AVAILABLE:
        return "OCR not available"
    
    try:
        # Parse the data URL
        header, encoded = data_url.split(',', 1)
        image_data = base64.b64decode(encoded)
        
        # Open image with PIL
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Extract text using Tesseract
        text = pytesseract.image_to_string(image, config='--psm 6')
        
        return text.strip()
        
    except Exception as e:
        raise Exception(f"OCR processing failed: {str(e)}")

def analyze_text(text):
    """Basic text analysis"""
    if not text:
        return {'error': 'No text provided'}
    
    analysis = {
        'character_count': len(text),
        'word_count': len(text.split()),
        'line_count': len(text.splitlines()),
        'has_questions': '?' in text,
        'has_code': any(keyword in text.lower() for keyword in ['function', 'class', 'var', 'let', 'const', 'def', 'import']),
        'language_hints': detect_language_hints(text),
        'structure': analyze_structure(text)
    }
    
    return analysis

def analyze_exam_question(text):
    """Analyze text as an exam question"""
    analysis = analyze_text(text)
    
    # Additional exam-specific analysis
    question_indicators = ['what is', 'define', 'explain', 'describe', 'list', 'compare', 'contrast']
    programming_keywords = ['function', 'variable', 'loop', 'array', 'object', 'class', 'method']
    
    analysis.update({
        'is_question': '?' in text or any(indicator in text.lower() for indicator in question_indicators),
        'question_type': determine_question_type(text),
        'is_programming': any(keyword in text.lower() for keyword in programming_keywords),
        'difficulty_indicators': assess_difficulty(text),
        'key_topics': extract_key_topics(text)
    })
    
    return analysis

def analyze_code(text):
    """Analyze text as code"""
    analysis = analyze_text(text)
    
    # Code-specific analysis
    code_patterns = {
        'javascript': ['function', 'var', 'let', 'const', '=>', '==='],
        'python': ['def ', 'import ', 'class ', 'print(', '__init__'],
        'java': ['public class', 'private', 'public static void'],
        'html': ['<html>', '<div>', '<script>', '<!DOCTYPE'],
        'css': ['{', '}', ':', ';', 'color:', 'background:']
    }
    
    detected_languages = []
    for lang, patterns in code_patterns.items():
        if any(pattern in text for pattern in patterns):
            detected_languages.append(lang)
    
    analysis.update({
        'detected_languages': detected_languages,
        'has_syntax_errors': check_basic_syntax(text),
        'complexity_score': calculate_complexity(text)
    })
    
    return analysis

def detect_language_hints(text):
    """Detect programming language hints in text"""
    languages = {
        'JavaScript': ['javascript', 'js', 'node', 'react', 'vue', 'angular'],
        'Python': ['python', 'django', 'flask', 'pandas', 'numpy'],
        'Java': ['java', 'spring', 'hibernate', 'maven'],
        'HTML': ['html', 'dom', 'element', 'tag'],
        'CSS': ['css', 'style', 'selector', 'property'],
        'SQL': ['sql', 'database', 'query', 'select', 'insert']
    }
    
    detected = []
    text_lower = text.lower()
    
    for lang, keywords in languages.items():
        if any(keyword in text_lower for keyword in keywords):
            detected.append(lang)
    
    return detected

def analyze_structure(text):
    """Analyze text structure"""
    lines = text.splitlines()
    
    return {
        'has_headers': any(line.startswith('#') for line in lines),
        'has_bullets': any(line.strip().startswith(('*', '-', '•')) for line in lines),
        'has_numbers': any(line.strip()[0].isdigit() for line in lines if line.strip()),
        'indentation_detected': any(line.startswith(('  ', '\t')) for line in lines),
        'empty_lines': sum(1 for line in lines if not line.strip())
    }

def determine_question_type(text):
    """Determine the type of question"""
    text_lower = text.lower()
    
    if any(word in text_lower for word in ['define', 'what is', 'meaning']):
        return 'definition'
    elif any(word in text_lower for word in ['explain', 'describe', 'how']):
        return 'explanation'
    elif any(word in text_lower for word in ['list', 'enumerate', 'name']):
        return 'listing'
    elif any(word in text_lower for word in ['compare', 'contrast', 'difference']):
        return 'comparison'
    elif any(word in text_lower for word in ['example', 'demonstrate', 'show']):
        return 'example'
    else:
        return 'general'

def assess_difficulty(text):
    """Assess question difficulty based on indicators"""
    indicators = {
        'basic': ['what', 'define', 'list'],
        'intermediate': ['explain', 'describe', 'how'],
        'advanced': ['analyze', 'evaluate', 'critique', 'design', 'implement']
    }
    
    text_lower = text.lower()
    scores = {}
    
    for level, keywords in indicators.items():
        scores[level] = sum(1 for keyword in keywords if keyword in text_lower)
    
    return scores

def extract_key_topics(text):
    """Extract key topics from text"""
    # Simple keyword extraction based on common programming/web development terms
    topics = {
        'DOM': ['dom', 'document', 'element'],
        'JavaScript': ['javascript', 'function', 'variable', 'object'],
        'HTML': ['html', 'tag', 'attribute', 'element'],
        'CSS': ['css', 'style', 'selector', 'property'],
        'Programming': ['code', 'algorithm', 'logic', 'syntax'],
        'Web Development': ['web', 'browser', 'client', 'server']
    }
    
    text_lower = text.lower()
    found_topics = []
    
    for topic, keywords in topics.items():
        if any(keyword in text_lower for keyword in keywords):
            found_topics.append(topic)
    
    return found_topics

def check_basic_syntax(text):
    """Basic syntax error checking"""
    errors = []
    
    # Check for common syntax issues
    if text.count('(') != text.count(')'):
        errors.append('Mismatched parentheses')
    
    if text.count('{') != text.count('}'):
        errors.append('Mismatched braces')
    
    if text.count('[') != text.count(']'):
        errors.append('Mismatched brackets')
    
    return errors

def calculate_complexity(text):
    """Calculate a simple complexity score"""
    # Simple heuristic based on various factors
    factors = {
        'length': len(text) / 100,
        'lines': len(text.splitlines()) / 10,
        'nested_structures': text.count('{') + text.count('(') + text.count('['),
        'keywords': sum(1 for keyword in ['function', 'class', 'if', 'for', 'while'] if keyword in text.lower())
    }
    
    return sum(factors.values())

@app.route('/', methods=['GET'])
def index():
    """Simple index page"""
    return '''
    <html>
    <head><title>Stealth Injector Backend</title></head>
    <body style="font-family: monospace; background: #1a1a1a; color: #fff; padding: 20px;">
        <h1>🥷 Stealth Injector Backend Server</h1>
        <p>Server is running and ready to receive data from the Chrome extension.</p>
        
        <h2>Available Endpoints:</h2>
        <ul>
            <li><code>/health</code> - Health check</li>
            <li><code>/process</code> - Process text data (POST)</li>
            <li><code>/canvas</code> - Process canvas data (POST)</li>
            <li><code>/data</code> - Retrieve stored data (GET)</li>
            <li><code>/analyze</code> - Advanced analysis (POST)</li>
        </ul>
        
        <h2>Statistics:</h2>
        <ul>
            <li>Text entries: ''' + str(len(data_store['text_data'])) + '''</li>
            <li>Canvas entries: ''' + str(len(data_store['canvas_data'])) + '''</li>
            <li>Processed results: ''' + str(len(data_store['processed_results'])) + '''</li>
        </ul>
        
        <h2>Features:</h2>
        <ul>
            <li>OCR Support: ''' + ('✓ Available' if OCR_AVAILABLE else '✗ Not available') + '''</li>
            <li>AI Processing: ''' + ('✓ Available' if AI_AVAILABLE else '✗ Limited') + '''</li>
        </ul>
        
        <p><small>Server started at ''' + datetime.now().isoformat() + '''</small></p>
    </body>
    </html>
    '''

if __name__ == '__main__':
    print("🚀 Starting Stealth Injector Backend Server...")
    print("📝 Canvas data will be processed for OCR")
    print("🔍 Text analysis capabilities enabled")
    print("🌐 CORS enabled for all origins")
    print("💡 Visit http://localhost:8000 for status page")
    
    # Run the server
    app.run(
        host='127.0.0.1',
        port=8000,
        debug=True,
        threaded=True
    )