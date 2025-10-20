// Language Translations for Earth 3D Map (English, French, Arabic)
const translations = {
    en: {
        // Toolbar & Navigation
        satellite: 'Satellite',
        terrain: 'Terrain',
        language: 'Language',
        
        // Layers Control
        layers: 'Layers',
        countryBorders: 'Country Borders',
        countryLabels: 'Country Labels',
        cityLabels: 'City Labels',
        imageryOpacity: 'Imagery Opacity',
        
        // Bookmarks
        bookmarks: 'Bookmarks',
        saveCurrentView: '💾 Save Current View',
        
        // Heatmap Panel
        dataHeatmap: 'Data Heatmap 🔥',
        selectCountries: 'SELECT COUNTRIES:',
        selectMetric: 'Select Metric:',
        heatmapOpacity: 'Heatmap Opacity:',
        showHeatmap: 'Show Heatmap',
        hideHeatmap: 'Hide Heatmap',
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        comparisonStats: '📊 Comparison Stats:',
        
        // Energy Panel
        energyData: 'Energy Data',
        country: 'Country:',
        year: 'Year:',
        play: 'Play Animation',
        pause: 'Pause Animation',
        aiPredictionModel: 'AI PREDICTION MODEL',
        deterministicProjections: 'Deterministic mathematical projections based on historical trends, growth rates, and field-specific models. No randomness - results are consistent and reproducible.',
        modelsUsed: 'Models Used:',
        recalculatePredictions: '🔄 Recalculate Predictions',
        calculated: 'Calculated:',
        
        // Stats Labels
        population: 'POPULATION',
        million: 'million',
        gdp: 'GDP',
        billionUSD: 'billion USD',
        energyConsumption: 'ENERGY CONSUMPTION',
        mtep: 'MTEP',
        oilProduction: 'OIL PRODUCTION',
        millionBarrels: 'M barrels',
        gasProduction: 'GAS PRODUCTION',
        billionCubicMeters: 'billion m³',
        electricityProduction: 'ELECTRICITY PRODUCTION',
        twh: 'TWh',
        renewableEnergyShare: 'RENEWABLE ENERGY SHARE',
        percent: '%',
        oilReserves: 'OIL RESERVES',
        gasReserves: 'GAS RESERVES',
        energyImports: 'ENERGY IMPORTS',
        energyExports: 'ENERGY EXPORTS',
        co2Emissions: 'CO2 EMISSIONS',
        millionTonnes: 'M tonnes',
        investment: 'INVESTMENT',
        millionUSD: 'million USD',
        
        // Carousel
        energyProduction: 'ENERGY PRODUCTION',
        renewableTransition: 'RENEWABLE TRANSITION',
        energyBalance: 'ENERGY BALANCE',
        economicIndicators: 'ECONOMIC INDICATORS',
        
        // Countries
        tunisia: 'Tunisia',
        algeria: 'Algeria',
        libya: 'Libya',
        morocco: 'Morocco',
        
        // Messages
        loadingEarthMap: 'Loading Earth Map...',
        noCountriesSelected: 'No countries selected',
        selectAtLeastOneCountry: 'Please select at least one country to display heatmap',
        noDataAvailable: 'No data available',
        governorateDataNotLoaded: 'Governorate data not loaded yet',
        metricNotFound: 'Metric not found',
        
        // Metrics
        energy_consumption: 'Energy Consumption',
        oil_production: 'Oil Production',
        gas_production: 'Gas Production',
        electricity_production: 'Electricity Production',
        renewable_share: 'Renewable Share %',
        co2_emissions: 'CO2 Emissions',
        renewable_share_label: 'Renewable Energy Share',
    },
    ar: {
        // Toolbar & Navigation
        satellite: 'الأقمار الصناعية',
        terrain: 'التضاريس',
        language: 'اللغة',
        
        // Layers Control
        layers: 'الطبقات',
        countryBorders: 'حدود البلاد',
        countryLabels: 'تسميات الدول',
        cityLabels: 'تسميات المدن',
        imageryOpacity: 'شفافية الصور',
        
        // Bookmarks
        bookmarks: 'الإشارات المرجعية',
        saveCurrentView: '💾 حفظ العرض الحالي',
        
        // Heatmap Panel
        dataHeatmap: 'خريطة البيانات الحرارية 🔥',
        selectCountries: 'اختر الدول:',
        selectMetric: 'اختر مقياس:',
        heatmapOpacity: 'شفافية الخريطة الحرارية:',
        showHeatmap: 'عرض الخريطة الحرارية',
        hideHeatmap: 'إخفاء الخريطة الحرارية',
        low: 'منخفض',
        medium: 'متوسط',
        high: 'عالي',
        comparisonStats: '📊 إحصائيات المقارنة:',
        
        // Energy Panel
        energyData: 'بيانات الطاقة',
        country: 'البلد:',
        year: 'السنة:',
        play: 'تشغيل الرسم المتحرك',
        pause: 'إيقاف الرسم المتحرك',
        aiPredictionModel: 'نموذج التنبؤ بالذكاء الاصطناعي',
        deterministicProjections: 'توقعات رياضية حتمية بناءً على الاتجاهات التاريخية ومعدلات النمو والنماذج الخاصة بالمجال. بدون عشوائية - النتائج ثابتة وقابلة للتكرار.',
        modelsUsed: 'النماذج المستخدمة:',
        recalculatePredictions: '🔄 إعادة حساب التنبؤات',
        calculated: 'محسوب:',
        
        // Stats Labels
        population: 'السكان',
        million: 'مليون',
        gdp: 'الناتج المحلي الإجمالي',
        billionUSD: 'مليار دولار',
        energyConsumption: 'استهلاك الطاقة',
        mtep: 'MTEP',
        oilProduction: 'إنتاج النفط',
        millionBarrels: 'مليون برميل',
        gasProduction: 'إنتاج الغاز',
        billionCubicMeters: 'مليار م³',
        electricityProduction: 'إنتاج الكهرباء',
        twh: 'TWh',
        renewableEnergyShare: 'حصة الطاقة المتجددة',
        percent: '%',
        oilReserves: 'احتياطيات النفط',
        gasReserves: 'احتياطيات الغاز',
        energyImports: 'واردات الطاقة',
        energyExports: 'صادرات الطاقة',
        co2Emissions: 'انبعاثات ثاني أكسيد الكربون',
        millionTonnes: 'مليون طن',
        investment: 'الاستثمار',
        millionUSD: 'مليون دولار',
        
        // Carousel
        energyProduction: 'إنتاج الطاقة',
        renewableTransition: 'الانتقال إلى الطاقة المتجددة',
        energyBalance: 'ميزان الطاقة',
        economicIndicators: 'المؤشرات الاقتصادية',
        
        // Countries
        tunisia: 'تونس',
        algeria: 'الجزائر',
        libya: 'ليبيا',
        morocco: 'المغرب',
        
        // Messages
        loadingEarthMap: 'جاري تحميل خريطة الأرض...',
        noCountriesSelected: 'لم يتم اختيار دول',
        selectAtLeastOneCountry: 'يرجى اختيار دولة واحدة على الأقل لعرض الخريطة الحرارية',
        noDataAvailable: 'لا توجد بيانات متاحة',
        governorateDataNotLoaded: 'بيانات المحافظات لم يتم تحميلها بعد',
        metricNotFound: 'المقياس غير موجود',
    },
    fr: {
        // Toolbar & Navigation
        satellite: 'Satellite',
        terrain: 'Terrain',
        language: 'Langue',
        
        // Layers Control
        layers: 'Couches',
        countryBorders: 'Frontières des pays',
        countryLabels: 'Étiquettes de pays',
        cityLabels: 'Étiquettes de villes',
        imageryOpacity: 'Opacité de l\'imagerie',
        
        // Bookmarks
        bookmarks: 'Signets',
        saveCurrentView: '💾 Enregistrer la vue actuelle',
        
        // Heatmap Panel
        dataHeatmap: 'Carte thermique des données 🔥',
        selectCountries: 'SÉLECTIONNER LES PAYS:',
        selectMetric: 'Sélectionner une métrique:',
        heatmapOpacity: 'Opacité de la carte thermique:',
        showHeatmap: 'Afficher la carte thermique',
        hideHeatmap: 'Masquer la carte thermique',
        low: 'Faible',
        medium: 'Moyen',
        high: 'Élevé',
        comparisonStats: '📊 Statistiques de comparaison:',
        
        // Energy Panel
        energyData: 'Données énergétiques',
        country: 'Pays:',
        year: 'Année:',
        play: 'Lire l\'animation',
        pause: 'Pause animation',
        aiPredictionModel: 'MODÈLE DE PRÉDICTION IA',
        deterministicProjections: 'Projections mathématiques déterministes basées sur les tendances historiques, les taux de croissance et les modèles spécifiques aux domaines. Aucun caractère aléatoire - les résultats sont cohérents et reproductibles.',
        modelsUsed: 'Modèles utilisés:',
        recalculatePredictions: '🔄 Recalculer les prédictions',
        calculated: 'Calculé:',
        
        // Stats Labels
        population: 'POPULATION',
        million: 'million',
        gdp: 'PIB',
        billionUSD: 'milliards USD',
        energyConsumption: 'CONSOMMATION ÉNERGÉTIQUE',
        mtep: 'MTEP',
        oilProduction: 'PRODUCTION DE PÉTROLE',
        millionBarrels: 'M barils',
        gasProduction: 'PRODUCTION DE GAZ',
        billionCubicMeters: 'milliards m³',
        electricityProduction: 'PRODUCTION D\'ÉLECTRICITÉ',
        twh: 'TWh',
        renewableEnergyShare: 'PART D\'ÉNERGIE RENOUVELABLE',
        percent: '%',
        oilReserves: 'RÉSERVES DE PÉTROLE',
        gasReserves: 'RÉSERVES DE GAZ',
        energyImports: 'IMPORTATIONS ÉNERGÉTIQUES',
        energyExports: 'EXPORTATIONS ÉNERGÉTIQUES',
        co2Emissions: 'ÉMISSIONS DE CO2',
        millionTonnes: 'M tonnes',
        investment: 'INVESTISSEMENT',
        millionUSD: 'millions USD',
        
        // Carousel
        energyProduction: 'PRODUCTION ÉNERGÉTIQUE',
        renewableTransition: 'TRANSITION ÉNERGÉTIQUE',
        energyBalance: 'BILAN ÉNERGÉTIQUE',
        economicIndicators: 'INDICATEURS ÉCONOMIQUES',
        
        // Countries
        tunisia: 'Tunisie',
        algeria: 'Algérie',
        libya: 'Libye',
        morocco: 'Maroc',
        
        // Messages
        loadingEarthMap: 'Chargement de la carte terrestre...',
        noCountriesSelected: 'Aucun pays sélectionné',
        selectAtLeastOneCountry: 'Veuillez sélectionner au moins un pays pour afficher la carte thermique',
        noDataAvailable: 'Aucune donnée disponible',
        governorateDataNotLoaded: 'Les données gouvernorales n\'ont pas été chargées',
        metricNotFound: 'Métrique non trouvée',
    }
};

