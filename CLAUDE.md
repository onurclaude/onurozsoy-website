# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site for Onur Özsoy (static HTML/CSS/JS, no build step) plus a small Node/Express "image console" for replacing the site's images through a web UI. Both run via Docker Compose. There are no tests or linters.

## Commands

- Run everything: `docker compose up -d --build` → site at http://localhost:5500, console at http://localhost:5500/console/admin
- Console requires `console/.env` (gitignored; copy from `console/.env.example`, sets `ADMIN_USER` / `ADMIN_PASSWORD`). The server exits at startup if `ADMIN_PASSWORD` is unset.
- Console without Docker: `cd console && npm ci && ADMIN_PASSWORD=x npm start` (listens on 4173; defaults `IMAGES_DIR`/`INDEX_HTML` to the repo root's `images/` and `index.html`).
- Site files are bind-mounted read-only into nginx, so edits to `index.html`, `css/`, `js/`, `images/` show up on refresh without rebuilding. Changes to `console/` require `--build`; changes to `nginx.conf` require restarting the `site` container.

## Architecture

- **Site**: single page `index.html` + `css/style.css` + three scripts. The hero (top section, inline-styled) is a separate piece from everything below it, which is class-based in `style.css`. Visual direction is dark, "Basedash"-style (black canvas, `#050607` cards, Newsreader serif headings, Inter body, white buttons, lavender/mint only as accents); keep new sections consistent with the tokens at the top of `style.css`.
  - `js/main.js`: nav behavior, mobile drawer, scroll reveal (`data-reveal`), contact form (builds a `mailto:` link), and the EN translation dictionary (keys like `h1a`, `sv1t`) driven by `data-i18n` attributes. The default content in `index.html` is Turkish. Every text node that changes with the language toggle needs a `data-i18n` key present in the `EN` dictionary.
  - `js/brain.js`: the hero canvas (3D brain made of small site-design cards; drag to rotate, click to scatter/gather).
  - `js/scroll.js`: writes `--p` (scroll progress) on `[data-scroll]` elements; the two tilted phones in the showcase section read it in CSS.
- **Contact form delivery**: the form POSTs JSON to `/contact`, which nginx proxies to the one unauthenticated route in `console/server.js` (honeypot field `website`, validation, 5 submissions/IP/hour, then `nodemailer` over SMTP to `MAIL_TO`, default `onur@ozsoyonur.com`, with `Reply-To` set to the visitor). It needs `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (plus `SMTP_PORT`, `SMTP_SECURE`, optional `SMTP_FROM`) in `console/.env`, see `console/.env.example`. Without them the endpoint returns 503 and the page tells the visitor to email directly. Adding a form field means updating the HTML, the `text` body in `server.js`, and nothing else (the client sends every field).
- **Fonts are self-hosted** in `css/fonts/` and declared in `css/fonts.css` (no Google Fonts request). The original Google Fonts link was malformed and never loaded; do not reintroduce a remote link without testing it returns 200.
- **Identity**: site name/domain is `ozsoyonur.com`, contact email `onur@ozsoyonur.com` (used in `index.html` and the `mailto:` in `js/main.js`).
- **nginx** (`nginx.conf`) serves the static site and reverse-proxies `/console/` and `/api/` to the `console` container (port 4173, not published to the host), forwarding the `Authorization` header. nginx is the only public entry point (:5500).
- **Image console** (`console/server.js`, UI in `console/public/index.html`): HTTP Basic Auth (`requireAuth`) guards `/console/admin` and `/api`. A hardcoded `SLOTS` list maps slot ids (e.g. `oz-portrait`) to base filenames (`portrait`) in `images/`. Uploading to `/api/upload/:slotId` writes `<base>.<ext>` (by MIME type), deletes the same slot's file with other extensions, and rewrites the `src` of `<img id="<slotId>" src="images/...">` in `index.html` via regex.
- **Console is currently detached from the page**: the redesigned `index.html` has no `<img id="oz-…">` slots (the stock photos were replaced by CSS/SVG illustration and UI mockups), so uploads succeed but change nothing visible. To reconnect a slot, add `<img id="<slotId>" src="images/<file>">` (the regex in `updateIndexHtml` expects `id` first and `src` immediately after) and keep `SLOTS` in `console/server.js` in sync. The console container mounts `images/` and `index.html` read-write at `/data/`, so it modifies tracked files in the repo.
- **nginx caching**: `nginx.conf` sends `Cache-Control: no-cache` so edited CSS/JS are revalidated; without it browsers served a stale stylesheet against new HTML.
