(function () {
  'use strict';

  var TOTAL = 200;
  var HOLD_MS = 1500;
  var FADE_MS = 900;
  var START = new Date(2003, 2, 16); // March 16, 2003
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

  var front = document.getElementById('front');
  var back = document.getElementById('back');
  var caption = document.getElementById('caption');
  var playBtn = document.getElementById('play');
  var pauseBtn = document.getElementById('pause');
  var nextBtn = document.getElementById('next');

  var index = 0;      // 0-based day index currently shown
  var playing = false;
  var timer = null;
  var token = 0;      // invalidates pending fades/timers when state changes

  function dateFor(i) {
    return new Date(START.getFullYear(), START.getMonth(), START.getDate() + i);
  }
  function pad(n, w) { n = String(n); while (n.length < w) n = '0' + n; return n; }

  // Files are named YYMMDD_NNN.jpg, e.g. 030316_001.jpg.
  function srcFor(i) {
    var d = dateFor(i);
    return pad(d.getFullYear() % 100, 2) + pad(d.getMonth() + 1, 2) +
      pad(d.getDate(), 2) + '_' + pad(i + 1, 3) + '.jpg';
  }
  function captionFor(i) {
    var d = dateFor(i);
    return 'Day ' + (i + 1) + ' — ' + MONTHS[d.getMonth()] + ' ' +
      d.getDate() + ', ' + d.getFullYear();
  }

  var cache = {};
  function preload(i) {
    if (i < TOTAL && !cache[i]) { cache[i] = new Image(); cache[i].src = srcFor(i); }
  }

  function updateUI() {
    var atEnd = index >= TOTAL - 1;
    caption.textContent = captionFor(index);
    front.alt = back.alt = captionFor(index);
    playBtn.disabled = playing || atEnd;
    pauseBtn.disabled = !playing;
    nextBtn.disabled = atEnd;
  }

  function showInstant(i) {
    token++;
    clearTimeout(timer);
    index = i;
    front.classList.remove('fading');
    front.src = srcFor(i);
    front.style.opacity = '1';
    back.src = srcFor(i);
    preload(i + 1);
    updateUI();
  }

  function crossfadeTo(i, done) {
    var t = ++token;
    back.src = front.src;              // current image sits underneath
    var img = cache[i] || new Image();
    img.src = srcFor(i);
    var ready = img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    ready.then(function () {
      if (t !== token) return;
      front.classList.remove('fading');
      front.style.opacity = '0';
      front.src = srcFor(i);
      void front.offsetWidth;          // commit opacity 0 before transitioning
      front.classList.add('fading');
      front.style.opacity = '1';
      index = i;
      preload(i + 1);
      updateUI();
      timer = setTimeout(function () {
        if (t !== token) return;
        front.classList.remove('fading');
        back.src = front.src;
        done();
      }, FADE_MS);
    });
  }

  function scheduleNext() {
    var t = token;
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (t !== token || !playing) return;
      crossfadeTo(index + 1, function () {
        if (index >= TOTAL - 1) { stop(); } else { scheduleNext(); }
      });
    }, HOLD_MS);
  }

  function play() {
    if (playing || index >= TOTAL - 1) return;
    playing = true;
    updateUI();
    scheduleNext();
  }

  function stop() {
    playing = false;
    updateUI();
  }

  function pause() {
    if (!playing) return;
    // Settle on whatever is on screen: finish any in-progress fade instantly.
    showInstant(index);
    stop();
  }

  function next() {
    if (index >= TOTAL - 1) return;
    showInstant(index + 1);
    if (index >= TOTAL - 1) { stop(); }
    else if (playing) { scheduleNext(); }
  }

  playBtn.addEventListener('click', play);
  pauseBtn.addEventListener('click', pause);
  nextBtn.addEventListener('click', next);

  showInstant(0);
})();
