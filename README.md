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

Project illustrations explain the workflows using original shapes and text.

## Company highlights

The selected work section includes six visual highlights across five career contexts:
SCB, InblackM, TISCO, CAT Telecom and Thai Insurance. SCB is the primary banking role.
The company selector filters both highlights and case details. Direct links such
as `/?company=tisco#work` can be shared and combined with `focus=backend` or
`focus=fullstack`. There are nine case details in total.

Artwork is documented in `assets/project-previews/README.md`.


## Career film

The career videos use newly drawn title and workflow cards. Names appear as text. The English films have locally synthesized narration, synchronized captions and transcripts. [Narration credits](assets/video/VOICE-CREDITS.md).

## Interview flow and video highlights

- `video.html?cut=short&lang=en` opens a 45-second edit; `cut=full` keeps the 141.5-second story.
- `t` is a start time in seconds, clamped to the loaded video's duration. Chapter links include `cut`, `lang` and `t`.
- Related case links follow the active chapter. Read-along text supports either language, sentence seeking and optional following.
- `interview.html` guides film → short slides → selected cases → resume. Presentation/resume frames load on demand.
- Changing interview steps sends a same-origin `portfolio:pause` message to the film; embedded playback has no autoplay.
- `embed=1` strips surrounding navigation for interview frames. Standalone routes keep their full controls.
- Present mode supports native fullscreen when available and a CSS presentation layout as a fallback; Escape exits.
