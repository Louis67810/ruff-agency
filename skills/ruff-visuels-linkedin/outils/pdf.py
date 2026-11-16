"""python pdf.py <dossier> <nom> : assemble png/slide-*.png en PDF + planche apercu.png"""
import glob, os, sys
from PIL import Image
d, name = sys.argv[1], sys.argv[2]
ims = [Image.open(p).convert("RGB") for p in sorted(glob.glob(os.path.join(d, "png", "slide-*.png")))]
ims[0].save(os.path.join(d, name + ".pdf"), save_all=True, append_images=ims[1:], resolution=144)
W, H = ims[0].size; w, h = int(W * .3), int(H * .3); cols = 5; rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (w + 10) + 10, rows * (h + 10) + 10), (220, 226, 236))
for n, im in enumerate(ims): sheet.paste(im.resize((w, h)), (10 + (n % cols) * (w + 10), 10 + (n // cols) * (h + 10)))
sheet.save(os.path.join(d, "apercu.png")); print(len(ims), "slides")
