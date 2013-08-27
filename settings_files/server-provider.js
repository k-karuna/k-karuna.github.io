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
function isHostMethod(object, property) {
  var t = typeof object[property];
  return t == "function" || !!(t == "object" && object[property]) || t == "unknown"
}
var getXhr = function() {
  if(isHostMethod(window, "XMLHttpRequest")) {
    return function() {
      return new XMLHttpRequest
    }
  }else {
    var item = function() {
      var list = ["Microsoft", "Msxml2", "Msxml3"], i = list.length;
      while(i--) {
        try {
          item = list[i] + ".XMLHTTP";
          var obj = new ActiveXObject(item);
          return item
        }catch(e) {
        }
      }
    }();
    return function() {
      return new ActiveXObject(item)
    }
  }
}();
var remote = new easyXDM.Rpc({local:"name.html"}, {local:{request:function(config, success, error) {
  easyXDM.apply(config, {method:"GET", headers:{"Content-Type":"application/x-www-form-urlencoded", "X-Requested-With":"XMLHttpRequest"}, success:Function.prototype, error:function(msg) {
    throw new Error(msg);
  }, data:{}, timeout:10 * 1E3}, true);
  var isPOST = config.method == "POST";
  var pairs = [];
  for(var key in config.data) {
    if(config.data.hasOwnProperty(key)) {
      pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(config.data[key]))
    }
  }
  var data = pairs.join("&");
  var req = getXhr();
  req.open(config.method, config.url + (isPOST ? "" : "?" + data), true);
  for(var prop in config.headers) {
    if(config.headers.hasOwnProperty(prop) && config.headers[prop]) {
      req.setRequestHeader(prop, config.headers[prop])
    }
  }
  var timeout;
  timeout = setTimeout(function() {
    req.abort();
    error({message:"timeout after " + config.timeout + " second", status:0, data:null, toString:function() {
      return this.message + " Status: " + this.status
    }}, null)
  }, config.timeout);
  req.onreadystatechange = function() {
    if(req.readyState == 4) {
      clearTimeout(timeout);
      try {
        var status = req.status
      }catch(e) {
      }
      if(!status || status < 200 || status >= 300) {
        error("INVALID_STATUS_CODE", {status:status, data:req.responseText})
      }else {
        success({data:req.responseText, status:status})
      }
      req.onreadystatechange = Function.prototype;
      req = null
    }
  };
  req.send(isPOST ? data : "")
}}});

