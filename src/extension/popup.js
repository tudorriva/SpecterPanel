// Popup script for Stealth Injector extension
document.addEventListener('DOMContentLoaded', function() {
  const injectBtn = document.getElementById('injectBtn');
  const extractBtn = document.getElementById('extractBtn');
  const toggleBtn = document.getElementById('toggleBtn');
  const testConnectionBtn = document.getElementById('testConnectionBtn');
  const autoInjectToggle = document.getElementById('autoInjectToggle');
  const stealthModeToggle = document.getElementById('stealthModeToggle');
  const backendUrl = document.getElementById('backendUrl');
  const statusDisplay = document.getElementById('statusDisplay');
  
  // Load saved settings
  chrome.storage.sync.get({
    autoInject: true,
    stealthMode: true,
    backendUrl: 'http://localhost:8000'
  }, function(items) {
    autoInjectToggle.classList.toggle('active', items.autoInject);
    stealthModeToggle.classList.toggle('active', items.stealthMode);
    backendUrl.value = items.backendUrl;
  });
  
  // Update status
  function updateStatus(message, isError = false) {
    statusDisplay.textContent = message;
    statusDisplay.style.color = isError ? '#ff6b6b' : '#4CAF50';
    setTimeout(() => {
      statusDisplay.style.color = '#888';
    }, 3000);
  }
  
  // Inject panel into current tab
  injectBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        updateStatus('Cannot inject into Chrome system pages', true);
        return;      }
      
      // Send message to background script to inject
      chrome.runtime.sendMessage({
        action: 'forceInject',
        tabId: tab.id
      }, (response) => {
        if (response && response.success) {
          updateStatus('Panel injected successfully!');
        } else {
          updateStatus('Injection failed - check console', true);
        }
      });
      
    } catch (error) {
      updateStatus('Error: ' + error.message, true);
    }
  });
  
  // Extract canvas data from current tab
  extractBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const canvases = document.querySelectorAll('canvas');
          const results = [];
          
          canvases.forEach((canvas, index) => {
            try {
              const dataURL = canvas.toDataURL('image/png');
              results.push({
                index: index,
                width: canvas.width,
                height: canvas.height,
                dataURL: dataURL.substring(0, 200) + '...',
                success: true
              });
            } catch (error) {
              results.push({
                index: index,
                width: canvas.width,
                height: canvas.height,
                error: error.message,
                success: false
              });
            }
          });
          
          return results;
        }
      }).then((results) => {
        const data = results[0].result;
        if (data.length === 0) {
          updateStatus('No canvas elements found');
        } else {
          const successCount = data.filter(item => item.success).length;
          updateStatus(`Found ${data.length} canvas elements, extracted ${successCount}`);
          
          // Store results for viewing
          chrome.storage.local.set({
            lastCanvasExtraction: {
              timestamp: Date.now(),
              url: tab.url,
              data: data
            }
          });
        }
      }).catch(error => {
        updateStatus('Canvas extraction failed: ' + error.message, true);
      });
      
    } catch (error) {
      updateStatus('Error: ' + error.message, true);
    }
  });
  
  // Toggle panel visibility
  toggleBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const panelHost = document.querySelector('#stealth-panel-host');
          
          if (panelHost) {
            panelHost.style.display = panelHost.style.display === 'none' ? 'block' : 'none';
            return panelHost.style.display === 'none' ? 'hidden' : 'visible';
          } else {
            return 'not_found';
          }
        }
      }).then((results) => {
        const status = results[0].result;
        if (status === 'not_found') {
          updateStatus('No panel found. Try injecting first.', true);
        } else {
          updateStatus(`Panel ${status}`);
        }
      });
      
    } catch (error) {
      updateStatus('Toggle failed: ' + error.message, true);
    }
  });
  
  // Test backend connection
  testConnectionBtn.addEventListener('click', async () => {
    const url = backendUrl.value.trim();
    if (!url) {
      updateStatus('Please enter a backend URL', true);
      return;
    }
    
    updateStatus('Testing connection...');
    
    try {
      const response = await fetch(url + '/health', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        updateStatus('Backend connection successful!');
      } else {
        updateStatus(`Backend responded with status: ${response.status}`, true);
      }
    } catch (error) {
      updateStatus('Backend connection failed: ' + error.message, true);
      
      // Try alternative health check
      try {
        const altResponse = await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors'
        });
        updateStatus('Backend reachable (limited CORS)');
      } catch (altError) {
        updateStatus('Backend unreachable', true);
      }
    }
  });
  
  // Handle toggle switches
  autoInjectToggle.addEventListener('click', () => {
    const isActive = autoInjectToggle.classList.toggle('active');
    chrome.storage.sync.set({ autoInject: isActive });
    updateStatus(`Auto-inject ${isActive ? 'enabled' : 'disabled'}`);
  });
  
  stealthModeToggle.addEventListener('click', () => {
    const isActive = stealthModeToggle.classList.toggle('active');
    chrome.storage.sync.set({ stealthMode: isActive });
    updateStatus(`Stealth mode ${isActive ? 'enabled' : 'disabled'}`);
  });
  
  // Save backend URL on change
  backendUrl.addEventListener('change', () => {
    chrome.storage.sync.set({ backendUrl: backendUrl.value });
    updateStatus('Backend URL saved');
  });
  
  // Listen for background script messages
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'injectionStatus') {
      updateStatus(request.message, !request.success);
    }
  });
  
  // Check current tab status on popup open
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab) {
      if (tab.url.startsWith('chrome://')) {
        updateStatus('Chrome system page - injection not possible', true);
      } else {
        updateStatus('Ready to inject into: ' + new URL(tab.url).hostname);
      }
    }
  });
});