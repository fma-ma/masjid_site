# GitHub Pages Deployment Plan — FMA Website

Deployment strategy for the **Fontainebleau Muslim Association (FMA)** website, hosted on GitHub Pages with Google Sheets as the CMS.

---

## Phase 1: Accounts and Registration

### 1.1 Domain Registration

Register a `.org.za` domain via **xneelo** (R105/year).

Candidate domains (check availability):
- `fma.org.za`
- `fontainebleaumasjid.org.za`
- `fontainebleaumuslim.org.za`

### 1.2 GitHub Repository

- Create a new **public** repository (e.g., `fma-website`)
- GitHub Pages requires public repos on the free plan
- Enable GitHub Pages in Settings > Pages > Source: `main` branch
- The admin never interacts with GitHub — only the developer pushes code

### 1.3 Google Sheet (Admin CMS)

Create a shared Google Sheet with the following tabs:

**Tab 1: Announcements**

| Date | Title | Category | Body |
|---|---|---|---|
| 2026-03-01 | Ramadan Timetable | Announcement | The Ramadan timetable is now available... |

**Tab 2: Programmes**

| Day | Programme | Time | Speaker |
|---|---|---|---|
| Monday | Taleem | After Maghrib | Moulana Saleem |
| Friday | Jumu'ah Bayaan | 12:30 | Guest Speaker |

**Tab 3: Contacts**

| Name | Role | Phone |
|---|---|---|
| Moulana M. Saleem Bakharia | Imam | 084 017 9748 |
| Abdur Razzaak Lambat | Committee | 083 980 6001 |
| Mohammed Dockrat | Committee | 082 562 5530 |

- Share the sheet with the masjid admin (edit access)
- Publish each tab to the web (File > Share > Publish to web > CSV)
- The site reads from these published CSV URLs

### 1.4 External Service Registration — `TODO`

