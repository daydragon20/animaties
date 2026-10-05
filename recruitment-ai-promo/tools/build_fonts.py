"""Download the latin subsets of the fonts and inline them as data-URIs in assets/fonts.css.

Inline fonts keep index.html playable by double-click (file:// blocks external font loads).
"""
import base64, re, urllib.request, pathlib

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
FAMILIES = [
    "Archivo:wdth,wght@62..125,100..900",
    "Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900",
    "Spline+Sans+Mono:wght@300..700",
    "Inter:wght@400..700",
]
out = []
for fam in FAMILIES:
    req = urllib.request.Request(f"https://fonts.googleapis.com/css2?family={fam}&display=block", headers={"User-Agent": UA})
    css = urllib.request.urlopen(req).read().decode()
    # keep only the plain 'latin' subset blocks (comment marker precedes each block)
    for marker, block in re.findall(r"/\* ([\w-]+) \*/\s*(@font-face\s*{[^}]*})", css):
        if marker != "latin":
            continue
        url = re.search(r"url\((https://[^)]+)\)", block).group(1)
        data = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA})).read()
        b64 = base64.b64encode(data).decode()
        out.append(block.replace(url, f"data:font/woff2;base64,{b64}"))
pathlib.Path(__file__).resolve().parent.parent.joinpath("assets/fonts.css").write_text("\n".join(out))
print(len(out), "faces")
