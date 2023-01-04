!function(){if("function"==typeof window.VcvCustomEvent)return!1;function t(t,e){e=e||Object.assign({},{bubbles:!1,cancelable:!1,detail:void 0});const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,e.bubbles,e.cancelable,e.detail),n}t.prototype=window.Event.prototype,window.VcvCustomEvent=t}(),function(t){"use strict";window.VcvAccordion=function(e){let n,i;const o=e;this.settings=e;const r=function(e,i){const r=Array.prototype.slice.call(arguments,1);return this.each((function(){const a=t(this);let c=a.data(o.accordionContainer);c||(c=new n(a,t.extend(!0,{},i)),a.data(o.accordionContainer,c)),"string"==typeof e&&c[e].apply(c,r)}))};this.getPlugin=function(){return r},n=function(t,e){this.$element=t,this.activeAttribute=o.activeAttribute,this.animatingAttribute=o.animatingAttribute,this.positionToActive=o.positionToActive,this.useCacheFlag=void 0,this.$target=void 0,this.$targetContent=void 0,this.selector=void 0,this.$container=void 0,this.animationDuration=void 0,this.index=0},n.transitionEvent=function(){let t;const e=document.createElement("vcFakeElement"),n={transition:"transitionend",MSTransition:"msTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(t in n)if(void 0!==e.style[t])return n[t]},n.emulateTransitionEnd=function(t,e){let i,o=!1;e||(e=250),t.one(n.transitionName,(function(){o=!0})),i=function(){o||t.trigger(n.transitionName)},setTimeout(i,e)},n.DEFAULT_TYPE="collapse",n.transitionName=n.transitionEvent(),n.prototype.controller=function(t){const e=this.$element;let i=t;"string"!=typeof i&&(i=e.data("vceAction")||this.getContainer().data("vceAction")),void 0===i&&(i=n.DEFAULT_TYPE),"string"==typeof i&&r.call(e,i,t)},n.prototype.isCacheUsed=function(){const t=this;return void 0===this.useCacheFlag&&(this.useCacheFlag=!1!==t.$element.data("vceUseCache")),this.useCacheFlag},n.prototype.getSelector=function(){const t=this.$element,e=function(){let e=t.data("vceTarget");return e||(e=t.attr("href")),e};return this.isCacheUsed()?(void 0===this.selector&&(this.selector=e()),this.selector):e()},n.prototype.findContainer=function(){let e=this.$element.closest(this.$element.data("vceContainer"));return e.length||(e=t("body")),e},n.prototype.getContainer=function(){return this.isCacheUsed()?(void 0===this.$container&&(this.$container=this.findContainer()),this.$container):this.findContainer()},n.prototype.getTarget=function(){const t=this,e=t.getSelector(),n=function(){let n;return n=t.getContainer().find(e),n.length||(n=t.getContainer().filter(e)),n};return this.isCacheUsed()?(void 0===this.$target&&(this.$target=n()),this.$target):n()},n.prototype.getTargetContent=function(){let t;const e=this.getTarget();return this.isCacheUsed()?(void 0===this.$targetContent&&(t=e,e.data("vceContent")&&(t=e.find(e.data("vceContent")),t.length||(t=e)),this.$targetContent=t),this.$targetContent):e.data("vceContent")&&(t=e.find(e.data("vceContent")),t.length)?t:e},n.prototype.getTriggers=function(){let e=0;const n=this.getContainer().find(o.slidePanelsSelector)[0];return t(n).find(o.slidePanelHeadingSelector).each((function(){const n=t(this);let i=n.data(o.accordionContainer);void 0===i&&(n[o.accordionPropertyName](),i=n.data(o.accordionContainer)),i&&i.setIndex&&i.setIndex(e++)}))},n.prototype.setIndex=function(t){this.index=t},n.prototype.getIndex=function(){return this.index},n.prototype.triggerEvent=function(e,n){if("string"==typeof e){const i=t.Event(e);this.$element.trigger(i,n)}},n.prototype.getActiveTriggers=function(){return this.getTriggers().filter((function(){const e=t(this).data(o.accordionContainer);return"true"===e.getTarget().attr(e.activeAttribute)}))},n.prototype.changeLocationHash=function(){let t;const e=this.getTarget();e.length&&(t=e.attr("id")),t&&history.replaceState(null,null,"#"+t)},n.prototype.isActive=function(){return"true"===this.getTarget().attr(this.activeAttribute)},n.prototype.getAnimationDuration=function(){const t=this,e=function(){let e,i;return void 0===n.transitionName?"0s":(e=t.getTargetContent(),i=e.css("transition-duration"),i=i.split(",")[0],i)};return this.isCacheUsed()?(void 0===this.animationDuration&&(this.animationDuration=e()),this.animationDuration):e()},n.prototype.getAnimationDurationMilliseconds=function(){const t=this.getAnimationDuration();return"ms"===t.substr(-2)?parseInt(t):"s"===t.substr(-1)?Math.round(1e3*parseFloat(t)):void 0},n.prototype.isAnimated=function(){return parseFloat(this.getAnimationDuration())>0},n.prototype.show=function(e){const i=this,r=i.getTarget(),a=i.getTargetContent().eq(0),c=i.getContainer()[0],s=i.$element.attr("href"),l=new window.VcvCustomEvent("vcvAccordionAttrChange");if(c.setAttribute(o.openedAttribute,s),c.dispatchEvent(l),i.triggerEvent(o.showAccordionSelector,e),i.isActive())return;const d=[].slice.call(a[0].querySelectorAll('*[id^="el"]'));d&&d.length&&d.forEach((t=>{const e=t.id.replace("el-","");window.vcv.trigger("reInit","reInit",e)})),i.isAnimated()?(i.triggerEvent(o.beforeShowAccordionSelector),r.queue((function(t){a.one(n.transitionName,(function(){r.removeAttr(i.animatingAttribute),a.attr("style",""),i.triggerEvent(o.afterShowAccordionSelector,e)})),n.emulateTransitionEnd(a,i.getAnimationDurationMilliseconds()+100),t()})).queue((function(t){a.attr("style",""),a.css({visibility:"hidden",display:"block"});const e=a.height();a.data("vceHeight",e),a.attr("style",""),t()})).queue((function(t){a.height(0),a.css({"padding-top":0,"padding-bottom":0}),t()})).queue((function(t){r.attr(i.animatingAttribute,!0),r.attr(i.activeAttribute,!0),r.removeAttr(i.positionToActive),("object"==typeof e&&Object.prototype.hasOwnProperty.call(e,"changeHash")&&e.changeHash||void 0===e)&&i.changeLocationHash(),t()})).queue((function(t){const e=a.data("vceHeight");a.animate({height:e},{duration:i.getAnimationDurationMilliseconds(),complete:function(){a.data("events")||(a.attr("style",""),r.find(o.tabPanelBodySelector).removeAttr("hidden"),r.find(o.slidePanelTitleSelector).attr("aria-selected",!0))}}),a.css({"padding-top":"","padding-bottom":""}),t()})).queue((function(e){const n=r.prevAll(),a=r.nextAll();n.each((function(e,n){const a=t(n);a.attr(i.positionToActive,"before"),a.removeAttr(i.activeAttribute),r.find(o.tabPanelBodySelector).attr("hidden",!0),r.find(o.slidePanelTitleSelector).attr("aria-selected",!1)})),a.each((function(e,n){const a=t(n);a.attr(i.positionToActive,"after"),a.removeAttr(i.activeAttribute),r.find(o.tabPanelBodySelector).attr("hidden",!0),r.find(o.slidePanelTitleSelector).attr("aria-selected",!1)})),e()}))):(r.attr(i.activeAttribute,!0),r.find(o.tabPanelBodySelector).removeAttr("hidden"),r.find(o.slidePanelTitleSelector).attr("aria-selected",!1),i.triggerEvent(o.showAccordionSelector,e))},n.prototype.hide=function(t){const e=this,i=e.getTarget(),r=e.getTargetContent().eq(0);let a=0;e.isActive()&&(e.isAnimated()?(e.triggerEvent(o.beforeHideAccordionSelector),i.queue((function(a){r.one(n.transitionName,(function(){i.removeAttr(e.animatingAttribute),r.attr("style",""),e.triggerEvent(o.afterHideAccordionSelector,t)})),n.emulateTransitionEnd(r,e.getAnimationDurationMilliseconds()+100),a()})).queue((function(n){a=r.height(),i.attr(e.animatingAttribute,!0),i.removeAttr(e.activeAttribute),i.find(o.tabPanelBodySelector).attr("hidden",!0),i.find(o.slidePanelTitleSelector).attr("aria-selected",!1),e.triggerEvent(o.hideAccordionSelector,t),n()})).queue((function(t){r.height(a),t()})).queue((function(t){r.animate({height:0},e.getAnimationDurationMilliseconds()),r.css({"padding-top":0,"padding-bottom":0}),t()}))):(i.removeAttr(e.activeAttribute),i.find(o.tabPanelBodySelector).attr("hidden",!0),i.find(o.slidePanelTitleSelector).attr("aria-selected",!1),e.triggerEvent(o.hideAccordionSelector,t)))},n.prototype.toggle=function(t){const e=this.$element;this.isActive()?r.call(e,"hide",t):r.call(e,"show",t)},n.prototype.dropdown=function(e){const n=this.$element;this.isActive()?r.call(n,"hide",e):(r.call(n,"show",e),t(document).on(o.accordionDropdownEventSelector,(function(i){r.call(n,"hide",e),t(document).off(i)})))},n.prototype.collapse=function(t){const e=this.$element,n=this.getActiveTriggers().filter((function(){return e[0]!==this})),i=e.closest(o.tabsSelector).attr("data-close-on-click"),a=e.closest(o.slidePanelSelector).attr(o.activeAttribute);n.length&&r.call(n,"hide",t),"true"===i&&"true"===a?r.call(e,"toggle",t):a||r.call(e,"show",t),a&&history.replaceState(null,null,window.location.pathname+window.location.search)},n.prototype.collapseAll=function(t){const e=this.$element,n=this.getActiveTriggers().filter((function(){return e[0]!==this}));n.length&&r.call(n,"hide",t),r.call(e,"toggle",t)},n.prototype.showNext=function(t){let e;const n=this.getTriggers(),i=this.getActiveTriggers();if(n.length){if(i.length){let t=i.eq(i.length-1)[o.accordionPropertyName]().data(o.accordionContainer);t&&t.getIndex&&(e=t.getIndex())}e>-1&&e+1<n.length?r.call(n.eq(e+1),"controller",t):r.call(n.eq(0),"controller",t)}},n.prototype.showPrev=function(t){let e;const n=this.getTriggers(),i=this.getActiveTriggers();if(n.length){if(i.length){let t;t=i.eq(i.length-1)[accordionPropertyName]().data(o.accordionContainer),t&&t.getIndex&&(e=t.getIndex())}r.call(e>-1?e-1>=0?n.eq(e-1):n.eq(n.length-1):n.eq(0),"controller",t)}},n.prototype.showAt=function(t,e){const n=this.getTriggers();n.length&&t&&t<n.length&&r.call(n.eq(t),"controller",e)},n.prototype.scrollToActive=function(e){if(void 0!==e&&void 0!==e.scrollTo&&!e.scrollTo)return;const n=this,i=t(this.getTarget());i.length&&this.$element.length&&setTimeout((function(){i.offset().top-t(window).scrollTop()-1*n.$element.outerHeight()<0&&t("html, body").animate({scrollTop:i.offset().top-1*n.$element.outerHeight()},300)}),300)},this.setupAccordionProperty=function(){i=t.fn[o.accordionPropertyName],t.fn[o.accordionPropertyName]=r,t.fn[o.accordionPropertyName].Constructor=n,t.fn[o.accordionPropertyName].noConflict=function(){return t.fn[o.accordionPropertyName]=i,this}},this.clickHandler=function(e){const n=t(this);e.preventDefault(),r.call(n,"controller")},this.hashNavigation=function(){const e=window.location.hash,n=e&&t(e),i=n.length&&n.find(o.getAccordionHashSelector(e));i.length&&(setTimeout((function(){t("html, body").animate({scrollTop:n.offset().top-.2*t(window).height()},0)}),300),i.trigger("click"),i.closest(o.tabsSelector).attr("data-vcv-initialized",!0).attr("data-vcv-hash-navigated",!0),a("add"))},this.setActiveTab=function(e,n){let i=t(o.tabsSelector+":not([data-vcv-hash-navigated])");if(void 0===e||"add"===e||"update"===e){if("update"===e){const e=t("#el-"+n);if(!e||!e.hasClass("vce-global-element"))return;i=e.find(o.tabsSelector)}if(e&&"add"===e&&n){let e="#el-"+n;i=t(e+o.tabsSelector),i.length<1&&(e="#el-"+n+"-temp",i=t(e+o.tabsSelector))}i&&i.each((function(e,n){const i=t(n);let r=parseInt(i.attr(o.activeTabAttribute));const a=i.find(o.slidePanelsSelector)[0],c=t(a).find("> "+o.slidePanelSelector),s=i.find(o.slideInnerSelector)[0];let l=null;const d=new window.VcvCustomEvent("vcvAccordionAttrChange"),h=o.tabsAndAccordion&&i.find(o.tabContainerSelector)[0],u=o.tabsAndAccordion&&t(h).find("> "+o.tabDataSelector);r=c.length>=r?r-1:0,t(c).each((function(e,n){const i=t(n);i.removeAttr(o.activeAttribute),i.find(o.tabPanelBodySelector).attr("hidden",!0),i.find(o.slidePanelTitleSelector).attr("aria-selected",!1),e<r?i.attr(o.positionToActive,"before"):e===r?(i.find(o.tabPanelBodySelector).removeAttr("hidden"),i.find(o.slidePanelTitleSelector).attr("aria-selected",!0),i.attr(o.activeAttribute,!0),i.find(o.tabPanelBodySelector).get(0).style.height="",l=i.attr("data-model-id")):e>r&&i.attr(o.positionToActive,"after")})),u&&t(u).each((function(e,n){const i=t(n);i.removeAttr(o.activeAttribute),i.find(o.tabsTitleSelector).attr("aria-selected",!1),e===r&&(i.attr(o.activeAttribute,!0),i.find(o.tabsTitleSelector).attr("aria-selected",!0))})),s.setAttribute(o.openedAttribute,l),s.dispatchEvent(d)}))}};const a=this.setActiveTab},window.VcvAccordion.prototype.init=function(){const e=this.getPlugin();this.setActiveTab("add"),this.setupAccordionProperty(),t(document).on(this.settings.accordionClickEventSelector,this.settings.accordionDataSelector,this.clickHandler),t(this.hashNavigation),t(document).on(this.settings.accordionAfterShowEventSelector,(function(n,i){e.call(t(n.target),"scrollToActive",i)}))}}(window.jQuery);