/*    Copyright (c) 2014 Zuora, Inc.
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of 
 *   this software and associated documentation files (the "Software"), to use copy, 
 *   modify, merge, publish the Software and to distribute, and sublicense copies of 
 *   the Software, provided no fee is charged for the Software.  In addition the
 *   rights specified above are conditioned upon the following:
 *
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 *
 *   Zuora, Inc. or any other trademarks of Zuora, Inc.  may not be used to endorse
 *   or promote products derived from this Software without specific prior written
 *   permission from Zuora, Inc.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL
 *   ZUORA, INC. BE LIABLE FOR ANY DIRECT, INDIRECT OR CONSEQUENTIAL DAMAGES
 *   (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *   LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 *   ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var __z_version='1.3.1';
var ifrmId = 'z_hppm_iframe';
var threedRedirected = false;

/* IE8 patch start
 * see more ﻿https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim */
if (!String.prototype.trim) {
  (function () {
    // Make sure we trim BOM and NBSP
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    String.prototype.trim = function () {
      return this.replace(rtrim, '');
    };
  })();
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

//Patch for Element.addEventListener support
(function () {
  if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault = function () {
      this.returnValue = false;
    };
  }
  if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation = function () {
      this.cancelBubble = true;
    };
  }
  if (!Element.prototype.addEventListener) {
    var eventListeners = [];

    var addEventListener = function (type, listener /*, useCapture (will be ignored) */) {
      var self = this;
      var wrapper = function (e) {
        e.target = e.srcElement;
        e.currentTarget = self;
        if (listener.handleEvent) {
          listener.handleEvent(e);
        } else {
          listener.call(self, e);
        }
      };
      if (type == "DOMContentLoaded") {
        var wrapper2 = function (e) {
          if (document.readyState == "complete") {
            wrapper(e);
          }
        };
        document.attachEvent("onreadystatechange", wrapper2);
        eventListeners.push({object: this, type: type, listener: listener, wrapper: wrapper2});

        if (document.readyState == "complete") {
          var e = new Event();
          e.srcElement = window;
          wrapper2(e);
        }
      } else {
        if (this.attachEvent) {
          this.attachEvent("on" + type, wrapper);
        }
        eventListeners.push({object: this, type: type, listener: listener, wrapper: wrapper});
      }
    };
    var removeEventListener = function (type, listener /*, useCapture (will be ignored) */) {
      var counter = 0;
      while (counter < eventListeners.length) {
        var eventListener = eventListeners[counter];
        if (eventListener.object == this && eventListener.type == type && eventListener.listener == listener) {
          if (type == "DOMContentLoaded") {
            this.detachEvent("onreadystatechange", eventListener.wrapper);
          } else {
            this.detachEvent("on" + type, eventListener.wrapper);
          }
          eventListeners.splice(counter, 1);
          break;
        }
        ++counter;
      }
    };
    Element.prototype.addEventListener = addEventListener;
    Element.prototype.removeEventListener = removeEventListener;
    if (HTMLDocument) {
      HTMLDocument.prototype.addEventListener = addEventListener;
      HTMLDocument.prototype.removeEventListener = removeEventListener;
    }
    if (Window && Window.prototype) {
      Window.prototype.addEventListener = addEventListener;
      Window.prototype.removeEventListener = removeEventListener;
    }
  }
})();
/*IE8 patch end*/

/* BEGIN normalize window.requestAnimationFrame function */
(function(window) {
	window.requestAnimationFrame = (window.requestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function(callback) {
		// fall back to setTimeout on legacy browser.
		return window.setTimeout(callback, 1000 / 60);
	});

	window.cancelAnimationFrame = (window.cancelAnimationFrame
			|| window.webkitCancelAnimationFrame
			|| window.mozCancelAnimationFrame
			|| window.oCancelAnimationFrame
			|| window.msCancelAnimationFrame
			|| function(animatioHandle) {
		window.clearTimeout(animatioHandle);
	});
})(window);
/* END normalize window.requestAnimationFrame function */

