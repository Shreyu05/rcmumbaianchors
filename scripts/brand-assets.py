#!/usr/bin/env python3
"""
Build the club's web brand assets from the two source images.

Sources (edit these paths if the files move):
  * club logo   — white crest on black
  * club banner — sunrise mountain artwork, used for the hero and OG card

Outputs into public/images/brand/:
  logo-crest.png / logo-crest-ink.png   anchor + R.C.M.A. ribbon, trimmed
  logo-lockup.png / logo-lockup-ink.png crest + club name
  favicon.png (64) / apple-touch-icon.png (180)
  banner.jpg (1920w) / banner-sm.jpg (960w)
  og-image.jpg (1200x630 social card)

The logo source is a JPEG on a black background, so we use its luminance as the
alpha channel: white artwork survives, black background becomes transparent, and
anti-aliased edges keep their soft transition. Two tinted sets are produced —
white for dark surfaces, deep navy for light ones.

Run once (needs Pillow):  python scripts/brand-assets.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images" / "brand"

LOGO_SRC = Path.home() / "Downloads" / "club logo.jpeg"
BANNER_SRC = (
    Path.home()
    / ".config"
    / "freebuff-desktop"
    / "attachment-images"
    / "f77260b218427195c85c72343b6d39e9453d2831304bcb870de982fc9fd400bf.jpg"
)

NAVY = (11, 26, 46)  # deep navy from the banner, for light surfaces
WHITE = (255, 255, 255)


def ink_mask(img: Image.Image, floor: int = 10, hard: int = 48) -> tuple[Image.Image, Image.Image]:
    """
    Returns (soft, hard) alpha channels for a black-background image.

    `soft` is luminance-derived and keeps anti-aliased edges; `hard` is the
    same picture binarised, used only to measure geometry — the surround of a
    JPEG is never quite black, so trimming against `soft` would keep the noise.
    """
    lum = img.convert("L")
    lut = [0 if v <= floor else min(255, int((v - floor) * 255 / (255 - floor))) for v in range(256)]
    soft = lum.point(lut)
    return soft, soft.point(lambda v: 255 if v >= hard else 0)


def tint(mask: Image.Image, rgb: tuple[int, int, int]) -> Image.Image:
    out = Image.new("RGBA", mask.size, rgb + (0,))
    out.putalpha(mask)
    return out


def trim(img: Image.Image, geometry: Image.Image) -> Image.Image:
    """Crop to `geometry`'s ink (a hard mask) while keeping `img`'s soft edges."""
    box = geometry.getbbox()
    return img.crop(box) if box else img


def split_crest_and_text(hard: Image.Image) -> int | None:
    """Row in the lower half where the crest ends and the wordmark begins."""
    w, _ = hard.size
    box = hard.getbbox()
    if not box:
        return None
    top, bottom = box[1], box[3]
    # Stop at the last row that actually holds ink, otherwise the empty margin
    # below the wordmark reads as the gap we are looking for.
    rows = [hard.crop((0, y, w, y + 1)).split()[-1].histogram()[255] for y in range(top, bottom)]
    gap, run_start = 10, None
    for index, count in enumerate(rows):
        y = top + index
        if y < (top + bottom) // 2:
            continue
        if count == 0:
            run_start = y if run_start is None else run_start
            # The first wide empty band below the middle is the one between the
            # crest and the wordmark — return it rather than hunting for later
            # gaps, which would land between the wordmark's two lines.
            if y - run_start + 1 >= gap:
                return (run_start + y) // 2
        else:
            run_start = None
    return None


def rounded_square(size: int, radius: int, bg: tuple[int, int, int]) -> Image.Image:
    tile = Image.new("RGBA", (size * 4, size * 4), bg + (0,))
    ImageDraw.Draw(tile).rounded_rectangle(
        (0, 0, size * 4 - 1, size * 4 - 1), radius=radius * 4, fill=bg + (255,)
    )
    return tile.resize((size, size), Image.LANCZOS)


def icon(size: int, crest: Image.Image, radius: int) -> Image.Image:
    tile = rounded_square(size, radius, NAVY)
    inner = int(size * 0.74)
    scale = min(inner / crest.width, inner / crest.height)
    art = crest.resize((max(1, int(crest.width * scale)), max(1, int(crest.height * scale))), Image.LANCZOS)
    tile.alpha_composite(art, ((size - art.width) // 2, (size - art.height) // 2))
    return tile


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    # ---------------------------------------------------------------- logo ---
    logo = Image.open(LOGO_SRC)
    soft, hard = ink_mask(logo)
    cut = split_crest_and_text(hard)

    crest_soft = trim(soft.crop((0, 0, soft.width, cut)), hard.crop((0, 0, hard.width, cut)))
    lockup_soft = trim(soft, hard)
    crest_white = tint(crest_soft, WHITE)
    crest_ink = tint(crest_soft, NAVY)
    lockup_white = tint(lockup_soft, WHITE)
    lockup_ink = tint(lockup_soft, NAVY)

    for name, image in {
        "logo-crest.png": crest_white,
        "logo-crest-ink.png": crest_ink,
        "logo-lockup.png": lockup_white,
        "logo-lockup-ink.png": lockup_ink,
    }.items():
        image.save(OUT / name)
        print(f"  {name:26} {image.width}x{image.height}")

    icon(64, crest_white, radius=14).save(OUT / "favicon.png")
    icon(180, crest_white, radius=0).save(OUT / "apple-touch-icon.png")

    # -------------------------------------------------------------- banner ---
    banner = Image.open(BANNER_SRC).convert("RGB")
    wide = banner.resize((1920, round(banner.height * 1920 / banner.width)), Image.LANCZOS)
    wide.save(OUT / "banner.jpg", quality=84, optimize=True, progressive=True)
    small = banner.resize((960, round(banner.height * 960 / banner.width)), Image.LANCZOS)
    small.save(OUT / "banner-sm.jpg", quality=82, optimize=True, progressive=True)

    # Social card: 1200x630 centred on the wordmark, motto and office bearers.
    card = banner.resize((1200, round(banner.height * 1200 / banner.width)), Image.LANCZOS)
    top = max(0, (card.height - 630) // 2)
    card = card.crop((0, top, 1200, top + 630))
    card.filter(ImageFilter.UnsharpMask(radius=1.6, percent=55, threshold=6)).save(
        OUT / "og-image.jpg", quality=86, optimize=True, progressive=True
    )

    # A palette read-out, so the CSS tokens stay faithful to the artwork.
    print("\n  banner palette (quantised):")
    quant = banner.resize((240, 160), Image.LANCZOS).quantize(colors=12, method=Image.MEDIANCUT)
    for count, index in sorted(quant.getcolors(), reverse=True):
        r, g, b = quant.getpalette()[index * 3 : index * 3 + 3]
        print(f"    #{r:02x}{g:02x}{b:02x}   {count:5} px")

    total = sum(f.stat().st_size for f in OUT.iterdir())
    print(f"\n  {len(list(OUT.iterdir()))} files, {total / 1024:.0f} KB total")


if __name__ == "__main__":
    main()
