/**
 * PharmaDZ - Code DCI, DCI & Laboratory Alternatives Search
 * When a user writes a product name (e.g. ACEBUTOLOL IVAL):
 * 1. Extracts its Code DCI (e.g. 06 F 067)
 * 2. Matches and fetches all products by this Code DCI (default)
 * 3. Allows toggling to DCI (broader) or Laboratory via radio mode selector.
 */

(function () {
  'use strict';

  const I18N = {
    ar: {
      nav_back: "← الدليل الشامل (5,425 دواء)",
      site_subtitle: "بحث كود المادة والبدائل (Code DCI / DCI / Laboratoire)",
      search_placeholder: "اكتب اسم الدواء فقط (مثال: ACEBUTOLOL IVAL, Doliprane, Artiz...)",
      suggestions_label: "أمثلة سريعة:",
      searched_med: "الدواء المبحوث عنه:",
      code_dci: "كود المادة (Code DCI):",
      generic_substance: "المادة الفعالة (DCI):",
      manufacturer_lab: "المخبر المصنع:",
      therapeutic_category: "التصنيف العلاجي:",
      tab_active: "المعتمدة في السوق (Nomenclature)",
      tab_non_renewed: "غير المجددة (Non Renouvelés)",
      tab_withdrawn: "المسحوبة من السوق (Retraits)",
      filter_all: "الكل",
      no_results: "لا توجد أدوية مطابقة لمعايير البحث الحالية.",
      print_report: "طباعة",
      status_active: "🟢 معتمد",
      status_non_renewed: "🟡 غير مجدد",
      status_withdrawn: "🔴 مسحوب",
      mode_code_active: "🎯 المطابقة حسب كود المادة (Code DCI)",
      mode_dci_active: "🧬 المطابقة حسب المادة الفعالة (DCI الشامل)",
      mode_lab_active: "🏢 المطابقة حسب المخبر المصنع (Laboratoire)"
    },
    fr: {
      nav_back: "← Répertoire complet (5 425 produits)",
      site_subtitle: "Recherche par Code DCI, Substance & Laboratoire",
      search_placeholder: "Entrez le nom du médicament (ex: ACEBUTOLOL IVAL, Doliprane...)",
      suggestions_label: "Exemples rapides :",
      searched_med: "Produit recherché :",
      code_dci: "Code DCI :",
      generic_substance: "Substance active (DCI) :",
      manufacturer_lab: "Laboratoire détenteur :",
      therapeutic_category: "Classe thérapeutique :",
      tab_active: "Spécialités Actives (Nomenclature)",
      tab_non_renewed: "Non Renouvelés",
      tab_withdrawn: "Retraits du Marché",
      filter_all: "Tous",
      no_results: "Aucun produit ne correspond à ces critères.",
      print_report: "Imprimer",
      status_active: "🟢 Actif",
      status_non_renewed: "🟡 Non Renouvelé",
      status_withdrawn: "🔴 Retiré",
      mode_code_active: "🎯 Filtrage par Code DCI",
      mode_dci_active: "🧬 Filtrage par DCI globale",
      mode_lab_active: "🏢 Filtrage par Laboratoire détenteur"
    }
  };

  const state = {
    lang: localStorage.getItem('pharmadz_lang') || 'ar',
    theme: localStorage.getItem('pharmadz_theme') || 'light',
    selectedMed: null,
    selectedCode: null, // e.g. '06 F 067'
    selectedDci: null,
    selectedDciRoot: null,
    selectedLab: null,
    searchMode: 'code', // 'code' | 'dci' | 'lab'
    activeSubTab: 'active', // 'active' | 'non_renewed' | 'withdrawn'
    filterType: 'all', // 'all' | 'RE' | 'GE' | 'I' | 'F'
    allMedsIndex: []
  };

  const db = window.NOMENCLATURE_DATA || null;

  const el = {};

  // Strip accents and clean characters
  function cleanStr(s) {
    if (!s) return '';
    return s.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\*\(\)\/\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  }

  // Extract base chemical molecule root (e.g. DICLOFENAC SODIQUE -> DICLOFENAC)
  function getDciRoot(dciStr) {
    const c = cleanStr(dciStr);
    if (!c) return '';
    const KNOWN_ROOTS = [
      'ACEBUTOLOL', 'DICLOFENAC', 'PARACETAMOL', 'AMOXICILLINE', 'CETIRIZINE', 'IBUPROFENE',
      'OMEPRAZOLE', 'ESOMEPRAZOLE', 'CIPROFLOXACINE', 'METRONIDAZOLE', 'AZITHROMYCINE',
      'ATORVASTATINE', 'ROSUVASTATINE', 'METFORMINE', 'AMLODIPINE', 'VALSARTAN',
      'CANDESARTAN', 'LOSARTAN', 'PREGABALINE', 'CLOPIDOGREL', 'PANTOPRAZOLE'
    ];
    for (const r of KNOWN_ROOTS) {
      if (c.includes(r)) return r;
    }
    return c.split(' ')[0] || c;
  }

  function init() {
    cacheDom();
    buildSearchIndex();
    bindEvents();
    applyTheme();
    applyLanguage();

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || urlParams.get('dci') || urlParams.get('code');
    if (query) {
      if (el.searchInput) el.searchInput.value = query;
      performSearch(query);
    } else {
      performSearch('ACEBUTOLOL IVAL');
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
    el.searchModeRadios = document.querySelectorAll('input[name="search-mode"]');
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
        const b = itm.brand || '';
        const d = itm.dci || '';
        const c = itm.code || '';
        const dos = itm.dosage || '';
        const f = itm.form || '';
        const l = itm.lab || '';
        list.push({
          ...itm,
          sourceType: sourceLabel,
          brandLower: b.toLowerCase(),
          dciLower: d.toLowerCase(),
          codeClean: c.trim().toUpperCase(),
          labClean: cleanStr(l),
          dciRoot: getDciRoot(d),
          fullSearchStr: cleanStr(`${b} ${dos} ${d} ${c} ${f} ${l}`)
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

    // Enter key triggers immediate search
    el.searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = el.searchInput.value.trim();
        if (val) {
          el.searchDropdown.style.display = 'none';
          performSearch(val);
        }
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

    // Search Mode Radios (Code DCI, DCI, Laboratoire)
    el.searchModeRadios?.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          state.searchMode = radio.value;
          if (state.selectedMed) {
            renderSummaryStrip(state.selectedMed);
            updateTabBadges();
            renderRows();
          }
        }
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

    const cleanedQ = cleanStr(query);
    const tokens = cleanedQ.split(' ').filter(Boolean);

    // Multi-token match
    const matches = state.allMedsIndex.filter(itm => {
      return tokens.every(tok => itm.fullSearchStr.includes(tok));
    }).slice(0, 10);

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
        <div class="search-dropdown-item" data-key="${m.reg || m.code}_${m.brand}_${m.dosage}">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
            <div>
              <strong style="color: var(--text-main); font-size: 0.95rem;">${m.brand}</strong>
              <span class="summary-code-val" style="margin-inline-start: 0.35rem; font-size: 0.75rem; padding: 0.1rem 0.4rem;">${m.code}</span>
              <span class="dosage-badge-val" style="margin-inline-start: 0.25rem; font-size: 0.75rem;">${m.dosage}</span>
            </div>
            <div style="display: flex; gap: 0.25rem;">
              ${typeBadge}
              ${originBadge}
            </div>
          </div>
          <div style="font-size: 0.75rem; color: var(--primary-600); margin-top: 0.15rem;">
            🧬 DCI: ${m.dci} • 🏢 ${m.lab || ''}
          </div>
        </div>
      `;
    });

    el.searchDropdown.innerHTML = html;
    el.searchDropdown.style.display = 'block';

    el.searchDropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const key = item.dataset.key;
        const target = state.allMedsIndex.find(m => `${m.reg || m.code}_${m.brand}_${m.dosage}` === key);
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
    const cleanedQ = cleanStr(term);
    const tokens = cleanedQ.split(' ').filter(Boolean);

    // 1. Direct match by exact Code DCI (e.g. user typed "06 F 067")
    let match = state.allMedsIndex.find(m => m.codeClean === cleanedQ);

    // 2. Multi-token match across full search string (Brand, Dosage, Code, DCI)
    if (!match) {
      let candidates = state.allMedsIndex.filter(itm => {
        return tokens.every(tok => itm.fullSearchStr.includes(tok));
      });

      const numberToken = tokens.find(tok => /^\d+$/.test(tok));
      if (candidates.length > 0) {
        if (numberToken) {
          match = candidates.find(c => (c.dosage || '').includes(numberToken));
        }
        if (!match) match = candidates[0];
      }
    }

    if (!match) {
      match = state.allMedsIndex.find(m => m.fullSearchStr.includes(cleanedQ));
    }

    if (match) {
      selectTargetMed(match);
    } else {
      el.summaryContainer.innerHTML = `
        <div style="background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; text-align: center; color: var(--text-muted);">
          🔍 ${state.lang === 'ar' ? 'لم يتم العثور على دواء بهذا الاسم أو الرمز' : 'Aucun médicament trouvé avec ce nom ou code'}
        </div>
      `;
      el.altsSection.style.display = 'none';
    }
  }

  function selectTargetMed(med) {
    state.selectedMed = med;
    state.selectedCode = (med.code || '').trim().toUpperCase();
    state.selectedDci = (med.dci || '').trim();
    state.selectedDciRoot = med.dciRoot || getDciRoot(med.dci);
    state.selectedLab = (med.lab || '').trim();

    renderSummaryStrip(med);
    updateTabBadges();
    renderRows();
    el.altsSection.style.display = 'block';
  }

  // Renders the sleek summary strip with Code DCI, DCI, and Lab
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

    // Active mode label
    let modeText = t.mode_code_active;
    if (state.searchMode === 'dci') modeText = t.mode_dci_active;
    else if (state.searchMode === 'lab') modeText = t.mode_lab_active;

    el.summaryContainer.innerHTML = `
      <div class="minimal-summary-bar">
        <div class="summary-item">
          <span class="summary-label">${t.searched_med}</span>
          <span class="summary-val" style="font-size: 1.15rem; color: var(--text-main);">${med.brand}</span>
          <span class="dosage-badge-val">${med.dosage || ''}</span>
          ${statusTag}
          ${typeTag}
          ${originTag}
        </div>

        <div class="summary-item">
          <span class="summary-label">${t.code_dci}</span>
          <span class="summary-code-val" title="رمز الدواء في المدونة">${med.code || '—'}</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">${t.generic_substance}</span>
          <span class="summary-dci-val">${med.dci}</span>
        </div>

        <div class="summary-item">
          <span class="summary-label">${t.manufacturer_lab}</span>
          <span class="summary-val" style="font-size: 0.85rem;" title="${med.lab}">${med.lab || '—'}</span>
        </div>

        <div class="summary-item" style="border-inline-start: 1px solid var(--border-color); padding-inline-start: 0.75rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary-700); background: var(--primary-50); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm);">
            ${modeText}
          </span>
        </div>
      </div>
    `;
  }

  // Core Filtering by Code DCI (default), or DCI, or Lab
  function getMatchingAlternatives(targetList) {
    if (!state.selectedMed) return [];

    // Mode 1: Code DCI (User's primary requirement: matches exact Code, e.g. 06 F 067)
    if (state.searchMode === 'code') {
      const code = state.selectedCode;
      if (!code) return [];
      return targetList.filter(i => (i.code || '').trim().toUpperCase() === code);
    }

    // Mode 2: DCI (Broader matching by active substance)
    if (state.searchMode === 'dci') {
      const root = state.selectedDciRoot || getDciRoot(state.selectedDci);
      if (!root) return [];
      return targetList.filter(i => {
        const itmRoot = i.dciRoot || getDciRoot(i.dci);
        return itmRoot === root;
      });
    }

    // Mode 3: Manufacturer Laboratory (Matches by Lab name)
    if (state.searchMode === 'lab') {
      const labClean = cleanStr(state.selectedLab);
      if (!labClean) return [];
      return targetList.filter(i => {
        const iLab = cleanStr(i.lab);
        return iLab === labClean || (labClean.length > 5 && iLab.includes(labClean));
      });
    }

    return [];
  }

  function updateTabBadges() {
    const activeCount = getMatchingAlternatives(db.active || []).length;
    const nonRenewedCount = getMatchingAlternatives(db.non_renewed || []).length;
    const withdrawnCount = getMatchingAlternatives(db.withdrawn || []).length;

    const bActive = document.getElementById('badge-count-active');
    const bNonRenewed = document.getElementById('badge-count-non-renewed');
    const bWithdrawn = document.getElementById('badge-count-withdrawn');

    if (bActive) bActive.textContent = activeCount;
    if (bNonRenewed) bNonRenewed.textContent = nonRenewedCount;
    if (bWithdrawn) bWithdrawn.textContent = withdrawnCount;
  }

  // Renders the minimal clean table rows
  function renderRows() {
    if (!state.selectedMed || !el.rowsTbody) return;
    const t = I18N[state.lang];
    const isAr = state.lang === 'ar';

    let targetList = [];
    if (state.activeSubTab === 'active') targetList = db.active;
    else if (state.activeSubTab === 'non_renewed') targetList = db.non_renewed;
    else if (state.activeSubTab === 'withdrawn') targetList = db.withdrawn;

    // Filter according to active mode (Code DCI, DCI, or Lab)
    let alts = getMatchingAlternatives(targetList);

    // Apply Princeps / Generique / Import / Local filters
    if (state.filterType === 'RE') {
      alts = alts.filter(i => i.type === 'RE');
    } else if (state.filterType === 'GE') {
      alts = alts.filter(i => i.type === 'GE');
    } else if (state.filterType === 'I') {
      alts = alts.filter(i => i.statut === 'I');
    } else if (state.filterType === 'F') {
      alts = alts.filter(i => i.statut === 'F');
    }

    // Sort:
    // 1. Target medication at top
    // 2. Numerical dosage descending (1000mg at top)
    alts.sort((a, b) => {
      const isTargetA = state.selectedMed && a.brand === state.selectedMed.brand && a.reg === state.selectedMed.reg;
      const isTargetB = state.selectedMed && b.brand === state.selectedMed.brand && b.reg === state.selectedMed.reg;
      if (isTargetA) return -1;
      if (isTargetB) return 1;

      const numA = parseInt((a.dosage || '').replace(/\D/g, ''), 10) || 0;
      const numB = parseInt((b.dosage || '').replace(/\D/g, ''), 10) || 0;
      if (numB !== numA) return numB - numA;

      return (a.brand || '').localeCompare(b.brand || '');
    });

    const isWithdrawn = state.activeSubTab === 'withdrawn';
    if (el.thExtra) {
      el.thExtra.style.display = isWithdrawn ? '' : 'none';
    }

    if (alts.length === 0) {
      el.rowsTbody.innerHTML = `
        <tr>
          <td colspan="${isWithdrawn ? 9 : 8}" style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
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
          <td>
            <span class="summary-code-val" style="font-size: 0.8rem; padding: 0.15rem 0.45rem;">
              ${item.code || '—'}
            </span>
          </td>
          <td>
            <span class="dosage-badge-val">${item.dosage || '—'}</span>
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
