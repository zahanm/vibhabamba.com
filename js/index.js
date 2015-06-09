/* @flow */

document.addEventListener('DOMContentLoaded', startup);

function startup() {
  reLayout();

  window.addEventListener("hashchange", reLayout);

  var closes = document.querySelectorAll('.focus .backout');
  Array.prototype.forEach.call(closes, function(x) {
    x.addEventListener('click', function() {
      document.location.hash = '';
    });
  });
}

function reLayout() {
  var root = document.querySelector('.page');
  var focii = document.querySelectorAll('.focus');

  var to_hide = [];
  var to_show = [];
  if (document.location.hash === '#ios') {
    to_hide.push(root);
    to_show.push.apply(to_show, Array.prototype.slice.call(focii));
  } else {
    to_hide.push.apply(to_hide, Array.prototype.slice.call(focii));
    to_show.push(root);
  }
  to_hide.forEach(function(el) {
    el.style.display = 'none';
  });
  to_show.forEach(function(el) {
    el.style.display = '';
  });
}
