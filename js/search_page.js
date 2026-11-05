/**
 * PharmaDZ - Minimalist Generic & Alternatives Search
 * Direct, streamlined, no cards:
 * Summary strip + Clean data rows (Dosage, Princeps/Générique, Importé/Local, Lab).
 */

(function () {
  'use strict';

  const I18N = {
    ar: {
      nav_back: "← الدليل الشامل (5,425 دواء)",
      site_subtitle: "بحث المادة الفعالة والبدائل (Princeps / Générique / Importé)",
      search_placeholder: "اكتب اسم الدواء فقط (مثال: Doliprane, Artiz, Augmentin, Tahor...)",
      suggestions_label: "أمثلة سريعة:",
      searched_med: "الدواء المبحوث عنه:",
      generic_substance: "المادة الفعالة (DCI):",
      therapeutic_category: "التصنيف العلاجي:",
      tab_active: "المعتمدة في السوق (Nomenclature)",
      tab_non_renewed: "غير المجددة (Non Renouvelés)",
      tab_withdrawn: "المسحوبة من السوق (Retraits)",
      filter_all: "الكل",
      no_results: "لا توجد أدوية مطابقة لمعايير البحث الحالية.",
      print_report: "طباعة",
      status_active: "🟢 معتمد",
      status_non_renewed: "🟡 غير مجدد",
      status_withdrawn: "🔴 مسحوب"
    },
    fr: {
      nav_back: "← Répertoire complet (5 425 produits)",
      site_subtitle: "Recherche DCI & Équivalents (Princeps / Générique / Importé)",
      search_placeholder: "Entrez le nom du médicament (ex: Doliprane, Artiz, Augmentin...)",
      suggestions_label: "Exemples rapides :",
      searched_med: "Produit recherché :",
      generic_substance: "Substance active (DCI) :",
      therapeutic_category: "Classe thérapeutique :",
      tab_active: "Spécialités Actives (Nomenclature)",
      tab_non_renewed: "Non Renouvelés",
      tab_withdrawn: "Retraits du Marché",
      filter_all: "Tous",
      no_results: "Aucun produit ne correspond à ces critères.",
      print_report: "Imprimer",
      status_active: "🟢 Actif",
      status_non_renewed: "🟡 Non Renouvelé",
      status_withdrawn: "🔴 Retiré"
    }
  };

  const state = {
    lang: localStorage.getItem('pharmadz_lang') || 'ar',
    theme: localStorage.getItem('pharmadz_theme') || 'light',
    selectedMed: null,
    selectedDci: null,
    activeSubTab: 'active', // 'active' | 'non_renewed' | 'withdrawn'
    filterType: 'all', // 'all' | 'RE' | 'GE' | 'I' | 'F'
    allMedsIndex: []
  };

  const db = window.NOMENCLATURE_DATA || null;

  const el = {};

  function init() {
    cacheDom();
    buildSearchIndex();
    bindEvents();
    applyTheme();
    applyLanguage();

    // Check URL parameters (e.g. search.html?q=ARTIZ)
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || urlParams.get('dci');
    if (query) {
      if (el.searchInput) el.searchInput.value = query;
      performSearch(query);
    } else {
      performSearch('DOLIPRANE');
    }
  }

  function cacheDom() {
    el.html = document.documentElement;
    el.themeBtn = document.getElementById('btn-theme-toggle');
    el.langBtn = document.getElementById('btn-lang-toggle');
    el.searchInput = document.getElementById('search-input');
    el.clearSearchBtn = document.getElementById('clear-search-btn');
    el.searchDropdown = document.getElementById('search-dropdown');
    el.suggestionChips = document.querySelectorAll('[data-suggest]');
    el.summaryContainer = document.getElementById('summary-bar-container');
    el.altsSection = document.getElementById('alts-section');
    el.altsTabs = document.querySelectorAll('.alts-tab-btn');
    el.altsFilterPills = document.querySelectorAll('[data-alt-filter]');
    el.rowsTbody = document.getElementById('minimal-rows-tbody');
    el.thExtra = document.getElementById('th-extra');
    el.printReportBtn = document.getElementById('btn-print-report');
  }

  function buildSearchIndex() {
    if (!db) return;
    const list = [];
    const pushItems = (items, sourceLabel) => {
      items.forEach(itm => {
        list.push({
          ...itm,
          sourceType: sourceLabel,
          brandLower: (itm.brand || '').toLowerCase(),
          dciLower: (itm.dci || '').toLowerCase()
        });
      });
    };

    pushItems(db.active || [], 'active');
    pushItems(db.non_renewed || [], 'non_renewed');
    pushItems(db.withdrawn || [], 'withdrawn');

    state.allMedsIndex = list;
  }

  function bindEvents() {
    el.themeBtn?.addEventListener('click', toggleTheme);
    el.langBtn?.addEventListener('click', toggleLanguage);

    let searchDebounce;
    el.searchInput?.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      el.clearSearchBtn.style.display = q ? 'block' : 'none';
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        showAutocomplete(q);
      }, 150);
    });

    el.clearSearchBtn?.addEventListener('click', () => {
      el.searchInput.value = '';
      el.clearSearchBtn.style.display = 'none';
      el.searchDropdown.style.display = 'none';
    });

    document.addEventListener('click', (e) => {
      if (!el.searchInput.contains(e.target) && !el.searchDropdown.contains(e.target)) {
        el.searchDropdown.style.display = 'none';
      }
    });

    // Suggestion chips
    el.suggestionChips?.forEach(chip => {
      chip.addEventListener('click', () => {
        const term = chip.dataset.suggest;
        el.searchInput.value = term;
        el.clearSearchBtn.style.display = 'block';
        performSearch(term);
      });
    });

    // Tabs
    el.altsTabs?.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        state.activeSubTab = tab;
        el.altsTabs.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
        renderRows();
      });
    });

    // Sub-filters (All, Princeps, Générique, Importé, Local)
    el.altsFilterPills?.forEach(pill => {
      pill.addEventListener('click', () => {
        const filter = pill.dataset.altFilter;
        state.filterType = filter;
        el.altsFilterPills.forEach(p => p.classList.toggle('active', p.dataset.altFilter === filter));
        renderRows();
      });
    });

    // Print
    el.printReportBtn?.addEventListener('click', () => {
      window.print();
    });
  }

  function showAutocomplete(query) {
    if (!query || query.length < 2) {
      el.searchDropdown.style.display = 'none';
      return;
    }

    const q = query.toLowerCase();
    const matches = state.allMedsIndex.filter(itm =>
      itm.brandLower.includes(q) || itm.dciLower.includes(q)
    ).slice(0, 10);

    if (matches.length === 0) {
      el.searchDropdown.innerHTML = `
        <div style="padding: 0.75rem; color: var(--text-muted); text-align: center; font-size: 0.85rem;">
          ${state.lang === 'ar' ? 'لا توجد نتائج مطابقة' : 'Aucun résultat trouvé'}
        </div>
      `;
      el.searchDropdown.style.display = 'block';
      return;
    }

    let html = '';
    matches.forEach(m => {
      let typeBadge = m.type === 'RE' ? '<span class="tag-princeps" style="font-size:0.65rem;padding:0.1rem 0.35rem;">Princeps</span>'
        : m.type === 'GE' ? '<span class="tag-generique" style="font-size:0.65rem;padding:0.1rem 0.35rem;">Générique</span>' : '';
      let originBadge = m.statut === 'I' ? '<span class="tag-importe" style="font-size:0.65rem;padding:0.1rem 0.35rem;">Importé</span>'
        : '<span class="tag-local" style="font-size:0.65rem;padding:0.1rem 0.35rem;">Local</span>';

      html += `
        <div class="search-dropdown-item" data-key="${m.reg || m.code}_${m.brand}">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
            <strong style="color: var(--text-main);">${m.brand}</strong>
            <div style="display: flex; gap: 0.25rem;">
              ${typeBadge}
              ${originBadge}
            </div>
          </div>
          <div style="font-size: 0.76rem; color: var(--primary-600); margin-top: 0.15rem;">
            🧬 DCI: ${m.dci} • ${m.dosage || ''}
          </div>
        </div>
      `;
    });

    el.searchDropdown.innerHTML = html;
    el.searchDropdown.style.display = 'block';

    el.searchDropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const key = item.dataset.key;
        const target = state.allMedsIndex.find(m => `${m.reg || m.code}_${m.brand}` === key);
        if (target) {
          el.searchInput.value = target.brand;
          el.searchDropdown.style.display = 'none';
          selectTargetMed(target);
        }
      });
    });
  }

  function performSearch(term) {
    if (!term) return;
    const q = term.trim().toLowerCase();
    let match = state.allMedsIndex.find(m => m.brandLower === q);
    if (!match) match = state.allMedsIndex.find(m => m.brandLower.startsWith(q));
    if (!match) match = state.allMedsIndex.find(m => m.brandLower.includes(q) || m.dciLower.includes(q));

    if (match) {
      selectTargetMed(match);
    } else {
      el.summaryContainer.innerHTML = `
        <div style="background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; text-align: center; color: var(--text-muted);">
          🔍 ${state.lang === 'ar' ? 'لم يتم العثور على دواء بهذا الاسم' : 'Aucun médicament trouvé'}
        </div>
      `;
      el.altsSection.style.display = 'none';
    }
  }

  function selectTargetMed(med) {
    state.selectedMed = med;
    state.selectedDci = (med.dci || '').trim().toUpperCase();
    renderSummaryStrip(med);
    updateTabBadges();
    renderRows();
    el.altsSection.style.display = 'block';
  }

  // Renders a sleek, single-line summary strip (No cards!)
  function renderSummaryStrip(med) {
    const t = I18N[state.lang];
    const isAr = state.lang === 'ar';
    const cat = db?.categories[med.cat_id];
    const catName = isAr ? cat?.name_ar : cat?.name_fr;

    let statusTag = '';
    if (med.sourceType === 'active') statusTag = `<span class="badge" style="background:#dcfce7;color:#15803d;">${t.status_active}</span>`;
    else if (med.sourceType === 'non_renewed') statusTag = `<span class="badge" style="background:#fef3c7;color:#b45309;">${t.status_non_renewed}</span>`;
    else statusTag = `<span class="badge" style="background:#fee2e2;color:#991b1b;">${t.status_withdrawn}</span>`;

    let typeTag = med.type === 'RE' ? '<span class="tag-princeps">⭐ Princeps</span>'
      : med.type === 'GE' ? '<span class="tag-generique">🧬 Générique</span>'
      : med.type === 'BIO' ? '<span class="tag-bio">🧪 Biosimilaire</span>' : '';

    let originTag = med.statut === 'I' ? '<span class="tag-importe">🌐 Importé</span>' : '<span class="tag-local">🇩🇿 Local</span>';

    el.summaryContainer.innerHTML = `
      <div class="minimal-summary-bar">
        <div class="summary-item">
          <span class="summary-label">${t.searched_med}</span>
          <span class="summary-val" style="font-size: 1.15rem; color: var(--text-main);">${med.brand}</span>
          ${statusTag}
          ${typeTag}
          ${originTag}
        </div>

        <div class="summary-item">
          <span class="summary-label">${t.generic_substance}</span>
          <span class="summary-dci-val">${med.dci}</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">${t.therapeutic_category}</span>
          <span class="summary-val" style="color: var(--text-muted); font-size: 0.85rem;">${cat?.icon || ''} [${med.cat_id}] ${catName || '—'}</span>
        </div>
      </div>
    `;
  }

  function updateTabBadges() {
    if (!state.selectedDci) return;
    const dci = state.selectedDci;

    const activeCount = db.active.filter(i => (i.dci || '').trim().toUpperCase() === dci).length;
    const nonRenewedCount = db.non_renewed.filter(i => (i.dci || '').trim().toUpperCase() === dci).length;
    const withdrawnCount = db.withdrawn.filter(i => (i.dci || '').trim().toUpperCase() === dci).length;

    const bActive = document.getElementById('badge-count-active');
    const bNonRenewed = document.getElementById('badge-count-non-renewed');
    const bWithdrawn = document.getElementById('badge-count-withdrawn');

    if (bActive) bActive.textContent = activeCount;
    if (bNonRenewed) bNonRenewed.textContent = nonRenewedCount;
    if (bWithdrawn) bWithdrawn.textContent = withdrawnCount;
  }

  // Renders the minimal clean table rows
  function renderRows() {
    if (!state.selectedDci || !el.rowsTbody) return;
    const t = I18N[state.lang];
    const isAr = state.lang === 'ar';
    const dci = state.selectedDci;

    let targetList = [];
    if (state.activeSubTab === 'active') targetList = db.active;
    else if (state.activeSubTab === 'non_renewed') targetList = db.non_renewed;
    else if (state.activeSubTab === 'withdrawn') targetList = db.withdrawn;

    // Filter by DCI
    let alts = targetList.filter(i => (i.dci || '').trim().toUpperCase() === dci);

    // Apply sub-filters
    if (state.filterType === 'RE') {
      alts = alts.filter(i => i.type === 'RE');
    } else if (state.filterType === 'GE') {
      alts = alts.filter(i => i.type === 'GE');
    } else if (state.filterType === 'I') {
      alts = alts.filter(i => i.statut === 'I');
    } else if (state.filterType === 'F') {
      alts = alts.filter(i => i.statut === 'F');
    }

    // Toggle extra column for Withdrawn reasons
    const isWithdrawn = state.activeSubTab === 'withdrawn';
    if (el.thExtra) {
      el.thExtra.style.display = isWithdrawn ? '' : 'none';
    }

    if (alts.length === 0) {
      el.rowsTbody.innerHTML = `
        <tr>
          <td colspan="${isWithdrawn ? 8 : 7}" style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
            🍃 ${t.no_results}
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    alts.forEach(item => {
      const isTarget = state.selectedMed && item.brand === state.selectedMed.brand && item.reg === state.selectedMed.reg;

      // Type Badge (Princeps vs Générique)
      let typeBadge = '';
      if (item.type === 'RE') {
        typeBadge = '<span class="tag-princeps">⭐ Princeps</span>';
      } else if (item.type === 'GE') {
        typeBadge = '<span class="tag-generique">🧬 Générique</span>';
      } else if (item.type === 'BIO') {
        typeBadge = '<span class="tag-bio">🧪 Biosimilaire</span>';
      } else {
        typeBadge = '<span style="color:var(--text-muted);font-size:0.75rem;">—</span>';
      }

      // Origin Badge (Importé vs Local)
      let originBadge = '';
      if (item.statut === 'I') {
        originBadge = '<span class="tag-importe">🌐 Importé</span>';
      } else if (item.statut === 'F') {
        originBadge = '<span class="tag-local">🇩🇿 Local</span>';
      } else {
        originBadge = '<span style="color:var(--text-muted);font-size:0.75rem;">—</span>';
      }

      html += `
        <tr class="${isTarget ? 'row-target' : ''}" data-brand="${item.brand}">
          <td>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <span class="med-brand-link">${item.brand}</span>
              ${isTarget ? `<span class="badge" style="background:#e0e7ff;color:#3730a3;font-size:0.68rem;padding:0.1rem 0.35rem;">${isAr ? 'الدواء المبحوث عنه' : 'Recherché'}</span>` : ''}
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace;">N° ${item.reg || '—'}</div>
          </td>
          <td style="font-weight: 700; color: var(--text-main); font-size: 0.9rem;">
            ${item.dosage || '—'}
          </td>
          <td style="font-size: 0.82rem; color: var(--text-muted);">
            ${item.form || '—'}
          </td>
          <td>
            ${typeBadge}
          </td>
          <td>
            ${originBadge}
          </td>
          <td>
            <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-main);" title="${item.lab}">
              ${item.lab || '—'}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              ${item.country || '—'}
            </div>
          </td>
          <td style="font-size: 0.82rem; color: var(--text-muted);">
            ${item.pkg || '—'}
          </td>
      `;

      if (isWithdrawn) {
        html += `
          <td style="font-size: 0.78rem; color: #9f1239; background: #fff1f2;">
            <strong>${item.withdrawal_date || ''}</strong>: ${item.withdrawal_reason || '—'}
          </td>
        `;
      }

      html += `</tr>`;
    });

    el.rowsTbody.innerHTML = html;
  }

  function applyTheme() {
    el.html.setAttribute('data-theme', state.theme);
    const isDark = state.theme === 'dark';
    if (el.themeBtn) {
      el.themeBtn.innerHTML = isDark
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('pharmadz_theme', state.theme);
    applyTheme();
  }

  function applyLanguage() {
    const t = I18N[state.lang];
    el.html.setAttribute('dir', state.lang === 'ar' ? 'rtl' : 'ltr');
    el.html.setAttribute('lang', state.lang);

    document.querySelectorAll('[data-i18n]').forEach(node => {
      const key = node.dataset.i18n;
      if (t[key]) node.textContent = t[key];
    });

    if (el.searchInput) el.searchInput.placeholder = t.search_placeholder;
    if (el.langBtn) el.langBtn.innerHTML = `<span>${state.lang === 'ar' ? 'Français' : 'العربية'}</span>`;

    if (state.selectedMed) {
      renderSummaryStrip(state.selectedMed);
      renderRows();
    }
  }

  function toggleLanguage() {
    state.lang = state.lang === 'ar' ? 'fr' : 'ar';
    localStorage.setItem('pharmadz_lang', state.lang);
    applyLanguage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
