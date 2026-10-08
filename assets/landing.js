(function () {
  'use strict';

  // Open the viewer in its own full-screen window, as the original Flash
  // piece did, leaving this statement open in the window underneath.
  // Enter is a button, not a link, so the viewer never replaces this page.
  var enter = document.querySelector('.enter');
  var blocked = document.querySelector('.blocked');

  enter.addEventListener('click', function () {
    // Called synchronously in the click so browsers treat it as user-initiated.
    var w = screen.width;
    var h = screen.height;
    var win = window.open('viewer.html', 'viewer',
      'width=' + w + ',height=' + h + ',left=0,top=0,scrollbars=no,resizable=yes');
    if (!win) {
      blocked.hidden = false;
      return;
    }
    blocked.hidden = true;
    try {
      win.moveTo(0, 0);
      win.resizeTo(w, h);
    } catch (err) {}
    win.focus();
  });
})();