var ZLOG = (function() {
  var PARAM_ZLOG = "zlog_level";
  var L_ERROR = "error";
  var L_WARN = "warn";
  var L_INFO = "info";
  var L_DEBUG = "debug";
  var L_DEFAULT = L_WARN;
  var levels = [L_ERROR, L_WARN, L_INFO, L_DEBUG];
  
  function getLogLevelIndex(level) {
    var i;
    for (i = 0; i < levels.length; i++) {
      if (levels[i] === level) {
        return i;
      }
    }
    return -1;
  }
  
  /**
   * Read current log level on page, based on query parameter "zlog_level".
   */
  function readLogLevel() {
    var url = document.location.href;
    
    var questionMarkIndex = url.indexOf("?");
    // no query parameter
    if (questionMarkIndex < 0) {
      return L_DEFAULT;
    }
    
    var hashMarkIndex = url.indexOf("#");
    // no segment
    if (hashMarkIndex < 0) {
      hashMarkIndex = url.length;
    }
    
    var queryParamString = url.slice(questionMarkIndex + 1, hashMarkIndex)
    // empty query string
    if (!queryParamString) {
      return L_DEFAULT;
    }
    
    var queryParams = queryParamString.split("&");
    var i;
    for (i = 0; i < queryParams.length; i++) {
      var p = queryParams[i].split("=");
      var key = p[0];
      var value = p[1];
      
      if(key === PARAM_ZLOG && getLogLevelIndex(value) >= 0) {
        return value;
      }
    }
    
    return L_WARN;
  }
  
  /**
   * check if debug log is enabled.
   */
  function isDebugEnabled() {
    return getLogLevelIndex(readLogLevel()) >= getLogLevelIndex(L_DEBUG);
  }
  
  /**
   * check if info log is enabled.
   */
  function isInfoEnabled() {
    return getLogLevelIndex(readLogLevel()) >= getLogLevelIndex(L_INFO);
  }
  
  return {
    /**
     * Get the current log level.
     */
    getLevel: function() {
      return readLogLevel();
    },
    
    debug: function(msg) {
      if (console && console.log && isDebugEnabled()) {
        console.log(msg);
      }
    },
    
    info: function(msg) {
      if (console && console.info && isInfoEnabled()) {
        console.info(msg);
      }
    },
    
    warn: function(msg) {
      if (console && console.warn) {
        console.warn(msg);
      }
    },
    
    error: function(msg) {
      if (console && console.error) {
        console.error(msg);
      }
    }
  };
})();

