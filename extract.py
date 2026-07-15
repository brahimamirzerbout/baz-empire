#!/usr/bin/env python3
"""Extract expert remarks/writing from the asset images using OCR (rapidocr-onnxruntime)."""
import os, glob, json
from PIL import Image
from rapidocr_onnxruntime import RapidOCR

DL = "/home/uzer/Downloads"
engine = RapidOCR()

def natural_key(p):
    base = os.path.basename(p)
    # sort image.png, image (1).png ... numerically
    import re
    m = re.findall(r'\d+', base.replace('image','').replace('.',''))
    return (len(m)>0 and int(m[0]) or 0, base)

paths = []
for ext in ("*.png", "*.webp", "*.jpg", "*.jpeg"):
    paths += glob.glob(os.path.join(DL, ext))
paths = sorted(set(paths), key=natural_key)

out = {}
for p in paths:
    im = Image.open(p).convert("RGB")
    w,h = im.size
    # upscale small images for better OCR
    scale = 1
    if max(w,h) < 1400:
        scale = 2
        im = im.resize((w*scale, h*scale), Image.LANCZOS)
    tmp = "/tmp/_ocr_tmp.png"
    im.save(tmp)
    result, elapse = engine(tmp)
    lines = []
    if result:
        for box, text, conf in result:
            text = (text or "").strip()
            if text:
                lines.append({"text": text, "conf": round(float(conf),2)})
    out[os.path.basename(p)] = {"size": f"{w}x{h}", "scale": scale, "lines": lines}
    print(f"\n===== {os.path.basename(p)}  ({w}x{h}) =====")
    for ln in lines:
        print(f"  [{ln['conf']}] {ln['text']}")

with open("/home/uzer/ocr_results.json","w") as f:
    json.dump(out, f, indent=2, ensure_ascii=False)
print("\nSaved /home/uzer/ocr_results.json")