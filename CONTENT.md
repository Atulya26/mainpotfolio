# Authoring guide

All content for the site lives in **`public/content.json`**. You can either edit
it through `/admin`, or hand me a chunk of JSON / Markdown and I'll place it
into the right file and wire up the blocks.

- [Workflow options](#workflow-options)
- [Project case-study blocks](#project-case-study-blocks)
- [Simple-text sections (hero, about, footer, etc.)](#simple-text-sections)
- [Resetting your local draft](#resetting-your-local-draft)

---

## Workflow options

**Option A — you write in `/admin`.** Changes persist to your browser's
localStorage. When you hit **Publish** in the admin header, it commits
`content.json` to the GitHub repo (you'll enter a PAT the first time).

**Option B — you hand me content, I place it.** For long case studies this is
often faster. Three shapes work:

1. **Plain Markdown** — headings, paragraphs, lists, image links. I'll map each
   piece to the nearest block type. Add `![caption](url)` for images, `> quote`
   for pull quotes, `---` for dividers.
2. **Block JSON** — drop an array of blocks straight into a project's `blocks`
   field. See [block types](#project-case-study-blocks) for the full schema.
3. **Section-by-section prose** — write the story, mark the breaks (`→ image`,
   `→ gallery of 3`, `→ quote: "…" — author`). I'll translate into blocks.

Either way, images should be:
- **Hosted URLs** (Unsplash/Cloudinary/S3) if the content will be published to
  GitHub. Image uploads through admin are local-preview-only — they won't be
  pushed to the repo in v1.
- You can also drop image files somewhere, send me the paths, and I'll put
  them in `public/uploads/` and reference them.

---

## Project case-study blocks

A project in `content.json` looks like this:

```json
{
  "slug": "pointvoucher",
  "index": "01",
  "title": "Reinventing the Everyday Voucher",
  "client": "Pointvoucher",
  "year": "2025",
  "category": "Apps & Web-apps",
  "role": ["Product Design", "Interaction", "Design System"],
  "discipline": "App",
  "color": "#ff5a1f",
  "textOnColor": "#0b0b0b",
  "cover": "https://…",
  "summary": "One-sentence blurb shown on the home-grid card.",
  "blocks": [ … ]
}
```

Everything inside `blocks[]` is editable with the block types below. The intro
(title, meta, cover image) and the next-project card are rendered automatically.

### Block types

Each block has the shape `{ id, type, …props }`. `id` can be any short unique
string (e.g. `"pv-1"`).

#### `heading`
```json
{ "id": "x1", "type": "heading", "level": 2, "style": "serif", "text": "Finding the one job" }
```
- `level`: `2` (large) or `3` (medium)
- `style`: `"sans"` or `"serif"` (italic serif accent)

#### `paragraph`
```json
{ "id": "x2", "type": "paragraph", "variant": "lede", "text": "One paragraph…" }
```
- `variant`: `"body"` (default) or `"lede"` (larger intro paragraph)

#### `twoColumn` — labelled column + body
```json
{
  "id": "x3",
  "type": "twoColumn",
  "label": "Context",
  "body": "First paragraph…\n\nSecond paragraph…"
}
```
Double line-breaks separate paragraphs. First paragraph renders bigger (h2);
subsequent ones render as lede copy. The label is sticky on scroll.

#### `pullQuote`
```json
{
  "id": "x4",
  "type": "pullQuote",
  "text": "The sentence worth pulling out.",
  "author": "— Name, Role"
}
```

#### `image` — full-bleed or inset, optional caption
```json
{
  "id": "x5",
  "type": "image",
  "src": "https://…",
  "alt": "Screen reader description",
  "caption": "Fig. 01 — optional caption",
  "layout": "full"
}
```
- `layout`: `"full"` (bleed to viewport edges) or `"inset"` (padded max-width)

#### `imagePair` — two side-by-side figures
```json
{
  "id": "x6",
  "type": "imagePair",
  "left":  { "src": "https://…", "caption": "Left fig." },
  "right": { "src": "https://…", "caption": "Right fig." }
}
```

#### `imageGallery` — grid of N images
```json
{
  "id": "x7",
  "type": "imageGallery",
  "columns": 3,
  "items": [
    { "src": "https://…", "caption": "Home" },
    { "src": "https://…", "caption": "Detail" },
    { "src": "https://…", "caption": "Modal" }
  ]
}
```
- `columns`: `2`, `3` or `4`

#### `stats` — metrics row
```json
{
  "id": "x8",
  "type": "stats",
  "items": [
    { "v": "+41%", "l": "Activation lift" },
    { "v": "-28%", "l": "Support tickets" },
    { "v": "3.4×", "l": "D30 retention" }
  ]
}
```

#### `processCards` — pinned horizontal scroll
```json
{
  "id": "x9",
  "type": "processCards",
  "eyebrow": "Process",
  "heading": "Four moves we made.",
  "cards": [
    { "k": "Listening", "v": "Diary studies with 14 users." },
    { "k": "Grammar",   "v": "A single spacing + type scale." },
    { "k": "Flow",      "v": "Four onboarding screens → two." },
    { "k": "Polish",    "v": "Micro-interactions, 60 fps." }
  ]
}
```
This block pins and scrubs horizontally as the user scrolls. Keep 3–5 cards.

#### `callout` — highlighted note
```json
{
  "id": "x10",
  "type": "callout",
  "title": "Principle — quiet by default",
  "body": "One-liner takeaway."
}
```

#### `videoEmbed`
```json
{
  "id": "x11",
  "type": "videoEmbed",
  "url": "https://www.youtube.com/watch?v=…",
  "caption": "Prototype walkthrough"
}
```
Accepts YouTube, Vimeo, or direct `.mp4` / `.webm` URLs.

#### `divider`
```json
{ "id": "x12", "type": "divider" }
```

---

## Simple-text sections

Top-level keys in `content.json` you can edit directly or hand me prose for:

| Key | What it controls |
|---|---|
| `site` | Brand name, email, phone, tagline, socials, timezone, availability |
| `theme` | Light/dark palette, accent colour, font stacks |
| `nav` | Top-bar links + fullscreen menu items |
| `hero` | Meta strip, title lines, showreel image, aside lede, ticker |
| `marquee` | Scrolling words between hero and featured work |
| `featured` | Eyebrow, heading, CTA label above the projects grid |
| `categories` | Filter chips on the home grid |
| `capabilitiesSection` | Sticky capabilities list |
| `aboutTeaser` | Short about block on home |
| `archive` | The `/archive` page (eyebrow, heading, rows) |
| `published` | The `/published` page (eyebrow, heading, items) |
| `about` | The `/about` page (title lines, portrait, bio paragraphs, experience, clients) |
| `contact` | The `/contact` page (form labels, placeholders, aside) |
| `footer` | Big CTA words, lead, grid labels |

---

## Resetting your local draft

If you've been testing edits in admin and want to revert to the committed
`content.json`:

1. Open `/admin`.
2. In the header (if you have unpublished changes) click **Discard**, or
3. Open DevTools → Application → Local Storage → delete the
   `portfolio:content` key, then refresh.

Your draft is a local overlay — the published `content.json` in the repo is
always the source of truth.
