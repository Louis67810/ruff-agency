"""Construit banque/index.html à partir de banque.json, catalogue-brut.json et tests/*.json.

Ajouter une référence = ajouter une entrée dans banque.json (ou exporter un nouveau groupe
avec catalogue.mjs), puis relancer ce script. Rien n'est codé en dur dans la page.
"""
import html
import json
import os
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "banque")
data = json.load(open(os.path.join(ROOT, "banque.json"), encoding="utf8"))
cat = json.load(open(os.path.join(ROOT, "catalogue-brut.json"), encoding="utf8"))
tests_dir = os.path.join(ROOT, "tests")
tests = [json.load(open(os.path.join(tests_dir, f), encoding="utf8")) for f in sorted(os.listdir(tests_dir)) if f.endswith(".json")] if os.path.isdir(tests_dir) else []

e = html.escape
groups = {g["id"]: g for g in cat["groups"]}
LABEL = {"regle": "Règle de Louis", "observation": "Observation", "proposition": "Proposition", "local": "Choix local", "ambigu": "Ambigu", "general": "Règle générale"}


def chips(kind):
    return "".join(f'<span class="chip {k}">{LABEL.get(k, k)}</span>' for k in kind.split("+"))


def note_list(notes):
    return "<ul class='notes'>" + "".join(f"<li>{chips(k)} {e(t)}</li>" for k, t in notes) + "</ul>"


def thumb(file, cap, sub=""):
    return f'<figure class="th"><a href="{e(file)}" target="_blank"><img loading="lazy" src="{e(file)}" alt="{e(cap)}"></a><figcaption><b>{e(cap)}</b>{f"<br><code>{e(sub)}</code>" if sub else ""}</figcaption></figure>'


sec = []
sec.append(f"""<section id="lire"><h2>Comment lire cette banque</h2>
<p>Chaque information porte un statut. Une règle de Louis prime sur un ancien post ; une observation reste à confirmer ; un choix local n'est pas un modèle. Les identifiants sont ceux du fichier Figwright du {e(data['version'].split(' ')[0])} : ils permettent de cloner le vrai composant au lieu de le redessiner.</p>
<ul class="notes">{''.join(f'<li>{chips(k)} {e(v)}</li>' for k, v in data['statuts'].items())}</ul>
<p class="muted">Un groupe Figma n'est pas forcément un carrousel : l'ordre ci-dessous est l'ordre gauche → droite des frames de 575 px de large, à vérifier avec le sens du contenu.</p></section>""")

h = ['<section id="familles"><h2>Familles de carrousels</h2>']
for f in data["familles"]:
    g = groups.get(f["groupe"])
    strip = "".join(thumb(s["file"], f"{s['order']}", s["id"]) for s in g["slides"]) if g else ""
    h.append(f"""<article class="fam" id="g-{e(f['groupe'].replace(':', '-'))}">
<header><h3>{e(f['titre'])}</h3><div class="meta"><span class="tag">{e(f['type'])}</span><span class="tag">thème {e(f['theme'])}</span><code>groupe {e(f['groupe'])}</code></div></header>
<p class="struct">{e(f['structure'])}</p>{note_list(f['notes'])}<div class="strip">{strip}</div></article>""")
h.append("</section>")
sec.append("".join(h))

sec.append('<section id="slides"><h2>Types de slides</h2><table><thead><tr><th>Type</th><th>Composition observée</th><th>Statut</th></tr></thead><tbody>'
           + "".join(f"<tr><td><b>{e(a)}</b></td><td>{e(b)}</td><td>{chips(c)}</td></tr>" for a, b, c in data["typesDeSlides"]) + "</tbody></table></section>")

sec.append('<section id="composants"><h2>Composants sources</h2><div class="grid">'
           + "".join(f'<div class="comp"><a href="composants/{e(f)}" target="_blank"><div class="cimg"><img loading="lazy" src="composants/{e(f)}" alt="{e(n)}"></div></a><h4>{e(n)}</h4><code>{e(i)}</code><p>{e(d)}</p>{chips(k)}</div>' for f, i, n, d, k in data["composants"])
           + "</div></section>")

singles = {s["id"]: s for s in cat["singles"]}
sec.append('<section id="unique"><h2>Posts à image unique</h2><p>Même style (cartouches, couleurs, signature), présentation différente : une seule image doit porter accroche + preuve + appel. Les familles ci-dessous sont des observations, pas une liste fermée.</p><div class="grid single">'
           + "".join(f'<div class="comp">{thumb(singles[i]["file"], n, f"{i} — {singles[i]["w"]}×{singles[i]["h"]}")}<p>{e(d)}</p></div>' for i, n, d in data["imageUnique"])
           + "</div></section>")

sec.append('<section id="transversal"><h2>Observations transversales</h2>' + note_list(data["observationsTransversales"]) + "</section>")

