/* @flow */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

document.addEventListener('DOMContentLoaded', startup);

function startup() {
  reLayout();
  window.addEventListener('hashchange', reLayout);
  var g = new Gallery();
  g.setupListener();
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
  function Gallery() {
    _classCallCheck(this, Gallery);

    this.images = Array.prototype.slice.call(document.querySelectorAll('#android .gallery img'));
  }

  _createClass(Gallery, [{
    key: 'setupListener',
    value: function setupListener() {
      var _this = this;

      this.images[0].addEventListener('click', function () {
        _this.fade();
      });
    }
  }, {
    key: 'fade',
    value: function fade() {
      this.images[0].style.opacity = '0';
      this.images[1].style.opacity = '1';
    }
  }]);

  return Gallery;
})();