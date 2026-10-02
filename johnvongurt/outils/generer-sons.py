"""Fabrique les sons de assets/audio/ (préparation, chauffe, décollage, propulseur, atterrissage, musique).
Pas de téléchargement : tout est synthétisé. Pour retoucher un son, modifie la fonction correspondante puis relance :
    python outils/generer-sons.py
Il faut Python avec numpy et scipy, et ffmpeg dans le PATH. (Les fichiers déjà livrés suffisent : ce script est facultatif.)"""
import os, subprocess
import numpy as np
from scipy.io import wavfile

SR = 44100
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'audio')
TMP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '_tmp_sons')
os.makedirs(OUT, exist_ok=True); os.makedirs(TMP, exist_ok=True)
rng = np.random.default_rng(2026)


def rms(x): return float(np.sqrt(np.mean(np.square(x))) + 1e-12)
def unit(x): return x / rms(x)
def tax(n): return np.arange(n) / SR
def interp(t, pts):
    xs, ys = zip(*pts); return np.interp(t, xs, ys)


def fft_filter(x, lo=None, hi=None, order=3):
    """Filtre à phase nulle (circulaire : une boucle reste parfaitement raccord)."""
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); H = np.ones_like(f)
    if hi: H = H / np.sqrt(1 + (f / hi) ** (2 * order))
    if lo:
        with np.errstate(divide='ignore'):
            H = H / np.sqrt(1 + (lo / np.maximum(f, 1e-9)) ** (2 * order))
        H[0] = 0
    return np.fft.irfft(X * H, len(x))


def band(n, lo=None, hi=None, order=3): return unit(fft_filter(rng.standard_normal(n), lo, hi, order))


def smooth_periodic(n, rate_hz):
    """Variation lente aléatoire, périodique sur la durée du son (valeurs ~ -1..1)."""
    x = fft_filter(rng.standard_normal(n), hi=rate_hz, order=2)
    return x / (np.max(np.abs(x)) + 1e-12)


def crackle(n, density, lo=700, hi=7000, circular=False):
    """Craquements : impulsions aléatoires filtrées. density = par seconde (nombre ou tableau)."""
    d = np.full(n, density, dtype=float) if np.isscalar(density) else density
    hit = rng.random(n) < d / SR
    amp = np.exp(rng.normal(-0.3, 0.8, n))
    imp = hit * amp * np.sign(rng.standard_normal(n))
    y = fft_filter(imp, lo=lo, hi=hi, order=2)
    y = y / (rms(y) if rms(y) > 1e-9 else 1)
    return np.clip(y, -4, 4)


def damped(t0, freq, tau, amp, n):
    t = tax(n) - t0
    return np.where(t >= 0, np.sin(2 * np.pi * freq * np.maximum(t, 0)) * np.exp(-np.maximum(t, 0) / tau), 0) * amp


def level(x, target, window=1.0):
    """Règle le niveau sur le RMS (la fenêtre la plus forte d'une seconde), puis limiteur doux : les craquements ne font plus baisser le reste."""
    x = np.asarray(x, dtype=float)
    mono = x if x.ndim == 1 else x.mean(axis=1)
    w = int(window * SR)
    c = np.concatenate([[0], np.cumsum(mono ** 2)])
    wr = np.sqrt((c[w:] - c[:-w]) / w)
    peak_w = wr.max() if len(wr) else rms(mono)
    x = x * (target / (peak_w + 1e-12))
    return np.tanh(x / .92) * .92


def save(name, x, q=3):
    x = np.asarray(x)
    if x.ndim == 1: x = x[:, None]
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    wav = f'{TMP}/{name}.wav'
    wavfile.write(wav, SR, pcm)
    out = f'{OUT}/{name}.ogg'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-c:a', 'libvorbis', '-q:a', str(q), out], check=True)
    print(f'{name:14s} {len(x)/SR:6.1f} s  crête {np.max(np.abs(x)):.2f}  rms {rms(x):.3f}  {os.path.getsize(out)/1024:6.0f} Ko')


