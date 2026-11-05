/**
 * PharmaDZ - Dedicated Generic & Alternatives Search Engine
 * Searches any medication brand name, extracts its Generic (DCI) & Categories,
 * and fetches ALL alternative products across:
 * 1. Nomenclature Active
 * 2. Non Renouvelés
 * 3. Retraits
 */

(function () {
  'use strict';

  const I18N = {
    ar: {
      nav_back: "← الدليل الوطني الشامل (5,425 دواء)",
      page_title: "محرك البحث عن المادة الفعالة والبدائل الصيدلانية",
      page_subtitle: "أدخل اسم أي دواء تجاري لاستخراج تركيبته الجنيسة (DCI) وتصنيفه العلاجي، وجلب كافة البدائل المعتمدة، غير المجددة، والمسحوبة من السوق الجزائري.",
      search_placeholder: "اكتب اسم الدواء التجاري (مثال: Doliprane, Artiz, Augmentin, Tahor...)",
      suggestions_label: "أمثلة شائعة للتجربة السريعة:",
      selected_med_title: "بطاقة الدواء المستهدف والمادة الفعالة",
      generic_substance: "المادة الفعالة والجنيسة (DCI)",
      therapeutic_category: "التصنيف العلاجي المعتمد",
      status_active: "🟢 معتمد ومسجل حالياً في السوق (Active)",
      status_non_renewed: "🟡 غير مجدد الصلاحية (Non Renouvelé)",
      status_withdrawn: "🔴 مسحوب من السوق (Retiré du marché)",
      alts_section_title: "جميع الأدوية والمنتجات البديلة بنفس المادة الفعالة",
      tab_active: "المعتمدة حالياً في السوق",
      tab_non_renewed: "غير المجددة",
      tab_withdrawn: "المسحوبة من السوق",
      no_active_alts: "لا توجد أدوية معتمدة بديلة أخرى مسجلة بنفس المادة الفعالة.",
      no_non_renewed_alts: "لا توجد بدائل غير مجددة مسجلة لهذه المادة الفعالة.",
      no_withdrawn_alts: "لا توجد أي بدائل مسحوبة لهذه المادة الفعالة (سجل سليم).",
      print_report: "طباعة تقرير البدائل",
      dosage: "الجرعة",
      form: "الشكل الصيدلاني",
      packaging: "التعليب",
      lab: "المخبر المصنع",
      country: "بلد الصنع",
      reg_num: "رقم التسجيل",
      code: "رمز الفئة",
      type: "النوع",
      origin: "المنشأ",
      withdrawal_date: "تاريخ السحب",
      withdrawal_reason: "سبب السحب",
      details_btn: "عرض التفاصيل",
      filter_all: "الكل",
      filter_ge: "جنيس فقط (GE)",
      filter_re: "أصلي مرجعي (RE)",
      filter_local: "إنتاج محلي جزائري 🇩🇿",
      results_found: "تم العثور على"
    },
    fr: {
      nav_back: "← Répertoire Complet (5 425 produits)",
      page_title: "Recherche de la DCI & des Produits Équivalents",
      page_subtitle: "Saisissez le nom commercial d'un médicament pour identifier sa DCI, sa classe thérapeutique et lister l'ensemble des alternatives (Nomenclature active, non renouvelés et retraits).",
      search_placeholder: "Entrez le nom de marque (ex: Doliprane, Artiz, Augmentin, Tahor...)",
      suggestions_label: "Exemples rapides :",
      selected_med_title: "Fiche d'identité & Substance Active (DCI)",
      generic_substance: "Dénomination Commune Internationale (DCI)",
      therapeutic_category: "Classe Thérapeutique",
      status_active: "🟢 Produit Actif & Enregistré",
      status_non_renewed: "🟡 Produit Non Renouvelé",
      status_withdrawn: "🔴 Produit Retiré du Marché",
      alts_section_title: "Produits et spécialités équivalentes partageant la même DCI",
      tab_active: "Spécialités Actives",
      tab_non_renewed: "Non Renouvelés",
      tab_withdrawn: "Retraits du Marché",
      no_active_alts: "Aucune autre spécialité active enregistrée avec cette DCI.",
      no_non_renewed_alts: "Aucun produit non renouvelé pour cette substance active.",
      no_withdrawn_alts: "Aucun retrait enregistré pour cette substance active.",
      print_report: "Imprimer le rapport des équivalents",
      dosage: "Dosage",
      form: "Forme",
      packaging: "Conditionnement",
      lab: "Laboratoire détenteur",
      country: "Pays",
      reg_num: "N° Enregistrement",
      code: "Code Nomenclature",
      type: "Type",
      origin: "Origine",
      withdrawal_date: "Date de Retrait",
      withdrawal_reason: "Motif de Retrait",
      details_btn: "Détails",
      filter_all: "Tous",
      filter_ge: "Génériques (GE)",
      filter_re: "Princeps (RE)",
      filter_local: "Fabrication Locale 🇩🇿",
      results_found: "Résultats trouvés :"
    }
  };

  const state = {
    lang: localStorage.getItem('pharmadz_lang') || 'ar',
    theme: localStorage.getItem('pharmadz_theme') || 'light',
    selectedMed: null,
    selectedDci: null,
    activeSubTab: 'active', // 'active' | 'non_renewed' | 'withdrawn'
    filterType: 'all', // 'all' | 'GE' | 'RE' | 'F'
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

    // Check URL parameters (e.g. search.html?q=ARTIZ or search.html?dci=PARACETAMOL)
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || urlParams.get('dci');
    if (query) {
      if (el.searchInput) el.searchInput.value = query;
      performSearch(query);
    } else {
      // Default sample search for Doliprane to show how it looks!
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
    el.profileContainer = document.getElementById('profile-container');
    el.altsSection = document.getElementById('alts-section');
    el.altsTabs = document.querySelectorAll('.alts-tab-btn');
    el.altsFilterPills = document.querySelectorAll('[data-alt-filter]');
    el.altsGrid = document.getElementById('alts-grid');
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

    // Close dropdown when clicking outside
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

    // Alternatives Tabs (Active, Non-renewed, Withdrawn)
    el.altsTabs?.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        state.activeSubTab = tab;
        el.altsTabs.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
        renderAlternatives();
      });
    });

    // Sub-filters (All, GE, RE, Local)
    el.altsFilterPills?.forEach(pill => {
      pill.addEventListener('click', () => {
        const filter = pill.dataset.altFilter;
        state.filterType = filter;
        el.altsFilterPills.forEach(p => p.classList.toggle('active', p.dataset.altFilter === filter));
        renderAlternatives();
      });
    });

    // Print Report
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
        <div style="padding: 1rem; color: var(--text-muted); text-align: center; font-size: 0.9rem;">
          ${state.lang === 'ar' ? 'لا توجد نتائج مطابقة' : 'Aucun résultat trouvé'}
        </div>
      `;
      el.searchDropdown.style.display = 'block';
      return;
    }

    let html = '';
    matches.forEach(m => {
      let badge = '';
      if (m.sourceType === 'active') badge = '<span class="badge badge-ge" style="font-size: 0.68rem;">🟢 Active</span>';
      else if (m.sourceType === 'non_renewed') badge = '<span class="badge" style="background:#fef3c7;color:#b45309;font-size:0.68rem;">🟡 Non Renouvelé</span>';
      else badge = '<span class="badge" style="background:#ffe4e6;color:#e11d48;font-size:0.68rem;">🔴 Retiré</span>';

      html += `
        <div class="search-dropdown-item" data-key="${m.reg || m.code}_${m.brand}">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
            <strong style="color: var(--text-main); font-size: 0.95rem;">${m.brand}</strong>
            ${badge}
          </div>
          <div style="font-size: 0.78rem; color: var(--primary-600); margin-top: 0.15rem;">
            🧬 DCI: ${m.dci} (${m.dosage} - ${m.form})
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">
            🏢 ${m.lab} (${m.country})
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
    // Try exact brand match first
    let match = state.allMedsIndex.find(m => m.brandLower === q);
    if (!match) {
      match = state.allMedsIndex.find(m => m.brandLower.startsWith(q));
    }
    if (!match) {
      match = state.allMedsIndex.find(m => m.brandLower.includes(q) || m.dciLower.includes(q));
    }

    if (match) {
      selectTargetMed(match);
    } else {
      el.profileContainer.innerHTML = `
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 3rem 1rem; text-align: center; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔍</div>
          <h3>${state.lang === 'ar' ? 'لم يتم العثور على دواء بهذا الاسم' : 'Aucun médicament trouvé avec ce nom'}</h3>
          <p>${state.lang === 'ar' ? 'يرجى التأكد من كتابة الاسم التجاري بشكل صحيح.' : 'Veuillez vérifier l\'orthographe du nom commercial.'}</p>
        </div>
      `;
      el.altsSection.style.display = 'none';
    }
  }

  function selectTargetMed(med) {
    state.selectedMed = med;
    state.selectedDci = (med.dci || '').trim().toUpperCase();
    renderProfileCard(med);
    updateAltTabBadges();
    renderAlternatives();
    el.altsSection.style.display = 'block';
  }

  function renderProfileCard(med) {
    const t = I18N[state.lang];
    const isAr = state.lang === 'ar';

    const cat = db?.categories[med.cat_id];
    const catName = isAr ? cat?.name_ar : cat?.name_fr;

    let statusHtml = '';
    if (med.sourceType === 'active') {
      statusHtml = `<span class="badge" style="background:#dcfce7;color:#15803d;padding:0.4rem 0.85rem;font-size:0.85rem;">${t.status_active}</span>`;
    } else if (med.sourceType === 'non_renewed') {
      statusHtml = `<span class="badge" style="background:#fef3c7;color:#b45309;padding:0.4rem 0.85rem;font-size:0.85rem;">${t.status_non_renewed}</span>`;
    } else {
      statusHtml = `<span class="badge" style="background:#fee2e2;color:#991b1b;padding:0.4rem 0.85rem;font-size:0.85rem;">${t.status_withdrawn}</span>`;
    }

    let typeBadge = med.type === 'GE' ? '🧬 Générique (GE)' : med.type === 'RE' ? '⭐ Princeps / Réf. (RE)' : med.type === 'BIO' ? '🧪 Biosimilaire (BIO)' : '—';
    let originBadge = med.statut === 'F' ? '🇩🇿 Fabrication locale' : '🌐 Importation';

    let html = `
      <div class="product-profile-card">
        <div class="profile-header-top">
          <div>
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span class="badge badge-code" style="font-size: 0.8rem;">Code: ${med.code || '—'}</span>
              ${statusHtml}
              <span class="badge badge-local">${originBadge}</span>
            </div>
            <h1 class="profile-brand-name">${med.brand}</h1>
            <div class="profile-dci-highlight">
              <span style="font-size: 1.15rem;">🧬 ${t.generic_substance} :</span>
              <strong style="color: var(--primary-600); font-size: 1.25rem;">${med.dci}</strong>
            </div>
          </div>
          <div>
            <span class="cat-pill-badge" title="${catName}">
              ${cat?.icon || '💊'} Classe ${med.cat_id}: ${catName || '—'}
            </span>
          </div>
        </div>

        <div class="profile-specs-grid">
          <div class="spec-box">
            <span class="spec-box-label">${t.dosage}</span>
            <span class="spec-box-val">${med.dosage || '—'}</span>
          </div>
          <div class="spec-box">
            <span class="spec-box-label">${t.form}</span>
            <span class="spec-box-val">${med.form || '—'}</span>
          </div>
          <div class="spec-box">
            <span class="spec-box-label">${t.packaging}</span>
            <span class="spec-box-val">${med.pkg || '—'}</span>
          </div>
          <div class="spec-box">
            <span class="spec-box-label">${t.type}</span>
            <span class="spec-box-val">${typeBadge}</span>
          </div>
          <div class="spec-box">
            <span class="spec-box-label">${t.lab}</span>
            <span class="spec-box-val" title="${med.lab}">${med.lab || '—'}</span>
          </div>
          <div class="spec-box">
            <span class="spec-box-label">${t.country}</span>
            <span class="spec-box-val">${med.country || '—'}</span>
          </div>
          <div class="spec-box">
            <span class="spec-box-label">${t.reg_num}</span>
            <span class="spec-box-val" style="font-family: monospace;">${med.reg || '—'}</span>
          </div>
          <div class="spec-box">
            <span class="spec-box-label">Tableau / Liste</span>
            <span class="spec-box-val">${med.list || '—'}</span>
          </div>
        </div>
    `;

    if (med.sourceType === 'withdrawn') {
      html += `
        <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: var(--radius-md); padding: 0.85rem 1rem; margin-top: 1rem; color: #9f1239;">
          <strong>⚠️ ${t.withdrawal_date}:</strong> ${med.withdrawal_date || '—'} | 
          <strong>${t.withdrawal_reason}:</strong> ${med.withdrawal_reason || '—'}
        </div>
      `;
    }

    html += `</div>`;
    el.profileContainer.innerHTML = html;
  }

  function updateAltTabBadges() {
    if (!state.selectedDci) return;
    const dci = state.selectedDci;

    const activeCount = db.active.filter(i => (i.dci || '').trim().toUpperCase() === dci).length;
    const nonRenewedCount = db.non_renewed.filter(i => (i.dci || '').trim().toUpperCase() === dci).length;
    const withdrawnCount = db.withdrawn.filter(i => (i.dci || '').trim().toUpperCase() === dci).length;

    const badgeActive = document.getElementById('badge-count-active');
    const badgeNonRenewed = document.getElementById('badge-count-non-renewed');
    const badgeWithdrawn = document.getElementById('badge-count-withdrawn');

    if (badgeActive) badgeActive.textContent = activeCount;
    if (badgeNonRenewed) badgeNonRenewed.textContent = nonRenewedCount;
    if (badgeWithdrawn) badgeWithdrawn.textContent = withdrawnCount;
  }

  function renderAlternatives() {
    if (!state.selectedDci || !el.altsGrid) return;
    const t = I18N[state.lang];
    const isAr = state.lang === 'ar';
    const dci = state.selectedDci;

    let targetList = [];
    if (state.activeSubTab === 'active') targetList = db.active;
    else if (state.activeSubTab === 'non_renewed') targetList = db.non_renewed;
    else if (state.activeSubTab === 'withdrawn') targetList = db.withdrawn;

    // Filter by DCI
    let alts = targetList.filter(i => (i.dci || '').trim().toUpperCase() === dci);

    // Apply sub-filters (GE, RE, Local)
    if (state.filterType === 'GE') {
      alts = alts.filter(i => i.type === 'GE');
    } else if (state.filterType === 'RE') {
      alts = alts.filter(i => i.type === 'RE');
    } else if (state.filterType === 'F') {
      alts = alts.filter(i => i.statut === 'F');
    }

    if (alts.length === 0) {
      let emptyMsg = t.no_active_alts;
      if (state.activeSubTab === 'non_renewed') emptyMsg = t.no_non_renewed_alts;
      else if (state.activeSubTab === 'withdrawn') emptyMsg = t.no_withdrawn_alts;

      el.altsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: var(--radius-md); padding: 3rem 1rem; text-align: center; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🍃</div>
          <p style="font-weight: 600;">${emptyMsg}</p>
        </div>
      `;
      return;
    }

    let html = '';
    alts.forEach(alt => {
      const isTarget = state.selectedMed && alt.brand === state.selectedMed.brand && alt.reg === state.selectedMed.reg;

      let typeBadge = alt.type === 'GE' ? '<span class="badge badge-ge">🧬 Générique</span>'
        : alt.type === 'RE' ? '<span class="badge badge-re">⭐ Princeps</span>'
        : alt.type === 'BIO' ? '<span class="badge badge-bio">🧪 Bio</span>' : '';

      let originBadge = alt.statut === 'F' ? '<span class="badge badge-local">🇩🇿 Local</span>' : '<span class="badge badge-import">🌐 Import</span>';

      html += `
        <div class="alt-product-card ${isTarget ? 'is-target' : ''}">
          <div class="alt-card-header">
            <div>
              <div style="display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.35rem;">
                ${typeBadge}
                ${originBadge}
                ${isTarget ? `<span class="badge" style="background:#e0e7ff;color:#3730a3;font-weight:bold;">${isAr ? 'الدواء الحالي' : 'Actuel'}</span>` : ''}
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.2rem;">${alt.brand}</h3>
              <div style="font-size: 0.8rem; font-weight: 600; color: var(--primary-600);">${alt.dosage} • ${alt.form}</div>
            </div>
            <div style="font-family: monospace; font-size: 0.75rem; color: var(--text-muted); background: var(--bg-subtle); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm);">
              ${alt.code}
            </div>
          </div>

          <div class="alt-card-details">
            <div class="spec-row">
              <span class="spec-key">${t.packaging}:</span>
              <span class="spec-val">${alt.pkg || '—'}</span>
            </div>
            <div class="spec-row">
              <span class="spec-key">${t.lab}:</span>
              <span class="spec-val" title="${alt.lab}">${alt.lab || '—'}</span>
            </div>
            <div class="spec-row">
              <span class="spec-key">${t.country}:</span>
              <span class="spec-val">${alt.country || '—'}</span>
            </div>
            <div class="spec-row">
              <span class="spec-key">${t.reg_num}:</span>
              <span class="spec-val" style="font-family: monospace;">${alt.reg || '—'}</span>
            </div>
          </div>
      `;

      if (state.activeSubTab === 'withdrawn') {
        html += `
          <div style="background: #fff1f2; border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; margin-top: 0.65rem; font-size: 0.75rem; color: #9f1239;">
            <strong>${t.withdrawal_date}:</strong> ${alt.withdrawal_date || '—'}<br>
            <strong>${t.withdrawal_reason}:</strong> ${alt.withdrawal_reason || '—'}
          </div>
        `;
      }

      html += `
          <div style="margin-top: 0.75rem; text-align: end;">
            <button class="btn btn-outline" data-inspect-brand="${alt.brand}" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;">
              ${t.details_btn}
            </button>
          </div>
        </div>
      `;
    });

    el.altsGrid.innerHTML = html;

    el.altsGrid.querySelectorAll('[data-inspect-brand]').forEach(btn => {
      btn.addEventListener('click', () => {
        const brand = btn.dataset.inspectBrand;
        const target = state.allMedsIndex.find(m => m.brand === brand);
        if (target) {
          selectTargetMed(target);
          window.scrollTo({ top: el.profileContainer.offsetTop - 80, behavior: 'smooth' });
        }
      });
    });
  }

  function applyTheme() {
    el.html.setAttribute('data-theme', state.theme);
    const isDark = state.theme === 'dark';
    if (el.themeBtn) {
      el.themeBtn.innerHTML = isDark
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
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
      renderProfileCard(state.selectedMed);
      renderAlternatives();
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
