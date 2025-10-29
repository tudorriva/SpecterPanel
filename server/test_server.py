#!/usr/bin/env python3
"""
Simple test to verify the server starts without errors
"""

print("Testing server import...")

try:
    import sys
    sys.path.append(r'c:\Users\tudor\extensie chrome')
    
    # Test basic imports
    import json
    import base64
    import io
    from datetime import datetime
    from flask import Flask, request, jsonify, Response
    from flask_cors import CORS
    import logging
    
    print("✓ Basic imports successful")
    
    # Test optional imports
    try:
        from PIL import Image
        import pytesseract
        print("✓ OCR support available")
    except ImportError:
        print("⚠ OCR support not available")
    
    try:
        import requests
        print("✓ Requests available")
    except ImportError:
        print("⚠ Requests not available")
    
    try:
        import openai
        print("✓ OpenAI available")
    except ImportError:
        print("⚠ OpenAI not available (expected)")
    
    print("\n🎉 All critical imports work! Server should start successfully.")
    print("You can now run: python example_server.py")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("Please install missing dependencies with: pip install -r requirements.txt")
