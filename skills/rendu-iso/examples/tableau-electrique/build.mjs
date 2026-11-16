// Tableau électrique: a technical room cut away at the corner. The grid arrives at the meter,
// the switchboard protects each circuit (levers flip one by one), then the circuits feed
// sockets, lighting, a heat-pump indoor unit and a water heater.
// node build.mjs [--out <dir>]
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../kit/iso-kit.mjs";
import * as G from "../../kit/lathe.mjs";
import * as R from "../../kit/rendu.mjs";
import * as E from "../../kit/elec.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = process.argv.includes("--out") ? resolve(process.argv[process.argv.indexOf("--out") + 1]) : HERE;
const ID = "tableau-electrique";
R.scope(ID);

const WIDTH = 1200, HEIGHT = 760;

// ---- world (1 unit ≈ 1 cm) --------------------------------------------------
const T = 8;                       // wall thickness
const WX = -120, WY = -100;        // inner wall planes: x = WX (faces +x), y = WY (faces +y)
const FLOOR = { x: WX - T, y: WY - T, w: 200, d: 156, r: 2 };  // x -128..72, y -108..48
const WALL_H = 150;
const CAB = { x0: -44, x1: 24, z0: 46, z1: 124, depth: 11 };   // switchboard on the y wall
const ROWS = [108, 86, 64];
const STEPS = [
  { label: "Raccorder", text: "Le réseau arrive au compteur", hold: 3200 },
  { label: "Protéger", text: "Le tableau sécurise chaque circuit", hold: 3800 },
  { label: "Distribuer", text: "Prises, éclairage, chauffage, eau chaude", hold: 5200 },
];

const P = k.fitProjection([...k.boxCorners(FLOOR, -6, 0), ...k.boxCorners({ x: WX - T, y: WY - T, w: 200, d: 156 }, 0, WALL_H)], WIDTH, HEIGHT, { pad: 40, azimuth: 45 });
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const at = (p) => k.iso(p, P);
const poly = (pts, closed = true) => R.poly3(pts, P, closed);

// ---- room shell --------------------------------------------------------------
function shell() {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(FLOOR, -8), -6, 0.1, P)}" style="opacity:.22;filter:blur(18px)"/>`);
  out.push(S(k.slabOf(FLOOR, -6, 6, P, 3, 0.6), { tone: "mid" }));
  // floor tiles
  const tiles = [];
  for (let x = WX + 30; x < FLOOR.x + FLOOR.w; x += 30) tiles.push(k.lineOnTop([x, WY], [x, FLOOR.y + FLOOR.d - 1], 0, P));
  for (let y = WY + 30; y < FLOOR.y + FLOOR.d; y += 30) tiles.push(k.lineOnTop([WX, y], [FLOOR.x + FLOOR.w - 1, y], 0, P));
  out.push(L(tiles.join(""), { tone: "faint" }));
  // walls, cut flat on top so the section reads
  out.push(S(k.slabOf({ x: WX - T, y: WY - T, w: T, d: FLOOR.d, r: 0.3 }, 0, WALL_H, P, 1), { tone: "mid" }));
  out.push(S(k.slabOf({ x: WX - T, y: WY - T, w: FLOOR.w, d: T, r: 0.3 }, 0, WALL_H, P, 1), { tone: "mid" }));
  // skirting along both walls
  out.push(S(k.slabOf({ x: WX, y: WY, w: 1, d: FLOOR.d - T, r: 0.2 }, 0, 6, P, 1), { tone: "mid", crease: "none" }));
  out.push(S(k.slabOf({ x: WX, y: WY, w: FLOOR.w - T, d: 1, r: 0.2 }, 0, 6, P, 1), { tone: "mid", crease: "none" }));
  // section hatching on the cut wall tops
  const hatch = [];
  for (let y = WY - T + 6; y < FLOOR.y + FLOOR.d; y += 6) hatch.push(k.lineOnTop([WX - T + 0.6, y], [WX - 0.6, y - 4], WALL_H, P));
  for (let x = WX + 2; x < FLOOR.x + FLOOR.w; x += 6) hatch.push(k.lineOnTop([x, WY - 0.6], [x + 4, WY - T + 0.6], WALL_H, P));
  out.push(L(hatch.join(""), { tone: "faint" }));
  return out.join("");
}