var ZXD = function () {

  var interval_id,
      last_hash,
      cache_bust = 1,
      attached_callback,
      window = this;
  
  return {
    postMessage: function (message, target_url, target) {

      if (!target_url) {
        return;
      }
      ZLOG.debug("Posting message[O]: target_url=" + target_url + ", payload=" + message);
      target = target || parent;  // default to parent

      if (window['postMessage']) {
        // the browser supports window.postMessage, so call it with a targetOrigin
        // set appropriately, based on the target_url parameter.
        target['postMessage'](message, target_url.replace(/([^:]+:\/\/[^\/]+).*/, '$1'));

      } else if (target_url) {
        // the browser does not support window.postMessage, so set the location
        // of the target to target_url#message. A bit ugly, but it works! A cache
        // bust parameter is added to ensure that repeat messages trigger the callback.
        target.location = target_url.replace(/#.*$/, '') + '#' + (+new Date) + (cache_bust++) + '&' + message;
      }
    },

    receiveMessage: function (callback, source_origin, allowSubDomain) {
      ZLOG.info("Registering callback[O]: source_origin=" + source_origin + ", allowSubDomain=" + allowSubDomain);
      
      // browser supports window.postMessage
      if (window['postMessage']) {
        // bind the callback to the actual event associated with window.postMessage
        if (callback) {
          attached_callback = function (e) {

            /**
             * Check the if the origin is from zuora.com, including:
             * 1, https://zuora.com
             * 2, https://xxxx.zuora.com
             */
            function isFromZuora(origin) {
              var zuoraOriginRegExp = /^https:\/\/([a-z0-9]+(-[a-z0-9]+)*\.)*zuora\.com$/;
              
              // stop processing if message origin is not zuora.com
              if (!zuoraOriginRegExp.test(origin.toLowerCase())) {
                return false;
              }
              
              return true;
            }
            
            /**
             * Check if the origin is from a local development environment, including:
             * 1, http://localhost or https://localhost
             * 2, http://localhost:8080 or https://localhost:8080
             */
            var devOriginRegExp = /^https?:\/\/localhost(:\d{4,5})?$/;
            function isInDevEnvironment(origin) {
              return devOriginRegExp.test(origin)
            }
            
            ZLOG.debug("Received message[O]: origin=" + e.origin);
            // if(typeof e.origin === 'string' && !(isFromZuora(e.origin) || isInDevEnvironment(e.origin))){
            //   ZLOG.info("Stopped processing none-zuora message.");
            //   return !1;
            // }
            if (Object.prototype.toString.call(source_origin) === "[object Function]" && source_origin(e.origin) === !1) {
              return !1;
            }
            if (typeof source_origin === 'string' && e.origin !== source_origin) {
              if (!allowSubDomain)
                return !1;
              else if (allowSubDomain === 'true') {
                try {
                  if (typeof source_origin === 'string') {
                    var domains = e.origin.split('.');
                    if (domains) {
                      var secondLevelDomain = domains.slice(-2).join('.');
                      var source_domains = source_origin.split('.');
                      var source_sndLevelDomain = source_domains.slice(-2).join('.');
                      if (source_sndLevelDomain.indexOf(secondLevelDomain) <= -1) {
                        return !1;
                      }
                    }
                  }
                } catch (ex) {
                  return !1;
                }

              }
              else {
                return !1;
              }
            }
            callback(e);
          };
        }
        if (window['addEventListener']) {
          window[callback ? 'addEventListener' : 'removeEventListener']('message', attached_callback, !1);
        } else {
          window[callback ? 'attachEvent' : 'detachEvent']('onmessage', attached_callback);
        }
      } else {
        // a polling loop is started & callback is called whenever the location.hash changes
        interval_id && clearInterval(interval_id);
        interval_id = null;

        if (callback) {
          interval_id = setInterval(function () {
            var hash = document.location.hash,
                re = /^#?\d+&/;
            if (hash !== last_hash && re.test(hash)) {
              last_hash = hash;
              callback({data: hash.replace(re, '')});
              //clearInterval(interval_id); //only receive message once. remove this to repoll every 100ms.
            }
          }, 100);
        }
      }
    }
  };
}();


var Z = function () {
  var zoverlay = '#z-overlay {filter: alpha(opacity=50);opacity:0.5;display:inline-block;position:fixed;top:0;left:0;width:100%;height:100%;background-color: #000;z-index: 1001;}';
  var zcontainer = '#z-container {border:1px;float:left; overflow: visible; position: absolute;padding: 0px; display: inline-block; top:5%; left:34%; margin: 0 auto;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius:5px;background-color: #FAFAFA; border:1px solid #FAFAFA;border-top-color:#EDEDED;behavior: url(js/PIE.htc);z-index: 1002;}';
  var zdata = '#z-data {height: 100%; outline: 0px; width: 100%; overflow: visible;display: inline-block;border:1px; -webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius:5px;}';
  var reset = "#reset{*, *:before, *:after {display: inline-block;-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;}}";
  var ziframe = '#z_hppm_iframe {background-color: #FAFAFA;vertical-align:bottom;z-index:9999;display:block;padding:0px;margin: 0px; border:0px solid #DDD;}';

  var method = 'requestPage';
  var baseUri;
  var errFn;
  var queryParam, initParams, ek;
  var requiredParams = ['tenantId', 'id', 'token', 'signature', 'key', 'style', 'submitEnabled', 'url'];
  // PAY-6939: add 'bankAccountNumber' and 'bankAccountName', since from now on we consider them as sensitive data
  var pciParams = ['creditCardNumber', 'cardSecurityCode', 'creditCardExpirationYear', 'creditCardExpirationMonth', 'bankAccountNumber', 'bankAccountName', 'ipAddress'];
  var callbackRegistered = false;
  var eventHandlers = {};
  var customizedWidth = null;
  var customizedHeight = null;

  function isFunction(obj) {
    return obj && typeof obj === 'function';
  }

  function shallowCopy(oldObj) {
    var newObj = {};
    for(var i in oldObj) {
      if(oldObj.hasOwnProperty(i)) {
        newObj[i] = oldObj[i];
      }
    }
    return newObj;
  }

  function invokeErrFn() {
    if (errFn) {
      errFn();
    }
  }

  function clearErrFn() {
    errFn = null;
  }
  
  /**
   * check if the specified element is displayed on DOM tree.
   */
  function isElementDisplayed(elem) {
    if (elem.currentStyle) {
      // For IE
      return elem.currentStyle["display"] != "none";
    } else if (document.defaultView && document.defaultView.getComputedStyle) {
	  // For Other Browser
      return document.defaultView.getComputedStyle(elem, null).getPropertyValue("display") != "none";
    } else {
	  // Fall back
      return true;
    }
  }

  ZXD.receiveMessage(function (message) {
	  try{
	    /*Init Part*/
	    var response = message.data;
	    ZLOG.debug("Received message[O]: payload=" + response);
	    response = JSON.parse(response);
	    if (response.success) {
	      if (isFunction(eventHandlers['init'])) {
	        eventHandlers['init'](response);
	      }
	    } else if (response.success == false) {
	      Z.deactivateOverlay('z-overlay');
	      Z.deactivateOverlay('z-container');
	      if (eventHandlers['init']) {
	        eventHandlers['init'](response);
	      }
	    } else if (response.action == 'close') {
	      Z.deactivateOverlay('z-overlay');
	      Z.deactivateOverlay('z-container');
	    } else if (response.action == 'resize') {
	      Z.receive(response);
	    } else if (response.action == 'allowScroll') {
	      Z.allowScroll(response);
	    }
	
	    if (response.action === 'validate' && isFunction(eventHandlers['validate'])) {
	      eventHandlers['validate'](response);
	    } else if (response.action == 'customizeErrorMessage' && isFunction(eventHandlers['customizeErrorMessage'])) {
	      eventHandlers['customizeErrorMessage'](response.key, response.code, response.message);
	    } else if (response.action && isFunction(eventHandlers[response.action])) {
	      eventHandlers[response.action](response);
	    }
	  } catch (e) {
	  	return;
	  }
  
  });

  return {
    validateRequiredParams: function (params) {
      var len = requiredParams.length;
      for (index = 0; index < len; index++) {
        if (!params.hasOwnProperty(requiredParams[index])) {
          // submit is optional for overlay
          if (requiredParams[index] == 'submitEnabled' && params["style"].toLowerCase() == 'overlay') {
            continue;
          } else {
            var msg = "Param with key [" + requiredParams[index] + "] is required.";
            alert(msg);
            if (!Z.isIE()) {
              // not ie, we will output the error message to console too.
              console.log(msg);
            }
            return false;
          }
        }
      }
      return true;
    },

    isIE: function () {
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf('MSIE ');
      var trident = ua.indexOf('Trident/');

      if (msie > 0) {
        // IE 10 or older => return version number
        return true;
      }

      if (trident > 0) {
        // IE 11 (or newer) => return version number
        var rv = ua.indexOf('rv:');
        return true;
      }

      // other browser
      return false;
    },

    validatePCIParams: function (params) {
      var len = pciParams.length;
      for (index = 0; index < len; index++) {
        var paramKey = 'field_' + pciParams[index];
        if (params.hasOwnProperty(paramKey)) {
          // submit is optional for overlay
          if (0 < params[paramKey].trim().length && params[paramKey].trim().length < 300) {
            var msg = "Field [" + paramKey + "] for Credit Card payment method type should be encrypted for pre-population";
            alert(msg);
            if (!Z.isIE()) {
              // not ie, we will output the error message to console too.
              console.log(msg);
            }
            return false;
          }
        }
      }
      return true;
    },

    init: function (params, callback) {
      queryParam = '?method=requestPage&host=' + encodeURIComponent(document.location.href) + '&';
      queryParam = queryParam + 'fromHostedPage=true' + '&';
      var required = Z.validateRequiredParams(params);

      if (!required) return false;

      required = Z.validatePCIParams(params);

      if (!required) return false;

      var pstr = JSON.stringify(params,
        function (key, value) {
          if (key != '') {
            if ('key' == key) {
              ek = value;
              // public key will be gotten from server side
            } else if ('url' == key) {
              var zuoraOriginRegExp = /^https:\/\/([a-z0-9]+(-[a-z0-9]+)*\.)+zuora\.com\/.+$/;
              ZLOG.info("HPM integration[O]: url=" + value);
              if (!zuoraOriginRegExp.test(value)) {
                ZLOG.warn("HPM integration[O]: None-official zuora HPM integration url is detected: " + value);
              }
              baseUri = value;
            } else {
              queryParam = queryParam + key + '=' + encodeURIComponent(value) + '&';
            }
          }
          return value;
        });
      p = JSON.parse(pstr);

      eventHandlers['init'] = callback;

      // Remove PCI fields from params
      var len = pciParams.length;
      if (params) {
        for (var index = 0; index < len; index++) {
          var paramKey = "field_" + pciParams[index];
          if (params.hasOwnProperty(paramKey)) {
            params[paramKey] = "";
          }
        }
      }

      return true;
    },

    prepopulate: function (params) {
      if(threedRedirected){
    	  return;
      }
    
      var iframeSrc = Z.createIframeURL();

      if (iframeSrc == document.getElementById(ifrmId).src || (document.getElementById(ifrmId).src.indexOf(iframeSrc) >= 0 && p.hasOwnProperty('customizeErrorRequired') && p.customizeErrorRequired == 'true')) {
        var pstr = JSON.stringify(params,
          function (key, value) {
            if (key != '') {
              var message = 'setField(' + key + ':' + value + ')';
              Z.post(ifrmId, message);
            }
            return value;
          });
        var message = 'setField(key:' + ek + ')';
        Z.post(ifrmId, message);
        Z.post(ifrmId, 'setField(style:' + p.style + ')');
        if (p.hasOwnProperty('customizeErrorRequired') && p.customizeErrorRequired == 'true') {
          Z.post(ifrmId, 'customizeErrorRequired');
          p['customizeErrorRequired'] = 'false';
        }
      }
    },

    contains: function (a, obj) {
      for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
          return true;
        }
      }
      return false;
    },

    renderWithErrorHandler: function (params, initFields, callback, errorCallback, width, height, removeCoverCallback) {
      params['customizeErrorRequired'] = 'true';
      Z.render(params, initFields, callback, width, height);
      Z.customizeErrorHandler(errorCallback);
      Z.removeCoverHandler(removeCoverCallback);
    },

    runAfterRender: function (errorFn) {
      errFn = errorFn;
    },

    render: function (params, initFields, callback, width, height) {
      if(width != null && width != undefined){
    	  customizedWidth = width;
      }
      if(height != null && height != undefined){
    	  customizedHeight = height;
      }

      customizedWidth = Number(customizedWidth);
      customizedHeight = Number(customizedHeight);
      customizedWidth = isNaN(customizedWidth) ? 0 : customizedWidth;
      customizedHeight = isNaN(customizedHeight) ? 0 : customizedHeight;
      
      var len = pciParams.length;
      // Reset the flag
      threedRedirected = false;
      /*For USA and CAN, we provide state drop-down list, and set a default value if state is not specified to show the list*/
      if (initFields && initFields['creditCardCountry'] && (initFields['creditCardCountry'] === 'USA' || initFields['creditCardCountry'] === 'CAN')) {
        initFields['creditCardState'] = initFields['creditCardState'] || ' ';
      }

      if (initFields) {
        for (index = 0; index < len; index++) {
          var paramKey = 'field_' + pciParams[index];
          if (initFields.hasOwnProperty(pciParams[index])) {
            params[paramKey] = initFields[pciParams[index]];
          }
        }
      }
      var inited = Z.init(params, callback);

      if (!inited) return;

      if (initFields) {
        var len = Object.keys(initFields).length;
        initParams = shallowCopy(initFields);
        for (index = 0; index < len; index++) {
          var initKey = Object.keys(initFields)[index];
          if (Z.contains(pciParams, initKey)) {
            delete initParams[initKey];
          }
        }
      } else {
        initParams = null;
      }

      var container = document.getElementById('zuora_payment');
      if (typeof container == 'undefined' || !container) {
        return {
          "error"            : "invalid_request",
          "error_description": "The container you specified does not exist"
        };
      }

      container.innerHTML = '';
      Z.cleanUp(container, 'z-overlay');
      Z.cleanUp(container, 'z-container');

      //mode-inline, overlay
      if (p.style == 'inline') {
        Z.addInlineStyles();
        Z.createIframe(container);

        return;
      }

      if (p.style == 'overlay') {
        Z.addOverlayStyles();

        var divOuter = Z.generateDiv('z-overlay', 'z-overlay');
        container.appendChild(divOuter);

        var divContent = Z.generateDiv('z-container', 'z-container');
        container.appendChild(divContent);

        var divData = Z.generateDiv('z-data', 'z-data');
        divData.tabindex = "-1";

        divContent.appendChild(divData);

        Z.createIframe(document.getElementById('z-data'));
        Z.activateOverlay('z-overlay');
      }
    },

    cleanUp: function (container, elementName) {
      var element = document.getElementById(elementName);
      if (element != null) {
        container.removeChild(element);
      }
    },

    activateOverlay: function (id) {
      try {
        document.getElementById(id).style.display = 'inline';
      } catch (e) {
      }
    },

    deactivateOverlay: function (id) {
      try {
        document.getElementById(id).style.display = 'none';
      } catch (e) {
        //alert(e);
      }
    },

    generateDiv: function (id, style, handler) {
      var div = document.createElement("div");
      div.id = id;
      div.className = style;
      div.border = '0';

      if (div.addEventListener) {
        div.addEventListener("click", handler, false);
      } else {
        div.attachEvent("click", handler);
      }
      return div;
    },

    addOverlayStyles: function () {
      var style = document.createElement('style');
      style.type = 'text/css';
      var lbstyle = document.createTextNode(zoverlay);
      var lbcontentstyle = document.createTextNode(zcontainer);
      var lbdatastyle = document.createTextNode(zdata);
      var iframestyle = document.createTextNode(ziframe);
      var lbreset = document.createTextNode(reset);


      if (style.styleSheet) {
        style.styleSheet.cssText = lbstyle.nodeValue + ' ' + lbcontentstyle.nodeValue + ' ' + lbdatastyle.nodeValue + ' ' + lbreset.nodeValue + ' ' + iframestyle.nodeValue;
      } else {
        style.appendChild(lbstyle);
        style.appendChild(lbcontentstyle);
        style.appendChild(lbdatastyle);
        style.appendChild(iframestyle);
        style.appendChild(lbreset);
      }

      document.getElementsByTagName('head')[0].appendChild(style);
    },

    addInlineStyles: function () {
      var style = document.createElement('style');
      style.type = 'text/css';
      var iframestyle = document.createTextNode(ziframe);

      if (style.styleSheet) {
        style.styleSheet.cssText = iframestyle.nodeValue;
      } else {
        style.appendChild(iframestyle);
      }

      document.getElementsByTagName('head')[0].appendChild(style);
    },

    createIframe: function (container) {
      var uri = Z.createIframeURL();

      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', uri);
      iframe.setAttribute('id', ifrmId);
      iframe.setAttribute("overflow", "visible");
      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute('frameBorder', '0');
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('class', 'z_hppm_iframe');
      iframe.setAttribute('width', '100%');
      /*
       * set the initial height to 0px so that end user will not see a partially rendered iframe.
       * This will help improving user experience for tenants who dose not hide the iframe container
       * during constructing the iframe.
       */  
      iframe.setAttribute('height', '0');

      iframe.addEventListener("load", function () {
        Z.prepopulate(initParams);
        invokeErrFn();
        // Remove error function after render
        clearErrFn();
      
        // post resize message to inner document
        function postResizeMessage() {
          /*
           * PAY-9966:
           * In typical front-end development process, an UI component should be created in following sequence:
           * 1, hide the container
           * 2, create the component and attach it onto dom
           * 3, show the container
           * With this, end user will not see a partially build component on the page, which produces a perfect
           * user experience.
           * 
           * As Zuora HPM page is an dynamically created UI component on Tenant's page. It is probably that it
           * will hide the iframe container while integrating with Zuora HPM page. The problem is that the size
           * of the iframe could be incorrectly calculated if it is hidden(display:none).
           * 
           * The fix is the calculate the size of iframe after it is fully constructed and is displayed on page.
           * It will post the resize message only when container is displayed.
           */
          if (isElementDisplayed(container)) {
            Z.post(ifrmId, 'resize');
          } else {
            window.requestAnimationFrame(postResizeMessage);
          }
        }
        window.requestAnimationFrame(postResizeMessage);

        return false;
      }, false);
        
      if (typeof options != 'undefined') {
        if (typeof options.vertical != 'undefined' && options.vertical) {
          iframe.style.width = '100%';
          iframe.style.height = '100%';
        }
      }
      container.appendChild(iframe);
    },

    createIframeURL: function () {
      var uri = baseUri;
      return uri.concat(queryParam).concat("zlog_level="+ZLOG.getLevel());
    },

    post: function (hosted_iframe_id, message) {
      // pass the URL of the current parent page to the iframe using location.hash
      var iframe = document.getElementById(hosted_iframe_id);
      var host = encodeURIComponent(document.location.href);
      var src = iframe.src;
      if (src.indexOf(host) <= -1) {
        iframe.src = src + '#' + host;
      }

      ZXD.postMessage(message, src, iframe.contentWindow);
      return false;
    },

    // Added for 3DS
    allowScroll: function(message){
    	if(ifrmId){
        	var iframe = document.getElementById(ifrmId);
            if (iframe) {
            	iframe.setAttribute("scrolling", "yes");
            	threedRedirected = true;
            }
    	}
    },
    
    receive              : function (message) {
      ZFB.resizeCaller(ifrmId, message.action, message.height, message.width, customizedWidth, customizedHeight);
    },

    // validate should be invoked after z.render(...), otherwise it won't be available.
    validate             : function (callback) {
      if (callback == null || callback == undefined) {
        Z.closeWindow();

        var msg = "Validate function required.";
        alert(msg);
        if (!Z.isIE()) {
          // not ie, we will output the error message to console too.
          console.log(msg);
        }


        return false;
      }

      // register callback for validation
      /*ZXD.receiveMessage(function(message) {
       var response= message.data;
       response =JSON.parse(response);
       callback(response);
       });*/
      eventHandlers['validate'] = callback;

      // post message to backend
      var message = 'validate';
      Z.post(ifrmId, message);
    },

    // customizeErrorHandler should be invoked after z.render(...), otherwise it won't be available.
    customizeErrorHandler: function (callback) {
      if (callback == null || callback == undefined) {
        Z.closeWindow();
        var msg = "Customized error message function required.";
        alert(msg);
        if (!Z.isIE()) {
          // not ie, we will output the error message to console too.
          console.log(msg);
        }
        return false;
      }

      /*
       ZXD.receiveMessage(function(message) {
       var response= message.data;
       response =JSON.parse(response);
       if(response.action == 'customizeErrorMessage'){
       callback(response.key, response.code, response.message);
       }
       });
       */
      eventHandlers['customizeErrorMessage'] = callback;
    },

    removeCoverHandler: function (removeCoverCallback) {
      if (removeCoverCallback == null || removeCoverCallback == undefined) {
        return false;
      }
      eventHandlers['removeCover'] = removeCoverCallback;
    },

    sendErrorMessageToHpm: function (key, errorMessage) {
      var jsonMessage = {
        action : 'customizeErrorMessage',
        key    : key,
        message: errorMessage
      };

      var newMessage = JSON.stringify(jsonMessage);
      Z.post(ifrmId, newMessage);
    },

    closeWindow: function () {
      // close window
      Z.deactivateOverlay('z-overlay');
      Z.deactivateOverlay('z-container');
    },

    submit: function () {
      var src = document.getElementById(ifrmId).src + '#' + encodeURIComponent(document.location.href);
      document.getElementById(ifrmId).src = src;
      ZXD.postMessage("postPage", src, document.getElementById(ifrmId).contentWindow);
      return true;
    },

    responseHandler: function (response) {
      var url = response.redirectUrl;
      if (response.success) {
        var redirectUrl = url + "?refId=" + response.refId + "&success=" + response.success + "&signature=" + response.signature + "&token=" + response.token;
        window.location.replace(redirectUrl);
      } else {
        var redirectUrl = url + "?errorCode=" + response.errorCode + "&errorMessage=" + response.errorMessage + "&success=" + response.success + "&signature=" + response.signature + "&token=" + response.token;
        window.location.replace(redirectUrl);
      }
    },
    setEventHandler: function (actionName, handler ) {
      if(actionName && handler) {
        eventHandlers[actionName] = handler;
      }
    },
    setAgreement: function (mitConsentAgreementSrc, mitProfileType, agreementSupportedBrands, mitConsentAgreementRef) {
      if (!Z.validateAgreement(mitConsentAgreementSrc, mitProfileType, agreementSupportedBrands))
        return false;

      var key =  "mitConsentAgreementSrc";
      Z.setFieldValue(key, mitConsentAgreementSrc);
      key =  "mitCredentialProfileType";
      Z.setFieldValue(key, mitProfileType);
      key =  "agreementSupportedBrands";
      Z.setFieldValue(key, agreementSupportedBrands);
      key =  "mitConsentAgreementRef";
      Z.setFieldValue(key, mitConsentAgreementRef);
      return true;
    },
    setFieldValue: function (key, value) {
      var message = 'setField(' + key + ':' + value + ')';
      Z.post(ifrmId, message);
    },
    validateAgreement: function(mitConsentAgreementSrc, mitProfileType, agreementSupportedBrands) {
      // It's OK if all params are empty.
      if (Z.isEmpty(mitConsentAgreementSrc) && Z.isEmpty(mitProfileType) && Z.isEmpty(agreementSupportedBrands)) {
        return true;
      }

      if (Z.isEmpty(mitConsentAgreementSrc)) {
        Z.alertRequired("mitConsentAgreementSrc");
        return false;
      }
      if (Z.isEmpty(mitProfileType)) {
        Z.alertRequired("mitProfileType");
        return false;
      }
      if (Z.isEmpty(agreementSupportedBrands)) {
        Z.alertRequired("agreementSupportedBrands");
        return false;
      }
      if (mitConsentAgreementSrc != "External") {
        Z.alertIllegal("mitConsentAgreementSrc");
        return false;
      }
      if (mitProfileType != "Recurring") {
        Z.alertIllegal("mitProfileType");
        return false;
      }
      return true;
    },
    isEmpty: function(str) {
      return (!str || 0 === str.length);
    },
    alertRequired: function(param) {
      var msg = "Param mitConsentAgreementSrc, mitProfileType and agreementSupportedBrands for Z.setAgreement should be all empty or not empty. Param " + param + " is empty.";
      alert(msg);
    },
    alertIllegal: function(param) {
      var msg = "Param " + param + " for Z.setAgreement is illegal.";
      alert(msg);
    }
  };
}();


