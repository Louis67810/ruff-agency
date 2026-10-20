/* Focused API contract checks; no network, real user data or credentials. */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { NextRequest } = require('next/server');
function load(file, overrides = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, require: name => name === 'server-only' ? {} : overrides[name] ?? require(name), Buffer, Response, File, Headers, URLSearchParams, URL, console, process, fetch: () => { throw Error('Unexpected network'); } }, { filename: file });
  return module.exports;
}
const store = load('lib/linkedin/store.ts');
const docs = load('lib/linkedin/openapi.ts');
const posts = new Map();
let readonly = false;
let lastQuery;
const db = async (table, q, method = 'GET', body) => {
  if (table === 'linkedin_api_keys') return [{ id: 'test-key', scopes: readonly ? ['posts:read'] : ['posts:read','posts:write'] }];
  if (table !== 'linkedin_posts') throw Error('Unexpected table');
  lastQuery = q;
  if (method === 'POST') { const post = { created_at: '2026-10-20T12:00:00.000Z', updated_at: '2026-10-20T12:00:00.000Z', version: 1, ...body }; posts.set(post.id, post); return [post]; }
  const id = q.get('id')?.slice(3);
  if (method === 'GET') return id ? posts.has(id) ? [posts.get(id)] : [] : [...posts.values()];
  const current = posts.get(id);
  assert.equal(q.get('version'), 'eq.' + current.version);
  if (method === 'PATCH') { const post = { ...current, ...body }; posts.set(id, post); return [post]; }
  if (method === 'DELETE') { posts.delete(id); return [current]; }
};
const route = load('app/api/linkedin/[...segments]/route.ts', {
  '@/lib/linkedin/store': { ...store, database: db, ensureCategory: async name => name || null, categories: async () => [] },
  '@/lib/linkedin/openapi': docs,
  '@/lib/saas-analytics/auth': { analyticsCookieName: 'test-session', analyticsTokenIsValid: candidate => candidate === 'valid-session' },
});
async function call(method, path, body, auth = true) {
  const headers = { 'content-type': 'application/json' };
  if (auth) headers.authorization = 'Bearer li_' + 'a'.repeat(64);
  const request = new NextRequest('https://example.test/api/linkedin/' + path, { method, headers, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  return route[method](request, { params: { segments: path.split('?')[0].split('/') } });
}
(async () => {
  assert.equal((await call('GET', 'posts', undefined, false)).status, 401);
  readonly = true;
  assert.equal((await call('POST', 'posts', { title: 'Denied' })).status, 403);
  readonly = false;
  assert.equal((await call('POST', 'posts', null)).status, 400);
  assert.equal((await call('POST', 'posts', { title: 'Invalid date', date: '2026-02-30' })).status, 400);
  assert.equal((await call('POST', 'posts', { title: 'Invalid image', image: 'https://external.test/track.svg' })).status, 400);
  let response = await call('POST', 'posts', { title: 'API verification', id: 'contract-fixture', date: '2026-10-25' });
  assert.equal(response.status, 201);
  let { post } = await response.json();
  assert.equal(post.date, '2026-10-25'); assert.equal(post.category, ''); assert.equal(post.version, 1); assert(post.createdAt);
  response = await call('PATCH', 'posts/contract-fixture', { date: '2026-10-28', expectedVersion: 1 });
  assert.equal(response.status, 200); post = (await response.json()).post; assert.equal(post.date, '2026-10-28'); assert.equal(post.version, 2);
  assert.equal((await call('PATCH', 'posts/contract-fixture', { title: 'Stale edit', expectedVersion: 1 })).status, 409);
  response = await call('GET', 'posts?createdAfter=2026-10-19T00:00:00Z&dateFrom=2026-10-20&limit=1');
  assert.equal(response.status, 200); assert.equal(lastQuery.get('created_at'), 'gte.2026-10-19T00:00:00Z'); assert.equal(lastQuery.get('publication_date'), 'gte.2026-10-20');
  assert.equal((await call('GET', 'posts?limit=999')).status, 400);
  assert.equal((await call('GET', 'posts?cursor=invalid')).status, 400);
  assert.equal((await call('POST', 'keys', { name: 'Denied to API key' })).status, 401);
  assert.equal((await call('DELETE', 'posts/contract-fixture?version=1')).status, 409);
  assert.equal((await call('DELETE', 'posts/contract-fixture?version=2')).status, 200);
  const html = fs.readFileSync('public/linkedin-atelier.html', 'utf8');
  new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
  assert(!html.includes('type="time"')); assert(!html.includes('localStorage.setItem')); assert(html.includes('expectedVersion'));
  assert.equal(docs.openapi('https://example.test').openapi, '3.0.3');
  console.log('PASS: authentication, scopes, input validation, create, schedule, concurrency, filters, deletion, cloud script and API schema.');
})().catch(error => { console.error(error); process.exitCode = 1; });
