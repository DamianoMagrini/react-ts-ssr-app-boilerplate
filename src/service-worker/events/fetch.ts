import { ExtendableEvent } from '../extendable-event';

export default (CACHE_NAME: string) => (event: ExtendableEvent) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((response) => {
        // If the requested resource was cached, send the version from cache.
        if (response) {
          return response;
        }

        // Otherwise, just fetch the resource and cache it.
        return fetch(event.request).then((response) => {
          // If the response is not valid, return without caching it.
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          // Clone the response to not interfere with scripts that may need to use it.
          const cloned_response = response.clone();

          // Add the cloned response to the cache, at its url.
          cache.put(event.request, cloned_response);

          // Return the original response.
          return response;
        });
      })
    )
  );
};
