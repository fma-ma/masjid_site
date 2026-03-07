(function () {
  'use strict';

  /**
   * Google Sheets published CSV URLs.
   * To configure: In Google Sheets go to File > Share > Publish to web > select tab > CSV > Publish
   * Then paste the URL below.
   */
  var SHEETS = {
    announcements: '',
    programmes: ''
  };

  function parseCSV(csv) {
    var lines = csv.split('\n');
    if (lines.length < 2) return [];

    var headers = parseCSVLine(lines[0]);
    var rows = [];

    for (var i = 1; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;

      var values = parseCSVLine(line);
      var row = {};
      headers.forEach(function (h, idx) {
        row[h.trim().toLowerCase()] = (values[idx] || '').trim();
      });
      rows.push(row);
    }
    return rows;
  }

  function parseCSVLine(line) {
    var result = [];
    var current = '';
    var inQuotes = false;

    for (var i = 0; i < line.length; i++) {
      var ch = line[i];

      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          result.push(current);
          current = '';
        } else {
          current += ch;
        }
      }
    }
    result.push(current);
    return result;
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderAnnouncements(rows) {
    var container = document.getElementById('announcements');
    if (!container) return;

    if (!rows.length) {
      container.innerHTML = '<div class="announcements-empty"><p>No announcements at this time.</p></div>';
      return;
    }

    var sorted = rows.sort(function (a, b) {
      return (b.date || '').localeCompare(a.date || '');
    });

    var html = '';
    sorted.forEach(function (row) {
      html += '<article class="announcement-card">';
      if (row.category) {
        html += '<span class="category">' + escapeHTML(row.category) + '</span>';
      }
      html += '<h3>' + escapeHTML(row.title || 'Untitled') + '</h3>';
      if (row.date) {
        html += '<time datetime="' + escapeHTML(row.date) + '">' + escapeHTML(row.date) + '</time>';
      }
      if (row.body) {
        html += '<p>' + escapeHTML(row.body) + '</p>';
      }
      html += '</article>';
    });

    container.innerHTML = html;
  }

  function renderProgrammes(rows) {
    var cardsContainer = document.getElementById('programmes');
    var tableBody = document.getElementById('programmes-table-body');

    if (!rows.length) {
      if (cardsContainer) {
        cardsContainer.innerHTML = '<div class="programmes-empty"><p>No programmes scheduled at this time.</p></div>';
      }
      if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:2rem;color:var(--clr-text-muted);">No programmes scheduled.</td></tr>';
      }
      return;
    }

    if (cardsContainer) {
      var cardsHTML = '';
      rows.forEach(function (row) {
        cardsHTML += '<div class="programme-card">';
        cardsHTML += '<span class="programme-day">' + escapeHTML(row.day || '') + '</span>';
        cardsHTML += '<h3>' + escapeHTML(row.programme || row.title || '') + '</h3>';
        cardsHTML += '<div class="programme-meta">';
        if (row.time) cardsHTML += '<span>🕐 ' + escapeHTML(row.time) + '</span>';
        if (row.speaker) cardsHTML += '<span>🎤 ' + escapeHTML(row.speaker) + '</span>';
        cardsHTML += '</div></div>';
      });
      cardsContainer.innerHTML = cardsHTML;
    }

    if (tableBody) {
      var tableHTML = '';
      rows.forEach(function (row) {
        tableHTML += '<tr>';
        tableHTML += '<td>' + escapeHTML(row.day || '') + '</td>';
        tableHTML += '<td>' + escapeHTML(row.programme || row.title || '') + '</td>';
        tableHTML += '<td>' + escapeHTML(row.time || '') + '</td>';
        tableHTML += '<td>' + escapeHTML(row.speaker || '') + '</td>';
        tableHTML += '</tr>';
      });
      tableBody.innerHTML = tableHTML;
    }
  }

  function loadSheet(url, callback) {
    if (!url) {
      callback([]);
      return;
    }

    fetch(url)
      .then(function (res) { return res.text(); })
      .then(function (csv) {
        var rows = parseCSV(csv);
        callback(rows);
      })
      .catch(function (err) {
        console.warn('Failed to load sheet:', err);
        callback([]);
      });
  }

  function init() {
    if (SHEETS.announcements) {
      loadSheet(SHEETS.announcements, renderAnnouncements);
    } else {
      renderAnnouncements(getDemoAnnouncements());
    }

    if (SHEETS.programmes) {
      loadSheet(SHEETS.programmes, renderProgrammes);
    } else {
      renderProgrammes(getDemoProgrammes());
    }
  }

  function getDemoAnnouncements() {
    return [
      {
        date: '2026-03-01',
        title: 'Ramadan Timetable Available',
        category: 'Announcement',
        body: 'The Ramadan timetable is now available. Please collect from the masjid or view on the Prayer Times page.'
      },
      {
        date: '2026-03-02',
        title: 'Ramadan Fundraising Campaign',
        category: 'Fundraising',
        body: 'Multiply The Reward x 70 — R1.35M raised so far. A loan of R900k is due by 10 March. Please donate generously.'
      }
    ];
  }

  function getDemoProgrammes() {
    return [
      { day: 'Monday', programme: 'Taleem', time: 'After Maghrib', speaker: 'Moulana Saleem' },
      { day: 'Friday', programme: "Jumu'ah Bayaan", time: '12:30', speaker: 'Guest Speaker' }
    ];
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
