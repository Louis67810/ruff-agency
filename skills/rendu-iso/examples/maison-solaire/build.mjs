// Maison solaire: panels on the roof → inverter on the wall → the house and an EV charger.
// node build.mjs [--out <dir>]  writes maison-solaire.html (page) and maison-solaire.embed.html (fragment).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../kit/iso-kit.mjs";
import * as R from "../../kit/rendu.mjs";
import * as E from "../../kit/elec.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = process.argv.includes("--out") ? resolve(process.argv[process.argv.indexOf("--out") + 1]) : HERE;
const ID = "maison-solaire";
R.scope(ID);

const WIDTH = 1200, HEIGHT = 760;

// ---- world (1 unit ≈ 6 cm) -------------------------------------------------
const PLINTH = { x: -122, y: -100, w: 210, d: 236, r: 2 };   // x -122..88, y -100..136
const PLINTH_H = 4;
const G0 = PLINTH_H;                                        // ground floor level
const MAIN = { x: -92, y: -82, w: 172, d: 172, r: 0.6 };      // x -92..80, y -82..90
const MX = MAIN.x + MAIN.w, MY = MAIN.y + MAIN.d;           // visible walls: x = 80, y = 90
const ROOF = G0 + 150;
const PARA = 4, PARA_H = 6;
const FLOOR = G0 + 76;
const ANNEX = { x: -150, y: 4, w: 58, d: 100, r: 0.6 };       // x -150..-92, y 4..104
const ANNEX_H = 96;
const DRIVE = { x: 92, y: -96, w: 64, d: 176, r: 2 };
const CAR = { x: 104, y: -44 };
const CHARGER = [140, -76];
const STEPS = [
  { label: "Produire", text: "Les panneaux captent le soleil", hold: 3400 },
  { label: "Convertir", text: "L'onduleur fournit du 230 V", hold: 3400 },
  { label: "Utiliser", text: "La maison et la voiture consomment", hold: 4800 },
];

const P = k.fitProjection(
  [...k.boxCorners(PLINTH, 0, 0), ...k.boxCorners(DRIVE, 0, 0), ...k.boxCorners(MAIN, 0, ROOF + 22), ...k.boxCorners(ANNEX, 0, ANNEX_H), [CHARGER[0] + 8, CHARGER[1], 0], [CAR.x + 40, CAR.y + 100, 0]],
  WIDTH, HEIGHT, { pad: 46, azimuth: 45 },
);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const at = (p) => k.iso(p, P);
const poly = (pts, closed = true) => R.poly3(pts, P, closed);

// ---- ground ----------------------------------------------------------------
function ground() {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(PLINTH, -6), 0, 0.1, P)}" style="opacity:.2;filter:blur(18px)"/>`);
  out.push(S(k.slabOf(DRIVE, 0, 1, P, 3), { tone: "lo", crease: "none" }));
  // driveway joints
  const j = [];
  for (let y = DRIVE.y + 22; y < DRIVE.y + DRIVE.d; y += 22) j.push(k.lineOnTop([DRIVE.x + 1, y], [DRIVE.x + DRIVE.w - 1, y], 1, P));
  out.push(L(j.join(""), { tone: "faint" }));
  out.push(S(k.slabOf(PLINTH, 0, PLINTH_H, P, 3, 0.6), { tone: "mid" }));
  // terrace boards in front of the glazing
  const boards = [];
  for (let x = MAIN.x + 6; x < MX; x += 7) boards.push(k.lineOnTop([x, MY + 1], [x, PLINTH.y + PLINTH.d - 1], PLINTH_H, P));
  out.push(L(boards.join(""), { tone: "faint" }));
  out.push(L(k.lineOnTop([MAIN.x, MY + 1], [MX, MY + 1], PLINTH_H, P), { tone: "lo" }));
  // garden strip at the front corner: three small shrubs
  for (const [x, y, r] of [[-104, 126, 5], [-92, 128, 3.6], [-112, 116, 3]]) {
    out.push(S(G0ball(x, y, r), { tone: "mid", crease: "none" }));
  }
  return out.join("");
}
import * as Gl from "../../kit/lathe.mjs";
const G0ball = (x, y, r) => Gl.sphereOf([x, y, PLINTH_H + r * 0.8], r, P);

