# karmijnsimons.com

The Karmijn Simons portfolio, rebuilt from the Framer site with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com). It builds to plain static HTML, so any static host works (Cloudflare Pages, Netlify, Vercel, GitHub Pages).

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

## Where things live

| What | Where |
| --- | --- |
| Case studies (text + images) | `src/content/work/*.md` |
| Case study images | `src/assets/work/<slug>/` |
| Home, About, Work, Contact pages | `src/pages/` |
| Header, footer, pink "Let's talk" band, logo strip | `src/components/` |
| Colors, fonts, type scale | `src/styles/global.css` |

### Adding a case study

1. Make a folder `src/assets/work/<slug>/` with a `cover` image and any other images.
2. Copy one of the files in `src/content/work/` to `<slug>.md` and edit the front matter:
   - `title`: shown on the card and as the page heading
   - `order`: position in the grid (1 = first)
   - `cover` / `coverAlt`: the card and hero image
3. Write the body in Markdown. Images: `![](../../assets/work/<slug>/01.png)`.

It shows up on the home page, `/work` and at `/work/<slug>` automatically. Images are resized and converted to WebP at build time.

## Contact form

The form posts to `/api/contact`, handled by the Worker in `worker/index.ts`. It emails the message to hi@karmijnsimons.com and karmijn@studioheem.com through Cloudflare Email Service, sent from `website@ymar.nl` with the visitor's address as reply-to, so hitting Reply answers them directly. The binding in `wrangler.jsonc` only allows sending to those addresses.

To change the recipient: verify the new address under Compute → Email Service → Destination addresses, then add it to `TO` in `worker/index.ts` and `allowed_destination_addresses` in `wrangler.jsonc`.

## Deploy

```bash
npm run deploy
```

Builds the site and deploys the Worker (`karmijnsimons`) with Wrangler. Needs `CLOUDFLARE_API_TOKEN` in the environment.
