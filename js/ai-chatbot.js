// Advanced AI Chatbot with OpenAI Integration
class AdvancedAIChatbot {
    constructor() {
        this.apiKey = 'sk-your-openai-api-key'; // Replace with actual OpenAI key
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
        this.context = `You are an AI assistant for Rajasthan Digital Education Platform, a government initiative for rural colleges. 
        You help students with:
        - Course information (Computer Science, Agriculture, Commerce, Science)
        - Admission process and requirements
        - Fee details and payment options
        - Technical support
        - College information
        - Live classes and recorded lectures
        
        Always respond in a helpful, friendly manner. Use both Hindi and English as appropriate for rural students.
        Keep responses concise and actionable.`;
        
        this.conversationHistory = [];
        this.isTyping = false;
    }

    async sendToOpenAI(message) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: this.context },
                        ...this.conversationHistory,
                        { role: 'user', content: message }
                    ],
                    max_tokens: 300,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                const aiResponse = data.choices[0].message.content;
                
                // Update conversation history
                this.conversationHistory.push(
                    { role: 'user', content: message },
                    { role: 'assistant', content: aiResponse }
                );
                
                // Keep only last 10 messages to manage token limit
                if (this.conversationHistory.length > 10) {
                    this.conversationHistory = this.conversationHistory.slice(-10);
                }
                
                return aiResponse;
            } else {
                throw new Error('Invalid response from OpenAI');
            }
        } catch (error) {
            console.error('OpenAI API Error:', error);
            return this.getFallbackResponse(message);
        }
    }

    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Fallback responses when AI is not available
        if (lowerMessage.includes('course') || lowerMessage.includes('कोर्स')) {
            return `हमारे पास निम्नलिखित कोर्स उपलब्ध हैं:

🖥️ Computer Science - ₹46,000 (4 Years)
🌾 Agriculture Science - ₹40,000 (4 Years) 
📊 Commerce - ₹35,000 (3 Years)
🔬 Science - ₹38,000 (3 Years)

किस कोर्स के बारे में और जानना चाहते हैं?`;
        }
        
        if (lowerMessage.includes('admission') || lowerMessage.includes('एडमिशन')) {
            return `एडमिशन प्रक्रिया:

1️⃣ Online Registration करें
2️⃣ Required Documents upload करें
3️⃣ Course fee का payment करें
4️⃣ Admission confirmation प्राप्त करें

Registration शुरू करने के लिए "Apply Now" पर click करें।`;
        }
        
        if (lowerMessage.includes('fee') || lowerMessage.includes('फीस')) {
            return `Course Fees (Government Discount के साथ):

💻 Computer Science: ₹46,000
🌾 Agriculture: ₹40,000
📊 Commerce: ₹35,000
🔬 Science: ₹38,000

Payment Options:
• Full Payment (10% discount)
• Semester wise payment
• EMI options available`;
        }
        
        if (lowerMessage.includes('help') || lowerMessage.includes('मदद')) {
            return `मैं आपकी निम्न चीजों में मदद कर सकता हूं:

📚 Course Information
🎓 Admission Process
💰 Fee Details
📱 Technical Support
🏛️ College Information
📞 Contact Details

कृपया बताएं कि आपको किस चीज में मदद चाहिए?`;
        }
        
        return `मैं आपके सवाल को समझने की कोशिश कर रहा हूं। कृपया अधिक specific जानकारी दें।

आप निम्न topics के बारे में पूछ सकते हैं:
• Courses और Fees
• Admission Process
• Technical Support
• College Information

या फिर helpline पर call करें: 1800-180-6127`;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async processAIMessage(message) {
        if (this.isTyping) return;
        
        this.isTyping = true;
        this.showTypingIndicator();
        
        try {
            const response = await this.sendToOpenAI(message);
            this.hideTypingIndicator();
            
            // Add AI response with smart formatting
            this.addFormattedBotResponse(response);
        } catch (error) {
            this.hideTypingIndicator();
            const fallbackResponse = this.getFallbackResponse(message);
            this.addFormattedBotResponse(fallbackResponse);
        }
        
        this.isTyping = false;
    }

    addFormattedBotResponse(text) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        // Format the response text
        const formattedText = this.formatResponse(text);
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${formattedText}</p>
                ${this.generateQuickReplies(text)}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    formatResponse(text) {
        // Add basic formatting to AI responses
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/(\d+\.\s)/g, '<br>$1')
            .replace(/(•\s)/g, '<br>$1');
    }

    generateQuickReplies(responseText) {
        const lowerText = responseText.toLowerCase();
        let replies = [];
        
        if (lowerText.includes('course')) {
            replies = ['View Courses', 'Admission Process', 'Fee Details'];
        } else if (lowerText.includes('admission')) {
            replies = ['Start Registration', 'Required Documents', 'Contact Support'];
        } else if (lowerText.includes('fee')) {
            replies = ['Payment Options', 'EMI Details', 'Apply Now'];
        } else {
            replies = ['More Info', 'Contact Support', 'View Courses'];
        }
        
        if (replies.length > 0) {
            let html = '<div class="quick-replies">';
            replies.forEach(reply => {
                html += `<button onclick="chatbot.sendQuickReply('${reply.toLowerCase()}')">${reply}</button>`;
            });
            html += '</div>';
            return html;
        }
        
        return '';
    }
}

// Enhanced chatbot with AI capabilities
window.aiChatbot = new AdvancedAIChatbot();