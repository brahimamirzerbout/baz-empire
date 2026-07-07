#!/usr/bin/env python3
"""Remove the white background from BAZ.png -> BAZ_nobg.png (RGBA PNG).

Method (chosen after pixel analysis):
  * Background is a near-uniform white (~[254,254,254], border-median).
  * Subject is an opaque gold gradient; a pure luminance key would eat the
    light-gold body. So we key on *distance from the estimated background
    colour*, which cleanly separates white (dist<=15) from subject (dist>=57).
  * dist in [T_LO, T_HI] is the anti-alias feather band -> ramped alpha with
    colour decontamination to avoid white halos on dark backgrounds.
  * dist >= T_HI -> fully opaque, ORIGINAL colour preserved (gold untouched).
"""
from pathlib import Path
import numpy as np
from PIL import Image

SRC = Path("/home/uzer/Downloads/BAZ.png")
DST = Path("/home/uzer/Downloads/BAZ_nobg.png")

# Thresholds derived from the distance histogram (bg p99=4.1, max=15.1;
# subject min=57). Wide empty gap between 15 and 57 -> safe cut.
T_LO = 14.0   # <= this distance  -> fully transparent (background + its noise)
T_HI = 55.0   # >= this distance  -> fully opaque (subject body, original colour)
RING = 10     # px border ring used to estimate the background colour


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def main():
    arr = np.array(Image.open(SRC).convert("RGBA")).astype(np.float32)
    h, w, _ = arr.shape
    rgb = arr[..., :3]

    # 1. Estimate background colour = median of the border ring (robust to logo).
    ring = np.concatenate([
        rgb[:RING, :, :].reshape(-1, 3),
        rgb[-RING:, :, :].reshape(-1, 3),
        rgb[:, :RING, :].reshape(-1, 3),
        rgb[:, -RING:, :].reshape(-1, 3),
    ])
    bg = np.median(ring, axis=0)
    print(f"Estimated bg colour (median border): {bg.round(1).tolist()}")

    # 2. Per-pixel distance from background.
    dist = np.sqrt(((rgb - bg) ** 2).sum(-1))

    # 3. Alpha: 0 over bg, 1 over subject, smoothstep feather in between.
    a = smoothstep(T_LO, T_HI, dist)          # 0..1 float
    alpha = (a * 255.0).round().astype(np.uint8)

    # 4. Colour decontamination for the feather band only.
    #    Original was C = a*F + (1-a)*bg  =>  F = (C - (1-a)*bg) / a.
    #    Fully-opaque pixels (a==1) keep their original colour exactly.
    out = np.empty((h, w, 4), np.uint8)
    a3 = a[..., None]
    fg = (rgb - (1.0 - a3) * bg) / np.where(a3 > 1e-4, a3, 1.0)
    fg = np.clip(fg, 0, 255)
    # Where fully transparent, colour is irrelevant -> zero (clean RGBA).
    fg = np.where(a3 > 1e-4, fg, 0.0)
    out[..., :3] = fg.round().astype(np.uint8)
    out[..., 3] = alpha

    Image.fromarray(out, "RGBA").save(DST)

    # 5. Report.
    transparent = int((alpha == 0).sum())
    opaque = int((alpha == 255).sum())
    feather = alpha.size - transparent - opaque
    ys, xs = np.where(alpha > 0)
    bbox = (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())) if len(xs) else None
    print(f"Saved: {DST}  ({w}x{h})")
    print(f"Transparent: {transparent} ({100*transparent/alpha.size:.2f}%)")
    print(f"Opaque:      {opaque} ({100*opaque/alpha.size:.2f}%)")
    print(f"Feather AA:  {feather} px")
    print(f"Content bbox: {bbox}")


if __name__ == "__main__":
    main()