"""Ramène les chemins de banque/catalogue-brut.json à « corpus/<fichier> » et signale les vignettes manquantes."""
import json
import os
import sys

root = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "banque")
p = os.path.join(root, "catalogue-brut.json")
c = json.load(open(p, encoding="utf8"))
items = [s for g in c["groups"] for s in g["slides"]] + c["singles"]
for s in items:
    if s.get("file"):
        s["file"] = "corpus/" + os.path.basename(s["file"].replace("\\", "/"))
json.dump(c, open(p, "w", encoding="utf8"), ensure_ascii=False, indent=1)
missing = [s["file"] for s in items if s.get("file") and not os.path.exists(os.path.join(root, s["file"]))]
print(len(items), "vignettes,", len(missing), "manquantes", missing[:5])
