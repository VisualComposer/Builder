!function(e){var t={};function s(i){if(t[i])return t[i].exports;var l=t[i]={i:i,l:!1,exports:{}};return e[i].call(l.exports,l,l.exports,s),l.l=!0,l.exports}s.m=e,s.c=t,s.d=function(e,t,i){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)s.d(i,l,function(t){return e[t]}.bind(null,l));return i},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p=".",s(s.s=0)}({"./src/backgroundSlider.css":function(e,t,s){},"./src/backgroundSlider.js":function(e,t,s){"use strict";s.r(t);s("./src/backgroundSlider.css");window.vcv.on("ready",(function(e,t){if("merge"!==e){var s="[data-vce-assets-slider]";s=t?'[data-vcv-element="'+t+'"] '+s:s,window.vceAssetsBackgroundSlider(s)}}))},"./src/plugin.js":function(e,t){!function(e,t){var s=function(s){var i=t.querySelectorAll(s);return(i=[].slice.call(i)).forEach((function(s){s.getVceSlider?s.getVceSlider.refresh():{slider:null,slidesContainer:null,slides:[],activeSlide:0,isRtl:!1,timeout:1e3,effect:"slide",interval:null,init:function(e){return e.getVceSlider||(e.getVceSlider=this),this.slider=e,this.handleAnimationEnd=this.handleAnimationEnd.bind(this),this.refresh(),e.getVceSlider},handleAnimationEnd:function(e){e.target.removeAttribute("data-vce-assets-slider-effect"),e.target.style.visibility=null,e.target.style.opacity=null,e.target.style.left=null},refresh:function(){var t=this;this.isRtl="rtl"===e.getComputedStyle(this.slider).direction,this.timeout=1e3*parseInt(this.slider.dataset.vceAssetsSlider),this.direction=this.slider.dataset.vceAssetsSliderDirection||"left",this.slidesContainer=this.slider.querySelector(this.slider.dataset.vceAssetsSliderSlides),this.slides=this.slidesContainer.querySelectorAll(this.slider.dataset.vceAssetsSliderSlide),this.slides=[].slice.call(this.slides),"carousel"!==this.slider.dataset.vceAssetsSliderEffect?(this.slides.forEach((function(e,s){e.setAttribute("data-vce-assets-slider-stay-visible",!s),e.removeEventListener("animationend",t.handleAnimationEnd),e.addEventListener("animationend",t.handleAnimationEnd)})),this.effect="fade",this.slideTo(0),this.effect=this.slider.dataset.vceAssetsSliderEffect,this.autoplay()):this.initCarousel()},addKeyframesRule:function(e,s){var i="vce-asset-background-slide--carousel-".concat(e,"-").concat(s),l={left:"0% { transform: translateX(0); } 100% { transform: translateX(-".concat(100-100/s,"%); }"),top:{key:"100%",value:"0% { transform: translateY(0); } 100% { transform: translateY(-".concat(100-100/s,"%); }")},right:"0% { transform: translateX(-".concat(100-100/s,"%); } 100% { transform: translateX(0); }"),bottom:"0% { transform: translateY(-".concat(100-100/s,"%); } 100% { transform: translateY(0) }")};if(!t.getElementById(i)){var n=t.createElement("style");n.id=i,n.type="text/css";var r="@keyframes ".concat(i," { ").concat(l[e]," }");n.innerHTML=r,this.slidesContainer.parentElement.appendChild(n),this.slidesContainer.style.animationName=i}},initCarousel:function(){var e="left"===this.direction||"right"===this.direction;this.slidesContainer.classList.add("vce-asset-background-slider-slides-carousel"),e||this.slidesContainer.classList.add("vce-asset-background-slider-slides-carousel-vertical");for(var t=0;t<this.slides.length;t++)this.slides[t].classList.contains("clone")&&(this.slidesContainer.removeChild(this.slides[t]),this.slides.splice(t,1));var s=this.slides&&this.slides[0]&&this.slides[0].cloneNode();s&&s.classList.add("clone"),s&&this.slidesContainer.appendChild(s);var i=this.slides.length+1;this.slidesContainer.style[e?"width":"height"]="".concat(i,"00%"),this.slidesContainer.style.animationDuration="".concat((i-1)*(this.timeout/1e3),"s"),this.addKeyframesRule(this.direction,i)},destroy:function(){this.stopAutoplay(),this.slides.forEach((function(e){e.style.transform=null})),delete this.slider.getVceSlider},slideTo:function(e){if(e>=0&&e<this.slides.length){var t=this.activeSlide;switch(this.activeSlide=e,this.effect){case"fade":this.effectFade(this.slides[t],this.slides[e]);break;default:this.effectSlide(this.slides[t],this.slides[e])}}},effectSlide:function(e,t){e.style.left="0",e.style.visibility="visible",e.setAttribute("data-vce-assets-slider-stay-visible",!1),t.style.left="100%",t.style.visibility="visible",t.setAttribute("data-vce-assets-slider-stay-visible",!0),e.setAttribute("data-vce-assets-slider-effect","slide"),t.setAttribute("data-vce-assets-slider-effect","slide")},effectFade:function(e,t){e.style.opacity=1,e.style.visibility="visible",e.setAttribute("data-vce-assets-slider-stay-visible",!1),t.style.opacity=0,t.style.visibility="visible",t.setAttribute("data-vce-assets-slider-stay-visible",!0),e.setAttribute("data-vce-assets-slider-effect","fadeOut"),t.setAttribute("data-vce-assets-slider-effect","fadeIn")},slideToNext:function(){this.slides.length>1&&(this.activeSlide===this.slides.length-1?this.slideTo(0):this.slideTo(this.activeSlide+1))},slideToPrev:function(){this.slides.length>1&&(0===this.activeSlide?this.slideTo(this.slides.length-1):this.slideTo(this.activeSlide-1))},autoplay:function(){var t=this;this.stopAutoplay(),this.isRtl?this.interval=e.setInterval((function(){t.slideToPrev()}),this.timeout):this.interval=e.setInterval((function(){t.slideToNext()}),this.timeout)},stopAutoplay:function(){e.clearInterval(this.interval)}}.init(s)})),1===i.length?i.pop():i};e.vceAssetsBackgroundSlider=s}(window,document)},0:function(e,t,s){s("./src/plugin.js"),e.exports=s("./src/backgroundSlider.js")}});