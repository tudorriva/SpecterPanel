// Background script for stealth injection - COMPLETE VERSION
// ⭐ FIXED: Track both tab updates and navigation to handle refreshes
let injectedTabs = new Set();

// Listen for tab updates - automatic injection with refresh detection
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    console.log('🎯 Page completed loading:', tab.url);
    
    // ⭐ FIXED: Always remove from injectedTabs on page complete to handle refreshes
    if (injectedTabs.has(tabId)) {
      console.log('🔄 Page refresh detected, clearing injection status for tab:', tabId);
      injectedTabs.delete(tabId);
    }
    
    console.log('🚀 Auto-injecting into tab:', tabId);
    injectStealthPanel(tabId);
  }
});


// ⭐ NEW: Listen for tab replacement (happens on some refreshes)
chrome.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
  console.log('🔄 Tab replaced:', removedTabId, '->', addedTabId);
  injectedTabs.delete(removedTabId);
  injectedTabs.delete(addedTabId); // Clear the new tab too, just in case
});

// ⭐ NEW: Listen for tab removal to clean up tracking
chrome.tabs.onRemoved.addListener((tabId) => {
  console.log('🗑️ Tab removed:', tabId);
  injectedTabs.delete(tabId);
});

// Listen for messages from injected panels
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendToBackend') {
    console.log('📤 Received sendToBackend request:', request.data);
    sendToLocalBackend(request.data);
    sendResponse({ success: true });
  } else if (request.action === 'forceInject') {
    // ⭐ FIXED: Force inject should always work, even if tab is marked as injected
    console.log('🔧 Force inject requested for tab:', request.tabId);
    injectedTabs.delete(request.tabId); // Clear the flag first
    injectStealthPanel(request.tabId);
    sendResponse({ success: true });
  }
});

// ⭐ ENHANCED: Injection function with better duplicate detection
async function injectStealthPanel(tabId) {
  try {
    console.log('🎯 Attempting to inject panel into tab:', tabId);
    
    // ⭐ IMPROVED: Check if panel actually exists in the page before skipping
    if (injectedTabs.has(tabId)) {
      console.log('⚠️ Tab marked as injected, verifying panel actually exists...');
      
      try {
        const verifyResult = await chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => {
            const panel = document.querySelector('#stealth-panel-host');
            return {
              exists: !!panel,
              visible: panel ? (panel.style.display !== 'none' && panel.offsetWidth > 0) : false
            };
          }
        });
        
        const panelStatus = verifyResult[0].result;
        console.log('🔍 Panel verification result:', panelStatus);
        
        if (panelStatus.exists && panelStatus.visible) {
          console.log('✅ Panel already exists and is visible, skipping injection');
          return;
        } else {
          console.log('🚨 Panel missing or hidden, clearing injection flag and re-injecting');
          injectedTabs.delete(tabId);
        }
      } catch (verifyError) {
        console.log('🚨 Panel verification failed, clearing injection flag:', verifyError.message);
        injectedTabs.delete(tabId);
      }
    }
    
    console.log('🏗️ Injecting stealth panel...');
    
    // ⭐ ONLY inject the clean panel function
    const result = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: initSingleStealthPanel,
    });
    
    console.log('✅ Script injection completed:', result);
    injectedTabs.add(tabId);
    
    // Test if panel exists after injection
    setTimeout(async () => {
      try {
        const testResult = await chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => {
            const panel = document.querySelector('#stealth-panel-host');
            return {
              exists: !!panel,
              visible: panel ? panel.style.display !== 'none' : false,
              position: panel ? panel.getBoundingClientRect() : null,
              injectFlag: window.stealthPanelInjected || false
            };
          }
        });
        const status = testResult[0].result;
        console.log('🔍 Panel test result:', status);
        
        if (!status.exists || !status.visible) {
          console.log('❌ Panel injection failed or panel not visible');
          injectedTabs.delete(tabId); // Remove failed injection from tracking
        }
      } catch (testError) {
        console.log('🔍 Panel test failed:', testError);
        injectedTabs.delete(tabId); // Remove failed injection from tracking
      }
    }, 500);
    
  } catch (error) {
    console.log('💥 Injection failed:', error);
    console.log('Error details:', error.message);
    injectedTabs.delete(tabId); // Remove failed injection from tracking
  }
}

