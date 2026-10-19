const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { createHmac } = require('node:crypto');
const esbuild = require('esbuild');

(async () => {
  const root = process.cwd();
  const output = path.join(root, '.data', 'replay-check');
  await esbuild.build({ entryPoints: ['app/api/session-replay/route.ts'], outdir: output, bundle: true, platform: 'node', format: 'cjs', packages: 'external', plugins: [{ name: 'server-only-test', setup(build) {
    build.onResolve({ filter: /^server-only$/ }, () => ({ path: 'server-only', namespace: 'test' }));
    build.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: '' }));
  } }] });
  const temporary = await fs.mkdtemp(path.join(output, 'fixture-'));
  process.env.NODE_ENV = 'test';
  for (const name of ['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY']) delete process.env[name];
  process.env.SAAS_ANALYTICS_PASSWORD = 'replay-test-only';
  process.env.SAAS_ANALYTICS_COOKIE_SECRET = 'replay-test-secret';
  process.chdir(temporary);
  try {
    const route = require(path.join(output, 'route.js'));
    const { NextRequest } = require('next/server');
    const cookie = 'saas_analytics_session=' + createHmac('sha256', process.env.SAAS_ANALYTICS_COOKIE_SECRET).update('saas-analytics:v1').digest('hex');
    const payload = { id: crypto.randomUUID(), token: crypto.randomUUID(), visitorId: crypto.randomUUID(), sessionId: crypto.randomUUID(), path: '/en/saas-redesign', consent: true, sequence: 0, events: [{ type: 4, timestamp: Date.now(), data: { href: 'http://localhost:3000/en/saas-redesign', width: 1280, height: 720 } }, { type: 2, timestamp: Date.now(), data: { node: { type: 0, id: 1, childNodes: [] }, initialOffset: { left: 0, top: 0 } } }] };
    const post = (body, origin = 'http://localhost:3000') => route.POST(new NextRequest('http://localhost:3000/api/session-replay', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify(body) }));
    const get = (query, auth = true) => route.GET(new NextRequest('http://localhost:3000/api/session-replay?' + query, { headers: auth ? { cookie } : {} }));
    assert.equal((await get('visitor=' + payload.visitorId, false)).status, 401);
    assert.equal((await post(payload, 'https://attacker.example')).status, 403);
    assert.equal((await post({ ...payload, consent: false })).status, 400);
    assert.equal((await post({ ...payload, path: '/en/saas-redesign/brief' })).status, 400);
    assert.equal((await post({ ...payload, path: '/behavioral-intelligence' })).status, 400);
    assert.equal((await post({ ...payload, path: '/outils-gratuits/simulateur-roi-refonte' })).status, 400);
    assert.equal((await post({ ...payload, path: '/?email=private' })).status, 400);
    assert.equal((await post({ ...payload, events: [{ type: 3, timestamp: Date.now(), data: {} }] })).status, 400);
    assert.equal((await post(payload)).status, 204);
    assert.equal((await post(payload)).status, 204);
    let result = await (await get('id=' + payload.id)).json();
    assert.equal(result.chunks.length, 1, 'Duplicate requests are idempotent');
    assert.equal(result.chunks[0].events.length, 2);
    assert.equal((await post({ ...payload, sequence: 1, token: crypto.randomUUID() })).status, 503);
    assert.equal((await post({ ...payload, sequence: 1, events: [{ type: 3, timestamp: Date.now(), data: { source: 3, id: 1, x: 0, y: 200 } }] })).status, 204);
    result = await (await get('id=' + payload.id + '&after=0')).json();
    assert.equal(result.chunks.length, 1);
    assert.equal(result.cursor, 1);
    assert.equal(result.chunks[0].events[0].data.y, 200);
    const list = await (await get('visitor=' + payload.visitorId)).json();
    assert.equal(list.sessions.length, 1);
    assert.equal(list.sessions[0].event_count, 3);
    assert.equal(JSON.stringify(list).includes('tokenHash'), false, 'Never return write tokens to the player');
    assert.equal((await get('id=' + payload.id + '&after=-10')).status, 400);
    const tooLarge = new NextRequest('http://localhost:3000/api/session-replay', { method: 'POST', headers: { 'content-type': 'application/json' }, body: ' '.repeat(2_000_001) });
    assert.equal((await route.POST(tooLarge)).status, 413, 'Enforce size without Content-Length');
    console.log('PASS: authenticated playback, origin and consent checks, sensitive path exclusions, snapshot requirement, persistence, deduplication, ownership, incremental playback cursor, token secrecy and streaming size limit. Isolated fixtures only.');
  } finally {
    process.chdir(root);
    if (path.dirname(temporary) !== output) throw new Error('Unexpected test directory');
    await fs.rm(temporary, { recursive: true, force: true });
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
