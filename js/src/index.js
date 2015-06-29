/* @flow */
'use strict';

document.addEventListener('DOMContentLoaded', startup);

function startup(): void {
  reLayout();
  window.addEventListener('hashchange', reLayout);
  var g = new Gallery();
  g.setupListener();
}

function reLayout(): void {
  var root: HTMLElement = document.querySelector('#home');
  var pages: NodeList<HTMLElement> = document.querySelectorAll('.page');

  var to_show = document.getElementById(document.location.hash.substring(1));
  if (to_show === null) {
    to_show = root;
  }

  // hide all pages
  Array.prototype.slice.call(pages).concat(root).map(function(page) {
    if (page === to_show) {
      return;
    }
    page.style.display = 'none';
  });
  // show the active one
  to_show.style.display = '';
  window.scroll(0, 0);
}

class Gallery {
  images: Array<HTMLElement>;
  constructor() {
    this.images = Array.prototype.slice.call(
      document.querySelectorAll('#android .gallery img')
    );
  }
  setupListener(): void {
    this.images[0].addEventListener('click', () => {
      this.fade();
    });
  }
  fade(): void {
    this.images[0].style.opacity = '0';
    this.images[1].style.opacity = '1';
  }
}
