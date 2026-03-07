# Fontainebleau Muslim Association (FMA) — Website

Official website for the Fontainebleau Muslim Association, a Non-Profit Company (NPC) serving the Muslim community of Fontainebleau, Randburg, Johannesburg, South Africa.

## Tech Stack

- **Jekyll** — static site generator (GitHub Pages native)
- **GitHub Pages** — free hosting with automatic SSL
- **MasjidBoard Live** — prayer and iqamah times (embedded iframe)
- **Google Sheets** — CMS for announcements and programmes
- **LiveMasjid.com** — live audio streaming (pending registration)

## Local Development

```bash
# Install dependencies (requires Ruby 3+)
bundle install

# Start dev server
bundle exec jekyll serve

# Site available at http://localhost:4000
```

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, MasjidBoard prayer times, announcements, fundraising banner |
| About | `/about/` | Masjid info, mission, current campaign |
| Prayer Times | `/prayer-times/` | Full MasjidBoard Live embed |
| Programmes | `/programmes/` | Weekly schedule from Google Sheets |
| Listen Live | `/listen-live/` | LiveMasjid.com audio player |
| Gallery | `/gallery/` | Photo gallery (placeholder) |
| Donate | `/donate/` | FNB banking details, Ramadan campaign |
| Contact | `/contact/` | Committee contacts, address, Google Maps |

## Configuration

### MasjidBoard Live

The board URL is set in `_config.yml` under `masjidboard_url`. Change it to FMA's board once registered.

### Google Sheets

1. Create a Google Sheet with tabs: **Announcements**, **Programmes**
2. Publish each tab: File > Share > Publish to web > CSV
3. Update the URLs in `assets/js/sheets.js`

## Deployment

Push to `main` branch — GitHub Pages builds and deploys automatically.

## Cost

R105/year for the `.org.za` domain. Everything else is free.
