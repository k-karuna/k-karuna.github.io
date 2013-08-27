/*
 easyXDM
 http://easyxdm.net/
 Copyright(c) 2009, Г?yvind Sean Kinsey, oyvind@kinsey.no.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
	SWFObject v2.2 <http://code.google.com/p/swfobject/>
 is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
window._JSON = function() {
  function f(n) {
    return n < 10 ? "0" + n : n
  }
  function thisDateToJSON(key) {
    return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
  }
  function thisValueOf(key) {
    return this.valueOf()
  }
  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {"\b":"\\b", "\t":"\\t", "\n":"\\n", "\f":"\\f", "\r":"\\r", '"':'\\"', "\\":"\\\\"}, rep;
  function quote(string) {
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
      var c = meta[a];
      return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
    }) + '"' : '"' + string + '"'
  }
  function str(key, holder) {
    var i, k, v, length, mind = gap, partial, value = holder[key];
    if(value && typeof value === "object") {
      if(value instanceof Date) {
        value = thisDateToJSON.call(value)
      }else {
        if(value instanceof String || value instanceof Number || value instanceof Boolean) {
          value = thisValueOf.call(value)
        }
      }
    }
    if(typeof rep === "function") {
      value = rep.call(holder, key, value)
    }
    switch(typeof value) {
      case "string":
        return quote(value);
      case "number":
        return isFinite(value) ? String(value) : "null";
      case "boolean":
      ;
      case "null":
        return String(value);
      case "object":
        if(!value) {
          return"null"
        }
        gap += indent;
        partial = [];
        if(Object.prototype.toString.apply(value) === "[object Array]") {
          length = value.length;
          for(i = 0;i < length;i += 1) {
            partial[i] = str(i, value) || "null"
          }
          v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
          gap = mind;
          return v
        }
        if(rep && typeof rep === "object") {
          length = rep.length;
          for(i = 0;i < length;i += 1) {
            if(typeof rep[i] === "string") {
              k = rep[i];
              v = str(k, value);
              if(v) {
                partial.push(quote(k) + (gap ? ": " : ":") + v)
              }
            }
          }
        }else {
          for(k in value) {
            if(Object.prototype.hasOwnProperty.call(value, k)) {
              v = str(k, value);
              if(v) {
                partial.push(quote(k) + (gap ? ": " : ":") + v)
              }
            }
          }
        }
        v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
        gap = mind;
        return v
    }
  }
  return{stringify:function(value, replacer, space) {
    var i;
    gap = "";
    indent = "";
    if(typeof space === "number") {
      for(i = 0;i < space;i += 1) {
        indent += " "
      }
    }else {
      if(typeof space === "string") {
        indent = space
      }
    }
    rep = replacer;
    if(replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
      throw new Error("JSON.stringify");
    }
    return str("", {"":value})
  }, parse:function(text, reviver) {
    var j;
    function walk(holder, key) {
      var k, v, value = holder[key];
      if(value && typeof value === "object") {
        for(k in value) {
          if(Object.prototype.hasOwnProperty.call(value, k)) {
            v = walk(value, k);
            if(v !== undefined) {
              value[k] = v
            }else {
              delete value[k]
            }
          }
        }
      }
      return reviver.call(holder, key, value)
    }
    text = String(text);
    cx.lastIndex = 0;
    if(cx.test(text)) {
      text = text.replace(cx, function(a) {
        return"\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
      })
    }
    if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
      j = eval("(" + text + ")");
      return typeof reviver === "function" ? walk({"":j}, "") : j
    }
    throw new SyntaxError("JSON.parse");
  }}
}();
(function(window, document, location, setTimeout, decodeURIComponent, encodeURIComponent) {
  if("easyXDM" in window) {
    return
  }
  var global = this;
  var channelId = 0;
  var emptyFn = Function.prototype;
  var reURI = /^(http.?:\/\/([^\/\s]+))/;
  var reParent = /[\-\w]+\/\.\.\//;
  var reDoubleSlash = /([^:])\/\//g;
  var IFRAME_PREFIX = "easyXDM_";
  var HAS_NAME_PROPERTY_BUG;
  function isHostMethod(object, property) {
    var t = typeof object[property];
    return t == "function" || !!(t == "object" && object[property]) || t == "unknown"
  }
  function isHostObject(object, property) {
    return!!(typeof object[property] == "object" && object[property])
  }
  function isArray(o) {
    return Object.prototype.toString.call(o) === "[object Array]"
  }
  var on, un;
  if(isHostMethod(window, "addEventListener")) {
    on = function(target, type, listener) {
      target.addEventListener(type, listener, false)
    };
    un = function(target, type, listener) {
      target.removeEventListener(type, listener, false)
    }
  }else {
    if(isHostMethod(window, "attachEvent")) {
      on = function(object, sEvent, fpNotify) {
        object.attachEvent("on" + sEvent, fpNotify)
      };
      un = function(object, sEvent, fpNotify) {
        object.detachEvent("on" + sEvent, fpNotify)
      }
    }else {
      throw new Error("Browser not supported");
    }
  }
  var isReady = false, domReadyQueue = [];
  if("readyState" in document) {
    isReady = document.readyState == "complete"
  }else {
    if(document.body) {
      isReady = true
    }
  }
  function dom_onReady() {
    dom_onReady = emptyFn;
    isReady = true;
    for(var i = 0;i < domReadyQueue.length;i++) {
      domReadyQueue[i]()
    }
    domReadyQueue.length = 0
  }
  if(!isReady) {
    if(isHostMethod(window, "addEventListener")) {
      on(document, "DOMContentLoaded", dom_onReady)
    }else {
      on(document, "readystatechange", function() {
        if(document.readyState == "complete") {
          dom_onReady()
        }
      });
      if(document.documentElement.doScroll && window === top) {
        (function doScrollCheck() {
          if(isReady) {
            return
          }
          try {
            document.documentElement.doScroll("left")
          }catch(e) {
            setTimeout(doScrollCheck, 1);
            return
          }
          dom_onReady()
        })()
      }
    }
    on(window, "load", dom_onReady)
  }
  function whenReady(fn, scope) {
    if(isReady) {
      fn.call(scope);
      return
    }
    domReadyQueue.push(function() {
      fn.call(scope)
    })
  }
  function getDomainName(url) {
    return url.match(reURI)[2]
  }
  function getLocation(url) {
    return url.match(reURI)[1]
  }
  function resolveUrl(url) {
    url = url.replace(reDoubleSlash, "$1/");
    if(!url.match(/^(http||https):\/\//)) {
      var path = url.substring(0, 1) === "/" ? "" : location.pathname;
      if(path.substring(path.length - 1) !== "/") {
        path = path.substring(0, path.lastIndexOf("/") + 1)
      }
      url = location.protocol + "//" + location.host + path + url
    }
    while(reParent.test(url)) {
      url = url.replace(reParent, "")
    }
    return url
  }
  function appendQueryParameters(url, parameters) {
    var hash = "", indexOf = url.indexOf("#");
    if(indexOf !== -1) {
      hash = url.substring(indexOf);
      url = url.substring(0, indexOf)
    }
    var q = [];
    for(var key in parameters) {
      if(parameters.hasOwnProperty(key)) {
        q.push(key + "=" + encodeURIComponent(parameters[key]))
      }
    }
    return url + (url.indexOf("?") === -1 ? "?" : "&") + q.join("&") + hash
  }
  var query = function() {
    var query = {}, pair, search = location.search.substring(1).split("&"), i = search.length;
    while(i--) {
      pair = search[i].split("=");
      try {
        query[pair[0]] = decodeURIComponent(pair[1])
      }catch(e) {
      }
    }
    return query
  }();
  function undef(v) {
    return typeof v === "undefined"
  }
  function getJSON() {
    if(window.JSON && window.JSON.stringify(["a"]) === '["a"]') {
      return window.JSON
    }else {
      return window._JSON
    }
    var cached = {};
    var obj = {a:[1, 2, 3]}, json = '{"a":[1,2,3]}';
    if(JSON && typeof JSON.stringify === "function" && JSON.stringify(obj).replace(/\s/g, "") === json) {
      return JSON
    }
    if(Object.toJSON) {
      if(Object.toJSON(obj).replace(/\s/g, "") === json) {
        cached.stringify = Object.toJSON
      }
    }
    if(typeof String.prototype.evalJSON === "function") {
      obj = json.evalJSON();
      if(obj.a && obj.a.length === 3 && obj.a[2] === 3) {
        cached.parse = function(str) {
          return str.evalJSON()
        }
      }
    }
    if(cached.stringify && cached.parse) {
      getJSON = function() {
        return cached
      };
      return cached
    }
    return null
  }
  function apply(destination, source, noOverwrite) {
    var member;
    for(var prop in source) {
      if(source.hasOwnProperty(prop)) {
        if(prop in destination) {
          member = source[prop];
          if(typeof member === "object") {
            apply(destination[prop], member, noOverwrite)
          }else {
            if(!noOverwrite) {
              destination[prop] = source[prop]
            }
          }
        }else {
          destination[prop] = source[prop]
        }
      }
    }
    return destination
  }
  function testForNamePropertyBug() {
    var el = document.createElement("iframe");
    el.name = "easyXDM_TEST";
    apply(el.style, {position:"absolute", left:"-2000px", top:"0px"});
    document.body.appendChild(el);
    HAS_NAME_PROPERTY_BUG = !(el.contentWindow === window.frames[el.name]);
    document.body.removeChild(el)
  }
  function createFrame(config) {
    if(undef(HAS_NAME_PROPERTY_BUG)) {
      testForNamePropertyBug()
    }
    var frame;
    if(HAS_NAME_PROPERTY_BUG) {
      frame = document.createElement('<iframe name="' + config.props.name + '"/>')
    }else {
      frame = document.createElement("IFRAME");
      frame.name = config.props.name
    }
    frame.id = frame.name = config.props.name;
    delete config.props.name;
    if(config.onLoad) {
      on(frame, "load", config.onLoad)
    }
    if(typeof config.container == "string") {
      config.container = document.getElementById(config.container)
    }
    if(!config.container) {
      frame.style.position = "absolute";
      frame.style.left = "-2000px";
      frame.style.top = "0px";
      config.container = document.body
    }
    frame.border = frame.frameBorder = 0;
    config.container.insertBefore(frame, config.container.firstChild);
    apply(frame, config.props);
    return frame
  }
  function checkAcl(acl, domain) {
    if(typeof acl == "string") {
      acl = [acl]
    }
    var re, i = acl.length;
    while(i--) {
      re = acl[i];
      re = new RegExp(re.substr(0, 1) == "^" ? re : "^" + re.replace(/(\*)/g, ".$1").replace(/\?/g, ".") + "$");
      if(re.test(domain)) {
        return true
      }
    }
    return false
  }
  function prepareTransportStack(config) {
    var protocol = config.protocol, stackEls;
    config.isHost = config.isHost || undef(query.xdm_p);
    if(!config.props) {
      config.props = {}
    }
    if(!config.isHost) {
      config.channel = query.xdm_c;
      config.secret = query.xdm_s;
      config.remote = query.xdm_e;
      protocol = query.xdm_p;
      if(config.acl && !checkAcl(config.acl, config.remote)) {
        throw new Error("Access denied for " + config.remote);
      }
    }else {
      config.remote = resolveUrl(config.remote);
      config.channel = config.channel || "default" + channelId++;
      config.secret = Math.random().toString(16).substring(2);
      if(undef(protocol)) {
        if(getLocation(location.href) == getLocation(config.remote)) {
          protocol = "4"
        }else {
          if(isHostMethod(window, "postMessage") || isHostMethod(document, "postMessage")) {
            protocol = "1"
          }else {
            if(isHostMethod(window, "ActiveXObject") && isHostMethod(window, "execScript")) {
              protocol = "3"
            }else {
              if(navigator.product === "Gecko" && "frameElement" in window && navigator.userAgent.indexOf("WebKit") == -1) {
                protocol = "5"
              }else {
                if(config.remoteHelper) {
                  config.remoteHelper = resolveUrl(config.remoteHelper);
                  protocol = "2"
                }else {
                  protocol = "0"
                }
              }
            }
          }
        }
      }
    }
    switch(protocol) {
      case "0":
        apply(config, {interval:100, delay:2E3, useResize:true, useParent:false, usePolling:false}, true);
        if(config.isHost) {
          if(!config.local) {
            var domain = location.protocol + "//" + location.host, images = document.body.getElementsByTagName("img"), image;
            var i = images.length;
            while(i--) {
              image = images[i];
              if(image.src.substring(0, domain.length) === domain) {
                config.local = image.src;
                break
              }
            }
            if(!config.local) {
              config.local = window
            }
          }
          var parameters = {xdm_c:config.channel, xdm_p:0};
          if(config.local === window) {
            config.usePolling = true;
            config.useParent = true;
            config.local = location.protocol + "//" + location.host + location.pathname + location.search;
            parameters.xdm_e = config.local;
            parameters.xdm_pa = 1
          }else {
            parameters.xdm_e = resolveUrl(config.local)
          }
          if(config.container) {
            config.useResize = false;
            parameters.xdm_po = 1
          }
          config.remote = appendQueryParameters(config.remote, parameters)
        }else {
          apply(config, {channel:query.xdm_c, remote:query.xdm_e, useParent:!undef(query.xdm_pa), usePolling:!undef(query.xdm_po), useResize:config.useParent ? false : config.useResize})
        }
        stackEls = [new easyXDM.stack.HashTransport(config), new easyXDM.stack.ReliableBehavior({}), new easyXDM.stack.QueueBehavior({encode:true, maxLength:4E3 - config.remote.length}), new easyXDM.stack.VerifyBehavior({initiate:config.isHost})];
        break;
      case "1":
        stackEls = [new easyXDM.stack.PostMessageTransport(config)];
        break;
      case "2":
        stackEls = [new easyXDM.stack.NameTransport(config), new easyXDM.stack.QueueBehavior, new easyXDM.stack.VerifyBehavior({initiate:config.isHost})];
        break;
      case "3":
        stackEls = [new easyXDM.stack.NixTransport(config)];
        break;
      case "4":
        stackEls = [new easyXDM.stack.SameOriginTransport(config)];
        break;
      case "5":
        stackEls = [new easyXDM.stack.FrameElementTransport(config)];
        break
    }
    stackEls.push(new easyXDM.stack.QueueBehavior({lazy:config.lazy, remove:true}));
    return stackEls
  }
  function chainStack(stackElements) {
    var stackEl, defaults = {incoming:function(message, origin) {
      this.up.incoming(message, origin)
    }, outgoing:function(message, recipient) {
      this.down.outgoing(message, recipient)
    }, callback:function(success) {
      this.up.callback(success)
    }, init:function() {
      this.down.init()
    }, destroy:function() {
      this.down.destroy()
    }};
    for(var i = 0, len = stackElements.length;i < len;i++) {
      stackEl = stackElements[i];
      apply(stackEl, defaults, true);
      if(i !== 0) {
        stackEl.down = stackElements[i - 1]
      }
      if(i !== len - 1) {
        stackEl.up = stackElements[i + 1]
      }
    }
    return stackEl
  }
  function removeFromStack(element) {
    element.up.down = element.down;
    element.down.up = element.up;
    element.up = element.down = null
  }
  global.easyXDM = {version:"2.4.9.102", query:query, stack:{}, apply:apply, getJSONObject:getJSON, whenReady:whenReady};
  easyXDM.DomHelper = {on:on, un:un, requiresJSON:function(path) {
    if(!isHostObject(window, "JSON")) {
      document.write('<script type="text/javascript" src="' + path + '">\x3c/script>')
    }
  }};
  (function() {
    var _map = {};
    easyXDM.Fn = {set:function(name, fn) {
      _map[name] = fn
    }, get:function(name, del) {
      var fn = _map[name];
      if(del) {
        delete _map[name]
      }
      return fn
    }}
  })();
  easyXDM.Socket = function(config) {
    var stack = chainStack(prepareTransportStack(config).concat([{incoming:function(message, origin) {
      config.onMessage(message, origin)
    }, callback:function(success) {
      if(config.onReady) {
        config.onReady(success)
      }
    }}])), recipient = getLocation(config.remote);
    this.origin = getLocation(config.remote);
    this.destroy = function() {
      stack.destroy()
    };
    this.postMessage = function(message) {
      stack.outgoing(message, recipient)
    };
    stack.init()
  };
  easyXDM.Rpc = function(config, jsonRpcConfig) {
    if(jsonRpcConfig.local) {
      for(var method in jsonRpcConfig.local) {
        if(jsonRpcConfig.local.hasOwnProperty(method)) {
          var member = jsonRpcConfig.local[method];
          if(typeof member === "function") {
            jsonRpcConfig.local[method] = {method:member}
          }
        }
      }
    }
    var stack = chainStack(prepareTransportStack(config).concat([new easyXDM.stack.RpcBehavior(this, jsonRpcConfig), {callback:function(success) {
      if(config.onReady) {
        config.onReady(success)
      }
    }}]));
    this.origin = getLocation(config.remote);
    this.destroy = function() {
      stack.destroy()
    };
    stack.init()
  };
  easyXDM.stack.SameOriginTransport = function(config) {
    var pub, frame, send, targetOrigin;
    return pub = {outgoing:function(message, domain, fn) {
      send(message);
      if(fn) {
        fn()
      }
    }, destroy:function() {
      if(frame) {
        frame.parentNode.removeChild(frame);
        frame = null
      }
    }, onDOMReady:function() {
      targetOrigin = getLocation(config.remote);
      if(config.isHost) {
        apply(config.props, {src:appendQueryParameters(config.remote, {xdm_e:location.protocol + "//" + location.host + location.pathname, xdm_c:config.channel, xdm_p:4}), name:IFRAME_PREFIX + config.channel + "_provider"});
        frame = createFrame(config);
        easyXDM.Fn.set(config.channel, function(sendFn) {
          send = sendFn;
          setTimeout(function() {
            pub.up.callback(true)
          }, 0);
          return function(msg) {
            pub.up.incoming(msg, targetOrigin)
          }
        })
      }else {
        send = parent.easyXDM.Fn.get(config.channel, true)(function(msg) {
          pub.up.incoming(msg, targetOrigin)
        });
        setTimeout(function() {
          pub.up.callback(true)
        }, 0)
      }
    }, init:function() {
      whenReady(pub.onDOMReady, pub)
    }}
  };
  easyXDM.stack.PostMessageTransport = function(config) {
    var pub, frame, callerWindow, targetOrigin;
    function _getOrigin(event) {
      if(event.origin) {
        return event.origin
      }
      if(event.uri) {
        return getLocation(event.uri)
      }
      if(event.domain) {
        return location.protocol + "//" + event.domain
      }
      throw"Unable to retrieve the origin of the event";
    }
    function _window_onMessage(event) {
      var origin = _getOrigin(event);
      if(origin == targetOrigin && event.data.substring(0, config.channel.length + 1) == config.channel + " ") {
        var cb = function() {
          pub.up.incoming(event.data.substring(config.channel.length + 1), origin)
        };
        window.WebAgent ? WebAgent.util.Mnt.wrapTryCatch(cb) : cb()
      }
    }
    return pub = {outgoing:function(message, domain, fn) {
      callerWindow.postMessage(config.channel + " " + message, domain || targetOrigin);
      if(fn) {
        fn()
      }
    }, destroy:function() {
      un(window, "message", _window_onMessage);
      if(frame) {
        callerWindow = null;
        frame.parentNode.removeChild(frame);
        frame = null
      }
    }, onDOMReady:function() {
      targetOrigin = getLocation(config.remote);
      if(config.isHost) {
        on(window, "message", function waitForReady(event) {
          if(event.data == config.channel + "-ready") {
            callerWindow = "postMessage" in frame.contentWindow ? frame.contentWindow : frame.contentWindow.document;
            un(window, "message", waitForReady);
            on(window, "message", _window_onMessage);
            setTimeout(function() {
              pub.up.callback(true)
            }, 0)
          }
        });
        apply(config.props, {src:appendQueryParameters(config.remote, {xdm_e:location.protocol + "//" + location.host, xdm_c:config.channel, xdm_p:1}), name:IFRAME_PREFIX + config.channel + "_provider"});
        frame = createFrame(config)
      }else {
        on(window, "message", _window_onMessage);
        callerWindow = "postMessage" in window.parent ? window.parent : window.parent.document;
        callerWindow.postMessage(config.channel + "-ready", targetOrigin);
        setTimeout(function() {
          pub.up.callback(true)
        }, 0)
      }
    }, init:function() {
      whenReady(pub.onDOMReady, pub)
    }}
  };
  easyXDM.stack.FrameElementTransport = function(config) {
    var pub, frame, send, targetOrigin;
    return pub = {outgoing:function(message, domain, fn) {
      send.call(this, message);
      if(fn) {
        fn()
      }
    }, destroy:function() {
      if(frame) {
        frame.parentNode.removeChild(frame);
        frame = null
      }
    }, onDOMReady:function() {
      targetOrigin = getLocation(config.remote);
      if(config.isHost) {
        apply(config.props, {src:appendQueryParameters(config.remote, {xdm_e:location.protocol + "//" + location.host + location.pathname + location.search, xdm_c:config.channel, xdm_p:5}), name:IFRAME_PREFIX + config.channel + "_provider"});
        frame = createFrame(config);
        frame.fn = function(sendFn) {
          delete frame.fn;
          send = sendFn;
          setTimeout(function() {
            pub.up.callback(true)
          }, 0);
          return function(msg) {
            pub.up.incoming(msg, targetOrigin)
          }
        }
      }else {
        if(document.referrer && document.referrer != query.xdm_e) {
          window.parent.location = query.xdm_e
        }else {
          if(document.referrer != query.xdm_e) {
            window.parent.location = query.xdm_e
          }
          send = window.frameElement.fn(function(msg) {
            pub.up.incoming(msg, targetOrigin)
          });
          pub.up.callback(true)
        }
      }
    }, init:function() {
      whenReady(pub.onDOMReady, pub)
    }}
  };
  easyXDM.stack.NixTransport = function(config) {
    var pub, frame, send, targetOrigin, proxy;
    return pub = {outgoing:function(message, domain, fn) {
      send(message);
      if(fn) {
        fn()
      }
    }, destroy:function() {
      proxy = null;
      if(frame) {
        frame.parentNode.removeChild(frame);
        frame = null
      }
    }, onDOMReady:function() {
      targetOrigin = getLocation(config.remote);
      if(config.isHost) {
        try {
          if(!isHostMethod(window, "getNixProxy")) {
            window.execScript("Class NixProxy\n" + "    Private m_parent, m_child, m_Auth\n" + "\n" + "    Public Sub SetParent(obj, auth)\n" + "        If isEmpty(m_Auth) Then m_Auth = auth\n" + "        SET m_parent = obj\n" + "    End Sub\n" + "    Public Sub SetChild(obj)\n" + "        SET m_child = obj\n" + "        m_parent.ready()\n" + "    End Sub\n" + "\n" + "    Public Sub SendToParent(data, auth)\n" + "        If m_Auth = auth Then m_parent.send(CStr(data))\n" + "    End Sub\n" + "    Public Sub SendToChild(data, auth)\n" + 
            "        If m_Auth = auth Then m_child.send(CStr(data))\n" + "    End Sub\n" + "End Class\n" + "Function getNixProxy()\n" + "    Set GetNixProxy = New NixProxy\n" + "End Function\n", "vbscript")
          }
          proxy = getNixProxy();
          proxy.SetParent({send:function(msg) {
            pub.up.incoming(msg, targetOrigin)
          }, ready:function() {
            setTimeout(function() {
              pub.up.callback(true)
            }, 0)
          }}, config.secret);
          send = function(msg) {
            proxy.SendToChild(msg, config.secret)
          }
        }catch(e1) {
          throw new Error("Could not set up VBScript NixProxy:" + e1.message);
        }
        apply(config.props, {src:appendQueryParameters(config.remote, {xdm_e:location.protocol + "//" + location.host + location.pathname + location.search, xdm_c:config.channel, xdm_s:config.secret, xdm_p:3}), name:IFRAME_PREFIX + config.channel + "_provider"});
        frame = createFrame(config);
        frame.contentWindow.opener = proxy
      }else {
        if(document.referrer && document.referrer != query.xdm_e) {
          window.parent.location = query.xdm_e
        }else {
          if(document.referrer != query.xdm_e) {
            window.parent.location = query.xdm_e
          }
          try {
            proxy = window.opener
          }catch(e2) {
            throw new Error("Cannot access window.opener");
          }
          proxy.SetChild({send:function(msg) {
            global.setTimeout(function() {
              pub.up.incoming(msg, targetOrigin)
            }, 0)
          }});
          send = function(msg) {
            proxy.SendToParent(msg, config.secret)
          };
          setTimeout(function() {
            pub.up.callback(true)
          }, 0)
        }
      }
    }, init:function() {
      whenReady(pub.onDOMReady, pub)
    }}
  };
  easyXDM.stack.NameTransport = function(config) {
    var pub;
    var isHost, callerWindow, remoteWindow, readyCount, callback, remoteOrigin, remoteUrl;
    function _sendMessage(message) {
      var url = config.remoteHelper + (isHost ? "#_3" : "#_2") + config.channel;
      callerWindow.contentWindow.sendMessage(message, url)
    }
    function _onReady() {
      if(isHost) {
        if(++readyCount === 2 || !isHost) {
          pub.up.callback(true)
        }
      }else {
        _sendMessage("ready");
        pub.up.callback(true)
      }
    }
    function _onMessage(message) {
      pub.up.incoming(message, remoteOrigin)
    }
    function _onLoad() {
      if(callback) {
        setTimeout(function() {
          callback(true)
        }, 0)
      }
    }
    return pub = {outgoing:function(message, domain, fn) {
      callback = fn;
      _sendMessage(message)
    }, destroy:function() {
      callerWindow.parentNode.removeChild(callerWindow);
      callerWindow = null;
      if(isHost) {
        remoteWindow.parentNode.removeChild(remoteWindow);
        remoteWindow = null
      }
    }, onDOMReady:function() {
      isHost = config.isHost;
      readyCount = 0;
      remoteOrigin = getLocation(config.remote);
      config.local = resolveUrl(config.local);
      if(isHost) {
        easyXDM.Fn.set(config.channel, function(message) {
          if(isHost && message === "ready") {
            easyXDM.Fn.set(config.channel, _onMessage);
            _onReady()
          }
        });
        remoteUrl = appendQueryParameters(config.remote, {xdm_e:config.local, xdm_c:config.channel, xdm_p:2});
        apply(config.props, {src:remoteUrl + "#" + config.channel, name:IFRAME_PREFIX + config.channel + "_provider"});
        remoteWindow = createFrame(config)
      }else {
        config.remoteHelper = config.remote;
        easyXDM.Fn.set(config.channel, _onMessage)
      }
      callerWindow = createFrame({props:{src:config.local + "#_4" + config.channel}, onLoad:function onLoad() {
        un(callerWindow, "load", onLoad);
        easyXDM.Fn.set(config.channel + "_load", _onLoad);
        (function test() {
          if(typeof callerWindow.contentWindow.sendMessage == "function") {
            _onReady()
          }else {
            setTimeout(test, 50)
          }
        })()
      }})
    }, init:function() {
      whenReady(pub.onDOMReady, pub)
    }}
  };
  easyXDM.stack.HashTransport = function(config) {
    var pub;
    var me = this, isHost, _timer, pollInterval, _lastMsg, _msgNr, _listenerWindow, _callerWindow;
    var useParent, _remoteOrigin;
    function _sendMessage(message) {
      if(!_callerWindow) {
        return
      }
      var url = config.remote + "#" + _msgNr++ + "_" + message;
      (isHost || !useParent ? _callerWindow.contentWindow : _callerWindow).location = url
    }
    function _handleHash(hash) {
      _lastMsg = hash;
      pub.up.incoming(_lastMsg.substring(_lastMsg.indexOf("_") + 1), _remoteOrigin)
    }
    function _pollHash() {
      if(!_listenerWindow) {
        return
      }
      var href = _listenerWindow.location.href, hash = "", indexOf = href.indexOf("#");
      if(indexOf != -1) {
        hash = href.substring(indexOf)
      }
      if(hash && hash != _lastMsg) {
        _handleHash(hash)
      }
    }
    function _attachListeners() {
      _timer = setInterval(_pollHash, pollInterval)
    }
    return pub = {outgoing:function(message, domain) {
      _sendMessage(message)
    }, destroy:function() {
      window.clearInterval(_timer);
      if(isHost || !useParent) {
        _callerWindow.parentNode.removeChild(_callerWindow)
      }
      _callerWindow = null
    }, onDOMReady:function() {
      isHost = config.isHost;
      pollInterval = config.interval;
      _lastMsg = "#" + config.channel;
      _msgNr = 0;
      useParent = config.useParent;
      _remoteOrigin = getLocation(config.remote);
      if(isHost) {
        config.props = {src:config.remote, name:IFRAME_PREFIX + config.channel + "_provider"};
        if(useParent) {
          config.onLoad = function() {
            _listenerWindow = window;
            _attachListeners();
            pub.up.callback(true)
          }
        }else {
          var tries = 0, max = config.delay / 50;
          (function getRef() {
            if(++tries > max) {
              throw new Error("Unable to reference listenerwindow");
            }
            try {
              _listenerWindow = _callerWindow.contentWindow.frames[IFRAME_PREFIX + config.channel + "_consumer"]
            }catch(ex) {
            }
            if(_listenerWindow) {
              _attachListeners();
              pub.up.callback(true)
            }else {
              setTimeout(getRef, 50)
            }
          })()
        }
        _callerWindow = createFrame(config)
      }else {
        _listenerWindow = window;
        _attachListeners();
        if(useParent) {
          _callerWindow = parent;
          pub.up.callback(true)
        }else {
          apply(config, {props:{src:config.remote + "#" + config.channel + new Date, name:IFRAME_PREFIX + config.channel + "_consumer"}, onLoad:function() {
            pub.up.callback(true)
          }});
          _callerWindow = createFrame(config)
        }
      }
    }, init:function() {
      whenReady(pub.onDOMReady, pub)
    }}
  };
  easyXDM.stack.ReliableBehavior = function(config) {
    var pub, callback;
    var idOut = 0, idIn = 0, currentMessage = "";
    return pub = {incoming:function(message, origin) {
      var indexOf = message.indexOf("_"), ack = message.substring(0, indexOf).split(",");
      message = message.substring(indexOf + 1);
      if(ack[0] == idOut) {
        currentMessage = "";
        if(callback) {
          callback(true)
        }
      }
      if(message.length > 0) {
        pub.down.outgoing(ack[1] + "," + idOut + "_" + currentMessage, origin);
        if(idIn != ack[1]) {
          idIn = ack[1];
          pub.up.incoming(message, origin)
        }
      }
    }, outgoing:function(message, origin, fn) {
      currentMessage = message;
      callback = fn;
      pub.down.outgoing(idIn + "," + ++idOut + "_" + message, origin)
    }}
  };
  easyXDM.stack.QueueBehavior = function(config) {
    var pub, queue = [], waiting = true, incoming = "", destroying, maxLength = 0, lazy = false, doFragment = false;
    function dispatch() {
      if(config.remove && queue.length === 0) {
        removeFromStack(pub);
        return
      }
      if(waiting || queue.length === 0 || destroying) {
        return
      }
      waiting = true;
      var message = queue.shift();
      pub.down.outgoing(message.data, message.origin, function(success) {
        waiting = false;
        if(message.callback) {
          setTimeout(function() {
            message.callback(success)
          }, 0)
        }
        dispatch()
      })
    }
    return pub = {init:function() {
      if(undef(config)) {
        config = {}
      }
      if(config.maxLength) {
        maxLength = config.maxLength;
        doFragment = true
      }
      if(config.lazy) {
        lazy = true
      }else {
        pub.down.init()
      }
    }, callback:function(success) {
      waiting = false;
      var up = pub.up;
      dispatch();
      up.callback(success)
    }, incoming:function(message, origin) {
      if(doFragment) {
        var indexOf = message.indexOf("_"), seq = parseInt(message.substring(0, indexOf), 10);
        incoming += message.substring(indexOf + 1);
        if(seq === 0) {
          if(config.encode) {
            incoming = decodeURIComponent(incoming)
          }
          pub.up.incoming(incoming, origin);
          incoming = ""
        }
      }else {
        pub.up.incoming(message, origin)
      }
    }, outgoing:function(message, origin, fn) {
      if(config.encode) {
        message = encodeURIComponent(message)
      }
      var fragments = [], fragment;
      if(doFragment) {
        while(message.length !== 0) {
          fragment = message.substring(0, maxLength);
          message = message.substring(fragment.length);
          fragments.push(fragment)
        }
        while(fragment = fragments.shift()) {
          queue.push({data:fragments.length + "_" + fragment, origin:origin, callback:fragments.length === 0 ? fn : null})
        }
      }else {
        queue.push({data:message, origin:origin, callback:fn})
      }
      if(lazy) {
        pub.down.init()
      }else {
        dispatch()
      }
    }, destroy:function() {
      destroying = true;
      pub.down.destroy()
    }}
  };
  easyXDM.stack.VerifyBehavior = function(config) {
    var pub, mySecret, theirSecret, verified = false;
    function startVerification() {
      mySecret = Math.random().toString(16).substring(2);
      pub.down.outgoing(mySecret)
    }
    return pub = {incoming:function(message, origin) {
      var indexOf = message.indexOf("_");
      if(indexOf === -1) {
        if(message === mySecret) {
          pub.up.callback(true)
        }else {
          if(!theirSecret) {
            theirSecret = message;
            if(!config.initiate) {
              startVerification()
            }
            pub.down.outgoing(message)
          }
        }
      }else {
        if(message.substring(0, indexOf) === theirSecret) {
          pub.up.incoming(message.substring(indexOf + 1), origin)
        }
      }
    }, outgoing:function(message, origin, fn) {
      pub.down.outgoing(mySecret + "_" + message, origin, fn)
    }, callback:function(success) {
      if(config.initiate) {
        startVerification()
      }
    }}
  };
  easyXDM.stack.RpcBehavior = function(proxy, config) {
    var pub, serializer = config.serializer || getJSON();
    var _callbackCounter = 0, _callbacks = {};
    function _send(data) {
      data.jsonrpc = "2.0";
      pub.down.outgoing(serializer.stringify(data))
    }
    function _createMethod(definition, method) {
      var slice = Array.prototype.slice;
      return function() {
        var l = arguments.length, callback, message = {method:method};
        if(l > 0 && typeof arguments[l - 1] === "function") {
          if(l > 1 && typeof arguments[l - 2] === "function") {
            callback = {success:arguments[l - 2], error:arguments[l - 1]};
            message.params = slice.call(arguments, 0, l - 2)
          }else {
            callback = {success:arguments[l - 1]};
            message.params = slice.call(arguments, 0, l - 1)
          }
          _callbacks["" + ++_callbackCounter] = callback;
          message.id = _callbackCounter
        }else {
          message.params = slice.call(arguments, 0)
        }
        if(definition.namedParams && message.params.length === 1) {
          message.params = message.params[0]
        }
        _send(message)
      }
    }
    function _executeMethod(method, id, fn, params) {
      if(!fn) {
        if(id) {
          _send({id:id, error:{code:-32601, message:"Procedure not found."}})
        }
        return
      }
      var success, error;
      if(id) {
        success = function(result) {
          success = emptyFn;
          _send({id:id, result:result})
        };
        error = function(message, data) {
          error = emptyFn;
          var msg = {id:id, error:{code:-32099, message:message}};
          if(data) {
            msg.error.data = data
          }
          _send(msg)
        }
      }else {
        success = error = emptyFn
      }
      if(!isArray(params)) {
        params = [params]
      }
      try {
        var result = fn.method.apply(fn.scope, params.concat([success, error]));
        if(!undef(result)) {
          success(result)
        }
      }catch(ex1) {
        error(ex1.message)
      }
    }
    return pub = {incoming:function(message, origin) {
      var data = serializer.parse(message);
      if(data.method) {
        if(config.handle) {
          config.handle(data, _send)
        }else {
          _executeMethod(data.method, data.id, config.local[data.method], data.params)
        }
      }else {
        var callback = _callbacks[data.id] || {};
        if(data.error) {
          if(callback.error) {
            callback.error(data.error)
          }
        }else {
          if(callback.success) {
            callback.success(data.result)
          }
        }
        delete _callbacks[data.id]
      }
    }, init:function() {
      if(config.remote) {
        for(var method in config.remote) {
          if(config.remote.hasOwnProperty(method)) {
            proxy[method] = _createMethod(config.remote[method], method)
          }
        }
      }
      pub.down.init()
    }, destroy:function() {
      for(var method in config.remote) {
        if(config.remote.hasOwnProperty(method) && proxy.hasOwnProperty(method)) {
          delete proxy[method]
        }
      }
      pub.down.destroy()
    }}
  }
})(window, document, location, window.nativeSetTimeout || window.setTimeout, decodeURIComponent, encodeURIComponent);
(function() {
  var WA = window.WebAgent = window.WebAgent || {};
  var isEmail = function(str) {
    var m = str.match(/[^@:]+@[^:]+/);
    return m && m[0] || false
  };
  var getUserLogin = function() {
    return window.mailru && mailru.useremail && isEmail(mailru.useremail) || (/Mpop=.*?:([^@:]+@[^:]+)/.exec(document.cookie.toString()) || [0, false])[1]
  };
  var ACTIVE_MAIL = getUserLogin();
  if(ACTIVE_MAIL) {
    var SAFE_ACTIVE_MAIL = ACTIVE_MAIL.replace(/[^a-z0-9]+/ig, "").toLowerCase()
  }
  var isDebug = location.href.indexOf("localhost") != -1 || location.href.indexOf("wa_debug") != -1;
  var docMode = document.documentMode;
  var ua = navigator.userAgent.toLowerCase();
  var checkUA = function(regexp) {
    return regexp.test(ua)
  };
  var isOpera = checkUA(/opera/), isWebKit = checkUA(/webkit/), isIE = !isOpera && checkUA(/msie/), isIE8 = isIE && checkUA(/msie 8/) && docMode != 7, isIE9 = isIE && checkUA(/msie 9/) && docMode != 7 && docMode != 8, isGecko = !isWebKit && checkUA(/gecko/), isGecko3 = isGecko && checkUA(/rv:1\.9/);
  var UID = 1;
  var apply = function(to, from, defaults) {
    if(defaults) {
      apply(to, defaults)
    }
    if(from) {
      for(var key in from) {
        to[key] = from[key]
      }
    }
    return to
  };
  apply(WebAgent, {isDebug:isDebug, isIE:isIE, isIE8:isIE8, isIE9:isIE9, isFF36:isGecko3, isFF:isGecko, isWebKit:isWebKit, isOpera:isOpera, isSecure:("" + document.location).split(":")[0] == "https", isLoadReduce:isIE, ACTIVE_MAIL:ACTIVE_MAIL, SAFE_ACTIVE_MAIL:SAFE_ACTIVE_MAIL, resizeableLayout:true, apply:apply, applyIf:function(to, from) {
    if(from) {
      for(var key in from) {
        if(typeof to[key] === "undefined") {
          to[key] = from[key]
        }
      }
    }
    return to
  }, isPopup:window.__WebAgent__isPopup || false, namespace:function(path) {
    var arr = path.split(".");
    var o = window[arr[0]] = window[arr[0]] || {};
    WebAgent.each(arr.slice(1), function(el) {
      o = o[el] = o[el] || {}
    });
    return o
  }, getJSON:function() {
    if(window.JSON && window.JSON.stringify(["a"]) == '["a"]') {
      return window.JSON
    }else {
      return window._JSON
    }
  }, getUserLogin:getUserLogin, isNumber:function(v) {
    return typeof v === "number" && isFinite(v)
  }, isString:function(v) {
    return typeof v === "string"
  }, isFunction:function(v) {
    return typeof v === "function"
  }, isObject:function(v) {
    return typeof v === "object"
  }, isBoolean:function(value) {
    return typeof value === "boolean"
  }, isDate:function(v) {
    return Object.prototype.toString.apply(v) === "[object Date]"
  }, isArray:function(v) {
    return Object.prototype.toString.apply(v) === "[object Array]"
  }, toArray:function(v) {
    if(WebAgent.isArray(v)) {
      return v
    }else {
      return Array.prototype.slice.call(v, 0)
    }
  }, each:function(arr, fn, scope) {
    var len = arr.length;
    for(var i = 0;i < len;++i) {
      if(fn.call(scope || window, arr[i], i, arr) === false) {
        return
      }
    }
  }, createDelegate:function(fn, scope, args, appendArgs) {
    return function() {
      var callArgs = WebAgent.toArray(arguments);
      if(appendArgs === true) {
        callArgs = callArgs.concat(args || [])
      }else {
        if(WebAgent.isNumber(appendArgs)) {
          callArgs = callArgs.slice(0, appendArgs).concat(args || [])
        }
      }
      return fn.apply(scope || window, callArgs)
    }
  }, buildId:function(suffix) {
    return"mailru-webagent-" + suffix
  }, buildIconClass:function(status, addDefaultIcon) {
    if(!status || /[<>\"\']/.test(status)) {
      status = "online"
    }
    return(addDefaultIcon === true ? "wa-cl-status-default " : "") + "wa-cl-status-" + status
  }, generateId:function() {
    return WebAgent.buildId("gen-" + UID++)
  }, emptyFn:function() {
  }, now:function() {
    return Math.floor(new Date / 1E3)
  }, setTimeout:function(code, interval, scope) {
    var cb = function() {
      WA.util.Mnt.wrapTryCatch(code, scope)
    };
    if(window.nativeSetTimeout) {
      return window.nativeSetTimeout(cb, interval)
    }else {
      return window.setTimeout(cb, interval)
    }
  }, setInterval:function(code, interval, scope) {
    var cb = function() {
      WA.util.Mnt.wrapTryCatch(code, scope)
    };
    if(window.nativeSetInterval) {
      return window.nativeSetInterval(cb, interval)
    }else {
      return window.setInterval(cb, interval)
    }
  }, makeGet:function(hash) {
    var get = [];
    WebAgent.util.Object.each(hash, function(v, k) {
      get[get.length] = k + "=" + encodeURIComponent(v)
    });
    return get.join("&")
  }, error:function(e) {
    if(isDebug) {
      debugger
    }
    if(WA.Mnt) {
      WA.Mnt.log(e)
    }
    throw e;
  }, abstractError:function() {
    WebAgent.error("Abstract method")
  }, gstat:function(params) {
  }, makeAvatar:function(mail, type, domain) {
    domain = domain || "avt.imgsmail.ru";
    var t = mail.match(/([^@]+)@(.+)/i);
    if(t[2] == "uin.icq") {
      t[2] = "uin"
    }
    return"//" + domain + "/" + t[2] + "/" + t[1] + "/" + type
  }, sum:function() {
    var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D".split(" ");
    return function(str) {
      var crc = -1;
      for(var i = 0, len = str.length;i < len;i++) {
        var t = (crc ^ str.charCodeAt(i)) & 255;
        crc = crc >>> 8 ^ parseInt(table[t], 16)
      }
      crc ^= -1;
      if(crc < 0) {
        crc += 4294967296
      }
      return crc.toString(16)
    }
  }()})
})();
(function() {
  function override(source, overrides) {
    var p = source.prototype;
    WebAgent.apply(p, overrides);
    if(WebAgent.isIE && overrides.hasOwnProperty("toString")) {
      p.toString = overrides.toString
    }
  }
  WebAgent.apply(WebAgent, {extend:function(superclass, overrides) {
    var oc = Object.prototype.constructor;
    var sub;
    if(overrides.constructor != oc) {
      sub = overrides.constructor
    }else {
      sub = function() {
        superclass.apply(this, arguments)
      }
    }
    var F = function() {
    };
    var subP;
    var superP = superclass.prototype;
    F.prototype = superP;
    subP = sub.prototype = new F;
    subP.constructor = sub;
    sub.superclass = superP;
    if(superP.constructor == oc) {
      superP.constructor = superclass
    }
    subP.superclass = function() {
      return superP
    };
    override(sub, overrides);
    return sub
  }})
})();
(function() {
  var WA = WebAgent;
  var addDomListener = function(dom, eventName, fn, useCapture) {
    if(dom.addEventListener) {
      dom.addEventListener(eventName, fn, !!useCapture)
    }else {
      if(dom.attachEvent) {
        dom.attachEvent("on" + eventName, fn)
      }
    }
  };
  var removeDomListener = function(dom, eventName, fn, useCapture) {
    if(dom.removeEventListener) {
      dom.removeEventListener(eventName, fn, !!useCapture)
    }else {
      if(dom.detachEvent) {
        dom.detachEvent("on" + eventName, fn)
      }
    }
  };
  var EVENT_BUTTON_MAP = WA.isIE ? {b1:0, b4:1, b2:2} : {b0:0, b1:1, b2:2};
  var DomEvent = WA.extend(Object, {constructor:function(e) {
    var ev = this.browserEvent = e || {}, doc;
    this.button = ev.button ? EVENT_BUTTON_MAP["b" + ev.button] : ev.which ? ev.which - 1 : -1;
    if(/(dbl)?click/.test(ev.type) && this.button == -1) {
      this.button = 0
    }
    this.type = ev.type;
    this.keyCode = ev.keyCode;
    this.charCode = ev.charCode;
    this.shiftKey = ev.shiftKey;
    this.ctrlKey = ev.ctrlKey || ev.metaKey || false;
    this.altKey = ev.altKey;
    this.pageX = ev.pageX;
    this.pageY = ev.pageY;
    if(ev.pageX == null && ev.clientX != null) {
      doc = document.documentElement;
      this.pageX = ev.clientX + (doc && doc.scrollLeft || 0);
      this.pageY = ev.clientY + (doc && doc.scrollTop || 0)
    }
  }, getKeyCode:function() {
    return this.browserEvent.keyCode
  }, getCharCode:function() {
    return this.browserEvent.charCode
  }, getTarget:function(returnElement) {
    var node = this.browserEvent.target || this.browserEvent.srcElement;
    if(!node) {
      return null
    }else {
      var dom = node.nodeType == 3 ? node.parentNode : node;
      return returnElement ? WA.get(dom) : dom
    }
  }, stopPropagation:function() {
    var event = this.browserEvent;
    if(event) {
      if(event.stopPropagation) {
        event.stopPropagation()
      }else {
        event.cancelBubble = true
      }
    }
  }, preventDefault:function() {
    var event = this.browserEvent;
    if(event) {
      if(event.preventDefault) {
        event.preventDefault()
      }else {
        event.returnValue = false
      }
    }
  }, stopEvent:function() {
    this.stopPropagation();
    this.preventDefault()
  }});
  var Container = {items:{}, register:function(el) {
    var id = el.identify();
    if(!this.items[id]) {
      this.items[id] = new ContainerItem(el)
    }
  }, getElement:function(id) {
    var item = this.items[id];
    if(item && item.isValid()) {
      return item.el
    }else {
      return null
    }
  }, each:function(fn, scope) {
    WA.util.Object.each(this.items, fn, scope || this)
  }, addListener:function(el, eventName, fn, scope, options) {
    this.register(el);
    var item = this.items[el.getId()];
    item.addListener(eventName, fn, scope, options)
  }, removeListener:function(el, eventName, fn, scope) {
    var item = this.items[el.getId()];
    if(item) {
      item.removeListener(eventName, fn, scope)
    }
  }, removeListeners:function(el, recursively, eventName) {
    var item = this.items[el.getId()];
    if(item) {
      item.removeListeners(eventName);
      if(recursively && el.dom.childNodes) {
        el.each(function(childEl) {
          this.removeListeners(childEl, recursively, eventName)
        }, this)
      }
    }
  }, remove:function(el) {
    var id = el.getId();
    var item = this.items[id];
    if(item) {
      item.destroy();
      delete this.items[id]
    }
  }};
  var ContainerItem = WA.extend(Object, {constructor:function(el) {
    this.el = el;
    this.events = {};
    this.domHandlers = {}
  }, isValid:function() {
    var el = this.el;
    var dom = el.dom;
    var isInvalid = !dom || !dom.parentNode || !dom.offsetParent && !document.getElementById(el.getId());
    return!isInvalid || dom === document || dom === document.body || dom === window
  }, addListener:function(eventName, fn, scope, options) {
    var event = this.events[eventName];
    if(!event) {
      event = this.events[eventName] = new WA.util.Event;
      this.domHandlers[eventName] = WA.createDelegate(function(e, ename) {
        WA.util.Mnt.wrapTryCatch(function() {
          if(this.events[ename]) {
            this.events[ename].fire(new DomEvent(e), this.el)
          }
        }, this)
      }, this, [eventName], 1);
      if(eventName == "afterresize") {
        addDomListener(this.el.dom, "resize", WA.createDelegate(function(e) {
          if(this._timer > 0) {
            clearTimeout(this._timer)
          }
          this._timer = WA.setTimeout(WA.createDelegate(function() {
            this.domHandlers[eventName].call(window, e)
          }, this), 150)
        }, this))
      }else {
        addDomListener(this.el.dom, eventName, this.domHandlers[eventName], !!(options || {}).useCapture)
      }
    }
    event.on(fn, scope || this.el, options)
  }, removeListener:function(eventName, fn, scope) {
    var event = this.events[eventName];
    if(event) {
      event.un(fn, scope || this.el);
      if(!event.hasListeners() && this.el && eventName == "mousemove") {
        removeDomListener(this.el.dom, eventName, this.domHandlers[eventName]);
        delete this.events[eventName];
        delete this.domHandlers[eventName]
      }
    }
  }, removeListeners:function(eventName) {
    if(eventName) {
      var event = this.events[eventName];
      if(event) {
        event.removeAll()
      }
    }else {
      WA.util.Object.each(this.events, function(ignored, ename) {
        this.removeListeners(ename)
      }, this)
    }
  }, destroy:function() {
    var eventNames = WA.util.Object.getKeys(this.events);
    WA.util.Array.each(eventNames, function(eventName) {
      this.removeListeners(eventName);
      removeDomListener(this.el.dom, eventName, this.domHandlers[eventName]);
      delete this.events[eventName];
      delete this.domHandlers[eventName]
    }, this);
    this.events = null;
    this.domHandlers = null;
    this.el = null
  }});
  var garbageCollect = function() {
    Container.each(function(item) {
      if(!item.isValid()) {
        this.remove(item.el)
      }
    })
  };
  WA.setInterval(garbageCollect, 3E4);
  var propCache = {}, camelRe = /(-[a-z])/gi, propFloat = WA.isIE ? "styleFloat" : "cssFloat";
  function camelFn(mchkCache, a) {
    return a.charAt(1).toUpperCase()
  }
  function chkCache(prop) {
    return propCache[prop] || (propCache[prop] = prop == "float" ? propFloat : prop.replace(camelRe, camelFn))
  }
  function getStyle(x, styleProp) {
    if(x.currentStyle) {
      var y = x.currentStyle[styleProp]
    }else {
      if(window.getComputedStyle) {
        y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp)
      }
    }
    return y
  }
  var Element = WA.extend(Object, {constructor:function(dom) {
    this.dom = dom
  }, getId:function() {
    if(this.dom === window) {
      return WA.buildId("window")
    }else {
      if(this.dom === document) {
        return WA.buildId("document")
      }else {
        if(this.dom === document.body) {
          return WA.buildId("body")
        }else {
          return this.dom.id
        }
      }
    }
  }, identify:function() {
    return this.getId() || (this.dom.id = WA.generateId())
  }, getWidth:function() {
    return Math.max(this.dom.offsetWidth, this.isVisible() ? 0 : this.dom.clientWidth) || 0
  }, getHeight:function() {
    return Math.max(this.dom.offsetHeight, this.isVisible() ? 0 : this.dom.clientHeight) || 0
  }, getSize:function() {
    return{width:this.getWidth(), height:this.getHeight()}
  }, setWidth:function(width) {
    this.dom.style.width = width + "px";
    return this
  }, setHeight:function(height) {
    this.dom.style.height = height + "px";
    return this
  }, setSize:function(width, height) {
    if(WA.isObject(width)) {
      return this.setSize(width.width, width.height)
    }else {
      this.setWidth(width);
      this.setHeight(height);
      return this
    }
  }, addListener:function(eventName, fn, scope, optons) {
    Container.addListener(this, eventName, fn, scope, optons);
    return this
  }, on:function(eventName, fn, scope, options) {
    return this.addListener(eventName, fn, scope, options)
  }, removeListener:function(eventName, fn, scope) {
    Container.removeListener(this, eventName, fn, scope);
    return this
  }, un:function(eventName, fn, scope) {
    return this.removeListener(eventName, fn, scope)
  }, removeListeners:function(recursively, eventName) {
    Container.removeListeners(this, recursively, eventName);
    return this
  }, setAttribute:function(name, value) {
    this.dom.setAttribute(name, value)
  }, getAttribute:function(name) {
    return this.dom.getAttribute(name)
  }, removeAttribute:function(name) {
    return this.dom.removeAttribute(name)
  }, removeClass:function(className) {
    var clsArray = this.dom.className.split(" ");
    this.dom.className = WA.util.Array.remove(clsArray, className).join(" ");
    return this
  }, addClass:function(className) {
    if(!this.hasClass(className)) {
      this.dom.className += " " + className
    }
    return this
  }, hasClass:function(className) {
    return(" " + this.dom.className + " ").indexOf(" " + className + " ") != -1
  }, toggleClass:function(className, state) {
    var isBool = typeof state === "boolean";
    state = isBool ? state : !this.hasClass(className);
    this[state ? "addClass" : "removeClass"](className);
    return this
  }, getClass:function() {
    return this.dom.className
  }, update:function(html) {
    this.dom.innerHTML = html;
    return this
  }, insertFirst:function(el) {
    var newNode = WA.get(el);
    if(this.first()) {
      this.insertBefore(newNode, this.first());
      return newNode
    }
    return newNode.appendTo(this)
  }, appendChild:function(el) {
    return WA.get(el).appendTo(this)
  }, appendTo:function(el) {
    WA.getDom(el).appendChild(this.dom);
    return this
  }, insertBefore:function(el, before) {
    WA.getDom(el).insertBefore(this.dom, before);
    return this
  }, createChild:function(config, atTheBeginning) {
    var el = WA.util.DomHelper.insertHtml(atTheBeginning === true ? "afterBegin" : "beforeEnd", this.dom, config);
    return WA.fly(el)
  }, setVisible:function(visible) {
    this.dom.style.display = visible ? "block" : "none";
    return this
  }, isVisible:function() {
    return getStyle(this.dom, "display") == "block"
  }, show:function() {
    return this.setVisible(true)
  }, hide:function() {
    return this.setVisible(false)
  }, toggle:function() {
    return this.setVisible(!this.isVisible())
  }, each:function(fn, scope) {
    var nodes = this.dom.childNodes;
    var len = nodes.length;
    var k = 0;
    for(var i = 0;i < len;++i) {
      var node = WA.isFunction(nodes) ? nodes(i) : nodes[i];
      if(node.nodeType == 1) {
        k++;
        var el = node.id ? WA.get(node) : WA.fly(node);
        if(fn.call(scope || this, el, k) === false) {
          return
        }
      }
    }
  }, matchNode:function(dir, start) {
    var node = this.dom[start];
    while(node) {
      if(node.nodeType == 1) {
        return WA.get(node)
      }
      node = node[dir]
    }
    return null
  }, first:function() {
    return this.matchNode("nextSibling", "firstChild")
  }, last:function() {
    return this.matchNode("previousSibling", "lastChild")
  }, prev:function() {
    return this.matchNode("previousSibling", "previousSibling")
  }, next:function() {
    return this.matchNode("nextSibling", "nextSibling")
  }, parent:function() {
    return this.matchNode("parentNode", "parentNode")
  }, up:function(cls) {
    var node = this;
    while(node) {
      if(node.hasClass(cls)) {
        return node
      }
      node = node.parent()
    }
  }, offset:function() {
    var box = {top:0, left:0};
    if("getBoundingClientRect" in document.documentElement) {
      try {
        box = this.dom.getBoundingClientRect()
      }catch(ex) {
      }
    }else {
    }
    var doc = this.dom.ownerDocument, docElem = doc.documentElement, top = box.top + (window.pageYOffset || docElem.scrollTop), left = box.left + (window.pageXOffset || docElem.scrollLeft);
    return{top:top, left:left}
  }, __removeDom:function() {
    var d = null;
    return function(node) {
      if(node.tagName != "BODY") {
        if(WA.isIE && !WA.isIE8) {
          d = d || document.createElement("div");
          d.appendChild(node);
          d.innerHTML = ""
        }else {
          node.parentNode.removeChild(node)
        }
      }
    }
  }(), remove:function() {
    if(this._maskEl) {
      this._maskEl.remove();
      this._maskEl = null
    }
    Container.remove(this);
    this.__removeDom(this.dom);
    this.dom = null
  }, isMasked:function() {
    return this.hasClass("nwa-overlay")
  }, mask:function() {
    return this.addClass("nwa-overlay")
  }, unmask:function() {
    return this.removeClass("nwa-overlay")
  }, isAncestor:function(el) {
    var parent = WA.getDom(el);
    if(parent.contains) {
      try {
        return parent.contains(this.dom)
      }catch(e) {
      }
    }else {
      var c = this.dom.parentNode;
      while(c && c !== document) {
        if(parent === c) {
          return true
        }
        c = c.parentNode
      }
      return false
    }
  }, contains:function(el) {
    return WA.fly(el).isAncestor(this)
  }, equals:function(el) {
    return this.dom === el.dom
  }, setStyle:function(prop, value) {
    var tmp, style;
    if(!WA.isObject(prop)) {
      tmp = {};
      tmp[prop] = value;
      prop = tmp
    }
    for(style in prop) {
      value = prop[style];
      style == "opacity" ? this.setOpacity(value) : this.dom.style[chkCache(style)] = value
    }
    return this
  }, setOpacity:function(opacity, animate) {
    var me = this, s = me.dom.style;
    if(WA.isIE) {
      s.zoom = 1;
      s.filter = (s.filter || "").replace(/alpha\([^\)]*\)/gi, "") + (opacity == 1 ? "" : " alpha(opacity=" + opacity * 100 + ")")
    }else {
      s.opacity = opacity
    }
    return me
  }});
  WA.apply(WA, {getDom:function(el) {
    if(el instanceof Element) {
      return el.dom
    }else {
      if(typeof el === "string") {
        return document.getElementById(el)
      }else {
        return el
      }
    }
  }, fly:function(el) {
    if(el instanceof Element) {
      return el
    }else {
      return new Element(el)
    }
  }, get:function(el) {
    if(el instanceof Element) {
      return el
    }else {
      var dom = WA.getDom(el);
      if(dom) {
        var ret = Container.getElement(dom.id);
        if(!ret) {
          ret = new Element(dom)
        }
        return ret
      }else {
        return null
      }
    }
  }, getBody:function() {
    return new Element(document.body)
  }, getDoc:function() {
    return new Element(document)
  }})
})();
WebAgent.namespace("WebAgent");
(function() {
  var WA = WebAgent;
  var OVERRIDES = {isActive:function() {
    return this.__isActive === true
  }, activate:function(params) {
    if(!this.isActive()) {
      this.__isActive = true;
      return this._onActivate(params) !== false
    }else {
      return false
    }
  }, _onActivate:function(params) {
  }, deactivate:function(params) {
    if(this.isActive()) {
      this.__isActive = false;
      return this._onDeactivate(params) !== false
    }else {
      return false
    }
  }, _onDeactivate:function(params) {
  }};
  WA.Activatable = WA.extend(Object, OVERRIDES);
  WA.Activatable.extend = function(superclass, overrides) {
    var sp = WA.extend(superclass, OVERRIDES);
    return WA.extend(sp, overrides)
  }
})();
WebAgent.namespace("WebAgent.util");
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var Animation = U.Animation = WA.extend(Object, {constructor:function() {
    this._onFrameScope = WA.createDelegate(this._onFrame, this);
    this._list = {};
    this._index = -1
  }, _requestFrame:function() {
    this.requestAnimationFrame.call(window, this._onFrameScope)
  }, start:function(from, to, pxPerMs, cb, scope) {
    if(!this._started) {
      this._started = true;
      this._requestFrame()
    }
    this._index++;
    this._list[this._index] = {from:from, to:to, pxPerMs:pxPerMs, cb:cb, scope:scope, date:+new Date, first:true};
    return this._index
  }, clear:function(index) {
    delete this._list[index]
  }, _onFrame:function() {
    var count = 0;
    U.Object.each(this._list, function(v, index) {
      count++;
      var value;
      var d = (+new Date - v.date) * v.pxPerMs;
      var lastFrame = false;
      if(v.from < v.to) {
        value = v.from + d;
        if(value > v.to) {
          lastFrame = true;
          value = v.to
        }
      }else {
        value = v.from - d;
        if(value < v.to) {
          lastFrame = true;
          value = v.to
        }
      }
      v.cb.call(v.scope || window, value, lastFrame, v.first);
      v.first = false;
      if(lastFrame) {
        this.clear(index)
      }
    }, this);
    if(count) {
      this._requestFrame()
    }else {
      this._started = false
    }
  }, requestAnimationFrame:function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
      WA.setTimeout(callback, 1E3 / 60)
    }
  }()});
  U.animation = new U.Animation
})();
WebAgent.namespace("WebAgent.util");
(function() {
  var A = WebAgent.util.Array = {each:function(arr, fn, scope) {
    WebAgent.each(arr, fn, scope)
  }, unique:function(arr) {
    var ret = [];
    for(var i = 0;i < arr.length;i++) {
      if(A.indexOf(ret, arr[i]) == -1) {
        ret.push(arr[i])
      }
    }
    return ret
  }, eachReverse:function(arr, fn, scope) {
    var j = 0;
    for(var i = arr.length;i--;) {
      if(fn.call(scope || window, arr[i], j, arr) === false) {
        return
      }
      j++
    }
  }, transform:function(arr, fn, scope) {
    var ret = [];
    A.each(arr, function() {
      var el = fn.apply(this, arguments);
      ret.push(el)
    }, scope);
    return ret
  }, filter:function(arr, fn, scope) {
    var ret = [];
    A.each(arr, function(el, index, allItems) {
      if(fn.call(this, el, index, allItems)) {
        ret.push(el)
      }
    }, scope);
    return ret
  }, indexOf:function(arr, el) {
    var fn = null;
    if(el instanceof RegExp) {
      fn = function(entry) {
        return el.test(entry)
      }
    }else {
      fn = function(entry) {
        return el === entry
      }
    }
    return A.indexOfBy(arr, fn)
  }, indexOfBy:function(arr, fn, scope) {
    var ret = -1;
    A.each(arr, function(el, index) {
      if(fn.call(scope || window, el, index) === true) {
        ret = index;
        return false
      }
    });
    return ret
  }, findBy:function(arr, fn, scope) {
    var index = A.indexOfBy(arr, fn, scope);
    if(index != -1) {
      return arr[index]
    }else {
      return null
    }
  }, removeAt:function(arr, index) {
    arr.splice(index, 1);
    return arr
  }, remove:function(arr, el) {
    var index = A.indexOf(arr, el);
    if(index != -1) {
      return A.removeAt(arr, index)
    }else {
      return arr
    }
  }, removeBy:function(arr, fn, scope) {
    var index = A.indexOfBy(arr, fn, scope);
    if(index != -1) {
      return A.removeAt(arr, index)
    }else {
      return null
    }
  }, clone:function(arr) {
    return Array.prototype.slice.call(arr)
  }}
})();
WebAgent.namespace("WebAgent.util");
(function() {
  WebAgent.util.Date = {getElapsed:function(date1, date2) {
    date2 = date2 || new Date;
    return date2.getTime() - date1.getTime()
  }}
})();
WebAgent.namespace("WebAgent.util");
(function() {
  var WA = WebAgent;
  WA.util.DelayedTask = WA.extend(Object, {constructor:function(config) {
    WA.apply(this, config);
    this.id = null;
    if(this.fn) {
      this._initFn(this.fn, this.scope)
    }
  }, _initFn:function(fn, scope) {
    this.scope = scope || this.scope || this;
    this.fn = WA.createDelegate(fn, this.scope)
  }, isStarted:function() {
    return this.id != null
  }, start:function(interval, fn, scope) {
    if(this.isStarted()) {
      this.stop()
    }
    if(interval > 0) {
      this.interval = interval
    }
    if(fn) {
      this._initFn(fn, scope)
    }
    this.id = WA.setTimeout(this.fn, this.interval)
  }, startNow:function() {
    this.fn();
    this.start.apply(this, arguments)
  }, stop:function() {
    if(this.isStarted()) {
      clearTimeout(this.id);
      this.id = null
    }
  }})
})();
WebAgent.namespace("WebAgent.util");
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var tableRe = /^(?:table|tbody|tr|td)$/i;
  var tableElRe = /^(?:td|tr|tbody)$/i;
  var emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)/i;
  var tempTableEl = null;
  var afterbegin = "afterbegin", afterend = "afterend", beforebegin = "beforebegin", beforeend = "beforeend", ts = "<table>", te = "</table>", tbs = ts + "<tbody>", tbe = "</tbody>" + te, trs = tbs + "<tr>", tre = "</tr>" + tbe;
  function ieTable(depth, s, h, e) {
    tempTableEl.innerHTML = [s, h, e].join("");
    var i = -1;
    var el = tempTableEl;
    var ns;
    while(++i < depth) {
      el = el.firstChild
    }
    if(ns = el.nextSibling) {
      var df = document.createDocumentFragment();
      while(el) {
        ns = el.nextSibling;
        df.appendChild(el);
        el = ns
      }
      el = df
    }
    return el
  }
  function insertIntoTable(tag, where, el, html) {
    var node, before;
    tempTableEl = tempTableEl || document.createElement("div");
    if(tag == "td" && (where == afterbegin || where == beforeend) || !tableRe.test(tag) && (where == beforebegin || where == afterend)) {
      return null
    }
    before = where == beforebegin ? el : where == afterend ? el.nextSibling : where == afterbegin ? el.firstChild : null;
    if(where == beforebegin || where == afterend) {
      el = el.parentNode
    }
    if(tag == "td" || tag == "tr" && (where == beforeend || where == afterbegin)) {
      node = ieTable(4, trs, html, tre)
    }else {
      if(tag == "tbody" && (where == beforeend || where == afterbegin) || tag == "tr" && (where == beforebegin || where == afterend)) {
        node = ieTable(3, tbs, html, tbe)
      }else {
        node = ieTable(2, ts, html, te)
      }
    }
    el.insertBefore(node, before);
    return node
  }
  function createHtml(o) {
    var html = "";
    if(WA.isString(o)) {
      html = o
    }else {
      if(WA.isArray(o)) {
        U.Array.each(o, function(entry) {
          html += createHtml(entry)
        })
      }else {
        var tag = o.tag || "div";
        html = "<" + tag;
        var attrs = [];
        U.Object.each(o, function(val, attr) {
          if(U.Array.indexOf(["tag", "children", "html"], attr) == -1) {
            attrs.push(("cls" === attr ? "class" : attr) + '="' + val + '"')
          }
        });
        if(attrs.length > 0) {
          html += " " + attrs.join(" ")
        }
        if(emptyTags.test(tag)) {
          html += "/>"
        }else {
          html += ">";
          if(o.children) {
            html += createHtml(o.children)
          }else {
            if(o.html) {
              html += o.html
            }
          }
          html += "</" + tag + ">"
        }
      }
    }
    return html
  }
  var DH = U.DomHelper = {elementFromHtml:function(html) {
    var dummyNode, ret;
    dummyNode = document.getElementById("dummy-node");
    if(!dummyNode) {
      dummyNode = document.createElement("div");
      dummyNode.id = "dummy-node";
      dummyNode.style.display = "none";
      document.body.appendChild(dummyNode)
    }
    dummyNode.innerHTML = html;
    ret = dummyNode.getElementsByTagName("*")[0];
    return ret
  }, append:function(el, html, returnElement) {
    return DH.insertHtml("beforeEnd", el, html, returnElement)
  }, insertHtml:function(where, el, html, returnElement) {
    var hash = {}, hashVal, setStart, range, frag, rangeEl, rs;
    where = where.toLowerCase();
    html = createHtml(html);
    hash[beforebegin] = ["BeforeBegin", "previousSibling"];
    hash[afterend] = ["AfterEnd", "nextSibling"];
    if(el.insertAdjacentHTML) {
      if(tableRe.test(el.tagName) && (rs = insertIntoTable(el.tagName.toLowerCase(), where, el, html))) {
        return returnElement ? WA.get(rs) : rs
      }
      hash[afterbegin] = ["AfterBegin", "firstChild"];
      hash[beforeend] = ["BeforeEnd", "lastChild"];
      if(hashVal = hash[where]) {
        el.insertAdjacentHTML(hashVal[0], html);
        rs = el[hashVal[1]];
        return returnElement ? WA.get(rs) : rs
      }
    }else {
      range = el.ownerDocument.createRange();
      setStart = "setStart" + (/end/i.test(where) ? "After" : "Before");
      if(hash[where]) {
        range[setStart](el);
        frag = range.createContextualFragment(html);
        el.parentNode.insertBefore(frag, where == beforebegin ? el : el.nextSibling);
        rs = el[(where == beforebegin ? "previous" : "next") + "Sibling"];
        return returnElement ? WA.get(rs) : rs
      }else {
        rangeEl = (where == afterbegin ? "first" : "last") + "Child";
        if(el.firstChild) {
          range[setStart](el[rangeEl]);
          frag = range.createContextualFragment(html);
          if(where == afterbegin) {
            el.insertBefore(frag, el.firstChild)
          }else {
            el.appendChild(frag)
          }
        }else {
          el.innerHTML = html
        }
        rs = el[rangeEl];
        return returnElement ? WA.get(rs) : rs
      }
    }
    WA.error('Illegal insertion point -> "' + where + '"')
  }, whenReady:function(fn, scope) {
    easyXDM.whenReady(fn, scope)
  }, insertFirst:function(el, html) {
    var before;
    if(el && el.getElementsByTagName && (before = el.getElementsByTagName("*")[0])) {
      el.insertBefore(document.createElement("div"), before).innerHTML = createHtml(html)
    }
  }, rapidHtmlInsert:function(html) {
    var before = document.body.getElementsByTagName("*")[0];
    if(document.body && before) {
      document.body.insertBefore(document.createElement("div"), before).innerHTML = createHtml(html)
    }else {
      WA.setTimeout(function() {
        DH.rapidHtmlInsert(html)
      }, 10)
    }
  }, testUrlAsImage:function(url, clbk, scope) {
    var img = new Image;
    typeof clbk == "function" || (clbk = function() {
    });
    scope || (scope = window);
    var on, off;
    if(typeof img.addEventListener == "function") {
      on = function(t, cb) {
        img.addEventListener(t, cb)
      };
      off = function(t, cb) {
        img.removeEventListener(t, cb)
      }
    }else {
      if(img.attachEvent) {
        on = function(t, cb) {
          img.attachEvent("on" + t, cb)
        };
        off = function(t, cb) {
          img.detachEvent("on" + t, cb)
        }
      }else {
        on = function(t, cb) {
          img["on" + t] = cb
        };
        off = function(t, cb) {
          img["on" + t] = undefined
        }
      }
    }
    function Off() {
      off("error", onError);
      off("load", onLoad)
    }
    function onError() {
      Off();
      clbk.call(scope, url, false, img)
    }
    function onLoad() {
      Off();
      if(typeof img.naturalWidth != "undefined") {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight
      }
      clbk.call(scope, url, true, img)
    }
    on("error", onError);
    on("load", onLoad);
    img.src = url;
    return img
  }, htmlEntities:function(str) {
    return(str || "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  }, htmlTree:function(el, cb) {
    var el = el || document.getElementsByTagName("body")[0], child;
    if(el.hasChildNodes()) {
      child = el.firstChild;
      while(child) {
        if(child.nodeType === 1) {
          DH.htmlTree(child, cb);
          cb(child)
        }
        child = child.nextSibling
      }
    }
    return el
  }, getWindowSize:function() {
    var winW, winH;
    if(document.body && document.body.offsetWidth) {
      winW = document.body.offsetWidth;
      winH = document.body.offsetHeight
    }
    if(document.compatMode == "CSS1Compat" && document.documentElement && document.documentElement.offsetWidth) {
      winW = document.documentElement.offsetWidth;
      winH = document.documentElement.offsetHeight
    }
    if(window.innerWidth && window.innerHeight) {
      winW = window.innerWidth;
      winH = window.innerHeight
    }
    return{width:winW, height:winH}
  }}
})();
WebAgent.namespace("WebAgent.util");
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var BaseListener = WA.extend(Object, {constructor:function(fn, scope) {
    this.fn = fn;
    this.scope = scope
  }, equals:function(fn, scope) {
    if(this.fn === fn) {
      if(scope) {
        if(this.scope === scope) {
          return true
        }
      }else {
        return true
      }
    }
  }, invoke:function(args) {
    if(this.fn) {
      return this.fn.apply(this.scope || window, args)
    }
  }, destroy:function() {
    delete this.fn;
    delete this.scope
  }});
  var SingleListener = WA.extend(BaseListener, {constructor:function(fn, scope, owner) {
    SingleListener.superclass.constructor.call(this, fn, scope);
    this.owner = owner
  }, invoke:function(args) {
    var ret = SingleListener.superclass.invoke.call(this, args);
    this.owner.removeListener(this.fn, this.scope);
    return ret
  }, destroy:function() {
    SingleListener.superclass.destroy.call(this);
    delete this.owner
  }});
  U.Event = WA.extend(Object, {constructor:function() {
    this.suspended = false;
    this.listeners = []
  }, hasListeners:function() {
    return this.listeners.length > 0
  }, addListener:function(fn, scope, options) {
    options = options || {};
    var listener = null;
    if(options.single === true) {
      listener = new SingleListener(fn, scope, this)
    }else {
      listener = new BaseListener(fn, scope)
    }
    this.listeners.push(listener);
    return this
  }, on:function(fn, scope, options) {
    return this.addListener(fn, scope, options)
  }, findListener:function(fn, scope) {
    return U.Array.indexOfBy(this.listeners, function(listener) {
      return listener.equals(fn, scope)
    })
  }, removeListener:function(fn, scope) {
    var index = this.findListener(fn, scope);
    if(index != -1) {
      var listener = this.listeners[index];
      listener.destroy();
      if(this.firing) {
        this.__listeners = this.listeners.slice(0)
      }
      this.listeners.splice(index, 1)
    }
    return this
  }, un:function(fn, scope) {
    return this.removeListener(fn, scope)
  }, fire:function() {
    var ret = true;
    if(!this.suspended) {
      var args = arguments;
      this.firing = true;
      var listeners = this.listeners.slice(0);
      U.Array.each(listeners, function(listener, i) {
        if(listener.invoke(args) === false) {
          return ret = false
        }
      }, this);
      this.firing = false;
      if(this._needRemoveAll) {
        delete this._needRemoveAll;
        this.removeAll()
      }
    }
    return ret
  }, removeAll:function() {
    if(!this.firing) {
      while(this.listeners.length > 0) {
        var listener = this.listeners.shift();
        listener.destroy()
      }
    }else {
      this._needRemoveAll = true
    }
  }, relay:function(event) {
    event.on(function() {
      return this.fire.apply(this, arguments)
    }, this);
    return this
  }, suspend:function() {
    this.suspended = true
  }, resume:function() {
    this.suspended = false
  }});
  WA.afterFirstExecEvent = new U.Event
})();
WebAgent.namespace("WebAgent.util");
(function() {
  var WA = WebAgent;
  var U = WA.util;
  U.EventConfirm = WA.extend(U.Event, {fire:function() {
    var ret = true;
    if(!this.suspended) {
      this.firing = true;
      var args = Array.prototype.slice.call(arguments, 0);
      var readyCb = args.shift();
      if(readyCb && readyCb.success) {
        readyCb = WA.createDelegate(readyCb.success, readyCb.scope || window)
      }
      var confirmCount = 0;
      var checkReady = function() {
        if(confirmCount == 0) {
          readyCb && readyCb()
        }
      };
      args.push(function() {
        confirmCount--;
        checkReady()
      });
      var listeners = this.listeners.slice(0);
      U.Array.each(listeners, function(listener, i) {
        var r = listener.invoke(args);
        if(r === false) {
          return ret = false
        }else {
          if(r === true) {
            confirmCount++
          }
        }
      }, this);
      checkReady();
      this.firing = false
    }
    return ret
  }})
})();
WebAgent.namespace("WebAgent.util");
(function() {
  var WA = WebAgent;
  var U = WA.util;
  U.EventDispatcher = WA.extend(Object, {constructor:function() {
    this._listeners = {}
  }, addEventListener:function(type, cb) {
    if(!this._listeners[type]) {
      this._listeners[type] = []
    }
    this._listeners[type].push(cb)
  }, dispatchEvent:function(type, event) {
    if(this["on" + type]) {
      this["on" + type](event)
    }
    var listeners = this._listeners[type];
    if(listeners) {
      for(var i = 0;i < listeners.length;i++) {
        listeners[i].call(window, event)
      }
    }
  }, removeEventListener:function(type, cb) {
    var listeners = this._listeners[type];
    if(listeners) {
      var res = [];
      for(var i = 0;i < listeners.length;i++) {
        if(listeners[i] !== cb) {
          res.push(listeners[i])
        }
      }
      this._listeners[type] = res
    }
  }, destroy:function() {
  }})
})();
WebAgent.namespace("WebAgent.util");
(function() {
  var WA = WebAgent;
  var srcChar = "qwertyuiopasdfghjklzxcvbnm[{]};:',<.> йцукенгшщзхъфывапролджэячсмитьбю";
  var mapChar = "йцукенгшщзфывапролдячсмитьххъъжжэббюю qwertyuiop[]asdfghjkl;'zxcvbnm,.";
  var delimPos = 37;
  WA.util.KeyMapping = {translate:function(word) {
    var alterWord = "", len = 0, lang = null, pos = -1, nextChar = "", i = 0;
    word = (word || "").toLowerCase();
    len = word.length;
    while(i < len) {
      nextChar = word[i++];
      pos = srcChar.indexOf(nextChar);
      if(!lang) {
        if(pos > -1 && pos < delimPos) {
          lang = "en"
        }else {
          if(pos > delimPos) {
            lang = "ru"
          }
        }
      }
      if(lang == "ru" && pos > delimPos || lang == "en" && pos < delimPos && pos > -1) {
        nextChar = mapChar[pos]
      }
      alterWord += nextChar
    }
    return alterWord
  }}
})();
WebAgent.namespace("WebAgent.util");
(function() {
  var WA = WebAgent;
  var U = WA.util;
  if(window.mailru && mailru.notificationLocker) {
    var notifyLocker = mailru.notificationLocker()
  }
  if(!notifyLocker) {
    notifyLocker = {_locked:false, isLocked:function() {
      return this._locked
    }, setLock:function() {
      this._locked = true
    }, onUnLock:function() {
      this._locked = false
    }}
  }
  U.MailApi = {getFlag:function(index, cb, scope) {
    if(window.mailru && mailru.HelperStatus) {
      cb.call(scope || window, !!(mailru.HelperStatus & 1 << index));
      return
    }
    this.getUser(function(user) {
      var flag = !!(user.helper.status & 1 << index);
      cb.call(scope || window, flag)
    }, this)
  }, getFlagTime:function(index, cb, scope) {
    if(window.mailru && mailru.HelperTimestamp) {
      cb.call(scope || window, mailru.HelperTimestamp[index]);
      return
    }
    this.getUser(function(user) {
      cb.call(scope || window, user.helper.time[index])
    }, this)
  }, getUser:function(cb, scope) {
    if(window.mailru && mailru.HelperTimestamp && mailru.HelperStatus) {
      var data = {helper:{}};
      data.helper.status = mailru.HelperStatus;
      data.helper.time = mailru.HelperTimestamp;
      data.reg_date = mailru.RegTime;
      cb.call(scope || window, data);
      return
    }
    this._getToken(function(token) {
      this._request("user", {token:token}, function(err, data) {
        if(!err) {
          cb.call(scope || window, data)
        }
      }, this)
    }, this)
  }, setFlag:function(index, cb, scope) {
    this._getToken(function(token) {
      this._request("helper/set", {token:token, index:index}, cb, scope)
    }, this)
  }, unsetFlag:function(index, cb, scope) {
    this._getToken(function(token) {
      this._request("helper/unset", {token:token, index:index}, cb, scope)
    }, this)
  }, updateFlagTime:function(index, cb, scope) {
    this._getToken(function(token) {
      this._request("helper/set/timestamp", {token:token, index:index}, cb, scope)
    }, this)
  }, _getToken:function(cb, scope) {
    this._request("tokens", {}, function(err, data) {
      if(!err) {
        cb.call(scope || window, data.token)
      }
    }, this)
  }, _request:function(method, params, cb, scope, timeout) {
    if(timeout) {
      var tmr = WA.setTimeout(function() {
        cb.call(scope || window, "timeout")
      }, timeout, this)
    }
    params || (params = {});
    params.email = WA.ACTIVE_MAIL;
    WA.conn.Socket.send("api/v1/" + method, params, function(success, response) {
      clearTimeout(tmr);
      var data = response && response.data && WA.getJSON().parse(response.data);
      if(!data || !data.status) {
        cb && cb.call(this, "unknown")
      }else {
        if(data.status != 200) {
          cb && cb.call(this, data.status)
        }else {
          cb && cb.call(this, false, data.body)
        }
      }
    }, scope)
  }, lockNotify:function() {
    if(!notifyLocker.isLocked()) {
      notifyLocker.setLock(true);
      return true
    }else {
      return false
    }
  }, unlockNotify:function() {
    notifyLocker.isLocked() && notifyLocker.setLock(false)
  }}
})();
WebAgent.namespace("WebAgent.util");
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var JSON = WA.getJSON();
  var M = WA.extend(Object, {constructor:function() {
  }, log:function(params) {
    try {
      if(typeof params == "object") {
        params = WA.makeGet(params)
      }
    }catch(e) {
    }
    (new Image).src = "//mrilog.mail.ru/empty.gif?" + params + "&WALOG&resPath=" + WebAgent.resPath + "&location=" + document.location + "&rnd=" + Math.random()
  }, errorReason:function(msg, cb, scope) {
    this._errorReason = msg;
    cb.call(scope || window);
    delete this._errorReason
  }, wrapTryCatch:function(cb, scope) {
    if(WA.isProduction) {
      try {
        cb.call(scope || window)
      }catch(e) {
        try {
          if(!("message" in e)) {
            try {
              e = {message:JSON.stringify(e)}
            }catch(nope) {
            }
          }
        }catch(nope) {
          e = {message:"" + e}
        }
        try {
          this.err("js");
          var stack = e.stack;
          if(!stack) {
            stack = e.fileName + ":" + (e.line || e.lineNumber)
          }
          err = ["login=" + encodeURIComponent(WA.ACTIVE_MAIL), "message=" + encodeURIComponent(e.description || JSON.stringify(e.message)), "stack=" + encodeURIComponent(stack)];
          if(this._errorReason) {
            err.push("reason=" + encodeURIComponent(this._errorReason))
          }
          this.log(err.join("&"))
        }catch(e) {
          this.log("error on stringify error: " + e)
        }
      }
    }else {
      cb.call(scope || window)
    }
  }, err:function(type) {
    (new Image).src = "//waerr.radar.imgsmail.ru/update?p=waerr&t=" + type + "&v=1&rnd=" + Math.random()
  }, _intData:{}, interval:function(type, name, timeout) {
    var now = +new Date;
    if(!this._intData[type]) {
      this._intData[type] = {start:now, list:{}};
      if(timeout) {
        this._intData[type].timeout = WA.setTimeout(function() {
          this.flushInterval(type, true)
        }, timeout, this)
      }
    }
    if(type) {
      var list = this._intData[type].list;
      if(!list[name]) {
        list[name] = {ts:now}
      }else {
        list[name].i = now - list[name].ts
      }
    }
  }, stopInterval:function(type) {
    clearTimeout(this._intData[type].timeout);
    delete this._intData[type]
  }, flushInterval:function(type, noCloseIntervals) {
    var now = +new Date;
    var parts = [];
    var interval = this._intData[type];
    if(interval) {
      var value = now - interval.start;
      U.Object.each(interval.list, function(part, name) {
        if(!("i" in part) && !noCloseIntervals) {
          part.i = now - part.ts
        }
        if("i" in part) {
          parts.push(name + ":" + part.i)
        }
      }, this);
      (new Image).src = "//wa.radar.imgsmail.ru/update?p=wa&t=" + type + "&v=" + value + "&i=" + parts.join(";") + "&rnd=" + Math.random();
      this.stopInterval(type)
    }
  }, rbCountOpen:function() {
    this.countRB(706711)
  }, rbCountAction:function() {
    this.countRB(706784)
  }, rbCountSubmitDomain:function() {
    var id = {"otvet":"790314", "webagent":"726182", "e":"726182", "my":"726184", "foto":"726184", "video":"726184", "news":"726185", "maps":"726193", "pogoda":"827834", "health":"827835"}[location.host.split(".")[0]];
    if(id) {
      this.countRB(id)
    }
  }, countRB:function(id) {
    var url = "//rs.mail.ru/d" + id + ".gif";
    WA.setTimeout(function() {
      (new Image).src = url + "?rnd=" + Math.random()
    }, 0)
  }});
  U.Mnt = new M
})();
WebAgent.namespace("WebAgent.util");
(function() {
  var O = WebAgent.util.Object = {each:function(obj, fn, scope) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        if(fn.call(scope || window, obj[key], key) === false) {
          return
        }
      }
    }
  }, filter:function(obj, fn, scope) {
    var ret = {};
    this.each(obj, function(val, key) {
      if(fn.call(scope || window, val, key)) {
        ret[key] = val
      }
    }, scope);
    return ret
  }, getLength:function(obj) {
    var ret = 0;
    this.each(obj, function() {
      ret++
    });
    return ret
  }, pair:function(key, value) {
    var o = {};
    o[key] = value;
    return o
  }, getKeys:function(obj) {
    var keys = [];
    O.each(obj, function(ignored, key) {
      keys.push(key)
    });
    return keys
  }, checkChain:function(obj, propChain, propDefVal, resultRef) {
    resultRef || (resultRef = []);
    propDefVal || (propDefVal = {});
    var existChain = [];
    for(var i = 0;i < propChain.length;i++) {
      var prop = propChain[i];
      existChain.push(prop);
      if(obj && !(prop in obj) && prop in propDefVal) {
        obj[prop] = propDefVal[prop]
      }
      if(!obj || !(prop in obj)) {
        resultRef.push({result:false, chain:existChain});
        return false
      }else {
        obj = obj[prop]
      }
    }
    resultRef.push({result:true, value:obj});
    return true
  }, diff:function(oldHash, newHash) {
    var res = {}, isDiff = false;
    this.each(newHash, function(value, key) {
      if(oldHash[key] != value) {
        res[key] = value;
        isDiff = true
      }
    });
    return isDiff ? res : false
  }, extend:function(dest, source) {
    for(var key in source) {
      dest[key] = source[key]
    }
    return dest
  }}
})();
WebAgent.namespace("WebAgent.util");
(function() {
  var WA = WebAgent, U = WA.util, ELEMENT_NODE = 1, TEXT_NODE = 3;
  var S = WebAgent.util.Selection = {getSelection:function() {
    var ret = null;
    try {
      ret = window.getSelection ? window.getSelection() : WebAgent.util.rangy.getSelection()
    }catch(e) {
    }
    return ret
  }, createRange:function() {
    return document.createRange ? document.createRange() : WebAgent.util.rangy.createRange()
  }, isCaretAtEnd:function(elem) {
  }, getNodeBeforeCaret:function() {
    var sel = this.getSelection(), ret = null;
    if(sel.anchorNode) {
      if(sel.anchorNode.nodeType === ELEMENT_NODE && sel.anchorNode.childNodes.length) {
        if(sel.anchorOffset > 0) {
          ret = sel.anchorNode.childNodes[sel.anchorOffset - 1]
        }else {
          if(sel.anchorNode.previousSibling) {
            ret = sel.anchorNode.previousSibling
          }
        }
      }else {
        if(sel.anchorNode && sel.anchorNode.nodeType === TEXT_NODE && sel.anchorOffset === 0) {
          ret = sel.anchorNode.previousSibling
        }
      }
    }
    if(ret && ret.nodeType === TEXT_NODE && ret.data === "") {
      ret = ret.previousSibling
    }
    return ret
  }, isFocused:function(node) {
    var ret = false;
    try {
      var selAnchorNode = this.getSelection().anchorNode;
      if(selAnchorNode && (selAnchorNode == node || WA.fly(selAnchorNode).isAncestor(node))) {
        ret = true
      }
    }catch(e) {
    }
    return ret
  }}
})();
WebAgent.namespace("WebAgent.util");
(function() {
  var S = WebAgent.util.String = {format:function() {
    var args = WebAgent.toArray(arguments);
    var format = args.shift();
    return format.replace(/\{(\d+)\}/g, function(ignored, i) {
      return args[i]
    })
  }, capitalize:function(value) {
    return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase()
  }, parseTemplate:function(template, data) {
    return template.replace(/\{([^\}]+)\}/g, function(ignored, p) {
      return data[p]
    })
  }, pluralize:function(num, zero, one, two) {
    return num % 10 == 1 && num % 100 !== 11 ? one : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? two : zero
  }, htmlEntity:function(text) {
    return("" + text || "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  }, entityDecode:function(text) {
    return(text || "").replace(/&lt;/ig, "<").replace(/&gt;/ig, ">").replace(/&quot;/ig, '"').replace(/&nbsp;/ig, " ")
  }, stripHtmlEntity:function(text) {
    return(text || "").replace(/&\w+|#\d+;/, "")
  }, ellipsis:function(str, len) {
    if(str.length > len) {
      return str.substr(0, len - 3) + "..."
    }else {
      return str
    }
  }, formatPhone:function(tel) {
    var SEPARATE_COUNTRY_CODE = false;
    if(typeof tel === "string") {
      tel = tel.replace(/\D+/g, "");
      if(tel.length > 3) {
        var country = "017".indexOf(tel.substr(0, 1)) > -1 ? 1 : 2;
        if(tel.substr(0, 1) == "7") {
          tel = "+7 (" + tel.substr(1, 3) + ") " + tel.substr(4)
        }else {
          if(SEPARATE_COUNTRY_CODE) {
            tel = "+" + tel.substr(0, country) + " " + tel.substr(country)
          }else {
            tel = "+" + tel
          }
        }
      }
    }
    return tel
  }, formatDate:function(ts) {
    var tso = new Date;
    var midnight = tso - 36E5 * tso.getHours() - 6E4 * tso.getMinutes() - 1E3 * tso.getSeconds();
    tso = new Date(ts - 0);
    var msg_date = tso.toLocaleTimeString().replace(/:\d\d(\sgmt.*)?$/i, "");
    if(midnight > tso.valueOf()) {
      var splitter = ".";
      var den = tso.getDate();
      var mes = tso.getMonth() + 1;
      mes += "";
      if(mes.length == 1) {
        mes = "0" + mes
      }
      var god = tso.getYear() + "";
      god = god.slice(1, 3);
      msg_date = den + splitter + mes + splitter + god + " " + msg_date
    }
    return msg_date
  }, quote:function() {
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {"\b":"\\b", "\t":"\\t", "\n":"\\n", "\f":"\\f", "\r":"\\r", '"':'\\"', "\\":"\\\\"}, rep;
    return function(string) {
      escapable.lastIndex = 0;
      return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
        var c = meta[a];
        return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
      }) + '"' : '"' + string + '"'
    }
  }(), trim:function(str) {
    return str.replace(/^\s+|\s+$/g, "")
  }, rsplit:function(str, delimiter, limit) {
    var chunks = str.split(delimiter), ret = [];
    ret.push(chunks.slice(0, chunks.length - limit).join(delimiter));
    ret = ret.concat(chunks.slice(chunks.length - limit));
    return ret
  }, rindexOf:function(str, needle) {
    var length = str.length, reversed = str.split("").reverse().join(""), index = reversed.indexOf(needle);
    if(index == -1) {
      return-1
    }
    return length - index
  }}
})();
WebAgent.namespace("WebAgent.util");
(function() {
  if("getSelection" in window) {
    return
  }
  var initRangy = function() {
    var rangy;
    rangy = WebAgent.util.rangy = function() {
      function h(c, d) {
        var e = typeof c[d];
        return e == b || e == a && !!c[d] || e == "unknown"
      }
      function i(b, c) {
        return typeof b[c] == a && !!b[c]
      }
      function j(a, b) {
        return typeof a[b] != c
      }
      function k(a) {
        return function(b, c) {
          var d = c.length;
          while(d--) {
            if(!a(b, c[d])) {
              return!1
            }
          }
          return!0
        }
      }
      function o(a) {
        return a && l(a, g) && n(a, f)
      }
      function q(a, b) {
        b ? window.alert(a) : typeof window.console != c && typeof window.console.log != c && window.console.log(a)
      }
      function r(a) {
        p.initialized = !0, p.supported = !1, q("Rangy is not supported on this page in your browser. Reason: " + a, p.config.alertOnFail)
      }
      function s(a) {
        q("Rangy warning: " + a, p.config.alertOnWarn)
      }
      function v() {
        if(p.initialized) {
          return
        }
        var a, b = !1, c = !1;
        h(document, "createRange") && (a = document.createRange(), l(a, e) && n(a, d) && (b = !0), a.detach());
        var f = i(document, "body") ? document.body : document.getElementsByTagName("body")[0];
        if(!f || f.nodeName.toLowerCase() != "body") {
          r("No body element found");
          return
        }
        f && h(f, "createTextRange") && (a = f.createTextRange(), o(a) && (c = !0));
        if(!b && !c) {
          r("Neither Range nor TextRange are available");
          return
        }
        p.initialized = !0, p.features = {implementsDomRange:b, implementsTextRange:c};
        var g = u.concat(t);
        for(var j = 0, k = g.length;j < k;++j) {
          try {
            g[j](p)
          }catch(m) {
            i(window, "console") && h(window.console, "log") && window.console.log("Rangy init listener threw an exception. Continuing.", m)
          }
        }
      }
      function x(a) {
        a = a || window, v();
        for(var b = 0, c = w.length;b < c;++b) {
          w[b](a)
        }
      }
      function y(a) {
        this.name = a, this.initialized = !1, this.supported = !1
      }
      var a = "object", b = "function", c = "undefined", d = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed", "commonAncestorContainer"], e = ["setStart", "setStartBefore", "setStartAfter", "setEnd", "setEndBefore", "setEndAfter", "collapse", "selectNode", "selectNodeContents", "compareBoundaryPoints", "deleteContents", "extractContents", "cloneContents", "insertNode", "surroundContents", "cloneRange", "toString", "detach"], f = ["boundingHeight", "boundingLeft", "boundingTop", 
      "boundingWidth", "htmlText", "text"], g = ["collapse", "compareEndPoints", "duplicate", "moveToElementText", "parentElement", "select", "setEndPoint", "getBoundingClientRect"], l = k(h), m = k(i), n = k(j), p = {version:"1.3alpha.681", initialized:!1, supported:!0, util:{isHostMethod:h, isHostObject:i, isHostProperty:j, areHostMethods:l, areHostObjects:m, areHostProperties:n, isTextRange:o}, features:{}, modules:{}, config:{alertOnFail:!0, alertOnWarn:!1, preferTextRange:!1}};
      p.fail = r, p.warn = s, {}.hasOwnProperty ? p.util.extend = function(a, b, c) {
        var d, e;
        for(var f in b) {
          b.hasOwnProperty(f) && (d = a[f], e = b[f], c && d !== null && typeof d == "object" && e !== null && typeof e == "object" && p.util.extend(d, e, !0), a[f] = e)
        }
        return a
      } : r("hasOwnProperty not supported");
      var t = [], u = [];
      p.init = v, p.addInitListener = function(a) {
        p.initialized ? a(p) : t.push(a)
      };
      var w = [];
      p.addCreateMissingNativeApiListener = function(a) {
        w.push(a)
      }, p.createMissingNativeApi = x, y.prototype = {fail:function(a) {
        throw this.initialized = !0, this.supported = !1, new Error("Module '" + this.name + "' failed to load: " + a);
      }, warn:function(a) {
        p.warn("Module " + this.name + ": " + a)
      }, deprecationNotice:function(a, b) {
        p.warn("DEPRECATED: " + a + " in module " + this.name + "is deprecated. Please use " + b + " instead")
      }, createError:function(a) {
        return new Error("Error in Rangy " + this.name + " module: " + a)
      }}, p.createModule = function(a, b) {
        var c = new y(a);
        p.modules[a] = c, u.push(function(a) {
          b(a, c), c.initialized = !0, c.supported = !0
        })
      }, p.requireModules = function(a) {
        for(var b = 0, c = a.length, d, e;b < c;++b) {
          e = a[b], d = p.modules[e];
          if(!d || !(d instanceof y)) {
            throw new Error("Module '" + e + "' not found");
          }
          if(!d.supported) {
            throw new Error("Module '" + e + "' not supported");
          }
        }
      };
      var z = !1, A = function(a) {
        z || (z = !0, p.initialized || v())
      };
      if(typeof window == c) {
        r("No window found");
        return
      }
      if(typeof document == c) {
        r("No document found");
        return
      }
      return h(document, "addEventListener") && document.addEventListener("DOMContentLoaded", A, !1), h(window, "addEventListener") ? window.addEventListener("load", A, !1) : h(window, "attachEvent") ? window.attachEvent("onload", A) : r("Window does not have required addEventListener or attachEvent method"), p
    }(), rangy.createModule("DomUtil", function(a, b) {
      function h(a) {
        var b;
        return typeof a.namespaceURI == c || (b = a.namespaceURI) === null || b == "http://www.w3.org/1999/xhtml"
      }
      function i(a) {
        var b = a.parentNode;
        return b.nodeType == 1 ? b : null
      }
      function j(a) {
        var b = 0;
        while(a = a.previousSibling) {
          b++
        }
        return b
      }
      function k(a) {
        switch(a.nodeType) {
          case 7:
          ;
          case 10:
            return 0;
          case 3:
          ;
          case 8:
            return a.length;
          default:
            return a.childNodes.length
        }
      }
      function l(a, b) {
        var c = [], d;
        for(d = a;d;d = d.parentNode) {
          c.push(d)
        }
        for(d = b;d;d = d.parentNode) {
          if(g(c, d)) {
            return d
          }
        }
        return null
      }
      function m(a, b, c) {
        var d = c ? b : b.parentNode;
        while(d) {
          if(d === a) {
            return!0
          }
          d = d.parentNode
        }
        return!1
      }
      function n(a, b) {
        return m(a, b, !0)
      }
      function o(a, b, c) {
        var d, e = c ? a : a.parentNode;
        while(e) {
          d = e.parentNode;
          if(d === b) {
            return e
          }
          e = d
        }
        return null
      }
      function p(a) {
        var b = a.nodeType;
        return b == 3 || b == 4 || b == 8
      }
      function q(a) {
        if(!a) {
          return!1
        }
        var b = a.nodeType;
        return b == 3 || b == 8
      }
      function r(a, b) {
        var c = b.nextSibling, d = b.parentNode;
        return c ? d.insertBefore(a, c) : d.appendChild(a), a
      }
      function s(a, b, c) {
        var d = a.cloneNode(!1);
        d.deleteData(0, b), a.deleteData(b, a.length - b), r(d, a);
        if(c) {
          for(var e = 0, f;f = c[e++];) {
            f.node == a && f.offset > b ? (f.node = d, f.offset -= b) : f.node == a.parentNode && f.offset > j(a) && ++f.offset
          }
        }
        return d
      }
      function t(a) {
        if(a.nodeType == 9) {
          return a
        }
        if(typeof a.ownerDocument != c) {
          return a.ownerDocument
        }
        if(typeof a.document != c) {
          return a.document
        }
        if(a.parentNode) {
          return t(a.parentNode)
        }
        throw b.createError("getDocument: no document found for node");
      }
      function u(a) {
        var d = t(a);
        if(typeof d.defaultView != c) {
          return d.defaultView
        }
        if(typeof d.parentWindow != c) {
          return d.parentWindow
        }
        throw b.createError("Cannot get a window object for node");
      }
      function v(a) {
        if(typeof a.contentDocument != c) {
          return a.contentDocument
        }
        if(typeof a.contentWindow != c) {
          return a.contentWindow.document
        }
        throw b.createError("getIframeDocument: No Document object found for iframe element");
      }
      function w(a) {
        if(typeof a.contentWindow != c) {
          return a.contentWindow
        }
        if(typeof a.contentDocument != c) {
          return a.contentDocument.defaultView
        }
        throw b.createError("getIframeWindow: No Window object found for iframe element");
      }
      function x(a) {
        return d.isHostObject(a, "body") ? a.body : a.getElementsByTagName("body")[0]
      }
      function y(a) {
        return a && d.isHostMethod(a, "setTimeout") && d.isHostObject(a, "document")
      }
      function z(a) {
        var b;
        return a ? d.isHostProperty(a, "nodeType") ? b = a.nodeType == 1 && a.tagName.toLowerCase() == "iframe" ? v(a) : t(a) : y(a) && (b = a.document) : b = document, b
      }
      function A(a) {
        var b;
        while(b = a.parentNode) {
          a = b
        }
        return a
      }
      function B(a, c, d, e) {
        var f, g, h, i, k;
        if(a == d) {
          return c === e ? 0 : c < e ? -1 : 1
        }
        if(f = o(d, a, !0)) {
          return c <= j(f) ? -1 : 1
        }
        if(f = o(a, d, !0)) {
          return j(f) < e ? -1 : 1
        }
        g = l(a, d), h = a === g ? g : o(a, g, !0), i = d === g ? g : o(d, g, !0);
        if(h === i) {
          throw b.createError("comparePoints got to case 4 and childA and childB are the same!");
        }
        k = g.firstChild;
        while(k) {
          if(k === h) {
            return-1
          }
          if(k === i) {
            return 1
          }
          k = k.nextSibling
        }
      }
      function C(a) {
        if(!a) {
          return"[No node]"
        }
        if(p(a)) {
          return'"' + a.data + '"'
        }
        if(a.nodeType == 1) {
          var b = a.id ? ' id="' + a.id + '"' : "";
          return"<" + a.nodeName + b + ">[" + a.childNodes.length + "]"
        }
        return a.nodeName
      }
      function D(a) {
        var b = t(a).createDocumentFragment(), c;
        while(c = a.firstChild) {
          b.appendChild(c)
        }
        return b
      }
      function E(a) {
        this.root = a, this._next = a
      }
      function F(a) {
        return new E(a)
      }
      function G(a, b) {
        this.node = a, this.offset = b
      }
      function H(a) {
        this.code = this[a], this.codeName = a, this.message = "DOMException: " + this.codeName
      }
      var c = "undefined", d = a.util;
      d.areHostMethods(document, ["createDocumentFragment", "createElement", "createTextNode"]) || b.fail("document missing a Node creation method"), d.isHostMethod(document, "getElementsByTagName") || b.fail("document missing getElementsByTagName method");
      var e = document.createElement("div");
      d.areHostMethods(e, ["insertBefore", "appendChild", "cloneNode"] || !d.areHostObjects(e, ["previousSibling", "nextSibling", "childNodes", "parentNode"])) || b.fail("Incomplete Element implementation"), d.isHostProperty(e, "innerHTML") || b.fail("Element is missing innerHTML property");
      var f = document.createTextNode("test");
      d.areHostMethods(f, ["splitText", "deleteData", "insertData", "appendData", "cloneNode"] || !d.areHostObjects(e, ["previousSibling", "nextSibling", "childNodes", "parentNode"]) || !d.areHostProperties(f, ["data"])) || b.fail("Incomplete Text Node implementation");
      var g = function(a, b) {
        var c = a.length;
        while(c--) {
          if(a[c] === b) {
            return!0
          }
        }
        return!1
      };
      E.prototype = {_current:null, hasNext:function() {
        return!!this._next
      }, next:function() {
        var a = this._current = this._next, b, c;
        if(this._current) {
          b = a.firstChild;
          if(b) {
            this._next = b
          }else {
            c = null;
            while(a !== this.root && !(c = a.nextSibling)) {
              a = a.parentNode
            }
            this._next = c
          }
        }
        return this._current
      }, detach:function() {
        this._current = this._next = this.root = null
      }}, G.prototype = {equals:function(a) {
        return!!a && this.node === a.node && this.offset == a.offset
      }, inspect:function() {
        return"[DomPosition(" + C(this.node) + ":" + this.offset + ")]"
      }, toString:function() {
        return this.inspect()
      }}, H.prototype = {INDEX_SIZE_ERR:1, HIERARCHY_REQUEST_ERR:3, WRONG_DOCUMENT_ERR:4, NO_MODIFICATION_ALLOWED_ERR:7, NOT_FOUND_ERR:8, NOT_SUPPORTED_ERR:9, INVALID_STATE_ERR:11}, H.prototype.toString = function() {
        return this.message
      }, a.dom = {arrayContains:g, isHtmlNamespace:h, parentElement:i, getNodeIndex:j, getNodeLength:k, getCommonAncestor:l, isAncestorOf:m, isOrIsAncestorOf:n, getClosestAncestorIn:o, isCharacterDataNode:p, isTextOrCommentNode:q, insertAfter:r, splitDataNode:s, getDocument:t, getWindow:u, getIframeWindow:w, getIframeDocument:v, getBody:x, isWindow:y, getContentDocument:z, getRootContainer:A, comparePoints:B, inspectNode:C, fragmentFromNodeChildren:D, createIterator:F, DomPosition:G}, a.DOMException = 
      H
    }), rangy.createModule("DomRange", function(a, b) {
      function g(a, b) {
        return a.nodeType != 3 && (c.isOrIsAncestorOf(a, b.startContainer) || c.isOrIsAncestorOf(a, b.endContainer))
      }
      function h(a) {
        return c.getDocument(a.startContainer)
      }
      function i(a) {
        return new e(a.parentNode, c.getNodeIndex(a))
      }
      function j(a) {
        return new e(a.parentNode, c.getNodeIndex(a) + 1)
      }
      function k(a, b, d) {
        var e = a.nodeType == 11 ? a.firstChild : a;
        return c.isCharacterDataNode(b) ? d == b.length ? c.insertAfter(a, b) : b.parentNode.insertBefore(a, d == 0 ? b : c.splitDataNode(b, d)) : d >= b.childNodes.length ? b.appendChild(a) : b.insertBefore(a, b.childNodes[d]), e
      }
      function l(a, b, d) {
        O(a), O(b);
        if(h(b) != h(a)) {
          throw new f("WRONG_DOCUMENT_ERR");
        }
        var e = c.comparePoints(a.startContainer, a.startOffset, b.endContainer, b.endOffset), g = c.comparePoints(a.endContainer, a.endOffset, b.startContainer, b.startOffset);
        return d ? e <= 0 && g >= 0 : e < 0 && g > 0
      }
      function m(a) {
        var b;
        for(var c, d = h(a.range).createDocumentFragment(), e;c = a.next();) {
          b = a.isPartiallySelectedSubtree(), c = c.cloneNode(!b), b && (e = a.getSubtreeIterator(), c.appendChild(m(e)), e.detach(!0));
          if(c.nodeType == 10) {
            throw new f("HIERARCHY_REQUEST_ERR");
          }
          d.appendChild(c)
        }
        return d
      }
      function n(a, b, d) {
        var e, f;
        d = d || {stop:!1};
        for(var g, h;g = a.next();) {
          if(a.isPartiallySelectedSubtree()) {
            if(b(g) === !1) {
              d.stop = !0;
              return
            }
            h = a.getSubtreeIterator(), n(h, b, d), h.detach(!0);
            if(d.stop) {
              return
            }
          }else {
            e = c.createIterator(g);
            while(f = e.next()) {
              if(b(f) === !1) {
                d.stop = !0;
                return
              }
            }
          }
        }
      }
      function o(a) {
        var b;
        while(a.next()) {
          a.isPartiallySelectedSubtree() ? (b = a.getSubtreeIterator(), o(b), b.detach(!0)) : a.remove()
        }
      }
      function p(a) {
        for(var b, c = h(a.range).createDocumentFragment(), d;b = a.next();) {
          a.isPartiallySelectedSubtree() ? (b = b.cloneNode(!1), d = a.getSubtreeIterator(), b.appendChild(p(d)), d.detach(!0)) : a.remove();
          if(b.nodeType == 10) {
            throw new f("HIERARCHY_REQUEST_ERR");
          }
          c.appendChild(b)
        }
        return c
      }
      function q(a, b, c) {
        var d = !!b && !!b.length, e, f = !!c;
        d && (e = new RegExp("^(" + b.join("|") + ")$"));
        var g = [];
        return n(new s(a, !1), function(a) {
          (!d || e.test(a.nodeType)) && (!f || c(a)) && g.push(a)
        }), g
      }
      function r(a) {
        var b = typeof a.getName == "undefined" ? "Range" : a.getName();
        return"[" + b + "(" + c.inspectNode(a.startContainer) + ":" + a.startOffset + ", " + c.inspectNode(a.endContainer) + ":" + a.endOffset + ")]"
      }
      function s(a, b) {
        this.range = a, this.clonePartiallySelectedTextNodes = b;
        if(!a.collapsed) {
          this.sc = a.startContainer, this.so = a.startOffset, this.ec = a.endContainer, this.eo = a.endOffset;
          var d = a.commonAncestorContainer;
          this.sc === this.ec && c.isCharacterDataNode(this.sc) ? (this.isSingleCharacterDataNode = !0, this._first = this._last = this._next = this.sc) : (this._first = this._next = this.sc === d && !c.isCharacterDataNode(this.sc) ? this.sc.childNodes[this.so] : c.getClosestAncestorIn(this.sc, d, !0), this._last = this.ec === d && !c.isCharacterDataNode(this.ec) ? this.ec.childNodes[this.eo - 1] : c.getClosestAncestorIn(this.ec, d, !0))
        }
      }
      function t(a) {
        this.code = this[a], this.codeName = a, this.message = "RangeException: " + this.codeName
      }
      function z(a) {
        return function(b, d) {
          var e, f = d ? b : b.parentNode;
          while(f) {
            e = f.nodeType;
            if(c.arrayContains(a, e)) {
              return f
            }
            f = f.parentNode
          }
          return null
        }
      }
      function E(a, b) {
        if(D(a, b)) {
          throw new t("INVALID_NODE_TYPE_ERR");
        }
      }
      function F(a) {
        if(!a.startContainer) {
          throw new f("INVALID_STATE_ERR");
        }
      }
      function G(a, b) {
        if(!c.arrayContains(b, a.nodeType)) {
          throw new t("INVALID_NODE_TYPE_ERR");
        }
      }
      function H(a, b) {
        if(b < 0 || b > (c.isCharacterDataNode(a) ? a.length : a.childNodes.length)) {
          throw new f("INDEX_SIZE_ERR");
        }
      }
      function I(a, b) {
        if(B(a, !0) !== B(b, !0)) {
          throw new f("WRONG_DOCUMENT_ERR");
        }
      }
      function J(a) {
        if(C(a, !0)) {
          throw new f("NO_MODIFICATION_ALLOWED_ERR");
        }
      }
      function K(a, b) {
        if(!a) {
          throw new f(b);
        }
      }
      function L(a) {
        return!c.arrayContains(v, a.nodeType) && !B(a, !0)
      }
      function M(a, b) {
        return b <= (c.isCharacterDataNode(a) ? a.length : a.childNodes.length)
      }
      function N(a) {
        return!!a.startContainer && !!a.endContainer && !L(a.startContainer) && !L(a.endContainer) && M(a.startContainer, a.startOffset) && M(a.endContainer, a.endOffset)
      }
      function O(a) {
        F(a);
        if(!N(a)) {
          throw new Error("Range error: Range is no longer valid after DOM mutation (" + a.inspect() + ")");
        }
      }
      function T(a, b) {
        O(a);
        var d = a.startContainer, e = a.startOffset, f = a.endContainer, g = a.endOffset, h = d === f;
        c.isCharacterDataNode(f) && g > 0 && g < f.length && c.splitDataNode(f, g, b), c.isCharacterDataNode(d) && e > 0 && e < d.length && (d = c.splitDataNode(d, e, b), h ? (g -= e, f = d) : f == d.parentNode && g >= c.getNodeIndex(d) && g++, e = 0), a.setStartAndEnd(d, e, f, g)
      }
      function bb() {
      }
      function cb(a) {
        a.START_TO_START = V, a.START_TO_END = W, a.END_TO_END = X, a.END_TO_START = Y, a.NODE_BEFORE = Z, a.NODE_AFTER = $, a.NODE_BEFORE_AND_AFTER = _, a.NODE_INSIDE = ab
      }
      function db(a) {
        cb(a), cb(a.prototype)
      }
      function eb(a, b) {
        return function() {
          O(this);
          var d = this.startContainer, e = this.startOffset, f = this.commonAncestorContainer, g = new s(this, !0), h, i;
          d !== f && (h = c.getClosestAncestorIn(d, f, !0), i = j(h), d = i.node, e = i.offset), n(g, J), g.reset();
          var k = a(g);
          return g.detach(), b(this, d, e, d, e), k
        }
      }
      function fb(a, b, e) {
        function f(a, b) {
          return function(c) {
            F(this), G(c, u), G(A(c), v);
            var d = (a ? i : j)(c);
            (b ? h : k)(this, d.node, d.offset)
          }
        }
        function h(a, d, e) {
          var f = a.endContainer, g = a.endOffset;
          if(d !== a.startContainer || e !== a.startOffset) {
            if(A(d) != A(f) || c.comparePoints(d, e, f, g) == 1) {
              f = d, g = e
            }
            b(a, d, e, f, g)
          }
        }
        function k(a, d, e) {
          var f = a.startContainer, g = a.startOffset;
          if(d !== a.endContainer || e !== a.endOffset) {
            if(A(d) != A(f) || c.comparePoints(d, e, f, g) == -1) {
              f = d, g = e
            }
            b(a, f, g, d, e)
          }
        }
        a.prototype = new bb, d.extend(a.prototype, {setStart:function(a, b) {
          F(this), E(a, !0), H(a, b), h(this, a, b)
        }, setEnd:function(a, b) {
          F(this), E(a, !0), H(a, b), k(this, a, b)
        }, setStartAndEnd:function() {
          F(this);
          var a = arguments, c = a[0], d = a[1], e = c, f = d;
          switch(a.length) {
            case 3:
              f = a[2];
              break;
            case 4:
              e = a[2], f = a[3]
          }
          b(this, c, d, e, f)
        }, setStartBefore:f(!0, !0), setStartAfter:f(!1, !0), setEndBefore:f(!0, !1), setEndAfter:f(!1, !1), collapse:function(a) {
          O(this), a ? b(this, this.startContainer, this.startOffset, this.startContainer, this.startOffset) : b(this, this.endContainer, this.endOffset, this.endContainer, this.endOffset)
        }, selectNodeContents:function(a) {
          F(this), E(a, !0), b(this, a, 0, a, c.getNodeLength(a))
        }, selectNode:function(a) {
          F(this), E(a, !1), G(a, u);
          var c = i(a), d = j(a);
          b(this, c.node, c.offset, d.node, d.offset)
        }, extractContents:eb(p, b), deleteContents:eb(o, b), canSurroundContents:function() {
          O(this), J(this.startContainer), J(this.endContainer);
          var a = new s(this, !0), b = a._first && g(a._first, this) || a._last && g(a._last, this);
          return a.detach(), !b
        }, detach:function() {
          e(this)
        }, splitBoundaries:function() {
          T(this)
        }, splitBoundariesPreservingPositions:function(a) {
          T(this, a)
        }, normalizeBoundaries:function() {
          O(this);
          var a = this.startContainer, d = this.startOffset, e = this.endContainer, f = this.endOffset, g = function(a) {
            var b = a.nextSibling;
            b && b.nodeType == a.nodeType && (e = a, f = a.length, a.appendData(b.data), b.parentNode.removeChild(b))
          }, h = function(b) {
            var g = b.previousSibling;
            if(g && g.nodeType == b.nodeType) {
              a = b;
              var h = b.length;
              d = g.length, b.insertData(0, g.data), g.parentNode.removeChild(g);
              if(a == e) {
                f += d, e = a
              }else {
                if(e == b.parentNode) {
                  var i = c.getNodeIndex(b);
                  f == i ? (e = b, f = h) : f > i && f--
                }
              }
            }
          }, i = !0;
          if(c.isCharacterDataNode(e)) {
            e.length == f && g(e)
          }else {
            if(f > 0) {
              var j = e.childNodes[f - 1];
              j && c.isCharacterDataNode(j) && g(j)
            }
            i = !this.collapsed
          }
          if(i) {
            if(c.isCharacterDataNode(a)) {
              d == 0 && h(a)
            }else {
              if(d < a.childNodes.length) {
                var k = a.childNodes[d];
                k && c.isCharacterDataNode(k) && h(k)
              }
            }
          }else {
            a = e, d = f
          }
          b(this, a, d, e, f)
        }, collapseToPoint:function(a, b) {
          F(this), E(a, !0), H(a, b), this.setStartAndEnd(a, b)
        }}), db(a)
      }
      function gb(a) {
        a.collapsed = a.startContainer === a.endContainer && a.startOffset === a.endOffset, a.commonAncestorContainer = a.collapsed ? a.startContainer : c.getCommonAncestor(a.startContainer, a.endContainer)
      }
      function hb(a, b, c, d, e) {
        a.startContainer = b, a.startOffset = c, a.endContainer = d, a.endOffset = e, gb(a)
      }
      function ib(a) {
        F(a), a.startContainer = a.startOffset = a.endContainer = a.endOffset = null, a.collapsed = a.commonAncestorContainer = null
      }
      function jb(a) {
        this.startContainer = a, this.startOffset = 0, this.endContainer = a, this.endOffset = 0, gb(this)
      }
      a.requireModules(["DomUtil"]);
      var c = a.dom, d = a.util, e = c.DomPosition, f = a.DOMException;
      s.prototype = {_current:null, _next:null, _first:null, _last:null, isSingleCharacterDataNode:!1, reset:function() {
        this._current = null, this._next = this._first
      }, hasNext:function() {
        return!!this._next
      }, next:function() {
        var a = this._current = this._next;
        return a && (this._next = a !== this._last ? a.nextSibling : null, c.isCharacterDataNode(a) && this.clonePartiallySelectedTextNodes && (a === this.ec && (a = a.cloneNode(!0)).deleteData(this.eo, a.length - this.eo), this._current === this.sc && (a = a.cloneNode(!0)).deleteData(0, this.so))), a
      }, remove:function() {
        var a = this._current, b, d;
        !c.isCharacterDataNode(a) || a !== this.sc && a !== this.ec ? a.parentNode && a.parentNode.removeChild(a) : (b = a === this.sc ? this.so : 0, d = a === this.ec ? this.eo : a.length, b != d && a.deleteData(b, d - b))
      }, isPartiallySelectedSubtree:function() {
        var a = this._current;
        return g(a, this.range)
      }, getSubtreeIterator:function() {
        var a;
        if(this.isSingleCharacterDataNode) {
          a = this.range.cloneRange(), a.collapse(!1)
        }else {
          a = new jb(h(this.range));
          var b = this._current, d = b, e = 0, f = b, g = c.getNodeLength(b);
          c.isOrIsAncestorOf(b, this.sc) && (d = this.sc, e = this.so), c.isOrIsAncestorOf(b, this.ec) && (f = this.ec, g = this.eo), hb(a, d, e, f, g)
        }
        return new s(a, this.clonePartiallySelectedTextNodes)
      }, detach:function(a) {
        a && this.range.detach(), this.range = this._current = this._next = this._first = this._last = this.sc = this.so = this.ec = this.eo = null
      }}, t.prototype = {BAD_BOUNDARYPOINTS_ERR:1, INVALID_NODE_TYPE_ERR:2}, t.prototype.toString = function() {
        return this.message
      };
      var u = [1, 3, 4, 5, 7, 8, 10], v = [2, 9, 11], w = [5, 6, 10, 12], x = [1, 3, 4, 5, 7, 8, 10, 11], y = [1, 3, 4, 5, 7, 8], A = c.getRootContainer, B = z([9, 11]), C = z(w), D = z([6, 10, 12]), P = document.createElement("style"), Q = !1;
      try {
        P.innerHTML = "<b>x</b>", Q = P.firstChild.nodeType == 3
      }catch(R) {
      }
      a.features.htmlParsingConforms = Q;
      var S = Q ? function(a) {
        var b = this.startContainer, d = c.getDocument(b);
        if(!b) {
          throw new f("INVALID_STATE_ERR");
        }
        var e = null;
        return b.nodeType == 1 ? e = b : c.isCharacterDataNode(b) && (e = c.parentElement(b)), e === null || e.nodeName == "HTML" && c.isHtmlNamespace(c.getDocument(e).documentElement) && c.isHtmlNamespace(e) ? e = d.createElement("body") : e = e.cloneNode(!1), e.innerHTML = a, c.fragmentFromNodeChildren(e)
      } : function(a) {
        F(this);
        var b = h(this), d = b.createElement("body");
        return d.innerHTML = a, c.fragmentFromNodeChildren(d)
      }, U = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed", "commonAncestorContainer"], V = 0, W = 1, X = 2, Y = 3, Z = 0, $ = 1, _ = 2, ab = 3;
      bb.prototype = {compareBoundaryPoints:function(a, b) {
        O(this), I(this.startContainer, b.startContainer);
        var d, e, f, g, h = a == Y || a == V ? "start" : "end", i = a == W || a == V ? "start" : "end";
        return d = this[h + "Container"], e = this[h + "Offset"], f = b[i + "Container"], g = b[i + "Offset"], c.comparePoints(d, e, f, g)
      }, insertNode:function(a) {
        O(this), G(a, x), J(this.startContainer);
        if(c.isOrIsAncestorOf(a, this.startContainer)) {
          throw new f("HIERARCHY_REQUEST_ERR");
        }
        var b = k(a, this.startContainer, this.startOffset);
        this.setStartBefore(b)
      }, cloneContents:function() {
        O(this);
        var a, b;
        if(this.collapsed) {
          return h(this).createDocumentFragment()
        }
        if(this.startContainer === this.endContainer && c.isCharacterDataNode(this.startContainer)) {
          return a = this.startContainer.cloneNode(!0), a.data = a.data.slice(this.startOffset, this.endOffset), b = h(this).createDocumentFragment(), b.appendChild(a), b
        }
        var d = new s(this, !0);
        return a = m(d), d.detach(), a
      }, canSurroundContents:function() {
        O(this), J(this.startContainer), J(this.endContainer);
        var a = new s(this, !0), b = a._first && g(a._first, this) || a._last && g(a._last, this);
        return a.detach(), !b
      }, surroundContents:function(a) {
        G(a, y);
        if(!this.canSurroundContents()) {
          throw new t("BAD_BOUNDARYPOINTS_ERR");
        }
        var b = this.extractContents();
        if(a.hasChildNodes()) {
          while(a.lastChild) {
            a.removeChild(a.lastChild)
          }
        }
        k(a, this.startContainer, this.startOffset), a.appendChild(b), this.selectNode(a)
      }, cloneRange:function() {
        O(this);
        var a = new jb(h(this)), b = U.length, c;
        while(b--) {
          c = U[b], a[c] = this[c]
        }
        return a
      }, toString:function() {
        O(this);
        var a = this.startContainer;
        if(a === this.endContainer && c.isCharacterDataNode(a)) {
          return a.nodeType == 3 || a.nodeType == 4 ? a.data.slice(this.startOffset, this.endOffset) : ""
        }
        var b = [], d = new s(this, !0);
        return n(d, function(a) {
          (a.nodeType == 3 || a.nodeType == 4) && b.push(a.data)
        }), d.detach(), b.join("")
      }, compareNode:function(a) {
        O(this);
        var b = a.parentNode, d = c.getNodeIndex(a);
        if(!b) {
          throw new f("NOT_FOUND_ERR");
        }
        var e = this.comparePoint(b, d), g = this.comparePoint(b, d + 1);
        return e < 0 ? g > 0 ? _ : Z : g > 0 ? $ : ab
      }, comparePoint:function(a, b) {
        return O(this), K(a, "HIERARCHY_REQUEST_ERR"), I(a, this.startContainer), c.comparePoints(a, b, this.startContainer, this.startOffset) < 0 ? -1 : c.comparePoints(a, b, this.endContainer, this.endOffset) > 0 ? 1 : 0
      }, createContextualFragment:S, toHtml:function() {
        O(this);
        var a = this.commonAncestorContainer.parentNode.cloneNode(!1);
        return a.appendChild(this.cloneContents()), a.innerHTML
      }, intersectsNode:function(a, b) {
        O(this), K(a, "NOT_FOUND_ERR");
        if(c.getDocument(a) !== h(this)) {
          return!1
        }
        var d = a.parentNode, e = c.getNodeIndex(a);
        K(d, "NOT_FOUND_ERR");
        var f = c.comparePoints(d, e, this.endContainer, this.endOffset), g = c.comparePoints(d, e + 1, this.startContainer, this.startOffset);
        return b ? f <= 0 && g >= 0 : f < 0 && g > 0
      }, isPointInRange:function(a, b) {
        return O(this), K(a, "HIERARCHY_REQUEST_ERR"), I(a, this.startContainer), c.comparePoints(a, b, this.startContainer, this.startOffset) >= 0 && c.comparePoints(a, b, this.endContainer, this.endOffset) <= 0
      }, intersectsRange:function(a) {
        return l(this, a, !1)
      }, intersectsOrTouchesRange:function(a) {
        return l(this, a, !0)
      }, intersection:function(a) {
        if(this.intersectsRange(a)) {
          var b = c.comparePoints(this.startContainer, this.startOffset, a.startContainer, a.startOffset), d = c.comparePoints(this.endContainer, this.endOffset, a.endContainer, a.endOffset), e = this.cloneRange();
          return b == -1 && e.setStart(a.startContainer, a.startOffset), d == 1 && e.setEnd(a.endContainer, a.endOffset), e
        }
        return null
      }, union:function(a) {
        if(this.intersectsOrTouchesRange(a)) {
          var b = this.cloneRange();
          return c.comparePoints(a.startContainer, a.startOffset, this.startContainer, this.startOffset) == -1 && b.setStart(a.startContainer, a.startOffset), c.comparePoints(a.endContainer, a.endOffset, this.endContainer, this.endOffset) == 1 && b.setEnd(a.endContainer, a.endOffset), b
        }
        throw new t("Ranges do not intersect");
      }, containsNode:function(a, b) {
        return b ? this.intersectsNode(a, !1) : this.compareNode(a) == ab
      }, containsNodeContents:function(a) {
        return this.comparePoint(a, 0) >= 0 && this.comparePoint(a, c.getNodeLength(a)) <= 0
      }, containsRange:function(a) {
        var b = this.intersection(a);
        return b !== null && a.equals(b)
      }, containsNodeText:function(a) {
        var b = this.cloneRange();
        b.selectNode(a);
        var c = b.getNodes([3]);
        if(c.length > 0) {
          b.setStart(c[0], 0);
          var d = c.pop();
          b.setEnd(d, d.length);
          var e = this.containsRange(b);
          return b.detach(), e
        }
        return this.containsNodeContents(a)
      }, getNodes:function(a, b) {
        return O(this), q(this, a, b)
      }, getDocument:function() {
        return h(this)
      }, collapseBefore:function(a) {
        F(this), this.setEndBefore(a), this.collapse(!1)
      }, collapseAfter:function(a) {
        F(this), this.setStartAfter(a), this.collapse(!0)
      }, getName:function() {
        return"DomRange"
      }, equals:function(a) {
        return jb.rangesEqual(this, a)
      }, isValid:function() {
        return N(this)
      }, inspect:function() {
        return r(this)
      }}, fb(jb, hb, ib), a.rangePrototype = bb.prototype, d.extend(jb, {rangeProperties:U, RangeIterator:s, copyComparisonConstants:db, createPrototypeRange:fb, inspect:r, getRangeDocument:h, rangesEqual:function(a, b) {
        return a.startContainer === b.startContainer && a.startOffset === b.startOffset && a.endContainer === b.endContainer && a.endOffset === b.endOffset
      }}), a.DomRange = jb, a.RangeException = t
    }), rangy.createModule("WrappedRange", function(a, b) {
      function h(a, c) {
        a = d.getContentDocument(a);
        if(!a) {
          throw b.createError(c + "(): Parameter must be a Document or other DOM node, or a Window object");
        }
        return a
      }
      function i(a) {
        var b = a.parentElement(), c = a.duplicate();
        c.collapse(!0);
        var e = c.parentElement();
        c = a.duplicate(), c.collapse(!1);
        var f = c.parentElement(), g = e == f ? e : d.getCommonAncestor(e, f);
        return g == b ? g : d.getCommonAncestor(b, g)
      }
      function j(a) {
        return a.compareEndPoints("StartToEnd", a) == 0
      }
      function k(a, b, c, e, g) {
        var h = a.duplicate();
        h.collapse(c);
        var i = h.parentElement();
        d.isOrIsAncestorOf(b, i) || (i = b);
        if(!i.canHaveHTML) {
          return new f(i.parentNode, d.getNodeIndex(i))
        }
        var j = d.getDocument(i).createElement("span");
        j.parentNode && j.parentNode.removeChild(j);
        var k, l = c ? "StartToStart" : "StartToEnd", m, n, o, p, q = g && g.containerElement == i ? g.nodeIndex : 0, r = i.childNodes.length, s = r, t = s;
        for(;;) {
          t == r ? i.appendChild(j) : i.insertBefore(j, i.childNodes[t]), h.moveToElementText(j), k = h.compareEndPoints(l, a);
          if(k == 0 || q == s) {
            break
          }
          if(k == -1) {
            if(s == q + 1) {
              break
            }
            q = t
          }else {
            s = s == q + 1 ? q : t
          }
          t = Math.floor((q + s) / 2), i.removeChild(j)
        }
        p = j.nextSibling;
        if(k == -1 && p && d.isCharacterDataNode(p)) {
          h.setEndPoint(c ? "EndToStart" : "EndToEnd", a);
          var u;
          if(/[\r\n]/.test(p.data)) {
            var v = h.duplicate(), w = v.text.replace(/\r\n/g, "\r").length;
            u = v.moveStart("character", w);
            while((k = v.compareEndPoints("StartToEnd", v)) == -1) {
              u++, v.moveStart("character", 1)
            }
          }else {
            u = h.text.length
          }
          o = new f(p, u)
        }else {
          m = (e || !c) && j.previousSibling, n = (e || c) && j.nextSibling, n && d.isCharacterDataNode(n) ? o = new f(n, 0) : m && d.isCharacterDataNode(m) ? o = new f(m, m.data.length) : o = new f(i, d.getNodeIndex(j))
        }
        return j.parentNode.removeChild(j), {boundaryPosition:o, nodeInfo:{nodeIndex:t, containerElement:i}}
      }
      function l(a, b) {
        var c, e, f = a.offset, g = d.getDocument(a.node), h, i, j = g.body.createTextRange(), k = d.isCharacterDataNode(a.node);
        return k ? (c = a.node, e = c.parentNode) : (i = a.node.childNodes, c = f < i.length ? i[f] : null, e = a.node), h = g.createElement("span"), h.innerHTML = "&#feff;", c ? e.insertBefore(h, c) : e.appendChild(h), j.moveToElementText(h), j.collapse(!b), e.removeChild(h), k && j[b ? "moveStart" : "moveEnd"]("character", f), j
      }
      a.requireModules(["DomUtil", "DomRange"]);
      var c, d = a.dom, e = a.util, f = d.DomPosition, g = a.DomRange;
      if(a.features.implementsDomRange && (!a.features.implementsTextRange || !a.config.preferTextRange)) {
        (function() {
          function h(a) {
            var b = f.length, c;
            while(b--) {
              c = f[b], a[c] = a.nativeRange[c]
            }
            a.collapsed = a.startContainer === a.endContainer && a.startOffset === a.endOffset
          }
          function i(a, b, c, d, e) {
            var f = a.startContainer !== b || a.startOffset != c, g = a.endContainer !== d || a.endOffset != e, h = !a.equals(a.nativeRange);
            if(f || g || h) {
              a.setEnd(d, e), a.setStart(b, c)
            }
          }
          function j(a) {
            a.nativeRange.detach(), a.detached = !0;
            var b = f.length, c;
            while(b--) {
              c = f[b], a[c] = null
            }
          }
          var a, f = g.rangeProperties, k;
          c = function(a) {
            if(!a) {
              throw b.createError("WrappedRange: Range must be specified");
            }
            this.nativeRange = a, h(this)
          }, g.createPrototypeRange(c, i, j), a = c.prototype, a.selectNode = function(a) {
            this.nativeRange.selectNode(a), h(this)
          }, a.cloneContents = function() {
            return this.nativeRange.cloneContents()
          }, a.surroundContents = function(a) {
            this.nativeRange.surroundContents(a), h(this)
          }, a.collapse = function(a) {
            this.nativeRange.collapse(a), h(this)
          }, a.cloneRange = function() {
            return new c(this.nativeRange.cloneRange())
          }, a.refresh = function() {
            h(this)
          }, a.toString = function() {
            return this.nativeRange.toString()
          };
          var l = document.createTextNode("test");
          d.getBody(document).appendChild(l);
          var m = document.createRange();
          m.setStart(l, 0), m.setEnd(l, 0);
          try {
            m.setStart(l, 1), a.setStart = function(a, b) {
              this.nativeRange.setStart(a, b), h(this)
            }, a.setEnd = function(a, b) {
              this.nativeRange.setEnd(a, b), h(this)
            }, k = function(a) {
              return function(b) {
                this.nativeRange[a](b), h(this)
              }
            }
          }catch(n) {
            a.setStart = function(a, b) {
              try {
                this.nativeRange.setStart(a, b)
              }catch(c) {
                this.nativeRange.setEnd(a, b), this.nativeRange.setStart(a, b)
              }
              h(this)
            }, a.setEnd = function(a, b) {
              try {
                this.nativeRange.setEnd(a, b)
              }catch(c) {
                this.nativeRange.setStart(a, b), this.nativeRange.setEnd(a, b)
              }
              h(this)
            }, k = function(a, b) {
              return function(c) {
                try {
                  this.nativeRange[a](c)
                }catch(d) {
                  this.nativeRange[b](c), this.nativeRange[a](c)
                }
                h(this)
              }
            }
          }
          a.setStartBefore = k("setStartBefore", "setEndBefore"), a.setStartAfter = k("setStartAfter", "setEndAfter"), a.setEndBefore = k("setEndBefore", "setStartBefore"), a.setEndAfter = k("setEndAfter", "setStartAfter"), m.selectNodeContents(l), m.startContainer == l && m.endContainer == l && m.startOffset == 0 && m.endOffset == l.length ? a.selectNodeContents = function(a) {
            this.nativeRange.selectNodeContents(a), h(this)
          } : a.selectNodeContents = function(a) {
            this.setStart(a, 0), this.setEnd(a, g.getEndOffset(a))
          }, m.selectNodeContents(l), m.setEnd(l, 3);
          var o = document.createRange();
          o.selectNodeContents(l), o.setEnd(l, 4), o.setStart(l, 2), m.compareBoundaryPoints(m.START_TO_END, o) == -1 && m.compareBoundaryPoints(m.END_TO_START, o) == 1 ? a.compareBoundaryPoints = function(a, b) {
            return b = b.nativeRange || b, a == b.START_TO_END ? a = b.END_TO_START : a == b.END_TO_START && (a = b.START_TO_END), this.nativeRange.compareBoundaryPoints(a, b)
          } : a.compareBoundaryPoints = function(a, b) {
            return this.nativeRange.compareBoundaryPoints(a, b.nativeRange || b)
          };
          var p = document.createElement("div");
          p.innerHTML = "123";
          var q = p.firstChild;
          document.body.appendChild(p), m.setStart(q, 1), m.setEnd(q, 2), m.deleteContents(), q.data == "13" && (a.deleteContents = function() {
            this.nativeRange.deleteContents(), h(this)
          }, a.extractContents = function() {
            var a = this.nativeRange.extractContents();
            return h(this), a
          }), document.body.removeChild(p), e.isHostMethod(m, "createContextualFragment") && (a.createContextualFragment = function(a) {
            return this.nativeRange.createContextualFragment(a)
          }), d.getBody(document).removeChild(l), m.detach(), o.detach()
        })(), a.createNativeRange = function(a) {
          return a = h(a, "createNativeRange"), a.createRange()
        }
      }else {
        if(a.features.implementsTextRange) {
          c = function(a) {
            this.textRange = a, this.refresh()
          }, c.prototype = new g(document), c.prototype.refresh = function() {
            var a, b, c, d = i(this.textRange);
            j(this.textRange) ? b = a = k(this.textRange, d, !0, !0).boundaryPosition : (c = k(this.textRange, d, !0, !1), a = c.boundaryPosition, b = k(this.textRange, d, !1, !1, c.nodeInfo).boundaryPosition), this.setStart(a.node, a.offset), this.setEnd(b.node, b.offset)
          }, g.copyComparisonConstants(c);
          var m = function() {
            return this
          }();
          typeof m.Range == "undefined" && (m.Range = c), a.createNativeRange = function(a) {
            return a = h(a, "createNativeRange"), a.body.createTextRange()
          }
        }
      }
      a.features.implementsTextRange && (c.rangeToTextRange = function(a) {
        if(a.collapsed) {
          return l(new f(a.startContainer, a.startOffset), !0)
        }
        var b = l(new f(a.startContainer, a.startOffset), !0), c = l(new f(a.endContainer, a.endOffset), !1), e = d.getDocument(a.startContainer).body.createTextRange();
        return e.setEndPoint("StartToStart", b), e.setEndPoint("EndToEnd", c), e
      }), c.prototype.getName = function() {
        return"WrappedRange"
      }, a.WrappedRange = c, a.createRange = function(b) {
        return b = h(b, "createRange"), new c(a.createNativeRange(b))
      }, a.createRangyRange = function(a) {
        return a = h(a, "createRangyRange"), new g(a)
      }, a.createIframeRange = function(c) {
        return b.deprecationNotice("createIframeRange()", "createRange(iframeEl)"), a.createRange(c)
      }, a.createIframeRangyRange = function(c) {
        return b.deprecationNotice("createIframeRangyRange()", "createRangyRange(iframeEl)"), a.createRangyRange(c)
      }, a.addCreateMissingNativeApiListener(function(b) {
        var c = b.document;
        typeof c.createRange == "undefined" && (c.createRange = function() {
          return a.createRange(c)
        }), c = b = null
      })
    }), rangy.createModule("WrappedSelection", function(a, b) {
      function m(a) {
        return typeof a == "string" ? a == "backward" : !!a
      }
      function n(a, c) {
        if(!a) {
          return window
        }
        if(d.isWindow(a)) {
          return a
        }
        if(a instanceof O) {
          return a.win
        }
        var e = d.getContentDocument(a);
        if(!e) {
          throw b.createError(c + "(): " + "Parameter must be a Window object or DOM node");
        }
        return d.getWindow(e)
      }
      function o(a) {
        return n(a, "getWinSelection").getSelection()
      }
      function p(a) {
        return n(a, "getDocSelection").document.selection
      }
      function D(a, b, c) {
        var d = c ? "end" : "start", e = c ? "start" : "end";
        a.anchorNode = b[d + "Container"], a.anchorOffset = b[d + "Offset"], a.focusNode = b[e + "Container"], a.focusOffset = b[e + "Offset"]
      }
      function E(a) {
        var b = a.nativeSelection;
        a.anchorNode = b.anchorNode, a.anchorOffset = b.anchorOffset, a.focusNode = b.focusNode, a.focusOffset = b.focusOffset
      }
      function F(a) {
        a.anchorNode = a.focusNode = null, a.anchorOffset = a.focusOffset = 0, a.rangeCount = 0, a.isCollapsed = !0, a._ranges.length = 0
      }
      function G(b) {
        var c;
        return b instanceof f ? (c = a.createNativeRange(b.getDocument()), c.setEnd(b.endContainer, b.endOffset), c.setStart(b.startContainer, b.startOffset)) : b instanceof g ? c = b.nativeRange : a.features.implementsDomRange && b instanceof d.getWindow(b.startContainer).Range && (c = b), c
      }
      function H(a) {
        if(!a.length || a[0].nodeType != 1) {
          return!1
        }
        for(var b = 1, c = a.length;b < c;++b) {
          if(!d.isAncestorOf(a[0], a[b])) {
            return!1
          }
        }
        return!0
      }
      function I(a) {
        var c = a.getNodes();
        if(!H(c)) {
          throw b.createError("getSingleElementFromRange: range " + a.inspect() + " did not consist of a single element");
        }
        return c[0]
      }
      function J(a) {
        return!!a && typeof a.text != "undefined"
      }
      function K(a, b) {
        var c = new g(b);
        a._ranges = [c], D(a, c, !1), a.rangeCount = 1, a.isCollapsed = c.collapsed
      }
      function L(b) {
        b._ranges.length = 0;
        if(b.docSelection.type == "None") {
          F(b)
        }else {
          var c = b.docSelection.createRange();
          if(J(c)) {
            K(b, c)
          }else {
            b.rangeCount = c.length;
            var e, f = d.getDocument(c.item(0));
            for(var g = 0;g < b.rangeCount;++g) {
              e = a.createRange(f), e.selectNode(c.item(g)), b._ranges.push(e)
            }
            b.isCollapsed = b.rangeCount == 1 && b._ranges[0].collapsed, D(b, b._ranges[b.rangeCount - 1], !1)
          }
        }
      }
      function M(a, c) {
        var e = a.docSelection.createRange(), f = I(c), g = d.getDocument(e.item(0)), h = d.getBody(g).createControlRange();
        for(var i = 0, j = e.length;i < j;++i) {
          h.add(e.item(i))
        }
        try {
          h.add(f)
        }catch(k) {
          throw b.createError("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)");
        }
        h.select(), L(a)
      }
      function O(a, b, c) {
        this.nativeSelection = a, this.docSelection = b, this._ranges = [], this.win = c, this.refresh()
      }
      function P(a) {
        a.win = a.anchorNode = a.focusNode = a._ranges = null, a.detached = !0
      }
      function R(a, b) {
        var c = Q.length, d, e;
        while(c--) {
          d = Q[c], e = d.selection;
          if(b == "deleteAll") {
            P(e)
          }else {
            if(d.win == a) {
              return b == "delete" ? (Q.splice(c, 1), !0) : e
            }
          }
        }
        return b == "deleteAll" && (Q.length = 0), null
      }
      function T(a, c) {
        var e = d.getDocument(c[0].startContainer), f = d.getBody(e).createControlRange();
        for(var g = 0, h;g < rangeCount;++g) {
          h = I(c[g]);
          try {
            f.add(h)
          }catch(i) {
            throw b.createError("setRanges(): Element within the one of the specified Ranges could not be added to control selection (does it have layout?)");
          }
        }
        f.select(), L(a)
      }
      function Y(a, b) {
        if(a.anchorNode && d.getDocument(a.anchorNode) !== d.getDocument(b)) {
          throw new h("WRONG_DOCUMENT_ERR");
        }
      }
      function Z(a) {
        var b = [], c = new i(a.anchorNode, a.anchorOffset), d = new i(a.focusNode, a.focusOffset), e = typeof a.getName == "function" ? a.getName() : "Selection";
        if(typeof a.rangeCount != "undefined") {
          for(var g = 0, h = a.rangeCount;g < h;++g) {
            b[g] = f.inspect(a.getRangeAt(g))
          }
        }
        return"[" + e + "(Ranges: " + b.join(", ") + ")(anchor: " + c.inspect() + ", focus: " + d.inspect() + "]"
      }
      a.requireModules(["DomUtil", "DomRange", "WrappedRange"]), a.config.checkSelectionRanges = !0;
      var c = "boolean", d = a.dom, e = a.util, f = a.DomRange, g = a.WrappedRange, h = a.DOMException, i = d.DomPosition, j, k, l = "Control", q = a.util.isHostMethod(window, "getSelection"), r = a.util.isHostObject(document, "selection");
      a.features.implementsWinGetSelection = q, a.features.implementsDocSelection = r;
      var s = r && (!q || a.config.preferTextRange);
      s ? (j = p, a.isSelectionValid = function(a) {
        var b = n(a, "isSelectionValid").document, c = b.selection;
        return c.type != "None" || d.getDocument(c.createRange().parentElement()) == b
      }) : q ? (j = o, a.isSelectionValid = function() {
        return!0
      }) : b.fail("Neither document.selection or window.getSelection() detected."), a.getNativeSelection = j;
      var t = j(), u = a.createNativeRange(document), v = d.getBody(document), w = e.areHostProperties(t, ["anchorNode", "focusNode", "anchorOffset", "focusOffset"]);
      a.features.selectionHasAnchorAndFocus = w;
      var x = e.isHostMethod(t, "extend");
      a.features.selectionHasExtend = x;
      var y = typeof t.rangeCount == "number";
      a.features.selectionHasRangeCount = y;
      var z = !1, A = !0;
      e.areHostMethods(t, ["addRange", "getRangeAt", "removeAllRanges"]) && typeof t.rangeCount == "number" && a.features.implementsDomRange && function() {
        var a = window.getSelection();
        if(a) {
          var b = d.getBody(document), c = b.appendChild(document.createElement("div"));
          c.contentEditable = "false";
          var e = c.appendChild(document.createTextNode("   ")), f = document.createRange();
          f.setStart(e, 1), f.collapse(!0), a.addRange(f), A = a.rangeCount == 1, a.removeAllRanges();
          var g = f.cloneRange();
          f.setStart(e, 0), g.setEnd(e, 3), g.setStart(e, 2), a.addRange(f), a.addRange(g), z = a.rangeCount == 2, b.removeChild(c), a.removeAllRanges(), f.detach(), g.detach()
        }
      }(), a.features.selectionSupportsMultipleRanges = z, a.features.collapsedNonEditableSelectionsSupported = A;
      var B = !1, C;
      v && e.isHostMethod(v, "createControlRange") && (C = v.createControlRange(), e.areHostProperties(C, ["item", "add"]) && (B = !0)), a.features.implementsControlRange = B, w ? k = function(a) {
        return a.anchorNode === a.focusNode && a.anchorOffset === a.focusOffset
      } : k = function(a) {
        return a.rangeCount ? a.getRangeAt(a.rangeCount - 1).collapsed : !1
      };
      var N;
      e.isHostMethod(t, "getRangeAt") ? N = function(a, b) {
        try {
          return a.getRangeAt(b)
        }catch(c) {
          return null
        }
      } : w && (N = function(b) {
        var c = d.getDocument(b.anchorNode), e = a.createRange(c);
        return e.setStart(b.anchorNode, b.anchorOffset), e.setEnd(b.focusNode, b.focusOffset), e.collapsed !== this.isCollapsed && (e.setStart(b.focusNode, b.focusOffset), e.setEnd(b.anchorNode, b.anchorOffset)), e
      });
      var Q = [];
      a.getSelection = function(a) {
        if(a && a instanceof O) {
          return a.refresh(), a
        }
        a = n(a, "getSelection");
        var b = R(a), c = j(a), d = r ? p(a) : null;
        return b ? (b.nativeSelection = c, b.docSelection = d, b.refresh()) : (b = new O(c, d, a), Q.push({win:a, selection:b})), b
      }, a.getIframeSelection = function(c) {
        return b.deprecationNotice("getIframeSelection()", "getSelection(iframeEl)"), a.getSelection(d.getIframeWindow(c))
      };
      var S = O.prototype;
      if(!s && w && e.areHostMethods(t, ["removeAllRanges", "addRange"])) {
        S.removeAllRanges = function() {
          this.nativeSelection.removeAllRanges(), F(this)
        };
        var U = function(b, c) {
          var d = f.getRangeDocument(c), e = a.createRange(d);
          e.collapseToPoint(c.endContainer, c.endOffset), b.nativeSelection.addRange(G(e)), b.nativeSelection.extend(c.startContainer, c.startOffset), b.refresh()
        };
        y ? S.addRange = function(b, c) {
          if(B && r && this.docSelection.type == l) {
            M(this, b)
          }else {
            if(m(c) && x) {
              U(this, b)
            }else {
              var d;
              z ? d = this.rangeCount : (this.removeAllRanges(), d = 0), this.nativeSelection.addRange(G(b).cloneRange()), this.rangeCount = this.nativeSelection.rangeCount;
              if(this.rangeCount == d + 1) {
                if(a.config.checkSelectionRanges) {
                  var e = N(this.nativeSelection, this.rangeCount - 1);
                  e && !f.rangesEqual(e, b) && (b = new g(e))
                }
                this._ranges[this.rangeCount - 1] = b, D(this, b, X(this.nativeSelection)), this.isCollapsed = k(this)
              }else {
                this.refresh()
              }
            }
          }
        } : S.addRange = function(a, b) {
          m(b) && x ? U(this, a) : (this.nativeSelection.addRange(G(a)), this.refresh())
        }, S.setRanges = function(a) {
          if(B && a.length > 1) {
            T(this, a)
          }else {
            this.removeAllRanges();
            for(var b = 0, c = a.length;b < c;++b) {
              this.addRange(a[b])
            }
          }
        }
      }else {
        if(!(e.isHostMethod(t, "empty") && e.isHostMethod(u, "select") && B && s)) {
          return b.fail("No means of selecting a Range or TextRange was found"), !1
        }
        S.removeAllRanges = function() {
          try {
            this.docSelection.empty();
            if(this.docSelection.type != "None") {
              var a;
              if(this.anchorNode) {
                a = d.getDocument(this.anchorNode)
              }else {
                if(this.docSelection.type == l) {
                  var b = this.docSelection.createRange();
                  b.length && (a = d.getDocument(b.item(0)).body.createTextRange())
                }
              }
              if(a) {
                var c = a.body.createTextRange();
                c.select(), this.docSelection.empty()
              }
            }
          }catch(e) {
          }
          F(this)
        }, S.addRange = function(a) {
          this.docSelection.type == l ? M(this, a) : (g.rangeToTextRange(a).select(), this._ranges[0] = a, this.rangeCount = 1, this.isCollapsed = this._ranges[0].collapsed, D(this, a, !1))
        }, S.setRanges = function(a) {
          this.removeAllRanges();
          var b = a.length;
          b > 1 ? T(this, a) : b && this.addRange(a[0])
        }
      }
      S.getRangeAt = function(a) {
        if(a < 0 || a >= this.rangeCount) {
          throw new h("INDEX_SIZE_ERR");
        }
        return this._ranges[a].cloneRange()
      };
      var V;
      if(s) {
        V = function(b) {
          var c;
          a.isSelectionValid(b.win) ? c = b.docSelection.createRange() : (c = d.getBody(b.win.document).createTextRange(), c.collapse(!0)), b.docSelection.type == l ? L(b) : J(c) ? K(b, c) : F(b)
        }
      }else {
        if(e.isHostMethod(t, "getRangeAt") && typeof t.rangeCount == "number") {
          V = function(b) {
            if(B && r && b.docSelection.type == l) {
              L(b)
            }else {
              b._ranges.length = b.rangeCount = b.nativeSelection.rangeCount;
              if(b.rangeCount) {
                for(var c = 0, d = b.rangeCount;c < d;++c) {
                  b._ranges[c] = new a.WrappedRange(b.nativeSelection.getRangeAt(c))
                }
                D(b, b._ranges[b.rangeCount - 1], X(b.nativeSelection)), b.isCollapsed = k(b)
              }else {
                F(b)
              }
            }
          }
        }else {
          if(!w || typeof t.isCollapsed != c || typeof u.collapsed != c || !a.features.implementsDomRange) {
            return b.fail("No means of obtaining a Range or TextRange from the user's selection was found"), !1
          }
          V = function(a) {
            var b, c = a.nativeSelection;
            c.anchorNode ? (b = N(c, 0), a._ranges = [b], a.rangeCount = 1, E(a), a.isCollapsed = k(a)) : F(a)
          }
        }
      }
      S.refresh = function(a) {
        var b = a ? this._ranges.slice(0) : null, c = this.anchorNode, d = this.anchorOffset;
        V(this);
        if(a) {
          var e = b.length;
          if(e != this._ranges.length) {
            return!0
          }
          if(this.anchorNode != c || this.anchorOffset != d) {
            return!0
          }
          while(e--) {
            if(!f.rangesEqual(b[e], this._ranges[e])) {
              return!0
            }
          }
          return!1
        }
      };
      var W = function(b, c) {
        var d = b.getAllRanges();
        b.removeAllRanges();
        for(var e = 0, f = d.length;e < f;++e) {
          a.DomRange.rangesEqual(c, d[e]) || b.addRange(d[e])
        }
        b.rangeCount || F(b)
      };
      B ? S.removeRange = function(a) {
        if(this.docSelection.type == l) {
          var b = this.docSelection.createRange(), c = I(a), e = d.getDocument(b.item(0)), f = d.getBody(e).createControlRange(), g, h = !1;
          for(var i = 0, j = b.length;i < j;++i) {
            g = b.item(i), g !== c || h ? f.add(b.item(i)) : h = !0
          }
          f.select(), L(this)
        }else {
          W(this, a)
        }
      } : S.removeRange = function(a) {
        W(this, a)
      };
      var X;
      !s && w && a.features.implementsDomRange ? (X = function(a) {
        var b = !1;
        return a.anchorNode && (b = d.comparePoints(a.anchorNode, a.anchorOffset, a.focusNode, a.focusOffset) == 1), b
      }, S.isBackward = function() {
        return X(this)
      }) : X = S.isBackward = function() {
        return!1
      }, S.isBackwards = S.isBackward, S.toString = function() {
        var a = [];
        for(var b = 0, c = this.rangeCount;b < c;++b) {
          a[b] = "" + this._ranges[b]
        }
        return a.join("")
      }, S.collapse = function(b, c) {
        Y(this, b);
        var d = a.createRange(b);
        d.collapseToPoint(b, c), this.setSingleRange(d), this.isCollapsed = !0
      }, S.collapseToStart = function() {
        if(!this.rangeCount) {
          throw new h("INVALID_STATE_ERR");
        }
        var a = this._ranges[0];
        this.collapse(a.startContainer, a.startOffset)
      }, S.collapseToEnd = function() {
        if(!this.rangeCount) {
          throw new h("INVALID_STATE_ERR");
        }
        var a = this._ranges[this.rangeCount - 1];
        this.collapse(a.endContainer, a.endOffset)
      }, S.selectAllChildren = function(b) {
        Y(this, b);
        var c = a.createRange(b);
        c.selectNodeContents(b), this.removeAllRanges(), this.addRange(c)
      }, S.deleteFromDocument = function() {
        if(B && r && this.docSelection.type == l) {
          var a = this.docSelection.createRange(), b;
          while(a.length) {
            b = a.item(0), a.remove(b), b.parentNode.removeChild(b)
          }
          this.refresh()
        }else {
          if(this.rangeCount) {
            var c = this.getAllRanges();
            if(c.length) {
              this.removeAllRanges();
              for(var d = 0, e = c.length;d < e;++d) {
                c[d].deleteContents()
              }
              this.addRange(c[e - 1])
            }
          }
        }
      }, S.getAllRanges = function() {
        var a = [];
        for(var b = 0, c = this._ranges.length;b < c;++b) {
          a[b] = this.getRangeAt(b)
        }
        return a
      }, S.setSingleRange = function(a, b) {
        this.removeAllRanges(), this.addRange(a, b)
      }, S.containsNode = function(a, b) {
        for(var c = 0, d = this._ranges.length;c < d;++c) {
          if(this._ranges[c].containsNode(a, b)) {
            return!0
          }
        }
        return!1
      }, S.toHtml = function() {
        var a = [];
        if(this.rangeCount) {
          for(var b = 0, c = this._ranges.length;b < c;++b) {
            a.push(this._ranges[b].toHtml())
          }
        }
        return a.join("")
      }, S.getName = function() {
        return"WrappedSelection"
      }, S.inspect = function() {
        return Z(this)
      }, S.detach = function() {
        R(this.win, "delete"), P(this)
      }, O.detachAll = function() {
        R(null, "deleteAll")
      }, O.inspect = Z, O.isDirectionBackward = m, a.Selection = O, a.selectionPrototype = S, a.addCreateMissingNativeApiListener(function(b) {
        typeof b.getSelection == "undefined" && (b.getSelection = function() {
          return a.getSelection(b)
        }), b = null
      })
    });
    WebAgent.util.rangy.init()
  };
  var interval = setInterval(function() {
    if(document.body) {
      clearInterval(interval);
      initRangy()
    }
  }, 100)
})();
WebAgent.namespace("WebAgent.util");
(function() {
  var swfobject = WebAgent.util.swf = function() {
    var D = "undefined", r = "object", S = "Shockwave Flash", W = "ShockwaveFlash.ShockwaveFlash", q = "application/x-shockwave-flash", R = "SWFObjectExprInst", x = "onreadystatechange", O = window, j = document, t = navigator, T = false, U = [h], o = [], N = [], I = [], l, Q, E, B, J = false, a = false, n, G, m = true, M = function() {
      var aa = typeof j.getElementById != D && typeof j.getElementsByTagName != D && typeof j.createElement != D, ah = t.userAgent.toLowerCase(), Y = t.platform.toLowerCase(), ae = Y ? /win/.test(Y) : /win/.test(ah), ac = Y ? /mac/.test(Y) : /mac/.test(ah), af = /webkit/.test(ah) ? parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, X = !+"\v1", ag = [0, 0, 0], ab = null;
      if(typeof t.plugins != D && typeof t.plugins[S] == r) {
        ab = t.plugins[S].description;
        if(ab && !(typeof t.mimeTypes != D && t.mimeTypes[q] && !t.mimeTypes[q].enabledPlugin)) {
          T = true;
          X = false;
          ab = ab.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
          ag[0] = parseInt(ab.replace(/^(.*)\..*$/, "$1"), 10);
          ag[1] = parseInt(ab.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
          ag[2] = /[a-zA-Z]/.test(ab) ? parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
        }
      }else {
        if(typeof O.ActiveXObject != D) {
          try {
            var ad = new ActiveXObject(W);
            if(ad) {
              ab = ad.GetVariable("$version");
              if(ab) {
                X = true;
                ab = ab.split(" ")[1].split(",");
                ag = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)]
              }
            }
          }catch(Z) {
          }
        }
      }
      return{w3:aa, pv:ag, wk:af, ie:X, win:ae, mac:ac}
    }(), k = function() {
      if(!M.w3) {
        return
      }
      if(typeof j.readyState != D && j.readyState == "complete" || typeof j.readyState == D && (j.getElementsByTagName("body")[0] || j.body)) {
        f()
      }
      if(!J) {
        if(typeof j.addEventListener != D) {
          j.addEventListener("DOMContentLoaded", f, false)
        }
        if(M.ie && M.win) {
          j.attachEvent(x, function() {
            if(j.readyState == "complete") {
              j.detachEvent(x, arguments.callee);
              f()
            }
          });
          if(O == top) {
            (function() {
              if(J) {
                return
              }
              try {
                j.documentElement.doScroll("left")
              }catch(X) {
                setTimeout(arguments.callee, 0);
                return
              }
              f()
            })()
          }
        }
        if(M.wk) {
          (function() {
            if(J) {
              return
            }
            if(!/loaded|complete/.test(j.readyState)) {
              setTimeout(arguments.callee, 0);
              return
            }
            f()
          })()
        }
        s(f)
      }
    }();
    function f() {
      if(J) {
        return
      }
      try {
        var Z = j.getElementsByTagName("body")[0].appendChild(C("span"));
        Z.parentNode.removeChild(Z)
      }catch(aa) {
        return
      }
      J = true;
      var X = U.length;
      for(var Y = 0;Y < X;Y++) {
        U[Y]()
      }
    }
    function K(X) {
      if(J) {
        X()
      }else {
        U[U.length] = X
      }
    }
    function s(Y) {
      if(typeof O.addEventListener != D) {
        O.addEventListener("load", Y, false)
      }else {
        if(typeof j.addEventListener != D) {
          j.addEventListener("load", Y, false)
        }else {
          if(typeof O.attachEvent != D) {
            i(O, "onload", Y)
          }else {
            if(typeof O.onload == "function") {
              var X = O.onload;
              O.onload = function() {
                X();
                Y()
              }
            }else {
              O.onload = Y
            }
          }
        }
      }
    }
    function h() {
      if(T) {
        V()
      }else {
        H()
      }
    }
    function V() {
      var X = j.getElementsByTagName("body")[0];
      var aa = C(r);
      aa.setAttribute("type", q);
      var Z = X.appendChild(aa);
      if(Z) {
        var Y = 0;
        (function() {
          if(typeof Z.GetVariable != D) {
            var ab = Z.GetVariable("$version");
            if(ab) {
              ab = ab.split(" ")[1].split(",");
              M.pv = [parseInt(ab[0], 10), parseInt(ab[1], 10), parseInt(ab[2], 10)]
            }
          }else {
            if(Y < 10) {
              Y++;
              setTimeout(arguments.callee, 10);
              return
            }
          }
          X.removeChild(aa);
          Z = null;
          H()
        })()
      }else {
        H()
      }
    }
    function H() {
      var ag = o.length;
      if(ag > 0) {
        for(var af = 0;af < ag;af++) {
          var Y = o[af].id;
          var ab = o[af].callbackFn;
          var aa = {success:false, id:Y};
          if(M.pv[0] > 0) {
            var ae = c(Y);
            if(ae) {
              if(F(o[af].swfVersion) && !(M.wk && M.wk < 312)) {
                w(Y, true);
                if(ab) {
                  aa.success = true;
                  aa.ref = z(Y);
                  ab(aa)
                }
              }else {
                if(o[af].expressInstall && A()) {
                  var ai = {};
                  ai.data = o[af].expressInstall;
                  ai.width = ae.getAttribute("width") || "0";
                  ai.height = ae.getAttribute("height") || "0";
                  if(ae.getAttribute("class")) {
                    ai.styleclass = ae.getAttribute("class")
                  }
                  if(ae.getAttribute("align")) {
                    ai.align = ae.getAttribute("align")
                  }
                  var ah = {};
                  var X = ae.getElementsByTagName("param");
                  var ac = X.length;
                  for(var ad = 0;ad < ac;ad++) {
                    if(X[ad].getAttribute("name").toLowerCase() != "movie") {
                      ah[X[ad].getAttribute("name")] = X[ad].getAttribute("value")
                    }
                  }
                  P(ai, ah, Y, ab)
                }else {
                  p(ae);
                  if(ab) {
                    ab(aa)
                  }
                }
              }
            }
          }else {
            w(Y, true);
            if(ab) {
              var Z = z(Y);
              if(Z && typeof Z.SetVariable != D) {
                aa.success = true;
                aa.ref = Z
              }
              ab(aa)
            }
          }
        }
      }
    }
    function z(aa) {
      var X = null;
      var Y = c(aa);
      if(Y && Y.nodeName == "OBJECT") {
        if(typeof Y.SetVariable != D) {
          X = Y
        }else {
          var Z = Y.getElementsByTagName(r)[0];
          if(Z) {
            X = Z
          }
        }
      }
      return X
    }
    function A() {
      return!a && F("6.0.65") && (M.win || M.mac) && !(M.wk && M.wk < 312)
    }
    function P(aa, ab, X, Z) {
      a = true;
      E = Z || null;
      B = {success:false, id:X};
      var ae = c(X);
      if(ae) {
        if(ae.nodeName == "OBJECT") {
          l = g(ae);
          Q = null
        }else {
          l = ae;
          Q = X
        }
        aa.id = R;
        if(typeof aa.width == D || !/%$/.test(aa.width) && parseInt(aa.width, 10) < 310) {
          aa.width = "310"
        }
        if(typeof aa.height == D || !/%$/.test(aa.height) && parseInt(aa.height, 10) < 137) {
          aa.height = "137"
        }
        j.title = j.title.slice(0, 47) + " - Flash Player Installation";
        var ad = M.ie && M.win ? "ActiveX" : "PlugIn", ac = "MMredirectURL=" + O.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + ad + "&MMdoctitle=" + j.title;
        if(typeof ab.flashvars != D) {
          ab.flashvars += "&" + ac
        }else {
          ab.flashvars = ac
        }
        if(M.ie && M.win && ae.readyState != 4) {
          var Y = C("div");
          X += "SWFObjectNew";
          Y.setAttribute("id", X);
          ae.parentNode.insertBefore(Y, ae);
          ae.style.display = "none";
          (function() {
            if(ae.readyState == 4) {
              ae.parentNode.removeChild(ae)
            }else {
              setTimeout(arguments.callee, 10)
            }
          })()
        }
        u(aa, ab, X)
      }
    }
    function p(Y) {
      if(M.ie && M.win && Y.readyState != 4) {
        var X = C("div");
        Y.parentNode.insertBefore(X, Y);
        X.parentNode.replaceChild(g(Y), X);
        Y.style.display = "none";
        (function() {
          if(Y.readyState == 4) {
            Y.parentNode.removeChild(Y)
          }else {
            setTimeout(arguments.callee, 10)
          }
        })()
      }else {
        Y.parentNode.replaceChild(g(Y), Y)
      }
    }
    function g(ab) {
      var aa = C("div");
      if(M.win && M.ie) {
        aa.innerHTML = ab.innerHTML
      }else {
        var Y = ab.getElementsByTagName(r)[0];
        if(Y) {
          var ad = Y.childNodes;
          if(ad) {
            var X = ad.length;
            for(var Z = 0;Z < X;Z++) {
              if(!(ad[Z].nodeType == 1 && ad[Z].nodeName == "PARAM") && !(ad[Z].nodeType == 8)) {
                aa.appendChild(ad[Z].cloneNode(true))
              }
            }
          }
        }
      }
      return aa
    }
    function u(ai, ag, Y) {
      var X, aa = c(Y);
      if(M.wk && M.wk < 312) {
        return X
      }
      if(aa) {
        if(typeof ai.id == D) {
          ai.id = Y
        }
        if(M.ie && M.win) {
          var ah = "";
          for(var ae in ai) {
            if(ai[ae] != Object.prototype[ae]) {
              if(ae.toLowerCase() == "data") {
                ag.movie = ai[ae]
              }else {
                if(ae.toLowerCase() == "styleclass") {
                  ah += ' class="' + ai[ae] + '"'
                }else {
                  if(ae.toLowerCase() != "classid") {
                    ah += " " + ae + '="' + ai[ae] + '"'
                  }
                }
              }
            }
          }
          var af = "";
          for(var ad in ag) {
            if(ag[ad] != Object.prototype[ad]) {
              af += '<param name="' + ad + '" value="' + ag[ad] + '" />'
            }
          }
          aa.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + ah + ">" + af + "</object>";
          N[N.length] = ai.id;
          X = c(ai.id)
        }else {
          var Z = C(r);
          Z.setAttribute("type", q);
          for(var ac in ai) {
            if(ai[ac] != Object.prototype[ac]) {
              if(ac.toLowerCase() == "styleclass") {
                Z.setAttribute("class", ai[ac])
              }else {
                if(ac.toLowerCase() != "classid") {
                  Z.setAttribute(ac, ai[ac])
                }
              }
            }
          }
          for(var ab in ag) {
            if(ag[ab] != Object.prototype[ab] && ab.toLowerCase() != "movie") {
              e(Z, ab, ag[ab])
            }
          }
          aa.parentNode.replaceChild(Z, aa);
          X = Z
        }
      }
      return X
    }
    function e(Z, X, Y) {
      var aa = C("param");
      aa.setAttribute("name", X);
      aa.setAttribute("value", Y);
      Z.appendChild(aa)
    }
    function y(Y) {
      var X = c(Y);
      if(X && X.nodeName == "OBJECT") {
        if(M.ie && M.win) {
          X.style.display = "none";
          (function() {
            if(X.readyState == 4) {
              b(Y)
            }else {
              setTimeout(arguments.callee, 10)
            }
          })()
        }else {
          X.parentNode.removeChild(X)
        }
      }
    }
    function b(Z) {
      var Y = c(Z);
      if(Y) {
        for(var X in Y) {
          if(typeof Y[X] == "function") {
            Y[X] = null
          }
        }
        Y.parentNode.removeChild(Y)
      }
    }
    function c(Z) {
      var X = null;
      try {
        X = j.getElementById(Z)
      }catch(Y) {
      }
      return X
    }
    function C(X) {
      return j.createElement(X)
    }
    function i(Z, X, Y) {
      Z.attachEvent(X, Y);
      I[I.length] = [Z, X, Y]
    }
    function F(Z) {
      var Y = M.pv, X = Z.split(".");
      X[0] = parseInt(X[0], 10);
      X[1] = parseInt(X[1], 10) || 0;
      X[2] = parseInt(X[2], 10) || 0;
      return Y[0] > X[0] || Y[0] == X[0] && Y[1] > X[1] || Y[0] == X[0] && Y[1] == X[1] && Y[2] >= X[2] ? true : false
    }
    function v(ac, Y, ad, ab) {
      if(M.ie && M.mac) {
        return
      }
      var aa = j.getElementsByTagName("head")[0];
      if(!aa) {
        return
      }
      var X = ad && typeof ad == "string" ? ad : "screen";
      if(ab) {
        n = null;
        G = null
      }
      if(!n || G != X) {
        var Z = C("style");
        Z.setAttribute("type", "text/css");
        Z.setAttribute("media", X);
        n = aa.appendChild(Z);
        if(M.ie && M.win && typeof j.styleSheets != D && j.styleSheets.length > 0) {
          n = j.styleSheets[j.styleSheets.length - 1]
        }
        G = X
      }
      if(M.ie && M.win) {
        if(n && typeof n.addRule == r) {
          n.addRule(ac, Y)
        }
      }else {
        if(n && typeof j.createTextNode != D) {
          n.appendChild(j.createTextNode(ac + " {" + Y + "}"))
        }
      }
    }
    function w(Z, X) {
      if(!m) {
        return
      }
      var Y = X ? "visible" : "hidden";
      if(J && c(Z)) {
        c(Z).style.visibility = Y
      }else {
        v("#" + Z, "visibility:" + Y)
      }
    }
    function L(Y) {
      var Z = /[\\\"<>\.;]/;
      var X = Z.exec(Y) != null;
      return X && typeof encodeURIComponent != D ? encodeURIComponent(Y) : Y
    }
    var d = function() {
      if(M.ie && M.win) {
        window.attachEvent("onunload", function() {
          var ac = I.length;
          for(var ab = 0;ab < ac;ab++) {
            I[ab][0].detachEvent(I[ab][1], I[ab][2])
          }
          var Z = N.length;
          for(var aa = 0;aa < Z;aa++) {
            y(N[aa])
          }
          for(var Y in M) {
            M[Y] = null
          }
          M = null;
          for(var X in swfobject) {
            swfobject[X] = null
          }
          swfobject = null
        })
      }
    }();
    return{registerObject:function(ab, X, aa, Z) {
      if(M.w3 && ab && X) {
        var Y = {};
        Y.id = ab;
        Y.swfVersion = X;
        Y.expressInstall = aa;
        Y.callbackFn = Z;
        o[o.length] = Y;
        w(ab, false)
      }else {
        if(Z) {
          Z({success:false, id:ab})
        }
      }
    }, getObjectById:function(X) {
      if(M.w3) {
        return z(X)
      }
    }, embedSWF:function(ab, ah, ae, ag, Y, aa, Z, ad, af, ac) {
      var X = {success:false, id:ah};
      if(M.w3 && !(M.wk && M.wk < 312) && ab && ah && ae && ag && Y) {
        w(ah, false);
        K(function() {
          ae += "";
          ag += "";
          var aj = {};
          if(af && typeof af === r) {
            for(var al in af) {
              aj[al] = af[al]
            }
          }
          aj.data = ab;
          aj.width = ae;
          aj.height = ag;
          var am = {};
          if(ad && typeof ad === r) {
            for(var ak in ad) {
              am[ak] = ad[ak]
            }
          }
          if(Z && typeof Z === r) {
            for(var ai in Z) {
              if(typeof am.flashvars != D) {
                am.flashvars += "&" + ai + "=" + Z[ai]
              }else {
                am.flashvars = ai + "=" + Z[ai]
              }
            }
          }
          if(F(Y)) {
            var an = u(aj, am, ah);
            if(aj.id == ah) {
              w(ah, true)
            }
            X.success = true;
            X.ref = an
          }else {
            if(aa && A()) {
              aj.data = aa;
              P(aj, am, ah, ac);
              return
            }else {
              w(ah, true)
            }
          }
          if(ac) {
            ac(X)
          }
        })
      }else {
        if(ac) {
          ac(X)
        }
      }
    }, switchOffAutoHideShow:function() {
      m = false
    }, ua:M, getFlashPlayerVersion:function() {
      return{major:M.pv[0], minor:M.pv[1], release:M.pv[2]}
    }, hasFlashPlayerVersion:F, createSWF:function(Z, Y, X) {
      if(M.w3) {
        return u(Z, Y, X)
      }else {
        return undefined
      }
    }, showExpressInstall:function(Z, aa, X, Y) {
      if(M.w3 && A()) {
        P(Z, aa, X, Y)
      }
    }, removeSWF:function(X) {
      if(M.w3) {
        y(X)
      }
    }, createCSS:function(aa, Z, Y, X) {
      if(M.w3) {
        v(aa, Z, Y, X)
      }
    }, addDomLoadEvent:K, addLoadEvent:s, getQueryParamValue:function(aa) {
      var Z = j.location.search || j.location.hash;
      if(Z) {
        if(/\?/.test(Z)) {
          Z = Z.split("?")[1]
        }
        if(aa == null) {
          return L(Z)
        }
        var Y = Z.split("&");
        for(var X = 0;X < Y.length;X++) {
          if(Y[X].substring(0, Y[X].indexOf("=")) == aa) {
            return L(Y[X].substring(Y[X].indexOf("=") + 1))
          }
        }
      }
      return""
    }, expressInstallCallback:function() {
      if(a) {
        var X = c(R);
        if(X && l) {
          X.parentNode.replaceChild(l, X);
          if(Q) {
            w(Q, true);
            if(M.ie && M.win) {
              l.style.display = "block"
            }
          }
          if(E) {
            E(B)
          }
        }
        a = false
      }
    }}
  }()
})();
WebAgent.namespace("WebAgent.debug");
WebAgent.debug.State = function() {
  var WA = WebAgent;
  var State = WA.extend(Object, {constructor:function() {
    this.items = {};
    this.isReady = false;
    WA.util.DomHelper.whenReady(this._onReady, this)
  }, _onReady:function() {
    this.isReady = true;
    this.el = WA.getBody().createChild({id:"mailru-webagent-debug-state"});
    WA.util.Object.each(this.items, function(item, id) {
      item.el = this._createEl(id, item.value)
    }, this)
  }, _createEl:function(id, value) {
    return this.el.createChild({id:this.id + "-" + id, cls:"wa-debug-state-item", children:[{tag:"strong", html:id + ":&nbsp;"}, {tag:"span", html:value || "&nbsp;"}]})
  }, _addItem:function(id, value) {
    if(this.items[id]) {
      WA.error("Duplicate item: " + id)
    }else {
      this.items[id] = {id:id, value:value, el:this.isReady ? this._createEl(id, value) : null}
    }
  }, set:function(id, value) {
    var item = this.items[id];
    if(item) {
      item.value = value;
      if(item.el) {
        item.el.last().update(value)
      }
    }else {
      this._addItem(id, value)
    }
  }, remove:function(id) {
    var item = this.items[id];
    if(item) {
      item.id = null;
      item.el.remove();
      item.el = null;
      item.value = null;
      this.items[id] = null
    }else {
      WA.error("Invalid item: " + id)
    }
  }});
  var state = null;
  if(WA.isDebug) {
    state = new State
  }
  return{set:function(id, value) {
    if(state) {
      state.set(id, value)
    }
    return this
  }, remove:function(id) {
    if(state) {
      state.remove(id)
    }
    return this
  }}
}();
WebAgent.namespace("WebAgent.debug");
(function() {
  var WA = WebAgent;
  var print = function(level, args) {
    return;
    if(WA.isDebug && typeof console !== "undefined") {
      var m = console[level] || console.log;
      var entries = WebAgent.toArray(args).join(" ");
      if(m && m.call) {
        m.call(console, entries)
      }else {
        if(console[level]) {
          console[level](entries)
        }else {
          console.log(entries)
        }
      }
    }
  };
  var Console = WA.debug.Console = {log:function() {
    return;
    print.call(Console, "log", arguments)
  }, debug:function() {
    print.call(Console, "debug", arguments)
  }, info:function() {
    print.call(Console, "info", arguments)
  }, warn:function() {
    print.call(Console, "warn", arguments)
  }, error:function() {
    print.call(Console, "error", arguments)
  }}
})();
WebAgent.namespace("WebAgent.i18n");
(function() {
  var WA = WebAgent;
  var U = WA.util;
  WA.tr = WA.i18n.translate = function(key, options) {
    options = options || {};
    if(options.scope) {
      key = options.scope + "." + key
    }
    if(options.context) {
      key = key + "_" + options.context
    }
    var phrase = WA.i18n.getValueByKey(WA.i18n.dict, key);
    if(typeof options.count !== "undefined") {
      phrase = WA.i18n.plural(phrase, options.count)
    }
    if(typeof phrase === "string") {
      phrase = WA.i18n.formatString(phrase, options)
    }else {
      phrase = "[" + key + "]"
    }
    return phrase
  };
  WA.i18n.getValueByKey = function(data, key) {
    var keys = key.split(".");
    while(keys.length) {
      if(data === undefined) {
        break
      }
      data = data[keys.shift()];
      if(keys.length == 0) {
        return data
      }
    }
    return null
  };
  WA.i18n.plural = function(phrase, count) {
    if(typeof phrase == "object" && WA.i18n.dict.pluralRule) {
      var key = WA.i18n.dict.pluralRule(count);
      phrase = phrase[key]
    }
    return phrase
  };
  var formatRE = /\{\{([a-zA-Z0-9_-]+?)\}\}/g;
  WA.i18n.formatString = function(str, values) {
    var formatFunc = function(unused, key) {
      return typeof values[key] != "undefined" ? "" + values[key] : ""
    };
    str = str.replace(formatRE, formatFunc);
    return str
  };
  WA.i18n.lang = "ru";
  WA.i18n.dict = {mainTitle:"Mail.Ru Агент", titleAnimator:"Сообщение ({{count}})", cl:{searchContacts:"Найти контакты", hide:"Свернуть", closePopup:"Закрыть окно", openPopup:"Открыть в отдельном окне", addContact:"Добавить контакт", sendSMS:"Отправить SMS", options:"Настройки", makeCall:"Позвонить", turnOff:"Отключить", optOnlineContacts:"Только онлайн контакты", optAllContacts:"Все контакты", optMicroblogOff:"Не оповещать о микропостах", optMicroblogOn:"Оповещать о микропостах", optSoundOff:"Отключить звуки", 
  optSoundOn:"Включить звуки", optSettings:"Настройки", optAvatarsOn:"Включить фото контактов", optAvatarsOff:"Отключить фото контактов", "optShowActiveDialogs":"Включить активные диалоги", "optHideActiveDialogs":"Выключить активные диалоги", "titleActive":"Активные", optPreviewsShow:"Показать картинки в диалогах", optPreviewsHide:"Скрыть картинки в диалогах", optBirthdayOn:"Сообщать о днях рождения", optBirthdayOff:"Не сообщать о днях рождения", optStatusesOff:"Не оповещать о смене статуса", optStatusesOn:"Оповещать о смене статуса", 
  tellFriends:"Сказать всем друзьям", noResults:"Результаты отсутствуют", editStatus:"Редактировать", teaser:{inviteFriends:"Пригласить друзей", peopleYouMayKnow:"Возможно вы знакомы?", addFriendsAndChat:"Добавь друзей<br> и начни свое общение<br> прямо сейчас"}}, dialog:{typeMessage:"Напишите сообщение...", send:"Отправить", smiles:"Смайлы", reply:"Ответить", tellsFriends:"говорит друзьям", sendingFailed:"Сообщение не отправлено.", resend:"Переотправить", loading:"Загружается...", noMessages:"Пока нет сообщений", 
  grantContactAuth:"Авторизовать и добавить контакт", decline:"Отклонить", ignore:"Игнорировать", spam:"Это спам!", preview:"просмотр", previewMult:"Посмотреть мульт", sendMult:"Отправить мульт", sendSMS:"Отправить SMS", smsOnlyContact:"Вы можете только отправлять SMS этому контакту. Добавьте его в Агент и вы сможете общаться с любого компьютера.", smsArchive:"Архив отправленных SMS-сообщений", smsFrom:"SMS от номера {{tel}}", smsTo:"SMS на номер {{tel}}", tools:{profile:"Анкета", moyMir:"Мой Мир", 
  photo:"Фото", spam:"Спам", ignore:"Игнорировать", rename:"Переименовать", remove:"Удалить", actions:"Действия", map:"Карта", cancel:"Отмена", add:"Добавить"}}, profile:{addContact:"Добавить в список контактов", close:"Закрыть", birthdate:"Дата рождения", email:"Электронная почта", home:"Место жительства"}, search:{title:"Поиск и добавление контактов", search:"Поиск", peopleYouMayKnow:"Возможно вы знакомы", possiblyClassmate:"Возможно, ваш одноклассник", possiblyGroupmate:"Возможно, ваш одногруппник", 
  possiblyColleague:"Возможно, ваш коллега", youHaveMutualFriends:"У вас есть общие друзья в Моем мире", yourSubscriber:"Этот человек подписан на ваш блог", yourFavorite:"Человек из вашего списка избранных", hisFavorite:"Вы у человека в списке избранных", hisSubscriber:"Вы подписаны на блог этого человека", correspondy:"Вы обменивались письмами с этим человеком", yourFriend:"Ваш друг в Моем мире", yourFriendsFriend:"Друг вашего друга в Моем мире", yourICQFriend:"Друг вашего друга в ICQ", yourOKFriend:"Друг вашего друга в Одноклассниках", 
  profile:"Анкета", add:"Добавить", youSearched:"Вы искали", noResults:"ничего не найдено", backToSearchParams:"Вернуться к параметрам поиска", typeEmail:"Введите e-mail или номер ICQ", goSearch:"Найти", name:"Имя", lastname:"Фамилия", sex:"Пол", age:"Возраст", country:"Страна", state:"Регион", city:"Город", wrongEmail:"Неправильный e-mail или номер ICQ", searchProfile:"Поиск по анкете", searchOnMap:"Найти по карте", male:"мужской", female:"женский", from:"от", to:"до", anyCountry:"Любая страна", 
  anyState:"Любой регион", anyCity:"Любой город", notFamiliar:"Не знакомы", fourtySecondCousin:"Седьмая вода на киселе", close:"Закрыть", next:"Следующий", previous:"Предыдущий", alreadyInList:'Пользователь <span class="nwa-special-nick">{{nick}}</span> уже находится в списке контактов', openChat:"Открыть диалог", noParameters:"без параметров"}, sms:{typeText:"Введите текст", saveAsContact:"Сохранить контакт?", save:"Сохранить", nope:"Не надо", typeName:"Введите имя или номер телефона", send:"Отправить", 
  phone:"Телефон", sendSMS:"Отправить SMS", autoTranslit:"Автотранслит", exceed:{one:"Лишний", few:"Лишних", many:"Лишних"}, remain:{one:"Остался", few:"Осталось", many:"Осталось"}, symbols:{one:"{{prefix}} {{count}} символ", few:"{{prefix}} {{count}} символа", many:"{{prefix}} {{count}} символов"}, nextTry:{one:"Следующая SMS через {{count}} секудну", few:"Следующая SMS через {{count}} секунды", many:"Следующая SMS через {{count}} секунд"}, userPhones:"Телефоны пользователя"}, dialer:{phoneBook:"Телефонная книга", 
  cabinet:"Личный кабинет", callTariff:"Стоимость звонков", pay:"Пополнить", phoneOrName:"Телефон или имя", phone:"Телефон", youreCalling:"В данный момент вы звоните.", tariff:"Тариф", connecting:"Соединение...", minutes:"мин", searchContacts:"Найти контакты", contacts:"Контакты", hangupAndDialNumber:"Положить трубку и позвонить на номер", dialNumber:"Позвонить на номер", currencyRub:"руб."}, voip:{voiceCalls:"Голосовые звонки", connecting:"Соединение...", hangup:"Завершить", expand:"Развернуть", 
  incomingCall:"Входящий вызов", voiceCall:"Голосовой звонок (бесплатно)", videoCall:"Видеозвонок на компьютер (бесплатно)", answer:"Ответить", answerVideo:"Ответить с видео", decline:"Отклонить", msg:{swfRequired:"Необходимо наличие Флеш плеера<br> не ниже версии {{ver}}", swfVideoRequired:"Необходимо наличие Флеш плеера<br> не ниже версии {{ver_vid}}", swfPstnRequired:"Необходимо наличие Флеш плеера<br> не ниже версии {{ver_pstn}}", swfRequiredIncoming:"Входящий вызов. Для ответа<br> необходимо наличие Флеш плеера", 
  install:"Установить", lineIsBusy:"Линия занята", unavailable:"Абонент недоступен", callDeclined:"Собеседник отменил вызов", noResponding:"Собеседник не отвечает", noAnswer:"Номер не отвечает или недостаточно денег для звонка", wrongNumber:"Неправильный номер", notEnoughMoney:"Недостаточно денег на счету", microphoneNotAllowed:"Необходимо разрешить<br> доступ к микрофону", micIsBusy:"Микрофон занят другим приложением", camIsBusy:"Камера занята другим приложением", camNotFound:"Вебкамера не установлена", 
  micNotFound:"Микрофон не установлен", incompatible:"Программа собеседника не поддерживает звонки", microphoneUnknown:"Необходимо подойти к микрофону :)", networkError:"Произошла сетевая ошибка,<br> попробуйте позже", networkError2:"Не удалось подключиться к серверу, попробуйте еще раз", networkError3:"Не удалось подключиться к серверу, попробуйте позвонить позже", networkError4:"Ошибка, перелогиньтесь в агенте", networkError5:"Произошла ошибка,<br> попробуйте еще раз", cancelCall:"Вы собираетесь завершить текущий звонок"}, 
  history:{callStart:"Начался разговор", callIncoming:"Звонок от вашего собеседника", callOutgoing:"Вы звоните собеседнику. Ожидание ответа...", callDecline:"Вы отклонили звонок", callUserDecline:"Собеседник отклонил ваш звонок", callEnd:"Звонок завершен", callUserCancel:"Собеседник отменил звонок"}}, promo:{installAgent:"Установи Агент на компьютер", checkNewMail:"Агент проверит почту за тебя и сообщит о новых письмах", notifications:"Уведомления о почте, видеозвонки, сообщения и бесплатные SMS", 
  freeSms:"Бесплатные SMS", sendFromAgent:"отправляйте из Веб-Агента.", birthday:"Сегодня празднует свой<br> День рождения!", tomorrowBirthday:"Завтра празднует свой<br> День рождения!"}, auth:{authorization:"Авторизация", minimize:"Свернуть", email:"Ваш email", password:"Пароль", rememberMe:"Запомнить меня", lostPassword:"Забыли пароль?"}, box:{ok:"Ок", ok_yes:"Да", cancel:"Отменить", ignore:"Игнорировать", spam:"Спам", spamConfirm:"Да, это спам", remove:"Удалить", save:"Сохранить", goOnline:"Включить Агент?", 
  goOnlineForce:"Включить Агент? Другие клиенты будут отключены", askedAuth:"запросил авторизацию", grantAuth:"Авторизовать и добавить", ignoreUser:'Игнорировать пользователя <span class="nwa-special-nick">{{nick}}</span> ?', spamUser:'Пожаловаться на пользователя <span class="nwa-special-nick">{{nick}}</span> и удалить из контактов?', removeUser:'Удалить <span class="nwa-special-nick">{{nick}}</span> из списка контактов?', editStatuses:"Редактирование статусов"}, status:{online:"Онлайн", chat:"Готов поболтать", 
  away:"Отошел", dnd:"Не беспокоить", offline:"Отключён", auth:"Не авторизован", gray:"Не авторизован", conf:"Конференция", tel:"Телефон", mobile:"С мобильного", 5:"Дома", 18:"На работе", 19:"На встрече", 7:"Где я?!", 10:"Гуляю", 47:"В ракете", 22:"Работаю", 26:"В институте", 24:"Телефон", 27:"В школе", 23:"Сплю", 4:"Болею", 9:"Готовлю", 6:"Ем", 21:"Пью кофе", 20:"Пиво", 17:"Курю", 8:"Занято!", 15:"Водные процедуры", 16:"Играю", 28:"Вы ошиблись номером", 51:"Белка", 52:"Звезда", 46:"Череп", 12:"Я креведко", 
  13:"Потерялся", 11:"Я пришелец", 14:"Сошел с ума", 48:"Морской зверь", 53:"Музыка", 29:"Весело", 30:"Ухмылка", 32:"Радостный", 33:"Очкарик", 40:"Любовь", 41:"Сплю", 34:"Тоска", 35:"Плачу", 36:"Ааааа!", 37:"Злой", 38:"Демон", 39:"Попка", 42:"Отлично!", 43:"Победа!", 49:"Круто!", 44:"Кукиш", 45:"Пока!", 50:"Фу!"}, notify:{authRequest:"Запрос авторизации", reply:"Ответить", newMessage:"Новое сообщение", microblog:"Микроблог", timeElapsed:"{{time}} назад", postedMicroblog:"Написал микропост", youHaveSticker:"Вам прислали стикер"}, 
  time:{years:{one:"{{count}} год", few:"{{count}} года", many:"{{count}} лет"}, months:{one:"{{count}} месяц", few:"{{count}} месяца", many:"{{count}} месяцев"}, days:{one:"{{count}} день", few:"{{count}} дня", many:"{{count}} дней"}, hours:{one:"{{count}} час", few:"{{count}} часа", many:"{{count}} часов"}, minutes:{one:"{{count}} минута", few:"{{count}} минуты", many:"{{count}} минут"}}, zodiac:{ololo:"Ололошенька", aries:"Овен", taurus:"Телец", gemini:"Близнецы", cancer:"Рак", leo:"Лев", virgo:"Дева", 
  libra:"Весы", scorpio:"Скорпион", sagittarius:"Стрелец", capricorn:"Козерог", aquarius:"Водолей", pisces:"Рыбы"}, sex:{f:"Женщина", m:"Мужчина"}, month_gen:{"0":"нулямберя", 1:"января", 2:"февраля", 3:"марта", 4:"апреля", 5:"мая", 6:"июня", 7:"июля", 8:"августа", 9:"сентября", 10:"октября", 11:"ноября", 12:"декабря"}, msgHistoryLoading:"История сейчас загрузится...", msgServerHistory:'Серверное хранение истории отключено, изменить настройки можно <a href="//e.mail.ru/cgi-bin/mrimhistory">тут</a>', 
  msgMultSupport:"Собеседник прислал вам мульт :{{alt}}:, однако у вас установлена устаревшая версия Mail.Ru Агента без поддержки мультов. Загрузить самую новую версию вы можете здесь: http://agent.mail.ru/", msgTooLong:"Слишком длинное сообщение", msgTooLongAndCut:"Сообщение слишком длинное, оно обрезано.", msgFlashFail:"Не удается загрузить ролик", msgFlashInstall:"Установите flash плеер для просмотра мульта", msgInvalidUser:"Для продолжения работы необходимо обновить страницу.", msgTooManyConnections:"Слишком много подключений от текущего пользователя.", 
  msgNetworkError:"Сервис временно недоступен. Повторная попытка подключения произойдет через {{delay}} сек. Кликните, чтобы попробовать подключиться сейчас.", msgPartFew:"несколько", pluralRule:function(n) {
    return n % 10 == 1 && n % 100 != 11 ? "one" : U.Array.indexOf([2, 3, 4], n % 10) >= 0 && U.Array.indexOf([12, 13, 14], n % 100) < 0 ? "few" : "many"
  }}
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var UI = WA.ui;
  UI.Component = WA.extend(Object, {isComponent:true, constructor:function(config) {
    this.initialConfig = config || {};
    this.id = this.initialConfig.id;
    this.rendered = false;
    this.autoRender = this.initialConfig.autoRender || false;
    this.beforeShowEvent = new WA.util.Event;
    this.beforeShowEvent.on(this._onBeforeShow, this);
    this.beforeHideEvent = new WA.util.Event;
    this.beforeHideEvent.on(this._onBeforeHide, this);
    this.showEvent = new WA.util.Event;
    this.showEvent.on(this._onShow, this);
    this.hideEvent = new WA.util.Event;
    this.hideEvent.on(this._onHide, this);
    this.renderEvent = new WA.util.Event;
    this.initComponent()
  }, getId:function() {
    if(!this.id) {
      if(this.el) {
        var id = this.el.getId();
        if(id) {
          this.id = id
        }else {
          this.id = this.el.dom.id = WA.generateId()
        }
      }else {
        this.id = WA.generateId()
      }
    }
    return this.id
  }, getEl:function() {
    return this.el
  }, initComponent:function() {
  }, render:function(ct) {
    this.container = WA.get(ct);
    if(!this.el) {
      if(this.autoEl) {
        this.el = this.container.createChild(this.autoEl)
      }else {
        this._onRender(this.container)
      }
    }
    var id = this.el.getId();
    if(id) {
      if(this.id && this.id !== id) {
        WA.error("Different ids: " + this.id + ", " + id)
      }else {
        this.id = id
      }
    }else {
      if(this.id) {
        this.el.dom.id = this.id
      }
    }
    if(this.initialConfig.cls) {
      this.el.addClass(this.initialConfig.cls)
    }
    if(this.initialConfig.fadeIn && !WA.isIE) {
      this.el.addClass("nwa_fadein")
    }
    this.rendered = true;
    this._onAfterRender();
    this.renderEvent.fire(this)
  }, _onRender:function(ct) {
    WA.abstractError()
  }, _onAfterRender:function() {
  }, isVisible:function() {
    return this.rendered && this.el.isVisible()
  }, setVisible:function(visible) {
    if(!this.rendered && this.autoRender !== false && visible) {
      this.render(WA.isBoolean(this.autoRender) ? WA.getBody() : this.autoRender)
    }
    if(visible !== this.isVisible()) {
      var p = visible ? "show" : "hide";
      var beforeEvent = this["before" + U.String.capitalize(p) + "Event"];
      if(beforeEvent.fire(this) !== false) {
        this.el.setVisible(visible);
        if(this.initialConfig.fadeIn && !WA.isIE) {
          if(visible) {
            WA.setTimeout(WA.createDelegate(function() {
              this.el.setStyle("opacity", 1)
            }, this), 10)
          }else {
            this.el.setStyle("opacity", 0)
          }
        }
        var event = this[p + "Event"];
        event.fire(this)
      }
      return this
    }
  }, toggle:function() {
    this.setVisible(!this.isVisible())
  }, show:function() {
    return this.setVisible(true)
  }, hide:function() {
    return this.setVisible(false)
  }, _onBeforeShow:function(me) {
  }, _onBeforeHide:function(me) {
  }, _onShow:function(me) {
    if(this.initialConfig.modal) {
      if(WA.isIE) {
        this.overlayEl = (this.initialConfig.overlay || this.container).createChild({tag:"div", cls:"nwa-overlay-div"}, true)
      }else {
        (this.initialConfig.overlay || this.container).addClass("nwa-overlay")
      }
    }
    if(this.initialConfig.hideOnEscape) {
      WA.getDoc().on("keydown", this._onEscape, this)
    }
  }, _onHide:function(me) {
    if(this.initialConfig.modal) {
      (this.initialConfig.overlay || this.container).removeClass("nwa-overlay");
      if(this.overlayEl) {
        this.overlayEl.remove()
      }
    }
    WA.getDoc().un("keydown", this._onEscape, this)
  }, _onEscape:function(e) {
    if(e.keyCode == 27) {
      this.hide()
    }
  }, destroy:function() {
    this.initialConfig = null;
    this.beforeShowEvent.removeAll();
    this.beforeShowEvent = null;
    this.beforeHideEvent.removeAll();
    this.beforeHideEvent = null;
    this.showEvent.removeAll();
    this.showEvent = null;
    this.hideEvent.removeAll();
    this.hideEvent = null;
    this.renderEvent.removeAll();
    this.renderEvent = null;
    this.container = null;
    if(this.rendered) {
      this.el.remove();
      this.el = null
    }
  }})
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent;
  var UI = WA.ui;
  UI.Container = WA.extend(UI.Component, {defaultType:null, initComponent:function() {
    UI.Container.superclass.initComponent.call(this);
    this._initItems()
  }, _initItems:function() {
    var items = this.initialConfig.items || [];
    delete this.initialConfig.items;
    this.items = [];
    WA.util.Array.each(items, function(item) {
      this.items.push(this._lookupItemComponent(item))
    }, this)
  }, _lookupItemComponent:function(cmp) {
    return this._lookupComponent(cmp, this.defaultType)
  }, _lookupComponent:function(cmp, defaultType) {
    if(defaultType && !WA.isFunction(cmp.render)) {
      return new defaultType(cmp)
    }else {
      return cmp
    }
  }, _onAfterRender:function() {
    UI.Container.superclass._onAfterRender.call(this);
    WA.util.Array.each(this.items, function(item, index) {
      this._renderItem(this.el, item, index)
    }, this)
  }, _renderItem:function(container, item, index) {
    item.render(container)
  }, _destroyItem:function(item) {
    item.destroy()
  }, destroy:function() {
    while(this.items.length > 0) {
      this._destroyItem(this.items.shift())
    }
    this.items = null;
    UI.Container.superclass.destroy.call(this)
  }})
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent;
  var UI = WA.ui;
  UI.Window = WA.extend(UI.Container, {initComponent:function() {
    UI.Window.superclass.initComponent.call(this);
    this.closeAction = this.closeAction || this.initialConfig.closeAction || "destroy";
    this.closeBtn = new WA.ui.Button({cls:"nwa-window__close", handler:function() {
      this.close()
    }, scope:this});
    this._initToolbar("bbar")
  }, _initToolbar:function(key) {
    var config = this.initialConfig[key];
    if(config) {
      var defaultType = UI.Toolbar;
      if(WA.isArray(config)) {
        this[key] = this._lookupComponent({items:config}, defaultType)
      }else {
        this[key] = this._lookupComponent(config, defaultType)
      }
      this[key].renderEvent.on(function(bar) {
        bar.el.addClass("nwa-window-" + key)
      })
    }
  }, _onRender:function(container) {
    var id = this.getId();
    var ids = {header:id + "-header", body:id + "-body", footer:id + "-footer"};
    var cssPrefix = "nwa-window";
    var items = [{id:ids.header, cls:cssPrefix + "__header", html:this.initialConfig.title}, {id:ids.body, cls:cssPrefix + "__body"}];
    if(this.bbar) {
      items.push({id:ids.footer, cls:cssPrefix + "__footer"})
    }
    this.el = container.createChild({cls:cssPrefix, style:"display: none", children:items});
    this.header = WA.get(ids.header);
    if(this.closeBtn) {
      this.closeBtn.render(ids.header)
    }
    this.body = WA.get(ids.body);
    if(this.bbar) {
      this.bbar.render(ids.footer)
    }
  }, _renderItem:function(container, item, index) {
    UI.Window.superclass._renderItem.call(this, this.body, item, index)
  }, close:function() {
    this[this.closeAction]()
  }, destroy:function() {
    if(this.bbar) {
      this.bbar.destroy();
      this.bbar = null
    }
    UI.Window.superclass.destroy.call(this)
  }})
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent;
  var UI = WA.ui;
  UI.Button = WA.extend(UI.Component, {initComponent:function() {
    UI.Button.superclass.initComponent.call(this);
    var menu = this.initialConfig.menu;
    if(menu) {
      if(menu.render) {
        this.menu = menu
      }else {
        if(WA.isArray(menu)) {
          this.menu = new UI.menu.Menu({items:menu})
        }else {
          this.menu = new UI.menu.Menu(menu)
        }
      }
      delete this.initialConfig.menu
    }
    this.disabled = !!this.initialConfig.disabled
  }, _onRender:function(ct) {
    this.el = ct.createChild({tag:"button", cls:"nwa-button " + (this.initialConfig.disabled && this.initialConfig.disabledCls ? this.initialConfig.disabledCls : ""), title:this.initialConfig.tooltip || "", html:this.initialConfig.text});
    if(this.initialConfig.disabled) {
      this.el.setAttribute("disabled", "disabled")
    }
    if(this.menu) {
      this.menu.setControlElement(this.el)
    }
  }, disable:function() {
    if(!this.disabled) {
      this.disabled = true;
      this.el.setAttribute("disabled", "disabled");
      if(this.initialConfig.disabledCls) {
        this.el.addClass(this.initialConfig.disabledCls)
      }
    }
  }, enable:function() {
    if(this.disabled) {
      this.disabled = false;
      this.el.removeAttribute("disabled");
      this.el.removeClass(this.initialConfig.disabledCls)
    }
  }, _onAfterRender:function() {
    UI.Button.superclass._onAfterRender.call(this);
    this.el.on(this.initialConfig.clickEvent || "click", this._onClick, this)
  }, _onClick:function(e) {
    if(e.button === 0 && !this.disabled) {
      if(e && this.initialConfig.preventDefault !== false) {
        e.preventDefault()
      }
      var handler = this.initialConfig.handler;
      if(handler) {
        handler.call(this.initialConfig.scope || this, this, e)
      }
      if(this.menu) {
        if(!this.menu.rendered) {
          this.menu.render(this.container)
        }
        this.menu.toggle()
      }
    }
  }, setText:function(text) {
    this.el.update(this.initialConfig.text = text)
  }, getText:function() {
    return this.initialConfig.text
  }, destroy:function() {
    this.el.un(this.initialConfig.clickEvent || "click", this._onClick, this);
    if(this.menu) {
      this.menu.destroy();
      this.menu = null
    }
    UI.Button.superclass.destroy.call(this)
  }});
  UI.ToggleButton = WA.extend(UI.Button, {_pressedClassName:"nwa-button_pressed", state:false, _onRender:function(ct) {
    UI.ToggleButton.superclass._onRender.call(this, ct);
    if(this.state) {
      this.el.addClass(this._pressedClassName)
    }
  }, _onClick:function(e) {
    UI.ToggleButton.superclass._onClick.call(this, e);
    var newState = !this.state;
    var stateHandler = this.initialConfig.stateHandler;
    if(stateHandler && stateHandler.call(this.initialConfig.scope || this, newState, this) !== false) {
      this.setState(newState)
    }
  }, setState:function(newState) {
    this.state = newState;
    this.el.removeClass(this._pressedClassName);
    if(this.state) {
      this.el.addClass(this._pressedClassName)
    }
  }});
  UI.LinkButton = WA.extend(UI.Button, {_onRender:function(ct) {
    var children = [];
    if(this.initialConfig.iconCls) {
      children.push({tag:"img", cls:"nwa-img-button " + this.initialConfig.iconCls, src:"//img1.imgsmail.ru/0.gif", align:"top", title:this.initialConfig.tooltip || ""})
    }
    children.push({tag:"span", html:this.initialConfig.text || ""});
    var linkConfig = {tag:"a", cls:"nwa-button", href:"javascript:void(0)", children:children};
    if(this.initialConfig.linkAttributes) {
      WA.apply(linkConfig, this.initialConfig.linkAttributes)
    }
    this.el = ct.createChild(linkConfig)
  }, setText:function(text) {
    this.initialConfig.text = text;
    if(this.rendered) {
      var lastEl = this.el.last();
      lastEl.update(this.initialConfig.text)
    }
  }, setIconCls:function(cls) {
    if(this.rendered) {
      this.el.first().removeClass(this.initialConfig.iconCls).addClass(cls)
    }
    this.initialConfig.iconCls = cls
  }});
  UI.ImageButton = WA.extend(UI.Button, {initComponent:function() {
    UI.ImageButton.superclass.initComponent.call(this);
    this.initialConfig.iconCls = this.initialConfig.iconCls || " "
  }, _onRender:function(ct) {
    UI.ImageButton.superclass._onRender.call(this, ct);
    this.el.createChild({tag:"span", cls:"nwa-img-button " + (this.initialConfig.iconCls || ""), title:this.initialConfig.tooltip || "", html:"&nbsp;"})
  }, setIconCls:function(cls) {
    if(this.rendered) {
      this.el.first().removeClass(this.initialConfig.iconCls).addClass(cls)
    }
    this.initialConfig.iconCls = cls
  }});
  UI.TabButton = WA.extend(UI.Button, {_onRender:function(ct) {
    var buttonConfig = {tag:"div", cls:"nwa-button-tab", children:[{tag:"div", cls:"nwa-button-tab__inner ", title:this.initialConfig.title || "", children:[{tag:"span", cls:"nwa-button-tab__icon " + (this.initialConfig.defaultIconCls || "") + " " + (this.initialConfig.iconCls || "")}, {tag:"span", cls:"nwa-button-tab__nick", html:this.initialConfig.text || ""}]}, {tag:"div", cls:"nwa-msg-counter"}]};
    if(this.initialConfig.closable) {
      buttonConfig.children.push({tag:"div", cls:"nwa-button-tab__close nwa_action_close", children:[{tag:"span"}]})
    }
    if(this.initialConfig.fader) {
      buttonConfig.children[0].children.push({tag:"div", cls:"nwa-button-tab__nick-fadeout"})
    }
    if(this.initialConfig.tabAttributes) {
      WA.apply(buttonConfig, this.initialConfig.tabAttributes)
    }
    this.el = ct.createChild(buttonConfig)
  }, setState:function() {
  }, setText:function(text) {
    this.initialConfig.text = text;
    if(this.rendered) {
      var lastEl = this.el.first().first().next();
      lastEl.update(this.initialConfig.text)
    }
  }, setTitle:function(title) {
    if(this.rendered) {
      this.el.first().setAttribute("title", title)
    }
  }, setCount:function(val) {
    if(this.rendered) {
      var countEl = this.el.first().next();
      countEl.update(val)
    }
  }, setIconCls:function(cls) {
    if(this.rendered) {
      this.el.first().first().removeClass(this.initialConfig.iconCls).addClass(cls)
    }
    this.initialConfig.iconCls = cls
  }, setAttr:function(name, value) {
    this.el.setAttribute(name, value)
  }})
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent;
  var UI = WA.ui;
  var U = WA.util;
  UI.TextField = WA.extend(UI.Component, {initComponent:function() {
    UI.TextField.superclass.initComponent.call(this);
    this.hintText = this.initialConfig.hintText || "";
    this.hintClass = this.initialConfig.hintClass || "nwa_hint_msg";
    this.clientValue = "";
    this.focusEvent = new WA.util.Event;
    this.blurEvent = new WA.util.Event
  }, textVal:function(value, preventHint) {
    return this.val(value, preventHint)
  }, _onRender:function(ct) {
    var config = this.initialConfig;
    var o;
    if(config.multiline) {
      o = {tag:"textarea", cls:"nwa-textfield"}
    }else {
      o = {tag:"input", type:"text", cls:"nwa-textfield"}
    }
    if(config.maxLength) {
      o.maxlength = config.maxLength
    }
    this.el = ct.createChild(o)
  }, val:function(value, preventHint) {
    if(typeof value === "undefined") {
      if(this.rendered) {
        return this.el.dom.value === this.hintText ? "" : this.el.dom.value
      }
      return null
    }
    if(this.rendered && !this.el.dom.disabled) {
      this.el.dom.value = value || "";
      if(preventHint !== true || this.el.dom.value != "") {
        this._checkHintValue()
      }
    }
  }, fix:function(state) {
    this.el.dom.disabled = state !== false
  }, _onAfterRender:function() {
    this.el.dom.value = this.initialConfig.value || "";
    this._checkHintValue();
    if(this.hintText && this.el.dom.value == this.hintText) {
      this.el.addClass(this.hintClass)
    }
    this.el.on("focus", this._onFocus, this);
    this.el.on("blur", this._onBlur, this)
  }, getCursor:function() {
    var pos = 0;
    if(document.selection) {
      this.focus();
      var sel = document.selection.createRange();
      sel.moveStart("character", -this.el.dom.value.length);
      pos = sel.text.length
    }else {
      if(this.el.dom.selectionStart || this.el.dom.selectionStart == "0") {
        pos = this.el.dom.selectionStart
      }
    }
    return pos
  }, focus:function(pos) {
    try {
      if(pos > -1) {
        if(this.el.dom.createTextRange) {
          var textRange = this.el.dom.createTextRange();
          textRange.collapse(true);
          textRange.moveEnd("character", pos);
          textRange.moveStart("character", pos);
          textRange.select()
        }else {
          if(this.el.dom.setSelectionRange) {
            this.el.dom.setSelectionRange(pos, pos)
          }
        }
      }else {
        this.el.dom.focus()
      }
    }catch(e) {
    }
  }, blur:function() {
    try {
      this.el.dom.blur()
    }catch(e) {
    }
  }, select:function() {
    this.el.dom.select()
  }, _onFocus:function() {
    if(this.hintText && this.el.dom.value === this.hintText) {
      this.el.dom.value = ""
    }
    this.el.removeClass(this.hintClass);
    this.focusEvent.fire(this)
  }, _onBlur:function() {
    this._checkHintValue();
    this.blurEvent.fire(this)
  }, _checkHintValue:function() {
    var domValue = U.String.trim(this.el.dom.value);
    if(this.hintText) {
      if(domValue === "" || domValue == this.hintText) {
        this.el.addClass(this.hintClass);
        this.el.dom.value = this.hintText
      }else {
        this.el.removeClass(this.hintClass)
      }
    }
  }, destroy:function() {
    this.focusEvent.removeAll();
    this.focusEvent = null;
    this.blurEvent.removeAll();
    this.blurEvent = null;
    UI.TextField.superclass.destroy.call(this)
  }});
  UI.NameBox = WA.extend(UI.Component, {constructor:function() {
    UI.NameBox.superclass.constructor.apply(this, arguments);
    this._editMode = false;
    this.editOk = new U.Event
  }, _onRender:function(ct) {
    this.el = ct.createChild({cls:"nwa-namebox", children:[{cls:"nwa-namebox__label"}, {cls:"nwa-namebox__fadeout"}]})
  }, _sanitize:function(val) {
    return val.replace(/(\\|\/|<|>|&)/g, "")
  }, _editOn:function() {
    if(this._editMode) {
      return
    }
    if(!this.editField) {
      this.editField = new UI.TextField({cls:"nwa-namebox__input"});
      this.editField.render(this.el);
      this.editField.getEl().on("click", function(e) {
        e.stopEvent()
      });
      this.editField.getEl().on("keydown", function(e) {
        if(e.keyCode == 13) {
          var val = U.String.trim(this._sanitize(this.editField.val()));
          if(val != "") {
            this.setName(val);
            this.editOk.fire(val);
            this._editOff()
          }else {
            this.editField.val(val)
          }
          e.preventDefault()
        }else {
          if(e.keyCode == 27) {
            this._editOff()
          }
        }
      }, this);
      this.editField.blurEvent.on(function() {
        this._editOff()
      }, this)
    }
    this._editMode = true;
    this.el.addClass("nwa-namebox_editor");
    this.editField.val(U.String.entityDecode(this.el.first().dom.innerHTML));
    this.editField.focus();
    this.editField.select()
  }, _editOff:function() {
    if(!this._editMode) {
      return
    }
    this._editMode = false;
    this.editField.blur();
    this.el.removeClass("nwa-namebox_editor")
  }, setName:function(val) {
    this.el.first().update(U.String.htmlEntity(val))
  }, edit:function(force) {
    if(force !== false) {
      this._editOn()
    }else {
      this._editOff()
    }
  }})
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent, UI = WA.ui, U = WA.util, S, KEY_CODES = {ENTER:13, BACKSPACE:8, ARR_LEFT:37, ARR_UP:38, ARR_RIGHT:39, ARR_DOWN:40}, LINK_START_RE = /(www\.|https?:\/\/)[\-\w\d_]+$/, ELEMENT_NODE = 1, TEXT_NODE = 3, WHEEL_STEP = 15;
  S = UI.SmilesTextField = WA.extend(UI.TextField, {constructor:function() {
    UI.SmilesTextField.superclass.constructor.apply(this, arguments)
  }, smileBeforeNode:null, _onRender:function(ct) {
    var config = this.initialConfig, o = {tag:"div", cls:"nwa-textfield nwa-textfield_rich", contenteditable:"true"};
    if(config.multiline) {
      o.cls += " new-textfield_multiline"
    }
    if(config.maxLength) {
      o.maxlength = config.maxLength
    }
    this.el = ct.createChild(o);
    this.el.on("keydown", this._onKeydown, this);
    this.el.on("keyup", this._onKeyup, this);
    this.el.on("keypress", this._onKeypress, this);
    this.el.on("click", this._onClick, this);
    this.el.on("mousemove", this._onMousemove, this);
    this.el.on("focus", this._onFocus, this);
    this.el.on("blur", this._onBlur, this);
    this.el.on("contextmenu", this._onContextMenu, this);
    this.el.on("DOMMouseScroll", this._wheel, this);
    this.el.on("mousewheel", this._wheel, this);
    this._timer = new U.DelayedTask({fn:function() {
      this._removeInlineStyles();
      this._timer.start()
    }, interval:500, scope:this});
    this._timer.start();
    this._preventSmilesEditing(this.el)
  }, _wheel:function(e) {
    e.preventDefault();
    e = e.browserEvent;
    var delta = e.wheelDelta ? e.wheelDelta / 120 : -e.detail / 3;
    this.el.dom.scrollTop += delta > 0 ? -WHEEL_STEP : WHEEL_STEP
  }, val:function(value, preventHint) {
    this._lastAnchorNode = this._lastAnchorOffset = null;
    if(value === undefined) {
      if(this.rendered) {
        return this.el.dom.innerHTML === this.hintText ? "" : this.el.dom.innerHTML
      }
      return null
    }
    if(this.rendered) {
      this.el.dom.innerHTML = value || "";
      if(preventHint !== true || this.el.dom.innerHTML !== "") {
        this._checkHintValue()
      }
    }
  }, textVal:function(value, preventHint) {
    var start = +new Date;
    if(value === undefined) {
      var ret = null;
      if(this.rendered) {
        if(this.el.dom.innerHTML === this.hintText) {
          return""
        }
        ret = this.el.dom.innerHTML;
        ret = ret.replace(/(\n|\r\n)/g, "");
        ret = ret.replace(/<br[^>]*>/gi, "\n");
        ret = WA.DialogsAgent.Smiles.stripTagsExceptSmiles(ret);
        ret = WA.DialogsAgent.Smiles.recoilProccessedMessage(ret);
        ret = U.String.entityDecode(ret);
        ret = ret.replace(/&(\w+|#\d+);?/g, function(m) {
          if(m.match(/&amp;?/)) {
            return"&"
          }
          return""
        })
      }
      return ret
    }
    if(this.rendered) {
      this.el.dom.innerText = value || "";
      if(preventHint !== true || this.el.dom.innerText != "") {
        this._checkHintValue()
      }
    }
  }, focus:function(force) {
    try {
      this.el.dom.focus()
    }catch(e) {
    }
    if(!U.Selection.isFocused(this.el.dom) || force) {
      this._setCaret()
    }
  }, _removeInlineStyles:function() {
    U.DomHelper.htmlTree(this.el.dom, function(el) {
      if(el.getAttribute("style")) {
        el.setAttribute("style", null)
      }
    })
  }, _setCaret:function() {
    var sel = U.Selection.getSelection(), range = U.Selection.createRange();
    if(this._lastAnchorNode && this._lastAnchorNode.parentNode) {
      try {
        range.setStart(this._lastAnchorNode, this._lastAnchorOffset)
      }catch(e) {
        range.setStart(this.el.dom, this.el.dom.childNodes.length)
      }
    }else {
      range.setStart(this.el.dom, this.el.dom.childNodes.length)
    }
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range)
  }, _saveCaretPosition:function() {
    var sel = U.Selection.getSelection();
    if(sel) {
      this._lastAnchorNode = sel.anchorNode;
      this._lastAnchorOffset = sel.anchorOffset
    }else {
      this._lastAnchorNode = this._lastAnchorOffset = null
    }
  }, _onFocus:function() {
    if(this.hintText && this.el.dom.innerHTML === this.hintText) {
      this.el.dom.innerHTML = "";
      this._setCaret()
    }
    this.el.removeClass(this.hintClass);
    this.focusEvent.fire(this)
  }, _onBlur:function() {
    var sel = U.Selection.getSelection();
    if(!sel) {
      return
    }
    this._checkHintValue();
    this.blurEvent.fire(this)
  }, _checkHintValue:function() {
    if(WA.isWebKit && U.Selection.isFocused(this.el.dom)) {
      return
    }
    var domValue = U.String.trim(this.el.dom.innerHTML.replace(/<br\/?>/gi, ""));
    if(this.hintText) {
      if(domValue === "" || domValue == this.hintText) {
        this.el.addClass(this.hintClass);
        this.el.dom.innerHTML = this.hintText
      }else {
        this.el.removeClass(this.hintClass)
      }
    }
  }, _onContextMenu:function(e) {
    this._mouseClickHandler(e)
  }, _onClick:function(e) {
    this._mouseClickHandler(e);
    this._saveCaretPosition()
  }, _mouseClickHandler:function(e) {
    var target = e.getTarget(), sel, range, caretToLeft;
    if(target.tagName.toLowerCase() == "img") {
      sel = U.Selection.getSelection();
      range = U.Selection.createRange();
      caretToLeft = target.offsetX < target.width / 2;
      if(caretToLeft) {
        if(target.previousSibling) {
          range.setStartAfter(target.previousSibling)
        }else {
          range.setStart(sel.anchorNode, 0)
        }
        this.smileBeforeNode = target
      }else {
        range.setStartAfter(target)
      }
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range)
    }else {
      if(!WA.isIE) {
        this.focus()
      }
    }
  }, _onMousemove:function(e) {
    var bE = e.browserEvent, target = e.getTarget(), offsetX;
    if(target.className.indexOf("nwa-smile_inline") >= 0) {
      if(bE.offsetX) {
        offsetX = bE.offsetX
      }else {
        if(bE.layerX) {
          offsetX = bE.layerX
        }
      }
      target.offsetX = offsetX
    }
  }, _onKeydown:function(e) {
    e.stopPropagation();
    var sel = U.Selection.getSelection();
    if(!sel) {
      return
    }
    var nodeBeforeCaret = U.Selection.getNodeBeforeCaret(), range = U.Selection.createRange(), textSmileNode;
    this.smileBeforeNode = null;
    if(sel.isCollapsed && nodeBeforeCaret && nodeBeforeCaret.nodeType === ELEMENT_NODE && e.keyCode === KEY_CODES.BACKSPACE) {
      if(this._isSmile(nodeBeforeCaret)) {
        if(nodeBeforeCaret.getAttribute("data-immutable")) {
          nodeBeforeCaret.parentNode.removeChild(nodeBeforeCaret)
        }else {
          textSmileNode = this._deleteSmile(this.el.dom, nodeBeforeCaret);
          range.setStartAfter(textSmileNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          this._justDeletedSmile = true
        }
        e.stopEvent()
      }
    }
  }, _checkScroll:function(e) {
    var dom = this.el.dom, height = dom.clientHeight, maxScrollTop = dom.scrollHeight - height;
    if(e.keyCode == KEY_CODES.ARR_UP && dom.scrollTop < 12 && dom.scrollTop != 0) {
      dom.scrollTop = 0
    }else {
      if(maxScrollTop - dom.scrollTop < 12 && dom.scrollTop != maxScrollTop) {
        dom.scrollTop = maxScrollTop
      }
    }
  }, _onKeypress:function(e) {
    e.stopPropagation();
    var bE = e.browserEvent, charCode = bE.keyCode ? bE.keyCode : bE.which, symbol = U.String.trim(String.fromCharCode(charCode)), shouldCheck = true, arrowsCodes = [KEY_CODES.ARR_LEFT, KEY_CODES.ARR_RIGHT];
    this._changed = true;
    if(U.Array.indexOf(arrowsCodes, charCode) > 0) {
      shouldCheck = false
    }
    if(!(symbol && WA.DialogsAgent.Smiles.SYMBOLS.indexOf(symbol) >= 0)) {
      shouldCheck = false
    }
    this._shouldCheckForSmiles = shouldCheck
  }, _onKeyup:function(e) {
    e.stopPropagation();
    this._saveCaretPosition();
    if(!this._shouldCheckForSmiles) {
      return
    }
    var sel = U.Selection.getSelection();
    if(!sel) {
      return
    }
    var range = U.Selection.createRange(), textNode = sel.anchorNode, textBeforeCaret, smileTextCodeMatch, smileTextCodeLength, smileNode;
    this._replaceLinkTags(this.el.dom);
    if(textNode && textNode.data) {
      textBeforeCaret = textNode.data.substr(0, sel.anchorOffset)
    }
    if(textNode && textNode.data && !LINK_START_RE.test(textNode.data) && (smileTextCodeMatch = WA.DialogsAgent.Smiles.smileCodeLastRE.exec(textBeforeCaret))) {
      value = textNode.data.substr(0, sel.anchorOffset).replace(WA.DialogsAgent.Smiles.smileCodeLastRE, WA.DialogsAgent.Smiles.buildSmilePackage);
      value = WA.DialogsAgentView.prepareMessageText(value, true);
      smileTextCodeLength = smileTextCodeMatch.shift().length;
      smileNode = U.DomHelper.elementFromHtml(value);
      WA.DialogsAgent.Smiles.insertSmile(smileNode);
      textNode.data = textNode.data.substr(0, textNode.data.length - smileTextCodeLength)
    }
    this._shouldCheckForSmiles = false;
    if(WA.isIE) {
      this.checkScroll()
    }
  }, _getSmileText:function(dom) {
    var name = dom.className.match(/nwa\-(set\d+_obj\d+)/)[1], smileObj = WA.DialogsAgent.Smiles.getSmileObjByName(name);
    return WA.DialogsAgent.Smiles.getVisualAlt(smileObj)
  }, _deleteSmile:function(dom, smileNode) {
    var text = this._getSmileText(smileNode), textSmileNode = document.createTextNode(text), parent = smileNode.parentNode;
    parent.replaceChild(textSmileNode, smileNode);
    return textSmileNode
  }, _isSmile:function(dom) {
    return dom.className.indexOf("nwa-smile_inline") > -1
  }, checkScroll:function() {
    var sel = WA.util.Selection.getSelection(), range = sel.getRangeAt(0), dummyNode = document.createElement("span"), domEl = this.getEl().dom, isCaretVisible;
    WA.apply(dummyNode.style, {"height":"0", "width":"0"});
    range.insertNode(dummyNode);
    dummyOffsetTop = dummyNode.offsetTop;
    dummyNode.parentNode.removeChild(dummyNode);
    isCaretVisible = domEl.clientHeight + domEl.scrollTop >= dummyOffsetTop + 15;
    if(!isCaretVisible) {
      domEl.scrollTop = dummyOffsetTop
    }
  }, _replaceLinkTags:function(dom) {
    var links = dom.getElementsByTagName("a");
    if(links.length) {
      for(var i = 0;i < links.length;i++) {
        var link = links[i];
        var linkTextNode = document.createTextNode(link.href);
        link.parentNode.replaceChild(linkTextNode, link)
      }
    }
  }, _stopEventHandler:function(e) {
    e.stopEvent()
  }, _preventSmilesEditing:function(el) {
    el.on("resizestart", this._stopEventHandler);
    el.on("drop", this._stopEventHandler);
    el.on("dragover", this._stopEventHandler);
    el.on("dragstart", this._stopEventHandler);
    if(!WA.isIE && document.execCommand) {
      try {
        document.execCommand("enableObjectResizing", false, false)
      }catch(e) {
      }
    }
  }})
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent;
  var UI = WA.ui;
  UI.Layer = WA.extend(UI.Component, {constructor:function() {
    UI.Layer.superclass.constructor.apply(this, arguments);
    this.initialConfig.hideOnEscape = true
  }, autoEl:{tag:"div", style:"display: none"}, _onShow:function() {
    UI.Layer.superclass._onShow.call(this);
    WA.getBody().on("mousedown", this._onClick, this)
  }, _onHide:function() {
    UI.Layer.superclass._onHide.call(this);
    WA.getBody().un("mousedown", this._onClick, this)
  }, _onAncestorClick:function(el, isSelf, e) {
  }, _onClick:function(e) {
    if(!this.isVisible() || e.button !== 0) {
      return
    }
    var isAncestor = false;
    var isSelf = false;
    var target = e.getTarget(true);
    if(target) {
      isSelf = this.el.equals(target);
      isAncestor = isSelf || this.el.contains(target)
    }
    if(isAncestor) {
      this._onAncestorClick(target, isSelf, e);
      if(this.initialConfig.hideOnClick) {
        this.hide()
      }
    }else {
      this.hide()
    }
  }})
})();
WebAgent.namespace("WebAgent.ui.menu");
(function() {
  var WA = WebAgent;
  var UI = WA.ui;
  var M = UI.menu;
  var Layer = WA.extend(UI.Layer, {constructor:function(menu, config) {
    this.menu = menu;
    this.controlEl = config.controlEl || [];
    if(this.controlEl && this.controlEl.length == null) {
      this.controlEl = [this.controlEl]
    }
    Layer.superclass.constructor.call(this, config)
  }, _onAncestorClick:function(el, isSelf, e) {
    if(!isSelf) {
      var c = el;
      var index = null;
      while(c && !c.equals(this.menu.el)) {
        index = parseInt(c.getAttribute("menu_index"));
        if(WA.isNumber(index)) {
          this.menu.itemClickEvent.fire(this, this.menu.items[index], e);
          break
        }else {
          c = c.parent()
        }
      }
    }
  }, _onClick:function(e) {
    if(this.initialConfig.autoHide === false) {
      return true
    }
    var target = e.getTarget(true);
    for(var i = 0, len = this.controlEl.length;i < len;i++) {
      if(this.controlEl[i].contains(target)) {
        return false
      }
    }
    Layer.superclass._onClick.call(this, e)
  }});
  var Menu = M.Menu = WA.extend(UI.Container, {initComponent:function() {
    Menu.superclass.initComponent.call(this);
    this.controlEl = this.initialConfig.controlEl || null;
    this.itemClickEvent = new WA.util.Event
  }, _onRender:function(container) {
    this.layer = new Layer(this, {hideOnClick:this.initialConfig.hideOnClick !== false, fadeIn:this.initialConfig.fadeIn === true, controlEl:this.controlEl, autoHide:this.initialConfig.autoHide !== false});
    this.layer.hideEvent.on(function() {
      this.hideEvent.fire()
    }, this);
    this.layer.render(container);
    this.el = this.layer.el.createChild({cls:"nwa-menu"})
  }, _lookupItemComponent:function(cmp) {
    if(cmp === "-") {
      return new M.Separator(this, cmp)
    }else {
      if(cmp instanceof M.Item) {
        return cmp
      }else {
        var defaultType = this.defaultType || M.Button;
        return this._lookupComponent(cmp, defaultType)
      }
    }
  }, _renderItem:function(container, item, index) {
    var ct = this._getItemRenderContainer();
    Menu.superclass._renderItem.call(this, ct, item, index);
    item.el.setAttribute("menu_index", index)
  }, _getItemRenderContainer:function() {
    return this.el
  }, isVisible:function() {
    return this.layer.isVisible()
  }, setControlElement:function(el) {
    this.controlEl = el
  }, _onShow:function(me) {
    Menu.superclass._onShow.call(this, me);
    this.layer.show();
    if(WA.isIE) {
      this._reflowItems()
    }
  }, _reflowItems:function() {
    WA.util.Array.each(this.items, function(item, index) {
      if(item.reflow) {
        item.reflow()
      }
    }, this)
  }, _onHide:function(me) {
    Menu.superclass._onHide.call(this, me);
    this.layer.hide()
  }, destroy:function() {
    this.itemClickEvent.removeAll();
    this.itemClickEvent = null;
    this.layer.destroy();
    this.layer = null;
    Menu.superclass.destroy.call(this)
  }});
  M.Item = WA.extend(Object, {constructor:function(config) {
    this.initialConfig = config
  }, render:function(container) {
    this._onRender(container);
    this.el.addClass("nwa-menu-item")
  }, _onRender:function(container) {
    WA.abstractError()
  }, destroy:function() {
    this.initialConfig = null;
    if(this.el) {
      this.el.remove();
      this.el = null
    }
  }});
  M.Separator = WA.extend(M.Item, {_onRender:function(container) {
    this.el = container.createChild({cls:"nwa-menu-separator"})
  }});
  M.Button = WA.extend(M.Item, {constructor:function(config) {
    var cfg = WA.applyIf({clickEvent:"mousedown"}, config);
    this.button = new UI.LinkButton(cfg);
    M.Button.superclass.constructor.call(this, cfg)
  }, _onRender:function(container) {
    this.el = container.createChild({cls:"nwa-menu-button"});
    this.button.render(this.el)
  }, reflow:function(container) {
    if(this.button) {
      this.button.destroy();
      this.button = new UI.LinkButton(this.initialConfig);
      this.button.render(this.el)
    }
  }, destroy:function() {
    this.button.destroy();
    this.button = null;
    M.Button.superclass.destroy.call(this)
  }});
  M.Image = WA.extend(M.Item, {_onRender:function(container) {
    var config = this.initialConfig;
    var o = {tag:"div", title:config.title};
    if(config.path) {
      o.style = "background-image: url(" + config.path + ")"
    }
    if(config.cls) {
      o.cls = config.cls
    }
    this.el = container.createChild(o);
    if(config.text) {
      this.el.update(config.text)
    }
  }})
})();
WebAgent.namespace("WebAgent.ui.menu");
(function() {
  var WA = WebAgent;
  var M = WA.ui.menu;
  M.ImageMenu = WA.extend(M.Menu, {defaultType:M.Image, _onAfterRender:function() {
    M.ImageMenu.superclass._onAfterRender.call(this);
    this.el.addClass("nwa-image-menu");
    var ct = this._getItemRenderContainer();
    ct.createChild({cls:"nwa-clear-both"})
  }})
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent;
  var UI = WA.ui;
  UI.Toolbar = WA.extend(UI.Container, {defaultType:UI.Button, _onRender:function(ct) {
    this.el = ct.createChild({cls:"wa-toolbar", tag:"table", cellspacing:0, children:[{tag:"tr", id:this.getId() + "-row"}]});
    this.rowEl = WA.get(this.getId() + "-row")
  }, _lookupItemComponent:function(cmp) {
    if(WA.isString(cmp)) {
      return cmp
    }else {
      return UI.Toolbar.superclass._lookupItemComponent.call(this, cmp)
    }
  }, _renderItem:function(container, item, index) {
    var cls = ["wa-toolbar-item"];
    if(index === 0) {
      cls.push("wa-toolbar-item-first")
    }else {
      if(index === this.items.length - 1) {
        cls.push("wa-toolbar-item-last")
      }
    }
    var ct = this.rowEl.createChild({tag:"td", cls:cls.join(" ")});
    if(item === "->") {
      ct.addClass("wa-toolbar-spacer")
    }else {
      UI.Toolbar.superclass._renderItem.call(this, ct, item, index)
    }
  }, _destroyItem:function(item) {
    if(item.isComponent) {
      item.container.remove();
      UI.Toolbar.superclass._destroyItem.call(this, item)
    }
  }})
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var UI = WA.ui;
  var SIGNAL_MESSAGE = "message";
  var SIGNAL_CALL_IN = "callIn";
  var SIGNAL_CALL_OUT = "callOut";
  var SOUND_FOLDER = "//img.imgsmail.ru/r/webagent/images/";
  UI.Beep = WA.extend(UI.Component, {initComponent:function() {
    UI.Beep.superclass.initComponent.call(this);
    this.useSwf = !window.Audio;
    this.mp3Url = SOUND_FOLDER + "message2.mp3?1";
    this.oggUrl = SOUND_FOLDER + "message.ogg?1";
    this.swfUrl = SOUND_FOLDER + "message.swf?1";
    this.swfMethod = "beep"
  }, _onRender:function(ct) {
    if(this.useSwf) {
      this._renderSwf(ct)
    }else {
      this._renderAudio(ct)
    }
  }, _renderAudio:function(ct) {
    this.el = ct.createChild({style:"position:absolute; left: -10000px", children:[{tag:"audio", preload:"auto", autobuffer:"true", children:[{tag:"source", src:this.mp3Url, type:"audio/mp3"}, {tag:"source", src:this.oggUrl, type:"audio/ogg"}]}]});
    this._audio = this.el.first()
  }, _renderSwf:function(ct) {
    var id = "waFlash_" + this.swfMethod;
    this.el = ct.createChild({id:id});
    WA.util.swf.embedSWF(this.swfUrl, id, "1", "1", "7", false, false, {name:id, allowScriptAccess:"always"}, {allowScriptAccess:"always"}, null);
    WA.setTimeout(function() {
      this._obj = WA.get(id)
    }, 1, this)
  }, play:function() {
    if(this.rendered) {
      var method = this.useSwf ? this._playSwf : this._playAudio;
      WA.setTimeout(method, 1, this)
    }
  }, _playSwf:function() {
    if(!U.Object.checkChain(this, ["_obj", "dom", this.swfMethod])) {
      this._obj = WA.get("waFlash_" + this.swfMethod)
    }
    if(U.Object.checkChain(this, ["_obj", "dom", this.swfMethod])) {
      try {
        if(this._obj) {
          this._obj.dom[this.swfMethod]()
        }
      }catch(e) {
      }
    }
  }, _playAudio:function() {
    if(this._audio && this._audio.dom.play) {
      this._audio.dom.play()
    }
  }});
  UI.BeepCallIn = WA.extend(UI.Beep, {initComponent:function() {
    UI.BeepCallIn.superclass.initComponent.call(this);
    this.mp3Url = SOUND_FOLDER + "call_in.mp3";
    this.oggUrl = SOUND_FOLDER + "call_in.ogg";
    this.swfUrl = SOUND_FOLDER + "call_in.swf";
    this.swfMethod = "call_in"
  }});
  UI.BeepCallOut = WA.extend(UI.Beep, {initComponent:function() {
    UI.BeepCallOut.superclass.initComponent.call(this);
    this.mp3Url = SOUND_FOLDER + "call_waiting.mp3";
    this.oggUrl = SOUND_FOLDER + "call_waiting.ogg";
    this.swfUrl = SOUND_FOLDER + "call_waiting.swf";
    this.swfMethod = "call_waiting"
  }});
  var Beep = WA.extend(Object, {constructor:function() {
    this.on = true;
    this[SIGNAL_MESSAGE] = new UI.Beep;
    this[SIGNAL_CALL_IN] = new UI.BeepCallIn;
    this[SIGNAL_CALL_OUT] = new UI.BeepCallOut
  }, render:function(ct) {
    this[SIGNAL_MESSAGE].render(ct);
    this[SIGNAL_CALL_IN].render(ct);
    this[SIGNAL_CALL_OUT].render(ct)
  }, unmute:function(val) {
    this.on = val
  }, play:function(signal) {
    signal = signal || SIGNAL_MESSAGE;
    if(this.on && this[signal]) {
      this[signal].play()
    }
  }});
  WA.Beep = new Beep
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent;
  var UI = WA.ui;
  var U = WA.util;
  UI.Collection = WA.extend(UI.Component, {initComponent:function() {
    this.children = this.initialConfig
  }, append:function(name, component) {
    this.children[name] = component
  }, _onRender:function(ct) {
    this.el = ct;
    U.Object.each(this.children, function(component) {
      component.render(ct)
    }, this)
  }, each:function(fn, scope) {
    U.Object.each(this.children, fn, scope)
  }})
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent;
  var UI = WA.ui;
  UI.Label = WA.extend(UI.Component, {initComponent:function() {
    this.title = this.initialConfig.title;
    this.child = this.initialConfig.child
  }, _onRender:function(ct) {
    this.el = ct.createChild({cls:"nwa-twocol__row", children:[{cls:"nwa-twocol__label", children:this.title}, {cls:"nwa-twocol__value"}]});
    this.child.render(this.el.first().next())
  }})
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var UI = WA.ui;
  UI.Select = WA.extend(UI.Component, {initComponent:function() {
    this.options = this.initialConfig.options || [];
    this.changeEvent = new U.Event
  }, _onRender:function(ct) {
    this.el = ct.createChild({tag:"select"});
    this._renderOptions();
    this.setValue(this.initialConfig.defaultValue || "-1");
    if(this.initialConfig.attributes) {
      U.Object.each(this.initialConfig.attributes, function(value, key) {
        this.el.setAttribute(key, value)
      }, this)
    }
  }, _onChangeEvent:function() {
    var value = this.getValue();
    if(this._value != value) {
      this._value = value;
      this.changeEvent.fire(value)
    }
  }, __renderList:function(list) {
    var html = [];
    if(list.length && WA.isIE) {
      html.push(U.String.format('<option value="{1}" style="display:none">{0}</option>', list[0][0], list[0][1]))
    }
    U.Array.each(list, function(option) {
      html.push(U.String.format('<option value="{1}">{0}</option>', option[0], option[1]))
    }, this);
    return html
  }, _renderOptions:function() {
    var html = this.__renderList(this.options);
    this.el.update(html.join(""));
    this.el.un("change", this._onChangeEvent, this);
    var parent = this.el.parent();
    html = parent.dom.innerHTML;
    this.el.remove();
    this.el = parent.createChild(html);
    this.el.on("change", this._onChangeEvent, this)
  }, update:function(list) {
    this.options = list;
    this._renderOptions()
  }, setValue:function(value) {
    if(this.getValue != value) {
      this.el.dom.value = value;
      this._value = value;
      return true
    }
    return false
  }, getValue:function() {
    return this.el.dom.value
  }, val:function() {
    return this.getValue()
  }, getTitle:function() {
    return(this.el.dom[this.el.dom.selectedIndex] || {innerHTML:""}).innerHTML
  }, disable:function() {
    this.el.update("").dom.disabled = true
  }, enable:function() {
    this.el.dom.disabled = false
  }})
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent, UI = WA.ui, MIN_SLIDER_SIZE = 30, WHEEL_STEP = 40;
  UI.ScrollBar = WA.extend(UI.Component, {initComponent:function() {
    UI.ScrollBar.superclass.initComponent.call(this);
    this.sourceEl = this.initialConfig.source || null;
    this.sliderSize = 0;
    this.sliderStart = 0;
    this.contentSpace = 0;
    this.mouseStart = 0;
    this.trackSize = 0;
    this.sliderSpace = 0;
    this.rate = 1;
    this.deferredUpdate = false
  }, render:function(ct) {
    if(!UI.ScrollBar.hasNativeSupport()) {
      this.sourceEl = null;
      return
    }
    UI.ScrollBar.superclass.render.call(this, ct)
  }, _onRender:function(ct) {
    var config = this.initialConfig;
    this.container = ct;
    this.sourceEl = this.sourceEl || ct;
    this.sourceEl.addClass("nwa-scrollbar__source");
    this.el = ct.createChild({tag:"div", style:"display:none", cls:"nwa-scrollbar", children:[{tag:"div", cls:"nwa-scrollbar__view", children:{tag:"div", cls:"nwa-scrollbar__slider", children:{tag:"div", cls:"nwa-scrollbar__slider-view"}}}]}, true);
    this.track = this.el.first();
    this.slider = this.track.first();
    this._initEvents()
  }, _initEvents:function() {
    this.slider.on("mousedown", this._start, this);
    this.track.on("mousedown", this._drag, this);
    this.container.on("DOMMouseScroll", this._wheel, this);
    this.container.on("mousewheel", this._wheel, this);
    if(this.initialConfig.watchResize) {
      WA.get(window).on("afterresize", this.sync, this)
    }
  }, _start:function(e) {
    if(e) {
      e.preventDefault();
      this.mouseStart = e.pageY
    }
    this.dragging = true;
    this.el.addClass("nwa-scrollbar_captured");
    this.sliderStart = parseInt(this.slider.dom.style.top);
    WA.getDoc().on("mousemove", this._drag, this);
    WA.getDoc().on("mouseup", this._end, this);
    this.slider.on("mouseup", this._end, this);
    return false
  }, _drag:function(e) {
    if(e.type == "mousedown") {
      if(this.dragging) {
        return false
      }
      this.sliderStart = -Math.floor(this.sliderSize / 2);
      this.mouseStart = this.track.offset()["top"]
    }else {
      e.preventDefault()
    }
    if(this.rate < 1) {
      var sliderTop = Math.min(this.sliderSpace, Math.max(0, this.sliderStart + e.pageY - this.mouseStart));
      this._scrollContent(sliderTop * this.scrollRatio);
      this._moveSlider(sliderTop)
    }
    return false
  }, _end:function(e) {
    WA.getDoc().un("mousemove", this._drag, this);
    WA.getDoc().un("mouseup", this._end, this);
    this.slider.un("mouseup", this._end, this);
    this.el.removeClass("nwa-scrollbar_captured");
    this.dragging = false;
    if(this.deferredUpdate) {
      this._onSourceUpdate()
    }
    return false
  }, _wheel:function(e) {
    if(this.rate >= 1) {
      return false
    }
    e.preventDefault();
    e = e.browserEvent;
    var delta = e.wheelDelta ? e.wheelDelta / 120 : -e.detail / 3;
    var deltaScroll = Math.min(this.contentSpace, Math.max(0, this.sourceEl.dom.scrollTop - delta * WHEEL_STEP));
    this._scrollContent(deltaScroll);
    this._onSourceUpdate()
  }, pauseDrag:function() {
    if(this.dragging) {
      this._paused = {mouseStart:this.mouseStart + parseInt(this.slider.dom.style.top) - this.sliderStart};
      this._end()
    }
  }, resumeDrag:function() {
    if(this._paused) {
      this.mouseStart = this._paused.mouseStart;
      this._paused = false;
      this._start()
    }
  }, sync:function() {
    if(this.dragging) {
      this.deferredUpdate = true;
      return
    }
    this._onSourceUpdate()
  }, setSource:function(sourceEl) {
    if(this.sourceEl) {
      this.sourceEl.removeClass("nwa-scrollbar__source")
    }
    this.sourceEl = sourceEl;
    this.sourceEl.addClass("nwa-scrollbar__source");
    this._onSourceUpdate()
  }, _onSourceUpdate:function() {
    this.deferredUpdate = false;
    if(!this.sourceEl) {
      return
    }
    var contentView = this.sourceEl.dom.offsetHeight, contentSize = this.sourceEl.dom.scrollHeight;
    this.rate = contentView / contentSize;
    if(this.rate >= 1) {
      this.hide();
      return
    }
    this.show();
    this.trackSize = this.track.dom.clientHeight;
    if(this.trackSize < MIN_SLIDER_SIZE) {
      this.hide();
      return
    }
    this.sliderSize = Math.max(MIN_SLIDER_SIZE, Math.floor(this.trackSize * this.rate));
    this.sliderSpace = this.trackSize - this.sliderSize;
    this.contentSpace = contentSize - contentView;
    this.scrollRatio = this.contentSpace / this.sliderSpace;
    var sliderTop = Math.min(Math.floor(this.sourceEl.dom.scrollTop * this.sliderSpace / this.contentSpace), this.sliderSpace);
    this.slider.setHeight(this.sliderSize);
    this._moveSlider(sliderTop)
  }, _moveSlider:function(delta) {
    this.slider.setStyle("top", delta + "px")
  }, _scrollContent:function(delta) {
    this.sourceEl.dom.scrollTop = delta
  }, destroy:function() {
    UI.ScrollBar.superclass.destroy.call(this)
  }});
  UI.ScrollBar.hasNativeSupport = function() {
    return!!("getBoundingClientRect" in document.documentElement)
  }
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent;
  var UI = WA.ui;
  var U = WA.util;
  var ITEM_TMPL = '<div class="nwa-acompl-item" wa-index="{index}" id="{id}{index}">{title}<div class="nwa-acompl-item-fadeout"></div></div>';
  var List = WA.extend(UI.Layer, {initComponent:function() {
    this.autoEl = false;
    this._index = -1;
    this.selectEvent = new U.Event;
    this.uniqueId = "nwaAcomplItem" + ("" + Math.random()).substr(2);
    this._list = []
  }, _onRender:function(ct) {
    this.el = ct.createChild({cls:"nwa-autocompl-list"})
  }, _onAfterRender:function() {
    List.superclass._onAfterRender.apply(this, arguments);
    this.el.on("mouseup", this._onMouseUp, this).on("mousemove", this._onMouseMove, this)
  }, _onMouseUp:function(ev) {
    var index = ev.getTarget(false).getAttribute("wa-index");
    this.selectEvent.fire(index)
  }, _onMouseMove:function(ev) {
    var index = ev.getTarget(false).getAttribute("wa-index");
    if(index !== null) {
      this.sel(index)
    }
  }, sel:function(index) {
    if(index === undefined) {
      if(!this._list || !this._list.length || this._index == -1) {
        return-1
      }else {
        return this._index % this._list.length
      }
    }else {
      if(this._list && this._list.length && this._index != index) {
        this._toggleHilight(this._index, false);
        this._toggleHilight(index, true);
        this._index = index
      }
    }
  }, selDown:function() {
    this.sel(this.sel() + 1)
  }, selUp:function() {
    var index = this.sel() - 1;
    if(index < 0) {
      index = this._list.length - 1
    }
    this.sel(index)
  }, _onShow:function() {
    this.sel(0)
  }, _toggleHilight:function(index, action) {
    if(index != -1 && this._list && this._list.length) {
      if(index > 0) {
        index = index % this._list.length
      }
      var el = WA.get(this.uniqueId + index);
      if(action === true) {
        el.addClass("nwa-acompl-hilight")
      }else {
        if(action === false) {
          el.removeClass("nwa-acompl-hilight")
        }
      }
    }
  }, update:function(list) {
    this._list = list;
    this._index = -1;
    var html = [];
    U.Array.each(list, function(item, index) {
      html.push(U.String.parseTemplate(ITEM_TMPL, {index:index, title:item, id:this.uniqueId}))
    }, this);
    this.el.update(html.join(""))
  }, destroy:function() {
    this.selectEvent.removeAll();
    this.selectEvent = null;
    this.onKeyDownEvent.removeAll();
    this.onKeyDownEvent = null;
    List.superclass.destroy.call(this)
  }});
  UI.Autocomplete = WA.extend(UI.TextField, {initComponent:function() {
    UI.Autocomplete.superclass.initComponent.call(this);
    this.selectedEvent = new U.Event;
    this.changeEvent = new U.Event;
    this._list = new List;
    this._list.selectEvent.on(this._onListItemSelect, this);
    this._items = this.initialConfig.items || [];
    this._checkChangeTask = new U.DelayedTask({interval:250, fn:this._checkChange, scope:this})
  }, search:function(value, mail, noAutoSelect, preventDropDown) {
    var res = [], list = [];
    var numberValue = (value || "").replace(/[\(\) \[\]+-]+/g, "");
    if(!numberValue || numberValue.match(/\D/)) {
      numberValue = false
    }
    if(value) {
      value = value.toLowerCase()
    }
    if(mail) {
      this._mail = mail
    }
    var alterValue = WA.util.KeyMapping.translate(value);
    U.Array.each(this._items, function(item) {
      var search = item.search;
      if(!mail && (search.indexOf(value) != -1 || numberValue && search.indexOf(numberValue) != -1 || search.indexOf(alterValue) != -1) || mail && item.mail === mail) {
        list.push(item.title);
        res.push(item);
        if(this.initialConfig.listMaxLen && res.length >= this.initialConfig.listMaxLen) {
          return false
        }
      }
    }, this);
    this._searchResult = res;
    this._list.hide();
    if(preventDropDown && res.length) {
      this._onListItemSelect(0)
    }else {
      if(preventDropDown && value) {
        this.val(value)
      }else {
        if(res.length > 1 || noAutoSelect && res.length == 1) {
          this._list.update(list);
          this._list.show()
        }else {
          if(!preventDropDown && res.length == 0) {
            this._list.update([])
          }else {
            if(res.length) {
              this._onListItemSelect(0)
            }
          }
        }
      }
    }
  }, toggleArrow:function(show) {
    if(this.arrow) {
      this.rootEl.toggleClass("nwa-acompl_expandable", show)
    }
  }, getSelectionInfo:function() {
    var item = null;
    if(this._index != -1) {
      item = this._searchResult[this._index]
    }
    return{item:item, value:this.val()}
  }, _checkChange:function() {
    var val = this.val();
    if(this._val != val) {
      this._val = val;
      this.changeEvent.fire(val);
      this.search(val, false, true)
    }
    this._checkChangeTask.start()
  }, _onRender:function(ct) {
    var config = this.initialConfig;
    var textfield = {tag:"input", type:"text", cls:"nwa-textfield"};
    if(config.maxLength) {
      textfield.maxlength = config.maxLength
    }
    this.rootEl = ct.createChild({cls:"nwa-acompl", children:[textfield]});
    if(config.arrow) {
      this.arrow = this.rootEl.createChild({tag:"button", title:WA.tr("sms.userPhones"), cls:"nwa-button nwa-acompl__arrow"})
    }
    this.el = this.rootEl.first();
    this._list.render(this.rootEl)
  }, _onAfterRender:function() {
    UI.Autocomplete.superclass._onAfterRender.apply(this, arguments);
    this._val = this.val();
    this._checkChangeTask.start();
    this.el.on("keydown", this._onKeyDown, this);
    if(this.arrow) {
      this.arrow.on("click", this._onMouseClick, this)
    }
    this._list.show();
    this._list.hide()
  }, _onListItemSelect:function(index) {
    this._list.show();
    this._list.hide();
    this._index = index;
    if(index != -1) {
      var value = this._val = this._searchResult[this._index].tel;
      this.val(value);
      this.changeEvent.fire()
    }
    this.selectedEvent.fire();
    this.close()
  }, _onMouseClick:function(e) {
    if(!this._mail) {
      return
    }
    if(this._list.isVisible()) {
      this._list.hide()
    }else {
      this.search(false, this._mail, true);
      this._list.show()
    }
    e.stopPropagation()
  }, _onKeyDown:function(ev) {
    switch(ev.keyCode) {
      case 27:
        this._list.hide();
        break;
      case 40:
        if(!this._list.isVisible()) {
          this._list.show()
        }else {
          this._list.selDown()
        }
        break;
      case 38:
        if(!this._list.isVisible()) {
          this._list.show()
        }else {
          this._list.selUp()
        }
        break;
      case 13:
        var sel = this._list.sel();
        if(!this._list.isVisible() && sel != -1) {
          this._list.show()
        }else {
          this._onListItemSelect(sel)
        }
        break;
      case 9:
        this._onListItemSelect(-1);
        break;
      default:
        return
    }
    ev.stopEvent()
  }, updateList:function(list) {
    this._items = list;
    this.close()
  }, close:function() {
    this._list.show();
    this._list.hide()
  }, destroy:function() {
    this.changeEvent.removeAll();
    this.changeEvent = null;
    this._list.destroy();
    this._checkChangeTask.stop();
    UI.Autocomplete.superclass.destroy.call(this)
  }})
})();
WebAgent.namespace("WebAgent.ui");
(function() {
  var WA = WebAgent, UI = WA.ui, U = WA.util, WHEEL_STEP = 5;
  UI.Slider = WA.extend(UI.Component, {initComponent:function() {
    UI.Slider.superclass.initComponent.call(this);
    this.barCls = this.initialConfig.barCls || "";
    this.minVal = this.initialConfig.minVal || 0;
    this.maxVal = this.initialConfig.maxVal || 100;
    this.stepVal = this.initialConfig.stepVal || 1;
    this.initVal = this.initialConfig.initVal || 50;
    this.sliderSize = 0;
    this.sliderStart = 0;
    this.mouseStart = 0;
    this.trackSize = 0;
    this.ratio = 1;
    this._lastVal = this.initVal;
    this._initialized = false;
    this._hideTimeout = 0;
    this._showTimeout = 0;
    this.initialConfig.fadeIn = true;
    this.changeEvent = new U.Event
  }, _onRender:function(ct) {
    this.container = ct;
    this.el = ct.createChild({cls:"nwa-slider", style:"display:none;", children:[{tag:"div", cls:"nwa-slider__view", children:{tag:"div", cls:"nwa-slider__bar", children:{tag:"div", cls:"nwa-slider__bar-view"}}}]});
    this.track = this.el.first();
    this.bar = this.track.first();
    this._initEvents()
  }, _initEvents:function() {
    this.bar.on("mousedown", this._start, this);
    this.track.on("mousedown", this._drag, this);
    this.container.on("DOMMouseScroll", this._wheel, this);
    this.container.on("mousewheel", this._wheel, this)
  }, _onShow:function() {
    if(this._initialized) {
      return
    }
    this._initialized = true;
    this.trackSize = this.track.dom.clientHeight;
    this.sliderSize = this.bar.dom.clientHeight;
    this.sliderSpace = this.trackSize - this.sliderSize;
    this.bar.setHeight(this.sliderSize);
    this.ratio = (this.maxVal - this.minVal) / this.sliderSpace;
    this._moveSlider(this.sliderSpace - Math.floor(this.initVal / this.ratio))
  }, _start:function(e) {
    e.preventDefault();
    this.dragging = true;
    this.el.addClass("nwa-slider_captured");
    this.mouseStart = e.pageY;
    this.sliderStart = parseInt(this.bar.dom.style.top);
    WA.getDoc().on("mousemove", this._drag, this);
    WA.getDoc().on("mouseup", this._end, this);
    this.bar.on("mouseup", this._end, this);
    return false
  }, _drag:function(e) {
    if(e.type == "mousedown") {
      if(this.dragging) {
        return false
      }
      this.sliderStart = -Math.floor(this.sliderSize / 2);
      this.mouseStart = this.track.offset()["top"]
    }else {
      e.preventDefault()
    }
    var sliderTop = Math.min(this.sliderSpace, Math.max(0, this.sliderStart + e.pageY - this.mouseStart));
    this._moveSlider(sliderTop);
    this._checkChange(sliderTop);
    return false
  }, _checkChange:function(sliderTop) {
    sliderTop = this.sliderSpace - sliderTop;
    var val = Math.round(this.minVal + this.ratio * sliderTop);
    if(this.stepVal > 1) {
      val = Math.round(val / this.stepVal) * this.stepVal
    }
    if(val != this._lastVal) {
      this.changeEvent.fire(val);
      this._lastVal = val
    }
  }, _end:function(e) {
    WA.getDoc().un("mousemove", this._drag, this);
    WA.getDoc().un("mouseup", this._end, this);
    this.bar.un("mouseup", this._end, this);
    this.el.removeClass("nwa-slider_captured");
    this.dragging = false;
    return false
  }, _wheel:function(e) {
    e.preventDefault();
    e = e.browserEvent;
    var delta = e.wheelDelta ? e.wheelDelta / 120 : -e.detail / 3;
    var sliderTop = Math.min(this.sliderSpace, Math.max(0, parseInt(this.bar.dom.style.top) - delta * WHEEL_STEP));
    this._moveSlider(sliderTop);
    this._checkChange(sliderTop)
  }, _moveSlider:function(delta) {
    this.bar.setStyle("top", delta + "px")
  }, show:function(force) {
    clearTimeout(this._showTimeout);
    clearTimeout(this._hideTimeout);
    if(force === true) {
      if(this.el || this.initialConfig.autoRender) {
        UI.Slider.superclass.show.call(this)
      }
    }else {
      this._showTimeout = WA.setTimeout(function() {
        if(this.el || this.initialConfig.autoRender) {
          UI.Slider.superclass.show.call(this)
        }
      }, 500, this)
    }
  }, hide:function(force) {
    clearTimeout(this._showTimeout);
    clearTimeout(this._hideTimeout);
    if(force === true) {
      if(this.el) {
        UI.Slider.superclass.hide.call(this)
      }
    }else {
      this._hideTimeout = WA.setTimeout(function() {
        if(this.el) {
          UI.Slider.superclass.hide.call(this)
        }
      }, 1E3, this)
    }
  }, val:function(val) {
    if(val != null) {
      if(this.sliderSpace > 0) {
        this._moveSlider(this.sliderSpace - Math.floor(val / this.ratio))
      }
    }else {
      var sliderTop = this.sliderSpace - parseInt(this.bar.dom.style.top);
      val = Math.round(this.minVal + this.ratio * sliderTop);
      if(this.stepVal > 1) {
        val = Math.round(val / this.stepVal) * this.stepVal
      }
      return val
    }
  }, destroy:function() {
    UI.Slider.superclass.destroy.call(this)
  }});
  UI.Volume = WA.extend(UI.Slider, {constructor:function(config) {
    config = U.Object.extend(config || {}, {initVal:50, stepVal:10});
    this.controlEl = config.controlEl || [];
    if(this.controlEl && this.controlEl.length == null) {
      this.controlEl = [this.controlEl]
    }
    if(this.controlEl[0]) {
      this.controlEl[0].on("mouseover", this.show, this).on("mouseout", this.hide, this).on("click", this.toggleMute, this)
    }
    UI.Volume.superclass.constructor.call(this, config)
  }, _onRender:function(ct) {
    UI.Volume.superclass._onRender.call(this, ct);
    this.el.on("mouseover", this.show, this).on("mouseout", this.hide, this)
  }, _onClick:function(e) {
    if(!this.isVisible() || e.button !== 0) {
      return
    }
    var target = e.getTarget(true);
    for(var i = 0, len = this.controlEl.length;i < len;i++) {
      if(this.controlEl[i].contains(target)) {
        return false
      }
    }
    if(!target || !this.el.equals(target) && !this.el.contains(target)) {
      this.hide(true)
    }
  }, _onHide:function() {
    WA.getBody().un("mousedown", this._onClick, this)
  }, _onShow:function() {
    WA.getBody().on("mousedown", this._onClick, this);
    UI.Volume.superclass._onShow.call(this)
  }, _checkChange:function(sliderTop) {
    UI.Volume.superclass._checkChange.call(this, sliderTop);
    this.controlEl[0].toggleClass(this.initialConfig.muteCls, this._lastVal == this.minVal)
  }, toggleMute:function() {
    if(!this.isVisible()) {
      this.show(true);
      return
    }
    if(this.val() > this.minVal) {
      this.controlEl[0].addClass(this.initialConfig.muteCls);
      this.changeEvent.fire(this.minVal);
      this.val(this.minVal)
    }else {
      if(this._lastVal > this.minVal) {
        this.controlEl[0].removeClass(this.initialConfig.muteCls);
        this.changeEvent.fire(this._lastVal);
        this.val(this._lastVal)
      }
    }
  }});
  UI.Dragger = WA.extend(UI.Component, {constructor:function(config) {
    config = config || {};
    this.dragStart = [0, 0];
    this.mouseStart = [0, 0];
    this.el = config.el;
    this.bar = config.bar || config.el;
    this.bar.on("mousedown", this._start, this);
    this.lastPosition = null;
    UI.Dragger.superclass.constructor.call(this, config)
  }, _start:function(e) {
    e.preventDefault();
    this.mouseStart = [e.pageX, e.pageY];
    this.dragStart = [this.el.dom.offsetLeft, this.el.dom.offsetTop];
    WA.getDoc().on("mousemove", this._drag, this);
    WA.getDoc().on("mouseup", this._end, this);
    this.bar.on("mouseup", this._end, this);
    return false
  }, _drag:function(e) {
    e.preventDefault();
    this.lastPosition = [this.dragStart[0] + e.pageX - this.mouseStart[0], this.dragStart[1] + e.pageY - this.mouseStart[1]];
    this.dragTo();
    return false
  }, dragTo:function(pos) {
    pos = pos || this.lastPosition;
    if(!pos) {
      return
    }
    this.el.setStyle({left:pos[0] + "px", top:pos[1] + "px", right:"auto", bottom:"auto"});
    this.lastPosition = pos
  }, _end:function(e) {
    WA.getDoc().un("mousemove", this._drag, this);
    WA.getDoc().un("mouseup", this._end, this);
    this.bar.un("mouseup", this._end, this);
    return false
  }})
})();
WebAgent.namespace("WebAgent.data");
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var ArrayUtils = U.Array;
  WA.data.Record = WA.extend(Object, {constructor:function(fields, data) {
    this.fields = fields;
    this.data = [];
    ArrayUtils.each(this.fields, function(fieldName) {
      this.data.push(data[fieldName])
    }, this)
  }, hasField:function(fieldName) {
    return ArrayUtils.indexOf(this.fields, fieldName) != -1
  }, get:function(fieldName) {
    var index = ArrayUtils.indexOf(this.fields, fieldName);
    if(index != -1) {
      return this.getAt(index)
    }else {
      return null
    }
  }, getAt:function(index) {
    return this.data[index]
  }})
})();
WebAgent.namespace("WebAgent.data");
(function() {
  WebAgent.data.SmileSets = ["set03", "set01", "animated_set", "static_png", "set04", "set06", "set05"];
  WebAgent.data.FlashSets = ["mults_dogs", "mults_people", "mults_cats", "mults_other"];
  WebAgent.data.SmileData = {"set03":[{"uid":"set03_obj01", "id":"400", "name":"set03_obj01", "alt":":Ангелочек:", "tip":"Ангелочек"}, {"uid":"set03_obj02", "id":"401", "name":"set03_obj02", "alt":":Тошнит:", "tip":"Тошнит"}, {"uid":"set03_obj03", "id":"402", "name":"set03_obj03", "alt":":Улыбка до ушей:", "tip":"Улыбка до ушей"}, {"uid":"set03_obj04", "id":"403", "name":"set03_obj04", "alt":":Дразнюсь:", "tip":"Дразнюсь"}, {"uid":"set03_obj05", "id":"404", "name":"set03_obj05", "alt":":Смущаюсь:", 
  "tip":"Смущаюсь"}, {"uid":"set03_obj06", "id":"405", "name":"set03_obj06", "alt":":Рыдаю:", "tip":"Рыдаю"}, {"uid":"set03_obj07", "id":"406", "name":"set03_obj07", "alt":":Сумасшествие:", "tip":"Сумасшествие"}, {"uid":"set03_obj08", "id":"407", "name":"set03_obj08", "alt":":Танцую:", "tip":"Танцую"}, {"uid":"set03_obj09", "id":"408", "name":"set03_obj09", "alt":":Чертовски злюсь:", "tip":"Чертовски злюсь"}, {"uid":"set03_obj10", "id":"409", "name":"set03_obj10", "alt":":Я круче:", "tip":"Я круче"}, 
  {"uid":"set03_obj11", "id":"410", "name":"set03_obj11", "alt":":Пиво:", "tip":"Пиво"}, {"uid":"set03_obj12", "id":"411", "name":"set03_obj12", "alt":":Ты что!:", "tip":"Ты что!"}, {"uid":"set03_obj13", "id":"412", "name":"set03_obj13", "alt":":Дарю цветочек:", "tip":"Дарю цветочек"}, {"uid":"set03_obj14", "id":"413", "name":"set03_obj14", "alt":":Ок!:", "tip":"Ок!"}, {"uid":"set03_obj15", "id":"414", "name":"set03_obj15", "alt":":Целую:", "tip":"Целую"}, {"uid":"set03_obj16", "id":"415", "name":"set03_obj16", 
  "alt":":Поцеловали:", "tip":"Поцеловали"}, {"uid":"set03_obj17", "id":"416", "name":"set03_obj17", "alt":":Хихикаю:", "tip":"Хихикаю"}, {"uid":"set03_obj18", "id":"417", "name":"set03_obj18", "alt":":Слушаю музыку:", "tip":"Слушаю музыку"}, {"uid":"set03_obj19", "id":"418", "name":"set03_obj19", "alt":":Не-а:", "tip":"Не-а"}, {"uid":"set03_obj20", "id":"419", "name":"set03_obj20", "alt":":Извини:", "tip":"Извини"}, {"uid":"set03_obj21", "id":"420", "name":"set03_obj21", "alt":":Лопну от смеха:", 
  "tip":"Лопну от смеха"}, {"uid":"set03_obj22", "id":"421", "name":"set03_obj22", "alt":":Мечтаю:", "tip":"Мечтаю"}, {"uid":"set03_obj23", "id":"422", "name":"set03_obj23", "alt":":В печали:", "tip":"В печали"}, {"uid":"set03_obj24", "id":"423", "name":"set03_obj24", "alt":":Надо подумать:", "tip":"Надо подумать"}, {"uid":"set03_obj25", "id":"424", "name":"set03_obj25", "alt":":Ой, ё:", "tip":"Ой, ё"}, {"uid":"set03_obj26", "id":"425", "name":"set03_obj26", "alt":":Кричу:", "tip":"Кричу"}, {"uid":"set03_obj27", 
  "id":"426", "name":"set03_obj27", "alt":":Улыбаюсь:", "tip":"Улыбаюсь"}, {"uid":"set03_obj28", "id":"427", "name":"set03_obj28", "alt":":Не знаю:", "tip":"Не знаю"}, {"uid":"set03_obj29", "id":"428", "name":"set03_obj29", "alt":":В изнеможении:", "tip":"В изнеможении"}, {"uid":"set03_obj30", "id":"429", "name":"set03_obj30", "alt":":Подмигиваю:", "tip":"Подмигиваю"}, {"uid":"set03_obj31", "id":"430", "name":"set03_obj31", "alt":":Уррра!:", "tip":"Уррра!"}, {"uid":"set03_obj32", "id":"431", "name":"set03_obj32", 
  "alt":":Бойан:", "tip":"Бойан"}, {"uid":"set03_obj33", "id":"432", "name":"set03_obj33", "alt":":Ктулху:", "tip":"Ктулху"}], "set01":[{"uid":"set01_obj01", "id":"010", "name":"set01_obj01", "alt":"<###20###img010>", "tip":":)"}, {"uid":"set01_obj02", "id":"011", "name":"set01_obj02", "alt":"<###20###img011>", "tip":";)"}, {"uid":"set01_obj03", "id":"012", "name":"set01_obj03", "alt":"<###20###img012>", "tip":":-))"}, {"uid":"set01_obj04", "id":"013", "name":"set01_obj04", "alt":"<###20###img013>", 
  "tip":";-P"}, {"uid":"set01_obj05", "id":"014", "name":"set01_obj05", "alt":"<###20###img014>", "tip":"8-)"}, {"uid":"set01_obj06", "id":"015", "name":"set01_obj06", "alt":"<###20###img015>", "tip":":-D"}, {"uid":"set01_obj07", "id":"016", "name":"set01_obj07", "alt":"<###20###img016>", "tip":"}:o)"}, {"uid":"set01_obj08", "id":"017", "name":"set01_obj08", "alt":"<###20###img017>", "tip":"$-)"}, {"uid":"set01_obj09", "id":"018", "name":"set01_obj09", "alt":"<###20###img018>", "tip":":-'"}, {"uid":"set01_obj10", 
  "id":"019", "name":"set01_obj10", "alt":"<###20###img019>", "tip":":-("}, {"uid":"set01_obj11", "id":"020", "name":"set01_obj11", "alt":"<###20###img020>", "tip":"8-("}, {"uid":"set01_obj12", "id":"021", "name":"set01_obj12", "alt":"<###20###img021>", "tip":":'("}, {"uid":"set01_obj13", "id":"022", "name":"set01_obj13", "alt":"<###20###img022>", "tip":":''()"}, {"uid":"set01_obj14", "id":"023", "name":"set01_obj14", "alt":"<###20###img023>", "tip":"S:-o"}, {"uid":"set01_obj16", "id":"024", "name":"set01_obj16", 
  "alt":"<###20###img024>", "tip":"(:-o"}, {"uid":"set01_obj17", "id":"025", "name":"set01_obj17", "alt":"<###20###img025>", "tip":"8-0"}, {"uid":"set01_obj18", "id":"026", "name":"set01_obj18", "alt":"<###20###img026>", "tip":"8-[o]"}, {"uid":"set01_obj19", "id":"027", "name":"set01_obj19", "alt":"<###20###img027>", "tip":"):-p"}, {"uid":"set01_obj20", "id":"028", "name":"set01_obj20", "alt":"<###20###img028>", "tip":"):-("}, {"uid":"set01_obj21", "id":"029", "name":"set01_obj21", "alt":"<###20###img029>", 
  "tip":"):-$"}, {"uid":"set01_obj22", "id":"030", "name":"set01_obj22", "alt":"<###20###img030>", "tip":"):-D"}, {"uid":"set01_obj24", "id":"031", "name":"set01_obj24", "alt":"<###20###img031>", "tip":":-E"}, {"uid":"set01_obj25", "id":"032", "name":"set01_obj25", "alt":"<###20###img032>", "tip":"Чертенок"}, {"uid":"set01_obj26", "id":"033", "name":"set01_obj26", "alt":"<###20###img033>", "tip":"Вампирчик"}, {"uid":"set01_obj27", "id":"034", "name":"set01_obj27", "alt":"<###20###img034>", "tip":":-]["}, 
  {"uid":"set01_obj28", "id":"035", "name":"set01_obj28", "alt":"<###20###img035>", "tip":":-|"}, {"uid":"set01_obj29", "id":"036", "name":"set01_obj29", "alt":"<###20###img036>", "tip":"B-j"}, {"uid":"set01_obj30", "id":"037", "name":"set01_obj30", "alt":"<###20###img037>", "tip":":~o"}, {"uid":"set01_obj31", "id":"038", "name":"set01_obj31", "alt":"<###20###img038>", "tip":"( I )"}, {"uid":"set01_obj32", "id":"039", "name":"set01_obj32", "alt":"<###20###img039>", "tip":"Сердце"}, {"uid":"set01_obj33", 
  "id":"040", "name":"set01_obj33", "alt":"<###20###img040>", "tip":":-*"}, {"uid":"set01_obj34", "id":"041", "name":"set01_obj34", "alt":"<###20###img041>", "tip":"Сплю"}, {"uid":"set01_obj41", "id":"000", "name":"set01_obj41", "alt":"<###20###img000>", "tip":"Отлично!"}, {"uid":"set01_obj42", "id":"001", "name":"set01_obj42", "alt":"<###20###img001>", "tip":"Peace!"}, {"uid":"set01_obj43", "id":"002", "name":"set01_obj43", "alt":"<###20###img002>", "tip":"OK"}, {"uid":"set01_obj44", "id":"003", 
  "name":"set01_obj44", "alt":"<###20###img003>", "tip":'Левая "коза"'}, {"uid":"set01_obj45", "id":"004", "name":"set01_obj45", "alt":"<###20###img004>", "tip":'Правая "коза"'}, {"uid":"set01_obj46", "id":"005", "name":"set01_obj46", "alt":"<###20###img005>", "tip":"Плохо"}, {"uid":"set01_obj47", "id":"006", "name":"set01_obj47", "alt":"<###20###img006>", "tip":"Внимание!"}, {"uid":"set01_obj48", "id":"007", "name":"set01_obj48", "alt":"<###20###img007>", "tip":"Фига"}, {"uid":"set01_obj49", "id":"008", 
  "name":"set01_obj49", "alt":"<###20###img008>", "tip":"Кулак"}, {"uid":"set01_obj50", "id":"009", "name":"set01_obj50", "alt":"<###20###img009>", "tip":"Отвали!"}], "animated_set":[{"uid":"animated_set_obj01", "id":"200", "name":"animated_set_obj01", "alt":":Ангелочек:", "tip":"Ангелочек"}, {"uid":"animated_set_obj02", "id":"201", "name":"animated_set_obj02", "alt":":Аплодисменты:", "tip":"Аплодисменты"}, {"uid":"animated_set_obj03", "id":"202", "name":"animated_set_obj03", "alt":":Красотка:", 
  "tip":"Красотка"}, {"uid":"animated_set_obj04", "id":"203", "name":"animated_set_obj04", "alt":":Пиво:", "tip":"Пиво"}, {"uid":"animated_set_obj05", "id":"204", "name":"animated_set_obj05", "alt":":Читаю:", "tip":"Читаю"}, {"uid":"animated_set_obj06", "id":"205", "name":"animated_set_obj06", "alt":":Мёрзну:", "tip":"Мёрзну"}, {"uid":"animated_set_obj07", "id":"206", "name":"animated_set_obj07", "alt":":Рыдаю:", "tip":"Рыдаю"}, {"uid":"animated_set_obj08", "id":"207", "name":"animated_set_obj08", 
  "alt":":Танцую:", "tip":"Танцую"}, {"uid":"animated_set_obj09", "id":"208", "name":"animated_set_obj09", "alt":":Чертовски злюсь:", "tip":"Чертовски злюсь"}, {"uid":"animated_set_obj10", "id":"209", "name":"animated_set_obj10", "alt":":Жую:", "tip":"Жую"}, {"uid":"animated_set_obj11", "id":"210", "name":"animated_set_obj11", "alt":":Побью:", "tip":"Побью"}, {"uid":"animated_set_obj12", "id":"211", "name":"animated_set_obj12", "alt":":Побили:", "tip":"Побили"}, {"uid":"animated_set_obj13", "id":"212", 
  "name":"animated_set_obj13", "alt":":Дарю цветочек:", "tip":"Дарю цветочек"}, {"uid":"animated_set_obj14", "id":"213", "name":"animated_set_obj14", "alt":":Смеюсь:", "tip":"Смеюсь"}, {"uid":"animated_set_obj15", "id":"214", "name":"animated_set_obj15", "alt":":Смеюсь и плачу:", "tip":"Смеюсь и плачу"}, {"uid":"animated_set_obj16", "id":"215", "name":"animated_set_obj16", "alt":":Подарок:", "tip":"Подарок"}, {"uid":"animated_set_obj17", "id":"216", "name":"animated_set_obj17", "alt":":Ворчу:", "tip":"Ворчу"}, 
  {"uid":"animated_set_obj18", "id":"217", "name":"animated_set_obj18", "alt":":Целую:", "tip":"Целую"}, {"uid":"animated_set_obj19", "id":"218", "name":"animated_set_obj19", "alt":":Люблю:", "tip":"Люблю"}, {"uid":"animated_set_obj20", "id":"219", "name":"animated_set_obj20", "alt":":Застрелю:", "tip":"Застрелю"}, {"uid":"animated_set_obj21", "id":"220", "name":"animated_set_obj21", "alt":":Выпей яду:", "tip":"Выпей яду"}, {"uid":"animated_set_obj22", "id":"221", "name":"animated_set_obj22", "alt":":Лучезарно:", 
  "tip":"Лучезарно"}, {"uid":"animated_set_obj23", "id":"222", "name":"animated_set_obj23", "alt":":Смущаюсь:", "tip":"Смущаюсь"}, {"uid":"animated_set_obj24", "id":"223", "name":"animated_set_obj24", "alt":":Расстраиваюсь:", "tip":"Расстраиваюсь"}, {"uid":"animated_set_obj25", "id":"224", "name":"animated_set_obj25", "alt":":Пою:", "tip":"Пою"}, {"uid":"animated_set_obj26", "id":"225", "name":"animated_set_obj26", "alt":":Скучаю:", "tip":"Скучаю"}, {"uid":"animated_set_obj27", "id":"226", "name":"animated_set_obj27", 
  "alt":":Засыпаю:", "tip":"Засыпаю"}, {"uid":"animated_set_obj28", "id":"227", "name":"animated_set_obj28", "alt":":Улыбаюсь:", "tip":"Улыбаюсь"}, {"uid":"animated_set_obj29", "id":"228", "name":"animated_set_obj29", "alt":":Показываю язык:", "tip":"Показываю язык"}, {"uid":"animated_set_obj30", "id":"229", "name":"animated_set_obj30", "alt":":Peace!:", "tip":"Peace!"}, {"uid":"animated_set_obj31", "id":"230", "name":"animated_set_obj31", "alt":":Удивляюсь:", "tip":"Удивляюсь"}, {"uid":"animated_set_obj32", 
  "id":"231", "name":"animated_set_obj32", "alt":":Тошнит:", "tip":"Тошнит"}], "static_png":[{"uid":"static_png_obj01", "id":"300", "name":"static_png_obj01", "alt":":Улыбаюсь:", "tip":"Улыбаюсь"}, {"uid":"static_png_obj02", "id":"301", "name":"static_png_obj02", "alt":":Злорадствую:", "tip":"Злорадствую"}, {"uid":"static_png_obj03", "id":"302", "name":"static_png_obj03", "alt":":Радуюсь:", "tip":"Радуюсь"}, {"uid":"static_png_obj04", "id":"303", "name":"static_png_obj04", "alt":":Старичок:", "tip":"Старичок"}, 
  {"uid":"static_png_obj05", "id":"304", "name":"static_png_obj05", "alt":":Свирепствую:", "tip":"Свирепствую"}, {"uid":"static_png_obj06", "id":"305", "name":"static_png_obj06", "alt":":Пугаюсь:", "tip":"Пугаюсь"}, {"uid":"static_png_obj07", "id":"306", "name":"static_png_obj07", "alt":":Показываю язык:", "tip":"Показываю язык"}, {"uid":"static_png_obj08", "id":"307", "name":"static_png_obj08", "alt":":Умник:", "tip":"Умник"}, {"uid":"static_png_obj09", "id":"308", "name":"static_png_obj09", "alt":":Алкоголик:", 
  "tip":"Алкоголик"}, {"uid":"static_png_obj10", "id":"309", "name":"static_png_obj10", "alt":":Вояка:", "tip":"Вояка"}, {"uid":"static_png_obj11", "id":"310", "name":"static_png_obj11", "alt":":Удивляюсь:", "tip":"Удивляюсь"}, {"uid":"static_png_obj12", "id":"311", "name":"static_png_obj12", "alt":":Чертовски злюсь:", "tip":"Чертовски злюсь"}, {"uid":"static_png_obj13", "id":"312", "name":"static_png_obj13", "alt":":Расстраиваюсь:", "tip":"Расстраиваюсь"}, {"uid":"static_png_obj14", "id":"313", 
  "name":"static_png_obj14", "alt":":Панк:", "tip":"Панк"}, {"uid":"static_png_obj15", "id":"314", "name":"static_png_obj15", "alt":":Лопну от смеха:", "tip":"Лопну от смеха"}, {"uid":"static_png_obj16", "id":"315", "name":"static_png_obj16", "alt":":Подмигиваю:", "tip":"Подмигиваю"}, {"uid":"static_png_obj17", "id":"316", "name":"static_png_obj17", "alt":":Думаю:", "tip":"Думаю"}, {"uid":"static_png_obj18", "id":"317", "name":"static_png_obj18", "alt":":Люблю:", "tip":"Люблю"}, {"uid":"static_png_obj19", 
  "id":"318", "name":"static_png_obj19", "alt":":Подавлен:", "tip":"Подавлен"}, {"uid":"static_png_obj20", "id":"319", "name":"static_png_obj20", "alt":":Рыдаю:", "tip":"Рыдаю"}, {"uid":"static_png_obj21", "id":"320", "name":"static_png_obj21", "alt":":Сейчас расплачусь:", "tip":"Сейчас расплачусь"}, {"uid":"static_png_obj22", "id":"321", "name":"static_png_obj22", "alt":":Злюсь:", "tip":"Злюсь"}, {"uid":"static_png_obj23", "id":"322", "name":"static_png_obj23", "alt":":Тошнит:", "tip":"Тошнит"}, 
  {"uid":"static_png_obj24", "id":"323", "name":"static_png_obj24", "alt":":Сумасшествие:", "tip":"Сумасшествие"}, {"uid":"static_png_obj25", "id":"324", "name":"static_png_obj25", "alt":":Целую:", "tip":"Целую"}, {"uid":"static_png_obj26", "id":"325", "name":"static_png_obj26", "alt":":Поцеловали:", "tip":"Поцеловали"}, {"uid":"static_png_obj27", "id":"326", "name":"static_png_obj27", "alt":":Красотка:", "tip":"Красотка"}, {"uid":"static_png_obj28", "id":"327", "name":"static_png_obj28", "alt":":Ангелочек:", 
  "tip":"Ангелочек"}, {"uid":"static_png_obj29", "id":"328", "name":"static_png_obj29", "alt":":Подозрительно:", "tip":"Подозрительно"}, {"uid":"static_png_obj30", "id":"329", "name":"static_png_obj30", "alt":":Жую:", "tip":"Жую"}, {"uid":"static_png_obj31", "id":"330", "name":"static_png_obj31", "alt":":Смущаюсь:", "tip":"Смущаюсь"}, {"uid":"static_png_obj32", "id":"331", "name":"static_png_obj32", "alt":":Стыдно:", "tip":"Стыдно"}], "set04":[{"uid":"set04_obj01", "id":"501", "name":"set04_obj01", 
  "alt":":Ура!:", "tip":"Ура!"}, {"uid":"set04_obj02", "id":"502", "name":"set04_obj02", "alt":":Привет!:", "tip":"Привет!"}, {"uid":"set04_obj03", "id":"503", "name":"set04_obj03", "alt":":Кушаю:", "tip":"Кушаю"}, {"uid":"set04_obj04", "id":"504", "name":"set04_obj04", "alt":":Танцую:", "tip":"Танцую"}, {"uid":"set04_obj05", "id":"505", "name":"set04_obj05", "alt":":Целую:", "tip":"Целую"}, {"uid":"set04_obj06", "id":"506", "name":"set04_obj06", "alt":":Пока!:", "tip":"Пока!"}, {"uid":"set04_obj07", 
  "id":"507", "name":"set04_obj07", "alt":":Слушаю музыку:", "tip":"Слушаю музыку"}, {"uid":"set04_obj08", "id":"508", "name":"set04_obj08", "alt":":Помоги:", "tip":"Помоги"}, {"uid":"set04_obj09", "id":"509", "name":"set04_obj09", "alt":":Бабло!:", "tip":"Бабло!"}, {"uid":"set04_obj10", "id":"510", "name":"set04_obj10", "alt":":Да!:", "tip":"Да!"}, {"uid":"set04_obj11", "id":"511", "name":"set04_obj11", "alt":":Головой об стену:", "tip":"Головой об стену"}, {"uid":"set04_obj12", "id":"512", "name":"set04_obj12", 
  "alt":":В атаку!:", "tip":"В атаку!"}, {"uid":"set04_obj13", "id":"513", "name":"set04_obj13", "alt":":Пацанчик:", "tip":"Пацанчик"}, {"uid":"set04_obj14", "id":"514", "name":"set04_obj14", "alt":":Нет!:", "tip":"Нет!"}, {"uid":"set04_obj15", "id":"515", "name":"set04_obj15", "alt":":Мир!:", "tip":"Мир!"}, {"uid":"set04_obj16", "id":"516", "name":"set04_obj16", "alt":":Дракончик:", "tip":"Дракончик"}], "set06":[{"uid":"set06_obj02", "id":"702", "name":"set06_obj02", "alt":":Ангелок:", "tip":"Ангелок"}, 
  {"uid":"set06_obj03", "id":"703", "name":"set06_obj03", "alt":":С любовью:", "tip":"С любовью"}, {"uid":"set06_obj04", "id":"704", "name":"set06_obj04", "alt":":Девочка с косичками:", "tip":"Девочка с косичками"}, {"uid":"set06_obj08", "id":"708", "name":"set06_obj08", "alt":":Крылья любви:", "tip":"Крылья любви"}, {"uid":"set06_obj09", "id":"709", "name":"set06_obj09", "alt":":Кондитер:", "tip":"Кондитер"}, {"uid":"set06_obj10", "id":"710", "name":"set06_obj10", "alt":":Голубки:", "tip":"Голубки"}, 
  {"uid":"set06_obj11", "id":"711", "name":"set06_obj11", "alt":":Тюльпаны:", "tip":"Тюльпаны"}, {"uid":"set06_obj12", "id":"712", "name":"set06_obj12", "alt":":Сердце:", "tip":"Сердце"}, {"uid":"set06_obj13", "id":"713", "name":"set06_obj13", "alt":":Купидон:", "tip":"Купидон"}, {"uid":"set06_obj14", "id":"714", "name":"set06_obj14", "alt":":Карусель:", "tip":"Карусель"}, {"uid":"set06_obj15", "id":"715", "name":"set06_obj15", "alt":":Кот:", "tip":"Кот"}, {"uid":"set06_obj16", "id":"716", "name":"set06_obj16", 
  "alt":":Пёс:", "tip":"Пёс"}, {"uid":"set06_obj17", "id":"717", "name":"set06_obj17", "alt":":Заяц с цветком:", "tip":"Заяц с цветком"}, {"uid":"set06_obj18", "id":"718", "name":"set06_obj18", "alt":":Бабочка:", "tip":"Бабочка"}, {"uid":"set06_obj19", "id":"719", "name":"set06_obj19", "alt":":Цветы:", "tip":"Цветы"}, {"uid":"set06_obj20", "id":"720", "name":"set06_obj20", "alt":":Букет:", "tip":"Букет"}], "set05":[{"uid":"set05_obj01", "id":"601", "name":"set05_obj01", "alt":":Лопну от смеха:", 
  "tip":"Лопну от смеха"}, {"uid":"set05_obj02", "id":"602", "name":"set05_obj02", "alt":":Чертовски злюсь:", "tip":"Чертовски злюсь"}, {"uid":"set05_obj03", "id":"603", "name":"set05_obj03", "alt":":Секрет:", "tip":"Секрет"}, {"uid":"set05_obj04", "id":"604", "name":"set05_obj04", "alt":":В изнеможении:", "tip":"В изнеможении"}, {"uid":"set05_obj05", "id":"605", "name":"set05_obj05", "alt":":Влюблён:", "tip":"Влюблён"}, {"uid":"set05_obj06", "id":"606", "name":"set05_obj06", "alt":":Целую:", "tip":"Целую"}, 
  {"uid":"set05_obj07", "id":"607", "name":"set05_obj07", "alt":":Обида:", "tip":"Обида"}, {"uid":"set05_obj08", "id":"608", "name":"set05_obj08", "alt":":Устал:", "tip":"Устал"}, {"uid":"set05_obj09", "id":"609", "name":"set05_obj09", "alt":":Подмигиваю:", "tip":"Подмигиваю"}, {"uid":"set05_obj10", "id":"610", "name":"set05_obj10", "alt":":Гадость:", "tip":"Гадость"}, {"uid":"set05_obj11", "id":"611", "name":"set05_obj11", "alt":":Виноват:", "tip":"Виноват"}, {"uid":"set05_obj12", "id":"612", "name":"set05_obj12", 
  "alt":":Любовь:", "tip":"Любовь"}, {"uid":"set05_obj13", "id":"613", "name":"set05_obj13", "alt":":Разочарование:", "tip":"Разочарование"}, {"uid":"set05_obj14", "id":"614", "name":"set05_obj14", "alt":":Сплю:", "tip":"Сплю"}, {"uid":"set05_obj15", "id":"615", "name":"set05_obj15", "alt":":Ой, ё:", "tip":"Ой, ё"}, {"uid":"set05_obj16", "id":"616", "name":"set05_obj16", "alt":":Прыгаю:", "tip":"Прыгаю"}, {"uid":"set05_obj17", "id":"617", "name":"set05_obj17", "alt":":Требую:", "tip":"Требую"}, {"uid":"set05_obj18", 
  "id":"618", "name":"set05_obj18", "alt":":Тошнит:", "tip":"Тошнит"}, {"uid":"set05_obj19", "id":"619", "name":"set05_obj19", "alt":":Дарю цветочек:", "tip":"Дарю цветочек"}, {"uid":"set05_obj20", "id":"620", "name":"set05_obj20", "alt":":Подозреваю:", "tip":"Подозреваю"}], "mults_dogs":[{"uid":"mults_dogs_obj02", "id":"flas_1", "name":"mults_dogs_obj02", "alt":":Пивка?;):", "tip":"Пивка?;)", "duration":5600, "swf":"/beer.swf"}, {"uid":"mults_dogs_obj03", "id":"flash_2", "name":"mults_dogs_obj03", 
  "alt":":Задолбал!:", "tip":"Задолбал!", "duration":7500, "swf":"/zadolbal.swf"}, {"uid":"mults_dogs_obj04", "id":"flash_3", "name":"mults_dogs_obj04", "alt":":Хочу к тебе!:", "tip":"Хочу к тебе!", "duration":16800, "swf":"/sobaka.swf"}, {"uid":"mults_dogs_obj09", "id":"flash_8", "name":"mults_dogs_obj09", "alt":":А я сошла с ума...:", "tip":"А я сошла с ума...", "duration":8600, "swf":"/mad_dog.swf"}, {"uid":"mults_dogs_obj11", "id":"flash_10", "name":"mults_dogs_obj11", "alt":":Пристрелю!:", "tip":"Пристрелю!", 
  "duration":8100, "swf":"/sobaka_strelyaet.swf"}, {"uid":"mults_dogs_obj12", "id":"flash_11", "name":"mults_dogs_obj12", "alt":":Я занят:", "tip":"Я занят", "duration":11600, "swf":"/rabotaet.swf"}], "mults_people":[{"uid":"mults_people_obj01", "id":"flash_0", "name":"mults_people_obj01", "alt":":Поцелуй:", "tip":"Поцелуй", "duration":5E3, "swf":"/guby.swf"}, {"uid":"mults_people_obj05", "id":"flash_4", "name":"mults_people_obj05", "alt":":Хны...!:", "tip":"Хны...!", "duration":6400, "swf":"/devochka.swf"}, 
  {"uid":"mults_people_obj06", "id":"flash_5", "name":"mults_people_obj06", "alt":":Отходняк...:", "tip":"Отходняк...", "duration":10600, "swf":"/bodun.swf"}, {"uid":"mults_people_obj07", "id":"flash_6", "name":"mults_people_obj07", "alt":":Сердце:", "tip":"Сердце", "duration":6500, "swf":"/serdze.swf"}, {"uid":"mults_people_obj08", "id":"flash_7", "name":"mults_people_obj08", "alt":":Жжёшь!:", "tip":"Жжёшь!", "duration":13200, "swf":"/smeh.swf"}, {"uid":"mults_people_obj10", "id":"flash_9", "name":"mults_people_obj10", 
  "alt":":Миллион алых роз!:", "tip":"Миллион алых роз!", "duration":12500, "swf":"/rosy.swf"}], "mults_cats":[{"uid":"mults_cats_obj13", "id":"flash_12", "name":"mults_cats_obj13", "alt":":Круто!:", "tip":"Круто!", "duration":10600, "swf":"/kot_cool.swf"}, {"uid":"mults_cats_obj14", "id":"flash_13", "name":"mults_cats_obj14", "alt":":Пока-пока:", "tip":"Пока-пока", "duration":9300, "swf":"/kot_goodbye.swf"}, {"uid":"mults_cats_obj15", "id":"flash_14", "name":"mults_cats_obj15", "alt":":Спасибо!:", 
  "tip":"Спасибо!", "duration":7700, "swf":"/kot_spasibo.swf"}, {"uid":"mults_cats_obj16", "id":"flash_15", "name":"mults_cats_obj16", "alt":":Не дуться!:", "tip":"Не дуться!", "duration":7600, "swf":"/kot_nedutza.swf"}, {"uid":"mults_cats_obj17", "id":"flash_16", "name":"mults_cats_obj17", "alt":":Обидели:", "tip":"Обидели", "duration":7300, "swf":"/kot_obida.swf"}, {"uid":"mults_cats_obj18", "id":"flash_17", "name":"mults_cats_obj18", "alt":":Ух ты!:", "tip":"Ух ты!", "duration":9E3, "swf":"/kot_wow.swf"}], 
  "mults_other":[{"uid":"mults_other_obj20", "id":"flash_20", "name":"mults_other_obj20", "alt":":Болею:", "tip":"Болею", "duration":5600, "swf":"/bad_cold.swf"}, {"uid":"mults_other_obj21", "id":"flash_21", "name":"mults_other_obj21", "alt":":Взрыв мозга:", "tip":"Взрыв мозга", "duration":6200, "swf":"/information.swf"}, {"uid":"mults_other_obj22", "id":"flash_22", "name":"mults_other_obj22", "alt":":Радость:", "tip":"Радость", "duration":7100, "swf":"/joy.swf"}, {"uid":"mults_other_obj23", "id":"flash_23", 
  "name":"mults_other_obj23", "alt":":Голяк:", "tip":"Голяк", "duration":6700, "swf":"/krizis.swf"}, {"uid":"mults_other_obj24", "id":"flash_24", "name":"mults_other_obj24", "alt":":Скучаю:", "tip":"Скучаю", "duration":6700, "swf":"/missyou.swf"}, {"uid":"mults_other_obj25", "id":"flash_25", "name":"mults_other_obj25", "alt":":Прорвемся!:", "tip":"Прорвемся!", "duration":12100, "swf":"/tank.swf"}]}
})();
WebAgent.namespace("WebAgent.rpc");
(function() {
  var WA = WebAgent;
  var rpc;
  var baseRemoteEvent = new WA.util.Event;
  var onError = function(e) {
    WA.error(e)
  };
  var Rpc = WA.extend(Object, {constructor:function(id) {
    this.id = id;
    this.remoteEvent = new WA.util.Event;
    baseRemoteEvent.on(this._onBaseRemoteEvent, this)
  }, _onBaseRemoteEvent:function(options) {
    var id = options.id;
    if(id === this.id) {
      this.remoteEvent.fire(options.method, options.params);
      return false
    }
  }, invoke:function(method, params, successFn, errorFn) {
    if(rpc) {
      var options = {id:this.id, method:method, params:params};
      rpc.invoke(options, successFn || WA.emptyFn, errorFn || onError)
    }else {
      if(WA.isFunction(errorFn)) {
        try {
          WA.error("RPC isn't ready yet")
        }catch(e) {
          errorFn(e)
        }
      }
    }
  }});
  var inited = false;
  var onReadyEvent = new WA.util.Event;
  var isReady = false;
  WA.rpc.Local = {createRpc:function(id) {
    return new Rpc(id)
  }, init:function() {
    if(!inited) {
      inited = true;
      var path;
      if(WA.isLocalhost || false && (WA.isLocalhost || WA.testServer)) {
        path = WA.resPath + "/rpc.html?" + WA.resProps
      }else {
        path = "https://" + WA.SAFE_ACTIVE_MAIL + ".webagent.mail.ru/ru/images/webagent/rpc.html?" + WA.resProps
      }
      var config = {remote:path};
      rpc = new easyXDM.Rpc(config, {local:{invoke:function(options) {
        baseRemoteEvent.fire(options)
      }}, remote:{invoke:{}}});
      easyXDM.whenReady(function() {
        isReady = true;
        onReadyEvent.fire()
      })
    }
  }, whenReady:function(fn, scope) {
    if(isReady) {
      fn.call(scope || window)
    }else {
      onReadyEvent.on(fn, scope, {single:true})
    }
  }}
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var JSON = WA.getJSON();
  var Storage = WA.extend(Object, {constructor:function(invoker) {
    this.rpc = WA.rpc.Local.createRpc(invoker || "Storage")
  }, init:function() {
    WA.rpc.Local.init()
  }, whenReady:function(fn, scope) {
    WA.setTimeout(function() {
      WA.rpc.Local.whenReady(fn, scope)
    }, 1, this)
  }, _onError:function(e) {
    WA.error(e)
  }, _createDelegatedCallbacks:function(callback) {
    var createDelegate = WA.createDelegate;
    var onError = createDelegate(this._onError, this);
    var cb;
    callback = callback || {};
    if(WA.isFunction(callback)) {
      cb = {success:callback, failure:onError}
    }else {
      cb = {success:callback.success || WA.emptyFn, failure:callback.failure || onError, scope:callback.scope}
    }
    var scope = callback.scope || window;
    var successFn = createDelegate(cb.success, scope);
    var errorFn = createDelegate(cb.failure, scope);
    return{successFn:successFn, errorFn:errorFn}
  }, _callRpc:function(method, params, callback) {
    var cb = this._createDelegatedCallbacks(callback);
    this.rpc.invoke(method, params, cb.successFn, cb.errorFn)
  }, save:function(data, callback) {
    this._callRpc("save", data, callback)
  }, load:function(key, callback) {
    this._callRpc("load", key, callback)
  }, remove:function(key) {
    this._callRpc("remove", key)
  }, clear:function() {
    this._callRpc("clear")
  }, destroy:function() {
  }, modify:function(key, cb, scope) {
    this.load(key, {success:function(storage) {
      var dump = {};
      WA.apply(dump, storage);
      cb.call(scope || window, storage);
      var res = U.Object.diff(dump, storage);
      if(res) {
        this.save(res)
      }
    }, scope:this})
  }, modifyObject:function(key, cb, scope) {
    this.modify(key, function(storage) {
      U.Object.each(storage, function(value, key) {
        storage[key] = JSON.parse(value || "{}")
      }, this);
      cb.call(scope || window, storage);
      U.Object.each(storage, function(value, key) {
        storage[key] = JSON.stringify(value)
      }, this)
    })
  }});
  WebAgent.Storage = new Storage;
  WebAgent.HugeStorage = new Storage("HugeStorage");
  var SessionStorage = WA.extend(Storage, {_ifSessionExist:function(cb, elseCb, scope) {
    if(WA.conn && WA.conn.Connection) {
      WA.conn.Connection.getSessionId(function(session) {
        if(session == null || session == "") {
          elseCb.call(scope || window)
        }else {
          cb.call(scope || window, session)
        }
      }, this)
    }else {
      if(WA.isDebug) {
        WA.error("OH SHI~")
      }
      WA.setTimeout(function() {
        cb.call(scope || window, session)
      }, 1)
    }
  }, save:function(data, callback) {
    this._ifSessionExist(function(session) {
      WA.util.Object.each(data, function(value, key) {
        value = session + ";" + value;
        data[key] = value
      });
      SessionStorage.superclass.save.call(this, data, callback)
    }, function() {
      var cb = this._createDelegatedCallbacks(callback);
      cb.errorFn()
    }, this)
  }, load:function(key, callback) {
    var topkey = key;
    this._ifSessionExist(function(session) {
      var cb = this._createDelegatedCallbacks(callback);
      SessionStorage.superclass.load.call(this, key, {success:function(storage) {
        if(WA.isObject(storage)) {
          var res = {};
          WA.util.Object.each(storage, function(value, key) {
            value = value || "";
            var i = WA.isString(value) ? value.indexOf(";") : -1;
            if(i > -1 && value.substr(0, i) == session) {
              res[key] = value.substr(i + 1)
            }else {
              res[key] = ""
            }
          });
          cb.successFn(res)
        }else {
          var i = storage.indexOf(";");
          if(storage.substr(0, i) == session) {
            cb.successFn(storage.substr(i + 1))
          }else {
            cb.successFn("")
          }
        }
      }, failure:cb.errorFn, scope:this})
    }, function() {
      var cb = this._createDelegatedCallbacks(callback);
      if(WA.isObject(key)) {
        var res = {};
        WA.util.Object.each(key, function(value) {
          res[value] = ""
        });
        cb.successFn(res)
      }else {
        cb.successFn("")
      }
    }, this)
  }});
  WebAgent.SessionStorage = new SessionStorage;
  WebAgent.HugeSessionStorage = new SessionStorage("HugeStorage")
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var FM = WA.extend(WA.Activatable, {constructor:function() {
    FM.superclass.constructor.call(this);
    this.focused = false;
    this.focusing = false;
    this.focusEvent = new U.Event;
    this.blurEvent = new U.Event;
    this.rpc = WA.rpc.Local.createRpc("FocusManager");
    this.rpc.remoteEvent.on(this._onRemoteEvent, this)
  }, _listenUserEvents:function() {
    if(!this.userEventsInited) {
      this.userEventsInited = true;
      WA.fly(window).on("focus", this._onWindowFocus, this)
    }
  }, _onWindowFocus:function() {
    this._tryToFocus()
  }, _onMouseMove:function() {
    this._tryToFocus()
  }, _focusingDone:function() {
    this.focusing = false
  }, _tryToFocus:function() {
    if(!this.focused && !this.focusing && this.isActive()) {
      this.focusing = true;
      this.rpc.invoke("tryToFocus")
    }
  }, _onRemoteEvent:function(method, params) {
    if("focus" === method) {
      this._focus()
    }else {
      if("blur" === method) {
        this._blur()
      }else {
        if("focusingDone" === method) {
          this._focusingDone()
        }
      }
    }
  }, _focus:function() {
    if(!this.focused && this.isActive()) {
      this.focused = true;
      this.focusEvent.fire()
    }
  }, _blur:function() {
    if(this.focused) {
      this.focused = false;
      this.blurEvent.fire()
    }
  }, activate:function(onActivate, scope, forceFocus) {
    this._listenUserEvents();
    var fn = WA.isFunction(onActivate) ? WA.createDelegate(onActivate, scope || this) : WA.emptyFn;
    return FM.superclass.activate.call(this, {fn:fn, forceFocus:forceFocus})
  }, _onActivate:function(params) {
    WA.getBody().on("mousemove", this._onMouseMove, this);
    this.rpc.invoke("activate", params.forceFocus, params.fn, params.fn);
    WA.debug.State.set("FM.activated", true)
  }, _onDeactivate:function() {
    WA.getBody().un("mousemove", this._onMouseMove, this);
    this._blur();
    this.rpc.invoke("deactivate");
    WA.debug.State.set("FM.activated", false)
  }, ifFocused:function(trueFn, elseFn, scope) {
    trueFn = trueFn || WA.emptyFn;
    elseFn = elseFn || WA.emptyFn;
    scope = scope || window;
    var successFn = WA.createDelegate(function(focused) {
      if(focused) {
        trueFn.call(this)
      }else {
        elseFn.call(this)
      }
    }, scope);
    var errorFn = function(e) {
      WA.debug.Console.debug("FocusManager.ifFocused() error: " + e)
    };
    this.rpc.invoke("ifFocused", null, successFn, errorFn)
  }});
  WA.FocusManager = new FM;
  var FocusBlurWorkaround = WA.extend(Object, {constructor:function() {
    this.focusEvent = new U.Event;
    this.blurEvent = new U.Event;
    this._intermediateFocus = false;
    this.focus = false;
    WA.fly(window).on("blur", this._onIntermediateBlur, this).on("focus", this._onIntermediateFocus, this);
    WA.getBody().on("mousedown", this._onIntermediateMouseMove, this).on("keydown", this._onIntermediateMouseMove, this);
    this._delayedFocusEvent = new U.DelayedTask({interval:100, fn:this._onFocusEvent, scope:this})
  }, _onMouseMove:function() {
    this._onIntermediateMouseMove()
  }, _onIntermediateMouseMove:function() {
    if(this._delayedFocusEvent.isStarted() && !this._intermediateFocus || !("_intermediateFocus" in this)) {
      this._intermediateFocus = true;
      this._delayedFocusEvent.stop();
      this._onFocusEvent()
    }
  }, _onIntermediateBlur:function(event) {
    this._intermediateFocus = false;
    this._delayedFocusEvent.start()
  }, _onIntermediateFocus:function(event) {
    this._intermediateFocus = true;
    this._delayedFocusEvent.start()
  }, _onFocusEvent:function() {
    this._delayedFocusEvent.stop();
    if(this.focus != this._intermediateFocus) {
      this.focus = this._intermediateFocus;
      if(this.focus) {
        this.focusEvent.fire()
      }else {
        this.blurEvent.fire()
      }
    }
  }, activate:function() {
    WA.getBody().on("mousemove", this._onMouseMove, this)
  }, deactivate:function() {
    WA.getBody().un("mousemove", this._onMouseMove, this)
  }});
  WA.WindowFocus = new FocusBlurWorkaround
})();
WebAgent.XDRequest = function() {
  var WA = WebAgent;
  var extend = WA.extend;
  var JSON = WA.getJSON();
  var XDXHR = extend(Object, {constructor:function(domain) {
  }, request:function(opts, cb, cbError) {
  }});
  var XHRViaEasyXDM = extend(Object, {constructor:function(domain) {
    this._domain = domain;
    this._rpc = new easyXDM.Rpc({remote:("" + document.location).match(/^[^:]+/)[0] + "://" + domain + "/communicate.html?" + WA.resProps}, {remote:{request:{}}})
  }, request:function(opts, cb, cbError, scope) {
    cb = WA.createDelegate(cb || function() {
    }, scope);
    var log = function(resp) {
    };
    opts.data || (opts.data = {});
    opts.data["x-email"] = WA.ACTIVE_MAIL;
    var cbErrorWrapped = WA.createDelegate(function(resp) {
      cbError && cbError.call(scope || window, resp.data);
      log(resp.data)
    }, scope);
    this._rpc.request(opts, function(resp) {
      cb.apply(window, arguments);
      if(resp.status != 200) {
        log(resp)
      }
    }, cbErrorWrapped)
  }});
  var XDR = function() {
    this._XHR = XHRViaEasyXDM
  };
  XDR.prototype = {_XHR:false, _domains:{}, getInstance:function(domain) {
    if(!this._domains[domain]) {
      this._domains[domain] = new this._XHR(domain)
    }
    return this._domains[domain]
  }};
  return new XDR
}();
WebAgent.namespace("WebAgent.conn");
WebAgent.conn.Socket = function() {
  var WA = WebAgent;
  var U = WA.util;
  var S = WA.Storage;
  var FM = WA.FocusManager;
  var NO_ACK = -1;
  var PAGE_UNIQ = Math.round(Math.random() * 1E5);
  var Socket = WA.extend(Object, {connected:false, _shuttingDown:false, isReady:false, beforeResponseEvent:new U.Event, afterResponseEvent:new U.Event, connectedEvent:new U.Event, errorEvent:new U.Event, triggerEvent:new U.Event, readyEvent:new U.Event, requestReadyEvent:new U.Event, successReconnectEvent:new U.Event, constructor:function() {
    FM.focusEvent.on(this.restore, this);
    FM.blurEvent.on(this._shutdown, this);
    this.triggerEvent.on(this._onEvents, this)
  }, _onEvents:function(type, value) {
    switch(type) {
      case "stream":
        S.save({"socket.seq":value.segment, "socket.date":+new Date});
        this._continueConnection();
        break;
      case "serviceUnavailable":
        this._onHttpError(500);
        return false;
        break
    }
  }, _restore:function(now) {
    this._continueConnection();
    S.save({"socket.restoreDate":+new Date})
  }, __setReady:function() {
    this.isReady = true;
    this.readyEvent.fire()
  }, restore:function() {
    if(this.connected) {
      this._shuttingDown = false;
      this.__setReady()
    }else {
      if(WA.enabled === false) {
        this.__setReady()
      }else {
        this.isValid(function() {
          S.load(["socket.restoreDate", "status.disabled"], {success:function(storage) {
            if(!storage["status.disabled"]) {
              var now = +new Date;
              var restoreInterval = now - (storage["socket.restoreDate"] || 0);
              if(restoreInterval >= 5E3) {
                this._restore()
              }else {
                WA.setTimeout(this._ifActual(this._restore, this), 5E3 - restoreInterval)
              }
              this.connected = true
            }
            this.__setReady()
          }, scope:this})
        }, function() {
          this.__setReady()
        }, this)
      }
    }
  }, isValid:function(cb, elseCb, scope) {
    S.load(["socket.date"], {success:function(storage) {
      var now = +new Date;
      if(now - (storage["socket.date"] || 0) < 7E4) {
        cb.call(scope || window)
      }else {
        elseCb.call(scope || window)
      }
    }, scope:this})
  }, _shutdown:function() {
    this.requestable = false;
    if(this.connected) {
      this._shuttingDown = true
    }
    WA.debug.Console.log("SOCK::_shutdown")
  }, disconnect:function(onresponse) {
    if(this.connected === false) {
      return
    }
    this._shutdown();
    if(onresponse) {
      this.connected = false;
      this._shuttingDown = false
    }
    WA.debug.Console.log("SOCK::disconnect");
    S.save({"socket.date":0})
  }, _continueConnection:function() {
    S.load(["socket.session", "socket.seq"], {success:function(storage) {
      S.save({"socket.date":+new Date});
      var opts = {session:storage["socket.session"], r:Math.round(Math.random() * 1E5)};
      if(storage["socket.seq"] != NO_ACK) {
        opts.stream_segment_ack = storage["socket.seq"]
      }
      this._connect(opts);
      clearTimeout(this._connectFailTimeout);
      this._connectFailTimeout = WA.setTimeout(WA.createDelegate(function() {
        if(this.connected && !this._shuttingDown && !this.requestable) {
          this.requestable = true;
          this.requestReadyEvent.fire()
        }
        this.successReconnectEvent.fire()
      }, this), 300)
    }, scope:this})
  }, _connectSession:function(domain, status, title, session) {
    S.save({"socket.domain":domain, "socket.date":+new Date, "socket.session":session, "socket.seq":NO_ACK});
    var options = {session:session, with_login:1, with_calls:WA.Voip.isCompatible ? 1 : 0, status:status, show_xstatus:1};
    if(WA.Voip.isCompatible) {
      options.with_calls = 1
    }
    if(title) {
      options.status_title = title
    }
    this._connect(options)
  }, _beginConnection:function(domain, status, title) {
    this.isValid(function() {
      S.load(["socket.session"], {success:function(storage) {
        this._connectSession(domain, status, title, storage["socket.session"])
      }, scope:this})
    }, function() {
      this._connectSession(domain, status, title, Math.round(Math.random() * 1E5))
    }, this)
  }, _connect:function(opts) {
    if(!this._polled) {
      this._polled = true;
      S.load(["socket.domain"], {success:function(storage) {
        if(!opts) {
          opts = {}
        }
        opts.page_uniq = PAGE_UNIQ;
        opts.realm = location.hostname;
        WA.XDRequest.getInstance(storage["socket.domain"]).request({url:"/connect", data:opts, timeout:7E4}, this._ifActual(this._dispatch, this), this._ifActual(this._dispatch, this))
      }, scope:this})
    }
  }, connect:function(domain, status, title) {
    if(!this.connected && domain && status && status != "offline") {
      this.connected = true;
      this._beginConnection(domain, status, title);
      this.connectedEvent.fire()
    }
  }, _discardEventsState:"discard", discardEvents:function() {
    this._discardEventsState = "discard";
    WA.debug.Console.log("SOCK.discardEvents()")
  }, continueEvents:function() {
    WA.debug.Console.log('SOCK.continueEvents() "' + this._discardEventsState + '"');
    if(this._discardEventsState == "discarded") {
      this._continueConnection()
    }
    if(this._discardEventsState == "discarded" || this._discardEventsState == "discard") {
      this._discardEventsState = "normal"
    }
  }, _onRedirect:function(jimServer) {
    WA.conn.UserState.getStatus(function(status) {
      this._beginConnection(jimServer, status)
    }, this)
  }, _validateResponse:function(resp) {
    if(!resp) {
      U.Mnt.err("timeout");
      this._onError("connectTimeout")
    }else {
      if(resp.status != 200) {
        U.Mnt.err("http" + resp.status);
        this._onHttpError(resp.status)
      }else {
        if(!resp.data.match(/\["stream",\s*{"segment":\s*\d+}\][\w\W]*\]/) && !resp.segmentless) {
          U.Mnt.err("broken");
          this._onError("brokenResponse")
        }else {
          try {
            var events = eval("(" + resp.data + ")")
          }catch(e) {
            this._onError("invalidSyntaxResponse");
            if(WA.isDebug) {
              throw e.message;
            }
            return
          }
          if(events[0][0] == "redirect") {
            var jimServer = WA.conn.UserState.getForcedJmp() || events[0][1].jimServer;
            this._onRedirect(jimServer)
          }else {
            return events
          }
        }
      }
    }
  }, _dispatch:function(resp) {
    delete this._polled;
    WA.debug.Console.log("_dispatch ", resp);
    var events = this._validateResponse(resp);
    if(events) {
      if(!this.requestable) {
        this.requestable = true;
        this.requestReadyEvent.fire()
      }
      if(this._discardEventsState == "normal") {
        this.beforeResponseEvent.fire();
        for(var i = 0;i < events.length;i++) {
          if(this.triggerEvent.fire(events[i][0], events[i][1], events, i) === false) {
            break
          }
        }
        this.afterResponseEvent.fire()
      }else {
        this._discardEventsState = "discarded";
        WA.debug.Console.log("SOCK: events discarded")
      }
    }else {
      clearTimeout(this._connectFailTimeout)
    }
  }, _ifActual:function(cb, scope) {
    return WA.createDelegate(function() {
      if(this._shuttingDown) {
        this._setDisconnected()
      }else {
        if(this.connected) {
          var args = arguments;
          FM.ifFocused(function() {
            cb.apply(scope || window, args)
          }, function() {
            this._setDisconnected()
          }, this)
        }else {
        }
      }
    }, this)
  }, _setDisconnected:function() {
    delete this._polled;
    this.requestable = false;
    this.connected = false;
    this._shuttingDown = false;
    WA.debug.Console.log("SOCK::_setDisconnected")
  }, _onTimeoutError:function() {
    this._ifActual(this._continueConnection, this)
  }, explainHttpError:function(errno) {
    WA.debug.Console.log("explainHttpError ", errno);
    if(errno == 0) {
      return"connectInterrupt"
    }else {
      if(errno == 503) {
        return"invalidUser"
      }else {
        if(errno >= 500 && errno < 599) {
          return"serviceUnavailable"
        }else {
          if(errno >= 400 && errno < 499) {
            switch(errno) {
              case 410:
                return"sessionLost";
              case 400:
              ;
              case 403:
              ;
              case 404:
                return"invalidUser";
              case 413:
                return"tooManyConnections";
              default:
                return"serverNotUnderstand"
            }
          }else {
            return"otherErrors"
          }
        }
      }
    }
  }, _onHttpError:function(errno) {
    if(errno > 399) {
      U.Mnt.countRB(1346376);
      this.last410 = WA.now()
    }
    var err = this.explainHttpError(errno);
    if(err == "connectInterrupt") {
      this.errorEvent.fire(err);
      WA.setTimeout(WA.createDelegate(function() {
        FM.ifFocused(function() {
          this._continueConnection()
        }, function() {
          this._setDisconnected()
        }, this)
      }, this), 3E3)
    }else {
      this._setDisconnected();
      this.errorEvent.fire(err)
    }
  }, _onError:function(type, param) {
    switch(type) {
      case "brokenResponse":
        FM.ifFocused(function() {
          WA.setTimeout(WA.createDelegate(this._continueConnection, this), 1E3)
        }, function() {
        }, this);
        break;
      case "invalidSyntaxResponse":
        WA.setTimeout(WA.createDelegate(this._continueConnection, this), 1E4);
        break;
      case "connectTimeout":
        break
    }
  }, send:function(method, params, cb, scope) {
    params || (params = {});
    params.domain || (params.domain = location.hostname);
    S.load(["socket.domain", "socket.session"], {success:function(storage) {
      var get = {session:storage["socket.session"], r:Math.round(Math.random() * 1E5)};
      var req = {method:"POST", url:"/" + method + "?" + WA.makeGet(get), data:params, page_uniq:PAGE_UNIQ};
      WA.XDRequest.getInstance(storage["socket.domain"]).request(req, function(resp) {
        WA.debug.Console.log("send: ", method, ", response: ", resp);
        cb && cb.call(scope || window, true, resp)
      }, function(resp) {
        cb && cb.call(scope || window, false, resp);
        if(resp.status != 200) {
          this._onHttpError(resp.status)
        }
      }, this)
    }, scope:this})
  }, getSessionId:function(cb, scope) {
    S.load(["socket.session"], function(storage) {
      cb.call(scope || window, storage["socket.session"])
    })
  }});
  return new Socket
}();
WebAgent.namespace("WebAgent.conn");
WebAgent.conn.Connection = function() {
  var WA = WebAgent;
  var U = WA.util;
  var SOCK = WA.conn.Socket;
  var JSON = WA.getJSON();
  var Conn = WA.extend(Object, {constructor:function() {
    this.triggerEvent = new U.Event;
    this.beforeResponseEvent = (new U.Event).relay(SOCK.beforeResponseEvent);
    this.afterResponseEvent = (new U.Event).relay(SOCK.afterResponseEvent);
    SOCK.afterResponseEvent.on(this._onAfterResponseEvent, this);
    SOCK.triggerEvent.on(this._onEvent, this)
  }, __mailifierResult:false, __mailifier:function(tel) {
    if(tel && tel.indexOf("tel:") == 0) {
      this.__mailifierLast = tel.substr(4, tel.length - 4);
      tel = this.__mailifierLast + "@tel.agent";
      this.__mailifierResult = true
    }else {
      this.__mailifierResult = false
    }
    return tel
  }, _onEvent:function(type, value, eventlist, eventindex) {
    var res, isChat, voip = [];
    if(value && value.identifier) {
      value.email = this.__mailifier(value.identifier)
    }
    if(type == "contactListState") {
      WA.debug.Console.log("contactListState ", value)
    }
    switch(type) {
      case "contactList":
        for(var i = value.length;i--;) {
          if(value[i][0].indexOf("@uin.icq") != -1 && value[i][3].indexOf("status_") == -1) {
            value[i][3] = "icq_" + value[i][3]
          }
          value[i][0] = this.__mailifier(value[i][0]);
          if(this.__mailifierResult && !value[i][1]) {
            value[i][1] = this.__mailifierLast
          }
        }
        break;
      case "contact":
        if(value["micblog::status"]) {
          type = "contactMicblogStatus";
          WA.apply(value, value["micblog::status"], {from:value.email})
        }else {
          if(value.status) {
            type = "contactStatus";
            if(WA.MainAgent.isTel(value.email)) {
              value.status.type = "tel";
              if(!("nickname" in value) || typeof value.nickname != "string") {
                value.nickname = this.__mailifierLast
              }
            }
            if(!("nickname" in value) || typeof value.nickname != "string") {
              value.nickname = value.email
            }
            if("email" in value && value.email.indexOf("@uin.icq") != -1) {
              value.status.type = "icq_" + value.status.type
            }
          }
        }
        break;
      case "history":
        value.history = value.messages || [];
        try {
          JSON.stringify(value.history)
        }catch(e) {
          U.Mnt.log("active_dialogs_error, history_assign_value_messages")
        }
        if(value.history) {
          type = "contactHistory";
          isChat = WA.MainAgent.isChat(value.email);
          U.Array.each(value.history, function(el) {
            if(!("text" in el[1])) {
              el[1].text = ""
            }
            if("to" in el[1]) {
              el[1].from = WA.ACTIVE_MAIL;
              delete el[1].to
            }
            var tmp;
            if("sender" in el[1]) {
              el[1].text = el[1].sender + ":\n" + el[1].text
            }else {
              if(isChat && (tmp = el[1].text.match(/([^:]+):\n([^@\n]+@[^@\n]+):\n([\s\S]*)/))) {
                el[1].text = tmp[2] + ":\n" + tmp[3]
              }
            }
            if("mult" in el[1]) {
              el[1].text = el[1].mult.tag
            }
          })
        }else {
          if(WA.isDebug) {
            throw"unknow server event";
          }
        }
        break;
      case "call":
        if(U.Object.checkChain(value, ["session", "rtmp", "addresses"], null, voip) && U.Object.checkChain(value, ["session", "session_id"], null, voip)) {
          type = "voip";
          value = {id:value.session.id, rtmp:(voip[0].value + ";").split(";")[0], stream:voip[1].value, video:value.session.video, email:value.session.from}
        }else {
          if(value.decline && value.decline == "DECLINE") {
            type = value.id > 0 ? "voipRequestDecline" : "voipDecline";
            value = {status:value.decline, id:value.id || 0}
          }else {
            if(value.error || value.decline) {
              type = "voipError";
              value = {status:value.error || value.decline, id:value.id || 0}
            }else {
              if(value.video == 1 || value.video == 0) {
                type = "voipVideo"
              }
            }
          }
        }
        break;
      case "iq":
        if(value.body && value.body.contact) {
          res = value.body.contact;
          res.identifier && (res.email = this.__mailifier(res.identifier));
          var prefix = "contact";
          if(WA.MainAgent.isTel(res.email)) {
            prefix = "tel"
          }
          if(res.unignore && res.unignore.success) {
            type = prefix + "UnignoreSuccess";
            value = res.email
          }else {
            if(res.unignore && res.unignore.error) {
              type = prefix + "UnignoreFail";
              value = {message:res.add.error, mail:res.email}
            }else {
              if(res.add && res.add.success) {
                type = prefix + "AddSuccess";
                value = res.email
              }else {
                if(res.add && res.add.error) {
                  type = prefix + "AddFail";
                  value = {message:res.add.error, mail:res.email}
                }else {
                  if(res.modify && res.modify.success) {
                    type = prefix + "ModifySuccess";
                    value = {phones:res.phones, email:res.email}
                  }
                }
              }
            }
          }
        }else {
          if(value.body && value.body.username) {
            type = "contactMail";
            value = {id:value.id, mail:value.body.username}
          }
        }
        break;
      case "sms":
        if(value.delivery_status) {
          type = "smsDeliveryStatus";
          value.from = this.__mailifier(value.from);
          value.tel = this.__mailifierLast;
          value.text = value.delivery_status
        }else {
          if(value.text) {
            value.from = this.__mailifier(value.from);
            value.tel = this.__mailifierLast
          }
        }
        var prevevent = eventlist[eventindex - 1];
        if(!prevevent || prevevent[0] != "contact" || prevevent[1].identifier != value.from && prevevent[1].email != value.from && prevevent[1].phones && U.Array.indexOf(prevevent[1].phones, value.tel) == -1) {
          this._onEvent("contact", {identifier:value.from, status:{type:"offline"}, nickname:this.__mailifierLast, phones:[this.__mailifierLast]})
        }
        break;
      case "message":
        isChat = value.from && WA.MainAgent.isChat(value.from);
        var tmp;
        if(isChat && value.text && (tmp = value.text.match(/([^:]+):\n([^@\n]+@[^@\n]+):\n([\s\S]*)/))) {
          if(!WA.SA.get(value.from).nick || WA.SA.get(value.from).nick.indexOf("@chat.agent") != -1) {
            this._onEvent("contact", {"email":value.from, "status":{"type":"online"}, "nickname":tmp[1]})
          }
          value.text = tmp[2] + ":\n" + tmp[3]
        }
        if(value.composing) {
          type = "typingNotify"
        }else {
          if(value.request && value.request.authorize) {
            type = "authRequest";
            if(!WA.SA.get(value.from).nick) {
              var uniq = Math.round(Math.random() * 999999);
              this._modifyAuthWaitingList(function(list) {
                list[uniq] = value;
                return list
              }, this);
              var params = {email:value.from, uniq:uniq};
              WA.conn.Socket.send("wp", params);
              return
            }
          }else {
            if(value.delivered) {
              type = "messageDelivered";
              U.Mnt.countRB(1348707)
            }else {
              if(!("text" in value)) {
                value.text = ""
              }
            }
          }
        }
        break;
      case "wp":
        if(value.uniq) {
          if(value.error) {
          }else {
            if(value.uniq) {
              this._modifyAuthWaitingList(function(list) {
                if(list[value.uniq]) {
                  var contact = value.result[0];
                  var status = WA.SA.get(contact.email);
                  this.triggerEvent.fire("contactStatus", {email:contact.email, nickname:WA.MainAgent.WP2Nick(contact), status:{type:status.status || "gray", title:status.statusTitle || WA.tr("status.auth")}});
                  this.triggerEvent.fire("authRequest", list[value.uniq]);
                  SOCK.afterResponseEvent.fire();
                  delete list[value.uniq]
                }
                return list
              }, this)
            }
          }
        }
        break;
      case "userInfo":
        if(this._preventUserInfo) {
          return
        }
        this._preventUserInfo = true;
        break
    }
    this.triggerEvent.fire(type, value)
  }, _modifyAuthWaitingList:function(cb, scope) {
    WA.Storage.load(["authWaitingList"], function(storage) {
      var list = JSON.parse(storage["authWaitingList"] || "{}");
      if("length" in list) {
        list = {}
      }
      list = cb.call(scope || window, list);
      WA.Storage.save({authWaitingList:JSON.stringify(list)})
    })
  }, getSessionId:function(cb, scope) {
    SOCK.isValid(function() {
      SOCK.getSessionId(cb, scope)
    }, function() {
      cb.call(scope || window, null)
    }, this)
  }, getClist:function(onSuccess, onError, scope) {
    SOCK.send("contactlist", {}, function(success) {
      if(success) {
        onSuccess && onSuccess.call(scope || window)
      }else {
        onError && onError.call(scope || window)
      }
    }, this)
  }, getMailById:function(id) {
    SOCK.send("username", {"verify-uid":id, "iq-id":id}, function(success) {
    }, this)
  }, _offlineMessages:[], confirmOfflineDelivery:function(id) {
    this._offlineMessages.push(id)
  }, _onAfterResponseEvent:function() {
    if(this._preventUserInfo) {
      this._preventUserInfo = false
    }
    if(this._offlineMessages.length) {
      SOCK.send("message", {uidl:this._offlineMessages.join(";"), delivered:1});
      this._offlineMessages = []
    }
  }});
  return new Conn
}();
WebAgent.namespace("WebAgent.conn");
WebAgent.conn.UserState = function() {
  var WA = WebAgent;
  var S = WA.Storage;
  var SOCK = WA.conn.Socket;
  var U = WA.util;
  var FM = WA.FocusManager;
  var JSON = WA.getJSON();
  var AUTO_AWAY_TIMEOUT = 600 * 1E3;
  var AutoAway = WA.extend(WA.ui.Component, {DISABLE_AUTOAWAY:true, constructor:function() {
    FM.focusEvent.on(this._onFocus, this);
    FM.blurEvent.on(this._onBlur, this);
    this.checker = new U.DelayedTask({interval:1E3, fn:this._onCheck, scope:this})
  }, activate:function() {
    if(this.DISABLE_AUTOAWAY) {
      return
    }
    WA.getBody().on("mousemove", this._onUserEvents, this).on("mousedown", this._onUserEvents, this).on("keydown", this._onUserEvents, this)
  }, deactivate:function() {
    if(this.DISABLE_AUTOAWAY) {
      return
    }
    WA.getBody().un("mousemove", this._onUserEvents, this).un("mousedown", this._onUserEvents, this).un("keydown", this._onUserEvents, this)
  }, _onFocus:function(isTimeout) {
    if(this.DISABLE_AUTOAWAY) {
      return
    }
    WA.SessionStorage.load(["autoaway"], {success:function(storage) {
      this.isAway = !!storage["autoaway"];
      this._focused = true;
      if(!isTimeout && !this.isAway) {
        this._onUserEvents()
      }
      this.checker.start();
      WA.debug.Console.log("AUTOAWAY: focus, isAway=", this.isAway)
    }, scope:this})
  }, _onBlur:function() {
    this._focused = false;
    this.checker.stop();
    WA.debug.Console.log("AUTOAWAY: blur")
  }, _onUserEvents:function() {
    if(this._focused) {
      this._date = +new Date;
      if(this.isAway) {
        this._onComeback()
      }
    }
  }, _onCheck:function() {
    if(!this.isAway && +new Date - this._date > AUTO_AWAY_TIMEOUT) {
      this._onAway()
    }
    this.checker.start()
  }, _onComeback:function() {
    this.isAway = false;
    WA.SessionStorage.save({"autoaway":""});
    WA.conn.UserState.getStatus(function(status, statusTitle) {
      WA.debug.Console.log("AUTOAWAY: comeback, status=", status);
      WA.conn.UserState._setStatus(status, statusTitle)
    }, this)
  }, _onAway:function() {
    this.isAway = true;
    WA.SessionStorage.save({"autoaway":"1"});
    WA.conn.UserState._setStatus("away");
    WA.debug.Console.log("AUTOAWAY: away")
  }});
  WA.AutoAway = new AutoAway;
  var UserState = WA.extend(Object, {constructor:function() {
    this.permanentShutdownEvent = new U.Event;
    this.networkErrorEvent = new U.Event;
    this.readyEvent = new U.Event;
    this.connectedEvent = new U.Event;
    this.disconnectedEvent = new U.Event;
    this.statusChangedEvent = new U.EventConfirm;
    this.statusChangedEvent.on(function(status) {
      WA.debug.Console.log("statusChangedEvent ", status)
    });
    SOCK.readyEvent.on(this._onSocketReady, this);
    SOCK.triggerEvent.on(this._onServerEvent, this);
    SOCK.requestReadyEvent.on(this._onSocketRequestable, this);
    SOCK.errorEvent.on(this._onNetworkError, this);
    SOCK.successReconnectEvent.on(function() {
      if(this.serviceUnavailableDelay != 2E3) {
        this.serviceUnavailableDelay = 2E3
      }
    }, this)
  }, init:function() {
    this.sync = WA.Synchronizer.registerComponent("user_state", ["data"], false);
    this.sync.triggerEvent.on(this._onSync, this)
  }, _onSync:function(data) {
    if(data.isChanged("data")) {
      data = JSON.parse(data.get("data") || "false");
      if(data) {
        if(data.connectionsLimit) {
          this.permanentShutdownEvent.fire({isShowInfo:true, info:WA.tr("msgTooManyConnections")})
        }
      }
    }
  }, _saveState:function(state) {
    this.sync.write("date", JSON.stringify(state))
  }, _clearState:function() {
    this.sync.write("date", "")
  }, isValidUser:function() {
    if(WA.getUserLogin()) {
      return true
    }else {
      this._onInvalidUser();
      return false
    }
  }, _onNetworkError:function(err) {
    WA.debug.Console.log("net err ", err);
    if(this._checkTimer) {
      clearTimeout(this._checkTimer)
    }
    switch(err) {
      case "otherErrors":
        SOCK.connected || SOCK.restore();
      case "connectInterrupt":
        this._checkTimer = WA.setTimeout(WA.createDelegate(function() {
          FM.ifFocused(function() {
            this._checkConnectivity()
          }, function() {
          }, this)
        }, this), 2E3);
        break;
      case "invalidUser":
        this._onInvalidUser(WA.tr("msgInvalidUser"));
        break;
      case "connectTimeout":
      ;
      case "sessionLost":
        if(WA.getUserLogin() != WA.ACTIVE_MAIL) {
          this._onInvalidUser(WA.tr("msgInvalidUser"))
        }else {
          this._checkConnectivity()
        }
        break;
      case "serviceUnavailable":
        this._checkTimer = WA.setTimeout(WA.createDelegate(function() {
          FM.ifFocused(function() {
            this._checkConnectivity()
          }, function() {
          }, this)
        }, this), this.serviceUnavailableDelay);
        this.serviceUnavailableDelay = 1E4;
        break;
      case "serverNotUnderstand":
        break;
      case "tooManyConnections":
        this.permanentShutdownEvent.fire({isShowInfo:true, info:WA.tr("msgTooManyConnections")});
        break
    }
  }, _onInvalidUser:function(info) {
    SOCK.disconnect();
    this.invalidUser = true;
    if(WA.allowAuth) {
      this.permanentShutdownEvent.fire({reason:"showAuthForm"})
    }else {
      if(info) {
        this.permanentShutdownEvent.fire({reason:"noAuth", isShowInfo:true, info:info})
      }
    }
    if(WA.isPopup) {
      document.location = "http://swa.mail.ru/cgi-bin/auth?Page=http%3A//webagent.mail.ru/webagent&FailPage=http%3A//webagent.mail.ru/auth"
    }
  }, _onSocketRequestable:function() {
    S.load(["status.forced", "status.forced_title"], {success:function(storage) {
      if(storage["status.forced"]) {
        this._setStatus(storage["status.forced"], storage["status.forced_title"])
      }
    }, scope:this})
  }, isReady:false, _onServerEvent:function(type, value) {
    switch(type) {
      case "logout":
        this.connected = false;
        this.statusChangedEvent.fire({success:function() {
          SOCK.disconnect(true);
          this.disconnectedEvent.fire()
        }, scope:this}, "offline", null);
        return false;
        break
    }
  }, getStatus:function(cb, scope) {
    S.load(["status.requested", "status.forced", "status.requested_title", "status.forced_title"], {success:function(storage) {
      var st = storage["status.forced"] || storage["status.requested"] || "online";
      var st_title = storage["status.forced_title"] || storage["status.requested_title"] || "";
      cb.call(scope || window, st, st_title)
    }, scope:this})
  }, getActualStatus:function(cb, scope) {
    S.load(["status.otherClientDate", "status.disabled"], {success:function(storage) {
      var now = +new Date;
      if(storage["status.disabled"]) {
        cb.call(scope || window, "disabled")
      }else {
        if(now - (storage["status.otherClientDate"] || 0) < 60 * 6E4) {
          cb.call(scope || window, "offline")
        }else {
          this.getStatus(cb, scope)
        }
      }
    }, scope:this})
  }, getState:function(cb, scope) {
    S.load(["status.disabled", "status.disabled_requested", "status.disabled_check_date"], {success:function(storage) {
      WA.setTimeout(function() {
        if("enabled" in WA && WA.enabled ^ !storage["status.disabled"]) {
          storage["status.disabled"] = ["1", ""][+WA.enabled];
          S.save(storage)
        }
        var disabledCheckExpired = +new Date - (storage["status.disabled_check_date"] || 0) > 6E4 * 60 * 24 * 7;
        if(storage["status.disabled"] && !disabledCheckExpired) {
          cb.call(scope || window, "disabled")
        }else {
          SOCK.isValid(function() {
            cb.call(scope || window, "online")
          }, function() {
            this.getActualStatus(function(status) {
              if(status == "offline" && storage["status.disabled_requested"] && !disabledCheckExpired) {
                cb.call(scope || window, "offline")
              }else {
                cb.call(scope || window)
              }
            }, this)
          }, this)
        }
      }, 1, this)
    }, scope:this})
  }, _onSocketReady:function() {
    WA.debug.Console.log("_onSocketReady, SOCK.connected: ", SOCK.connected);
    if(SOCK.connected) {
      this.connected = true;
      this.isReady = true;
      this.readyEvent.fire()
    }else {
      this._checkConnectivity()
    }
  }, _commitEnabledStatus:function(storage, enabled) {
    var props = {}, saveProps = false;
    if(typeof enabled == "boolean" && enabled != !storage["status.disabled"]) {
      props["status.disabled"] = ["1", ""][+enabled];
      saveProps = true
    }
    if(!storage["status.disabled_requested"]) {
      props["status.disabled_requested"] = 1;
      saveProps = true
    }
    if(saveProps) {
      props["status.disabled_check_date"] = +new Date;
      S.save(props)
    }
  }, _jimDomain:"jiml.mail.ru", _checkConnectivity:function() {
    S.load(["status.otherClientDate", "status.requested", "status.forced", "status.forced_title", "status.requested_title", "status.disabled", "status.disabled_requested", "status.disabled_check_date"], {success:function(storage) {
      if(WA.AuthForm.removeLoginToken() && (storage["status.forced"] == "offline" || !storage["status.forced"])) {
        storage["status.forced"] = "online";
        storage["status.forced_title"] = ""
      }
      var now = +new Date;
      var st = storage["status.forced"] || storage["status.requested"] || "online";
      var st_title = storage["status.forced_title"] || storage["status.requested_title"] || "";
      if(storage["status.forced"] && storage["status.forced"] != "offline") {
        storage["status.otherClientDate"] = 0;
        S.save({"status.otherClientDate":0})
      }
      var onUserStatus = function(status) {
        this._commitForcedStatus(storage["status.forced"], storage["status.forced_title"], !status.jimOnline);
        status.enabled = status.enabled !== false;
        this._commitEnabledStatus(storage, status.enabled);
        if(!status.enabled) {
          this.permanentShutdownEvent.fire();
          return
        }
        if(status.jimOnline) {
          SOCK.connect(status.jimServer, status.type);
          this.connected = true
        }else {
          if(storage["status.forced"] && storage["status.forced"] != "offline") {
            SOCK.connect(status.jimServer, storage["status.forced"], storage["status.forced_title"]);
            this.connected = true
          }else {
            if(!status.type || status.type == "offline") {
              if(st != "offline") {
                SOCK.connect(status.jimServer, st, st_title);
                this.connected = true
              }else {
                this.connected = false
              }
            }else {
              S.save({"status.otherClientDate":+new Date});
              this.connected = false
            }
          }
        }
        this.isReady = true;
        if(this.connected) {
          this.statusChangedEvent.fire(null, st, st_title);
          U.Mnt.rbCountOpen()
        }else {
          this.statusChangedEvent.fire(null, "offline", null)
        }
        U.Mnt.log({loginReason:1, curStatus:status.type, jimOnline:!!status.jimOnline, startConnect:!!this.connected, newStatus:st, reqStatus:storage["status.requested"], forceStatus:storage["status.forced"], mail:WA.ACTIVE_MAIL});
        this.readyEvent.fire(this.connected)
      };
      var disabledCheckExpired = +new Date - (storage["status.disabled_check_date"] || 0) > 6E4 * 60 * 24 * 7;
      var jmp = this.getForcedJmp();
      if(jmp) {
        onUserStatus.call(this, {enabled:true, type:"offline", jimServer:jmp})
      }else {
        if(st != "offline" && now - (storage["status.otherClientDate"] || 0) > 60 * 6E4 || disabledCheckExpired) {
          this._getUserStatus(onUserStatus, this)
        }else {
          this._commitForcedStatus(storage["status.forced"], storage["status.forced_title"], true);
          if(!storage["status.disabled_requested"]) {
            this._getUserStatus(function(status) {
              this._commitEnabledStatus(storage, status.enabled);
              if(!status.enabled) {
                this.permanentShutdownEvent.fire()
              }else {
                this.connected = false;
                this.isReady = true;
                this.statusChangedEvent.fire(null, "offline", null);
                this.readyEvent.fire()
              }
            }, this)
          }else {
            this.connected = false;
            this.isReady = true;
            this.statusChangedEvent.fire(null, "offline", null);
            this.readyEvent.fire()
          }
        }
      }
    }, scope:this})
  }, _commitForcedStatus:function(forcedStatus, forcedTitle, saveRequested) {
    if(forcedStatus) {
      S.save({"status.forced":"", "status.forced_title":""});
      if(saveRequested) {
        S.save({"status.requested":forcedStatus, "status.requested_title":forcedTitle || ""})
      }
    }
  }, getForcedJim:function() {
    var m = ("" + document.location).match(/wa_(?:force_)?jim=([^&]+)/i);
    if(m) {
      return m[1]
    }else {
      if(document.location.host.match(/^.+\.dev\.mail\.ru$/)) {
        return"jim1.dev.mail.ru"
      }else {
        if(false) {
          return"jimtest.mail.ru"
        }
      }
    }
  }, getForcedJmp:function() {
    var m = ("" + document.location).match(/wa_(?:force_)?jmp=([^&]+)/i);
    if(m) {
      return m[1]
    }else {
      if(false) {
        return"jmptest.mail.ru"
      }
    }
  }, _getUserStatus:function(cb, scope) {
    this.getUserStatus(cb, function(status, explain) {
      this.networkErrorEvent.fire(WA.tr("msgPartFew"));
      this._onNetworkError(explain)
    }, this)
  }, getUserStatus:function(cbSuccess, cbFail, scope) {
    var respCb = WA.createDelegate(function(response) {
      if(!response) {
        response = {}
      }
      if(!response.status) {
        response.status = 0
      }
      if(response.status == 200 && !response.data) {
        response.status = 0
      }
      if(response.status != 200) {
        cbFail.call(scope || window, response.status, SOCK.explainHttpError(response.status))
      }else {
        var status;
        U.Mnt.errorReason(response.data, function() {
          status = eval("(" + response.data + ")")[0][1].body.user.status
        });
        var jmp = this.getForcedJmp();
        if(jmp) {
          status.jimServer = jmp
        }
        cbSuccess.call(scope || window, status)
      }
    }, this);
    WA.XDRequest.getInstance(this.getForcedJim() || this._jimDomain).request({url:"/user/status"}, respCb, respCb)
  }, _setStatus:function(status, title) {
    WA.debug.Console.log("_setStatus: ", status, " connected:", this.connected);
    if(this.connected && status == "offline") {
      this.statusChangedEvent.fire({success:function() {
        SOCK.disconnect();
        SOCK.send("logout", false, this._checkChangeSuccess, this);
        this.connected = false;
        this.disconnectedEvent.fire()
      }, scope:this}, status, null)
    }else {
      if(this.connected && status != "offline") {
        this.statusChangedEvent.fire(null, status, title);
        var params = {type:status};
        if(title) {
          params.title = title
        }
        SOCK.send("user/status", params, this._checkChangeSuccess, this)
      }else {
        if(!this.connected && status != "offline") {
          this.statusChangedEvent.fire(null, status, title)
        }
      }
    }
  }, setStatus:function(status, title) {
    S.save({"status.forced":status, "status.forced_title":title});
    this._setStatus(status, title)
  }, _checkChangeSuccess:function(success, response) {
    if(success) {
      S.load(["status.forced", "status.forced_title"], {success:function(storage) {
        this._commitForcedStatus(storage["status.forced"], storage["status.forced_title"], true)
      }, scope:this})
    }else {
      if(WA.isDebug) {
        WA.error("Unable to change status")
      }
    }
  }});
  return new UserState
}();
WebAgent.namespace("WebAgent.conn");
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var SOCK = WA.conn.Socket;
  WebAgent.conn.ConnectionRoster = WA.extend(Object, {constructor:function() {
    WA.conn.Connection.triggerEvent.on(this._onConnectionTriggerEvent, this);
    WA.conn.Connection.beforeResponseEvent.on(this._onBeforeConnectionResponse, this);
    WA.conn.Connection.afterResponseEvent.on(this._onAfterConnectionResponse, this)
  }, _onBeforeConnectionResponse:function() {
  }, _onAfterConnectionResponse:function() {
  }, _onConnectionTriggerEvent:function(type, value) {
    var method = "_onConnection" + type.substr(0, 1).toUpperCase() + type.substr(1);
    if(this[method]) {
      this[method].call(this, value)
    }
  }, destroy:function() {
    WA.conn.Connection.triggerEvent.un(this._onConnectionTriggerEvent, this);
    WA.conn.Connection.beforeResponseEvent.un(this._onBeforeConnectionResponse, this);
    WA.conn.Connection.afterResponseEvent.un(this._onAfterConnectionResponse, this)
  }})
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var UI = WA.ui;
  var GuidePopup = WA.GuidePopup = new (WA.extend(WA.ui.Component, {_onRender:function(ct) {
    this.el = ct.createChild({cls:"nwa-guide", children:[{cls:"nwa-guide__header", children:[{children:"Приносим свои извинения, из-за последних обновлений Chrome, для включения звука<br/>при звонке, необходимо выполнить 4 простых действия"}, {cls:"nwa-guide__header-close"}]}, {cls:"nwa-guide__body", children:[{children:'Если после этих действий проблема сохраняется, следуйте инструкциям на этой странице (<a target="_blank" href="http://agent.mail.ru/chromefaq ">ссылка</a>)'}]}]});
    this.headerEl = this.el.first();
    this.headerEl.last().on("click", this.hide, this)
  }, hide:function() {
    if(this.el) {
      this.el.removeClass("nwa-guide_shown");
      this._onHide()
    }
  }, show:function() {
    if(this.el) {
      this.el.addClass("nwa-guide_shown");
      this._onShow()
    }
  }}))({hideOnEscape:true});
  WA.showGuidePopup = function() {
    if(!GuidePopup.rendered) {
      GuidePopup.render(WA.ma.el)
    }
    GuidePopup.show()
  };
  var VoipView = WA.extend(WA.ui.Component, {constructor:function(config) {
    VoipView.superclass.constructor.apply(this, arguments);
    this.swfDOM = null;
    this.dragger = null;
    this.expanded = false;
    this.swfPath = config.swfPath;
    this.swfVersionRequired = config.swfVersionRequired;
    this.minimizeEvent = new U.Event
  }, _onRender:function(ct) {
    this.el = ct.createChild({cls:"nwa-vcall", children:[{cls:"nwa-vcall__header", children:[{cls:"nwa-vcall__header-avatar"}, {cls:"nwa-vcall__header-mini", "data-action":"minimize"}, {cls:"nwa-vcall__header-close", "data-action":"hangup"}]}, {cls:"nwa-vcall__body", children:[{cls:"nwa-vcall__body-avatar"}, {cls:"nwa-vcall__bottom"}, {id:"nwaVoipSwf"}]}]});
    U.swf.embedSWF(this.swfPath, "nwaVoipSwf", "100%", "100%", this.swfVersionRequired, false, {cb:"WebAgent.Voip.swfCb"}, {name:"nwaVoipSwf", allowScriptAccess:"always", allowFullScreen:"true", loop:"false", bgcolor:"#E7F1F8"}, {"class":"nwa-vcall__swf", allowScriptAccess:"always", allowFullScreen:"true", bgcolor:"#E7F1F8"}, null);
    this.swfDOM = WA.get("nwaVoipSwf").dom;
    this.headerEl = this.el.first();
    this.statusField = this.headerEl.createChild({cls:"nwa-vcall__header-status", children:{tag:"span"}});
    this.nameBox = this.headerEl.createChild({cls:"nwa-namebox", children:[{tag:"div", cls:"nwa-namebox__label"}, {tag:"div", cls:"nwa-namebox__fadeout"}]});
    this.callControls = new CallControls;
    this.callControls.render(this.el);
    this.el.on("click", this._onClick, this);
    this.dragger = new UI.Dragger({el:this.el, bar:this.headerEl})
  }, updateInfo:function(info) {
    this.mail = info.mail;
    this.nick = info.nick
  }, hide:function(callEnd) {
    if(callEnd) {
      this.expanded = false
    }
    if(this.el) {
      this.el.removeClass("nwa-vcall_expanded").removeClass("nwa-vcall_shown").removeAttribute("style")
    }
  }, show:function(viewState, delaySwf) {
    viewState = U.Object.extend({video:0, hasPermission:0}, viewState || {});
    if(this.el) {
      if(viewState.hasPermission) {
        if(viewState.video) {
          this._expandVideo(delaySwf)
        }else {
          this.hide()
        }
      }else {
        this.el.removeClass("nwa-vcall_expanded").addClass("nwa-vcall_shown")
      }
    }
  }, _expandVideo:function(delaySwf) {
    if(this.el) {
      this.nameBox.first().update(this.nick || this.mail);
      var iconUrl = WA.makeAvatar(this.mail, "_avatar32");
      this.headerEl.first().setStyle({"background-image":"url(" + iconUrl + ")"});
      var iconUrl180 = WA.makeAvatar(this.mail, "_avatar180");
      this.headerEl.next().first().setStyle({"background-image":"url(" + iconUrl180 + ")"});
      this.statusField.first().setAttribute("title", U.String.htmlEntity(WA.tr("status.online")));
      this.statusField.first().dom.className = WA.buildIconClass("online", true);
      this.callControls.show();
      this.callControls.updateDuration(0);
      if(delaySwf) {
        this.swfDOM.style.width = "1px";
        this.swfDOM.style.height = "1px"
      }
      this.el.addClass("nwa-vcall_shown").addClass("nwa-vcall_expanded");
      if(delaySwf) {
        WA.setTimeout(function() {
          this.swfDOM.style.width = "100%";
          this.swfDOM.style.height = "100%"
        }, 1300, this)
      }
      if(this.dragger.lastPosition == null || !this.expanded) {
        var x = parseInt(WA.getBody().dom.offsetWidth / 2 - this.el.parent().dom.offsetLeft - this.el.dom.offsetWidth / 2), y = WA.isPopup ? 80 : -390;
        this.dragger.dragTo([x, y])
      }else {
        this.dragger.dragTo()
      }
      this.expanded = true
    }
  }, _onClick:function(e) {
    var target = e.getTarget(true);
    if(!target.getAttribute("data-action")) {
      target = target.parent()
    }
    var action = target.getAttribute("data-action");
    if(action === "mute") {
      U.Mnt.countRB(1379026);
      var muted = target.getAttribute("data-muted") == "1";
      target.setAttribute("data-muted", muted ? "0" : "1");
      target.toggleClass("nwa-voip-mute_off", !muted);
      WA.Voip.mute(!muted)
    }else {
      if(action === "minimize") {
        this.hide();
        this.minimizeEvent.fire()
      }else {
        if(action === "hangup") {
          WA.Voip.hangup(true)
        }
      }
    }
  }, updateDuration:function(sec) {
    this.callControls.updateDuration(sec)
  }, disable:function() {
  }});
  var DurationBox = WA.extend(WA.ui.Component, {_onRender:function(ct) {
    this.el = ct.createChild({cls:"nwa-el-duration", children:[{tag:"span"}, {tag:"span", cls:"nwa-el-duration-icon"}]})
  }, update:function(s) {
    var started = s > 0, sec = s % 60, text = WA.tr("voip.connecting");
    if(started) {
      text = Math.floor(s / 60) + ":" + (sec > 9 ? sec : "0" + sec)
    }
    this.el.toggleClass("nwa-el-duration_connecting", !started).first().update(text)
  }});
  var CallControls = WA.extend(WA.ui.Component, {_onRender:function(ct) {
    this.el = ct.createChild({cls:"nwa-voip-talk", children:[{tag:"button", cls:"nwa-voip-mute", "data-action":"mute"}, {tag:"button", cls:"nwa-voip-volume", "data-action":"volume"}, {tag:"button", cls:"nwa-el-hangup", html:"<span>" + WA.tr("voip.hangup") + "</span>", "data-action":"hangup"}]});
    this.duration = new DurationBox;
    this.duration.render(this.el);
    this.vol = new UI.Volume({controlEl:this.el.first().next(), muteCls:"nwa-voip-volume_mute", autoRender:this.el});
    this.vol.changeEvent.on(function(val) {
      U.Mnt.countRB(WA.Voip._call.videoCall ? 1379025 : 1216815);
      WA.Voip.volume(Math.round(val / 10) / 10)
    });
    this.talkStarted = false
  }, updateDuration:function(s) {
    if(this.rendered) {
      this.duration.update(s)
    }
  }});
  var VoiceCallPanel = WA.extend(CallControls, {_onRender:function(ct) {
    VoiceCallPanel.superclass._onRender.apply(this, arguments);
    this.el.on("click", this._onClick, this)
  }, _onClick:function(e) {
    var target = e.getTarget(true);
    if(!target.getAttribute("data-action")) {
      target = target.parent()
    }
    var action = target.getAttribute("data-action");
    if(action === "mute") {
      U.Mnt.countRB(1216818);
      var muted = target.getAttribute("data-muted") == "1";
      target.setAttribute("data-muted", muted ? "0" : "1");
      target.toggleClass("nwa-voip-mute_off", !muted);
      WA.Voip.mute(!muted)
    }else {
      if(action === "hangup") {
        WA.Voip.hangup(true)
      }
    }
  }});
  var CallTab = WA.extend(WA.ui.Component, {_onRender:function(ct) {
    this.el = ct.createChild({cls:"nwa-voip-tab", children:[{cls:"nwa-voip-tab-avatar"}, {tag:"button", cls:"nwa-el-green", "data-action":"expand", html:"<span>" + WA.tr("voip.expand") + "</span>"}, {tag:"button", cls:"nwa-el-hangup", "data-action":"hangup", html:"<span>" + WA.tr("voip.hangup") + "</span>"}]}, true);
    this.el.on("click", this._onClick, this);
    this._nameBox = new UI.NameBox;
    this._nameBox.render(this.el);
    this.duration = new DurationBox;
    this.duration.render(this.el);
    this.talkStarted = false
  }, _onClick:function(e) {
    var target = e.getTarget(true);
    if(!target.getAttribute("data-action")) {
      target = target.parent()
    }
    var action = target.getAttribute("data-action");
    if(action === "expand") {
      WA.Voip.show();
      this.hide()
    }else {
      if(action === "hangup") {
        WA.Voip.hangup(true)
      }
    }
  }, updateDuration:function(s) {
    if(this.rendered) {
      this.duration.update(s)
    }
  }, setUserInfo:function(userInfo) {
    this.el.first().setStyle({"background-image":"url(" + WA.makeAvatar(userInfo.mail, "_avatar32") + ")"});
    this._nameBox.setName(userInfo.nick)
  }});
  WA.VoipView = VoipView;
  WA.VoipView.VoiceCallPanel = VoiceCallPanel;
  WA.VoipView.CallTab = CallTab;
  WA.VoipView.DurationBox = DurationBox
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var UI = WA.ui;
  var SOCK = WA.conn.Socket;
  var ConnectionRoster = WA.conn.ConnectionRoster;
  var VoipCallState = {INIT:0, STARTED:1, MIC_REQUESTING:2, SESSION_REQUESTING:3, SESSION_RECEIVED:4, INC_INIT:6, RTMP_REQUESTING:7, RTMP_CONNECTED:8, RTMP_TALK:9, INC_MIC_REQUESTING:10, INC_MIC_ALLOWED:11};
  var VoipCallType = {PSTN:1, OUTGOING:2, INCOMING:3};
  var DEBUG = false;
  var SWF_PATH = WA.resDomain + WA.resPath.replace(/\/u\//, "/r/") + "/voip.swf" + WA.suffix;
  var SWF_VERSION_REQUIRED = "10.1";
  var SWF_VERSION_PSTN = "11.0";
  var SWF_VERSION_VIDEO = "11.0";
  var VoipCall = WA.extend(ConnectionRoster, {constructor:function(swf) {
    VoipCall.superclass.constructor.apply(this, arguments);
    this.id = 0;
    this._swf = swf;
    this.errorEvent = new U.Event;
    this.messageEvent = new U.Event;
    this.changeStateEvent = new U.Event;
    this._connected = false;
    this._outgoingWaitTimer = 0;
    this._connectTimer = 0;
    this._retryTimer = 0;
    this.phoneNumber = "";
    this.isAgentCall = false;
    this.videoCall = false;
    this.withCam = false;
    this._talkStart = 0;
    this.duration = 0;
    this.hasCamera = false;
    this.userInfo = {};
    this.micWasAllowed = false;
    this.state = VoipCallState.INIT;
    this.durationUpdate = new U.DelayedTask({interval:1E3, fn:this._updateDuration, scope:this});
    this.ringerWaiting = new U.DelayedTask({interval:4E3, fn:function() {
      WA.Beep.play("callOut");
      this.ringerWaiting.start()
    }, scope:this})
  }, startCall:function(tel) {
    this.state = VoipCallState.STARTED;
    this.phoneNumber = tel;
    this._checkMic();
    this.changeStateEvent.fire({time:0})
  }, onMicAllowed:function() {
    this.micWasAllowed = true;
    this.requestSession()
  }, setUser:function(nick, status) {
    this.userInfo = {nick:nick, status:status}
  }, requestSession:function() {
    this.state = VoipCallState.SESSION_REQUESTING;
    var params = {flashver:U.swf.ua.pv.join("."), ua:navigator.userAgent, tel:this.phoneNumber};
    this._sendCallStart(params)
  }, connected:function() {
    this.state = VoipCallState.RTMP_CONNECTED;
    this._connected = true;
    clearTimeout(this._connectTimer);
    clearTimeout(this._retryTimer)
  }, _onConnectionVoipError:function(val) {
    if(!val.id && val.status) {
      this.errorEvent.fire(val.status, {category:"jim", tel:this.phoneNumber});
      if(val.status == "ERROR") {
        U.Mnt.countRB(this.videoCall ? 1379014 : 1316736)
      }
      if(val.status == "INCOMPATIBLE_VERS") {
        U.Mnt.countRB(this.videoCall ? 1379015 : 1316738)
      }
    }
  }, _onConnectionVoipDecline:function(val) {
    this.errorEvent.fire("declined", {category:"jim", tel:this.phoneNumber})
  }, _onConnectionVoip:function(value) {
    this._rtmp = value.rtmp;
    this._stream = value.stream;
    if(this._rtmp && this._stream) {
      this.state = VoipCallState.SESSION_RECEIVED;
      this._call({video:value.video})
    }else {
      this.errorEvent.fire("voipSessionRequestFail", {category:"jim", rtmp:value.rtmp, stream:value.stream})
    }
  }, _onConnectionVoipVideo:function(value) {
    if(this.videoCall && value.video == 0 && !this.withCam) {
      this.videoCall = false;
      WA.Voip.show()
    }else {
      if(!this.videoCall && value.video == 1) {
        this.videoCall = true;
        WA.Voip.show()
      }
    }
    this.changeStateEvent.fire({video:this.videoCall});
    this._swf.switchVideo(!!value.video)
  }, _call:function() {
    if(this._swf && this._rtmp && this._stream) {
      this.state = VoipCallState.RTMP_REQUESTING;
      this._connectTimer = WA.setTimeout(function() {
        this.errorEvent.fire("rtmpConnectFail", {category:"rtmp", tel:this.phoneNumber})
      }, 25E3, this);
      this._swf.callToSession(this._stream, this._rtmp, true, false)
    }
  }, delayCall:function() {
    this._retryTimer = WA.setTimeout(function() {
      this._swf.callToSession(this._stream, this._rtmp, !this.isAgentCall, this.videoCall)
    }, 1500, this)
  }, hangup:function(manual) {
    if(this.state >= VoipCallState.SESSION_REQUESTING && manual) {
      WA.Voip.sendDecline()
    }
    if(this._swf) {
      this._swf.hangup();
      if(this._stream) {
        return!!this._connected
      }
    }
  }, setInfo:function() {
    if(this._swf && this.phoneNumber && this.phoneNumber.indexOf("@") > -1) {
      var iconUrl = WA.makeAvatar(this.phoneNumber, "_avatar180");
      try {
        this._swf.setInfo(iconUrl)
      }catch(e) {
      }
    }
  }, onSwfLoad:function(swf) {
    this._swf = swf;
    this._checkMic()
  }, _checkMic:function() {
    if(this._swf && this.phoneNumber) {
      this.state = VoipCallState.MIC_REQUESTING;
      this.ping();
      WA.Voip.show();
      WA.setTimeout(function() {
        this._swf.checkMic(this.videoCall)
      }, 100, this)
    }
  }, ping:function() {
    if(this._swf) {
      this._pongTimer = WA.setTimeout(function() {
        this.errorEvent.fire("swfCrashDetected", {category:"local", state:this.state, tel:this.phoneNumber})
      }, 100, this);
      this._swf.ping()
    }
  }, pong:function() {
    clearTimeout(this._pongTimer);
    this._pingTimer = WA.setTimeout(this.ping, 1E3, this)
  }, _talk:function() {
    this.state = VoipCallState.RTMP_TALK;
    this.ringerWaiting.stop();
    this._talkStart = +new Date;
    this.durationUpdate.start();
    WA.Voip.event("callTalk", {email:this.phoneNumber})
  }, talk:function() {
    this._talk();
    U.Mnt.countRB(1127443)
  }, _updateDuration:function() {
    this.duration = Math.ceil((new Date - this._talkStart) / 1E3);
    this.changeStateEvent.fire({time:this.duration});
    this.durationUpdate.start()
  }, _sendCallStart:function(params) {
    SOCK.send("call;start", params, function(success) {
      if(!success) {
        this.errorEvent.fire("voipSessionRequestFail", {category:"jim", tel:this.phoneNumber})
      }
    }, this)
  }, cameraDetected:function() {
    this.hasCamera = true
  }, cameraNotFound:function(type) {
    this.hasCamera = false;
    if(this.videoCall) {
      U.Mnt.countRB(1378996)
    }
    this.errorEvent.fire(type, {category:"rtmp"})
  }, destroy:function() {
    this.ringerWaiting.stop();
    this.durationUpdate.stop();
    clearTimeout(this._connectTimer);
    clearTimeout(this._retryTimer);
    clearTimeout(this._pingTimer);
    clearTimeout(this._pongTimer);
    clearTimeout(this._outgoingWaitTimer);
    this.changeStateEvent.fire({ended:true});
    this.errorEvent.removeAll();
    this.messageEvent.removeAll();
    this.changeStateEvent.removeAll();
    this._swf = null;
    VoipCall.superclass.destroy.apply(this, arguments)
  }});
  var OutgoingCall = WA.extend(VoipCall, {constructor:function(swf) {
    OutgoingCall.superclass.constructor.apply(this, arguments);
    this.isAgentCall = true
  }, startCall:function(mail, withCam) {
    this.state = VoipCallState.STARTED;
    this.phoneNumber = mail;
    this.withCam = !!withCam;
    this.videoCall = !!withCam;
    this._checkMic();
    WA.Voip.event("callOutgoing", {email:mail});
    this.changeStateEvent.fire({time:0})
  }, requestSession:function() {
    this.state = VoipCallState.SESSION_REQUESTING;
    this.ringerWaiting.startNow();
    U.Mnt.countRB(this.videoCall ? 1379002 : 1277225);
    this._outgoingWaitTimer = WA.setTimeout(function() {
      this.errorEvent.fire("AcceptTimedOut", {category:"jim"})
    }, 1E5, this);
    var params = {flashver:U.swf.ua.pv.join("."), ua:navigator.userAgent, email:this.phoneNumber};
    if(this.withCam) {
      params.video = 1
    }
    if(this.hasCamera) {
      params.camera = 1
    }
    this._sendCallStart(params)
  }, _call:function(params) {
    U.Mnt.countRB(this.videoCall ? 1379006 : 1287322);
    if(this._swf && this._rtmp && this._stream) {
      clearTimeout(this._outgoingWaitTimer);
      this.state = VoipCallState.RTMP_REQUESTING;
      if(params.video) {
        if(!this.videoCall) {
          this.changeStateEvent.fire({video:true})
        }
        this.videoCall = true;
        WA.Voip.show()
      }
      this._connectTimer = WA.setTimeout(function() {
        this.errorEvent.fire("rtmpConnectFail", {category:"rtmp", tel:this.phoneNumber})
      }, 3E4, this);
      this._swf.callToSession(this._stream, this._rtmp, false, this.videoCall)
    }
  }, talk:function() {
    this._talk();
    U.Mnt.countRB(this.videoCall ? 1379016 : 1216797)
  }, _onConnectionVoipDecline:function(val) {
    if(this.state == VoipCallState.SESSION_REQUESTING) {
      U.Mnt.countRB(this.videoCall ? 1379013 : 1290628);
      WA.Voip.event("callUserDecline", {email:this.phoneNumber})
    }else {
      if(this.state > VoipCallState.SESSION_REQUESTING) {
        WA.Voip.event("callUserHangup", {email:this.phoneNumber})
      }
    }
    this.errorEvent.fire("declined", {category:"jim", tel:this.phoneNumber})
  }, hangup:function(manual, silent) {
    if(this.state >= VoipCallState.SESSION_REQUESTING && manual && !silent) {
      WA.Voip.sendDecline()
    }
    if(manual) {
      if(this.state == VoipCallState.SESSION_REQUESTING) {
        WA.Voip.event("callCancel", {email:this.phoneNumber})
      }else {
        WA.Voip.event("callHangup", {email:this.phoneNumber})
      }
      if(this.state < VoipCallState.SESSION_REQUESTING) {
        U.Mnt.countRB(this.videoCall ? 1378998 : 1290642)
      }else {
        if(this.state == VoipCallState.SESSION_REQUESTING) {
          U.Mnt.countRB(this.videoCall ? 1379008 : 1290644)
        }
      }
    }
    if(this._swf) {
      this._swf.hangup();
      if(this._stream) {
        return!!this._connected && !silent
      }
    }
  }});
  var IncomingCall = WA.extend(VoipCall, {constructor:function(swf) {
    IncomingCall.superclass.constructor.apply(this, arguments);
    this.incomingCall = true;
    this.isAgentCall = true;
    this.state = VoipCallState.INC_INIT
  }, onSwfLoad:function(swf) {
    this._swf = swf;
    this._call()
  }, startCall:function(params) {
    this._rtmp = params.rtmp;
    this._stream = params.stream;
    this.videoCall = params.video || params.camera;
    this.withCam = params.camera;
    this.phoneNumber = params.email;
    var sendParams = {flashver:U.swf.ua.pv.join("."), ua:navigator.userAgent, id:params.id};
    if(this.withCam) {
      sendParams.video = 1
    }
    if(this.hasCamera) {
      sendParams.camera = 1
    }
    this._sendCallStart(sendParams);
    this.changeStateEvent.fire({time:0});
    this._call()
  }, onMicAllowed:function() {
    this.micWasAllowed = true;
    this.state = VoipCallState.INC_MIC_ALLOWED;
    if(this._connected) {
      this._swf.publishStream()
    }
  }, _call:function() {
    if(this._swf) {
      this.state = VoipCallState.RTMP_REQUESTING;
      this._connectTimer = WA.setTimeout(function() {
        this.errorEvent.fire("rtmpConnectFail", {category:"rtmp"})
      }, 3E4, this);
      this._swf.callToSession(this._stream, this._rtmp, false, this.videoCall);
      this._checkMic()
    }
  }, talk:function() {
    this._talk();
    U.Mnt.countRB(this.videoCall ? 1379018 : 1216800)
  }, _onConnectionVoip:function() {
  }, _onConnectionVoipDecline:function(val) {
    this.errorEvent.fire("declined", {category:"jim", tel:this.phoneNumber});
    WA.Voip.event("callUserHangup", {email:this.phoneNumber})
  }, connected:function() {
    IncomingCall.superclass.connected.apply(this, arguments);
    if(this.micWasAllowed) {
      this._swf.publishStream()
    }
  }, _checkMic:function() {
    this.state = VoipCallState.INC_MIC_REQUESTING;
    this.ping();
    WA.Voip.show();
    this._swf.checkMic(this.withCam)
  }, cameraNotFound:function(type) {
    this.hasCamera = false
  }, hangup:function(manual, silent) {
    if(manual) {
      if(!silent) {
        WA.Voip.sendDecline()
      }
      WA.Voip.event("callHangup", {email:this.phoneNumber})
    }
    if(this._swf) {
      this._swf.hangup();
      if(this._stream) {
        return!!this._connected && !silent
      }
    }
  }});
  var IncomingCallRequest = WA.extend(ConnectionRoster, {constructor:function(id, rtmp, stream, video, email) {
    IncomingCallRequest.superclass.constructor.apply(this, arguments);
    this.id = id;
    this.params = {id:id, email:email, rtmp:rtmp, stream:stream, video:video, camera:false};
    this.email = email;
    this.closeEvent = new U.Event;
    this.incomingDialog = new WA.IncomingCallDialog({video:video});
    this.incomingDialog.actionEvent.on(function(action) {
      if(action == "voice" || action == "video") {
        if(action == "video") {
          U.Mnt.countRB(WA.Voip.inTalk ? 1379022 : 1379017)
        }else {
          U.Mnt.countRB(WA.Voip.inTalk ? 1216805 : 1216798)
        }
        this.params.camera = action == "video";
        this.closeEvent.fire("accept", this.params)
      }else {
        if(video) {
          U.Mnt.countRB(WA.Voip.inTalk ? 1379023 : 1379019)
        }else {
          U.Mnt.countRB(WA.Voip.inTalk ? 1216808 : 1216801)
        }
        this.decline();
        this.closeEvent.fire("decline")
      }
    }, this);
    this.incomingDialog.open(email, WA.SA.get(email).nick, WA.SA.get(email).status);
    this.ringer = new U.DelayedTask({interval:4E3, fn:function() {
      WA.Beep.play("callIn");
      this.ringer.start()
    }, scope:this});
    this.ringer.startNow();
    WA.Voip.event("callIncoming", {email:email})
  }, _onConnectionVoipRequestDecline:function(val) {
    if(val.id > 0 && val.id == this.id) {
      if(WA.Voip.inTalk) {
        U.Mnt.countRB(WA.Voip._call.videoCall ? 1379032 : 1216841)
      }
      this.closeEvent.fire("cancel")
    }
  }, _onConnectionVoipError:function(val) {
    if(val.id > 0 && val.id == this.id) {
      if(WA.Voip.inTalk) {
        U.Mnt.countRB(WA.Voip._call.videoCall ? 1379032 : 1216841)
      }
      this.closeEvent.fire("cancel")
    }
  }, decline:function() {
    WA.Voip.sendDecline({id:this.id})
  }, destroy:function() {
    if(this.incomingDialog) {
      this.incomingDialog.destroy()
    }
    this.ringer.stop();
    this.closeEvent.removeAll();
    IncomingCallRequest.superclass.destroy.apply(this, arguments)
  }});
  var VoipChecker = WA.extend(ConnectionRoster, {constructor:function() {
    VoipChecker.superclass.constructor.apply(this, arguments);
    this.incomingEvent = new U.Event
  }, _onConnectionVoip:function(value) {
    if(value.id && value.rtmp && value.stream && value.email) {
      this.incomingEvent.fire(value.id, value.rtmp, value.stream, value.email, !!value.video)
    }
  }});
  var Voip = WA.extend(Object, {constructor:function() {
    this.inTalk = false;
    this._call = null;
    this._swfReady = false;
    this._swfLoadTimeout = 0;
    this.isCompatible = U.swf.hasFlashPlayerVersion(SWF_VERSION_REQUIRED);
    this.isCompatiblePSTN = U.swf.hasFlashPlayerVersion(SWF_VERSION_PSTN);
    this.isCompatibleVideo = U.swf.hasFlashPlayerVersion(SWF_VERSION_VIDEO);
    this.isSwfInstalled = U.swf.getFlashPlayerVersion().major > 0;
    this.requestQueue = {};
    this.callEvent = new U.Event;
    this.updateActivityEvent = new U.Event;
    this.voipChecker = new VoipChecker;
    this.voipChecker.incomingEvent.on(this._onIncomingCallRequest, this);
    this.view = new WA.VoipView({swfPath:SWF_PATH, swfVersionRequired:SWF_VERSION_REQUIRED});
    this.view.renderEvent.on(function() {
    }, this);
    this.view.minimizeEvent.on(function() {
      if(this._call) {
        this._call.changeStateEvent.fire({minimized:true})
      }
    }, this);
    if(window.onbeforeunload) {
      WA.fly(window).on("beforeunload", this._onWindowUnload, this)
    }else {
      window.onbeforeunload = WA.createDelegate(this._onWindowUnload, this)
    }
  }, _onWindowUnload:function() {
    this._beforeUnloadOccurred = true;
    this._declineRequests();
    if(this._call) {
      WA.Voip.voipLog("leavePage");
      return WA.tr("dialer.youreCalling")
    }
  }, createOutgoingCall:function(webcall) {
    this.render();
    return this.createCallObjectLow(webcall ? VoipCallType.OUTGOING : VoipCallType.PSTN)
  }, createIncomingCall:function(params) {
    this.createCallObjectLow(VoipCallType.INCOMING);
    if(this._call) {
      return this._call
    }else {
      WA.Voip.sendDecline({id:params.id, status:"ERROR"})
    }
  }, createCallObjectLow:function(callType) {
    if(this.inTalk) {
      this.hangup(true, true)
    }
    if(this.isCompatible && !this.inTalk) {
      var swf = this._swfReady && this.view.swfDOM;
      this.inTalk = true;
      switch(callType) {
        case VoipCallType.PSTN:
          this._call = new VoipCall(swf);
          break;
        case VoipCallType.OUTGOING:
          this._call = new OutgoingCall(swf);
          break;
        case VoipCallType.INCOMING:
          this._call = new IncomingCall(swf);
          break
      }
      this._call.errorEvent.on(this._onCallError, this);
      this._call.changeStateEvent.on(this._onCallStateChange, this);
      WA.Voip.event("createCall", {call:this._call});
      return this._call
    }
  }, _onCallError:function(type, params) {
    this.voipLog(type);
    if(this._call) {
      this._call.messageEvent.fire(type)
    }
    if(type == "declined") {
      this.hangup(false);
      return
    }
    if(this._call) {
      if(this._call.isAgentCall && !this._call.incomingCall) {
        if(type == "micUnAllowed" || type == "micIsBusy" || type == "micNotFound") {
          U.Mnt.countRB(this._call.videoCall ? 1396204 : 1296661)
        }else {
          if(type == "AcceptTimedOut") {
            U.Mnt.countRB(this._call.videoCall ? 1379010 : 1299829)
          }
        }
      }
      if(this._call.isAgentCall && params && params.category != "jim") {
        if(type == "micNotFound" && this._call.incomingCall) {
          WA.Voip.sendDecline({status:"NOHARDWARE"})
        }else {
          if(this._call.state >= VoipCallState.RTMP_CONNECTED) {
            if(type == "micUnAllowed") {
              WA.Voip.sendDecline()
            }else {
              WA.Voip.sendDecline({status:"CONNECTION_BROKEN"})
            }
          }else {
            if(this._call.state >= VoipCallState.SESSION_REQUESTING) {
              WA.Voip.sendDecline({status:"INIT_FAILED"})
            }
          }
        }
      }
      this._call.hangup(false)
    }
    this._onCallDone()
  }, _onCallStateChange:function(state) {
    if(state.time !== undefined) {
      this.view.updateDuration(state.time)
    }
  }, decline:function(call) {
    if(call) {
      call.hangup(true);
      call.destroy()
    }
  }, hangup:function(manual, silent) {
    if(manual && this._call) {
      this.voipLog("hangup")
    }
    if(this._call) {
      if(this._call.hangup(manual, silent) !== true || manual === false) {
        this._onCallDone()
      }
    }
  }, mute:function(state) {
    if(this.view.swfDOM) {
      this.view.swfDOM.gain(state ? 0 : 50)
    }
  }, volume:function(level) {
    if(this.view.swfDOM) {
      this.view.swfDOM.volume(level)
    }
  }, tone:function(key) {
    if(this.view.swfDOM && /^[0-9\*\#]$/.test(key)) {
      this.view.swfDOM.tone(key)
    }
  }, _onCallDone:function() {
    WA.Voip.event("callEnd", {email:this._call && this._call.phoneNumber});
    clearTimeout(this._swfLoadTimeout);
    if(!this._swfReady) {
    }
    this.view.hide(true);
    if(this._call) {
      this._call.destroy()
    }
    this._call = null;
    this.inTalk = false
  }, render:function() {
    if(!this.view.rendered) {
      this._swfLoadTimeout = WA.setTimeout(function() {
        this.view.disable();
        this._call.errorEvent.fire("swfLoadTimeout", {category:"local", url:SWF_PATH})
      }, 2E4, this);
      this.view.render(WA.ma.el)
    }
  }, show:function(delaySwf) {
    if(this._call) {
      this._call.setInfo()
    }
    this.view.updateInfo({mail:this._call.phoneNumber, nick:this._call.userInfo.nick});
    this.view.show({video:this._call && this._call.videoCall, hasPermission:!!this.microphoneAllowed}, delaySwf || false)
  }, _onIncomingCallRequest:function(id, rtmp, stream, email, withVideo) {
    if(!this.isCompatible) {
      WA.Voip.sendDecline({id:id, status:"INCOMPATIBLE_VERS"});
      WA.ma.dialogsWindow.openCallDialog(email, {incompatible:1});
      return
    }
    this.render();
    var request = new IncomingCallRequest(id, rtmp, stream, withVideo, email);
    request.closeEvent.on(function(type, params) {
      if(type == "accept") {
        WA.ma.dialogsWindow.openCallDialog(email, params);
        WA.Voip.event("callAccept", {email:email});
        this.updateActivityEvent.fire(email)
      }else {
        if(type == "decline") {
          WA.Voip.event("callDecline", {email:email})
        }else {
          this.updateActivityEvent.fire(email)
        }
      }
      request.destroy();
      delete this.requestQueue[id]
    }, this);
    this.requestQueue[id] = request
  }, voipLog:function(type, params) {
    params = U.Object.extend(params || {}, {type:type, videoLog:1});
    if(this._call) {
      U.Object.extend(params, {state:this._call.state, tel:this._call.phoneNumber, dur:this._call.duration});
      this._call.isAgentCall ? params.web = 1 : params.pstn = 1;
      if(this._call.isAgentCall) {
        params.incom = this._call.incomingCall ? 1 : 0;
        params.video = this._call.videoCall ? 1 : 0
      }
    }
    U.Mnt.log(params)
  }, event:function(type, params) {
    this.callEvent.fire(type, params)
  }, sendDecline:function(params) {
    params = U.Object.extend({status:"DECLINE"}, params || {});
    SOCK.send("call;decline", params, function(success) {
    }, this)
  }, _declineRequests:function() {
    for(var requestId in this.requestQueue) {
      if(this.requestQueue[requestId] instanceof IncomingCallRequest) {
        this.requestQueue[requestId].decline();
        this.requestQueue[requestId].destroy();
        delete this.requestQueue[requestId]
      }
    }
  }, deactivate:function() {
    this._declineRequests();
    this.hangup(true)
  }, db:function() {
    DEBUG = true;
    if(this._swfReady && this.view.swfDOM) {
      this.view.swfDOM.debugOn()
    }
    return"OK"
  }, swfCb:function(type, param1) {
    if(DEBUG && type != "ping") {
      console.log("swfCb:", type, param1)
    }
    if(type == "ready") {
      clearTimeout(this._swfLoadTimeout);
      this._swfReady = true;
      if(DEBUG) {
        this.db()
      }
    }
    if(!this._call) {
      return
    }
    switch(type) {
      case "flash":
        if(param1 == "NetConnection.Connect.Closed") {
          this._onCallDone()
        }else {
          if(param1 == "NetConnection.Connect.Success") {
            this._call.connected()
          }
        }
        break;
      case "error":
        this._call.errorEvent.fire(param1, {category:"rtmp"});
        break;
      case "server":
        if(param1 == "TALK") {
          SOCK.send("call;talk", {}, function(success) {
          }, this);
          this._call.talk()
        }else {
          if(param1 == "BYE") {
            if(this._call.duration == 0) {
              if(this._call.isAgentCall) {
                WA.Voip.sendDecline({status:"ERROR"})
              }else {
                this._call.messageEvent.fire("noAnswer");
                WA.Voip.sendDecline()
              }
            }else {
              WA.Voip.sendDecline()
            }
            this.hangup()
          }else {
            this._call.messageEvent.fire(param1)
          }
        }
        break;
      case "ready":
        this._call.onSwfLoad(this.view.swfDOM);
        break;
      case "event":
        if(param1 == "micAllowed" || param1 == "micAlreadyAllowed") {
          this.microphoneAllowed = true;
          if(this._call.micWasAllowed) {
            return
          }
          this.show(true);
          this._call.onMicAllowed()
        }else {
          if(param1 == "micUnAllowed") {
            this.view.hide(true);
            this._call.errorEvent.fire(param1, {category:"local"})
          }else {
            if(param1 == "camFound") {
              this._call.cameraDetected()
            }else {
              if(param1 == "camIsBusy" || param1 == "camNotFound") {
                this._call.cameraNotFound(param1)
              }else {
                if(param1 == "inactivityDetected") {
                  U.Mnt.countRB(1399270);
                  this.voipLog(param1)
                }else {
                  if(param1 == "inactivityMicDetected" && this.microphoneAllowed) {
                    this.voipLog(param1);
                    if(/chrome/i.test(navigator.userAgent)) {
                      if(this.inTalk) {
                        this.voipLog("chromeBugPopup");
                        WA.showGuidePopup()
                      }else {
                        this.voipLog("chromeBugPopupFalse")
                      }
                    }
                  }else {
                    if(param1 == "alreadyConnected") {
                      this._call.delayCall()
                    }
                  }
                }
              }
            }
          }
        }
        break;
      case "ping":
        this._call.pong();
        break;
      case "crash":
        this._call.errorEvent.fire("flash_crash", {category:"local", beforeUnload:!!this._beforeUnloadOccurred});
        break
    }
  }, destroy:function() {
    this.voipChecker.destroy()
  }});
  WA.Voip = new Voip;
  var msgCtx = {scope:"voip.msg", ver:SWF_VERSION_REQUIRED, ver_pstn:SWF_VERSION_PSTN, ver_vid:SWF_VERSION_VIDEO};
  WA.Voip.infoMessages = {flashRequired:WA.tr("swfRequired", msgCtx) + ' <a href="http://www.adobe.com/go/getflashplayer/" target="_blank">' + WA.tr("install", msgCtx) + "</a>", flashVideoRequired:WA.tr("swfVideoRequired", msgCtx) + ' <a href="http://www.adobe.com/go/getflashplayer/" target="_blank">' + WA.tr("install", msgCtx) + "</a>", flashRequiredPSTN:WA.tr("swfPstnRequired", msgCtx) + ' <a href="http://www.adobe.com/go/getflashplayer/" target="_blank">' + WA.tr("install", msgCtx) + "</a>", flashRequiredIncoming:WA.tr("swfRequiredIncoming", 
  msgCtx) + '<br><a href="http://www.adobe.com/go/getflashplayer/" target="_blank">' + WA.tr("install", msgCtx) + "</a>", micUnAllowed:WA.tr("microphoneNotAllowed", msgCtx), micIsBusy:WA.tr("micIsBusy", msgCtx), camIsBusy:WA.tr("camIsBusy", msgCtx), micNotFound:WA.tr("micNotFound", msgCtx), camNotFound:WA.tr("camNotFound", msgCtx), swfLoadTimeout:WA.tr("networkError", msgCtx), "NetConnection.Connect.Failed":WA.tr("networkError2", msgCtx), rtmpConnectFail:WA.tr("networkError3", msgCtx), voipSessionRequestFail:WA.tr("networkError4", 
  msgCtx), INCOMPATIBLE_VERS:WA.tr("incompatible", msgCtx), unknown:WA.tr("networkError5", msgCtx), rtmpBye:WA.tr("callDeclined", msgCtx), AcceptTimedOut:WA.tr("noResponding", msgCtx), "BYE NO RESPONDING":WA.tr("unavailable", msgCtx), noAnswer:WA.tr("noAnswer", msgCtx), "BYE WRONG NUMBER":WA.tr("wrongNumber", msgCtx), notEnoughMoney:WA.tr("notEnoughMoney", msgCtx), "BYE BUSY":WA.tr("lineIsBusy", msgCtx), declined:WA.tr("callDeclined", msgCtx)};
  WA.Voip.infoIcons = {flashRequired:"flash", flashRequiredIncoming:"flash", flashVideoRequired:"flash", "BYE BUSY":"line", notEnoughMoney:"money", "BYE NO RESPONDING":"user", noAnswer:"user", AcceptTimedOut:"user", error:"error"};
  WA.Voip.historyMessages = {callTalk:WA.tr("voip.history.callStart"), callIncoming:WA.tr("voip.history.callIncoming"), callOutgoing:WA.tr("voip.history.callOutgoing"), callDecline:WA.tr("voip.history.callDecline"), callUserDecline:WA.tr("voip.history.callUserDecline"), callEnd:WA.tr("voip.history.callEnd"), callUserCancel:WA.tr("voip.history.callUserCancel")}
})();
WebAgent.Invalidator = function() {
  var WA = WebAgent;
  var Invalidator = WA.extend(WA.Activatable, {constructor:function() {
    this.invalidateEvent = new WA.util.Event;
    this.activate()
  }, invalidate:function() {
    if(this.isActive()) {
      WA.debug.State.set("invalidate_on", new Date);
      this.invalidateEvent.fire()
    }
  }});
  return new Invalidator
}();
WebAgent.Synchronizer = function() {
  var WA = WebAgent;
  var U = WA.util;
  var RequestGroup = WA.extend(Object, {constructor:function() {
    this.count = 0;
    this.items = [];
    this.allData = {}
  }, add:function(id, fn, scope) {
    this.count++;
    this.items.push({id:id, fn:fn, scope:scope});
    return this
  }, _onItemReady:function(data, item) {
    this.count--;
    this.allData[item.id] = data;
    if(this.count == 0) {
      this.readyFn(this.allData);
      this._destroy()
    }
  }, _invokeItem:function(item) {
    var ctx = {ready:WA.createDelegate(this._onItemReady, this, [item], 1)};
    item.fn.call(item.scope || window, ctx)
  }, request:function(readyFn, scope) {
    if(this.count > 0) {
      this.readyFn = WA.createDelegate(readyFn, scope || window);
      U.Array.each(this.items, this._invokeItem, this)
    }else {
      WA.error("Add items!")
    }
  }, _destroy:function() {
    this.readyFn = null;
    this.allData = null;
    this.items = null
  }});
  var SYNC_RECORD_UNCHANGED = "UNCHANGED_" + (new Date).getTime();
  var SyncRecord = WA.extend(WA.data.Record, {isChanged:function(fieldName) {
    return this.hasField(fieldName) && this.get(fieldName) !== SYNC_RECORD_UNCHANGED
  }});
  var ComponentSynchronizer = WA.extend(Object, {constructor:function(owner, id, keys, sessional, isHuge) {
    this.owner = owner;
    this.id = id;
    this._initKeys(keys);
    this.sessional = sessional || false;
    this.hugeStorage = isHuge || false;
    this.triggerEvent = new U.Event;
    this.destroyEvent = new U.Event;
    this.canShowDebugState = false
  }, _initKeys:function(keys) {
    this.keys = WA.isArray(keys) ? keys : [keys];
    this.localData = {};
    U.Array.each(this.keys, function(k) {
      this.localData[k] = ""
    }, this)
  }, getId:function() {
    return this.id
  }, getKeys:function() {
    return this.keys
  }, setData:function(storageData) {
    var data = {};
    var canFire = false;
    var keys = this.getKeys();
    U.Array.each(keys, function(key) {
      var value = storageData[key];
      if(this.localData[key] !== value) {
        this.localData[key] = data[key] = value;
        canFire = true
      }else {
        data[key] = SYNC_RECORD_UNCHANGED
      }
    }, this);
    if(this.canShowDebugState) {
      var debugData = [];
      U.Object.each(this.localData, function(v, k) {
        debugData.push(k + ": " + v)
      });
      WA.debug.State.set("Sync." + this.getId(), debugData.join(", "))
    }
    if(canFire) {
      this.triggerEvent.fire(new SyncRecord(keys, data))
    }
  }, write:function(key, value, cb, scope) {
    this.owner.write(this, key, value, cb, scope)
  }, read:function(cb, scope) {
    this.owner.read(this, cb, scope)
  }, isSessional:function() {
    return this.sessional
  }, isHugeStorage:function() {
    return this.hugeStorage
  }, whenReady:function(fn, scope) {
    this.owner.whenReady(this, fn, scope)
  }, showDebugState:function() {
    this.canShowDebugState = true
  }, destroy:function() {
    this.id = null;
    this.owner = null;
    this.keys = null;
    this.localData = null;
    this.triggerEvent.removeAll();
    this.triggerEvent = null;
    this.destroyEvent.fire(this);
    this.destroyEvent.removeAll();
    this.destroyEvent = null
  }});
  var Synchronizer = WA.extend(Object, {_prefix:"sync", constructor:function() {
    this.dataChecker = new U.DelayedTask({interval:500, fn:this._onDataCheck, scope:this});
    this.syncs = []
  }, registerComponent:function(id, keys, sessional, isHuge) {
    var index = U.Array.indexOfBy(this.syncs, function(sync) {
      return id === sync.getId()
    });
    if(index != -1) {
      WA.error("Duplicate synchronizers: " + id)
    }
    var sync = new ComponentSynchronizer(this, id, keys, sessional !== false, !!isHuge);
    this.syncs.push(sync);
    sync.destroyEvent.on(this._onDestroySync, this);
    return sync
  }, _onDestroySync:function(sync) {
    U.Array.removeBy(this.syncs, function(entry) {
      return entry.getId() === sync.getId()
    }, this)
  }, startUp:function() {
    this.dataChecker.start();
    WA.debug.State.set("Sync.state", "working")
  }, stop:function() {
    this.dataChecker.stop();
    WA.debug.State.set("Sync.state", "stopped")
  }, _generateStorageKey:function(sync, key) {
    return[this._prefix, sync.getId(), key].join("$")
  }, _generateStorageKeys:function(sync) {
    return U.Array.transform(sync.getKeys(), function(id) {
      return this._generateStorageKey(sync, id)
    }, this)
  }, _onDataCheck:function() {
    WA.FocusManager.ifFocused(function() {
      this.dataChecker.start()
    }, function() {
      var prepareFn = function(isSessional, isHugeStorage) {
        var keys = [];
        U.Array.each(this.syncs, function(sync) {
          if(sync.isSessional() === isSessional && sync.isHugeStorage() == isHugeStorage) {
            keys = keys.concat(this._generateStorageKeys(sync))
          }
        }, this);
        var Storage = this._getSyncStorageParams(isSessional, isHugeStorage);
        return function(ctx) {
          Storage.load(keys, {success:function(data) {
            ctx.ready(data)
          }, failure:function(e) {
            WA.error(e)
          }, scope:this})
        }
      };
      var onReady = function(data) {
        U.Array.each(this.syncs, function(sync) {
          var p = sync.isSessional() ? "sessional" : "usual";
          if(sync.isHugeStorage()) {
            p = "huge" + p
          }
          var syncData = this._getSyncData(sync, data[p]);
          sync.setData(syncData)
        }, this);
        this.dataChecker.start()
      };
      (new RequestGroup).add("sessional", prepareFn.call(this, true, false), this).add("usual", prepareFn.call(this, false, false), this).add("hugesessional", prepareFn.call(this, true, true), this).add("hugeusual", prepareFn.call(this, false, true), this).request(onReady, this)
    }, this)
  }, _getSyncData:function(sync, storageData) {
    var keys = sync.getKeys();
    var storageKeys = this._generateStorageKeys(sync);
    var data = {};
    U.Array.each(storageKeys, function(storageKey, index) {
      data[keys[index]] = storageData[storageKey]
    });
    return data
  }, _getSyncStorageParams:function(isSessional, isHugeStorage) {
    var storageType = isSessional ? "SessionStorage" : "Storage";
    if(isHugeStorage) {
      storageType = "Huge" + storageType
    }
    return WA[storageType]
  }, _getSyncStorage:function(sync) {
    return this._getSyncStorageParams(sync.isSessional(), sync.isHugeStorage())
  }, write:function(sync, key, value, cb, scope) {
    WA.FocusManager.ifFocused(function() {
      var data = U.Object.pair(this._generateStorageKey(sync, key), value);
      this._getSyncStorage(sync).save(data, {success:function() {
        if(WA.isFunction(cb)) {
          cb.call(scope || window)
        }
      }, failure:WA.createDelegate(function(e, errorInfo) {
      }, this, [[sync.getId(), key, value].join(" ")], 1), scope:this})
    }, null, this)
  }, read:function(sync, cb, scope) {
    var keys = this._generateStorageKeys(sync);
    this._getSyncStorage(sync).load(keys, {success:function(storageData) {
      var data = this._getSyncData(sync, storageData);
      cb.call(scope || window, new SyncRecord(sync.getKeys(), data))
    }, failure:WA.createDelegate(function(e, errorInfo) {
      WA.error(e + ", info: [" + errorInfo + "]")
    }, this, [[sync.getId(), keys].join(" ")], 1), scope:this})
  }, whenReady:function(sync, fn, scope) {
    this._getSyncStorage(sync).whenReady(fn, scope)
  }});
  return new Synchronizer
}();
WebAgent.ChangeLog = function() {
  var WA = WebAgent;
  var U = WA.util;
  var JSON = WA.getJSON();
  var readyEvent = new U.Event;
  var ChangeLog = WA.extend(WA.Activatable, {constructor:function() {
    this.sequenceId = -2;
    this.data = [];
    this.sync = WA.Synchronizer.registerComponent("changelog", ["data"]);
    this.updateEvent = new U.Event;
    this.updateEvent.on(function(data) {
      WA.debug.State.set("changelog-id", this.sequenceId).set("changelog-data", JSON.stringify(data))
    }, this)
  }, _onReady:function() {
    this.sync.read(function(syncRecord) {
      this._onSyncRestore(syncRecord);
      if(this._isReady()) {
        readyEvent.fire()
      }else {
        WA.error("Initialization failed")
      }
      this.sync.triggerEvent.on(this._onSyncTriggerEvent, this);
      WA.conn.Connection.triggerEvent.on(this._onConnectionTriggerEvent, this);
      WA.conn.Socket.afterResponseEvent.on(this._onSocketAfterResponseEvent, this);
      WA.Invalidator.invalidateEvent.on(this._onInvalidate, this)
    }, this)
  }, _isReady:function() {
    return this.sequenceId >= 0
  }, whenReady:function(fn, scope) {
    if(this._isReady()) {
      fn.call(scope)
    }else {
      readyEvent.on(fn, scope, {single:true})
    }
  }, _onActivate:function() {
    if(!this._isReady()) {
      if(this.sequenceId === -2) {
        this.sync.whenReady(this._onReady, this)
      }else {
        this.sync.read(this._onSyncRestore, this)
      }
    }
  }, _onDeactivate:function() {
    this._clear()
  }, _onInvalidate:function() {
    if(this.isActive()) {
      this._clear();
      this.sync.read(this._onSyncRestore, this)
    }
  }, getSequenceId:function() {
    return this.sequenceId
  }, get:function(mail) {
    var index = this._logIndexOf(mail);
    return this.data[index]
  }, _onConnectionTriggerEvent:function(type, value) {
    if(type === "contactStatus" && this.data) {
      this._log(value)
    }
  }, _onSocketAfterResponseEvent:function() {
    this._commit()
  }, _logIndexOf:function(mail) {
    return U.Array.indexOfBy(this.data, function(logItem) {
      return logItem.email === mail
    })
  }, logAction:function(action, data) {
    var o = WA.applyIf({action:action}, data);
    WA.applyIf(o, {status:{type:null}});
    this._log(o);
    this._commit()
  }, _log:function(data) {
    if(!this.isActive()) {
      return
    }
    var index = this._logIndexOf(data.email);
    if(index != -1) {
      this.data[index].nick = data.nickname;
      this.data[index].status = data.status.type;
      this.data[index].statusTitle = data.status.title
    }else {
      index = this.data.length;
      this.data.push({email:data.email, status:data.status.type, statusTitle:data.status.title || null, nick:data.nickname, action:data.action})
    }
    if(data.tel) {
      this.data[index].tel = data.tel
    }
    if(data.features) {
      this.data[index].features = data.features
    }
  }, _commit:function() {
    if(!this.isActive()) {
      return
    }
    if(this._isReady()) {
      if(this.sequenceId === Number.MAX_VALUE) {
        this.sequenceId = 0
      }else {
        this.sequenceId += 1
      }
      var newData = JSON.stringify({id:this.sequenceId, data:this.data});
      this.sync.write("data", newData, function() {
        this.updateEvent.fire(this.data);
        this.data = []
      }, this)
    }
  }, _clear:function() {
    this.sequenceId = -1;
    this.data = []
  }, _parseData:function(str) {
    return JSON.parse(str || "null")
  }, _parseSeqId:function(v) {
    return parseInt(v || 0)
  }, _onSyncRestore:function(syncRecord) {
    var o = this._parseData(syncRecord.get("data"));
    if(!o) {
      this.sequenceId = 0
    }else {
      this.sequenceId = this._parseSeqId(o.id)
    }
    WA.debug.State.set("changelog-id", this.sequenceId)
  }, _onSyncTriggerEvent:function(syncRecord) {
    if(!this.isActive()) {
      return
    }
    if(syncRecord.isChanged("data")) {
      var o = this._parseData(syncRecord.get("data"));
      if(o) {
        var sequenceId = this._parseSeqId(o.id);
        if(sequenceId !== 0 && this.sequenceId !== -1 && Math.abs(sequenceId - this.sequenceId) > 1) {
          WA.Invalidator.invalidate()
        }else {
          this.sequenceId = sequenceId
        }
        this.data = o.data;
        this.updateEvent.fire(this.data, true)
      }
    }
  }});
  return new ChangeLog
}();
(function() {
  var WA = WebAgent;
  var JSON = WA.getJSON();
  var U = WA.util;
  var TYPING_STATE = "typingNotify";
  var MESSAGE_STATE = "message";
  var TYPING_INTERVAL = 15E3;
  var CS = WA.extend(WA.Activatable, {constructor:function() {
    this.data = {};
    this.typings = {};
    this.updateEvent = new WA.util.Event;
    this.sync = WA.Synchronizer.registerComponent("constates", ["data"], true);
    this.sync.triggerEvent.on(this._onSyncTriggerEvent, this);
    WA.conn.Connection.triggerEvent.on(this._onConnectionTriggerEvent, this);
    WA.conn.UserState.statusChangedEvent.on(function(status) {
      if(status == "offline") {
        U.Object.each(this.typings, function(task) {
          task.stop()
        }, this);
        this.typings = {}
      }
    }, this)
  }, _fireUpdateEvent:function() {
    if(this.isActive()) {
      var data = WA.apply({}, this.data);
      this.updateEvent.fire(data)
    }
  }, getStates:function(email) {
    var o = this.data[email];
    return o ? o.states : null
  }, getUnread:function(email) {
    var o = this.data[email];
    return o ? o.unread : null
  }, hasUnread:function() {
    var unread = false;
    WA.util.Object.each(this.data, function(entry, email) {
      if(this.getUnread(email) > 0) {
        unread = true;
        return false
      }
    }, this);
    return unread
  }, _saveSyncData:function() {
    if(this.isActive()) {
      this.sync.write("data", JSON.stringify(this.data))
    }
  }, removeState:function(email, state) {
    this._removeState(email, state)
  }, removeStates:function(emails, state) {
    if(WA.isArray(emails) && emails.length > 0) {
      var statefulEmails = [];
      WA.util.Array.each(emails, function(m) {
        if(this.getStates(m)) {
          statefulEmails.push(m)
        }
      }, this);
      var len = statefulEmails.length;
      if(len > 0) {
        var silentOptions = {suppressEvent:true, sync:false};
        WA.util.Array.each(statefulEmails, function(m, index) {
          if(len - 1 === index) {
            this.removeState(m, state)
          }else {
            this._removeState(m, state, silentOptions)
          }
        }, this)
      }
    }
  }, _removeState:function(email, state, options) {
    var states = this.getStates(email);
    if(states) {
      WA.util.Array.remove(states, state);
      options = options || {};
      if(options.suppressEvent !== true) {
        this._fireUpdateEvent()
      }
      if(options.sync !== false) {
        this._saveSyncData()
      }
    }
  }, saveUnread:function(email, count) {
    if(this.data[email]) {
      this.data[email].unread = count
    }else {
      this.data[email] = {states:[], unread:count}
    }
    this._saveSyncData()
  }, _saveState:function(email, state) {
    var states = this.getStates(email);
    if(!states) {
      this.data[email] = {states:[state]};
      this._saveState(email, state);
      return
    }
    if(state === MESSAGE_STATE) {
      WA.util.Array.remove(states, TYPING_STATE);
      WA.util.Array.remove(states, MESSAGE_STATE)
    }
    if(WA.util.Array.indexOf(states, state) == -1) {
      states.push(state)
    }
    if(state === TYPING_STATE) {
      this._processTyping(email)
    }
    this._fireUpdateEvent();
    this._saveSyncData()
  }, _processTyping:function(email, interval) {
    if(this.data[email]) {
      var typing = this.typings[email];
      if(!typing) {
        typing = this.typings[email] = new WA.util.DelayedTask({interval:interval || TYPING_INTERVAL, fn:WA.createDelegate(function(m) {
          delete this.typings[m];
          delete this.data[m].typing;
          this._removeState(m, TYPING_STATE, {sync:false})
        }, this, [email], 0)})
      }
      typing.start();
      this.data[email].typing = (new Date).getTime()
    }
  }, _onConnectionTriggerEvent:function(type, value) {
    if(WA.util.Array.indexOf([TYPING_STATE, MESSAGE_STATE], type) != -1) {
      this._saveState(value.from, type)
    }
  }, _onActivate:function() {
    this.sync.whenReady(function() {
      this.sync.read(this._onSyncTriggerEvent, this)
    }, this)
  }, _onSyncTriggerEvent:function(syncRecord) {
    if(syncRecord.isChanged("data")) {
      var data = JSON.parse(syncRecord.get("data") || "null");
      if(data) {
        this.data = data;
        WA.util.Object.each(data, function(entry, email) {
          if(WA.util.Array.indexOf(this.getStates(email) || [], TYPING_STATE) != -1) {
            var typing = parseInt(this.data[email].typing) || TYPING_INTERVAL;
            var delta = (new Date).getTime() - typing;
            if(delta >= 0 && delta < TYPING_INTERVAL) {
              this._processTyping(email, TYPING_INTERVAL - delta)
            }else {
              this._removeState(email, TYPING_STATE, {suppressEvent:true, sync:false})
            }
          }
        }, this);
        this._fireUpdateEvent()
      }
    }
  }});
  WA.ContactStates = new CS;
  WA.ContactStates.TYPING_STATE = TYPING_STATE;
  WA.ContactStates.MESSAGE_STATE = MESSAGE_STATE
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var Storage = WA.Storage;
  var UI = WA.ui;
  var JSON = WA.getJSON();
  var ALL = {status_5:"", status_18:"", status_19:"", status_7:"", status_10:"", status_47:"", status_22:"", status_26:"", status_24:"", status_27:"", status_23:"", status_4:"", status_9:"", status_6:"", status_21:"", status_20:"", status_17:"", status_8:"", status_15:"", status_16:"", status_28:"", status_51:"", status_52:"", status_46:"", status_12:"", status_13:"", status_11:"", status_14:"", status_48:"", status_53:"", status_29:"", status_30:"", status_32:"", status_33:"", status_40:"", status_41:"", 
  status_34:"", status_35:"", status_36:"", status_37:"", status_38:"", status_39:"", status_42:"", status_43:"", status_49:"", status_44:"", status_45:"", status_50:""};
  U.Object.each(ALL, function(val, key) {
    ALL[key] = WA.tr(key.substr(7), {scope:"status"})
  });
  var DEFAULTS = ["status_52", "status_17", "status_21", "status_37", "status_26"];
  var STORAGE_SCHEMA = ["type", "text"];
  var XS = WA.extend(Object, {constructor:function() {
    this.currentStatuses = U.Array.transform(DEFAULTS, function(entry) {
      if(ALL.hasOwnProperty(entry)) {
        return{type:entry, text:ALL[entry]}
      }else {
        WA.error("Invalid default status: " + entry)
      }
    });
    this.dialogInstance = null;
    this.sync = WA.Synchronizer.registerComponent("xstatuses", ["data"], false);
    this.sync.triggerEvent.on(this._onSyncTriggerEvent, this);
    this.updateEvent = new U.Event;
    this.sync.whenReady(function() {
      this.sync.read(this._onSyncTriggerEvent, this)
    }, this)
  }, _onSyncTriggerEvent:function(syncRecord) {
    if(syncRecord.isChanged("data")) {
      var data = syncRecord.get("data");
      if(data) {
        U.Array.each(JSON.parse(data), function(xs, index) {
          U.Array.each(xs, function(value, i) {
            var key = STORAGE_SCHEMA[i];
            this.currentStatuses[index][key] = value
          }, this)
        }, this);
        this.updateEvent.fire(this.currentStatuses)
      }
    }
  }, update:function(data) {
    if(data.length != this.currentStatuses.length) {
      WA.error("Invalid data")
    }
    var storageData = [];
    U.Array.each(data, function(entry, index) {
      storageData[index] = U.Array.transform(STORAGE_SCHEMA, function(k) {
        return entry[k]
      })
    });
    this.sync.write("data", JSON.stringify(storageData), function() {
      this.currentStatuses = U.Array.clone(data);
      this.updateEvent.fire(this.currentStatuses)
    }, this)
  }, getCurrents:function() {
    return this.currentStatuses
  }, getCurrentText:function(status) {
    var xs = U.Array.findBy(this.currentStatuses, function(entry) {
      if(entry.type === status) {
        return true
      }
    });
    if(xs) {
      return xs.text
    }else {
      return null
    }
  }, getAll:function() {
    return ALL
  }, openDialog:function(container) {
    var dialog = this.dialogInstance;
    if(!dialog) {
      dialog = this.dialogInstance = new Dialog(this);
      dialog.render(container)
    }
    return dialog.show()
  }});
  var DialogItem = WA.extend(UI.Component, {constructor:function(window, xs) {
    this.window = window;
    DialogItem.superclass.constructor.call(this);
    this.textField = new UI.TextField({maxLength:32, cls:"nwa-rename-statuses__item-field"});
    this.clearBtn = new WA.ui.Button({cls:"nwa-rename-statuses__item-clear", handler:function() {
      this.textField.val("");
      this.textField.focus()
    }, scope:this});
    var items = [];
    U.Object.each(ALL, function(text, type) {
      items.push(new UI.menu.Image({cls:WA.buildIconClass(type), title:text, statusType:type}))
    });
    var menu = new UI.menu.ImageMenu({items:items});
    this.picker = new UI.ImageButton({menu:menu, cls:"nwa-rename-statuses__picker"});
    menu.itemClickEvent.on(this._onMenuItemClick, this);
    this.setValue(xs)
  }, _onRender:function(container) {
    this.el = container.createChild({cls:"nwa-rename-statuses__item", children:[{cls:"nwa-rename-statuses__item-picker"}]});
    this.picker.render(this.el.first());
    this.textField.render(this.el);
    this.clearBtn.render(this.el)
  }, _onMenuItemClick:function(menu, item) {
    var config = item.initialConfig;
    var status = config.statusType;
    this.setValue({type:status, text:this.value.text || ""})
  }, setValue:function(value) {
    this.value = WA.apply({}, value);
    this.picker.setIconCls(WA.buildIconClass(value.type));
    this.textField.val(value.text)
  }, getValue:function() {
    this.value.text = this.textField.val();
    return this.value
  }, destroy:function() {
    this.picker.destroy();
    this.picker = null;
    this.textField.destroy();
    this.textField = null;
    this.window = null;
    DialogItem.superclass.destroy.call(this)
  }});
  var Dialog = WA.extend(UI.Window, {closeAction:"hide", constructor:function(xsObject) {
    this.xsObject = xsObject;
    var items = [];
    this.__eachCurrentStatus(function(xs) {
      items.push(new DialogItem(this, xs))
    });
    Dialog.superclass.constructor.call(this, {id:WA.buildId("xstatus-dlg"), cls:"nwa-rename-statuses", fadeIn:true, items:items, title:WA.tr("box.editStatuses"), bbar:["->", {cls:"nwa-button_blue", text:WA.tr("box.save"), handler:function() {
      this._saveStatuses()
    }, scope:this}, {cls:"nwa-button_blue", text:WA.tr("box.cancel"), handler:function() {
      this.close()
    }, scope:this}]})
  }, __eachCurrentStatus:function(fn, scope) {
    U.Array.each(this.xsObject.getCurrents(), fn, scope || this)
  }, _saveStatuses:function() {
    var data = U.Array.transform(this.items, function(item) {
      return item.getValue()
    });
    this.xsObject.update(data);
    this.close()
  }, _onBeforeShow:function(me) {
    Dialog.superclass._onBeforeShow.call(this, me);
    this.__eachCurrentStatus(function(xs, index) {
      this.items[index].setValue(xs)
    }, this)
  }, _onHide:function(me) {
    Dialog.superclass._onHide.call(this, me)
  }, destroy:function() {
    this.xsObject = null;
    Dialog.superclass.destroy.call(this)
  }});
  WA.XStatuses = new XS
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var UI = WA.ui;
  var S = WA.Storage;
  var ConnectionRoster = WA.conn.ConnectionRoster;
  var SMS_LIMIT_LAT = 116;
  var SMS_LIMIT_RUS = 36;
  var translit = {"Ё":"YO", "Й":"I", "Ц":"TS", "У":"U", "К":"K", "Е":"E", "Н":"N", "Г":"G", "Ш":"SH", "Щ":"SCH", "З":"Z", "Х":"H", "Ъ":"'", "ё":"yo", "й":"i", "ц":"ts", "у":"u", "к":"k", "е":"e", "н":"n", "г":"g", "ш":"sh", "щ":"sch", "з":"z", "х":"h", "ъ":"'", "Ф":"F", "Ы":"I", "В":"V", "А":"A", "П":"P", "Р":"R", "О":"O", "Л":"L", "Д":"D", "Ж":"ZH", "Э":"E", "ф":"f", "ы":"i", "в":"v", "а":"a", "п":"p", "р":"r", "о":"o", "л":"l", "д":"d", "ж":"zh", "э":"e", "Я":"YA", "Ч":"CH", "С":"S", "М":"M", "И":"I", 
  "Т":"T", "Ь":"'", "Б":"B", "Ю":"YU", "я":"ya", "ч":"ch", "с":"s", "м":"m", "и":"i", "т":"t", "ь":"'", "б":"b", "ю":"yu"};
  var TextArea = WA.extend(UI.TextField, {initComponent:function() {
    this.initialConfig.hintText = WA.tr("sms.typeText");
    TextArea.superclass.initComponent.apply(this, arguments);
    this.changeEvent = new U.Event;
    this._changeCheckTask = new U.DelayedTask({interval:250, fn:this._onChangeCheck, scope:this})
  }, _onChangeCheck:function() {
    var val = this.val();
    if(this._val != val) {
      this._val = val;
      this.changeEvent.fire(val)
    }
    this._changeCheckTask.start()
  }, changeLockup:function() {
    this._val = this.val();
    this._changeCheckTask.start()
  }, stopLockup:function() {
    this._changeCheckTask.stop()
  }});
  var OkDialog = WA.extend(WA.ui.Window, {closeAction:"hide", constructor:function() {
    this.nickField = new WA.ui.TextField({cls:"nwa-textfield_thin"});
    OkDialog.superclass.constructor.call(this, {fadeIn:true, modal:true, cls:"nwa-dlg-rename", items:[this.nickField], title:WA.tr("sms.saveAsContact"), bbar:["->", {cls:"nwa-button_blue", text:WA.tr("sms.save"), handler:function() {
      this._fireOkEvent(true)
    }, scope:this}, {cls:"nwa-button_blue", text:WA.tr("sms.nope"), handler:function() {
      this._fireOkEvent()
    }, scope:this}]});
    this.okEvent = new WA.util.Event
  }, _fireOkEvent:function(saveAsContact) {
    this.okEvent.fire(this.__mail, this.nickField.val(), saveAsContact);
    this.close()
  }, _onAfterRender:function(ct) {
    OkDialog.superclass._onAfterRender.call(this);
    this.nickField.getEl().on("keyup", function(e) {
      if(e.getKeyCode() === 13) {
        this._fireOkEvent(true)
      }
    }, this)
  }, setMeta:function(mail, nick) {
    this.__mail = mail;
    this.nickField.val(U.String.entityDecode(nick) || mail)
  }, _onShow:function() {
    OkDialog.superclass._onShow.call(this);
    this.nickField.focus()
  }});
  WA.afterFirstExecEvent.on(function() {
    WA.IncomingSMS = WA.extend(WA.IncomingMessage, {constructor:function(data) {
      WA.IncomingSMS.superclass.constructor.apply(this, arguments);
      this.data.tel = data.tel;
      this.data.nick = data.tel;
      this.data.from = data.from;
      var contact = this._loadSAInfo(data);
      if(contact && contact.mail) {
        this.data.from = contact.mail;
        this.data.nick = contact.nick
      }
    }, _loadSAInfo:function(value) {
      return WA.SA.getByTel(value.tel)
    }});
    WA.OutgoingSMS = WA.extend(WA.OutgoingMessage, {UNDELIVERED_TIMEOUT:100, constructor:function(data) {
      WA.OutgoingSMS.superclass.constructor.apply(this, arguments);
      this.data.tel = data.tel.replace(/^8([\d]{10})/, "7$1").replace(/^\+(.+)/, "$1");
      this._onConnectionMessageDelivered({message_id:this.data.message_id, timestamp:this.data.date})
    }, send:function() {
      U.Mnt.countRB(980041);
      WA.conn.Socket.send("sms", {tel:this.data.tel, text:this.data.text});
      S.modify(["promo.click"], function(storage) {
        if(storage["promo.click"]) {
          U.Mnt.countRB(1107E3);
          storage["promo.click"] = ""
        }
      }, this)
    }})
  });
  var Abstraction = WA.extend(ConnectionRoster, {constructor:function() {
    Abstraction.superclass.constructor.apply(this, arguments);
    this.updateEvent = new U.Event;
    this.addSuccessEvent = new U.Event;
    this._profiles = {};
    this._waiting = {};
    this._addHistory = {}
  }, search:function(opts) {
    opts.uniq = this._uniq = opts.uniq || Math.round(Math.random() * 999999);
    WA.conn.Socket.send("wp", opts);
    this.__search = opts
  }, get:function(mail, cb, scope) {
    if(this._profiles[mail]) {
      cb.call(scope || window, this._profiles[mail])
    }else {
      if(!this._waiting[mail]) {
        this._waiting[mail] = [];
        this.search({email:mail})
      }
      this._waiting[mail].push([cb, scope])
    }
  }, _invokeWaitings:function() {
    var dellist = [];
    U.Object.each(this._waiting, function(cbs, mail) {
      if(this._profiles[mail]) {
        U.Array.each(cbs, function(cb) {
          cb[0].call(cb[1] || window, this._profiles[mail])
        }, this);
        dellist.push(mail)
      }
    }, this);
    U.Array.each(dellist, function(mail) {
      delete this._waiting[mail]
    }, this)
  }, _collectProfiles:function(value) {
    U.Array.each(value, function(contact) {
      this._profiles[contact.email] = contact
    }, this)
  }, _onConnectionWp:function(value) {
    if(value.uniq && value.uniq == this._uniq) {
      if(value.result) {
        delete this.__search;
        this._collectProfiles(value.result);
        this.updateEvent.fire(value.result, value.uniq);
        this._invokeWaitings()
      }else {
        if(value.error == "unknow") {
          WA.setTimeout(function() {
            return WA.createDelegate(function() {
              this.search(this.__search)
            }, this)
          }.call(this), 5E3)
        }else {
          this.updateEvent.fire([])
        }
      }
    }
  }});
  WA.SMSDialog = WA.extend(UI.Layer, {constructor:function() {
    WA.SMSDialog.superclass.constructor.apply(this, arguments);
    this.autoEl = null;
    this._textarea = new TextArea({cls:"nwa-sms-text", multiline:true});
    this._textarea.changeEvent.on(this._onTextChange, this);
    this._textfield = new UI.Autocomplete({arrow:true, hintText:WA.tr("sms.typeName"), listMaxLen:6});
    this._textfield.changeEvent.on(this._onTelChangeEvent, this);
    this._textfield.selectedEvent.on(this._textarea.focus, this._textarea);
    this._sendBtn = new UI.Button({cls:"nwa-button nwa-button_orange", disabled:true, disabledCls:"new-button_disabled", text:WA.tr("sms.send"), handler:this._onSmsSend, scope:this});
    this.requestListEvent = new U.Event;
    this.sendSmsEvent = new U.Event;
    this.openDialogEvent = new U.Event;
    this.addContactEvent = new U.Event;
    this._sendAbility = {};
    this._rateLimit = new U.DelayedTask({interval:500, fn:this._updateRateLimitDelay, scope:this});
    this._okDialog = new OkDialog;
    this._okDialog.okEvent.on(this._onOkEvent, this);
    this._abstraction = new Abstraction
  }, _onTelChangeEvent:function() {
    this._sendAbility.tel = !!this._textfield.val().replace(/[-+_\(\)\[\]\s]+/g, "").match(/^\d+$/);
    this._checkSendAbility()
  }, _onSmsSend:function() {
    if(this._checkSendAbility() !== true) {
      return false
    }
    var sms = this._textarea.val();
    if(sms.length > 0) {
      if(this._translitEl.dom.checked) {
        sms = this._translit(sms)
      }
      var contact = false;
      var sel = this._textfield.getSelectionInfo();
      var tel = sel.value.replace(/\D+/g, "");
      if(!sel.item) {
        contact = this._telHash[tel];
        if(contact) {
          sel.item = {mail:contact[0]}
        }
      }else {
        contact = this._mailHash[sel.item.mail]
      }
      if(this._search && !WA.MainAgent.isTel(this._search) && !contact) {
        var email = this._search;
        WA.conn.Socket.send("contact", {operation:"add-tel", tel:tel, email:email});
        var index = U.Array.indexOfBy(this._list, function(contact) {
          return contact[0] == email
        });
        contact = this._list[index];
        if(contact) {
          this._telHash[tel] = contact;
          this.__addSearchItem(contact, tel)
        }else {
          contact = [email]
        }
        this._sendSms(contact, sms)
      }else {
        if(!contact) {
          this._okDialog.setMeta({tel:tel, sms:sms}, sel.value);
          this._okDialog.show()
        }else {
          this._sendSms(contact, sms)
        }
      }
    }
  }, _onOkEvent:function(info, nick, saveAsContact) {
    var contact = [info.tel + "@tel.agent", nick, 1, , "tel", "Телефон", [info.tel]];
    if(saveAsContact) {
      WA.conn.Socket.send("contact", {operation:"add", tel:info.tel, nickname:nick});
      this.addContactEvent.fire(contact[0], contact[1], info.tel)
    }
    this._sendSms(contact, info.sms)
  }, _sendSms:function(contact, sms) {
    if(WA.MainAgent.isTel(contact[0])) {
      this.openDialogEvent.fire(contact[0], contact[1], "tel", WA.tr("sms.phone"))
    }else {
      if(contact[1]) {
        this.openDialogEvent.fire(contact[0], contact[1], contact[3], contact[4], contact[5])
      }
    }
    this.sendSmsEvent.fire(contact[0], this._textfield.val(), sms);
    this._sendDate = +new Date;
    S.save({"sms.sendDate":this._sendDate});
    this.reset();
    this.hide()
  }, _isCyrillic:function(str) {
    return!!str.match(/[а-я]/i)
  }, _translit:function(str) {
    return str.replace(/[а-я]/ig, function(a) {
      return translit[a] || a
    })
  }, _onTextChange:function(text) {
    this._sendAbility.text = false;
    if(text.length > 0) {
      var limit = SMS_LIMIT_LAT;
      if(this._isCyrillic(text)) {
        if(this._translitEl.dom.checked) {
          text = this._translit(text)
        }else {
          limit = SMS_LIMIT_RUS
        }
      }
      var left = limit - text.length;
      var aleft = Math.abs(left);
      if(aleft == 0) {
        U.Mnt.countRB(979802)
      }
      if(left < 0) {
        this._leftEl.addClass("nwa-sms-excess");
        var prefix = WA.tr("sms.exceed", {count:aleft})
      }else {
        this._leftEl.removeClass("nwa-sms-excess");
        prefix = WA.tr("sms.remain", {count:left});
        this._sendAbility.text = true
      }
      this._leftEl.update(WA.tr("sms.symbols", {count:aleft, prefix:prefix}))
    }else {
      this._leftEl.update("")
    }
    this._checkSendAbility()
  }, _checkSendAbility:function() {
    if(this._sendAbility.text && this._sendAbility.tel && this._sendAbility.ratelimit) {
      this._sendBtn.enable();
      return true
    }else {
      this._sendBtn.disable()
    }
  }, _onTranslitChange:function() {
    this._onTextChange(this._textarea.val())
  }, _onRender:function(el) {
    var rendId = Math.random();
    this.el = el.createChild({cls:"nwa-add nwa_fadein nwa-sms", style:"opacity: 1; display: none;", children:[{cls:"nwa-add__plate", children:[{cls:"nwa-add__nick", children:[{tag:"span", children:WA.tr("sms.sendSMS")}, {cls:"nwa-header__nick-fadeout"}]}, {cls:"nwa-addcontact__close"}, {cls:"nwa-sendremain"}, {cls:"nwa-white-plate", children:[{cls:"nwa-add__title", children:WA.tr("sms.typeName")}, {tag:"input", type:"checkbox", cls:"nwa-sms__translit-checkbox", id:"nwaTranslit" + rendId}, {tag:"label", 
    "for":"nwaTranslit" + rendId, cls:"nwa-sms__translit-label", children:WA.tr("sms.autoTranslit")}, {cls:"nwa-sms__left"}]}]}]});
    this._okDialog.render(this.el);
    this._plateEl = this.el.first().last();
    this._translitEl = this._plateEl.first().next();
    this._translitLabelEl = this._plateEl.first().next().next();
    this._leftEl = this._plateEl.first().next().next().next();
    this._textarea.render(this._plateEl);
    this._textfield.render(this._plateEl);
    this._sendBtn.render(this._plateEl);
    this._remainEl = this._plateEl.prev()
  }, _onAfterRender:function() {
    this.el.first().first().next().on("click", this.hide, this);
    this.el.on("click", this._textfield.close, this._textfield);
    this._textarea.getEl().on("keydown", function(e) {
      if(!e.shiftKey && e.keyCode == 13) {
        this._onSmsSend();
        e.preventDefault()
      }
    }, this);
    this._translitEl.on("click", this._onTranslitChange, this);
    this._translitLabelEl.on("click", this._onTranslitChange, this)
  }, reset:function(keepText) {
    this._sendAbility = {};
    this._checkSendAbility();
    this._textfield.close();
    this._textfield.val("");
    if(!keepText) {
      this._textarea.val("")
    }
    this._leftEl.update("")
  }, _requestList:function() {
    this.requestListEvent.fire(this._prepareList, this)
  }, _onProfile:function(profile) {
    if(profile.phones) {
      var tel = profile.phones.replace(/\D+/g, "");
      if(!this._telHash[tel]) {
        var index = U.Array.indexOfBy(this._list, function(contact) {
          return contact[0] == profile.email
        });
        var item = this._list[index];
        this._telHash[tel] = item;
        this.__addSearchItem(item, tel);
        this._textfield.updateList(this._res);
        this._textfield.search(false, this._search)
      }
    }
  }, __addSearchItem:function(item, tel) {
    var trimtel = tel.replace(/\D+/g, "");
    this._res.push({title:tel + " " + (item[1] || !WA.MainAgent.isTel(item[0]) && item[0] || ""), search:(item[0] + (item[1] || "")).toLowerCase() + trimtel, mail:item[0], tel:tel});
    return trimtel
  }, _prepareList:function(list) {
    this._list = list;
    var telHash = {};
    var mailHash = {};
    this._res = [];
    U.Array.each(list, function(item) {
      if(item[5] && item[5].length) {
        mailHash[item[0]] = item;
        U.Array.each(item[5], function(tel) {
          var trimtel = this.__addSearchItem(item, tel);
          telHash[trimtel] = item
        }, this)
      }
    }, this);
    this._telHash = telHash;
    this._mailHash = mailHash;
    this._textfield.updateList(this._res);
    if(this._search) {
      if(WA.MainAgent.isTel(this._search)) {
        this._textfield.search(this._search.split("@")[0], false, false, true)
      }else {
        this._textfield.search(false, this._search, false, true)
      }
    }
    var phones = this._mailHash[this._search] ? this._mailHash[this._search][5] : [];
    this._textfield.toggleArrow(phones.length > 1)
  }, setEmail:function(email) {
    this._search = email;
    if(email && !WA.MainAgent.isTel(email)) {
      this._textfield.toggleArrow(true)
    }
  }, _onClick:function(e) {
    if(!this.isVisible() || e.button !== 0) {
      return
    }
    var isAncestor = false;
    var isSelf = false;
    var target = e.getTarget(true);
    if(target) {
      isSelf = this.el.equals(target);
      isAncestor = isSelf || this.el.contains(target)
    }
    if(isAncestor) {
      this._onAncestorClick(target, isSelf, e);
      if(this.initialConfig.hideOnClick) {
        this.hide()
      }
    }else {
      this.hide()
    }
  }, _onHide:function() {
    WA.SMSDialog.superclass._onHide.apply(this, arguments);
    this._textarea.stopLockup()
  }, _onShow:function() {
    WA.SMSDialog.superclass._onShow.apply(this, arguments);
    this._textarea.changeLockup();
    this._requestList();
    this._sendAbility.ratelimit = false;
    this._checkSendAbility();
    S.load(["sms.sendDate"], {success:function(storage) {
      this._sendDate = +(storage["sms.sendDate"] || 0);
      if(+new Date - this._sendDate > 6E4) {
        this._sendAbility.ratelimit = true;
        this._checkSendAbility()
      }else {
        U.Mnt.countRB(979806);
        this._updateRateLimitDelay()
      }
    }, scope:this})
  }, _updateRateLimitDelay:function() {
    var remain = 60 - Math.floor((+new Date - this._sendDate) / 1E3);
    if(remain > 0) {
      this._sendAbility.ratelimit = false;
      this._remainEl.update(WA.tr("sms.nextTry", {count:remain}));
      this._rateLimit.start()
    }else {
      this._remainEl.update("");
      this._sendAbility.ratelimit = true
    }
    this._checkSendAbility()
  }, updateList:function(list) {
    this._textfield.update(list)
  }})
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var UI = WA.ui;
  var ConnectionRoster = WA.conn.ConnectionRoster;
  var FRIENDSHIP_TYPES = ["", WA.tr("search.possiblyClassmate"), WA.tr("search.possiblyGroupmate"), WA.tr("search.possiblyColleague"), WA.tr("search.youHaveMutualFriends"), WA.tr("search.yourSubscriber"), WA.tr("search.yourFavorite"), WA.tr("search.hisFavorite"), WA.tr("search.hisSubscriber"), "", WA.tr("search.correspondy"), WA.tr("search.correspondy"), WA.tr("search.correspondy"), WA.tr("search.correspondy"), WA.tr("search.yourFriend"), WA.tr("search.yourFriendsFriend"), WA.tr("search.yourICQFriend"), 
  WA.tr("search.yourOKFriend"), WA.tr("search.peopleYouMayKnow")];
  var TAB_HTML = '<div class="nwa-button_blue nwa-add__tab" wa-tabindex="{1}"><span class="nwa-button" wa-tabindex="{1}">{0}</span></div>';
  var ACTIVE_TAB_HTML = '<div class="nwa-white-plate nwa-add__tab_active" wa-tabindex="{1}"><span class="nwa-button" wa-tabindex="{1}">{0}</span></div>';
  var SEARCH_RESULT_HTML = '<div class="nwa-suggest-item nwa-add__search-item">                                        <div class="nwa-add__search-item__userpic" wa-action="userpic" wa-mail="{mail}" style="background-image:url({avatar});"></div>                                        <div class="nwa-add__search-item__info">                                            <div class="nwa-add__search-item__name {status}">{name}<div class="nwa-add__search-item__name-fader"></div></div>{relation}                                            <div class="nwa-add__search-item__buttons">                                                <span class="nwa-add__search-item__button nwa-dialog__tools-profile" wa-action="profile" wa-mail="{mail}">' + 
  WA.tr("search.profile") + '</span>                                                <span class="nwa-add__search-item__button nwa-add__btn-add" wa-action="add" wa-mail="{mail}" wa-name="{name}">' + WA.tr("search.add") + "</span>{nofriends}                                            </div>                                        </div>                                    </div>";
  var SEARCH_RESULT_TOP = '<div class="nwa-add__title2">' + WA.tr("search.youSearched") + ' <span>{title}</span><div class="nwa-add__title2-fader"></div></div></div><div class="nwa-add__return"><a wa-action="back" href="javascript: void(0);">' + WA.tr("search.backToSearchParams") + "</a></div>";
  var SEARCH_EMPTY = '<div class="nwa-add__title2">' + WA.tr("search.noResults") + "</div>";
  var Tabs = WA.extend(UI.Component, {constructor:function() {
    Tabs.superclass.constructor.apply(this, arguments);
    this.tabChangeEvent = new U.Event;
    this._list = [];
    this._index = 0
  }, _onRender:function(el) {
    this.el = el.createChild({cls:"nwa-add__tabs"});
    this.el.on("click", this._onClickEvent, this);
    this._redraw()
  }, _onClickEvent:function(el) {
    var trg = el.getTarget(true);
    var index = +trg.getAttribute("wa-tabindex");
    if(!isNaN(index)) {
      if(this.setFocus(index)) {
        this.tabChangeEvent.fire(index)
      }
    }
  }, _redraw:function() {
    var html = [];
    U.Array.each(this._list, function(title, i) {
      html.push(U.String.format(i == this._index ? ACTIVE_TAB_HTML : TAB_HTML, title, i))
    }, this);
    this.el.update(html.join(""))
  }, addTab:function(title) {
    this._list.push(title)
  }, setFocus:function(index) {
    if(this._index != index) {
      this._index = index;
      this._redraw();
      return true
    }
  }});
  var PlateSearch = WA.extend(UI.Component, {constructor:function() {
    PlateSearch.superclass.constructor.apply(this, arguments);
    this.searchEvent = new U.Event;
    this._emailField = new UI.TextField({hintText:WA.tr("search.typeEmail"), cls:"nwa-textfield nwa-textfield_thin nwa-addcontact__search-field nwa_hint_msg"});
    this._emailSearch = new UI.Button({cls:"nwa-button nwa-button_orange nwa-addcontact__search-button", text:WA.tr("search.goSearch")});
    this._params = new UI.Collection({firstname:new UI.Label({title:WA.tr("search.name") + ":", child:new UI.TextField({cls:"nwa-textfield nwa-addcontact__search-field"})}), lastname:new UI.Label({title:WA.tr("search.lastname") + ":", child:new UI.TextField({cls:"nwa-textfield nwa-addcontact__search-field"})}), sex:new UI.Label({title:WA.tr("search.sex") + ":", child:new UI.Component}), age:new UI.Label({title:WA.tr("search.age") + ":", child:new UI.Component}), country:new UI.Label({title:WA.tr("search.country") + 
    ":", child:new UI.Select({cls:"nwa-textfield nwa-addcontact__search-select"})}), region:new UI.Label({title:WA.tr("search.state") + ":", child:new UI.Select({cls:"nwa-textfield nwa-addcontact__search-select"})}), city:new UI.Label({title:WA.tr("search.city") + ":", child:new UI.Select({cls:"nwa-textfield nwa-addcontact__search-select"})})});
    this._country = this._params.children.country.child;
    this._country.changeEvent.on(this._onCountryChange, this);
    this._region = this._params.children.region.child;
    this._region.changeEvent.on(this._onRegionChange, this);
    this._city = this._params.children.city.child;
    this._paramsSearch = new UI.Button({cls:"nwa-button nwa-button_orange nwa-addcontact__search-button", text:WA.tr("search.goSearch")})
  }, _onRender:function(el) {
    this.el = el.createChild({style:"display:block", children:[{cls:"nwa-white-plate nwa-add__white1", children:[{cls:"nwa-add__search-button"}, {cls:"nwa-add__search-input"}, {cls:"nwa-add__error", children:WA.tr("search.wrongEmail")}]}, {cls:"nwa-white-plate nwa-add__white2", children:[{cls:"nwa-add__title", children:WA.tr("search.searchProfile") + ":"}, {cls:"nwa-twocol"}, {cls:"nwa-add__map", children:[{tag:"a", href:"http://maps.mail.ru/?units&origin=webagent", target:"_blank", children:WA.tr("search.searchOnMap")}]}, 
    {cls:"nwa-add__search-button", children:[]}]}]});
    this.el.first().on("keyup", function(ev) {
      if(ev.keyCode == 13) {
        this._searchEmail()
      }
    }, this);
    this._emailSearchErrorEl = this.el.first().last();
    this.el.last().on("keyup", function(ev) {
      if(ev.keyCode == 13) {
        this._searchParams()
      }
    }, this);
    this._paramsSearch.render(this.el.first().next().last());
    this._paramsSearch.el.on("click", this._searchParams, this);
    this._emailSearch.render(this.el.first().first());
    this._emailSearch.el.on("click", this._searchEmail, this);
    this._params.children.sex.child.autoEl = [{tag:"input", type:"radio", "wa-name":"sex", "wa-value":"1", name:"waSearchSex", id:"nwaSearchSexMale"}, {tag:"label", "for":"nwaSearchSexMale", children:" " + WA.tr("search.male")}, {tag:"input", type:"radio", "wa-name":"sex", "wa-value":"2", name:"waSearchSex", id:"nwaSearchSexFemale"}, {tag:"label", "for":"nwaSearchSexFemale", children:" " + WA.tr("search.female")}];
    this._params.children.age.child.autoEl = [{tag:"input", cls:"nwa-textfield nwa-addcontact__search-field nwa-add__input-short", type:"text", "wa-name":"ageFrom", id:"nwaSearchAgeFrom"}, {tag:"label", cls:"nwa-add__search-txt", children:WA.tr("search.to"), "for":"nwaSearchAgeUntil"}, {tag:"input", cls:"nwa-textfield nwa-addcontact__search-field nwa-add__input-short", type:"text", "wa-name":"ageUntil", id:"nwaSearchAgeUntil"}];
    this._params.render(this.el.first().next().first().next());
    this._params.children.sex.child.el.parent().addClass("nwa-twocol__value__label");
    this.reset();
    this._emailField.render(this.el.first().first().next())
  }, _searchEmail:function() {
    var val = U.String.trim(this._emailField.val());
    if(val) {
      if(this.searchEvent.fire({email:val}) === false) {
        this._emailSearchErrorEl.show()
      }else {
        this._emailSearchErrorEl.hide()
      }
    }else {
      this._emailSearchErrorEl.show()
    }
  }, _searchParams:function() {
    var opts = {};
    var isEmpty = true;
    var location = [];
    this._params.each(function(item, key) {
      if(item.child.val) {
        if(item.child.val()) {
          opts[key] = item.child.val();
          isEmpty = false;
          if(item.child.getTitle) {
            location.push(item.child.getTitle())
          }
        }
      }else {
        item.child.el.parent().each(function(el) {
          var name = el.getAttribute("wa-name");
          var type = el.getAttribute("type");
          var value = el.getAttribute("wa-value");
          if(name && type == "radio") {
            if(el.dom.checked) {
              opts[name] = value;
              isEmpty = false
            }
          }else {
            if(name && el.dom.value) {
              opts[name] = el.dom.value;
              isEmpty = false
            }
          }
        })
      }
    }, this);
    if(isEmpty) {
      opts.isEmpty = true
    }
    this.searchEvent.fire(opts, location.join(", "))
  }, reset:function() {
    this._country.setValue("");
    this._region.disable();
    this._city.disable();
    var list = this.el.dom.getElementsByTagName("input");
    U.Array.each(list, function(el) {
      if(el.getAttribute("type") == "text") {
        el.value = ""
      }
      if(el.getAttribute("type") == "radio") {
        el.checked = false
      }
    });
    this._emailField.val("");
    this._emailSearchErrorEl.hide()
  }, _onAfterRender:function() {
    if(!this._base && !this._baseRequested) {
      this._baseRequested = true;
      WA.setGeobase = WA.createDelegate(this._setGeobase, this);
      var script = document.createElement("script");
      script.src = WA.resDomain + WA.resPath.replace(/(\/[^\/]+){2}$/, "/") + "geo/geobase" + (WA.i18n.lang ? "." + WA.i18n.lang : "") + ".js?" + Math.random();
      script.charset = "utf-8";
      script.type = "text/javascript";
      WA.getBody().appendChild(script)
    }
  }, __update:function(select, t, prefix) {
    var list = t.slice(0);
    list.unshift([prefix, ""]);
    select.update(list)
  }, _setGeobase:function(data) {
    this._base = data;
    this._country.enable();
    this.__update(this._country, this._base[0], WA.tr("search.anyCountry"))
  }, _onCountryChange:function(id) {
    this._city.disable();
    if(this._base[id]) {
      this._region.enable();
      if(this._base[this._base[id][0][1]]) {
        this.__update(this._region, this._base[id], WA.tr("search.anyState"))
      }else {
        this._region.disable();
        this._onRegionChange(id)
      }
    }else {
      this._region.disable()
    }
  }, _onRegionChange:function(id) {
    if(this._base[id]) {
      this._city.enable();
      this.__update(this._city, this._base[id], WA.tr("search.anyCity"))
    }else {
      this._city.disable()
    }
  }});
  var PlateResult = WA.extend(UI.Component, {constructor:function() {
    PlateResult.superclass.constructor.apply(this, arguments);
    this.showProfileEvent = new U.Event;
    this.showUserpicEvent = new U.Event;
    this.noFriendsEvent = new U.Event;
    this.addEvent = new U.Event;
    this.backEvent = new U.Event
  }, _onRender:function(el) {
    this.el = el.createChild({style:"display: none;", cls:"nwa-white-plate nwa-add__white3 nwa-add__search-result", children:[{cls:"nwa-add__search-result-inner"}]});
    this._contEl = this.el.first();
    this.scrollBar = new WA.ui.ScrollBar({source:this._contEl});
    this.scrollBar.render(this.el)
  }, _onAfterRender:function() {
    this._contEl.on("click", this._onClickEvent, this)
  }, _onClickEvent:function(el) {
    var trg = el.getTarget(true);
    var action = trg.getAttribute("wa-action");
    var mail = trg.getAttribute("wa-mail");
    switch(action) {
      case "back":
        this.backEvent.fire();
        break;
      case "userpic":
        this.showUserpicEvent.fire(mail);
        break;
      case "profile":
        this.showProfileEvent.fire(mail, this._isSuggest);
        break;
      case "add":
        this.addEvent.fire(mail, false, this._isSuggest);
        break;
      case "nofriends":
        this.noFriendsEvent.fire(mail, trg);
        break
    }
  }, setTitle:function(txt) {
    this._contEl.update(U.String.parseTemplate(SEARCH_RESULT_TOP, {title:U.String.htmlEntity(txt)}));
    this.scrollBar.sync()
  }, update:function(list) {
    if(this.rendered) {
      if(!list || list.length == 0) {
        this.el.removeClass("nwa-preloader");
        this._contEl.createChild(SEARCH_EMPTY)
      }else {
        var html = [];
        U.Array.each(list, function(contact) {
          var t = contact.email.match(/([^@]+)@([^\.]+)/);
          var isUIN = contact.email.indexOf("@uin.icq") != -1;
          html.push(U.String.parseTemplate(SEARCH_RESULT_HTML, {avatar:WA.makeAvatar(contact.email, "_avatarsmall"), name:U.String.htmlEntity(WA.MainAgent.WP2Nick(contact)), relation:"", nofriends:"", mail:contact.email, status:WA.buildIconClass(isUIN ? "icq_online" : "online")}))
        });
        this.el.removeClass("nwa-preloader");
        this._contEl.createChild(html.join(""))
      }
      this.scrollBar.sync()
    }
  }, reset:function() {
    this._contEl.update("");
    this.el.addClass("nwa-preloader")
  }});
  var PlateSuggest = WA.extend(PlateResult, {constructor:function() {
    PlateSuggest.superclass.constructor.apply(this, arguments);
    this.requestContactsInfoEvent = new U.Event;
    this._isSuggest = true
  }, getList:function(cb, scope) {
    if(!this._xdr) {
      this._xdr = WA.XDRequest.getInstance("mrimraker1.mail.ru")
    }
    var dispatch = WA.createDelegate(function(data) {
      var nick = data.data.match(/[^\[]+(?=\]\]\>\<\/Nick\>)/g);
      var email = data.data.match(/[^\[]+(?=\]\]\>\<\/Email\>)/g);
      var sex = data.data.match(/[^\[]+(?=\]\]\>\<\/Sex\>)/g);
      var type = data.data.match(/[^\[]+(?=\]\]\>\<\/FriendshipType\>)/g);
      var res = [];
      if(!email) {
        cb && cb.call(scope || window, false)
      }else {
        this.requestContactsInfoEvent.fire(email, function(contacts) {
          var contactsHash = {};
          U.Array.each(contacts, function(contact) {
            contactsHash[contact[0]] = 1
          });
          for(var i = 0;i < nick.length;i++) {
            if(!contactsHash[email[i]]) {
              res.push({email:email[i], nick:nick[i], type:type[i], sex:sex[i], relation:FRIENDSHIP_TYPES[+type[i]] || WA.tr("search.fourtySecondCousin")})
            }
          }
          cb && cb.call(scope || window, res)
        }, this)
      }
    }, this);
    this._xdr.request({url:"/agent_suggest", data:{}}, dispatch, WA.createDelegate(function() {
      this._xdr.request({url:"/agent_suggest", data:{}}, dispatch, WA.createDelegate(function() {
        cb && cb.call(scope || window, false)
      }, this))
    }, this))
  }, _onShow:function() {
    this.getList(function(list) {
      var html = [];
      if(list) {
        U.Array.each(list, function(contact) {
          var t = contact.email.match(/([^@]+)@([^\.]+)/);
          var isUIN = contact.email.indexOf("@uin.icq") != -1;
          html.push(U.String.parseTemplate(SEARCH_RESULT_HTML, {avatar:WA.makeAvatar(contact.email, "_avatarsmall"), name:U.String.htmlEntity(contact.nick), relation:'<div class="nwa-add__search-item__relation">' + contact.relation + '<div class="nwa-add__search-item__name-fader"></div></div>', nofriends:'<span class="nwa-add__search-item__button nwa-add__btn-remove" wa-action="nofriends" wa-mail="' + contact.email + '">' + WA.tr("search.notFamiliar") + "</span>", mail:contact.email, status:WA.buildIconClass(isUIN ? 
          "icq_online" : "online")}))
        }, this)
      }
      this.el.removeClass("nwa-preloader");
      this._contEl.update(html.join(""));
      this.scrollBar.sync()
    }, this)
  }});
  var PlateCollection = WA.extend(UI.Component, {constructor:function() {
    PlateCollection.superclass.constructor.apply(this, arguments);
    this._collection = []
  }, add:function(plate) {
    this._collection.push(plate)
  }, show:function(index) {
    if(index < this._collection.length) {
      U.Array.each(this._collection, function(plate, i) {
        plate.hide()
      }, this);
      this._collection[index].show()
    }
  }});
  var Abstraction = WA.extend(ConnectionRoster, {constructor:function() {
    Abstraction.superclass.constructor.apply(this, arguments);
    this.updateEvent = new U.Event;
    this.addSuccessEvent = new U.Event;
    this._profiles = {};
    this._waiting = {};
    this._addHistory = {}
  }, search:function(opts) {
    opts.uniq = this._uniq = opts.uniq || Math.round(Math.random() * 999999);
    WA.conn.Socket.send("wp", opts);
    this.__search = opts
  }, get:function(mail, cb, scope) {
    if(this._profiles[mail]) {
      cb.call(scope || window, this._profiles[mail])
    }else {
      if(!this._waiting[mail]) {
        this._waiting[mail] = [];
        this.search({email:mail})
      }
      this._waiting[mail].push([cb, scope])
    }
  }, _invokeWaitings:function() {
    var dellist = [];
    U.Object.each(this._waiting, function(cbs, mail) {
      if(this._profiles[mail]) {
        U.Array.each(cbs, function(cb) {
          cb[0].call(cb[1] || window, this._profiles[mail])
        }, this);
        dellist.push(mail)
      }
    }, this);
    U.Array.each(dellist, function(mail) {
      delete this._waiting[mail]
    }, this)
  }, _addSuccess:function(mail) {
    var nick = this.__getNick(mail);
    this.addSuccessEvent.fire(mail, nick);
    delete this._addHistory[mail]
  }, _onConnectionContactAddFail:function(value) {
    if(this._addHistory[value.mail]) {
      switch(value.message) {
        case "exists":
          this._addSuccess(value.mail);
          break;
        case "ignored":
          WA.conn.Socket.send("contact", {operation:"unignore", email:value.mail});
          this._addSuccess(value.mail);
          break
      }
    }
  }, _onConnectionContactAddSuccess:function(value) {
    this._addSuccess(value)
  }, _collectProfiles:function(value) {
    U.Array.each(value, function(contact) {
      this._profiles[contact.email] = contact
    }, this)
  }, _onConnectionWp:function(value) {
    if(value.uniq && value.uniq == this._uniq) {
      if(value.result) {
        delete this.__search;
        this._collectProfiles(value.result);
        this.updateEvent.fire(value.result, value.uniq);
        this._invokeWaitings()
      }else {
        if(value.error == "unknow") {
          WA.setTimeout(function() {
            return WA.createDelegate(function() {
              this.search(this.__search)
            }, this)
          }.call(this), 5E3)
        }else {
          this.updateEvent.fire([])
        }
      }
    }
  }, __getNick:function(mail) {
    return(this._addHistory[mail] || {nick:mail}).nick
  }, add:function(mail, nick) {
    this._addHistory[mail] = {nick:nick};
    WA.MainAgent.sendAddContact(mail, nick, function(success) {
    }, this)
  }});
  WA.AddSearchDialog = WA.extend(UI.Layer, {constructor:function() {
    WA.AddSearchDialog.superclass.constructor.apply(this, arguments);
    this.autoEl = null;
    this.openContactEvent = new U.Event;
    this.addSuccessEvent = new U.Event;
    this.contactInfoRequestEvent = new U.Event;
    this._tabs = new Tabs;
    this._tabs.addTab(WA.tr("search.search"));
    this._tabs.addTab(WA.tr("search.peopleYouMayKnow"));
    this._tabs.setFocus(0);
    this._tabs.tabChangeEvent.on(this._onTabChangeEvent, this);
    this._search = new PlateSearch;
    this._search.searchEvent.on(this._onSearchEvent, this);
    this._result = new PlateResult;
    this._result.showUserpicEvent.on(this._onShowUserpicEvent, this);
    this._result.showProfileEvent.on(this._onShowProfileEvent, this);
    this._result.noFriendsEvent.on(this._onNoFriendsEvent, this);
    this._result.addEvent.on(this._onAddEvent, this);
    this._result.backEvent.on(function() {
      this._plates.show(0)
    }, this);
    this._suggest = new PlateSuggest;
    this._suggest.showUserpicEvent.on(this._onShowUserpicEvent, this);
    this._suggest.showProfileEvent.on(this._onShowProfileEvent, this);
    this._suggest.noFriendsEvent.on(this._onNoFriendsEvent, this);
    this._suggest.addEvent.on(this._onAddEvent, this);
    this.contactInfoRequestEvent.relay(this._suggest.requestContactsInfoEvent);
    this._plates = new PlateCollection;
    this._plates.add(this._search);
    this._plates.add(this._result);
    this._plates.add(this._suggest);
    this._abstraction = new Abstraction;
    this._abstraction.updateEvent.on(this._onUpdate, this);
    this._abstraction.addSuccessEvent.on(this._onAddSuccess, this)
  }, getSuggests:function(cb, scope) {
    this._suggest.getList(cb, scope)
  }, _showProfile:function(mail, profile, isSuggest) {
    if(!this._profile) {
      this._profile = new WA.Profile(true, {modal:true, fadeIn:true, overlay:this._mainEl.parent()});
      this._profile.addEvent.on(this._onAddEvent, this);
      this._profile.render(this._mainEl)
    }
    this._profile.show(mail, profile, isSuggest)
  }, _hideProfile:function() {
    if(this._profile) {
      this._profile.hide()
    }
  }, _onRender:function(el) {
    this.el = el.createChild({cls:"nwa-add nwa_fadein", style:"opacity: 1", children:[{cls:"nwa-add__plate", children:[{cls:"nwa-add__nick", children:[{tag:"span", children:WA.tr("search.title")}, {cls:"nwa-header__nick-fadeout"}]}, {cls:"nwa-addcontact__close"}]}]});
    this._mainEl = this.el.first();
    this._mainEl.last().on("click", this.hide, this);
    this._tabs.render(this._mainEl);
    this._search.render(this._mainEl);
    this._result.render(this._mainEl);
    this._suggest.render(this._mainEl);
    this._photo = new WA.PhotoPreview({autoRender:this._mainEl, modal:true})
  }, _onTabChangeEvent:function(index) {
    if(index == 1) {
      index = 2
    }
    this._plates.show(index)
  }, _onShowUserpicEvent:function(mail) {
    this._photo.show(mail)
  }, _onShowProfileEvent:function(mail, isSuggest) {
    this._abstraction.get(mail, function(profile) {
      this._showProfile(mail, profile, isSuggest)
    }, this)
  }, __addContactAndNick:function(mail, nick) {
    this._abstraction.add(mail, nick)
  }, _onAddEvent:function(mail, nick, isSuggest) {
    this.contactInfoRequestEvent.fire([mail], function(contacts) {
      var contact = contacts[0];
      if(!contact) {
        if(!nick) {
          this._abstraction.get(mail, function(contact) {
            this.__addContactAndNick(mail, WA.MainAgent.WP2Nick(contact))
          }, this)
        }else {
          this.__addContactAndNick(mail, nick)
        }
      }else {
        if(!this._openDialogConfirm) {
          this._openDialogConfirm = new WA.DialogsAgent.RemoveContactDialog({okButton:WA.tr("search.openChat"), autoRender:this._mainEl})
        }
        this._openDialogConfirm.okEvent.removeAll();
        this._openDialogConfirm.okEvent.on(function() {
          contact.splice(4, 0, false);
          this.openContactEvent.fire.apply(this.openContactEvent, contact);
          this.hide()
        }, this);
        this._openDialogConfirm.show(WA.tr("search.alreadyInList", {nick:contact[1] ? contact[1] + " (" + contact[0] + ")" : contact[0]}))
      }
    }, this)
  }, _onAddSuccess:function(mail, nick) {
    this.openContactEvent.fire(mail, nick);
    this.addSuccessEvent.fire(mail, nick);
    this.hide()
  }, _onNoFriendsEvent:function(mail, el) {
    el && el.up("nwa-suggest-item").remove();
    if(mail.indexOf("@uin.icq") != -1) {
      return
    }
    this.el && this.el.mask();
    if(!this._xdr) {
      this._xdr = WA.XDRequest.getInstance("mrimraker1.mail.ru")
    }
    var data = {exclude:mail};
    this._xdr.request({url:"/agent_suggest", data:data}, this.el && WA.createDelegate(this.el.unmask, this.el), this.el && WA.createDelegate(this.el.unmask, this.el))
  }, __isIcq:function(uin) {
    var digits = (uin.match(/\d+/g) || []).join("");
    if(!!(uin.indexOf("@") == -1 && digits.length > 4)) {
      return digits
    }else {
      return false
    }
  }, __isValidMail:function(email) {
    return!!email.match(/^[^@]+@([a-z0-9][a-z0-9-]+\.){1,}([a-z0-9][a-z0-9-]{1,})$/i)
  }, searchMail:function(mail, openProfile) {
    if(openProfile) {
      this._openProfileUniq = Math.round(Math.random() * 999999)
    }
    this._onSearchEvent({email:mail, uniq:this._openProfileUniq})
  }, _onUpdate:function(value, uniq) {
    this._result.update(value);
    if(uniq && uniq == this._openProfileUniq) {
      if(value && value.length) {
        this._onShowProfileEvent(value[0].email)
      }
      delete this._openProfileUniq
    }
  }, _onSearchEvent:function(opts, location) {
    var isValid = false;
    if(opts.email) {
      var email = opts.email, uin;
      if(this.__isValidMail(email)) {
        isValid = true
      }else {
        if(uin = this.__isIcq(email)) {
          opts.email = uin + "@uin.icq";
          isValid = true
        }
      }
    }else {
      isValid = true
    }
    if(isValid) {
      var searchTitle = email;
      if(!searchTitle) {
        searchTitle = U.String.trim((opts.firstname || "") + " " + (opts.lastname || ""));
        var params = [];
        if(searchTitle) {
          params.push(searchTitle)
        }
        if(opts.sex) {
          params.push(["", WA.tr("sex.m"), WA.tr("sex.f")][+opts.sex])
        }
        if(opts.ageFrom) {
          params.push(WA.tr("search.from") + " " + opts.ageFrom)
        }
        if(opts.ageUntil) {
          params.push(WA.tr("search.to") + " " + opts.ageUntil)
        }
        if(location) {
          params.push(location)
        }
        if(opts.isEmpty) {
          params = [WA.tr("search.noParameters")]
        }
        searchTitle = params.join(", ")
      }
      this._abstraction.search(opts);
      this._result.reset();
      this._result.setTitle(searchTitle);
      this._plates.show(1)
    }else {
      return false
    }
  }, _onHide:function() {
    WA.AddSearchDialog.superclass._onHide.apply(this);
    this._plates.show(0);
    this._search.reset();
    this._tabs.setFocus(0);
    this._hideProfile();
    this._photo.hide();
    this._openDialogConfirm && this._openDialogConfirm.hide()
  }, show:function(tab) {
    WA.AddSearchDialog.superclass.show.apply(this);
    if(typeof tab == "number") {
      this._tabs.setFocus(+(tab == 2));
      this._plates.show(tab)
    }
  }, _onShow:function() {
    WA.AddSearchDialog.superclass._onShow.apply(this);
    U.Mnt.rbCountAction()
  }})
})();
(function() {
  var SECOND = 1E3, MINUTE = SECOND * 60, HOUR = MINUTE * 60, ACTIVITY_EXPIRATION_TIME = HOUR * 24, ACTIVITY_FIXED_EXPIRATION_TIME = HOUR, ACTIVE_CONTACTS_MAX_LEGTH = 10, ACTIVITY_LIST_REFRESH_TIMEOUT = MINUTE, BIG = 1E16;
  var WA = WebAgent;
  var UserState = WA.conn.UserState;
  var U = WA.util;
  var JSON = WA.getJSON();
  var limitRate = function(fn, rate, scope) {
    var ts = 0, scope = scope || this, delayedTask, delta, now, interval;
    return function() {
      now = +new Date;
      delta = now - ts;
      if(delta > rate) {
        fn.apply(scope, arguments);
        ts = now
      }else {
        if(delayedTask) {
          delayedTask.stop()
        }
        interval = rate - delta;
        delayedTask = new U.DelayedTask({fn:function() {
          fn.apply(scope, arguments);
          ts = +new Date
        }, scope:scope, interval:interval});
        delayedTask.start()
      }
    }
  };
  var ActivityManager = WA.extend(Object, {constructor:function() {
    WA.Storage.whenReady(function() {
      WA.Storage.load(["activityList", "firstActivityList", "unreadContactsList", "activeData"], {success:this._onStorageLoad, scope:this})
    }, this);
    this.updateActivityEvent = new U.Event;
    this.savedEvent = new U.Event;
    this.timer = new U.DelayedTask({fn:function() {
      this.updateActivityEvent.fire();
      this.timer.start()
    }, scope:this, interval:ACTIVITY_LIST_REFRESH_TIMEOUT});
    this.timer.start();
    this.prevActiveCount = 0;
    UserState.statusChangedEvent.on(function(status) {
      if("offline" === status && this.timer.isStarted()) {
        this.timer.stop()
      }
      if("offline" !== status && !this.timer.isStarted()) {
        this.timer.start()
      }
    }, this)
  }, refresh:function() {
    (new U.DelayedTask({fn:function() {
      WA.Storage.load(["activityList", "firstActivityList", "unreadContactsList", "activeData"], {success:this._onStorageLoad, scope:this})
    }, scope:this, interval:1E3})).start()
  }, _onStorageLoad:function(storage) {
    this.activityList = JSON.parse(storage.activityList || "{}");
    this.firstActivityList = JSON.parse(storage.firstActivityList || "{}");
    this.unreadContactsList = JSON.parse(storage.unreadContactsList || "[]");
    this.activeData = JSON.parse(storage.activeData || "{}");
    this.updateActivityEvent.fire()
  }, _saveToStorage:function() {
    this._clearInactive();
    WA.Storage.save({activityList:JSON.stringify(this.activityList), firstActivityList:JSON.stringify(this.firstActivityList), unreadContactsList:JSON.stringify(this.unreadContactsList), activeData:JSON.stringify(this.activeData)}, {success:function() {
      this.savedEvent.fire()
    }, scope:this})
  }, getActivity:function(email) {
    return this._getActivity(email, false)
  }, getFirstActivity:function(email) {
    return this._getActivity(email, true)
  }, updateActivity:function(contact) {
    var ts = +new Date, email = contact[0];
    if(!(email in this.activityList) || this.activeList && this.activeList[email] && ts - this.activeList[email] > ACTIVITY_FIXED_EXPIRATION_TIME) {
      this.firstActivityList[email] = ts
    }
    this.activityList[email] = ts;
    this.activeData[email] = contact;
    this._saveToStorage();
    this.updateActivityEvent.fire()
  }, deleteActivity:function(mail) {
    if(mail in this.activityList) {
      this.activityList[mail] = null;
      delete this.activityList[mail]
    }
    if(mail in this.firstActivityList) {
      this.firstActivityList[mail] = null;
      delete this.firstActivityList[mail]
    }
    if(mail in this.activeData) {
      this.activeData[mail] = null;
      delete this.activeData[mail]
    }
    this._saveToStorage();
    this.updateActivityEvent.fire()
  }, updateUnreadContact:function(contact, type) {
    if(!contact) {
      return
    }
    var email = contact[0], shouldSave = false;
    if(type === "new_message") {
      if(U.Array.indexOf(this.unreadContactsList, email) == -1) {
        this.unreadContactsList.push(email);
        this.updateActivity(contact);
        shouldSave = true
      }
    }
    if(type === "read_message") {
      if(U.Array.indexOf(this.unreadContactsList, email) > -1) {
        U.Array.remove(this.unreadContactsList, email);
        shouldSave = true;
        this.firstActivityList[email] = +new Date;
        this.activityList[email] = +new Date
      }
    }
    if(shouldSave) {
      this._saveToStorage()
    }
  }, isActive:function(lastActivity) {
    return this._isActive(lastActivity, false)
  }, isFixed:function(lastActivity) {
    var ret = this._isActive(lastActivity, true);
    return ret
  }, getActiveCount:function() {
    var activeCount = this._getActiveCount(false), rbId;
    if(activeCount != this.prevActiveCount) {
      if(activeCount === 1) {
        rbId = 1739611
      }else {
        if(activeCount === 2) {
          rbId = 1739612
        }else {
          if(activeCount === 3) {
            rbId = 1739614
          }else {
            if(activeCount === 4) {
              rbId = 1739616
            }else {
              if(activeCount === 5) {
                rbId = 1739617
              }else {
                if(activeCount > 5 && this.prevActiveCount <= 5) {
                  rbId = 1739618
                }
              }
            }
          }
        }
      }
      if(rbId) {
        U.Mnt.countRB(rbId)
      }
      this.prevActiveCount = activeCount
    }
    return activeCount
  }, getActiveFixedCount:function() {
    return this._getActiveCount(true)
  }, activeExist:function() {
    return this.getActiveCount() > 0
  }, _clearInactive:function(email) {
    U.Object.each(this.activityList, function(ts, email) {
      if(!this.isActive(email)) {
        this.activityList[email] = null;
        this.firstActivityList[email] = null;
        delete this.activityList[email];
        delete this.firstActivityList[email]
      }
    }, this)
  }, _getActiveList:function(fixedOnly) {
    var list = this.activityList, ret;
    list = U.Object.filter(list, function(ts, email) {
      ret = this._isActive(email, fixedOnly);
      return ret
    }, this);
    return list
  }, getActiveList:function() {
    return this._getActiveList(false)
  }, getFixedList:function() {
    return this._getActiveList(true)
  }, _getActiveCount:function(fixedOnly) {
    var ret, list = this._getActiveList(fixedOnly);
    ret = U.Object.getLength(list);
    return ret
  }, _isActive:function(lastActivity, fixedOnly) {
    if(WA.ContactStates.getUnread(lastActivity)) {
      return true
    }
    var now = +new Date, delta = fixedOnly ? ACTIVITY_FIXED_EXPIRATION_TIME : ACTIVITY_EXPIRATION_TIME, ret;
    if(WA.isString(lastActivity)) {
      lastActivity = this.getActivity(lastActivity)
    }
    ret = now - delta < lastActivity;
    return ret
  }, _getActivity:function(email, onlyFirst) {
    var list = onlyFirst ? this.firstActivityList : this.activityList;
    if(email in list) {
      return list[email]
    }
    return 0
  }});
  var AbstractData = WA.extend(WA.Activatable, {constructor:function() {
    this.data = null;
    this.loadEvent = new U.Event;
    this.updateActivityEvent = new U.Event;
    this.activityManager = new ActivityManager;
    this.activityManager.updateActivityEvent.on(this._onUpdateActivity, this);
    this.hideActiveDialogs = false;
    WA.Invalidator.invalidateEvent.on(this._onInvalidate, this);
    WA.ChangeLog.updateEvent.on(this._onChangeLogUpdate, this)
  }, _onUpdateActivity:function() {
    this.updateActivityEvent.fire()
  }, _onActivate:function() {
    this.loadEvent.resume()
  }, _onDeactivate:function() {
    this.data = null;
    this.loadEvent.suspend()
  }, getRange:function(from, to) {
    this.requestParams = {from:from, to:to};
    if(this.isActive() && WA.isNumber(from) && WA.isNumber(to)) {
      WA.ChangeLog.whenReady(this._onGetRange, this)
    }
  }, _onGetRange:function() {
    WA.abstractError()
  }, _sortContactList:function(data) {
    var start = +new Date;
    var len = data.length, a = [], matched = 0, gr, n, i, email;
    data = data.sort();
    for(i = 0;i < len;i++) {
      email = data[i][0];
      gr = this._getSortGr(data[i]);
      n = data[i][1] || email;
      a[i] = gr + n.toLowerCase() + "_" + i
    }
    a = a.sort();
    var ret = [];
    U.Array.each(a, function(entry) {
      var tmp = entry.split("_");
      var index = tmp[tmp.length - 1];
      ret.push(data[index])
    });
    return ret
  }, _applyChangeLogTo:function(data, log) {
    var updated = false;
    if(log.length > 0) {
      U.Array.each(log, function(logItem) {
        if(logItem.action === "remove") {
          var index = U.Array.indexOfBy(data, function(dataItem) {
            return dataItem[0] === logItem.email
          });
          if(index != -1) {
            data.splice(index, 1);
            updated = true
          }
        }
      });
      this.data = data;
      U.Array.each(data, function(dataItem) {
        var email = dataItem[0];
        var index = U.Array.indexOfBy(log, function(logItem) {
          var isFound = logItem.email === email;
          if(isFound) {
            if(logItem.action) {
              if(logItem.action === "rename") {
                dataItem[1] = logItem.nick || logItem.email;
                updated = true
              }
              return false
            }
          }
          return isFound
        });
        if(index != -1) {
          var newStatus = log[index].status;
          var t = newStatus + dataItem[3];
          if(t.indexOf("offline") != -1 && newStatus != dataItem[3]) {
            updated = true
          }
          dataItem[1] = log[index].nick;
          dataItem[2] = 0;
          dataItem[3] = newStatus;
          dataItem[4] = log[index].statusTitle;
          dataItem[6] = log[index].features
        }
      }, this);
      U.Array.each(log, function(logItem) {
        if(logItem.action === "add") {
          data.push([logItem.email, logItem.nick || logItem.email, 1, logItem.status || "offline", logItem.statusTitle, logItem.tel ? [logItem.tel] : null, logItem.features || 0]);
          updated = true
        }
      })
    }
    return updated
  }, _fireLoadEvent:function(data, length) {
    return this.loadEvent.fire(this, data, length)
  }, _onInvalidate:function() {
    this.data = null
  }, _onChangeLogUpdate:function(log) {
    if(this.data) {
      if(this._applyChangeLogTo(this.data, log)) {
        var data = this._sortContactList(this.data, true);
        this.data = data
      }
      this._initVisibleData(this.data, this.data.length)
    }
  }, _sliceListData:function(data, from, to) {
    to = Math.min(to, data.length);
    return data.slice(from, to)
  }, _extractVisibleArea:function(data) {
    var reqParams = this.requestParams;
    if(reqParams) {
      return this._sliceListData(data, 0, reqParams.to - reqParams.from)
    }else {
      return[]
    }
  }, _initVisibleData:function(data, length) {
    var reqParams = this.requestParams;
    if(reqParams) {
      var visibleData = this._sliceListData(data, reqParams.from, reqParams.to);
      this._fireLoadEvent(visibleData, length)
    }
  }, _getSortGr:function(contact) {
    var gr;
    if(WA.MainAgent.isChat(contact[0])) {
      gr = 5
    }else {
      if(WA.MainAgent.isTel(contact[0])) {
        gr = 4
      }else {
        if(contact[2]) {
          gr = 3
        }else {
          if(contact[3] == "offline" || contact[3] == "icq_offline") {
            gr = 2
          }else {
            gr = 1
          }
        }
      }
    }
    return gr
  }, destroy:function() {
    this.loadEvent.removeAll();
    this.loadEvent = null;
    WA.Invalidator.invalidateEvent.un(this._onInvalidate, this);
    WA.ChangeLog.updateEvent.un(this._onChangeLogUpdate, this)
  }, cast2data:function(cast) {
    return[cast.mail || cast.email, cast.nick, +(cast.status == "gray"), cast.status, cast.statusTitle, cast.phones, cast.features]
  }});
  var RemoteData = WA.extend(AbstractData, {_prefix:"clist_", constructor:function() {
    RemoteData.superclass.constructor.call(this);
    this._clistReceivedEvent = new U.Event;
    this.data = null;
    this.fullLength = null;
    this.storageListReader = new WA.util.DelayedTask;
    this.canShowOffline = true;
    WA.conn.Connection.triggerEvent.on(this._onConnectionTriggerEvent, this);
    WA.conn.Socket.successReconnectEvent.on(this._onSuccessReconnect, this);
    this.searchReadyEvent = new U.Event;
    this.searchPhoneReadyEvent = new U.Event;
    this.searchPhonebookReadyEvent = new U.Event;
    this.sync = WA.Synchronizer.registerComponent("clist", ["varea_version"]);
    this.sync.triggerEvent.on(this._onSyncTriggerEvent, this);
    WA.ContactStates.updateEvent.on(this._onContactStatesUpdate, this)
  }, _sortContactList:function(data, noActive) {
    var start = +new Date;
    var len = data.length, a = [], gr, n, i, email;
    data = data.slice(0);
    if(!noActive && !this.hideActiveDialogs) {
      var activeList = this.activityManager.getActiveList(), fixedList = this.activityManager.getFixedList(), matched = 0, lastActivity;
      var tmp = [];
      for(i = 0;i < len;i++) {
        email = data[i][0];
        if(email in activeList) {
          tmp.push(email)
        }
      }
      for(email in activeList) {
        if(U.Array.indexOf(tmp, email) === -1) {
          if(email in this.activityManager.activeData) {
            data.push(this.activityManager.activeData[email])
          }
        }
      }
      var tmp = [], x;
      for(x in activeList) {
        tmp.push([activeList[x], x])
      }
      tmp = tmp.sort(function(a, b) {
        return a[0] < b[0]
      });
      for(i = 0, len = tmp.length;i < len;i++) {
        if(i >= ACTIVE_CONTACTS_MAX_LEGTH) {
          activeList[tmp[i][1]] = null;
          delete activeList[tmp[i][1]]
        }
      }
    }
    len = data.length;
    data = data.sort();
    for(i = 0;i < len;i++) {
      email = data[i][0];
      if(!noActive && !this.hideActiveDialogs) {
        lastActivity = this.activityManager.getActivity(email);
        if(email in fixedList) {
          gr = lastActivity - BIG
        }else {
          if(email in activeList) {
            gr = lastActivity - BIG
          }else {
            gr = this._getSortGr(data[i])
          }
        }
      }else {
        gr = this._getSortGr(data[i])
      }
      n = data[i][1] || email;
      a[i] = gr + n.toLowerCase() + "_" + i
    }
    a = a.sort();
    var ret = [];
    U.Array.each(a, function(entry) {
      var tmp = entry.split("_");
      var index = tmp[tmp.length - 1];
      ret.push(data[index])
    });
    return ret
  }, _onActivate:function() {
    this.searchReadyEvent.resume();
    RemoteData.superclass._onActivate.call(this)
  }, _onDeactivate:function() {
    this.fullLength = null;
    this.searchReadyEvent.suspend();
    RemoteData.superclass._onDeactivate.call(this)
  }, _isReady:function() {
    return WA.isArray(this.data) && WA.isNumber(this.fullLength)
  }, _isFullData:function() {
    return this._isReady() && this.data.length === this.fullLength
  }, _getListFromServer:function() {
    if(!this.__loadingFromServer && this.requestParams) {
      this.__loadingFromServer = true;
      WA.conn.Connection.getClist(null, function() {
        this.__loadingFromServer = false;
        this.__loadingFail = true
      }, this)
    }
  }, _onSuccessReconnect:function() {
    if(this.__loadingFail) {
      this.__loadingFail = false;
      this._getListFromServer()
    }
  }, _onConnectionTriggerEvent:function(type, value) {
    if(type === "contactList") {
      var data = this._sortContactList(value, true);
      this._saveListToStorage(this._extractVisibleArea(data), data.length, function() {
        this._saveLocalListData(data, data.length);
        var query = this.__searchQuery;
        if(query) {
          this.search(query)
        }
        if(this.__searchPhone) {
          this.searchPhone(this.__searchPhone)
        }
        this._clistReceivedEvent.fire(data);
        this.__loadingFromServer = false;
        WA.debug.State.set("clist.status", "loaded from <strong>server</strong>")
      })
    }else {
      if(type == "contactModifySuccess") {
        var phones = value.phones;
        if(phones && this.data) {
          U.Array.each(this.data, function(entry) {
            if(value.email == entry[0]) {
              entry[5] = phones
            }
          })
        }
      }
    }
  }, _getListFromStorage:function(cb) {
    var keys = [this._prefix + "list", this._prefix + "list_length"];
    WA.SessionStorage.load(keys, {success:function(data) {
      var list = data[this._prefix + "list"];
      var length = data[this._prefix + "list_length"];
      cb.call(this, list ? this._parseListFromStorage(list) : null, parseInt(length))
    }, failure:function(e) {
    }, scope:this})
  }, _saveListToStorage:function(data, fullLength, cb) {
    var serialized = JSON.stringify(data);
    var pfx = this._prefix;
    var params = {};
    params[pfx + "list"] = serialized;
    params[pfx + "list_length"] = fullLength;
    WA.SessionStorage.save(params, {success:function() {
      this.sync.write("varea_version", (new Date).getTime());
      if(WA.isFunction(cb)) {
        cb.call(this)
      }
    }, scope:this})
  }, _initVisibleData:function(data, length) {
    data = this._sortContactList(data);
    length = data.length;
    if(this.canShowOffline) {
      RemoteData.superclass._initVisibleData.call(this, data, length)
    }else {
      var onlineContacts = [];
      U.Array.indexOfBy(data, function(contact) {
        if(!contact[2] && contact[3] !== "offline" && contact[3] !== "icq_offline") {
          onlineContacts.push(contact)
        }
      });
      if(onlineContacts.length > 0) {
        RemoteData.superclass._initVisibleData.call(this, onlineContacts, onlineContacts.length)
      }else {
        RemoteData.superclass._initVisibleData.call(this, data, length)
      }
    }
  }, _saveLocalListData:function(data, fullLength) {
    this.data = data;
    this.fullLength = fullLength;
    this._initVisibleData(this.data, this.fullLength)
  }, _parseListFromStorage:function(storageData) {
    return eval(storageData)
  }, _onGetRange:function() {
    this.storageListReader.stop();
    WA.debug.State.set("clist.status", "loading...");
    if(!this._isReady()) {
      WA.debug.State.set("clist.status", "not ready yet: loading...");
      WA.FocusManager.ifFocused(function() {
        WA.debug.State.set("clist.status", "loading from storage...");
        this._getListFromStorage(function(storageData, fullLength) {
          if(!this._isReady()) {
            if(!storageData || storageData.length === 0 || this.requestParams.from > 0 || this.requestParams.to - this.requestParams.from > storageData.length) {
              WA.debug.State.set("clist.status", "loading from server...");
              this._getListFromServer()
            }else {
              WA.debug.State.set("clist.status", "loaded from <strong>storage</strong>");
              this._saveLocalListData(storageData, fullLength)
            }
          }
        })
      }, function() {
        WA.debug.State.set("clist.status", "inactive window; loading...");
        this.storageListReader.start(1E3, function() {
          this._getListFromStorage(function(storageData, fullLength) {
            if(!this.data) {
              if(storageData) {
                this._saveLocalListData(storageData, fullLength)
              }else {
                this.storageListReader.start()
              }
            }
          })
        }, this)
      }, this)
    }else {
      if(this._isFullData()) {
        this._initVisibleData(this.data, this.data.length)
      }else {
        this.data = null;
        var reqParams = this.requestParams;
        this.getRange(reqParams.from, reqParams.to)
      }
    }
  }, _onInvalidate:function() {
    RemoteData.superclass._onInvalidate.call(this);
    this.fullLength = null;
    this._trySaveCurrentListToStorage()
  }, _trySaveCurrentListToStorage:function() {
    WA.FocusManager.ifFocused(function() {
      var data = this._sortContactList(this.data || [], true);
      this._saveListToStorage(this._extractVisibleArea(data || []), this.fullLength || 0)
    }, null, this)
  }, _onChangeLogUpdate:function(log) {
    if(this._isReady()) {
      if(this._applyChangeLogTo(this.data, log)) {
        var data = this._sortContactList(this.data, true);
        this.data = data
      }
      U.Array.each(log, function(logItem) {
        if(logItem.action === "remove") {
          this.fullLength--
        }else {
          if(logItem.action === "add") {
            this.fullLength++;
            this.activityManager.updateActivity(this.cast2data(logItem))
          }
        }
      }, this);
      this._initVisibleData(this.data, this.fullLength);
      this._trySaveCurrentListToStorage()
    }
  }, _onContactStatesUpdate:function(contactStates) {
    if(this._isReady()) {
      var isAffected = false;
      var data = this._extractVisibleArea(this.data);
      U.Array.each(data, function(entry) {
        if(WA.ContactStates.getStates(entry[0])) {
          isAffected = true;
          return false
        }
      }, this);
      if(isAffected) {
        this._initVisibleData(this.data, this.fullLength)
      }
    }
  }, _onSyncTriggerEvent:function(syncRecord) {
    if(syncRecord.isChanged("varea_version")) {
      var isStorageReaderStarted = this.storageListReader.isStarted();
      this.storageListReader.stop();
      this._getListFromStorage(function(storageData, fullLength) {
        var reqParams = this.requestParams;
        if(storageData && !this._isFullData() && reqParams && reqParams.from === 0) {
          this._saveLocalListData(storageData, fullLength)
        }else {
          if(isStorageReaderStarted) {
            this.storageListReader.start()
          }
        }
      })
    }
  }, getPhoneList:function(cb, scope) {
    var newData = [];
    if(this._isFullData()) {
      U.Array.each(this.data, function(item) {
        if(item[5] && item[5].length) {
          newData.push(item)
        }
      }, this);
      cb.call(scope || window, newData)
    }else {
      this._clistReceivedEvent.on(function() {
        U.Array.each(this.data, function(item) {
          if(item[5] && item[5].length) {
            newData.push(item)
          }
        }, this);
        cb.call(scope || window, newData)
      }, this, {single:true});
      if(!this.requestParams) {
        this.getRange(0, 0)
      }
      this._getListFromServer()
    }
  }, getContactsInfo:function(maillist, cb, scope, raw) {
    raw = raw || false;
    if(this._isFullData()) {
      var contacts = [];
      U.Array.each(this.data, function(entry) {
        var index = U.Array.indexOf(maillist, entry[0]);
        if(index != -1) {
          if(raw) {
            contacts.push([entry[0], entry[1], WA.MainAgent.isChat(entry[0]) && "chat" || entry[2] && "gray" || entry[3], entry[4] || entry[3], entry[6] || 0])
          }else {
            contacts.push(entry)
          }
        }
      });
      cb.call(scope || window, contacts)
    }else {
      this._clistReceivedEvent.on(function() {
        this.getContactsInfo(maillist, cb, scope)
      }, this, {single:true});
      if(!this.requestParams) {
        this.getRange(0, 0)
      }
      this._getListFromServer()
    }
  }, search:function(query) {
    if(this._isFullData()) {
      var MAX = 9;
      var filteredData = [];
      var q = (query || "").toLowerCase();
      var alterQuery = WA.util.KeyMapping.translate(q);
      var data = RemoteData.superclass._sortContactList.call(this, this.data);
      U.Array.each(data, function(entry) {
        if(MAX > 0 && filteredData.length === MAX) {
          return false
        }
        var mail = entry[0].toLowerCase();
        var nick = (entry[1] || "").toLowerCase();
        if(mail.indexOf(q) != -1 || nick.indexOf(q) != -1 || mail.indexOf(alterQuery) != -1 || nick.indexOf(alterQuery) != -1) {
          filteredData.push(entry)
        }
      });
      this.searchReadyEvent.fire(filteredData, query)
    }else {
      this.__searchQuery = query;
      this._getListFromServer()
    }
  }, searchPhonebook:function(query) {
    if(this._isFullData()) {
      var MAX = 10;
      var filteredData = [], pItem;
      var q = (query || "").toLowerCase();
      var queryTel = q.replace(/\+/g, "");
      if(queryTel.match(/\D+/g) != null) {
        queryTel = ""
      }
      var alterQuery = WA.util.KeyMapping.translate(q);
      U.Array.each(this.data, function(item) {
        if(filteredData.length >= MAX) {
          return false
        }
        var nick = (item[1] || item[0] || "").toLowerCase();
        var phones = item[5];
        if(phones && phones.length) {
          if(nick.indexOf(q) != -1 || nick.indexOf(alterQuery) != -1) {
            U.Array.each(phones, function(tel) {
              pItem = U.Array.clone(item);
              pItem[5] = [tel];
              filteredData.push(pItem)
            }, this)
          }else {
            if(queryTel.length) {
              U.Array.each(phones, function(tel) {
                var trimtel = tel.replace(/\D+/g, "");
                if(trimtel.indexOf(queryTel) != -1) {
                  pItem = U.Array.clone(item);
                  pItem[5] = [tel];
                  filteredData.push(pItem)
                }
              }, this)
            }
          }
        }
      }, this);
      filteredData = filteredData.slice(0, MAX);
      this.searchPhonebookReadyEvent.fire(this, {data:filteredData, query:query})
    }
  }, searchPhone:function(query) {
    if(this._isFullData()) {
      var MAX = 8;
      var filteredData = [];
      var q = query || "";
      U.Array.each(this.data, function(item) {
        if(filteredData.length >= MAX) {
          return false
        }
        var phones = item[5];
        if(phones && phones.length) {
          U.Array.each(phones, function(tel) {
            var trimtel = tel.replace(/\D+/g, "");
            if(trimtel.indexOf(q) != -1) {
              var pItem = U.Array.clone(item);
              pItem[5] = [tel];
              filteredData.push(pItem)
            }
          }, this)
        }
      }, this);
      filteredData = filteredData.slice(0, MAX);
      this.searchPhoneReadyEvent.fire(this, {data:filteredData, query:query})
    }else {
      this.__searchPhone = query;
      this._getListFromServer()
    }
  }, cancelSearch:function() {
    this.__searchQuery = null;
    this.__searchPhone = null
  }, setOfflineContactsVisibility:function(canShow) {
    if(this.canShowOffline !== canShow) {
      this.canShowOffline = canShow;
      if(this._isReady()) {
        this._initVisibleData(this.data, this.fullLength)
      }
    }
  }, reloadList:function() {
    if(this._isReady()) {
      this._initVisibleData(this.data, this.fullLength)
    }
  }, destroy:function() {
    WA.error("It is horrible!")
  }});
  var SearchData = WA.extend(AbstractData, {_onDeactivate:function() {
    SearchData.superclass._onDeactivate.call(this);
    this.cancelSearch()
  }, setData:function(data, query) {
    this.data = data;
    this.__searchQuery = query;
    this.getRange(0, this.data.length)
  }, _onGetRange:function() {
    this._initVisibleData(this.data, this.data.length)
  }, _fireLoadEvent:function(data, length) {
    if(this.__searchQuery) {
      return SearchData.superclass._fireLoadEvent.call(this, {query:this.__searchQuery, data:data}, length)
    }
  }, cancelSearch:function() {
    this.data = null;
    this.__searchQuery = null
  }});
  WA.ContactListAbstraction = WA.extend(WA.Activatable, {constructor:function() {
    this.loadEvent = new U.Event;
    this.countEvent = new U.Event;
    this.microBlogChangeEvent = new U.Event;
    this.remoteData = new RemoteData;
    this.remoteData.loadEvent.on(this._onRemoteDataLoad, this);
    this.remoteData.searchReadyEvent.on(this._onSearchReady, this);
    this.contactDataReceivedEvent = (new U.Event).relay(this.remoteData._clistReceivedEvent);
    this.remoteData.updateActivityEvent.on(this._onUpdateActivity, this);
    this.remoteData.activityManager.savedEvent.on(this._onActivitySaved, this);
    this.contactDataReceivedEvent = (new U.Event).relay(this.remoteData._clistReceivedEvent);
    this.searchData = new SearchData;
    this.searchReadyEvent = (new U.Event).relay(this.searchData.loadEvent);
    this.searchPhoneReadyEvent = (new U.Event).relay(this.remoteData.searchPhoneReadyEvent);
    this.searchPhonebookReadyEvent = (new U.Event).relay(this.remoteData.searchPhonebookReadyEvent);
    this.sync = WA.Synchronizer.registerComponent("clist_abstr", ["micblog", "activity"]);
    this.sync.triggerEvent.on(this._onSyncTriggerEvent, this);
    WA.conn.Connection.triggerEvent.on(this._onConnectionTriggerEvent, this);
    this.limitRateReloadList = limitRate(function() {
      this.reloadList()
    }, 1500, this)
  }, _onActivate:function() {
    this.loadEvent.resume();
    this.countEvent.resume();
    this.searchReadyEvent.resume();
    if(typeof this.__onlineCount__ != "undefined") {
      this.countEvent.fire(this.__onlineCount__, this.__totalCount__);
      delete this.__onlineCount__;
      delete this.__totalCount__
    }
    this.remoteData.activate();
    this.searchData.activate()
  }, _onDeactivate:function() {
    this.loadEvent.suspend();
    this.countEvent.suspend();
    this.searchReadyEvent.suspend();
    this.remoteData.deactivate();
    this.searchData.deactivate()
  }, _onSyncTriggerEvent:function(syncRecord) {
    if(syncRecord.isChanged("micblog")) {
      var msg = syncRecord.get("micblog") || "";
      this.microBlogChangeEvent.fire(msg)
    }
    if(syncRecord.isChanged("activity")) {
      this._onSyncActivity()
    }
  }, _onSyncActivity:function() {
    this.remoteData.activityManager.refresh();
    this.reloadList()
  }, _onUpdateActivity:function() {
    this.limitRateReloadList()
  }, _onActivitySaved:function() {
    this.sync.write("activity", +new Date)
  }, _onRemoteDataLoad:function(ignored, data, length) {
    this.loadEvent.fire(data, length, this.remoteData.fullLength)
  }, _onConnectionTriggerEvent:function(type, value) {
    if(!this.isActive()) {
      if(type === "contactListState") {
        this.__onlineCount__ = parseInt(value.onlineCount);
        this.__totalCount__ = parseInt(value.totalCount)
      }
      return
    }
    if(type === "contactListState") {
      this.countEvent.fire(parseInt(value.onlineCount), parseInt(value.totalCount))
    }
    if(type === "micblog::status") {
      this.sync.write("micblog", value.text);
      this.microBlogChangeEvent.fire(value.text)
    }
  }, updateActivity:function(contact) {
    this.remoteData.activityManager.updateActivity(contact)
  }, updateUnreadContact:function(contact, type) {
    this.remoteData.activityManager.updateUnreadContact(contact, type)
  }, deleteActivity:function(mail) {
    this.remoteData.activityManager.deleteActivity(mail)
  }, getList:function(from, to) {
    this.remoteData.getRange(from, to)
  }, _onSearchReady:function(data, query) {
    this.searchData.setData(data, query)
  }, search:function(query) {
    if(query) {
      this.remoteData.search(query)
    }
  }, searchPhone:function(query) {
    if(query) {
      this.remoteData.searchPhone(query)
    }
  }, searchPhonebook:function(query) {
    if(query) {
      this.remoteData.searchPhonebook(query)
    }
  }, cancelSearch:function() {
    this.remoteData.cancelSearch();
    this.searchData.cancelSearch()
  }, setOfflineContactsVisibility:function(canShow) {
    this.remoteData.setOfflineContactsVisibility(canShow)
  }, reloadList:function() {
    this.remoteData.reloadList()
  }, removeContact:function(email, callback) {
    callback = callback || {};
    var cb = function(success, response) {
      if(success) {
        WA.ChangeLog.logAction("remove", {email:email});
        if(WA.isFunction(callback.success)) {
          callback.success.call(callback.scope || this, email, response)
        }
      }else {
        if(WA.isFunction(callback.failure)) {
          callback.failure.call(callback.scope || this, email, response)
        }
      }
    };
    if(WA.MainAgent.isTel(email)) {
      WA.conn.Socket.send("contact", {operation:"remove", tel:email.split("@")[0]}, cb, this)
    }else {
      WA.conn.Socket.send("contact", {operation:"remove", email:email}, cb, this)
    }
  }, renameContact:function(email, newNick, callback) {
    callback = callback || {};
    var cb = function(success, response) {
      if(success) {
        WA.ChangeLog.logAction("rename", {email:email, nickname:newNick});
        if(WA.isFunction(callback.success)) {
          callback.success.call(callback.scope || this, email, response)
        }
      }else {
        if(WA.isFunction(callback.failure)) {
          callback.failure.call(callback.scope || this, email, response)
        }
      }
    };
    if(WA.MainAgent.isTel(email)) {
      WA.conn.Socket.send("contact", {operation:"modify", tel:email.split("@")[0], nickname:newNick}, cb, this)
    }else {
      WA.conn.Socket.send("contact", {operation:"modify", email:email, nickname:newNick}, cb, this)
    }
  }, addContact:function(email, nick, tel) {
    var contact = {email:email, nickname:nick};
    if(tel) {
      contact.tel = tel
    }
    WA.ChangeLog.logAction("add", contact)
  }, getContactsInfo:function(maillist, cb, scope) {
    this.remoteData.getContactsInfo(maillist, cb, scope)
  }, getPhoneList:function(cb, scope) {
    this.remoteData.getPhoneList(cb, scope)
  }, postMicroBlog:function(msg) {
    var cb = function(success, response) {
      if(success) {
        this.sync.write("micblog", msg)
      }else {
      }
    };
    WA.conn.Socket.send("micblog/status", {text:msg}, cb, this)
  }});
  WA.ContactListAbstraction.ACTIVE_CONTACTS_MAX_LEGTH = ACTIVE_CONTACTS_MAX_LEGTH
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var DH = U.DomHelper;
  var SOCK = WA.conn.Socket;
  var LINE_HEIGHT = 25;
  var CONTACT_STATE_STATUS_MAP = {};
  CONTACT_STATE_STATUS_MAP[WA.ContactStates.TYPING_STATE] = "typing";
  CONTACT_STATE_STATUS_MAP[WA.ContactStates.MESSAGE_STATE] = "message";
  WA.ContactListAgent = WA.Activatable.extend(WA.ui.Component, {initComponent:function() {
    WA.ContactListAgent.superclass.initComponent.call(this);
    this.contactSelectEvent = new U.Event;
    this.contactSendSmsEvent = new U.Event;
    this.playSoundEvent = new U.Event;
    this.micblogAlertsOptionEvent = new U.Event;
    this.statusAlertsOptionEvent = new U.Event;
    this.previewsToggleOptionEvent = new U.Event;
    this.popupChangeVisibleEvent = new U.Event;
    this.statusMenuToggleEvent = new U.Event;
    this.subDialogOpenEvent = new U.Event;
    this.abstraction = new WA.ContactListAbstraction;
    this.abstraction.loadEvent.on(this._renderList, this);
    this.abstraction.microBlogChangeEvent.on(this._onMicroBlogChange, this);
    this.contactDataReceivedEvent = (new U.Event).relay(this.abstraction.contactDataReceivedEvent);
    this.abstraction.countEvent.on(this._onCountEvent, this);
    this.addContactDialog = new WA.AddSearchDialog;
    this.addContactDialog.addSuccessEvent.on(this.abstraction.addContact, this.abstraction);
    this.addContactDialog.openContactEvent.on(this._openContact, this);
    this.addContactDialog.contactInfoRequestEvent.on(this.abstraction.getContactsInfo, this.abstraction);
    this.addContactDialog.hideEvent.on(function() {
      this.btnAddContact.setState(false)
    }, this);
    this.subDialogOpenEvent.relay(this.addContactDialog.showEvent);
    this.dialerDialog = new WA.DialerDialog(this.abstraction);
    this.dialerDialog.hideEvent.on(function() {
      this.openDialerBtn.setState(false)
    }, this);
    this.dialerDialog.showEvent.on(function() {
      this.openDialerBtn.setState(true)
    }, this);
    this.dialerDialog.requestListEvent.on(this.abstraction.getPhoneList, this.abstraction);
    this.smsDialog = new WA.SMSDialog;
    this.smsDialog.hideEvent.on(function() {
      this.btnSendSms.setState(false)
    }, this);
    this.smsDialog.requestListEvent.on(this.abstraction.getPhoneList, this.abstraction);
    this.smsDialog.addContactEvent.on(this.abstraction.addContact, this.abstraction);
    this.smsDialog.openDialogEvent.on(this._openContact, this);
    this.sendSmsEvent = (new U.Event).relay(this.smsDialog.sendSmsEvent);
    this.subDialogOpenEvent.relay(this.smsDialog.showEvent);
    this.visible = false;
    this.searchMode = false;
    this.soundOff = false;
    this.showOffline = false;
    this.micblogAlertsOff = false;
    this.statusAlertsOff = true;
    this.showAvatars = false;
    this.hideActiveDialogs = false;
    this.hidePreviews = false;
    this.birthdayOff = false;
    this.totalCount = null;
    this.sync = WA.Synchronizer.registerComponent("clist_agent", ["hide_offline", "play_sound", "microblog", "micblog_alerts_off", "show_avatars", "hide_previews", "birthday_off", "hide_active_dialogs", "status_alerts_off"], false);
    this.sync.triggerEvent.on(this._onSyncTriggerEvent, this);
    this.offsetChecker = new U.DelayedTask({interval:50, fn:function() {
      this._checkOffset();
      this.offsetChecker.start()
    }, scope:this});
    this.searchField = new WA.ContactListAgent.SearchField(this.abstraction, {cls:"nwa-search__field", hintText:WA.tr("cl.searchContacts"), hintClass:"nwa_hint_msg"});
    this.searchField.selectEvent.on(this._openContact, this);
    this.searchField.searchStartEvent.on(this._onSearchStart, this);
    this.searchField.searchEndEvent.on(this._onSearchEnd, this);
    this.searchField.setShowAvatars(this.showAvatars);
    WA.Invalidator.invalidateEvent.on(this._onInvalidate, this);
    this.onlineConfirmSuccessEvent = new U.Event;
    this.onlineConfirmDeclineEvent = new U.Event
  }, _onSearchStart:function() {
    this.spacerEl.hide();
    this.clistEl.addClass("nwa-clist_search_mode");
    this.scrollBar.setSource(this.searchField.searchResults.getEl());
    this.searchMode = true
  }, _onSearchEnd:function() {
    this.clistEl.removeClass("nwa-clist_search_mode");
    this.spacerEl.show();
    this.scrollBar.setSource(this.clistEl);
    this.searchMode = false
  }, _onCountEvent:function(onlineCount, totalCount) {
    this.totalCount = totalCount;
    if(this.__waitForTotalCount === true) {
      var val = totalCount >= 80;
      this.sync.write("status_alerts_off", val ? "1" : "0");
      delete this.__waitForTotalCount;
      this._setStatusAlertsVisibility(val)
    }
  }, _onRender:function(ct) {
    var mail = WA.ACTIVE_MAIL;
    var iconUrl = WA.makeAvatar(mail, "_avatar32");
    this.el = ct.createChild({tag:"div", cls:"nwa-agent", children:[{tag:"div", cls:"nwa-agent__shadow", children:[{tag:"div", id:"nwaHeader", cls:"nwa-header", children:[{tag:"div", cls:"nwa-header__avatar", style:"background-image: url(" + iconUrl + ")"}, {tag:"div", cls:"nwa-header__mini", title:WA.tr("cl.hide")}, {tag:"div", cls:"nwa-header__popup", title:WA.isPopup ? WA.tr("cl.closePopup") : WA.tr("cl.openPopup")}]}, {tag:"div", cls:"nwa-search", children:[{tag:"div", id:"nwaSearch", cls:"nwa-search__wrap"}]}, 
    {tag:"div", id:"nwaClist", cls:"nwa-clist", children:[{tag:"div", id:"nwaClistWrap", cls:"nwa-clist__wrap"}, {id:"nwaClistTeaser", cls:"nwa-teaser"}]}, {tag:"div", id:"nwaToolbar", cls:"nwa-toolbar"}]}]});
    var buttonsCt = WA.get("nwaToolbar");
    var headerCont = WA.get("nwaHeader");
    this.broadcastMsg = new BroadcastMsg;
    this.broadcastMsg.render(headerCont);
    this.broadcastMsg.editOk.on(function(msg) {
      this.abstraction.postMicroBlog(msg)
    }, this);
    this.btnSendSms = new WA.ui.ToggleButton({cls:"nwa-toolbar__send-sms", handler:this._onSMSClick, stateHandler:function() {
      return false
    }, scope:this, text:"<span>&nbsp;</span>"});
    this.btnSendSms.render(buttonsCt);
    this.openDialerBtn = new WA.ui.ToggleButton({cls:"nwa-toolbar__dialer", tooltip:WA.tr("cl.makeCall"), scope:this, text:"<span>&nbsp;</span>", handler:this.toggleDialer});
    this.openDialerBtn.render(buttonsCt);
    this.btnAddContact = new WA.ui.ToggleButton({cls:"nwa-toolbar__add-contact", handler:this._onAddContactClick, stateHandler:function() {
      return false
    }, scope:this, text:"<span>&nbsp;</span>"});
    this.btnAddContact.render(buttonsCt);
    this.spacerEl = WA.get("nwaClistWrap");
    this.clistEl = WA.get("nwaClist");
    this.teaserEl = WA.get("nwaClistTeaser");
    this.teaserEl.on("click", this._onTeaserClick, this);
    this.clistEl.toggleClass("nwa-cl_avatars", this.showAvatars);
    this.scrollBar = new WA.ui.ScrollBar({source:this.clistEl, watchResize:WA.isPopup});
    this.scrollBar.render(this.el.first());
    this.spacerEl.on("click", this._onContactClick, this);
    this.searchField.render(WA.get("nwaSearch"));
    this.searchField.resultTo(this.clistEl);
    var items = [{text:WA.tr("cl.optOnlineContacts"), id:"optOffline", iconCls:"nwa-toolbar__options-menu__offline", handler:this._onToggleOfflineClick, scope:this}, {text:WA.tr("cl.optMicroblogOff"), id:"optMicblogAlerts", iconCls:"nwa-toolbar__options-menu__micblog wa-micblog-alerts-off", handler:this._onToggleMicblogAlertsClick, scope:this}, {text:WA.tr("cl.optStatusesOff"), id:"optStatusAlerts", iconCls:"nwa-toolbar__options-menu__statuses wa-statuses-alerts-off", handler:this._onToggleStatusAlertsClick, 
    scope:this}, {id:"optSound", text:WA.tr("cl.optSoundOff"), iconCls:"nwa-toolbar__options-menu__sound", handler:this._onToggleSoundClick, scope:this}, {id:"optSettings", text:WA.tr("cl.optSettings"), iconCls:"nwa-toolbar__options-menu__settings", handler:function() {
      window.open("//e.mail.ru/settings/agent")
    }, scope:this}, {id:"optBirthday", text:WA.tr("cl.optBirthdayOff"), iconCls:"nwa-toolbar__options-menu__birthday", handler:this._onToggleBirthdayClick, scope:this}, {id:"optAvatars", text:WA.tr("cl.optAvatarsOn"), iconCls:"nwa-toolbar__options-menu__avatars", handler:this._onToggleAvatarsClick, scope:this}, {id:"optActiveDialogs", text:"Включить активные диалоги", iconCls:"nwa-toolbar__options-menu__active-dialogs", handler:this._onToggleActiveDialogsClick, scope:this}, {id:"optPreviews", text:"Скрыть картинки в диалогах", 
    iconCls:"nwa-toolbar__options-menu__previews", handler:this._onTogglePreviewsClick, scope:this}];
    if(localStorage.waUseBranch && localStorage.waUseBranch != "") {
      items.push({text:WA.tr("cl.turnOff") + " " + localStorage.waUseBranch, handler:function() {
        localStorage.waUseBranch = "";
        document.location = ("" + document.location).replace(/\bwa_use_branch=[^&]+&?/, "")
      }})
    }
    var optionsMenu = this.optionsMenu = new WA.ui.menu.Menu({cls:"nwa-toolbar__options-menu", fadeIn:true, items:items});
    optionsMenu.showEvent.on(function() {
      WA.get("optMicblogAlerts").last().update(this.micblogAlertsOff ? WA.tr("cl.optMicroblogOn") : WA.tr("cl.optMicroblogOff"));
      WA.get("optMicblogAlerts").toggleClass("wa-micblog-alerts-off", !this.micblogAlertsOff);
      WA.get("optOffline").last().update(this.showOffline ? WA.tr("cl.optOnlineContacts") : WA.tr("cl.optAllContacts"));
      WA.get("optOffline").toggleClass("wa-show-offline-contacts", this.showOffline);
      WA.get("optSound").last().update(this.soundOff ? WA.tr("cl.optSoundOff") : WA.tr("cl.optSoundOn"));
      WA.get("optSound").toggleClass("wa-no-play-sound", this.soundOff);
      WA.get("optAvatars").last().update(this.showAvatars ? WA.tr("cl.optAvatarsOff") : WA.tr("cl.optAvatarsOn"));
      WA.get("optPreviews").last().update(this.hidePreviews ? WA.tr("cl.optPreviewsShow") : WA.tr("cl.optPreviewsHide"));
      WA.get("optBirthday").last().update(this.birthdayOff ? WA.tr("cl.optBirthdayOn") : WA.tr("cl.optBirthdayOff"));
      WA.get("optActiveDialogs").last().update(!this.hideActiveDialogs ? WA.tr("cl.optHideActiveDialogs") : WA.tr("cl.optShowActiveDialogs"));
      WA.get("optActiveDialogs").toggleClass("wa-show-active-dialogs-off", this.hideActiveDialogs);
      WA.get("optStatusAlerts").last().update(this.statusAlertsOff ? WA.tr("cl.optStatusesOn") : WA.tr("cl.optStatusesOff"));
      WA.get("optStatusAlerts").toggleClass("wa-statuses-alerts-off", !this.statusAlertsOff);
      this.openOptionsBtn.setState(true)
    }, this);
    optionsMenu.hideEvent.on(function() {
      this.openOptionsBtn.setState(false)
    }, this);
    this.openOptionsBtn = new WA.ui.ToggleButton({cls:"nwa-toolbar__options", menu:optionsMenu, tooltip:WA.tr("cl.options"), text:"<span>&nbsp;</span>"});
    this.openOptionsBtn.render(buttonsCt);
    this._nameBox = new WA.ui.NameBox;
    this._nameBox.render(headerCont);
    this._nameBox.setName(WA.ACTIVE_MAIL);
    this.statusToggleBtn = new WA.ui.Button({cls:"nwa-toolbar__status", scope:this, text:'<span class="nwa-button__l"></span><span class="nwa-button__r"></span><span class="nwa-button__fadeout"></span>', handler:function() {
      this.statusMenuToggleEvent.fire()
    }});
    this.statusToggleBtn.render(buttonsCt);
    headerCont.on("click", this._onHeaderClick, this);
    this.el.on("DOMMouseScroll", function(e) {
      e.stopEvent()
    })
  }, setSelfNick:function(nick) {
    this._nameBox.setName(nick)
  }, setStatus:function(status, statusTitle) {
    this.statusToggleBtn.el.first().dom.className = WA.buildIconClass(status);
    this.statusToggleBtn.el.first().next().update(U.String.htmlEntity(statusTitle));
    if(status == "offline") {
      this.dialerDialog.deactivate()
    }
  }, _onAfterRender:function() {
    this._onlineConfirmDialog = new WA.DialogsAgent.RemoveContactDialog({title:WA.tr("box.goOnline"), okButton:WA.tr("box.ok_yes"), autoRender:this.el});
    var wasOk;
    this._onlineConfirmDialog.showEvent.on(function() {
      wasOk = false
    }, this);
    this._onlineConfirmDialog.hideEvent.on(function() {
      this.deactivate();
      if(!wasOk) {
        U.Mnt.countRB(1313952);
        this.onlineConfirmDeclineEvent.fire()
      }
    }, this);
    this._onlineConfirmDialog.okEvent.on(function() {
      wasOk = true;
      U.Mnt.countRB(1313951);
      this.onlineConfirmSuccessEvent.fire()
    }, this);
    this.sync.whenReady(function() {
      this.sync.read(this._onSyncTriggerEvent, this)
    }, this)
  }, _onHeaderClick:function(e) {
    var trg = e.getTarget(true);
    if(trg.hasClass("nwa-header__popup")) {
      this.popupChangeVisibleEvent.fire();
      return
    }
    if(trg.hasClass("nwa-header__avatar") && e.ctrlKey && this.searchField && String.fromCharCode(103, 105, 109, 109, 101, 33, 106, 111, 121) == this.searchField.val()) {
      this.el.parent().addClass("nwa-agent_dyn");
      return
    }
    if(trg.up("nwa-header__msg")) {
      return
    }
    this.setVisible(WA.isPopup)
  }, _onContactClick:function(e) {
    var el = e.getTarget(true);
    var openSms = el.hasClass("nwa-cl-contact-sms-button");
    var mail = el.getAttribute("mail");
    if(!mail) {
      el = el.parent();
      mail = el.getAttribute("mail")
    }
    if(mail) {
      if(openSms) {
        U.Mnt.countRB(979781);
        var openSmsFlag = true
      }else {
        this.smsDialog.hide()
      }
      var status = el.getAttribute("status");
      var statusTitle = el.getAttribute("title");
      var nick = el.getAttribute("nick");
      var features = parseInt(el.getAttribute("features"));
      var phones = el.getAttribute("phones").split(",");
      phones = phones.length ? phones : null;
      this._openContact(mail, nick, openSms, status, statusTitle, features, phones)
    }
  }, _openContact:function(mail, nick, openSms, status, statusTitle, features, phones) {
    if(openSms) {
      this.contactSendSmsEvent.fire(mail, nick || mail, status, statusTitle, features, phones)
    }else {
      this.contactSelectEvent.fire(mail, nick || mail, status, statusTitle, features, phones)
    }
  }, _onToggleMicblogAlertsClick:function(button) {
    var val = !this.micblogAlertsOff;
    this.sync.write("micblog_alerts_off", val ? "1" : "");
    this._setMicblogAlertsVisibility(val)
  }, _setMicblogAlertsVisibility:function(val) {
    this.micblogAlertsOptionEvent.fire(val);
    this.micblogAlertsOff = val
  }, _onToggleStatusAlertsClick:function(button) {
    delete this.__waitForTotalCount;
    var val = !this.statusAlertsOff;
    if(val) {
      U.Mnt.countRB(1732280)
    }
    this.sync.write("status_alerts_off", val ? "1" : "0");
    this._setStatusAlertsVisibility(val)
  }, _setStatusAlertsVisibility:function(val) {
    this.statusAlertsOptionEvent.fire(val);
    this.statusAlertsOff = val
  }, _onToggleOfflineClick:function(button) {
    var canShow = !this.showOffline;
    this.sync.write("hide_offline", canShow ? "" : "1");
    this._setOfflineContactsVisibility(canShow)
  }, _setOfflineContactsVisibility:function(canShow) {
    this.abstraction.setOfflineContactsVisibility(canShow);
    this.showOffline = canShow
  }, _onToggleSoundClick:function(button) {
    var canPlay = !this.soundOff;
    this.sync.write("play_sound", canPlay ? "" : "1");
    this._setSoundPlayToggle(canPlay)
  }, _setSoundPlayToggle:function(canPlay) {
    this.playSoundEvent.fire(canPlay);
    this.soundOff = canPlay
  }, _onToggleActiveDialogsClick:function(button) {
    var val = !this.hideActiveDialogs;
    this.sync.write("hide_active_dialogs", val ? "1" : "");
    this._toggleActiveDialogs(val)
  }, _toggleActiveDialogs:function(val) {
    this.hideActiveDialogs = val;
    this.abstraction.remoteData.hideActiveDialogs = val;
    this.abstraction.reloadList()
  }, _onToggleAvatarsClick:function(button) {
    var val = !this.showAvatars;
    this.sync.write("show_avatars", val ? "1" : "");
    this._toggleAvatars(val)
  }, _toggleAvatars:function(force) {
    this.showAvatars = force;
    this.searchField.setShowAvatars(this.showAvatars);
    this.dialerDialog.setShowAvatars(this.showAvatars);
    this.clistEl.toggleClass("nwa-cl_avatars", force);
    this.abstraction.reloadList()
  }, _onTogglePreviewsClick:function(button) {
    var val = !this.hidePreviews;
    this.sync.write("hide_previews", val ? "1" : "");
    this._togglePreviews(val)
  }, _togglePreviews:function(val) {
    this.previewsToggleOptionEvent.fire(val);
    this.hidePreviews = val
  }, _onToggleBirthdayClick:function(button) {
    var val = !this.birthdayOff;
    this.sync.write("birthday_off", val ? "1" : "");
    this._toggleBirthdays(val)
  }, _toggleBirthdays:function(force) {
    this.birthdayOff = force
  }, _onSyncTriggerEvent:function(syncRecord) {
    var val;
    if(syncRecord.isChanged("micblog_alerts_off")) {
      val = syncRecord.get("micblog_alerts_off") === "1";
      this._setMicblogAlertsVisibility(val)
    }
    if(syncRecord.isChanged("status_alerts_off")) {
      var valInit = syncRecord.get("status_alerts_off");
      if(!WA.isString(valInit)) {
        valInit = ""
      }
      if(valInit === "") {
        if(this.totalCount === null) {
          this.__waitForTotalCount = true;
          val = true
        }else {
          val = this.totalCount >= 80;
          this.sync.write("status_alerts_off", val ? "1" : "0")
        }
      }else {
        val = valInit === "1"
      }
      this._setStatusAlertsVisibility(val)
    }
    if(syncRecord.isChanged("hide_offline")) {
      var hideOffline = syncRecord.get("hide_offline") === "1";
      this._setOfflineContactsVisibility(!hideOffline)
    }
    if(syncRecord.isChanged("play_sound")) {
      var playSound = syncRecord.get("play_sound") === "1";
      this._setSoundPlayToggle(!playSound)
    }
    if(syncRecord.isChanged("microblog")) {
      var msg = syncRecord.get("microblog") || "";
      this.broadcastMsg.setValue(msg)
    }
    if(syncRecord.isChanged("show_avatars")) {
      val = syncRecord.get("show_avatars") === "1";
      this._toggleAvatars(val)
    }
    if(syncRecord.isChanged("hide_active_dialogs")) {
      val = syncRecord.get("hide_active_dialogs") === "1";
      this._toggleActiveDialogs(val)
    }
    if(syncRecord.isChanged("hide_previews")) {
      val = syncRecord.get("hide_previews") === "1";
      this._togglePreviews(val)
    }
    if(syncRecord.isChanged("birthday_off")) {
      val = syncRecord.get("birthday_off") === "1";
      this._toggleBirthdays(val)
    }
  }, _checkOffset:function() {
    var top = this.clistEl.dom.scrollTop;
    var height = this.clistEl.dom.parentNode.scrollHeight;
    if(height != this._height || top != this._top) {
      var changed = false;
      if(WA.resizeableLayout && height != this._height) {
        this._height = height;
        this._blockSize = Math.ceil(height / LINE_HEIGHT);
        this._blockHeight = this._blockSize * LINE_HEIGHT;
        changed = true
      }
      if(top !== this._top) {
        this._top = top
      }
      var bottom = top + height;
      var from = Math.ceil(bottom / this._blockHeight) - 1;
      var to = from + 2;
      if(from != 0) {
        from--
      }
      if(this._from != from || this._to != to) {
        this._from = from;
        this._to = to;
        changed = true
      }
      if(changed) {
        this._contactsOffset = from * this._blockHeight;
        this.abstraction.getList(from * this._blockSize, to * this._blockSize)
      }
    }
  }, _getContactState:function(contact, defStatus) {
    var email = contact[0];
    var states = WA.ContactStates.getStates(email);
    if(states && states.length > 0) {
      var lastState = states[states.length - 1];
      var ret = CONTACT_STATE_STATUS_MAP[lastState];
      if(ret) {
        return ret
      }
    }
    return defStatus
  }, __getContactUnread:function(contact) {
    var unread = WA.ContactStates.getUnread(contact[0]);
    return unread || 0
  }, _describeContact:function(contact, i, offset) {
    var offset = this._contactsOffset + i * LINE_HEIGHT + offset * LINE_HEIGHT;
    var email = contact[0];
    var status = WA.MainAgent.isChat(contact[0]) && "chat" || WA.MainAgent.isTel(contact[0]) && "tel" || contact[2] && "gray" || contact[3] || "";
    var statusTitle = contact[4] || status.replace(/^icq_/, "");
    statusTitle = WA.MainAgent.statuses[statusTitle] || statusTitle;
    var statusClass = WA.buildIconClass(this._getContactState(contact, status), true);
    var nick = contact[1] || email;
    var emailTitle = status == "chat" || status == "tel" ? statusTitle : email.replace("@uin.icq", "");
    var unread = this.__getContactUnread(contact);
    var haveTel = contact[5] && contact[5].length;
    var userpic = this.showAvatars ? "background-image: url(" + WA.makeAvatar(email, "_avatar22") + "); filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + "'" + WA.makeAvatar(email, "/_avatar22") + "'" + ",sizingMethod=" + "'" + "scale" + "'" + ");" : "";
    var features = contact[6] || 0;
    var phones = contact[5] && contact[5].join(",") || "";
    return[offset, status, email, DH.htmlEntities(nick), this._generateItemId(email), DH.htmlEntities(statusTitle), DH.htmlEntities(emailTitle), statusClass, unread, unread > 0 ? " nwa-cl-contact_unread" : "", userpic, haveTel ? " nwa-cl-contact-sms" : "", features, phones]
  }, _contactTmpl:['<div style="top: {0}px" class="nwa-cl-contact{9}{11}" status="{1}" mail="{2}" id="{4}" nick="{3}" title="{5}" features="{12}" phones="{13}">', '<span class="nwa-cl-contact-avatar" title="{6}" style="{10}"></span>', '<span class="nwa-cl-contact-icon {7}" title="{5}"></span>', '<span class="nwa-cl-contact-nick" title="{6}">{3}</span>', '<div class="nwa-header__nick-fadeout"></div>', '<div class="nwa-cl-contact-sms-button" title="' + WA.tr("cl.sendSMS") + '"></div>', '<span class="nwa-msg-counter">{8}</span>', 
  "</div>"].join(""), _subtitleTmpl:['<div style="top: {2}px" class="nwa-cl-subtitle nwa-cl-subtitle_{1}">', '<span class="nwa-cl-subtitle-text">{0}</span>', "</div>"].join(""), _renderList:function(visibleArea, listLength, fullLength) {
    var start = +new Date;
    var activityManager = this.abstraction.remoteData.activityManager;
    if(!WA.isNumber(this._clistLength) && (listLength > 10 || WA.isDebug)) {
      this.el.removeClass("wa-mdf-shortclist")
    }
    if(this._clistLength !== listLength) {
      this._clistLength = listLength;
      this.spacerEl.dom.style.height = LINE_HEIGHT * this._clistLength + "px"
    }
    var from = this.abstraction.remoteData.requestParams ? this.abstraction.remoteData.requestParams.from : 0, html = [];
    var activeExist = activeCount = activityManager.getActiveCount(), activeFixedCount = activityManager.getActiveFixedCount(), drawSubtitles = !this.hideActiveDialogs && activeExist && from == 0, activeBlockEnded = false, activeListLimit = Math.max(activeFixedCount, WA.ContactListAbstraction.ACTIVE_CONTACTS_MAX_LEGTH);
    if(drawSubtitles) {
      html[0] = U.String.format.apply(U.String, [this._subtitleTmpl, WA.tr("cl.titleActive"), "active", 0])
    }
    U.Array.each(visibleArea, function(contact, i) {
      if(drawSubtitles && !activeBlockEnded && (i >= activeListLimit || i >= activeCount)) {
        activeBlockEnded = true;
        html[html.length] = U.String.format.apply(U.String, [this._subtitleTmpl, "Все", "all", LINE_HEIGHT * (i + 1)])
      }
      var args = this._describeContact(contact, i, drawSubtitles ? activeBlockEnded ? 2 : 1 : 0);
      args.unshift(this._contactTmpl);
      html[html.length] = U.String.format.apply(U.String, args)
    }, this);
    html = html.join("");
    if(this.spacerEl.dom.innerHTML != html) {
      this.spacerEl.update(html);
      this.scrollBar.sync()
    }
    this._showTeaser(fullLength, visibleArea)
  }, _showTeaser:function(count, contacts) {
    if(count === this.__lastListLength) {
      return
    }
    this.__lastListLength = count;
    this.teaserEl.hide();
    if(count > 4 || this.__teaserClosed === true) {
      return
    }
    var showInvite = count == 0 || count == 1 && contacts[0] && contacts[0][0] == "support@corp.mail.ru";
    WA.Storage.load(["cl_teaser"], {success:function(storage) {
      if(storage["cl_teaser"] && WA.now() - parseInt(storage["cl_teaser"]) < 60 * 60 * 24) {
        this.__teaserClosed = true
      }else {
        this.addContactDialog.getSuggests(function(list) {
          this._renderSuggests(list && list.slice(0, 3) || [], showInvite)
        }, this)
      }
    }, scope:this})
  }, _renderSuggests:function(suggests, showInvite) {
    var SUGGEST_HTML = '<div class="nwa-teaser__close"></div><div class="nwa-teaser__suggests">{items}</div><span class="nwa-teaser__text">{msg}</span>                     <button class="nwa-teaser__invite">' + WA.tr("cl.teaser.inviteFriends") + "</button>", SUGGEST_ITEM_HTML = '<div class="nwa-teaser__suggests-item" title="{nick}" data-mail="{mail}" style="background-image:url({avatar});"></div>';
    var items = [], html = "";
    if(suggests.length > 0) {
      U.Array.each(suggests, function(contact) {
        items.push(U.String.parseTemplate(SUGGEST_ITEM_HTML, {avatar:WA.makeAvatar(contact.email, "_avatarsmall"), nick:U.String.htmlEntity(contact.nick), mail:contact.email}))
      });
      U.Mnt.countRB(1658018)
    }else {
      if(!showInvite) {
        return
      }
    }
    U.Mnt.countRB(showInvite ? 1658076 : 1658081);
    html = U.String.parseTemplate(SUGGEST_HTML, {items:items.join(""), msg:showInvite ? WA.tr("cl.teaser.addFriendsAndChat") : WA.tr("cl.teaser.peopleYouMayKnow")});
    this.teaserEl.toggleClass("nwa-teaser_noinvite", !showInvite);
    this.teaserEl.toggleClass("nwa-teaser_nosuggests", suggests.length == 0);
    this.teaserEl.update(html);
    this.teaserEl.show()
  }, _onTeaserClick:function(e) {
    var trg = e.getTarget(true);
    if(trg.hasClass("nwa-teaser__invite")) {
      this._onAddContactClick()
    }else {
      if(trg.hasClass("nwa-teaser__suggests-item")) {
        U.Mnt.countRB(1658069);
        this.addContactDialog._onAddEvent(trg.getAttribute("data-mail"))
      }else {
        if(trg.hasClass("nwa-teaser__close")) {
          this.__teaserClosed = true;
          this.teaserEl.hide();
          WA.Storage.save({"cl_teaser":WA.now()});
          U.Mnt.countRB(1658074)
        }
      }
    }
  }, _onMicroBlogChange:function(msg) {
    this.broadcastMsg.setValue(msg)
  }, _onBeforeShow:function() {
    return this.isActive()
  }, _onShow:function() {
    this.visible = true;
    this._checkOffset();
    this.offsetChecker.start();
    this.scrollBar.sync();
    if(WA.Voip.inTalk) {
      U.Mnt.countRB(1216822)
    }
  }, _onHide:function() {
    this.visible = false;
    this.offsetChecker.stop();
    this._height = -1;
    this._top = -1;
    this.searchField.stop();
    this.addContactDialog.hide();
    this.smsDialog.hide()
  }, _resetScroll:function() {
    this.clistEl.dom.scrollTop = 0
  }, _onInvalidate:function() {
    this._resetScroll();
    delete this._height;
    if(this.visible) {
      this._checkOffset()
    }
  }, _onSMSClick:function(visibility) {
    var dlg = this.smsDialog;
    if(!dlg.rendered) {
      dlg.render(this.el)
    }
    if(visibility !== true) {
      visibility = !dlg.isVisible()
    }
    this.btnSendSms.setState(visibility);
    dlg.setVisible(visibility);
    if(visibility) {
      U.Mnt.countRB(979772)
    }
    this.show()
  }, _onAddContactClick:function() {
    var dlg = this.addContactDialog;
    if(!dlg.rendered) {
      dlg.render(this.el.parent())
    }
    this.btnAddContact.setState(!dlg.isVisible());
    dlg.setVisible(!dlg.isVisible())
  }, callTo:function(tel) {
    this.toggleDialer(true);
    this.dialerDialog.callTo(tel)
  }, toggleDialer:function(forceShow) {
    var dlg = this.dialerDialog;
    if(!dlg.rendered) {
      dlg.render(this.el.parent())
    }
    if(!dlg.isVisible()) {
      U.Mnt.countRB(1127441)
    }
    dlg.toggle(!dlg.isVisible() || forceShow === true)
  }, openAddDialog:function() {
    this._onAddContactClick();
    this.addContactDialog.show();
    this.show()
  }, searchContact:function(mail, openProfile) {
    this.openAddDialog();
    this.addContactDialog.searchMail(mail, openProfile)
  }, _generateItemId:function(email) {
    return"wa-clist-spacer-item-" + email.replace(/@|\./g, "_")
  }, activate:function(cb, scope) {
    return WA.ContactListAgent.superclass.activate.call(this, {cb:cb, scope:scope})
  }, minimize:function() {
    this.hide();
    this.dialerDialog.hide()
  }, _onActivate:function(params) {
    this.abstraction.activate();
    if(WA.isFunction(params.cb)) {
      params.cb.call(params.scope || window)
    }
  }, _onDeactivate:function() {
    this.abstraction.deactivate();
    this.searchField.abort();
    this.hide();
    this._resetScroll();
    this.dialerDialog.deactivate();
    delete this._height
  }, actualize:function(cb, scope) {
    cb && cb.call(scope || window)
  }, enableUserEvents:function() {
  }, disableUserEvents:function() {
  }, onlineConfirm:function(title) {
    this._renderList([], 0);
    this.activate();
    this.show();
    this._onlineConfirmDialog.show(title)
  }});
  var BroadcastMsg = WA.extend(WA.ui.Component, {constructor:function(config) {
    BroadcastMsg.superclass.constructor.call(this, config);
    this._editMode = false;
    this._value = "";
    this._hintText = WA.tr("cl.tellFriends");
    this.editOk = new U.Event
  }, setValue:function(val) {
    val = val || "";
    this._value = val;
    this.editField.val(val)
  }, _onRender:function(ct) {
    this.el = ct.createChild({tag:"div", cls:"nwa-header__msg", id:"nwaBroadcast", children:{tag:"div", cls:"nwa-header__msg-wrap"}});
    this.editField = new WA.ui.TextField({multiline:true, cls:"nwa-header__msg-field", hintText:this._hintText, hintClass:"nwa_hint_msg"});
    this.editField.render(this.el.first())
  }, _onAfterRender:function() {
    BroadcastMsg.superclass._onAfterRender.call(this);
    this.editField.getEl().on("mousedown", function(e) {
      if(this._editMode) {
        return
      }
      this._editOn();
      e.stopEvent()
    }, this);
    this.editField.blurEvent.on(this._editOff, this);
    this.editField.getEl().on("keydown", function(e) {
      if(!e.shiftKey && e.keyCode == 13) {
        var newValue = U.String.trim(this.editField.val());
        if(this._value !== newValue) {
          this._value = newValue;
          this.editOk.fire(newValue)
        }
        this._editOff();
        e.stopEvent()
      }else {
        if(e.keyCode == 27) {
          this.editField.val(this._value);
          this._editOff()
        }
      }
    }, this)
  }, _editOn:function() {
    if(this._editMode) {
      return
    }
    this._editMode = true;
    this.el.addClass("nwa-header__msg_expanded");
    this.el.removeClass("nwa-header__msg_nohint");
    this.editField.focus();
    this.editField.select()
  }, _editOff:function() {
    if(!this._editMode) {
      return
    }
    this._editMode = false;
    this.editField.blur();
    this.el.removeClass("nwa-header__msg_expanded");
    this.editField.getEl().dom.scrollTop = 0;
    if(this.editField.val() != "") {
      this.el.addClass("nwa-header__msg_nohint")
    }
  }})
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var SELECTED_ITEM_CLS = "nwa-search-results__item_selected";
  var SearchResults = WA.ContactListAgent.SearchResults = WA.extend(WA.ui.Component, {autoEl:{tag:"div", style:"display: none"}, initComponent:function() {
    SearchResults.superclass.initComponent.call(this);
    this.__cursor = 0;
    this.selectEvent = new U.Event
  }, setData:function(data) {
    if(!this.isVisible()) {
      this.show()
    }
    if(data.data.length > 0) {
      var html = U.Array.transform(data.data, function(contact, index) {
        return this.__renderSearchResult(contact, index, data.query)
      }, this).join("");
      this.el.update(html)
    }else {
      this.el.update("&nbsp;" + WA.tr("cl.noResults"))
    }
  }, _onAfterRender:function() {
    SearchResults.superclass._onAfterRender.call(this);
    this.el.on("mouseover", this._onMouseOver, this);
    this.el.on("click", this._onClick, this)
  }, __renderSearchResult:function(contact, index, query) {
    var mail = contact[0];
    var nick = U.DomHelper.htmlEntities(contact[1] || mail);
    var hlMail = "";
    if(!WA.MainAgent.isChat(mail) && !WA.MainAgent.isTel(mail)) {
      hlMail = mail;
      var inMail = hlMail.indexOf(query);
      if(inMail != -1) {
        hlMail = hlMail.substr(0, inMail) + "<strong>" + hlMail.substr(inMail, query.length) + "</strong>" + hlMail.substr(inMail + query.length)
      }
    }
    if(contact[1]) {
      var hlNick = contact[1] ? nick : hlMail;
      var inNick = nick.indexOf(query);
      if(contact[1] && inNick != -1) {
        hlNick = nick.substr(0, inNick) + "<strong>" + nick.substr(inNick, query.length) + "</strong>" + nick.substr(inNick + query.length)
      }
      if(hlMail) {
        hlMail = " (" + hlMail + ")"
      }
    }else {
      hlNick = ""
    }
    var status = WA.MainAgent.isChat(mail) && "chat" || WA.MainAgent.isTel(mail) && "tel" || contact[2] && "gray" || contact[3];
    return U.String.format('<div id="{4}" class="nwa-search-results__item {3}" nick="{0}" mail="{1}" status="{2}" title="{10}" features="{11}" idx="{5}">' + '<span class="nwa-cl-contact-avatar" title="{0}" style="{9}"></span>' + '<span class="nwa-cl-contact-icon {8}"></span><span>{6}{7}</span></div>', nick, mail, status, index === this.__cursor ? SELECTED_ITEM_CLS : "", this.__generateItemId(index), index, hlNick, hlMail, WA.buildIconClass(status, true), this.showAvatars ? "background-image: url(" + 
    WA.makeAvatar(mail, "_avatar22") + "); filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + "'" + WA.makeAvatar(mail, "/_avatar22") + "'" + ",sizingMethod=" + "'" + "scale" + "'" + ");" : "", U.DomHelper.htmlEntities(contact[3] || ""), contact[6] || 0)
  }, __generateItemId:function(index) {
    return this.getId() + "-item-" + index
  }, __getItemAt:function(index) {
    return WA.get(this.__generateItemId(index))
  }, __getCurrentEl:function() {
    return this.__getItemAt(this.__cursor)
  }, __setCursor:function(newEl) {
    var index = parseInt(newEl.getAttribute("idx"));
    if(index >= 0 && this.__cursor !== index) {
      var oldEl = this.__getCurrentEl();
      if(oldEl) {
        oldEl.removeClass(SELECTED_ITEM_CLS);
        newEl.addClass(SELECTED_ITEM_CLS);
        this.__cursor = index
      }
    }
  }, moveCursor:function(direction) {
    var oldEl = this.__getCurrentEl();
    if(oldEl) {
      var newEl = oldEl[direction]();
      if(newEl) {
        this.__setCursor(newEl)
      }
    }
  }, _onMouseOver:function(e) {
    var el = e.getTarget(true);
    if(el) {
      this.__setCursor(el)
    }
  }, _onHide:function() {
    this.el.update("");
    this.__cursor = 0
  }, __selectEl:function(el) {
    this.selectEvent.fire(el.getAttribute("mail"), el.getAttribute("nick"), el.getAttribute("status"), el.getAttribute("title"), el.getAttribute("features"))
  }, _onClick:function(e) {
    if(!this.isVisible() || e.button !== 0) {
      return
    }
    var target = e.getTarget(true);
    if(target && this.el.contains(target)) {
      e.stopPropagation();
      var c = target;
      while(c && !c.equals(this.el)) {
        var mail = c.getAttribute("mail");
        if(mail) {
          this.__selectEl(c);
          break
        }else {
          c = c.parent()
        }
      }
    }
  }, selectCurrentItem:function() {
    var el = this.__getCurrentEl();
    if(el) {
      this.__selectEl(el)
    }
  }});
  var SearchField = WA.ContactListAgent.SearchField = WA.extend(WA.ui.TextField, {constructor:function(abstraction, config) {
    SearchField.superclass.constructor.call(this, config);
    this.abstraction = abstraction;
    this.abstraction.searchReadyEvent.on(this._onSearchReady, this);
    this.searchStartEvent = new U.Event;
    this.searchEndEvent = new U.Event;
    this.searchDT = new U.DelayedTask;
    this.pasteDT = new U.DelayedTask({fn:function() {
      this._doSearch();
      this.pasteDT.start()
    }, scope:this, interval:200});
    if(config.closeOnBlur) {
      WA.FocusManager.blurEvent.on(function() {
        this._cancelSearch()
      }, this)
    }
    this.searchResults = new SearchResults({cls:"nwa-search-results"});
    this.selectEvent = new U.Event;
    this.searchResults.selectEvent.on(this._onSearchResultSelect, this)
  }, setShowAvatars:function(flag) {
    this.searchResults.showAvatars = flag
  }, resultTo:function(container) {
    this.resultContainer = container
  }, abort:function() {
    this._cancelSearch()
  }, _onSearchResultSelect:function(mail, nick, status, statusTitle, features) {
    WA.setTimeout(this._cancelSearch, 400, this);
    this.selectEvent.fire(mail, nick, false, status, statusTitle, features)
  }, _onRender:function(ct) {
    SearchField.superclass._onRender.call(this, ct);
    this.clearBtn = new WA.ui.Button({cls:"nwa-search__clear", handler:function() {
      this._cancelSearch()
    }, scope:this});
    this.clearBtn.render(ct)
  }, _onAfterRender:function() {
    SearchField.superclass._onAfterRender.call(this);
    this.el.on("keyup", this._onSearchFieldKeyUp, this);
    this.el.on("paste", function(e) {
      WA.setTimeout(this._doSearch, 200, this)
    }, this);
    if(WA.isOpera) {
      this.el.on("mouseup", function(e) {
        if(e.button == 2) {
          this.pasteDT.start()
        }
      }, this)
    }
  }, _cancelSearch:function(stayFocused) {
    this.clearBtn.hide();
    if(stayFocused !== true) {
      this.val("");
      try {
        this.el.dom.blur()
      }catch(e) {
      }
      this._onBlur();
      this.stop()
    }
    this.abstraction.cancelSearch();
    if(this.searchResults.rendered) {
      this.searchResults.hide()
    }
    this.searchEndEvent.fire()
  }, _onSearchReady:function(ignored, data) {
    var sr = this.searchResults;
    if(!sr.rendered) {
      sr.renderEvent.on(WA.createDelegate(this._onSearchReady, this, [ignored, data], 0));
      sr.render(this.resultContainer || this.container)
    }else {
      sr.setData(data);
      this.searchStartEvent.fire()
    }
  }, _onSearchFieldKeyUp:function(e) {
    var keyCode = e.getKeyCode();
    if(keyCode === 38) {
      this.searchResults.moveCursor("prev")
    }else {
      if(keyCode === 40) {
        this.searchResults.moveCursor("next")
      }else {
        if(keyCode === 13) {
          var selectedItem = this.searchResults.selectCurrentItem();
          if(selectedItem) {
            this._onSearchResultSelect(selectedItem.mail, selectedItem.nick, selectedItem.status, selectedItem.title, selectedItem.features)
          }
        }else {
          if(keyCode === 27) {
            e.preventDefault();
            this._cancelSearch()
          }else {
            this.searchDT.start(150, this._doSearch, this)
          }
        }
      }
    }
  }, _doSearch:function() {
    var query = this.val();
    if(query) {
      this.clearBtn.show();
      this.abstraction.search(query)
    }else {
      this._cancelSearch(true)
    }
  }, stop:function() {
    this.pasteDT.stop();
    this.searchDT.stop()
  }, destroy:function() {
    this.searchResults.destroy();
    if(this.clearBtn) {
      this.clearBtn.destroy()
    }
    this.pasteDT.stop();
    this.searchDT.stop();
    this.selectEvent.removeAll();
    this.selectEvent = null;
    SearchField.superclass.destroy.call(this)
  }})
})();
(function() {
  var WA = WebAgent, U = WA.util, UI = WA.ui;
  var keybrd = [["1", "", "1", ""], ["2", "ABC", "2", ""], ["3", "DEF", "3", ""], ["4", "GHI", "4", ""], ["5", "JKL", "5", ""], ["6", "MNO", "6", ""], ["7", "PQRS", "7", ""], ["8", "TUV", "8", ""], ["9", "WXYZ", "9", ""], ["*", "", "s", ""], ["0", "+", "0", ""], ["#", "", "d", ""], ["", "", "book", WA.tr("dialer.phoneBook")], ["", "", "call", ""], ["", "", "back", ""]];
  var MAX_NUMBER_SIZE = 20;
  var SEARCH_MAX_ITEMS = 8;
  var SELECTED_ITEM_CLS = "nwa-search-results__item_selected";
  var DEFAULT_CURRENCY = WA.tr("dialer.currencyRub");
  var VOIP_DOMEN = "http://voip.agent.mail.ru";
  var LINK_CABINET = VOIP_DOMEN + "/cabinet";
  var LINK_HOWTOPAY = VOIP_DOMEN + "/howtopaypopular";
  var LINK_TARIFF = VOIP_DOMEN + "/tariffs";
  var LINK_GET_BALANCE = "//voip-agent.mail.ru/cgi-bin/agentbalance";
  var LINK_GET_TARIFF = "//voip-agent.mail.ru/cgi-bin/agenttarif";
  var ONLY_NUMBERS_MODE = false;
  WA.DialerDialog = WA.extend(UI.Layer, {constructor:function(abstraction) {
    WA.DialerDialog.superclass.constructor.apply(this, arguments);
    this.initialConfig.hideOnEscape = false;
    this.autoEl = null;
    this._telHash = {};
    this._balance = null;
    this.abstraction = abstraction;
    this.abstraction.searchPhonebookReadyEvent.on(this._onSearchReady, this);
    this.phonebook = new WA.Phonebook(this.abstraction);
    this.phonebook.requestListEvent.on(this.abstraction.getPhoneList, this.abstraction);
    this.phonebook.selectEvent.on(this._onSearchResultSelect, this);
    this.requestListEvent = new U.Event;
    this.numberDialEvent = new U.Event;
    this.toneDialEvent = new U.Event;
    this.searchDT = new U.DelayedTask;
    this.searchResults = new SearchResults;
    this.searchResults.selectEvent.on(this._onSearchResultSelect, this)
  }, _onRender:function(el) {
    this.el = el.createChild({cls:"nwa-dialer" + (this.searchResults.showAvatars ? " nwa-cl_avatars" : ""), children:[{cls:"nwa-dialer__shadow", children:[{cls:"nwa-dialer__input-wrap", children:{cls:"nwa-dialer__close nwa_action_close"}}, {cls:"nwa-dialer__numpad", html:""}, {cls:"nwa-dialer__results"}, {cls:"nwa-dialer__account", children:[{tag:"a", href:LINK_CABINET, target:"_blank", cls:"nwa-dialer__account-balance"}, {tag:"a", cls:"nwa-dialer__account-cabinet nwa-underline", href:LINK_CABINET, 
    target:"_blank", children:[{cls:"nwa-button"}, {tag:"span", html:WA.tr("dialer.cabinet")}]}, {tag:"a", cls:"nwa-dialer__account-tariff nwa-underline", href:LINK_TARIFF, target:"_blank", children:[{cls:"nwa-button"}, {tag:"span", html:WA.tr("dialer.callTariff")}]}, {tag:"a", cls:"nwa-dialer__account-howtopay nwa-underline", href:LINK_HOWTOPAY, target:"_blank", html:WA.tr("dialer.pay")}]}]}, {cls:"nwa-dialer__msg", children:[{cls:"nwa-dialer__msg-wrap"}, {cls:"nwa-dialer__close nwa_action_msg_close"}, 
    {cls:"nwa-dialer__msg-icon"}]}]});
    this.balancePad = this.el.first().first().next().next().next().first();
    this.input = new WA.ui.TextField({cls:"nwa-dialer__input", hintText:WA.tr("dialer.phoneOrName"), maxLength:MAX_NUMBER_SIZE});
    this.input.render(this.el.first().first());
    this.input.el.setAttribute("placeholder", WA.tr("dialer.phoneOrName"));
    this.input.el.on("keyup", this._onDialerKeyUp, this).on("keydown", this._onDialerKeyDown, this).on("paste", function(e) {
      WA.setTimeout(this._checkValue, 200, this)
    }, this);
    this.numPad = this.el.first().first().next();
    this.resultPad = this.el.first().first().next().next();
    this.msgEl = this.el.last();
    U.Array.each(keybrd, function(el, ind) {
      this.numPad.createChild({cls:"nwa-dialer__numpad-key nwa-dialer__numpad-" + el[2], "data-num":el[0] || el[2], title:el[3], html:'<span class="nwa-dialer__numpad-keynum">' + el[0] + "</span>" + (el[1] ? '<span class="nwa-dialer__numpad-keytip">' + el[1] + "</span>" : "")})
    }, this);
    this.el.on("mousedown", this._onDialerMouseDown, this).on("mouseup", this._onDialerMouseUp, this).first().on("click", function() {
      if(this._pos > -1 && WA.isIE) {
        this.input.focus(this._pos);
        this._pos = -1
      }else {
        this.input.focus()
      }
    }, this);
    this.phonebook.hideEvent.on(function() {
      this._doSearch();
      this.input.focus()
    }, this);
    this.setBalance({balance:"0.00", currency:DEFAULT_CURRENCY});
    this.requestBalance()
  }, callTo:function(tel) {
    if(!this._confirmDialog) {
      this._confirmDialog = new WA.DialogsAgent.RemoveContactDialog({autoRender:this.el, okButton:WA.tr("box.ok_yes")});
      this._confirmDialog.cancelEvent.on(function() {
        U.Mnt.countRB(1313954)
      }, this)
    }
    this._confirmDialog.okEvent.removeAll();
    this._confirmDialog.okEvent.on(function() {
      U.Mnt.countRB(1313953);
      if(this.isOnCall()) {
        this.manualHangup()
      }
      this.input.val(tel);
      this.tryDialNumber()
    }, this);
    if(this.isOnCall()) {
      this._confirmDialog.show(WA.tr("dialer.hangupAndDialNumber") + ' <span class="nwa-special-nick">' + U.String.htmlEntity(tel) + "</span>?")
    }else {
      this._confirmDialog.show(WA.tr("dialer.dialNumber") + ' <span class="nwa-special-nick">' + U.String.htmlEntity(tel) + "</span>?")
    }
  }, showMsg:function(code, params) {
    var icon = WA.Voip.infoIcons[code] || WA.Voip.infoIcons["error"];
    var msg = WA.Voip.infoMessages[code] || WA.Voip.infoMessages["unknown"];
    this.msgEl.dom.className = "nwa-dialer__msg nwa-dialer__msg_" + icon;
    this.msgEl.first().update(msg);
    this.el.addClass("nwa-dialer_info");
    this.msgEl.addClass("nwa-dialer__msg_vis")
  }, closeMsg:function() {
    this.msgEl.removeClass("nwa-dialer__msg_vis");
    this.el.removeClass("nwa-dialer_info")
  }, setBalance:function(obj) {
    this._balance = obj.balance;
    if(this.balancePad) {
      this.balancePad.update(("" + obj.balance).replace(/\./, ",") + "<span> " + (obj.currency || DEFAULT_CURRENCY) + "</span>")
    }
  }, setTariff:function(obj) {
    this.callButton.setTariff(obj)
  }, isOnCall:function() {
    return this.el && this.el.hasClass("nwa-dialer_oncall")
  }, toggle:function(state) {
    if(!this.isOnCall() || state === true) {
      if(state == null) {
        state = this.isVisible()
      }
      if(!WA.Voip.isCompatiblePSTN && state === true) {
        this.showMsg("flashRequiredPSTN", {});
        WA.Voip.voipLog("flashRequired", {pstn:1})
      }
      if(state === false && this.rendered) {
        this.closeMsg()
      }
      this.setVisible(state)
    }else {
      this.toggleNumpad()
    }
  }, show:function() {
    this.toggle(true)
  }, hide:function() {
    this.toggle(false)
  }, toggleNumpad:function(force) {
    if(this.isOnCall()) {
      if(force === true) {
        this.el.removeClass("nwa-dialer_compact")
      }else {
        this.el.toggleClass("nwa-dialer_compact", !this.el.hasClass("nwa-dialer_compact"))
      }
    }
  }, _onDialerKeyDown:function(e) {
    var k = e.getKeyCode();
    if(k == 13) {
      e.preventDefault()
    }
    if(!ONLY_NUMBERS_MODE) {
      this._checkValue();
      return
    }
    if(k == 32 || k > 57 && k < 96 && k != 61 || k == 61 && !e.shiftKey || k > 105 && k < 112 && k != 107 || k > 145 && k != 187 || k == 187 && !e.shiftKey || e.shiftKey && k > 57 && k != 187 && k != 61) {
      if(!e.ctrlKey) {
        e.preventDefault()
      }
    }else {
      if((k == 107 || k == 187) && this.input.val().indexOf("+") > -1) {
        if(!e.ctrlKey) {
          e.preventDefault()
        }
      }else {
        if(k == 8 && this.input.getCursor() == 1 && this.input.val().length > 1) {
          if(!e.ctrlKey) {
            e.preventDefault()
          }
        }else {
          this._checkValue()
        }
      }
    }
  }, _onDialerKeyUp:function(e) {
    var keyCode = e.getKeyCode();
    this._checkValue();
    if(keyCode === 38) {
      this.searchResults.moveCursor("prev")
    }else {
      if(keyCode === 40) {
        this.searchResults.moveCursor("next")
      }else {
        if(keyCode === 27) {
          e.preventDefault();
          this._cancelSearch()
        }else {
          if(keyCode === 13) {
            if(this.resultPad.isVisible()) {
              this.searchResults.selectCurrentItem();
              this._cancelSearch()
            }else {
              this.tryDialNumber()
            }
          }else {
            this.searchDT.start(150, this._doSearch, this)
          }
        }
      }
    }
  }, _pressKey:function(key) {
    var keyVal = false, val = this.input.val();
    this._checkValue();
    var pos = this.input.getCursor();
    switch(key) {
      case "call":
        if(this.isOnCall()) {
          this.manualHangup()
        }else {
          this.tryDialNumber()
        }
        return;
      case "book":
        return this.openBook();
      case "back":
        if(val.length) {
          if(pos > 1 || pos == 1 && val.length == 1) {
            this.input.val(val.substr(0, pos - 1) + val.substr(pos--));
            this.input.focus(pos)
          }
        }
        break;
      default:
        keyVal = key
    }
    if(keyVal !== false && this._call) {
      WA.Voip.tone(keyVal)
    }
    if(/^\d$/.test(keyVal)) {
      if(pos == 0 && val.length) {
        pos++
      }
      if(keyVal == "0" && val == "") {
        keyVal = "+"
      }
      val = val.substr(0, pos) + keyVal + val.substr(pos++);
      if(val.length <= MAX_NUMBER_SIZE) {
        this.input.val(val);
        this.input.focus(pos)
      }
    }
    this._checkValue();
    this._pos = this.input.getCursor()
  }, manualHangup:function() {
    WA.Voip.hangup(true)
  }, _checkValue:function() {
    var val = this.input.val();
    var pos = this.input.getCursor();
    var oldVal = val;
    var plus = oldVal.indexOf("+") === 0;
    if(ONLY_NUMBERS_MODE) {
      val = oldVal.replace(/\D+/g, "");
      val && (val = "+" + val);
      val = val.substr(0, MAX_NUMBER_SIZE);
      if(plus && val == "") {
        val = "+"
      }
      if(val != oldVal) {
        this.input.val(val)
      }
      if(pos > val.length) {
        this.input.focus(val.length)
      }
    }else {
      if(val.length && val.indexOf("+") == -1 && val.substr(0, 1).match(/\d/)) {
        val = "+" + val;
        this.input.val(val)
      }
    }
    this.input.el.toggleClass("nwa-dialer__input_small", val.length > 12);
    this.input.el.toggleClass("nwa-dialer__input_xsmall", val.length > 16)
  }, _doSearch:function() {
    var query = this.input.val();
    if(ONLY_NUMBERS_MODE) {
      query = query.replace(/\D+/g, "")
    }
    if(query && !this.isOnCall()) {
      this.abstraction.searchPhonebook(query)
    }else {
      this._cancelSearch()
    }
  }, _cancelSearch:function() {
    this.abstraction.cancelSearch();
    if(this.searchResults.rendered) {
      this.searchResults.hide()
    }
    this.resultPad.hide()
  }, _onSearchReady:function(ignored, data) {
    if(this.isVisible()) {
      if(!data || data.data.length == 0 || data.data.length == 1 && data.data[0][5] && data.query == data.data[0][5][0]) {
        this._cancelSearch();
        return
      }
      var sr = this.searchResults;
      if(!sr.rendered) {
        sr.render(this.resultPad);
        this.scrollBar = new WA.ui.ScrollBar({source:this.searchResults.getEl(), watchResize:WA.isPopup});
        this.scrollBar.render(this.resultPad)
      }
      this.resultPad.show();
      this.searchResults.show();
      sr.setData(data);
      this.scrollBar.sync()
    }
  }, _onDialerMouseDown:function(e) {
    var target = e.getTarget(true);
    this._clearKey();
    if(target.hasClass("nwa_action_close")) {
      this.toggle(false);
      return
    }
    if(target.hasClass("nwa_action_msg_close")) {
      this.closeMsg();
      if(!WA.Voip.isCompatiblePSTN) {
        this.hide()
      }
      return
    }
    if(target.up("nwa-tabcall")) {
      if(!target.up("nwa-slider")) {
        var callDialogClick = true
      }
      var action = target.getAttribute("data-action");
      if(!action) {
        target = target.parent();
        action = target.getAttribute("data-action")
      }
      switch(action) {
        case "mute":
          var muted = target.getAttribute("data-muted") == "1";
          target.setAttribute("data-muted", muted ? "0" : "1");
          target.toggleClass("nwa-tabcall__mute_off", !muted);
          WA.Voip.mute(!muted);
          break;
        case "volume":
          break;
        case "numpad":
          this.toggleNumpad();
          U.Mnt.countRB(1127444);
          break;
        case "hangup":
          this.manualHangup();
          break;
        default:
          if(callDialogClick) {
            this.toggleNumpad(true)
          }
      }
      return
    }
    var key = target.up("nwa-dialer__numpad-key");
    if(key) {
      key.addClass("nwa-dialer__numpad-key_pressed");
      this.__lastPressedKey = key;
      this._pressKey(key.getAttribute("data-num"));
      return
    }
  }, _onDialerMouseUp:function(e) {
    this._clearKey()
  }, _clearKey:function() {
    if(this.__lastPressedKey) {
      this.__lastPressedKey.removeClass("nwa-dialer__numpad-key_pressed");
      this.__lastPressedKey = null
    }
  }, tryDialNumber:function() {
    if(this.isOnCall()) {
      return
    }
    var tel = this.input.val().replace(/\D+/g, "");
    if(tel.length) {
      var contact = this._telHash[tel];
      if(contact) {
        this.dialContact(contact[0], contact[1] || WA.SA.get(contact[0]).nick || contact[0], contact[3], contact[4], tel)
      }else {
        this.dialContact(tel + "@tel.agent", U.String.formatPhone(tel), "tel", WA.tr("dialer.phone"), tel)
      }
    }else {
      return false
    }
  }, dialContact:function(mail, nick, status, statusTitle, tel) {
    if(this._call) {
      return false
    }
    this._call = WA.Voip.createOutgoingCall();
    if(this._call) {
      if(!this.callButton) {
        this.callButton = new CallDialog;
        this.callButton.render(this.el)
      }
      this._call.changeStateEvent.on(this._onCallStateChange, this);
      this._call.messageEvent.on(this._onCallMessage, this);
      this.el.addClass("nwa-dialer_oncall");
      this.input.fix(true);
      this.callButton.open(mail, nick);
      this._call.startCall(tel);
      this.requestTariff(tel);
      U.Mnt.countRB(1127442)
    }
  }, _onCallStateChange:function(state) {
    if(state.ended) {
      this._call = null;
      this.input.fix(false);
      this.el.removeClass("nwa-dialer_oncall").removeClass("nwa-dialer_compact");
      this.callButton.hide();
      this.requestBalance();
      return
    }
    if(state.time !== undefined) {
      if(this.callButton) {
        this.callButton.updateDuration(state.time)
      }
    }
  }, _onCallMessage:function(type) {
    this.showMsg(type)
  }, requestBalance:function() {
    var params = {callback:"WebAgent.ma.updateBalance", lang:"en", Login:WA.ACTIVE_MAIL, expand:1, format:"jsonp", rnd:Math.random()};
    var url = LINK_GET_BALANCE + "?" + WA.makeGet(params);
    var script = WA.getBody().dom.appendChild(document.createElement("script"));
    script.type = "text/javascript";
    script.src = url
  }, requestTariff:function(phone) {
    var params = {callback:"WebAgent.ma.updateTariff", lang:"en", Login:WA.ACTIVE_MAIL, Phone:phone, format:"jsonp"};
    var url = LINK_GET_TARIFF + "?" + WA.makeGet(params);
    var script = WA.getBody().dom.appendChild(document.createElement("script"));
    script.type = "text/javascript";
    script.src = url
  }, setShowAvatars:function(flag) {
    this.searchResults.showAvatars = flag;
    this.phonebook.setShowAvatars(flag);
    if(this.el) {
      this.el.toggleClass("nwa-cl_avatars", flag)
    }
  }, _onSearchResultSelect:function(mail, nick, status, tel) {
    this._cancelSearch();
    this.input.val(tel);
    this.input.focus();
    this._checkValue();
    this.tryDialNumber()
  }, openBook:function() {
    if(!this.phonebook.rendered) {
      this.phonebook.render(this.el)
    }
    this.phonebook.show()
  }, _onClick:function(e) {
  }, _onHide:function() {
    this.phonebook.hide();
    this.input.val("");
    this._cancelSearch();
    this.searchDT.stop();
    WA.DialerDialog.superclass._onHide.apply(this, arguments)
  }, _onShow:function() {
    WA.DialerDialog.superclass._onShow.apply(this, arguments);
    this.input.focus();
    this._requestList()
  }, _requestList:function() {
    if(!this._isListRequested) {
      this._isListRequested = true;
      this.requestListEvent.fire(this._prepareList, this)
    }
  }, _prepareList:function(list) {
    var telHash = {};
    U.Array.each(list, function(item) {
      if(item[5] && item[5].length) {
        U.Array.each(item[5], function(tel) {
          telHash[tel.replace(/\D+/g, "")] = item
        }, this)
      }
    }, this);
    this._telHash = telHash
  }, deactivate:function() {
    if(this.isOnCall()) {
      this.manualHangup()
    }
    this.hide()
  }, destroy:function() {
    this.searchDT.stop();
    WA.DialerDialog.superclass.destroy.call(this)
  }});
  var CallDialog = WA.extend(WA.ui.TabButton, {initComponent:function() {
    this.initialConfig.preventDefault = false;
    CallDialog.superclass.initComponent.call(this)
  }, _onRender:function(ct) {
    var buttonConfig = {tag:"div", cls:"nwa-tabcall", children:[{cls:"nwa-tabcall__avatar"}, {tag:"div", cls:"nwa-tabcall__inner ", title:this.initialConfig.title || "", children:[{tag:"span", cls:"nwa-tabcall__title", html:this.initialConfig.text || ""}, {tag:"a", cls:"nwa-tabcall__tariff nwa-underline", href:LINK_TARIFF, target:"_blank", title:WA.tr("dialer.tariff"), html:""}, {cls:"nwa-tabcall__title-fadeout"}, {cls:"nwa-tabcall__numpad", "data-action":"numpad"}, {cls:"nwa-tabcall__mute", "data-action":"mute"}, 
    {cls:"nwa-tabcall__volume", "data-action":"volume"}]}, {cls:"nwa-tabcall__hangup", html:"<span>&nbsp;</span>", "data-action":"hangup"}]};
    if(this.initialConfig.tabAttributes) {
      WA.apply(buttonConfig, this.initialConfig.tabAttributes)
    }
    this.el = ct.createChild(buttonConfig);
    this.innerEl = this.el.first().next();
    var volumeBtn = this.innerEl.last();
    this.tariffEl = this.innerEl.first().next();
    this.avatarEl = this.el.first();
    this.vol = new UI.Volume({controlEl:volumeBtn, muteCls:"nwa-tabcall__volume_mute", autoRender:this.el});
    this.vol.changeEvent.on(function(val) {
      val = Math.round(val / 10) / 10;
      WA.Voip.volume(val)
    });
    this.duration = new WA.VoipView.DurationBox;
    this.duration.render(this.innerEl)
  }, updateDuration:function(s) {
    if(s > 0) {
      this.tariffEl.show()
    }
    if(this.rendered) {
      this.duration.update(s)
    }
  }, open:function(mail, nick) {
    var iconUrl;
    if(!WA.MainAgent.isTel(mail)) {
      iconUrl = WA.makeAvatar(mail, "_avatar50")
    }
    this.initialConfig.text = U.String.htmlEntity(nick);
    if(this.rendered) {
      this.el.removeClass("nwa-tabcall_avatar");
      this.avatarEl.hide();
      var lastEl = this.innerEl.first();
      lastEl.update(this.initialConfig.text);
      if(iconUrl) {
        this.el.addClass("nwa-tabcall_avatar");
        this.avatarEl.setStyle({"background-image":"url(" + iconUrl + ")"}).show()
      }
      this.tariffEl.setVisible(!iconUrl)
    }
    this.show();
    this.updateDuration(0)
  }, setTariff:function(obj) {
    if(this.tariffEl) {
      this.tariffEl.update(("" + obj.price).replace(/\./, ",") + "<span> " + (obj.currency || DEFAULT_CURRENCY) + "/" + WA.tr("dialer.minutes") + "</span>")
    }
  }, setText:function(text) {
    this.initialConfig.text = text;
    if(this.rendered) {
      var lastEl = this.el.first().first();
      lastEl.update(this.initialConfig.text)
    }
  }});
  var SearchResults = WA.extend(WA.ui.Component, {autoEl:{tag:"div", cls:"nwa-search-results", style:"display: none"}, initComponent:function() {
    SearchResults.superclass.initComponent.call(this);
    this.__cursor = 0;
    this.selectEvent = new U.Event
  }, setData:function(data) {
    if(!this.isVisible()) {
      this.show()
    }
    var html = U.Array.transform(data.data.slice(0, SEARCH_MAX_ITEMS), function(contact, index) {
      return this.__renderSearchResult(contact, index, data.query)
    }, this).join("");
    this.el.update(html)
  }, _onAfterRender:function() {
    SearchResults.superclass._onAfterRender.call(this);
    this.el.on("mouseover", this._onMouseOver, this);
    this.el.on("click", this._onClick, this)
  }, __renderSearchResult:function(contact, index, query) {
    var mail = contact[0];
    var nick = U.DomHelper.htmlEntities(contact[1] || mail);
    var status = WA.MainAgent.isTel(mail) && "tel" || contact[2] && "gray" || contact[3];
    var tel = contact[5] && contact[5][0] || "";
    return U.String.format('<div id="{4}" class="nwa-search-results__item {3}" nick="{0}" mail="{1}" status="{2}" tel={6} idx="{5}">' + '<span class="nwa-cl-contact-avatar" title="{0}" style="{9}"></span>' + '<span class="nwa-cl-contact-icon {8}"></span><span>{0}</span>&nbsp;<span class="nwa-cl-contact-phone">{7}</span></div>', nick, mail, status, index === this.__cursor ? SELECTED_ITEM_CLS : "", this.__generateItemId(index), index, tel, U.String.formatPhone(tel), WA.buildIconClass(status, true), 
    this.showAvatars && !WA.MainAgent.isTel(mail) ? "background-image: url(" + WA.makeAvatar(mail, "_avatar22") + "); filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + "'" + WA.makeAvatar(mail, "/_avatar22") + "'" + ",sizingMethod=" + "'" + "scale" + "'" + ");" : "")
  }, __generateItemId:function(index) {
    return this.getId() + "-item-" + index
  }, __getItemAt:function(index) {
    return WA.get(this.__generateItemId(index))
  }, __getCurrentEl:function() {
    return this.__getItemAt(this.__cursor)
  }, __setCursor:function(newEl) {
    var index = parseInt(newEl.getAttribute("idx"));
    if(index >= 0 && this.__cursor !== index) {
      var oldEl = this.__getCurrentEl();
      if(oldEl) {
        oldEl.removeClass(SELECTED_ITEM_CLS);
        newEl.addClass(SELECTED_ITEM_CLS);
        this.__cursor = index
      }
    }
  }, moveCursor:function(direction) {
    var oldEl = this.__getCurrentEl();
    if(oldEl) {
      var newEl = oldEl[direction]();
      if(newEl) {
        this.__setCursor(newEl)
      }
    }
  }, _onMouseOver:function(e) {
    var el = e.getTarget(true);
    if(el) {
      this.__setCursor(el)
    }
  }, _onHide:function() {
    this.el.update("");
    this.__cursor = 0
  }, __selectEl:function(el) {
    this.selectEvent.fire(el.getAttribute("mail"), el.getAttribute("nick"), el.getAttribute("status"), el.getAttribute("tel"))
  }, _onClick:function(e) {
    if(!this.isVisible() || e.button !== 0) {
      return
    }
    var target = e.getTarget(true);
    if(target && this.el.contains(target)) {
      e.stopPropagation();
      var c = target;
      while(c && !c.equals(this.el)) {
        var mail = c.getAttribute("mail");
        if(mail) {
          this.__selectEl(c);
          break
        }else {
          c = c.parent()
        }
      }
    }
  }, selectCurrentItem:function() {
    var el = this.__getCurrentEl();
    if(el) {
      this.__selectEl(el)
    }
  }})
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var UI = WA.ui;
  var ConnectionRoster = WA.conn.ConnectionRoster;
  var SELECTED_ITEM_CLS = "nwa-search-results__item_selected";
  var SearchPhoneField = WA.extend(WA.ContactListAgent.SearchField, {constructor:function(abstraction, config) {
    SearchPhoneField.superclass.constructor.superclass.constructor.call(this, config);
    this.abstraction = abstraction;
    this.searchStartEvent = new U.Event;
    this.searchEndEvent = new U.Event;
    this.selectEvent = new U.Event;
    this.searchDT = new U.DelayedTask;
    this.pasteDT = new U.DelayedTask({fn:function() {
      this._doSearch();
      this.pasteDT.start()
    }, scope:this, interval:200});
    this.searchResults = new SearchResults({cls:"nwa-search-results"});
    this.searchResults.selectEvent.on(this._onSearchResultSelect, this)
  }, _onRender:function(ct) {
    SearchPhoneField.superclass._onRender.call(this, ct);
    this.searchResults.render(this.resultContainer || ct);
    this.abstraction.searchPhonebookReadyEvent.on(this._onSearchReady, this)
  }, _doSearch:function() {
    var query = this.val();
    if(query) {
      this.clearBtn.show();
      this.abstraction.searchPhonebook(query)
    }else {
      this._cancelSearch(true)
    }
  }, _cancelSearch:function(stayFocused) {
    SearchPhoneField.superclass._cancelSearch.call(this, stayFocused);
    this.abstraction.getPhoneList(this._onPhoneListReady, this)
  }, _onPhoneListReady:function(data) {
    var newData = [], newItem;
    U.Array.each(data, function(item) {
      if(item[5] && item[5].length) {
        U.Array.each(item[5], function(tel) {
          newItem = U.Array.clone(item);
          newItem[5] = [tel];
          newData.push(newItem)
        }, this)
      }
    }, this);
    var sr = this.searchResults;
    sr.setData({data:newData, query:""});
    this.searchStartEvent.fire()
  }, _onSearchResultSelect:function(mail, nick, status, tel) {
    WA.setTimeout(this._cancelSearch, 400, this);
    this.selectEvent.fire(mail, nick, status, tel)
  }, eoc:null});
  var SearchResults = WA.extend(WA.ContactListAgent.SearchResults, {__renderSearchResult:function(contact, index, query) {
    var mail = contact[0];
    var nick = U.DomHelper.htmlEntities(contact[1] || mail);
    var status = WA.MainAgent.isTel(mail) && "tel" || contact[2] && "gray" || contact[3];
    var tel = contact[5] && contact[5][0] || "";
    var hlNick = nick;
    var inNick = nick.indexOf(query);
    if(contact[1] && inNick != -1) {
      hlNick = nick.substr(0, inNick) + "<strong>" + nick.substr(inNick, query.length) + "</strong>" + nick.substr(inNick + query.length)
    }
    return U.String.format('<div id="{4}" class="nwa-search-results__item {3}" nick="{0}" mail="{1}" status="{2}" tel={6} idx="{5}">' + '<span class="nwa-cl-contact-avatar" title="{0}" style="{9}"></span>' + '<span class="nwa-cl-contact-icon {8}"></span><span>{10}</span>&nbsp;<span class="nwa-cl-contact-phone">{7}</span></div>', nick, mail, status, index === this.__cursor ? SELECTED_ITEM_CLS : "", this.__generateItemId(index), index, tel, U.String.formatPhone(tel), WA.buildIconClass(status, true), 
    this.showAvatars && !WA.MainAgent.isTel(mail) ? "background-image: url(" + WA.makeAvatar(mail, "_avatar22") + "); filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + "'" + WA.makeAvatar(mail, "/_avatar22") + "'" + ",sizingMethod=" + "'" + "scale" + "'" + ");" : "", hlNick)
  }, __selectEl:function(el) {
    this.selectEvent.fire(el.getAttribute("mail"), el.getAttribute("nick"), el.getAttribute("status"), el.getAttribute("tel"))
  }});
  WA.Phonebook = WA.extend(UI.Layer, {constructor:function(abstraction) {
    WA.Phonebook.superclass.constructor.apply(this, arguments);
    this.initialConfig.fadeIn = false;
    this.initialConfig.hideOnEscape = false;
    this.autoEl = null;
    this.requestListEvent = new U.Event;
    this.selectEvent = new U.Event;
    this.searchField = new SearchPhoneField(abstraction, {cls:"nwa-search__field", hintText:WA.tr("dialer.searchContacts"), hintClass:"nwa_hint_msg"});
    this.searchField.searchStartEvent.on(this._onSearchStart, this);
    this.searchField.searchEndEvent.on(this._onSearchEnd, this);
    this.searchField.setShowAvatars(this.showAvatars);
    this.searchField.selectEvent.on(function() {
      this.hide();
      this.selectEvent.fire.apply(this.selectEvent, arguments)
    }, this)
  }, _onRender:function(el) {
    this.el = el.createChild({cls:"nwa-pbook" + (this.showAvatars ? " nwa-cl_avatars" : ""), children:[{cls:"nwa-header", children:[{cls:"nwa-header__icon"}, {cls:"nwa-header__title", html:WA.tr("dialer.contacts")}, {cls:"nwa-dialer__close nwa_pbook_close"}]}, {cls:"nwa-search", children:[{cls:"nwa-search__wrap"}]}, {cls:"nwa-clist"}]});
    this.clistEl = this.el.last();
    this.searchField.resultTo(this.el.last());
    this.searchField.render(this.el.last().prev().first());
    this.scrollBar = new WA.ui.ScrollBar({source:this.el.last(), watchResize:WA.isPopup});
    this.scrollBar.render(this.el.last());
    this.el.on("click", this._onBookClick, this)
  }, _onAfterRender:function() {
    WA.Phonebook.superclass._onAfterRender.call(this);
    this.searchField._doSearch()
  }, _onSearchStart:function() {
    this.clistEl.addClass("nwa-clist_search_mode");
    this.scrollBar.setSource(this.searchField.searchResults.getEl());
    this.searchMode = true
  }, _onSearchEnd:function() {
    this.clistEl.removeClass("nwa-clist_search_mode");
    this.scrollBar.setSource(this.clistEl);
    this.searchMode = false
  }, _onBookClick:function(e) {
    var target = e.getTarget(true);
    if(target.hasClass("nwa_pbook_close")) {
      this.hide();
      return
    }
  }, setShowAvatars:function(flag) {
    this.showAvatars = flag;
    this.searchField.setShowAvatars(this.showAvatars);
    if(this.el) {
      this.el.toggleClass("nwa-cl_avatars", flag)
    }
  }, _onHide:function() {
    this.searchField.stop();
    this.searchField._cancelSearch();
    WA.Phonebook.superclass._onHide.apply(this, arguments)
  }, _onShow:function() {
    this.searchField._cancelSearch();
    this.scrollBar.sync()
  }})
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var UI = WA.ui;
  WA.IncomingCallDialog = WA.extend(UI.Layer, {constructor:function(config) {
    WA.IncomingCallDialog.superclass.constructor.apply(this, arguments);
    this.initialConfig.hideOnEscape = false;
    this.autoEl = null;
    this.autoRender = WA.ma.el;
    this.actionEvent = new U.Event
  }, _onRender:function(el) {
    this.el = el.createChild({cls:"nwa-window nwa-voip", style:"display: none", children:[{cls:"nwa-voip__avatar"}, {cls:"nwa-voip__user", children:[{cls:"nwa-voip__status"}, {cls:"nwa-voip__nick", tag:"span"}, {cls:"nwa-voip__nick-fadeout"}]}, {cls:"nwa-voip__text", html:WA.tr("voip.incomingCall")}, {tag:"button", cls:"nwa-el-green nwa-voip__voice", "data-action":"voice", html:"<span>" + WA.tr("voip.answer") + "</span>"}, {tag:"button", cls:"nwa-el-hangup", "data-action":"decline", html:"<span>" + 
    WA.tr("voip.decline") + "</span>"}, {tag:"button", cls:"nwa-window__close", "data-action":"decline"}]});
    if(WA.Voip.isCompatibleVideo) {
      this.el.addClass("nwa-voip_video");
      this.el.createChild({tag:"button", cls:"nwa-el-green nwa-voip__video", "data-action":"video", html:"<span>" + WA.tr("voip.answerVideo") + "</span>"})
    }else {
      U.Mnt.countRB(1378994)
    }
    if(WA.IncomingCallDialog.even) {
      this.el.addClass("nwa-voip_even")
    }
    WA.IncomingCallDialog.even = !WA.IncomingCallDialog.even;
    this.avatarEl = this.el.first();
    this.userEl = this.el.first().next();
    this.el.on("mousedown", this._onMouseDown, this)
  }, _onMouseDown:function(e) {
    e.stopPropagation();
    var target = e.getTarget(true);
    if(!target.getAttribute("data-action")) {
      target = target.parent()
    }
    var action = target && target.getAttribute("data-action");
    if(action) {
      this.hide();
      this.actionEvent.fire(action)
    }
  }, open:function(email, nick, status) {
    this.show();
    var iconUrl = WA.makeAvatar(email, "_avatarmedium");
    this.avatarEl.setStyle({"background-image":"url(" + iconUrl + ")"});
    this.userEl.first().dom.className = "nwa-voip__status " + WA.buildIconClass(status, true);
    this.userEl.first().next().update(nick || email)
  }, _onClick:function(e) {
  }});
  WA.IncomingCallDialog.even = false
})();
WebAgent.UserAttend = function() {
  var WA = WebAgent;
  var U = WA.util;
  var UserAttend = WA.extend(Object, {constructor:function() {
    this.attendEvent = new U.Event;
    WA.fly(window).on("blur", this._onIntermediateBlur, this);
    WA.fly(window).on("focus", this._onIntermediateBlur, this);
    this._attendChecker = new U.DelayedTask({interval:1E3, fn:this._checkAttend, scope:this})
  }, isAttend:false, _userActivityDate:+new Date, _onMouseMove:function() {
    this._userActivityDate = +new Date;
    if(this.__focusTmr) {
      clearTimeout(this.__focusTmr);
      this.__focusTmr = false
    }
  }, _checkAttend:function() {
    var now = +new Date;
    if(now - this._userActivityDate > 1E3 * 60) {
      this._onBlur()
    }
  }, __focusTmr:false, _onIntermediateBlur:function() {
    clearTimeout(this.__focusTmr);
    this.__focusTmr = WA.setTimeout(WA.createDelegate(this._onBlur, this), 10)
  }, _onBlur:function() {
    if(this.isAttend) {
      this.__focusTmr = false;
      this.isAttend = false
    }
  }, onActivity:function() {
    if(!this.isAttend) {
      this.isAttend = true;
      this.attendEvent.fire()
    }
  }, forceActivity:function() {
    this.attendEvent.fire()
  }, activate:function() {
    WA.getBody().on("mousemove", this._onMouseMove, this);
    WA.debug.Console.log("UserAttend.activate");
    WA.get("wa-root").on("click", this.onActivity, this).on("keydown", this.onActivity, this);
    WA.FocusManager.ifFocused(this.onActivity, null, this)
  }, deactivate:function() {
    WA.getBody().un("mousemove", this._onMouseMove, this);
    WA.debug.Console.log("UserAttend.deactivate");
    WA.get("wa-root").un("click", this.onActivity, this).un("keydown", this.onActivity, this);
    this.isAttend = false
  }});
  return new UserAttend
}();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var SOCK = WA.conn.Socket;
  var US = WebAgent.conn.UserState;
  var FM = WA.FocusManager;
  var ConnectionRoster = WA.conn.ConnectionRoster;
  var JSON = WA.getJSON();
  var S = WA.Storage;
  var object2string = function(object) {
    var ret;
    if(WA.isObject(object)) {
      ret = [];
      U.Object.each(object, function(val, key) {
        ret.push(key + ": " + val)
      });
      ret = "{" + ret.join(", ") + "}"
    }else {
      ret = "" + object
    }
    return ret
  };
  var StatusAccumulator = WA.extend(ConnectionRoster, {constructor:function() {
    StatusAccumulator.superclass.constructor.apply(this, arguments);
    this._log = {};
    this._tel = {}
  }, _onConnectionContactStatus:function(value) {
    if(!this._log[value.email]) {
      this._log[value.email] = {}
    }
    if(value.status) {
      this._log[value.email].status = value.status.type;
      this._log[value.email].statusTitle = value.status.title
    }
    if(value.nickname) {
      this._log[value.email].nick = value.nickname
    }
    if(!this._log[value.email].nick) {
      this._log[value.email].nick = value.email
    }
    if(value.features) {
      this._log[value.email].features = value.features
    }
    var phones = value.phones;
    if(phones) {
      this._log[value.email].phones = U.Array.clone(phones);
      U.Array.each(phones, function(tel) {
        this._tel[tel] = value.email
      }, this)
    }
  }, _onConnectionContactMicblogStatus:function(value) {
    this._onConnectionContactStatus(value)
  }, _onConnectionContactModifySuccess:function(value) {
    var phones = value.phones;
    if(phones) {
      U.Array.each(phones, function(tel) {
        this._tel[tel] = value.email
      }, this)
    }
  }, get:function(mail) {
    if(this._log[mail]) {
      return{nick:this._log[mail].nick, status:this._log[mail].status, statusTitle:this._log[mail].statusTitle, features:this._log[mail].features, phones:U.Array.clone(this._log[mail].phones || []), mail:mail}
    }else {
      return{}
    }
  }, getByTel:function(tel) {
    if(this._tel[tel]) {
      var mail = this._tel[tel];
      return this.get(mail)
    }else {
      return{}
    }
  }, destroy:function() {
    delete this._log;
    delete this._tel;
    StatusAccumulator.superclass.destroy.apply(this, arguments)
  }});
  var SA = WA.SA = new StatusAccumulator;
  var IncomingMessage = WA.IncomingMessage = WA.extend(Object, {constructor:function(value) {
    var message = this._loadSAInfo(value);
    var mail = message.mail;
    WA.applyIf(message, {nick:value.nickname});
    message.arch_id = value.arch_id;
    message.from = mail;
    message.date = value.timestamp;
    message.text = value.text;
    if(value.mult) {
      this.flash = true;
      message.text = value.mult.tag
    }
    message.unreaded = 1;
    if(value.request && value.request.delivery) {
      if(value.offline) {
        WA.conn.Connection.confirmOfflineDelivery(value.uidl)
      }else {
        if(value.message_id) {
          SOCK.send("message", {to:mail, message_id:value.message_id, delivered:1})
        }
      }
    }
    this.data = message
  }, _loadSAInfo:function(value) {
    return SA.get(value.from)
  }});
  var AuthMessage = WA.extend(IncomingMessage, {constructor:function(value) {
    AuthMessage.superclass.constructor.call(this, value);
    WA.applyIf(this.data, {nick:this.data.from, status:"gray"});
    this.data.message_id = value.uidl || value.message_id;
    this.data.auth = 1
  }});
  var MicblogMessage = WA.extend(IncomingMessage, {constructor:function(value) {
    MicblogMessage.superclass.constructor.call(this, value);
    this.data.micblog = 1;
    this.data.message_id = value.id
  }});
  var ServiceMessage = WA.extend(Object, {constructor:function(value) {
    this.data = {voip:true, from:value.from, date:value.date, title:value.title, text:value.text}
  }});
  var OutgoingMessage = WA.OutgoingMessage = WA.extend(ConnectionRoster, {UNDELIVERED_TIMEOUT:30, constructor:function(msg) {
    OutgoingMessage.superclass.constructor.apply(this, arguments);
    var now = WA.now();
    this.mail = msg.mail;
    this.text = msg.text;
    this.resend = msg.resend;
    this.data = {text:msg.text, date:msg.date || now, from:WA.ACTIVE_MAIL, message_id:(Math.random() * 1E7).toFixed(0), undelivered:1, unreaded:0, deliverExpired:0};
    if(msg.flash) {
      var swf = WA.DialogsAgent.Smiles.getSwfById(msg.text);
      if(swf) {
        this.data.flashCode = msg.text;
        this.data.flashText = WA.tr("msgMultSupport", {alt:swf.alt});
        this.data.text = swf.html
      }
    }
    var timeout = msg.date ? msg.date + this.UNDELIVERED_TIMEOUT - now : this.UNDELIVERED_TIMEOUT;
    this._timer = WA.setTimeout(function() {
      this.data.deliverExpired = 1;
      if(SOCK.last410 > 0 && now - SOCK.last410 < 31) {
        U.Mnt.countRB(1346377)
      }
      this.updateEvent.fire(this.data.message_id);
      if(timeout > 0) {
        U.Mnt.countRB(1335024)
      }
    }, timeout > 0 ? timeout * 1E3 : 0, this);
    this.updateEvent = new U.Event
  }, send:function() {
    var text = this.data.text;
    if(this.mail.indexOf("@uin.icq") != -1) {
    }
    var req = {to:this.mail, message_id:this.data.message_id, text:text};
    if(this.data.flashCode) {
      req["mult-tag"] = req["text"];
      req["text"] = this.data.flashText
    }
    SOCK.send("message", req)
  }, _onConnectionMessageDelivered:function(value) {
    if(value.message_id == this.data.message_id) {
      U.Mnt.countRB(1348722);
      clearTimeout(this._timer);
      this.data.date = value.timestamp;
      delete this.data.undelivered;
      var message_id = this.data.message_id;
      delete this.data.message_id;
      delete this.data.deliverExpired;
      this.updateEvent.fire(message_id)
    }
  }, destroy:function() {
    OutgoingMessage.superclass.destroy.apply(this, arguments);
    clearTimeout(this._timer);
    this.updateEvent.removeAll()
  }});
  var History = WA.extend(ConnectionRoster, {constructor:function(dialog) {
    History.superclass.constructor.apply(this, arguments);
    this.dialog = dialog;
    this.updateEvent = new U.Event;
    this._instances = {};
    if(WA.MainAgent.isTel(this.dialog.mail)) {
      this.dialog.historyLoaded = true;
      this._requested = true;
      this.dialog.history || (this.dialog.history = []);
      this.dialog.isTel = true
    }else {
      this._fetchHistory()
    }
  }, _fetchHistory:function() {
    var now = WA.now();
    if(this.dialog.history) {
      U.Array.each(this.dialog.history, function(data) {
        if(data.undelivered) {
          var message = new OutgoingMessage(data);
          message.data = data;
          this._instances[message.message_id] = message;
          message.updateEvent.on(this._onMessageUpdate, this)
        }
      }, this)
    }
  }, append:function(message) {
    this.dialog.history || (this.dialog.history = []);
    if(message instanceof MicblogMessage && this._indexOf(message, "message_id") > -1) {
      return
    }
    this.dialog.history.push(message.data);
    if(message instanceof OutgoingMessage) {
      this._instances[message.data.message_id] = message;
      message.updateEvent.on(this._onMessageUpdate, this)
    }
    if(message instanceof IncomingMessage && message.data.unreaded && !(message instanceof MicblogMessage)) {
      this.dialog.unreaded = 1;
      if(this.dialog.unreadCount < 99) {
        this.dialog.unreadCount++
      }
      WA.ContactStates.saveUnread(message.data.from, this.dialog.unreadCount);
      var updateTabs = true
    }
    if(message instanceof AuthMessage) {
      this.dialog.auth = true;
      this.dialog.historyLoaded = true
    }
    if(message instanceof IncomingMessage || message instanceof OutgoingMessage) {
      message = message.data.text || "";
      var ytb = /https?:\/\/(?:www\.)?youtu(?:\.be\/|be\.com\/watch\?(?:[^\&=]+=[^\&]*\&)*v=)([a-zA-Z0-9_-]+)/, notImage = /[^\s\n\t:-]/, isImg = /.+\.(jpg|png|gif|bmp|tif)$/;
      message.replace(/((?:https?|ftp):\/\/([a-z0-9]+[\.-])+[^\s\n\t><"']+[^\s\n\t><"'\.,])/ig, function(ignored, href, r$, index, all) {
        if(!all[index - 1] || !notImage.test(all[index - 1])) {
          if(ytb.exec(href)) {
            U.Mnt.countRB(1596113)
          }else {
            if(isImg.test(href)) {
              U.Mnt.countRB(1596112)
            }
          }
        }
      })
    }
    this.updateEvent.fire(updateTabs)
  }, _onMessageUpdate:function(message_id) {
    var message = this._instances[message_id];
    if(message) {
      message.destroy();
      delete this._instances[message_id]
    }
    this._sort();
    this.updateEvent.fire()
  }, load:function(firstHistMessId) {
    if(!this._requested && (!this.dialog.historyLoaded || typeof this.dialog.historyLoaded != "boolean" && firstHistMessId && this.dialog.historyLoaded !== firstHistMessId)) {
      this._requested = firstHistMessId || true;
      var mail = this.dialog.mail;
      SOCK.send("history", firstHistMessId ? {email:mail, from:firstHistMessId} : {email:mail}, function(success) {
        if(!success) {
          WA.setTimeout(WA.createDelegate(function() {
            SOCK.send("history", firstHistMessId ? {email:mail, from:firstHistMessId} : {email:mail})
          }, this), 1E3)
        }
      }, this)
    }
  }, _repack:function(arr) {
    var history = [];
    if(arr.history) {
      U.Array.each(arr.history, function(arr) {
        history.push({from:arr[1].from, text:arr[1].text, arch_id:arr[1].arch_id, date:arr[1].timestamp})
      })
    }
    return history
  }, markAsReaded:function() {
    var changed = false;
    if(this.dialog.history) {
      U.Array.each(this.dialog.history, function(data) {
        if(data.unreaded) {
          delete data.unreaded;
          changed = true
        }
      }, this)
    }
    return changed
  }, makeAuthorized:function() {
    var changed = false;
    if(this.dialog.history) {
      U.Array.each(this.dialog.history, function(data, i) {
        if(data.auth) {
          delete data.auth;
          changed = true
        }
      }, this)
    }
    return changed
  }, _sortCb:function(a, b) {
    var n = "date";
    if(a.date == b.date) {
      n = "arch_id"
    }
    if(a[n] < b[n]) {
      return-1
    }else {
      if(a[n] > b[n]) {
        return 1
      }else {
        return 0
      }
    }
  }, _sort:function() {
    if(this.dialog.history && this.dialog.history.sort) {
      this.dialog.history.sort(this._sortCb)
    }
  }, _indexOf:function(message, id_name) {
    id_name || (id_name = "arch_id");
    var arch_id = message[id_name];
    var r = U.Array.indexOfBy(this.dialog.history, function(m) {
      if(arch_id > 0 && m[id_name] == arch_id) {
        return true
      }
    }, this);
    return r
  }, _getSideArchId:function(last) {
    var h = this.dialog.history || [], n = last ? h.length - 1 : 0, i = last ? -1 : 1;
    while(h[n] && !h[n].arch_id) {
      n += i
    }
    return h[n] && h[n].arch_id
  }, _addUniqOnly:function(messages) {
    this.dialog.history || (this.dialog.history = []);
    U.Array.each(messages, function(message) {
      var index = this._indexOf(message);
      if(index == -1) {
        this.dialog.history.push(message)
      }
    }, this)
  }, _onConnectionContactHistory:function(value) {
    if(value.email == this.dialog.mail) {
      var lastHistory = !value.history || value.history.length < 20;
      this.dialog.notscroll = this.dialog.history && this.dialog.history.length;
      if(value.disabled || value.error == "Decline") {
        this.dialog.historyDisabled = "1";
        this.dialog.history || (this.dialog.history = [])
      }else {
        this._addUniqOnly(this._repack(value));
        this._sort()
      }
      if(!this.dialog.historyLoaded || typeof this.dialog.historyLoaded != "boolean") {
        var lastMessId = this._getSideArchId(true);
        if(lastHistory) {
          this.dialog.historyLoaded && U.Mnt.countRB(1623009);
          this.dialog.historyLoaded = true
        }else {
          this.dialog.historyLoaded = typeof this._requested != "boolean" ? this._requested : lastMessId
        }
        this.updateEvent.fire()
      }
      this._requested = false
    }
  }, destroy:function() {
    History.superclass.destroy.apply(this, arguments);
    U.Object.each(this._instances, function(message) {
      message.destroy()
    }, this);
    this.updateEvent.removeAll();
    this.__destroyed = true
  }});
  var Dialog = WA.extend(Object, {constructor:function(mail, data) {
    this.data = data || {mail:mail, modifDate:+new Date, cast:{}, unreadCount:0};
    this.data.unreadCount || (this.data.unreadCount = 0);
    this.data.cast[WA.ACTIVE_MAIL] = {nick:WA.DialogsAbstraction.nick};
    this.history = new History(this.data);
    this.history.updateEvent.on(this._onHistoryUpdate, this);
    this.focusedEvent = new U.Event;
    this.callingEvent = new U.Event;
    this.updateEvent = new U.Event;
    this.typingTimeout = new U.DelayedTask({interval:15E3, fn:this._onTypingTimeout, scope:this});
    if(this.data.typing) {
      var now = +new Date;
      var timeout = 15E3 - (now - this.data.typing);
      this.typingTimeout.start(timeout, this._onTypingTimeout, this)
    }
  }, updateSelfNickDialog:function(nick) {
    this.data.cast[WA.ACTIVE_MAIL].nick = nick;
    this.data.modifDate = +new Date;
    this.updateEvent.fire()
  }, _onTypingTimeout:function() {
    if(this.data.typing) {
      delete this.data.typing;
      this.updateEvent.fire(true)
    }
  }, setTyping:function() {
    this.data.typing = +new Date;
    this.updateEvent.fire(true);
    this.typingTimeout.start()
  }, stopTyping:function() {
    if(this.data.typing) {
      this.typingTimeout.stop();
      delete this.data.typing;
      this.updateEvent.fire(true)
    }
  }, setCast:function(nick, status, statusTitle, features, phones) {
    var cast = {nick:U.String.htmlEntity(nick), status:status, statusTitle:statusTitle, features:features || 0, phones:U.Array.clone(phones || [])};
    this.data.cast[this.data.mail] = cast;
    this.updateEvent.fire(true)
  }, focus:function() {
    this.focusedEvent.fire(this.data.mail, this);
    this.history.load()
  }, calling:function() {
    this.callingEvent.fire(this.data.mail, this)
  }, isUnread:function() {
    return this.data.unreaded
  }, markAsReaded:function() {
    if(this.history.markAsReaded() || this.data.unreaded) {
      delete this.data.unreaded;
      this.data.unreadCount = 0;
      this.updateEvent.fire(true, "read_message")
    }
  }, makeAuthorized:function() {
    if(this.history.makeAuthorized() || this.data.auth) {
      delete this.data.auth;
      delete this.data.historyLoaded;
      this.history.load();
      this.data.modifDate = (new Date).getTime();
      this.updateEvent.fire(true)
    }
  }, getHistory:function() {
    return this.history
  }, _onHistoryUpdate:function(updateTabs) {
    this.data.modifDate = +new Date;
    this.updateEvent.fire(updateTabs)
  }, destroy:function() {
    this.history.destroy();
    this.focusedEvent.removeAll();
    this.callingEvent.removeAll();
    this.updateEvent.removeAll();
    this.typingTimeout.stop()
  }});
  var DialogsManager = WA.extend(Object, {constructor:function(cache) {
    this._cache = cache;
    this._data = this._cache.data;
    this._instances = {};
    this.MAX_DIALOGS_OPENED = 4;
    this._fetchDialogs()
  }, _fetchDialogs:function() {
    if(this._data.dialogs && this._data.dialogs.length) {
      U.Array.each(this._data.dialogs, function(dialog) {
        if(dialog.unreaded || dialog.typing) {
          this._makeInstance(dialog.mail)
        }
      }, this);
      var focusedDialog = this.getFocused();
      if(focusedDialog) {
        focusedDialog.history.load()
      }
    }
  }, _indexOfDialog:function(mail) {
    return U.Array.indexOfBy(this._data.dialogs, function(dialog) {
      if(dialog.mail == mail) {
        return true
      }
    })
  }, getIfExist:function(mail) {
    var index = this._indexOfDialog(mail);
    if(index != -1) {
      return this.get(mail)
    }
  }, get:function(mail, keepFocusedPosition) {
    if(mail && !this._instances[mail]) {
      this._makeInstance(mail, keepFocusedPosition)
    }
    return this._instances[mail]
  }, _checkOverflow:function() {
    if(this._data.dialogs.length >= this.MAX_DIALOGS_OPENED) {
      this.close(this._data.dialogs[0].mail === this._data.focused ? this._data.dialogs[1].mail : this._data.dialogs[0].mail)
    }
  }, _makeInstance:function(mail, keepFocusedPosition) {
    var index = this._indexOfDialog(mail), findex = null, cindex = null;
    if(!this._data.dialogs[index]) {
      this._instances[mail] = new Dialog(mail);
      if(keepFocusedPosition && this._data.focused && this._data.dialogs.length >= this.MAX_DIALOGS_OPENED) {
        findex = this._data.focused ? this._indexOfDialog(this._data.focused) : null
      }
      if(this._data.calling && this._data.dialogs.length >= this.MAX_DIALOGS_OPENED) {
        cindex = this._data.calling ? this._indexOfDialog(this._data.calling) : null
      }
      this._data.dialogs.push(this._instances[mail].data);
      if(findex != null && cindex != null && findex < cindex) {
        var tmp = findex;
        findex = cindex;
        cindex = tmp
      }
      if(findex != null) {
        this._moveDialog(findex, findex + 1)
      }
      if(cindex != null) {
        this._moveDialog(cindex, cindex + 1)
      }
      this._data.dialogsModifDate = +new Date
    }else {
      this._instances[mail] = new Dialog(mail, this._data.dialogs[index])
    }
    this._instances[mail].focusedEvent.on(this._onDialogFocused, this);
    this._instances[mail].callingEvent.on(this._onDialogCalling, this);
    this._instances[mail].updateEvent.on(this._onDialogUpdate, this)
  }, _moveDialog:function(index, newIndex) {
    var dialog = this._data.dialogs.splice(index, 1)[0];
    this._data.dialogs.splice(newIndex, 0, dialog)
  }, _onDialogFocused:function(mail, dialog) {
    var len = this._data.dialogs.length;
    var index = this._indexOfDialog(mail);
    if(len - index > this.MAX_DIALOGS_OPENED) {
      this._moveDialog(index, len);
      this._data.dialogsModifDate = +new Date
    }
    this._data.focused = mail;
    this._cache.commit()
  }, _onDialogCalling:function(mail) {
    var len = this._data.dialogs.length;
    var index = this._indexOfDialog(mail);
    if(len - index > this.MAX_DIALOGS_OPENED) {
      this._moveDialog(index, len);
      this._data.dialogsModifDate = +new Date
    }
    if(this._data.focused == mail) {
      this._data.focused = false
    }
    this._data.calling = mail;
    this._cache.commit()
  }, endCall:function() {
    this._data.calling = false;
    this._cache.commit()
  }, blur:function() {
    this._data.focused = false;
    this._cache.commit()
  }, _onDialogUpdate:function(updateTabs) {
    if(updateTabs) {
      this._data.dialogsModifDate = +new Date
    }
    this._cache.commit()
  }, count:function() {
    return this._data.dialogs.length
  }, getFocused:function() {
    if(this._data.focused) {
      return this.get(this._data.focused)
    }else {
      return false
    }
  }, getOpenDialogs:function() {
    for(var i = 1, ret = [], len = this._data.dialogs.length;i < 5 && i <= len;i++) {
      ret.push(this._data.dialogs[len - i].mail)
    }
    return ret
  }, eachDialog:function(fn, scope) {
    U.Array.each(this._data.dialogs, function(dialog, index) {
      var mail = dialog.mail;
      fn.call(scope || this, dialog, mail, index)
    }, this)
  }, updateSelfNick:function(nick) {
    this._cache.preventCommit();
    U.Object.each(this._instances, function(dialog) {
      dialog.updateSelfNickDialog(nick)
    }, this);
    this._cache.permitCommit()
  }, closeAll:function() {
    this.destroy();
    this._instances = {};
    this._data.dialogs = [];
    this._data.focused = false;
    this._data.dialogsModifDate = +new Date;
    this._cache.commit()
  }, close:function(mail) {
    if(this._instances[mail]) {
      this._destroyDialog(this._instances[mail]);
      delete this._instances[mail]
    }
    var uncommitted;
    if(this._data.focused == mail) {
      this._data.focused = false;
      uncommitted = true
    }
    var index = this._indexOfDialog(mail);
    if(index != -1) {
      this._data.dialogs.splice(index, 1);
      this._data.dialogsModifDate = +new Date;
      uncommitted = true
    }
    if(uncommitted) {
      this._cache.commit()
    }
  }, _destroyDialog:function(dialog) {
    dialog.destroy();
    delete this._instances[dialog.mail]
  }, destroy:function() {
    U.Object.each(this._instances, this._destroyDialog, this)
  }, clearHistory:function() {
    var now = +new Date;
    if(this._data.dialogs && this._data.dialogs.length) {
      U.Array.each(this._data.dialogs, function(dialog) {
        if(this._instances[dialog.mail]) {
          this._destroyDialog(this._instances[dialog.mail])
        }
        delete dialog.typing;
        delete dialog.historyLoaded;
        delete dialog.history
      }, this);
      this._cache.commit()
    }
  }});
  var DialogsCache = WA.extend(ConnectionRoster, {constructor:function(cache) {
    DialogsCache.superclass.constructor.apply(this, arguments);
    this.updateEvent = new U.Event;
    this.data = {dialogs:[]};
    this.dm = null;
    this._sync = WA.Synchronizer.registerComponent("dialogs", ["data"], true, true);
    FM.focusEvent.on(this._onFocus, this)
  }, activate:function(cb, scope) {
    this._sync.read(function(data) {
      this._onSync(data);
      this._sync.triggerEvent.on(this._onSync, this);
      cb && cb.call(scope || window)
    }, this)
  }, deactivate:function() {
    this._sync.triggerEvent.un(this._onSync, this);
    if(this.dm) {
      this.dm.clearHistory();
      this.dm.destroy();
      this.dm = null
    }
    this.data = {dialogs:[]}
  }, _onFocus:function() {
    this._sync.read(this._onSyncRead, this)
  }, _isSyncChanged:function(data) {
    if(data.isChanged("data")) {
      var d = JSON.parse(data.get("data") || "null");
      if(d && d.modifDate && this.data.modifDate != d.modifDate) {
        return d
      }
    }
  }, _onSyncRead:function(data) {
    data = this._isSyncChanged(data);
    if(data) {
      if(this.dm) {
        this.dm.destroy();
        this.dm = null
      }
      this.data = data
    }
    if(!this.dm) {
      this.dm = new DialogsManager(this)
    }
    if(data) {
      this.updateEvent.fire(this.data, 1)
    }
  }, _onSync:function(data) {
    data = this._isSyncChanged(data);
    if(data) {
      if(this.dm) {
        this.dm.destroy();
        this.dm = null
      }
      this.data = data;
      this.updateEvent.fire(this.data, 1)
    }
  }, _onBeforeConnectionResponse:function() {
    this._preventCommit = 1
  }, _onAfterConnectionResponse:function() {
    delete this._preventCommit;
    if(this._uncommitted) {
      this.commit()
    }
  }, preventCommit:function() {
    this._preventCommit = true
  }, permitCommit:function() {
    this._preventCommit = false;
    if(this._uncommitted) {
      this.commit()
    }
  }, commit:function() {
    if(!this._preventCommit) {
      this.data.modifDate = +new Date;
      delete this._uncommitted;
      this._preventCommit = 1;
      this.updateEvent.fire(this.data);
      if(this._uncommitted) {
        this.updateEvent.fire(this.data)
      }
      delete this._preventCommit;
      if(!this.data || !this.data.dialogs || !this.data.dialogs.length) {
        WA.debug.Console.log("WARNING!!!, writing empty dialogs list ", this.data)
      }
      this._sync.write("data", JSON.stringify(this.data))
    }else {
      this._uncommitted = 1
    }
  }});
  WA.DialogsAbstraction = WA.extend(ConnectionRoster, {constructor:function() {
    WA.DialogsAbstraction.superclass.constructor.apply(this, arguments);
    this._cache = new DialogsCache;
    this.updateEvent = (new U.Event).relay(this._cache.updateEvent);
    this.incomingMessageEvent = new U.Event;
    this.updateSelfNickEvent = new U.Event;
    this.updateActivityEvent = new U.Event;
    WA.Storage.whenReady(function() {
      WA.Storage.load(["selfnick"], {success:function(storage) {
        if(storage["selfnick"]) {
          WA.DialogsAbstraction.nick = storage["selfnick"];
          this.updateSelfNickEvent.fire(storage["selfnick"])
        }
      }, scope:this})
    }, this)
  }, activate:function(cb, scope) {
    this._cache.activate(cb, scope)
  }, deactivate:function() {
    this._cache.deactivate()
  }, _onConnectionContactStatus:function(value) {
    var dialog = this._cache.dm.getIfExist(value.email);
    if(dialog) {
      dialog.setCast(value.nickname, value.status.type, value.status.title, value.features, value.phones)
    }
  }, _onConnectionContactMicblogStatus:function(value) {
    var dialog = this._cache.dm.getIfExist(value.from);
    if(dialog) {
      dialog.getHistory().append(new MicblogMessage(value))
    }
  }, _onConnectionTypingNotify:function(value) {
    var dialog = this._cache.dm.getIfExist(value.from);
    if(dialog) {
      dialog.setTyping()
    }
  }, _onConnectionAuthRequest:function(value) {
    var email = value.from;
    var message;
    if(WA.MainAgent.isChat(email)) {
      message = new IncomingMessage(value);
      WA.ChangeLog.logAction("add", {email:message.data.from, nickname:message.data.nick || email, status:{type:"online"}})
    }else {
      message = new AuthMessage(value)
    }
    this._onConnectionMessage(message)
  }, _onConnectionMessage:function(value) {
    var message = null;
    if(value instanceof IncomingMessage) {
      message = value
    }else {
      message = new IncomingMessage(value)
    }
    if(!message.data.from) {
      return
    }
    var dialog = this._cache.dm.get(message.data.from, true);
    dialog.setCast(message.data.nick, message.data.status, message.data.statusTitle, message.data.features, message.data.phones);
    dialog.stopTyping();
    dialog.getHistory().append(message);
    this._messageArrived = true;
    var clistData = this._extractClistData(dialog);
    this.updateActivityEvent.fire(clistData, "new_message")
  }, _onConnectionSms:function(value) {
    var msg = new WA.IncomingSMS(value);
    this._onConnectionMessage(msg)
  }, _onConnectionSmsDeliveryStatus:function(value) {
    U.Mnt.log({reason:"sms_udelivery", message:"tel: " + (this.__smsLastNumber || "") + ", " + value.text});
    delete this.__smsLastNumber;
    U.Mnt.countRB(980046);
    U.Mnt.countRB(979807);
    value.from = SA.getByTel(value.tel).mail || value.from;
    this._onConnectionMessage(value)
  }, _onConnectionWp:function(value) {
    if(value.uniq && value.uniq == this._selfWPUniq && value.result) {
      var index = U.Array.indexOfBy(value.result, function(v) {
        if(v.email == WA.ACTIVE_MAIL) {
          return true
        }
      }, this);
      if(index != -1) {
        var nick = WA.MainAgent.WP2Nick(value.result[index]);
        WA.DialogsAbstraction.nick = nick;
        WA.Storage.save({"selfnick":nick});
        if(!this._cache.dm) {
          U.Mnt.log({reason:"breaklog", text:"updateSelfNick2 fail: focused=" + WA.FocusManager.focused + " focusing=" + WA.FocusManager.focusing + " winfocus=" + WA.WindowFocus.focus})
        }else {
          this._cache.dm.updateSelfNick(nick)
        }
        this.updateSelfNickEvent.fire(nick)
      }
    }
  }, _onConnectionUserInfo:function(value) {
    WA.DialogsAbstraction.nick = value["Mrim.NickName"];
    this._selfWPUniq = Math.round(Math.random() * 99999999);
    WA.conn.Socket.send("wp", {email:WA.ACTIVE_MAIL, uniq:this._selfWPUniq})
  }, _onAfterConnectionResponse:function() {
    if(this._messageArrived) {
      delete this._messageArrived;
      this.incomingMessageEvent.fire()
    }
  }, postMessage:function(mail, text, resend, flash) {
    var dialog = this._cache.dm.get(mail);
    var message = new OutgoingMessage({text:text, mail:mail, resend:!!resend, flash:!!flash});
    dialog.getHistory().append(message);
    message.send()
  }, postSms:function(mail, tel, text) {
    this.__smsLastNumber = tel;
    var dialog = this._cache.dm.get(mail);
    var message = new WA.OutgoingSMS({text:text, mail:mail, tel:tel});
    dialog.getHistory().append(message);
    message.send();
    var clistData = this._extractClistData(dialog);
    this.updateActivityEvent.fire(clistData)
  }, addServiceMessage:function(email, title, text) {
    var now = WA.now();
    var dialog = this._cache.dm.getIfExist(email);
    if(dialog) {
      dialog.getHistory().append(new ServiceMessage({from:email, title:title, text:text, date:now}))
    }
  }, updateHeight:function() {
  }, markAsReaded:function(mail) {
    var dialog, mail, clistData;
    if(this._cache.dm) {
      if(mail) {
        dialog = this._cache.dm.getIfExist(mail)
      }else {
        dialog = this._cache.dm.getFocused()
      }
      if(dialog) {
        WA.ContactStates.saveUnread(dialog.data.mail, 0);
        WA.ContactStates.removeState(dialog.data.mail, WA.ContactStates.MESSAGE_STATE);
        clistData = this._extractClistData(dialog);
        this.updateActivityEvent.fire(clistData, "read_message");
        dialog.markAsReaded()
      }
    }
  }, makeAuthorized:function() {
    var dialog = this._cache.dm.getFocused();
    dialog.makeAuthorized()
  }, loadHistoryPart:function() {
    var dialog = this._cache.dm && this._cache.dm.getFocused();
    if(dialog && dialog.data.history) {
      dialog.history.load(dialog.history._getSideArchId())
    }
  }, focus:function(mail) {
    var dialog = this._cache.dm.get(mail);
    dialog.focus()
  }, calling:function(mail) {
    var dialog = this._cache.dm.get(mail);
    dialog.calling()
  }, endCall:function() {
    if(this._cache.dm) {
      this._cache.dm.endCall()
    }
  }, blur:function() {
    if(this._cache.dm) {
      this._cache.dm.blur()
    }
  }, closeAll:function() {
    var dm = this._cache.dm;
    var emails = [];
    dm.eachDialog(function(dialog, mail) {
      if(dialog.unreaded) {
        emails.push(mail)
      }
    }, this);
    WA.ContactStates.removeStates(emails, WA.ContactStates.MESSAGE_STATE);
    dm.closeAll()
  }, close:function(mail) {
    this._cache.dm.close(mail);
    WA.ContactStates.saveUnread(mail, 0);
    WA.ContactStates.removeState(mail, WA.ContactStates.MESSAGE_STATE)
  }, open:function(mail, nick, status, statusTitle, features, phones) {
    this._cache.preventCommit();
    var dialog = this._cache.dm.get(mail);
    dialog.setCast(nick || mail, status, statusTitle, features, phones);
    dialog.focus();
    this._cache.permitCommit()
  }, _extractDataFromDialog:function(dlg) {
    var mail = dlg.data.mail;
    var cast = dlg.data.cast[mail];
    return{mail:mail, nick:cast.nick, status:cast.status || "", statusTitle:cast.statusTitle || "", phones:U.Array.clone(cast.phones || []), unreaded:dlg.data.unreaded}
  }, _extractClistData:function(dlg) {
    var mail = dlg.data.mail;
    var cast = dlg.data.cast[mail];
    var data = [mail, cast.nick, +(cast.status == "gray"), cast.status || "", cast.statusTitle || "", U.Array.clone(cast.phones || []), cast.features];
    return data
  }, getFocused:function() {
    if(!this._cache.dm) {
      return false
    }
    var dlg = this._cache.dm.getFocused();
    if(dlg) {
      return this._extractDataFromDialog(dlg)
    }else {
      return false
    }
  }, getOpenDialogs:function() {
    if(this._cache.dm) {
      return this._cache.dm.getOpenDialogs()
    }
    return[]
  }, isFirst:function(mail) {
    return this._cache.dm && this._cache.dm.isFirst(mail)
  }, renameContact:function(mail, newNick) {
    var dlg = this._cache.dm.getIfExist(mail);
    if(dlg) {
      var data = this._extractDataFromDialog(dlg);
      dlg.setCast(newNick, data.status, data.statusTitle, data.features, data.phones)
    }
  }, getDialogCount:function() {
    return this._cache.dm.count()
  }});
  WA.DialogsAbstraction.nick = WA.ACTIVE_MAIL
})();
(function() {
  var WA = WebAgent, U = WA.util, UI = WA.ui, SOCK = WA.conn.Socket;
  var IMAGE_URL = "//img.imgsmail.ru/r/webagent/images";
  var TextArea = WA.extend(WA.ui.Component, {constructor:function(config) {
    TextArea.superclass.constructor.apply(this, arguments);
    this.changeEvent = new U.Event;
    this.submitEvent = new U.Event;
    this.expandEvent = new U.Event;
    this._field = null;
    this._hintText = WA.tr("dialog.typeMessage");
    this._hintClass = "nwa_hint_msg";
    this.expanded = false;
    this.expandedWidth = 0;
    this.postMaxLength = 9E3;
    this._ctrlDate = 0;
    this._textChecker = new U.DelayedTask({interval:300, fn:function() {
      var domEl = this._field.getEl().dom, _fieldVal = this._field.textVal(), parentWidth;
      if(this._value != _fieldVal) {
        this._value = _fieldVal;
        var encodedValue = encodeURIComponent(this._value), encodedValueLength = encodedValue.length, valueLength = this._value.length;
        if(encodedValueLength > this.postMaxLength) {
          this._value = decodeURIComponent(encodedValue.substr(0, this.postMaxLength).replace(/\%[\dA-F]?$/i, ""));
          if(this._field instanceof UI.SmilesTextField) {
            this._value = this._value.replace(/(\<[^>]*$)|(<SMILE>[^<]*(<[\/\w]*)?)$/i, function(matched) {
              var ret;
              if(matched.indexOf("<") >= 0 && matched.indexOf("</SMILE>") == -1) {
                ret = ""
              }else {
                ret = matched
              }
              return ret
            });
            this._value = WA.DialogsAgentView.prepareMessageText(this._value, true)
          }
          this._field.val(this._value);
          if(!this._alert) {
            this._alert = new WA.DialogsAgent.AlertDialog({fadeIn:true, modal:true, autoRender:this.container})
          }
          this._alert.show(WA.tr("msgTooLongAndCut"))
        }
        if(this._value != "\n") {
          this.changeEvent.fire(this._value)
        }
        var expanded = domEl.scrollHeight > 25;
        if(TextArea.ghostField) {
          TextArea.ghostField.getEl().setWidth(this._field.getEl().parent().getWidth());
          TextArea.ghostField.val(this._value + "w");
          expanded = TextArea.ghostField.getEl().dom.scrollHeight > 25
        }
        if(this._value == "\n") {
          expanded = false
        }
        if(this.expanded != expanded) {
          this.expanded = expanded;
          this.expandEvent.fire(expanded)
        }
      }
      if(this._field instanceof UI.SmilesTextField) {
        if(WA.isFF) {
          if(this.expandedWidth == 0 && domEl.offsetWidth > domEl.scrollWidth) {
            this.expandedWidth = domEl.offsetWidth - domEl.scrollWidth
          }else {
            if(this.expandedWidth > 0 && domEl.offsetWidth == domEl.scrollWidth) {
              this.expandedWidth = 0
            }
          }
          parentWidth = this._field.getEl().parent().getWidth();
          this._field.getEl().setWidth(parentWidth + this.expandedWidth)
        }
      }
      this._textChecker.start()
    }, scope:this})
  }, _onRender:function(ct) {
    this.el = ct.createChild({tag:"div", cls:"nwa-chat__input", children:{tag:"div", cls:"nwa-chat__input-inner", children:{tag:"div", cls:"nwa-chat__input-wrap"}}});
    var submitEl = new WA.ui.Button({cls:"nwa-chat__input-send", handler:function(el, ev) {
      this._submit(ev)
    }, scope:this, tooltip:WA.tr("dialog.send"), text:"<span></span>"});
    submitEl.render(this.el.first());
    var smilesMenu = new WA.DialogsAgent.Smiles;
    smilesMenu.itemClickEvent.on(function(ignored, item, ev) {
      ev.stopEvent();
      this.addSmile(item.initialConfig)
    }, this);
    var smilesBtn = new WA.ui.Button({cls:"nwa-chat__input-smiles", tooltip:WA.tr("dialog.smiles"), menu:smilesMenu, text:"<span></span>"});
    smilesBtn.render(this.el.first());
    this._field = new WA.ui.SmilesTextField({cls:"nwa-chat__input-field", multiline:true, maxLength:this.postMaxLength, hintText:this._hintText, hintClass:this._hintClass, rich:true});
    this._field.render(this.el.first().first());
    this._field.getEl().on("keydown", function(ev) {
      if(!ev.shiftKey && ev.keyCode == 13) {
        this._submit(ev);
        ev.stopEvent()
      }
    }, this);
    this._field.focusEvent.on(function() {
      WA.UserAttend.onActivity()
    });
    if(!TextArea.ghostField) {
      TextArea.ghostField = new WA.ui.TextField({cls:"nwa-chat__input-field nwa-input_ghost", multiline:true});
      TextArea.ghostField.render(WA.getBody())
    }
    this._textChecker.start()
  }, _onKeyUp:function(ev) {
    var now = +new Date;
    if(ev.browserEvent.ctrlKey) {
      this._ctrlDate = now
    }
    if(now - this._ctrlDate < 400 && ev.keyCode == 13) {
      this._submit(ev)
    }
  }, _submit:function(ev) {
    var val = this._field.textVal();
    if(val.match(/\S/)) {
      if(this.submitEvent.fire(val)) {
        var start = +new Date;
        this._field.val("", true);
        this._field.focus()
      }else {
        ev.stopEvent()
      }
      U.Mnt.rbCountAction();
      U.Mnt.rbCountSubmitDomain();
      U.Mnt.countRB(1349355)
    }
  }, set:function(str) {
    this._field.val(str);
    this._value = str
  }, _safeSetFocus:function() {
    this._field.focus()
  }, setFocus:function(deferred) {
    if(!deferred) {
      this._safeSetFocus()
    }else {
      WA.setTimeout(WA.createDelegate(function() {
        this._safeSetFocus()
      }, this), 10)
    }
    this._textChecker.start()
  }, addSmile:function(smile) {
    (new U.DelayedTask({fn:function() {
      this._field._onFocus();
      if(this._field instanceof WebAgent.ui.SmilesTextField) {
        this._field.focus(true)
      }else {
        this.setFocus()
      }
      var value, code = smile.alt, sel = U.Selection.getSelection(), range, smileNode;
      value = WA.DialogsAgent.Smiles.processText(code);
      value = WA.DialogsAgent.Smiles.processMessage(value);
      smileNode = WA.util.DomHelper.elementFromHtml(value);
      smileNode.setAttribute("data-immutable", true);
      this._field.focus();
      if(WA.isOpera && this._field.el.dom.innerHTML == "<br>") {
        this._field.el.dom.innerHTML = ""
      }
      WA.DialogsAgent.Smiles.insertSmile(smileNode);
      this._field._saveCaretPosition();
      if(!this._field instanceof WebAgent.ui.SmilesTextField) {
        this._field._onKeyup();
        this._field._onKeyup();
        this._field._onKeyup()
      }else {
        if(WA.isFF) {
          (new U.DelayedTask({fn:function() {
          }, interval:100})).start()
        }
        this._field.checkScroll()
      }
    }, scope:this, interval:10})).start()
  }, deactivate:function() {
    this._textChecker.stop()
  }});
  var History = WA.extend(WA.ui.Component, {constructor:function() {
    History.superclass.constructor.apply(this, arguments);
    this._previews = {};
    this.incomingFlashEvent = new U.Event;
    this.topScrolledEvent = new U.Event
  }, _onRender:function(ct) {
    this.el = ct.createChild({tag:"div", cls:"nwa-chat__history", children:[{tag:"div", cls:"nwa-history"}]});
    this.contsRootEl = this.el.first();
    this.scrollBar = new WA.ui.ScrollBar({source:this.contsRootEl, watchResize:WA.isPopup, autoRender:this.el})
  }, _groupingKey:"", _groupingDate:0, _renderMessage:function(m, cast, showAuthDialog) {
    var nick = cast[m.from] && cast[m.from].nick || m.from;
    var message = m.text || "";
    var messageClass = "nwa-message";
    var messageDate = U.String.formatDate(m.date * 1E3);
    var useGroup = false;
    var tmp;
    var micblog = !!m.micblog;
    var hidePreviews = this._hidePreviews;
    var sms = !!m.tel;
    var isIncoming = m.from != WA.ACTIVE_MAIL;
    if(isIncoming && m.from.indexOf("@chat.agent") != -1 && WA.MainAgent.isChat(m.from) && (tmp = m.text.match(/([^@\n]+@[^@\n]+):\n([\s\S]*)/))) {
      nick = tmp[1];
      message = tmp[2]
    }
    var groupingKey = m.from + nick;
    if(micblog || m.voip) {
      m.unreaded = false;
      if(message == "") {
        return""
      }
      this._groupingKey = ""
    }else {
      if(this._groupingKey == groupingKey && m.date - this._groupingDate < 60) {
        useGroup = true;
        this._groupingDate = m.date
      }else {
        this._groupingKey = groupingKey
      }
    }
    if(!sms || !micblog) {
      this._groupingDate = m.date
    }else {
      this._groupingDate = 0
    }
    var msgFrom = U.String.htmlEntity(nick) + (micblog ? " " + WA.tr("dialog.tellsFriends") : "");
    if(sms) {
      msgFrom = WA.tr(isIncoming ? "dialog.smsFrom" : "dialog.smsTo", {tel:m.tel})
    }
    var messageText = WA.DialogsAgentView.prepareMessageText(message, false, hidePreviews || micblog || WA.createDelegate(function(url, success, img) {
      if(success) {
        var links = this.contsRootEl.dom.getElementsByTagName("a");
        var l = links.length;
        if(!l) {
          var thf = arguments.callee;
          return WA.setTimeout(function() {
            thf.call(this, url, success, img)
          }, 1, this)
        }
        var h = img.height > img.width && img.height > this.contsRootEl.getHeight() - 34 && this.contsRootEl.getHeight() - 34;
        var imgstyle = "margin:0;paddong:0;border:0px solid;max-width:100%;";
        img.removeAttribute("width");
        img.removeAttribute("height");
        img.style.cssText = imgstyle + (h ? "height:" + h + "px;" : "");
        while(l--) {
          if(!links[l].getAttribute("notimage") && (links[l].textContent ? links[l].textContent == url : links[l].innerText == url)) {
            var scroll = this._getScroll();
            links[l].innerHTML = "";
            links[l].appendChild(img);
            this._previews[url] = '<img src="' + img.src + '" style="' + imgstyle + "height:" + links[l].firstChild.offsetHeight + 'px;" />';
            this._setScroll(scroll + (scroll > 0 && links[l].offsetTop < scroll ? links[l].firstChild.offsetHeight : 0))
          }
        }
      }else {
        this._previews[url] = false
      }
    }, this), this._previews);
    if(m.voip) {
      msgFrom = "&nbsp;";
      messageText = m.text;
      messageClass += " nwa-message_service";
      messageDate = m.title + " " + messageDate
    }
    if(isIncoming) {
      this._lastMessage = m
    }
    if(m.unreaded && !micblog && isIncoming) {
      messageClass += " nwa-message-unread"
    }
    if(micblog) {
      messageClass += " nwa-message_micblog";
      messageText = '<div class="nwa-message__text"><div class="nwa-message__text-wrap">' + messageText + "</div></div>";
      messageDate = '<a href="javascript:;" data-action="reply_micblog" data-post-id="' + m.message_id + '" class="nwa-button_link">' + WA.tr("dialog.reply") + "</a>"
    }else {
      if(useGroup) {
        messageClass += " nwa-message-group"
      }
    }
    if(!isIncoming) {
      messageClass += " nwa-message_self"
    }
    if(showAuthDialog) {
      messageClass += " nwa-message_auth";
      messageText += this._renderAuthMessage(m)
    }
    if(sms) {
      messageClass += " nwa-message_sms"
    }
    if(m.deliverExpired) {
      messageText += '<br/><span class="nwa-message__deliver"> ' + WA.tr("dialog.sendingFailed") + " </span>" + '<a href="javascript:;" data-action="resend" data-flash="' + (m.flashCode || "") + '" data-msg-id="' + m.message_id + '" data-text="' + U.String.htmlEntity(message) + '" class="nwa-button_link">' + WA.tr("dialog.resend") + "</a>"
    }
    return U.String.format('<div class="{4}"><div class="nwa-message__date"><span>{0}&nbsp;</span></div><div class="nwa-message__from">{1}<br/></div>{2}<br/></div>', messageDate, msgFrom, messageText, WA.isDebug && 0 ? "" + Math.round(128 + Math.random() * 100).toString(16).substr(-2, 2) + Math.round(128 + Math.random() * 100).toString(16).substr(-2, 2) + Math.round(128 + Math.random() * 100).toString(16).substr(-2, 2) : "ffffff", messageClass)
  }, _renderPreloader:function() {
    this.contsRootEl.update('<span class="nwa-message__info">' + WA.tr("dialog.loading") + "</span>")
  }, _renderEmpty:function() {
    this.contsRootEl.update('<span class="nwa-message__info">' + WA.tr("dialog.noMessages") + "</span>")
  }, _renderTel:function() {
    this.contsRootEl.update('<span class="nwa-message__info">' + WA.tr("dialog.smsOnlyContact") + '<br><a href="?" data-action="add-tel">' + WA.tr("dialog.tools.add") + "</a></span>")
  }, _renderAuthMessage:function(msg) {
    var html = "", actions = [["add", WA.tr("dialog.grantContactAuth"), "nwa-button nwa-button_blue"], ["cancel", WA.tr("dialog.decline"), "nwa-button_link"], ["ignore", WA.tr("dialog.ignore"), "nwa-button_link"], ["spam", WA.tr("dialog.spam"), "nwa-button_link"]];
    U.Array.each(actions, function(action) {
      html += U.String.format('<button href="javascript:;" data-action="{0}" data-msg-id="{3}" data-text="{4}" class="nwa-message__actions_{0} {2}">{1}</button>', action[0], action[1], action[2], msg.message_id, U.String.htmlEntity(msg.text || ""))
    }, this);
    return'<div class="nwa-message__actions">' + html + "</div>"
  }, _renderMessages:function(dialog) {
    var html = [], auth = false, incomingFlash = null;
    this._groupingKey = "";
    this._groupingDate = 0;
    if(dialog.isTel) {
      html.push('<span class="nwa-message__info">' + WA.tr("dialog.smsOnlyContact") + '<br><a href="?" data-action="add-tel">' + WA.tr("dialog.tools.add") + '</a></span><br><span class="nwa-message__info">' + WA.tr("dialog.smsArchive") + "</span>")
    }
    if(dialog.historyDisabled) {
      html.push('<span class="nwa-message__info">' + WA.tr("msgServerHistory") + "</span>")
    }
    U.Array.each(dialog.history, function(message) {
      html[html.length] = this._renderMessage(message, dialog.cast, !auth && message.auth);
      if(!auth) {
        auth = message.auth
      }
      if(message.from != WA.ACTIVE_MAIL && !message.micblog && message.unreaded) {
        incomingFlash = WA.DialogsAgent.Smiles.getLastFlash() || incomingFlash
      }
    }, this);
    html = html.join("");
    if(dialog.historyLoaded !== true) {
      html = '<div  class="nwa-message__info">' + WA.tr("msgHistoryLoading") + "</div>" + html
    }else {
      this._noMoreHistoryFlag = true
    }
    this.contsRootEl.update(html);
    this.contsRootEl.toggleClass("nwa-chat__history_unread", dialog.unreadCount > 0);
    if(incomingFlash) {
      this.incomingFlashEvent.fire(incomingFlash)
    }
  }, _renderHistory:function(dialog, scrollBottomAnyway) {
    var scrollTop = -1;
    var h = this.contsRootEl.dom.scrollHeight;
    this.scrollBar.pauseDrag();
    if(!scrollBottomAnyway) {
      scrollTop = this._getScroll()
    }
    var scrollBottom = h - this.contsRootEl.dom.clientHeight - this._getScroll();
    this.contsRootEl.hide();
    if(!dialog || !dialog.history) {
      this._renderPreloader()
    }else {
      if(dialog.history.length == 0 && dialog.isTel && !dialog.historyDisabled) {
        this._renderTel()
      }else {
        if(dialog.history.length == 0 && !dialog.historyDisabled) {
          this._renderEmpty()
        }else {
          this._renderMessages(dialog)
        }
      }
    }
    this.contsRootEl.show();
    if(dialog && dialog.notscroll && (scrollTop = this._getScroll()) > -1) {
      this._setScroll(this.contsRootEl.dom.scrollHeight - this.contsRootEl.dom.clientHeight - scrollBottom)
    }else {
      this._setScroll(scrollTop)
    }
    this.scrollBar.resumeDrag();
    if(dialog) {
      delete dialog.notscroll
    }
  }, _scrollCheck:function() {
    if(this._scrollCheckTimer) {
      return
    }
    this._scrollCheckTimer = WA.setTimeout(function() {
      this._scrollCheckTimer = false;
      if(!this._uniq || this._blured) {
        return
      }
      if(this._getScroll() > -1 && !this._firstScrollFlag) {
        U.Mnt.countRB(1622999);
        this._firstScrollFlag = true
      }
      if(this.contsRootEl.dom.scrollHeight == this.contsRootEl.dom.offsetHeight || this._getScroll() > -1 && this._getScroll() < 200 && (this._noMoreHistoryFlag || U.Mnt.countRB(1623E3) || true)) {
        this.topScrolledEvent.fire()
      }else {
        this._scrollCheck()
      }
    }, 200, this)
  }, _markRead:function() {
    if(this.contsRootEl.hasClass("nwa-chat__history_unread")) {
      var lastEl = this.contsRootEl.last();
      while(lastEl) {
        lastEl = lastEl.removeClass("nwa-message-unread").prev()
      }
      this.contsRootEl.removeClass("nwa-chat__history_unread")
    }
  }, _setScroll:function(h) {
    if(this.contsRootEl.dom.children.length) {
      if(h == -1) {
        this.contsRootEl.dom.scrollTop = this.contsRootEl.dom.scrollHeight
      }else {
        this.contsRootEl.dom.scrollTop = h
      }
    }
    this._refreshScroll()
  }, _refreshScroll:function() {
    this.scrollBar.sync();
    WA.setTimeout(WA.createDelegate(this.scrollBar.sync, this.scrollBar), 400)
  }, _getScroll:function() {
    var e = this.contsRootEl.dom;
    if(e.scrollTop + e.clientHeight == e.scrollHeight) {
      return-1
    }else {
      return e.scrollTop
    }
  }, scrollBottom:function() {
    this._setScroll(-1)
  }, renderHistory:function(dialog, needRedraw, cb, scope) {
    var uniq = dialog.mail + dialog.modifDate;
    if(this._uniq != uniq || needRedraw) {
      this._renderHistory(dialog, true);
      this._uniq = uniq
    }else {
      if(dialog.unreadCount === 0) {
        this._markRead()
      }
    }
    this._scrollCheck()
  }, getLastMessage:function() {
    return this._lastMessage || {}
  }, deactivate:function() {
    delete this._uniq
  }, setTopPadding:function(h) {
    this.el.dom.style.top = h + "px"
  }});
  var DialogInfoBubble = WA.extend(WA.ui.Component, {constructor:function() {
    DialogInfoBubble.superclass.constructor.apply(this, arguments);
    this.visibleClass = "nwa-chat__infobubble_vis"
  }, _onRender:function(ct) {
    this.el = ct.createChild({cls:"nwa-chat__infobubble", children:[{cls:"nwa-chat__infobubble-wrap"}, {cls:"nwa-window__close", "data-action":"closebubble"}, {cls:"nwa-chat__infobubble-icon"}]});
    this.el.on("click", function(e) {
      var target = e.getTarget(true);
      if(target.getAttribute("data-action") === "closebubble") {
        this.hide()
      }
    }, this)
  }, show:function(params) {
    if(!this.rendered && this.autoRender !== false) {
      this.render(WA.isBoolean(this.autoRender) ? WA.getBody() : this.autoRender)
    }
    params = U.Object.extend({autoHide:true, msg:"", icon:""}, params || {});
    if(params.icon) {
      this.el.dom.className = "nwa-chat__infobubble nwa-chat__infobubble-" + params.icon
    }
    this.el.first().update(params.msg);
    this.setVisible(true);
    if(this._autoHideTimer) {
      clearTimeout(this._autoHideTimer)
    }
    if(params.autoHide) {
      this._autoHideTimer = WA.setTimeout(this.hide, 4E3, this)
    }
    return this
  }, isVisible:function() {
    return this.el && this.el.hasClass(this.visibleClass)
  }, setVisible:function(visible) {
    if(visible) {
      this.el.addClass(this.visibleClass)
    }else {
      clearTimeout(this._autoHideTimer);
      this.el.removeClass(this.visibleClass)
    }
    return this
  }, destroy:function() {
    if(this._autoHideTimer) {
      clearTimeout(this._autoHideTimer)
    }
    DialogInfoBubble.superclass.destroy.apply(this, arguments)
  }});
  var DialogView = WA.extend(WA.ui.Component, {constructor:function(config, dialog) {
    DialogView.superclass.constructor.call(this, config);
    this.mail = dialog.mail;
    this.nick = dialog.cast[dialog.mail].nick;
    this._typingInfo = false;
    this._previewPhoto = null;
    this._incomingFlash = null;
    this.features = parseInt(dialog.cast[dialog.mail].features || WA.SA.get(this.mail).features || 0);
    this.messageEvent = new U.Event;
    this.typingEvent = new U.Event;
    this.unreadedEvent = new U.Event;
    this.authActionEvent = new U.Event;
    this.flashEvent = new U.Event;
    this.openAddSearchEvent = new U.Event;
    this.outCallEvent = new U.Event;
    this.contactSelectEvent = new U.Event;
    this.minimizeEvent = new U.Event;
    this.updateActivityEvent = new U.Event;
    this._textarea = new TextArea;
    this._textarea.changeEvent.on(this._onMessageChanged, this);
    this._textarea.expandEvent.on(this._onMessageExpand, this);
    this._textarea.submitEvent.on(this._onMessageSubmit, this);
    this._nameBox = new UI.NameBox;
    this._nameBox.editOk.on(function(newName) {
      this.renameContactEvent.fire(this.mail, newName)
    }, this);
    this.typingNotifyChecker = new U.DelayedTask({interval:1E4, fn:this._onTypingNotifyCheck, scope:this});
    this.tabButton = new WA.ui.TabButton({closable:true, fader:true, defaultIconCls:WA.buildIconClass("default"), tabAttributes:{mail:dialog.mail}});
    this._history = new History;
    this._history.incomingFlashEvent.on(function(incomingFlash) {
      if(WA.WindowFocus.focus) {
        WA.UserAttend.forceActivity();
        this._incomingFlash = null;
        this._previewFlash(incomingFlash)
      }
    }, this);
    this.topScrolledEvent = (new U.Event).relay(this._history.topScrolledEvent);
    this.removeContactEvent = new U.Event;
    this.renameContactEvent = new U.Event;
    this._profile = new WA.Profile(false, {fadeIn:true, modal:true});
    this._smsDialog = new WA.SMSDialog({fadeIn:true, modal:true, hideOnEscape:true});
    this._smsDialog.openDialogEvent.on(this._openContact, this);
    this.requestListEvent = (new U.Event).relay(this._smsDialog.requestListEvent);
    this.sendSmsEvent = (new U.Event).relay(this._smsDialog.sendSmsEvent);
    this.addContactEvent = (new U.Event).relay(this._smsDialog.addContactEvent);
    this.callPanel = new WA.VoipView.VoiceCallPanel;
    this.callTab = new WA.VoipView.CallTab;
    this._initActionMenuItems()
  }, _openContact:function(mail, nick, status, statusTitle, features) {
    features = features || WA.SA.get(mail).features || 0;
    this.contactSelectEvent.fire(mail, nick || mail, status, statusTitle, features)
  }, _historyClick:function(e) {
    var target = e.getTarget(true);
    if(target.getAttribute("data-action") === "add-tel") {
      this.openAddSearchEvent.fire();
      e.stopEvent()
    }else {
      if(target.getAttribute("data-action") === "preview") {
        var swf = target.getAttribute("data-flash");
        this._previewFlash(swf)
      }
    }
  }, updateTabInfo:function(dialog) {
    var info = this.fetchDialogInfo(dialog);
    this.el.setAttribute("status", info.status);
    this.tabButton.setText(info.nick);
    this.tabButton.getEl().toggleClass("nwa-button-tab_offline", info.status == "offline");
    this.tabButton.getEl().toggleClass("nwa-button-tab_message", info.status == "message");
    this.tabButton.getEl().toggleClass("nwa-button-tab_unread", info.unread > 0);
    this.tabButton.setIconCls(WA.buildIconClass(info.status));
    this.tabButton.setTitle(info.statusTitle);
    this.tabButton.setCount(info.unread)
  }, fetchDialogInfo:function(dialog) {
    var mail = dialog.mail;
    var isChat = WA.MainAgent.isChat(mail);
    var statusTitle = dialog.auth && "auth" || isChat && "chat" || dialog.cast[mail].statusTitle || dialog.cast[mail].status && dialog.cast[mail].status.replace(/^icq_/, "") || "gray";
    this.nick = dialog.cast[mail].nick;
    return{nick:U.String.htmlEntity(dialog.cast[mail].nick), status:dialog.typing && "typing" || dialog.unreaded && "message" || dialog.auth && "auth" || isChat && "chat" || dialog.cast[mail].status || "gray", statusTitle:WA.MainAgent.statuses[statusTitle] || statusTitle, features:dialog.cast[mail].features, unread:dialog.unreadCount}
  }, updateWindow:function(dialog, needRedraw) {
    var info = this.fetchDialogInfo(dialog);
    this.features = info.features;
    this._updateButtonBar(info);
    this.statusField.first().setAttribute("title", U.String.htmlEntity(info.statusTitle));
    this._nameBox.setName(this.nick);
    this.statusField.first().dom.className = WA.buildIconClass(info.status, true);
    this.status = info.status;
    this._history.renderHistory(dialog, needRedraw)
  }, _ignoreUser:function() {
    if(!this._ignoreDialog) {
      this._ignoreDialog = new WA.DialogsAgent.RemoveContactDialog({autoRender:this.winEl, okButton:WA.tr("box.ignore")});
      this._ignoreDialog.okEvent.on(function() {
        this.authActionEvent.fire({mail:this.mail, action:"ignore"})
      }, this)
    }
    this._ignoreDialog.show(WA.tr("box.ignoreUser", {nick:U.String.htmlEntity(this.nick)}))
  }, _spamUserConfirm:function() {
    if(!this._spamDialog) {
      this._spamDialog = new WA.DialogsAgent.RemoveContactDialog({autoRender:this.winEl, okButton:WA.tr("box.spamConfirm")});
      this._spamDialog.okEvent.on(this._spamUser, this)
    }
    this._spamDialog.show(WA.tr("box.spamUser", {nick:U.String.htmlEntity(this.nick)}))
  }, _spamUser:function() {
    var message = this._history.getLastMessage();
    this.authActionEvent.fire({mail:this.mail, action:"spam", msg_id:message.message_id || 0, text:message.text || ""})
  }, _openProfile:function() {
    this._profile.show(this.mail)
  }, _openMoymir:function() {
    var tmp = this.mail.split("@");
    var url = "http://my.mail.ru/" + tmp[1].split(".")[0] + "/" + tmp[0] + "/";
    window.open(url)
  }, _openPhotoPage:function() {
    var tmp = this.mail.split("@");
    var url = "http://photo.mail.ru/" + tmp[1].split(".")[0] + "/" + tmp[0] + "/";
    window.open(url)
  }, _openPhoto:function(e) {
    e.stopPropagation();
    if(this._previewPhoto == null) {
      this._previewPhoto = new WA.PhotoPreview({mail:this.mail, autoRender:this.winEl, fadeIn:true, modal:true})
    }
    this._previewPhoto.show()
  }, _showLimitAlert:function(msg) {
    if(!this._alert) {
      this._alert = new WA.DialogsAgent.AlertDialog({fadeIn:true, modal:true, autoRender:this.winEl})
    }
    this._alert.show(msg)
  }, _showRemoveDialog:function() {
    if(!this._removeDialog) {
      this._removeDialog = new WA.DialogsAgent.RemoveContactDialog({okButton:WA.tr("box.remove"), autoRender:this.winEl});
      this._removeDialog.okEvent.on(function() {
        this.removeContactEvent.fire(this.mail)
      }, this)
    }
    this._removeDialog.show(WA.tr("box.removeUser", {nick:U.String.htmlEntity(this.nick)}))
  }, _showAuthDialog:function(message) {
    var mail = message.from, nick = message.nick || WA.SA.get(mail).nick || mail;
    if(!this._authDialog) {
      this._authDialog = new WA.DialogsAgent.AuthContactDialog({autoRender:this.winEl});
      this._authDialog.okEvent.on(function(action) {
        this.authActionEvent.fire({mail:mail, action:action, nick:nick, msg_id:message.message_id, text:message.text})
      }, this)
    }
    this._authDialog.setMeta({mail:mail, nick:nick});
    this._authDialog.show()
  }, _showInfoBubble:function(msg, icon) {
    this._history.scrollBottom();
    if(!this.infoBubble) {
      this.infoBubble = new DialogInfoBubble({autoRender:this.winEl})
    }
    return this.infoBubble.show({msg:msg, icon:icon, autoHide:true})
  }, _showVoipMsg:function(code) {
    var icon = WA.Voip.infoIcons[code] || WA.Voip.infoIcons["error"];
    var msg = WA.Voip.infoMessages[code] || WA.Voip.infoMessages["unknown"];
    this._showInfoBubble(msg, icon)
  }, _onTypingNotifyCheck:function() {
    var now = +new Date;
    if(this._typingInfo && now - this._typingInfo.date < 9E3) {
      this.typingEvent.fire(this.mail);
      this.typingNotifyChecker.start()
    }else {
      this.typingNotifyChecker.stop()
    }
  }, _onMessageExpand:function(expanded) {
    this.expandTextField(expanded)
  }, _onMessageChanged:function(text) {
    if(text != "") {
      this._typingInfo = {date:+new Date, mail:this.mail};
      this.updateActivityEvent.fire(this.mail);
      if(!this.typingNotifyChecker.isStarted()) {
        this._onTypingNotifyCheck()
      }
    }
  }, _onMessageSubmit:function(text) {
    if(encodeURIComponent(text).length < 9E3) {
      if(this._call) {
        U.Mnt.countRB(this._call.videoCall ? 1379028 : 1216821)
      }
      this.expandTextField(false);
      this.messageEvent.fire(text);
      this.typingNotifyChecker.stop()
    }else {
      this._showLimitAlert();
      return false
    }
  }, focus:function(data) {
    this.renderWindow();
    this.el.addClass("nwa-dialog_expanded");
    if(WA.Voip.inTalk && this.mail != WA.Voip._call.phoneNumber) {
      U.Mnt.countRB(WA.Voip._call.videoCall ? 1379030 : 1216822)
    }
    if(this._call) {
      this.callTab.hide()
    }
    this._history._blured = false;
    this._history.scrollBottom();
    this._history._scrollCheck();
    this._typingInfo = false;
    this._textarea.setFocus(true)
  }, addSmile:function(smile) {
    if(this._textarea.rendered) {
      this._textarea.addSmile(smile)
    }
  }, _onRender:function(ct) {
    this.el = ct.createChild({tag:"div", cls:"nwa-dialog", id:"nwaDialog_" + this.mail, mail:this.mail});
    this.tabButton.render(this.el)
  }, blur:function() {
    if(this._removeDialog) {
      this._removeDialog.hide();
      this._removeDialog.destroy();
      this._removeDialog = null
    }
    if(this._alert) {
      this._alert.hide();
      this._alert.destroy();
      this._alert = null
    }
    this._textarea.deactivate();
    this.el.removeClass("nwa-dialog_expanded");
    this._history._blured = true;
    if(this._previewPhoto) {
      this._previewPhoto.hide()
    }
    if(this._swfPreview) {
      this._swfPreview.hide()
    }
    this._profile.hide();
    if(this._call && !this._call.videoCall) {
      this.callTab.show()
    }
  }, expandTextField:function(force) {
    this.el.toggleClass("nwa-chat_text_expanded", force !== false);
    WA.setTimeout(WA.createDelegate(this._history.scrollBottom, this._history), 200)
  }, _initActionMenuItems:function() {
    var langScope = {scope:"dialog.tools"};
    this._actionMenuItems = {spam:{iconCls:" ", text:WA.tr("spam", langScope), handler:this._spamUserConfirm, scope:this}, ignore:{iconCls:" ", text:WA.tr("ignore", langScope), handler:this._ignoreUser, scope:this}, rename:{iconCls:" ", text:WA.tr("rename", langScope), handler:this._nameBox.edit, scope:this._nameBox}, del:{iconCls:" ", text:WA.tr("remove", langScope), handler:this._showRemoveDialog, scope:this}, profile:{iconCls:"nwa-dialog__tools-profile", text:WA.tr("profile", langScope), handler:this._openProfile, 
    scope:this}, mir:{iconCls:"nwa-dialog__tools-moymir", text:WA.tr("moyMir", langScope), handler:this._openMoymir, scope:this}, foto:{iconCls:"nwa-dialog__tools-photo", text:WA.tr("photo", langScope), handler:this._openPhotoPage, scope:this}, separate:"-"}
  }, openSendSmsDialog:function() {
    this._smsDialog.setEmail(this.mail);
    this._smsDialog.show()
  }, incomingCall:function(callParams) {
    if(!WA.Voip.isCompatible) {
      this._showVoipMsg("flashRequiredIncoming");
      WA.Voip.voipLog("flashRequired", {web:1, incom:1});
      return
    }
    this._call = WA.Voip.createIncomingCall(callParams);
    if(this._call) {
      this.initCall(callParams.video);
      this._call.startCall(callParams)
    }
  }, outgoingCall:function(email, withVideo) {
    if(withVideo) {
      U.Mnt.countRB(1378988)
    }else {
      U.Mnt.countRB(1216796)
    }
    if(!WA.Voip.isCompatible) {
      this._showVoipMsg("flashRequired");
      WA.Voip.voipLog("flashRequired", {web:1, incom:0, swfver:U.swf.getFlashPlayerVersion().major});
      if(WA.Voip.isSwfInstalled) {
        U.Mnt.countRB(withVideo ? 1378994 : 1299859)
      }else {
        U.Mnt.countRB(withVideo ? 1378992 : 1299860)
      }
      return
    }
    if(!WA.Voip.isCompatibleVideo && withVideo) {
      this._showVoipMsg("flashVideoRequired");
      U.Mnt.countRB(1378994);
      return
    }
    if(WA.Voip.inTalk) {
      if(!this._declineCallDialog) {
        this._declineCallDialog = new WA.DialogsAgent.RemoveContactDialog({autoRender:this.winEl, okButton:WA.tr("voip.hangup")})
      }
      this._declineCallDialog.okEvent.removeAll();
      this._declineCallDialog.okEvent.on(function() {
        this.startOutgoingCall(email, withVideo)
      }, this);
      this._declineCallDialog.show(WA.tr("voip.msg.cancelCall"))
    }else {
      this.startOutgoingCall(email, withVideo)
    }
  }, startOutgoingCall:function(email, withVideo) {
    this._call = WA.Voip.createOutgoingCall(true);
    this.updateActivityEvent.fire(email);
    if(this._call) {
      this.initCall(withVideo);
      this._call.startCall(email, withVideo)
    }
  }, initCall:function(video) {
    this._call.setUser(this.nick, this.status);
    if(!video) {
      this.callPanel.show()
    }
    this.callTab.setUserInfo({mail:this.mail, nick:this.nick, status:this.status});
    this._call.messageEvent.on(this._onCallMessage, this);
    this._call.changeStateEvent.on(this._onCallStateChange, this);
    this._call.changeStateEvent.fire({time:0})
  }, _onCallStateChange:function(state) {
    if(state.ended) {
      this.unlinkCall();
      return
    }
    if(state.time !== undefined) {
      this.callPanel.updateDuration(state.time);
      this.callTab.updateDuration(state.time)
    }
    if(state.video) {
      this.unlinkCall()
    }
  }, unlinkCall:function() {
    this.callPanel.hide();
    this.callTab.hide();
    if(this._call) {
      this._call.messageEvent.un(this._onCallMessage, this);
      this._call.changeStateEvent.un(this._onCallStateChange, this);
      this._call = null
    }
  }, _onCallMessage:function(type) {
    this._showVoipMsg(type)
  }, renderWindow:function() {
    if(this.renderedWin) {
      return
    }
    this.renderedWin = true;
    var iconUrl, profileItems = [], isIcq = this.mail.indexOf("@uin.icq") != -1, isChat = WA.MainAgent.isChat(this.mail), isTel = WA.MainAgent.isTel(this.mail);
    if(!isChat && !isTel) {
      iconUrl = WA.makeAvatar(this.mail, "_avatar" + (WA.isPopup ? 32 : 22))
    }else {
    }
    var winEl = this.winEl = this.el.createChild({tag:"div", cls:"nwa-chat", children:[{tag:"div", cls:"nwa-chat__shadow", children:[{tag:"div", cls:"nwa-chat__header", children:[{tag:"div", cls:"nwa-chat__header-avatar-wrap", children:[{tag:"div", cls:"nwa-chat__header-avatar"}]}, {cls:"nwa-chat__close nwa_action_close"}]}]}]}).first();
    var headerEl = this.headerEl = winEl.first();
    this.statusField = headerEl.createChild({tag:"div", cls:"nwa-chat__header-status", children:[{tag:"span"}]});
    var langScope = {scope:"dialog.tools"};
    if(isTel) {
      profileItems = [this._actionMenuItems.rename, this._actionMenuItems.del]
    }else {
      if(isChat) {
        profileItems = [this._actionMenuItems.spam, this._actionMenuItems.ignore, this._actionMenuItems.rename, this._actionMenuItems.del]
      }else {
        if(isIcq) {
          profileItems = [this._actionMenuItems.profile, this._actionMenuItems.separate, this._actionMenuItems.spam, this._actionMenuItems.ignore, this._actionMenuItems.rename, this._actionMenuItems.del]
        }else {
          profileItems = [this._actionMenuItems.profile, this._actionMenuItems.mir, this._actionMenuItems.foto, this._actionMenuItems.separate, this._actionMenuItems.spam, this._actionMenuItems.ignore, this._actionMenuItems.rename, this._actionMenuItems.del]
        }
      }
    }
    this._tools = new WA.ui.Button({cls:"nwa-chat__header-tools", tooltip:WA.tr("actions", langScope), scope:this, handler:function(obj, e) {
      e.stopPropagation()
    }, menu:new WA.ui.menu.Menu({cls:"nwa-dialog__tools-menu", fadeIn:true, items:profileItems})});
    this._smsDialog.render(winEl);
    this._btnOpenSmsDialog = new WA.ui.Button({cls:"nwa-chat__header-bar nwa-chat__header-bar__sms", tooltip:WA.tr("dialog.sendSMS"), scope:this, text:"<span></span>", handler:function(obj, e) {
      U.Mnt.countRB(979782);
      this.openSendSmsDialog();
      e.stopPropagation()
    }});
    this._btnOpenSmsDialog.render(headerEl);
    var multsMenu = new WA.DialogsAgent.Smiles({cls:"nwa-dialog__smiles-wrap nwa-dialog_mults", flash:true});
    multsMenu.itemClickEvent.on(function(ignored, item, e) {
      e.stopPropagation();
      var target = e.getTarget();
      this._previewFlash(item.initialConfig.code);
      if(target.getAttribute("data-action") != "preview") {
        U.Mnt.countRB(980052);
        this.flashEvent.fire(item.initialConfig)
      }else {
        U.Mnt.countRB(980053)
      }
    }, this);
    multsMenu.render(winEl);
    multsMenu.showEvent.on(function() {
      U.Mnt.countRB(980051);
      this._bar.setState(true)
    }, this);
    multsMenu.hideEvent.on(function() {
      this._bar.setState(false)
    }, this);
    this._bar = new WA.ui.ToggleButton({cls:"nwa-chat__header-bar nwa-chat__header-bar__mult", tooltip:WA.tr("dialog.sendMult"), scope:this, menu:multsMenu, text:"<span></span>", handler:function(obj, e) {
      e.stopPropagation()
    }});
    this._bar.render(headerEl);
    this._btnVoiceCall = new WA.ui.Button({cls:"nwa-chat__header-bar nwa-chat__header-bar__voice", tooltip:WA.tr("voip.voiceCall"), scope:this, text:"<span></span>", handler:function(obj, e) {
      e.stopPropagation();
      this.outgoingCall(this.mail)
    }});
    this._btnVideoCall = new WA.ui.Button({cls:"nwa-chat__header-bar nwa-chat__header-bar__video", tooltip:WA.tr("voip.videoCall"), scope:this, text:"<span></span>", handler:function(obj, e) {
      e.stopPropagation();
      this.outgoingCall(this.mail, true)
    }});
    this._btnVoiceCall.render(headerEl);
    this._btnVideoCall.render(headerEl);
    this._nameBox.render(headerEl);
    this._nameBox.setName(this.nick);
    this._tools.render(headerEl);
    this._history.render(winEl);
    this._textarea.render(winEl);
    if(isTel) {
      this._textarea.el.hide();
      var sendSmsOutline = winEl.createChild({tag:"div", cls:"nwa-chat__input"});
      this._btnOpenSmsDialogBottom = new WA.ui.Button({cls:"nwa-chat__send-sms", tooltip:WA.tr("dialog.sendSMS"), scope:this, text:"<span>" + WA.tr("dialog.sendSMS") + "</span>", handler:function(obj, e) {
        U.Mnt.countRB(979782);
        this.openSendSmsDialog();
        e.stopPropagation()
      }});
      this._btnOpenSmsDialogBottom.render(sendSmsOutline)
    }
    this._profile.render(winEl);
    this.callPanel.render(headerEl);
    this.callPanel.hideEvent.on(function() {
      this.el.removeClass("nwa-chat_calling");
      this._history.scrollBottom()
    }, this);
    this.callPanel.showEvent.on(function() {
      this.el.addClass("nwa-chat_calling");
      this._history.scrollBottom()
    }, this);
    this.callTab.render(this.el);
    this.callTab.hideEvent.on(function() {
      this.el.removeClass("nwa-chat_vcalling");
      this._history.scrollBottom()
    }, this);
    this.callTab.showEvent.on(function() {
      this.el.addClass("nwa-chat_vcalling")
    }, this);
    this._history.getEl().on("click", this._historyClick, this);
    if(iconUrl) {
      var avatar = headerEl.first();
      avatar.setStyle({cursor:"pointer"}).first().setStyle({"background-image":"url(" + iconUrl + ")", "filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + iconUrl + "',sizingMethod='scale')"});
      avatar.on("click", this._openPhoto, this)
    }
  }, _updateButtonBar:function(info) {
    var isChat = WA.MainAgent.isChat(this.mail), isTel = WA.MainAgent.isTel(this.mail), isMult = !isTel, isSms = !isChat && !isTel, isSupport = WA.MainAgent.isSupport(this.mail), isVoip = !isChat && !isSupport && !isTel && !!(this.features & WA.FEATURE_FLAG_WEB_CALL) && info.status != "offline", isVideo = isVoip && !!(this.features & WA.FEATURE_FLAG_VIDEO), btnCount = 0;
    this._btnOpenSmsDialog.setVisible(isSms);
    this._bar.setVisible(isMult);
    this._btnVoiceCall.setVisible(isVoip);
    this._btnVideoCall.setVisible(isVideo);
    isSms && btnCount++;
    isMult && btnCount++;
    isVoip && btnCount++;
    isVideo && btnCount++;
    this.winEl.toggleClass("nwa-chat_nobuttons", btnCount == 0);
    this.headerEl.dom.className = "nwa-chat__header nwa-toolbar-topbar" + btnCount
  }, _previewFlash:function(code) {
    var flash = WA.DialogsAgent.Smiles.getSwfById(code);
    if(this._swfPreview == null) {
      this._swfPreview = new WA.SwfPreview({autoRender:this.winEl, fadeIn:true, modal:true});
      this._swfPreview.failLoadEvent.on(function() {
        this._showLimitAlert(WA.tr("msgFlashFail"))
      }, this)
    }
    var multUrl = IMAGE_URL + "/mults" + flash.swf;
    this._swfPreview.preview(multUrl, flash.duration)
  }, _onAfterRender:function() {
    DialogView.superclass._onAfterRender.call(this)
  }, deactivate:function() {
    this.typingNotifyChecker.stop();
    this._history.deactivate();
    this._textarea.deactivate()
  }, _animateClosing:function() {
    if(this.el && !WA.isFF) {
      var tmpEl = '<div class="nwa-dialog nwa-dialog_dummy"></div>';
      tmpEl = U.DomHelper.insertHtml("beforeBegin", this.el.dom, tmpEl, true);
      WA.setTimeout(function() {
        tmpEl.setWidth(0)
      }, 10);
      WA.setTimeout(function() {
        tmpEl.remove()
      }, 1E3)
    }
  }, destroy:function() {
    if(this.infoBubble) {
      this.infoBubble.destroy()
    }
    if(this._call && !this._call.videoCall) {
      WA.Voip.hangup(true)
    }
    this.unlinkCall();
    this._animateClosing();
    DialogView.superclass.destroy.call(this)
  }});
  var DialogTabs = WA.extend(WA.ui.Component, {constructor:function(config) {
    DialogTabs.superclass.constructor.apply(this, arguments);
    this.MAX_TABS_VISIBLE = 4;
    this.TAB_WIDTH = 207;
    this.TAB_ACTIVE_WIDTH = 307;
    this.TABS_MAX_SUM_WIDTH = this.TAB_WIDTH * (this.MAX_TABS_VISIBLE - 2) + 2 * this.TAB_ACTIVE_WIDTH;
    this.TABS_UPDATE_INTERBAL = 50;
    this.closeTabEvent = new U.Event;
    this.changeFocusEvent = new U.Event;
    this.messageEvent = new U.Event;
    this.renameContactEvent = new U.Event;
    this.removeContactEvent = new U.Event;
    this.typingEvent = new U.Event;
    this.minimizedEvent = new U.Event;
    this.authActionEvent = new U.Event;
    this.contactSelectEvent = new U.Event;
    this.addContactEvent = new U.Event;
    this.updateActivityEvent = new U.Event;
    this.topScrolledEvent = new U.Event;
    this.requestListEvent = new U.Event;
    this.sendSmsEvent = new U.Event;
    this.openAddSearchEvent = new U.Event;
    this._openedDialogs = [];
    this._previews = {};
    this._dialogs = {};
    this._focused = false;
    this._modifDate = false;
    this._hidePreviews = false;
    this._localData = {};
    this._timer = 0;
    this._hiddenTabsCount = 0;
    WA.Voip.callEvent.on(this._onVoipCallEvent, this)
  }, _onRender:function(ct) {
    this.el = ct.createChild({tag:"div", cls:"nwa-root__dialogs", children:[{tag:"div", id:"nwaDialogs", cls:"nwa-root__dialogs-inner"}]});
    this.el = this.el.first();
    this.el.on("click", this._onClick, this);
    this.el.on("mousedown", this._onMouseDown, this);
    this.el.on("mouseup", this._onMouseUp, this);
    WA.get(window).on("resize", function() {
      if(this._timer == 0) {
        this.refreshTabBar(false, true)
      }
    }, this)
  }, _onVoipCallEvent:function(type, params) {
    if(type == "createCall") {
      if(!this.callTab) {
        this.callTab = new WA.VoipView.CallTab;
        this.callTab.render(this.el);
        this.callTab.hideEvent.on(function() {
          delete this.voipTabIsShown;
          this.refreshTabBar(false)
        }, this);
        this.callTab.showEvent.on(function() {
          this.voipTabIsShown = true;
          this.refreshTabBar(false)
        }, this)
      }
      this._call = params.call;
      this._call.changeStateEvent.on(this._onCallStateChange, this)
    }
  }, _onCallStateChange:function(state) {
    if(state.ended) {
      this._call = null;
      this.callTab.hide();
      return
    }
    if(state.time !== undefined) {
      this.callTab.updateDuration(state.time)
    }
    if(state.video !== undefined) {
      if(state.video) {
      }
    }
    if(state.minimized !== undefined) {
      if(state.minimized && this._call.videoCall) {
        this.callTab.setUserInfo({mail:this._call.phoneNumber, nick:this._call.userInfo.nick, status:this._call.userInfo.status});
        this.callTab.show()
      }
    }
  }, show:function() {
    DialogTabs.superclass.show.apply(this, arguments)
  }, hide:function() {
    DialogTabs.superclass.hide.apply(this, arguments)
  }, _onMouseDown:function(ev) {
    var target = ev.getTarget();
    var mail = target.getAttribute && target.getAttribute("mail");
    if(mail && ev.browserEvent.which == 2) {
      this._wheelClick = mail;
      ev.preventDefault()
    }
  }, _onMouseUp:function(ev) {
    var target = ev.getTarget();
    var mail = target.getAttribute("mail");
    if(ev.browserEvent.which == 2 && this._wheelClick && this._wheelClick == mail) {
      target.className = "wa-tab-close";
      this._onClick(ev)
    }
    delete this._wheelClick
  }, _onClick:function(ev) {
    var target = ev.getTarget(true);
    var dialogRoot = this._findDialogRootNode(target);
    if(!dialogRoot) {
      return
    }
    var mail = dialogRoot.getAttribute("mail");
    var action = target.getAttribute("data-action") || target.parent().getAttribute("data-action");
    if(target.hasClass("nwa_action_close") || target.parent().hasClass("nwa_action_close")) {
      this.closeTabEvent.fire(mail);
      ev.stopEvent();
      return
    }
    if(action === "resend") {
      var flashCode = target.getAttribute("data-flash");
      var text = flashCode || U.String.entityDecode(target.getAttribute("data-text"));
      this.messageEvent.fire(mail, text, true, !!flashCode);
      U.Mnt.countRB(1335025);
      return
    }
    if(action === "reply_micblog") {
      var postId = target.getAttribute("data-post-id");
      var tmp = mail.split("@");
      var url = "http://my.mail.ru/" + tmp[1].split(".")[0] + "/" + tmp[0] + "/microposts?postid=" + postId;
      window.open(url);
      return
    }
    if(target.up("nwa-message__actions")) {
      if(action) {
        var text = U.String.entityDecode(target.getAttribute("data-text"));
        var msgId = target.getAttribute("data-msg-id");
        var nick = this.nick || WA.SA.get(mail).nick || mail;
        this.authActionEvent.fire({mail:mail, action:action, nick:nick, msg_id:msgId, text:text})
      }
      return
    }
    if(target.up("nwa-chat__header")) {
      if(!target.up("nwa-voip-talk")) {
        this.minimizedEvent.fire()
      }
      return
    }
    if(target.up("nwa-button-tab") || action == "expand") {
      this.changeFocusEvent.fire(mail)
    }
  }, _findDialogRootNode:function(node) {
    return node.up("nwa-dialog")
  }, openSendSmsDialog:function(mail) {
    var objDialog = this._dialogs[mail];
    if(objDialog) {
      objDialog.openSendSmsDialog()
    }
  }, _startPreviewsTimer:function() {
    if(this._previewTimer) {
      return
    }
    this._previewTimer = WA.setTimeout(function() {
      for(var i in this._previews) {
        delete this._previews[i]
      }
      this._previewTimer = null;
      this._focused && this._startPreviewsTimer()
    }, 6E5, this)
  }, _renderTabs:function(dlg) {
    var dialogsEl = this.el, openDialogs = [];
    var dialogs = U.Array.clone(dlg);
    if(dialogs.length > 4) {
      dialogs = dialogs.splice(dialogs.length - 4, 4)
    }
    U.Array.each(dialogs, function(dialog, i) {
      openDialogs.push(dialog.mail);
      if(this._openedDialogs.length <= i) {
        this._openedDialogs.push(dialog.mail)
      }
      var objDialog = this._dialogs[dialog.mail];
      if(!objDialog) {
        objDialog = new DialogView({}, dialog);
        objDialog.updateActivityEvent.on(function() {
          this.updateActivityEvent.fire(dialog.mail)
        }, this);
        objDialog.typingEvent.on(function() {
          this.typingEvent.fire(dialog.mail)
        }, this);
        objDialog.messageEvent.on(function(text) {
          this.messageEvent.fire(dialog.mail, text)
        }, this);
        objDialog.flashEvent.on(function(flash) {
          this.messageEvent.fire(dialog.mail, flash.code, false, true)
        }, this);
        objDialog.renameContactEvent.on(function(mail, nick) {
          this.renameContactEvent.fire(mail, nick)
        }, this);
        objDialog.removeContactEvent.on(function(mail) {
          this.removeContactEvent.fire(mail)
        }, this);
        objDialog.authActionEvent.on(function(params) {
          this.authActionEvent.fire(params)
        }, this);
        objDialog.minimizeEvent.on(function(params) {
          this.minimizedEvent.fire(params)
        }, this);
        this.contactSelectEvent.relay(objDialog.contactSelectEvent);
        this.requestListEvent.relay(objDialog.requestListEvent);
        this.sendSmsEvent.relay(objDialog.sendSmsEvent);
        this.openAddSearchEvent.relay(objDialog.openAddSearchEvent);
        this.addContactEvent.relay(objDialog.addContactEvent);
        this.topScrolledEvent.relay(objDialog.topScrolledEvent);
        objDialog._history._previews = this._previews;
        objDialog.render(dialogsEl);
        this._dialogs[dialog.mail] = objDialog
      }
      this._startPreviewsTimer();
      objDialog.updateTabInfo(dialog)
    }, this);
    U.Array.each(this._openedDialogs, function(dialog, i) {
      if(U.Array.indexOf(openDialogs, dialog) == -1) {
        this._destroyDialog(dialog)
      }
    }, this);
    this._openedDialogs = openDialogs
  }, _destroyDialog:function(mail) {
    if(this._dialogs[mail]) {
      this._dialogs[mail].deactivate();
      this._dialogs[mail].destroy();
      delete this._dialogs[mail]
    }
    if(this._focused == mail) {
      this._focused = false
    }
  }, updateView:function(data) {
    if(this._modifDate != data.dialogsModifDate) {
      this._modifDate = data.dialogsModifDate;
      this._renderTabs(data.dialogs)
    }
    return this.setFocus(data)
  }, refreshTabBar:function(forceRefresh, forceTimeout) {
    clearTimeout(this._timer);
    this._timer = 0;
    this._refreshTabsVisibility(forceRefresh);
    if(forceTimeout) {
      this._timer = WA.setTimeout(WA.createDelegate(function() {
        this.refreshTabBar(forceRefresh)
      }, this), this.TABS_UPDATE_INTERBAL)
    }
  }, _refreshTabsVisibility:function(forceRefresh) {
    var tabsCapacity = this.calcAvailableSpace(this._focused);
    var tabsToHide = this._openedDialogs.length - tabsCapacity;
    if(tabsToHide != this._hiddenTabsCount || forceRefresh) {
      this._hiddenTabsCount = tabsToHide;
      U.Array.each(this._openedDialogs, function(dialog, i) {
        if(tabsToHide > 0 && dialog != this._focused) {
          this._dialogs[dialog].getEl().addClass("nwa-dialog_hidden");
          tabsToHide--
        }else {
          this._dialogs[dialog].getEl().removeClass("nwa-dialog_hidden")
        }
      }, this)
    }
  }, calcAvailableSpace:function(hasFocused) {
    var actualWidth = this.el.getWidth();
    if(actualWidth > this.TABS_MAX_SUM_WIDTH) {
      return this.MAX_TABS_VISIBLE
    }
    var tabsCapacity = 0;
    if(hasFocused) {
      tabsCapacity++;
      actualWidth -= this.TAB_ACTIVE_WIDTH
    }
    if(this.voipTabIsShown) {
      actualWidth -= this.TAB_WIDTH
    }
    U.Array.eachReverse(this._openedDialogs, function(dialog, i) {
      if(dialog == this._focused) {
        return
      }
      var tabWidth = this.TAB_WIDTH;
      if(tabWidth >= actualWidth) {
        return false
      }
      tabsCapacity++;
      actualWidth -= tabWidth
    }, this);
    return tabsCapacity
  }, calcAvailableSpace_old:function(hasFocused) {
    var actualWidth = this.el.getWidth(), diffWidth = 0;
    if(actualWidth > this.TABS_MAX_SUM_WIDTH) {
      return this.MAX_TABS_VISIBLE
    }
    diffWidth = this.TAB_WIDTH * (this.MAX_TABS_VISIBLE - 1) + (hasFocused ? this.TAB_ACTIVE_WIDTH : this.TAB_WIDTH) - actualWidth;
    if(diffWidth <= 0) {
      return this.MAX_TABS_VISIBLE
    }
    return this.MAX_TABS_VISIBLE - Math.ceil(diffWidth / this.TAB_WIDTH)
  }, setFocus:function(data) {
    if(this._focused && this._focused != data.focused) {
      this._dialogs[this._focused].blur()
    }
    if(!data.focused) {
      this._focused = false;
      return false
    }
    var index = this._indexOf(data.dialogs, data.focused);
    var dialog = data.dialogs[index];
    var focusedDialog = this._dialogs[data.focused];
    var needRedraw = focusedDialog._history._hidePreviews != this._hidePreviews;
    focusedDialog._history._hidePreviews = this._hidePreviews;
    if(this._focused != data.focused) {
      this._focused = data.focused;
      focusedDialog.focus(dialog)
    }
    focusedDialog.updateWindow(dialog, needRedraw);
    this.refreshTabBar(true);
    return data.focused
  }, _indexOf:function(dialogs, mail) {
    return U.Array.indexOfBy(dialogs, function(dialog) {
      if(dialog.mail == mail) {
        return true
      }
    })
  }, isFirst:function(mail) {
    var first = this.el.first();
    return first ? first.getAttribute("mail") == mail : false
  }, incomingCall:function(mail, callParams) {
    var objDialog = this._dialogs[mail];
    if(objDialog) {
      objDialog.incomingCall(callParams)
    }
  }, deactivate:function() {
    this._focused = false;
    this._modifDate = false;
    if(this._previewTimer) {
      clearTimeout(this._previewTimer);
      this._previewTimer = null
    }
    U.Array.each(this._openedDialogs, function(dialog, i) {
      this._destroyDialog(dialog)
    }, this);
    this._openedDialogs = []
  }});
  WA.DialogsAgentView = DialogTabs;
  WA.DialogsAgentView.prepareMessageText = function(text, noLinks, prevClbk, previews) {
    var SMILES = WA.DialogsAgent.Smiles;
    var MAX_LENGTH = 38;
    noLinks = noLinks || false;
    var ret = text;
    var mark = (new Date).getTime();
    var MARK_FORMAT = "{0}" + mark + "_{1} ";
    if(!noLinks) {
      var tmp, links = [], ytb = /https?:\/\/(?:www\.)?youtu(?:\.be\/|be\.com\/watch\?(?:[^\&=]+=[^\&]*\&)*v=)([a-zA-Z0-9_-]+)/, notImage = /[^\s\n\t:-]/, isImg = /.+\.(jpg|png|gif|bmp|tif)$/, ytbClbk = function(hrf) {
        return function(url, suc, img) {
          prevClbk(hrf, suc, img)
        }
      };
      previews || (previews = {});
      if(typeof prevClbk != "function") {
        prevClbk = false
      }
      ret = ret.replace(/((?:https?|ftp):\/\/([a-z0-9]+[\.-])+[^\s\n\t><"']+[^\s\n\t><"'\.,])/ig, function(ignored, href, r$, index, all) {
        var l = {href:href, name:href};
        if(prevClbk && (!all[index - 1] || !(l.notImage = notImage.test(all[index - 1])))) {
          if(href in previews) {
            previews[href] && (l.name = previews[href])
          }else {
            if(tmp = ytb.exec(href)) {
              previews[href] = !U.DomHelper.testUrlAsImage("http://i.ytimg.com/vi/" + tmp[1] + "/mqdefault.jpg", ytbClbk(href))
            }else {
              previews[href] = isImg.test(href) && !U.DomHelper.testUrlAsImage(href, prevClbk)
            }
          }
        }
        links.push(l);
        return U.String.format(MARK_FORMAT, "L", links.length - 1)
      })
    }
    var obj = SMILES.maskSmiles(ret);
    ret = obj.text;
    ret = U.String.htmlEntity(ret);
    ret = ret.replace(/(\n|\r\n)/g, "<br />").replace(/(\t)/g, "    ");
    ret = ret.replace(new RegExp("(L|S)" + mark + "_(\\d+)", "g"), function(str, key, index) {
      index = parseInt(index);
      if(WA.isNumber(index) && index >= 0) {
        if("S" === key) {
          WA.debug.Console.log("Smile error! Varible 'smiles' is not defined");
          return str
        }else {
          if("L" === key) {
            if(links.length > index) {
              var linkName = links[index].name;
              var href = links[index].href;
              var attrs = links[index].notImage ? 'notimage="true"' : "";
              return U.String.format('<a href="{0}" target="_blank" {2}>{1}</a>', href, linkName, attrs)
            }
          }
        }
      }
      return str
    });
    obj.text = ret;
    ret = SMILES.processMessage(obj);
    return ret
  }
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var SOCK = WA.conn.Socket;
  WA.DialogsAgent = WA.Activatable.extend(Object, {constructor:function(config) {
    WA.DialogsAgent.superclass.constructor.call(this, config);
    this.countChangedEvent = new U.Event;
    this.unreadedEvent = new U.Event;
    this.minimizedEvent = new U.Event;
    this.incomingMessageEvent = new U.Event;
    this.closeTabEventEvent = new U.Event;
    this.updateActivityEvent = new U.Event;
    this.deleteActivityEvent = new U.Event;
    this.visibleDialogChangedEvent = new U.Event;
    this.abstraction = new WA.DialogsAbstraction;
    this.incomingMessageEvent = (new U.Event).relay(this.abstraction.incomingMessageEvent);
    this.updateSelfNickEvent = (new U.Event).relay(this.abstraction.updateSelfNickEvent);
    this.abstraction.updateActivityEvent.on(this._onUpdateActivity, this);
    this._view = new WA.DialogsAgentView;
    this._view.changeFocusEvent.on(this._onTabsFocusChange, this);
    this._view.updateActivityEvent.on(this._onUpdateActivity, this);
    this.changeFocusEvent = (new U.Event).relay(this._view.changeFocusEvent);
    this.requestListEvent = (new U.Event).relay(this._view.requestListEvent);
    this.addContactEvent = (new U.Event).relay(this._view.addContactEvent);
    this._view.closeTabEvent.on(this._onTabClose, this);
    this._view.messageEvent.on(this._onMessageSubmit, this);
    this._view.typingEvent.on(this._onMessageTyping, this);
    this._view.minimizedEvent.on(function() {
      if(!WA.isPopup) {
        this.abstraction.blur();
        this.minimizedEvent.fire()
      }
    }, this);
    this._view.renameContactEvent.on(function(mail, newNick) {
      this.renameContactEvent.fire(mail, newNick);
      this.abstraction.renameContact(mail, newNick)
    }, this);
    this._view.removeContactEvent.on(function(mail) {
      this.abstraction.close(mail);
      this.removeContactEvent.fire(mail)
    }, this);
    this._view.authActionEvent.on(this._onAuthAction, this);
    this._view.sendSmsEvent.on(this.abstraction.postSms, this.abstraction);
    this._view.topScrolledEvent.on(this.abstraction.loadHistoryPart, this.abstraction);
    this.openAddSearchEvent = (new U.Event).relay(this._view.openAddSearchEvent);
    this._view.contactSelectEvent.on(this.openDialog, this);
    this.removeContactEvent = new U.Event;
    this.renameContactEvent = new U.Event;
    WA.UserAttend.attendEvent.on(this._onUserAttend, this);
    WA.Voip.callEvent.on(this._checkCallEvent, this);
    WA.Voip.updateActivityEvent.on(this._onUpdateActivity, this);
    this._titleAnimator = new WA.DialogsAgent.TitleAnimator
  }, _onMessageSubmit:function(mail, text, resend, flash) {
    this.abstraction.postMessage(mail, text, resend, flash);
    var clistData = this._extractClistData(this.abstraction._cache.dm.get(mail));
    this.updateActivityEvent.fire(clistData)
  }, _extractClistData:function(dialog) {
    return this.abstraction._extractClistData(dialog)
  }, _onUpdateActivity:function(clistData, type) {
    var dlg;
    if(typeof clistData === "string") {
      dlg = this.abstraction._cache.dm.getIfExist(clistData);
      if(!dlg) {
        dlg = WA.SA.get(clistData)
      }
      clistData = this._extractClistData(dlg)
    }
    this.updateActivityEvent.fire(clistData, type)
  }, _checkCallEvent:function(type, params) {
    if(params && params.email) {
      var text = WA.Voip.historyMessages[type];
      if(text) {
        this.abstraction.addServiceMessage(params.email, WA.tr("voip.voiceCalls"), text)
      }
    }
  }, _onTabsFocusChange:function(mail, isBottom) {
    this.abstraction.focus(mail);
    this.visibleDialogChangedEvent.fire(mail)
  }, _onTabClose:function(email) {
    this.abstraction.close(email);
    this.closeTabEventEvent.fire(email)
  }, _onAuthAction:function(params) {
    var mail = params.mail, action = params.action;
    if("add" === action) {
      WA.MainAgent.sendAddContact(mail, params.nick, function(success) {
        if(success) {
          this.abstraction.makeAuthorized()
        }else {
          this.abstraction.close(mail)
        }
      }, this)
    }else {
      if("cancel" === action) {
        this.abstraction.close(mail)
      }else {
        if("ignore" === action) {
          WA.conn.Socket.send("contact", {operation:"ignore", email:mail});
          this.abstraction.close(mail);
          WA.ChangeLog.logAction("remove", {email:mail})
        }else {
          if("spam" === action) {
            if(params.text) {
              WA.conn.Socket.send("message", {spam:1, to:mail, message_id:params.msg_id, text:params.text})
            }
            this.abstraction.close(mail);
            this.removeContactEvent.fire(mail)
          }
        }
      }
    }
    this.deleteActivityEvent.fire(mail)
  }, _onMessageTyping:function(mail) {
    var clistData = this._extractClistData(this.abstraction._cache.dm.get(mail));
    this.updateActivityEvent.fire(clistData);
    SOCK.send("message", {to:mail, composing:1})
  }, _onAbstractionUpdate:function(data) {
    this.countChangedEvent.fire(data.dialogs.length);
    var focused = this._view.updateView(data);
    if(!focused) {
    }
    if(WA.UserAttend.isAttend) {
      this.markAsReaded()
    }
    var duty = this._dutyUnreaded = this._getDutyUnreaded(data);
    this.unreadedEvent.fire(+WA.ContactStates.hasUnread());
    if(duty.count) {
      this._titleAnimator.start(duty.count, U.String.entityDecode(duty.nick))
    }else {
      this._titleAnimator.stop()
    }
  }, _getDutyUnreaded:function(data) {
    var res = {count:0, dialog:false};
    var date = 0;
    U.Array.each(data.dialogs, function(dlg) {
      if(dlg.unreaded) {
        res.count++;
        if(date < dlg.modifDate) {
          date = dlg.modifDate;
          res.dialog = dlg
        }
      }
    }, this);
    if(res.dialog) {
      var mail = res.dialog.mail;
      var c = res.dialog.cast[mail];
      WA.apply(res, {mail:mail, nick:c.nick, status:c.status, statusTitle:c.statusTitle})
    }
    return res
  }, _onUserAttend:function() {
    this.markAsReaded()
  }, markAsReaded:function(mail) {
    this.abstraction.markAsReaded(mail)
  }, render:function(ct) {
    this._view.render(ct)
  }, openDialog:function(mail, nick, status, statusTitle, features, phones) {
    this.abstraction.open(mail, nick, status, statusTitle, features, phones)
  }, openSendSmsDialog:function(mail, nick, status, statusTitle, features, phones) {
    this.abstraction.open(mail, nick, status, statusTitle, features, phones);
    this._view.openSendSmsDialog(mail)
  }, openCallDialog:function(mail, callParams) {
    var status = WA.SA.get(mail);
    this.abstraction.open(mail, status.nick, status.status, status.statusTitle, status.features, status.phones);
    this._view.incomingCall(mail, callParams)
  }, hasDialogs:function() {
    return this.abstraction._cache.dm.getDialogCount() > 0
  }, minimize:function() {
    this.abstraction.blur()
  }, togglePreviews:function(hidePreviews) {
    var fData = this.abstraction._cache.dm && this.abstraction._cache.dm.getFocused();
    var fView = this._view._focused && this._view._dialogs[this._view._focused];
    this._view._hidePreviews = hidePreviews;
    if(fData && fView) {
      fView._history._hidePreviews = hidePreviews;
      fView._history._renderHistory(fData.data)
    }
  }, activate:function(cb, scope) {
    return WA.DialogsAgent.superclass.activate.call(this, {cb:cb, scope:scope})
  }, _onActivate:function(params) {
    this.abstraction.updateEvent.on(this._onAbstractionUpdate, this);
    this.abstraction.activate(params.cb, params.scope)
  }, _onDeactivate:function() {
    this.abstraction.updateEvent.un(this._onAbstractionUpdate, this);
    this.abstraction.deactivate();
    this._view.deactivate();
    this._titleAnimator.stop()
  }, actualize:function(cb, scope) {
    cb && cb.call(scope || window)
  }, enableUserEvents:function() {
  }, disableUserEvents:function() {
  }, getOpenDialogs:function() {
    return this.abstraction.getOpenDialogs()
  }, getVisibleDialog:function() {
    return this.abstraction.getFocused()
  }})
})();
(function() {
  var WA = WebAgent;
  WA.DialogsAgent.TitleAnimator = WA.extend(Object, {constructor:function() {
    this.originalTitle = document.title;
    this.updater = new WA.util.DelayedTask({interval:500, fn:this._doUpdate, scope:this});
    this._reset()
  }, _reset:function() {
    this.index = 0;
    this.unreadCount = 0;
    this.subTitle = "";
    this._lastTitle = false
  }, _getTitle:function() {
    var index = this.index;
    if(0 === index) {
      return WA.tr("titleAnimator", {count:this.unreadCount})
    }else {
      if(1 === index) {
        return this.subTitle
      }else {
        if(2 === index) {
          return"*************"
        }else {
          return this.originalTitle
        }
      }
    }
  }, _doUpdate:function() {
    if(document.title != this._lastTitle) {
      this.originalTitle = document.title
    }
    document.title = this._lastTitle = this._getTitle();
    this.index = ++this.index >= 3 ? 0 : this.index;
    this.updater.start()
  }, start:function(count, title) {
    if(!this.updater.isStarted()) {
      this._reset()
    }
    this.unreadCount = count;
    this.subTitle = WA.util.String.trim(title);
    this._doUpdate()
  }, stop:function() {
    if(this.updater.isStarted()) {
      this.updater.stop();
      if(document.title == this._lastTitle) {
        document.title = this.originalTitle
      }
    }
  }})
})();
(function() {
  var ICQ = [{"code":"428", "smile":"*PARDON*"}, {"code":"314", "smile":"*ROFL*"}, {"code":"039", "smile":"*GIVE_HEART*"}, {"code":"430", "smile":"*YAHOO*"}, {"code":"015", "smile":":-D"}, {"code":"415", "smile":"*IN LOVE*"}, {"code":"402", "smile":"*LOL*"}, {"code":"401", "smile":":-!"}, {"code":"416", "smile":"*JOKINGLY*"}, {"code":"417", "smile":"[:-}"}, {"code":"408", "smile":"]:->"}, {"code":"414", "smile":":-{}"}, {"code":"427", "smile":":-$"}, {"code":"400", "smile":"O:-)"}, {"code":"426", 
  "smile":":-)"}, {"code":"422", "smile":":-("}, {"code":"404", "smile":":-["}, {"code":"424", "smile":"=-O"}, {"code":"429", "smile":";-)"}, {"code":"409", "smile":"8-)"}, {"code":"412", "smile":"@}->--"}, {"code":"403", "smile":":-P"}, {"code":"413", "smile":"*THUMBS UP*"}, {"code":"405", "smile":":'-("}, {"code":"425", "smile":":-@"}, {"code":"410", "smile":"*DRINK*"}, {"code":"415", "smile":"*KISSED*"}, {"code":"419", "smile":"%)"}, {"code":"418", "smile":"*NO*"}, {"code":"406", "smile":"*CRAZY*"}, 
  {"code":"407", "smile":"*DANCE*"}];
  var WA = WebAgent;
  var U = WA.util;
  var MENU = WA.ui.menu;
  var Smiles = WA.DialogsAgent.Smiles = WA.extend(WA.ui.Layer, {constructor:function(config) {
    var cfg = WA.applyIf(config || {}, {cls:"nwa-dialog__smiles-wrap", hideOnClick:true, fadeIn:true, flash:false});
    this.flash = cfg.flash;
    this.controlEl = cfg.controlEl || [];
    if(this.controlEl && this.controlEl.length == null) {
      this.controlEl = [this.controlEl]
    }
    this._tabs = new Tabs;
    var len = this._getSets().length;
    for(var i = 0;i < len;i++) {
      this._tabs.addTab({cls:"nwa-" + (this.flash ? "flash" : "smile") + "_tab" + i})
    }
    this._tabs.tabChangeEvent.on(this._onTabChangeEvent, this);
    Smiles.superclass.constructor.call(this, cfg);
    this.itemClickEvent = new WA.util.Event
  }, _getSets:function() {
    return WA.data[this.flash ? "FlashSets" : "SmileSets"]
  }, _onAncestorClick:function(el, isSelf, e) {
    if(!isSelf) {
      var c = el;
      var index = null;
      while(this.activeTab && c && !c.equals(this.activeTab.el)) {
        index = parseInt(c.getAttribute("menu_index"));
        if(WA.isNumber(index)) {
          this.itemClickEvent.fire(this, this.activeTab.items[index], e);
          break
        }else {
          c = c.parent()
        }
      }
    }
  }, setControlElement:function(el) {
    this.controlEl = el && el.length == null && [el] || el
  }, _onClick:function(e) {
    var target = e.getTarget(true);
    for(var i = 0, len = this.controlEl.length;i < len;i++) {
      if(this.controlEl[i].contains(target)) {
        return false
      }
    }
    if(this._tabs.el.contains(target)) {
      return true
    }
    Smiles.superclass._onClick.call(this, e)
  }, _onAfterRender:function(el) {
    initSmileData();
    loadSmileCssPackage();
    this._tabs.render(this.el);
    this._tabs.setFocus(0);
    this._onTabChangeEvent(0)
  }, _onTabChangeEvent:function(index) {
    if(this.activeTab) {
      this.activeTab.hide();
      this.activeTab.destroy()
    }
    var setId = this._getSets()[index], data = [], set, obj;
    if(setId) {
      set = WA.data.SmileData[setId];
      for(var k = 0, len = set.length;k < len;k++) {
        obj = set[k];
        data.push({code:obj.id, title:obj.tip || obj.alt || "", alt:getVisualAlt(obj), cls:"nwa-" + obj.name, swf:obj.swf, text:this.flash && WA.hasFlash ? '<span data-action="preview">' + WA.tr("dialog.preview") + "</span>" : null})
      }
    }
    this.activeTab = new SmilesTab({items:data, cls:"nwa-smile_set" + index});
    this.activeTab.render(this.el);
    this.activeTab.show()
  }, destroy:function() {
    this.itemClickEvent.removeAll();
    this.itemClickEvent = null;
    Smiles.superclass.destroy.call(this)
  }});
  Smiles.insertSmile = function(smileNode, smileBeforeNode) {
    var sel = WA.util.Selection.getSelection(), range = sel.getRangeAt(0), spaceNode;
    if(WA.isIE8) {
      spaceNode = document.createElement("img");
      spaceNode.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      spaceNode.width = 3;
      spaceNode.height = 18;
      range.insertNode(spaceNode)
    }
    if(smileBeforeNode) {
      smileBeforeNode.parentNode.insertBefore(smileNode, smileBeforeNode)
    }else {
      range.insertNode(smileNode)
    }
    range.setStartAfter(spaceNode !== undefined ? spaceNode : smileNode);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range)
  };
  Smiles.getSmileObjByName = function(name) {
    return WebAgent.data.AllSmilesByName[name]
  };
  Smiles.getVisualAlt = getVisualAlt;
  var SmilesTab = WA.extend(MENU.Menu, {defaultType:MENU.Image, constructor:function(config) {
    var cfg = WA.applyIf({hideOnClick:false, fadeIn:false, autoHide:false}, config || {});
    if(cfg.cls) {
      cfg.cls += " nwa-dialog__smiles-menu"
    }
    SmilesTab.superclass.constructor.call(this, cfg)
  }});
  var Tabs = WA.extend(WA.ui.Component, {constructor:function() {
    Tabs.superclass.constructor.apply(this, arguments);
    this.tabChangeEvent = new U.Event;
    this._list = [];
    this._tabs = [];
    this._index = -1
  }, _onRender:function(el) {
    this.el = el.createChild({cls:"nwa-dialog__smiles-tabs"});
    this.el.on("click", this._onClickEvent, this);
    this._renderTabs()
  }, _onClickEvent:function(el) {
    var trg = el.getTarget(true);
    trg = trg.hasClass("nwa-dialog__smiles-tab") && trg || trg.parent();
    var index = trg.getAttribute("data-tab-index");
    if(index != null) {
      if(this.setFocus(index)) {
        this.tabChangeEvent.fire(index)
      }
    }
  }, _renderTabs:function() {
    var el;
    U.Array.each(this._list, function(tab, i) {
      el = this.el.createChild({tag:"div", cls:"nwa-dialog__smiles-tab " + (tab.cls || ""), "data-tab-index":i, html:"<span></span>"});
      this._tabs.push(el)
    }, this)
  }, addTab:function(cfg) {
    this._list.push(cfg)
  }, setFocus:function(index) {
    if(this._index != index) {
      if(this._index != -1) {
        this._tabs[this._index].removeClass("nwa-dialog__smiles-tab_active")
      }
      this._tabs[index].addClass("nwa-dialog__smiles-tab_active");
      this._index = index;
      return true
    }
  }});
  var strip = function() {
    var chars = "(){}[]|+:*$";
    var tmp = [];
    var i = 0;
    while(i < chars.length) {
      tmp.push("\\" + chars.charAt(i));
      i++
    }
    var re = new RegExp("(" + tmp.join("|") + ")", "g");
    return function(text) {
      return text.replace(re, "\\$1")
    }
  }();
  var allItems, smileCodes = [], smileCodeRE, smileIndexes = [], agentToIcqRE, maskSmilesRE;
  var SMILE_ICQ_RE;
  var agentToIcqHash = {}, icqSmilesHash = {};
  function initSmileData() {
    if(allItems) {
      return
    }
    WA.data.AllSets = [].concat(WA.data.SmileSets).concat(WA.data.FlashSets);
    allItems = {};
    for(var i = 0, len = WA.data.AllSets.length;i < len;i++) {
      var setData = WA.data.SmileData[WA.data.AllSets[i]];
      for(var k = 0, len2 = setData.length;k < len2;k++) {
        var obj = setData[k];
        obj.ind = i;
        obj.html = "<SMILE>id=" + obj.id + " alt='" + obj.alt + "'</SMILE>";
        allItems[obj.id] = obj
      }
      smileCodes = smileCodes.concat(U.Array.transform(setData, function(entry) {
        return strip(getVisualAlt(entry))
      }));
      smileIndexes = smileIndexes.concat(U.Array.transform(setData, function(entry) {
        return strip(entry.id)
      }))
    }
    smileCodeRE = new RegExp("(" + smileCodes.join("|") + ")", "g");
    Smiles.smileCodeRE = smileCodeRE;
    Smiles.smileCodeLastRE = new RegExp("(" + smileCodes.join("|") + ")$");
    Smiles.SYMBOLS = function() {
      var ret = smileCodes.join().split("");
      ret = U.Array.unique(ret).join("");
      return ret
    }();
    WA.data.AllSmilesByName = {};
    for(var set in WA.data.SmileData) {
      for(var i in WA.data.SmileData[set]) {
        var smile = WA.data.SmileData[set][i];
        WA.data.AllSmilesByName[smile.name] = smile
      }
    }
    var agentToIcqList = [];
    var icqSmilesList = [];
    U.Array.each(ICQ, function(t) {
      icqSmilesList.push(strip(t.smile));
      icqSmilesHash[t.smile] = t.code;
      var a = allItems[t.code];
      var textSmile = ":" + a.tip + ":";
      agentToIcqList.push(strip(textSmile));
      agentToIcqHash[textSmile] = t.smile
    });
    agentToIcqRE = new RegExp("(" + agentToIcqList.join("|") + ")", "g");
    SMILE_ICQ_RE = Smiles.SMILE_ICQ_RE = "(" + icqSmilesList.join("|") + ")";
    maskSmilesRE = new RegExp("(" + [SMILE_STR_RE1, SMILE_STR_RE2, SMILE_ICQ_RE, STICKER_RE].join("|") + ")", "g")
  }
  function getSmileById(id) {
    initSmileData();
    return allItems[id]
  }
  function getSmileCodes() {
    initSmileData();
    return smileCodes
  }
  function getSmileCodeRE() {
    initSmileData();
    return smileCodeRE
  }
  function getSmileByIndex(index) {
    var id = smileIndexes[index];
    return getSmileById(id)
  }
  function getVisualAlt(obj) {
    if(U.Array.indexOf([422, 424, 426, 429], parseInt(obj.id)) > -1) {
      return obj.alt
    }
    if(obj.alt.indexOf("###") == -1) {
      return obj.alt.substr(0, obj.alt.length - 1) + obj.ind + ":"
    }
    if(obj.id > 9 && obj.id < 32 || obj.id > 33 && obj.id < 39 || obj.id == 40) {
      return obj.tip
    }
    return":" + obj.tip + ":"
  }
  function buildSmilePackage(ignored, code) {
    var codes = getSmileCodes();
    var i = U.Array.indexOf(codes, strip(code));
    var smile = getSmileByIndex(i);
    if(!smile) {
      return""
    }
    if(smile.alt.indexOf("###") > -1) {
      return smile.alt
    }
    return"<SMILE>id=" + smile.id + " alt='" + smile.alt + "'</SMILE>"
  }
  Smiles.buildSmilePackage = buildSmilePackage;
  Smiles.getSwfById = function(swfId) {
    return getSmileById(swfId)
  };
  Smiles.processTextIcq = function() {
    var fn = function(nope, smile) {
      return agentToIcqHash[smile]
    };
    var fnS = function(code, smile) {
      return code.match(getSmileCodeRE()) ? ":" + smile + ":" : code
    };
    return function(text) {
      initSmileData();
      text = text.replace(/:([^:]{1,40}?)\d:/g, fnS);
      text = text.replace(agentToIcqRE, fn);
      return text
    }
  }();
  Smiles.processText = function(text) {
    return text.replace(getSmileCodeRE(), buildSmilePackage)
  };
  var SMILE_STR_RE1 = Smiles.SMILE_STR_RE1 = "<###\\d+###img(\\d+)>";
  var SMILE_STR_RE2 = Smiles.SMILE_STR_RE2 = "<SMILE>id='?([0-9_a-z]+)'? alt='([^']+)'</SMILE>";
  var STICKER_RE = Smiles.STICKER_RE = "<SMILE>id='ext:([0-9]+):sticker:([0-9]+)' alt='([^']+)'</SMILE>";
  var mark = (new Date).getTime();
  var MARK_FORMAT = "" + mark + "_{0}_ ";
  var SMILE_MARK_RE = Smiles.SMILE_MARK_RE = "" + mark + "_(\\d+)_";
  var SMILE_FORMAT = '<img class="nwa-smile_inline nwa-{0}" title="{1}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" unselectable="on">';
  var STICKER_FORMAT = '<img class="nwa-smile_sticker" title="{2}" src="//c.icq.com/store/stickers/{0}/{1}/small" unselectable="on">';
  if(WA.isIE || WA.isFF) {
    SMILE_FORMAT = '<img style="position: relative" class="nwa-smile_inline nwa-{0}" title="{1}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" unselectable="on" contenteditable="false">'
  }
  var FLASH_FORMAT = '<div class="nwa-smile_flash nwa-{0}" title="{1}" style="width: 50px; height: 50px;"></div><a href="javascript:;" data-action="preview" data-flash="{2}">' + WA.tr("dialog.previewMult") + "</a>";
  var NO_FLASH_FORMAT = '<div class="nwa-smile_flash nwa-{0}" title="{1}" style="width: 50px; height: 50px;"></div><span>' + WA.tr("msgFlashInstall") + "</span>";
  Smiles.maskSmiles = function() {
    var list = [], item;
    var fn = function(nope, nope2, old, code, alt, icq, sticker_ext, sticker_id, sticker_alt) {
      alt = alt || "";
      if(icq) {
        code = icqSmilesHash[icq];
        if(!code) {
          code = 999;
          alt = icq
        }
      }else {
        if(old) {
          code = old
        }
      }
      if(sticker_ext && sticker_id) {
        item = {ext:sticker_ext, id:sticker_id, alt:sticker_alt}
      }else {
        item = {code:code, alt:alt}
      }
      list.push(item);
      return U.String.format(MARK_FORMAT, list.length - 1)
    };
    return function(text) {
      initSmileData();
      list = [];
      return{text:text.replace(maskSmilesRE, fn), list:list}
    }
  }();
  Smiles.getFormattedSmileByCode = function(code) {
  };
  Smiles.processMessage = function() {
    var re = new RegExp("(" + [SMILE_STR_RE1, SMILE_STR_RE2, SMILE_MARK_RE, STICKER_RE].join("|") + ")", "g");
    var list = [];
    var lastFlash = null;
    var fn = function(nope, nope2, old, code, alt, index, sticker_ext, sticker_id, sticker_alt) {
      loadSmileCssPackage();
      alt = alt || "";
      if(list[index]) {
        if(list[index].ext) {
          sticker_ext = list[index].ext;
          sticker_id = list[index].id;
          sticker_alt = list[index].alt
        }else {
          code = list[index].code;
          alt = list[index].alt
        }
      }else {
        code = code || old
      }
      var smile = getSmileById(code);
      var retval = "";
      if(smile) {
        var format = smile.swf ? WA.hasFlash && FLASH_FORMAT || NO_FLASH_FORMAT : SMILE_FORMAT;
        retval = U.String.format(format, smile.name, smile.tip, code)
      }else {
        if(alt) {
          retval = U.String.htmlEntity(alt)
        }
      }
      if(sticker_ext && sticker_id) {
        retval = U.String.format(STICKER_FORMAT, sticker_ext, sticker_id, sticker_alt)
      }
      lastFlash = smile && smile.swf && code || null;
      return retval
    };
    Smiles.getLastFlash = function() {
      return lastFlash
    };
    return function(text) {
      list = [];
      lastFlash = null;
      if(text.list) {
        list = text.list;
        text = text.text
      }
      var retval = text.replace(re, fn);
      retval = retval.replace(/ (\s+)/g, function(m, spaces) {
        return(new Array(spaces.length + 1)).join("&nbsp;")
      });
      return retval
    }
  }();
  Smiles.recoilProccessedMessage = function() {
    var obj;
    var smilesCb = function(all, name, setId, objId) {
      obj = Smiles.getSmileObjByName(name);
      if(obj.alt.indexOf("###") >= 0) {
        return obj.alt
      }else {
        return"<SMILE>id=" + obj.id + " alt='" + obj.alt + "'</SMILE>"
      }
    };
    var smilesRegExp = /<img[^>]*class="[-_\w\d\s]*nwa\-([\-_\w\d]+_obj(\d+))[^>]*>/gi;
    return function(text) {
      text = text.replace(smilesRegExp, smilesCb);
      return text
    }
  }();
  Smiles.stripTagsRE = /<[^>]+>/g;
  Smiles.stripTagsExceptSmilesCb = function(m) {
    if(m.indexOf("nwa-smile_inline") >= 0) {
      return m
    }
    return""
  };
  Smiles.stripTagsExceptSmiles = function(text) {
    return text.replace(Smiles.stripTagsRE, Smiles.stripTagsExceptSmilesCb)
  };
  var smilesLoaded = false;
  function loadSmileCssPackage() {
    if(smilesLoaded) {
      return
    }
    smilesLoaded = true;
    var head = document.getElementsByTagName("head")[0];
    if(!head) {
      return
    }
    var el = head.getElementsByTagName("*")[0];
    if(!el) {
      return
    }
    var style = document.createElement("link");
    style.type = "text/css";
    style.rel = "stylesheet";
    style.href = WA.resDomain + WA.resPath + "/smiles.css";
    head.insertBefore(style, el)
  }
  return;
  if(WA.isDebug) {
    var assertEquals = function(testId, expected, actual) {
      if(expected !== actual) {
        alert(["[Smiles.js] " + testId + " test failed", "Expected:\n" + expected, "Actual:\n" + actual].join("\n\n"))
      }
    };
    (function() {
      var expected = U.Array.transform(DATA, function(entry) {
        return entry.html
      }).join(" ");
      var actual = U.Array.transform(DATA, function(entry) {
        return":" + entry.title + ":"
      }).join(" ");
      actual = Smiles.processText(actual);
      assertEquals("processText", expected, actual)
    })();
    (function() {
      var mySmiles = [DATA[0], DATA[35], DATA[39]];
      var expected = U.Array.transform(mySmiles, function(entry) {
        return U.String.format(IMAGE_FORMAT, entry.path, entry.title)
      }).join(" ");
      var actual = U.Array.transform(mySmiles, function(entry) {
        return entry.html
      }).join(" ");
      actual = U.String.htmlEntity(actual);
      actual = Smiles.processMessage(actual);
      assertEquals("processMessage", expected, actual)
    })()
  }
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var Dlg = WA.DialogsAgent.RemoveContactDialog = WA.extend(WA.ui.Window, {closeAction:"hide", constructor:function(config) {
    config = config || {};
    Dlg.superclass.constructor.call(this, {cls:"nwa-dlg-remove", fadeIn:true, modal:true, title:"", autoRender:config.autoRender || false, bbar:["->", {cls:"nwa-button_blue", text:config.okButton || "OK", handler:function() {
      this._fireOkEvent()
    }, scope:this}, {cls:"nwa-button_blue", text:WA.tr("box.cancel"), handler:function() {
      this.close()
    }, scope:this}]});
    this.okEvent = new WA.util.Event;
    this.cancelEvent = new WA.util.Event
  }, _onRender:function(ct) {
    Dlg.superclass._onRender.call(this, ct);
    this.body.createChild({tag:"span"})
  }, _onHide:function() {
    Dlg.superclass._onHide.call(this);
    if(this._ok !== true) {
      this.cancelEvent.fire()
    }
  }, show:function(msg) {
    this._ok = false;
    Dlg.superclass.show.call(this);
    this.body.first().update(msg)
  }, _fireOkEvent:function() {
    this._ok = true;
    this.okEvent.fire();
    this.close()
  }})
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var Dlg = WA.DialogsAgent.AuthContactDialog = WA.extend(WA.ui.Window, {closeAction:"_handleClose", buttonsConfig:[{cls:"nwa-button_blue nwa-dlg-auth__add-contact", action:"add", text:'<span class="nwa-dlg-auth__add-contact-label">' + WA.tr("box.grantAuth") + "</span>"}, {cls:"nwa-button_blue", action:"cancel", text:WA.tr("box.cancel")}, {cls:"nwa-button_link", action:"ignore", text:WA.tr("box.ignore")}, {cls:"nwa-button_link", action:"spam", text:WA.tr("box.spam")}], constructor:function(config) {
    config = config || {};
    var items = [];
    U.Array.each(this.buttonsConfig, function(button) {
      items.push(new WA.ui.Button({cls:button.cls, handler:function() {
        this._fireOkEvent(button.action)
      }, scope:this, text:button.text}))
    }, this);
    Dlg.superclass.constructor.call(this, {cls:"nwa-dlg-auth", fadeIn:true, title:"", autoRender:config.autoRender || false, modal:true, items:items});
    this.okEvent = new WA.util.Event
  }, _onRender:function(ct) {
    Dlg.superclass._onRender.call(this, ct);
    this.body.createChild([{tag:"div", cls:"nwa-dlg-auth__title"}, {tag:"div", cls:"nwa-dlg-auth__avatar"}])
  }, _onShow:function() {
    Dlg.superclass._onShow.call(this);
    this.body.first().update('<span class="nwa-special-nick">' + U.String.htmlEntity(this._meta.nick) + "</span> " + WA.tr("box.askedAuth"));
    var previewUrl = WA.makeAvatar(this._meta.mail, "_avatar32");
    this.body.first().next().setStyle("background-image", "url(" + previewUrl + ")")
  }, _fireOkEvent:function(action) {
    this.okEvent.fire(action);
    this.hide()
  }, _handleClose:function() {
    this._fireOkEvent("cancel")
  }, setMeta:function(meta) {
    this._meta = meta
  }})
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var ConnectionRoster = WA.conn.ConnectionRoster;
  var zodiac = [["ololo", WA.tr("zodiac.ololo")], ["aries", WA.tr("zodiac.aries")], ["taurus", WA.tr("zodiac.taurus")], ["gemini", WA.tr("zodiac.gemini")], ["cancer", WA.tr("zodiac.cancer")], ["leo", WA.tr("zodiac.leo")], ["virgo", WA.tr("zodiac.virgo")], ["libra", WA.tr("zodiac.libra")], ["scorpio", WA.tr("zodiac.scorpio")], ["sagittarius", WA.tr("zodiac.sagittarius")], ["capricorn", WA.tr("zodiac.capricorn")], ["aquarius", WA.tr("zodiac.aquarius")], ["pisces", WA.tr("zodiac.pisces")]];
  for(var months = [], i = 0;i <= 12;) {
    months.push(WA.tr(i++, {scope:"month_gen"}))
  }
  var Abstraction = WA.extend(ConnectionRoster, {constructor:function() {
    Abstraction.superclass.constructor.apply(this);
    this.updateEvent = new U.Event
  }, get:function(mail) {
    if(this._mail != mail) {
      this._mail = mail;
      WA.conn.Socket.send("wp", {email:this._mail, uniq:this._uniq = Math.round(Math.random() * 999999)})
    }
  }, _onConnectionWp:function(value) {
    if(value.uniq && value.uniq == this._uniq) {
      if(value.result) {
        var index = U.Array.indexOfBy(value.result, function(v) {
          if(v.email == this._mail) {
            return true
          }
        }, this);
        if(index != -1) {
          this.updateEvent.fire(value.result[index])
        }
      }else {
        if(value.error) {
        }
      }
    }
  }});
  WA.Profile = WA.extend(WA.ui.Component, {constructor:function(isAddEnabled, config) {
    WA.Profile.superclass.constructor.call(this, config);
    this.initialConfig.hideOnEscape = true;
    this._isAddEnabled = isAddEnabled;
    this._abstraction = new Abstraction;
    this._abstraction.updateEvent.on(this._onUpdate, this);
    this.addEvent = new U.Event
  }, show:function(mail, data, isSuggest) {
    this._isSuggest = isSuggest;
    if(this._mail != mail) {
      this._mail = mail;
      this._mailParts = this._mail.match(/([^@]+)@([^\.]+)/);
      this._reset();
      this._data = data
    }
    WA.Profile.superclass.show.apply(this)
  }, _onShow:function() {
    WA.Profile.superclass._onShow.apply(this, arguments);
    if(!this._done) {
      if(!this._data) {
        this._abstraction.get(this._mail)
      }else {
        this._onUpdate(this._data)
      }
      if(!this._userPicLoaded) {
        this._userPicLoaded = true;
        this._updateImage()
      }
    }
  }, _onRender:function(el) {
    this.el = el.createChild({cls:"nwa-wp", children:[{}, {cls:"nwa-wp__plate", children:[{cls:"nwa-wp__white", children:[{cls:"nwa-wp__userpic"}, {cls:"nwa-wp__info"}, {cls:"nwa-wp__line"}, {cls:"nwa-wp__more"}]}, {tag:"button", cls:"nwa-button nwa-button_blue nwa-wp__add-button", children:[{tag:"span", cls:"nwa-toolbar__add-contact-label", children:WA.tr("profile.addContact")}]}, {tag:"button", cls:"nwa-button nwa-button_blue nwa-wp__cancel-button", html:WA.tr("profile.close")}]}]});
    this.el.first().on("click", this._onCloseButton, this);
    var el = this.el.first().next().first();
    this._userpicEl = el.first();
    this._infoEl = this._userpicEl.next();
    this._moreEl = this._infoEl.next().next();
    this._addButtonEl = el.next().on("click", this._onAddButton, this);
    if(this._isAddEnabled) {
      this._addButtonEl.show()
    }
    el.next().next().on("click", this._onCloseButton, this);
    this._nameBox = new WA.ui.NameBox;
    this._nameBox.render(el);
    this._reset()
  }, _reset:function() {
    this._clearImage();
    var loading = "<span>" + WA.tr("dialog.loading") + "</span>";
    this._nameBox.setName("");
    this._infoEl.update(loading);
    this._moreEl.update(loading);
    this._userPicLoaded = false;
    this._done = false
  }, _onAddButton:function() {
    if(this.done) {
      this.addEvent.fire(this._mail, this._name, this._isSuggest)
    }
  }, _onCloseButton:function() {
    this.hide()
  }, _clearImage:function() {
    this._userpicEl.setStyle({"background-image":"none"})
  }, _updateImage:function() {
    this._userpicEl.setStyle({"background-image":"url(" + WA.makeAvatar(this._mail, "_avatar") + ")"})
  }, _onUpdate:function(data) {
    var name = [];
    data.firstname && name.push(data.firstname);
    data.lastname && name.push(data.lastname);
    name = name.length && name.join(" ") || data.nickname || this._mail;
    this._name = name;
    var isUIN = this._mail.indexOf("@uin.icq") != -1;
    if(data.birthday) {
      var now = new Date;
      var shortYear = now.getFullYear() - 2E3;
      var date = data.birthday.split("-");
      if(date[0].length == 2 && date[0] > shortYear) {
        date[0] = "19" + date[0]
      }else {
        if(date[0].length == 2 && date[0] <= shortYear) {
          date[0] = "20" + date[0]
        }
      }
      var birthday = new Date(date[0], date[1] - 1, date[2]);
      var age = now.getFullYear() - birthday.getFullYear();
      var bday = new Date("" + now.getFullYear() + data.birthday.replace(/^\d+/, ""));
      if(bday > now) {
        age--
      }
      var bdayStr = date[2] + " " + months[+date[1]] + " " + date[0]
    }
    var status = isUIN ? "icq_online" : "online";
    var statusTitle = WA.tr("status.online");
    var sa = "";
    if(data.sex || age) {
      sa = U.String.format("<br><span>{0}{2}{1}</span><br>", ["", WA.tr("sex.m"), WA.tr("sex.f")][data.sex || 0], age ? WA.tr("time.years", {count:age}) : "", data.sex && age ? " - " : "")
    }
    var format = '{1}<div class="nwa-wp__status {2}">{3}</div>' + (isUIN ? "" : '<a href="http://my.mail.ru/{4}/{5}/" target="_blank">' + WA.tr("dialog.tools.moyMir") + '</a> <a href="http://foto.mail.ru/{4}/{5}/" target="_blank">' + WA.tr("dialog.tools.photo") + '</a> <a href="http://maps.mail.ru/?units&origin=webagent" target="_blank">' + WA.tr("dialog.tools.map") + "</a>");
    this._nameBox.setName(name);
    this._infoEl.update(U.String.format(format, "", sa, WA.buildIconClass(status, true), statusTitle, this._mailParts[2], this._mailParts[1]));
    var more = [], horoUrl;
    if(data.birthday) {
      horoUrl = "http://horo.mail.ru/prediction/" + zodiac[data.zodiac][0] + "/today/";
      more.push(U.String.format("<span>" + WA.tr("profile.birthdate") + ":</span><br>{0}{1}", bdayStr || "", data.zodiac ? ' / <a class="nwa-wp__zodiac nwa-wp__zodiac_' + data.zodiac + '" href="' + horoUrl + '" target="_blank">' + zodiac[data.zodiac][1] + "</a>" : ""))
    }
    var title = WA.tr("profile.email") + ":";
    var mail = this._mail;
    if(isUIN) {
      title = "UIN:";
      mail = mail.replace("@uin.icq", "")
    }
    format = "<span>{1}</span><br/>" + (isUIN ? "{0}" : '<a href="mailto:{0}">{0}</a>');
    more.push(U.String.format(format, mail, title));
    if(data.location) {
      more.push(U.String.format("<span>" + WA.tr("profile.home") + ':</span><br><div class="nwa-wp__location" title="{0}">{0}<div class="nwa-wp__location-fader"></div></div>', U.String.htmlEntity(data.location)))
    }
    this._moreEl.update(more.join("<br><br>"));
    this.done = true
  }})
})();
(function() {
  var WA = WebAgent;
  WA.PhotoPreview = WA.extend(WA.ui.Component, {initComponent:function() {
    WA.PhotoPreview.superclass.initComponent.apply(this);
    this.initialConfig.hideOnEscape = true;
    this.mail = this.initialConfig.mail || null
  }, _onRender:function(ct) {
    this.el = ct.createChild({tag:"div", cls:"nwa-ppreview" + (this.initialConfig.fadeIn && !WA.isIE ? " nwa_fadein" : ""), children:[{tag:"div", cls:"nwa-ppreview__img ", children:{tag:"div", cls:"nwa-ppreview__close"}}]});
    this.el.on("click", this.hide, this);
    if(this.mail) {
      this._renderPhoto()
    }
  }, show:function(mail) {
    WA.PhotoPreview.superclass.show.apply(this);
    if(mail && this.mail != mail) {
      this.mail = mail;
      this._renderPhoto()
    }
  }, _onHide:function(me) {
    WA.PhotoPreview.superclass._onHide.apply(this)
  }, _renderPhoto:function() {
    var previewUrl = WA.makeAvatar(this.mail, "_avatar180");
    this.el.last().setStyle("background-image", "url(" + previewUrl + ")")
  }})
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var Dlg = WA.DialogsAgent.AlertDialog = WA.extend(WA.ui.Window, {closeAction:"hide", constructor:function(config) {
    config = config || {};
    Dlg.superclass.constructor.call(this, {cls:"nwa-dlg-remove", fadeIn:true, title:"", autoRender:config.autoRender || false, modal:true, bbar:["->", {cls:"nwa-button_blue", text:WA.tr("box.ok"), handler:this.close, scope:this}]})
  }, _onRender:function(ct) {
    Dlg.superclass._onRender.call(this, ct);
    this.body.createChild({tag:"span"})
  }, show:function(msg) {
    Dlg.superclass.show.call(this);
    this.body.first().update(msg || WA.tr("msgTooLong"));
    try {
      this.closeBtn.el.dom.focus()
    }catch(e) {
    }
  }})
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var LOAD_FAIL_TIMEOUT = 4E3;
  var POLLING_PERIOD = 200;
  var swfLoaded = [], loadCheckTimeout = 0, checkingCount, ieCloseTimer = 0;
  function isLoaded(swfUrl) {
    return U.Array.indexOf(swfLoaded, swfUrl) > -1
  }
  function checkSwfLoading(e, callback) {
    var fn = function() {
      checkingCount++;
      if(typeof e.ref.PercentLoaded !== "undefined" && e.ref.PercentLoaded()) {
        if(e.ref.PercentLoaded() === 100) {
          callback(true)
        }else {
          if(checkingCount > LOAD_FAIL_TIMEOUT / POLLING_PERIOD) {
            callback(false)
          }else {
            loadCheckTimeout = WA.setTimeout(fn, POLLING_PERIOD)
          }
        }
      }else {
        loadCheckTimeout = WA.setTimeout(fn, POLLING_PERIOD)
      }
    };
    loadCheckTimeout = WA.setTimeout(fn, POLLING_PERIOD)
  }
  function resetSwfLoading() {
    clearTimeout(loadCheckTimeout);
    clearTimeout(ieCloseTimer)
  }
  WA.SwfPreview = WA.extend(WA.ui.Component, {initComponent:function() {
    WA.SwfPreview.superclass.initComponent.apply(this);
    this.initialConfig.hideOnEscape = true;
    this.readyToLoad = false;
    this.failLoadEvent = new U.Event
  }, _onRender:function(ct) {
    this.swfId = "swfbrdg_" + Math.random().toString().substr(2);
    this.el = ct.createChild({tag:"div", cls:"nwa-ppreview" + (this.initialConfig.fadeIn && !WA.isIE ? " nwa_fadein" : "")});
    this.el.on("mousedown", function(e) {
      this.hide()
    }, this);
    window[this.swfId + "_DoFSCommand"] = WA.createDelegate(this.closeSwf, this)
  }, preview:function(swfUrl, duration) {
    if(!WA.hasFlash) {
      return
    }
    if(!this.rendered) {
      this.render(this.autoRender)
    }
    if(this.readyToLoad) {
      resetSwfLoading()
    }
    this.readyToLoad = true;
    this.swfDuration = duration || 0;
    this.swfUrl = swfUrl;
    this._renderPhoto();
    this.show()
  }, show:function() {
    WA.SwfPreview.superclass.show.apply(this)
  }, _onHide:function(me) {
    resetSwfLoading();
    WA.SwfPreview.superclass._onHide.apply(this);
    WA.util.swf.removeSWF(this.swfId)
  }, _renderPhoto:function() {
    WA.util.swf.removeSWF(this.swfId);
    this.el.createChild({id:this.swfId, tag:"div"});
    WA.util.swf.embedSWF(this.swfUrl, this.swfId, "298", "298", "7", false, false, {name:this.swfId, allowScriptAccess:"always", wmode:"transparent", loop:"false"}, {"class":"nwa-mult-preview nwa_self"}, WA.createDelegate(this._onSwfCreate, this))
  }, _onSwfCreate:function(e) {
    var fn = WA.createDelegate(function(success) {
      if(success) {
        if(!isLoaded(this.swfUrl)) {
          swfLoaded.push(this.swfUrl)
        }
        this._onSwfLoad()
      }else {
        this._onSwfLoad(false)
      }
    }, this);
    if(e.success) {
      if(isLoaded(this.swfUrl)) {
        fn(true)
      }else {
        checkSwfLoading(e, fn)
      }
    }else {
      fn(false)
    }
  }, _onSwfLoad:function(status) {
    this.readyToLoad = false;
    if(status === false) {
      this.hide();
      this.failLoadEvent.fire()
    }else {
      this.show();
      if(WA.isIE && this.swfDuration > 0) {
        ieCloseTimer = WA.setTimeout(this.hide, this.swfDuration, this)
      }
    }
  }, closeSwf:function(com, args) {
    if(com == "magent" && args == "end") {
      this.hide()
    }
  }, destroy:function() {
    resetSwfLoading();
    WA.SwfPreview.superclass.destroy.call(this);
    window[this.swfId + "_DoFSCommand"] = null
  }})
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var JSON = WA.getJSON();
  function addUrlParametr(url, uniq) {
    url = url.replace(/wa_embedlogin=\d+(\&?)/g, "");
    var sep = url.indexOf("?") != -1 ? "&" : "?";
    url += sep + "wa_embedlogin=" + uniq;
    url = url.replace(/\&\&\&*/, "&").replace(/\?\&/, "?");
    return url
  }
  function makeLoginToken() {
    var uniq = Math.round(Math.random() * 999999);
    var tokens = JSON.parse(localStorage.waLoginTokens || "{}");
    tokens[uniq] = 1;
    localStorage.waLoginTokens = JSON.stringify(tokens);
    return uniq
  }
  var haveLoginToken = false;
  function checkLoginToken() {
    if(haveLoginToken) {
      return true
    }else {
      var loc = "" + document.location;
      var t = loc.match(/wa_embedlogin=(\d+)/);
      if(t) {
        var uniq = t[1];
        var tokens = JSON.parse(localStorage.waLoginTokens || "{}");
        if(tokens[uniq]) {
          haveLoginToken = true;
          delete tokens[uniq];
          localStorage.waLoginTokens = JSON.stringify(tokens);
          return true
        }
      }
    }
    return false
  }
  var pageToken;
  var AuthForm = WA.AuthForm = WA.Activatable.extend(WA.ui.Component, {_onRender:function(ct) {
    pageToken = makeLoginToken();
    var back = ("" + document.location).match(/([^\/]+)\.mail\.ru\/(.*)$/);
    this.el = ct.createChild({tag:"div", cls:"nwa-agent nwa-authform", children:[{tag:"div", cls:"nwa-agent__shadow", children:[{tag:"div", id:"nwaHeader", cls:"nwa-header", children:[{tag:"div", id:"nwaNick", cls:"nwa-header__nick", children:[{tag:"span", children:WA.tr("auth.authorization")}]}, {tag:"div", cls:"nwa-header__mini", id:"newAuthMinimize", title:WA.tr("auth.minimize")}]}, {tag:"div", id:"nwaClist", cls:"nwa-clist", children:{tag:"form", method:"POST", id:"nwaAuthForm", action:"//win.mail.ru/cgi-bin/auth", 
    children:[{tag:"input", type:"text", name:"Login", id:"nwaAuthLogin", cls:"nwa-auth-login", tabindex:"1", placeholder:WA.tr("auth.email")}, {tag:"input", type:"password", name:"Password", id:"nwaAuthPass", cls:"nwa-auth-pass", tabindex:"3", placeholder:WA.tr("auth.password")}, {tag:"input", type:"hidden", name:"Page", id:"nwaAuthPage"}, {tag:"input", type:"hidden", name:"FailPage", id:"nwaAuthFailPage"}, {tag:"input", type:"hidden", name:"level", checked:"checked", id:"nwaAuthLevel"}, {cls:"nwa-auth-checkcover nwa-auth-checkcover-checked", 
    id:"nwaAuthCheckCover"}, {cls:"nwa-auth-level", children:WA.tr("auth.rememberMe"), id:"nwaAuthCheckText"}, {tag:"a", cls:"nwa-auth-forget", href:"//e.mail.ru/cgi-bin/passremind", children:WA.tr("auth.lostPassword")}, {cls:"nwa-auth-submit", tag:"button", type:"submit", tabindex:"4"}, {cls:"nwa-auth-title", children:WA.tr("auth.authorization")}, {tag:"select", name:"Domain", id:"nwaAuthDomain", cls:"nwa-auth-domain", tabindex:"2", children:[{tag:"option", value:"mail.ru", children:"@mail.ru", 
    selected:"selected"}, {tag:"option", value:"inbox.ru", children:"@inbox.ru"}, {tag:"option", value:"bk.ru", children:"@bk.ru"}, {tag:"option", value:"list.ru", children:"@list.ru"}]}]}}]}]})
  }, _onAfterRender:function() {
    WA.get("newAuthMinimize").on("click", this.hide, this);
    this.el.on("mousedown", function(ev) {
      ev.stopPropagation()
    }, this);
    WA.getBody().on("mousedown", this.hide, this);
    this._checkTextEl = WA.get("nwaAuthCheckText").on("click", this._toggleLevelCheck, this);
    this._checkCoverEl = WA.get("nwaAuthCheckCover").on("click", this._toggleLevelCheck, this);
    this._levelEl = WA.get("nwaAuthLevel");
    this._pageEl = WA.get("nwaAuthPage");
    this._failPageEl = WA.get("nwaAuthFailPage");
    this._loginEl = WA.get("nwaAuthLogin");
    this._passEl = WA.get("nwaAuthPass");
    this._domainEl = WA.get("nwaAuthDomain");
    WA.get("nwaAuthForm").on("submit", function() {
      var backUrl = addUrlParametr("" + document.location, pageToken);
      this._pageEl.setAttribute("value", document.location.protocol + "//r.mail.ru/clb1203896/" + document.location.host + backUrl.replace(/https?:\/\/[^\/]+/, ""));
      this._failPageEl.setAttribute("value", "https://r.mail.ru/clb1203897/e.mail.ru/cgi-bin/login?email=" + U.String.htmlEntity(this._loginEl.dom.value + "@" + this._domainEl.dom.value) + "&fail=1&page=" + U.String.htmlEntity(encodeURIComponent(backUrl)))
    }, this);
    this.isPlaceholderSupported = "placeholder" in document.createElement("input");
    if(!this.isPlaceholderSupported) {
      this._placeholderFallback()
    }
  }, _placeholderFallback:function() {
    this._loginEl.on("focus", this._onInputFocus, this);
    this._loginEl.on("blur", this._onInputBlur, this);
    this._passEl.on("focus", this._onInputFocus, this);
    this._passEl.on("blur", this._onInputBlur, this);
    var loginPlaceholder = this._loginEl.getAttribute("placeholder"), passPlaceholder = this._passEl.getAttribute("placeholder");
    this._loginEl.setAttribute("value", loginPlaceholder);
    this._passEl.setAttribute("value", passPlaceholder)
  }, _onInputFocus:function(e) {
    var input = e.getTarget(), placeholder = input.getAttribute("placeholder");
    if(input.value === placeholder) {
      input.value = ""
    }
  }, _onInputBlur:function(e) {
    var input = e.getTarget(), placeholder = input.getAttribute("placeholder");
    if(U.String.trim(input.value) === "") {
      input.value = placeholder
    }
  }, _toggleLevelCheck:function() {
    this._checkCoverEl.toggleClass("nwa-auth-checkcover-checked");
    if(this._checkCoverEl.hasClass("nwa-auth-checkcover-checked")) {
      this._levelEl.setAttribute("checked", "checked")
    }else {
      this._levelEl.removeAttribute("checked")
    }
  }, _onShow:function() {
    U.Mnt.countRB(1203895)
  }});
  AuthForm.haveLoginToken = function() {
    return checkLoginToken(false)
  };
  AuthForm.removeLoginToken = function() {
    return checkLoginToken(true)
  }
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  WA.buttons = {};
  var SB = WA.buttons.StatusButton = WA.extend(WA.ui.TabButton, {constructor:function(config) {
    config.clickEvent = "mousedown";
    this._status = null;
    this._newMsgFlag = false;
    SB.superclass.constructor.call(this, config)
  }, setStatus:function(status) {
    if(this._status != status) {
      this.el.first().first().removeClass(WA.buildIconClass(this._status)).addClass(WA.buildIconClass(status));
      this._status = status;
      this.setInfo("")
    }
    this.updateIcon()
  }, getStatus:function() {
    return this._status || null
  }, setInfo:function(text) {
    this.el.setAttribute("title", text)
  }, setNewMsgFlag:function(show) {
    this._newMsgFlag = show !== false;
    this.updateIcon()
  }, setPopupMode:function(mode) {
    if(mode) {
      this.setStatus("popup")
    }else {
      this.setStatus(this._status)
    }
  }, getPopupMode:function() {
    return this._status && this._status.indexOf("popup") == 0
  }, setCount:function(count) {
    if(count && this._count != count) {
      this._count = count
    }
  }, updateIcon:function() {
    var disableTab = this._status == "offline" || this._status == "gray" || this._status == "yellow";
    this.el.toggleClass("nwa-button-tab_disabled", disableTab);
    var showNewMsgIcon = this._newMsgFlag && !this.getPopupMode() && !disableTab;
    this.el.first().first().toggleClass("wa-cl-status-message-blink", showNewMsgIcon)
  }})
})();
(function() {
  var WA = WebAgent;
  var Storage = WA.Storage;
  var U = WA.util;
  var US = WA.conn.UserState;
  var SOCK = WA.conn.Socket;
  var FM = WA.FocusManager;
  var MENU = WA.ui.menu;
  var AuthForm = WA.AuthForm;
  var POPUP_URL = (WA.isLocalhost ? "/popup.html?" : "http://webagent.mail.ru/r/webagent/popup.html?") + (WA.useLang ? "wa_lang=" + WA.useLang : "") + (WA.usedBranch != "master" ? "&branch=" + WA.usedBranch : "");
  var StatusButton = WA.extend(WA.buttons.StatusButton, {constructor:function() {
    StatusButton.superclass.constructor.apply(this, arguments);
    this.sectionclickEvent = new U.Event
  }, _onRender:function() {
    StatusButton.superclass._onRender.apply(this, arguments);
    this._sectionEl = this.el.createChild({cls:"nwa-status-button__section", children:{tag:"span"}})
  }, _onAfterRender:function() {
    StatusButton.superclass._onAfterRender.apply(this, arguments);
    this._sectionEl.on("mousedown", this._onSectionMouseDown, this);
    this._sectionEl.on("click", this._onSectionClick, this)
  }, _onSectionMouseDown:function(e) {
    e.stopPropagation()
  }, _onSectionClick:function(e) {
    this.sectionclickEvent.fire();
    U.Mnt.countRB(1190981)
  }});
  var StatusMenu = WA.extend(MENU.Menu, {render:function(ct) {
    var container = WA.get(ct);
    var el = container.createChild({tag:"div", cls:"nwa-status-menu-root"});
    StatusMenu.superclass.render.call(this, el)
  }});
  var StatusMenuItem = WA.extend(MENU.Button, {constructor:function(config) {
    config.owner = this;
    config.iconCls = WA.buildIconClass(config.status);
    config.text = U.String.htmlEntity(config.text);
    StatusMenuItem.superclass.constructor.call(this, config)
  }, _onAfterRender:function() {
    this.setText(this._text);
    return StatusMenuItem.superclass._onAfterRender.apply(this, arguments)
  }, setText:function(text) {
    this.button.setText(U.String.htmlEntity(text))
  }, getText:function() {
    return U.String.entityDecode(this.button.getText())
  }, setStatus:function(status) {
    this.initialConfig.status = status;
    this.button.setIconCls(WA.buildIconClass(status))
  }, getStatus:function() {
    return this.initialConfig.status
  }});
  var StatusEssence = WA.extend(WA.ui.Component, {constructor:function() {
    StatusEssence.superclass.constructor.apply(this, arguments);
    if(US.isValidUser()) {
      this._active = undefined;
      this._checkDocumentReady(this._documentReady, this)
    }else {
      if(WA.allowAuth) {
        this._checkDocumentReady(function() {
          this.statusButton = new StatusButton({cls:"nwa-button-tab_agent nwa-button-tab_disabled", text:WA.tr("mainTitle"), handler:function(nope, event) {
            this._showAuthDialog();
            event.stopEvent()
          }, scope:this});
          this._makeElRoot();
          this.statusButton.render(this.boundEl);
          this.statusButton.setStatus("offline");
          this.statusButton.show()
        }, this)
      }
    }
    US.permanentShutdownEvent.on(this._onPermanentShutdown, this);
    US.networkErrorEvent.on(this._errorMode, this)
  }, _checkDocumentReady:function(cb, scope) {
    if(document.body) {
      cb && cb.call(scope || window)
    }else {
      WA.setTimeout(WA.createDelegate(cb, scope), 10)
    }
  }, _documentReady:function() {
    this._onDocumentReady();
    Storage.init();
    Storage.whenReady(this._onStorageInit, this)
  }, _onStorageInit:function() {
    WA.debug.Console.log("_onStorageInit");
    this.syncStatus = WA.Synchronizer.registerComponent("status", ["status", "custom"], false);
    this.syncStatus.read(function(data) {
      var status = data.get("status") || "";
      WA.debug.Console.log("STATUS: read, ", status);
      var s = status.split(":");
      this._statusModifDate = s[0];
      WA.Synchronizer.startUp();
      WA.debug.Console.log("Synchronizer.startUp")
    }, this);
    this.syncStatus.triggerEvent.on(function(data) {
      if(data.isChanged("custom")) {
        this.__statusTitle = data.get("custom")
      }
      if(data.isChanged("status")) {
        var status = data.get("status");
        var s = status.split(":");
        var customTitle = this.__statusTitle;
        if(this._statusModifDate != s[0]) {
          this._statusModifDate = s[0];
          this._onSyncStatus(s[1], customTitle);
          WA.debug.Console.log("STATUS: sync, ", status)
        }else {
          WA.debug.Console.log("STATUS: sync again, ", status)
        }
        if(s[1] != "offline") {
          U.Mnt.rbCountOpen()
        }
      }
    }, this);
    SOCK.requestReadyEvent.on(this._onSocketRequestable, this);
    US.init();
    US.statusChangedEvent.on(this._onUserStateStatusChange, this);
    US.getState(this._setInitialState, this)
  }, _setInitialState:function(state, param) {
    if(!state) {
      FM.activate()
    }else {
      if(state == "error") {
        this._errorMode(param)
      }else {
        if(state == "online") {
          WA.XDRequest.getInstance(US.getForcedJim() || US._jimDomain);
          this._activate(function() {
            this.syncStatus.read(function(data) {
              var s = data.get("status").split(":");
              var customTitle = data.get("custom");
              this._statusModifDate = s[0];
              this._onStatusChange(s[1], customTitle);
              this._listenFM()
            }, this)
          }, this);
          this._initPromoSms()
        }else {
          if(state == "disabled") {
            WA.Synchronizer.stop();
            this.el && this.el.hide();
            return
          }else {
            if(WA.AuthForm.haveLoginToken()) {
              FM.activate()
            }else {
              this._deactivate();
              this._onStatusChange("offline");
              this._listenFM();
              return
            }
          }
        }
      }
    }
  }, _errorMode:function(attemptDelay) {
    this._onErrorMode();
    if(this._active || this._active === undefined) {
      this._active = false;
      SOCK.discardEvents();
      FM.deactivate();
      WA.UserAttend.deactivate()
    }
    this._onStatusChange("yellow");
    this.statusButton.setInfo(WA.tr("msgNetworkError", {delay:attemptDelay}));
    this._requestableCb = WA.createDelegate(this._activate, this);
    FM.activate()
  }, _onPermanentShutdown:function(event) {
    if(this.isPermanentShutdown) {
      return
    }
    this._disableUserEvents();
    WA.Synchronizer.stop();
    this._deactivate();
    if(event && event.isShowInfo) {
      this.statusButton.setStatus("gray");
      this.statusButton.setInfo(event.info);
      this.statusMenu.beforeShowEvent.on(function() {
        return false
      })
    }else {
      if(event && event.reason == "showAuthForm") {
        this.statusButton.setStatus("offline");
        this.statusButton.show()
      }else {
        this.el.hide()
      }
    }
    this.isPermanentShutdown = true;
    this._promoSms && this._promoSms.destroy()
  }, _listenFM:function() {
    if(!this._listenFMFlag) {
      this._listenFMFlag = true;
      WA.debug.Console.log("_listenFM");
      FM.focusEvent.on(this._onFocus, this);
      FM.blurEvent.on(this._onBlur, this);
      FM.ifFocused(this._onFocus, null, this)
    }
  }, _storeStatus:function(status, statusTitle, cb, scope) {
    if(statusTitle) {
      this.syncStatus.write("custom", statusTitle)
    }
    this.syncStatus.write("status", "" + +new Date + ":" + status, cb, scope)
  }, _onSocketRequestable:function() {
    WA.debug.Console.log("socket requestable");
    if(this._requestableCb) {
      this._requestableCb();
      delete this._requestableCb
    }
  }, _onUserStateStatusChange:function(status, statusTitle, readyCb) {
    WA.debug.Console.log("_onUserStateStatusChange ", status, ", isActive:", this._active);
    var setStatusCb = WA.createDelegate(function(cb, scope) {
      this._onStatusChange(status, statusTitle);
      this._storeStatus(status, statusTitle, cb, scope);
      this._listenFM()
    }, this);
    if(status != "offline") {
      if(!this._active) {
        this._requestableCb = WA.createDelegate(function() {
          this._activate(setStatusCb)
        }, this);
        if(SOCK.requestable) {
          this._onSocketRequestable()
        }else {
          SOCK.restore()
        }
        FM.activate(false, false, true)
      }else {
        setStatusCb()
      }
    }else {
      this._deactivate();
      setStatusCb(readyCb);
      this.notify.clear();
      return true
    }
  }, _onSyncStatus:function(status, customTitle) {
    WA.debug.Console.log("_onSyncStatus ", status);
    var setStatusCb = WA.createDelegate(function() {
      this._onStatusChange(status, customTitle);
      this._listenFM()
    }, this);
    if(status != "offline") {
      this._activate(setStatusCb, window, true)
    }else {
      this._deactivate();
      setStatusCb()
    }
  }, _activate:function(readyCb, scope, onSync) {
    if(!this._active) {
      this._active = true;
      WA.debug.Console.log("_activate");
      this._onActivate(function() {
        SOCK.continueEvents();
        FM.activate(false, false, !onSync);
        WA.UserAttend.activate();
        WA.AutoAway.activate();
        WA.WindowFocus.activate();
        readyCb && readyCb.call(scope)
      }, this)
    }else {
      readyCb && readyCb.call(scope || window)
    }
  }, _deactivate:function() {
    delete this._requestableCb;
    if(this._active || this._active === undefined) {
      this._active = false;
      WA.debug.Console.log("_deactivate");
      SOCK.discardEvents();
      FM.deactivate();
      WA.UserAttend.deactivate();
      WA.AutoAway.deactivate();
      WA.WindowFocus.deactivate();
      this._onDeactivate()
    }
  }, _onErrorMode:function(status) {
  }, _onStatusChange:function(status) {
  }, _onActivate:function(cb, scope) {
  }, _onDeactivate:function() {
  }, _onDocumentReady:function() {
  }});
  var DependencyEssence = WA.extend(StatusEssence, {_micblogAlertsOff:false, _statusAlertsOff:true, constructor:function() {
    this.xMenuItems = U.Array.transform(WA.XStatuses.getCurrents(), function(xs, index) {
      return new StatusMenuItem({itemIndex:index, status:xs.type, text:U.String.ellipsis(xs.text, 20), handler:function(thisButton) {
        var thisItem = thisButton.initialConfig.owner;
        this.__changeStatus(thisItem.getStatus(), thisItem.getText())
      }, scope:this})
    }, this);
    WA.XStatuses.updateEvent.on(function(newStatuses) {
      U.Array.each(newStatuses, function(xs, index) {
        var menuItem = this.xMenuItems[index];
        menuItem.setStatus(xs.type);
        menuItem.setText(U.String.ellipsis(xs.text, 20))
      }, this)
    }, this);
    DependencyEssence.superclass.constructor.apply(this, arguments)
  }, _showAuthDialog:function() {
    if(!this._authForm) {
      this._authForm = new AuthForm;
      this._authForm.render(this.boundEl)
    }
    this._authForm.toggle()
  }, __changeStatus:function(status, title) {
    if(this.statusButton.getStatus() == "offline" && status != "offline") {
      this.statusButton.setStatus("yellow")
    }
    WA.conn.UserState.setStatus(status, title);
    U.Mnt.rbCountAction()
  }, _onCountEvent:function(onlineCount) {
    WA.debug.Console.log("_onCountEvent: ", onlineCount);
    this.statusButton.setCount(onlineCount);
    this.sync.write("contact_count", onlineCount)
  }, _userEventEnabled:false, _enableUserEvents:function() {
    if(!this._userEventEnabled) {
      this._userEventEnabled = true;
      this.contactList.enableUserEvents();
      this.dialogsWindow.enableUserEvents();
      WA.debug.Console.log("_enableUserEvents done")
    }
  }, _disableUserEvents:function() {
    if(this._userEventEnabled) {
      this._userEventEnabled = false;
      this.contactList.disableUserEvents();
      this.dialogsWindow.disableUserEvents();
      WA.debug.Console.log("_disableUserEvents")
    }
  }, _toggleStatusMenu:function() {
    if(this.statusMenu && this.statusMenu.rendered) {
      this.statusMenu.toggle()
    }
  }, _createEssences:function() {
    var statusMenu = this.statusMenu = new StatusMenu({fadeIn:true, items:[{iconCls:"nwa-toolbar__status-edit", text:WA.tr("cl.editStatus"), handler:function() {
      WA.XStatuses.openDialog(this.boundEl)
    }, scope:this}, "-"].concat(this.xMenuItems).concat(["-", {iconCls:WA.buildIconClass("online"), text:WA.tr("status.online"), handler:function() {
      this.__changeStatus("online")
    }, scope:this}, {iconCls:WA.buildIconClass("status_chat"), text:WA.tr("status.chat"), handler:function() {
      this.__changeStatus("status_chat")
    }, scope:this}, {iconCls:WA.buildIconClass("away"), text:WA.tr("status.away"), handler:function() {
      this.__changeStatus("away")
    }, scope:this}, {iconCls:WA.buildIconClass("dnd"), text:WA.tr("status.dnd"), handler:function() {
      this.__changeStatus("dnd")
    }, scope:this}, {iconCls:WA.buildIconClass("offline"), text:WA.tr("status.offline"), handler:function() {
      this.__changeStatus("offline")
    }, scope:this}])});
    statusMenu.beforeShowEvent.on(function() {
      statusMenu.getEl().toggleClass("nwa-status-menu_in", !!this._active);
      return!this.statusButton.getPopupMode()
    }, this);
    this.statusButton = new StatusButton({cls:"nwa-button-tab_agent nwa-button-tab_disabled", text:WA.tr("mainTitle"), children:[{tag:"div"}], handler:function(nope, event) {
      var status = this.statusButton.getStatus();
      if(status == "offline" && this.isPermanentShutdown) {
        this._showAuthDialog()
      }else {
        if(this._userEventEnabled) {
          if(status == "offline") {
            this._toggleStatusMenu()
          }else {
            this.contactList.toggle();
            WA.UserAttend.onActivity();
            U.Mnt.rbCountAction()
          }
        }else {
          if(status == "offline") {
            this._toggleStatusMenu()
          }
        }
      }
      event.stopEvent()
    }, scope:this});
    this.contactList = new WA.ContactListAgent;
    this.statusButton.sectionclickEvent.on(this.contactList.toggleDialer, this.contactList);
    this.contactList.contactDataReceivedEvent.on(function(data) {
      this._initPromoSms();
      if(data.length < 2) {
        this._promoSms.checkCLStats()
      }
      this._promoSms.setCLOpen()
    }, this);
    this.contactList.hideEvent.on(function() {
      this.sync.write("clist", "")
    }, this);
    this.contactList.showEvent.on(function() {
      this.sync.write("clist", "1")
    }, this);
    this.contactList.beforeShowEvent.on(function() {
      if(statusMenu.rendered && statusMenu.isVisible()) {
        return false
      }
    }, this);
    this.contactList.abstraction.countEvent.on(this._onCountEvent, this);
    this.contactList.contactSelectEvent.on(function(mail, nick, status, statusTitle, features, phones) {
      this.notify.removeByMail(mail, true);
      this.openDialog(mail, nick, status, statusTitle, features, phones)
    }, this);
    this.contactList.contactSendSmsEvent.on(function(mail, nick, status, statusTitle, features, phones) {
      this.notify.removeByMail(mail, true);
      if(this._userEventEnabled) {
        this.dialogsWindow.openSendSmsDialog(mail, nick, status, statusTitle, features, phones)
      }
    }, this);
    this.contactList.playSoundEvent.on(WA.Beep.unmute, WA.Beep);
    this.contactList.micblogAlertsOptionEvent.on(function(val) {
      this._micblogAlertsOff = val;
      this.notify.abstraction.micblogOff = val
    }, this);
    this.contactList.statusAlertsOptionEvent.on(function(val) {
      this._statusAlertsOff = val
    }, this);
    this.contactList.dialerDialog.hideEvent.on(function() {
      this.el.toggleClass("nwa-root_dialer", false)
    }, this);
    this.contactList.dialerDialog.showEvent.on(function() {
      this.el.toggleClass("nwa-root_dialer", true)
    }, this);
    this.dialogsWindow = new WA.DialogsAgent;
    this.contactList.previewsToggleOptionEvent.on(this.dialogsWindow.togglePreviews, this.dialogsWindow);
    this.contactList.subDialogOpenEvent.on(this.dialogsWindow.minimize, this.dialogsWindow);
    this.dialogsWindow.changeFocusEvent.on(this.contactList.addContactDialog.hide, this.contactList.addContactDialog);
    this.dialogsWindow.countChangedEvent.on(function(count) {
      var focused = this.dialogsWindow.getVisibleDialog();
      if(focused && this.dialogsWindow._view.isFirst(focused.mail)) {
        this.notify.shift()
      }else {
        this.notify.shift(true)
      }
    }, this);
    this.dialogsWindow.updateActivityEvent.on(function(clistData, type) {
      if(type === undefined || type === "activity") {
        this.contactList.abstraction.updateActivity(clistData)
      }else {
        this.contactList.abstraction.updateUnreadContact(clistData, type)
      }
    }, this);
    this.dialogsWindow.unreadedEvent.on(function(count) {
      this.statusButton.setNewMsgFlag(count > 0)
    }, this);
    this.dialogsWindow.removeContactEvent.on(function(mail) {
      this.contactList.abstraction.removeContact(mail);
      this.contactList.abstraction.deleteActivity(mail)
    }, this);
    this.dialogsWindow.deleteActivityEvent.on(function(mail) {
      this.contactList.abstraction.deleteActivity(mail)
    }, this);
    this.dialogsWindow.renameContactEvent.on(function(mail, newNick) {
      this.contactList.abstraction.renameContact(mail, newNick)
    }, this);
    this.dialogsWindow.incomingMessageEvent.on(function() {
      WA.Beep.play("message")
    }, this);
    this.dialogsWindow.updateSelfNickEvent.on(this.contactList.setSelfNick, this.contactList);
    this.dialogsWindow.openAddSearchEvent.on(this.contactList.openAddDialog, this.contactList);
    this.dialogsWindow.requestListEvent.on(this.contactList.abstraction.getPhoneList, this.contactList.abstraction);
    this.contactList.sendSmsEvent.on(this.dialogsWindow.abstraction.postSms, this.dialogsWindow.abstraction);
    this.dialogsWindow.addContactEvent.on(this.contactList.abstraction.addContact, this.contactList.abstraction);
    this.notify = new WA.NotifyAgent;
    this.notify.clickEvent.on(this.openDialog, this);
    this.notify.cancelEvent.on(this.dialogsWindow.markAsReaded, this.dialogsWindow);
    this.notify.onBeforeNotifyEvent.on(function(mail, statusChange) {
      if(this.dialogsWindow.getVisibleDialog().mail == mail) {
        return false
      }
      if(statusChange && (this._statusAlertsOff || U.Array.indexOf(this.dialogsWindow.getOpenDialogs() || [], mail) > -1)) {
        return false
      }
    }, this);
    this.dialogsWindow.visibleDialogChangedEvent.on(function(mail) {
      this.notify.removeByMail(mail)
    }, this);
    this.dialogsWindow.closeTabEventEvent.on(this.notify.removeByMail, this.notify);
    if(!WA.isPopup) {
      WA.getDoc().on("mousedown", function(ev) {
        var target = ev.getTarget(true);
        if(!target.isAncestor(this.el) && !target.hasClass("nwa_self")) {
          this.dialogsWindow.minimize();
          this.contactList.minimize()
        }
      }, this)
    }
  }, openDialog:function(mail, nick, status, statusTitle, features, phones) {
    if(this._userEventEnabled) {
      this.dialogsWindow.openDialog(mail, nick, status, statusTitle, features, phones)
    }else {
      return false
    }
  }, updateBalance:function(obj) {
    obj = obj || {};
    if(obj.balance && this.contactList) {
      this.contactList.dialerDialog.setBalance(obj)
    }
  }, updateTariff:function(obj) {
    obj = obj || {};
    if(obj.price && this.contactList) {
      this.contactList.dialerDialog.setTariff(obj)
    }
  }});
  var WA_VERSION = 2;
  WA.MainAgent = WA.extend(DependencyEssence, {constructor:function() {
    this.popup = WA.MainAgent.Popup.create();
    this.popup.changeStateEvent.on(this._onPopupChangeState, this);
    this.sync = WA.Synchronizer.registerComponent("main_agent", ["contact_count", "clist", "dialogs"]);
    this.sync.triggerEvent.on(this._onSyncTriggerEvent, this);
    this.sync.showDebugState();
    WA.MainAgent.superclass.constructor.apply(this, arguments)
  }, _updateAgentVersion:function() {
    WA.Storage.save({main_agent_version:WA_VERSION}, {failure:function() {
      WA.setTimeout(WA.createDelegate(function() {
        this._updateAgentVersion()
      }, this), 1E3)
    }, scope:this})
  }, _onPopupChangeState:function(state) {
    if(state) {
      WA.Synchronizer.stop();
      this._disableUserEvents();
      this._setInitialState("popup", null, true)
    }else {
      US.getState(function(userState, param) {
        this._enableUserEvents();
        this.statusButton.setPopupMode(false);
        this.statusButton.el.setAttribute("popup_closing", "");
        this._setInitialState(userState, param, true);
        if(!WA.isPopup) {
          WA.Synchronizer.startUp()
        }
      }, this)
    }
  }, _onStatusChange:function(status, customTitle) {
    WA.debug.Console.log("_onStatusChange");
    var title = this._getStatusTitle(status, customTitle);
    this.statusButton.setStatus(status);
    this.contactList.setStatus(status, title);
    this.statusButton.show();
    this.show();
    if(this.popup.getState()) {
      this.statusButton.setPopupMode(true);
      this.statusButton.el.setAttribute("popup_closing", "")
    }
    if(status != "offline") {
      this._initPromoSms();
      this._promoSms.checkIdleStats()
    }
  }, _getStatusTitle:function(status, customTitle) {
    var statusTitle = WA.MainAgent.statuses[status] || customTitle || WA.XStatuses.getCurrentText(status) || status;
    return statusTitle
  }, _onActivate:function(cb, scope) {
    WA.debug.Console.log("_onActivate");
    this.sync.read(function(data) {
      this.statusButton.show();
      WA.ChangeLog.activate();
      WA.ContactStates.activate();
      var count = 0;
      var onActivated = function() {
        count++;
        if(count == 2) {
          cb && cb.call(scope || window)
        }
      };
      this.dialogsWindow.activate(onActivated);
      this.contactList.activate(onActivated);
      this._onSyncTriggerEvent(data)
    }, this)
  }, _onErrorMode:function() {
    WA.ChangeLog.deactivate();
    this.contactList.deactivate();
    this.dialogsWindow.deactivate();
    if(this.statusButton.isVisible()) {
      this.contactList.hide()
    }
  }, _onDeactivate:function() {
    WA.Voip.deactivate();
    if(this._promoSms) {
      this._promoSms.deactivate()
    }
    WA.debug.Console.log("_onDeactivate");
    WA.ChangeLog.deactivate();
    WA.ContactStates.deactivate();
    this.dialogsWindow.deactivate();
    this.contactList.deactivate();
    this.contactList.hide();
    this._statTask && this._statTask.stop()
  }, _createEssences:function() {
    WA.MainAgent.superclass._createEssences.call(this);
    this.contactList.popupChangeVisibleEvent.on(function() {
      if(!WA.isPopup) {
        window.open(POPUP_URL, "wa_popup", "width=714,height=500,resizable=no,location=no")
      }else {
        this.popup.close()
      }
    }, this)
  }, _onDocumentReady:function() {
    WA.debug.Console.log("_onDocumentReady");
    this._createEssences();
    this.render(WA.getBody())
  }, _onStorageInit:function() {
    WA.MainAgent.superclass._onStorageInit.call(this);
    this.popup.init();
    this._updateAgentVersion()
  }, _setInitialState:function(state, param, canSet) {
    if(canSet === true) {
      WA.MainAgent.superclass._setInitialState.call(this, state, param)
    }
  }, _listenFM:function() {
    if(!this.popup.getState()) {
      WA.MainAgent.superclass._listenFM.call(this)
    }
  }, _onFocus:function() {
    if(WA.isDebug) {
      document.title = document.title.replace(" [focused]", "") + " [focused]"
    }
    var count = 0;
    var onReady = function() {
      count++;
      if(count == 3) {
        this._enableUserEvents()
      }
      var focused = this.dialogsWindow.getVisibleDialog();
      if(focused && this.dialogsWindow._view.isFirst(focused.mail)) {
        this.notify.shift()
      }
    };
    this.sync.read(function(data) {
      if(WA.isPopup) {
        this.contactList.show()
      }else {
        this._onSyncTriggerEvent(data)
      }
      onReady.call(this)
    }, this);
    this.dialogsWindow.actualize(onReady, this);
    this.contactList.actualize(onReady, this)
  }, _onBlur:function() {
    if(WA.isDebug) {
      document.title = document.title.replace(" [focused]", "")
    }
    this._disableUserEvents()
  }, _onSyncTriggerEvent:function(data) {
    var str = [];
    if(data.isChanged("clist")) {
      var clist = data.get("clist");
      str.push("clist=" + clist);
      if(clist) {
        this.contactList.show()
      }else {
        if(!WA.isPopup) {
          this.contactList.hide()
        }
      }
    }
    if(data.isChanged("contact_count")) {
      var contact_count = data.get("contact_count");
      str.push("contact_count=" + contact_count);
      if(contact_count) {
        this.statusButton.setCount(contact_count)
      }
    }
    WA.debug.Console.log("_onSyncTriggerEvent " + str.join(", "))
  }, _makeElRoot:function() {
    var rootClass = "nwa-root" + (WA.isPopup ? " nwa-root_fullscreen" : "") + (WA.isFF || WA.isWebKit ? " nwa-css3-animation" : "") + (WA.isIE ? " nwa-msie" : "") + (WA.isFF ? " nwa-ff" : "") + (WA.isWebKit ? " nwa-webkit" : "") + (WA.isOpera ? " nwa-opera" : "");
    var rootEl = {tag:"div", id:"wa-root", cls:rootClass, style:"display: none; position: fixed; right: 9500px;", children:[{tag:"div", cls:"nwa-root__agent"}]};
    var mailFooterEl = WA.get("w-portal-footer");
    if(mailFooterEl) {
      U.DomHelper.insertFirst(mailFooterEl.dom, rootEl)
    }else {
      U.DomHelper.rapidHtmlInsert(rootEl)
    }
    this.el = WA.get("wa-root");
    this.boundEl = this.el.first()
  }, _checkWindowHeight:function() {
    var windowHeight = WA.util.DomHelper.getWindowSize().height, isLow = windowHeight < 600;
    this.el.toggleClass("nwa-agent_low", isLow)
  }, _onRender:function(ct) {
    this._makeElRoot();
    this.boundEl.on("scroll", function(ev) {
      ev.stopEvent()
    });
    this.statusButton.render(this.boundEl);
    this.contactList.render(this.boundEl);
    this.contactList.beforeShowEvent.on(function() {
      this.statusButton.hide()
    }, this);
    this.contactList.hideEvent.on(function() {
      this.statusButton.show()
    }, this);
    this.contactList.statusMenuToggleEvent.on(function() {
      this._toggleStatusMenu()
    }, this);
    WA.get(window).on("resize", this._checkWindowHeight, this);
    this._checkWindowHeight();
    this.statusMenu.setControlElement(this.contactList.statusToggleBtn.getEl());
    this.statusMenu.render(this.boundEl);
    this.dialogsWindow.render(this.el);
    WA.Beep.render(this.boundEl);
    this.statusButton.el.on("click", this.__onStatusButtonClick, this);
    Storage.whenReady(function() {
      Storage.load(["oldschool"], {success:function(storage) {
        if(storage["oldschool"]) {
          this.el.addClass("old-school")
        }
      }, scope:this})
    }, this);
    this._promoSms && !this._promoSms.rendered && this._promoSms.render(this.boundEl)
  }, _initPromoSms:function() {
    if(!this._promoSms) {
      this._promoSms = new WA.Promo;
      this._promoSms.showUserProfileEvent.on(function(mail) {
        this.contactList.searchContact(mail, true);
        this.contactList.hide();
        this.contactList.addContactDialog.show(2)
      }, this);
      this._promoSms.onBeforeInstallAgentEvent.on(function() {
        return this.statusButton.getStatus() != "offline"
      }, this);
      this._promoSms.friendSelectEvent.on(function(email) {
        WA.ma.contactList.abstraction.getContactsInfo([email], function(contacts) {
          this.openDialog.apply(this, contacts[0])
        }, this)
      }, this);
      this._promoSms.smsClickEvent.on(function() {
        if(this.statusButton.getStatus() == "offline") {
          SOCK.requestReadyEvent.on(function() {
            WA.setTimeout(function() {
              this.contactList.hide();
              this.contactList.hide();
              this.contactList._onSMSClick()
            }, 1E3, this)
          }, this, {single:true});
          this.__changeStatus("online")
        }else {
          this.contactList.show();
          this.contactList.hide();
          this.contactList._onSMSClick("")
        }
      }, this);
      if(this.rendered) {
        this._promoSms.render(this.boundEl)
      }
      this._promoSms.requestSuggestsEvent.on(this.contactList.addContactDialog.getSuggests, this.contactList.addContactDialog);
      this._promoSms.noFriendsEvent.on(this.contactList.addContactDialog._onNoFriendsEvent, this.contactList.addContactDialog);
      this._promoSms._showSuggests();
      this._promoSms.onBeforeBirthdayShowEvent.on(function() {
        return this.contactList.birthdayOff !== true
      }, this)
    }
  }, __onStatusButtonClick:function() {
    var el = this.statusButton.el;
    if(this.popup.getState() && !WA.isPopup && !el.getAttribute("popup_closing")) {
      el.setAttribute("popup_closing", 1);
      this.popup.close()
    }
  }});
  WA.MainAgent.sendAddContact = function(email, nickname, cb, scope) {
    WA.conn.Socket.send("contact", {operation:"add", email:email, nickname:nickname || email}, cb || WA.emptyFn, scope || this)
  };
  WA.MainAgent.isChat = function(email) {
    return email.indexOf("@chat.agent") != -1
  };
  WA.MainAgent.isTel = function(email) {
    return email.indexOf("@tel.agent") != -1
  };
  WA.MainAgent.isSupport = function(email) {
    return email === "support@corp.mail.ru"
  };
  WA.MainAgent.getSettingsUrl = function() {
    return location.hostname.match(/(video|foto|my)\.mail\.ru/) ? "http://my.mail.ru/my/editprops" : "http://e.mail.ru/cgi-bin/editprofile"
  };
  WA.MainAgent.statuses = {"online":WA.tr("status.online"), "away":WA.tr("status.away"), "dnd":WA.tr("status.dnd"), "offline":WA.tr("status.offline"), "chat":WA.tr("status.conf"), "gray":WA.tr("status.auth"), "auth":WA.tr("status.auth"), "status_chat":WA.tr("status.chat"), "status_mobile":WA.tr("status.mobile"), "tel":WA.tr("status.tel")};
  WA.hasFlash = WA.util.swf.hasFlashPlayerVersion("7");
  WA.MainAgent.WP2Nick = function(value, defnick) {
    return(value.firstname || value.lastname) && U.String.trim((value.firstname || "") + " " + (value.lastname || "")) || value.nickname || defnick || value.email
  }
})();
(function() {
  var WA = WebAgent;
  var Popup = WA.extend(Object, {constructor:function() {
    Popup.superclass.constructor.call(this);
    this.state = 0;
    this.changeStateEvent = new WA.util.Event;
    this.rpc = WA.rpc.Local.createRpc(this._getId());
    this.rpc.remoteEvent.on(this._onRemoteEvent, this)
  }, _getId:function() {
    WA.abstractError()
  }, getState:function() {
    return this.state
  }, init:function() {
    this.rpc.invoke("activate")
  }, _onRemoteEvent:function(method, params) {
  }, _updateState:function(state) {
    this.state = state;
    this.changeStateEvent.fire(state);
    WA.debug.State.set("popup_state", state)
  }, close:function() {
  }});
  var MasterPopup = WA.extend(Popup, {_getId:function() {
    return"MasterPopup"
  }, _onRemoteEvent:function(method, params) {
    if("closePopup" === method) {
      this.close()
    }
  }, init:function() {
    MasterPopup.superclass.init.call(this);
    this._updateState(0)
  }, close:function() {
    window.close()
  }});
  var SlavePopup = WA.MainAgent.Popup = WA.extend(Popup, {_getId:function() {
    return"SlavePopup"
  }, _onRemoteEvent:function(method, params) {
    if("changePopupState" === method) {
      this._onChangePopupState(params)
    }
  }, close:function() {
    this.rpc.invoke("closePopup")
  }, _onChangePopupState:function(state) {
    this._updateState(state);
    if(!state) {
      WA.debug.State.set("popup_expiredOn", new Date)
    }
  }});
  var instance = null;
  WA.MainAgent.Popup = {create:function() {
    if(!instance) {
      var clazz = WA.isPopup ? MasterPopup : SlavePopup;
      instance = new clazz
    }
    return instance
  }}
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var NOTIFY_HEIGHT = 76;
  var SPEED = 0.5;
  var notifyCollection;
  var MINUTE = 6E4;
  var HOUR = 60 * MINUTE;
  var DAY = 24 * HOUR;
  var MONTH = 30 * DAY;
  var YEAR = 12 * MONTH;
  var Notify = WA.extend(U.EventDispatcher, {constructor:function(img, title, text) {
    Notify.superclass.constructor.apply(this, arguments);
    this.img = img;
    this.title = title;
    this.text = text;
    this._opacity = 0;
    this._fadeOutEvent = new U.Event
  }, replaceId:"", top:0, subtitle:"", count:0, status:"online", date:0, show:function(noAnimation) {
    if(!this.showed && !this.canceled) {
      this.showed = true;
      notifyCollection.add(this, noAnimation)
    }
  }, _onElapsedTimer:function() {
    var d = new Date - this.date;
    var n, text;
    if(d > YEAR) {
      n = Math.floor(d / YEAR);
      text = WA.tr("time.years", {count:n})
    }else {
      if(d > MONTH) {
        n = Math.floor(d / MONTH);
        text = WA.tr("time.months", {count:n})
      }else {
        if(d > DAY) {
          n = Math.floor(d / DAY);
          text = WA.tr("time.days", {count:n})
        }else {
          if(d > HOUR) {
            n = Math.floor(d / HOUR);
            text = WA.tr("time.hours", {count:n})
          }else {
            if(d > MINUTE) {
              n = Math.floor(d / MINUTE);
              text = WA.tr("time.minutes", {count:n})
            }
          }
        }
      }
    }
    if(n) {
      if(!this.micblog) {
        this.elapsedEl.update(WA.tr("notify.timeElapsed", {time:text}))
      }
    }
    this._elapsedTimer.start()
  }, cancel:function(noAnimation) {
    if(this.showed && !this.canceled) {
      this.showed = false;
      this.canceled = true;
      this.dispatchEvent("close", {target:this});
      if(noAnimation) {
        this.destroy()
      }else {
        this.setPosition(this._position + 1);
        this._fadeOutEvent.on(this.destroy, this);
        this.fadeOut()
      }
    }
  }, fade:function(fadeIn) {
    U.animation.clear(this._fadeAnim);
    var endValue = 0;
    if(fadeIn) {
      endValue = 100
    }
    this._fadeAnim = U.animation.start(this._opacity, endValue, SPEED, this._onFadeFrame, this)
  }, fadeIn:function() {
    this.fade(true)
  }, fadeOut:function() {
    this.fade(false)
  }, _onFadeFrame:function(value, lastFrame) {
    this.setOpacity(value);
    if(lastFrame && value == 0) {
      this._fadeOutEvent.fire()
    }
  }, setOpacity:function(value) {
    if(this.el) {
      this.el.setStyle("opacity", value / 100)
    }
    this._opacity = value
  }, render:function(ct) {
    var text = this.text, out = "", res, part, symbolsLeft = 35, rePlain = /^([^<]+)<(?:a|div|img)/i, reA = /^(<a.+?>)(.+?)(<\/a>)/i, reDiv = /^<div.+?><\/div>/i, reSmile = /^<img.*?nwa\-smile_inline[^>]*?>/i;
    text = text.replace(/<br\s*\/?>/gi, "");
    while(symbolsLeft > 0 && text.length) {
      if(symbolsLeft < 4 && text.length > 3) {
        part = "...";
        text = ""
      }else {
        if(res = reA.exec(text)) {
          text = text.substr(res[0].length);
          part = U.String.ellipsis(res[2], symbolsLeft);
          symbolsLeft -= part.length;
          part = res[1] + part + res[3]
        }else {
          if(res = reDiv.exec(text)) {
            text = text.substr(res[0].length);
            symbolsLeft -= 3;
            part = res[0]
          }else {
            if(res = rePlain.exec(text)) {
              text = text.substr(res[1].length);
              part = res[1];
              symbolsLeft -= part.length
            }else {
              if(res = reSmile.exec(text)) {
                text = text.substr(res[0].length);
                part = res[0];
                symbolsLeft -= 3
              }else {
                text = text.replace(/&quot;/ig, '"');
                part = U.String.ellipsis(text, symbolsLeft);
                text = "";
                symbolsLeft -= part.length
              }
            }
          }
        }
      }
      out += part
    }
    text = out;
    var message = {tag:"div", cls:"nwa-notice-message", children:'<div class="nwa-notice-nick nwa-mark-nick">' + this.title + "</div>"};
    if(this.subtitle) {
      message.children += '<div class="nwa-notice-subtitle">' + this.subtitle + "</div>"
    }
    if(this.img) {
      message.children = '<span class="nwa-notice-message-avatar" style="background-image: url(' + this.img + "); filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + "'" + this.img + "'" + ",sizingMethod=" + "'" + "scale" + "'" + ');"></span>' + message.children
    }
    message.children += text;
    message.children += '<div class="nwa-notice-message__fadeout"></div>';
    this.el = ct.createChild({tag:"div", cls:"nwa-notice" + (this.img ? "" : " nwa-notice_no-image"), children:[{tag:"div", cls:"nwa-notice-close"}, message]});
    this.elapsedEl = this.el.createChild({tag:"div", cls:"nwa-notice-elapsed"});
    if(this.micblog) {
      this.elapsedEl.update('<a class="nwa-action_link nwa-notice_reply" data-mail="' + this.replaceId + '" data-post-id="' + this.postId + '" href="javascript:;" >' + WA.tr("notify.reply") + "</a>")
    }
    this.setOpacity(this._opacity);
    this.notifyEl = this.el.first();
    this.el.on("click", this._onClick, this).on("contextmenu", this._onClick, this).on("mouseover", this._onMouseOver, this)
  }, _onMouseMoveOutside:function(event) {
    var target = event.getTarget();
    if(!this.el.contains(target) && this._mouseover) {
      delete this._mouseover;
      WA.getBody().un("mousemove", this._onMouseMoveOutside, this);
      this.dispatchEvent("mouseout", {target:this})
    }
  }, _onMouseOver:function(event) {
    if(!this._mouseover) {
      this._mouseover = true;
      WA.getBody().on("mousemove", this._onMouseMoveOutside, this);
      this.dispatchEvent("mouseover", {target:this})
    }
  }, _onClick:function(event) {
    var trg = event.getTarget();
    if(trg.className.indexOf("nwa-notice-close") != -1 || event.button == 2) {
      if(this.statusChange) {
        U.Mnt.countRB(1732277)
      }
      this.cancel();
      event.stopEvent()
    }else {
      if(trg.className.indexOf("nwa-notice_reply") > -1) {
        var tmp = this.replaceId.split("@");
        var url = "http://my.mail.ru/" + tmp[1].split(".")[0] + "/" + tmp[0] + "/microposts?postid=" + trg.getAttribute("data-post-id");
        window.open(url);
        this.cancel();
        event.stopPropagation()
      }else {
        if(this.statusChange) {
          U.Mnt.countRB(1733649)
        }
        this.dispatchEvent("click", {target:this})
      }
    }
  }, setTop:function(top) {
    top = Math.round(top);
    this.top = top;
    this.el.setStyle({top:-1 * top + "px"});
    if(top >= NOTIFY_HEIGHT && !this._displayed) {
      this._displayed = true;
      this.dispatchEvent("display", {target:this})
    }
  }, setPosition:function(position, noAnimation) {
    this._position = position;
    U.animation.clear(this._moveAnim);
    if(noAnimation) {
      this.setTop(position * NOTIFY_HEIGHT)
    }else {
      this._moveAnim = U.animation.start(this.top, position * NOTIFY_HEIGHT, SPEED, this.setTop, this)
    }
  }, destroy:function() {
    U.animation.clear(this._fadeAnim);
    U.animation.clear(this._moveAnim);
    WA.getBody().un("mousemove", this._onMouseMoveOutside, this);
    this.el.un("click", this._onClick, this).un("contextmenu", this._onClick, this).un("mouseover", this._onMouseOver, this);
    this.el.remove();
    if(this._elapsedTimer) {
      this._elapsedTimer.stop()
    }
    Notify.superclass.destroy.apply(this, arguments)
  }});
  var NotifyCollection = WA.extend(Object, {constructor:function() {
    this._collection = []
  }, _indexOfNotify:function(notify) {
    var index = -1;
    U.Array.each(this._collection, function(v, i) {
      if(v == notify) {
        index = i;
        return false
      }
    }, this);
    return index
  }, _indexOfReplaceId:function(replaceId) {
    var index = -1;
    U.Array.each(this._collection, function(v, i) {
      if(v.replaceId == replaceId) {
        index = i;
        return false
      }
    }, this);
    return index
  }, add:function(notify, noAnimation) {
    var top = 0;
    notify.addEventListener("close", WA.createDelegate(this._onNotifyClose, this));
    var index = -1;
    if(notify.replaceId) {
      index = this._indexOfReplaceId(notify.replaceId)
    }
    if(index == -1) {
      if(this._collection.length) {
        var lastNotify = this._collection[0];
        var lastBottom = lastNotify.top - NOTIFY_HEIGHT;
        if(lastBottom < 0) {
          top = lastBottom
        }
      }
      this._collection.unshift(notify)
    }else {
      var oldNotify = this._collection[index];
      top = oldNotify.top;
      oldNotify.cancel(true);
      this._collection.splice(index, 0, notify);
      notify.setOpacity(100)
    }
    notify.render(this.el);
    notify.setTop(top);
    this._reorder(noAnimation);
    if(noAnimation) {
      notify.setOpacity(100)
    }else {
      if(index == -1) {
        notify.fadeIn()
      }
    }
  }, _reorder:function(noAnimation) {
    U.Array.each(this._collection, function(v, i) {
      v.setPosition(i + 1, noAnimation)
    }, this)
  }, _onNotifyClose:function(event) {
    var notify = event.target;
    var index = this._indexOfNotify(notify);
    this._collection.splice(index, 1);
    this._reorder()
  }, render:function(ct) {
    this.el = ct.createChild({tag:"div", cls:"nwa-notice-root"})
  }});
  var Notifications = WA.Notifications = WA.extend(Object, {constructor:function() {
    notifyCollection = new NotifyCollection
  }, createNotification:function(img, title, text) {
    return new Notify(img, title, text)
  }, checkPermission:function() {
    return 0
  }, requestPermission:function(cb) {
    cb()
  }, render:function(ct) {
    notifyCollection.render(ct)
  }, shift:function(back) {
    notifyCollection.el.toggleClass("nwa-notice-shifted", !back)
  }})
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var SA = WA.SA;
  var ConnectionRoster = WA.conn.ConnectionRoster;
  var FM = WA.FocusManager;
  var TIMEOUT = 1E4;
  var JSON = WA.getJSON();
  var NotifyAbstraction = WA.NotifyAbstraction = WA.extend(ConnectionRoster, {constructor:function() {
    NotifyAbstraction.superclass.constructor.apply(this, arguments);
    this.onBeforeNotifyEvent = new U.Event;
    this.createNotifyEvent = new U.Event;
    this.cancelNotifyEvent = new U.Event;
    this.timeoutNotifyEvent = new U.Event;
    FM.focusEvent.on(this._onFMFocus, this);
    FM.blurEvent.on(this._onFMBlur, this);
    this._windowFocus = WA.WindowFocus;
    this._windowFocus.focusEvent.on(this._onNativeFocus, this);
    this._windowFocus.blurEvent.on(this._onNativeBlur, this);
    this._packs = [];
    this._timeouts = {};
    this.micblogOff = false;
    this._sync = WA.Synchronizer.registerComponent("notify", ["packs"]);
    this._sync.triggerEvent.on(this._onSync, this)
  }, _repack:function(value) {
    var mail = value.from;
    var info = SA.get(mail);
    var now = +new Date;
    var fromMail = mail;
    var pack = {notify:{status:info.status, title:info.nick, text:value.mult ? value.mult.tag : value.text, date:value.timestamp * 1E3, replaceId:mail}, extra:{status:info.status, status_title:info.status_title, from:mail, title:info.nick, features:info.features}, uniq:Math.round(Math.random() * 99999), ts:now};
    if(value.statusChange) {
      var statusType = value.status.type.replace(/^icq_/, "");
      pack.notify.replaceId = mail + "_s";
      pack.notify.statusChange = 1;
      pack.extra.title = pack.notify.title = pack.notify.title || mail;
      pack.notify.text = '"' + (value.status.title || WA.MainAgent.statuses[statusType] || statusType) + '"'
    }else {
      if(WA.MainAgent.isChat(mail)) {
        pack.notify.status = "chat";
        var tmp = value.text.match(/([^@\n]+@[^@\n]+):\n([\s\S]*)/);
        if(tmp) {
          fromMail = tmp[1];
          pack.notify.subtitle = 'в <span class="nwa-mark-nick">' + U.String.htmlEntity(pack.notify.title) + "</span>";
          pack.extra.title = pack.notify.title;
          pack.notify.title = tmp[1];
          pack.notify.text = tmp[2]
        }
      }else {
        if(value.auth) {
          pack.notify.status = "auth";
          pack.notify.text = WA.tr("notify.authRequest");
          pack.extra.title = pack.notify.title = pack.notify.title || mail
        }else {
          if(value.micblog) {
            pack.notify.micblog = 1;
            pack.notify.postId = value.id;
            pack.notify.subtitle = WA.tr("notify.postedMicroblog");
            pack.notify.text = '"' + pack.notify.text + '"'
          }
        }
      }
    }
    if(value.mult && value.mult.tag && value.mult.tag.indexOf("sticker") > 1) {
      pack.notify.text = WA.tr("notify.youHaveSticker")
    }
    pack.notify.title = U.String.htmlEntity(pack.notify.title);
    pack.extra.title = U.String.htmlEntity(pack.extra.title);
    pack.notify.text = WA.DialogsAgentView.prepareMessageText(pack.notify.text, true);
    pack.notify.title_plain = pack.notify.title;
    if(fromMail && fromMail.indexOf("@chat") == -1) {
      pack.notify.img = WA.makeAvatar(fromMail, "_avatar50")
    }
    return pack
  }, _indexOfByUniq:function(uniq) {
    var index = -1;
    U.Array.each(this._packs, function(pack, i) {
      if(pack.uniq === uniq) {
        index = i;
        return false
      }
    }, this);
    return index
  }, _indexOfByReplaceId:function(replaceId) {
    var index = -1;
    U.Array.each(this._packs, function(pack, i) {
      if(pack.notify.replaceId === replaceId) {
        index = i;
        return false
      }
    }, this);
    return index
  }, _saveSync:function() {
    this._sync.write("packs", JSON.stringify(this._packs))
  }, _onSync:function(data) {
    if(data.isChanged("packs")) {
      var packs = JSON.parse(data.get("packs") || "[]");
      this.clear();
      U.Array.each(packs, function(pack) {
        this.createNotifyEvent.fire(pack.uniq, pack.notify, pack.extra, true);
        this._timeoutSet(pack.uniq)
      }, this);
      this._packs = packs
    }
  }, _timeoutRemove:function(uniq) {
    if(this._timeouts[uniq]) {
      this._timeoutStop(uniq);
      delete this._timeouts[uniq]
    }
  }, _timeoutSet:function(uniq) {
    if(!this._timeouts[uniq]) {
      this._timeouts[uniq] = new U.DelayedTask({fn:function() {
        this._remove(uniq);
        this.timeoutNotifyEvent.fire(uniq)
      }, scope:this, interval:TIMEOUT})
    }
  }, _timeoutStart:function(uniq, interval) {
    if(this._timeouts[uniq]) {
      this._timeouts[uniq].start(interval)
    }
  }, _timeoutStop:function(uniq) {
    this._timeoutSet(uniq);
    if(this._timeouts[uniq]) {
      this._timeouts[uniq].stop()
    }
  }, _remove:function(uniq) {
    this._timeoutRemove(uniq);
    var index = this._indexOfByUniq(uniq);
    if(index != -1) {
      this._packs.splice(index, 1)
    }
    this._saveSync()
  }, _onAfterConnectionResponse:function() {
    if(this._newMessages) {
      delete this._newMessages;
      var count = 0;
      var _packs = U.Array.clone(this._packs);
      U.Array.eachReverse(_packs, function(pack, i) {
        if(!pack.showed && count < 3) {
          pack.showed = true;
          count++;
          this.createNotifyEvent.fire(pack.uniq, pack.notify, pack.extra)
        }else {
          if(count >= 3 && pack.showed) {
            this.cancelNotifyEvent.fire(pack.uniq)
          }
        }
      }, this);
      if(this._packs.length > 3) {
        this._packs.splice(0, this._packs.length - 3)
      }
      this._saveSync()
    }
  }, _onConnectionContactMicblogStatus:function(value) {
    if(this.micblogOff) {
      return
    }
    if(!value.text) {
      return
    }
    value.micblog = 1;
    this._onConnectionMessage(value)
  }, _onConnectionMessage:function(value) {
    if(!value.from) {
      return
    }
    var pack = this._repack(value);
    if(this.onBeforeNotifyEvent.fire(pack.extra.from, !!value.statusChange) !== false) {
      var index = this._indexOfByReplaceId(pack.notify.replaceId);
      if(index != -1) {
        var oldPack = this._packs[index];
        this._timeouts[oldPack.uniq].stop();
        delete this._timeouts[oldPack.uniq];
        pack.notify.count = (oldPack.notify.count || 1) + 1;
        pack.notify.title_plain += " (" + pack.notify.count + ")";
        this._packs[index] = pack
      }else {
        this._packs.push(pack)
      }
      this._timeoutSet(pack.uniq);
      if(this._windowFocus.focus || value.statusChange) {
        this._timeoutStart(pack.uniq)
      }
      this._newMessages = true
    }
  }, _onConnectionAuthRequest:function(value) {
    value.auth = 1;
    this._onConnectionMessage(value)
  }, _onConnectionContactStatus:function(value) {
    if(value.status.type == "offline" || value.status.type == "icq_offline" || value.status.type == "gray" || value.change !== true) {
      return
    }
    value.statusChange = 1;
    value.from = value.email;
    this._onConnectionMessage(value)
  }, stopTimeout:function() {
    var changed = false;
    var now = +new Date;
    U.Object.each(this._packs, function(pack, replaceId) {
      if(pack.notify.statusChange) {
        return
      }
      this._timeoutStop(pack.uniq);
      pack.ts = now;
      changed = true
    }, this);
    if(changed) {
      this._saveSync()
    }
  }, restartTimeout:function() {
    var changed = false;
    var now = +new Date;
    U.Object.each(this._packs, function(pack, replaceId) {
      if(pack.notify.statusChange) {
        return
      }
      this._timeoutStart(pack.uniq);
      pack.ts = now;
      changed = true
    }, this);
    if(changed) {
      this._saveSync()
    }
  }, restoreTimeout:function() {
    var now = +new Date;
    U.Object.each(this._packs, function(pack, replaceId) {
      if(pack.notify.statusChange) {
        return
      }
      this._timeoutStart(pack.uniq, TIMEOUT - (now - pack.ts))
    }, this)
  }, _onFMFocus:function() {
    this.restoreTimeout()
  }, _onFMBlur:function() {
    this.stopTimeout()
  }, close:function(uniq) {
    this._remove(uniq)
  }, clear:function() {
    var packs = U.Array.clone(this._packs);
    U.Array.each(packs, function(pack) {
      this.cancelNotifyEvent.fire(pack.uniq, true);
      this._timeoutRemove(pack.uniq)
    }, this)
  }, _onNativeFocus:function() {
    FM.ifFocused(this.restoreTimeout, false, this)
  }, _onNativeBlur:function() {
    FM.ifFocused(this.stopTimeout, false, this)
  }, removeByReplaceId:function(replaceId) {
    var packs = U.Array.clone(this._packs);
    U.Array.each(packs, function(pack) {
      if(pack.notify.replaceId == replaceId) {
        this.cancelNotifyEvent.fire(pack.uniq, true);
        this._timeoutRemove(pack.uniq)
      }
    }, this)
  }})
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var notifications;
  var NotifyAgent = WA.NotifyAgent = WA.extend(Object, {constructor:function() {
    this._notifies = {};
    this.clickEvent = new U.Event;
    this.cancelEvent = new U.Event;
    this.abstraction = new WA.NotifyAbstraction;
    this.abstraction.createNotifyEvent.on(this._onCreateNotify, this);
    this.abstraction.cancelNotifyEvent.on(this._onCancelNotify, this);
    this._timeouted = {};
    this.abstraction.timeoutNotifyEvent.on(this._onTimeoutNotify, this);
    this._onCloseScope = WA.createDelegate(this._onClose, this);
    this._onMouseOverScope = WA.createDelegate(this._onMouseOver, this);
    this._onMouseOutScope = WA.createDelegate(this._onMouseOut, this);
    this._onClickScope = WA.createDelegate(this._onClick, this);
    this.onBeforeNotifyEvent = (new U.Event).relay(this.abstraction.onBeforeNotifyEvent);
    this._shifted = false
  }, _makeNotify:function(info, noAnimation) {
    if(!notifications) {
      notifications = window.notifications
    }
    var oldNotifyData = this._getByReplaceId(info.replaceId);
    if(oldNotifyData) {
      oldNotifyData.notify.removeEventListener("close", this._onCloseScope);
      this._removeNotify(oldNotifyData)
    }
    var notify = notifications.createNotification(info.img, info.title_plain, info.text);
    WA.apply(notify, info);
    notify.addEventListener("close", this._onCloseScope);
    notify.addEventListener("mouseover", this._onMouseOverScope);
    notify.addEventListener("mouseout", this._onMouseOutScope);
    notify.addEventListener("click", this._onClickScope);
    notify.show(noAnimation);
    return notify
  }, _onCreateNotify:function(uniq, info, extra, noAnimation) {
    if(info.statusChange) {
      U.Mnt.countRB(1732275)
    }
    this._notifies[uniq] = {info:info, extra:extra, uniq:uniq, notify:this._makeNotify(info, noAnimation)}
  }, _onTimeoutNotify:function(uniq, noAnimation) {
    var data = this._notifies[uniq];
    if(data && data.info.statusChange) {
      U.Mnt.countRB(1732279)
    }
    this._timeouted[uniq] = 1;
    this._onCancelNotify(uniq, noAnimation)
  }, _onCancelNotify:function(uniq, noAnimation) {
    var data = this._notifies[uniq];
    if(data) {
      data.notify.cancel(noAnimation)
    }
  }, _onMouseOver:function() {
    this.abstraction.stopTimeout()
  }, _onMouseOut:function() {
    this.abstraction.restartTimeout()
  }, _onClick:function(event) {
    var notify = event.target;
    var data = this._getByNotify(notify);
    if(data) {
      this.clickEvent.fire(data.extra.from, data.extra.title, data.extra.status, data.extra.status_title, data.extra.features)
    }
    notify.cancel()
  }, _removeNotify:function(data) {
    this.abstraction.close(data.uniq);
    delete this._notifies[data.uniq]
  }, _onClose:function(event) {
    var notify = event.target;
    var data = this._getByNotify(notify);
    this._removeNotify(data);
    if(!this._timeouted[data.uniq]) {
      this.cancelEvent.fire(data.extra.from)
    }else {
      delete this._timeouted[data.uniq]
    }
  }, _getByNotify:function(notify) {
    var retval = false;
    U.Object.each(this._notifies, function(data, k) {
      if(data.notify === notify) {
        retval = data;
        return false
      }
    }, this);
    return retval
  }, _getByReplaceId:function(replaceId) {
    var retval = false;
    U.Object.each(this._notifies, function(data, k) {
      if(data.info.replaceId === replaceId) {
        retval = data;
        return false
      }
    }, this);
    return retval
  }, clear:function() {
    this.abstraction.clear()
  }, removeByMail:function(mail, silent) {
    if(silent) {
      var data = this._getByReplaceId(mail);
      this._timeouted[data.uniq] = 1
    }
    this.abstraction.removeByReplaceId(mail)
  }, shift:function(back) {
    (notifications || (notifications = window.notifications)) && this._shifted == (back || false) && notifications.shift(!(this._shifted = !back))
  }})
})();
(function() {
  var WA = WebAgent, U = WA.util, US = WA.conn.UserState, SOCK = WA.conn.Socket, S = WA.Storage, ConnectionRoster = WA.conn.ConnectionRoster;
  var API = WA.extend(ConnectionRoster, {constructor:function() {
    API.superclass.constructor.apply(this, arguments);
    this.errorEvent = new U.Event;
    SOCK.requestReadyEvent.on(function() {
      this._openQueue()
    }, this);
    US.permanentShutdownEvent.on(function(event) {
      if(event && event.reason == "noAuth") {
        this._status = "offline";
        this._noauth = true
      }
    }, this);
    US.statusChangedEvent.on(function(status) {
      this._status = status
    }, this);
    US.readyEvent.on(function() {
      if(WA.ma.isPermanentShutdown) {
        this._disabled = true;
        this._cancelOpening("disabledByUser")
      }
      US.getActualStatus(function(status) {
        this._status = status
      }, this)
    }, this);
    S.whenReady(function() {
      WA.ma.popup.changeStateEvent.on(function(isOpened) {
        if(!isOpened) {
          this._openQueue()
        }
      }, this);
      US.getActualStatus(function(status) {
        if(!this._confirmEventsListened) {
          this._confirmEventsListened = true;
          WA.ma.contactList.onlineConfirmSuccessEvent.on(function() {
            WA.ma.statusButton.setStatus("yellow");
            WA.conn.UserState.setStatus("online")
          }, this);
          WA.ma.contactList.onlineConfirmDeclineEvent.on(function() {
            this._cancelOpening("onlineDecline")
          }, this)
        }
        if(status == "disabled") {
          this._disabled = true;
          this._cancelOpening("disabledByUser")
        }else {
          this._status = status
        }
      }, this)
    }, this)
  }, _cancelOpening:function(message) {
    if(!message) {
      debugger
    }
    if(this._queue.length) {
      this.errorEvent.fire({message:message, queue:this._queue});
      this._queue = []
    }
  }, _queue:[], _idlist:{}, _addAction:function(type, args) {
    var id = args.id, mail = args.mail;
    if(WA.ma.popup.getState()) {
      WA.ma.popup.close()
    }
    var index = this._indexOfQueue(id, mail);
    if(index == -1) {
      if(!mail && this._idlist[id]) {
        mail = this._idlist[id]
      }
      args = WA.apply(args, {type:type});
      this._queue.push(args)
    }
    if(this._disabled) {
      this._cancelOpening("disabledByUser");
      return true
    }else {
      if(this._noauth) {
        this._cancelOpening("invalidUser");
        return true
      }else {
        if(WA.ma.popup.getState()) {
          WA.ma.popup.close()
        }else {
          this._openQueue()
        }
      }
    }
    return false
  }, openDialog:function(id, mail) {
    return this._addAction("openDialog", {id:id, mail:mail})
  }, getProfile:function(id, mail, cb, scope) {
    return this._addAction("getProfile", {id:id, mail:mail, cb:cb, scope:scope})
  }, callTo:function(tel) {
    U.Mnt.countRB(1313949);
    return this._addAction("call", {mail:tel, tel:tel})
  }, _indexOfQueue:function(id, mail) {
    return U.Array.indexOfBy(this._queue, function(e) {
      if(e.id && e.id == id || e.mail && e.mail == mail) {
        return true
      }
    }, this)
  }, _onConnectionContactMail:function(value) {
    var index = this._indexOfQueue(value.id);
    if(index != -1) {
      this._queue[index].mail = value.mail;
      this._openKnown()
    }
  }, _openQueue:function() {
    if(this._status && this._queue.length) {
      if(this._status != "offline") {
        if(this._queue.length) {
          var idlist = [];
          U.Array.each(this._queue, function(c) {
            if(!c.mail && !c.requested) {
              idlist.push(c.id);
              c.requested = true
            }
          }, this);
          if(idlist.length) {
            WA.conn.Connection.getMailById(idlist[0])
          }else {
            this._openKnown()
          }
        }
      }else {
        U.Mnt.countRB(1313950);
        WA.conn.UserState.getUserStatus(function(status) {
          if(status.type == "offline") {
            WA.ma.contactList.onlineConfirm(WA.tr("box.goOnline"))
          }else {
            WA.ma.contactList.onlineConfirm(WA.tr("box.goOnlineForce"))
          }
        }, function(errno, errmsg) {
          this._cancelOpening(errmsg)
        }, this)
      }
    }
  }, _onConnectionMaillist:function(value) {
    U.Array.each(value, function(contact) {
      this._idlist[contact.id] = contact.mail;
      var index = this._indexOfQueue(contact.id);
      this._queue[index].mail = contact.mail
    }, this);
    this._openKnown()
  }, _openKnown:function() {
    var maillist = [], mailhash = {};
    var queue = [];
    var tel;
    U.Array.each(this._queue, function(e, index) {
      if(e.mail) {
        if(e.type == "openDialog") {
          maillist.push(e.mail);
          mailhash[e.mail] = index
        }else {
          if(e.type == "getProfile") {
            WebAgent.ma.contactList.addContactDialog._abstraction.get(e.mail, e.cb, e.scope)
          }else {
            if(e.type == "call") {
              tel = e.tel
            }
          }
        }
      }else {
        queue.push(e)
      }
    }, this);
    this._queue = queue;
    WA.ma.contactList.abstraction.getContactsInfo(maillist, function(contacts) {
      U.Array.each(contacts, function(contact) {
        delete mailhash[contact[0]];
        WA.ma.dialogsWindow.openDialog.apply(WA.ma.dialogsWindow, contact)
      }, this);
      var lastindex = -1, mail;
      U.Object.each(mailhash, function(index, m) {
        if(index > lastindex) {
          lastindex = index;
          mail = m
        }
      }, this);
      if(mail) {
        WA.ma.contactList.searchContact(mail, true)
      }
    }, this);
    if(tel) {
      WA.ma.contactList.callTo(tel)
    }
  }});
  WA.API = new API
})();
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var S = WA.Storage;
  var SOCK = WA.conn.Socket;
  var ConnectionRoster = WA.conn.ConnectionRoster;
  var MINUTE = 60;
  var HOUR = 60 * MINUTE;
  var DAY = 24 * HOUR;
  var WEEK = DAY * 7;
  var MONTH = DAY * 30;
  var FIRST_INTERVAL = 7 * 24 * 60 * 60;
  var ua = navigator.userAgent;
  var isMac = ua.indexOf("Mac") != -1;
  var haveDesktopClient = ua.indexOf("MRA") != -1;
  var INSTALL_AGENT_RBCOUNTER;
  var installAgentType = 0;
  var installAgentLink;
  var installAgentText;
  if(installAgentType == 0) {
    installAgentText = "<b>" + WA.tr("promo.installAgent") + "</b><br>" + WA.tr("promo.checkNewMail");
    if(!isMac) {
      INSTALL_AGENT_RBCOUNTER = 1190681;
      installAgentLink = "http://r.mail.ru/clb1177706/agent.mail.ru/windows?partnerid=350"
    }else {
      INSTALL_AGENT_RBCOUNTER = 1190689;
      installAgentLink = "http://r.mail.ru/clb1177715/agent.mail.ru/macos?partnerid=352"
    }
  }else {
    installAgentText = "<b>" + WA.tr("promo.installAgent") + "</b><br>" + WA.tr("promo.notifications");
    if(!isMac) {
      INSTALL_AGENT_RBCOUNTER = 1190685;
      installAgentLink = "http://r.mail.ru/clb1177708/agent.mail.ru/windows?partnerid=351"
    }else {
      INSTALL_AGENT_RBCOUNTER = 1190690;
      installAgentLink = "http://r.mail.ru/clb1177716/agent.mail.ru/macos?partnerid=353"
    }
  }
  var SmsPromo = WA.extend(WA.ui.Component, {constructor:function() {
    SmsPromo.superclass.constructor.apply(this, arguments);
    this.clickEvent = new U.Event;
    this.closeEvent = new U.Event
  }, render:function(ct) {
    this._ct = ct
  }, _onRender:function(ct) {
    this.el = ct.createChild({cls:"nwa-promo-sms", style:"display:none;", children:["<b>" + WA.tr("promo.freeSms") + "</b><br>" + WA.tr("promo.sendFromAgent"), {cls:"nwa-promo-sms-close"}]})
  }, _onAfterRender:function() {
    this.el.on("click", this._onClick, this)
  }, _onClick:function(e) {
    var trg = e.getTarget(true);
    if(trg.getClass() == "") {
      trg = trg.parent()
    }
    if(trg.hasClass("nwa-promo-sms-close")) {
      U.Mnt.countRB(1100901);
      e.stopPropagation()
    }else {
      if(trg.hasClass("nwa-promo-sms")) {
        U.Mnt.countRB(1100899);
        this.clickEvent.fire();
        e.stopPropagation()
      }
    }
    this.closeEvent.fire();
    this.hide()
  }, show:function() {
    if(!this.rendered && this._ct) {
      SmsPromo.superclass.render.call(this, this._ct)
    }
    if(this.rendered) {
      SmsPromo.superclass.show.call(this)
    }
  }, _onShow:function() {
    U.Mnt.countRB(1100896)
  }, destroy:function() {
    SmsPromo.superclass.destroy.apply(this, arguments);
    this.clickEvent.removeAll();
    this.closeEvent.removeAll();
    this._destroyed = true;
    if(this._el) {
      this._el.remove()
    }
  }});
  var AgentPromo = WA.extend(SmsPromo, {_onRender:function(ct) {
    this.el = ct.createChild({cls:"nwa-promo-installagent nwa-promo-installagent-type" + installAgentType, style:"display:none;", children:[installAgentText, {tag:"a", href:installAgentLink, target:"_blank"}, {cls:"nwa-promo-installagent-close"}]})
  }, _onAfterRender:function() {
    this.el.on("click", function(e) {
      var trg = e.getTarget(true);
      if(trg.getClass() == "") {
        trg = trg.parent()
      }
      if(trg.hasClass("nwa-promo-installagent-close")) {
        U.Mnt.countRB(1100901);
        e.stopPropagation()
      }else {
        if(trg.hasClass("nwa-promo-installagent")) {
          U.Mnt.countRB(1100899);
          this.clickEvent.fire();
          e.stopPropagation()
        }
      }
      this.closeEvent.fire();
      this.hide()
    }, this)
  }});
  var FriendsSuggest = WA.extend(SmsPromo, {_onRender:function(ct) {
    this.el = ct.createChild({cls:"nwa-fsg", style:"display:none;", children:[{cls:"nwa-fsg-ava", id:"nwaSugAva"}, {cls:"nwa-fsg-skin", children:[{cls:"nwa-fsg-next", title:WA.tr("search.next")}, {cls:"nwa-fsg-prev", title:WA.tr("search.previous")}, {cls:"nwa-fsg-profile", title:WA.tr("search.profile")}, {cls:"nwa-fsg-close", title:WA.tr("search.close")}, {cls:"nwa-fsg-add", title:WA.tr("search.add")}, {cls:"nwa-fsg-nofriends", title:WA.tr("search.notFamiliar")}, {cls:"nwa-fsg-info", children:[{cls:"nwa-fsg-nick", 
    id:"nwaSugNick"}, {cls:"nwa-fsg-relation", id:"nwaSugRelation"}]}]}]})
  }, _onAfterRender:function() {
    this._nickEl = WA.get("nwaSugNick");
    this._relationEl = WA.get("nwaSugRelation");
    this._avaEl = WA.get("nwaSugAva");
    this.el.on("click", this._onClick, this)
  }, _onClick:function(e) {
    var trg = e.getTarget(true);
    var action = trg.getClass().replace("nwa-fsg-", "");
    if({next:1, prev:1, profile:1, close:1, add:1, nofriends:1}[action]) {
      this.clickEvent.fire({type:action, mail:this._currentMail, nick:this._currentNick})
    }
  }, show:function(mail, nick, relation, length) {
    FriendsSuggest.superclass.show.call(this);
    this._currentMail = mail;
    this._currentNick = nick;
    this._avaEl.setStyle("background-image", "url(" + WA.makeAvatar(mail, "_avatarsmall") + ")");
    this._nickEl.update(U.String.htmlEntity(nick));
    this._relationEl.update(relation);
    this.el.toggleClass("nwa-fsg-single", !(length - 1))
  }, _onShow:function() {
  }, destroy:function() {
    SmsPromo.superclass.destroy.apply(this, arguments);
    this.clickEvent.removeAll();
    this.closeEvent.removeAll();
    this._destroyed = true;
    if(this._el) {
      this._el.remove()
    }
  }});
  var FriendBirth = WA.extend(SmsPromo, {show:function(mail, nick, tomorrow) {
    FriendBirth.superclass.show.call(this);
    this._currentMail = mail;
    var nickName = this.el.first().first();
    nickName.update(nick || mail);
    nickName.next().update(WA.tr(tomorrow === true ? "promo.tomorrowBirthday" : "promo.birthday"));
    WA.ma.contactList.abstraction.getContactsInfo([mail], function(contacts) {
      if(contacts.length && contacts[0][1]) {
        nickName.update(contacts[0][1])
      }
    }, this)
  }, _onRender:function(ct) {
    this._id = "q";
    this.el = ct.createChild({cls:"nwa-promo-bd", style:"display:none;", children:[{cls:"nwa-promo-bd__body", children:[{tag:"span", cls:"nwa-special-nick"}, {html:""}]}, {cls:"nwa-promo-bd-close"}]})
  }, _onAfterRender:function() {
    this.el.on("click", function(e) {
      var trg = e.getTarget(true);
      e.stopPropagation();
      this.hide();
      if(!trg.hasClass("nwa-promo-bd-close")) {
        this.clickEvent.fire(this._currentMail)
      }
      this.closeEvent.fire()
    }, this)
  }});
  var Abstraction = WA.extend(ConnectionRoster, {constructor:function() {
    Abstraction.superclass.constructor.apply(this, arguments);
    this.requestSuggestsEvent = new U.Event;
    this.suggestsShowEvent = new U.Event;
    this.smsPromoEvent = new U.Event;
    this.installAgentShowEvent = new U.Event;
    this.friendBirthdayEvent = new U.Event;
    this._tmr = WA.setTimeout(this._onStartDelay, 1E3, this);
    this._userData = null;
    this._cbQueue = []
  }, _onStartDelay:function() {
    S.modifyObject(["promo"], function(storage) {
      var now = WA.now();
      var promo = storage["promo"];
      var left;
      if(!promo.smsClosed) {
        left = 0;
        if(promo.smsDate) {
          left = 2 * WEEK - (now - promo.smsDate)
        }
      }
      if(!haveDesktopClient && !promo.installAgentShown) {
        var left2 = 0;
        if(promo.installAgentTs) {
          left2 = WEEK - (now - promo.installAgentTs)
        }
        if(left !== undefined) {
          left = Math.min(left, left2)
        }else {
          left = left2
        }
      }
      if(left !== undefined && left < HOUR) {
        this._tmr = WA.setTimeout(function() {
          this._getUser(this._onUser)
        }, left * 1E3, this);
        return
      }
      if(!promo.suggestsTs) {
        left2 = 0
      }else {
        left2 = 2 * WEEK - (now - promo.suggestsTs)
      }
      if(left !== undefined) {
        left = Math.min(left, left2)
      }else {
        left = left2
      }
      if(left < 0) {
        left = 0
      }
      if(left < HOUR) {
        this._tmr = WA.setTimeout(function() {
          this._getUser(this._onUser)
        }, left * 1E3, this)
      }
      this._timerBD = WA.setTimeout(this._checkBirthdays, 500, this)
    }, this)
  }, _checkBirthdays:function() {
    if(this._BDBaloonShown === true) {
      return
    }
    var now = new Date;
    var today = now.getDate() + "_" + (now.getMonth() + 1);
    S.modifyObject(["promo"], function(storage) {
      storage.promo || (storage.promo = {});
      if(storage.promo.bdLastRequest == today) {
        var emails = storage.promo.bdEmails;
        var tomorrowEmails = storage.promo.bdTomorrowEmails;
        this._nextBDEmail(emails, tomorrowEmails)
      }
    }, this)
  }, _onConnectionBirthdays:function(value) {
    var now = new Date, today = now.getDate() + "_" + (now.getMonth() + 1), tomorrowDate = new Date;
    tomorrowDate.setDate(now.getDate() + 1);
    var tomorrow = tomorrowDate.getDate() + "_" + (tomorrowDate.getMonth() + 1);
    var emails = [], tomorrowEmails = [];
    if(value.length) {
      U.Array.each(value, function(contact) {
        var date = contact.day + "_" + contact.month;
        if(date == today) {
          emails.push(contact.email)
        }else {
          if(date == tomorrow) {
            tomorrowEmails.push(contact.email)
          }
        }
      });
      S.modifyObject(["promo"], function(storage) {
        storage.promo || (storage.promo = {});
        if(storage.promo.bdLastRequest != today) {
          storage.promo.bdLastRequest = today;
          storage.promo.bdEmails = emails;
          storage.promo.bdTomorrowEmails = tomorrowEmails;
          WA.setTimeout(function() {
            this._nextBDEmail(emails, tomorrowEmails)
          }, 100, this)
        }
      }, this)
    }else {
      S.modifyObject(["promo"], function(storage) {
        storage.promo || (storage.promo = {});
        if(storage.promo.bdLastRequest != today) {
          storage.promo.bdLastRequest = today;
          storage.promo.bdEmails = [];
          storage.promo.bdTomorrowEmails = []
        }
      }, this)
    }
  }, _nextBDEmail:function(emails, tomorrowEmails) {
    if(emails && emails.length > 0) {
      this.friendBirthdayEvent.fire(emails[0])
    }else {
      if(tomorrowEmails && tomorrowEmails.length > 0) {
        this.friendBirthdayEvent.fire(tomorrowEmails[0], true)
      }
    }
  }, removeBDFromQueue:function(email) {
    this._BDBaloonShown = true;
    S.modifyObject(["promo"], function(storage) {
      storage.promo || (storage.promo = {});
      if(storage.promo.bdEmails && storage.promo.bdEmails.length && storage.promo.bdEmails[0] == email) {
        storage.promo.bdEmails.shift()
      }else {
        if(storage.promo.bdTomorrowEmails && storage.promo.bdTomorrowEmails.length && storage.promo.bdTomorrowEmails[0] == email) {
          storage.promo.bdTomorrowEmails.shift()
        }
      }
    }, this)
  }, _getUser:function(cb, scope) {
    if(this._userData) {
      cb && cb.call(scope || this)
    }else {
      if(window.mailru && mailru.HelperTimestamp && mailru.HelperStatus) {
        this._userData = {helper:{status:mailru.HelperStatus, time:mailru.HelperTimestamp}, reg_date:mailru.RegTime};
        cb && cb.call(scope || this)
      }else {
        if(cb) {
          this._cbQueue.push([cb, scope])
        }
        SOCK.send("helper")
      }
    }
  }, _onConnectionHelper:function(value) {
    var cb;
    if(value.mask && value.ts && value.reg_ts) {
      this._userData = {helper:{status:value.mask, time:value.ts.split(",")}, reg_date:value.reg_ts};
      while(this._cbQueue.length) {
        cb = this._cbQueue.shift();
        cb[0] && cb[0].call(cb[1] || this)
      }
    }
  }, _onUser:function() {
    var user = this._userData;
    S.modifyObject(["promo"], function(storage) {
      var now = WA.now();
      var promo = storage["promo"];
      var isSmsClosed = !!(user.helper.status & 1 << 18);
      var showTs = parseInt(user.helper.time[18] || 0);
      if(isSmsClosed) {
        if(!promo.smsClosed) {
          promo.smsClosed = 1
        }
      }else {
        if(showTs <= 1) {
          if(!promo.smsDate) {
            promo.smsDate = now - 2 * WEEK + FIRST_INTERVAL
          }
          var left = FIRST_INTERVAL - (now - user.reg_date)
        }else {
          left = 2 * WEEK - (now - showTs)
        }
      }
      if(left && left < 1) {
        left = 1
      }
      if(left !== undefined && left < HOUR) {
        this._tmr = WA.setTimeout(this._showSms, left * 1E3, this)
      }
      if(!promo.installAgentShown) {
        var installAgentShowTs = parseInt(user.helper.time[19] || 0);
        if(installAgentShowTs <= 1) {
          if(!promo.installAgentTs) {
            promo.installAgentTs = user.reg_date
          }
          left = WEEK - (now - promo.installAgentTs);
          if(left < 0) {
            left = 0
          }
          if(left < HOUR) {
            this._tmr2 = WA.setTimeout(this._showInstallAgent, left * 1E3, this)
          }
        }else {
          promo.installAgentShown = 1
        }
      }
      var sugLastTs = user.helper.time[24] || 0;
      if(sugLastTs <= 1) {
        sugLastTs = now - 4 * DAY - (now - user.reg_date);
        promo.suggestsTs = sugLastTs
      }
      left = 2 * WEEK - (now - sugLastTs);
      if(left < 0) {
        left = 0
      }
      if(left < HOUR) {
        this._tmr3 = WA.setTimeout(this._showSuggests, left * 1E3, this)
      }
    }, this)
  }, checkRegDateIdle:function() {
    this._getUser(function() {
      if(this._userData) {
        var daysPassed = (WA.now() - this._userData.reg_date) / 60 / 60 / 24;
        S.load(["promo.rbflags"], {success:function(storage) {
          var flags = parseInt(storage["promo.rbflags"]) || 0;
          if((flags & 4) > 0) {
            return
          }
          if(daysPassed >= 1 && daysPassed < 30 && (flags & 8) == 0) {
            flags = flags + 8;
            U.Mnt.countRB(1614538)
          }else {
            if(daysPassed >= 30 && (flags & 16) == 0) {
              flags = flags + 16;
              U.Mnt.countRB(1614540)
            }
          }
          S.save({"promo.rbflags":flags})
        }, scope:this})
      }
    }, this)
  }, setCLOpen:function() {
    S.load(["promo.rbflags"], {success:function(storage) {
      var flags = parseInt(storage["promo.rbflags"]) || 0;
      if((flags & 4) == 0) {
        flags = flags + 4;
        S.save({"promo.rbflags":flags})
      }
    }, scope:this})
  }, checkRegDate:function() {
    this._getUser(function() {
      if(this._userData) {
        var daysPassed = (WA.now() - this._userData.reg_date) / 60 / 60 / 24;
        S.load(["promo.rbflags"], {success:function(storage) {
          var flags = parseInt(storage["promo.rbflags"]) || 0;
          this.requestSuggestsEvent.fire(function(list) {
            var cnt = list.length;
            if(daysPassed < 1 && (flags & 1) == 0) {
              U.Mnt.countRB(cnt > 0 ? 1614517 : 1614518);
              flags = flags + 1
            }else {
              if(daysPassed >= 1 && daysPassed < 30 && (flags & 2) == 0) {
                U.Mnt.countRB(cnt > 0 ? 1614525 : 1614526);
                flags = flags + 2
              }
            }
            U.Mnt.countRB(cnt > 0 ? 1614533 : 1614536);
            S.save({"promo.rbflags":flags})
          }, this)
        }, scope:this})
      }
    }, this)
  }, _showSuggests:function() {
    WA.conn.UserState.getState(function(status) {
      if(status && status != "disabled") {
        if(U.MailApi.lockNotify()) {
          this.requestSuggestsEvent.fire(function(list) {
            S.modifyObject(["suglist", "promo"], function(storage) {
              var sugList = storage["suglist"] || {};
              var newSugList = {};
              var haveNew = false;
              U.Array.each(list, function(contact) {
                if(!sugList[contact.email]) {
                  sugList[contact.email] = 1;
                  haveNew = true
                }
                newSugList[contact.email] = 1
              }, this);
              if(haveNew) {
                this.suggestsShowEvent.fire(list);
                storage["suglist"] = newSugList;
                U.Mnt.countRB(1202989);
                if(!storage.promo.suggestsShown) {
                  storage.promo.suggestsShown = 1
                }else {
                  U.Mnt.countRB(1203001)
                }
              }else {
                U.Mnt.countRB(1203E3)
              }
              U.MailApi.updateFlagTime(24);
              storage.promo || (storage.promo = {});
              storage.promo.suggestsTs = WA.now()
            }, this)
          }, this)
        }
      }
    }, this)
  }, _showInstallAgent:function() {
    WA.conn.UserState.getState(function(status) {
      if(status && status != "disabled") {
        if(U.MailApi.lockNotify()) {
          if(this.installAgentShowEvent.fire() !== false) {
            S.modifyObject(["promo"], function(storage) {
              storage.promo || (storage.promo = {});
              storage.promo.installAgentShown = 1;
              U.MailApi.updateFlagTime(19);
              U.Mnt.countRB(INSTALL_AGENT_RBCOUNTER)
            }, this)
          }
        }
      }
    }, this)
  }, _showSms:function() {
    WA.conn.UserState.getState(function(status) {
      if(status && status != "disabled") {
        if(U.MailApi.lockNotify()) {
          U.MailApi.updateFlagTime(18);
          this.smsPromoEvent.fire();
          S.modifyObject(["promo"], function(storage) {
            storage.promo || (storage.promo = {});
            storage.promo.smsDate = Math.round(+new Date / 1E3);
            U.Mnt.countRB(1100896);
            if(!storage.promo.alreadyShown) {
              storage.promo.alreadyShown = 1
            }else {
              U.Mnt.countRB(1160057)
            }
          }, this)
        }
      }
    }, this)
  }, smsClosed:function() {
    U.MailApi.setFlag(18);
    S.modifyObject(["promo"], function(storage) {
      storage.promo || (storage.promo = {});
      storage.promo.smsClosed = 1
    }, this);
    this.onPopupClose()
  }, destroy:function() {
    clearTimeout(this._tmr);
    clearTimeout(this._tmr2);
    clearTimeout(this._tmr3);
    if(this._timerBD) {
      clearTimeout(this._timerBD)
    }
    this.smsPromoEvent.removeAll();
    this.installAgentShowEvent.removeAll();
    Abstraction.superclass.destroy.call(this)
  }, onPopupClose:function() {
    U.MailApi.unlockNotify()
  }, onBirthdayClose:function() {
    this._BDBaloonShown = false;
    this._checkBirthdays();
    this.onPopupClose()
  }});
  WA.Promo = WA.extend(Object, {constructor:function() {
    this.smsPromo = new SmsPromo;
    this.friSug = new FriendsSuggest;
    this.friSug.clickEvent.on(this._onSugClick, this);
    this.agentPromo = new AgentPromo;
    this.friendBD = new FriendBirth;
    this._abstraction = new Abstraction;
    this.requestSuggestsEvent = (new U.Event).relay(this._abstraction.requestSuggestsEvent);
    this._abstraction.smsPromoEvent.on(this.smsPromo.show, this.smsPromo);
    this._abstraction.installAgentShowEvent.on(this._onInstallAgentShow, this);
    this._abstraction.suggestsShowEvent.on(this._showSuggests, this);
    this._abstraction.friendBirthdayEvent.on(this._showFriendBirthday, this);
    this.smsPromo.closeEvent.on(this._abstraction.smsClosed, this._abstraction);
    this.smsClickEvent = new U.Event;
    this.smsPromo.clickEvent.on(this._onPromoClick, this);
    this.onBeforeInstallAgentEvent = new U.Event;
    this.showUserProfileEvent = new U.Event;
    this.friendSelectEvent = new U.Event;
    this.onBeforeBirthdayShowEvent = new U.Event;
    this.noFriendsEvent = new U.Event;
    this.agentPromo.closeEvent.on(this._abstraction.onPopupClose, this._abstraction);
    this.friendBD.closeEvent.on(this._abstraction.onBirthdayClose, this._abstraction);
    this.friendBD.clickEvent.on(this._onFriendClick, this)
  }, _onInstallAgentShow:function() {
    if(this.onBeforeInstallAgentEvent.fire() !== false) {
      this.agentPromo.show()
    }else {
      return false
    }
  }, _showFriendBirthday:function(email, tomorrow) {
    if(this.onBeforeBirthdayShowEvent.fire(email) !== false) {
      this._abstraction.removeBDFromQueue(email);
      this.friendBD.show(email, null, tomorrow);
      U.Mnt.countRB(1563724)
    }else {
      return false
    }
  }, _onFriendClick:function(email) {
    U.Mnt.countRB(1563725);
    this.friendSelectEvent.fire(email)
  }, _showSuggests:function(list) {
    if(list) {
      this._sugList = list;
      this._sugIntex = 0;
      this._showSugIndex(this._sugIntex)
    }
  }, _showSugIndex:function(index) {
    var contact = this._sugList[index];
    this.friSug.show(contact.email, contact.nick, contact.relation, this._sugList.length)
  }, _remSug:function(index) {
    typeof index == "undefined" && (index = this._sugIntex);
    this._sugList.splice(index, 1);
    if(this._sugList.length) {
      index > this._sugIntex || this._sugIntex--;
      this._onSugClick({type:"next"})
    }else {
      this._onSugClick({type:"close"})
    }
  }, _onSugClick:function(ev) {
    switch(ev.type) {
      case "next":
        if(this._sugList) {
          this._sugIntex++;
          if(!this._sugList[this._sugIntex]) {
            this._sugIntex = 0
          }
          this._showSugIndex(this._sugIntex)
        }
        U.Mnt.countRB(1202999);
        break;
      case "prev":
        if(this._sugList) {
          this._sugIntex--;
          if(this._sugIntex < 0) {
            this._sugIntex = this._sugList.length - 1
          }
          this._showSugIndex(this._sugIntex)
        }
        U.Mnt.countRB(1202997);
        break;
      case "close":
        this.friSug.hide();
        this._abstraction.onPopupClose();
        U.Mnt.countRB(1202990);
        break;
      case "profile":
        this.showUserProfileEvent.fire(ev.mail);
        U.Mnt.countRB(1202995);
        break;
      case "add":
        this._remSug();
        WA.MainAgent.sendAddContact(ev.mail, ev.nick, function(success) {
        }, this);
        U.Mnt.countRB(1202991);
        break;
      case "nofriends":
        this._remSug();
        this.noFriendsEvent.fire(ev.mail);
        U.Mnt.countRB(1202992);
        break
    }
  }, _onPromoClick:function() {
    this.smsClickEvent.fire();
    S.save({"promo.click":"1"})
  }, checkCLStats:function() {
    if(this._statsChecked !== true) {
      this._statsChecked = true;
      this._abstraction.checkRegDate()
    }
  }, setCLOpen:function() {
    this._abstraction.setCLOpen()
  }, checkIdleStats:function() {
    if(this._idleStatsChecked !== true) {
      this._idleStatsChecked = true;
      WA.SessionStorage.load(["clist_list"], {success:function(data) {
        var list = data["clist_list"];
        if(!list) {
          this._abstraction.checkRegDateIdle()
        }
      }, scope:this})
    }
  }, render:function(ct) {
    this.smsPromo.render(ct);
    this.friSug.render(ct);
    this.agentPromo.render(ct);
    this.friendBD.render(ct);
    this.rendered = true
  }, deactivate:function() {
    this.friendBD.hide()
  }, destroy:function() {
    this.smsClickEvent.removeAll();
    this.smsPromo.destroy();
    this.friendBD.destroy();
    this._abstraction.destroy();
    this.onBeforeInstallAgentEvent.removeAll();
    this.onBeforeBirthdayShowEvent.removeAll();
    this.agentPromo.destroy()
  }})
})();
WebAgent.util.Mnt.wrapTryCatch(function() {
  var WA = WebAgent;
  var U = WA.util;
  var renderNotify = function() {
    window.notifications = new WA.Notifications;
    notifications.render(ma.boundEl)
  };
  var ma = WA.ma = new WA.MainAgent(WA.isPopup);
  if(ma.rendered) {
    renderNotify()
  }else {
    ma.renderEvent.on(renderNotify)
  }
  WA.afterFirstExecEvent.fire()
});

