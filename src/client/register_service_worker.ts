export default () => {
  console.log('Registering service worker...');

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service-worker.js').then(
        (registration) => {},
        (err) => {
          // Throw an error if the registration failed.
          console.error('Service worker registration failed: ', err);
        }
      );
    });
  }
};
