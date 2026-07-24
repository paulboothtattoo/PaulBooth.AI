# PaulBooth.ai — Animated Portfolio Starter

Open `index.html` in a browser. No build process is required.

## Hero animation

The top of the website uses two exact supplied image layers:

- `assets/hero-background.png` — static biomechanical environment
- `assets/paulbooth-ai-logo-transparent.png` — official transparent logo

The logo artwork itself is not redrawn or modified. CSS and JavaScript animate only its position, scale, lighting, glow, and entrance. The background receives slow parallax and camera drift, while a lightweight canvas adds embers.

## Replace content later

Edit `content.js` to change project names, descriptions, categories, experiments, and machine cards. Replace any placeholder assets inside `assets/` while retaining the filenames referenced by the HTML/CSS.

## Accessibility and performance

- Respects `prefers-reduced-motion`
- Canvas limited to a maximum 2× device pixel ratio
- Hero images are local; no video download is required
- Responsive desktop and mobile behavior included


Typography updated to Oxanium (display/UI), Rajdhani (body), and Cinzel Decorative (eerie accent marks).


Typography revision:
- Bruno Ace SC is now the primary futuristic display font.
- Rajdhani remains the readable body font.
- Oxanium is reserved for smaller technical labels.
- The Synthetic Visions heading no longer uses decorative gothic lettering.


Alien-inspired typography revision:
- Michroma is now the main display and navigation font.
- Rajdhani remains the readable body font.
- Oxanium remains for technical labels.
- Synthetic Visions uses the same readable main display font.


## Automatic Content Folders
See `CONTENT-FOLDERS-GUIDE.txt`. PHP hosting scans folders automatically. Static hosting uses `update-content.bat` to regenerate the manifest.

## JSON Metadata

Matching JSON files now visibly populate project title, description, type, date, status, and external/project links. Each content category contains an `example-project.json` template.

## Category Graphics

The six supplied biomechanical artworks are now used as the visual cards for The Archive, Active Experiments, Synthetic Visions, Motion Systems, Intelligent Machines, and About Paul Booth. The original unaltered photograph remains in the main About section.

## Fixed Background and Glass Panels

The repeating biomechanical page background is now fixed to the viewport while scrolling. All major section containers, cards, forms, and boxed panels use semi-transparent smoked-glass backgrounds so the wall texture remains visible through them.


Panel opacity reduced slightly so more of the fixed biomechanical background shows through.


## Babylon Black Project
Dedicated project page: `projects/babylon-black/index.html`. Includes optimized embedded music video, audio player, track slots, and a nine-image cinematic gallery.


Babylon Black update: the Songs playlist artwork frame now uses a square responsive aspect ratio and `object-fit: contain`, so the full image is visible without cropping.


Update: Zion Lost remains in The Archive and has been moved from Active Experiments into Motion Systems as the featured motion project.
