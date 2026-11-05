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

## Company highlights

The selected work section includes six visual highlights across five career contexts:
Extend IT / SCB, InblackM, TISCO, CAT Telecom and Thai Insurance. SCB is the client
assignment through Extend IT Resource, rather than a separate employment entry.
The company selector filters both highlights and case details. Direct links such
as `/?company=tisco#work` can be shared and combined with `focus=backend` or
`focus=fullstack`. There are nine case details in total.

InblackM visuals are local component previews with synthetic data. The other
four visuals are labeled workflow/role illustrations, described in
`assets/project-previews/README.md`.


## Career film

`video.html` provides English/Thai narration, native video controls, bilingual captions,
chapter navigation and links to application materials. `?lang=th` opens Thai narration;
English is the default. Switching language preserves the playback position and playing state.
Each language has its own video with an embedded audio stream (WebM/Opus and MP4/AAC fallback).
The player uses one media element and requires a deliberate Play action; there is no autoplay.
Native controls provide volume, playback speed and fullscreen; captions also work in fullscreen.

The 141.5-second film describes professional experience without a spoken personal introduction.
Narration is synthetic (English: Andrew Multilingual; Thai: Niwat). The conceptual map was
generated for the film; it is not a geographic or employer architecture diagram. Interface
previews use synthetic records. The reference video inspired the map/timeline approach;
no footage, speech or music was copied from it. Claude/Codex are development tools; the
admin assistant is an implementation example, not a claim that production AI is active.
