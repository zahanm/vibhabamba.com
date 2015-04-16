
document.addEventListener('DOMContentLoaded', startup);

function startup() {
  reLayout();

  var cells = document.querySelectorAll('.tiles .cell');
  Array.prototype.forEach.call(cells, function(cell) {
    cell.addEventListener('click', function() {
      document.location.hash = '#focus';
      reLayout();
    });
  });

  var closes = document.querySelectorAll('.focus .backout');
  Array.prototype.forEach.call(closes, function(x) {
    x.addEventListener('click', function() {
      document.location.hash = '';
      reLayout();
    });
  });
}

function reLayout() {
  var root = document.querySelector('.page');
  var focii = document.querySelectorAll('.focus');

  var to_hide = [];
  var to_show = [];
  if (document.location.hash === '#focus') {
    to_hide.push(root);
    to_show.push.apply(to_show, focii);
  } else {
    to_hide.push.apply(to_hide, focii);
    to_show.push(root);
  }
  to_hide.forEach(function(el) {
    el.style.display = 'none';
  });
  to_show.forEach(function(el) {
    el.style.display = 'block';
  });
}
