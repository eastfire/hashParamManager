(function() {
  var root = this;
  var previousHashParamManager = root.hashParamManager;

  var Ctor = function(){};

  var hashParamManager = function(obj) {
    if (obj instanceof hashParamManager) return obj;
    if (!(this instanceof hashParamManager)) return new hashParamManager(obj);
    this._wrapped = obj;
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = hashParamManager;
    }
    exports.hashParamManager = hashParamManager;
  } else {
    root.hashParamManager = hashParamManager;
  }

  hashParamManager.VERSION = '0.1.0';

  hashParamManager.__currentHash = window.location.hash;

  hashParamManager.noConflict = function() {
    root.hashParamManager = previousHashParamManager;
    return this;
  };

  var __parseHashParams = function(inputHash){
    var hash = inputHash.substr(1);
    if ( hash === "" ) return {};
      var hashKey = {};
      var hashParams = hash.split("&");
      for ( var i = 0; i < hashParams.length; i++ ) {
        var param = hashParams[i];
        if ( param === "" ) continue;
        var keyValue = param.split("=");
        if ( keyValue.length === 1 ) {
          hashKey[param] = true;
        } else if ( keyValue.length === 2 ) {
          hashKey[keyValue[0]] = keyValue[1];
        } else { //error format
      }
    }
    return hashKey;
  };

  var __genHashByHashParams = function(hashKey){
    var hash = "";
    for ( var key in hashKey ) {
      if ( hash !== "" ) {
        hash += "&";
      }
      if ( hashKey[key] === true ) {
        hash += key;
      } else {
        hash += key+"="+hashKey[key];
      }
    }
    return hash;
  };

  hashParamManager.setParam = function(paramName, paramValue){
    var hashKey = __parseHashParams(window.location.hash);
    hashKey[paramName] = paramValue;
    hashParamManager.__currentHash = window.location.hash = __genHashByHashParams(hashKey);
  };

  hashParamManager.getParam = function(paramName){
    var hashKey = __parseHashParams(window.location.hash);
    return hashKey[paramName];
  };

  hashParamManager.removeParam = function(paramName){
    var hashKey = __parseHashParams(window.location.hash);
    delete hashKey[paramName];
    hashParamManager.__currentHash = window.location.hash = __genHashByHashParams(hashKey);
  }

  hashParamManager.__eventHandlers = {};


  hashParamManager.on = function(event, callback, context, params){
    //TODO multiple callback in same event
    hashParamManager.__eventHandlers[event] = {callback:callback, context:context, params:params};
  }

  hashParamManager.off = function(event){
    //TODO more convenience off , like wildcard or something else
    delete hashParamManager.__eventHandlers[event];
  }

  //FIXME not work on IE 9, IE 7 or lower, whatever
  //FIXME conflict with other's onhashchange ?
  window.onhashchange = function(){
    var prevHashKey = __parseHashParams(hashParamManager.__currentHash);
    var currentHash = window.location.hash;
    var hashKey = __parseHashParams(currentHash);
    for ( var key in hashKey ) {
      if ( prevHashKey[key] !== hashKey[key] ) {
        var handler = hashParamManager.__eventHandlers["change:"+key];
        if ( handler ) {
          //TODO multiple callback in same event
          handler.callback.call(handler.context, handler.params);
        }
      }
      delete prevHashKey[key];
    }
    for ( var key in prevHashKey ) {
      if ( prevHashKey[key] !== hashKey[key] ) {
        var handler = hashParamManager.__eventHandlers["change:"+key];
        if ( handler ) {
          //TODO multiple callback in same event
          handler.callback.call(handler.context, handler.params);
        }
      }
    }
    hashParamManager.__currentHash = currentHash; //save current hash
  }
}.call(this));
