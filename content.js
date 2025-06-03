// Content script for stealth injection and monitoring
(function() {
  'use strict';
  
  // Prevent double injection
  if (window.stealthContentInjected) return;
  window.stealthContentInjected = true;
    // Store original functions to avoid detection
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
  
  // Create a stealth event system that doesn't interfere with page events
  const stealthEvents = new Map();
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showBackendResponse') {
      displayBackendResponse(message.data);
    }
  });
  
  function displayBackendResponse(data) {
    // Find the stealth panel textarea
    const shadowRoot = document.querySelector('#stealth-shadow-root');
    if (shadowRoot && shadowRoot.shadowRoot) {
      const textarea = shadowRoot.shadowRoot.querySelector('#stealth-textarea');
      if (textarea) {
        if (data.success) {
          textarea.value = `🤖 AI Response:\n\n${data.response}\n\n[Source: ${data.source}, Confidence: ${(data.confidence * 100).toFixed(0)}%]`;
        } else {
          textarea.value = `❌ Error: ${data.error}\n\n💡 ${data.suggestion}`;
        }
      }
    }
  }
  
  function initStealthInjection() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createStealthPanel);
    } else {
      createStealthPanel();
    }
  }
  
  function createStealthPanel() {
    // Check if panel already exists
    if (document.querySelector('#stealth-shadow-root')) return;
    
    try {      // Create the most isolated injection possible
      const container = document.createElement('div');
      container.id = 'stealth-shadow-root';
      
      // Set styles individually to avoid CSP violations
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '0';
      container.style.height = '0';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '2147483647';
      container.style.opacity = '1';
      container.style.visibility = 'visible';
      
      // Use closed shadow DOM for maximum isolation
      const shadow = container.attachShadow({ mode: 'closed' });
      
      // Create styles that won't be affected by page CSS
      const styles = `
        :host {
          all: initial !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 2147483647 !important;
        }
          .stealth-floating-panel {
          position: fixed !important;
          top: 20px !important;
          left: 20px !important;
          width: 280px !important;
          min-height: 60px !important;
          max-height: 400px !important;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
          color: #ffffff !important;
          border: 1px solid #404040 !important;
          border-radius: 12px !important;
          padding: 16px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7) !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
          font-size: 13px !important;
          line-height: 1.4 !important;
          z-index: 2147483647 !important;
          pointer-events: auto !important;
          backdrop-filter: blur(10px) !important;
          user-select: none !important;
          transition: all 0.3s ease !important;
        }
          .stealth-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          margin-bottom: 12px !important;
          padding-bottom: 8px !important;
          border-bottom: 1px solid #404040 !important;
          cursor: grab !important;
          border-radius: 4px !important;
          padding: 4px 0 8px 0 !important;
        }
        
        .stealth-header:active {
          cursor: grabbing !important;
        }
        
        .stealth-title {
          font-weight: 600 !important;
          font-size: 14px !important;
          color: #4CAF50 !important;
          margin: 0 !important;
        }
        
        .stealth-controls {
          display: flex !important;
          gap: 8px !important;
        }
        
        .stealth-control-btn {
          width: 20px !important;
          height: 20px !important;
          border: none !important;
          background: #404040 !important;
          color: #ffffff !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          font-size: 12px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: background 0.2s !important;
        }
        
        .stealth-control-btn:hover {
          background: #505050 !important;
        }
        
        .stealth-content {
          display: block !important;
        }
        
        .stealth-content.minimized {
          display: none !important;
        }
        
        .stealth-textarea {
          width: calc(100% - 16px) !important;
          height: 100px !important;
          background: #1e1e1e !important;
          color: #ffffff !important;
          border: 1px solid #505050 !important;
          border-radius: 6px !important;
          padding: 8px !important;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
          font-size: 12px !important;
          resize: vertical !important;
          outline: none !important;
          margin-bottom: 12px !important;
        }
        
        .stealth-textarea::placeholder {
          color: #888888 !important;
        }
        
        .stealth-button-group {
          display: flex !important;
          gap: 8px !important;
          flex-wrap: wrap !important;
        }
        
        .stealth-btn {
          padding: 6px 12px !important;
          background: #333333 !important;
          color: #ffffff !important;
          border: 1px solid #505050 !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          font-size: 11px !important;
          font-weight: 500 !important;
          transition: all 0.2s !important;
          outline: none !important;
        }
        
        .stealth-btn:hover {
          background: #404040 !important;
          border-color: #606060 !important;
        }
        
        .stealth-btn.success {
          background: #2e7d32 !important;
          border-color: #4caf50 !important;
        }
        
        .stealth-status {
          font-size: 11px !important;
          color: #888888 !important;
          margin-top: 8px !important;
          min-height: 14px !important;
        }      `;
      
      // Create styles element safely (CSP compliant)
      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      shadow.appendChild(styleElement);
      
      // Create DOM elements directly to avoid CSP violations
      const panelDiv = document.createElement('div');
      panelDiv.className = 'stealth-floating-panel';
      panelDiv.id = 'stealthPanel';
      
      const headerDiv = document.createElement('div');
      headerDiv.className = 'stealth-header';
        const titleDiv = document.createElement('div');
      titleDiv.className = 'stealth-title';
      titleDiv.textContent = '🤖 AI Stealth Panel';
      
      const controlsDiv = document.createElement('div');
      controlsDiv.className = 'stealth-controls';
      
      const minimizeBtn = document.createElement('button');
      minimizeBtn.className = 'stealth-control-btn';
      minimizeBtn.id = 'minimizeBtn';
      minimizeBtn.title = 'Minimize';
      minimizeBtn.textContent = '−';
      
      const closeBtn = document.createElement('button');
      closeBtn.className = 'stealth-control-btn';
      closeBtn.id = 'closeBtn';
      closeBtn.title = 'Close';
      closeBtn.textContent = '×';
      
      controlsDiv.appendChild(minimizeBtn);
      controlsDiv.appendChild(closeBtn);
      headerDiv.appendChild(titleDiv);
      headerDiv.appendChild(controlsDiv);
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'stealth-content';
      contentDiv.id = 'stealthContent';
      
      const textarea = document.createElement('textarea');
      textarea.className = 'stealth-textarea';
      textarea.id = 'stealthTextarea';
      textarea.placeholder = 'Enter text or extracted content will appear here...';
      
      const buttonGroupDiv = document.createElement('div');
      buttonGroupDiv.className = 'stealth-button-group';
      
      const extractBtn = document.createElement('button');
      extractBtn.className = 'stealth-btn';
      extractBtn.id = 'extractBtn';
      extractBtn.textContent = 'Extract Canvas';
      
      const copyBtn = document.createElement('button');
      copyBtn.className = 'stealth-btn';
      copyBtn.id = 'copyBtn';
      copyBtn.textContent = 'Copy Text';
      
      const sendBtn = document.createElement('button');
      sendBtn.className = 'stealth-btn';
      sendBtn.id = 'sendBtn';
      sendBtn.textContent = 'Send to Backend';
      
      const clearBtn = document.createElement('button');
      clearBtn.className = 'stealth-btn';
      clearBtn.id = 'clearBtn';
      clearBtn.textContent = 'Clear';
      
      buttonGroupDiv.appendChild(extractBtn);
      buttonGroupDiv.appendChild(copyBtn);
      buttonGroupDiv.appendChild(sendBtn);
      buttonGroupDiv.appendChild(clearBtn);
      
      const statusDiv = document.createElement('div');
      statusDiv.className = 'stealth-status';
      statusDiv.id = 'stealthStatus';
      statusDiv.textContent = 'Ready';
      
      contentDiv.appendChild(textarea);
      contentDiv.appendChild(buttonGroupDiv);
      contentDiv.appendChild(statusDiv);
      
      panelDiv.appendChild(headerDiv);
      panelDiv.appendChild(contentDiv);
      
      shadow.appendChild(panelDiv);
      
      // Add event listeners with stealth approach
      addStealthEventListeners(shadow);
      
      // Insert into DOM at the very end to minimize detection
      const insertTarget = document.documentElement || document.body || document.head;
      if (insertTarget) {
        insertTarget.appendChild(container);
        updateStatus(shadow, 'Panel injected successfully');
      }
      
    } catch (error) {
      console.log('Stealth injection failed:', error);
      // Fallback to simpler injection
      createFallbackPanel();
    }
  }
  
  function addStealthEventListeners(shadow) {
    const extractBtn = shadow.getElementById('extractBtn');
    const copyBtn = shadow.getElementById('copyBtn');
    const sendBtn = shadow.getElementById('sendBtn');
    const clearBtn = shadow.getElementById('clearBtn');
    const minimizeBtn = shadow.getElementById('minimizeBtn');
    const closeBtn = shadow.getElementById('closeBtn');
    const textarea = shadow.getElementById('stealthTextarea');
    const content = shadow.getElementById('stealthContent');
    const panel = shadow.getElementById('stealthPanel');
    
    let isMinimized = false;
    
    // Use custom event handling to avoid detection
    extractBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      extractCanvasData(shadow);
    });
    
    copyBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(textarea.value, shadow);
    });
    
    sendBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      sendToBackend(textarea.value, shadow);
    });
    
    clearBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      textarea.value = '';
      updateStatus(shadow, 'Cleared');
    });
    
    minimizeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      isMinimized = !isMinimized;
      if (isMinimized) {
        content.classList.add('minimized');
        minimizeBtn.textContent = '+';
        panel.style.minHeight = '60px';
      } else {
        content.classList.remove('minimized');
        minimizeBtn.textContent = '−';
        panel.style.minHeight = '200px';
      }
    });
    
    closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const container = shadow.host;
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
    
    // Make panel draggable
    makeDraggable(panel, shadow.querySelector('.stealth-header'));
  }
  
  function extractCanvasData(shadow) {
    updateStatus(shadow, 'Extracting canvas data...');
    
    const canvases = document.querySelectorAll('canvas');
    const textarea = shadow.getElementById('stealthTextarea');
    
    if (canvases.length === 0) {
      textarea.value = 'No canvas elements found on this page.';
      updateStatus(shadow, 'No canvas found');
      return;
    }
    
    let extractedData = `Canvas Extraction Results (${new Date().toLocaleTimeString()}):\n\n`;
    let successCount = 0;
    
    canvases.forEach((canvas, index) => {
      try {
        const dataURL = canvas.toDataURL('image/png');
        extractedData += `Canvas ${index + 1}:\n`;
        extractedData += `Size: ${canvas.width}x${canvas.height}\n`;
        extractedData += `Data URL: ${dataURL.substring(0, 100)}...\n\n`;
        
        // Send to background script for processing
        chrome.runtime.sendMessage({
          action: 'canvasData',
          data: {
            index: index,
            dataURL: dataURL,
            width: canvas.width,
            height: canvas.height,
            url: window.location.href
          }
        });
        
        successCount++;
      } catch (error) {
        extractedData += `Canvas ${index + 1}: Access denied (${error.message})\n\n`;
      }
    });
    
    textarea.value = extractedData;
    updateStatus(shadow, `Extracted ${successCount}/${canvases.length} canvas elements`);
  }
  
  function copyToClipboard(text, shadow) {
    if (!text.trim()) {
      updateStatus(shadow, 'Nothing to copy');
      return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
      updateStatus(shadow, 'Copied to clipboard');
      const copyBtn = shadow.getElementById('copyBtn');
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('success');
      setTimeout(() => {
        copyBtn.textContent = 'Copy Text';
        copyBtn.classList.remove('success');
      }, 1500);
    }).catch(() => {
      updateStatus(shadow, 'Copy failed');
    });
  }
  
  function sendToBackend(data, shadow) {
    if (!data.trim()) {
      updateStatus(shadow, 'Nothing to send');
      return;
    }
    
    updateStatus(shadow, 'Sending to backend...');
    
    chrome.runtime.sendMessage({
      action: 'sendToBackend',
      data: data
    });
    
    const sendBtn = shadow.getElementById('sendBtn');
    sendBtn.textContent = 'Sent!';
    sendBtn.classList.add('success');
    updateStatus(shadow, 'Data sent to backend');
    
    setTimeout(() => {
      sendBtn.textContent = 'Send to Backend';
      sendBtn.classList.remove('success');
    }, 1500);
  }
  
  function updateStatus(shadow, message) {
    const statusEl = shadow.getElementById('stealthStatus');
    if (statusEl) {
      statusEl.textContent = message;
    }
  }
  
  function makeDraggable(panel, header) {
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      
      const rect = panel.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      
      header.style.cursor = 'grabbing';
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      panel.style.left = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, initialX + dx)) + 'px';
      panel.style.top = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, initialY + dy)) + 'px';
      panel.style.right = 'auto';
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = 'grab';
      }
    });
  }
  
  function createFallbackPanel() {
    // Simple fallback if shadow DOM fails
    if (document.getElementById('stealth-fallback-panel')) return;
      const panel = document.createElement('div');
    panel.id = 'stealth-fallback-panel';
      // Set styles individually to avoid CSP violations
    panel.style.position = 'fixed';
    panel.style.top = '20px';
    panel.style.left = '20px';
    panel.style.width = '200px';
    panel.style.height = '150px';
    panel.style.background = 'rgba(0, 0, 0, 0.95)';
    panel.style.color = 'white';
    panel.style.border = '1px solid #333';
    panel.style.borderRadius = '8px';
    panel.style.padding = '10px';
    panel.style.zIndex = '2147483647';
    panel.style.fontFamily = 'monospace';
    panel.style.fontSize = '12px';// Create elements using DOM methods to avoid CSP issues
    const title = document.createElement('div');
    title.textContent = 'Stealth Panel';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '8px';
    
    const textarea = document.createElement('textarea');
    textarea.id = 'fallback-textarea';
    textarea.style.width = '100%';
    textarea.style.height = '60px';
    textarea.style.background = '#222';
    textarea.style.color = 'white';
    textarea.style.border = '1px solid #555';
    
    const extractBtn = document.createElement('button');
    extractBtn.id = 'fallback-extract';
    extractBtn.textContent = 'Extract';
    extractBtn.style.marginTop = '5px';
    extractBtn.style.padding = '4px';
    extractBtn.style.background = '#333';
    extractBtn.style.color = 'white';
    extractBtn.style.border = '1px solid #555';
    
    panel.appendChild(title);
    panel.appendChild(textarea);
    panel.appendChild(extractBtn);
    
    document.body.appendChild(panel);
    
    extractBtn.addEventListener('click', () => {
      const canvases = document.querySelectorAll('canvas');
      
      if (canvases.length > 0) {
        try {
          const canvas = canvases[0];
          const dataURL = canvas.toDataURL();
          textarea.value = `Canvas found: ${canvas.width}x${canvas.height}`;
        } catch (error) {
          textarea.value = 'Canvas access denied';
        }
      } else {
        textarea.value = 'No canvas found';
      }
    });
  }

  // ⭐ NEW: Listen for modal creation messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'createResponseModal') {
    createResponseModal(
      request.data.question,
      request.data.responseText,
      request.data.source,
      request.data.confidence
    );
    sendResponse({success: true});
  } else if (request.action === 'createErrorModal') {
    createErrorModal(request.data.errorMessage);
    sendResponse({success: true});
  }
  // ...existing message handling...
});

