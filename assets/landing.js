(function () {
  'use strict';

  // Open the viewer in its own full-screen window, as the original Flash
  // piece did, leaving this statement open in the window underneath.
  var enter = document.querySelector('.enter');

  enter.addEventListener('click', function (e) {
    var w = screen.width;
    var h = screen.height;
    var win = window.open(enter.href, 'viewer',
      'width=' + w + ',height=' + h + ',left=0,top=0,scrollbars=no,resizable=yes');
    if (!win) return;                  // popup blocked: follow the link instead
    e.preventDefault();
    try {
      win.moveTo(0, 0);
      win.resizeTo(w, h);
    } catch (err) {}
    win.focus();
  });
})();
