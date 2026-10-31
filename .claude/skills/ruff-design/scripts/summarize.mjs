// Résumé compact d'un get_design_context : arbre indenté + styles référencés.
import fs from "node:fs";
const r = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const j = JSON.parse(r.result.content[0].text);
const st = j.globalVars?.styles || {};
const used = new Set();
const paint = (k) => {
  if (!k) return "";
  used.add(k);
  const v = st[k];
  if (!Array.isArray(v)) return k;
  return v.map((p) => p.type === "SOLID" ? p.color : p.type === "IMAGE" ? "IMG" : p.type.replace("GRADIENT_", "G") + "(" + (p.gradientStops || []).map((s) => s.color).join(">") + (p.cssAngle != null ? " " + p.cssAngle + "deg" : "") + ")").join("+");
};
const eff = (k) => {
  if (!k) return "";
  used.add(k);
  const v = st[k];
  if (!Array.isArray(v)) return k;
  const d = v[0];
  return `${k}[${v.length}x ${d.type === "DROP_SHADOW" ? "drop" : d.type} ${v.map((e) => e.color).join(",")}]`;
};
const out = [];
const walk = (n, d) => {
  const bits = [n.type, `"${(n.name || "").slice(0, 40)}"`, `${Math.round(n.x)},${Math.round(n.y)} ${Math.round(n.width)}x${Math.round(n.height)}`];
  if (n.rotation) bits.push("rot " + Math.round(n.rotation));
  if (n.cornerRadius) bits.push("r " + (+n.cornerRadius).toFixed(1));
  if (n.opacity != null && n.opacity < 1) bits.push("op " + n.opacity);
  if (n.fill) bits.push("fill " + paint(n.fill));
  if (n.stroke) bits.push("stroke " + paint(n.stroke) + (n.strokeWeight ? " w" + (+n.strokeWeight).toFixed(2) : "") + (n.dashPattern ? " dash" : ""));
  if (n.effect) bits.push("fx " + eff(n.effect));
  if (n.characters) bits.push("«" + n.characters.slice(0, 60) + "»");
  if (n.textStyle) { used.add(n.textStyle); const t = st[n.textStyle]; if (t) bits.push(`${t.fontFamily} ${t.fontStyle} ${t.fontSize}`); }
  if (n.layout) bits.push("layout " + JSON.stringify(n.layout).slice(0, 80));
  out.push("  ".repeat(d) + bits.join(" | "));
  for (const c of n.children || []) walk(c, d + 1);
};
for (const n of j.nodes || []) walk(n, 0);
console.log(out.join("\n"));
if (process.argv[3] === "fx") for (const k of used) if (k.startsWith("effect")) console.log(k, JSON.stringify(st[k]));
