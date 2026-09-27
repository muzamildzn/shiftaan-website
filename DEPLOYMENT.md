# Deploying Shiftaan marketing site to cPanel

## 1. Build

Requires Node 22 (see `.mise.toml`).

```bash
npm install
npm run build
```

This produces a `dist/` folder — that folder's *contents* (not the folder
itself) are what you upload.

## 2. Upload

Upload everything inside `dist/` to your cPanel document root
(usually `public_html/`, or `public_html/subfolder/` for a subdomain/addon
domain). Make sure hidden files are shown in the File Manager / FTP client,
because `.htaccess` (included in `dist/`) needs to go up too — it's what
makes client-side routes like `/pricing` or `/blogs/...` work when someone
opens that URL directly or refreshes the page, and it also forces HTTPS and
sets caching headers.

## 3. Verify after upload

- Visit `/`, `/how-it-works`, `/pricing`, `/blogs`, a blog post URL,
  `/about`, `/support`, `/contact`, `/faq`, `/privacy`, `/terms`, `/cookies`
  directly (typed into the address bar, not just clicked from the nav) to
  confirm the `.htaccess` rewrite is working.
- Visit a nonsense URL (e.g. `/does-not-exist`) and confirm the Shiftaan
  404 page renders.
- Check `https://yourdomain/robots.txt` and `https://yourdomain/sitemap.xml`
  are reachable.
- Confirm the padlock/HTTPS is active (the `.htaccess` redirects HTTP → HTTPS
  automatically, but the domain needs a valid SSL cert installed in cPanel
  first — AutoSSL/Let's Encrypt is usually already on by default).

## Notes on this build

- `base` in `vite.config.ts` defaults to `/`, i.e. this is set up to be
  deployed at the domain root. If it will instead live in a subfolder
  (e.g. `yourdomain.com/site/`), set `base: '/site/'` before building.
- All internal links are plain `<a href="/...">` tags (full page navigation),
  so every route needs the server to answer with `index.html` for any path
  that isn't a real file — that's exactly what the included `.htaccess`
  does via `mod_rewrite`.
- The "Try Shiftaan Free" / "Log in" buttons link to `https://app.shiftaan.com`
  — the live product app — and are left untouched, as requested.

## Blog CMS (Supabase)

Blog posts are no longer hardcoded in the site — they live in a Supabase
project (`shiftaan`, region eu-west-2) and are managed at `/admin`.

- **Admin login:** `admin@shiftaan.com`. A temporary password was generated
  when the account was created — rotate it immediately via the "Forgot
  password" flow (Supabase Auth handles password reset emails once you
  configure a sender; until then, you can also reset it directly from the
  Supabase dashboard under Authentication → Users).
- **Public site:** `/blogs` and `/blogs/:slug` fetch published posts
  straight from Supabase at runtime, no rebuild needed for a new post to go
  live.
- **SEO meta for new posts:** `pnpm build` fetches published posts from
  Supabase and bakes per-post `<title>`/meta/OG/JSON-LD into a static
  `dist/blogs/<slug>/index.html`, exactly like the other pages (see the SEO
  section of `src/App.tsx`'s prerender comment). A post published through
  `/admin` is immediately live and correct for real visitors and for Google
  (which executes JS), but won't get its own prerendered, crawler-visible
  meta tags until the next `pnpm build` + redeploy. If you publish
  regularly, consider triggering a rebuild on a schedule (e.g. a nightly cron
  that SSHes in and runs `pnpm build`) or wiring a webhook from Supabase to
  your CI — this static-hosting setup can't trigger its own rebuilds.
- **Images:** the editor takes a plain image path (e.g. `/assets/blog/your-post.jpg`)
  rather than uploading anywhere — you upload the actual file to that path on
  your cPanel host yourself (same as the site's other images under
  `public/assets/`), and the field just needs to match. A post with no image
  path yet renders fine with no image (no broken-image icon) until you fill
  one in.
- **Security model:** the Supabase anon/publishable key embedded in the
  built JS is meant to be public — Row Level Security policies on
  `blog_posts` and the storage bucket are what actually restrict writes to
  `admin@shiftaan.com`, not secrecy of that key.