// ---- annex (far left volume) -----------------------------------------------
function annex() {
  const out = [];
  const AX = ANNEX.x + ANNEX.w, AY = ANNEX.y + ANNEX.d;
  out.push(S(k.slabOf(ANNEX, G0, ANNEX_H, P, 2, 0.5), { tone: "mid" }));
  out.push(S(k.slabOf(k.insetPlan(ANNEX, -1.2), G0 + ANNEX_H, 2.2, P, 2), { tone: "mid" }));
  // window on its y face, a slot window
  out.push(R.windowSvg("y", AY, ANNEX.x + 12, ANNEX.x + 42, G0 + 30, G0 + 78, P, { mullions: [ANNEX.x + 27], depth: 3 }));
  // cladding joints
  out.push(E.faceLines("y", AY, [[ANNEX.x, G0 + 18, AX, G0 + 18]], P));
  return out.join("");
}

// ---- interior seen through the ground floor glazing ----------------------------
function interior() {
  // Seen through a y-face opening, a point (x, y) lines up with the wall point x0 = x - y + MY,
  // so the room is laid out to the left of the opening and kept shallow (back wall at BACK).
  const BACK = MY - 42, LEFT = MAIN.x + 4;
  const out = [];
  out.push(`<path d="${poly([[LEFT, BACK, G0], [MX - 4, BACK, G0], [MX - 4, MY, G0], [LEFT, MY, G0]])}" fill="var(--anatomy-shade-3)"/>`);
  out.push(`<path d="${poly([[LEFT, BACK, G0], [LEFT, MY, G0], [LEFT, MY, FLOOR], [LEFT, BACK, FLOOR]])}" fill="var(--anatomy-shade-2)"/>`);
  out.push(`<path d="${poly([[LEFT, BACK, G0], [MX - 4, BACK, G0], [MX - 4, BACK, FLOOR], [LEFT, BACK, FLOOR]])}" fill="var(--anatomy-face)"/>`);
  out.push(L(poly([[LEFT, MY, G0], [LEFT, BACK, G0], [MX - 4, BACK, G0]], false) + poly([[LEFT, BACK, G0], [LEFT, BACK, FLOOR]], false), { tone: "faint" }));
  // floor boards
  const boards = [];
  for (let x = LEFT + 8; x < MX - 4; x += 8) boards.push(k.lineOnTop([x, BACK], [x, MY], G0, P));
  out.push(L(boards.join(""), { tone: "faint" }));
  // on the back wall: a framed print over a sideboard; on the side wall: a socket that lights
  out.push(E.faceRect("y", BACK + 0.2, -38, -14, G0 + 38, G0 + 56, P, { fill: "var(--anatomy-shade-2)", tone: "lo" }));
  out.push(E.sideboard(-44, BACK, G0, 34, 7, 14, P));
  out.push(E.chair(-14, BACK + 14, G0, P));
  out.push(E.chair(-2, BACK + 14, G0, P));
  out.push(E.table(-18, BACK + 22, G0, 26, 14, 18, P));
  out.push(E.floorLamp(LEFT + 10, BACK + 12, G0, P, { step: 2, delay: 0.3, height: 34 }));
  // pendant over the table
  const PX = -5, PY = BACK + 29;
  out.push(L(poly([[PX, PY, FLOOR], [PX, PY, G0 + 50]], false), { tone: "mid" }));
  const F = Gl.frameOf([PX, PY, G0 + 44], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  out.push(R.poolSvg([PX, PY, G0 + 18], 18, P, { step: 2, delay: 0.5 }));
  out.push(S(Gl.lathe([[0, 5], [6, 1.4], [6, 0.01]], F, P), { tone: "mid" }));
  const [lx, ly] = at([PX, PY, G0 + 44]);
  out.push(R.litSvg(`<ellipse cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" rx="${(14 * k.cameraOf(P).k).toFixed(1)}" ry="${(10 * k.cameraOf(P).k).toFixed(1)}" fill="url(#${ID}-pool)"/>`, 2, { delay: 0.5 }));
  return out.join("");
}

function upstairs() {
  const out = [];
  out.push(`<path d="${poly([[MAIN.x + 4, MAIN.y + 80, FLOOR + 2], [MX - 4, MAIN.y + 80, FLOOR + 2], [MX - 4, MY, FLOOR + 2], [MAIN.x + 4, MY, FLOOR + 2]])}" fill="var(--anatomy-shade-3)"/>`);
  out.push(`<path d="${poly([[MAIN.x + 4, MAIN.y + 80, FLOOR + 2], [MX - 4, MAIN.y + 80, FLOOR + 2], [MX - 4, MAIN.y + 80, ROOF], [MAIN.x + 4, MAIN.y + 80, ROOF]])}" fill="var(--anatomy-face)"/>`);
  out.push(E.sideboard(-74, MAIN.y + 80, FLOOR + 2, 26, 10, 30, P));
  out.push(R.wallGlowSvg("y", MAIN.y + 80.2, -40, FLOOR + 40, 26, P, { step: 2, delay: 0.8 }));
  return out.join("");
}

// ---- main volume -----------------------------------------------------------
function house() {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(MAIN, G0, 2, P)}"/>`);
  out.push(S(k.slabOf(MAIN, G0, ROOF - G0, P, 2, 0.5), { tone: "mid" }));
  // floor band on both visible faces
  out.push(E.faceLines("y", MY, [[MAIN.x, FLOOR, MX, FLOOR], [MAIN.x, FLOOR + 3, MX, FLOOR + 3]], P, { tone: "faint" }));
  out.push(E.faceLines("x", MX, [[MAIN.y, FLOOR, MY, FLOOR], [MAIN.y, FLOOR + 3, MY, FLOOR + 3]], P, { tone: "faint" }));
  // y face: ground floor glazing with the room behind, upper picture window
  out.push(R.windowSvg("y", MY, MAIN.x + 30, MX - 12, G0 + 2, FLOOR - 4, P, { depth: 4, mullions: [MAIN.x + 72, MAIN.x + 114], inside: interior(), sill: false }));
  out.push(R.windowSvg("y", MY, MAIN.x + 12, MAIN.x + 92, FLOOR + 14, ROOF - 18, P, { depth: 4, mullions: [MAIN.x + 52], inside: upstairs() }));
  // a picture frame (projecting box) around the upper window
  out.push(frameBox());
  // canopy over the ground glazing
  const canopy = { x: MAIN.x + 24, y: MY, w: MX - MAIN.x - 18, d: 16, r: 0.4 };
  out.push(S(k.slabOf(canopy, FLOOR - 4, 3, P, 2, 0.4), { tone: "mid" }));
  // slim column at the glazing's left
  out.push(S(k.slabOf({ x: MAIN.x + 24, y: MY + 12, w: 3, d: 3, r: 0.3 }, G0, FLOOR - 4 - G0, P, 1), { tone: "mid" }));
  // x face: tall slot window upstairs, small window downstairs, downpipe
  out.push(R.windowSvg("x", MX, MAIN.y + 104, MAIN.y + 150, FLOOR + 20, ROOF - 22, P, { depth: 4, mullions: [MAIN.y + 127] }));
  out.push(R.windowSvg("x", MX, MAIN.y + 118, MAIN.y + 160, G0 + 30, FLOOR - 16, P, { depth: 4 }));
  out.push(S(k.cylinder(MX + 1.6, MAIN.y + 166, 1.3, G0, ROOF - G0 - 2, P, 14), { tone: "mid", crease: "none" }));
  out.push(D([G0 + 30, G0 + 80, G0 + 130].map((z) => at([MX + 1.6, MAIN.y + 166 + 1.3, z])), { size: 0.5, tone: "mid" }));
  // outdoor wall lights beside the glazing (they glow at step 2)
  for (const y of [MAIN.y + 100]) {
    out.push(S(k.slabOf({ x: MX, y: y - 1.6, w: 2, d: 3.2, r: 0.6 }, G0 + 58, 5, P, 2), { tone: "hi" }));
    out.push(R.wallGlowSvg("x", MX + 0.1, y, G0 + 58, 14, P, { step: 2, delay: 0.9 }));
  }
  return out.join("");
}

