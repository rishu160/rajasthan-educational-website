// Google Analytics & Firebase Analytics Integration
class Analytics {
    constructor() {
        this.initGoogleAnalytics();
        this.initFirebaseAnalytics();
        this.trackPageViews();
    }

    initGoogleAnalytics() {
        // Google Analytics 4 for Rajasthan Education Platform
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-RAJASTHAN-EDU';
        document.head.appendChild(script1);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-RAJASTHAN-EDU', {
            page_title: 'Rajasthan Digital Education',
            page_location: window.location.href,
            custom_map: {
                'dimension1': 'user_type',
                'dimension2': 'college_name'
            }
        });
        
        window.gtag = gtag;
    }

    initFirebaseAnalytics() {
        // Firebase Analytics will be initialized with Firebase app
        console.log('Firebase Analytics initialized');
    }

    trackPageViews() {
        // Track page views
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
    }

    trackEvent(eventName, parameters = {}) {
        gtag('event', eventName, parameters);
    }

    trackUserRegistration(method) {
        this.trackEvent('sign_up', {
            method: method
        });
    }

    trackCourseEnrollment(courseId, courseName, price) {
        this.trackEvent('purchase', {
            transaction_id: Date.now().toString(),
            value: price,
            currency: 'INR',
            items: [{
                item_id: courseId,
                item_name: courseName,
                category: 'Course',
                price: price,
                quantity: 1
            }]
        });
    }

    trackVideoPlay(videoTitle, duration) {
        this.trackEvent('video_play', {
            video_title: videoTitle,
            video_duration: duration
        });
    }

    trackDownload(fileName, fileType) {
        this.trackEvent('file_download', {
            file_name: fileName,
            file_type: fileType
        });
    }

    trackSearch(searchTerm) {
        this.trackEvent('search', {
            search_term: searchTerm
        });
    }

    trackLiveClassJoin(classId, className) {
        this.trackEvent('join_group', {
            group_id: classId,
            group_name: className
        });
    }
}

// Initialize Analytics
window.analytics = new Analytics();

// Track common interactions
document.addEventListener('DOMContentLoaded', () => {
    // Track button clicks
    document.querySelectorAll('button, .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const buttonText = e.target.textContent.trim();
            analytics.trackEvent('button_click', {
                button_text: buttonText,
                page_location: window.location.pathname
            });
        });
    });

    // Track form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            const formId = e.target.id || 'unknown_form';
            analytics.trackEvent('form_submit', {
                form_id: formId
            });
        });
    });

    // Track external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', (e) => {
            analytics.trackEvent('click', {
                link_url: e.target.href,
                link_text: e.target.textContent.trim()
            });
        });
    });
});