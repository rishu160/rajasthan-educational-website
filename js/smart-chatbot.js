// Smart Chatbot with Universal Search Capability
class SmartChatbot {
    constructor() {
        this.isOpen = false;
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.init();
    }

    initializeKnowledgeBase() {
        return {
            // Education & Courses
            'computer science': 'Computer Science is a 4-year degree program covering programming, algorithms, data structures, AI, machine learning, and software development. Career options include software engineer, data scientist, AI specialist with salaries ranging from ₹3-15 LPA.',
            'agriculture': 'Agriculture courses include B.Sc Agriculture, Agricultural Engineering, Horticulture. Focus on modern farming, crop science, soil management. Career in farming, agricultural officer, research with ₹2-8 LPA salary.',
            'commerce': 'Commerce stream includes B.Com, BBA, CA, CS. Covers accounting, finance, business management, economics. Career in banking, finance, business analyst, CA with ₹2-12 LPA.',
            'engineering': 'Engineering branches: Civil, Mechanical, Electrical, Electronics, Chemical. 4-year B.Tech program. Career in core companies, IT, government jobs with ₹3-20 LPA.',
            'medical': 'Medical courses: MBBS, BDS, BAMS, BHMS, Nursing, Pharmacy. Duration 4-5.5 years. Career as doctor, surgeon, specialist with ₹5-50 LPA.',
            'law': 'Law courses: LLB (3 years), BA LLB (5 years). Covers constitutional law, criminal law, civil law. Career as lawyer, judge, legal advisor with ₹3-25 LPA.',

            // Colleges Information
            'government college': 'Government colleges in Rajasthan offer quality education at affordable fees. Popular ones: Rajasthan University, MNIT Jaipur, IIT Jodhpur, Medical colleges in Jaipur, Udaipur.',
            'private college': 'Private colleges offer modern facilities, industry connections. Higher fees but good placement records. Examples: Manipal University, LNM Institute, Poornima University.',
            'college admission': 'Admission process: Fill application form, appear for entrance exam (JEE, NEET, etc.), counseling, document verification, fee payment. Merit-based and quota-based seats available.',
            'college fees': 'Government college fees: ₹10,000-50,000/year. Private college fees: ₹50,000-3,00,000/year. Scholarships available for SC/ST/OBC and economically weaker sections.',

            // Career & Jobs
            'job opportunities': 'Career options after graduation: Government jobs (UPSC, SSC, State PSC), Private sector, Entrepreneurship, Higher studies (Masters, PhD), Professional courses.',
            'salary': 'Starting salaries vary by field: Engineering ₹3-8 LPA, Medical ₹5-15 LPA, Commerce ₹2-6 LPA, Arts ₹2-5 LPA. Experience and skills increase earning potential.',
            'government jobs': 'Government job exams: UPSC (IAS, IPS), SSC (CGL, CHSL), Railway, Banking (IBPS, SBI), State PSC, Teaching (REET, NET). Good job security and benefits.',

            // Technology & Digital Learning
            'online classes': 'Digital learning platform offers live classes, recorded lectures, interactive sessions, doubt clearing, assignments, and assessments. Available 24/7 with mobile app support.',
            'ai chatbot': 'AI-powered chatbot provides instant answers to student queries, course guidance, admission help, career counseling, and technical support. Available in Hindi and English.',
            'mobile app': 'Mobile app features: Offline video download, live class notifications, quiz participation, discussion forums, assignment submission, progress tracking.',

            // Rajasthan Specific
            'rajasthan education': 'Rajasthan government focuses on digital education, rural college connectivity, scholarship schemes, skill development programs, and employment generation for youth.',
            'rural colleges': 'Rural colleges get digital infrastructure, internet connectivity, smart classrooms, online resources, and teacher training under government initiatives.',
            'scholarship': 'Rajasthan scholarships: Chief Minister Higher Education Scholarship, SC/ST/OBC scholarships, Merit scholarships, Need-based financial assistance up to ₹50,000/year.',

            // General Queries
            'admission process': 'Step 1: Choose course and college. Step 2: Check eligibility criteria. Step 3: Fill application form. Step 4: Appear for entrance exam. Step 5: Counseling and seat allotment. Step 6: Document verification and fee payment.',
            'entrance exam': 'Major entrance exams: JEE Main/Advanced (Engineering), NEET (Medical), CLAT (Law), CAT (MBA), GATE (M.Tech), NET (PhD/Teaching).',
            'study tips': 'Effective study tips: Make a timetable, take regular breaks, practice previous year papers, join study groups, use online resources, stay healthy, manage stress.',
            'career guidance': 'Career counseling available through platform. Assess your interests, skills, and aptitude. Explore various career options, required qualifications, and growth prospects.',

            // Platform Features
            'quiz system': 'Interactive quiz system for practice and assessment. Teachers can create custom quizzes. Students get instant results and performance analysis.',
            'discussion forum': 'Student discussion center for doubt clearing, study group formation, peer learning, and faculty interaction. Moderated environment for quality discussions.',
            'internship': 'Internship opportunities with partner companies. Filter by location, stipend, duration, and skills. Apply directly through platform with profile matching.',
            'announcements': 'Official announcements from colleges and government. Event notifications, exam schedules, admission updates, scholarship information.',

            // Technical Support
            'technical help': 'Technical support available 24/7. Contact through chatbot, email, or phone. Common issues: login problems, video playback, app installation, payment issues.',
            'payment': 'Secure payment gateway supports all major cards, UPI, net banking, and wallets. EMI options available for course fees. Refund policy as per terms.',
            'certificate': 'Digital certificates provided on course completion. Verified and recognized by industry partners. Can be shared on LinkedIn and downloaded as PDF.'
        };
    }

    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div id="smart-chatbot" class="smart-chatbot">
                <div class="chatbot-toggle" onclick="smartChatbot.toggleChat()">
                    <i class="fas fa-robot"></i>
                    <span class="pulse-dot"></span>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    toggleChat() {
        // Open full screen modal chatbot
        this.openFullScreenChatbot();
    }

