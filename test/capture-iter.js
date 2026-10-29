// Captures a consistent set of phone-sized screenshots from one checkout of the game.
// usage: node capture-iter.js <checkoutDir> <outDir> <panelsCommaSeparated>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const [,, dir, out, panelList] = process.argv;
const panels = panelList.split(',');
fs.mkdirSync(out, { recursive: true });
const URL = 'file://' + path.join(dir, 'index.html');

(async () => {
  const browser = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { Math.random = () => 0.99; try { localStorage.clear(); } catch (e) {} });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const fonts = async () => { await page.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(150); };
  const shot = async (name) => { await page.waitForTimeout(120); await page.screenshot({ path: path.join(out, name + '.png') }); console.log('  shot', name); };
  const has = async (sel) => !!(await page.$(sel));
  const st = () => page.evaluate(() => ({ screen: window.WRITEOFF.state.screen, phase: window.WRITEOFF.state.travel && window.WRITEOFF.state.travel.phase, i: window.WRITEOFF.state.stopIndex }));
  const begin = async () => {
    await page.goto(URL); await fonts();
    if (await has('[data-action=to-intro]')) await page.click('[data-action=to-intro]');
    await page.click('[data-action=to-setup]');
    await page.fill('input[data-field=name]', 'Blake'); await page.fill('input[data-field=studio]', 'durKheim Pictures');
    await page.click('[data-action=begin]');
    await settle();
  };
  const settle = async () => { for (let i = 0; i < 40; i++) { const s = await st(); if (s.screen === 'stop' || s.screen === 'receipt') return; if (s.screen === 'travel' && s.phase === 'wait') await page.click('[data-action=arrive]'); if (s.screen === 'travel' && s.phase === 'event') { const b = await page.$('[data-action=event-ok], [data-action=event-choice], [data-action=event-done]'); if (b) await b.click(); } await page.waitForTimeout(40); } };
  const goStop = async (id) => { await page.evaluate(id => { const i = window.WRITEOFF_DATA.stops.findIndex(s => s.id === id); window.WRITEOFF.travelTo(i); }, id); await settle(); };
  const playRound = async (strategy) => {
    for (let g = 0; g < 300; g++) {
      const s = await st();
      if (s.screen === 'receipt') return;
      if (s.screen === 'stop') {
        const info = await page.evaluate(() => { const stt = window.WRITEOFF.state; const stop = window.WRITEOFF_DATA.stops[stt.stopIndex]; const v = window.WRITEOFF.stopView(stop); return { real: stop.real, ids: Array.from(document.querySelectorAll('.choice')).filter(b => b.getAttribute('aria-disabled') !== 'true').map(b => b.dataset.choice), shelver: (v.choices.find(c => c.shelves) || {}).id }; });
        let pick = info.ids[0];
        if (strategy === 'real' && info.ids.includes(info.real)) pick = info.real;
        if (strategy === 'shelve' && info.ids.includes(info.shelver)) pick = info.shelver;
        if (strategy === 'release') pick = info.ids.find(id => id !== info.shelver) || pick;
        await page.click('.choice[data-choice="' + pick + '"]'); continue;
      }
      if (s.screen === 'shelved') { await page.click('.shelved'); continue; }
      if (s.screen === 'card') { await page.click('[data-action=driveon]'); continue; }
      await settle(); await page.waitForTimeout(30);
    }
  };

  for (const p of panels) {
    console.log('panel', p);
    if (p === 'title') { await page.goto(URL); await fonts(); await shot('title'); }
    else if (p === 'intro') { await page.goto(URL); await fonts(); await page.click('[data-action=to-intro]'); await shot('intro'); }
    else if (p === 'stop-animated') { await begin(); await goStop('animated'); await shot('stop-animated'); }
    else if (p === 'stop-purge') { await begin(); await goStop('purge'); await shot('stop-purge'); }
    else if (p === 'stop-hollywood') { await begin(); await goStop('superhero'); await shot('stop-hollywood'); }
    else if (p === 'card-dayone') { await begin(); await page.click('.choice[data-choice=sign]'); await shot('card-dayone'); }
    else if (p === 'card-purge') { await begin(); await goStop('purge'); await page.click('.choice[data-choice=pull]'); await shot('card-purge'); }
    else if (p === 'shelved') { await begin(); await goStop('animated'); await page.click('.choice[data-choice=shelve]'); await shot('shelved'); }
    else if (p === 'receipt') { await begin(); await playRound('real'); await shot('receipt'); }
    else if (p === 'rules') { await begin(); await playRound('real'); await page.click('[data-action=to-rules]'); await shot('rules'); }
    else if (p === 'stop-animated-r2') { await begin(); await playRound('real'); await page.click('[data-action=to-rules]'); await page.click('.rule-card[data-rule=threeYear]'); await settle(); await goStop('animated'); await shot('stop-animated-r2'); }
    else if (p === 'final') { await begin(); await playRound('shelve'); await page.click('[data-action=to-rules]'); await page.click('.rule-card[data-rule=threeYear]'); await settle(); await playRound('release'); await page.click('[data-action=to-exit]'); await page.click('[data-action=exit-skip]'); await shot('final'); }
    else if (p === 'travel') { await begin(); await page.evaluate(() => { const s = window.WRITEOFF.state; s.stopIndex = 2; s.month = 2; s.screen = 'travel'; s.travel = { notes: [], event: null, phase: 'wait', outcome: null }; window.WRITEOFF.render(); }); await shot('travel'); }
    else if (p === 'event') { await begin(); await page.evaluate(() => { const s = window.WRITEOFF.state; const ev = window.WRITEOFF_DATA.events.find(e => e.id === 'crossing'); s.stopIndex = 5; s.month = 5; s.screen = 'travel'; s.travel = { notes: [], event: ev, phase: 'event', outcome: null }; window.WRITEOFF.render(); }); await shot('event'); }
    else if (p === 'tombstone') { await begin(); await page.evaluate(() => { const s = window.WRITEOFF.state; s.stopIndex = 3; s.month = 3; s.screen = 'travel'; s.travel = { notes: [{ kind: 'tomb', text: 'Here lies THE SUPERHERO MOVIE. Shelved by Blake, Round 1.' }], event: null, phase: 'wait', outcome: null }; window.WRITEOFF.render(); }); await shot('tombstone'); }
    else if (p === 'sources') { await page.goto(URL); await fonts(); await page.click('[data-action=to-sources]'); await shot('sources'); }
    else if (p === 'stop-limo') { await begin(); await page.evaluate(() => { const s = window.WRITEOFF.state; s.cash = 900; s.carTier = 3; }); await goStop('tcm'); await shot('stop-limo'); }
    else if (p === 'gallery') {
      const g = await browser.newPage({ viewport: { width: 1000, height: 700 }, deviceScaleFactor: 1 });
      await g.goto('file://' + path.join(dir, 'test', 'scenes.html')); await g.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 15000 }).catch(() => {}); await g.waitForTimeout(300);
      await g.screenshot({ path: path.join(out, 'gallery.png'), fullPage: true }); await g.close(); console.log('  shot gallery');
    }
  }
  console.log('errors:', errs.length ? errs.join(' | ') : 'none');
  await browser.close();
})();
