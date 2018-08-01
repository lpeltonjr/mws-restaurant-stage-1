const myCache = 'mySiteVersion001';
const assets = [
    '/',
//    '/index.html',
//    '/restaurant.html',
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

self.addEventListener('fetch', (event)=>{
    let cacheRef;
    caches.open(myCache).then((cache)=>{
        cache.match(event.request).then((response)=>{
            if (response) return(response);
            fetch(event.request).then((resp)=>{
                cache.put(event.request, resp.clone()).then(()=>resp).catch((e)=>resp);
            });
        });
    });
});
