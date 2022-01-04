let cacheName = "cache-v2";

//Files to save in cache
let files = [
  "/__/firebase/init.js",
  "/__/firebase/8.6.8/firebase-app.js",
  "/__/firebase/8.6.8/firebase-firestore.js",
  "/css/explorer.css",
  "https://cdn01.boxcdn.net/platform/elements/13.0.0/en-US/explorer.js"
];

//Adding `install` event listener
self.addEventListener("install", (event) => {

  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache
        .addAll(files)
        .then(() => {
          return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
        })
        .catch((error) => {
          console.info("Failed to cache", error);
        });
    })
  );
});


//Adding `fetch` event listener
self.addEventListener("fetch", (event) => {
  var request = event.request;
  var url = new URL(request.url);
  if (files.includes(url.pathname)) {
    // Static files cache
    event.respondWith(cacheFirst(request));
  } else {
    // Dynamic API cache
    event.respondWith(networkFirst(request));
  }

});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}

async function networkFirst(request) {
  const networkResponse = await fetch(request);
  return networkResponse;
}

//Adding `activate` event listener
self.addEventListener("activate", (event) => {
  //Remove old and unwanted caches
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== cacheName) {
              return caches.delete(cache); //Deleting the old cache (cache v1)
            }
          })
        );
      })
      .then(function () {
        return self.clients.claim(); //Old caches are cleared!
      })
  );
});
