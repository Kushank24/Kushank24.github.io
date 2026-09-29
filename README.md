# Kushank Maheshwari — Portfolio

A static portfolio website. Three files: `index.html`, `style.css`, `script.js`.

## Customisation

- **Contact info, copy, dates** — edit `index.html` directly
- **Colors / fonts** — change the CSS tokens at the top of `style.css` under `:root`
- **Add a project** — duplicate a `.project-card` block in `index.html`
- **Resume download** — drop your PDF as `Kushank_Maheshwari_Resume.pdf` in this folder (the Resume button already points to it)
- **Photo** — add an `<img>` tag in the hero section and style it how you like

## Deployment options

### GitHub Pages (free, recommended)
1. Create a repo on GitHub (e.g. `kushank24.github.io`)
2. Push this folder's contents to the `main` branch
3. Go to Settings → Pages → Source: `main` / `/ (root)` → Save
4. Your site is live at `https://kushank24.github.io`

### Netlify (free, drag-and-drop)
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag this entire folder onto the Netlify dashboard
3. Done — you get a live URL instantly, plus a free custom domain option

### Vercel (free)
```bash
npm i -g vercel
cd /path/to/portfolio
vercel
```

### Any static host
Upload `index.html`, `style.css`, and `script.js` (and the PDF if you add it).
No build step required.
