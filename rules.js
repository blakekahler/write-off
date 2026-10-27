// Write-Off: round-two rule logic. The engine asks these five questions and nothing else.
// Formulas come from SPEC.md section 3. If the December flip fails, fix the numbers in
// scenarios.js, not the math here (run checkFlip() in the browser console).

window.WRITEOFF_RULES = (function () {
  'use strict';

  function money(n, signed) {
    var a = Math.abs(Math.round(n));
    if (a === 0) return '$0';
    var s = a >= 1000 ? '$' + (a / 1000).toFixed(1).replace(/\.0$/, '') + 'B' : '$' + a + 'M';
    if (n < 0) return '-' + s;
    return (signed ? '+' : '') + s;
  }

  var NOUN = { newsapp: 'the app', superhero: 'the movie', bigfilm: 'the film', kidsshow: 'the show', animated: 'the film' };

  // How much a choice moves the bonus (percentage points of target), by rule.
  // eff is the choice's dollar effects after any perShelved scaling: { thisYear, threeYear, writeOff }.
  function bonusDelta(rule, eff) {
    switch (rule) {
      case 'threeYear': return eff.threeYear / 10;
      case 'writeOffsCount': return (eff.thisYear - eff.writeOff) / 10;
      case 'rightsRevert':   // paid now; the reversion lands on the receipt (see receiptPenalty)
      case 'creatorVeto':
      case 'oneFewerBuyer':
      default: return eff.thisYear / 10;
    }
  }

  // What finance says under each choice button.
  function hint(rule, eff, choice) {
    var ty = money(eff.thisYear, true);
    switch (rule) {
      case 'threeYear':
        return 'This year: ' + ty + '. Over three years: ' + money(eff.threeYear, true) + '.';
      case 'writeOffsCount':
        if (eff.writeOff > 0) return ty + ' this year, minus a ' + money(eff.writeOff) + ' write-off counted against your bonus.';
        if (eff.writeOff < 0) return ty + ' this year, plus the ' + money(-eff.writeOff) + ' write-off you give back.';
        return 'Finance says: ' + ty + ' this year. No write-off.';
      case 'rightsRevert':
        if (choice && choice.shelves) return ty + ' this year, but ' + (NOUN[choice.kills] || 'it') + ' goes back to its creators in 12 months.';
        return 'Finance says: ' + ty + ' this year.';
      default:
        return 'Finance says: ' + ty + ' this year.';
    }
  }

  // A string disables the choice and is shown in place of the hint.
  function disabledReason(rule, choice) {
    if (rule === 'creatorVeto' && choice && choice.shelves) return 'The creators said no. Sell it or release it.';
    return null;
  }

  // State overrides at the start of a round under this rule.
  function startState(rule) {
    return rule === 'oneFewerBuyer' ? { buyers: 0 } : {};
  }

  // Applied once, at the receipt. Returns { bonus, goodwill, lines } or null.
  function receiptPenalty(rule, state, projectName) {
    if (rule !== 'rightsRevert' || !state.reverts || !state.reverts.length) return null;
    return {
      bonus: -12 * state.reverts.length,
      goodwill: -5 * state.reverts.length,
      lines: state.reverts.map(function (id) {
        return 'Rights to ' + projectName(id) + ' reverted. A rival released it and made $120M.';
      })
    };
  }

  return { bonusDelta: bonusDelta, hint: hint, disabledReason: disabledReason, startState: startState, receiptPenalty: receiptPenalty };
})();
