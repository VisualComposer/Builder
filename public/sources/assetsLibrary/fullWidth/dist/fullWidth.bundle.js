!function(t){var e={};function n(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(o,i,function(e){return t[e]}.bind(null,i));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p=".",n(n.s=0)}({"./src/fullWidth.js":function(t,e){!function(){if(void 0!==window.vceResetFullWidthElements)return;let t=!1,e=!1,n=1,o=void 0;const i='[data-vcv-layout-zone="header"]',l='[data-vcv-layout-zone="footer"]',r=".vcv-editor-theme-hf",c=".vce-full-width-custom-container";function u(){o=Array.prototype.slice.call(document.querySelectorAll('[data-vce-full-width="true"]:not([data-vcv-do-helper-clone]),[data-vce-full-width-section="true"]:not([data-vcv-do-helper-clone])')),o.length&&d()}function d(){o.length&&(e||"number"==typeof n&&1!==n||o.forEach((function(t){const e=document.body,n=t.parentElement,o=t.querySelector('[data-vce-element-content="true"]'),u=parseInt(window.getComputedStyle(t,null)["margin-left"],10),d=parseInt(window.getComputedStyle(t,null)["margin-right"],10);let s,a;if(t.closest(i)||t.closest(l)||t.closest(r))return;let f=t.closest(c);if(f?(s=0-n.getBoundingClientRect().left-u+f.getBoundingClientRect().left,a=f.getBoundingClientRect().width):(s=0-n.getBoundingClientRect().left-u,a=document.documentElement.getBoundingClientRect().width),t.style.width=a+"px",e.classList.contains("rtl")?t.style.right=s+"px":t.style.left=s+"px",t.getAttribute("data-vce-stretch-content")||t.getAttribute("data-vce-section-stretch-content"))o.style["padding-left"]="",o.style["padding-right"]="";else{let t=-1*s;t<0&&(t=0);let e=a-t-n.getBoundingClientRect().width+u+d;e<0&&(e=0),o.style["padding-left"]=t+"px",o.style["padding-right"]=e+"px"}})))}u(),window.addEventListener("touchstart",(function(t){2===t.touches.length&&(e=!0)}),!1),window.addEventListener("touchend",(function(t){e&&(e=!1,n=window.visualViewport&&window.visualViewport.scale)}),!1),window.addEventListener("resize",(function(){t||(d(),t=!0,setTimeout((function(){t=!1}),50))})),window.vceResetFullWidthElements=u,window.vcv.on("ready",(function(){window.vceResetFullWidthElements&&window.vceResetFullWidthElements()}))}()},0:function(t,e,n){t.exports=n("./src/fullWidth.js")}});