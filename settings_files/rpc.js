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
(function() {
  var WA = WebAgent;
  var U = WA.util;
  var extend = WA.extend;
  var AbstractStorage = extend(Object, {_prefix:"_STRG_", load:function(key) {
  }, save:function(key, value) {
  }, remove:function(key) {
  }, clear:function() {
  }});
  var StorageProxy = extend(AbstractStorage, {constructor:function(storage) {
    this.storage = storage
  }, _processLoadSuccess:function(successFn, data, loadOptions) {
    if(WA.isFunction(successFn)) {
      successFn(data, loadOptions)
    }
    return{success:true, result:data}
  }, _processLoadError:function(errorFn, e) {
    if(WA.isFunction(errorFn)) {
      errorFn(e)
    }
    return{success:false, error:e}
  }, load:function(key, successFn, errorFn) {
    var data = null;
    var options = {params:key};
    if(WA.isArray(key)) {
      try {
        data = {};
        WA.each(key, function(k) {
          data[k] = this.storage.load(k)
        }, this)
      }catch(e) {
        return this._processLoadError(errorFn, e)
      }
      return this._processLoadSuccess(successFn, data, options)
    }else {
      try {
        data = this.storage.load(key)
      }catch(e) {
        return this._processLoadError(errorFn, e)
      }
      return this._processLoadSuccess(successFn, data, options)
    }
  }, save:function(data, successFn, errorFn) {
    try {
      WA.util.Object.each(data, function(value, key) {
        this.storage.save(key, value)
      }, this)
    }catch(e) {
      if(WA.isFunction(errorFn)) {
        errorFn(e)
      }
      return false
    }
    if(WA.isFunction(successFn)) {
      successFn()
    }
    return true
  }, remove:function(key, successFn, errorFn) {
    if(WA.isArray(key)) {
      try {
        WA.each(key, function(k) {
          this.storage.remove(k)
        }, this)
      }catch(e) {
        errorFn(e);
        return
      }
      successFn()
    }else {
      try {
        this.storage.remove(key)
      }catch(e) {
        errorFn(e);
        return
      }
      successFn()
    }
  }, clear:function(successFn, errorFn) {
    try {
      this.storage.clear()
    }catch(e) {
      errorFn(e);
      return
    }
    successFn()
  }});
  var LocalStorage = extend(AbstractStorage, {constructor:function() {
    try {
      var lcVerify = Math.random();
      var lcKey = "lcVerify" + lcVerify;
      localStorage.setItem(lcKey, lcVerify);
      var stValue = localStorage.getItem(lcKey);
      if(stValue != lcVerify) {
        U.Mnt.log({reason:"lcVerify2", text:"local value: " + lcVerify + " storage value: " + stValue})
      }
      localStorage.removeItem(lcKey);
      localStorage.removeItem("lcVerify")
    }catch(e) {
      U.Mnt.log({reason:"lcVerify2", text:"error: " + e})
    }
    this._preventiveCleanup = 3
  }, load:function(key) {
    return localStorage[this._prefix + key] || ""
  }, save:function(key, value) {
    key = this._prefix + key;
    var backup = localStorage[key];
    try {
      if(!this._preventiveCleanup) {
        localStorage.removeItem(key)
      }
      localStorage[key] = value
    }catch(e) {
      try {
        localStorage.removeItem(key);
        localStorage[key] = value;
        if(this._preventiveCleanup) {
          this._preventiveCleanup--
        }
      }catch(e) {
        localStorage[key] = backup
      }
      throw"Writing failed";
    }
  }, remove:function(key, cb) {
    key = this._prefix + key;
    try {
      localStorage.removeItem(key)
    }catch(e) {
      localStorage[key] = "";
      throw e;
    }
  }, clear:function(cb) {
    localStorage.clear();
    cb()
  }});
  var UserData = extend(AbstractStorage, {_storageName:"storageUserData", constructor:function() {
    WA.util.DomHelper.rapidHtmlInsert('<div id="ud" style="position:absolute; top:0; left:-1000px;"></div>');
    this._el = WebAgent.getDom("ud");
    this._el.addBehavior("#default#userData")
  }, load:function(key) {
    key = (this._prefix + key).replace(/\$/g, "-");
    this._el.load(this._storageName);
    return decodeURIComponent(this._el.getAttribute(key) || "")
  }, save:function(key, value) {
    key = (this._prefix + key).replace(/\$/g, "-");
    this._el.setAttribute(key, encodeURIComponent(value));
    this._el.save(this._storageName)
  }, remove:function(key) {
    key = (this._prefix + key).replace(/\$/g, "-");
    this._el.removeAttribute(key);
    this._el.save(this._storageName)
  }, clear:function() {
  }});
  var Cookie = extend(AbstractStorage, {_getKey:function(key) {
    return encodeURIComponent(this._prefix + key)
  }, _setCookie:function(name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + encodeURIComponent(value) + (expires ? "; expires=" + (new Date(expires)).toUTCString() : "") + (path ? "; path=" + path : "") + (domain ? "; domain=" + domain : "") + (secure ? "; secure" : "")
  }, load:function(key) {
    return decodeURIComponent((("" + document.cookie).match(new RegExp(this._getKey(key) + "=([^;]+)")) || [0, ""])[1])
  }, save:function(key, value) {
    this._setCookie(this._getKey(key), value, 0)
  }, remove:function(key) {
    this._setCookie(this._getKey(key), "", +new Date - 31536E3)
  }, each:function(cb, scope) {
    ("" + document.cookie).replace(new RegExp(this._prefix + "([^=]+)=([^;]*)", "g"), function(nope, key, value) {
      cb.call(scope || window, decodeURIComponent(value), key)
    })
  }, clear:function(key) {
    this.each(function(value, key) {
      this.remove(key)
    }, this)
  }});
  var instances = {};
  var engineList = {"localStorage":LocalStorage, "cookie":Cookie};
  WA.StorageProvider = {getInstance:function(engine) {
    if(!engine || !engineList[engine]) {
      engine = "cookie"
    }
    if(!instances[engine]) {
      var storage = new engineList[engine];
      instances[engine] = new StorageProxy(storage)
    }
    return instances[engine]
  }}
})();
WebAgent.namespace("WebAgent.rpc");
(function() {
  var WA = WebAgent;
  var invokers = {};
  var cache = {};
  var dispatch = function(id, rpc) {
    var obj = cache[id];
    if(!obj) {
      var clazz = invokers[id];
      if(clazz) {
        obj = cache[id] = new clazz(id, rpc)
      }
    }
    return obj
  };
  var Remote = WA.rpc.Remote = {invoke:function(rpc, options, successFn, errorFn) {
    var id = options.id;
    var obj = dispatch(id, rpc);
    if(obj && options.method) {
      return obj.invoke(options.method, options.params || {}, successFn, errorFn)
    }else {
      try {
        WA.error("Invoker not found: " + id)
      }catch(e) {
        errorFn(e)
      }
    }
    return null
  }, register:function(id, clazz) {
    if(!invokers[id]) {
      invokers[id] = clazz
    }
  }};
  Remote.Invoker = WA.extend(WA.Activatable, {constructor:function(id, rpc) {
    this.id = id;
    this.rpc = rpc;
    this.storage = WA.StorageProvider.getInstance(WA.isIE ? "cookie" : "localStorage");
    this.hugeStorage = WA.StorageProvider.getInstance("localStorage");
    this.initInvoker()
  }, initInvoker:function() {
  }, invoke:function(method, params, successFn, errorFn) {
    if("activate" === method || "deactivate" === method) {
      var ret = this[method](params);
      successFn();
      return ret
    }else {
      return this._invokeMethod(method, params, successFn, errorFn)
    }
  }, _invokeMethod:function(method, params, successFn, errorFn) {
    WA.abstractError()
  }, _invokeRemoteMethod:function(method, params) {
    this.rpc.invoke({id:this.id, method:method, params:params})
  }})
})();
(function() {
  var WA = WebAgent;
  var Remote = WA.rpc.Remote;
  var START_TIME = +new Date;
  var PREFIX = "fm_";
  var CURRENT = PREFIX + "current";
  var MINIMAL_CHECK_INTERVAL = 300;
  if(window.opera) {
    var NORMAL_CHECK_INTERVAL = MINIMAL_CHECK_INTERVAL;
    var TIMEOUT = 4E3
  }else {
    NORMAL_CHECK_INTERVAL = 15E3;
    TIMEOUT = NORMAL_CHECK_INTERVAL * 2
  }
  var FMI = WA.extend(Remote.Invoker, {initInvoker:function() {
    FMI.superclass.initInvoker.call(this);
    WA.fly(window).on("unload", this._onWindowUnload, this);
    WA.fly(window).on("beforeunload", this._onWindowUnload, this);
    this.focused = false;
    this.uid = PREFIX + "_uid_" + (new Date).getTime();
    this.checker = new WA.util.DelayedTask({interval:MINIMAL_CHECK_INTERVAL, fn:this._doFocusCheck, scope:this})
  }, _onWindowUnload:function() {
    this._writeCurrent(true);
    WA.fly(window).un("unload", this._onWindowUnload, this);
    WA.fly(window).un("beforeunload", this._onWindowUnload, this)
  }, _onWindowStorage:function(ev) {
    var event = ev.browserEvent;
    if("key" in event && "newValue" in event) {
      if(event.key === "_STRG_" + CURRENT) {
        this._doFocusCheck()
      }
    }else {
      if(WA.isFF36) {
        this.checker.start(1)
      }else {
        this._doFocusCheck()
      }
    }
  }, _isExpired:function(time) {
    return(new Date).getTime() - time > TIMEOUT
  }, _invokeMethod:function(method, params, successFn, errorFn) {
    if("tryToFocus" === method) {
      return this._tryToFocus(true, successFn, errorFn)
    }else {
      if("ifFocused" === method) {
        return this._ifFocused(successFn, errorFn)
      }
    }
  }, _writeCurrent:function(onUnload, onAfterUnload) {
    var data = WA.util.Object.pair(CURRENT, this.uid + ";" + (new Date).getTime() + ";" + START_TIME + ";" + +!!onUnload + ";" + +!!onAfterUnload);
    return this.storage.save(data)
  }, _readCurrent:function() {
    var o = this.storage.load(CURRENT);
    if(o.success) {
      var data = o.result;
      if(data) {
        var tmp = data.split(";");
        return{uid:tmp[0], time:parseInt(tmp[1]), start:parseInt(tmp[2]), unloaded:parseInt(tmp[3]), afterunload:parseInt(tmp[4])}
      }
    }
    return{uid:null, time:0, start:0, unloaded:0, afterunload:0}
  }, _onActivate:function(forceFocus) {
    WA.fly(WA.isIE8 ? document : window).on("storage", this._onWindowStorage, this);
    var o = this._readCurrent();
    if(!o.uid || o.uid === this.uid || this._isExpired(o.time) || forceFocus) {
      this._tryToFocus()
    }
    if(!this.checker.isStarted()) {
      this.checker.start(MINIMAL_CHECK_INTERVAL)
    }
  }, _onDeactivate:function() {
    WA.fly(WA.isIE8 ? document : window).un("storage", this._onWindowStorage, this);
    this.checker.stop();
    this._blur()
  }, _tryToFocus:function(byUserAction, successFn, errorFn) {
    this._waitingFocusingDone = !!byUserAction;
    var retval = this._writeCurrent();
    this._doFocusCheck();
    return retval
  }, _ifFocused:function(successFn, errorFn) {
    var current = this._readCurrent();
    var ret = current.uid === this.uid;
    successFn(ret);
    return ret
  }, _focus:function(isExpired) {
    if(!this.focused) {
      this.focused = true;
      this._invokeRemoteMethod("focus", isExpired)
    }
  }, _blur:function() {
    if(this.focused) {
      this.focused = false;
      this._invokeRemoteMethod("blur")
    }
  }, _doFocusCheck:function() {
    var current = this._readCurrent();
    var isExpired = this._isExpired(current.time);
    if(current.afterunload) {
      if(START_TIME <= current.start) {
        this._writeCurrent();
        this._focus(isExpired)
      }
    }else {
      if(current.uid === this.uid || isExpired || current.unloaded) {
        this._writeCurrent(false, current.unloaded);
        this._focus(isExpired)
      }else {
        this._blur()
      }
    }
    if(this._waitingFocusingDone) {
      this._invokeRemoteMethod("focusingDone");
      delete this._waitingFocusingDone
    }
    this.checker.start(isExpired ? MINIMAL_CHECK_INTERVAL : NORMAL_CHECK_INTERVAL)
  }});
  Remote.register("FocusManager", FMI)
})();
(function() {
  var WA = WebAgent;
  var Remote = WA.rpc.Remote;
  var HugeStorage = WA.extend(Remote.Invoker, {_invokeMethod:function(method, params, successFn, errorFn) {
    try {
      return this.hugeStorage[method](params, successFn, errorFn)
    }catch(e) {
      if(WA.isFunction(errorFn)) {
        errorFn(e)
      }
    }
  }});
  Remote.register("HugeStorage", HugeStorage)
})();
(function() {
  var WA = WebAgent;
  var Remote = WA.rpc.Remote;
  var MPI = WA.extend(Remote.Invoker, {initInvoker:function() {
    MPI.superclass.initInvoker.call(this);
    this.updater = new WA.util.DelayedTask({interval:500, fn:function() {
      this._doPopupUpdate()
    }, scope:this})
  }, _onActivate:function() {
    this.updater.start()
  }, _doPopupUpdate:function() {
    var o = this.storage.load("popup_state");
    if(o.success) {
      var state = o.result;
      if("CLOSE" === state) {
        this.storage.save({popup_state:"0"});
        this._invokeRemoteMethod("closePopup", "")
      }else {
        this.storage.save({popup_state:(new Date).getTime()})
      }
    }
    this.updater.start()
  }});
  Remote.register("MasterPopup", MPI)
})();
(function() {
  var WA = WebAgent;
  var Remote = WA.rpc.Remote;
  var SPI = WA.extend(Remote.Invoker, {initInvoker:function() {
    SPI.superclass.initInvoker.call(this);
    this.state = null;
    this.checker = new WA.util.DelayedTask({interval:1E3, fn:function() {
      this._doPopupCheck()
    }, scope:this})
  }, _onActivate:function() {
    this.checker.start()
  }, _invokeMethod:function(method, params, successFn, errorFn) {
    if("closePopup" === method) {
      return this.storage.save({popup_state:"CLOSE"}, successFn, errorFn)
    }
  }, _doChangePopupState:function(newState) {
    if(this.state !== newState) {
      this.state = newState;
      this._invokeRemoteMethod("changePopupState", newState)
    }
  }, _checkPopupState:function(newState) {
    newState = parseInt(newState);
    var time = (new Date).getTime();
    if(WA.isNumber(newState)) {
      if(time - newState > 2500) {
        this._doChangePopupState(0)
      }else {
        this._doChangePopupState(1)
      }
    }else {
      this._doChangePopupState(0)
    }
  }, _doPopupCheck:function() {
    var o = this.storage.load("popup_state");
    if(o.success) {
      this._checkPopupState(o.result)
    }
    this.checker.start()
  }});
  Remote.register("SlavePopup", SPI)
})();
(function() {
  var WA = WebAgent;
  var Remote = WA.rpc.Remote;
  var Storage = WA.extend(Remote.Invoker, {_invokeMethod:function(method, params, successFn, errorFn) {
    try {
      return this.storage[method](params, successFn, errorFn)
    }catch(e) {
      if(WA.isFunction(errorFn)) {
        errorFn(e)
      }
    }
  }});
  Remote.register("Storage", Storage)
})();

