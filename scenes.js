// Write-Off: LA backgrounds. Each scene is a function returning an SVG string at 320x180.
// Phase 1 placeholder: every stop uses the same flat scene with the stop name on it.
// Phase 3 replaces this with the ten real scenes (see SPEC.md section 6).

window.WRITEOFF_SCENES = (function () {
  'use strict';

  var P = {
    sky: '#9bd3e8', skyDusk: '#e9a26a', skyNight: '#141a3a', sun: '#ffd97a',
    sand: '#e8d8b0', terracotta: '#c96a4a', palm: '#3f8f4f', palmDark: '#2a5f36',
    asphalt: '#5d5d66', concrete: '#b8b4a8', glass: '#7fb2c9', white: '#f6f3ea',
    ink: '#1b1b1f', crtGreen: '#5cf27a', red: '#e5484d', gold: '#f2c14e'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // A black town car with a film reel strapped to the roof, 24x12.
  function car() {
    return '<g class="car-sprite">' +
      '<rect x="8" y="0" width="8" height="4" fill="' + P.concrete + '"/>' +
      '<rect x="10" y="1" width="4" height="2" fill="' + P.ink + '"/>' +
      '<rect x="6" y="2" width="12" height="2" fill="' + P.gold + '"/>' +
      '<rect x="4" y="4" width="16" height="4" fill="' + P.ink + '"/>' +
      '<rect x="6" y="5" width="4" height="2" fill="' + P.glass + '"/>' +
      '<rect x="12" y="5" width="6" height="2" fill="' + P.glass + '"/>' +
      '<rect x="0" y="8" width="24" height="3" fill="' + P.ink + '"/>' +
      '<rect x="0" y="8" width="2" height="1" fill="' + P.gold + '"/>' +
      '<rect x="22" y="8" width="2" height="1" fill="' + P.red + '"/>' +
      '<rect x="3" y="9" width="4" height="3" fill="' + P.asphalt + '"/>' +
      '<rect x="4" y="10" width="2" height="1" fill="' + P.white + '"/>' +
      '<rect x="17" y="9" width="4" height="3" fill="' + P.asphalt + '"/>' +
      '<rect x="18" y="10" width="2" height="1" fill="' + P.white + '"/>' +
      '</g>';
  }

  function carLayer(roadY, opts) {
    if (!opts || !opts.car) return '';
    return '<g class="car-anchor" transform="translate(0,' + (roadY - 12) + ')"><g class="car">' + car() + '</g></g>';
  }

  function placeholder(opts) {
    opts = opts || {};
    return '<svg viewBox="0 0 320 180" width="320" height="180" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(opts.label || 'Los Angeles') + '">' +
      '<g class="far"><rect x="-40" y="0" width="400" height="180" fill="' + P.sky + '"/>' +
      '<rect x="240" y="24" width="24" height="24" fill="' + P.sun + '"/></g>' +
      '<g class="mid"><rect x="-40" y="100" width="400" height="40" fill="' + P.palm + '"/></g>' +
      '<g class="near"><rect x="-40" y="140" width="400" height="40" fill="' + P.asphalt + '"/>' +
      '<rect x="-40" y="136" width="400" height="4" fill="' + P.sand + '"/>' +
      '<text x="160" y="80" text-anchor="middle" font-family="\'Press Start 2P\', monospace" font-size="9" fill="' + P.ink + '">' + esc(opts.label || '') + '</text>' +
      carLayer(152, opts) + '</g>' +
      '</svg>';
  }

  return { placeholder: placeholder, car: car, palette: P };
})();