// ---- switchboard on the y wall ------------------------------------------------
function cabinet() {
  const out = [];
  const { x0, x1, z0, z1, depth } = CAB;
  const F = WY + depth;
  out.push(`<path class="iso-halo" d="${k.slabOf({ x: x0, y: WY, w: x1 - x0, d: depth, r: 1 }, z0 - 3, z1 - z0, P).fill}" style="filter:blur(8px);opacity:.2"/>`);
  // back plate
  out.push(`<path d="${poly(R.quad("y", WY + 0.3, x0, x1, z0, z1))}" fill="var(--anatomy-shade-3)"/>`);
  // shell: left, bottom (inner sides visible), then rows, then top and right
  out.push(S(k.slabOf({ x: x0, y: WY, w: 1.6, d: depth, r: 0.3 }, z0, z1 - z0, P, 1), { tone: "mid" }));
  out.push(S(k.slabOf({ x: x0, y: WY, w: x1 - x0, d: depth, r: 0.3 }, z0, 1.6, P, 1), { tone: "mid" }));
  const rows = [];
  ROWS.slice().reverse().forEach((zc, i) => {
    const count = i === 2 ? 14 : 15;
    const row = E.breakerRow(x0 + 4, WY + 0.4, zc, count, P, { step: 1, delay: 0.5 + i * 0.9, stagger: 0.055, main: 2, depth: 6.4 });
    out.push(row.svg);
    // cover strip (plastron) above the row with its label lines
    const strip = { x: x0 + 1.6, y: F - 2.4, w: x1 - x0 - 3.2, d: 1.2, r: 0.2 };
    out.push(S(k.slabOf(strip, zc + 7.6, 6.6, P, 1), { tone: "mid", crease: "none" }));
    const labels = [];
    for (let m = 0; m < count; m += 1) {
      const lx = x0 + 4 + 3.6 * (m + (m > 0 ? 1 : 0)) + 0.6;
      labels.push(poly([[lx, F - 1.18, zc + 11.4], [lx + 2.2, F - 1.18, zc + 11.4]], false));
    }
    out.push(L(labels.join(""), { tone: "lo", free: true }));
    rows.push(row);
  });
  // cable glands on top of the cabinet
  out.push(S(k.slabOf({ x: x0, y: WY, w: x1 - x0, d: depth, r: 0.3 }, z1 - 1.6, 1.6, P, 1), { tone: "mid" }));
  for (let i = 0; i < 5; i++) out.push(S(k.cylinder(x0 + 10 + i * 9, WY + 4.5, 1.8, z1, 2, P, 14), { tone: "mid" }));
  out.push(S(k.slabOf({ x: x1 - 1.6, y: WY, w: 1.6, d: depth, r: 0.3 }, z0, z1 - z0, P, 1), { tone: "mid" }));
  out.push(D([[x0 + 0.8, F, z1 - 3], [x1 - 0.8, F, z1 - 3], [x0 + 0.8, F, z0 + 3], [x1 - 0.8, F, z0 + 3]].map(at), { size: 0.45, tone: "mid" }));
  return out.join("");
}