// ⭐ NEW: Create response modal on the same page
function createResponseModal(question, responseText, source, confidence) {
  console.log('🎨 Creating response modal on page...');
  
  // Remove any existing modal first
  const existingModal = document.querySelector('#stealth-response-modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.id = 'stealth-response-modal';
  modalContainer.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.8) !important;
    z-index: 2147483647 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    backdrop-filter: blur(5px) !important;
  `;
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
    color: white !important;
    border-radius: 16px !important;
    padding: 32px !important;
    max-width: 800px !important;
    max-height: 80vh !important;
    width: 90vw !important;
    overflow-y: auto !important;
    border: 2px solid #4CAF50 !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9) !important;
    position: relative !important;
  `;
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position: absolute !important;
    top: 16px !important;
    right: 16px !important;
    background: #666 !important;
    border: none !important;
    border-radius: 50% !important;
    width: 32px !important;
    height: 32px !important;
    color: white !important;
    font-size: 20px !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 1 !important;
  `;
  
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = '#888';
  });
  
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = '#666';
  });
  
  closeBtn.addEventListener('click', () => {
    modalContainer.remove();
  });
  
  // Create header
  const header = document.createElement('div');
  header.style.cssText = `
    text-align: center !important;
    margin-bottom: 24px !important;
    padding-bottom: 16px !important;
    border-bottom: 2px solid rgba(76, 175, 80, 0.3) !important;
  `;
  
  const title = document.createElement('h1');
  title.textContent = '🤖 AI Response';
  title.style.cssText = `
    font-size: 24px !important;
    margin: 0 !important;
    color: #4CAF50 !important;
    font-weight: 600 !important;
  `;
  
  header.appendChild(title);
  
  // Create question section
  const questionSection = document.createElement('div');
  questionSection.style.cssText = `
    margin-bottom: 24px !important;
  `;
  
  const questionLabel = document.createElement('div');
  questionLabel.textContent = 'Your Question';
  questionLabel.style.cssText = `
    font-size: 12px !important;
    font-weight: 600 !important;
    color: #888 !important;
    margin-bottom: 8px !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
  `;
  
  const questionText = document.createElement('div');
  questionText.textContent = question;
  questionText.style.cssText = `
    background: rgba(76, 175, 80, 0.1) !important;
    padding: 12px !important;
    border-radius: 8px !important;
    border-left: 4px solid #4CAF50 !important;
    font-style: italic !important;
    color: #fff !important;
  `;
  
  questionSection.appendChild(questionLabel);
  questionSection.appendChild(questionText);
  
  // Create response section
  const responseSection = document.createElement('div');
  responseSection.style.cssText = `
    margin-bottom: 24px !important;
  `;
  
  const responseLabel = document.createElement('div');
  responseLabel.textContent = 'AI Response';
  responseLabel.style.cssText = `
    font-size: 12px !important;
    font-weight: 600 !important;
    color: #888 !important;
    margin-bottom: 8px !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
  `;
  
  const responseTextDiv = document.createElement('div');
  responseTextDiv.innerHTML = responseText
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #4CAF50;">$1</strong>')
    .replace(/\`(.*?)\`/g, '<code style="background: rgba(255, 255, 255, 0.1); padding: 2px 6px; border-radius: 4px; font-family: Monaco, monospace;">$1</code>')
    .replace(/\n/g, '<br>');
  
  responseTextDiv.style.cssText = `
    background: rgba(255, 255, 255, 0.05) !important;
    padding: 16px !important;
    border-radius: 8px !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
    font-size: 14px !important;
    line-height: 1.6 !important;
    color: #fff !important;
  `;
  
  responseSection.appendChild(responseLabel);
  responseSection.appendChild(responseTextDiv);
  
  // Create meta info
  const metaInfo = document.createElement('div');
  metaInfo.style.cssText = `
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 16px 0 !important;
    border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
    font-size: 12px !important;
    color: #888 !important;
    margin-bottom: 16px !important;
  `;
  
  const sourceInfo = document.createElement('span');
  sourceInfo.innerHTML = `Source: <strong style="color: #4CAF50;">${source}</strong> | Confidence: ${Math.round(confidence * 100)}%`;
  
  const timeInfo = document.createElement('span');
  timeInfo.textContent = `Generated at ${new Date().toLocaleString()}`;
  
  metaInfo.appendChild(sourceInfo);
  metaInfo.appendChild(timeInfo);
  
  // Create action buttons
  const actionButtons = document.createElement('div');
  actionButtons.style.cssText = `
    display: flex !important;
    gap: 12px !important;
    justify-content: center !important;
  `;
  
  const copyBtn = document.createElement('button');
  copyBtn.textContent = '📋 Copy Response';
  copyBtn.style.cssText = `
    padding: 10px 20px !important;
    background: #333 !important;
    color: white !important;
    border: 1px solid #555 !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    font-size: 13px !important;
    transition: all 0.2s !important;
  `;
  
  copyBtn.addEventListener('mouseenter', () => {
    copyBtn.style.background = '#444';
  });
  
  copyBtn.addEventListener('mouseleave', () => {
    copyBtn.style.background = '#333';
  });
  
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(responseText).then(() => {
      copyBtn.textContent = '✅ Copied!';
      copyBtn.style.background = '#2e7d32';
      setTimeout(() => {
        copyBtn.textContent = '📋 Copy Response';
        copyBtn.style.background = '#333';
      }, 2000);
    });
  });
  
  const closeModalBtn = document.createElement('button');
  closeModalBtn.textContent = '✓ Close';
  closeModalBtn.style.cssText = `
    padding: 10px 20px !important;
    background: #2e7d32 !important;
    color: white !important;
    border: 1px solid #4CAF50 !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    font-size: 13px !important;
    transition: all 0.2s !important;
  `;
  
  closeModalBtn.addEventListener('mouseenter', () => {
    closeModalBtn.style.background = '#388e3c';
  });
  
  closeModalBtn.addEventListener('mouseleave', () => {
    closeModalBtn.style.background = '#2e7d32';
  });
  
  closeModalBtn.addEventListener('click', () => {
    modalContainer.remove();
  });
  
  actionButtons.appendChild(copyBtn);
  actionButtons.appendChild(closeModalBtn);
  
  // Assemble modal content
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(header);
  modalContent.appendChild(questionSection);
  modalContent.appendChild(responseSection);
  modalContent.appendChild(metaInfo);
  modalContent.appendChild(actionButtons);
  
  modalContainer.appendChild(modalContent);
  
  // Add keyboard shortcuts
  const handleKeyboard = (e) => {
    if (e.key === 'Escape') {
      modalContainer.remove();
      document.removeEventListener('keydown', handleKeyboard);
    } else if (e.ctrlKey && e.key === 'c') {
      navigator.clipboard.writeText(responseText);
    }
  };
  
  document.addEventListener('keydown', handleKeyboard);
  
  // Close modal when clicking outside content
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      modalContainer.remove();
      document.removeEventListener('keydown', handleKeyboard);
    }
  });
  
  // Add to page
  document.documentElement.appendChild(modalContainer);
  
  console.log('✅ Response modal created on page!');
}

// ⭐ NEW: Create error modal on the same page
function createErrorModal(errorMessage) {
  console.log('❌ Creating error modal on page...');
  
  // Remove any existing modal first
  const existingModal = document.querySelector('#stealth-error-modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.id = 'stealth-error-modal';
  modalContainer.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.8) !important;
    z-index: 2147483647 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    backdrop-filter: blur(5px) !important;
  `;
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
    color: white !important;
    border-radius: 16px !important;
    padding: 32px !important;
    max-width: 600px !important;
    width: 90vw !important;
    border: 2px solid #f44336 !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9) !important;
    text-align: center !important;
    position: relative !important;
  `;
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position: absolute !important;
    top: 16px !important;
    right: 16px !important;
    background: #666 !important;
    border: none !important;
    border-radius: 50% !important;
    width: 32px !important;
    height: 32px !important;
    color: white !important;
    font-size: 20px !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  `;
  
  closeBtn.addEventListener('click', () => {
    modalContainer.remove();
  });
  
  // Create error content
  const errorIcon = document.createElement('div');
  errorIcon.textContent = '❌';
  errorIcon.style.cssText = `
    font-size: 48px !important;
    margin-bottom: 16px !important;
  `;
  
  const errorTitle = document.createElement('h1');
  errorTitle.textContent = 'Backend Connection Failed';
  errorTitle.style.cssText = `
    font-size: 20px !important;
    color: #f44336 !important;
    margin: 0 0 16px 0 !important;
  `;
  
  const errorText = document.createElement('div');
  errorText.textContent = errorMessage;
  errorText.style.cssText = `
    background: rgba(244, 67, 54, 0.1) !important;
    padding: 16px !important;
    border-radius: 8px !important;
    border-left: 4px solid #f44336 !important;
    margin-bottom: 16px !important;
    white-space: pre-wrap !important;
    font-size: 14px !important;
  `;
  
  const suggestion = document.createElement('div');
  suggestion.innerHTML = '<strong>💡 Suggestion:</strong><br>Make sure the backend server is running on localhost:8000 and Ollama is available';
  suggestion.style.cssText = `
    background: rgba(255, 167, 38, 0.1) !important;
    padding: 16px !important;
    border-radius: 8px !important;
    border-left: 4px solid #ffa726 !important;
    color: #ffa726 !important;
    margin-bottom: 24px !important;
    font-size: 14px !important;
  `;
  
  const closeModalBtn = document.createElement('button');
  closeModalBtn.textContent = 'Close';
  closeModalBtn.style.cssText = `
    padding: 12px 24px !important;
    background: #333 !important;
    color: white !important;
    border: 1px solid #555 !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    font-size: 14px !important;
  `;
  
  closeModalBtn.addEventListener('click', () => {
    modalContainer.remove();
  });
  
  // Assemble modal content
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(errorIcon);
  modalContent.appendChild(errorTitle);
  modalContent.appendChild(errorText);
  modalContent.appendChild(suggestion);
  modalContent.appendChild(closeModalBtn);
  
  modalContainer.appendChild(modalContent);
  
  // Add keyboard shortcuts
  const handleKeyboard = (e) => {
    if (e.key === 'Escape') {
      modalContainer.remove();
      document.removeEventListener('keydown', handleKeyboard);
    }
  };
  
  document.addEventListener('keydown', handleKeyboard);
  
  // Close modal when clicking outside content
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      modalContainer.remove();
    }
  });
  
  // Add to page
  document.documentElement.appendChild(modalContainer);
  
  console.log('✅ Error modal created on page!');
}
  
  // Initialize with delay to avoid detection
  setTimeout(initStealthInjection, 100);
  
})();