# ====================================================================================
# 1. PRÉPARATION — ambiance de pas de tir (boucle 24 s)
# ====================================================================================
def preparation():
    L = 24; n = L * SR; t = tax(n)
    hum = sum(a * np.sin(2 * np.pi * f * t + p) for f, a, p in [(50, .10, 0), (100, .06, 1.1), (150, .035, 2.0), (200, .015, .3)])
    hum *= 1 + .15 * np.sin(2 * np.pi * 2 * t / L)
    air = band(n, 40, 380, 2) * .30 * (1 + .25 * smooth_periodic(n, .4))

    def burst(t0, dur, lo, hi, amp):                       # purge de réservoir : « pshhh »
        tt = (t - t0) % L
        env = (1 - np.exp(-tt / .12)) * np.exp(-tt / (dur / 2.5))
        return band(n, lo, hi, 2) * env * amp
    vents = sum(burst(*b) for b in [(2.5, 3.2, 1200, 7000, .22), (8.8, 2.0, 900, 5000, .15),
                                    (15.0, 3.8, 1500, 8000, .20), (20.4, 1.6, 1000, 6000, .13)])

    def bip(t0, freq, d=.07, amp=.04):
        tt = (t - t0) % L
        return np.where(tt < d, np.sin(2 * np.pi * freq * tt), 0) * np.minimum(1, tt / .005) * np.minimum(1, (d - tt) / .01) * amp
    radio = 0
    for t0 in (5.0, 12.4, 18.2, 22.6):                     # échanges radio lointains (deux bips + souffle)
        radio = radio + bip(t0, 1250) + bip(t0 + .11, 1600) + band(n, 1000, 3200, 2) * np.where(((t - t0 + .05) % L) < .06, 1, 0) * .03
    clicks = sum(damped(c, 1400, .012, .12, n) for c in (7.3, 16.1)) + sum(damped(c, 900, .02, .08, n) for c in (10.6, 21.3))
    x = hum + air + vents + radio + clicks
    return level(x, .085, 24)


# ====================================================================================
# 2. CHAUFFE — les moteurs montent en température (boucle 8 s)
# ====================================================================================
def chauffe():
    L = 8; n = L * SR; t = tax(n)
    rumble = band(n, 25, 130, 3)
    lowmid = band(n, 130, 500, 3) * (.75 + .25 * smooth_periodic(n, 6))
    mid = band(n, 500, 2500, 2) * (.3 + .2 * smooth_periodic(n, 3))
    crk = crackle(n, 45) * .28
    tones = .15 * np.sin(2 * np.pi * 38 * t) + .10 * np.sin(2 * np.pi * 57 * t + 1.3)
    x = rumble * 1.0 + lowmid * .75 + mid * .32 + crk + tones
    return level(x, .13, 8)


# ====================================================================================
# 3. DÉCOLLAGE — allumage (3 s) puis plein régime (one-shot 18 s). Le « boum » est à 3,0 s = T-0.
# ====================================================================================
def decollage():
    L = 18; n = L * SR; t = tax(n)
    low, lm, md, hi = band(n, 20, 160), band(n, 160, 600), band(n, 600, 2500), band(n, 2500, 9000)
    g_low = interp(t, [(0, .04), (1.5, .15), (3, .45), (3.3, 1.0), (6, .95), (12, .7), (18, .55)])
    g_lm = interp(t, [(0, .02), (1.5, .12), (3, .4), (3.4, .9), (7, .8), (18, .5)])
    g_md = interp(t, [(0, 0), (1.5, .06), (3, .25), (3.4, .6), (7, .45), (18, .25)])
    g_hi = interp(t, [(0, 0), (1.5, .1), (3, .5), (3.3, .55), (6, .25), (18, .12)])
    dens = interp(t, [(0, 15), (3, 150), (3.4, 220), (10, 80), (18, 40)])
    crk = crackle(n, dens) * interp(t, [(0, .12), (3, .5), (3.4, .7), (10, .35), (18, .15)])
    boom = np.where(t >= 3.0, np.sin(2 * np.pi * 42 * (t - 3.0)) * np.exp(-(t - 3.0) / .9), 0) * 1.1
    boom += np.where(t >= 3.0, band(n, 20, 250) * np.exp(-(t - 3.0) / .35), 0) * .7
    x = low * g_low + lm * g_lm * .9 + md * g_md * .8 + hi * g_hi * .7 + crk + boom
    x = level(x, .24, 1.0)
    x[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR))
    return x


