/* @flow */

document.addEventListener('DOMContentLoaded', startup);

function startup() {
  reLayout();
  window.addEventListener("hashchange", reLayout);
}

function reLayout() {
  var root = document.querySelector('#home');
  var pages = document.querySelectorAll('.page');

  // currently selected element from document.location.hash
  var to_show = document.querySelector(':target');
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
}
