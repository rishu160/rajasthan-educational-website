// Offline-First Learning System for Rural Areas
class OfflineLearningSync {
    constructor() {
        this.dbName = 'RajasthanEducationOffline';
        this.version = 1;
        this.db = null;
        this.syncQueue = [];
        this.isOnline = navigator.onLine;
        this.init();
    }

    async init() {
        await this.initDB();
        this.setupEventListeners();
        this.startPeriodicSync();
        console.log('Offline Learning System initialized');
    }

    // Initialize IndexedDB for offline storage
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Store for recorded lectures
                if (!db.objectStoreNames.contains('lectures')) {
                    const lectureStore = db.createObjectStore('lectures', { keyPath: 'id' });
                    lectureStore.createIndex('courseId', 'courseId', { unique: false });
                    lectureStore.createIndex('downloadDate', 'downloadDate', { unique: false });
                }
                
                // Store for course materials
                if (!db.objectStoreNames.contains('materials')) {
                    const materialStore = db.createObjectStore('materials', { keyPath: 'id' });
                    materialStore.createIndex('type', 'type', { unique: false });
                }
                
                // Store for user progress
                if (!db.objectStoreNames.contains('progress')) {
                    const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
                    progressStore.createIndex('userId', 'userId', { unique: false });
                }
            };
        });
    }

    // Setup online/offline event listeners
    setupEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncPendingData();
            this.showNotification('आप ऑनलाइन हैं! डेटा सिंक हो रहा है...', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification('आप ऑफलाइन हैं। सेव किया गया कंटेंट उपलब्ध है।', 'info');
        });
    }

    // Auto-download missed classes when online
    async autoDownloadMissedClasses(userId) {
        if (!this.isOnline) return;

        try {
            const response = await fetch(`/api/missed-classes/${userId}`);
            const missedClasses = await response.json();

            for (const classData of missedClasses) {
                await this.downloadCompressedLecture(classData);
            }
        } catch (error) {
            console.error('Error downloading missed classes:', error);
        }
    }

    // Download and compress lecture for offline viewing
    async downloadCompressedLecture(lectureData) {
        try {
            // Download compressed video (optimized for Jio Phone)
            const videoResponse = await fetch(lectureData.compressedVideoUrl);
            const videoBlob = await videoResponse.blob();
            
            // Download lecture notes (text format for low-end devices)
            const notesResponse = await fetch(lectureData.notesUrl);
            const notesText = await notesResponse.text();

            const offlineLecture = {
                id: lectureData.id,
                title: lectureData.title,
                courseId: lectureData.courseId,
                videoBlob: videoBlob,
                notes: notesText,
                duration: lectureData.duration,
                downloadDate: new Date().toISOString(),
                size: videoBlob.size,
                watched: false
            };

            await this.saveLectureOffline(offlineLecture);
            this.showNotification(`${lectureData.title} ऑफलाइन के लिए डाउनलोड हो गया`, 'success');
            
        } catch (error) {
            console.error('Error downloading lecture:', error);
        }
    }

    // Save lecture to IndexedDB
    async saveLectureOffline(lecture) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['lectures'], 'readwrite');
            const store = transaction.objectStore('lectures');
            const request = store.put(lecture);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Get offline lectures
    async getOfflineLectures(courseId = null) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['lectures'], 'readonly');
            const store = transaction.objectStore('lectures');
            
            let request;
            if (courseId) {
                const index = store.index('courseId');
                request = index.getAll(courseId);
            } else {
                request = store.getAll();
            }
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Play offline lecture
    async playOfflineLecture(lectureId) {
        try {
            const lecture = await this.getLectureById(lectureId);
            if (!lecture) {
                this.showNotification('लेक्चर नहीं मिला', 'error');
                return;
            }

            // Create video URL from blob
            const videoUrl = URL.createObjectURL(lecture.videoBlob);
            
            // Show offline player
            this.showOfflinePlayer(lecture, videoUrl);
            
            // Mark as watched
            await this.markLectureWatched(lectureId);
            
        } catch (error) {
            console.error('Error playing offline lecture:', error);
        }
    }

    // Show offline video player
    showOfflinePlayer(lecture, videoUrl) {
        const playerHTML = `
            <div class="offline-player-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10000;">
                <div class="player-container" style="padding: 20px; height: 100%; display: flex; flex-direction: column;">
                    <div class="player-header" style="color: white; margin-bottom: 10px;">
                        <button onclick="closeOfflinePlayer()" style="float: right; background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px;">✕</button>
                        <h3>${lecture.title}</h3>
                        <p>ऑफलाइन मोड | अवधि: ${lecture.duration}</p>
                    </div>
                    <video controls style="width: 100%; max-height: 60%; background: black;" autoplay>
                        <source src="${videoUrl}" type="video/mp4">
                        आपका ब्राउज़र वीडियो प्लेबैक को सपोर्ट नहीं करता।
                    </video>
                    <div class="lecture-notes" style="color: white; margin-top: 20px; overflow-y: auto; flex: 1;">
                        <h4>नोट्स:</h4>
                        <pre style="white-space: pre-wrap; font-family: Arial;">${lecture.notes}</pre>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', playerHTML);
    }

    // Sync progress when online
    async syncProgress(progressData) {
        if (this.isOnline) {
            try {
                await fetch('/api/sync-progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(progressData)
                });
            } catch (error) {
                // Add to sync queue if failed
                this.syncQueue.push({ type: 'progress', data: progressData });
            }
        } else {
            // Store locally
            this.syncQueue.push({ type: 'progress', data: progressData });
        }
    }

    // Periodic sync when online
    startPeriodicSync() {
        setInterval(() => {
            if (this.isOnline && this.syncQueue.length > 0) {
                this.syncPendingData();
            }
        }, 30000); // Every 30 seconds
    }

    // Sync pending data
    async syncPendingData() {
        const pendingItems = [...this.syncQueue];
        this.syncQueue = [];

        for (const item of pendingItems) {
            try {
                await fetch('/api/sync-data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                });
            } catch (error) {
                // Re-add to queue if failed
                this.syncQueue.push(item);
            }
        }
    }

    // Get storage usage
    async getStorageUsage() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            return {
                used: estimate.usage,
                available: estimate.quota,
                usedMB: Math.round(estimate.usage / 1024 / 1024),
                availableMB: Math.round(estimate.quota / 1024 / 1024)
            };
        }
        return null;
    }

    // Clean old lectures to free space
    async cleanOldLectures(daysOld = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const transaction = this.db.transaction(['lectures'], 'readwrite');
        const store = transaction.objectStore('lectures');
        const index = store.index('downloadDate');
        
        const request = index.openCursor(IDBKeyRange.upperBound(cutoffDate.toISOString()));
        
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            }
        };
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
        notification.innerHTML = `
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Helper methods
    async getLectureById(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['lectures'], 'readonly');
            const store = transaction.objectStore('lectures');
            const request = store.get(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async markLectureWatched(id) {
        const lecture = await this.getLectureById(id);
        if (lecture) {
            lecture.watched = true;
            lecture.lastWatched = new Date().toISOString();
            await this.saveLectureOffline(lecture);
        }
    }
}

// Global functions
window.closeOfflinePlayer = function() {
    const player = document.querySelector('.offline-player-modal');
    if (player) player.remove();
};

// Initialize offline learning system
const offlineSync = new OfflineLearningSync();

// Export for use in other files
window.OfflineLearningSync = OfflineLearningSync;
window.offlineSync = offlineSync;