# ====================================================================================
# 4. PROPULSEUR — la fusée vole (boucle 12 s)
# ====================================================================================
def propulseur(ref_rms):
    L = 12; n = L * SR
    def m(rate=.5, d=.12): return 1 + d * smooth_periodic(n, rate)
    x = band(n, 20, 160) * .75 * m(.4) + band(n, 160, 600) * .6 * m(.6) + band(n, 600, 2500) * .32 * m(.8, .15) \
        + band(n, 2500, 9000) * .15 * m(1.0, .2) + crackle(n, 60) * .2
    return np.tanh(unit(x) * ref_rms / .92) * .92


# ====================================================================================
# 5. ATTERRISSAGE — descente freinée (7,0 s) puis contact à 7,0 s, tassement (one-shot 16 s)
# ====================================================================================
def atterrissage():
    L = 16; n = L * SR; t = tax(n)
    low, lm, md, hi = band(n, 20, 160), band(n, 160, 600), band(n, 600, 2500), band(n, 2500, 9000)
    pts = lambda v: [(0, 0), (.4, v[0]), (2, v[1]), (6.5, v[2]), (7.0, v[3]), (7.4, 0), (16, 0)]
    eng = low * interp(t, pts([.1, .7, .75, .45])) + lm * interp(t, pts([.12, .6, .65, .4])) * .9 \
        + md * interp(t, pts([.05, .25, .3, .15])) * .8 + hi * interp(t, pts([.02, .12, .15, .05])) * .7
    eng *= 1 + .08 * np.sin(2 * np.pi * 3.1 * t + .5)                  # la poussée se règle en continu
    eng += crackle(n, 70) * interp(t, pts([.03, .15, .18, .1])) * .6
    poussiere = band(n, 1500, 8000, 2) * np.where(t >= 6.7, (1 - np.exp(-(t - 6.7) / .25)) * np.exp(-(t - 6.7) / 1.5), 0) * .30
    f_thump = 70 - 38 * np.clip((t - 7.0) / .4, 0, 1)
    thump = np.where(t >= 7.0, np.sin(2 * np.pi * np.cumsum(f_thump) / SR) * np.exp(-(t - 7.0) / .45), 0) * 1.0
    thump += np.where(t >= 7.0, band(n, 20, 300) * np.exp(-(t - 7.0) / .25), 0) * .6
    clunk = sum(damped(7.02, f, d, a, n) for f, d, a in [(410, .18, .35), (735, .14, .25), (1180, .10, .18), (1960, .07, .10)])
    clunk += .5 * sum(damped(7.19, f, d, a, n) for f, d, a in [(520, .12, .3), (910, .09, .2), (1500, .06, .1)])
    vent = band(n, 1200, 7000, 2) * np.where(t >= 7.35, (1 - np.exp(-(t - 7.35) / .05)) * np.exp(-(t - 7.35) / 1.8), 0) * .30
    ticks = 0
    for tk in np.sort(rng.uniform(8.6, 13.6, 10)):
        ticks = ticks + damped(tk, rng.uniform(1800, 3200), .05, rng.uniform(.05, .11), n)
    ambiance = np.where(t >= 7.4, 1, 0) * np.sin(2 * np.pi * 55 * t) * .03 * np.minimum(1, (t - 7.4) / 1.5)
    x = eng + poussiere + thump + clunk + vent + ticks + ambiance
    x = level(x, .20, 1.0)
    x[-int(1.5 * SR):] *= np.linspace(1, 0, int(1.5 * SR))
    return x


