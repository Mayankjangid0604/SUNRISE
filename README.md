# Sunrise Hostels — Sikar

**A Unique Group of Sunrise** · Boys & Girls Hostel for NEET & JEE aspirants
In front of Gurukripa Coaching, Nawalgarh Road, Sikar, Rajasthan · Est. 2020

Official website, built on **Saahvik Template № 100 — "The Saahvik Standard"**
(Tier 10 · Masterpiece).

## Design system (from the template)

| Token | Value |
|---|---|
| Palette | `ivory-navy` — bg `#f5f0e8` · ink/primary `#0d1b2a` · accent `#c9a96e` |
| Fonts | Playfair Display (headings) + Jost (body) |
| Hero | `aurora` (animated radial gradients) |
| Pattern | `sparkle` |
| Radius | 14px |
| Signature sections | `medallion` + `manifesto` (exclusive to № 100) |

## Structure

`index.html` is the single-page site, all Tier-10 sections:
nav → aurora hero → medallion → marquee → booking bar → stats → about →
story → wings & rooms → tariff table → amenities → features → mess →
gallery → tour → life at Sunrise → testimonials → trust band → team →
facilities strip → FAQ → location → manifesto → contact CTA → footer.
Plus `wing-gallery.html` for per-wing photo galleries.

- `assets/css/style.css` — full port of the template design system
- `assets/js/main.js` — mobile nav, WhatsApp booking/enquiry forms, scroll reveal
- `assets/favicon.svg` — brand mark

## Client details (from intake form)

- Owner: Karni Ram · ☎ 96021 14011 (call & WhatsApp) · ✉ karammeel33@gmail.com
- 4 wings: Girls A (92 beds/4F), Girls B (70/4F), Boys A (100/4F), Boys B (44/2F) — 306 beds
- Rooms: Single Seater & Two Seater · tariffs on visit ("visit & discuss")
- Security deposit ₹13,000 (refundable) · all payment methods
- 4 pure-veg meals daily, every-day special food
- No gym (struck off on the form) — playground & open space instead

## Tagline & location

- Tagline: **लक्ष्य आपका, साथ हमारा, सफलता के सफर में !** (hero, marquee, footer, meta)
- Google Maps: https://maps.app.goo.gl/oCR81Cp9rcpMuQ746 (location section + map card)

## Adding photos

All photos are stored as optimised **WebP** (max 1600px, ~120KB each) —
the 170MB of source PNGs were converted down to ~11MB total for fast
loading. Drop new images into the matching folder and push — the site
picks them up automatically (prefers `.webp`, then falls back to
`.jpg/.jpeg/.png`, or a styled placeholder when nothing is found):

```
images/
├── boys/
│   ├── Wing A/     Building + 1, 2, 3…
│   └── Wing B/     Building + 1, 2, 3…
├── Girls/
│   ├── Wing A/     Building + 1, 2, 3…
│   └── Wing B/     Building + 1, 2, 3…
└── sunrise logo/   LOGO.webp (monogram) + sUNRISE.webp (wordmark)
```

- `LOGO.webp` → navbar mark, medallion coin, favicon
- `sUNRISE.webp` → wordmark in the contact band (navy background)
- `BUILDING` → wing cards, story section, gallery lead tile
- `1, 2, 3…` → gallery & wing tiles

## Ultra-premium layer (₹1,50,000 grade)

`assets/js/premium.js` + the premium CSS block power:

- Cinematic preloader — rising sun logo, rotating rays, load bar, curtain lift
- Gold-dust particle field over the aurora hero (canvas, mouse parallax, twinkle)
- Letter-by-letter 3D hero title entrance with gradient ink
- True 3D spinning medallion coin — logo front, "EST. 2020" engraved back, orbiting sparkles
- 3D tilt cards with cursor-tracking glare (wings + trust cards)
- Custom gold cursor (dot + trailing ring) and magnetic buttons
- Count-up stats, scrollspy nav with gold underline, scroll progress bar
- Full-screen lightbox on the home gallery (keyboard + swipe-nav buttons)
- Ken Burns photo zoom, staggered blur-in reveals, glassmorphism booking bar
- Marquee pause-on-hover, WhatsApp pulse, manifesto shimmer border, back-to-top

All motion is disabled automatically under `prefers-reduced-motion`.

## Google Reviews system

Data-driven, decoupled architecture. The frontend **never** calls Google
directly — it reads reviews from a single data source, so the same UI
works whether that source is a static file (today) or a REST API (later).

```
Reviews data source  →  Store (data layer)  →  UI components  →  Pages
assets/data/reviews.json   reviews-store.js      reviews-ui.js     home + /reviews
```

**Files**
- `assets/data/reviews.json` — the reviews (edit this to add/update them)
- `assets/js/reviews-store.js` — data layer: `getStats()`, `getLatest(n)`,
  `query({search,sort,stars,page,pageSize})` — returns the exact shapes a
  REST API would, so it's swappable
- `assets/js/reviews-ui.js` — reusable components: card, grid, carousel,
  rating summary, distribution stats, skeleton/empty/error states, pagination
- `assets/js/google-reviews.js` — homepage `#reviews` section (summary +
  latest 5, grid on desktop / swipe carousel on mobile)
- `assets/js/reviews-page.js` + `reviews.html` — the `/reviews` page: all
  reviews with **search, sort** (newest/oldest/highest/lowest), **filter by
  stars**, **pagination**, and a rating **distribution** panel
- `assets/css/google-reviews.css` — styling (site design tokens; dark-mode aware)

Both pages inject JSON-LD `Review` + `AggregateRating` for SEO. Buttons:
**Write a Google Review** opens your Google profile; **View All Reviews**
on the homepage opens the internal `/reviews` page.

### Updating reviews

Edit `assets/data/reviews.json` — copy your real Google reviews in, keeping
the field shape (`reviewId, authorName, authorPhoto, rating, reviewText,
relativeTime, publishTime, language, profileUrl, isVerified`). The sample
entries in there now are placeholders; replace them with your genuine
Google reviews. The rating average, totals and distribution are computed
automatically.

### Why not sync directly from Google?

There is **no public Google API that returns all of a business's reviews**.
The Places API returns at most 5 and can't paginate; the Google Business
Profile API returns all your reviews but requires being the verified owner,
applying for and being granted API access, OAuth, and a hosted server +
database to run the sync. If you later obtain Business Profile API access
and stand up that backend, point `reviews-store.js`'s `load()` at your
`/api/reviews` endpoint (same JSON shape) — no other code changes needed.

## Favicon (Google Search)

Google Search shows the favicon from a small set of supported formats
(ICO/PNG — **not WebP**, which was the original bug). The site ships
`favicon.ico` (16/32/48), `favicon-48/96/192/512.png`,
`apple-touch-icon.png`, `site.webmanifest`, `robots.txt` and `sitemap.xml`
at the site root, referenced from every page's `<head>` with **relative
paths** (so they resolve on a root domain or a subpath). Regenerate the
raster icons from `images/sunrise logo/LOGO.webp` if the logo changes.

Note: after deploying, Google refreshes favicons in Search on its own
crawl schedule (days–weeks). Request re-indexing of the homepage in Google
Search Console to speed it up.

## Pending from client

- Replace the sample entries in `assets/data/reviews.json` with real
  Google reviews (copy from the Google Business Profile)
