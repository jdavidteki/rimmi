/* eslint-env browser */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/rimmi/expo-service-worker.js', { scope: '/rimmi/' })
      .then(function (info) {
        // console.info('Registered service-worker', info);
      })
      .catch(function (error) {
        console.info('Failed to register service-worker', error);
      });
  });
}
