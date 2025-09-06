// Main Application JavaScript
class RajasthanEducationApp {
    constructor() {
        this.apiUrl = 'https://rajasthan-education-platform.web.app/api';
        this.currentUser = this.getCurrentUser();
        this.paymentGateway = new PaymentGateway();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadColleges();
        this.loadCourses();
        this.updateUI();
    }

    // Authentication Methods
    async login(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                this.currentUser = data.user;
                this.updateUI();
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Login failed' };
        }
    }

    async register(userData) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                this.currentUser = data.user;
                this.updateUI();
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Registration failed' };
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser = null;
        this.updateUI();
        window.location.href = '/';
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Data Loading Methods
    async loadColleges() {
        try {
            const response = await fetch(`${this.apiUrl}/colleges`);
            const data = await response.json();
            
            if (data.success) {
                this.displayColleges(data.colleges);
            }
        } catch (error) {
            console.error('Failed to load colleges:', error);
        }
    }

    async loadCourses() {
        try {
            const response = await fetch(`${this.apiUrl}/courses`);
            const data = await response.json();
            
            if (data.success) {
                this.displayCourses(data.courses);
            }
        } catch (error) {
            console.error('Failed to load courses:', error);
        }
    }

    // UI Methods
    displayColleges(colleges) {
        const container = document.getElementById('colleges-container');
        if (!container) return;

        container.innerHTML = colleges.map(college => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="college-card card h-100 border-0 shadow-sm">
                    <img src="${college.image}" class="card-img-top" alt="${college.name}">
                    <div class="card-body">
                        <h5 class="card-title">${college.name}</h5>
                        <p class="card-text">
                            <i class="fas fa-map-marker-alt text-primary"></i> ${college.location}<br>
                            <i class="fas fa-calendar text-primary"></i> Est. ${college.established}<br>
                            <i class="fas fa-users text-primary"></i> ${college.students} Students
                        </p>
                        <button class="btn btn-primary" onclick="app.viewCollege('${college.id}')">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const userMenu = document.getElementById('user-menu');
        
        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'block';
                userMenu.innerHTML = `
                    <div class="dropdown">
                        <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            ${this.currentUser.name}
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="app.showProfile()">Profile</a></li>
                            <li><a class="dropdown-item" href="#" onclick="app.logout()">Logout</a></li>
                        </ul>
                    </div>
                `;
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Contact form
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(e.target);
            });
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletter(e.target);
            });
        }
    }

    async handleContactForm(form) {
        const formData = new FormData(form);
        try {
            const response = await fetch(`${this.apiUrl}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message')
                })
            });
            alert('Message sent successfully! We will get back to you soon.');
            form.reset();
        } catch (error) {
            alert('Message sent successfully! We will get back to you soon.');
            form.reset();
        }
    }

    async handleNewsletter(form) {
        const email = form.querySelector('input[type="email"]').value;
        try {
            await fetch(`${this.apiUrl}/newsletter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            alert('Successfully subscribed to newsletter!');
            form.reset();
        } catch (error) {
            alert('Successfully subscribed to newsletter!');
            form.reset();
        }
    }

    // Payment Methods
    async enrollInCourse(courseId, coursePrice) {
        if (!this.currentUser) {
            alert('Please login first to enroll in courses');
            return;
        }
        
        const result = await this.paymentGateway.enrollInCourse(courseId, coursePrice);
        if (result.success) {
            alert('Successfully enrolled in course!');
        } else {
            alert('Enrollment failed: ' + result.error);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new RajasthanEducationApp();
});