var ZFB = function () {

  //Should script hide iframe from browsers that don't support this script (non IE5+/NS6+ browsers. Recommended):
  var iframehide = "yes";

  var getFFVersion = navigator.userAgent.substring(navigator.userAgent.indexOf("Firefox")).split("/")[1];
  var FFextraHeight = parseFloat(getFFVersion) >= 0.1 ? 20 : 0; //extra height in px to add to iframe in FireFox 1.0+ browsers
  return {
    resizeCaller: function (iframeId, event, height, width, customizedWidth, customizedHeight) {
      ZFB.resizeIframe(iframeId, event, height, width, customizedWidth, customizedHeight);
      //reveal iframe for lower end browsers? (see var above):
      if ((document.all || document.getElementById) && iframehide == "no") {
        var tempobj = document.all ? document.all[iframeId] : document.getElementById(iframeId);
        tempobj.style.display = "block";
      }
    },

    resizeIframe: function (frameid, event, height, width, customizedWidth, customizedHeight) {
      var currentfr = document.getElementById(frameid);
      if (currentfr) {
        currentfr.style.display = "block";
        // Use customized width if it is provided, otherwise use calculated value
        currentfr.width = customizedWidth > 0 ? customizedWidth : Number(width);
        currentfr.height = customizedHeight > 0 ? customizedHeight : Number(height);
      }
    }
  }
}();
