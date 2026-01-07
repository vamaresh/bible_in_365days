import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Unregister old service workers and force reload
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister().then(() => {
          console.log('Old SW unregistered');
        });
      }
    });
    
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
          console.log('Cache deleted:', name);
        });
      });
    }
    
    // Register new service worker
    setTimeout(() => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered successfully:', registration);
          console.log('SW scope:', registration.scope);
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    }, 1000);
  });
} else {
  console.log('Service workers not supported');
}

// Client-side app version check to force-refresh stubborn caches (iOS/Safari fallback)
(async function checkAppVersion() {
  try {
    const res = await fetch('/app-version.json', { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    const serverVersion = data.version;
    const localVersion = localStorage.getItem('app_version');
    if (!localVersion) {
      localStorage.setItem('app_version', serverVersion);
    } else if (localVersion !== serverVersion) {
      // version changed -> clear caches and reload to get latest shell
      console.log('App version changed:', localVersion, '->', serverVersion);
      localStorage.setItem('app_version', serverVersion);
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map(n => caches.delete(n)));
        console.log('Cleared caches due to new app version');
      }
      // unregister SWs and do a hard reload
      if (navigator.serviceWorker) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      window.location.reload(true);
    }
  } catch (e) {
    console.warn('App version check failed', e);
  }
})();

// Push subscription helper: attempt to subscribe and POST subscription to server
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

(async function tryPushSubscribe() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    // Only attempt if permission granted
    if (Notification.permission !== 'granted') return;
    // Ask server for VAPID public key
    let pubRes;
    try {
      pubRes = await fetch('/vapidPublicKey');
    } catch (e) {
      console.warn('No push server available at /vapidPublicKey');
      return;
    }
    if (!pubRes.ok) return;
    const { publicKey } = await pubRes.json();
    if (!publicKey) return;

    const existing = await reg.pushManager.getSubscription();
    if (existing) {
      console.log('Already subscribed to push');
      return;
    }

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });

    try {
      await fetch('/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      });
      console.log('Push subscription sent to server');
      localStorage.setItem('push_subscription', JSON.stringify(sub));
    } catch (e) {
      console.warn('Failed to send push subscription to server', e);
    }
  } catch (e) {
    console.warn('Push subscribe failed', e);
  }
})();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