// The cabinet door, open at 120°, hinged on the left edge, with the circuit chart on its inside.
function door() {
  const out = [];
  const H = [CAB.x0 - 0.8, WY + CAB.depth];
  const a = (122 * Math.PI) / 180;               // from +x toward +y
  const dir = [Math.cos(a), Math.sin(a)];
  const n = [dir[1], -dir[0]];                    // toward the inside face (+x side)
  const len = CAB.x1 - CAB.x0, th = 1.4;
  const ring = [H, [H[0] + dir[0] * len, H[1] + dir[1] * len], [H[0] + dir[0] * len - n[0] * th, H[1] + dir[1] * len - n[1] * th], [H[0] - n[0] * th, H[1] - n[1] * th]];
  out.push(S(k.extrude(ring, CAB.z0, CAB.z1 - CAB.z0, P, { convex: true }), { tone: "mid" }));
  // the chart: a sheet on the inside face with rule lines (printed text, so lines may stop)
  const on = (t, z) => [H[0] + dir[0] * t + n[0] * 0.05, H[1] + dir[1] * t + n[1] * 0.05, z];
  out.push(`<path d="${poly([on(8, CAB.z0 + 12), on(len - 8, CAB.z0 + 12), on(len - 8, CAB.z1 - 10), on(8, CAB.z1 - 10)])}" fill="var(--anatomy-face)"/>`);
  out.push(L(poly([on(8, CAB.z0 + 12), on(len - 8, CAB.z0 + 12), on(len - 8, CAB.z1 - 10), on(8, CAB.z1 - 10)]), { tone: "lo" }));
  const rules = [];
  for (let i = 0; i < 9; i++) {
    const z = CAB.z1 - 16 - i * 5.6;
    rules.push(poly([on(12, z), on(12 + (i % 3 === 0 ? 30 : 22 + ((i * 7) % 12)), z)], false));
  }
  out.push(L(rules.join(""), { tone: "lo", free: true }));
  out.push(L(poly([on(len - 18, CAB.z1 - 16), on(len - 18, CAB.z0 + 18)], false) + [0, 1, 2, 3].map((i) => poly([on(len - 18, CAB.z1 - 20 - i * 11), on(len - 13, CAB.z1 - 20 - i * 11)], false)).join(""), { tone: "mid" }));
  // handle on the outer edge
  out.push(S(k.slabOf({ x: H[0] + dir[0] * (len - 3) - 0.8, y: H[1] + dir[1] * (len - 3) - 0.8, w: 1.6, d: 1.6, r: 0.6 }, (CAB.z0 + CAB.z1) / 2 - 6, 12, P, 2), { tone: "mid" }));
  // hinges
  for (const z of [CAB.z0 + 8, CAB.z1 - 8]) out.push(S(k.cylinder(H[0], H[1], 1.1, z - 3, 6, P, 12), { tone: "mid", crease: "none" }));
  return out.join("");
}

// ---- meter and incoming breaker -------------------------------------------------
const METER = { a0: 36, width: 24, z0: 88, height: 34 };
const AGCP = { a0: 39, width: 18, z0: 62, height: 18 };
function meter() {
  const box = E.wallBox(WY, METER.a0, METER.width, METER.z0, METER.height, P, { face: "y", depth: 9, step: 0, delay: 1.0, vents: false, trace: false });
  const out = [box.svg];
  // digits on the meter's display (lit)
  const FY = WY + 9;
  const digits = [];
  for (let i = 0; i < 5; i++) {
    const x = METER.a0 + 7.6 + i * 2;
    digits.push(poly([[x, FY + 0.1, 112.6], [x + 1.2, FY + 0.1, 112.6], [x + 1.2, FY + 0.1, 110.4], [x, FY + 0.1, 110.4]], true));
  }
  out.push(R.litSvg(L(digits.join(""), { tone: "blue" }), 0, { delay: 1.2 }));
  // two buttons under the display, terminal cover at the bottom
  out.push(D([[METER.a0 + 9, FY, 103], [METER.a0 + 15, FY, 103]].map(at), { size: 1, tone: "mid" }));
  out.push(E.faceRect("y", FY, METER.a0 + 2, METER.a0 + METER.width - 2, METER.z0 + 1.5, METER.z0 + 9, P, { tone: "lo" }));
  const ag = E.wallBox(WY, AGCP.a0, AGCP.width, AGCP.z0, AGCP.height, P, { face: "y", depth: 7, step: 0, delay: 2.2, screen: false, vents: false });
  out.push(ag.svg);
  const lever = S(k.slabOf({ x: AGCP.a0 + 7, y: WY + 7, w: 4, d: 2.2, r: 0.4 }, AGCP.z0 + 6, 3, P, 2), { tone: "hi" });
  out.push(`<path d="${poly(R.quad("y", WY + 7.02, AGCP.a0 + 6.4, AGCP.a0 + 11.6, AGCP.z0 + 5, AGCP.z0 + 13.5))}" fill="var(--anatomy-shade-0)"/>`);
  out.push(R.moveSvg(lever, 0, [0, 0, 4], P, { delay: 2.2 }));
  out.push(R.ledSvg([AGCP.a0 + 14.5, WY + 7, AGCP.z0 + 14], P, { step: 0, delay: 2.3, size: 0.6 }));
  return { svg: out.join(""), meterBottom: [METER.a0 + METER.width / 2, WY + 4.5, METER.z0], agTop: [AGCP.a0 + AGCP.width / 2, WY + 3.5, AGCP.z0 + AGCP.height], agSide: [AGCP.a0, WY + 3.5, AGCP.z0 + 9] };
}

