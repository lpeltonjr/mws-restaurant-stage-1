const myCache = 'mySiteVersion002';
const assets = [
    './',
    './index.html',
    './restaurant.html',
    './js/',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
    './js/sworkercontrol.js',
    './data/',
    './data/restaurants.json',
    './css/',
    './css/styles.css'/*,
    './img/1_44.jpg',
    './img/1_66.jpg',
    './img/1.jpg',
    './img/2_44.jpg',
    './img/2_66.jpg',
    './img/2.jpg',
    './img/3_44.jpg',
    './img/3_66.jpg',
    './img/3.jpg',
    './img/4_44.jpg',
    './img/4_66.jpg',
    './img/4.jpg',     
    './img/5_44.jpg',
    './img/5_66.jpg',
    './img/5.jpg',  
    './img/6_44.jpg',
    './img/6_66.jpg',
    './img/6.jpg',   
    './img/7_44.jpg',
    './img/7_66.jpg',
    './img/7.jpg', 
    './img/8_44.jpg',
    './img/8_66.jpg',
    './img/8.jpg',    
    './img/9_44.jpg',
    './img/9_66.jpg',
    './img/9.jpg',
    './img/10_44.jpg',
    './img/10_66.jpg',
    './img/10.jpg' */  
];

//  cache most assets on install
self.addEventListener('install', (event)=>{
    console.log(`enter sw install event handler`);    
    event.waitUntil(
        caches.open(myCache)
        .then(cache=>cache.addAll(assets))
//      .then(()=>console.log(`initial cache complete`))
        .catch(err=>console.log(`install event handler error: ${err}`))
    );
});


//  intercept fetch events and supply reponse from cache, if possible
self.addEventListener('fetch', (event)=>{
    event.respondWith(
        caches.open(myCache)
        .then(cache=>cache.match(event.request))
        .then(response=>{
            //  create a closure around this variable to clone the response
            //  to the fetch below; the clone is cached but the actual response
            //  is returned to the website before the cache promise chain is fulfilled
            let resplcl;

            //  if the request/response couldn't be located in the cached fetch
            //  events, then go ahead and fetch it online and then cache it for next time
            if (!response) {
                
                response =  fetch(event.request)
                            .then(resp=>{
                                resplcl = resp.clone();
                                caches.open(myCache)
                                .then(cache=>cache.put(event.request, resplcl));
                                return (resp);
                            });
            //  but if the request/response were located in the cache, supply the cached response
            //  to the browser
            }
            
            return (response);
        })
    );
});



//  when the SWcontroller instance sends us a message to skip waiting and takeover
self.addEventListener('message', (event)=>{
    if (event.data.command === 'skipWaiting') {
        self.skipWaiting();
    }
});


//  when this service worker first activates ...
self.addEventListener('activate', (event)=>{
    event.waitUntil(
        caches.keys()
        .then((list)=>{
            //  the cache we implemented above is also included, so first remove it
            //  from the list
            let idx1 = list.indexOf(myCache);
            console.log(`activate event listener: index of myCache: ${idx1}`);
            let promiseList = [];
            if (idx1 !== -1) {
                list.splice(idx1, 1);
                console.log(`activate event listener: list size after splice: ${list.length}`);
                //  after removing the new cache from the list, delete all old versions
                //  of the new cache, from old service workers
                list.forEach((item)=>{
                    if (item.startsWith('mySiteVersion'))   {
                        console.log(`activate event listener: deleting ${item} from caches`);
                        promiseList.push(caches.delete(item));
                    }
                });
            }
            return(Promise.all(promiseList));
        })
        .then(()=>{
            console.log(`activate event listener: finished deleting caches`);
        })
        .catch(err=>{
            console.log(`activate event listener: final error: ${err}`);
        })
    );
});
