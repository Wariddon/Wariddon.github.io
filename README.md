# Wariddon Rattanamalee Portfolio

Personal software engineering portfolio published with GitHub Pages.

Live website: https://wariddon.github.io/

## Run locally

Serve this directory with a static HTTP server, then open its local address.
No package installation or build step is required.

## Structure

- `index.html`: profile, selected case studies, experience and contact
- `styles.css`: responsive layout, typography and reduced motion support
- `script.js`: accessible menu, project filters and email copy action
- `resume.html`: responsive two-page resume reader, text version and PDF download
- `presentation.html`, `presentation.js`: 17-slide interview presentation with
  keyboard navigation, full-screen mode, thumbnails and direct slide links
- `materials.css`: resume and presentation layouts
- `assets/Wariddon_Rattanamalee_Resume.pdf`: downloadable resume
- `assets/Wariddon_Rattanamalee_Presentation.pdf`: downloadable presentation
- `assets/slides/`: rendered slides from the maintained presentation

The case studies describe selected personal contributions at a high level.
This repository contains no employer source code, internal endpoints, credentials,
customer records or operational access.

## Update

Edit the static files and push to the configured Pages branch. Replace the PDF
in `assets` when the resume changes. The website uses relative asset paths.

## Presentation controls

Open `presentation.html`. Use Left/Right or Page Up/Page Down to navigate,
Home/End for the first/last slide, and F for presentation mode. Escape exits.
Presentation mode also requests native full screen when the browser permits it.
The slide overview supports direct selection. Phones support horizontal swipes.
Links such as `presentation.html#slide=8` open a specific slide.

© 2026 Wariddon Rattanamalee. All rights reserved.

## Application views

- `/?focus=backend` puts backend/cloud cases and backend skills first.
- `/?focus=fullstack` puts application/integration cases and web skills first.
- `presentation.html?deck=short` opens the 7-slide, approximately 5-minute deck.
- `presentation.html?deck=full` opens the full 17-slide presentation.
- Both presentation modes have their own PDF download and a final portfolio QR.
- `assets/social-preview.png` is the 1200 x 630 Open Graph and Twitter card.

The project previews show actual interface components running locally with
synthetic fixtures. The order preview has a simplified surrounding shell.
No employer source code or customer data is included in this public repository.
