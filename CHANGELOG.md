# Changelog

All notable changes to SpecterPanel will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-10-29

### Added
- Comprehensive repository reorganization
  - Organized files into `src/extension/` and `src/backend/`
  - Created `scripts/` folder for utility scripts
  - Created `tests/` folder for test pages
  - Created `docs/` folder for documentation
  - Created `dist/` folder for release packages

- Extensive documentation
  - `INSTALL.md` - Installation and setup guide
  - `ARCHITECTURE.md` - System design and components
  - `API.md` - Backend API reference
  - `CONTRIBUTING.md` - Contributing guidelines
  - `CHANGELOG.md` - Version history (this file)

- Professional README
  - Clear structure and organization
  - Practical setup instructions
  - Security and privacy guidelines
  - Troubleshooting section

- Release management
  - Version bump to 1.1.0 in manifest
  - Release package structure in `dist/`
  - Build and release automation scripts
  - Semantic versioning

### Changed
- Reorganized extension files to `src/extension/`
- Moved backend files to `src/backend/`
- Moved utility scripts to `scripts/`
- Restructured test files in `tests/`
- Updated `install.bat` to reference new paths
- Updated `start_ai_server.bat` with professional formatting
- Improved code organization and clarity

### Improved
- Better documentation for developers
- Clear architecture overview
- API documentation with examples
- Installation guide for end users
- Contributing guidelines for contributors
- Project structure for maintainability

### Fixed
- File organization for better maintainability
- Installation script paths
- Backend server startup script

## [1.0.0] - 2024-10-15

### Added
- Initial release of SpecterPanel Chrome extension
- Shadow DOM-based UI injection
- Canvas content extraction
- Backend AI integration (Ollama, OpenAI)
- Flask REST API backend
- OCR support (pytesseract)
- Multiple AI backend support
- Fallback response generation
- Content Security Policy bypass techniques

### Features
- Chrome extension manifest V3
- Service worker background script
- Content script for page injection
- Popup and panel UI components
- Health check endpoint
- Text processing endpoint
- Canvas processing endpoint
- Advanced analysis endpoint
- Environment verification script

### Initial Documentation
- Basic README with feature list
- Installation script
- Backend setup instructions
- Test page (blindat.html)
- Example server and test files
- Requirements file for Python dependencies

## Version History Summary

### Upcoming [2.0.0]
- [ ] Configuration UI
- [ ] Multiple page support
- [ ] Enhanced security features
- [ ] Performance optimizations
- [ ] Mobile browser support
- [ ] Encrypted data transmission

### Planned Improvements
- [ ] Automated testing suite
- [ ] CI/CD pipeline
- [ ] Web-based configuration
- [ ] Plugin system
- [ ] Enhanced documentation
- [ ] User guide with screenshots

---

For more information, see:
- [README.md](../README.md)
- [Installation Guide](INSTALL.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Contributing Guide](CONTRIBUTING.md)