// ---- x wall: indoor unit, lamp, switch, sockets ------------------------------------
const SPLIT = { a0: -66, z0: 112 };
function xWall() {
  const out = [];
  const split = E.splitUnit(WX, SPLIT.a0, SPLIT.z0, P, { step: 2, delay: 1.3 });
  out.push(split.svg);
  const lamp = E.wallLamp("x", WX, 18, 112, P, { step: 2, delay: 1.0 });
  out.push(lamp.svg);
  out.push(E.lightSwitch("x", WX, 18, 66, P, { step: 2, delay: 0.9 }));
  out.push(E.socket("x", WX, -18, 24, P, { step: 2, delay: 1.6, double: true }));
  out.push(E.socket("x", WX, 34, 24, P, { step: 2, delay: 1.8 }));
  return { svg: out.join(""), split, lamp };
}

// ---- energy routes ---------------------------------------------------------
const C = (x, z) => [x, WY + 1.2, z];            // a point on the y wall's conduit plane
const Cx = (y, z) => [WX + 1.2, y, z];            // a point on the x wall's conduit plane
function gridFeed(m) {
  // the supply comes up through a floor sleeve under the meter
  const out = [];
  const sx = METER.a0 + METER.width / 2;
  out.push(S(k.cylinder(sx, WY + 6, 3.4, 0, 1.4, P, 20), { tone: "mid" }));
  out.push(R.energySvg([[sx, WY + 6, 1.4], [sx, WY + 6, 6], [sx, WY + 1.2, 10], C(sx, AGCP.z0)], P, { step: 0, delay: 0.1, dur: 0.9, width: 1.8, radius: 3, ends: "from" }));
  out.push(R.energySvg([m.agTop, m.meterBottom], P, { step: 0, delay: 0.9, dur: 0.4, width: 1.8, radius: 0, ends: "none" }));
  return out.join("");
}
function feeder(m) {
  // incoming breaker → switchboard main switch, along the wall at the cabinet's mid height
  return R.energySvg([m.agSide, C(AGCP.a0 - 4, AGCP.z0 + 9), C(AGCP.a0 - 4, 96), [CAB.x1 + 0.2, WY + 5, 96]], P, { step: 1, delay: 0, dur: 0.6, width: 1.8, radius: 3, ends: "none" });
}
function circuits(xw) {
  const out = [];
  const top = CAB.z1 + 2;
  const lane = (i) => 132 + i * 3.2;               // trunk lanes above the cabinet
  const go = (i, x0, tail, opts) => R.energySvg([[x0, WY + 4.5, top], C(x0, lane(i)), C(WX + 1.2, lane(i)), Cx(WY + 1.2, lane(i)), ...tail], P, { step: 2, width: 1.15, radius: 3, ends: "to", ...opts });
  // 0: indoor unit
  out.push(go(0, CAB.x0 + 10, [Cx(SPLIT.a0 + 56, lane(0)), Cx(SPLIT.a0 + 56, SPLIT.z0 + 18)], { delay: 0.1, dur: 1.2 }));
  // 1: lamp and switch
  out.push(go(1, CAB.x0 + 19, [Cx(18, lane(1)), Cx(18, 115.5)], { delay: 0.2, dur: 1.4 }));
  out.push(R.energySvg([Cx(18, 108.5), Cx(18, 70)], P, { step: 2, delay: 0.7, dur: 0.5, width: 1, radius: 0, ends: "to" }));
  // 2: sockets
  out.push(go(2, CAB.x0 + 28, [Cx(2, lane(2)), Cx(2, 36), Cx(-18, 36), Cx(-18, 28)], { delay: 0.3, dur: 1.6 }));
  out.push(R.energySvg([Cx(2, 36), Cx(34, 36), Cx(34, 28)], P, { step: 2, delay: 1.2, dur: 0.6, width: 1.1, radius: 3, ends: "to" }));
  return out.join("");
}
const HEATER = [-96, -76];
function heaterFeed(h) {
  return R.energySvg([[CAB.x0 - 0.2, WY + 4.5, CAB.z0 + 6], C(CAB.x0 - 6, CAB.z0 + 6), C(HEATER[0], CAB.z0 + 6), [HEATER[0], WY + 1.2, h.top[2] + 4], [HEATER[0], HEATER[1] - 6, h.top[2] + 4], [HEATER[0], HEATER[1] - 6, h.top[2] - 0.4]], P, { step: 2, delay: 0.4, dur: 1.3, width: 1.15, radius: 3, ends: "to" });
}
function airflow(split) {
  const out = [];
  for (let i = 0; i < 4; i++) {
    const t = (i + 0.5) / 4;
    const o = split.outlet(t);
    out.push(R.energySvg([o, [o[0] + 10, o[1], o[2] - 9], [o[0] + 26, o[1], o[2] - 20]], P, { step: 2, delay: 1.6 + i * 0.1, dur: 0.9, width: 0.6, radius: 6, ends: "none", bed: false, speed: 0.9 }));
  }
  return out.join("");
}

