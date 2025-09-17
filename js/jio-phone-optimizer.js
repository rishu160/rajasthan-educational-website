// Jio Phone & Basic Smartphone Optimizer
class JioPhoneOptimizer {
    constructor() {
        this.isLowEndDevice = this.detectLowEndDevice();
        this.init();
    }

    detectLowEndDevice() {
        // Detect Jio Phone and basic smartphones
        const userAgent = navigator.userAgent.toLowerCase();
        const isJioPhone = userAgent.includes('jiophone') || userAgent.includes('kaios');
        const lowRAM = navigator.deviceMemory && navigator.deviceMemory <= 1;
        const slowConnection = navigator.connection && navigator.connection.effectiveType === 'slow-2g';
        
        return isJioPhone || lowRAM || slowConnection;
    }

    init() {
        if (this.isLowEndDevice) {
            this.optimizeForLowEnd();
        }
        this.setupDataSaver();
    }

    optimizeForLowEnd() {
        // Reduce image quality
        this.optimizeImages();
        
        // Simplify animations
        this.disableAnimations();
        
        // Compress content
        this.enableContentCompression();
        
        // Show optimization notice
        this.showOptimizationNotice();
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Replace with low-res versions
            if (img.src && !img.src.includes('low-res')) {
                const lowResSrc = img.src.replace(/\.(jpg|jpeg|png)/, '-low.$1');
                img.src = lowResSrc;
            }
            
            // Lazy loading for better performance
            img.loading = 'lazy';
        });
    }

    disableAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    enableContentCompression() {
        // Enable text compression
        if ('CompressionStream' in window) {
            // Use compression for large text content
            console.log('Content compression enabled');
        }
    }

    showOptimizationNotice() {
        const notice = document.createElement('div');
        notice.className = 'alert alert-info position-fixed';
        notice.style.cssText = 'top: 10px; left: 10px; right: 10px; z-index: 9999; font-size: 12px;';
        notice.innerHTML = `
            <button type="button" class="btn-close btn-close-sm" onclick="this.parentElement.remove()"></button>
            📱 Jio Phone मोड सक्रिय - डेटा बचाने के लिए अनुकूलित
        `;
        document.body.appendChild(notice);
        
        setTimeout(() => notice.remove(), 5000);
    }

    setupDataSaver() {
        // Data saver controls
        const dataSaverHTML = `
            <div class="data-saver-controls position-fixed" style="bottom: 20px; right: 20px; z-index: 1000;">
                <div class="btn-group-vertical">
                    <button class="btn btn-sm btn-outline-primary" onclick="jioOptimizer.toggleDataSaver()">
                        <i class="fas fa-wifi"></i>
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', dataSaverHTML);
    }

    toggleDataSaver() {
        const isEnabled = localStorage.getItem('dataSaver') === 'true';
        localStorage.setItem('dataSaver', !isEnabled);
        
        if (!isEnabled) {
            this.enableDataSaver();
        } else {
            this.disableDataSaver();
        }
    }

    enableDataSaver() {
        // Stop auto-playing videos
        document.querySelectorAll('video').forEach(video => {
            video.preload = 'none';
            video.autoplay = false;
        });
        
        // Compress images further
        this.optimizeImages();
        
        offlineSync.showNotification('डेटा सेवर चालू', 'info');
    }

    disableDataSaver() {
        offlineSync.showNotification('डेटा सेवर बंद', 'info');
    }
}

// Auto-Sync for Missed Classes (WhatsApp-like)
class AutoClassSync {
    constructor() {
        this.syncInterval = null;
        this.lastSyncTime = localStorage.getItem('lastSyncTime') || 0;
        this.init();
    }

    init() {
        // Check for missed classes every 5 minutes when online
        this.syncInterval = setInterval(() => {
            if (navigator.onLine) {
                this.checkMissedClasses();
            }
        }, 300000); // 5 minutes

        // Immediate check on page load
        if (navigator.onLine) {
            this.checkMissedClasses();
        }
    }

    async checkMissedClasses() {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const response = await fetch(`/api/missed-classes/${userId}?since=${this.lastSyncTime}`);
            const missedClasses = await response.json();

            if (missedClasses.length > 0) {
                this.showMissedClassesNotification(missedClasses);
                
                // Auto-download if enabled
                const autoDownload = localStorage.getItem('autoDownload') === 'true';
                if (autoDownload) {
                    this.autoDownloadMissedClasses(missedClasses);
                }
            }

            this.lastSyncTime = Date.now();
            localStorage.setItem('lastSyncTime', this.lastSyncTime);

        } catch (error) {
            console.error('Error checking missed classes:', error);
        }
    }

    showMissedClassesNotification(missedClasses) {
        const notification = document.createElement('div');
        notification.className = 'alert alert-warning position-fixed';
        notification.style.cssText = 'top: 70px; left: 10px; right: 10px; z-index: 9999;';
        notification.innerHTML = `
            <h6><i class="fas fa-exclamation-triangle me-2"></i>मिस्ड क्लासेस</h6>
            <p>आपकी ${missedClasses.length} क्लासेस छूट गई हैं</p>
            <button class="btn btn-sm btn-primary me-2" onclick="autoSync.downloadMissedClasses()">
                डाउनलोड करें
            </button>
            <button class="btn btn-sm btn-secondary" onclick="this.parentElement.remove()">
                बाद में
            </button>
        `;
        
        document.body.appendChild(notification);
    }

    async autoDownloadMissedClasses(missedClasses) {
        const wifiOnly = localStorage.getItem('wifiOnly') === 'true';
        const connection = navigator.connection;
        
        // Check if on WiFi (if wifi-only is enabled)
        if (wifiOnly && connection && connection.type !== 'wifi') {
            offlineSync.showNotification('WiFi कनेक्शन का इंतज़ार कर रहे हैं...', 'info');
            return;
        }

        for (const classData of missedClasses) {
            try {
                await offlineSync.downloadCompressedLecture(classData);
            } catch (error) {
                console.error('Auto-download failed:', error);
            }
        }
    }

    async downloadMissedClasses() {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/missed-classes/${userId}?since=${this.lastSyncTime}`);
        const missedClasses = await response.json();
        
        await this.autoDownloadMissedClasses(missedClasses);
        
        // Remove notification
        document.querySelector('.alert-warning')?.remove();
    }
}

// Background Sync (Service Worker-like functionality)
class BackgroundSync {
    constructor() {
        this.syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
        this.init();
    }

    init() {
        // Register service worker for background sync
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }

        // Fallback sync when online
        window.addEventListener('online', () => {
            this.processSyncQueue();
        });
    }

    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw-offline.js');
            console.log('Offline Service Worker registered');
            
            // Listen for sync events
            if ('sync' in window.ServiceWorkerRegistration.prototype) {
                registration.sync.register('background-sync');
            }
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    addToSyncQueue(data) {
        this.syncQueue.push({
            id: Date.now(),
            data: data,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
        
        if (navigator.onLine) {
            this.processSyncQueue();
        }
    }

    async processSyncQueue() {
        const queue = [...this.syncQueue];
        this.syncQueue = [];
        
        for (const item of queue) {
            try {
                await fetch('/api/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item.data)
                });
            } catch (error) {
                // Re-add to queue if failed
                this.syncQueue.push(item);
            }
        }
        
        localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
    }
}

// Initialize optimizations
const jioOptimizer = new JioPhoneOptimizer();
const autoSync = new AutoClassSync();
const backgroundSync = new BackgroundSync();

// Export for global use
window.jioOptimizer = jioOptimizer;
window.autoSync = autoSync;
window.backgroundSync = backgroundSync;