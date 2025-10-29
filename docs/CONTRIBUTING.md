# Contributing Guide

## Welcome

We appreciate your interest in contributing to Stealth Injector! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful to all contributors
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and improve

## Getting Started

### Prerequisites
- Git and GitHub account
- Chrome browser (for extension testing)
- Python 3.8+ (for backend development)
- Basic knowledge of JavaScript and Python

### Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR-USERNAME/stealth-ai-chrome.git
cd stealth-ai-chrome

# Add upstream remote
git remote add upstream https://github.com/tudorriva/stealth-ai-chrome.git
```

### Set Up Development Environment

```bash
# Create a development branch
git checkout -b feature/your-feature-name

# Install Python dependencies
cd src/backend
pip install -r requirements.txt

# Install development tools (optional)
pip install pytest pytest-cov black pylint
```

## Project Structure

```
src/
├── extension/    # Chrome extension code
├── backend/      # Flask backend server
docs/             # Documentation
tests/            # Test pages and test data
scripts/          # Utility scripts
dist/             # Release packages
```

## Types of Contributions

### Bug Reports
1. Check [existing issues](../../issues) first
2. Provide clear description and steps to reproduce
3. Include browser version, OS, and extension version
4. Add screenshots if applicable

### Feature Requests
1. Describe the feature and use case
2. Explain why it would be useful
3. Provide examples if possible
4. Suggest implementation approach if you have ideas

### Code Contributions

#### Extension Development (JavaScript)

**Location:** `src/extension/`

Guidelines:
- Use modern JavaScript (ES6+)
- No external libraries (Chrome APIs only)
- Shadow DOM for UI isolation
- Event delegation for performance
- Comment complex logic

**Key Files:**
- `background.js` - Service worker
- `content.js` - Content script
- `popup.js`, `panel.js` - UI logic
- `manifest.json` - Extension manifest

#### Backend Development (Python)

**Location:** `src/backend/`

Guidelines:
- PEP 8 style guide
- Type hints for functions
- Docstrings for modules and functions
- Error handling and validation
- CORS-friendly responses

**Key Files:**
- `example_server.py` - Main server
- `test_server.py` - Environment tests
- `requirements.txt` - Dependencies

### Documentation
- Update relevant `.md` files in `docs/`
- Improve clarity and examples
- Add missing documentation
- Fix typos and formatting

### Tests
- Add tests in `tests/` folder
- Test against `tests/blindat.html`
- Include edge cases
- Document test purpose

## Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/descriptive-name
```

Branch naming:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code improvements

### 2. Make Changes

Follow the guidelines for your type of contribution:

**Extension Changes:**
```javascript
// Good: Clear, well-commented
function injectPanel() {
  // Create shadow host
  const host = document.createElement('div');
  // ...
}

// Bad: Unclear, no comments
function inj() {
  const x = document.createElement('div');
  // ...
}
```

**Backend Changes:**
```python
# Good: Type hints, docstring, error handling
def process_text(text: str) -> dict:
    """Process text and return AI response.
    
    Args:
        text: Input text to process
        
    Returns:
        Dictionary with 'status' and 'result' keys
    """
    if not text:
        raise ValueError("Text cannot be empty")
    # ...

# Bad: No type hints, no validation
def process(t):
    return {"result": do_something(t)}
```

### 3. Test Your Changes

**Extension:**
```
1. Load src/extension/ in chrome://extensions/
2. Reload extension after changes
3. Test on various websites
4. Check browser console for errors
5. Test against tests/blindat.html
```

**Backend:**
```bash
# Verify syntax
python -m py_compile src/backend/example_server.py

# Test endpoints
python src/backend/example_server.py
curl http://localhost:8000/health

# Run unit tests
pytest src/backend/
```

### 4. Commit Changes

```bash
git add .
git commit -m "feature: descriptive commit message"
```

Commit message format:
```
type: subject line (50 chars max)

Longer description explaining the change (72 chars per line).
Include motivation and contrast with previous behavior.

Fixes #123
```

Types:
- `feature:` - New feature
- `bugfix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code improvement
- `test:` - Adding tests

### 5. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create PR on GitHub
# - Describe the change
# - Reference related issues
# - Include screenshots if applicable
```

## Pull Request Checklist

Before submitting a PR:

- [ ] Code follows project style guide
- [ ] Changes are well-commented
- [ ] Tests pass (if applicable)
- [ ] No console errors in browser
- [ ] Documentation updated if needed
- [ ] Commit messages are clear
- [ ] No unrelated changes included
- [ ] You've tested on multiple pages/scenarios

## Code Style

### JavaScript
```javascript
// Use arrow functions
const doSomething = () => { };

// Use const/let, not var
const x = 1;

// Use template literals
const msg = `Hello ${name}`;

// Use async/await
async function fetch() {
  const data = await response.json();
}

// Comment complex logic
// Shadow DOM prevents page script access
const shadow = host.attachShadow({ mode: 'closed' });
```

### Python
```python
# Follow PEP 8
def function_name(param: str) -> dict:
    """Docstring describing function."""
    result = {}
    return result

# Use type hints
def process(text: str, context: Optional[dict] = None) -> dict:
    pass

# Use f-strings
message = f"Processing {text}"

# Proper error handling
try:
    result = do_something()
except ValueError as e:
    logger.error(f"Processing error: {e}")
```

## Testing

### Manual Testing

**Extension:**
1. Load in `chrome://extensions/`
2. Open various websites
3. Test canvas extraction
4. Test with backend enabled/disabled
5. Test on pages with CSP restrictions

**Backend:**
1. Start server
2. Test endpoints with curl/Postman
3. Check response formats
4. Test error cases

### Automated Testing

```bash
# Python backend tests
pytest src/backend/

# Linting
pylint src/backend/
black src/backend/
```

## Documentation

When adding features:
1. Update relevant `.md` file
2. Add code examples
3. Include error cases
4. Update table of contents if needed

Example:

```markdown
### New Feature

Description of feature.

**Usage:**
\`\`\`javascript
// Code example
\`\`\`

**Parameters:**
- `param1` - Description

**Returns:**
- Object with 'status' and 'result'
```

## Review Process

1. CI checks run automatically
2. Maintainers review code
3. Feedback provided if needed
4. Approved PRs merged
5. Released in next version

## Questions?

- Open an issue for questions
- Check existing documentation
- Review similar code
- Ask in PR comments

## Recognition

Contributors will be recognized in:
- Release notes
- Contributors list
- Commit history

## License

By contributing, you agree your code is licensed under the project license.

Thank you for contributing! 🎉
