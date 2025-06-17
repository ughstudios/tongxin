(function() {
  var index = 0;
  function showCurrent() {
    var items = document.querySelectorAll('.video-item');
    items.forEach(function(el, i) {
      el.style.display = i === index ? 'block' : 'none';
    });
  }
  function next() {
    var items = document.querySelectorAll('.video-item');
    index = (index + 1) % items.length;
    showCurrent();
  }
  document.addEventListener('DOMContentLoaded', function() {
    showCurrent();
    window.addEventListener('wheel', function(e) {
      if (e.deltaY > 0) next();
    });
  });
})();
