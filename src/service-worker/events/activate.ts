import { ExtendableEvent } from '../extendable-event';

export default (CACHE_NAME: string) => (event: ExtendableEvent) => {
  const cache_whitelist = [CACHE_NAME];

  // Prevent the worker from being deactivated at this time.
  event.waitUntil(
    // Asynchronously iterate through every cache.
    caches.keys().then((cache_names) =>
      Promise.all(
        // @ts-ignore - TypeScript doesn't seem to like this line (why?).
        cache_names.map((cache_name) => {
          // If the cache is not whitelisted, delete it.
          if (cache_whitelist.indexOf(cache_name) === -1) {
            return caches.delete(cache_name);
          }
        })
      )
    )
  );
};
