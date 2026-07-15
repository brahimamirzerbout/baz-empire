#!/usr/bin/env python3
"""Analyze each asset: find annotation ink (non-site colors) by detecting
pixels that deviate from the dark/site palette. Crop dense annotation regions,
upscale, and re-OCR. Also report color clusters to identify 'red pen' markup."""
import os, glob, json, re
from PIL import Image
import numpy as np
from rapidocr_onnxruntime import RapidOCR

DL = "/home/uzer/Downloads"
engine = RapidOCR()

def natural_key(p):
    base = os.path.basename(p)
    m = re.findall(r'\d+', base.replace('image','').replace('.',''))
    return (int(m[0]) if m else 0, base)

paths = []
for ext in ("*.png", "*.webp"):
    paths += glob.glob(os.path.join(DL, ext))
paths = sorted(set(paths), key=natural_key)

def analyze(p):
    im = Image.open(p).convert("RGB")
    w,h = im.size
    arr = np.asarray(im).astype(np.int32)
    r,g,b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
    # "ink" = strongly colored pixels (high saturation), not near-grey/white/black/dark
    mx = arr.max(2); mn = arr.min(2)
    sat = mx - mn
    # bright-ish or strongly saturated (red/orange/blue/green ink) excluding dark bg
    bright = mx > 90
    ink = (sat > 60) & bright
    ratio = ink.mean()
    # color of ink: average of ink pixels
    if ink.sum() > 0:
        ir = r[ink].mean(); ig = g[ink].mean(); ib = b[ink].mean()
        ink_color = (int(ir), int(ig), int(ib))
    else:
        ink_color = None
    return w,h,float(ratio),ink_color, ink

def crop_clusters(ink, min_area=400):
    """Find bounding boxes of connected-ish ink density via simple grid."""
    H,W = ink.shape
    # downsample density map
    cell = 20
    gh, gw = H//cell+1, W//cell+1
    dens = np.zeros((gh,gw))
    for y in range(0,H,cell):
        for x in range(0,W,cell):
            dens[y//cell, x//cell] = ink[y:y+cell, x:x+cell].mean()
    hot = dens > 0.02
    # group hot cells into rows of contiguous regions (simple)
    boxes=[]
    visited = np.zeros_like(hot)
    from collections import deque
    for yy in range(gh):
        for xx in range(gw):
            if hot[yy,xx] and not visited[yy,xx]:
                q=deque([(yy,xx)]); visited[yy,xx]=1
                miny,maxy,minx,maxx=yy,yy,xx,xx
                while q:
                    cy,cx=q.popleft()
                    for dy in(-1,0,1):
                        for dx in(-1,0,1):
                            ny,nx=cy+dy,cx+dx
                            if 0<=ny<gh and 0<=nx<gw and hot[ny,nx] and not visited[ny,nx]:
                                visited[ny,nx]=1; q.append((ny,nx))
                                miny=min(miny,ny);maxy=max(maxy,ny);minx=min(minx,nx);maxx=max(maxx,nx)
                bw=(maxx-minx+1)*cell; bh=(maxy-miny+1)*cell
                if bw*bh >= min_area:
                    boxes.append((minx*cell,miny*cell,bw,bh))
    return boxes

report = {}
for p in paths:
    name = os.path.basename(p)
    w,h,ratio,ink_color,ink = analyze(p)
    boxes = crop_clusters(ink)
    # merge overlapping boxes
    boxes.sort()
    merged=[]
    for bx in boxes:
        x,y,bw,bh = bx
        placed=False
        for i,m in enumerate(merged):
            mx,my,mw,mh=m
            if not (x+bw < mx-30 or x > mx+mw+30 or y+bh < my-30 or y > my+mh+30):
                nx=min(x,mx);ny=min(y,my);nex=max(x+bw,mx+mw);ney=max(y+bh,my+mh)
                merged[i]=(nx,ny,nex-nx,ney-ny); placed=True; break
        if not placed: merged.append(bx)
    # OCR each crop at 3x
    crops_text=[]
    im = Image.open(p).convert("RGB")
    for (x,y,bw,bh) in merged:
        x=max(0,x-12); y=max(0,y-12); bw+=24; bh+=24
        x2=min(w,x+bw); y2=min(h,y+bh)
        crop = im.crop((x,y,x2,y2))
        s=3
        crop = crop.resize((crop.width*s, crop.height*s), Image.LANCZOS)
        tmp=f"/tmp/_crop_{name}_{x}_{y}.png"
        crop.save(tmp)
        res,_ = engine(tmp)
        txt=[]
        if res:
            for box,t,c in res:
                t=(t or "").strip()
                if t and float(c)>0.4: txt.append(t)
        if txt:
            crops_text.append({"box":[x,y,x2,y2], "text":" | ".join(txt)})
    report[name] = {"size":f"{w}x{h}","ink_ratio":round(ratio,4),"ink_color":ink_color,
                    "n_clusters":len(merged),"cluster_texts":crops_text}
    print(f"\n===== {name} ({w}x{h}) ink_ratio={ratio:.3f} ink_color={ink_color} clusters={len(merged)} =====")
    for ct in crops_text:
        print(f"  @{ct['box']}  ->  {ct['text']}")

with open("/home/uzer/ocr_clusters.json","w") as f:
    json.dump(report, f, indent=2, ensure_ascii=False)
print("\nSaved /home/uzer/ocr_clusters.json")