function frameBox() {
  const out = [];
  const x0 = MAIN.x + 6, x1 = MAIN.x + 98, z0 = FLOOR + 8, z1 = ROOF - 12, t = 4, dep = 8;
  // four bars of a projecting frame, drawn far to near: top, left, right, bottom
  out.push(S(k.slabOf({ x: x0, y: MY, w: x1 - x0, d: dep, r: 0.3 }, z1 - t, t, P, 1), { tone: "mid" }));
  out.push(S(k.slabOf({ x: x0, y: MY, w: t, d: dep, r: 0.3 }, z0, z1 - z0 - t, P, 1), { tone: "mid" }));
  out.push(S(k.slabOf({ x: x1 - t, y: MY, w: t, d: dep, r: 0.3 }, z0, z1 - z0 - t, P, 1), { tone: "mid" }));
  out.push(S(k.slabOf({ x: x0, y: MY, w: x1 - x0, d: dep, r: 0.3 }, z0, t, P, 1), { tone: "mid" }));
  return out.join("");
}

// ---- roof: parapets, panels, vents ------------------------------------------
const PANEL = { w: 46, d: 26 };
const PANELS = [];
for (const y of [MAIN.y + 14, MAIN.y + 52]) for (const x of [MAIN.x + 14, MAIN.x + 64, MAIN.x + 114]) PANELS.push({ x, y, ...PANEL });

