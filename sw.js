const myCache = 'mySiteVersion001';
const assets = [
    '/index.html',
    '/restaurant.html',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
    'js/sworkercontrol.js',
    'data/restaurants.json',
    'css/styles.css'
];

self.addEventListener('install', (event)=>{
    event.waitUntil(caches.open(myCache).then(cache=>cache.addAll(assets)));
});
