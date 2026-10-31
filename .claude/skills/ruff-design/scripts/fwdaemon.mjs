// Serveur Figwright permanent + file de commandes.
// Déposer <nom>.json ([{name,args,out}, ...]) dans <dir>/queue ; les résultats
// arrivent dans <dir>/results/<out> et <dir>/results/<nom>.done.
// Un fichier <dir>/queue/stop arrête le démon.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SERVER = "C:\\Users\\lostaub\\Downloads\\Figwright-v0.5.0\\server\\node_modules\\@figwright\\mcp\\dist\\index.mjs";
const dir = process.argv[2];
const queue = path.join(dir, "queue");
const results = path.join(dir, "results");
fs.mkdirSync(queue, { recursive: true });
fs.mkdirSync(results, { recursive: true });
const log = (m) => { fs.appendFileSync(path.join(dir, "daemon.log"), new Date().toISOString() + " " + m + "\n"); console.log(m); };

const child = spawn(process.execPath, [SERVER], { stdio: ["pipe", "pipe", "pipe"] });
child.stderr.on("data", (d) => fs.appendFileSync(path.join(dir, "server-stderr.log"), d));
let buf = "";
const pending = new Map();
let nextId = 1;
child.stdout.on("data", (d) => {
  buf += d;
  let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (!line) continue;
    try { const msg = JSON.parse(line); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } } catch {}
  }
});
const rpc = (method, params, timeoutMs = 180000) => new Promise((resolve) => {
  const id = nextId++;
  pending.set(id, resolve);
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  setTimeout(() => { if (pending.has(id)) { pending.delete(id); resolve({ error: { message: "timeout " + method } }); } }, timeoutMs);
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "claude-code-fwdaemon", version: "0.1" } });
child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
log("serveur pret");

let lastConnected = -1;
for (;;) {
  const p = await rpc("tools/call", { name: "ping", arguments: {} }, 20000);
  let n = 0;
  try { n = JSON.parse(p.result?.content?.[0]?.text || "{}").sessions?.connectedCount || 0; } catch {}
  if (n !== lastConnected) { log("plugins connectes : " + n); fs.writeFileSync(path.join(dir, "status.txt"), String(n)); lastConnected = n; }
  for (const f of fs.readdirSync(queue)) {
    if (f === "stop") { log("arret"); child.kill(); process.exit(0); }
    if (!f.endsWith(".json") || n === 0) continue;
    const calls = JSON.parse(fs.readFileSync(path.join(queue, f), "utf8").replace(/^\uFEFF/, ""));
    fs.unlinkSync(path.join(queue, f));
    for (const c of calls) {
      const r = await rpc("tools/call", { name: c.name, arguments: c.args || {} }, 240000);
      fs.writeFileSync(path.join(results, c.out), JSON.stringify(r, null, 2));
      log("ok " + c.name + " -> " + c.out);
    }
    fs.writeFileSync(path.join(results, f.replace(/\.json$/, ".done")), "done");
  }
  await sleep(2000);
}