let PANEL_PORTS = [];
function roofBack() {
  const out = [];
  // far parapets (x = MAIN.x side, y = MAIN.y side)
  out.push(S(k.slabOf({ x: MAIN.x, y: MAIN.y, w: PARA, d: MAIN.d, r: 0.3 }, ROOF, PARA_H, P, 1), { tone: "mid" }));
  out.push(S(k.slabOf({ x: MAIN.x, y: MAIN.y, w: MAIN.w, d: PARA, r: 0.3 }, ROOF, PARA_H, P, 1), { tone: "mid" }));
  // deck joints
  const j = [];
  for (let x = MAIN.x + 20; x < MX; x += 24) j.push(k.lineOnTop([x, MAIN.y + PARA], [x, MY - PARA], ROOF, P));
  out.push(L(j.join(""), { tone: "faint" }));
  // roof hatch and two vents near the front
  out.push(S(k.slabOf({ x: MAIN.x + 18, y: MAIN.y + 104, w: 20, d: 20, r: 1 }, ROOF, 5, P, 2, 0.5), { tone: "mid" }));
  out.push(S(k.slabOf({ x: MAIN.x + 20, y: MAIN.y + 106, w: 16, d: 16, r: 0.6 }, ROOF + 5, 1.2, P, 2), { tone: "hi" }));
  for (const [x, y] of [[MAIN.x + 60, MAIN.y + 120], [MAIN.x + 72, MAIN.y + 132]]) {
    out.push(S(k.cylinder(x, y, 2, ROOF, 8, P, 18), { tone: "mid" }));
    out.push(S(k.cylinder(x, y, 3, ROOF + 8, 1.6, P, 22), { tone: "mid" }));
  }
  // panels, back row, then the string cable on the deck between the rows, then the front row
  const RUN_Y = MAIN.y + 46;
  const row = (y) => PANELS.filter((p) => p.y === y).sort((a, b) => k.depthOf([a.x, a.y, 0], P) - k.depthOf([b.x, b.y, 0], P));
  let i = 0;
  for (const plan of row(MAIN.y + 14)) out.push(E.solarPanel(plan, ROOF + 6, ROOF, P, { step: 0, delay: 0.1 + i++ * 0.12, cols: 6, rows: 4 }).svg);
  for (const plan of PANELS) {
    const from = plan.y === MAIN.y + 14 ? plan.y + plan.d - 1 : plan.y + 3;
    out.push(R.energySvg([[plan.x + plan.w - 6, from, ROOF + 0.6], [plan.x + plan.w - 6, RUN_Y, ROOF + 0.6]], P, { step: 0, delay: 0.3, dur: 0.45, width: 0.9, radius: 0, ends: "from" }));
  }
  out.push(R.energySvg([[MAIN.x + 14 + 40, RUN_Y, ROOF + 0.6], [MX - PARA - 0.5, RUN_Y, ROOF + 0.6]], P, { step: 0, delay: 0.7, dur: 1.1, width: 1.5, radius: 0, ends: "from" }));
  for (const plan of row(MAIN.y + 52)) out.push(E.solarPanel(plan, ROOF + 6, ROOF, P, { step: 0, delay: 0.1 + i++ * 0.12, cols: 6, rows: 4 }).svg);
  return out.join("");
}
function roofFront() {
  const out = [];
  out.push(S(k.slabOf({ x: MX - PARA, y: MAIN.y, w: PARA, d: MAIN.d, r: 0.3 }, ROOF, PARA_H, P, 1), { tone: "mid" }));
  out.push(S(k.slabOf({ x: MAIN.x, y: MY - PARA, w: MAIN.w, d: PARA, r: 0.3 }, ROOF, PARA_H, P, 1), { tone: "mid" }));
  // coping line
  out.push(L(k.planOutline(k.insetPlan(MAIN, -0.6), ROOF + PARA_H, P, 1), { tone: "mid" }));
  return out.join("");
}

