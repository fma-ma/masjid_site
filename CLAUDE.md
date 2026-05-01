# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (requires Ruby 3+)
bundle install

# Start local dev server
bundle exec jekyll serve
# Site available at http://localhost:4000/masjid_site/
```

Deployment is automatic — push to `main` and GitHub Pages builds the site.

## Architecture

Jekyll static site hosted on GitHub Pages at `https://fma-ma.github.io/masjid_site`.

**Google Sheets as CMS** — all dynamic content (announcements, programmes, salaah times) is stored in a single Google Sheet and fetched at runtime as CSV. The data flow is:

1. `_config.yml` holds the three published-CSV URLs under `sheets.announcements`, `sheets.programmes`, `sheets.salaah`
2. `_layouts/default.html` injects those URLs into `window.SHEET_URLS` as a JS object before loading scripts
3. `assets/js/sheets.js` fetches each CSV, parses it, and renders into DOM elements by ID (`#announcements`, `#programmes`, `#salaah-body`, `#salaah-body-home`)

**Google Sheet column names** (headers are lowercased and trimmed before matching):
- Announcements tab: `Title`, `Date`, `Category`, `Body`
- Programmes tab: `Day`, `Programme`, `Time`, `Speaker`, `Type` (type values: `children`, `youth`, `ladies`, `social`)
- Salaah tab: `Salaah`, `Begins`, `Jamaat` (also accepts aliases: `Salah`/`Name`, `Athaan`/`Adhan`/`Start`, `Iqaamah`/`Iqamah`/`Congregation`)

**Salaah board special rows** — rows named `Jumuah` get gold highlight styling; rows named `Sunrise`/`Shuruq` get muted styling. Arabic names are added automatically from a lookup table in `sheets.js`.

## Pending Registrations

Two services are currently using placeholder accounts and must be updated once FMA registers:
- **MasjidBoard Live** — URL set in `_config.yml` under `masjidboard_url`
- **LiveMasjid.com** — mount name set in `_config.yml` under `livemasjid_mount`
