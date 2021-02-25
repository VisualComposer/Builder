/*! For license information please see lightbox.bundle.js.LICENSE.txt */
!function(t){var e={};function i(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p=".",i(i.s=0)}({"./src/lightbox.js":function(t,e,i){"use strict";i.r(e),function(){if(window.lightbox01613445)return!1;function t(t){this.album=[],this.currentImageIndex=void 0,window.jQuery(this.init.bind(this)),this.options=window.jQuery.extend({},this.constructor.defaults),this.option(t)}window.lightbox01613445=!0,t.defaults={albumLabel:"Image %1 of %2",alwaysShowNavOnTouchDevices:!1,fadeDuration:500,fitImagesInViewport:!0,positionFromTop:50,resizeDuration:700,showImageNumberLabel:!0,wrapAround:!1,disableScrolling:!1},t.prototype.option=function(t){window.jQuery.extend(this.options,t)},t.prototype.imageCountLabel=function(t,e){return this.options.albumLabel.replace(/%1/g,t).replace(/%2/g,e)},t.prototype.init=function(){this.enable(),this.build()},t.prototype.enable=function(){var t=this;window.jQuery("body").on("mousedown","a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]",(function(t){t.currentTarget.addEventListener("click",(function(t){return t.preventDefault(),!1}))})),window.jQuery("body").on("click","a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]",(function(e){return t.start(window.jQuery(e.currentTarget)),!1}))},t.prototype.build=function(){var t=this;window.jQuery('<div id="vce-lightboxOverlay" class="vce-lightboxOverlay"></div><div id="vce-lightbox" class="vce-lightbox"><div class="vce-lb-outerContainer"><div class="vce-lb-container"><img class="vce-lb-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" /><div class="vce-lb-nav"><a class="vce-lb-prev" href="" ></a><a class="vce-lb-next" href="" ></a></div><div class="vce-lb-loader"><a class="vce-lb-cancel"></a></div></div></div><div class="vce-lb-dataContainer"><div class="vce-lb-data"><div class="vce-lb-details"><span class="vce-lb-caption"></span><span class="vce-lb-number"></span></div><div class="vce-lb-closeContainer"><a class="vce-lb-close"></a></div></div></div></div>').appendTo(window.jQuery("body")),this.$lightbox=window.jQuery("#vce-lightbox"),this.$overlay=window.jQuery("#vce-lightboxOverlay"),this.$outerContainer=this.$lightbox.find(".vce-lb-outerContainer"),this.$container=this.$lightbox.find(".vce-lb-container"),this.containerTopPadding=parseInt(this.$container.css("padding-top"),10),this.containerRightPadding=parseInt(this.$container.css("padding-right"),10),this.containerBottomPadding=parseInt(this.$container.css("padding-bottom"),10),this.containerLeftPadding=parseInt(this.$container.css("padding-left"),10),this.$overlay.hide().on("click",(function(){return t.end(),!1})),this.$lightbox.hide().on("click",(function(e){return"vce-lightbox"===window.jQuery(e.target).attr("id")&&t.end(),!1})),this.$outerContainer.on("click",(function(e){return"vce-lightbox"===window.jQuery(e.target).attr("id")&&t.end(),!1})),this.$lightbox.find(".vce-lb-prev").on("click",(function(){return 0===t.currentImageIndex?t.changeImage(t.album.length-1):t.changeImage(t.currentImageIndex-1),!1})),this.$lightbox.find(".vce-lb-next").on("click",(function(){return t.currentImageIndex===t.album.length-1?t.changeImage(0):t.changeImage(t.currentImageIndex+1),!1})),this.$lightbox.find(".vce-lb-loader, .vce-lb-close").on("click",(function(){return t.end(),!1}))},t.prototype.start=function(t){var e=this,i=window.jQuery(window);i.on("resize",window.jQuery.proxy(this.sizeOverlay,this)),window.jQuery("select, object, embed").css({visibility:"hidden"}),this.sizeOverlay(),this.album=[];var n=0;function o(t){var i=Array.prototype.slice.call(t.get(0).classList).find((function(t){return t.match(/vce\-image\-filter\-\-/)}))||"";e.album.push({link:t.attr("href"),title:t.attr("data-title")||t.attr("title"),filterClass:i})}var a,r=t.attr("data-lightbox");if(r){a=window.jQuery(t.prop("tagName")+'[data-lightbox="'+r+'"]');for(var s=0;s<a.length;s=++s)o(window.jQuery(a[s])),a[s]===t[0]&&(n=s)}else if("lightbox"===t.attr("rel"))o(t);else{a=window.jQuery(t.prop("tagName")+'[rel="'+t.attr("rel")+'"]');for(var l=0;l<a.length;l=++l)o(window.jQuery(a[l])),a[l]===t[0]&&(n=l)}var h=i.scrollTop()+this.options.positionFromTop,d=i.scrollLeft();this.$lightbox.css({top:h+"px",left:d+"px"}).fadeIn(this.options.fadeDuration),this.options.disableScrolling&&window.jQuery("body").addClass("vce-lb-disable-scrolling"),this.changeImage(n)},t.prototype.changeImage=function(t){var e=this;this.disableKeyboardNav();var i=this.$lightbox.find(".vce-lb-image");this.$overlay.fadeIn(this.options.fadeDuration),window.jQuery(".vce-lb-loader").fadeIn("slow"),this.$lightbox.find(".vce-lb-image, .vce-lb-nav, .vce-lb-prev, .vce-lb-next, .vce-lb-dataContainer, .vce-lb-numbers, .vce-lb-caption").hide(),this.$outerContainer.addClass("vce-animating");var n=new Image;n.onload=function(){var o,a,r,s,l,h;i.attr("src",e.album[t].link);var d=Array.prototype.slice.call(i.get(0).classList).find((function(t){return t.match(/vce\-image\-filter\-\-/)}))||"";d&&i.removeClass(d),e.album[t].filterClass&&i.addClass(e.album[t].filterClass),window.jQuery(n),i.width(n.width),i.height(n.height),e.options.fitImagesInViewport&&(h=window.jQuery(window).width(),l=window.jQuery(window).height(),s=h-e.containerLeftPadding-e.containerRightPadding-20,r=l-e.containerTopPadding-e.containerBottomPadding-120,e.options.maxWidth&&e.options.maxWidth<s&&(s=e.options.maxWidth),e.options.maxHeight&&e.options.maxHeight<s&&(r=e.options.maxHeight),(n.width>s||n.height>r)&&(n.width/s>n.height/r?(a=s,o=parseInt(n.height/(n.width/a),10),i.width(a),i.height(o)):(o=r,a=parseInt(n.width/(n.height/o),10),i.width(a),i.height(o)))),e.sizeContainer(i.width(),i.height())},n.src=this.album[t].link,this.album[t].filterClass&&n.classList.add(this.album[t].filterClass),this.currentImageIndex=t},t.prototype.sizeOverlay=function(){this.$overlay.width(window.jQuery(document).width()).height(window.jQuery(document).height())},t.prototype.sizeContainer=function(t,e){var i=this,n=this.$outerContainer.outerWidth(),o=this.$outerContainer.outerHeight(),a=t+this.containerLeftPadding+this.containerRightPadding,r=e+this.containerTopPadding+this.containerBottomPadding;function s(){i.$lightbox.find(".vce-lb-dataContainer").width(a),i.$lightbox.find(".vce-lb-prevLink").height(r),i.$lightbox.find(".vce-lb-nextLink").height(r),i.showImage()}n!==a||o!==r?this.$outerContainer.animate({width:a,height:r},this.options.resizeDuration,"swing",(function(){s()})):s()},t.prototype.showImage=function(){this.$lightbox.find(".vce-lb-loader").stop(!0).hide(),this.$lightbox.find(".vce-lb-image").fadeIn("slow"),this.updateNav(),this.updateDetails(),this.preloadNeighboringImages(),this.enableKeyboardNav()},t.prototype.updateNav=function(){var t=!1;try{document.createEvent("TouchEvent"),t=!!this.options.alwaysShowNavOnTouchDevices}catch(e){}this.$lightbox.find(".vce-lb-nav").show(),this.album.length>1&&(this.options.wrapAround?(t&&this.$lightbox.find(".vce-lb-prev, .vce-lb-next").css("opacity","1"),this.$lightbox.find(".vce-lb-prev, .vce-lb-next").show()):(this.currentImageIndex>0&&(this.$lightbox.find(".vce-lb-prev").show(),t&&this.$lightbox.find(".vce-lb-prev").css("opacity","1")),this.currentImageIndex<this.album.length-1&&(this.$lightbox.find(".vce-lb-next").show(),t&&this.$lightbox.find(".vce-lb-next").css("opacity","1"))))},t.prototype.updateDetails=function(){var t=this;if(void 0!==this.album[this.currentImageIndex].title&&""!==this.album[this.currentImageIndex].title&&this.$lightbox.find(".vce-lb-caption").html(this.album[this.currentImageIndex].title).fadeIn("fast").find("a").on("click",(function(t){void 0!==window.jQuery(this).attr("target")?window.open(window.jQuery(this).attr("href"),window.jQuery(this).attr("target")):location.href=window.jQuery(this).attr("href")})),this.album.length>1&&this.options.showImageNumberLabel){var e=this.imageCountLabel(this.currentImageIndex+1,this.album.length);this.$lightbox.find(".vce-lb-number").text(e).fadeIn("fast")}else this.$lightbox.find(".vce-lb-number").hide();this.$outerContainer.removeClass("animating"),this.$lightbox.find(".vce-lb-dataContainer").fadeIn(this.options.resizeDuration,(function(){return t.sizeOverlay()}))},t.prototype.preloadNeighboringImages=function(){this.album.length>this.currentImageIndex+1&&((new Image).src=this.album[this.currentImageIndex+1].link);this.currentImageIndex>0&&((new Image).src=this.album[this.currentImageIndex-1].link)},t.prototype.enableKeyboardNav=function(){window.jQuery(document).on("keyup.keyboard",window.jQuery.proxy(this.keyboardAction,this))},t.prototype.disableKeyboardNav=function(){window.jQuery(document).off(".keyboard")},t.prototype.keyboardAction=function(t){var e=t.keyCode,i=String.fromCharCode(e).toLowerCase();27===e||i.match(/x|o|c/)?this.end():"p"===i||37===e?0!==this.currentImageIndex?this.changeImage(this.currentImageIndex-1):this.options.wrapAround&&this.album.length>1&&this.changeImage(this.album.length-1):"n"!==i&&39!==e||(this.currentImageIndex!==this.album.length-1?this.changeImage(this.currentImageIndex+1):this.options.wrapAround&&this.album.length>1&&this.changeImage(0))},t.prototype.end=function(){this.disableKeyboardNav(),window.jQuery(window).off("resize",this.sizeOverlay),this.$lightbox.fadeOut(this.options.fadeDuration),this.$overlay.fadeOut(this.options.fadeDuration),window.jQuery("select, object, embed").css({visibility:"visible"}),this.options.disableScrolling&&window.jQuery("body").removeClass("vce-lb-disable-scrolling")},new t}()},0:function(t,e,i){t.exports=i("./src/lightbox.js")}});