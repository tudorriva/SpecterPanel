// Panel JavaScript for the stealth injector
(function() {
    'use strict';
    
    // Prevent multiple initializations
    if (window.stealthPanelInitialized) return;
    window.stealthPanelInitialized = true;
    
    // Panel state
    let isMinimized = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let panelStartX = 0;
    let panelStartY = 0;
    
    // DOM elements
    const elements = {
        minimizeBtn: document.getElementById('minimizeBtn'),
        closeBtn: document.getElementById('closeBtn'),
        extractBtn: document.getElementById('extractBtn'),
        copyBtn: document.getElementById('copyBtn'),
        sendBtn: document.getElementById('sendBtn'),
        clearBtn: document.getElementById('clearBtn'),
        textarea: document.getElementById('mainTextarea'),
        status: document.getElementById('statusDisplay'),
        content: document.getElementById('panelContent'),
        header: document.getElementById('panelHeader')
    };
    
    // Initialize the panel
    function init() {
        setupEventListeners();
        updateStatus('Panel loaded successfully');
        
        // Make panel draggable
        setupDragFunctionality();
        
        // Set initial focus
        if (elements.textarea) {
            elements.textarea.focus();
        }
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Control buttons
        if (elements.minimizeBtn) {
            elements.minimizeBtn.addEventListener('click', toggleMinimize);
        }
        
        if (elements.closeBtn) {
            elements.closeBtn.addEventListener('click', closePanel);
        }
        
        // Action buttons
        if (elements.extractBtn) {
            elements.extractBtn.addEventListener('click', extractCanvasData);
        }
        
        if (elements.copyBtn) {
            elements.copyBtn.addEventListener('click', copyText);
        }
        
        if (elements.sendBtn) {
            elements.sendBtn.addEventListener('click', sendToBackend);
        }
        
        if (elements.clearBtn) {
            elements.clearBtn.addEventListener('click', clearText);
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboard);
    }
    
    // Set up drag functionality
    function setupDragFunctionality() {
        if (!elements.header) return;
        
        elements.header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        // Prevent text selection during drag
        elements.header.addEventListener('selectstart', (e) => e.preventDefault());
    }
    
    // Start dragging
    function startDrag(e) {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        
        const rect = document.body.getBoundingClientRect();
        panelStartX = rect.left;
        panelStartY = rect.top;
        
        elements.header.style.cursor = 'grabbing';
        e.preventDefault();
    }
    
    // Handle drag movement
    function drag(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        
        const newX = panelStartX + deltaX;
        const newY = panelStartY + deltaY;
        
        // Keep panel within viewport bounds
        const maxX = window.innerWidth - document.body.offsetWidth;
        const maxY = window.innerHeight - document.body.offsetHeight;
        
        const clampedX = Math.max(0, Math.min(maxX, newX));
        const clampedY = Math.max(0, Math.min(maxY, newY));
        
        document.body.style.position = 'fixed';
        document.body.style.left = clampedX + 'px';
        document.body.style.top = clampedY + 'px';
    }
    
    // End dragging
    function endDrag() {
        if (isDragging) {
            isDragging = false;
            elements.header.style.cursor = 'move';
        }
    }
    
    // Toggle minimize state
    function toggleMinimize() {
        isMinimized = !isMinimized;
        
        if (isMinimized) {
            elements.content.classList.add('hidden');
            elements.minimizeBtn.textContent = '+';
            elements.minimizeBtn.title = 'Restore';
            updateStatus('Panel minimized');
        } else {
            elements.content.classList.remove('hidden');
            elements.minimizeBtn.textContent = '−';
            elements.minimizeBtn.title = 'Minimize';
            updateStatus('Panel restored');
        }
    }
    
    // Close the panel
    function closePanel() {
        // If we're in an iframe or popup, close the window
        if (window.parent !== window) {
            window.parent.postMessage({ action: 'closePanel' }, '*');
        } else {
            // Hide the panel
            document.body.style.display = 'none';
            updateStatus('Panel closed');
        }
    }
    
    // Extract canvas data from the parent page
    function extractCanvasData() {
        updateStatus('Extracting canvas data...');
        
        try {
            // Send message to parent window to extract canvas data
            if (window.parent !== window) {
                window.parent.postMessage({ 
                    action: 'extractCanvas',
                    source: 'stealthPanel'
                }, '*');
            } else {
                // If we're not in an iframe, try direct extraction
                extractCanvasDirectly();
            }
        } catch (error) {
            updateStatus('Canvas extraction failed: ' + error.message);
        }
    }
    
    // Direct canvas extraction (fallback)
    function extractCanvasDirectly() {
        const canvases = document.querySelectorAll('canvas');
        
        if (canvases.length === 0) {
            elements.textarea.value = 'No canvas elements found on this page.';
            updateStatus('No canvas elements found');
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
                
                successCount++;
            } catch (error) {
                extractedData += `Canvas ${index + 1}: Access denied (${error.message})\n\n`;
            }
        });
        
        elements.textarea.value = extractedData;
        updateStatus(`Extracted ${successCount}/${canvases.length} canvas elements`);
    }
    
    // Copy text to clipboard
    function copyText() {
        const text = elements.textarea.value;
        
        if (!text.trim()) {
            updateStatus('Nothing to copy');
            return;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            updateStatus('Copied to clipboard');
            elements.copyBtn.textContent = 'Copied!';
            elements.copyBtn.classList.add('success');
            
            setTimeout(() => {
                elements.copyBtn.textContent = 'Copy Text';
                elements.copyBtn.classList.remove('success');
            }, 2000);
        }).catch((error) => {
            updateStatus('Copy failed: ' + error.message);
            
            // Fallback: select text for manual copy
            elements.textarea.select();
            elements.textarea.setSelectionRange(0, 99999);
        });
    }
    
    // Send data to backend
    function sendToBackend() {
        const text = elements.textarea.value;
        
        if (!text.trim()) {
            updateStatus('Nothing to send');
            return;
        }
        
        updateStatus('Sending to backend...');
        
        // Try to send message to extension
        if (window.chrome && chrome.runtime) {
            chrome.runtime.sendMessage({
                action: 'sendToBackend',
                data: text
            }, (response) => {
                if (response && response.success) {
                    updateStatus('Data sent successfully');
                    elements.sendBtn.textContent = 'Sent!';
                    elements.sendBtn.classList.add('success');
                    
                    setTimeout(() => {
                        elements.sendBtn.textContent = 'Send to Backend';
                        elements.sendBtn.classList.remove('success');
                    }, 2000);
                } else {
                    updateStatus('Send failed');
                }
            });
        } else {
            // Fallback: try direct fetch
            fetch('http://localhost:8000/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    timestamp: Date.now(),
                    source: 'stealth_panel'
                })
            }).then(response => {
                if (response.ok) {
                    updateStatus('Data sent to backend');
                    elements.sendBtn.textContent = 'Sent!';
                    elements.sendBtn.classList.add('success');
                    
                    setTimeout(() => {
                        elements.sendBtn.textContent = 'Send to Backend';
                        elements.sendBtn.classList.remove('success');
                    }, 2000);
                } else {
                    updateStatus('Backend error: ' + response.status);
                }
            }).catch(error => {
                updateStatus('Backend not available');
            });
        }
    }
    
    // Clear the textarea
    function clearText() {
        elements.textarea.value = '';
        elements.textarea.focus();
        updateStatus('Text cleared');
    }
    
    // Handle keyboard shortcuts
    function handleKeyboard(e) {
        // Ctrl+C for copy (when textarea is focused)
        if (e.ctrlKey && e.key === 'c' && document.activeElement === elements.textarea) {
            return; // Let default copy behavior work
        }
        
        // Ctrl+Shift+E for extract
        if (e.ctrlKey && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            extractCanvasData();
        }
        
        // Ctrl+Shift+S for send
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            sendToBackend();
        }
        
        // Ctrl+Shift+M for minimize
        if (e.ctrlKey && e.shiftKey && e.key === 'M') {
            e.preventDefault();
            toggleMinimize();
        }
        
        // Escape to close
        if (e.key === 'Escape') {
            e.preventDefault();
            closePanel();
        }
    }
    
    // Update status message
    function updateStatus(message) {
        if (elements.status) {
            elements.status.textContent = message;
            
            // Clear status after 5 seconds
            setTimeout(() => {
                if (elements.status.textContent === message) {
                    elements.status.textContent = 'Ready';
                }
            }, 5000);
        }
    }
    
    // Listen for messages from parent window
    window.addEventListener('message', (event) => {
        if (event.data && event.data.action) {
            switch (event.data.action) {
                case 'canvasData':
                    if (event.data.text) {
                        elements.textarea.value = event.data.text;
                        updateStatus('Canvas data received');
                    }
                    break;
                    
                case 'updateText':
                    if (event.data.text) {
                        elements.textarea.value = event.data.text;
                        updateStatus('Text updated');
                    }
                    break;
                    
                case 'minimize':
                    if (!isMinimized) toggleMinimize();
                    break;
                    
                case 'restore':
                    if (isMinimized) toggleMinimize();
                    break;
            }
        }
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export functions for external access
    window.stealthPanel = {
        updateText: (text) => {
            if (elements.textarea) {
                elements.textarea.value = text;
                updateStatus('Text updated externally');
            }
        },
        getText: () => elements.textarea ? elements.textarea.value : '',
        minimize: () => !isMinimized && toggleMinimize(),
        restore: () => isMinimized && toggleMinimize(),
        close: closePanel,
        extractCanvas: extractCanvasData,
        updateStatus: updateStatus
    };
    
})();