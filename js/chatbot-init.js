// Chatbot Initialization Script
(function() {
    'use strict';
    
    // Ensure chatbot loads after all other scripts
    function initializeChatbot() {
        // Check if required elements exist
        if (typeof EducationChatbot === 'undefined') {
            console.log('Chatbot class not found, retrying...');
            setTimeout(initializeChatbot, 500);
            return;
        }
        
        // Initialize chatbot
        try {
            window.chatbot = new EducationChatbot();
            console.log('Chatbot initialized successfully');
            
            // Add some delay to ensure DOM is ready
            setTimeout(() => {
                const chatContainer = document.getElementById('chatbot-container');
                if (chatContainer) {
                    chatContainer.style.display = 'block';
                    console.log('Chatbot container made visible');
                } else {
                    console.log('Chatbot container not found');
                }
            }, 1000);
            
        } catch (error) {
            console.error('Error initializing chatbot:', error);
        }
    }
    
    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChatbot);
    } else {
        initializeChatbot();
    }
    
    // Fallback initialization after window load
    window.addEventListener('load', () => {
        if (!window.chatbot) {
            setTimeout(initializeChatbot, 1000);
        }
    });
})();