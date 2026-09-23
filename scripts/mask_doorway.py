#!/usr/bin/env python3
"""
Automated Asset Masking Script for Wholesaleji Doorway Scroll Effect
Detects the high-luminance rectangular interior of doorway.jpg,
applies an alpha channel mask with smooth sub-pixel anti-aliasing,
and exports production-ready doorway_transparent.png.
"""

import os
import sys
from PIL import Image, ImageFilter, ImageOps, ImageDraw
import numpy as np

def mask_doorway(
    input_path: str,
    output_path: str,
    luminance_threshold: int = 230,
    feather_radius: float = 1.0,
    padding_shrink: int = 1
):
    print(f"[*] Processing: {input_path}")
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")

    # Load original image and convert to RGBA
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    print(f"[*] Image Dimensions: {width}x{height}")

    # Convert to grayscale NumPy array for thresholding
    gray = np.array(img.convert("L"))

    # Mask bright pixels (the illuminated doorway portal)
    bright_mask = (gray >= luminance_threshold).astype(np.uint8) * 255

    # Find the bounding box of the largest connected bright region in center
    row_sums = np.sum(bright_mask > 0, axis=1)
    col_sums = np.sum(bright_mask > 0, axis=0)

    active_rows = np.where(row_sums > width * 0.1)[0]
    active_cols = np.where(col_sums > height * 0.1)[0]

    if len(active_rows) > 0 and len(active_cols) > 0:
        top, bottom = int(active_rows[0]), int(active_rows[-1])
        left, right = int(active_cols[0]), int(active_cols[-1])
        print(f"[*] Detected Doorway Aperture Box: Left={left}, Top={top}, Right={right}, Bottom={bottom} (W={right-left}, H={bottom-top})")

        # Refine aperture mask: create a crisp rectangular mask matching the doorway aperture
        aperture_mask = Image.new("L", (width, height), 0)
        draw = ImageDraw.Draw(aperture_mask)
        draw.rectangle(
            [left + padding_shrink, top + padding_shrink, right - padding_shrink, bottom],
            fill=255
        )

        # Invert: 255 = keep wall opaque, 0 = make doorway transparent
        alpha_channel = ImageOps.invert(aperture_mask)

        # Optional subtle feathering for seamless edge blending
        if feather_radius > 0:
            alpha_channel = alpha_channel.filter(ImageFilter.GaussianBlur(feather_radius))

        # Put alpha into RGBA image
        img.putalpha(alpha_channel)
    else:
        # Fallback to direct luminance threshold mask
        print("[!] Using direct luminance threshold fallback...")
        alpha = Image.fromarray(255 - bright_mask)
        if feather_radius > 0:
            alpha = alpha.filter(ImageFilter.GaussianBlur(feather_radius))
        img.putalpha(alpha)

    # Save PNG with maximum compression
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    img.save(output_path, "PNG", optimize=True)
    print(f"[OK] Successfully exported transparent PNG: {output_path}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    in_file = os.path.join(base_dir, "assets", "doorway_frame_mask.jpg")
    out_file = os.path.join(base_dir, "assets", "doorway_transparent.png")
    mask_doorway(in_file, out_file)
