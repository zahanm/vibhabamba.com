/* @flow */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

document.addEventListener('DOMContentLoaded', startup);

function startup() {
  reLayout();
  window.addEventListener('hashchange', reLayout);
  var android = new Gallery('#android .gallery img');
  android.start();
}

function reLayout() {
  var root = document.querySelector('#home');
  var pages = document.querySelectorAll('.page');

  var to_show = document.getElementById(document.location.hash.substring(1));
  if (to_show === null) {
    to_show = root;
  }

  // hide all pages
  Array.prototype.slice.call(pages).concat(root).map(function (page) {
    if (page === to_show) {
      return;
    }
    page.style.display = 'none';
  });
  // show the active one
  to_show.style.display = '';
  window.scroll(0, 0);
}

var Gallery = (function () {
  function Gallery(selector) {
    _classCallCheck(this, Gallery);

    this.images = Array.prototype.slice.call(document.querySelectorAll(selector));
    this.index = 0;
  }

  _createClass(Gallery, [{
    key: 'start',
    value: function start() {
      var _this = this;

      setInterval(function () {
        _this.nextImage();
      }, 5000); // in milli-seconds
    }
  }, {
    key: 'nextImage',
    value: function nextImage() {
      this.images[this.index].style.opacity = '0';
      this.images[this.nextIndex()].style.opacity = '1';
      this.index = this.nextIndex();
    }
  }, {
    key: 'nextIndex',
    value: function nextIndex() {
      return (this.index + 1) % this.images.length;
    }
  }]);

  return Gallery;
})();