// Offline-First Service Worker for Rural Education
const CACHE_NAME = 'rajasthan-education-offline-v1';
const OFFLINE_CACHE = 'offline-content-v1';

// Essential files to cache for offline functionality
const ESSENTIAL_FILES = [
    '/',
    '/index.html',
    '/offline-learning.html',
    '/css/chatbot.css',
    '/rajasthan-style.css',
    '/style.css',
    '/js/offline-sync.js',
    '/js/jio-phone-optimizer.js',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache essential files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching essential files for offline use');
                return cache.addAll(ESSENTIAL_FILES);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Handle different types of requests
    if (event.request.url.includes('/api/')) {
        // API requests - try network first, fallback to offline data
        event.respondWith(handleApiRequest(event.request));
    } else if (event.request.url.includes('.mp4') || event.request.url.includes('video')) {
        // Video requests - serve from offline cache
        event.respondWith(handleVideoRequest(event.request));
    } else {
        // Regular requests - cache first strategy
        event.respondWith(handleRegularRequest(event.request));
    }
});

// Handle API requests with offline fallback
async function handleApiRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(OFFLINE_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
    } catch (error) {
        // Fallback to cached data
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline fallback data
        return new Response(JSON.stringify({
            error: 'offline',
            message: 'आप ऑफलाइन हैं। कैश किया गया डेटा उपलब्ध नहीं है।'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Handle video requests from offline storage
async function handleVideoRequest(request) {
    try {
        // Check offline cache first for videos
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Try network if not in cache
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache video for offline use (if space available)
            const cache = await caches.open(OFFLINE_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Video not available');
    } catch (error) {
        // Return offline video placeholder
        return new Response('Video not available offline', {
            status: 404,
            statusText: 'Video not cached for offline use'
        });
    }
}

// Handle regular requests (HTML, CSS, JS)
async function handleRegularRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Try network
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
    } catch (error) {
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            const offlinePage = await caches.match('/offline-learning.html');
            return offlinePage || new Response('Offline - कृपया इंटरनेट कनेक्शन चेक करें', {
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }
        
        return new Response('Resource not available offline', {
            status: 404,
            statusText: 'Offline'
        });
    }
}

// Background sync for missed classes
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(syncMissedClasses());
    }
});

// Sync missed classes in background
async function syncMissedClasses() {
    try {
        // Get user data from IndexedDB
        const userId = await getUserId();
        if (!userId) return;
        
        // Fetch missed classes
        const response = await fetch(`/api/missed-classes/${userId}`);
        const missedClasses = await response.json();
        
        // Download compressed versions
        for (const classData of missedClasses) {
            await downloadAndCacheVideo(classData);
        }
        
        // Notify user
        self.registration.showNotification('नई क्लासेस डाउनलोड हो गईं', {
            body: `${missedClasses.length} नए लेक्चर ऑफलाइन उपलब्ध हैं`,
            icon: '/images/icon/logo.png',
            badge: '/images/icon/favicon.png',
            tag: 'missed-classes'
        });
        
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Download and cache video for offline use
async function downloadAndCacheVideo(classData) {
    try {
        // Download compressed video
        const videoResponse = await fetch(classData.compressedVideoUrl);
        const videoBlob = await videoResponse.blob();
        
        // Store in cache
        const cache = await caches.open(OFFLINE_CACHE);
        await cache.put(classData.compressedVideoUrl, new Response(videoBlob));
        
        // Store metadata in IndexedDB
        await storeVideoMetadata(classData);
        
    } catch (error) {
        console.error('Failed to download video:', error);
    }
}

// Store video metadata in IndexedDB
async function storeVideoMetadata(classData) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('RajasthanEducationOffline', 1);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['lectures'], 'readwrite');
            const store = transaction.objectStore('lectures');
            
            const lectureData = {
                id: classData.id,
                title: classData.title,
                courseId: classData.courseId,
                duration: classData.duration,
                downloadDate: new Date().toISOString(),
                size: classData.compressedSize,
                watched: false,
                offline: true
            };
            
            store.put(lectureData);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        };
        
        request.onerror = () => reject(request.error);
    });
}

// Get user ID from IndexedDB
async function getUserId() {
    return new Promise((resolve) => {
        const request = indexedDB.open('RajasthanEducationOffline', 1);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['user'], 'readonly');
            const store = transaction.objectStore('user');
            const getRequest = store.get('currentUser');
            
            getRequest.onsuccess = () => {
                resolve(getRequest.result?.userId || null);
            };
            
            getRequest.onerror = () => resolve(null);
        };
        
        request.onerror = () => resolve(null);
    });
}

// Handle push notifications for new classes
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body || 'नई क्लास उपलब्ध है',
            icon: '/images/icon/logo.png',
            badge: '/images/icon/favicon.png',
            tag: data.tag || 'new-class',
            data: data.url || '/offline-learning.html',
            actions: [
                {
                    action: 'download',
                    title: 'डाउनलोड करें'
                },
                {
                    action: 'view',
                    title: 'देखें'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'नई क्लास', options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'download') {
        // Trigger background download
        event.waitUntil(syncMissedClasses());
    } else {
        // Open the app
        event.waitUntil(
            clients.openWindow(event.notification.data || '/offline-learning.html')
        );
    }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'content-sync') {
        event.waitUntil(syncMissedClasses());
    }
});

console.log('Offline-First Service Worker loaded for Rajasthan Education Platform');