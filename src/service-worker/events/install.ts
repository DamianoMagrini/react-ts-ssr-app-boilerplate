import { ExtendableEvent } from '../extendable-event';

export default (CACHE_NAME: string, urls_to_cache: string[]) => (
  event: ExtendableEvent
) => {
  // Prevent the worker from being deactivated at this time.
  event.waitUntil(
    // Open the current version of the cache.
    caches.open(CACHE_NAME).then((cache) => {
      // Add each URL specified above to the cache.
      return cache.addAll(urls_to_cache);
    })
  );
};
