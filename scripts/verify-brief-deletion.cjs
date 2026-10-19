const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { createHmac } = require('node:crypto');
const esbuild = require('esbuild');

async function main() {
  const root = process.cwd();
  const output = path.join(root, '.data', 'brief-deletion-check');
  await esbuild.build({
    entryPoints: ['lib/saas-analytics/store.ts', 'lib/saas-analytics/metrics.ts', 'lib/saas-brief/store.ts', 'app/api/saas-brief/route.ts'],
    outdir: output, bundle: true, platform: 'node', format: 'cjs', packages: 'external',
    plugins: [{ name: 'server-only-test', setup(build) {
      build.onResolve({ filter: /^server-only$/ }, () => ({ path: 'server-only', namespace: 'test' }));
      build.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: '' }));
    } }],
  });
  const temporary = await fs.mkdtemp(path.join(output, 'fixture-'));
  const originalFetch = global.fetch;
  process.env.NODE_ENV = 'test';
  for (const name of ['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY']) delete process.env[name];
  process.env.SAAS_ANALYTICS_PASSWORD = 'deletion-test-only';
  process.env.SAAS_ANALYTICS_COOKIE_SECRET = 'deletion-test-secret';
  process.chdir(temporary);
  try {
    const store = require(path.join(output, 'lib/saas-brief/store.js'));
    const analytics = require(path.join(output, 'lib/saas-analytics/store.js'));
    const metrics = require(path.join(output, 'lib/saas-analytics/metrics.js'));
    const route = require(path.join(output, 'app/api/saas-brief/route.js'));
    const { NextRequest } = require('next/server');
    const token = createHmac('sha256', process.env.SAAS_ANALYTICS_COOKIE_SECRET).update('saas-analytics:v1').digest('hex');
    const request = (id, authenticated = true, origin = 'http://localhost:3000') => new NextRequest(`http://localhost:3000/api/saas-brief?id=${id}`, {
      method: 'DELETE', headers: { origin, ...(authenticated ? { cookie: `saas_analytics_session=${token}` } : {}) },
    });
    const visitorId = crypto.randomUUID();
    await analytics.writeAnalyticsEvent({ eventType: 'page_view', visitorId, sessionId: crypto.randomUUID(), path: '/en/saas-redesign', metadata: {} }, 'FR');
    const payload = { id: crypto.randomUUID(), visitorId, tokenHash: 'test-hash', revision: 1, lastStep: 5, website: 'https://example.com', email: 'qa@example.com', mrr: '<5k', changes: ['Low conversion'], details: '', durationMs: 12000, completed: true, attribution: { path: '/en/saas-redesign', utm: {} } };
    await store.saveBriefResponse(payload);
    const second = { ...payload, id: crypto.randomUUID() };
    await store.saveBriefResponse(second);
    const summary = async () => analytics.summarizeAnalytics(await analytics.readAnalyticsEvents(7), 7);
    assert.equal((await summary()).conversions, 2);
    assert.equal((await summary()).conversionRate, 100);
    assert.equal((await route.DELETE(request(payload.id, false))).status, 401);
    assert.equal((await route.DELETE(request(payload.id, true, 'https://attacker.example'))).status, 403);
    assert.equal((await route.DELETE(request('invalid'))).status, 400);
    assert.equal((await store.readBriefResponses()).length, 2);
    assert.equal((await route.DELETE(request(payload.id))).status, 204);
    assert.equal((await summary()).conversions, 1);
    assert.equal((await summary()).conversionRate, 100, 'Another completed response keeps this visitor converted');
    assert.equal((await route.DELETE(request(payload.id))).status, 404);
    assert.equal((await route.DELETE(request(second.id))).status, 204);
    assert.equal((await summary()).conversions, 0);
    assert.equal((await summary()).conversionRate, 0);
    assert.equal((await summary()).visitors, 1, 'Deletion must retain browsing history');
    await store.saveBriefResponse({ ...payload, revision: 2 });
    assert.equal((await store.readBriefResponses()).length, 0, 'Late local autosaves cannot resurrect deleted responses');
    const visit = (await analytics.readAnalyticsEvents(7))[0];
    const staleConversion = { ...visit, eventType: 'conversion', metadata: { conversionType: 'brief_completed', briefId: payload.id } };
    const booking = { ...visit, eventType: 'conversion', metadata: { conversionType: 'booking_confirmed' } };
    assert.deepEqual(metrics.attributeBriefConversions([visit, staleConversion, booking], []), [visit, booking]);

    process.env.SUPABASE_URL = 'https://deletion-test.invalid';
    process.env.SUPABASE_SECRET_KEY = 'sb_secret_test';
    global.fetch = async (url, options) => {
      const parsed = new URL(url);
      assert.equal(parsed.hostname, 'deletion-test.invalid');
      assert.equal(parsed.pathname, '/rest/v1/saas_brief_responses');
      assert.equal(parsed.searchParams.get('id'), `eq.${payload.id}`);
      assert.equal(options.method, 'DELETE');
      return Response.json([{ id: payload.id }]);
    };
    assert.equal(await store.deleteBriefResponse(payload.id), true);
    global.fetch = async () => Response.json([]);
    assert.equal(await store.deleteBriefResponse(payload.id), false);
    global.fetch = async () => new Response('', { status: 503 });
    await assert.rejects(store.deleteBriefResponse(payload.id), /deletion failed/);
    console.log('PASS: authenticated DELETE, origin/UUID checks, missing response, conversion 2 -> 1 -> 0, rate 100% -> 0%, browsing retained, stale conversions, late local saves, scoped Supabase DELETE and failure handling. No live records modified.');
  } finally {
    global.fetch = originalFetch;
    process.chdir(root);
    // temporary is created within this test's fixed output directory.
    if (path.dirname(temporary) !== output) throw new Error('Unexpected test directory');
    await fs.rm(temporary, { recursive: true, force: true });
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
