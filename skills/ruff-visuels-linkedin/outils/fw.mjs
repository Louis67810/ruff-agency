// Client stdio minimal pour le serveur MCP Figwright.
// Usage : import { fw, close } from './fw.mjs'; await fw('set_text', {...});
// CLI   : node fw.mjs <outil> '<json>'
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const SERVER = 'C:/Users/louis/figwright-runtime/node_modules/@figwright/mcp/dist/index.mjs';
const proc = spawn('node', [SERVER], { stdio: ['pipe', 'pipe', 'inherit'] });
let buf = '';
let nextId = 1;
const pending = new Map();
proc.stdout.on('data', (d) => {
  buf += d.toString('utf8');
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id && pending.has(msg.id)) {
      const { res, rej } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
    }
  }
});
function rpc(method, params) {
  const id = nextId++;
  proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  return new Promise((res, rej) => pending.set(id, { res, rej }));
}
const ready = (async () => {
  await rpc('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'fw-cli', version: '1' } });
  proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
})();

export async function fw(tool, args = {}) {
  await ready;
  const r = await rpc('tools/call', { name: tool, arguments: args });
  const text = (r.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
  if (r.isError) throw new Error(`${tool}: ${text}`);
  try { return JSON.parse(text); } catch { return text; }
}
export function close() { proc.kill(); }

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [tool, json] = process.argv.slice(2);
  fw(tool, json ? JSON.parse(json) : {})
    .then((r) => { console.log(typeof r === 'string' ? r : JSON.stringify(r, null, 1)); close(); })
    .catch((e) => { console.error(e.message); close(); process.exit(1); });
}
