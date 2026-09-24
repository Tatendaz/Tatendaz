"""Generate assets/compound-velocity.svg — the "Teach it once. Watch it compound." chart.

Run: python3 scripts/render_compound_chart.py [path/to/fonts]
If a fonts dir with inter-{400,500,600}.woff2 is given, the fonts are embedded
so the SVG renders identically everywhere (needed for a PNG export).
"""
import base64, math, pathlib, sys

W, H = 2000, 1200
X0, X1 = 160, 1600          # plot left/right (week 0 .. week 12)
Y_BASE, PX_PER_UNIT = 1000, 80
WEEKS = 12

BG, GRID, AXIS = "#0b0d12", "#1c212b", "#2d3440"
GREEN, GRAY = "#3cf29b", "#8b93a3"
TEXT, MUTED, FAINT = "#f2f4f7", "#a3aab8", "#6b7280"

def x(t): return X0 + t / WEEKS * (X1 - X0)
def y(v): return Y_BASE - v * PX_PER_UNIT
def agent(t): return math.exp(t * math.log(8) / WEEKS)   # 1 -> 8
def solo(t): return 1 + t * 1.4 / WEEKS                   # 1 -> 2.4

ts = [i / 10 for i in range(WEEKS * 10 + 1)]
agent_pts = [(x(t), y(agent(t))) for t in ts]
solo_pts = [(x(t), y(solo(t))) for t in ts]
fmt = lambda pts: " ".join(f"{a:.1f},{b:.1f}" for a, b in pts)
gap = fmt(agent_pts + solo_pts[::-1])

fonts = ""
if len(sys.argv) > 1:
    d = pathlib.Path(sys.argv[1])
    for w in (400, 500, 600):
        b64 = base64.b64encode((d / f"inter-{w}.woff2").read_bytes()).decode()
        fonts += f"@font-face{{font-family:Inter;font-weight:{w};src:url(data:font/woff2;base64,{b64}) format('woff2');}}"

grid = "".join(
    f'<line x1="{X0}" x2="{X1}" y1="{y(v)}" y2="{y(v)}" stroke="{GRID}" stroke-width="2"/>'
    for v in (2, 4, 6, 8))
ticks = "".join(
    f'<line x1="{x(t)}" x2="{x(t)}" y1="{Y_BASE}" y2="{Y_BASE + 12}" stroke="{AXIS}" stroke-width="2"/>'
    f'<text x="{x(t)}" y="{Y_BASE + 52}" text-anchor="middle" class="tick">Week {t}</text>'
    for t in (0, 3, 6, 9, 12))

ae, se = agent_pts[-1], solo_pts[-1]
lx = X1 + 32
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<style>{fonts}
text{{font-family:Inter,"Helvetica Neue",Arial,sans-serif}}
.tick{{font-size:28px;fill:{MUTED}}}
</style>
<defs>
  <linearGradient id="gap" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0.3" stop-color="{GREEN}" stop-opacity="0"/>
    <stop offset="1" stop-color="{GREEN}" stop-opacity="0.22"/>
  </linearGradient>
</defs>
<rect width="{W}" height="{H}" fill="{BG}"/>

<text x="{X0}" y="110" font-size="26" font-weight="600" letter-spacing="4" fill="{GREEN}">PRODUCTION VELOCITY</text>
<text x="{X0}" y="186" font-size="66" font-weight="600" fill="{TEXT}">Teach it once. Watch it compound.</text>
<text x="{X0}" y="240" font-size="31" fill="{MUTED}">Every preference you lock in becomes default output — forever.</text>

{grid}
<line x1="{X0}" x2="{X1}" y1="{Y_BASE}" y2="{Y_BASE}" stroke="{AXIS}" stroke-width="2"/>
{ticks}

<polygon points="{gap}" fill="url(#gap)"/>
<polyline points="{fmt(solo_pts)}" fill="none" stroke="{GRAY}" stroke-width="5" stroke-dasharray="18 12" stroke-linecap="round"/>
<polyline points="{fmt(agent_pts)}" fill="none" stroke="{GREEN}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="{ae[0]}" cy="{ae[1]}" r="11" fill="{GREEN}" stroke="{BG}" stroke-width="4"/>
<circle cx="{se[0]}" cy="{se[1]}" r="10" fill="{GRAY}" stroke="{BG}" stroke-width="4"/>

<text x="{lx}" y="{ae[1] - 4}" font-size="32" font-weight="600" fill="{GREEN}">Agent you</text>
<text x="{lx}" y="{ae[1] + 36}" font-size="32" font-weight="600" fill="{GREEN}">keep teaching</text>
<text x="{lx}" y="{se[1] - 4}" font-size="30" font-weight="500" fill="{GRAY}">Doing it</text>
<text x="{lx}" y="{se[1] + 34}" font-size="30" font-weight="500" fill="{GRAY}">yourself</text>

<text x="{x(10.9)}" y="{(y(agent(10.9)) + y(solo(10.9))) / 2 + 30}" text-anchor="middle" font-size="30" font-weight="500" fill="{TEXT}">
  <tspan x="{x(10.9)}" dy="-18">compounding</tspan><tspan x="{x(10.9)}" dy="38">gains</tspan>
</text>

<text x="{(X0 + X1) / 2}" y="{Y_BASE + 108}" text-anchor="middle" font-size="30" fill="{MUTED}">Time spent teaching your agent</text>
<text x="{X0}" y="1160" font-size="24" fill="{FAINT}">Not a forecast. A shape.</text>
<text x="{W - 60}" y="1160" text-anchor="end" font-size="24" fill="{FAINT}">keep teaching, keep multiplying</text>
</svg>
'''
out = pathlib.Path(__file__).resolve().parent.parent / "assets" / "compound-velocity.svg"
out.write_text(svg)
print(out)
