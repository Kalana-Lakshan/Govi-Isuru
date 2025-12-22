// Govi Isuru Service Worker for Push Notifications
const CACHE_NAME = 'govi-isuru-news-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(clients.claim());
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  let data = {
    title: 'Govi Isuru News',
    body: 'New agriculture news available',
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: {}
  };

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (e) {
    console.error('Error parsing push data:', e);
  }

  const options = {
    body: data.body,
    icon: data.icon || '/logo192.png',
    badge: data.badge || '/logo192.png',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: data.actions || [
      { action: 'read', title: 'Read More', icon: '/logo192.png' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    tag: data.data?.articleId || 'govi-isuru-news',
    renotify: true,
    requireInteraction: data.data?.isUrgent || false
  };

  // Add Sinhala notification if urgent
  if (data.data?.isUrgent) {
    options.body = `🚨 ${data.body}\n\nහදිසි කෘෂිකාර්මික ප්‍රවෘත්ති!`;
    options.vibrate = [200, 100, 200, 100, 200];
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Open the article URL or the app
  const urlToOpen = event.notification.data?.url || '/news';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window/tab open
        for (let client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            if (event.notification.data?.url) {
              client.navigate(urlToOpen);
            }
            return;
          }
        }
        // Open new window if no existing window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed');
});

// Background sync for offline support
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-news') {
    event.waitUntil(syncNews());
  }
});

async function syncNews() {
  try {
    const response = await fetch('/api/news?category=agriculture');
    if (response.ok) {
      const data = await response.json();
      // Cache the news data
      const cache = await caches.open(CACHE_NAME);
      await cache.put('/api/news?category=agriculture', new Response(JSON.stringify(data)));
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Periodic background sync for checking urgent news
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-urgent-news') {
    event.waitUntil(checkUrgentNews());
  }
});

async function checkUrgentNews() {
  try {
    const response = await fetch('/api/news/headlines');
    if (response.ok) {
      const data = await response.json();
      // Check for urgent headlines and show notification
      if (data.headlines && data.headlines.length > 0) {
        const urgentKeywords = ['emergency', 'urgent', 'alert', 'warning', 'flood', 'drought'];
        const urgentNews = data.headlines.find(h => 
          urgentKeywords.some(k => h.title.toLowerCase().includes(k))
        );
        
        if (urgentNews) {
          self.registration.showNotification('🚨 Urgent News Alert', {
            body: urgentNews.title,
            icon: '/logo192.png',
            data: { url: urgentNews.url, isUrgent: true },
            requireInteraction: true
          });
        }
      }
    }
  } catch (error) {
    console.error('Urgent news check failed:', error);
  }
}
