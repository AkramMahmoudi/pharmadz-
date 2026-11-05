/**
 * PharmaDZ - Algerian Pharmaceutical Nomenclature Web Application
 * Handles Filtering, Generics Finder, Product Dossier, Statistics, CSV Export,
 * Theme & Bilingual (AR/FR) Support.
 */

(function () {
  'use strict';

  // UI Translations Dictionary
  const I18N = {
    ar: {
      site_title: "الدليل الوطني للمنتجات الصيدلانية",
      site_subtitle: "الجمهورية الجزائرية الديمقراطية الشعبية - وزارة الصناعة الصيدلانية (نسخة أوت 2024 - 2026)",
      search_placeholder: "ابحث بالاسم التجاري، المادة الفعالة (DCI)، رمز الفئة، رقم التسجيل، أو اسم المخبر...",
      active_tab: "المعتمدة حالياً",
      non_renewed_tab: "غير المجددة",
      withdrawn_tab: "الأدوية المسحوبة",
      generics_explorer_tab: "دليل البدائل الجنيسة",
      stats_tab: "الإحصائيات والتحليلات",
      total_active_label: "إجمالي الأدوية المعتمدة",
      generics_label: "الأدوية الجنيسة",
      princeps_label: "الأدوية المرجعية (الأصلية)",
      biosimilars_label: "الأدوية الحيوية",
      local_label: "الإنتاج المحلي الجزائري",
      imported_label: "الأدوية المستوردة",
      all: "الكل",
      type_label: "النوع الصيدلاني:",
      origin_label: "المنشأ:",
      category_label: "التصنيف العلاجي:",
      all_categories: "جميع التصنيفات العلاجية (28 فئة)",
      grid_view: "عرض شبكي",
      table_view: "عرض جدولي",
      sort_by: "ترتيب حسب:",
      sort_brand_asc: "الاسم التجاري (أ - ي)",
      sort_brand_desc: "الاسم التجاري (ي - أ)",
      sort_dci_asc: "المادة الفعالة DCI (أ - ي)",
      sort_code: "رمز الفئة العلاجية",
      sort_date: "تاريخ التسجيل الأحدث",
      results_found: "تم العثور على",
      medication_unit: "دواء",
      generics_btn: "البدائل الجنيسة",
      details_btn: "التفاصيل الكاملة",
      lab: "المخبر",
      country: "بلد الصنع",
      dosage: "الجرعة",
      form: "الشكل الصيدلاني",
      packaging: "التعليب",
      code: "الرمز",
      reg_num: "رقم التسجيل",
      list: "القائمة",
      dispensation: "الصرف",
      stability: "مدة الصلاحية",
      date_init: "تاريخ التسجيل الأول",
      date_final: "تاريخ التسجيل الحالي",
      withdrawal_date: "تاريخ السحب",
      withdrawal_reason: "سبب السحب",
      generic_alternatives_title: "الأدوية الجنيسة والبدائل المتاحة بنفس المادة الفعالة",
      no_results: "لم يتم العثور على أي دواء مطابق لمعايير البحث الحالية.",
      print_sheet: "طباعة البطاقة التقنية",
      close: "إغلاق",
      export_csv: "تصدير إلى Excel / CSV",
      favorites_only: "المفضلة فقط",
      top_labs: "أكبر المخابر المصنعة",
      top_categories: "أكثر الفئات العلاجية تسجيلاً",
      generic_rate: "نسبة الجنيسة",
      local_rate: "نسبة الإنتاج المحلي",
      copy_success: "تم نسخ النص بنجاح!"
    },
    fr: {
      site_title: "Nomenclature Nationale des Produits Pharmaceutiques",
      site_subtitle: "République Algérienne Démocratique et Populaire - Ministère de l'Industrie Pharmaceutique (Version Août 2024 - 2026)",
      search_placeholder: "Rechercher par nom de marque, DCI, code, N° d'enregistrement, laboratoire...",
      active_tab: "Nomenclature Active",
      non_renewed_tab: "Non Renouvelés",
      withdrawn_tab: "Retraits",
      generics_explorer_tab: "Guide des Génériques & Équivalents",
      stats_tab: "Statistiques & Analyses",
      total_active_label: "Total Produits Actifs",
      generics_label: "Médicaments Génériques",
      princeps_label: "Médicaments Princeps (Réf.)",
      biosimilars_label: "Médicaments Biosimilaires",
      local_label: "Fabrication Locale (Algérie)",
      imported_label: "Médicaments Importés",
      all: "Tous",
      type_label: "Type pharmaceutique:",
      origin_label: "Origine:",
      category_label: "Classe thérapeutique:",
      all_categories: "Toutes les classes thérapeutiques (28 classes)",
      grid_view: "Vue Grille",
      table_view: "Vue Tableau",
      sort_by: "Trier par:",
      sort_brand_asc: "Nom commercial (A - Z)",
      sort_brand_desc: "Nom commercial (Z - A)",
      sort_dci_asc: "DCI (A - Z)",
      sort_code: "Code de la nomenclature",
      sort_date: "Date d'enregistrement récente",
      results_found: "Résultats trouvés :",
      medication_unit: "médicaments",
      generics_btn: "Génériques",
      details_btn: "Fiche complète",
      lab: "Laboratoire",
      country: "Pays",
      dosage: "Dosage",
      form: "Forme",
      packaging: "Conditionnement",
      code: "Code",
      reg_num: "N° Enregistrement",
      list: "Liste",
      dispensation: "Dispensation",
      stability: "Stabilité",
      date_init: "Enregistrement Initial",
      date_final: "Enregistrement Final",
      withdrawal_date: "Date de Retrait",
      withdrawal_reason: "Motif de Retrait",
      generic_alternatives_title: "Génériques et équivalents thérapeutiques avec la même DCI",
      no_results: "Aucun produit pharmaceutique ne correspond à vos critères de recherche.",
      print_sheet: "Imprimer la fiche technique",
      close: "Fermer",
      export_csv: "Exporter vers Excel / CSV",
      favorites_only: "Favoris seulement",
      top_labs: "Principaux laboratoires détenteurs",
      top_categories: "Principales classes thérapeutiques",
      generic_rate: "Taux de génériques",
      local_rate: "Taux de production locale",
      copy_success: "Copié dans le presse-papier !"
    }
  };

  // State
  const state = {
    lang: localStorage.getItem('pharmadz_lang') || 'ar',
    theme: localStorage.getItem('pharmadz_theme') || 'light',
    currentTab: 'active', // 'active' | 'non_renewed' | 'withdrawn' | 'generics_explorer' | 'stats'
    searchQuery: '',
    selectedCategory: 'all',
    selectedType: 'all', // 'all' | 'GE' | 'RE' | 'BIO'
    selectedOrigin: 'all', // 'all' | 'F' | 'I'
    selectedList: 'all',
    selectedDispensation: 'all', // 'all' | 'HOP' | 'OFF'
    onlyFavorites: false,
    sortBy: 'brand_asc',
    viewMode: localStorage.getItem('pharmadz_view') || 'grid', // 'grid' | 'table'
    currentPage: 1,
    itemsPerPage: 24,
    favorites: new Set(JSON.parse(localStorage.getItem('pharmadz_favs') || '[]')),
    activeModalItem: null
  };

  // Dataset container
  let db = window.NOMENCLATURE_DATA || null;

  // DOM Elements cache
  const el = {};

  function initApp() {
    cacheDom();
    bindEvents();
    applyTheme();
    applyLanguage();

    if (db) {
      onDataReady();
    } else {
      // Fetch json if js not loaded
      fetch('data/medications.json')
        .then(res => res.json())
        .then(data => {
          db = data;
          onDataReady();
        })
        .catch(err => {
          console.error('Error loading data:', err);
          showToast('Erreur de chargement des données / خطأ في تحميل البيانات');
        });
    }
  }

  function cacheDom() {
    el.html = document.documentElement;
    el.themeBtn = document.getElementById('btn-theme-toggle');
    el.langBtn = document.getElementById('btn-lang-toggle');
    el.searchInput = document.getElementById('search-input');
    el.clearSearchBtn = document.getElementById('clear-search-btn');
    el.tabBtns = document.querySelectorAll('.tab-btn');
    el.catCarousel = document.getElementById('cat-carousel');
    el.catSelect = document.getElementById('cat-select');
    el.resultsCount = document.getElementById('results-count');
    el.productsContainer = document.getElementById('products-container');
    el.paginationWrapper = document.getElementById('pagination-wrapper');
    el.sortSelect = document.getElementById('sort-select');
    el.perPageSelect = document.getElementById('per-page-select');
    el.viewBtns = document.querySelectorAll('.view-btn');
    el.exportBtn = document.getElementById('btn-export-csv');
    el.btnFavFilter = document.getElementById('btn-fav-filter');
    el.activeFilterTags = document.getElementById('active-filter-tags');
    el.statsGrid = document.getElementById('stats-grid');
    el.explorerView = document.getElementById('explorer-view');
    el.statsView = document.getElementById('stats-view');
    el.normalViewContainer = document.getElementById('normal-view-container');

    // Filter pills
    el.typePills = document.querySelectorAll('[data-filter-type]');
    el.originPills = document.querySelectorAll('[data-filter-origin]');
    el.listSelect = document.getElementById('list-select');
    el.dispSelect = document.getElementById('disp-select');

    // Modal
    el.modalOverlay = document.getElementById('product-modal');
    el.modalTitle = document.getElementById('modal-brand-title');
    el.modalDci = document.getElementById('modal-dci-subtitle');
    el.modalDetailsGrid = document.getElementById('modal-details-grid');
    el.modalGenericsList = document.getElementById('modal-generics-list');
    el.modalCloseBtn = document.getElementById('modal-close-btn');
    el.modalPrintBtn = document.getElementById('modal-print-btn');
  }

  function bindEvents() {
    // Theme toggle
    el.themeBtn?.addEventListener('click', toggleTheme);
    // Lang toggle
    el.langBtn?.addEventListener('click', toggleLanguage);

    // Search input with debounce
    let searchTimeout;
    el.searchInput?.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const val = e.target.value.trim();
      el.clearSearchBtn.style.display = val ? 'block' : 'none';
      searchTimeout = setTimeout(() => {
        state.searchQuery = val;
        state.currentPage = 1;
        render();
      }, 200);
    });

    el.clearSearchBtn?.addEventListener('click', () => {
      el.searchInput.value = '';
      el.clearSearchBtn.style.display = 'none';
      state.searchQuery = '';
      state.currentPage = 1;
      render();
    });

    // Navigation Tabs
    el.tabBtns?.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (state.currentTab === tab) return;
        state.currentTab = tab;
        state.currentPage = 1;

        el.tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle special views
        if (tab === 'generics_explorer') {
          el.normalViewContainer.style.display = 'none';
          el.statsView.style.display = 'none';
          el.explorerView.style.display = 'block';
          renderGenericsExplorer();
        } else if (tab === 'stats') {
          el.normalViewContainer.style.display = 'none';
          el.explorerView.style.display = 'none';
          el.statsView.style.display = 'block';
          renderStatsView();
        } else {
          el.normalViewContainer.style.display = 'block';
          el.explorerView.style.display = 'none';
          el.statsView.style.display = 'none';
          render();
        }
      });
    });

    // Type pills filter
    el.typePills?.forEach(pill => {
      pill.addEventListener('click', () => {
        const type = pill.dataset.filterType;
        state.selectedType = type;
        el.typePills.forEach(p => p.classList.toggle('active', p.dataset.filterType === type));
        state.currentPage = 1;
        render();
      });
    });

    // Origin pills filter
    el.originPills?.forEach(pill => {
      pill.addEventListener('click', () => {
        const origin = pill.dataset.filterOrigin;
        state.selectedOrigin = origin;
        el.originPills.forEach(p => p.classList.toggle('active', p.dataset.filterOrigin === origin));
        state.currentPage = 1;
        render();
      });
    });

    // Category Select & list/disp selects
    el.catSelect?.addEventListener('change', (e) => {
      state.selectedCategory = e.target.value;
      state.currentPage = 1;
      updateCategoryCardsActive();
      render();
    });

    el.listSelect?.addEventListener('change', (e) => {
      state.selectedList = e.target.value;
      state.currentPage = 1;
      render();
    });

    el.dispSelect?.addEventListener('change', (e) => {
      state.selectedDispensation = e.target.value;
      state.currentPage = 1;
      render();
    });

    // Favorites only
    el.btnFavFilter?.addEventListener('click', () => {
      state.onlyFavorites = !state.onlyFavorites;
      el.btnFavFilter.classList.toggle('active', state.onlyFavorites);
      state.currentPage = 1;
      render();
    });

    // Sorting
    el.sortSelect?.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      render();
    });

    // Items per page
    el.perPageSelect?.addEventListener('change', (e) => {
      state.itemsPerPage = e.target.value === 'all' ? 999999 : parseInt(e.target.value, 10);
      state.currentPage = 1;
      render();
    });

    // View Mode Toggle
    el.viewBtns?.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.view;
        state.viewMode = mode;
        localStorage.setItem('pharmadz_view', mode);
        el.viewBtns.forEach(b => b.classList.toggle('active', b.dataset.view === mode));
        render();
      });
    });

    // CSV Export
    el.exportBtn?.addEventListener('click', exportToCsv);

    // Modal close
    el.modalCloseBtn?.addEventListener('click', closeModal);
    el.modalOverlay?.addEventListener('click', (e) => {
      if (e.target === el.modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Print
    el.modalPrintBtn?.addEventListener('click', () => {
      window.print();
    });
  }

  function onDataReady() {
    renderHeroStats();
    populateCategorySelectors();
    renderCategoryCards();
    render();
  }

  function applyTheme() {
    el.html.setAttribute('data-theme', state.theme);
    const isDark = state.theme === 'dark';
    if (el.themeBtn) {
      el.themeBtn.innerHTML = isDark
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      el.themeBtn.title = isDark ? "Mode Clair / الوضع النهاري" : "Mode Sombre / الوضع الليلي";
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

    // Update static texts
    document.querySelectorAll('[data-i18n]').forEach(node => {
      const key = node.dataset.i18n;
      if (t[key]) node.textContent = t[key];
    });

    if (el.searchInput) {
      el.searchInput.placeholder = t.search_placeholder;
    }

    if (el.langBtn) {
      el.langBtn.innerHTML = `<span>${state.lang === 'ar' ? 'Français' : 'العربية'}</span>`;
      el.langBtn.title = state.lang === 'ar' ? 'Passer en Français' : 'التحويل إلى العربية';
    }

    // Re-render categories and data
    if (db) {
      populateCategorySelectors();
      renderCategoryCards();
      render();
    }
  }

  function toggleLanguage() {
    state.lang = state.lang === 'ar' ? 'fr' : 'ar';
    localStorage.setItem('pharmadz_lang', state.lang);
    applyLanguage();
  }

  function renderHeroStats() {
    if (!db || !el.statsGrid) return;
    const s = db.stats;
    const t = I18N[state.lang];

    const gePercent = ((s.generics_active / s.total_active) * 100).toFixed(1);
    const locPercent = ((s.local_active / s.total_active) * 100).toFixed(1);

    el.statsGrid.innerHTML = `
      <div class="stat-card" data-action="filter-all">
        <div class="stat-icon" style="background:#ecfdf5;color:#059669;">💊</div>
        <div>
          <div class="stat-val">${s.total_active.toLocaleString()}</div>
          <div class="stat-label">${t.total_active_label}</div>
        </div>
      </div>
      <div class="stat-card" data-action="filter-ge">
        <div class="stat-icon" style="background:#dcfce7;color:#16a34a;">🧬</div>
        <div>
          <div class="stat-val">${s.generics_active.toLocaleString()} <span class="stat-pill" style="background:#dcfce7;color:#15803d">${gePercent}%</span></div>
          <div class="stat-label">${t.generics_label} (GE)</div>
        </div>
      </div>
      <div class="stat-card" data-action="filter-re">
        <div class="stat-icon" style="background:#f3e8ff;color:#7e22ce;">⭐</div>
        <div>
          <div class="stat-val">${s.princeps_active.toLocaleString()}</div>
          <div class="stat-label">${t.princeps_label} (RE)</div>
        </div>
      </div>
      <div class="stat-card" data-action="filter-local">
        <div class="stat-icon" style="background:#ccfbf1;color:#0f766e;">🇩🇿</div>
        <div>
          <div class="stat-val">${s.local_active.toLocaleString()} <span class="stat-pill" style="background:#ccfbf1;color:#0f766e">${locPercent}%</span></div>
          <div class="stat-label">${t.local_label}</div>
        </div>
      </div>
      <div class="stat-card" data-action="filter-import">
        <div class="stat-icon" style="background:#e0f2fe;color:#0284c7;">🌐</div>
        <div>
          <div class="stat-val">${s.imported_active.toLocaleString()}</div>
          <div class="stat-label">${t.imported_label}</div>
        </div>
      </div>
    `;

    // Click shortcuts on stats
    el.statsGrid.querySelectorAll('.stat-card').forEach(card => {
      card.addEventListener('click', () => {
        const action = card.dataset.action;
        if (action === 'filter-ge') {
          state.selectedType = 'GE';
          el.typePills.forEach(p => p.classList.toggle('active', p.dataset.filterType === 'GE'));
        } else if (action === 'filter-re') {
          state.selectedType = 'RE';
          el.typePills.forEach(p => p.classList.toggle('active', p.dataset.filterType === 'RE'));
        } else if (action === 'filter-local') {
          state.selectedOrigin = 'F';
          el.originPills.forEach(p => p.classList.toggle('active', p.dataset.filterOrigin === 'F'));
        } else if (action === 'filter-import') {
          state.selectedOrigin = 'I';
          el.originPills.forEach(p => p.classList.toggle('active', p.dataset.filterOrigin === 'I'));
        } else {
          // Reset
          state.selectedType = 'all';
          state.selectedOrigin = 'all';
          state.selectedCategory = 'all';
          el.typePills.forEach(p => p.classList.toggle('active', p.dataset.filterType === 'all'));
          el.originPills.forEach(p => p.classList.toggle('active', p.dataset.filterOrigin === 'all'));
        }
        state.currentPage = 1;
        render();
      });
    });
  }

  function populateCategorySelectors() {
    if (!db || !el.catSelect) return;
    const t = I18N[state.lang];
    const isAr = state.lang === 'ar';

    let html = `<option value="all">${t.all_categories}</option>`;
    Object.keys(db.categories).sort().forEach(cid => {
      const cat = db.categories[cid];
      const name = isAr ? cat.name_ar : cat.name_fr;
      html += `<option value="${cid}">${cat.icon} [${cid}] ${name} (${cat.count})</option>`;
    });
    el.catSelect.innerHTML = html;
    el.catSelect.value = state.selectedCategory;
  }

  function renderCategoryCards() {
    if (!db || !el.catCarousel) return;
    const isAr = state.lang === 'ar';

    let html = '';
    Object.keys(db.categories).sort().forEach(cid => {
      const cat = db.categories[cid];
      const name = isAr ? cat.name_ar : cat.name_fr;
      const isActive = state.selectedCategory === cid;

      html += `
        <div class="cat-card ${isActive ? 'active' : ''}" data-cat-id="${cid}">
          <div class="cat-icon-wrap">${cat.icon}</div>
          <div class="cat-info">
            <div class="cat-name" title="${name}">${name}</div>
            <div class="cat-meta">
              <span class="cat-code-badge">Classe ${cid}</span>
              <span>•</span>
              <span>${cat.count} ${isAr ? 'دواء' : 'produits'}</span>
            </div>
          </div>
        </div>
      `;
    });
    el.catCarousel.innerHTML = html;

    el.catCarousel.querySelectorAll('.cat-card').forEach(card => {
      card.addEventListener('click', () => {
        const cid = card.dataset.catId;
        state.selectedCategory = state.selectedCategory === cid ? 'all' : cid;
        if (el.catSelect) el.catSelect.value = state.selectedCategory;
        updateCategoryCardsActive();
        state.currentPage = 1;
        render();
      });
    });
  }

  function updateCategoryCardsActive() {
    el.catCarousel?.querySelectorAll('.cat-card').forEach(card => {
      card.classList.toggle('active', card.dataset.catId === state.selectedCategory);
    });
  }

  // Core Filtering Engine
  function getFilteredItems() {
    if (!db) return [];
    let list = [];
    if (state.currentTab === 'active') list = db.active;
    else if (state.currentTab === 'non_renewed') list = db.non_renewed;
    else if (state.currentTab === 'withdrawn') list = db.withdrawn;

    const q = state.searchQuery.toLowerCase();
    const cat = state.selectedCategory;
    const type = state.selectedType;
    const origin = state.selectedOrigin;
    const listFilter = state.selectedList;
    const disp = state.selectedDispensation;
    const favsOnly = state.onlyFavorites;

    return list.filter(item => {
      // Favorites filter
      if (favsOnly && !state.favorites.has(getItemKey(item))) {
        return false;
      }

      // Category filter
      if (cat !== 'all' && item.cat_id !== cat) {
        return false;
      }

      // Type filter (GE, RE, BIO)
      if (type !== 'all' && item.type !== type) {
        return false;
      }

      // Origin filter (F = local, I = import)
      if (origin !== 'all' && item.statut !== origin) {
        return false;
      }

      // List filter (LISTE I, LISTE II)
      if (listFilter !== 'all') {
        const itemL = (item.list || '').toUpperCase();
        if (!itemL.includes(listFilter)) return false;
      }

      // Dispensation (HOP, OFF)
      if (disp !== 'all') {
        if (disp === 'HOP' && item.p1 !== 'HOP' && item.p2 !== 'HOP') return false;
        if (disp === 'OFF' && item.p1 !== 'OFF' && item.p2 !== 'OFF') return false;
      }

      // Search Query
      if (q) {
        const b = (item.brand || '').toLowerCase();
        const d = (item.dci || '').toLowerCase();
        const c = (item.code || '').toLowerCase();
        const r = (item.reg || '').toLowerCase();
        const l = (item.lab || '').toLowerCase();
        const form = (item.form || '').toLowerCase();
        if (
          !b.includes(q) &&
          !d.includes(q) &&
          !c.includes(q) &&
          !r.includes(q) &&
          !l.includes(q) &&
          !form.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }

  // Sorting
  function sortItems(items) {
    const s = state.sortBy;
    return items.sort((a, b) => {
      if (s === 'brand_asc') return (a.brand || '').localeCompare(b.brand || '');
      if (s === 'brand_desc') return (b.brand || '').localeCompare(a.brand || '');
      if (s === 'dci_asc') return (a.dci || '').localeCompare(b.dci || '');
      if (s === 'code') return (a.code || '').localeCompare(b.code || '');
      if (s === 'date') return (b.date_final || b.date_init || '').localeCompare(a.date_final || a.date_init || '');
      return 0;
    });
  }

  function getItemKey(item) {
    return `${item.reg || item.code}_${item.brand}`;
  }

  // Main Render Routine
  function render() {
    if (!db || state.currentTab === 'generics_explorer' || state.currentTab === 'stats') return;

    const t = I18N[state.lang];
    const isAr = state.lang === 'ar';
    const allFiltered = getFilteredItems();
    const sorted = sortItems(allFiltered);

    // Update Toolbar count
    if (el.resultsCount) {
      el.resultsCount.innerHTML = `<span>${t.results_found}</span> <strong>${sorted.length.toLocaleString()}</strong> ${t.medication_unit}`;
    }

    renderActiveFilterTags();

    // Pagination
    const total = sorted.length;
    const perPage = state.itemsPerPage;
    const totalPages = Math.ceil(total / perPage) || 1;
    if (state.currentPage > totalPages) state.currentPage = totalPages;

    const startIndex = (state.currentPage - 1) * perPage;
    const pageItems = sorted.slice(startIndex, startIndex + perPage);

    // Empty state
    if (pageItems.length === 0) {
      el.productsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">${t.no_results}</h3>
          <p>${isAr ? 'جرب البحث بكلمات أخرى أو قم بإلغاء بعض الفلاتر المفعلة.' : 'Essayez d\'ajuster vos filtres ou d\'utiliser des termes de recherche plus génériques.'}</p>
        </div>
      `;
      renderPagination(0, 0);
      return;
    }

    // Render Grid or Table
    if (state.viewMode === 'grid') {
      renderGridView(pageItems);
    } else {
      renderTableView(pageItems);
    }

    renderPagination(total, totalPages);
  }

  function renderActiveFilterTags() {
    if (!el.activeFilterTags) return;
    let html = '';
    const t = I18N[state.lang];

    if (state.selectedCategory !== 'all') {
      const cat = db.categories[state.selectedCategory];
      const name = state.lang === 'ar' ? cat?.name_ar : cat?.name_fr;
      html += `<span class="filter-tag">${cat?.icon || ''} ${name} <button data-clear="cat">✕</button></span>`;
    }
    if (state.selectedType !== 'all') {
      html += `<span class="filter-tag">${state.selectedType} <button data-clear="type">✕</button></span>`;
    }
    if (state.selectedOrigin !== 'all') {
      const label = state.selectedOrigin === 'F' ? 'Fabrication Locale 🇩🇿' : 'Importation 🌐';
      html += `<span class="filter-tag">${label} <button data-clear="origin">✕</button></span>`;
    }
    if (state.onlyFavorites) {
      html += `<span class="filter-tag">★ ${t.favorites_only} <button data-clear="favs">✕</button></span>`;
    }

    el.activeFilterTags.innerHTML = html;

    el.activeFilterTags.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const clr = btn.dataset.clear;
        if (clr === 'cat') {
          state.selectedCategory = 'all';
          if (el.catSelect) el.catSelect.value = 'all';
          updateCategoryCardsActive();
        } else if (clr === 'type') {
          state.selectedType = 'all';
          el.typePills.forEach(p => p.classList.toggle('active', p.dataset.filterType === 'all'));
        } else if (clr === 'origin') {
          state.selectedOrigin = 'all';
          el.originPills.forEach(p => p.classList.toggle('active', p.dataset.filterOrigin === 'all'));
        } else if (clr === 'favs') {
          state.onlyFavorites = false;
          el.btnFavFilter?.classList.remove('active');
        }
        state.currentPage = 1;
        render();
      });
    });
  }

  function renderGridView(items) {
    const t = I18N[state.lang];
    const isAr = state.lang === 'ar';

    let html = '<div class="products-grid">';
    items.forEach(item => {
      const key = getItemKey(item);
      const isFav = state.favorites.has(key);

      // Badges
      let typeBadge = '';
      if (item.type === 'GE') typeBadge = `<span class="badge badge-ge">🧬 Générique</span>`;
      else if (item.type === 'RE') typeBadge = `<span class="badge badge-re">⭐ Princeps / Réf.</span>`;
      else if (item.type === 'BIO') typeBadge = `<span class="badge badge-bio">🧪 Biosimilaire</span>`;

      let originBadge = item.statut === 'F'
        ? `<span class="badge badge-local">🇩🇿 Fab. Locale</span>`
        : `<span class="badge badge-import">🌐 Importé</span>`;

      html += `
        <div class="product-card" data-key="${key}">
          <div>
            <div class="card-top">
              <div class="card-badges">
                ${typeBadge}
                ${originBadge}
                <span class="badge badge-code">${item.code || ''}</span>
              </div>
              <button class="btn-fav ${isFav ? 'active' : ''}" data-fav-key="${key}" title="Ajouter aux favoris">
                ★
              </button>
            </div>

            <h3 class="card-brand-name">${item.brand || '—'}</h3>
            <div class="card-dci" title="${item.dci || ''}">
              ${item.dci || '—'}
            </div>

            <div class="card-specs-list">
              <div class="spec-row">
                <span class="spec-key">${t.dosage}:</span>
                <span class="spec-val">${item.dosage || '—'}</span>
              </div>
              <div class="spec-row">
                <span class="spec-key">${t.form}:</span>
                <span class="spec-val" title="${item.form || ''}">${item.form || '—'}</span>
              </div>
              <div class="spec-row">
                <span class="spec-key">${t.packaging}:</span>
                <span class="spec-val">${item.pkg || '—'}</span>
              </div>
              <div class="spec-row">
                <span class="spec-key">${t.reg_num}:</span>
                <span class="spec-val" style="font-family: monospace;">${item.reg || '—'}</span>
              </div>
            </div>
          </div>

          <div>
            <div class="card-footer">
              <div class="card-lab" title="${item.lab || ''} (${item.country || ''})">
                🏢 ${item.lab || '—'}
              </div>
              <div class="card-actions">
                <button class="btn-card-generics" data-find-generics="${item.dci}">
                  🧬 ${t.generics_btn}
                </button>
                <button class="btn-card-detail" data-show-detail="${key}">
                  ${t.details_btn}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';

    el.productsContainer.innerHTML = html;
    attachCardListeners(items);
  }

  function renderTableView(items) {
    const t = I18N[state.lang];

    let html = `
      <div class="table-wrapper">
        <table class="meds-table">
          <thead>
            <tr>
              <th>★</th>
              <th>${t.code}</th>
              <th>${t.site_title.includes('Nomenclature') ? 'Nom de marque' : 'الاسم التجاري'}</th>
              <th>DCI</th>
              <th>${t.form}</th>
              <th>${t.dosage}</th>
              <th>${t.packaging}</th>
              <th>${t.type_label}</th>
              <th>${t.origin_label}</th>
              <th>${t.lab}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
    `;

    items.forEach(item => {
      const key = getItemKey(item);
      const isFav = state.favorites.has(key);

      let typeBadge = item.type === 'GE' ? '<span class="badge badge-ge">GE</span>'
        : item.type === 'RE' ? '<span class="badge badge-re">RE</span>'
        : item.type === 'BIO' ? '<span class="badge badge-bio">BIO</span>' : '—';

      let originBadge = item.statut === 'F' ? '<span class="badge badge-local">🇩🇿 Local</span>' : '<span class="badge badge-import">🌐 Import</span>';

      html += `
        <tr data-key="${key}">
          <td>
            <button class="btn-fav ${isFav ? 'active' : ''}" data-fav-key="${key}">★</button>
          </td>
          <td style="font-family: monospace; font-weight: bold; color: var(--primary-600);">${item.code || ''}</td>
          <td>
            <span class="table-brand-link" data-show-detail="${key}">${item.brand || '—'}</span>
          </td>
          <td style="font-weight: 600;">${item.dci || '—'}</td>
          <td>${item.form || '—'}</td>
          <td>${item.dosage || '—'}</td>
          <td>${item.pkg || '—'}</td>
          <td>${typeBadge}</td>
          <td>${originBadge}</td>
          <td title="${item.lab || ''}">${(item.lab || '').substring(0, 25)}...</td>
          <td>
            <button class="btn-card-generics" data-find-generics="${item.dci}" style="padding: 0.25rem 0.5rem;">
              🧬
            </button>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    el.productsContainer.innerHTML = html;
    attachCardListeners(items);
  }

  function attachCardListeners(items) {
    const itemMap = new Map();
    items.forEach(i => itemMap.set(getItemKey(i), i));

    // Favorite toggle
    el.productsContainer.querySelectorAll('[data-fav-key]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.dataset.favKey;
        if (state.favorites.has(key)) {
          state.favorites.delete(key);
          btn.classList.remove('active');
        } else {
          state.favorites.add(key);
          btn.classList.add('active');
          showToast(state.lang === 'ar' ? 'تمت إضافة الدواء إلى المفضلة' : 'Ajouté aux favoris');
        }
        localStorage.setItem('pharmadz_favs', JSON.stringify(Array.from(state.favorites)));
      });
    });

    // Show Detail
    el.productsContainer.querySelectorAll('[data-show-detail]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.showDetail;
        const itm = itemMap.get(key) || findItemByKey(key);
        if (itm) openModal(itm);
      });
    });

    // Find Generics
    el.productsContainer.querySelectorAll('[data-find-generics]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dci = btn.dataset.findGenerics;
        filterByDciGenerics(dci);
      });
    });
  }

  function findItemByKey(key) {
    const all = [...(db.active || []), ...(db.non_renewed || []), ...(db.withdrawn || [])];
    return all.find(i => getItemKey(i) === key);
  }

  // Quick Generics Filter Shortcut
  function filterByDciGenerics(dci) {
    if (!dci) return;
    state.searchQuery = dci;
    if (el.searchInput) {
      el.searchInput.value = dci;
      el.clearSearchBtn.style.display = 'block';
    }
    state.currentPage = 1;
    // Switch to active tab if on special view
    if (state.currentTab === 'generics_explorer' || state.currentTab === 'stats') {
      state.currentTab = 'active';
      el.tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === 'active'));
      el.normalViewContainer.style.display = 'block';
      el.explorerView.style.display = 'none';
      el.statsView.style.display = 'none';
    }
    render();
    window.scrollTo({ top: el.productsContainer.offsetTop - 120, behavior: 'smooth' });
    showToast(state.lang === 'ar' ? `عرض جميع بدائل: ${dci}` : `Affichage des équivalents de : ${dci}`);
  }

  // Pagination Renderer
  function renderPagination(total, totalPages) {
    if (!el.paginationWrapper) return;
    if (totalPages <= 1) {
      el.paginationWrapper.innerHTML = '';
      return;
    }

    const curr = state.currentPage;
    let html = `
      <div class="pagination-controls">
        <button class="page-btn" data-page="${curr - 1}" ${curr === 1 ? 'disabled' : ''}>
          ${state.lang === 'ar' ? '→' : '←'}
        </button>
    `;

    // Pages calculation
    const maxButtons = 5;
    let startPage = Math.max(1, curr - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      html += `<button class="page-btn" data-page="1">1</button>`;
      if (startPage > 2) html += `<span style="padding: 0 0.25rem;">...</span>`;
    }

    for (let p = startPage; p <= endPage; p++) {
      html += `<button class="page-btn ${p === curr ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) html += `<span style="padding: 0 0.25rem;">...</span>`;
      html += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
    }

    html += `
        <button class="page-btn" data-page="${curr + 1}" ${curr === totalPages ? 'disabled' : ''}>
          ${state.lang === 'ar' ? '←' : '→'}
        </button>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-muted);">
        Page <strong>${curr}</strong> / <strong>${totalPages}</strong> (${total.toLocaleString()} total)
      </div>
    `;

    el.paginationWrapper.innerHTML = html;

    el.paginationWrapper.querySelectorAll('.page-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.page, 10);
        if (p && p !== curr && p >= 1 && p <= totalPages) {
          state.currentPage = p;
          render();
          window.scrollTo({ top: el.productsContainer.offsetTop - 120, behavior: 'smooth' });
        }
      });
    });
  }

  // Product Dossier Modal
  function openModal(item) {
    state.activeModalItem = item;
    const t = I18N[state.lang];
    const isAr = state.lang === 'ar';

    const cat = db?.categories[item.cat_id];
    const catName = isAr ? cat?.name_ar : cat?.name_fr;

    el.modalTitle.textContent = item.brand || '—';
    el.modalDci.textContent = item.dci || '—';

    // Build Detail Grid
    let gridHtml = `
      <div class="detail-item">
        <span class="detail-label">${t.reg_num}</span>
        <span class="detail-value" style="font-family: monospace;">${item.reg || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${t.code}</span>
        <span class="detail-value" style="color: var(--primary-600); font-family: monospace;">${item.code || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${t.category_label}</span>
        <span class="detail-value">${cat?.icon || ''} ${catName || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${t.type_label}</span>
        <span class="detail-value">
          ${item.type === 'GE' ? '🧬 Générique (GE)' : item.type === 'RE' ? '⭐ Princeps / Réf. (RE)' : item.type === 'BIO' ? '🧪 Biosimilaire (BIO)' : '—'}
        </span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${t.origin_label}</span>
        <span class="detail-value">
          ${item.statut === 'F' ? '🇩🇿 Fabrication locale (F)' : '🌐 Importation (I)'}
        </span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${t.dosage}</span>
        <span class="detail-value">${item.dosage || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${t.form}</span>
        <span class="detail-value">${item.form || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${t.packaging}</span>
        <span class="detail-value">${item.pkg || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${t.list}</span>
        <span class="detail-value">${item.list || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${t.dispensation}</span>
        <span class="detail-value">${[item.p1, item.p2].filter(Boolean).join(' / ') || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${t.lab}</span>
        <span class="detail-value">${item.lab || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${t.country}</span>
        <span class="detail-value">${item.country || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${t.date_init}</span>
        <span class="detail-value">${item.date_init || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${t.date_final}</span>
        <span class="detail-value">${item.date_final || '—'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">${t.stability}</span>
        <span class="detail-value">${item.stability || '—'}</span>
      </div>
    `;

    if (item.source === 'withdrawn') {
      gridHtml += `
        <div class="detail-item" style="border-color: #fda4af; background: #fff1f2;">
          <span class="detail-label" style="color: #e11d48;">${t.withdrawal_date}</span>
          <span class="detail-value" style="color: #9f1239;">${item.withdrawal_date || '—'}</span>
        </div>
        <div class="detail-item" style="border-color: #fda4af; background: #fff1f2; grid-column: 1 / -1;">
          <span class="detail-label" style="color: #e11d48;">${t.withdrawal_reason}</span>
          <span class="detail-value" style="color: #9f1239;">${item.withdrawal_reason || '—'}</span>
        </div>
      `;
    }

    el.modalDetailsGrid.innerHTML = gridHtml;

    // Find all generics/alternatives for this molecule
    renderModalGenerics(item);

    el.modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function renderModalGenerics(targetItem) {
    if (!db || !el.modalGenericsList || !targetItem.dci) {
      el.modalGenericsList.innerHTML = '<p>Aucun équivalent disponible.</p>';
      return;
    }

    const t = I18N[state.lang];
    const isAr = state.lang === 'ar';
    const targetDci = (targetItem.dci || '').trim().toUpperCase();

    // Search among active items sharing the same DCI
    const alts = db.active.filter(i => {
      const d = (i.dci || '').trim().toUpperCase();
      return d === targetDci && getItemKey(i) !== getItemKey(targetItem);
    });

    if (alts.length === 0) {
      el.modalGenericsList.innerHTML = `
        <div style="font-size: 0.85rem; color: var(--text-muted); padding: 0.5rem;">
          ${isAr ? 'لا توجد بدائل مسجلة أخرى لهذه المادة الفعالة حالياً.' : 'Aucun autre équivalent actif enregistré avec cette même DCI.'}
        </div>
      `;
      return;
    }

    let html = '';
    alts.forEach(alt => {
      const typeBadge = alt.type === 'GE' ? '<span class="badge badge-ge">GE</span>'
        : alt.type === 'RE' ? '<span class="badge badge-re">RE</span>' : '';
      const originFlag = alt.statut === 'F' ? '🇩🇿' : '🌐';

      html += `
        <div class="generic-alt-card" data-key="${getItemKey(alt)}">
          <div>
            <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-main);">
              ${alt.brand} <span style="font-weight: normal; font-size: 0.8rem; color: var(--text-muted);">(${alt.dosage} - ${alt.form})</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              🏢 ${alt.lab} (${originFlag} ${alt.country}) • N° ${alt.reg}
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            ${typeBadge}
            <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;">
              ${t.details_btn}
            </button>
          </div>
        </div>
      `;
    });

    el.modalGenericsList.innerHTML = html;

    el.modalGenericsList.querySelectorAll('.generic-alt-card').forEach(card => {
      card.addEventListener('click', () => {
        const key = card.dataset.key;
        const itm = findItemByKey(key);
        if (itm) openModal(itm);
      });
    });
  }

  function closeModal() {
    el.modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    state.activeModalItem = null;
  }

  // Generics Explorer View (Groups DCIs and their generics)
  function renderGenericsExplorer() {
    if (!db || !el.explorerView) return;
    const isAr = state.lang === 'ar';

    // Group active medications by DCI
    const dciMap = new Map();
    db.active.forEach(item => {
      const dci = (item.dci || '').trim().toUpperCase();
      if (!dci) return;
      if (!dciMap.has(dci)) {
        dciMap.set(dci, { dci, items: [], geCount: 0, reCount: 0 });
      }
      const entry = dciMap.get(dci);
      entry.items.push(item);
      if (item.type === 'GE') entry.geCount++;
      else if (item.type === 'RE') entry.reCount++;
    });

    // Sort DCIs by number of products descending (molecules with most generics first!)
    const sortedDcis = Array.from(dciMap.values()).sort((a, b) => b.items.length - a.items.length);

    let html = `
      <div class="generics-explorer-box">
        <div class="explorer-header">
          <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 0.5rem;">
            🧬 ${isAr ? 'دليل البدائل الجنيسة والمواد الفعالة' : 'Guide des Molécules & Équivalents Génériques'}
          </h2>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            ${isAr
              ? 'تصفح الأدوية مصنفة حسب المادة الفعالة (DCI) مع إبراز الدواء المرجعي (Princeps) وجميع البدائل الجنيسة المتاحة في السوق الوطني.'
              : 'Explorez le répertoire par substance active (DCI) avec mise en valeur des spécialités princeps et de l\'ensemble des alternatives génériques homologuées.'}
          </p>
        </div>

        <div class="dci-groups-grid">
    `;

    // Take top 60 molecules
    sortedDcis.slice(0, 60).forEach(group => {
      const princepsItem = group.items.find(i => i.type === 'RE');
      const princepsName = princepsItem ? princepsItem.brand : null;

      html += `
        <div class="dci-group-card">
          <div class="dci-group-title">
            <span style="font-size: 1.05rem;" title="${group.dci}">${group.dci.length > 28 ? group.dci.substring(0, 28) + '...' : group.dci}</span>
            <span class="dci-group-badge">${group.items.length} ${isAr ? 'أدوية' : 'spécialités'}</span>
          </div>

          <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            ${princepsName ? `⭐ Princeps : <strong style="color: var(--primary-700);">${princepsName}</strong>` : ''}
            • 🧬 ${group.geCount} ${isAr ? 'جنيس' : 'génériques'}
          </div>

          <div class="dci-brands-cloud">
      `;

      group.items.forEach(itm => {
        const isPrinceps = itm.type === 'RE';
        html += `
          <span class="brand-chip" data-find-brand="${itm.brand}" style="${isPrinceps ? 'background:#f3e8ff;color:#7e22ce;font-weight:bold;border-color:#d8b4fe;' : ''}">
            ${itm.brand}
          </span>
        `;
      });

      html += `
          </div>
          <div style="margin-top: 0.75rem; text-align: end;">
            <button class="btn btn-outline" data-explorer-dci="${group.dci}" style="padding: 0.3rem 0.65rem; font-size: 0.75rem;">
              ${isAr ? 'عرض الكل في القائمة ←' : 'Voir tous les équivalents →'}
            </button>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    el.explorerView.innerHTML = html;

    // Attach click triggers
    el.explorerView.querySelectorAll('[data-explorer-dci]').forEach(btn => {
      btn.addEventListener('click', () => {
        filterByDciGenerics(btn.dataset.explorerDci);
      });
    });

    el.explorerView.querySelectorAll('[data-find-brand]').forEach(chip => {
      chip.addEventListener('click', () => {
        const brand = chip.dataset.findBrand;
        const itm = db.active.find(i => i.brand === brand);
        if (itm) openModal(itm);
      });
    });
  }

  // Statistics & Analytics View
  function renderStatsView() {
    if (!db || !el.statsView) return;
    const isAr = state.lang === 'ar';
    const s = db.stats;

    // Calculate Top Labs
    const labCounts = {};
    db.active.forEach(i => {
      const l = (i.lab || 'INCONNU').trim();
      labCounts[l] = (labCounts[l] || 0) + 1;
    });
    const sortedLabs = Object.entries(labCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const maxLab = sortedLabs[0][1] || 1;

    // Top Categories
    const sortedCats = Object.values(db.categories).sort((a, b) => b.count - a.count).slice(0, 10);
    const maxCat = sortedCats[0].count || 1;

    let html = `
      <div class="stats-view-container">
        <div style="text-align: center; max-width: 700px; margin-inline: auto;">
          <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 0.5rem;">
            📊 ${isAr ? 'التحليلات ومؤشرات السوق الدوائي الجزائري' : 'Tableau de Bord & Analyses du Marché Pharmaceutique'}
          </h2>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            ${isAr
              ? 'نظرة شاملة ومفصلة على توزيع الأدوية، نسب الجنيس مقابل المرجعي، ومؤشرات توطين الإنتاج المحلي.'
              : 'Indicateurs clés de la nomenclature : taux de pénétration des génériques, souveraineté pharmaceutique et top laboratoires.'}
          </p>
        </div>

        <div class="stats-charts-grid">
          <!-- Top Laboratories -->
          <div class="chart-card">
            <h3>🏢 ${isAr ? 'أكبر 10 مخابر مصنعة في الجزائر' : 'Top 10 Laboratoires détenteurs'}</h3>
    `;

    sortedLabs.forEach(([lab, count]) => {
      const pct = ((count / maxLab) * 100).toFixed(0);
      html += `
        <div class="bar-row">
          <div class="bar-label-line">
            <span style="max-width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${lab}">${lab}</span>
            <span style="color: var(--primary-600); font-weight: bold;">${count}</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    });

    html += `
          </div>

          <!-- Top Therapeutic Categories -->
          <div class="chart-card">
            <h3>💊 ${isAr ? 'أكبر 10 فئات علاجية مسجلة' : 'Top 10 Classes thérapeutiques'}</h3>
    `;

    sortedCats.forEach(cat => {
      const name = isAr ? cat.name_ar : cat.name_fr;
      const pct = ((cat.count / maxCat) * 100).toFixed(0);
      html += `
        <div class="bar-row">
          <div class="bar-label-line">
            <span style="max-width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${name}">${cat.icon} [${cat.id}] ${name}</span>
            <span style="color: var(--accent-cyan); font-weight: bold;">${cat.count}</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%; background: var(--accent-cyan);"></div>
          </div>
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <!-- Breakdown summary cards -->
        <div class="stats-charts-grid">
          <div class="chart-card">
            <h3>🧬 ${isAr ? 'توزيع الأدوية حسب النوع' : 'Répartition par Type de produit'}</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>🧬 Générique (GE)</span>
                <strong>${s.generics_active} (${((s.generics_active / s.total_active) * 100).toFixed(1)}%)</strong>
              </div>
              <div class="bar-track"><div class="bar-fill" style="width: ${(s.generics_active / s.total_active) * 100}%;"></div></div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>⭐ Princeps / Réf. (RE)</span>
                <strong>${s.princeps_active} (${((s.princeps_active / s.total_active) * 100).toFixed(1)}%)</strong>
              </div>
              <div class="bar-track"><div class="bar-fill" style="width: ${(s.princeps_active / s.total_active) * 100}%; background: var(--accent-purple);"></div></div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>🧪 Biosimilaire (BIO)</span>
                <strong>${s.biosimilars_active} (${((s.biosimilars_active / s.total_active) * 100).toFixed(1)}%)</strong>
              </div>
              <div class="bar-track"><div class="bar-fill" style="width: ${(s.biosimilars_active / s.total_active) * 100}%; background: var(--accent-amber);"></div></div>
            </div>
          </div>

          <div class="chart-card">
            <h3>🇩🇿 ${isAr ? 'مؤشر توطين التصنيع الدوائي' : 'Souveraineté : Local vs Import'}</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>🇩🇿 Fabrication locale (F)</span>
                <strong>${s.local_active} (${((s.local_active / s.total_active) * 100).toFixed(1)}%)</strong>
              </div>
              <div class="bar-track"><div class="bar-fill" style="width: ${(s.local_active / s.total_active) * 100}%; background: #0f766e;"></div></div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>🌐 Importation (I)</span>
                <strong>${s.imported_active} (${((s.imported_active / s.total_active) * 100).toFixed(1)}%)</strong>
              </div>
              <div class="bar-track"><div class="bar-fill" style="width: ${(s.imported_active / s.total_active) * 100}%; background: #0284c7;"></div></div>
            </div>
          </div>
        </div>
      </div>
    `;

    el.statsView.innerHTML = html;
  }

  // Export to CSV Routine
  function exportToCsv() {
    const items = getFilteredItems();
    if (items.length === 0) {
      showToast(state.lang === 'ar' ? 'لا توجد بيانات للتصدير' : 'Aucune donnée à exporter');
      return;
    }

    const headers = [
      "N°", "N° Enregistrement", "Code", "DCI", "Nom de Marque",
      "Forme", "Dosage", "Conditionnement", "Liste", "P1", "P2",
      "Laboratoire", "Pays", "Date Initiale", "Date Finale", "Type", "Statut", "Stabilité"
    ];

    const escapeCsv = (val) => {
      const str = String(val || '').replace(/"/g, '""');
      return `"${str}"`;
    };

    let csvContent = "\uFEFF"; // UTF-8 BOM so Excel opens it with Arabic and accents perfectly!
    csvContent += headers.map(escapeCsv).join(",") + "\r\n";

    items.forEach(i => {
      const row = [
        i.num, i.reg, i.code, i.dci, i.brand,
        i.form, i.dosage, i.pkg, i.list, i.p1, i.p2,
        i.lab, i.country, i.date_init, i.date_final, i.type, i.statut, i.stability
      ];
      csvContent += row.map(escapeCsv).join(",") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nomenclature_Pharmaceutique_${state.currentTab}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(state.lang === 'ar' ? 'تم تصدير ملف CSV بنجاح' : 'Fichier CSV exporté avec succès');
  }

  // Toast Notification
  function showToast(msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✓</span> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Start on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
