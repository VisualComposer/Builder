import './backgroundVideoEmbed.css';

window.vcv.on('ready', function (action, id) {
  if (action !== 'merge') {
    var selector = '[data-vce-assets-video-embed]';
    selector = id ? '[data-vcv-element="' + id + '"] ' + selector : selector;

    const isLazyElement = document.querySelector(`${selector} .vcv-lozad`);

    if (!isLazyElement) {
      window.vceAssetsBackgroundVideoEmbed(selector);
    }
  }
});