// ---- energy -----------------------------------------------------------------
const INV_Y = MAIN.y + 30, INV_W = 24;
const inverter = () => E.wallBox(MX, INV_Y, INV_W, G0 + 64, 34, P, { step: 1, delay: 0.2, label: "" });
const acBox = () => E.wallBox(MX, INV_Y + 4, 16, G0 + 36, 16, P, { step: 1, delay: 0.9, screen: false, vents: false, depth: 5 });

function energy(inv, ac, charger, theCar) {
  const out = [];
  const zTop = ROOF + PARA_H;
  // the string cable leaves the deck over the parapet and runs down the x face into the inverter
  const RUN_Y = MAIN.y + 46;
  out.push(R.energySvg([[MX - PARA - 0.5, RUN_Y, zTop + 0.9], [MX + 1.4, RUN_Y, zTop + 0.9], [MX + 1.4, RUN_Y, inv.top[2] + 7], [MX + 3, INV_Y + INV_W / 2, inv.top[2] + 7], [MX + 3, INV_Y + INV_W / 2, inv.top[2]]], P, { step: 0, delay: 1.75, dur: 1.4, width: 1.5, radius: 4, ends: "to" }));
  return out.join("");
}
function energyBelow(inv, ac, charger) {
  const out = [];
  // inverter → AC box (short) → into the house
  out.push(R.energySvg([inv.bottom, ac.top], P, { step: 1, delay: 0.4, dur: 0.5, width: 1.3, radius: 0, ends: "none" }));
  // AC box → down the wall → along the foot of the wall → across the drive → charger
  const foot = 1.4;
  out.push(R.energySvg([ac.bottom, [ac.bottom[0], ac.bottom[1], G0 + foot], [ac.bottom[0], CHARGER[1] + 30, G0 + foot], [ac.bottom[0], CHARGER[1] + 30, 1.4], [CHARGER[0], CHARGER[1] + 30, 1.4], [CHARGER[0], CHARGER[1], 1.4]], P, { step: 1, delay: 1.0, dur: 1.8, width: 1.4, radius: 5, ends: "from" }));
  return out.join("");
}

// ---- assemble ---------------------------------------------------------------
const inv = inverter();
const ac = acBox();
const charger = E.evCharger(CHARGER[0], CHARGER[1], 1, P, { step: 2, delay: 0 });
const theCar = E.car(CAR.x, CAR.y, 1, P, { step: 2, delay: 0.6 });
const plug = [charger.socket, [charger.socket[0] + 4, charger.socket[1] + 6, 10], [theCar.port[0] + 3, theCar.port[1] - 6, 6], [theCar.port[0] + 1, theCar.port[1] - 1, theCar.port[2] - 1], theCar.port];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: "Maison individuelle en isométrie : des panneaux solaires sur le toit alimentent un onduleur fixé au mur, qui distribue l'électricité dans la maison et vers une borne de recharge où une voiture électrique se charge.",
  body: [
    R.defsSvg(),
    ground(),
    annex(),
    house(),
    roofBack(),
    roofFront(),
    energy(inv, ac, charger, theCar),
    ac.svg,
    inv.svg,
    energyBelow(inv, ac, charger),
    charger.svg,
    theCar.svg,
    R.energySvg(plug, P, { step: 2, delay: 0.2, dur: 1.2, width: 1.5, radius: 3, ends: "none" }),
  ],
});

const render = R.renderHtml({ id: ID, svg, steps: STEPS, title: "L'énergie, du toit aux usages." });
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, `${ID}.embed.html`), render);
writeFileSync(join(OUT, `${ID}.html`), R.pageHtml({ title: "Maison solaire", render }));
console.log("wrote", join(OUT, `${ID}.html`), `(${(render.length / 1024).toFixed(0)} KB)`);
