/* @flow */
'use strict';

document.addEventListener('DOMContentLoaded', startup);

function startup(): void {
  reLayout();
  window.addEventListener('hashchange', reLayout);
  [
    '#ios .gallery img',
    '#android .gallery img',
  ].map((s) => {
    var g = new Gallery(s);
    g.start();
  });
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
  index: number;
  constructor(selector: string) {
    this.images = Array.prototype.slice.call(
      document.querySelectorAll(selector)
    );
    this.index = 0;
  }
  start(): void {
    setInterval(() => {
      this.nextImage();
    }, 5000); // in milli-seconds
  }
  nextImage(): void {
    this.images[this.index].style.opacity = '0';
    this.images[this.nextIndex()].style.opacity = '1';
    this.index = this.nextIndex();
  }
  nextIndex(): number {
    return ( this.index + 1 ) % this.images.length;
  }
}