// ---- on the floor: a cable drum and a toolbox ---------------------------------
function drum() {
  const out = [];
  const [cx, cy, r, half] = [20, 6, 15, 9];
  const F = G.frameOf([cx, cy - half, r], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: cx - r, y: cy - half - 2, w: 2 * r, d: 2 * half + 4, r: 4 }, 0, 0.1, P)}"/>`);
  out.push(S(G.disc(-2, 0, r, F, P), { tone: "mid" }));
  out.push(S(G.disc(0, 2 * half, r - 4, F, P), { tone: "mid", crease: "none" }));
  const coils = [];
  for (let s = 1.6; s < 2 * half; s += 1.8) coils.push(G.arcOf(F, s, r - 4, P));
  out.push(L(coils.join(""), { tone: "lo" }));
  out.push(S(G.disc(2 * half, 2 * half + 2, r, F, P), { tone: "mid" }));
  out.push(S(G.disc(2 * half + 2, 2 * half + 2.6, 3, F, P), { tone: "hi" }));
  out.push(D(G.dotsOf(F, 2 * half + 2, r - 2.4, 6, P, { all: true }), { size: 0.4, tone: "mid" }));
  return out.join("");
}
function toolbox() {
  const out = [];
  const b = { x: -16, y: -74, w: 30, d: 14, r: 1.2 };
  out.push(`<path class="iso-halo" d="${k.haloOf(b, 0, 0.1, P)}"/>`);
  out.push(S(k.slabOf(b, 0, 10, P, 3, 0.5), { tone: "hi", crease: "lo" }));
  out.push(S(k.slabOf(k.insetPlan(b, -0.4), 10, 3, P, 3, 0.5), { tone: "hi", crease: "lo" }));
  out.push(L(R.poly3([[b.x + 4, b.y + b.d + 0.4, 11.5], [b.x + b.w - 4, b.y + b.d + 0.4, 11.5]], P, false), { tone: "mid" }));
  out.push(S(k.slabOf({ x: b.x + 9, y: b.y + 6, w: 12, d: 2, r: 0.8 }, 13, 3, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: b.x + 9, y: b.y + b.d - 0.2, w: 3, d: 1, r: 0.3 }, 7.5, 3, P, 1), { tone: "mid" }));
  return out.join("");
}

// ---- assemble ---------------------------------------------------------------
const m = meter();
const xw = xWall();
const heater = E.waterHeater(HEATER[0], HEATER[1], 0, P, { step: 2, delay: 1.7 });

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: "Local technique en coupe isométrique : le réseau arrive au compteur et au disjoncteur de branchement, le tableau électrique protège chaque circuit, puis l'électricité alimente une unité de pompe à chaleur, une applique, des prises et un ballon d'eau chaude.",
  body: [
    R.defsSvg(),
    shell(),
    xw.svg,
    circuits(xw),
    gridFeed(m),
    m.svg,
    feeder(m),
    cabinet(),
    heaterFeed(heater),
    heater.svg,
    `<g>${R.energySvg([[HEATER[0], HEATER[1] - 6, heater.top[2] + 4], [HEATER[0], HEATER[1] - 6, heater.top[2] - 0.4]], P, { step: 2, delay: 1.6, dur: 0.2, width: 1.15, radius: 0, ends: "to" })}</g>`,
    airflow(xw.split),
    toolbox(),
    drum(),
  ],
});

const render = R.renderHtml({ id: ID, svg, steps: STEPS, title: "Une installation pensée de bout en bout." });
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, `${ID}.embed.html`), render);
writeFileSync(join(OUT, `${ID}.html`), R.pageHtml({ title: "Tableau électrique", render }));
console.log("wrote", join(OUT, `${ID}.html`), `(${(render.length / 1024).toFixed(0)} KB)`);
void G;
