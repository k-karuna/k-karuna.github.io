(function(e,t){function a(){e.name||(e.name='{"yandex_timeout":'+new Date+"}")}function n(){var t=(e.name+"").match(/"yandex_timeout":(\d+)/);return t?t[1]+1>new Date-9e5:undefined}e.yandex_ad_is_displayed=!1;var r,c=8e3,o="<%= PROTOCOL %>//an.yandex.ru/resource/context_static_r<%= CODE_VER %>.js",s="https:"===e.location.protocol?"https:":"http:",d=e.Ya=e.Ya||{};if(d.codeVer||(d.loaderVer=619,d.codeVer=.05>Math.random()?619:617,d.jsVer=d.codeVer),r=o.replace("<%= CODE_VER %>",d.codeVer).replace("<%= PROTOCOL %>",s),e.yandex_context_callbacks||e.yandexContextAsyncCallbacks){var i=t.createElement("script"),l=t.getElementsByTagName("script")[0];i.type="text/javascript",i.src=r,l.parentNode.insertBefore(i,l)}else setTimeout(function(){var n=t.getElementsByTagName("script"),r=n?n[n.length-1]:null;!r||e.Ya&&e.Ya.Context||"yes"!=r.getAttribute("yandex_load_check")||(r.parentNode.removeChild(r),a())},c),n()||t.write('<script type="text/javascript" src="'+r+'" yandex_load_check="yes"></sc'+"ript>")})(this,this.document);