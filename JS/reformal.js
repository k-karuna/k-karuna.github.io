if (reformalOptions && !Reformal) {
    var Reformal = (function(e) {
        var g = {renderTemplate: function(h, i) {
                return h.replace(/{{(.*?)}}/g, function(k, j) {
                    var l = i[j];
                    return typeof l === "string" || typeof l === "number" ? l : k
                })
            },extendObject: function(i, h) {
                for (prop in h) {
                    i[prop] = h[prop]
                }
                return i
            },includeCss: function(i) {
                var h = document.createElement("style");
                h.setAttribute("type", "text/css");
                h.setAttribute("media", "screen");
                if (h.styleSheet) {
                    h.styleSheet.cssText = i
                } else {
                    h.appendChild(document.createTextNode(i))
                }
                document.getElementsByTagName("head")[0].appendChild(h)
            },isQuirksMode: function() {
                return document.compatMode && document.compatMode == "BackCompat"
            },logHit: function(j) {
                var h = new Image();
                h.src = g.proto + "reformal.ru/log.php?id=" + j + "&r=" + Math.round(100000 * Math.random())
            },isSsl: "https:" == document.location.protocol,proto: "https:" == document.location.protocol ? "https://" : "http://"};
        g.ieVersion = (function() {
            if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                return new Number(RegExp.$1)
            }
            return null
        })();
        g.supportsCssPositionFixed = (function() {
            if (g.ieVersion === null) {
                return true
            }
            if (g.ieVersion < 7) {
                return false
            }
            return !g.isQuirksMode()
        })();
        var d = g.extendObject({project_id: null,project_host: null,show_tab: true,force_new_window: false,tab_orientation: "left",tab_indent: "200px",tab_image_url: "",tab_image_ssl_url: "",tab_is_custom: false,tab_bg_color: "transparent",tab_border_color: "#FFFFFF",tab_border_radius: 5,tab_border_width: 2,tab_shadow_color: "#888",widget_width: 740,widget_height: 520,demo_mode: false}, e);
        d.project_url = ["http://", d.project_host].join("");
        d.widget_url = [g.proto, "reformal.ru/widget/", d.project_id, "?nhic=1&_=", Math.round(10000 * Math.random())].join("");
        d.empty_gif_url = [g.proto, "media.reformal.ru/widgets/v3/x.gif"].join("");
        d.close_image_url = [g.proto, "media.reformal.ru/widgets/v3/close.png"].join("");
        d.gradient_image_url = [g.proto, "media.reformal.ru/widgets/v3/", function() {
                switch (d.tab_orientation) {
                    case "left":
                        return "gl.png";
                    case "right":
                        return "gr.png";
                    case "top-left":
                        return "gt.png";
                    case "top-right":
                        return "gt.png";
                    case "bottom-left":
                        return "gb.png";
                    case "bottom-right":
                        return "gb.png"
                }
            }()].join("");
        if (!g.supportsCssPositionFixed) {
            d.force_new_window = true
        }
        if (!d.tab_image_url) {
            d.tab_image_url = d.empty_gif_url
        }
        if (g.isSsl) {
            d.tab_image_url = d.tab_image_ssl_url || function(h) {
                var i = h.split("//");
                if (i[0] == "https:") {
                    return h
                }
                return "https://" + i[1]
            }(d.tab_image_url)
        }
        Tab = {tabImagePreloaded: false,tabImageHeight: 0,tabImageWidth: 0,show: function() {
                var h, m, j, o, p, n, i, l, k;
                if (!this.tabImagePreloaded) {
                    this.preloadTabImage();
                    return
                }
                i = /%/.test(d.tab_indent) ? "%" : "px";
                l = /\d+/.exec(d.tab_indent)[0];
                m = "#reformal_tab {display:block; font-size:0; background-color:{{tab_bg_color}} !important; line-height: 0; cursor: pointer; z-index:100001;";
                switch (d.tab_orientation) {
                    case "left":
                        m += "left:0;";
                        break;
                    case "right":
                        m += "right:0;";
                        break;
                    case "top-left":
                    case "bottom-left":
                        m += "left:{{tab_indent}};";
                        break;
                    case "top-right":
                    case "bottom-right":
                        m += "right:{{tab_indent}};";
                        break
                }
                if (i == "%") {
                    k = this.tabImageHeight / 2;
                    if (!d.tab_is_custom) {
                        k += 10
                    }
                    switch (d.tab_orientation) {
                        case "left":
                        case "right":
                            m += ["margin-top:", -k, "px;"].join("");
                            break;
                        case "top-left":
                        case "bottom-left":
                            m += ["margin-left:", -k, "px;"].join("");
                            break;
                        case "top-right":
                        case "bottom-right":
                            m += ["margin-right:", -k, "px;"].join("");
                            break
                    }
                }
                if (g.supportsCssPositionFixed) {
                    m += "position:fixed;";
                    switch (d.tab_orientation) {
                        case "left":
                        case "right":
                            m += "top:{{tab_indent}};";
                            break;
                        case "top-left":
                        case "top-right":
                            m += "top:0;";
                            break;
                        case "bottom-left":
                        case "bottom-right":
                            m += "bottom:0;";
                            break
                    }
                } else {
                    m += "position:absolute;";
                    switch (d.tab_orientation) {
                        case "left":
                        case "right":
                            if (i == "%") {
                                m += 'top: expression(parseInt(document.documentElement.scrollTop || document.body.scrollTop) + parseInt(document.documentElement.clientHeight || document.body.clientHeight)*{{tab_indent_value}}/100 + "px");'
                            } else {
                                m += 'top: expression(parseInt(document.documentElement.scrollTop || document.body.scrollTop) + {{tab_indent_value}} + "px");'
                            }
                            break;
                        case "top-left":
                        case "top-right":
                            m += 'top: expression(parseInt(document.documentElement.scrollTop || document.body.scrollTop) + "px");';
                            break;
                        case "bottom-left":
                        case "bottom-right":
                            m += 'top: expression(parseInt(document.documentElement.scrollTop || document.body.scrollTop) + parseInt(document.documentElement.clientHeight || document.body.clientHeight) - this.offsetHeight + "px");';
                            break
                    }
                }
                if (!d.tab_is_custom) {
                    m += "border:{{tab_border_width}}px solid {{tab_border_color}};";
                    switch (d.tab_orientation) {
                        case "left":
                            m += "padding:10px 4px 10px 4px; border-left:0;   background: {{tab_bg_color}} url({{gradient_image_url}}) 0 0 repeat-y;    -webkit-border-radius:0 {{tab_border_radius}}px {{tab_border_radius}}px 0; -moz-border-radius:0 {{tab_border_radius}}px {{tab_border_radius}}px 0; border-radius:0 {{tab_border_radius}}px {{tab_border_radius}}px 0; -moz-box-shadow:1px 0 2px {{tab_shadow_color}};  -webkit-box-shadow:1px 0 2px {{tab_shadow_color}};  box-shadow:1px 0 2px {{tab_shadow_color}};";
                            break;
                        case "right":
                            m += "padding:10px 3px 10px 5px; border-right:0;  background: {{tab_bg_color}} url({{gradient_image_url}}) 100% 0 repeat-y; -webkit-border-radius:{{tab_border_radius}}px 0 0 {{tab_border_radius}}px; -moz-border-radius:{{tab_border_radius}}px 0 0 {{tab_border_radius}}px; border-radius:{{tab_border_radius}}px 0 0 {{tab_border_radius}}px; -moz-box-shadow:-1px 0 2px {{tab_shadow_color}}; -webkit-box-shadow:-1px 0 2px {{tab_shadow_color}}; box-shadow:-1px 0 2px {{tab_shadow_color}};";
                            break;
                        case "top-left":
                        case "top-right":
                            m += "padding:4px 10px 4px 10px; border-top:0;    background: {{tab_bg_color}} url({{gradient_image_url}}) 0 0 repeat-x;    -webkit-border-radius:0 0 {{tab_border_radius}}px {{tab_border_radius}}px; -moz-border-radius:0 0 {{tab_border_radius}}px {{tab_border_radius}}px; border-radius:0 0 {{tab_border_radius}}px {{tab_border_radius}}px; -moz-box-shadow:0 1px 2px {{tab_shadow_color}};  -webkit-box-shadow:0 1px 2px {{tab_shadow_color}};  box-shadow:0 1px 2px {{tab_shadow_color}};";
                            break;
                        case "bottom-left":
                        case "bottom-right":
                            m += "padding:5px 10px 3px 10px; border-bottom:0; background: {{tab_bg_color}} url({{gradient_image_url}}) 0 100% repeat-x; -webkit-border-radius:{{tab_border_radius}}px {{tab_border_radius}}px 0 0; -moz-border-radius:{{tab_border_radius}}px {{tab_border_radius}}px 0 0; border-radius:{{tab_border_radius}}px {{tab_border_radius}}px 0 0; -moz-box-shadow:0 -1px 2px {{tab_shadow_color}}; -webkit-box-shadow:0 -1px 2px {{tab_shadow_color}}; box-shadow:0 -1px 2px {{tab_shadow_color}};";
                            break
                    }
                } else {
                    m += "border: none;"
                }
                m += "}";
                if (!d.tab_is_custom) {
                    m += "#reformal_tab:hover {";
                    switch (d.tab_orientation) {
                        case "left":
                            m += "padding-left:6px;";
                            break;
                        case "right":
                            m += "padding-right:6px;";
                            break;
                        case "top-left":
                        case "top-right":
                            m += "padding-top:6px;";
                            break;
                        case "bottom-left":
                        case "bottom-right":
                            m += "padding-bottom:6px;";
                            break
                    }
                    m += "}"
                }
                m += "#reformal_tab img {border: none; padding:0; margin: 0;}";
                if (g.ieVersion && g.ieVersion < 7) {
                    m += "#reformal_tab {display:inline-block; background-image: none;}";
                    m += '#reformal_tab img {filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src="{{tab_image_url}}", sizingMethod="image");}'
                }
                j = g.renderTemplate(m, {tab_indent: l + i,tab_indent_value: l,tab_bg_color: d.tab_bg_color,tab_image_url: d.tab_image_url,tab_border_color: d.tab_border_color,tab_border_radius: d.tab_border_radius,tab_shadow_color: d.tab_shadow_color,tab_border_width: d.tab_border_width,gradient_image_url: d.gradient_image_url});
                g.includeCss(j);
                o = [d.force_new_window ? "window.open('" + d.project_url + "')" : "Reformal.widgetOpen()", "return false;"].join(";"), p = "Reformal.widgetPreload();";
                n = "Reformal.widgetAbortPreload();";
                if (d.demo_mode) {
                    o = p = "return false;"
                }
                h = document.createElement("a");
                h.setAttribute("id", "reformal_tab");
                h.setAttribute("href", d.demo_mode ? "#" : d.project_url);
                h.setAttribute("onclick", o);
                h.setAttribute("onmouseover", p);
                h.setAttribute("onmouseout", n);
                h.innerHTML = g.renderTemplate('<img src="{{tab_image_url}}" alt="" />', {tab_image_url: (g.ieVersion && g.ieVersion < 7) ? d.empty_gif_url : d.tab_image_url});
                document.body.insertBefore(h, document.body.firstChild)
            },preloadTabImage: function() {
                var i = function(j) {
                    j.onload = function() {
                    };
                    if (Tab.tabImagePreloaded) {
                        return false
                    }
                    Tab.tabImagePreloaded = true;
                    Tab.tabImageHeight = j.height;
                    Tab.tabImageWidth = j.width;
                    Tab.show()
                };
                var h = new Image();
                h.src = d.tab_image_url;
                if (h.complete) {
                    i(h)
                } else {
                    h.onload = function() {
                        i(h)
                    };
                    h.onerror = function() {
                    }
                }
            }};
        var b = function() {
            if (navigator.userAgent.toLowerCase().indexOf("firefox") == -1) {
                return
            }
            if (g.isSsl) {
                return
            }
            var n = document.getElementsByTagName("noscript"), k = new RegExp("<s*a[^>]*href[^>]*(reformal.ru|" + d.project_host + ")[^>]*>", "i");
            for (var j = 0, m = n.length; j < m; j++) {
                if (k.test(n[j].textContent)) {
                    return
                }
            }
            var l, h = document.getElementsByTagName("a"), k = new RegExp("reformal.ru|" + d.project_host, "i");
            for (var j = 0, m = h.length; j < m; j++) {
                l = h[j];
                if (l.id && l.id == "reformal_tab") {
                    continue
                }
                if (k.test(l.href)) {
                    return
                }
            }
            var j = new Image();
            j.src = "http://log.reformal.ru/bl.php?pid=" + d.project_id + "&url=" + window.location.href
        };
        Widget = {hitCounted: false,preloaded: false,overleyElement: null,widgetElement: null,open: function() {
                if (!this.preloaded) {
                    this.preload()
                }
                this.overleyElement.style.display = "block";
                this.widgetElement.style.display = "block";
                if (!this.hitCounted) {
                    this.hitCounted = true;
                    g.logHit(1654)
                }
            },close: function() {
                this.overleyElement.style.display = "none";
                this.widgetElement.style.display = "none"
            },preload: function() {
                if (this.preloaded) {
                    return
                }
                var j = "            #reformal_widget-overlay {width:100%; height:100%; background:#000; position:fixed; top:0; left:0; z-index:100002;}             #reformal_widget-overlay {filter:progid:DXImageTransform.Microsoft.Alpha(opacity=60);-moz-opacity: 0.6;-khtml-opacity: 0.6;opacity: 0.6;}             #reformal_widget {position: fixed; z-index:100003; top:50%; left:50%; width:{{width}}px; height:{{height}}px; background:#ECECEC; margin: {{margin_top}}px 0 0 {{margin_left}}px; -webkit-border-radius: 6px; -moz-border-radius:  6px; border-radius:  6px;}             #reformal_widget {-webkit-box-shadow:0 0 15px #000; -moz-box-shadow: 0 0 15px #000; box-shadow:0 0 15px #000;}             #reformal_widget iframe {padding:0; margin:0; border:0;}             #reformal_widget #reformal_widget-close {display:block; width:34px; height:34px; background: url({{close_image_url}}) no-repeat 0 0; position:absolute; top:-17px; right:-17px; z-index:100004;}";
                if (!g.supportsCssPositionFixed) {
                    j += '                #reformal_widget-overlay {position: absolute; top: expression(parseInt(document.documentElement.scrollTop || document.body.scrollTop) + "px");}                #reformal_widget {position: absolute; top: expression(parseInt(document.documentElement.scrollTop || document.body.scrollTop) + parseInt(document.documentElement.clientHeight || document.body.clientHeight)/2 + "px");}'
                }
                var i = g.renderTemplate(j, {width: d.widget_width,height: d.widget_height,margin_left: -d.widget_width / 2,margin_top: -d.widget_height / 2,close_image_url: d.close_image_url});
                g.includeCss(i);
                this.overleyElement = document.createElement("div");
                this.overleyElement.setAttribute("id", "reformal_widget-overlay");
                this.overleyElement.setAttribute("onclick", "Reformal.widgetClose();");
                this.widgetElement = document.createElement("div");
                this.widgetElement.setAttribute("id", "reformal_widget");
                this.widgetElement.innerHTML = '             <a href="#" onclick="Reformal.widgetClose(); return false;" id="reformal_widget-close"></a>             <iframe src="' + d.widget_url + '" frameborder="0" scrolling="no" width="100%" height="100%"></iframe>';
                this.widgetElement.style.display = "none";
                this.overleyElement.style.display = "none";
                document.body.insertBefore(this.widgetElement, document.body.firstChild);
                document.body.insertBefore(this.overleyElement, document.body.firstChild);
                this.preloaded = true;
                try {
                    b()
                } catch (h) {
                }
            }};
        if (d.show_tab) {
            Tab.show();
            if (g.ieVersion !== null) {
                if (g.isQuirksMode()) {
                    g.logHit(1657)
                } else {
                    g.logHit(1658)
                }
            }
        }
        var a = function() {
            if (g.ieVersion !== null) {
                g.logHit(1656)
            } else {
                g.logHit(1655)
            }
        };
        var c = false;
        var f = 0;
        return {widgetOpen: function() {
                Widget.open()
            },widgetPreload: function() {
                if (!c) {
                    c = true;
                    a()
                }
                if (d.force_new_window) {
                    return
                }
            },widgetAbortPreload: function() {
                if (!f) {
                    return
                }
                clearTimeout(f)
            },widgetClose: function() {
                Widget.close()
            },tabShow: function() {
                Tab.show()
            }}
    })(reformalOptions)
}
;
