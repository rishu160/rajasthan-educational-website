// Voice Assistant for Chatbot
class VoiceAssistant {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        
        if (this.isSupported) {
            this.initSpeechRecognition();
        }
    }

    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'hi-IN'; // Hindi language support
        
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateVoiceButton(true);
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.updateVoiceButton(false);
        };
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.handleVoiceInput(transcript);
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.updateVoiceButton(false);
        };
    }

    startListening() {
        if (this.isSupported && this.recognition && !this.isListening) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
            }
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    handleVoiceInput(transcript) {
        // Add voice input to chat
        const chatInput = document.getElementById('chat-input-field');
        if (chatInput) {
            chatInput.value = transcript;
            // Trigger send message
            if (window.chatbot) {
                window.chatbot.sendMessage();
            }
        }
    }

    speak(text) {
        if (this.synthesis) {
            // Cancel any ongoing speech
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'hi-IN';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            
            // Try to find Hindi voice
            const voices = this.synthesis.getVoices();
            const hindiVoice = voices.find(voice => voice.lang.includes('hi'));
            if (hindiVoice) {
                utterance.voice = hindiVoice;
            }
            
            this.synthesis.speak(utterance);
        }
    }

    updateVoiceButton(isListening) {
        const voiceButton = document.getElementById('voice-button');
        if (voiceButton) {
            if (isListening) {
                voiceButton.innerHTML = '<i class="fas fa-stop"></i>';
                voiceButton.classList.add('listening');
            } else {
                voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceButton.classList.remove('listening');
            }
        }
    }

    addVoiceButtonToChat() {
        const chatInput = document.querySelector('.chat-input');
        if (chatInput && this.isSupported) {
            const voiceButton = document.createElement('button');
            voiceButton.id = 'voice-button';
            voiceButton.className = 'voice-button';
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceButton.title = 'Voice Input (Hindi/English)';
            
            voiceButton.onclick = () => {
                if (this.isListening) {
                    this.stopListening();
                } else {
                    this.startListening();
                }
            };
            
            // Insert before send button
            const sendButton = chatInput.querySelector('button');
            chatInput.insertBefore(voiceButton, sendButton);
        }
    }
}

// Enhanced chatbot message processing with voice
class VoiceEnabledChatbot extends EducationChatbot {
    constructor() {
        super();
        this.voiceAssistant = new VoiceAssistant();
        this.voiceEnabled = localStorage.getItem('voice-enabled') === 'true';
    }

    createChatWidget() {
        super.createChatWidget();
        
        // Add voice controls after chat widget is created
        setTimeout(() => {
            this.voiceAssistant.addVoiceButtonToChat();
            this.addVoiceToggle();
        }, 100);
    }

    addVoiceToggle() {
        const chatHeader = document.querySelector('.chat-header .chat-title');
        if (chatHeader) {
            const voiceToggle = document.createElement('button');
            voiceToggle.className = 'voice-toggle';
            voiceToggle.innerHTML = this.voiceEnabled ? 
                '<i class="fas fa-volume-up"></i>' : 
                '<i class="fas fa-volume-mute"></i>';
            voiceToggle.title = 'Toggle Voice Response';
            voiceToggle.onclick = () => this.toggleVoiceResponse();
            
            chatHeader.appendChild(voiceToggle);
        }
    }

    toggleVoiceResponse() {
        this.voiceEnabled = !this.voiceEnabled;
        localStorage.setItem('voice-enabled', this.voiceEnabled.toString());
        
        const voiceToggle = document.querySelector('.voice-toggle');
        if (voiceToggle) {
            voiceToggle.innerHTML = this.voiceEnabled ? 
                '<i class="fas fa-volume-up"></i>' : 
                '<i class="fas fa-volume-mute"></i>';
        }
    }

    addBotResponse(response) {
        super.addBotResponse(response);
        
        // Speak the response if voice is enabled
        if (this.voiceEnabled && response.text) {
            // Clean text for speech (remove emojis and special characters)
            const cleanText = response.text
                .replace(/[🖥️🌾📊🔬💻💰📚🎓📱🏛️📞1️⃣2️⃣3️⃣4️⃣]/g, '')
                .replace(/\n/g, ' ')
                .trim();
            
            setTimeout(() => {
                this.voiceAssistant.speak(cleanText);
            }, 500);
        }
    }
}

// Initialize voice-enabled chatbot
window.addEventListener('DOMContentLoaded', () => {
    // Replace regular chatbot with voice-enabled version
    if (window.chatbot) {
        window.chatbot = new VoiceEnabledChatbot();
    }
});