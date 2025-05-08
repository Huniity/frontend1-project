const CACHE_NAME = "nah-later-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/create_task.html",
    "/styles/index.css",
    "/scripts/todo_main.js",
    "/scripts/create_task.js",
    "/scripts/utils.js",
    "/scripts/dark_mode.js",
    "/scripts/datetime.js",
    "/images/favicon.png",
    "https://cdn.jsdelivr.net/npm/sweetalert2@11"
];


self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});


self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {

            return response || fetch(event.request);
        })
    );
});


self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});