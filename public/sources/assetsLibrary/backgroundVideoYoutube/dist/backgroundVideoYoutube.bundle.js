!function(e){var t={};function i(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p=".",i(i.s=0)}({"./src/backgroundVideoYoutube.css":function(e,t){},"./src/backgroundVideoYoutube.js":function(e,t,i){"use strict";i.r(t);i("./src/backgroundVideoYoutube.css");window.vcv.on("ready",(function(e,t){if("merge"!==e){var i="[data-vce-assets-video-yt]";i=t?'[data-vcv-element="'+t+'"] '+i:i,window.vceAssetsBackgroundVideoYoutube(i)}}))},"./src/plugin.js":function(e,t){!function(e,t){var i={init:function(i){var n=t.querySelectorAll(i);return(n=[].slice.call(n)).forEach((function(t){t.getVceYoutubeVideo?t.getVceYoutubeVideo.updatePlayer():function(t){({element:null,player:null,ytPlayer:null,videoId:null,resizer:null,ratio:null,setup:function(t){return t.getVceYoutubeVideo?this.updatePlayer():(t.getVceYoutubeVideo=this,this.element=t,this.resizer=t.querySelector("svg"),this.checkYT(),this.checkOrientation=this.checkOrientation.bind(this),e.addEventListener("resize",this.checkOrientation)),t.getVceYoutubeVideo},updatePlayerData:function(){this.player=t.querySelector(t.dataset.vceAssetsVideoReplacer),this.videoId=t.dataset.vceAssetsVideoYt||null},checkYT:function(){var e=arguments.length<=0||void 0===arguments[0]?0:arguments[0];if("undefined"!=typeof YT&&YT.loaded)this.createPlayer();else{if(e>100)return void console.warn("Too many attempts to load YouTube IFrame API");var t=this;setTimeout((function(){e++,t.checkYT(e)}),100)}},createPlayer:function(){var e=this;this.updatePlayerData(),this.ytPlayer=new YT.Player(this.player,{videoId:this.videoId,playerVars:{autoplay:1,start:0,modestbranding:1,controls:0,disablekb:1,fs:0,iv_load_policy:3,loop:1,playlist:this.videoId,rel:0,showinfo:0,mute:1},events:{onReady:function(t){var i=t.target.a.getAttribute("height"),n=t.target.a.getAttribute("width");e.resizer.setAttribute("height",i),e.resizer.setAttribute("width",n),e.resizer.setAttribute("data-vce-assets-video-state","visible"),e.ratio=parseInt(n)/parseInt(i),e.checkOrientation(),t.target.mute()}}})},updatePlayer:function(){this.ytPlayer.destroy(),this.createPlayer()},checkOrientation:function(){var t=this.element.dataset.vceAssetsVideoOrientationClass||null,i=e.getComputedStyle(this.element.parentNode);t&&(parseInt(i.width)/parseInt(i.height)>this.ratio?this.element.classList.add(t):this.element.classList.remove(t))}}).setup(t)}(t)})),1===n.length?n.pop():n}};e.vceAssetsBackgroundVideoYoutube=function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;if("undefined"==typeof YT||!YT.loaded)return n>100?void console.warn("Too many attempts to load YouTube IFrame API"):void setTimeout((function(){e(t,++n)}),100);i.init(t)}}(window,document)},"./src/youtubeIframeApi.js":function(e,t){!function(e,t){if(!t.getElementById("vcv-asset-youtube-iframe-api")){var i=t.createElement("script");i.id="vcv-asset-youtube-iframe-api",i.src="https://www.youtube.com/iframe_api",t.head.appendChild(i)}}(window,document)},0:function(e,t,i){i("./src/youtubeIframeApi.js"),i("./src/plugin.js"),e.exports=i("./src/backgroundVideoYoutube.js")}});