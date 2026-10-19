const assert = require('node:assert/strict');
const vm = require('node:vm');
const esbuild = require('esbuild');

async function main() {
  const build = await esbuild.build({
    entryPoints: ['app/saas-redesign/saas-analytics-tracker.tsx'],
    bundle: true, platform: 'node', format: 'cjs', write: false,
    external: ['react', 'next/navigation'],
  });
  const listeners = new Map();
  const timers = new Map();
  const sent = [];
  let cleanup;
  let timerId = 0;
  const storage = () => {
    const values = new Map();
    return { getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, v), removeItem: k => values.delete(k) };
  };
  const window = {
    innerWidth: 390, innerHeight: 844, scrollY: 0,
    location: new URL('https://ruff.agency/en/saas-redesign?utm_campaign=qa'),
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: name => listeners.delete(name),
    setTimeout: fn => { timers.set(++timerId, fn); return timerId; },
    clearTimeout: id => timers.delete(id), setInterval: () => 1, clearInterval() {},
  };
  const document = {
    referrer: '', visibilityState: 'visible',
    documentElement: { scrollHeight: 24537 },
    querySelector: () => null, querySelectorAll: () => [],
    addEventListener: window.addEventListener, removeEventListener: window.removeEventListener,
  };
  class Anchor {
    constructor() { this.href = 'https://ruff.agency/en/saas-redesign/brief?utm_campaign=qa'; this.dataset = {}; this.textContent = 'Start your redesign'; }
    closest(selector) { return selector.startsWith('a,') ? this : null; }
    matches() { return false; }
  }
  const module = { exports: {} };
  vm.runInNewContext(build.outputFiles[0].text, {
    module, exports: module.exports,
    require: name => name === 'react' ? { useEffect: fn => { cleanup = fn(); } } : { usePathname: () => '/en/saas-redesign' },
    window, document, localStorage: storage(), sessionStorage: storage(), crypto,
    performance, URL, URLSearchParams, Blob, HTMLAnchorElement: Anchor,
    navigator: { userAgent: 'iPhone Safari/604.1', sendBeacon: () => false },
    IntersectionObserver: class { observe() {} disconnect() {} },
    fetch: async (_, options) => { const body = JSON.parse(options.body); sent.push(...(Array.isArray(body) ? body : [body])); },
  });
  module.exports.SaasAnalyticsTracker();
  assert.equal(sent.filter(e => e.eventType === 'scroll_depth').length, 0);
  window.scrollY = 844;
  listeners.get('scroll')();
  assert.equal(timers.size, 1);
  for (const [id, fn] of timers) { timers.delete(id); fn(); }
  const short = sent.find(e => e.metadata.measurement === 'progress');
  assert.ok(short.metadata.depth > 3.5 && short.metadata.depth < 3.6);
  assert.equal(short.metadata.maxScrollY, 844);
  listeners.get('scroll')();
  assert.equal(timers.size, 0);
  // Another movement must survive closing/hiding before its timer runs.
  window.scrollY = 1200;
  listeners.get('scroll')();
  listeners.get('click')({ target: new Anchor() });
  assert.equal(sent.filter(e => e.eventType === 'cta_click').length, 1);
  document.visibilityState = 'hidden';
  listeners.get('visibilitychange')();
  assert.equal(timers.size, 0);
  assert.equal(sent.filter(e => e.metadata.measurement === 'progress').at(-1).metadata.maxScrollY, 1200);
  assert.equal(sent.find(e => e.eventType === 'session_end').metadata.maxScrollY, 1200);
  // A return to the foreground continues tracking, including thresholds.
  document.visibilityState = 'visible';
  listeners.get('visibilitychange')();
  window.scrollY = 6752;
  listeners.get('scroll')();
  assert.equal(sent.filter(e => e.eventType === 'scroll_depth' && e.value === 25).length, 1);
  cleanup();
  assert.equal(timers.size, 0);
  const summaryBuild = await esbuild.build({
    entryPoints: ['lib/saas-analytics/store.ts'], bundle: true,
    platform: 'node', format: 'cjs', write: false, packages: 'external',
    plugins: [{ name: 'server-only-test', setup(build) {
      build.onResolve({ filter: /^server-only$/ }, () => ({ path: 'server-only', namespace: 'test' }));
      build.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: '' }));
    } }],
  });
  const summaryModule = { exports: {} };
  vm.runInNewContext(summaryBuild.outputFiles[0].text, {
    module: summaryModule, exports: summaryModule.exports, require, process, console, URL, URLSearchParams,
  });
  const fact = (eventType, sessionId, metadata = {}) => ({
    id: crypto.randomUUID(), createdAt: new Date().toISOString(), path: '/en/saas-redesign',
    visitorId: sessionId, sessionId, eventType, metadata,
  });
  const { summarizeAnalytics } = summaryModule.exports;
  assert.equal(summarizeAnalytics([fact('page_view', 'one'), fact('page_view', 'two'), fact('scroll_depth', 'one', { depth: 4 })], 7).scrollDepth, 2);
  assert.equal(summarizeAnalytics([fact('page_view', 'one'), fact('session_end', 'one', { maxScrollDepth: 7 })], 7).scrollDepth, 7);
  console.log('PASS: iPhone-size short scroll, bounded requests, departure flush, resume, 25% threshold, unlabelled brief CTA.');
  console.log('PASS: average includes zero-scroll visits and departure depth.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
