# KINGFISHER

Single-file landing page (`index.html`, no build step). A giant word sits behind the
hero subject using `mix-blend-mode: darken`, and the UI reveals once the subject settles.

## Reuse it with your own clip

**The clip.** Locked camera, flat backdrop, subject darker than the backdrop, still for
the last 2-3 seconds. 16:9, about 8s, H.264 (the default export from Flow, Veo, Runway
or Kling). A light subject on a mid-tone backdrop will sit behind the word.

**Settings** (top of the `<script>`):

| Name | What it does |
|---|---|
| `REVEAL_AT` | Seconds into the clip when the subject settles. The UI reveal is timed off this. |
| `HARD_TIMEOUT` | Milliseconds before the UI reveals regardless. Set to clip length + 1-2s. |

**Palette** (on `:root`): `--bg`, `--bg-rgb`, `--ghost`, `--orange`, `--teal`.
- `--bg-rgb` must be the same colour as `--bg`, written `r,g,b`. The edge shading uses it.
- `--ghost` is `--bg` x 0.955.
- A runtime sampler re-matches these to your footage, but only when the video is
  same-origin or its host sends CORS headers. On `file://` or a cross-origin host it
  falls back to the CSS values, so set them by hand from a colour picker.

**Also change per clip**
- The `<source>` tags inside `<video>`: `hero.mp4` is the local copy, tried first. The thinkingods.com URL is the fallback.
- `data-crop="x,y,size"` on the two thumbnail canvases: fractions of the video frame.
  `size` is a fraction of the frame's shorter side.
- The giant word in `.word`, and the page copy.

## Run it

Open `index.html` in a browser. The video loads from its URL, so you need a connection.

## Current clip

Measured from the supplied 1280x720, 8s clip: touchdown at about 4.0s, settled by about 4.5s
(`REVEAL_AT = 4.5`). Backdrop sampled at 94% x, 12% y is rgb(185,198,182), set as `--bg`,
`--bg-rgb` and `--ghost` (x 0.955). Thumbnail crops are aimed at the head and the wing.

## george.html: the personal-brand version

The kingfisher flies in, lands, and the landing reveals George. The page opens on the footage and
the surname only. At `REVEAL_AT` (4.5s) the footage fades, the cut-out portrait lands in its place,
and the UI follows about 450 ms later. Copy, credentials and assets come from georgeogunbande.com.

- **Word and bird:** `mix-blend-mode: darken` on the word, so the (darker) bird flies in front of it.
  The backdrop colour is sampled from the footage, so the page matches it (CSS fallbacks are the
  measured values when pixel reading is blocked, as on `file://`).
- **Portrait:** `assets/george-cutout.webp` has real transparency, so it sits in front of the word
  by stacking order. Do not use the blend trick for the portrait: it would show the word through
  the white shirt.
- **Settings** (top of the script): `REVEAL_AT`, `HARD_TIMEOUT`, `UI_LAG`.
- **Fallbacks:** the portrait and UI also appear on `ended`, on video error, if `play()` is rejected,
  after `HARD_TIMEOUT`, and immediately under reduced motion.
- **Thumbnails:** `data-src` and `data-crop="x,y,size"` on each canvas, as fractions of the image.
- **Flow screenshot:** labelled "Demo data" because the dashboard figures are sample data.
