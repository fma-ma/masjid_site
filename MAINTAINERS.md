# Site Maintainer Guide

A reference for developers and committee members maintaining the FMA website.

---

## Project Overview

This is a static [Jekyll](https://jekyllrb.com/) site hosted on GitHub Pages. It auto-deploys on every push to `main` via GitHub Actions. Content like announcements and programmes is pulled live from a Google Sheet — no redeploy needed for those updates.

**Live site:** https://fma-ma.github.io/masjid_site/
**Repository:** https://github.com/fma-ma/masjid_site

---

## Directory Structure

```
masjid_site/
├── .github/workflows/deploy.yml   ← CI/CD pipeline
├── _config.yml                    ← Site-wide settings
├── _data/navigation.yml           ← Nav menu items
├── _includes/
│   ├── header.html                ← Sticky nav bar
│   └── footer.html                ← Footer (links, banking details)
├── _layouts/
│   ├── default.html               ← Base HTML shell
│   ├── home.html                  ← Home page wrapper
│   └── page.html                  ← Standard page wrapper
├── assets/
│   ├── css/style.css              ← All styles
│   └── js/
│       ├── main.js                ← Mobile nav toggle
│       └── sheets.js              ← Google Sheets fetch + render
├── index.html                     ← Home page content
├── pages/                         ← All other pages
│   ├── about.md
│   ├── contact.html
│   ├── donate.html
│   ├── gallery.html
│   ├── listen-live.html
│   ├── prayer-times.html
│   └── programmes.html
├── pdfs/                          ← PDF exports for offline use
├── masjid/                        ← Internal docs (excluded from build)
├── Gemfile                        ← Ruby dependencies
├── GOOGLE_SHEETS_SETUP.md         ← Admin guide for Google Sheets
└── MAINTAINERS.md                 ← This file
```

---

## Local Development

### Prerequisites

- Ruby 3.x+ (macOS: `brew install ruby`)
- Bundler (`gem install bundler`)

### Running locally

```bash
bundle install
bundle exec jekyll serve --livereload
```

The site will be available at `http://127.0.0.1:4000/masjid_site/`. Changes to files auto-refresh the browser.

Note: `_config.yml` changes require restarting the server.

---

## Deployment

Deployment is fully automated. Push to `main` and GitHub Actions will:

1. Build the Jekyll site
2. Deploy to GitHub Pages

The workflow is defined in `.github/workflows/deploy.yml`. You can also trigger it manually from the Actions tab.

**There is nothing to configure on the server.** No SSH, no FTP, no hosting panel.

---

## Where to Change What

### Site settings

| What | Where |
|------|-------|
| Site title, description | `_config.yml` → `title`, `description` |
| Base URL / domain | `_config.yml` → `url`, `baseurl` |
| Timezone | `_config.yml` → `timezone` |

### Navigation

Edit `_data/navigation.yml`. Each entry has a `title` and `url`:

```yaml
- title: About
  url: /about/
```

The header and footer both read from this file automatically.

### Pages

All pages live in `pages/` (except the home page which is `index.html` in the root). Each page has front matter at the top:

```yaml
---
layout: page
title: About
subtitle: Optional subtitle
permalink: /about/
---
```

To add a new page: create a file in `pages/`, add front matter with a `permalink`, and add an entry to `_data/navigation.yml`.

### Announcements and Programmes (Google Sheets)

These are managed entirely through a Google Sheet — no code changes needed. See `GOOGLE_SHEETS_SETUP.md` for full instructions.

The published CSV URLs are stored in `_config.yml`:

```yaml
sheets:
  announcements: "https://docs.google.com/spreadsheets/d/e/..."
  programmes: "https://docs.google.com/spreadsheets/d/e/..."
```

### Prayer times (MasjidBoard)

The prayer times widget is an iframe from MasjidBoard Live. To change the board:

```yaml
# _config.yml
masjidboard_url: "https://masjidboardlive.com/boards/?your-masjid-name"
```

### Live audio (LiveMasjid)

The live audio player is embedded from LiveMasjid.com. To change the mount:

```yaml
# _config.yml
livemasjid_mount: "your-mount-name"
livemasjid_player: "https://www.livemasjid.com/minimount.php?mount=your-mount-name"
livemasjid_page: "https://www.livemasjid.com/your-mount-name"
```

### Fundraising banner

The progress bar and amounts on the home page are hardcoded in `index.html` (the `fundraising-banner` section). Update the text, percentage, and amounts directly. The same details appear in `pages/donate.html`.

### Banking details

FNB account details are in `_includes/footer.html` and `pages/donate.html`. Update both if the details change.

### Committee contacts

Contact names, numbers, and email addresses are in `pages/contact.html`.

---

## Links and the `baseurl`

Because the site is served from `https://fma-ma.github.io/masjid_site/` (not the root), all internal links **must** use the `relative_url` filter:

```html
<!-- Correct -->
<a href="{{ '/about/' | relative_url }}">About</a>

<!-- Wrong — will 404 on GitHub Pages -->
<a href="/about/">About</a>
```

The nav links in `_data/navigation.yml` are already processed through `relative_url` in the header/footer templates.

If you ever move to a custom domain (root path), set `baseurl: ""` in `_config.yml` and everything still works.

---

## Styling

All CSS is in `assets/css/style.css`. Key design tokens are defined as CSS custom properties at the top of the file (colors, fonts, spacing). Responsive breakpoints are at 640px and 1024px.

---

## Security Notes

- **Google Sheet access:** The sheet is published as read-only CSV. Only people with edit access to the Google Sheet can change what appears on the site. Keep edit access limited to trusted committee members.
- **XSS protection:** All Google Sheets data is HTML-escaped before rendering. Malicious HTML in a spreadsheet cell will display as plain text, not execute.
- **No secrets in the repo:** The CSV URLs are public (the data is public website content). There are no API keys, tokens, or credentials anywhere in the codebase.
- **GitHub Pages:** Served over HTTPS by default. HTTPS is enforced in the repo settings.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Deploy failed | Check the Actions tab on GitHub for error logs |
| Local server won't start | Make sure port 4000 is free: `lsof -i:4000` |
| Config changes not reflecting locally | Restart the Jekyll server (config changes need a restart) |
| Links 404 on GitHub Pages | Ensure they use `relative_url` filter (see Links section above) |
| Announcements not showing | Check `_config.yml` sheet URLs and that the Google Sheet is still published |
| Styles look broken | Clear browser cache or hard-refresh (`Cmd+Shift+R`) |
