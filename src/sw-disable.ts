// Disable any existing service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('Service Worker unregistered');
    }
  });
  
  // Prevent new service workers from registering
  navigator.serviceWorker.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      event.ports[0].postMessage({ type: 'SKIP_WAITING' });
    }
  });
} 