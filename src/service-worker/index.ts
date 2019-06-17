import on_fetch from './events/fetch';
import on_activate from './events/activate';
import on_install from './events/install';

/*
  The name of the cache to use. This should be changed every time the service worker is updated.
*/
const CACHE_NAME = 'cache-v1';

// An array of the URLs to cache as soon as the worker starts.
const urls_to_cache = ['/', '/index.bundle.js']; // and...

/*
  Code to run as soon as the service worker is installed. This will cache the
  URLs specified above.
*/
self.addEventListener('install', on_install(CACHE_NAME, urls_to_cache));

/*
  Code to run when the service worker is activated; that is, when it has been
  successfully installed and any previous service workers have been removed.
  This will clear the old caches, used by previous versions of the service
  worker, unless otherwise specified.
*/
self.addEventListener('activate', on_activate(CACHE_NAME));

/*
  Track and cache each fetched resource. If it is already in cache, just return
  the cached version. If, instead, a requested resource is not available
  because it was not yet cached and the client is offline, return the index.
*/
self.addEventListener('fetch', on_fetch(CACHE_NAME));
