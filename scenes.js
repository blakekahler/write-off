// Write-Off: the LA backgrounds. One function per scene, each returning an SVG string at 320x180
// with three parallax layers (far, mid, near). Everything is drawn from the 16-color palette on a
// 4px grid (2px for small sprites), so it scales up pixel-sharp.
// The engine passes { car: true|false, label, tier, hero }.
//   tier: 0 junker, 1 rental, 2 town car (default), 3 limo. The engine picks it from cash.
//   hero: true draws the car 2.5x in the middle of the road (title screen).
//
// To swap in hand-drawn art later: keep the function names, return an <svg> with an <image> inside,
// and keep a <g class="near"> with the car layer so the travel beat still works.
//
// Open test/scenes.html to see every scene and every car side by side.

window.WRITEOFF_SCENES = (function () {
  'use strict';

  var C = {
    sky: '#9bd3e8', skyDusk: '#e9a26a', skyNight: '#141a3a', sun: '#ffd97a',
    sand: '#e8d8b0', terracotta: '#c96a4a', palm: '#3f8f4f', palmDark: '#2a5f36',
    asphalt: '#5d5d66', concrete: '#b8b4a8', glass: '#7fb2c9', white: '#f6f3ea',
    ink: '#1b1b1f', crtGreen: '#5cf27a', red: '#e5484d', gold: '#f2c14e'
  };

  var X0 = -40, XW = 400; // layers overhang the 320px frame so parallax never shows an edge

  // ---------- drawing helpers ----------
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function R(x, y, w, h, c, cls) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c + '"' + (cls ? ' class="' + cls + '"' : '') + '/>';
  }
  function T(x, y, s, size, c, anchor) {
    return '<text x="' + x + '" y="' + y + '" font-family="\'Press Start 2P\', monospace" font-size="' + size + '" fill="' + c + '" text-anchor="' + (anchor || 'middle') + '">' + esc(s) + '</text>';
  }
  function rng(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var q4 = function (n) { return Math.round(n / 4) * 4; };

  function sky(c) { return R(X0, 0, XW, 180, c); }

  // Checkerboard band between two colors, the classic pixel-art gradient.
  function dither(y, h, c1, c2) {
    var s = R(X0, y, XW, h, c1);
    for (var yy = y; yy < y + h; yy += 4) {
      var off = ((yy - y) / 4) % 2 ? 4 : 0;
      for (var x = X0 + off; x < X0 + XW; x += 8) s += R(x, yy, 4, 4, c2);
    }
    return s;
  }
  function sunPlus(x, y) {
    return R(x + 4, y, 8, 16, C.sun) + R(x, y + 4, 16, 8, C.sun) + R(x + 4, y + 4, 8, 8, C.white);
  }
  // Half-set sun disc sitting on a horizon at y.
  function sunDisc(cx, y, c) {
    return R(cx - 12, y - 16, 24, 4, c) + R(cx - 20, y - 12, 40, 4, c) + R(cx - 24, y - 8, 48, 8, c);
  }
  function moon(x, y, c, skyC) {
    return R(x + 2, y, 8, 2, c) + R(x, y + 2, 12, 8, c) + R(x + 2, y + 10, 8, 2, c) + R(x + 5, y + 1, 8, 2, skyC) + R(x + 6, y + 3, 7, 6, skyC);
  }
  // Rolling hills from two sine waves, filled down to fillTo.
  function ridge(baseY, color, a1, f1, p1, a2, f2, p2, fillTo) {
    var s = '';
    for (var x = X0; x < X0 + XW; x += 4) {
      var i = (x - X0) / 4;
      var h = q4(a1 * (0.5 + 0.5 * Math.sin(i * f1 + p1)) + a2 * (0.5 + 0.5 * Math.sin(i * f2 + p2)));
      s += R(x, baseY - h, 4, h + (fillTo - baseY), color);
    }
    return s;
  }
  // A stepped mound (for the hillside sign), rows of decreasing width upward, filled down to fillTo.
  function mound(cx, baseY, w, h, color, fillTo) {
    var s = fillTo > baseY ? R(cx - w / 2, baseY, w, fillTo - baseY, color) : '';
    var rows = h / 4;
    for (var i = 0; i < rows; i++) {
      var rw = q4(w * (1 - (i / rows) * 0.9));
      s += R(cx - rw / 2, baseY - 4 * (i + 1), rw, 4, color);
    }
    return s;
  }
  function palm(x, baseY, h, trunk, leaf, leafDark, lean) {
    lean = lean || 0;
    var s = '';
    var segs = h / 4;
    var third = Math.max(1, Math.floor(segs / 3));
    var dx = 0;
    for (var i = 0; i < segs; i++) {
      dx = lean * 4 * Math.floor(i / third);
      s += R(x + dx, baseY - 4 * (i + 1), 4, 4, trunk);
    }
    var cx = x + dx, ty = baseY - h;
    s += R(cx - 12, ty - 4, 28, 4, leaf) + R(cx - 4, ty - 8, 12, 4, leaf) +
      R(cx - 8, ty - 12, 4, 4, leaf) + R(cx + 8, ty - 12, 4, 4, leaf) +
      R(cx - 16, ty, 8, 4, leafDark) + R(cx + 12, ty, 8, 4, leafDark) +
      R(cx - 20, ty + 4, 4, 4, leafDark) + R(cx + 20, ty + 4, 4, 4, leafDark) +
      R(cx - 8, ty, 4, 4, leafDark) + R(cx + 8, ty, 4, 4, leafDark);
    return s;
  }
  // Round bush or tree-top blob.
  function bush(x, y, w, c) { return R(x + 4, y - 4, w - 8, 4, c) + R(x, y, w, 4, c); }
  // Box with a window grid. o: { ww, wh, gx, gy, pad, seed, p (chance of alt color), alt }
  function building(x, top, w, h, body, win, o) {
    o = o || {};
    var s = R(x, top, w, h, body);
    var ww = o.ww || 4, wh = o.wh || 4, gx = o.gx || 4, gy = o.gy || 4, pad = o.pad == null ? 4 : o.pad;
    var rnd = rng(o.seed || 7);
    for (var yy = top + pad; yy + wh <= top + h - pad; yy += wh + gy) {
      for (var xx = x + pad; xx + ww <= x + w - pad; xx += ww + gx) {
        var c = (o.alt && rnd() < (o.p == null ? 0.3 : o.p)) ? o.alt : win;
        s += R(xx, yy, ww, wh, c);
      }
    }
    return s;
  }
  function stage(x, baseY, w, h, num) {
    var s = R(x, baseY - h, w, h, C.sand) + R(x, baseY - h, w, 4, C.white) + R(x + w - 4, baseY - h, 4, h, C.concrete) +
      R(x + 8, baseY - 16, 12, 16, C.asphalt) + R(x + 12, baseY - 12, 4, 4, C.gold) +
      R(x + 4, baseY - h + 8, w - 12, 2, C.concrete);
    if (num) s += T(x + w / 2, baseY - h / 2 + 4, num, 10, C.ink);
    return s;
  }
  function tower(x, baseY, legs, band) {
    var tb = baseY - legs; // tank bottom
    return R(x + 2, tb, 4, legs, C.asphalt) + R(x + 18, tb, 4, legs, C.asphalt) +
      R(x + 2, tb + 8, 20, 4, C.asphalt) + R(x + 2, tb + 20, 20, 4, C.asphalt) +
      R(x, tb - 20, 24, 20, C.concrete) + R(x + 20, tb - 20, 4, 20, C.asphalt) +
      R(x, tb - 12, 24, 4, band || C.red) +
      R(x + 4, tb - 24, 16, 4, C.asphalt) + R(x + 8, tb - 28, 8, 4, C.asphalt) +
      R(x + 10, tb - 32, 4, 4, C.red, 'blink');
  }
  function road(y, h, dash) {
    var s = R(X0, y, XW, h, C.asphalt);
    var cy = y + q4(h / 2) - 2;
    for (var x = X0; x < X0 + XW; x += 24) s += R(x, cy, 12, 2, dash || C.sand);
    return s;
  }
  function billboard(x, baseY, w, h, postH, panel, text) {
    var top = baseY - postH - h;
    var s = R(x + q4(w / 2) - 2, top + h, 4, postH, C.asphalt) +
      R(x, top, w, h, C.concrete) + R(x + 4, top + 4, w - 8, h - 8, panel) +
      R(x + 8, top + 8, q4(w * 0.5), 4, text) + R(x + 8, top + 16, q4(w * 0.3), 4, text);
    if (h >= 28) s += R(x + 8, top + h - 12, q4(w * 0.6), 4, text);
    return s;
  }
  function tinyCar(x, y, c) {
    return R(x, y, 12, 4, c) + R(x + 2, y - 2, 8, 2, c) + R(x + 1, y + 4, 2, 2, C.ink) + R(x + 9, y + 4, 2, 2, C.ink);
  }
  function stars(seed, n, yMax, c1, c2) {
    var rnd = rng(seed), s = '';
    for (var i = 0; i < n; i++) {
      var x = q4(X0 + rnd() * XW), y = q4(rnd() * yMax);
      s += R(x, y, 2, 2, rnd() < 0.25 ? c2 : c1);
    }
    return s;
  }
  function cityLights(x0, y0, w, h, seed) {
    var rnd = rng(seed), s = R(x0, y0, w, h, C.ink);
    for (var y = y0 + 2; y < y0 + h; y += 6) {
      var off = ((y - y0 - 2) / 6) % 2 ? 6 : 2;
      for (var x = x0 + off; x < x0 + w; x += 12) if (rnd() < 0.65) s += R(x, y, 2, 2, rnd() < 0.3 ? C.white : C.gold);
    }
    return s;
  }
  function ferris(cx, cy, r, baseY) {
    var s = '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx - 20) + '" y2="' + baseY + '" stroke="' + C.asphalt + '" stroke-width="4"/>' +
      '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + 20) + '" y2="' + baseY + '" stroke="' + C.asphalt + '" stroke-width="4"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + C.red + '" stroke-width="3"/>';
    for (var i = 0; i < 8; i++) {
      var a = i * Math.PI / 4;
      var x2 = Math.round(cx + r * Math.cos(a)), y2 = Math.round(cy + r * Math.sin(a));
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + C.white + '" stroke-width="2"/>';
      s += R(x2 - 3, y2 - 3, 6, 6, i % 2 ? C.gold : C.white);
    }
    s += R(cx - 4, cy - 4, 8, 8, C.ink);
    return s;
  }
  // Small set dressing.
  function cloud(x, y, w) { return R(x + 8, y - 4, w - 16, 4, C.white) + R(x + 4, y, w - 8, 4, C.white) + R(x, y + 4, w, 4, C.white); }
  function person(x, baseY, shirt, skin) { return R(x, baseY - 12, 4, 4, skin || C.sand) + R(x, baseY - 8, 4, 4, shirt) + R(x, baseY - 4, 4, 4, C.ink); }
  function lamp(x, baseY, h, lit) { return R(x, baseY - h, 2, h, C.asphalt) + R(x - 2, baseY - h - 4, 6, 4, lit ? C.sun : C.concrete); }
  function trafficLight(x, baseY) {
    return R(x, baseY - 28, 2, 28, C.asphalt) + R(x - 2, baseY - 40, 6, 12, C.ink) + R(x, baseY - 39, 2, 2, C.red) + R(x, baseY - 35, 2, 2, C.gold) + R(x, baseY - 31, 2, 2, C.palm);
  }
  function bird(x, y, c) { c = c || C.ink; return R(x, y + 1, 2, 1, c) + R(x + 2, y, 2, 1, c) + R(x + 4, y + 1, 2, 1, c); }
  function umbrella(x, baseY, c) {
    return R(x - 4, baseY - 12, 8, 2, c) + R(x - 6, baseY - 10, 12, 2, c) + R(x - 8, baseY - 8, 16, 2, C.white) + R(x - 1, baseY - 8, 2, 8, C.asphalt);
  }
  function boat(x, y) { return R(x, y, 8, 2, C.ink) + R(x + 3, y - 6, 1, 6, C.white) + R(x + 4, y - 6, 3, 4, C.white); }
  function flag(x, baseY, h, c) { return R(x, baseY - h, 2, h, C.concrete) + R(x + 2, baseY - h, 8, 4, c) + R(x + 2, baseY - h + 1, 8, 1, C.white); }
  function searchlight(x, baseY, tipX) {
    return '<polygon points="' + x + ',' + baseY + ' ' + (tipX - 10) + ',0 ' + (tipX + 10) + ',0" fill="' + C.white + '" opacity="0.14"/>';
  }
  function crane(x, top, boomW) {
    return R(x, top, 2, 24, C.red) + R(x - boomW / 2, top, boomW, 2, C.red) + R(x + boomW / 2 - 4, top + 2, 1, 14, C.concrete) + R(x + boomW / 2 - 6, top + 16, 4, 2, C.ink);
  }

  // ---------- the car ----------
  // A town car with a film reel strapped to the roof, 48x24, facing right. Four conditions:
  //   0 junker (rust, cracked glass, missing hubcap, black smoke), 1 rental (no chrome, dents),
  //   2 town car (the default), 3 limo (gold trim, whitewalls, tinted glass, hood ornament).
  function reelAt(x, y, rim, hole) {
    return R(x + 4, y, 8, 2, rim) + R(x + 2, y + 2, 12, 2, rim) + R(x, y + 4, 16, 6, rim) + R(x + 2, y + 10, 12, 2, rim) + R(x + 4, y + 12, 8, 2, rim) +
      R(x + 6, y + 5, 4, 4, hole) + R(x + 3, y + 4, 2, 2, hole) + R(x + 11, y + 4, 2, 2, hole) + R(x + 3, y + 8, 2, 2, hole) + R(x + 11, y + 8, 2, 2, hole) +
      R(x + 7, y + 1, 2, 2, hole) + R(x + 7, y + 11, 2, 2, hole);
  }
  function car(tier) {
    tier = (tier == null) ? 2 : tier;
    var junk = tier === 0, worn = tier === 1, limo = tier === 3;
    var bodyC = junk ? C.terracotta : C.ink;
    var edge = junk ? C.sand : C.asphalt;
    var smoke = junk ? C.ink : C.concrete;
    var win = limo ? C.skyNight : C.glass;
    var s = '<g class="puff">' + R(-6, 19, 3, 3, smoke) + R(-11, 17, 2, 2, smoke) + (junk ? R(-15, 14, 3, 3, smoke) + R(-19, 11, 2, 2, smoke) : '') + '</g>';
    s += R(12, 12, 24, 2, C.asphalt) + reelAt(16, 0, junk ? C.asphalt : C.concrete, junk ? C.terracotta : C.ink);
    s += junk ? R(14, 6, 20, 1, C.sand) + R(12, 11, 1, 3, C.sand) + R(35, 11, 1, 3, C.sand)
              : R(14, 6, 20, 2, C.gold) + R(12, 11, 2, 3, C.gold) + R(34, 11, 2, 3, C.gold);
    s += R(10, 14, 28, 5, bodyC) + R(10, 14, 28, 1, edge) +
      R(13, 15, 6, 1, win) + R(12, 16, 7, 1, win) + R(11, 17, 8, 1, win) +
      R(21, 15, 6, 3, win) +
      R(29, 15, 6, 1, win) + R(29, 16, 7, 1, win) + R(29, 17, 8, 1, win);
    if (tier >= 2) s += R(29, 15, 2, 1, C.white);
    if (limo) s += R(21, 15, 2, 1, C.white) + R(13, 15, 2, 1, C.white);
    if (junk) s += R(31, 16, 1, 1, C.white) + R(32, 15, 1, 1, C.white) + R(33, 16, 1, 1, C.white) + R(34, 17, 1, 1, C.white);
    s += R(0, 17, 10, 2, bodyC) + R(38, 17, 10, 2, bodyC) + R(0, 17, 10, 1, edge) + R(38, 17, 10, 1, edge) + R(0, 19, 48, 4, bodyC);
    if (tier >= 2) s += R(0, 22, 48, 1, limo ? C.gold : C.concrete);
    if (junk) s += R(4, 20, 3, 2, C.asphalt) + R(40, 20, 5, 2, C.asphalt) + R(26, 19, 4, 1, C.asphalt) + R(42, 17, 4, 1, C.asphalt);
    if (worn) s += R(41, 17, 4, 1, C.asphalt) + R(2, 20, 3, 1, C.asphalt);
    s += R(0, 18, 2, 3, C.red) + R(46, 18, 2, 3, junk ? C.concrete : C.gold);
    if (limo) s += R(44, 16, 2, 1, C.gold) + R(8, 10, 1, 4, C.concrete) + R(8, 9, 1, 1, C.gold);
    if (junk) s += R(40, 11, 1, 3, C.concrete) + R(41, 10, 2, 1, C.concrete);
    s += R(6, 19, 10, 5, C.ink) + R(32, 19, 10, 5, C.ink);
    if (limo) s += R(7, 20, 8, 1, C.white) + R(33, 20, 8, 1, C.white);
    var hub = limo ? C.gold : C.concrete;
    s += R(9, 21, 4, 2, hub) + R(10, 21, 2, 2, C.white);
    s += junk ? R(35, 21, 4, 2, C.asphalt) : R(35, 21, 4, 2, hub) + R(36, 21, 2, 2, C.white);
    return '<g class="car-sprite">' + s + '</g>';
  }
  // Places the car on the road. Normal: 48x24 at the scene's road line, moved by CSS (parked or driving).
  // Hero (title screen): 2.5x, parked in the middle of the road, with an idle bob on the inner group.
  function carLayer(roadY, o) {
    if (!o || !o.car) return '';
    if (o.hero) {
      var sc = 2.5;
      return '<g class="car-hero" transform="translate(' + (160 - 24 * sc) + ',' + (roadY - 24 * sc) + ') scale(' + sc + ')"><g class="car-bob">' + car(o.tier) + '</g></g>';
    }
    return '<g class="car-anchor" transform="translate(0,' + (roadY - 24) + ')"><g class="car">' + car(o.tier) + '</g></g>';
  }
  function wrap(label, far, mid, near) {
    return '<svg viewBox="0 0 320 180" width="320" height="180" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(label) + '">' +
      '<g class="far">' + far + '</g><g class="mid">' + mid + '</g><g class="near">' + near + '</g></svg>';
  }

  // ---------- scenes ----------
  function lot(o) {
    var far = sky(C.sky) + sunPlus(248, 16) + cloud(28, 28, 44) + cloud(140, 16, 28) + bird(118, 44) + bird(128, 40) +
      ridge(104, C.palmDark, 40, 0.19, 1.1, 12, 0.61, 2.0, 180) +
      ridge(118, C.palm, 28, 0.16, 4.2, 10, 0.47, 0.8, 180);
    var cart = R(76, 134, 10, 2, C.white) + R(76, 136, 10, 4, C.sand) + R(77, 132, 1, 2, C.asphalt) + R(84, 132, 1, 2, C.asphalt) + R(77, 140, 2, 2, C.ink) + R(83, 140, 2, 2, C.ink);
    var mid = R(X0, 124, XW, 20, C.concrete) +
      stage(-16, 140, 88, 56, '16') + stage(88, 140, 104, 64, '22') + stage(208, 140, 72, 48, '7') +
      R(140, 112, 32, 28, C.concrete) + R(140, 112, 32, 2, C.white) + R(154, 114, 4, 26, C.asphalt) +
      R(256, 84, 12, 4, C.white) + R(258, 80, 8, 4, C.white) + R(261, 88, 2, 4, C.asphalt) +
      tower(284, 140, 44) + R(284, 132, 8, 8, C.asphalt) +
      cart + lamp(200, 140, 28, false) + person(196, 140, C.red) + person(236, 140, C.glass) +
      R(X0, 141, XW, 1, C.asphalt);
    var near = R(X0, 140, XW, 4, C.white) + road(144, 36) +
      palm(-8, 144, 60, C.terracotta, C.palm, C.palmDark, 1) + palm(320, 144, 32, C.terracotta, C.palm, C.palmDark, -1) +
      carLayer(170, o);
    return wrap(o.label || 'The studio lot in Burbank', far, mid, near);
  }

  function freeway(o) {
    var far = sky(C.sky) + sunPlus(36, 12) + cloud(120, 20, 36) + cloud(240, 8, 28) + bird(200, 30) +
      ridge(124, C.palmDark, 64, 0.11, 0.4, 20, 0.33, 2.6, 180) +
      bush(-20, 92, 16, C.palm) + bush(10, 100, 12, C.palm) + bush(300, 84, 16, C.palm) + bush(330, 96, 12, C.palm) +
      mound(232, 112, 120, 56, C.palmDark, 180) + T(232, 86, 'WRITE-OFF', 8, C.white) +
      ridge(128, C.palm, 36, 0.14, 2.3, 16, 0.41, 0.2, 180) +
      bush(60, 110, 16, C.palmDark) + bush(140, 104, 12, C.palmDark) + bush(276, 108, 16, C.palmDark) +
      R(X0, 106, XW, 14, C.asphalt) + R(X0, 112, XW, 2, C.sand) +
      tinyCar(76, 112, C.red) + tinyCar(140, 108, C.white) + tinyCar(204, 112, C.glass) + tinyCar(296, 108, C.gold);
    var mid = R(44, 60, 4, 72, C.asphalt) + R(272, 60, 4, 72, C.asphalt) + R(44, 60, 232, 4, C.asphalt) +
      R(96, 36, 128, 36, C.white) + R(100, 40, 120, 28, C.palm) +
      T(160, 54, '101 NORTH', 7, C.white) + T(160, 65, 'HOLLYWOOD', 6, C.white) +
      R(228, 44, 44, 20, C.white) + R(230, 46, 40, 16, C.palm) + T(250, 56, 'EXIT 9A', 5, C.white) +
      billboard(-28, 132, 68, 32, 40, C.white, C.red) + billboard(304, 132, 72, 36, 48, C.gold, C.ink) +
      R(20, 120, 6, 12, C.gold) + R(21, 116, 4, 4, C.ink);
    var near = R(X0, 120, XW, 4, C.concrete) + R(X0, 124, XW, 4, C.white) + road(128, 52) +
      R(X0, 150, XW, 2, C.white) + carLayer(174, o);
    return wrap(o.label || 'The 101 through Cahuenga Pass', far, mid, near);
  }

  function hollywood(o) {
    var far = sky(C.sky) + sunPlus(264, 14) + cloud(40, 20, 32) + cloud(170, 10, 24) + bird(90, 36) +
      ridge(100, C.palmDark, 20, 0.21, 0.7, 8, 0.6, 3.1, 180);
    var bulbs = '';
    for (var bx = 36; bx < 124; bx += 8) bulbs += R(bx, 92, 4, 4, C.gold) + R(bx, 112, 4, 4, C.gold);
    var vsign = R(76, 16, 16, 76, C.red);
    for (var vy = 22; vy < 88; vy += 10) vsign += R(80, vy, 8, 6, C.white);
    var awning = '';
    for (var ax = 136; ax < 200; ax += 8) awning += R(ax, 112, 4, 8, C.red) + R(ax + 4, 112, 4, 8, C.white);
    var mid = building(-40, 72, 64, 64, C.terracotta, C.glass, { ww: 8, wh: 8, gx: 8, gy: 8, pad: 8, seed: 3 }) +
      R(28, 60, 104, 76, C.sand) + R(28, 60, 104, 4, C.white) + R(36, 92, 88, 24, C.white) +
      R(44, 100, 48, 4, C.red) + R(44, 108, 64, 4, C.red) + bulbs + vsign +
      R(36, 120, 88, 16, C.ink) + R(48, 124, 8, 12, C.gold) + R(104, 124, 8, 12, C.gold) +
      R(68, 124, 24, 12, C.glass) + R(78, 124, 4, 12, C.ink) +
      building(136, 84, 64, 52, C.concrete, C.glass, { ww: 8, wh: 8, gx: 8, gy: 8, pad: 8, seed: 5 }) + awning +
      R(148, 124, 12, 12, C.glass) + R(176, 124, 12, 12, C.glass) +
      building(204, 68, 76, 68, C.sand, C.glass, { ww: 8, wh: 12, gx: 8, gy: 8, pad: 8, seed: 9 }) +
      R(212, 56, 60, 12, C.ink) + R(220, 60, 44, 4, C.gold) + R(224, 124, 36, 12, C.glass) + R(240, 124, 4, 12, C.ink) +
      building(284, 80, 76, 56, C.terracotta, C.glass, { ww: 8, wh: 8, gx: 8, gy: 8, pad: 8, seed: 11 }) +
      palm(128, 136, 84, C.terracotta, C.palm, C.palmDark, 1) + palm(272, 136, 72, C.terracotta, C.palm, C.palmDark, -1);
    var starsRow = '';
    for (var sx = -32; sx < 360; sx += 32) starsRow += R(sx + 4, 140, 4, 12, C.gold) + R(sx, 144, 12, 4, C.gold) + R(sx + 4, 144, 4, 4, C.terracotta);
    var near = R(X0, 136, XW, 20, C.concrete) + starsRow +
      trafficLight(14, 156) + lamp(170, 156, 24, false) +
      person(56, 152, C.red) + person(62, 152, C.glass) + person(110, 152, C.gold) + person(222, 152, C.palm) + person(312, 152, C.white) +
      R(X0, 156, XW, 2, C.white) + road(156, 24) + carLayer(176, o);
    return wrap(o.label || 'Hollywood Boulevard', far, mid, near);
  }

  function sunset(o) {
    var far = R(X0, 0, XW, 16, C.skyNight) + stars(9, 10, 20, C.concrete, C.white) + moon(44, 6, C.sand, C.skyNight) +
      dither(16, 12, C.skyNight, C.skyDusk) + R(X0, 28, XW, 40, C.skyDusk) +
      dither(68, 12, C.skyDusk, C.sun) + R(X0, 80, XW, 64, C.sun) + sunDisc(176, 104, C.gold) + bird(60, 50) + bird(72, 46) + bird(84, 52);
    var rnd = rng(21), win = '';
    var blds = [[-40, 100, 48, 40], [8, 112, 32, 28], [40, 92, 56, 48], [96, 116, 40, 24], [136, 104, 48, 36], [184, 120, 32, 20], [216, 96, 56, 44], [272, 112, 48, 28], [320, 100, 40, 40]];
    var mid = '';
    blds.forEach(function (b) {
      mid += R(b[0], b[1], b[2], b[3], C.ink);
      for (var wy = b[1] + 8; wy < 136; wy += 8) for (var wx = b[0] + 4; wx < b[0] + b[2] - 4; wx += 8) if (rnd() < 0.38) win += R(wx, wy, 4, 4, rnd() < 0.2 ? C.white : C.gold);
    });
    mid += win + billboard(44, 92, 48, 24, 8, C.white, C.ink) + billboard(220, 96, 48, 28, 8, C.gold, C.ink) +
      R(140, 92, 40, 12, C.ink) + R(144, 96, 32, 4, C.red) +
      T(160, 124, 'OPEN', 6, C.crtGreen) + T(244, 128, 'CLUB', 6, C.red) + R(100, 120, 32, 2, C.glass) +
      palm(20, 140, 64, C.ink, C.ink, C.ink, 1) + palm(184, 140, 52, C.ink, C.ink, C.ink, -1) + palm(300, 140, 76, C.ink, C.ink, C.ink, 1) +
      lamp(120, 140, 20, true) + lamp(260, 140, 20, true);
    var near = R(X0, 140, XW, 4, C.asphalt) + R(X0, 144, XW, 2, C.concrete) + road(144, 36, C.sun) + carLayer(172, o);
    return wrap(o.label || 'Sunset Strip at dusk', far, mid, near);
  }

  function century(o) {
    var far = sky(C.sky) + sunPlus(28, 16) + cloud(100, 16, 40) + cloud(260, 24, 28) + bird(140, 48) +
      building(60, 24, 32, 116, C.glass, C.white, { ww: 4, wh: 4, gx: 4, gy: 4, pad: 4, seed: 2 }) +
      building(200, 36, 28, 104, C.glass, C.white, { ww: 4, wh: 4, gx: 4, gy: 4, pad: 4, seed: 4 }) +
      building(236, 36, 28, 104, C.glass, C.white, { ww: 4, wh: 4, gx: 4, gy: 4, pad: 4, seed: 6 }) +
      R(200, 32, 28, 4, C.concrete) + R(236, 32, 28, 4, C.concrete);
    var planters = '';
    for (var px = -32; px < 360; px += 48) planters += bush(px, 136, 12, C.palmDark);
    var mid = building(-40, 100, 84, 40, C.white, C.glass, { ww: 8, wh: 8, gx: 4, gy: 4, pad: 4, seed: 8 }) +
      R(48, 132, 24, 8, C.concrete) + R(52, 134, 16, 4, C.glass) + R(59, 122, 2, 12, C.glass) + R(57, 120, 6, 2, C.white) +
      building(100, 48, 48, 92, C.concrete, C.glass, { ww: 4, wh: 8, gx: 4, gy: 4, pad: 4, seed: 10 }) +
      building(152, 28, 40, 112, C.glass, C.white, { ww: 4, wh: 4, gx: 4, gy: 4, pad: 4, seed: 12, alt: C.sky, p: 0.4 }) +
      R(188, 28, 4, 112, C.asphalt) + R(164, 20, 16, 8, C.concrete) + crane(176, 0, 40) +
      R(220, 124, 24, 2, C.asphalt) + R(220, 126, 2, 14, C.asphalt) + R(242, 126, 2, 14, C.asphalt) + R(222, 126, 20, 10, C.glass) + person(226, 140, C.red) +
      stage(268, 140, 92, 32, '') + tower(300, 140, 24) + R(272, 112, 24, 28, C.concrete) + R(276, 120, 16, 8, C.glass);
    var near = R(X0, 140, XW, 8, C.palm) + R(X0, 140, XW, 2, C.sand) + planters + road(148, 32) + carLayer(174, o);
    return wrap(o.label || 'Century City', far, mid, near);
  }

  function culver(o) {
    var far = sky(C.sky) + sunPlus(252, 16) + cloud(60, 24, 36) + cloud(180, 14, 28) + bird(110, 40) + bird(120, 36) +
      ridge(104, C.palm, 16, 0.3, 1.0, 8, 0.7, 2.2, 180) + R(X0, 112, XW, 28, C.sand);
    var truck = R(270, 122, 32, 18, C.white) + R(270, 130, 32, 2, C.red) + R(258, 126, 12, 14, C.white) + R(260, 128, 8, 6, C.glass) +
      R(262, 138, 4, 4, C.ink) + R(276, 138, 4, 4, C.ink) + R(292, 138, 4, 4, C.ink);
    var mid = stage(-24, 140, 80, 44, '') + stage(236, 140, 108, 48, '') + tower(148, 140, 40, C.gold) + truck +
      R(88, 76, 20, 64, C.white) + R(212, 76, 20, 64, C.white) + R(88, 76, 4, 64, C.concrete) + R(228, 76, 4, 64, C.concrete) +
      R(88, 68, 144, 8, C.white) + R(100, 60, 120, 8, C.white) + R(116, 52, 88, 8, C.white) + R(136, 48, 48, 4, C.white) +
      R(88, 76, 144, 4, C.gold) + flag(159, 48, 22, C.red) + T(160, 67, 'STUDIOS', 7, C.ink) +
      R(60, 116, 24, 24, C.white) + R(64, 120, 16, 8, C.glass) + R(68, 121, 4, 4, C.sand) + R(68, 125, 4, 3, C.ink) + R(60, 132, 24, 4, C.red) +
      R(84, 124, 4, 4, C.red) + R(88, 124, 4, 4, C.white) + R(92, 124, 4, 4, C.red) + R(96, 124, 4, 4, C.white) + R(100, 124, 4, 4, C.red) +
      bush(120, 136, 16, C.palm) + bush(196, 136, 16, C.palm);
    var near = R(X0, 140, XW, 4, C.concrete) + road(144, 36) + palm(300, 144, 60, C.terracotta, C.palm, C.palmDark, -1) + palm(8, 144, 48, C.terracotta, C.palm, C.palmDark, 1) + carLayer(172, o);
    return wrap(o.label || 'The studio gate in Culver City', far, mid, near);
  }

  function santamonica(o) {
    var far = R(X0, 0, XW, 16, C.sky) + dither(16, 12, C.sky, C.skyDusk) + R(X0, 28, XW, 36, C.skyDusk) +
      dither(64, 12, C.skyDusk, C.sun) + R(X0, 76, XW, 24, C.sun) + sunDisc(160, 100, C.gold) +
      bird(40, 30, C.white) + bird(52, 26, C.white) + bird(230, 40, C.white) +
      R(X0, 100, XW, 44, C.glass) + R(X0, 100, XW, 2, C.sky) + boat(30, 100) + boat(250, 99) + boat(300, 101);
    var rnd = rng(33), waves = '';
    for (var i = 0; i < 26; i++) waves += R(q4(X0 + rnd() * XW), 104 + q4(rnd() * 36), 8, 2, C.white);
    far += waves + R(152, 104, 16, 4, C.sun) + R(156, 112, 8, 4, C.sun) + R(148, 120, 24, 4, C.sun) + R(158, 128, 4, 4, C.sun) + R(150, 136, 20, 4, C.sun);
    var stilts = '', lights = '';
    for (var sx = 100; sx < 360; sx += 24) stilts += R(sx, 100, 4, 44, C.asphalt);
    for (var lx = 98; lx < 360; lx += 12) lights += R(lx, 86, 2, 2, C.gold);
    var coaster = R(176, 80, 8, 12, C.concrete) + R(184, 72, 8, 20, C.concrete) + R(192, 66, 8, 26, C.concrete) + R(200, 72, 8, 20, C.concrete) + R(208, 80, 8, 12, C.concrete) + R(176, 78, 40, 2, C.red);
    var carousel = R(160, 76, 16, 16, C.white) + R(158, 72, 20, 4, C.red) + R(162, 68, 12, 4, C.red) + R(166, 64, 4, 4, C.gold) + R(164, 82, 8, 6, C.glass);
    var mid = stilts + R(96, 92, 264, 8, C.terracotta) + R(96, 88, 264, 4, C.white) + lights +
      R(100, 66, 2, 22, C.white) + R(94, 58, 26, 8, C.red) + T(107, 64, 'PIER', 5, C.white) +
      R(118, 64, 40, 28, C.white) + R(114, 60, 48, 4, C.red) + R(122, 72, 10, 8, C.glass) + R(140, 72, 10, 8, C.glass) + R(133, 84, 8, 8, C.ink) +
      carousel + coaster + ferris(268, 54, 30, 92) +
      R(20, 124, 16, 16, C.glass) + R(22, 140, 4, 4, C.asphalt) + R(30, 140, 4, 4, C.asphalt) + R(16, 120, 24, 4, C.white);
    var near = R(X0, 144, XW, 16, C.sand) + umbrella(56, 158, C.red) + umbrella(84, 160, C.glass) + umbrella(300, 158, C.gold) +
      person(68, 160, C.white) + person(316, 160, C.red) +
      R(X0, 158, XW, 2, C.concrete) + road(160, 20) + carLayer(176, o);
    return wrap(o.label || 'Santa Monica Pier at sunset', far, mid, near);
  }

  function griffith(o) {
    var far = sky(C.skyNight) + stars(77, 64, 92, C.concrete, C.white) + moon(36, 14, C.white, C.skyNight) +
      R(60, 30, 6, 2, C.concrete) + R(66, 30, 2, 2, C.red, 'blink') +
      ridge(132, C.palmDark, 56, 0.09, 0.9, 20, 0.31, 1.4, 180) +
      mound(72, 116, 128, 52, C.palmDark, 180) + T(72, 92, 'WRITE-OFF', 8, C.white) +
      mound(236, 120, 150, 44, C.palmDark, 180) +
      bush(20, 108, 12, C.palm) + bush(110, 112, 16, C.palm) + bush(150, 120, 12, C.palm) + bush(290, 104, 16, C.palm) + bush(320, 116, 12, C.palm);
    for (var i = 0; i < 8; i++) far += R(120 + i * 8, 128 - i * 4, 12, 4, C.asphalt);
    far += R(180, 96, 112, 4, C.concrete) + R(188, 80, 96, 16, C.concrete) + R(188, 80, 96, 4, C.white) +
      R(196, 86, 4, 6, C.gold) + R(208, 86, 4, 6, C.gold) + R(264, 86, 4, 6, C.gold) + R(276, 86, 4, 6, C.gold) +
      R(210, 76, 44, 4, C.concrete) + R(212, 72, 40, 4, C.concrete) + R(214, 68, 36, 4, C.concrete) + R(218, 64, 28, 4, C.concrete) + R(222, 60, 20, 4, C.concrete) + R(228, 56, 8, 4, C.concrete) + R(230, 64, 4, 16, C.ink) +
      R(192, 76, 16, 4, C.concrete) + R(196, 72, 8, 4, C.concrete) + R(256, 76, 16, 4, C.concrete) + R(260, 72, 8, 4, C.concrete) +
      R(231, 52, 2, 4, C.red, 'blink');
    var mid = cityLights(X0, 134, XW, 22, 91) + R(X0, 132, XW, 2, C.palmDark);
    var near = R(X0, 156, XW, 4, C.concrete) + person(40, 156, C.red) + person(46, 156, C.glass) + lamp(292, 156, 20, true) +
      R(X0, 160, XW, 2, C.asphalt) + road(160, 20, C.gold) + carLayer(176, o);
    return wrap(o.label || 'Griffith Observatory at night', far, mid, near);
  }

  function capitol(o) {
    var far = sky(C.skyNight) + stars(5, 36, 70, C.concrete, C.white) + moon(24, 10, C.sand, C.skyNight) +
      searchlight(64, 150, 140) + searchlight(252, 150, 190) +
      building(-40, 108, 64, 72, C.ink, C.skyNight, { ww: 4, wh: 4, gx: 8, gy: 8, pad: 4, seed: 14, alt: C.gold, p: 0.35 }) +
      building(40, 96, 48, 84, C.ink, C.skyNight, { ww: 4, wh: 4, gx: 8, gy: 8, pad: 4, seed: 15, alt: C.gold, p: 0.35 }) +
      building(88, 120, 24, 60, C.ink, C.skyNight, { ww: 4, wh: 4, gx: 8, gy: 8, pad: 4, seed: 19, alt: C.gold, p: 0.4 }) +
      building(220, 104, 48, 76, C.ink, C.skyNight, { ww: 4, wh: 4, gx: 8, gy: 8, pad: 4, seed: 16, alt: C.gold, p: 0.3 }) +
      R(272, 64, 40, 116, C.ink) + R(276, 56, 32, 8, C.ink) + R(290, 36, 4, 20, C.ink) + R(290, 32, 4, 4, C.red, 'blink') +
      building(300, 100, 60, 80, C.ink, C.skyNight, { ww: 4, wh: 4, gx: 8, gy: 8, pad: 4, seed: 17, alt: C.gold, p: 0.3 }) +
      palm(248, 152, 56, C.ink, C.ink, C.ink, -1);
    for (var ry = 68; ry < 176; ry += 8) far += R(276, ry, 32, 2, ry % 16 ? C.gold : C.concrete);
    var mid = R(108, 4, 104, 150, C.ink) + R(112, 8, 96, 142, C.asphalt) + R(116, 16, 88, 128, C.white) +
      R(148, 8, 24, 4, C.ink) + T(160, 27, '6:40', 6, C.ink) + R(188, 20, 12, 4, C.ink) + R(120, 20, 8, 4, C.ink) + R(198, 17, 4, 4, C.red) +
      R(124, 36, 16, 16, C.asphalt) + R(128, 40, 8, 4, C.white) + R(144, 36, 44, 4, C.ink) + R(144, 44, 28, 4, C.concrete) + R(176, 44, 12, 4, C.glass) +
      R(124, 60, 72, 4, C.ink) + R(124, 68, 64, 4, C.ink) + R(124, 76, 72, 4, C.ink) + R(124, 84, 44, 4, C.ink) +
      R(124, 96, 4, 24, C.red) + R(132, 96, 60, 4, C.asphalt) + R(132, 104, 52, 4, C.asphalt) + R(132, 112, 44, 4, C.asphalt) +
      R(124, 128, 8, 8, C.red) + R(136, 130, 20, 4, C.concrete) + R(164, 128, 8, 8, C.glass) + R(176, 130, 20, 4, C.concrete) +
      R(124, 140, 8, 2, C.red) + R(134, 140, 8, 2, C.red) + R(144, 140, 8, 2, C.red);
    var near = R(X0, 152, XW, 4, C.asphalt) + R(X0, 156, XW, 2, C.concrete) + lamp(40, 156, 24, true) + road(156, 24) + carLayer(174, o);
    return wrap(o.label || 'Your phone at 6:40 a.m.', far, mid, near);
  }

  function downtown(o) {
    var far = R(X0, 0, XW, 16, C.skyNight) + dither(16, 12, C.skyNight, C.skyDusk) + R(X0, 28, XW, 32, C.skyDusk) +
      cloud(20, 40, 36) + cloud(200, 34, 28) + bird(150, 52) + bird(162, 48) +
      dither(60, 12, C.skyDusk, C.sun) + R(X0, 72, XW, 68, C.sun) + sunDisc(160, 100, C.gold) +
      building(-40, 40, 56, 100, C.asphalt, C.skyNight, { ww: 4, wh: 4, gx: 4, gy: 4, pad: 4, seed: 18, alt: C.gold, p: 0.2 }) +
      building(24, 20, 40, 120, C.concrete, C.glass, { ww: 4, wh: 4, gx: 4, gy: 4, pad: 4, seed: 19 }) +
      building(240, 30, 48, 110, C.asphalt, C.skyNight, { ww: 4, wh: 4, gx: 4, gy: 4, pad: 4, seed: 20, alt: C.gold, p: 0.25 }) +
      building(296, 52, 64, 88, C.concrete, C.glass, { ww: 4, wh: 4, gx: 4, gy: 4, pad: 4, seed: 22 }) +
      R(40, 12, 8, 8, C.concrete) + R(43, 4, 2, 8, C.asphalt) + R(43, 2, 2, 2, C.red, 'blink');
    var bulbs = '';
    for (var bx = 196; bx < 272; bx += 8) bulbs += R(bx, 84, 4, 4, C.gold) + R(bx, 100, 4, 4, C.gold);
    var stripes = '';
    for (var ax = 192; ax < 240; ax += 8) stripes += R(ax, 120, 4, 8, C.white);
    var mid = building(80, 12, 56, 128, C.glass, C.white, { ww: 4, wh: 4, gx: 4, gy: 4, pad: 4, seed: 23, alt: C.sky, p: 0.35 }) + R(96, 4, 24, 8, C.concrete) +
      building(144, 44, 40, 96, C.concrete, C.glass, { ww: 4, wh: 8, gx: 4, gy: 4, pad: 4, seed: 24, alt: C.gold, p: 0.3 }) + crane(170, 20, 40) +
      building(188, 72, 92, 68, C.sand, C.glass, { ww: 8, wh: 8, gx: 8, gy: 8, pad: 8, seed: 25, alt: C.gold, p: 0.4 }) +
      R(196, 84, 76, 20, C.red) + bulbs + T(234, 97, 'BALLROOM', 6, C.white) +
      R(192, 120, 48, 8, C.red) + stripes + R(236, 112, 12, 28, C.ink) + R(240, 116, 4, 8, C.glass) + person(212, 140, C.red) +
      R(60, 132, 4, 8, C.red) + R(59, 132, 6, 2, C.red) + R(80, 130, 8, 10, C.gold) + R(82, 132, 4, 3, C.white);
    var cross = '';
    for (var cx = 128; cx < 200; cx += 16) cross += R(cx, 152, 8, 24, C.white);
    var near = R(X0, 140, XW, 8, C.concrete) + R(X0, 140, XW, 2, C.white) + trafficLight(118, 148) + road(148, 32) + cross + carLayer(174, o);
    return wrap(o.label || 'Downtown Los Angeles at dawn', far, mid, near);
  }

  // Pixel tombstone for the shelved screen, 64x80.
  function tombstone() {
    return '<svg viewBox="0 0 64 80" width="64" height="80" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      R(24, 8, 16, 4, C.concrete) + R(16, 12, 32, 4, C.concrete) + R(12, 16, 40, 4, C.concrete) + R(8, 20, 48, 48, C.concrete) +
      R(48, 16, 4, 4, C.asphalt) + R(52, 20, 4, 48, C.asphalt) + R(16, 56, 4, 4, C.asphalt) + R(40, 28, 4, 4, C.asphalt) +
      T(32, 38, 'RIP', 8, C.ink) + R(28, 46, 8, 8, C.ink) + R(30, 48, 4, 4, C.concrete) + R(26, 58, 12, 2, C.ink) +
      R(4, 68, 56, 8, C.asphalt) + R(0, 76, 64, 4, C.palmDark) + R(0, 72, 4, 4, C.palm) + R(60, 72, 4, 4, C.palm) +
      '</svg>';
  }

  function placeholder(o) {
    return lot(Object.assign({}, o, { label: (o && o.label) || 'Los Angeles' }));
  }

  return {
    lot: lot, freeway: freeway, hollywood: hollywood, sunset: sunset, century: century,
    culver: culver, santamonica: santamonica, griffith: griffith, capitol: capitol, downtown: downtown,
    placeholder: placeholder, car: car, tombstone: tombstone, palette: C
  };
})();
