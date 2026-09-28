// Runs after `vite build`. Vite only produces one dist/index.html, which is
// fine for the app itself (it's a client-rendered SPA reading location.pathname)
// but means every route would share the SAME <title>/<meta>/OG tags at the
// HTTP-response level — invisible to search engines that don't run JS and to
// social-share scrapers (Slack/WhatsApp/X/LinkedIn), which never run JS at all.
//
// This script clones the built index.html once per known static route (plus
// one per published blog post, fetched live from Supabase — the CMS is the
// source of truth for blog content, so anything published there gets
// prerendered here on the next build) with that route's real title,
// description, canonical URL, OG tags and JSON-LD baked directly into the
// HTML, and writes each one to dist/<route>/index.html. .htaccess then
// rewrites e.g. /pricing straight to pricing/index.html with no redirect, so
// the URL in the address bar never changes. It also regenerates sitemap.xml
// from the same route list so the two can never drift apart.
//
// A post published through /admin after the last build won't have a
// prerendered page until the next `pnpm build` runs — it's still fully
// reachable and correct at /blogs/<slug> via the client-side fetch in
// Blog(), just without baked-in meta tags until the next rebuild. Wiring a
// rebuild to fire automatically on publish (e.g. a webhook to your host or a
// scheduled build) is a good next step but is outside what a static
// cPanel-hosted site can trigger on its own.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { pageMeta, notFoundMeta, posts as seedPosts, faqs, siteUrl, blogTitle, absImage } from "../src/content.js";

// Must match src/supabase.js — duplicated here because this script runs in
// plain Node, outside the Vite/browser bundle.
const SUPABASE_URL = "https://qazegonoysisqrpyeucf.supabase.co";
const SUPABASE_KEY = "sb_publishable_s2rK08Vjocuq5OeMWgCf7w_23gop4y0";

async function fetchPublishedPosts() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=*&status=eq.published&order=published_at.desc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) throw new Error(`Supabase REST returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`prerender: couldn't fetch posts from Supabase (${err.message}) — falling back to the ${seedPosts.length} seed posts in src/content.js. Blog pages will still work at runtime either way; only their prerendered SEO meta may be stale.`);
    return seedPosts.map(([slug, title, excerpt, featured_image, category, reading_time, published_at]) => ({
      slug, title, excerpt, content: `<p>${excerpt}</p>`, featured_image: `${siteUrl}/assets/${featured_image}`,
      category, reading_time, published_at, seo_title: "", meta_description: "", og_title: "", og_description: "", canonical_url: "", image_alt: "",
    }));
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const templatePath = path.join(distDir, "index.html");

if (!existsSync(templatePath)) {
  console.error("prerender: dist/index.html not found — run `vite build` first.");
  process.exit(1);
}

const template = readFileSync(templatePath, "utf8");

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Shiftaan",
    url: siteUrl + "/",
    logo: siteUrl + "/assets/Logo.svg",
    sameAs: ["https://x.com/tryshiftaan", "https://instagram.com/tryshiftaan"],
  };
}

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

function blogPostingJsonLd(p) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    image: absImage(p.featured_image) || `${siteUrl}/assets/social-share.png`,
    datePublished: p.published_at,
    dateModified: p.updated_at || p.published_at,
    author: { "@type": "Person", name: p.author || "Malik Muzamil" },
    publisher: { "@type": "Organization", name: "Shiftaan", logo: { "@type": "ImageObject", url: `${siteUrl}/assets/Logo.svg` } },
    mainEntityOfPage: `${siteUrl}/blogs/${p.slug}`,
    articleSection: p.category,
  };
}