for t in tests:
    strip = "".join(thumb(s, f"{n + 1}") for n, s in enumerate(t["slides"]))
    sec.append(f"""<section id="test-{e(t['id'])}"><h2>Test : {e(t['titre'])}</h2><p>{e(t['statut'])}</p><div class="strip big">{strip}</div>
<h3>Décisions prises pour ce carrousel</h3>{note_list(t['decisions'])}<h3>Questions ouvertes pour Louis</h3><ul class="notes">{''.join(f'<li>{e(q)}</li>' for q in t['questions'])}</ul></section>""")

nav = "".join(f'<a href="#{i}">{l}</a>' for i, l in [("lire", "Lire"), ("familles", "Familles"), ("slides", "Types de slides"), ("composants", "Composants"), ("unique", "Image unique"), ("transversal", "Transversal")] + [(f"test-{t['id']}", "Test " + t["id"]) for t in tests])

page = f"""<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Banque de style Ruff</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
<style>
:root{{--bg:#FBFBFB;--card:#fff;--ink:#161616;--mute:#6b6b6b;--line:#e4e4e4;--blue:#0147FF;--red:#EF0C0C;--gold:#a8812f;--green:#1f9d35;--amb:#b26b00}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#111214;--card:#1b1c1f;--ink:#f1f1f1;--mute:#a3a3a3;--line:#2c2d31}}}}
:root[data-theme="dark"]{{--bg:#111214;--card:#1b1c1f;--ink:#f1f1f1;--mute:#a3a3a3;--line:#2c2d31}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 "Plus Jakarta Sans",system-ui,sans-serif}}
nav{{position:sticky;top:0;z-index:5;display:flex;gap:6px;flex-wrap:wrap;padding:10px 16px;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}}
nav a{{color:var(--ink);text-decoration:none;padding:5px 11px;border:1px solid var(--line);border-radius:999px;font-weight:700;font-size:13px;background:var(--card)}}
main{{max-width:1200px;margin:0 auto;padding:24px 16px 80px}}h1{{font-size:30px;margin:8px 0 4px}}h2{{font-size:22px;margin:42px 0 12px}}h3{{margin:0 0 6px;font-size:17px}}
.muted,.struct{{color:var(--mute)}}.struct{{font-size:14px}}code{{font-size:12px;color:var(--mute)}}
.fam,.comp{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin:14px 0}}
.meta{{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:2px 0 8px}}.tag{{font-size:12px;font-weight:700;padding:2px 9px;border-radius:999px;background:color-mix(in srgb,var(--blue) 12%,transparent);color:var(--blue)}}
.chip{{display:inline-block;font-size:11px;font-weight:700;padding:1px 7px;border-radius:6px;margin-right:4px;border:1px solid currentColor}}
.chip.regle{{color:var(--red)}}.chip.observation{{color:var(--blue)}}.chip.proposition{{color:var(--gold)}}.chip.local{{color:var(--mute)}}.chip.ambigu{{color:var(--amb)}}.chip.general{{color:var(--green)}}
.notes{{padding-left:18px}}.notes li{{margin:4px 0}}
.strip{{display:flex;gap:8px;overflow-x:auto;padding:6px 2px 10px}}.th{{margin:0;flex:0 0 auto;width:120px}}.strip.big .th{{width:190px}}
.th img{{width:100%;border-radius:6px;border:1px solid var(--line);display:block;background:#fff}}.th figcaption{{font-size:11px;text-align:center;margin-top:3px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}}.grid .comp{{margin:0}}.grid.single .th{{width:100%}}
.cimg{{height:120px;display:flex;align-items:center;justify-content:center;background:repeating-conic-gradient(#f2f2f2 0 25%,#fff 0 50%) 0/16px 16px;border-radius:8px;margin-bottom:8px}}.cimg img{{max-width:92%;max-height:108px}}
.comp h4{{margin:2px 0}}.comp p{{font-size:13px;margin:6px 0}}
table{{width:100%;border-collapse:collapse;background:var(--card);border-radius:12px;overflow:hidden}}td,th{{border-bottom:1px solid var(--line);padding:9px 10px;text-align:left;vertical-align:top;font-size:14px}}
@media (max-width:600px){{table,tbody,tr,td{{display:block}}thead{{display:none}}}}
</style></head><body><nav>{nav}</nav><main><h1>Banque de style — carrousels et posts Ruff Agency</h1><p class="muted">{e(data['version'])} · corpus Figwright « Section 1 » (10 groupes, {sum(len(g['slides']) for g in cat['groups'])} slides, {len(cat['singles'])} images uniques)</p>
{''.join(sec)}</main></body></html>"""
open(os.path.join(ROOT, "index.html"), "w", encoding="utf8").write(page)
print("ok", len(page))
