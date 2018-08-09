const myCache = 'mySiteVersion002';
const assets = [
    '/',
    'index.html',
    'restaurant.html',
//  'sw.js',
//  '/js/',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/js/sworkercontrol.js',
//  '/data/',
    '/data/restaurants.json',
//  '/css/',
    '/css/styles.css'
];

//  cache most assets on install
self.addEventListener('install', (event)=>{
    event.waitUntil(caches.open(myCache).then(
        cache=>cache.addAll(assets))//.catch(
        /*    e=>{
                console.log(assets);
                console.log(e);
            }
        ) */
    );
});

//  intercept fetch events and supply reponse from cache, if possible
self.addEventListener('fetch', (event)=>{
//  console.log(event.request.url);
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

//  when the SWcontroller instance sends us a message to skip waiting and takeover
self.addEventListener('message', (event)=>{
    if (event.data.command === 'skipWaiting') self.skipWaiting();
});


//  when this service worker first activates ...
self.addEventListener('activate', (event)=>{

    //  get the list of caches in the cache storage
    event.waitUntil(caches.keys().then((list)=>{
        //  the cache we implemented above is also included, so first remove it
        //  from the list
        let idx1 = list.indexOf(myCache);
        let promiseList = [];
        if (idx1 !== -1) {
            list.splice(idx1, 1);
            //  after removing the new cache from the list, delete all old versions
            //  of the new cache, from old service workers
            list.forEach((item)=>{
                if (item.startsWith('mySiteVersion'))
                {
                    promiseList.push(caches.delete(item));
                }
            });
        
            return(Promise.all(promiseList));
        }
    }));
});