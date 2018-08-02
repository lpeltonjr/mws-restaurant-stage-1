const myCache = 'mySiteVersion002';
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

//  cache most assets on install
self.addEventListener('install', (event)=>{
    event.waitUntil(caches.open(myCache).then(cache=>cache.addAll(assets)));
});

//  intercept fetch events and supply reponse from cache, if possi
self.addEventListener('fetch', (event)=>{

    caches.open(myCache).then((cache)=>{
        cache.match(event.request).then((response)=>{
            if (response) return(response);
            //  if response can't be supplied from cache, get it off the
            //  web and cache it (if possible) before supplying it to
            //  the site, so it can be supplied from the cache next time
            fetch(event.request).then((resp)=>{
                //  note that this restaurant review site has some assets that
                //  throw an error at this point when cache is attempted;
                //  something to do with http and chrome-extension;
                //  I don't know why, though there are technical explanations for it
                //  online; I'm just trying to ignore the error without allowing it to 
                //  cause problems
                cache.put(event.request, resp.clone()).then(()=>resp).catch((e)=>resp);
            });
        });
    });
});