# ====================================================================================
# 6. MUSIQUE — nappes d'espace + cloches (boucle 64 s, stéréo, raccord parfait)
# ====================================================================================
def musique():
    L = 64; n = L * SR; t = tax(n)
    adj = lambda f: round(f * L) / L                         # fréquences à nombre entier de cycles : boucle sans clic
    mid = lambda m: 440 * 2 ** ((m - 69) / 12)
    chords = [(45, [57, 60, 64, 71]), (41, [53, 57, 60, 64]), (48, [60, 64, 67, 71]), (43, [55, 59, 62, 69])]
    SEG = 16.0
    out = np.zeros((2, n))

    def env_pad(t0):
        tt = (t - t0) % L
        a = np.clip(tt / 4.5, 0, 1); a = a * a * (3 - 2 * a)
        return np.where(tt < SEG, a, a * np.exp(-(tt - SEG) / 3.2))
    for k, (root, notes) in enumerate(chords):
        e = env_pad(k * SEG)
        for ch in range(2):
            v = np.zeros(n)
            for m in notes:
                f0 = mid(m)
                for cents in ((-7, 0) if ch == 0 else (0, 7)):
                    f = adj(f0 * 2 ** (cents / 1200)); ph = rng.uniform(0, 6.28)
                    v += sum(a * np.sin(2 * np.pi * f * h * t + ph * h) for h, a in [(1, 1.0), (2, .30), (3, .14), (4, .06)])
            v += 1.6 * np.sin(2 * np.pi * adj(mid(root)) * t) + .8 * np.sin(2 * np.pi * adj(mid(root + 12)) * t + 1)
            out[ch] += v * e * .035
    # cloches / arpèges lointains
    tcur = 2.0
    while tcur < L - 1:
        _, notes = chords[int(tcur // SEG) % 4]
        m = int(rng.choice(notes)) + 12 * int(rng.choice([1, 1, 2]))
        f = adj(mid(m)); pan = rng.uniform(.15, .85)
        tt = (t - tcur) % L
        e = np.minimum(1, tt / .006) * np.exp(-tt / 2.6)
        b = (np.sin(2 * np.pi * f * t) + .15 * np.sin(2 * np.pi * adj(f * 2.76) * t)) * e * .06
        out[0] += b * (1 - pan); out[1] += b * pan
        tcur += rng.uniform(2.4, 5.2)
    # souffle d'espace très discret
    for ch in range(2):
        out[ch] += band(n, 1800, 6000, 2) * .004 * (1 + smooth_periodic(n, .2))
    # réverbération (convolution circulaire : la boucle reste continue)
    for ch in range(2):
        ir_n = int(3.2 * SR); tir = np.arange(ir_n) / SR
        ir = rng.standard_normal(ir_n) * np.exp(-tir / .9)
        ir = fft_filter(ir, hi=4500, order=2); ir /= np.sqrt(np.sum(ir ** 2))
        wet = np.fft.irfft(np.fft.rfft(out[ch]) * np.fft.rfft(ir, n), n)
        out[ch] = out[ch] * .7 + wet * .55
    x = out.T
    return level(x, .10, 8)


if __name__ == '__main__':
    save('preparation', preparation())
    save('chauffe', chauffe())
    d = decollage(); save('decollage', d, 4)
    ref = rms(d[int(7 * SR):int(11 * SR)]) * .9
    save('propulseur', propulseur(ref))
    save('atterrissage', atterrissage(), 4)
    save('musique', musique(), 4)
