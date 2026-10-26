# Assignment Hub — E-Waste Management

Static site (HTML, CSS, vanilla JS). No build step, no backend.

## Files
- `index.html`, `style.css`, `script.js` — dashboard
- `assignments-data.js` — explicit metadata (titles, categories, exact filenames)
- `background.css`, `background.js` — isolated animated background (delete both plus the `.bg` div to remove)
- `assignments/` — your files, copied in (see below)

## Setup on Ubuntu
The site cannot read `~/Downloads/assignments/` once deployed, so copy the files into the project:

```bash
cd ~/Downloads/assignment-hub        # or wherever you saved these files
mkdir -p assignments
cp -r ~/Downloads/assignments/. assignments/
ls assignments                       # expect assignment00 ... assignment10
```
`cp` leaves the originals untouched.

## Background and reduced motion
The background animates by default. If your OS or browser asks for reduced motion (on Ubuntu/GNOME: Settings → Accessibility → "Animations" off, or "Reduce animation"), the site shows a calm static version on purpose. Re-enable animations in the OS to see it move.

## Run locally
```bash
cd ~/Downloads/assignment-hub
python3 -m http.server 8000
```
Open http://localhost:8000.

## Deploy
- **GitHub Pages:** push the folder to a repo, then Settings → Pages → deploy from the main branch root.
- **Netlify:** drag the folder onto app.netlify.com/drop.

## Titles that still need verifying
I could not read the README.txt files, so every title is provisional (cards say "Title to verify"). Open each README.txt, then edit `title`, `description`, `category` and set `verified:true` in `assignments-data.js`. Titles for 01, 06 and 07 are descriptive names inferred from filenames; the rest use neutral labels.

## Test checklist
- [ ] Stats show 11 assignments and 17 resources
- [ ] 00: PDF opens in a new tab
- [ ] 01: xlsx downloads; PDF opens
- [ ] 02: PDF opens; PNG previews
- [ ] 03, 04, 05, 10: PDF opens
- [ ] 06: both PDFs open
- [ ] 07: JPEG previews; MP4 plays with controls
- [ ] 08: PDF opens; xlsx downloads
- [ ] 09: both PDFs open
- [ ] Search "07", type chips, category filter, reset and empty state work
- [ ] Theme toggle, keyboard Tab/Esc, and reduced-motion (OS setting) behave
# -EWASTE-ASSIGNMENTS-DASHBOARD
# -EWASTE-ASSIGNMENTS-DASHBOARD
# EWASTE-ASSIGNMENTS-DASHBOARD
# EWASTE-ASSIGNMENTS-DASHBOARD
