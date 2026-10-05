"""Meet de drie stijlkandidaten: WCAG-contrast en kleurafstand (CIELAB ΔE76) tot generieke paletten."""
def lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
def rgb(h): h = h.lstrip('#'); return [int(h[i:i+2], 16) for i in (0, 2, 4)]
def lum(h): r, g, b = map(lin, rgb(h)); return 0.2126*r + 0.7152*g + 0.0722*b
def contrast(a, b): la, lb = sorted([lum(a), lum(b)], reverse=True); return (la + .05) / (lb + .05)
def lab(h):
    r, g, b = map(lin, rgb(h))
    x, y, z = (0.4124*r+0.3576*g+0.1805*b)/0.95047, 0.2126*r+0.7152*g+0.0722*b, (0.0193*r+0.1192*g+0.9505*b)/1.08883
    f = lambda t: t ** (1/3) if t > 0.008856 else 7.787*t + 16/116
    return 116*f(y)-16, 500*(f(x)-f(y)), 200*(f(y)-f(z))
def de(a, b): return sum((p-q)**2 for p, q in zip(lab(a), lab(b))) ** .5

GENERIC = {"donker-tech (paars op zwart)": ("#0A0A0F", "#7C3AED"), "warm-editorial (Claude-achtig)": ("#FAF7F2", "#D97757")}
STYLES = {
    "A product-trouw": dict(bg="#FAF7F2", ink="#1C1917", muted="#736A63", hero="#C2410C"),
    "B bewijsdossier": dict(bg="#E8E6DF", ink="#14120F", muted="#55524B", hero="#047857"),
    "C console":       dict(bg="#0B0D10", ink="#E6E8EB", muted="#8B95A1", hero="#4ADE80"),
}
for name, s in STYLES.items():
    print(f"{name}: contrast ink {contrast(s['ink'], s['bg']):.1f}:1 · muted {contrast(s['muted'], s['bg']):.1f}:1 · hero {contrast(s['hero'], s['bg']):.1f}:1")
    for g, (gbg, ghero) in GENERIC.items():
        print(f"   ΔE tot {g}: achtergrond {de(s['bg'], gbg):5.1f} · accent {de(s['hero'], ghero):5.1f}")
