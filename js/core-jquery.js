// self-executing function
var CORE = (function () {
  var moduleData = {},
  // method that changes anything to a string
  to_s = function(anything) { return Object.prototype.toString.call(anything); };

  debug = true;
  
  // function that core uses to manage modules
  return {
    // log errors to console or back to server
    debug : function(on) {
      debug = on ? true : false;
    },

    create_module : function(moduleID, creator) {
      var temp;
      if (typeof moduleId === 'string' && typeof creator === 'function') {
        temp = creator(Sandbox.create(this, moduleID));
        // check if data is enough to create working module
        if (temp.init && typeof temp.init === 'function' && temp.destroy && typeof temp.destroy === 'function') {
          temp = null;
          moduleData[moduleId] = {
            create : creator,
            instance : null
          };
        } else {
          // log severity of 1 (lowest) and error message
          this.log(1, "Module '" + moduleID + "' Registration : FAILED : instance has no init or destroy functions");
        }
      } else {
        this.log(1, "Module '" + to_s(moduleID) + "' Registration : FAILED : one or more of the arguments are of incorrect type");
      }
    },

    start : function(moduleID) {
      var mod = moduleData[moduleID];
      // does mod exist
      if(mod) {
        // create sandbox object
        mod.instance = mod.create(Sandbox.create(this, moduleID));
        // run module
        mod.instance.init();
      }
    },

    start_all : function() {
      // make sure not to include to prototype, anything that had been added
      var moduleID;
      for (moduleID in moduleData) {
        if(moduleData.hasOwnProperty(moduleID)) {
          this.start(moduleID);
        }
      }
    },

    stop : function(moduleID) {
      var data;
      // if there's a module w name we want & if data.instance
      if(data = moduleData[moduleId] && ) {
        data.instance.destroy();
        data.instance = null;
      } else {
        // log error when tried to stop something that wasn't running or doesn't exist
        this.log(1, "Stop Module '" + moduleID + "': FAILED : module does not exist or has not been started");
      }
    },

    stop_all : function() {
      var moduleID;
      for (moduleID in moduleData) {
        if(moduleData.hasOwnProperty(moduleID)) {
          this.stop(moduleID);
        }
      }
    },

    register_events : function(evts, mod) {
      // if object is evts and module is passed in
      if(this.is_obj(evts) && mod) {
        // if module data includes module we're requesting
        if(moduleData[mod]) {
          moduleData[mod].events = evts;
        } else {
          this.log(1, "Module '" + moduleID + "' Event Registration : FAILED : module data doesn't inclue module requested");
        }
      } else {
        this.log(1, "Module '" + moduleID + "' Event Registration : FAILED : no events exist or module not passed");
      }
    },

    // method that notifies sandbox when event occurs
    triggerEvent : function(evt) {
      var mod;
      for(mod in moduleData) {
        // if module accepts events, meaning events have been registered for that module
        if(moduleData.hasOwnProperty(mod)) {
          mod = moduleData[mod];
          // if event we're looking at is relevant to that module
          if(mod.events && mod.events[evt.type]) {
            // execute when this event happens and pass in data
            mod.events[evt.type](evt.data);
          }
        }
      }
    },

    removeEvents : function(evts, mod) {
      // if events is an object, and if there's a module, and it's the module name we want, and if the module has events related to it
      if(this.is_obj(evts) && mod && (mod = moduleData[mod]) && mod.events) {
        delete mod.events;
      }
    },

    log : function(severity, message) {
      if(debug) {
        console[ (severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
      } else {
        // send it to the server
      }
    },

    dom : {
      query : function(selector, context) {
        var ret = {}, 
        that = this, 
        jqEl, i = 0;

        // context is a jQuery object
        // if context was passed in, and context has a find method
        if (context && context.find) {
          jqEls = context.find(selector);
        } else {
          jQuery(selector);
        }

        // return object w all elements that jQuery found relating to selector
        ret = jqEls.get();
        ret.length = jqEls.length;
        // ability to search for objects underneath itself
        ret.query = function(sel) {
          return that.query(sel, jqEls);
        }
        return ret;
      },

      bind : function(element, evt, fn) {
        //error checking 
        if(element && evt) {
          if(typeof evt === 'function') {
            fn = evt;
            // function will assume a click
            evt = 'click';
          }
          jQuery(element).bind(evt, fn);  
        } else {
          // log wrong arguments
        }
      } ,

      unbind : function() {
        if(element && evt) {
          if(typeof evt === 'function') {
            fn = evt;
            evt = 'click';
          }
          jQuery(element).unbind(evt, fn);  
        } else {
          // log wrong arguments
        }
      },

      create : function(el) {
        return document.createElement(el);
      },

      apply_attrs : function(el, attrs) {
        jQuery(el).attr(attrs);
      }
    },

    is_arr : function(arr) {
      return jQuery.isArray(arr);
    },

    is_obj : function(obj) {
      return jQuery.isPlainObject(obj);
    }
  };
  // function that core inherits fr base to pass to sandbox
}());