function render({ routePath, title, description, canonicalPath, image, jsonLd, ogType }) {
  const canonicalUrl = `${siteUrl}${canonicalPath === "/" ? "/" : canonicalPath}`;
  let html = template;
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta name="description" content=".*?"\s*\/?>/s, `<meta name="description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/s, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = html.replace(/<meta property="og:title" content=".*?"\s*\/?>/s, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?"\s*\/?>/s, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  if (ogType) html = html.replace(/<meta property="og:type" content=".*?"\s*\/?>/s, `<meta property="og:type" content="${escapeHtml(ogType)}" />`);
  if (image) html = html.replace(/<meta property="og:image" content=".*?"\s*\/?>/s, `<meta property="og:image" content="${escapeHtml(image)}" />`);
  const ogUrlTag = `<meta property="og:url" content="${canonicalUrl}" />`;
  const jsonLdTag = jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : "";
  html = html.replace("</head>", `    ${ogUrlTag}\n    ${jsonLdTag}\n  </head>`);
  return html;
}

function write(routePath, html) {
  const clean = routePath === "/" ? "" : routePath.replace(/^\//, "");
  const dir = clean ? path.join(distDir, clean) : distDir;
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), html, "utf8");
}

const routeEntries = [];
const htaccessRoutes = [];

// Static routes
for (const [routePath, meta] of Object.entries(pageMeta)) {
  const jsonLd = routePath === "/" ? orgJsonLd() : routePath === "/faq" ? faqJsonLd() : undefined;
  const html = render({
    routePath,
    title: meta.title,
    description: meta.description,
    canonicalPath: meta.canonical || routePath,
    image: absImage(meta.image) || `${siteUrl}/assets/social-share.png`,
    jsonLd,
  });
  write(routePath, html);
  htaccessRoutes.push(routePath);
  // /contact is deliberately left out of the sitemap: it canonicalises to
  // /support (same content), so it shouldn't be listed as its own indexable
  // URL — but it's still generated and servable above, with that canonical tag.
  if (!meta.canonical) routeEntries.push(routePath);
}

// Blog listing page already covered by pageMeta["/blogs"] above.

// Individual blog posts — live from Supabase (the CMS is the source of truth).
const posts = await fetchPublishedPosts();
for (const p of posts) {
  const title = blogTitle(p.seo_title || p.title);
  const description = p.meta_description || p.excerpt;
  const html = render({
    routePath: `/blogs/${p.slug}`,
    title,
    description,
    canonicalPath: p.canonical_url ? new URL(p.canonical_url).pathname : `/blogs/${p.slug}`,
    image: absImage(p.featured_image) || undefined,
    jsonLd: blogPostingJsonLd(p),
    ogType: "article",
  });
  write(`/blogs/${p.slug}`, html);
  routeEntries.push(`/blogs/${p.slug}`);
  htaccessRoutes.push(`/blogs/${p.slug}`);
}

// 404 page — same template, correct title/description, noindex so it's never
// indexed as real content, still styled by the same client bundle.
{
  let html = render({
    routePath: "/404",
    title: notFoundMeta.title,
    description: notFoundMeta.description,
    canonicalPath: "/404",
  });
  html = html.replace("</head>", `    <meta name="robots" content="noindex" />\n  </head>`);
  writeFileSync(path.join(distDir, "404.html"), html, "utf8");
}

// Sitemap, generated from the exact same route list so it can't drift.
const today = new Date().toISOString().slice(0, 10);
const urls = routeEntries
  .map((p) => `<url><loc>${siteUrl}${p === "/" ? "/" : p}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
writeFileSync(path.join(distDir, "sitemap.xml"), sitemap, "utf8");

// Inject matching RewriteRules into dist/.htaccess so each clean URL is
// served from its prerendered index.html with no redirect. Only routes we
// actually generated get a rule, so anything not in this list (e.g. a future
// CMS-added blog post that hasn't been through a rebuild yet) simply falls
// through to the generic SPA fallback further down the file.
const htaccessPath = path.join(distDir, ".htaccess");
if (existsSync(htaccessPath)) {
  const rules = htaccessRoutes
    .filter((p) => p !== "/")
    .map((p) => {
      const clean = p.replace(/^\//, "");
      return `RewriteRule ^${clean}/?$ ${clean}/index.html [L]`;
    })
    .join("\n");
  let htaccess = readFileSync(htaccessPath, "utf8");
  htaccess = htaccess.replace(
    /# BEGIN-PRERENDERED-ROUTES[\s\S]*?# END-PRERENDERED-ROUTES/,
    (block) => block.replace(/# END-PRERENDERED-ROUTES/, `${rules}\n# END-PRERENDERED-ROUTES`)
  );
  writeFileSync(htaccessPath, htaccess, "utf8");
}

console.log(`prerender: wrote ${routeEntries.length} routes + 404.html + sitemap.xml`);
