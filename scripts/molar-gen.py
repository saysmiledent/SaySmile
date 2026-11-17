# Regenerate: python3 scripts/molar-gen.py 22000 2600 public/models/molar.bin
# Anatomical lower first molar as a point cloud (units ~ mm, y up, x mesio-distal, z bucco-lingual).
# Surface points come from a signed distance field; a sparse set fills the pulp chamber and canals.
# Output: Int16 xyz (scaled) + Uint8 tag (0 enamel, 1 root, 2 pulp) -> molar.bin
import numpy as np, sys
rng = np.random.default_rng(7)

def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b * (1 - h) + a * h - k * h * (1 - h)

def rbox(p, c, half, r):
    q = np.abs(p - c) - (half - r)
    return np.linalg.norm(np.maximum(q, 0), axis=-1) + np.minimum(np.max(q, axis=-1), 0) - r

def sphere(p, c, r): return np.linalg.norm(p - c, axis=-1) - r

def root(p, a, b, ra, rb, zs, bend):
    # tapered root from a (top) to b (apex), flattened bucco-lingually (zs > 1 = wider in z), bent along x
    q = p.copy()
    t = np.clip((a[1] - q[:, 1]) / (a[1] - b[1]), 0, 1)
    q[:, 0] -= bend * t * t                       # distal curve, stronger towards the apex
    q[:, 2] /= zs
    ab = (b - a); ab[2] /= 1
    pa = q - a
    h = np.clip((pa @ ab) / (ab @ ab), 0, 1)
    d = np.linalg.norm(pa - h[:, None] * ab, axis=-1)
    return d - (ra * (1 - h) + rb * h)

CUSPS = np.array([[-3.0, 6.1, 2.0], [0.3, 6.3, 2.4], [3.3, 5.8, 1.6], [-2.6, 6.6, -2.1], [2.2, 6.5, -2.2]])
CR = np.array([2.2, 2.3, 2.0, 2.25, 2.2])

def tooth(p):
    body = rbox(p, np.array([0, 3.4, 0]), np.array([5.4, 2.6, 4.7]), 2.3)
    for c, r in zip(CUSPS, CR):
        body = smin(body, sphere(p, c, r), 1.1)
    # cervical constriction and root trunk
    trunk = rbox(p, np.array([0, -1.0, 0]), np.array([3.9, 2.3, 3.5]), 1.7)
    d = smin(body, trunk, 2.2)
    m = root(p, np.array([-2.5, -1.5, 0]), np.array([-1.3, -14.0, 0]), 1.75, 0.45, 2.15, 1.4)
    di = root(p, np.array([2.6, -1.5, 0]), np.array([3.1, -12.8, 0]), 1.7, 0.5, 1.95, 0.9)
    d = smin(d, smin(m, di, 0.6), 1.2)


    return d

def pulp(p):
    ch = rbox(p, np.array([0, 2.4, 0]), np.array([2.9, 1.3, 2.3]), 1.0)
    horns = np.min([sphere(p, c * np.array([0.6, 1, 0.55]) + np.array([0, -1.6, 0]), 0.7) for c in CUSPS], axis=0)
    ch = smin(ch, horns, 0.8)
    m = root(p, np.array([-2.3, 1.0, 0]), np.array([-1.3, -13.2, 0]), 0.45, 0.1, 2.0, 1.4)
    di = root(p, np.array([2.4, 1.0, 0]), np.array([3.0, -12.0, 0]), 0.45, 0.1, 1.9, 0.9)
    return smin(ch, np.minimum(m, di), 0.5)

lo, hi = np.array([-8, -15.5, -7]), np.array([8, 9.5, 7])
surf, inner = [], []
while sum(len(s) for s in surf) < int(sys.argv[1]):
    p = lo + (hi - lo) * rng.random((400000, 3))
    d = tooth(p)
    near = p[np.abs(d) < 0.09]
    surf.append(near)
while sum(len(s) for s in inner) < int(sys.argv[2]):
    p = lo + (hi - lo) * rng.random((400000, 3))
    inner.append(p[(pulp(p) < 0) & (tooth(p) < -0.4)])
S = np.concatenate(surf)[: int(sys.argv[1])]
I = np.concatenate(inner)[: int(sys.argv[2])]
tag = np.concatenate([np.where(S[:, 1] > 0.6, 0, 1), np.full(len(I), 2)]).astype(np.uint8)
P = np.concatenate([S, I])
P[:, 1] -= 2.4   # centre the tooth vertically
print('points', len(P), 'enamel', (tag == 0).sum(), 'root', (tag == 1).sum(), 'pulp', (tag == 2).sum(), 'extent', P.min(0).round(1), P.max(0).round(1))
q = np.round(P / 24 * 32767).astype('<i2')
order = rng.permutation(len(P))           # shuffled, so a prefix is an even sample (phones use fewer points)
with open(sys.argv[3], 'wb') as f:
    f.write(np.array([len(P)], '<u4').tobytes()); f.write(q[order].tobytes()); f.write(tag[order].tobytes())
