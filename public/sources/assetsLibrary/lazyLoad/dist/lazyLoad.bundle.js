!function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p=".",r(r.s=0)}({"./src/lazyLoad.js":function(t,e){!function(t){t.vcvLozad=function(){"use strict";const e="undefined"!=typeof document&&document.documentMode,r=function(e){return t&&t[e]},n=["data-iesrc","data-alt","data-src","data-srcset","data-background-image","data-toggle-class"],o={rootMargin:"0px",threshold:0,enableAutoReload:!1,load:function(t){if("picture"===t.nodeName.toLowerCase()){let r=t.querySelector("img"),n=!1;null===r&&(r=document.createElement("img"),n=!0),e&&t.getAttribute("data-iesrc")&&(r.src=t.getAttribute("data-iesrc")),t.getAttribute("data-alt")&&(r.alt=t.getAttribute("data-alt")),n&&t.append(r)}if("video"===t.nodeName.toLowerCase()&&!t.getAttribute("data-src")&&t.children){const e=t.children;let r;for(let t=0;t<=e.length-1;t++)r=e[t].getAttribute("data-src"),r&&(e[t].src=r);t.load(),t.hasAttribute("autoplay")&&t.play()}t.getAttribute("data-poster")&&(t.poster=t.getAttribute("data-poster")),t.getAttribute("data-src")&&(t.src=t.getAttribute("data-src")),t.getAttribute("data-srcset")&&t.setAttribute("srcset",t.getAttribute("data-srcset"));let r=",";if(t.getAttribute("data-background-delimiter")&&(r=t.getAttribute("data-background-delimiter")),t.getAttribute("data-background-image"))t.style.backgroundImage="url('"+t.getAttribute("data-background-image").split(r).join("'),url('")+"')";else if(t.getAttribute("data-background-image-set")){const e=t.getAttribute("data-background-image-set").split(r);let n=e[0].substr(0,e[0].indexOf(" "))||e[0];n=-1===n.indexOf("url(")?"url("+n+")":n,1===e.length?t.style.backgroundImage=n:t.setAttribute("style",(t.getAttribute("style")||"")+"background-image: "+n+"; background-image: -webkit-image-set("+e+"); background-image: image-set("+e+")")}t.getAttribute("data-toggle-class")&&t.classList.toggle(t.getAttribute("data-toggle-class"))},loaded:function(){}};function a(t){t.setAttribute("data-loaded",!0)}function i(t){t.getAttribute("data-placeholder-background")&&(t.style.background=t.getAttribute("data-placeholder-background"))}const u=function(t){return"true"===t.getAttribute("data-loaded")},c=function(t,e){return function(r,n){r.forEach((function(r){(r.intersectionRatio>0||r.isIntersecting)&&(n.unobserve(r.target),u(r.target)||(console.log("onIntersection trigger load"),t(r.target),a(r.target),e(r.target)))}))}},d=function(t){return function(e){e.forEach((function(e){u(e.target)&&"attributes"===e.type&&n.indexOf(e.attributeName)>-1&&t(e.target)}))}},s=function(t){const e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:document;return t instanceof Element?[t]:t instanceof NodeList?t:e.querySelectorAll(t)};return function(){const t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:".vcv-lozad",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},l=Object.assign({},o,e),g=l.root,b=l.rootMargin,f=l.threshold,m=l.enableAutoReload,v=l.load,p=l.loaded;let A,y;r("IntersectionObserver")&&(A=new IntersectionObserver(c(v,p),{root:g,rootMargin:b,threshold:f})),r("MutationObserver")&&m&&(y=new MutationObserver(d(v)));const h=s(t,g);for(let r=0;r<h.length;r++)i(h[r]);return{observe:function(){const e=s(t,g);for(let t=0;t<e.length;t++)u(e[t])||(A?(y&&m&&y.observe(e[t],{subtree:!0,attributes:!0,attributeFilter:n}),A.observe(e[t])):(v(e[t]),a(e[t]),p(e[t])));return!0},triggerLoad:function(t){u(t)||(v(t),a(t),p(t))},observer:A,mutationObserver:y}}}();let e=!1;t.vcv&&t.vcv.on("ready",(function(){if(console.log("lazyLoad ready"),!e){e=!0;t.vcvLozad().observe()}}))}(window)},0:function(t,e,r){t.exports=r("./src/lazyLoad.js")}});