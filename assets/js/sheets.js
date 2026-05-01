(function () {
  'use strict';

  var SHEETS = {
    announcements: (window.SHEET_URLS && window.SHEET_URLS.announcements) || '',
    programmes: (window.SHEET_URLS && window.SHEET_URLS.programmes) || '',
    salaah: (window.SHEET_URLS && window.SHEET_URLS.salaah) || ''
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

  var PROGRAMME_TYPES = [
    { key: 'all', label: 'All' },
    { key: 'children', label: 'Children' },
    { key: 'youth', label: 'Youth' },
    { key: 'ladies', label: 'Ladies' },
    { key: 'social', label: 'Social' }
  ];

  var TYPE_ICONS = {
    children: '\uD83D\uDC67',
    youth: '\uD83E\uDDD1',
    ladies: '\uD83C\uDF3A',
    social: '\uD83C\uDF89'
  };

  function normaliseType(raw) {
    var t = (raw || '').trim().toLowerCase();
    for (var i = 1; i < PROGRAMME_TYPES.length; i++) {
      if (t === PROGRAMME_TYPES[i].key) return t;
    }
    return 'general';
  }

  function groupByType(rows) {
    var groups = {};
    rows.forEach(function (row) {
      var type = normaliseType(row.type);
      if (!groups[type]) groups[type] = [];
      groups[type].push(row);
    });
    return groups;
  }

  function buildCard(row) {
    var type = normaliseType(row.type);
    var html = '<div class="programme-card" data-type="' + type + '">';
    html += '<div class="programme-card-header">';
    html += '<span class="programme-day">' + escapeHTML(row.day || '') + '</span>';
    if (type !== 'general') {
      html += '<span class="programme-type-badge programme-type-' + type + '">' + escapeHTML(row.type || '') + '</span>';
    }
    html += '</div>';
    html += '<h3>' + escapeHTML(row.programme || row.title || '') + '</h3>';
    html += '<div class="programme-meta">';
    if (row.time) html += '<span>\uD83D\uDD50 ' + escapeHTML(row.time) + '</span>';
    if (row.speaker) html += '<span>\uD83C\uDFA4 ' + escapeHTML(row.speaker) + '</span>';
    html += '</div></div>';
    return html;
  }

  function renderProgrammes(rows) {
    var cardsContainer = document.getElementById('programmes');
    var tableBody = document.getElementById('programmes-table-body');
    var filtersContainer = document.getElementById('programme-filters');

    if (!rows.length) {
      if (cardsContainer) {
        cardsContainer.innerHTML = '<div class="programmes-empty"><p>No programmes scheduled at this time.</p></div>';
      }
      if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--clr-text-muted);">No programmes scheduled.</td></tr>';
      }
      if (filtersContainer) filtersContainer.style.display = 'none';
      return;
    }

    var groups = groupByType(rows);
    var hasTypes = Object.keys(groups).some(function (k) { return k !== 'general'; });

    if (filtersContainer && hasTypes) {
      var filtersHTML = '';
      PROGRAMME_TYPES.forEach(function (t) {
        if (t.key !== 'all' && !groups[t.key]) return;
        var icon = TYPE_ICONS[t.key] || '';
        var active = t.key === 'all' ? ' active' : '';
        filtersHTML += '<button class="programme-filter' + active + '" data-filter="' + t.key + '">';
        if (icon) filtersHTML += icon + ' ';
        filtersHTML += escapeHTML(t.label) + '</button>';
      });
      filtersContainer.innerHTML = filtersHTML;
      filtersContainer.style.display = '';

      filtersContainer.addEventListener('click', function (e) {
        var btn = e.target.closest('.programme-filter');
        if (!btn) return;
        var filter = btn.getAttribute('data-filter');
        filtersContainer.querySelectorAll('.programme-filter').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        filterProgrammes(filter, cardsContainer, tableBody);
      });
    } else if (filtersContainer) {
      filtersContainer.style.display = 'none';
    }

    if (cardsContainer) {
      var sectionOrder = ['general', 'children', 'youth', 'ladies', 'social'];
      var cardsHTML = '';

      sectionOrder.forEach(function (typeKey) {
        var typeRows = groups[typeKey];
        if (!typeRows || !typeRows.length) return;

        var sectionLabel = typeKey === 'general' ? 'General Programmes' : PROGRAMME_TYPES.reduce(function (a, t) { return t.key === typeKey ? t.label + ' Programmes' : a; }, '');
        var icon = TYPE_ICONS[typeKey] || '\uD83D\uDCD6';

        if (hasTypes) {
          cardsHTML += '<div class="programme-section" data-section="' + typeKey + '">';
          cardsHTML += '<h2 class="programme-section-title">' + icon + ' ' + escapeHTML(sectionLabel) + '</h2>';
        }

        typeRows.forEach(function (row) {
          cardsHTML += buildCard(row);
        });

        if (hasTypes) {
          cardsHTML += '</div>';
        }
      });

      cardsContainer.innerHTML = cardsHTML;
    }

    if (tableBody) {
      var tableHTML = '';
      rows.forEach(function (row) {
        var type = normaliseType(row.type);
        tableHTML += '<tr data-type="' + type + '">';
        tableHTML += '<td>' + escapeHTML(row.day || '') + '</td>';
        tableHTML += '<td>' + escapeHTML(row.programme || row.title || '') + '</td>';
        tableHTML += '<td>' + escapeHTML(row.time || '') + '</td>';
        tableHTML += '<td>' + escapeHTML(row.speaker || '') + '</td>';
        tableHTML += '<td>';
        if (type !== 'general') {
          tableHTML += '<span class="programme-type-badge programme-type-' + type + '">' + escapeHTML(row.type || '') + '</span>';
        }
        tableHTML += '</td>';
        tableHTML += '</tr>';
      });
      tableBody.innerHTML = tableHTML;
    }
  }

  function filterProgrammes(filter, cardsContainer, tableBody) {
    if (cardsContainer) {
      cardsContainer.querySelectorAll('.programme-section').forEach(function (section) {
        if (filter === 'all') {
          section.style.display = '';
        } else {
          section.style.display = section.getAttribute('data-section') === filter ? '' : 'none';
        }
      });
      cardsContainer.querySelectorAll('.programme-card').forEach(function (card) {
        if (filter === 'all') {
          card.style.display = '';
        } else {
          card.style.display = card.getAttribute('data-type') === filter ? '' : 'none';
        }
      });
    }
    if (tableBody) {
      tableBody.querySelectorAll('tr[data-type]').forEach(function (row) {
        if (filter === 'all') {
          row.style.display = '';
        } else {
          row.style.display = row.getAttribute('data-type') === filter ? '' : 'none';
        }
      });
    }
  }

  /* ---- Salaah Timetable ---- */

  var SALAAH_ARABIC = {
    'fajr': 'الفجر',
    'sunrise': 'الشروق',
    'zuhr': 'الظهر',
    'asr': 'العصر',
    'maghrib': 'المغرب',
    'esha': 'العشاء',
    'isha': 'العشاء',
    'jumuah': 'الجمعة'
  };

  function salaahRowClass(name) {
    var n = (name || '').toLowerCase();
    if (n === 'jumuah' || n === "jumu'ah" || n === 'jumah') return 'salaah-row-jumuah';
    if (n === 'sunrise' || n === 'shuruq') return 'salaah-row-sunrise';
    return '';
  }

  function renderSalaahBoard(rows, bodyId) {
    var tbody = document.getElementById(bodyId);
    if (!tbody) return;

    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="3" class="salaah-loading">Salaah times not available yet.<br>Waiting for Google Sheet data.</td></tr>';
      return;
    }

    var html = '';
    rows.forEach(function (row) {
      var name = row.salaah || row.salah || row.name || '';
      var begins = row.begins || row.start || row.athaan || row.adhan || '';
      var jamaat = row.jamaat || row.iqaamah || row.iqamah || row.congregation || '';
      var cls = salaahRowClass(name);
      var arabic = SALAAH_ARABIC[name.toLowerCase()] || '';

      html += '<tr' + (cls ? ' class="' + cls + '"' : '') + '>';
      html += '<td>' + escapeHTML(name);
      if (arabic) html += ' <span style="font-family:Amiri,serif;font-size:0.85em;opacity:0.7;">' + arabic + '</span>';
      html += '</td>';
      html += '<td>' + escapeHTML(begins) + '</td>';
      html += '<td>' + escapeHTML(jamaat) + '</td>';
      html += '</tr>';
    });

    tbody.innerHTML = html;
  }

  function formatSalaahDate(dateStr) {
    var parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return parseInt(parts[2], 10) + ' ' + months[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
  }

  function groupSalaahByDate(rows) {
    var groups = {};
    rows.forEach(function (row) {
      var dateKey = (row['effective from'] || row['effective'] || '').trim();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(row);
    });
    return groups;
  }

  function getCurrentAndFutureSalaah(rows) {
    var today = new Date().toISOString().slice(0, 10);
    var groups = groupSalaahByDate(rows);
    var dates = Object.keys(groups).filter(function (d) { return d; }).sort();

    var currentDate = '';
    var futureDates = [];

    dates.forEach(function (d) {
      if (d <= today) {
        currentDate = d;
      } else {
        futureDates.push(d);
      }
    });

    var currentRows = currentDate ? groups[currentDate] : (groups[''] || rows);

    return {
      current: currentRows || [],
      future: futureDates.map(function (d) { return { date: d, rows: groups[d] }; })
    };
  }

  function renderSalaahUpcoming(futureGroups) {
    var wrap = document.getElementById('salaah-upcoming-wrap');
    var container = document.getElementById('salaah-upcoming');
    if (!container) return;

    if (!futureGroups.length) {
      if (wrap) wrap.style.display = 'none';
      return;
    }

    if (wrap) wrap.style.display = '';

    var html = '';
    futureGroups.forEach(function (group) {
      html += '<div class="salaah-upcoming-group">';
      html += '<h4 class="salaah-upcoming-date">Effective from ' + escapeHTML(formatSalaahDate(group.date)) + '</h4>';
      html += '<table class="salaah-table salaah-table-upcoming"><thead><tr><th>Salaah</th><th>Begins</th><th>Jamaat</th></tr></thead><tbody>';
      group.rows.forEach(function (row) {
        var name = row.salaah || row.salah || row.name || '';
        var begins = row.begins || row.start || row.athaan || row.adhan || '';
        var jamaat = row.jamaat || row.iqaamah || row.iqamah || row.congregation || '';
        var cls = salaahRowClass(name);
        html += '<tr' + (cls ? ' class="' + cls + '"' : '') + '>';
        html += '<td>' + escapeHTML(name) + '</td>';
        html += '<td>' + escapeHTML(begins) + '</td>';
        html += '<td>' + escapeHTML(jamaat) + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div>';
    });

    container.innerHTML = html;
  }

  function renderSalaahDate() {
    var el = document.getElementById('salaah-date');
    if (!el) return;
    var now = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    el.textContent = now.toLocaleDateString('en-ZA', options);
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
      renderAnnouncements([]);
    }

    if (SHEETS.programmes) {
      loadSheet(SHEETS.programmes, renderProgrammes);
    } else {
      renderProgrammes([]);
    }

    renderSalaahDate();
    if (SHEETS.salaah) {
      loadSheet(SHEETS.salaah, function (rows) {
        var result = getCurrentAndFutureSalaah(rows);
        renderSalaahBoard(result.current, 'salaah-body');
        renderSalaahBoard(result.current, 'salaah-body-home');
        renderSalaahUpcoming(result.future);
      });
    } else {
      renderSalaahBoard([], 'salaah-body');
      renderSalaahBoard([], 'salaah-body-home');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
