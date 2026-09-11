/* The desk: place artefacts from data attributes, let visitors drag them
   around on wide screens, and a tiny mobile nav toggle. */
(function () {
  'use strict';

  var wide = window.matchMedia('(min-width: 761px)');

  /* ── artefact placement ─────────────────────────────────── */
  var desk = document.querySelector('.desk');
  if (desk) {
    var arts = Array.prototype.slice.call(desk.querySelectorAll('.art'));
    arts.forEach(function (el, i) {
      el.style.setProperty('--x', (el.dataset.x || 0) + 'px');
      el.style.setProperty('--y', (el.dataset.y || 0) + 'px');
      el.style.setProperty('--r', (el.dataset.r || 0) + 'deg');
      el.style.setProperty('--i', i);
      el.style.zIndex = el.dataset.z || (i + 1);
    });
    requestAnimationFrame(function () { desk.classList.add('ready'); });

    /* ── dragging ───────────────────────────────────────────── */
    var top = arts.length + 1;
    var drag = null;

    arts.forEach(function (el) {
      el.addEventListener('pointerdown', function (e) {
        if (!wide.matches) return;
        if (e.button !== 0) return;
        if (e.target.closest('a')) return;          // links stay links
        var rect = desk.getBoundingClientRect();
        var x = parseFloat(el.style.getPropertyValue('--x')) || 0;
        var y = parseFloat(el.style.getPropertyValue('--y')) || 0;
        drag = { el: el, dx: e.clientX - rect.left - x, dy: e.clientY - rect.top - y };
        el.style.zIndex = ++top;
        el.classList.add('dragging', 'moved');
        el.setPointerCapture(e.pointerId);
        e.preventDefault();
      });
      el.addEventListener('pointermove', function (e) {
        if (!drag || drag.el !== el) return;
        var rect = desk.getBoundingClientRect();
        el.style.setProperty('--x', (e.clientX - rect.left - drag.dx) + 'px');
        el.style.setProperty('--y', (e.clientY - rect.top - drag.dy) + 'px');
      });
      var release = function (e) {
        if (!drag || drag.el !== el) return;
        el.classList.remove('dragging');
        try { el.releasePointerCapture(e.pointerId); } catch (err) {}
        drag = null;
      };
      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', release);
    });
  }

  /* ── mobile nav ─────────────────────────────────────────── */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
})();