- [ ] Register FMA on **MasjidBoard Live** — [masjidboard.live](https://masjidboard.live) (Core Package, free)
- [ ] Register FMA on **LiveMasjid.com** — [livemasjid.com](https://livemasjid.com) (requires PI Streamer hardware)

---

## Phase 2: Project Setup

### 2.1 Static Site Generator

Use **Jekyll** — GitHub Pages natively builds Jekyll sites on push, requiring zero CI/CD configuration. This is the simplest path to deployment.

### 2.2 Project Structure

```
fma-website/
├── _config.yml              # Jekyll configuration
├── _layouts/
│   ├── default.html         # Base layout
│   ├── home.html            # Homepage layout
│   └── page.html            # Generic page layout
├── _includes/
│   ├── header.html          # Header with next prayer time
│   ├── footer.html          # Footer with audio player
│   ├── prayer-times.html    # MasjidBoard Live iframe
│   └── audio-player.html    # LiveMasjid.com HTML5 player
├── _posts/                  # Announcements (static fallback)
├── _data/
│   └── navigation.yml       # Menu structure
├── assets/
│   ├── css/
│   ├── js/
│   │   └── sheets.js        # Google Sheets fetch + render logic
│   └── images/
│       └── gallery/
├── pages/
│   ├── about.md
│   ├── prayer-times.md
│   ├── listen-live.md
│   ├── programmes.md
│   ├── gallery.md
│   └── contact.md
├── CNAME                    # Custom domain file
└── Gemfile                  # Ruby dependencies
```

### 2.3 Design Direction

- **Minimal and clean** — mobile-first, fast-loading
- Colour palette drawn from Islamic green tones or the FMA branding (blue from flyer)
- Large, legible prayer times display
- Prominent "Listen Live" button
- Responsive — must work well on low-end Android devices over mobile data

---

## Phase 3: Core Feature Implementation

### 3.1 Google Sheets Integration

The site fetches published CSV data from Google Sheets on page load and renders it into HTML. The admin edits the spreadsheet; the site updates automatically.

```javascript
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/SHEET_ID/pub?gid=0&single=true&output=csv';

async function loadAnnouncements() {
  const response = await fetch(SHEET_CSV_URL);
  const csv = await response.text();
  const rows = csv.split('\n').slice(1);
  const container = document.getElementById('announcements');

  rows.forEach(row => {
    const [date, title, category, body] = row.split(',');
    container.innerHTML += `
      <article class="announcement">
        <span class="category">${category}</span>
        <h3>${title}</h3>
        <time>${date}</time>
        <p>${body}</p>
      </article>
    `;
  });
}

loadAnnouncements();
```

Each Google Sheet tab gets its own published CSV URL. The Programmes page uses the same pattern to fetch and render the programmes tab.

### 3.2 Prayer Times Integration

**Primary: MasjidBoard Live iframe** (once registered)

```html
<div class="prayer-times-container">
  <iframe
    src="https://masjidboard.live/board/FMA_BOARD_ID"
    width="100%"
    height="400"
    frameborder="0"
    loading="lazy"
    title="FMA Prayer Times">
  </iframe>
</div>
```

**Supplementary: Aladhan API for header display**

Fetch Johannesburg prayer times for the header bar.

```javascript
fetch('https://api.aladhan.com/v1/timingsByCity?city=Johannesburg&country=SouthAfrica&method=2')
  .then(response => response.json())
  .then(data => {
    const timings = data.data.timings;
    document.getElementById('fajr').textContent = timings.Fajr;
    document.getElementById('dhuhr').textContent = timings.Dhuhr;
    document.getElementById('asr').textContent = timings.Asr;
    document.getElementById('maghrib').textContent = timings.Maghrib;
    document.getElementById('isha').textContent = timings.Isha;
  });
```

### 3.3 LiveMasjid.com Audio Streaming

Once registered, embed the Icecast stream using HTML5. Ensure the URL uses HTTPS.

```html
<div class="listen-live">
  <h2>Listen Live</h2>
  <audio controls preload="none">
    <source src="https://livemasjid.com/fma.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio>
  <p>
    <a href="https://livemasjid.com/fma.mp3">Open in VLC / TuneIn</a>
  </p>
</div>
```

### 3.4 Gallery Page

A simple image gallery using a CSS grid or lightbox library. Photos are stored in `assets/images/gallery/` and committed to the repo. The developer adds new photos via Git.

### 3.5 Contact Page

Static page with:
- FMA address: 10 Silver Pine Avenue, Moret, Fontainebleau, Randburg
- Embedded Google Maps iframe
- Committee contact numbers

```html
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!...!10+Silver+Pine+Avenue+Fontainebleau"
  width="100%"
  height="300"
  style="border:0;"
  allowfullscreen=""
  loading="lazy"
  title="FMA Location">
</iframe>
```

### 3.6 Donations Page — `TODO`

> **Deferred:** Pending consultation with the finance committee.
>
> **Immediate (no approval needed):** Display FNB banking details on a static donate page:
> - Bank: FNB
> - Account Name: Fontainebleau Muslim Association NPC
> - Account Number: 6317 000 5285
> - Swift Code: FIRNZAJJ
> - Reference: Your Name
> - Lillah Only
>
> **Future (pending finance committee):**
> - [ ] Sign-off on preferred payment gateway (PayFast, SnapScan, Ozow)
> - [ ] Confirm NPO registration for reduced gateway fees
> - [ ] Decide on fund categories (Lillah, Building Fund, Ramadan, etc.)
> - [ ] Obtain merchant credentials

---

## Phase 4: Custom Domain Configuration

### 4.1 Add CNAME File to Repository

Create a file called `CNAME` in the repository root containing only the domain:

```
www.fma.org.za
```

### 4.2 Configure DNS at Registrar (xneelo)

Add the following DNS records in the xneelo control panel:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | @ | 185.199.108.153 | 3600 |
| A | @ | 185.199.109.153 | 3600 |
| A | @ | 185.199.110.153 | 3600 |
| A | @ | 185.199.111.153 | 3600 |
| CNAME | www | your-account.github.io | 3600 |

### 4.3 Enable HTTPS in GitHub

1. Go to the repository's **Settings > Pages**
2. Under "Custom domain", enter `www.fma.org.za`
3. Check **"Enforce HTTPS"**
4. GitHub will automatically provision an SSL certificate (may take up to 24 hours on first setup)

---

## Phase 5: Deployment Workflow

### 5.1 Initial Deployment

```bash
# Clone the repository
git clone https://github.com/your-account/fma-website.git
cd fma-website

# Build locally to test (requires Ruby + Jekyll)
bundle install
bundle exec jekyll serve
# Site available at http://localhost:4000

# Deploy — push to main, GitHub Pages auto-builds
git add .
git commit -m "Initial FMA site deployment"
git push origin main
```

GitHub Pages automatically builds and deploys the Jekyll site within 1–2 minutes of each push.

### 5.2 Ongoing Content Updates

**For the admin (non-technical):**
- Open the shared Google Sheet on phone or computer
- Add/edit rows in the Announcements or Programmes tab
- Changes appear on the website automatically on next page load

**For the developer:**
- Push code/design changes via Git
- GitHub Pages rebuilds automatically
- Gallery photos: add images to `assets/images/gallery/` and push

### 5.3 Monitoring

- **GitHub Actions** — check the "Actions" tab for build status and errors
- **Uptime monitoring** — [UptimeRobot](https://uptimerobot.com/) (free, checks every 5 minutes, email/SMS alerts)

---

## Phase 6: Security

GitHub Pages static sites have a minimal attack surface:

| Measure | Implementation |
|---|---|
| **HTTPS** | Enforced via GitHub Pages settings (automatic) |
| **No server-side code** | No PHP, no database, no attack surface |
| **Content Security Policy** | Add CSP `<meta>` tags to restrict iframe sources and script origins |
| **Google Sheet access** | Only shared with named admin accounts; published CSV is read-only |
| **Repo access** | Only the developer has GitHub write access |
| **Cloudflare (optional upgrade)** | Can place the site behind Cloudflare's free CDN later for DDoS protection and JHB edge caching |

---

## Phase 7: Knowledge Transfer

### Admin Training Checklist

| Task | How | Duration |
|---|---|---|
| Adding an announcement | Edit Google Sheet → add row to Announcements tab | 2 min Loom video |
| Updating programmes | Edit Google Sheet → update Programmes tab | 2 min Loom video |
| Understanding prayer time updates | Log in to MasjidBoard Live app → update iqamah times | 3 min Loom video |
| Checking if the site is live | Visit the URL in a browser | 1-page written guide |

### Emergency Procedures

| Scenario | Action |
|---|---|
| Site is down | Check GitHub repo Actions tab for build errors. If DNS issue, contact xneelo. |
| Announcements not updating | Check Google Sheet is still published to web (File > Share > Publish). |
| Prayer times wrong | Check MasjidBoard Live admin — issue is upstream, not on the website. |
| Audio stream not working | Check LiveMasjid.com status. Verify PI Streamer is powered on and connected. |
| Need to add gallery photos | Contact the developer — photos are added via Git push. |

---

## Cost Summary

| Item | Once-off | Annual | Monthly Equivalent |
|---|---|---|---|
| `.org.za` domain (xneelo) | R105 | R105 | ~R9 |
| GitHub Pages hosting | R0 | R0 | R0 |
| SSL certificate | R0 | R0 | R0 |
| Google Sheets CMS | R0 | R0 | R0 |
| MasjidBoard Live (Core) | R0 | R0 | R0 |
| LiveMasjid.com streaming | R0 | R0 | R0 |
| Payment gateway | TBD | TBD | TBD (pending finance committee) |
| **Total** | **R105** | **R105** | **~R9 (excl. donations gateway)** |

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|---|---|---|
| Phase 1: Accounts + Registration | 1–2 days | Domain available, Google Sheet created |
| Phase 2: Project Setup | 1 day | Repo created, Jekyll configured |
| Phase 3: Core Features | 3–5 days | Google Sheets configured, MasjidBoard + LiveMasjid registered |
| Phase 4: Custom Domain | 1 day | Domain purchased, DNS propagation (up to 48hrs) |
| Phase 5: Deployment + Testing | 1 day | All phases complete |
| Phase 6: Security | 0.5 day | — |
| Phase 7: Knowledge Transfer | 1–2 days | Admin availability for training |
| **Total** | **~8–12 days** | — |

---

## Pre-Build Registration Checklist

- [ ] Register `.org.za` domain via xneelo
- [ ] Create GitHub repository (`fma-website`) and enable GitHub Pages
- [ ] Create and share Google Sheet with admin
- [ ] Register FMA on MasjidBoard Live (Core Package)
- [ ] Register FMA on LiveMasjid.com
- [ ] Consult finance committee on donations integration

---

## Fallback: Migration to Cloudflare Pages

If GitHub Pages ever becomes insufficient (unlikely for a 250-person congregation), the same site can be migrated to Cloudflare Pages in under an hour:

1. Sign up at cloudflare.com (free)
2. Connect the GitHub repo to Cloudflare Pages
3. Update DNS nameservers from xneelo to Cloudflare
4. Benefits gained: JHB/CPT edge nodes, unlimited bandwidth, Workers, free analytics

The static site architecture guarantees full portability. No code changes needed.
