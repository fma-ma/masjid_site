# Technical Architecture and Implementation Strategy for Digital Masjid Infrastructure in South Africa

The digital transformation of community-based religious institutions in South Africa requires a nuanced understanding of local infrastructure constraints, financial sustainability, and the necessity of long-term administrative ease. For a programmer tasked with developing a masjid website, the primary challenge lies in creating a sophisticated system that integrates disparate services such as LiveMasjid.com and MasjidBoard Live while ensuring that the final product can be managed by a non-technical volunteer with minimal risk of technical failure. This necessitates an architecture that prioritises automation, local latency optimisation, and robust security hardening.

---

## Masjid Profile: Fontainebleau Muslim Association (FMA)


| Detail             | Value                                                                            |
| ------------------ | -------------------------------------------------------------------------------- |
| **Name**           | Fontainebleau Muslim Association (FMA)                                           |
| **Type**           | NPC (Non-Profit Company)                                                         |
| **Address**        | 10 Silver Pine Avenue, Moret (parallel to Rabie Street), Fontainebleau, Randburg |
| **City**           | Johannesburg, Gauteng, South Africa                                              |
| **Bank**           | FNB                                                                              |
| **Account Name**   | Fontainebleau Muslim Association NPC                                             |
| **Account Number** | 6317 000 5285                                                                    |
| **Swift Code**     | FIRNZAJJ                                                                         |
| **Donation Type**  | Lillah Only                                                                      |


### Key Contacts


| Name                             | Phone        |
| -------------------------------- | ------------ |
| Moulana Muhammed Saleem Bakharia | 084 017 9748 |
| Abdur Razzaak Lambat             | 083 980 6001 |
| Mohammed Dockrat                 | 082 562 5530 |


### Current Fundraising Campaign (Ramadan 2026)

The masjid is running a Ramadan fundraising campaign — "Multiply The Reward x 70: An opportunity for Sawaab e Jaariyaa both for Living and Marhuum."

- **Target:** R2.5M
- **Raised so far:** R1.35M (Alhumdulillah)
- **Loan due:** R900k by 10 March 2026
- **Funds needed for:** Loan repayment, carpets for Salaah area, toilets, Wudu Khanna, ladies facilities

### Registration TODOs

