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

## Before going live

- **CV:** upload your PDF to the web root (`public_html/`) as
  `Malik-Muzamil-UX-Designer-CV.pdf`. Every "Download CV" link points there
  (see `CV_URL` in `src/App.tsx`).
- **Project results:** each project has an optional `result: { value, label }`.
  Only Shiftaan has one so far. The block stays hidden until you fill in a real result.
- **Writing:** add published UX articles to the `writing` array. Until then the
  section links to Medium.