    openFullScreenChatbot() {
        // Create full screen modal
        const modal = document.createElement('div');
        modal.id = 'fullscreen-chatbot-modal';
        modal.innerHTML = `
            <div class="fullscreen-chatbot-overlay">
                <div class="fullscreen-chatbot-container">
                    <div class="fullscreen-chatbot-header">
                        <div class="chatbot-title">
                            <i class="fas fa-robot me-2"></i>
                            AI Smart Assistant
                        </div>
                        <button class="chatbot-close" onclick="smartChatbot.closeFullScreenChatbot()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="fullscreen-chatbot-messages" id="fullscreen-chatbot-messages">
                        <div class="message bot-message">
                            <div class="message-content">
                                <i class="fas fa-robot me-2"></i>
                                <strong>नमस्ते! 🤖</strong><br>
                                मैं आपका AI Smart Assistant हूं। आप मुझसे कुछ भी पूछ सकते हैं:<br>
                                • Courses और Colleges के बारे में<br>
                                • Career guidance और Jobs<br>
                                • Admission process<br>
                                • Scholarships और Fees<br>
                                • Technical help<br><br>
                                <em>कुछ भी टाइप करें...</em>
                            </div>
                        </div>
                    </div>
                    
                    <div class="fullscreen-chatbot-input-area">
                        <div class="quick-suggestions">
                            <button onclick="smartChatbot.sendFullScreenQuery('computer science courses')">CS Courses</button>
                            <button onclick="smartChatbot.sendFullScreenQuery('college admission')">Admission</button>
                            <button onclick="smartChatbot.sendFullScreenQuery('scholarship')">Scholarship</button>
                            <button onclick="smartChatbot.sendFullScreenQuery('job opportunities')">Jobs</button>
                        </div>
                        <div class="input-container">
                            <input type="text" id="fullscreen-chatbot-input" placeholder="कुछ भी पूछें... (Type anything...)" onkeypress="smartChatbot.handleFullScreenKeyPress(event)">
                            <button onclick="smartChatbot.sendFullScreenMessage()">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('fullscreen-chatbot-input').focus();
    }

    closeFullScreenChatbot() {
        const modal = document.getElementById('fullscreen-chatbot-modal');
        if (modal) {
            modal.remove();
        }
    }

    handleFullScreenKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendFullScreenMessage();
        }
    }

    sendFullScreenQuery(query) {
        document.getElementById('fullscreen-chatbot-input').value = query;
        this.sendFullScreenMessage();
    }

    sendFullScreenMessage() {
        const input = document.getElementById('fullscreen-chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addFullScreenMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showFullScreenTyping();
        
        // Process message and respond
        setTimeout(() => {
            this.hideFullScreenTyping();
            const response = this.processMessage(message);
            this.addFullScreenMessage(response, 'bot');
        }, 1000);
    }

    addFullScreenMessage(content, type) {
        const messagesContainer = document.getElementById('fullscreen-chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        if (type === 'user') {
            messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <i class="fas fa-robot me-2"></i>
                    ${content}
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showFullScreenTyping() {
        const messagesContainer = document.getElementById('fullscreen-chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'fullscreen-typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-robot me-2"></i>
                <span class="typing-dots">
                    <span></span><span></span><span></span>
                </span>
                Typing...
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideFullScreenTyping() {
        const typingIndicator = document.getElementById('fullscreen-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    sendQuickQuery(query) {
        document.getElementById('chatbot-input').value = query;
        this.sendMessage();
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        // Process message and respond
        setTimeout(() => {
            this.hideTyping();
            const response = this.processMessage(message);
            this.addMessage(response, 'bot');
        }, 1000);
    }

    addMessage(content, type) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        if (type === 'user') {
            messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <i class="fas fa-robot me-2"></i>
                    ${content}
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTyping() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-robot me-2"></i>
                <span class="typing-dots">
                    <span></span><span></span><span></span>
                </span>
                Typing...
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    processMessage(message) {
        const query = message.toLowerCase();
        
        // Direct knowledge base match
        for (const [key, value] of Object.entries(this.knowledgeBase)) {
            if (query.includes(key)) {
                return `<strong>${this.capitalizeFirst(key)}</strong><br><br>${value}<br><br><em>Need more help? Ask me anything else! 😊</em>`;
            }
        }
        
        // Keyword-based intelligent responses
        if (query.includes('fee') || query.includes('cost') || query.includes('price')) {
            return `<strong>Fees Information</strong><br><br>• Government colleges: ₹10,000-50,000/year<br>• Private colleges: ₹50,000-3,00,000/year<br>• Scholarships available for eligible students<br>• EMI options available<br><br><em>Want specific college fees? Ask me!</em>`;
        }
        
        if (query.includes('exam') || query.includes('test') || query.includes('entrance')) {
            return `<strong>Entrance Exams</strong><br><br>• JEE Main/Advanced - Engineering<br>• NEET - Medical<br>• CLAT - Law<br>• CAT - MBA<br>• State entrance exams<br><br><em>Which exam are you preparing for?</em>`;
        }
        
        if (query.includes('job') || query.includes('career') || query.includes('placement')) {
            return `<strong>Career Opportunities</strong><br><br>• Government jobs (UPSC, SSC, Banking)<br>• Private sector opportunities<br>• Entrepreneurship support<br>• Higher studies options<br>• Skill development programs<br><br><em>What field interests you most?</em>`;
        }
        
        if (query.includes('college') || query.includes('university')) {
            return `<strong>College Information</strong><br><br>• 50+ partner colleges in Rajasthan<br>• Government and private options<br>• All major courses available<br>• Digital learning facilities<br>• Placement assistance<br><br><em>Looking for a specific college or course?</em>`;
        }
        
        if (query.includes('course') || query.includes('subject') || query.includes('stream')) {
            return `<strong>Available Courses</strong><br><br>• Engineering (All branches)<br>• Medical & Health Sciences<br>• Commerce & Management<br>• Arts & Humanities<br>• Agriculture & Allied<br>• Computer Applications<br><br><em>Which course interests you?</em>`;
        }
        
        if (query.includes('online') || query.includes('digital') || query.includes('app')) {
            return `<strong>Digital Learning Platform</strong><br><br>• Live interactive classes<br>• Recorded lecture library<br>• Mobile app available<br>• Offline content download<br>• AI-powered doubt solving<br>• Progress tracking<br><br><em>Download our mobile app for better experience!</em>`;
        }
        
        if (query.includes('help') || query.includes('support') || query.includes('problem')) {
            return `<strong>How Can I Help You?</strong><br><br>I can assist you with:<br>• Course and college information<br>• Admission guidance<br>• Career counseling<br>• Technical support<br>• Scholarship details<br>• Fee information<br><br><em>Just ask me anything specific!</em>`;
        }
        
        if (query.includes('scholarship') || query.includes('financial aid')) {
            return `<strong>Scholarship Opportunities</strong><br><br>• Merit-based scholarships<br>• Need-based financial aid<br>• SC/ST/OBC scholarships<br>• Minority scholarships<br>• Government schemes<br>• Up to ₹50,000/year<br><br><em>Check eligibility on our scholarship page!</em>`;
        }
        
        // General intelligent response
        return `<strong>I'm here to help! 🤖</strong><br><br>I can provide information about:<br>• <strong>Courses</strong> - All academic programs<br>• <strong>Colleges</strong> - Partner institutions<br>• <strong>Admissions</strong> - Process and requirements<br>• <strong>Careers</strong> - Job opportunities<br>• <strong>Scholarships</strong> - Financial assistance<br>• <strong>Technical</strong> - Platform support<br><br>Try asking: "Tell me about computer science" or "How to get admission?"<br><br><em>मुझसे हिंदी में भी पूछ सकते हैं! 😊</em>`;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    attachEventListeners() {
        // Chatbot will only open when user clicks the button
    }
}

// Initialize Smart Chatbot
const smartChatbot = new SmartChatbot();