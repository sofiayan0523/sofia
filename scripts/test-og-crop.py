#!/usr/bin/env python3
"""Simulate BlogCard aspect-[16/10] crop to verify OG safe area."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "images" / "posts" / "ai-native-1000-club" / "cover.png"
DEST_DIR = ROOT / "scripts"

img = Image.open(SRC)
W, H = img.size  # 1200x630

# BlogCard uses aspect-[16/10] = 1.6:1 with object-cover
# Image is 1.905:1, wider than container, so it crops horizontally
target_aspect = 16 / 10
new_w = int(H * target_aspect)
crop_l = (W - new_w) // 2
crop_r = W - crop_l
print(f"Source: {W}x{H} (aspect {W/H:.3f})")
print(f"Target: {new_w}x{H} (aspect {target_aspect:.3f})")
print(f"Crop: {crop_l}px from left, {W - crop_r}px from right")
print(f"Visible: x={crop_l} to x={crop_r}")

cropped = img.crop((crop_l, 0, crop_r, H))
out = DEST_DIR / "og-crop-preview.png"
cropped.save(out, format="PNG", optimize=True)
print(f"Saved: {out}")

# Also simulate a more aggressive crop (some cards/social may crop more)
new_w2 = int(H * (3 / 2))  # 3:2 aspect crop
crop_l2 = (W - new_w2) // 2
cropped2 = img.crop((crop_l2, 0, W - crop_l2, H))
out2 = DEST_DIR / "og-crop-preview-aggressive.png"
cropped2.save(out2, format="PNG", optimize=True)
print(f"Saved aggressive (3:2): {out2}")
