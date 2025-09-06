// AI Chatbot for Rajasthan Digital Education
class EducationChatbot {
    constructor() {
        this.apiKey = 'your-openai-api-key'; // Replace with actual key
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatWidget();
        this.loadPredefinedResponses();
        this.setupEventListeners();
    }

    createChatWidget() {
        const chatWidget = document.createElement('div');
        chatWidget.innerHTML = `
            <div id="chatbot-container" class="chatbot-container">
                <!-- Chat Button -->
                <div id="chat-button" class="chat-button" onclick="chatbot.toggleChat()">
                    <i class="fas fa-comments"></i>
                    <span class="chat-notification" id="chat-notification">1</span>
                </div>

                <!-- Chat Window -->
                <div id="chat-window" class="chat-window" style="display: none;">
                    <div class="chat-header">
                        <div class="chat-title">
                            <i class="fas fa-robot"></i>
                            <span>Rajasthan Education Assistant</span>
                        </div>
                        <button class="chat-close" onclick="chatbot.toggleChat()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="chat-messages" id="chat-messages">
                        <div class="message bot-message">
                            <div class="message-content">
                                <p>नमस्ते! मैं राजस्थान डिजिटल एजुकेशन असिस्टेंट हूं। मैं आपकी कैसे मदद कर सकता हूं?</p>
                                <div class="quick-replies">
                                    <button onclick="chatbot.sendQuickReply('courses')">Courses</button>
                                    <button onclick="chatbot.sendQuickReply('admission')">Admission</button>
                                    <button onclick="chatbot.sendQuickReply('fees')">Fees</button>
                                    <button onclick="chatbot.sendQuickReply('help')">Help</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input">
                        <input type="text" id="chat-input-field" placeholder="Type your message..." onkeypress="chatbot.handleKeyPress(event)">
                        <button onclick="chatbot.sendMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(chatWidget);
    }

    loadPredefinedResponses() {
        this.responses = {
            'courses': {
                text: 'हमारे पास निम्नलिखित कोर्स उपलब्ध हैं:\n\n🖥️ Computer Science (4 Years)\n🌾 Agriculture Science (4 Years)\n📊 Commerce (3 Years)\n🔬 Science (3 Years)\n\nकिस कोर्स के बारे में जानना चाहते हैं?',
                options: ['Computer Science', 'Agriculture', 'Commerce', 'Science']
            },
            'admission': {
                text: 'एडमिशन प्रक्रिया:\n\n1️⃣ Online Registration\n2️⃣ Document Upload\n3️⃣ Fee Payment\n4️⃣ Admission Confirmation\n\nक्या आप registration शुरू करना चाहते हैं?',
                options: ['Start Registration', 'Required Documents', 'Contact Support']
            },
            'fees': {
                text: 'कोर्स फीस:\n\n💻 Computer Science: ₹46,000\n🌾 Agriculture: ₹40,000\n📊 Commerce: ₹35,000\n🔬 Science: ₹38,000\n\n*Government discount available\n*EMI options available',
                options: ['Payment Options', 'Government Schemes', 'EMI Details']
            },
            'help': {
                text: 'मैं आपकी निम्न चीजों में मदद कर सकता हूं:\n\n📚 Course Information\n🎓 Admission Process\n💰 Fee Details\n📱 Technical Support\n🏛️ College Information\n📞 Contact Details',
                options: ['Technical Support', 'Contact College', 'Live Chat with Human']
            },
            'computer science': {
                text: 'Computer Science Course Details:\n\n📅 Duration: 4 Years\n🎓 Degree: B.Tech/BCA\n💰 Fee: ₹46,000\n\nSubjects:\n• Programming\n• Data Structures\n• Web Development\n• Database Management\n• Software Engineering',
                options: ['Apply Now', 'Download Syllabus', 'View Colleges']
            },
            'technical support': {
                text: 'Technical Support:\n\n📞 Helpline: 1800-180-6127\n📧 Email: tech@rajasthaneducation.gov.in\n💬 Live Chat: Available 24/7\n\nCommon Issues:\n• Login Problems\n• Payment Issues\n• Video Not Playing\n• Download Problems',
                options: ['Login Help', 'Payment Help', 'Video Help', 'Live Agent']
            }
        };
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatButton = document.getElementById('chat-button');
        const notification = document.getElementById('chat-notification');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatWindow.style.display = 'flex';
            chatButton.style.transform = 'scale(0.9)';
            notification.style.display = 'none';
        } else {
            chatWindow.style.display = 'none';
            chatButton.style.transform = 'scale(1)';
        }
    }

    async sendMessage() {
        const input = document.getElementById('chat-input-field');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            this.trackChatInteraction(message);
            await this.processMessage(message);
        }
    }

    sendQuickReply(type) {
        this.addMessage(type, 'user');
        this.processMessage(type);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = null;
        
        // Check for predefined responses first
        for (const [key, value] of Object.entries(this.responses)) {
            if (lowerMessage.includes(key)) {
                response = value;
                break;
            }
        }
        
        if (response) {
            setTimeout(() => {
                this.addBotResponse(response);
            }, 1000);
        } else {
            // Use AI for complex queries
            if (window.aiChatbot) {
                await window.aiChatbot.processAIMessage(message);
            } else {
                // Fallback response
                response = {
                    text: 'मैं आपके सवाल को समझने की कोशिश कर रहा हूं। कृपया अधिक specific जानकारी दें या नीचे दिए गए options में से चुनें:',
                    options: ['Courses', 'Admission', 'Fees', 'Technical Support']
                };
                setTimeout(() => {
                    this.addBotResponse(response);
                }, 1000);
            }
        }
    }

    addBotResponse(response) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        let optionsHtml = '';
        if (response.options) {
            optionsHtml = '<div class="quick-replies">';
            response.options.forEach(option => {
                optionsHtml += `<button onclick="chatbot.sendQuickReply('${option.toLowerCase()}')">${option}</button>`;
            });
            optionsHtml += '</div>';
        }
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${response.text}</p>
                ${optionsHtml}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    setupEventListeners() {
        // Auto-open chat after 10 seconds
        setTimeout(() => {
            if (!this.isOpen) {
                document.getElementById('chat-notification').style.display = 'block';
            }
        }, 10000);
        
        // Track chatbot usage
        if (window.analytics) {
            window.analytics.trackEvent('chatbot_loaded', {
                page_location: window.location.pathname
            });
        }
    }
    
    trackChatInteraction(message, responseType = 'predefined') {
        if (window.analytics) {
            window.analytics.trackEvent('chatbot_interaction', {
                message_type: responseType,
                user_message: message.substring(0, 50), // First 50 chars only
                page_location: window.location.pathname
            });
        }
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new EducationChatbot();
    
    // Show chatbot notification after 5 seconds
    setTimeout(() => {
        const chatButton = document.getElementById('chat-button');
        const notification = document.getElementById('chat-notification');
        if (chatButton && notification && !window.chatbot.isOpen) {
            notification.style.display = 'block';
        }
    }, 5000);
});