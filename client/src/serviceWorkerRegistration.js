// serviceWorkerRegistration.js

// Determina si la app se ejecuta en localhost
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );
  
  export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      // La URL se construye a partir de la variable PUBLIC_URL
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) {
        // El service worker no funcionará si PUBLIC_URL está en un origen diferente.
        return;
      }
  
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        if (isLocalhost) {
          // En localhost, valida si existe un service worker previamente registrado
          checkValidServiceWorker(swUrl, config);
  
          // También se puede añadir un log para desarrollo
          navigator.serviceWorker.ready.then(() => {
            console.log('Esta app se está sirviendo en modo cache-first mediante un service worker.');
          });
        } else {
          // En producción, se registra directamente
          registerValidSW(swUrl, config);
        }
      });
    }
  }
  
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Nuevo contenido disponible; notifica al usuario o actualiza la app
                console.log('Nuevo contenido disponible; por favor, actualiza.');
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                // Contenido cacheado para uso offline.
                console.log('Contenido cacheado para uso offline.');
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          };
        };
      })
      .catch(error => {
        console.error('Error durante el registro del service worker:', error);
      });
  }
  
  function checkValidServiceWorker(swUrl, config) {
    // Verifica que el service worker existe. Si no es así, recarga la página.
    fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    })
      .then(response => {
        const contentType = response.headers.get('content-type');
        if (
          response.status === 404 ||
          (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
          // No se encontró el service worker. Desregistralo y recarga.
          navigator.serviceWorker.ready.then(registration => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          // El service worker se encontró. Procede con el registro.
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log('Sin conexión a internet. La app está funcionando en modo offline.');
      });
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(registration => {
          registration.unregister();
        })
        .catch(error => {
          console.error(error.message);
        });
    }
  }
  