# bemuzamil.com — portfolio

Personal UX / product design portfolio for Malik Muzamil (React 19 + Vite + Tailwind v4).
Originally exported from Figma Make and reworked after a UX audit.

```bash
npm install
npm run dev      # local preview
npm run build    # type-check + production build into dist/
```

Upload the *contents* of `dist/` to the web root. It is a single page, so no
rewrite rules are needed.

- Content (projects, notes, references, social links) lives in data arrays at
  the top of `src/App.tsx`.
- Images are WebP files in `public/assets/`. Give any new image `width` and `height`
  so the layout does not jump while it loads.
