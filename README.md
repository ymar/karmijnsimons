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

Framer handled form submissions itself; that doesn't come along. Set `PUBLIC_FORM_ENDPOINT` (see `.env.example`) to a form service URL such as Formspree. Without it, Submit opens the visitor's email app with the message filled in, addressed to hi@karmijnsimons.com.
