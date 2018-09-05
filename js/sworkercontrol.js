//  encapsulate service worker interaction with main script in a class named "sWorkerControl"
class sWorkerControl {

  //  pass in path to the JavaScript service worker and path defining its scope
  constructor(workerPath) {
    
    this.workerPath = workerPath;
    
    //  ServiceWorkerRegistrationObject
    this.swRegObj = null;
    //  handle to a ServiceWorker instance
    this.sWorker = null;
  }

  reloadForGoodMeasure() {
    if (this.sWorker && (this.sWorker.state === 'activated')) {
      //this.sWorker.removeEventListener('statechange', this.reloadForGoodMeasure.bind(this));
      document.location.reload();
    }
  }

  //  create and display HTML form allowing user to select updating the site or ignoring us
  nagUserToUpdateSite() {
    console.log(`nagUserToUpdateSite 01: ${this.workerPath}`);
    if (this.sWorker && (this.sWorker.state === 'installed')) {
        console.log(`nagUserToUpdateSite 02: state is installed`);    
        document.body.insertAdjacentHTML('afterbegin', `<div class="update-alert">
        <span>An update to this site is available.</span>
        <button class="install-sw">INSTALL</button>
        <button class="dismiss-sw">DISMISS</button>
        </div>`);
        
        document.querySelector(".install-sw").addEventListener('click', (event)=>{
            this.sWorker.postMessage({command: 'skipWaiting'});
            document.querySelector(".update-alert").remove();
            //  when the service worker state changes to "activated", reload the page so it will
            //  cache all assets
            this.sWorker.addEventListener('statechange', this.reloadForGoodMeasure.bind(this));
        });

        document.querySelector(".dismiss-sw").addEventListener('click', (event)=>{
            document.querySelector(".update-alert").remove();
        });
    }
  }

  //  initialize event listener for new service worker attaining the "installed" state
  launchListenerForInstalled() {
    console.log(`launchListenerForInstalled 01: ${this.workerPath}`);
    if (this.sWorker) {
        this.sWorker.addEventListener('statechange', this.nagUserToUpdateSite.bind(this));
    }
  };

  //  event handler for ServiceWorkerRegistration.onupdatefound
  onUpdateFound() {
    console.log(`onUpdateFound 01: ${this.workerPath}`);
    if (this.swRegObj) {
      //  the serviceWorker state is assumed to be "installing"; grab a handle on it
      //  (or try), and if successful, launch the event listener for its 'waiting' state
      this.sWorker = this.swRegObj.installing;
      this.launchListenerForInstalled();
    }
  }

  //    triggers chain of events that may result in removal of an outdated service worker and
  //    immediate launch of the new service worker
  prepOldWorkerRemoval(swRegObj) {
    console.log(`prepOldWorkerRemoval 01: ${this.workerPath}`);
    //  latch reference to the ServiceWorkerRegistration object, so we can keep using it
    this.swRegObj = swRegObj;
    console.log(`prepOldWorkerRemoval 02: ${this.swRegObj.scope}`);

    //  if there's an old service worker already active, set-up to determine
    //  when the new worker is finished installing so we can then delete the old
    //  worker and force the new one to become active
    if (navigator.serviceWorker.controller) {
      //  try to get a handle on the new service worker so an event listener can be
      //  linked to it; the handle comes from the registration state, which isn't the same
      //  as the service worker state
      //  case 1 -- see if it's installing; if so, set a listener to trigger when it's installed
      this.sWorker = swRegObj.installing;
      console.log(`prepOldWorkerRemoval: installing?: ${this.sWorker}`);
      if (this.sWorker) {
        this.launchListenerForInstalled();
      } else {
        //  else new worker isn't installing, so we don't have a handle yet
        //  case 2 -- if not installing, see if it's waiting already (which implies it's also "installed")
        this.sWorker = swRegObj.waiting;
        console.log(`prepOldWorkerRemoval: waiting?: ${this.sWorker}`);
        //  no need for an event listener in case 2 -- just prompt user to update the site
        if (this.sWorker) {
          this.nagUserToUpdateSite();
        //  case 3 -- not installing or waiting; set the onupdatefound
        //            event handler to set a listener if the state finally hits installing; it might not,
        //            if this is a redundant service worker
        } else {

          this.swRegObj.onupdatefound = this.onUpdateFound.bind(this);
          console.log(`prepOldWorkerRemoval: not installing or waiting`);
        }
      }
    } else {
      console.log(`prepOldWorkerRemoval: !navigator.serviceWorker.controller`);
    }    
  };

  //  call this after calling the constructor -- registers the service worker in the navigator
  registerWorker() {

    console.log(`registerWorker 01: ${this.workerPath}`);
    
    //  if the browser supports the serviceWorker API
    if (navigator.serviceWorker) {
      //  register the service worker, setting its scope to the whole website, then set-up to prompt
      //  the user to update the website and launch the new service worker immediately
      navigator.serviceWorker.register(this.workerPath, {scope: '/'})
      .then(this.prepOldWorkerRemoval.bind(this))
      .catch(err=>{console.log(`registerWorker err: ${err}`);});
    }
  }

}

let SWcontroller = new sWorkerControl('../sw.js');
SWcontroller.registerWorker();
