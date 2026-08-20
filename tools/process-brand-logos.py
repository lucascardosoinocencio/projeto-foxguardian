from PIL import Image

# PPA: self-contained badge on a white canvas. Remove near-white background.
ppa = Image.open("assents/_Logotipo-PPA-2021_1684334289702.webp").convert("RGBA")
datas = ppa.getdata()
threshold = 240
new_data = []
for r, g, b, a in datas:
    if r >= threshold and g >= threshold and b >= threshold:
        new_data.append((r, g, b, 0))
    else:
        new_data.append((r, g, b, a))
ppa.putdata(new_data)
bbox = ppa.getbbox()
if bbox:
    ppa = ppa.crop(bbox)
ppa.save("assents/logo-ppa-transparent.png")
print("saved logo-ppa-transparent.png", ppa.size)

# Intelbras: solid green fill with a white wordmark. Keep only the near-white
# text pixels (as a white mark), drop the green fill to transparent.
intel = Image.open("assents/logo-intelbras.png").convert("RGBA")
datas = intel.getdata()
new_data = []
for r, g, b, a in datas:
    # "whiteness" = how close this pixel is to pure white
    whiteness = min(r, g, b)
    if whiteness >= 140:
        new_data.append((255, 255, 255, 255))
    else:
        new_data.append((255, 255, 255, 0))
intel.putdata(new_data)
bbox = intel.getbbox()
if bbox:
    intel = intel.crop(bbox)
intel.save("assents/logo-intelbras-transparent.png")
print("saved logo-intelbras-transparent.png", intel.size)