// ⭐ STEALTH: Replace initSingleStealthPanel function with shadow DOM version
function initSingleStealthPanel() {
  console.log('🎯 initSingleStealthPanel called');
  
  // ⭐ STEALTH: Check for existing shadow hosts
  const existingShadow = document.querySelector('#stealth-shadow-host');
  if (existingShadow && window.stealthPanelInjected) {
    console.log('⚠️ Shadow panel already exists, skipping');
    return;
  }
  
  console.log('🧹 Removing any existing panels...');
  // Remove any existing panels
  const existingPanels = document.querySelectorAll('#stealth-panel-host, #stealth-shadow-host, #stealth-injector-panel');
  existingPanels.forEach(panel => panel.remove());
  
  // ⭐ STEALTH: Create shadow DOM container
  const shadowHost = document.createElement('div');
  shadowHost.id = 'stealth-shadow-host';
  shadowHost.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    z-index: 2147483647 !important;
    pointer-events: none !important;
  `;
  
  // ⭐ STEALTH: Create closed shadow root (completely hidden from DOM queries)
  const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });
  
  // ⭐ STEALTH: Store shadow root reference in a non-obvious way
  Object.defineProperty(window, '__sr__', {
    value: shadowRoot,
    writable: false,
    enumerable: false,
    configurable: false
  });
  
  // Create styles inside shadow DOM
  const style = document.createElement('style');
  style.textContent = `
    .stealth-panel {
      width: 280px;
      min-height: 200px;
      background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.95) 100%);
      color: white;
      border: 2px solid #4CAF50;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      pointer-events: auto;
      font-size: 13px;
      line-height: 1.4;
      resize: both;
      overflow: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .stealth-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #404040;
      cursor: grab;
    }
    
    .stealth-title {
      font-weight: bold;
      color: #4CAF50;
      font-size: 14px;
      margin: 0;
    }
    
    .stealth-btn {
      padding: 2px 8px;
      background: #666;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      color: white;
      font-size: 14px;
    }
    
    .stealth-textarea {
      width: calc(100% - 12px);
      height: 80px;
      background: #222;
      color: white;
      border: 1px solid #555;
      border-radius: 6px;
      padding: 8px;
      resize: vertical;
      font-family: inherit;
      font-size: 12px;
      margin-bottom: 12px;
      outline: none;
    }
    
    .stealth-textarea:focus {
      border-color: #4CAF50;
    }
    
    .stealth-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .stealth-action-btn {
      padding: 6px 12px;
      background: #333;
      color: white;
      border: 1px solid #555;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
      flex: 1;
      min-width: 60px;
    }
    
    .stealth-action-btn:hover {
      background: #444;
    }
    
    .stealth-send-btn {
      background: #2e7d32;
      border-color: #4CAF50;
    }
    
    .stealth-send-btn:hover {
      background: #388e3c;
    }
  `;
  
  // Create panel structure
  const panel = document.createElement('div');
  panel.className = 'stealth-panel';
  
  const header = document.createElement('div');
  header.className = 'stealth-header';
  
  const title = document.createElement('div');
  title.className = 'stealth-title';
  title.textContent = '🥷 Stealth Panel';
  
  const minimizeBtn = document.createElement('button');
  minimizeBtn.className = 'stealth-btn';
  minimizeBtn.textContent = '−';
  
  header.appendChild(title);
  header.appendChild(minimizeBtn);
  
  const content = document.createElement('div');
  content.className = 'stealth-content';
  
  const textarea = document.createElement('textarea');
  textarea.className = 'stealth-textarea';
  textarea.placeholder = 'Enter your question here...';
  
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'stealth-buttons';
  
  const copyBtn = document.createElement('button');
  copyBtn.className = 'stealth-action-btn';
  copyBtn.textContent = '📋 Copy';
  
  const extractBtn = document.createElement('button');
  extractBtn.className = 'stealth-action-btn';
  extractBtn.textContent = '🎯 Extract';
  
  const sendBtn = document.createElement('button');
  sendBtn.className = 'stealth-action-btn stealth-send-btn';
  sendBtn.textContent = '🚀 Send';
  
  // ⭐ STEALTH: Add event listeners using object properties (harder to detect)
  const handlers = {
    copy: () => {
      if (textarea.value.trim()) {
        navigator.clipboard.writeText(textarea.value).then(() => {
          copyBtn.textContent = '✅ Copied!';
          setTimeout(() => copyBtn.textContent = '📋 Copy', 1500);
        }).catch(() => {
          copyBtn.textContent = '❌ Failed';
          setTimeout(() => copyBtn.textContent = '📋 Copy', 1500);
        });
      } else {
        copyBtn.textContent = '⚠️ Empty';
        setTimeout(() => copyBtn.textContent = '📋 Copy', 1500);
      }
    },
    
    extract: () => {
      const canvases = document.querySelectorAll('canvas');
      if (canvases.length === 0) {
        textarea.value = 'No canvas elements found on this page.';
        return;
      }
      
      let extractedData = `Found ${canvases.length} canvas element(s):\n\n`;
      canvases.forEach((canvas, index) => {
        try {
          const dataURL = canvas.toDataURL();
          extractedData += `Canvas ${index + 1}:\n`;
          extractedData += `Size: ${canvas.width}x${canvas.height}\n`;
          extractedData += `Data: ${dataURL.substring(0, 100)}...\n\n`;
        } catch (error) {
          extractedData += `Canvas ${index + 1}: Access denied (${error.message})\n\n`;
        }
      });
      
      textarea.value = extractedData;
      extractBtn.textContent = '✅ Extracted!';
      setTimeout(() => extractBtn.textContent = '🎯 Extract', 1500);
    },
    
    send: () => {
      const question = textarea.value.trim();
      if (!question) {
        sendBtn.textContent = '⚠️ Empty';
        setTimeout(() => sendBtn.textContent = '🚀 Send', 1500);
        return;
      }
      
      sendBtn.textContent = '⏳ Sending...';
      sendBtn.disabled = true;
      
      // ⭐ STEALTH: Use message passing instead of direct calls
      chrome.runtime.sendMessage({
        action: 'sendToBackend',
        data: question
      }, (response) => {
        sendBtn.textContent = '✅ Sent!';
        sendBtn.disabled = false;
        setTimeout(() => sendBtn.textContent = '🚀 Send', 2000);
      });
    },
    
    minimize: () => {
      const isMinimized = content.style.display === 'none';
      if (isMinimized) {
        content.style.display = 'block';
        minimizeBtn.textContent = '−';
        panel.style.minHeight = '200px';
      } else {
        content.style.display = 'none';
        minimizeBtn.textContent = '+';
        panel.style.minHeight = '40px';
      }
    }
  };
  
  // ⭐ STEALTH: Assign handlers using object properties (not addEventListener)
  copyBtn.onclick = handlers.copy;
  extractBtn.onclick = handlers.extract;
  sendBtn.onclick = handlers.send;
  minimizeBtn.onclick = handlers.minimize;
  
  // ⭐ STEALTH: Draggable functionality with reduced DOM queries
  let dragState = { isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 };
  
  header.onmousedown = (e) => {
    dragState.isDragging = true;
    dragState.startX = e.clientX;
    dragState.startY = e.clientY;
    
    const rect = shadowHost.getBoundingClientRect();
    dragState.initialX = rect.left;
    dragState.initialY = rect.top;
    
    header.style.cursor = 'grabbing';
    e.preventDefault();
  };
  
  document.onmousemove = (e) => {
    if (!dragState.isDragging) return;
    
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 280, dragState.initialX + dx));
    const newY = Math.max(0, Math.min(window.innerHeight - 200, dragState.initialY + dy));
    
    shadowHost.style.left = newX + 'px';
    shadowHost.style.top = newY + 'px';
    shadowHost.style.right = 'auto';
  };
  
  document.onmouseup = () => {
    if (dragState.isDragging) {
      dragState.isDragging = false;
      header.style.cursor = 'grab';
    }
  };
  
  // Assemble panel
  buttonContainer.appendChild(copyBtn);
  buttonContainer.appendChild(extractBtn);
  buttonContainer.appendChild(sendBtn);
  
  content.appendChild(textarea);
  content.appendChild(buttonContainer);
  
  panel.appendChild(header);
  panel.appendChild(content);
  
  // ⭐ STEALTH: Add to shadow DOM (completely hidden from external queries)
  shadowRoot.appendChild(style);
  shadowRoot.appendChild(panel);
  
  // ⭐ STEALTH: Add to DOM using a common, innocent method
  document.documentElement.appendChild(shadowHost);
  
  // ⭐ STEALTH: Mark as injected using non-obvious property
  Object.defineProperty(window, '__sp_init__', {
    value: Date.now(),
    writable: false,
    enumerable: false,
    configurable: false
  });
  
  console.log('✅ Stealth shadow panel created successfully!');
}

// ⭐ FIXED: Only try modal, no tab fallback
async function sendToLocalBackend(question) {
  console.log('📤 Sending to backend:', question);
  
  try {
    const response = await fetch('http://localhost:8000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question,
        context: '',
        timestamp: Date.now()
      })
    });
    
    console.log('📡 Backend response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Backend response:', result);
      
      // Extract response data
      let responseText = 'No response received';
      let source = 'backend';
      let confidence = 1.0;
      
      if (result.success && result.answer) {
        responseText = result.answer;
        source = result.source || 'AI Backend';
        confidence = result.confidence || 1.0;
      } else if (result.answer) {
        responseText = result.answer;
        source = result.source || 'AI Backend';
        confidence = result.confidence || 1.0;
      } else {
        responseText = JSON.stringify(result, null, 2);
        source = 'Raw Backend Response';
        confidence = 0.5;
      }
      
      // ⭐ FIXED: Only try modal, no fallback tab
      const modalSuccess = await tryCreateModal({
        question: question,
        responseText: responseText,
        source: source,
        confidence: confidence
      });
      
      if (!modalSuccess) {
        console.log('ℹ️ Modal creation failed, no fallback action taken');
      }
      
    } else {
      const errorText = await response.text();
      console.error('❌ Backend error:', response.status, errorText);
      
      // ⭐ FIXED: Only try error modal, no fallback tab
      await tryCreateErrorModal(`Backend returned ${response.status}: ${response.statusText}\n\n${errorText}`);
    }
    
  } catch (error) {
    console.error('💥 Backend connection failed:', error);
    
    // ⭐ FIXED: Only try error modal, no fallback tab
    await tryCreateErrorModal(`Connection failed: ${error.message}\n\nMake sure the backend server is running on localhost:8000`);
  }
}

// ⭐ NEW: Try to create modal, return success/failure (no tab fallback)
async function tryCreateModal(modalData) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // ⭐ Skip modal for system pages
    if (!tab || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('moz-extension://') || tab.url.startsWith('edge://')) {
      console.log('ℹ️ System page detected, cannot create modal');
      return false;
    }
    
    console.log('🔍 Trying to create modal on page:', tab.url);
    
    // Try to inject content script first
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      console.log('✅ Content script injected');
    } catch (injectionError) {
      console.log('ℹ️ Content script injection failed:', injectionError.message);
      return false;
    }
    
    // Wait for content script to initialize
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Try to send modal creation message
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'createResponseModal',
        data: modalData
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('ℹ️ Modal message failed:', chrome.runtime.lastError.message);
          resolve(false);
        } else {
          console.log('✅ Modal created successfully');
          resolve(true);
        }
      });
    });
    
  } catch (error) {
    console.log('ℹ️ Modal creation failed:', error.message);
    return false;
  }
}

// ⭐ NEW: Try to create error modal (no tab fallback)
async function tryCreateErrorModal(errorMessage) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // ⭐ Skip modal for system pages
    if (!tab || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('moz-extension://') || tab.url.startsWith('edge://')) {
      console.log('ℹ️ System page detected, cannot create error modal');
      return false;
    }
    
    console.log('🔍 Trying to create error modal on page:', tab.url);
    
    // Try to inject content script first
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      console.log('✅ Content script injected for error modal');
    } catch (injectionError) {
      console.log('ℹ️ Content script injection failed for error modal:', injectionError.message);
      return false;
    }
    
    // Wait for content script to initialize
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Try to send error modal creation message
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'createErrorModal',
        data: { errorMessage: errorMessage }
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('ℹ️ Error modal message failed:', chrome.runtime.lastError.message);
          resolve(false);
        } else {
          console.log('✅ Error modal created successfully');
          resolve(true);
        }
      });
    });
    
  } catch (error) {
    console.log('ℹ️ Error modal creation failed:', error.message);
    return false;
  }
}