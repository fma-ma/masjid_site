# Google Sheets Setup Guide

This guide explains how to set up the Google Sheet that powers the **Announcements** and **Programmes** sections of the FMA website.

The website fetches data directly from a published Google Sheet on every page load — no redeploy needed. You edit the spreadsheet, and the site updates automatically.

---

## Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it something recognisable, e.g. **FMA Website Data**.
3. You need **two tabs** (sheets) — one for announcements and one for programmes. Rename the default tab and add a second one.

---

## Step 2: Set up the Announcements tab

Name this tab **Announcements** (the name is for your reference only — it doesn't affect the site).

Create these column headers in **Row 1** (spelling must be exact):

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Date     | Title    | Category | Body     |

### Column definitions

- **Date** — The date of the announcement in `YYYY-MM-DD` format (e.g. `2026-03-15`). Used for sorting (newest first).
- **Title** — Short headline displayed as the card title.
- **Category** — A label like `Announcement`, `Fundraising`, `Event`, `Reminder`. Displayed as a badge on the card.
- **Body** — The full announcement text. Keep it to 1–2 sentences for best display.

### Example row

| Date       | Title                      | Category     | Body                                                                 |
|------------|----------------------------|--------------|----------------------------------------------------------------------|
| 2026-03-15 | Ramadan Timetable Available | Announcement | The Ramadan timetable is now available. Collect from the masjid or view on the Prayer Times page. |

---

## Step 3: Set up the Programmes tab

Name this tab **Programmes**.

Create these column headers in **Row 1** (spelling must be exact):

| Column A | Column B  | Column C | Column D | Column E |
|----------|-----------|----------|----------|----------|
| Day      | Programme | Time     | Speaker  | Type     |

### Column definitions

- **Day** — Day of the week (e.g. `Monday`, `Friday`).
- **Programme** — Name of the class, talk, or event (e.g. `Taleem`, `Jumu'ah Bayaan`).
- **Time** — When it takes place (e.g. `After Maghrib`, `12:30`).
- **Speaker** — Name of the speaker or facilitator.
- **Type** — Category of programme. Use one of: `Children`, `Youth`, `Ladies`, `Social`, or leave blank for general programmes. The website groups and filters programmes by this value.

### Example rows

| Day       | Programme           | Time          | Speaker         | Type     |
|-----------|---------------------|---------------|-----------------|----------|
| Monday    | Taleem              | After Maghrib | Moulana Saleem  |          |
| Saturday  | Madrasah            | 09:00         | Ustadh Bilal    | Children |
| Friday    | Youth Halaqah       | After Isha    | Moulana Ismail  | Youth    |
| Sunday    | Ladies Ta'leem      | 10:00         | Apa Fatimah     | Ladies   |
| Saturday  | Community Braai     | 12:00         |                 | Social   |

---

## Step 4: Publish the sheet to the web

Each tab must be published separately as a CSV.

For **each tab**, do the following:

1. Open the spreadsheet in Google Sheets.
2. Go to **File → Share → Publish to web**.
3. In the dialog:
   - Under **Link**, select the specific tab name (e.g. "Announcements").
   - Change the format from "Web page" to **Comma-separated values (.csv)**.
4. Click **Publish**.
5. Copy the URL that appears.

You will get two URLs — one for Announcements, one for Programmes. They look like:

```
https://docs.google.com/spreadsheets/d/e/2PACX-XXXXXX.../pub?gid=0&single=true&output=csv
```

---

## Step 5: Add the URLs to the site config

Open `_config.yml` in the repository and find the `sheets` section:

```yaml
sheets:
  announcements: ""
  programmes: ""
```

Paste the published CSV URLs between the quotes:

```yaml
sheets:
  announcements: "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv"
  programmes: "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=123456&single=true&output=csv"
```

Commit and push the change. After the site redeploys, it will start pulling live data from your Google Sheet.

---

## How updates work

- The website fetches the CSV **every time a visitor loads the page**.
- Edit the Google Sheet → changes appear on the site within a few seconds (no deploy needed).
- To add a new announcement, just add a new row. To remove one, delete the row.
- Announcements are automatically sorted by date (newest first).

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Data not showing up | Check that the sheet is still published (File → Share → Publish to web → Published content). |
| Columns not mapping correctly | Ensure Row 1 headers match exactly: `Date`, `Title`, `Category`, `Body` for Announcements; `Day`, `Programme`, `Time`, `Speaker`, `Type` for Programmes. |
| "No announcements at this time" | Either the URL is empty/wrong in `_config.yml`, or the sheet has no data rows below the header. |
| Changes not appearing | Google Sheets publishing can cache for up to 5 minutes. Wait and refresh. |
| Sheet was accidentally unpublished | Re-publish using File → Share → Publish to web. The URL stays the same. |
