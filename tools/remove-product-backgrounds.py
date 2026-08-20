from PIL import Image, ImageDraw, ImageFilter

# Only images with a genuine clean white/studio background AND enough color
# contrast against white qualify. Products that are themselves white/light
# gray (sistema-alarme-simples, motor-deslizante, kit-cftv) blend into the
# background with no hard edge, so flood fill leaks into the product itself
# and destroys it -- confirmed by hand, one at a time, before this list was
# finalized. Those three keep their original light studio backdrop.
targets = [
    "motor-basculante-900.webp",
    "porteiro-simples-900.webp",
    "video-porteiro-900.webp",
    "cancela-ppa-900.webp",
]

MARKER = (255, 0, 254)
THRESH = 16


def remove_background(rgba_img):
    rgb = rgba_img.convert("RGB")
    w, h = rgb.size
    flood = rgb.copy()

    seeds = set()
    for x in range(0, w, max(1, w // 40)):
        seeds.add((x, 0))
        seeds.add((x, h - 1))
    for y in range(0, h, max(1, h // 40)):
        seeds.add((0, y))
        seeds.add((w - 1, y))

    for seed in seeds:
        if flood.getpixel(seed) != MARKER:
            ImageDraw.floodfill(flood, seed, MARKER, thresh=THRESH)

    flood_px = flood.load()
    out = rgba_img.copy()
    out_px = out.load()
    for y in range(h):
        for x in range(w):
            if flood_px[x, y] == MARKER:
                r, g, b, a = out_px[x, y]
                out_px[x, y] = (r, g, b, 0)
    return out


for name in targets:
    path = f"images/_originals/{name}"
    img = Image.open(path).convert("RGBA")
    img = remove_background(img)

    r, g, b, a = img.split()
    a = a.filter(ImageFilter.MinFilter(3))
    img = Image.merge("RGBA", (r, g, b, a))

    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img.save(f"images/{name}", "WEBP", quality=92)
    print("processed", name, img.size)
