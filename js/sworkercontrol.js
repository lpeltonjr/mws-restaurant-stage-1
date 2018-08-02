//  encapsulate service worker interaction with main script in a class named "sWorkerControl"
class sWorkerControl {

  //  pass in path to the JavaScript service worker and path defining its scope
  constructor(workerPath, scopeStr) {
    if (!scopeStr) scopeStr = './';

    this.workerPath = workerPath;
    this.scope = {scope: scopeStr};
    //  ServiceWorkerRegistrationObject
    this.swRegObj = null;
    //  handle to a ServiceWorker instance
    this.sWorker = null;
  }

  //  TODO:
  //  create and display HTML form allowing user to select updating the site or ignoring us
  nagUserToUpdateSite() {
    if (this.sWorker && (this.sWorker.state === 'waiting')) {
        
        document.body.insertAdjacentHTML('afterbegin', `<div class="update-alert">
        <span>An update to this site is available.</span>
        <button class="install-sw">INSTALL</button>
        <button class="dismiss-sw">DISMISS</button>
        </div>`);
        
        document.querySelector(".install-sw").addEventListener('click', (event)=>{
            document.querySelector(".update-alert").remove();
        });

        document.querySelector(".dismiss-sw").addEventListener('click', (event)=>{
            document.querySelector(".update-alert").remove();
        });
    }
  }

  //  initialize event listener for new service worker attaining the "waiting" state
  launchListenerForWaiting() {
    if (this.sWorker) {
        this.sWorker.addEventListener('statechange', this.nagUserToUpdateSite.bind(this));
    }
  };

  //  event handler for ServiceWorkerRegistration.onupdatefound
  onUpdateFound() {
    if (this.swRegObj) {
      //  the serviceWorker state is assumed to be "installing"; grab a handle on it
      //  (or try), and if successful, lauch the event listener for its 'waiting' state
      this.sWorker = this.swRegObj.installing;
      this.launchListenerForWaiting();
    }
  }

  //    triggers chain of events that may result in removal of an outdated service worker and
  //    immediate launch of the new service worker
  prepOldWorkerRemoval(swRegObj) {
    console.log(this);
    //  latch reference to the ServiceWorkerRegistration object, so we can keep using it
    this.swRegObj = swRegObj;

    //  if there's an old service worker already active, set-up to determine
    //  when the new worker is finished installing so we can then delete the old
    //  worker and force the new one to become active
    if (navigator.serviceWorker.controller) {
      //  try to get a handle on the new service worker so an event listener can be
      //  linked to it; apparently, we can't get a handle without knowing the current
      //  state, which just seems inadequate
      //  case 1 -- see if it's installing; if so, set a listener to trigger when it's waiting
      this.sWorker = swRegObj.installing;
      if (this.sWorker) this.launchListenerForWaiting();
      //  else new worker isn't installing, so we don't have a handle yet
      else {
        //  case 2 -- if not installing, see if it's waiting already
        this.sWorker = swRegObj.waiting;
        if (this.sWorker) {
          this.nagUserToUpdateSite();
        //  case 3 -- not installing or waiting; state is pre-install; set the onupdatefound
        //            event handler to set a listener when the state finally hits installing
        } else {

          this.swRegObj.onupdatefound = this.onUpdateFound.bind(this);
        }
      }
    }    
  };

  //  call this after calling the constructor -- registers the service worker in the navigator
  registerWorker() {
    
    //  if the browser supports the serviceWorker API
    if (navigator.serviceWorker) {
      //  register the service worker, setting its scope to the whole website, then set-up to prompt
      //  the user to update the website and launch the new service worker immediately
      navigator.serviceWorker.register(this.workerPath, this.scope).then(this.prepOldWorkerRemoval.bind(this));
    }
  }

}

let SWcontroller = new sWorkerControl('./sw.js');
SWcontroller.registerWorker();
SWcontroller.nagUserToUpdateSite();