// Current language (default: English)
let currentLanguage = 'en';

// Get translation by key
function t(key) {
    const result = translations[currentLanguage]?.[key] || translations['en']?.[key] || key;
    if (currentLanguage === 'ar' && !translations['ar']?.[key]) {
        console.warn(`⚠️ Missing Arabic translation for key: ${key}`);
    }
    return result;
}

// Change language
function setLanguage(lang) {
    console.log('🔤 setLanguage called with:', lang);
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('appLanguage', lang);
        console.log('✓ currentLanguage set to:', currentLanguage);
        updateUILanguage();
        console.log(`✓ Language changed to: ${lang}`);
    } else {
        console.error('❌ Language not found:', lang);
    }
}

// Update all UI text based on current language
function updateUILanguage() {
    console.log('🌐 Translating UI to:', currentLanguage);
    
    // Update energy panel title
    const panelTitle = document.getElementById('panelTitle');
    if (panelTitle) {
        const country = document.getElementById('energyCountry')?.value || 'tunisia';
        const countryName = t(country);
        panelTitle.textContent = `${countryName} ${t('energyData')}`;
    }
    
    // Update country selector label
    const countrySelectorLabel = document.querySelector('#countrySelector label');
    if (countrySelectorLabel) {
        countrySelectorLabel.textContent = t('country');
    }
    
    // Update year selector label
    const yearSelectorLabel = document.querySelector('#yearSelector label');
    if (yearSelectorLabel) {
        yearSelectorLabel.textContent = t('year');
    }
    
    // Update play/pause buttons
    const playBtn = document.getElementById('playBtn');
    if (playBtn) playBtn.title = t('play');
    
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) pauseBtn.title = t('pause');
    
    // Update map style options
    const mapStyleSelect = document.getElementById('mapStyle');
    if (mapStyleSelect) {
        mapStyleSelect.options[0].textContent = t('satellite');
        mapStyleSelect.options[1].textContent = t('terrain');
    }
    
    // Update language selector options
    const langSelect = document.getElementById('languageSelector');
    if (langSelect) {
        langSelect.options[0].textContent = 'English';
        langSelect.options[1].textContent = 'Français';
        langSelect.options[2].textContent = 'العربية';
    }
    
    // Update layer control
    const layerControl = document.getElementById('layerControl');
    if (layerControl) {
        const h4 = layerControl.querySelector('h4');
        if (h4) h4.textContent = t('layers');
        
        const labels = layerControl.querySelectorAll('label');
        if (labels[0]) labels[0].innerHTML = `<input type="checkbox" id="toggleBorders" checked> ${t('countryBorders')}`;
        if (labels[1]) labels[1].innerHTML = `<input type="checkbox" id="toggleLabels" checked> ${t('countryLabels')}`;
        if (labels[2]) labels[2].innerHTML = `<input type="checkbox" id="toggleCities" checked> ${t('cityLabels')}`;
        
        const sliderLabel = layerControl.querySelector('.slider-control label');
        if (sliderLabel) sliderLabel.textContent = t('imageryOpacity');
    }
    
    // Update bookmarks panel
    const bookmarksPanel = document.getElementById('bookmarksPanel');
    if (bookmarksPanel) {
        const h4 = bookmarksPanel.querySelector('h4');
        if (h4) h4.textContent = t('bookmarks');
        
        const btn = bookmarksPanel.querySelector('button');
        if (btn) btn.textContent = t('saveCurrentView');
    }
    
    // Update visualization toggle button
    const vizBtn = document.getElementById('toggleMapViz');
    if (vizBtn) vizBtn.textContent = '📊 ' + t('energyProduction');
    
    // Update stat card labels
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        const label = card.querySelector('.stat-label');
        const unit = card.querySelector('.stat-unit');
        
        const keyMap = [
            ['population', 'million'],
            ['gdp', 'billionUSD'],
            ['energyConsumption', 'mtep'],
            ['oilProduction', 'millionBarrels'],
            ['gasProduction', 'billionCubicMeters'],
            ['electricityProduction', 'twh'],
            ['renewableEnergyShare', 'percent'],
            ['oilReserves', 'millionBarrels'],
            ['gasReserves', 'billionCubicMeters'],
            ['energyImports', 'mtep'],
            ['energyExports', 'mtep'],
            ['co2Emissions', 'millionTonnes'],
            ['investment', 'millionUSD']
        ];
        
        if (keyMap[index]) {
            if (label) label.textContent = t(keyMap[index][0]);
            if (unit) unit.textContent = t(keyMap[index][1]);
        }
    });
    
    // Update country options in dropdown
    const countrySelect = document.getElementById('energyCountry');
    if (countrySelect) {
        countrySelect.options[0].textContent = t('tunisia');
        countrySelect.options[1].textContent = t('algeria');
        countrySelect.options[2].textContent = t('morocco');
        countrySelect.options[3].textContent = t('libya');
    }
    
    // Update visualization panel if visible
    const vizPanel = document.getElementById('mapVisualization');
    if (vizPanel && !vizPanel.classList.contains('hidden')) {
        const header = vizPanel.querySelector('.viz-header h3');
        if (header) {
            const country = document.getElementById('energyCountry')?.value || 'tunisia';
            const countryName = t(country);
            header.innerHTML = `${countryName} ${t('energyData')} <span id="vizYear">${document.getElementById('vizYear')?.textContent || '2025'}</span>`;
        }
    }
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
    
    // Update all placeholders with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
    
    // Update select options
    document.querySelectorAll('[data-i18n-value]').forEach(element => {
        const key = element.getAttribute('data-i18n-value');
        element.textContent = t(key);
    });
    
    // Special handling for HTML direction (RTL for Arabic)
    if (currentLanguage === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
        document.body.style.direction = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = currentLanguage;
        document.body.style.direction = 'ltr';
    }
    
    console.log(`✓ UI updated to ${currentLanguage}`);
}

// Load saved language on page load
function loadSavedLanguage() {
    const savedLang = localStorage.getItem('appLanguage') || 'en';
    currentLanguage = savedLang;
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = savedLang;
    }
    // Update UI with the saved language
    setTimeout(() => updateUILanguage(), 100);
}