- Register FMA on **MasjidBoard Live** (Core Package, free) — [masjidboard.live](https://masjidboard.live)
- Register FMA on **LiveMasjid.com** for audio streaming — [livemasjid.com](https://livemasjid.com)
- Register `.org.za` domain (e.g., `fma.org.za` or `fontainebleaumasjid.org.za`) via xneelo

---

## Localised Infrastructure and the South African Digital Context

Establishing a digital presence for a masjid begins with the selection of a domain and hosting environment that reflects the institution's local identity and respects the economic realities of the South African internet landscape. The South African market is characterised by high data costs, estimated at **R78 per GB** — roughly three times higher than many developed markets. This cost pressure directly influences user behaviour, as nearly **53% of South African visitors will abandon a website if it takes more than three seconds to load**. Consequently, the technical architecture must be optimised for speed and efficiency to ensure accessibility for congregants using mobile data.

### Domain Strategy for Non-Profit Organisations

In South Africa, the `.org.za` second-level domain (SLD) is the standard for non-profit and community organisations. It signals a non-commercial, community-focused mission to both users and search engines. Registration follows a "first come, first served" principle and is generally unrestricted, although some registrars require a South African presence or residency.


| Registrar            | Initial Registration (ZAR) | Annual Renewal (ZAR) | Latency and Support              |
| -------------------- | -------------------------- | -------------------- | -------------------------------- |
| **xneelo**           | R105                       | R105                 | Local Data Centres, 24/7 Support |
| **Afrihost**         | R197 (R0 if hosted)        | R99                  | Local Support, WhatsApp Chat     |
| **101domain**        | ~R265 ($14.49 USD)         | ~R585 ($31.99 USD)   | International, Currency Risk     |
| **America Registry** | ~R920 ($50.49 USD)         | ~R920 ($50.49 USD)   | International, High Premium      |


Local providers like **xneelo** and **Afrihost** offer significant advantages. xneelo provides a flat-rate reseller plan and managed servers powered by their own infrastructure, ensuring a **99.9% uptime guarantee** and built-in DDoS protection. Afrihost offers a competitive model where the domain registration fee is waived when bundled with a hosting package, and their month-to-month contracts provide the flexibility required by community-funded organisations.

### Web Hosting Paradigms: Shared vs. Static

The choice of hosting environment dictates the maintenance burden.

**Shared hosting** remains the pragmatic choice for most masaajid due to the availability of one-click WordPress installations and managed security. xneelo's basic hosting packages start at **R99/month**, providing 15GB of SSD storage and unlimited traffic. These packages include Let's Encrypt SSL certificates, essential for securing donation forms.

**Static site hosting** platforms such as Wasmer, Cloudflare Pages, or Netlify offer superior performance and security. Static hosting delivers pre-rendered HTML files directly to the user via a Global CDN, eliminating database calls and reducing server-side vulnerabilities. Wasmer's free tier supports custom domains and provides 150GB of bandwidth — excellent for a low-cost implementation. However, the trade-off is content management complexity. Without a traditional database, updates must be managed through a Git-based workflow or a headless CMS, which may exceed the capabilities of a non-technical admin unless a user-friendly interface like Decap CMS is meticulously configured.

---

## Content Management Systems for Simplified Administration

The cornerstone of the masjid website's success is its Content Management System (CMS). The system must allow an administrator to update prayer times, announcements, and events without technical assistance.

### WordPress as the Monolithic Standard

WordPress is the most widely adopted CMS globally, powering over 40% of all websites. Its dominance in the masjid sector is attributed to its vast repository of plugins and themes tailored for religious organisations. Themes like **"Shaha"** or **"Alquran"** come pre-configured with prayer time displays, donation systems, and sermon management modules.

The ease of use provided by visual builders such as **Elementor**, **Divi**, or the native **Gutenberg block editor** allows non-technical staff to see changes in real-time. However, the programmer must be wary of "plugin bloat," which can slow down the site and introduce security risks.

### Headless CMS and the Modern Decoupled Approach

For a more robust and scalable architecture, a headless CMS such as **Sanity.io** or **Strapi** offers a modern alternative. A headless CMS separates the content (the "body") from the presentation layer (the "head"), allowing the programmer to build a highly optimised frontend using frameworks like **Next.js** or **Astro**, while the admin uses a structured "Studio" to enter data.


| Feature          | WordPress (Traditional) | Sanity.io (Headless)  |
| ---------------- | ----------------------- | --------------------- |
| Initial Setup    | Easy (One-click)        | Complex (Custom Dev)  |
| Admin Experience | Visual / WYSIWYG        | Structured Data       |
| Performance      | Can be slow / heavy     | Exceptional / Fast    |
| Security         | Vulnerable to plugins   | High (No DB exposure) |
| Cost             | Free + Hosting          | Free Tier available   |


Sanity.io is noted for its real-time collaboration features (similar to Google Docs), allowing multiple team members to edit content simultaneously. However, the "blank canvas" nature of headless systems means that simple features like a block editor or SEO helpers must be built from scratch. For a masjid project, WordPress may be a more efficient choice for rapid deployment and ease of maintenance.

### Google Sheets as a CMS (Chosen for FMA)

For an admin who does not have a GitHub account and is not technical, **Google Sheets** offers the most familiar and accessible content management experience. Everyone knows how to edit a spreadsheet — no training needed for the basics.

#### How It Works

1. The admin edits content in a shared Google Sheet (announcements, programme schedules, contact details)
2. The sheet is published as a public CSV or accessed via a lightweight API service
3. The static site reads the sheet data at build time or via client-side JavaScript at page load
4. Content updates appear on the website without the admin touching any code

#### Implementation Options


| Approach                    | How It Works                                                        | Pros                                               | Cons                                                     |
| --------------------------- | ------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| **Google Sheets CSV API**   | Sheet published to web → fetched as CSV → parsed by JS on page load | Free, no middleware, real-time                     | Sheet must be public, raw CSV parsing                    |
| **SheetDB**                 | Google Sheet → REST JSON API → fetched by site JS                   | Clean JSON, easy to use, free tier (500 req/month) | Third-party dependency, rate-limited                     |
| **Build-time fetch**        | Script pulls sheet data at build → generates static HTML → deploy   | Fastest page load, no client-side API calls        | Requires a rebuild to update (can be automated via cron) |
| **Cloudflare Worker proxy** | Worker fetches sheet → caches → serves JSON to site                 | Fast, cached, no rate limits, free                 | Slightly more dev setup                                  |


#### Why This Suits FMA

- **No GitHub account needed** — the admin only interacts with Google Sheets
- **Familiar interface** — spreadsheets require no training
- **Real-time collaboration** — multiple committee members can edit simultaneously
- **Version history** — Google Sheets tracks all changes automatically
- **Mobile editing** — the Google Sheets app works on any phone
- **Free** — no cost for Google Sheets or the Sheets API

#### What the Admin's Google Sheet Looks Like

**Announcements sheet:**


| Date       | Title                       | Category       | Body                            |
| ---------- | --------------------------- | -------------- | ------------------------------- |
| 2026-03-01 | Ramadan Timetable Available | Announcement   | The Ramadan timetable is now... |
| 2026-03-02 | Janaazah Notice             | Funeral Notice | Inna lillahi wa inna ilayhi...  |


**Programmes sheet:**


| Day    | Programme      | Time          | Speaker        |
| ------ | -------------- | ------------- | -------------- |
| Monday | Taleem         | After Maghrib | Moulana Saleem |
| Friday | Jumu'ah Bayaan | 12:30         | Guest Speaker  |


The developer builds the site to read from these sheets. The admin just fills in rows.

---

## Integration of MasjidBoard Live and Prayer Time Automation

A primary requirement for a South African masjid is the integration of prayer times. **MasjidBoard Live** is a locally developed ecosystem that provides a synchronised experience between the physical board in the masjid, mobile devices, and the website.

### MasjidBoard Live Packages and Capabilities


| Package     | Cost               | Key Features                       |
| ----------- | ------------------ | ---------------------------------- |
| **Core**    | Free               | Listing, Mobile Webpage, Search    |
| **Premium** | USD 400 (Once-off) | On-site software, Suburb sync, PWA |


The **Core Package** is a free-listing service that adds the masjid to an international database, making its iqamah times searchable via geolocation on Google Maps. Every registered masjid receives a personal webpage optimised for smartphone browsers.

The **Premium Package** involves on-site software for digital noticeboards. It requires a computer with at least an i3-6th generation processor and 4GB of RAM, running Windows 10 or 11. Integration into a custom website is typically achieved through an **iframe** or by linking to the masjid's unique board URL. When the Imam or an authorised admin updates the times via a mobile app or computer, the changes are instantly reflected across all platforms.

A unique feature of MasjidBoard Live is the ability to synchronise suburb-based community broadcasts and funeral notices. Notices posted on a single board can be displayed across all integrated boards in a specific suburb.

### Alternative Widget-Based Integrations

- **Masjidal** — Offers a WordPress plugin that uses a "Masjid ID" to fetch daily and monthly timings. Shortcodes such as `[single_view_calendar]` for a full display or `[masjidal_iqamah_fajr]` for specific times can be placed in headers or footers.
- **Muslim Prayer Times plugin** — Allows "Iqama Rules" to be set (e.g., 15 minutes after Athan). Once the rule is set, the admin only needs to update the Athan times. Also supports Jumu'ah management and Hijri date conversion with manual adjustment options.

---

## LiveMasjid.com: Real-Time Audio Streaming Architecture

**LiveMasjid.com** is the definitive platform for audio streaming within the South African Muslim community, hosting over 350 masaajid and ulema.

### Hardware: The PI Streamer Implementation

The PI Streamer is a dedicated hardware solution built on the Raspberry Pi platform, designed to be installed near the masjid's amplifier or mixer and run 24/7 without manual intervention. The device only streams when it detects audio on the feed.


| Component    | Recommendation                | Function                           |
| ------------ | ----------------------------- | ---------------------------------- |
| Processor    | Raspberry Pi 3B+ or Pi 4      | Core Computing Unit                |
| Audio Input  | USB Sound Card                | Captures analog audio from mixer   |
| Power Supply | Official Raspberry Pi 5V 2.5A | Ensures stability                  |
| Network      | 3G/4G USB Dongle              | Connection for non-fibre locations |
| Audio Cable  | RCA to 3.5mm Jack             | Feeds mixer output to Pi           |


Installation involves connecting the mixer's "Headphone" or "AUX" out to the MIC input of the USB sound card. Once powered on, the device creates a WiFi hotspot called **"Pi3-streamer"**, allowing access to a configuration page at IP `172.24.1.1`. For ulema who travel, ad-hoc streaming is possible using smartphones with apps like **"Broadcastmyself"** (Android) or **"KoalaSan"** (iOS).

### Web Integration: Embedding the Audio Player

The LiveMasjid server uses the **Icecast V2 protocol**, which is natively supported by the HTML5 `<audio>` tag. Avoid Flash-based players — they are not supported by modern mobile devices.

A common technical hurdle is the **"Mixed Content" error**, where a secure website (HTTPS) tries to load an insecure audio stream (HTTP). Browsers like Chrome will block these streams. Ensure that the LiveMasjid mount point (e.g., `https://livemasjid.com/masjidname.mp3`) is served over HTTPS. A dedicated "Listen Live" page or a sticky footer widget is recommended. Providing "Tune-In" links for apps like VLC or TuneIn is also best practice.

**Data Requirement Estimate:**

$$\text{Stream Bitrate (24 kbps)} \times \text{Hours per Day} \approx 500 \text{ MB/Month}$$

---

## Digital Fundraising and Financial Sustainability

In the South African context, the ability to collect donations for Lillah, Zakat, and Sadaqah through the website is vital.

### Payment Gateway Analysis


| Gateway      | Card Fee     | EFT Fee       | Monthly/Setup Fee     |
| ------------ | ------------ | ------------- | --------------------- |
| **PayFast**  | 3.5% + R2.00 | 2.0% (Min R2) | R0 (R8.70 Payout Fee) |
| **SnapScan** | 2.5% – 2.95% | N/A           | R0                    |
| **Yoco**     | 2.6% – 2.95% | N/A           | R0                    |
| **Ozow**     | N/A          | 1.5% – 2.5%   | R0                    |


**PayFast** is often the most suitable "all-in-one" solution. It supports credit cards (Visa/Mastercard), Instant EFT (Ozow), and mobile QR codes (SnapScan/Zapper) through a single integration. PayFast offers a specific account type for Non-Profit Organisations (NPOs).

**SnapScan** is excellent for mobile-heavy audiences — donors pay by scanning a QR code without entering any bank details. A WooCommerce plugin adds a "Pay with SnapScan" option to the checkout page.

### Implementing Managed Donation Campaigns

Dedicated donation plugins like **"Charitable"** or **"GiveWP"** allow the masjid to manage specific funds such as "Ramadan Food Parcels" or "Masjid Extension". These plugins support PayFast via official add-ons, enabling automated recurring donations. The "Charitable" plugin provides a "Sweep it clean" tool to delete test donations before the site goes live.

---

## Administrative Guardrails and System Hardening

A major goal is to ensure that the non-technical admin cannot inadvertently cause a system failure.

### Locking Down the Admin Interface

The standard WordPress "Administrator" role is too permissive for a non-technical user. A custom role should be created that permits only:

- Updating prayer times through the Masjidal or Muslim Prayer Times interface
- Posting announcements or events via the block editor
- Managing donation reports in the Charitable plugin

Plugins like **"User Role Editor"** allow the programmer to strip away dangerous capabilities (deactivating plugins, changing themes, editing code). **"Protect Admin"** can hide the programmer's master account from other admins. For static or headless sites, **Decap CMS** can be configured to restrict access to specific collections or fields.

### Security Best Practices

- **Wordfence Security** — Endpoint firewall, malware scanner, and login protection by banning IPs after failed attempts.
- **Hide Login** — Changing the login URL from `/wp-admin` to a custom path stops 99% of automated bot attacks.
- **Cloudflare WAF** — Free Web Application Firewall providing DDoS protection and geo-blocking.
- **Automatic Backups** — UpdraftPlus scheduled daily off-site backups to Google Drive or Dropbox ensures recovery in minutes.

---

## Knowledge Transfer and Long-Term Maintenance

The success of a programmer-led project in a non-technical environment is determined by the quality of the "handover."

### Visual Documentation and Walkthroughs

Instead of a static PDF manual, provide short, task-oriented video tutorials. **Loom** is ideal — record screen and voice simultaneously demonstrating tasks like "How to change the Jumu'ah khateeb" or "How to update the Isha iqamah time". These videos can be embedded directly into the WordPress dashboard using a custom "Help" widget.

### Integrated Knowledge Bases

For more complex organisations, a dedicated **"Heroic Knowledge Base"** plugin can host searchable instructions. For developer-centric documentation, **GitHub Wikis** or **ReadMe.com** can maintain the technical documentation, including the Raspberry Pi streaming configuration and PayFast merchant identifiers.

---

## GitHub Pages: The Free Hosting Alternative

**GitHub Pages** is a free static site hosting service from GitHub that eliminates monthly hosting costs entirely. For a masjid site that is primarily informational — prayer times, announcements, donation links, and an audio stream embed — it is more than sufficient.

### What GitHub Pages Provides

- **Free hosting** with no monthly fees
- **Free SSL** (HTTPS via Let's Encrypt, automatic provisioning)
- **Custom domain support** — a `.org.za` domain can be pointed directly to GitHub Pages
- **Global CDN** via Fastly — excellent performance, including for South African mobile users
- **1GB storage limit** and **100GB/month bandwidth** (soft limits, generous for an informational site)

### Custom Domain on GitHub Pages

GitHub Pages fully supports custom domains. Visitors see `www.yourmasjid.org.za` in their browser, not `username.github.io`. The only cost is the domain registration itself.


| Item                      | Cost                      |
| ------------------------- | ------------------------- |
| GitHub Pages hosting      | **R0**                    |
| SSL certificate           | **R0** (automatic)        |
| CDN                       | **R0** (included)         |
| `.org.za` domain (xneelo) | **R105/year**             |
| **Total**                 | **R105/year (~R9/month)** |


Compared to WordPress on shared hosting (R105/year domain + R99/month hosting = ~R1,293/year), GitHub Pages reduces the annual cost by over **90%**.

### Can WordPress Run on GitHub Pages?

**No — not directly.** GitHub Pages only serves static files (HTML, CSS, JS). WordPress requires PHP and a MySQL database running on a server.

The available approaches on GitHub Pages are:


| Approach                                        | Complexity              | Admin-Friendliness                                                              |
| ----------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------- |
| **Jekyll** (built-in to GitHub Pages)           | Low                     | Requires editing Markdown files or using a CMS layer                            |
| **Hugo / Astro / Next.js (static export)**      | Medium                  | Same — Markdown or CMS layer needed                                             |
| **Decap CMS (formerly Netlify CMS)**            | Medium setup, then easy | Browser-based admin panel on top of a static site — closest to a WordPress feel |
| **WordPress as headless CMS + static frontend** | High                    | Admin uses WordPress dashboard, public site is static                           |


### The Practical Middle Ground: Static Site + Decap CMS

The most realistic "free and easy to maintain" approach:

1. **GitHub Pages** for hosting (free)
2. **Jekyll or Hugo** as the static site generator
3. **Decap CMS** for the admin interface — gives a browser-based editor (similar to WordPress) that commits changes to the GitHub repo behind the scenes
4. **Embed LiveMasjid.com** audio via HTML5 `<audio>` tag (works fine on static sites)
5. **Link out to PayFast** hosted payment page for donations (no server-side code needed)
6. **Embed MasjidBoard Live** via iframe for prayer times

### GitHub Pages vs. WordPress on Shared Hosting


|                         | GitHub Pages (Static)                      | Shared Hosting + WordPress                               |
| ----------------------- | ------------------------------------------ | -------------------------------------------------------- |
| **Cost**                | R105/year (domain only)                    | ~R1,293/year                                             |
| **Admin ease**          | Requires Decap CMS setup                   | WordPress dashboard — familiar and intuitive             |
| **Prayer time plugins** | Embed via iframe or API calls in JS        | Native WordPress plugins (Masjidal, Muslim Prayer Times) |
| **Donation management** | Link out to PayFast hosted page            | Full Charitable/GiveWP plugin with campaign tracking     |
| **Audio streaming**     | HTML5 embed works fine                     | HTML5 embed works fine                                   |
| **Security**            | Virtually unhackable (no server-side code) | Requires Wordfence, updates, hardening                   |
| **Maintenance**         | Near-zero if set up well                   | Plugin updates, PHP updates, backups                     |


---

## Cloudflare Pages: The Stronger Free Alternative

Upon further evaluation, **Cloudflare Pages** emerges as a superior free hosting option to GitHub Pages — particularly for a South African audience.

### Why Cloudflare Pages Over GitHub Pages

#### 1. South African Edge Nodes

This is the single most important differentiator. Cloudflare operates data centres **in Johannesburg and Cape Town**. GitHub Pages serves from Fastly's CDN, with the nearest nodes in Europe. For congregants on expensive South African mobile data (R78/GB), Cloudflare's local edge means **measurably faster load times and less data wasted on latency overhead**. In a market where 53% of users abandon sites that take more than 3 seconds to load, this matters.

#### 2. Unlimited Bandwidth

GitHub Pages has a 100GB/month soft limit. Cloudflare Pages offers **unlimited bandwidth** on the free tier. During high-traffic periods like Ramadan — when the site may see significant spikes from congregants checking prayer times, listening to taraweeh streams, and sharing announcements — this removes any concern about hitting limits.

#### 3. Enterprise-Grade DDoS Protection

Cloudflare's core business is security and CDN infrastructure. Their free tier includes the **same DDoS protection** they provide to Fortune 500 companies. GitHub Pages has basic protection but nothing comparable. For a community site that could be targeted, this is a meaningful advantage.

#### 4. Free DNS Management

Using Cloudflare as the DNS provider (free) gives fast DNS resolution, easy record management, and the option to enable their Web Application Firewall — all from a single dashboard. With GitHub Pages, DNS must be managed separately at the domain registrar.

#### 5. Free Privacy-First Analytics

Cloudflare offers free, **cookie-less web analytics** with no tracking scripts. This is important for compliance with POPIA (South Africa's Protection of Personal Information Act). GitHub Pages has no built-in analytics.

#### 6. Serverless Functions (Workers)

Cloudflare Workers allow lightweight server-side logic on the free tier (100,000 requests/day). This opens the door to features like dynamic prayer time calculations, form submissions, or API proxying — without needing a traditional server. GitHub Pages is purely static with no server-side capability.

### Head-to-Head Comparison: All Free Static Hosts


|                          | **GitHub Pages**     | **Cloudflare Pages**         | **Netlify**          | **Vercel**           |
| ------------------------ | -------------------- | ---------------------------- | -------------------- | -------------------- |
| **Cost**                 | Free                 | Free                         | Free                 | Free                 |
| **Bandwidth**            | 100GB/month (soft)   | **Unlimited**                | 100GB/month          | 100GB/month          |
| **Build minutes**        | N/A (Jekyll only)    | 500/month                    | 300/month            | 6,000/month          |
| **Global CDN**           | Fastly               | **Cloudflare (277+ cities)** | Netlify Edge         | Vercel Edge          |
| **SA edge nodes**        | No (nearest: Europe) | **Yes (JHB, CPT)**           | No (nearest: Europe) | No (nearest: Europe) |
| **Custom domain**        | Yes                  | Yes                          | Yes                  | Yes                  |
| **Free SSL**             | Yes                  | Yes                          | Yes                  | Yes                  |
| **Serverless functions** | No                   | Yes (Workers)                | Yes                  | Yes                  |
| **DDoS protection**      | Basic                | **Enterprise-grade**         | Basic                | Basic                |
| **Free analytics**       | No                   | **Yes (cookie-less)**        | No (paid)            | No (paid)            |
| **Free DNS**             | No                   | **Yes**                      | Basic                | Basic                |
| **Deploy method**        | Git push             | Git push                     | Git push             | Git push             |


### What GitHub Pages Still Does Better

- **Simpler initial setup** — Jekyll sites build automatically on push with zero configuration
- **Lower learning curve** — no build config files needed for basic Jekyll
- **Decap CMS documentation** — slightly more examples available for GitHub Pages than Cloudflare Pages

These advantages are minor and only relevant during initial setup. Once configured, the day-to-day experience is identical.

### Portability and Contingency

The static site approach ensures **zero vendor lock-in**. The site is a folder of files in a Git repository. If Cloudflare Pages ever changed terms, the same site could be deployed to any alternative in under an hour:

- **GitHub Pages** — push to a GitHub repo, enable Pages
- **Netlify** — connect the repo, auto-deploys
- **Vercel** — connect the repo, auto-deploys
- **Any shared hosting** — upload the built HTML files via FTP

The code is always portable. The architecture guarantees this.

---

## Chosen Approach: GitHub Pages (First Attempt)

After evaluating all free static hosting options, **GitHub Pages** is selected as the primary implementation approach due to:

- **Zero hosting cost** — only the domain registration (~R105/year)
- **Simplest setup** — Jekyll builds automatically on push with zero CI/CD configuration
- **100GB/month bandwidth** — more than sufficient for a 250-person congregation (estimated usage: ~10–40GB/month even under heavy load)
- **Free SSL** — automatic Let's Encrypt certificate with custom domains
- **Proven stability** — free since 2008, 18 years of continuous service
- **Full portability** — static files in Git, deployable to Cloudflare Pages, Netlify, or Vercel in minutes if ever needed

The admin experience challenge is solved by using **Google Sheets as the CMS** — the admin edits a familiar spreadsheet, and the site pulls content from it automatically. No GitHub account needed, no training on unfamiliar tools.

The code will be stored in a **GitHub repository** (for version control and hosting via GitHub Pages). Content is managed via **Google Sheets** (for admin accessibility).

> **Fallback:** If GitHub Pages ever becomes insufficient, the same site can be moved to Cloudflare Pages (JHB/CPT edge nodes, unlimited bandwidth, Workers) with minimal effort. The Cloudflare option is fully documented above for reference.

See `DEPLOYMENT.md` for the full deployment plan.

---

## Synthesis: A Strategic Implementation Roadmap

Building a "cheap and easy-to-maintain" masjid website in South Africa is a matter of integrating the right specialised services rather than reinventing the wheel.

### Site Pages (FMA)


| Page             | Purpose                                         | Content Source                   |
| ---------------- | ----------------------------------------------- | -------------------------------- |
| **Home**         | Welcome, next prayer time, latest announcement  | Google Sheets + MasjidBoard Live |
| **About**        | Masjid history, mission, committee              | Static / Google Sheets           |
| **Prayer Times** | Full daily and monthly iqamah times             | MasjidBoard Live iframe          |
| **Listen Live**  | Audio stream from the masjid                    | LiveMasjid.com HTML5 embed       |
| **Programmes**   | Weekly/monthly programmes and classes           | Google Sheets                    |
| **Gallery**      | Photos of the masjid, events, community         | Static images                    |
| **Contact**      | Address, map, phone numbers, committee contacts | Static + Google Maps embed       |
| **Donate**       | `TODO` — Pending finance committee              | —                                |


### The Developer's Implementation Checklist (GitHub Pages + Google Sheets)

1. **Domain** — Register a `.org.za` domain via xneelo (R105/year). Candidates: `fma.org.za`, `fontainebleaumasjid.org.za`.
2. **Hosting** — Deploy to GitHub Pages (free) with custom domain and automatic SSL.
3. **Static Site Generator** — Use Jekyll (built-in GitHub Pages support, zero CI/CD config needed).
4. **CMS** — Set up a shared Google Sheet for the admin to manage announcements, programmes, and contact details. Site fetches data from the sheet via the published CSV URL.
5. **Prayer Times** — Register FMA on MasjidBoard Live (Core Package, free) and embed via iframe. Supplement with the Aladhan API for header displays.
6. **Audio** — Register FMA on LiveMasjid.com. Build/install PI Streamer hardware. Embed the Icecast stream using a modern HTML5 `<audio>` player.
7. **Donations** — `TODO`: Pending consultation with finance committee. Research on PayFast, SnapScan, and Ozow is documented above. FNB banking details (Acc: 6317 000 5285) can be displayed immediately.
8. **Admin Experience** — Share Google Sheet with the admin. Provide 2-minute Loom tutorial videos for updating announcements and programmes.

### Pre-Build Registration TODOs

- [ ] Register `.org.za` domain via xneelo
- [ ] Register FMA on MasjidBoard Live (Core Package)
- [ ] Register FMA on LiveMasjid.com
- [ ] Create GitHub repository and enable GitHub Pages
- [ ] Create shared Google Sheet with announcements, programmes, and contacts tabs
- [ ] Consult finance committee on donations integration

---

By following this architecture, the programmer provides FMA with a professional, robust, and scalable digital hub at a fraction of the cost of traditional hosting. GitHub Pages eliminates monthly hosting fees and server maintenance, with a 100GB/month bandwidth limit that is more than adequate for a 250-person congregation. Google Sheets as the CMS means the admin edits content in a tool they already know — no GitHub account, no training on unfamiliar tools. Automated services like MasjidBoard Live and LiveMasjid.com keep prayer times and spiritual guidance accurate and accessible without daily technical intervention. If the masjid ever outgrows GitHub Pages, migration to Cloudflare Pages (with JHB edge nodes and unlimited bandwidth) takes under an hour. This strategic approach honours the communal spirit of the masjid while leveraging the efficiency of modern web technologies.