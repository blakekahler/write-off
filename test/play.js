// Plays Write-Off end to end in headless Chromium and reports anything that throws.
// Usage: node test/play.js            (full speed, screenshots)
//        FAST=1 node test/play.js     (reduced motion, no travel animation)
//        OUT=/some/dir node test/play.js   (where screenshots go; default test/out)
// Needs Playwright with a Chromium build available to require('playwright').

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const OUT = process.env.OUT || path.join(ROOT, 'test', 'out');
const FAST = !!process.env.FAST;
const STRATEGY_R1 = process.env.R1 || 'real';      // real | shelve | release | random
const STRATEGY_R2 = process.env.R2 || 'release';
const RULE = process.env.RULE || 'threeYear';
const WIDTH = Number(process.env.WIDTH || 390);
const URL = 'file://' + path.join(ROOT, 'index.html');

fs.mkdirSync(OUT, { recursive: true });
const shots = new Set();
async function shot(page, name) {
  if (shots.has(name)) return;
  shots.add(name);
  await page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true });
}

async function overflow(page) {
  return page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
}

async function main() {
  const browser = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
  const ctx = await browser.newContext({
    viewport: { width: WIDTH, height: 844 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true,
    reducedMotion: FAST ? 'reduce' : 'no-preference', acceptDownloads: true
  });
  const page = await ctx.newPage();
  const errors = [];
  const overflows = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', r => errors.push('requestfailed: ' + r.url() + ' ' + (r.failure() || {}).errorText));

  await page.goto(URL);
  await page.waitForFunction(() => document.fonts && document.fonts.status === 'loaded', null, { timeout: 15000 }).catch(() => errors.push('fonts did not finish loading'));
  const fontsOk = await page.evaluate(() => document.fonts.check('12px "Press Start 2P"') && document.fonts.check('12px VT323'));
  console.log('fonts loaded:', fontsOk);

  const state = () => page.evaluate(() => { const s = window.WRITEOFF.state; return { screen: s.screen, phase: s.travel && s.travel.phase, stopIndex: s.stopIndex, round: s.round, rule: s.rule, cash: s.cash, debt: s.debt, bonus: s.bonus, crew: s.crew, goodwill: s.goodwill, buyers: s.buyers, shelved: s.shelved.slice() }; });

  async function checkOverflow(label) {
    const o = await overflow(page);
    if (o > 0) overflows.push(label + ': ' + o + 'px');
  }

  await shot(page, '01-title');
  await checkOverflow('title');
  await page.click('[data-action=to-setup]');
  await page.fill('input[data-field=name]', 'Blake');
  await page.fill('input[data-field=studio]', 'durKheim Pictures');
  await page.click('[data-pace=aggressive]');
  await shot(page, '02-setup');
  await checkOverflow('setup');
  await page.click('[data-action=begin]');

  async function playRound(strategy, tag) {
    for (let guard = 0; guard < 400; guard++) {
      const s = await state();
      if (s.screen === 'receipt') return;
      if (s.screen === 'travel') {
        if (!FAST && s.stopIndex === 2) await shot(page, tag + '-travel');
        if (s.phase === 'wait') { await shot(page, tag + '-travel-note-' + s.stopIndex); await page.click('[data-action=arrive]'); }
        else if (s.phase === 'event') {
          await shot(page, tag + '-event-' + s.stopIndex);
          const btn = await page.$('[data-action=event-choice], [data-action=event-ok], [data-action=event-done]');
          if (btn) await btn.click(); else await page.waitForTimeout(100);
        }
        else await page.waitForTimeout(FAST ? 20 : 150);
        continue;
      }
      if (s.screen === 'stop') {
        const info = await page.evaluate(() => {
          const st = window.WRITEOFF.state; const stop = window.WRITEOFF_DATA.stops[st.stopIndex];
          const view = window.WRITEOFF.stopView(stop);
          return { id: stop.id, real: stop.real, variant: view.variant,
            choices: view.choices.map(c => ({ id: c.id, shelves: !!c.shelves })),
            buttons: Array.from(document.querySelectorAll('.choice')).map(b => ({ id: b.dataset.choice, off: b.getAttribute('aria-disabled') === 'true', hint: b.querySelector('.hint').textContent, h: b.getBoundingClientRect().height })) };
        });
        const small = info.buttons.filter(b => b.h < 48);
        if (small.length) errors.push('choice button under 48px at ' + info.id);
        await shot(page, tag + '-stop-' + info.id);
        await checkOverflow(tag + ' stop ' + info.id);
        const enabled = info.buttons.filter(b => !b.off).map(b => b.id);
        let pick = enabled[0];
        const shelver = info.choices.find(c => c.shelves && enabled.includes(c.id));
        const nonShelver = info.choices.find(c => !c.shelves && enabled.includes(c.id));
        if (strategy === 'real' && enabled.includes(info.real)) pick = info.real;
        else if (strategy === 'shelve' && shelver) pick = shelver.id;
        else if (strategy === 'release' && nonShelver) pick = nonShelver.id;
        else if (strategy === 'random') pick = enabled[Math.floor(Math.random() * enabled.length)];
        if (info.id === 'animated') console.log(tag, 'December hints:', info.buttons.map(b => b.id + ' => ' + b.hint + (b.off ? ' [off]' : '')).join(' || '));
        console.log(tag, info.id, 'variant=' + info.variant, 'pick=' + pick, 'enabled=' + enabled.join(','));
        await page.click('.choice[data-choice="' + pick + '"]');
        continue;
      }
      if (s.screen === 'shelved') { await shot(page, tag + '-shelved'); await page.click('.shelved'); continue; }
      if (s.screen === 'card') {
        await shot(page, tag + '-card-' + s.stopIndex);
        const cardOverflow = await page.evaluate(() => { const c = document.querySelector('.card'); return c ? c.scrollHeight - c.clientHeight : 0; });
        if (cardOverflow > 0) errors.push('outcome card needs a scroll bar at stop ' + s.stopIndex + ' (' + cardOverflow + 'px)');
        await page.click('[data-action=driveon]');
        continue;
      }
      await page.waitForTimeout(100);
    }
    throw new Error('round did not finish: ' + JSON.stringify(await state()));
  }

  await playRound(STRATEGY_R1, 'r1');
  const r1 = await page.evaluate(() => window.WRITEOFF.state.receipt);
  console.log('ROUND 1 RECEIPT:', JSON.stringify({ debt: r1.debt, target: r1.target, hit: r1.hit, bonus: r1.bonus, shelved: r1.shelved, sold: r1.sold, sentHome: r1.sentHome, trust: r1.trust, payVote: r1.payVote.text, matches: r1.matches + '/' + r1.compared, december: r1.december, lines: r1.lines }));
  await shot(page, 'r1-receipt');
  await checkOverflow('receipt 1');

  const hasRules = await page.$('[data-action=to-rules]');
  if (hasRules && await page.evaluate(() => !!window.WRITEOFF_RULES)) {
    await page.click('[data-action=to-rules]');
    await shot(page, 'r2-rules');
    await checkOverflow('rule picker');
    await page.click('.rule-card[data-rule="' + RULE + '"]');
    await playRound(STRATEGY_R2, 'r2');
    const r2 = await page.evaluate(() => window.WRITEOFF.state.receipt);
    console.log('ROUND 2 RECEIPT:', JSON.stringify({ rule: r2.rule, debt: r2.debt, hit: r2.hit, bonus: r2.bonus, shelved: r2.shelved, sold: r2.sold, sentHome: r2.sentHome, trust: r2.trust, payVote: r2.payVote.text, matches: r2.matches + '/' + r2.compared, december: r2.december, lines: r2.lines }));
    await shot(page, 'r2-receipt');
    await page.click('[data-action=to-exit]');
    await shot(page, 'r2-exit');
    await page.fill('#q-hardest', 'December. The numbers said shelve it.');
    await page.fill('#q-rule', 'Three-year bonus.');
    await page.click('[data-action=exit-save]');
    await shot(page, 'r2-final');
    await checkOverflow('final');
    const [download] = await Promise.all([page.waitForEvent('download', { timeout: 5000 }).catch(() => null), page.click('[data-action=download]')]);
    if (download) {
      const p = path.join(OUT, download.suggestedFilename());
      await download.saveAs(p);
      const txt = fs.readFileSync(p, 'utf8');
      console.log('LOG FILE:', download.suggestedFilename(), txt.split('\n').length, 'lines');
      console.log(txt.split('\n').slice(0, 6).join('\n'));
    } else errors.push('download did not fire');
    const flip = await page.evaluate(() => (typeof window.checkFlip === 'function') ? (function () { const out = []; const orig = console.log; console.log = (...a) => out.push(a.join(' ')); let res; try { res = window.checkFlip(); } finally { console.log = orig; } return { res, out }; })() : null);
    if (flip) { console.log('checkFlip ->', flip.res); console.log(flip.out.join('\n')); if (flip.res === false) errors.push('checkFlip FAIL'); }
  } else {
    console.log('(no rules.js yet, stopping after round one)');
  }

  // Sources and About from the title
  await page.goto(URL);
  await page.click('[data-action=to-sources]');
  await shot(page, '03-sources');
  await checkOverflow('sources');
  const links = await page.$$eval('.src-list a', as => as.map(a => a.href));
  console.log('sources:', links.length, 'links');
  await page.click('[data-action=back]');
  await page.click('[data-action=to-about]');
  await shot(page, '04-about');

  console.log('\nOVERFLOW:', overflows.length ? overflows.join('; ') : 'none');
  console.log('ERRORS:', errors.length ? '\n  ' + errors.join('\n  ') : 'none');
  await browser.close();
  process.exit(errors.length ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(2); });
