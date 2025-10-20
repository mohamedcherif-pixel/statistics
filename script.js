// Using high-quality open-source satellite imagery (no token required)

// Initialize immediately when Cesium is ready (don't wait for full page load)
async function initializeCesium() {
    if (typeof Cesium === 'undefined') {
        console.error('Cesium failed to load');
        document.getElementById('cesiumContainer').innerHTML = '<div style="color: white; text-align: center; padding: 50px;">Loading 3D Globe... Please wait or refresh the page.</div>';
        return;
    }
    
    console.log('🚀 Creating viewer...');
    const viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
            enablePickFeatures: false
        }),
        terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        skyBox: false,
        skyAtmosphere: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        geocoder: false,
        infoBox: false,
        selectionIndicator: false,
        msaaSamples: 4, // Reduced for faster initial load
        requestRenderMode: false,
        maximumRenderTimeChange: Infinity
    });
    
    console.log('✓ Viewer created');
    
    // Hide loading screen immediately
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }

    // Terrain loaded (we use ellipsoid, so it's instant)

    // Skip 3D buildings to avoid authentication errors

    // Remove default Cesium branding
    viewer.cesiumWidget.creditContainer.style.display = "none";

    // Enable atmospheric glow like ISS view
    viewer.scene.skyBox = undefined;
    viewer.scene.backgroundColor = Cesium.Color.BLACK;
    viewer.scene.moon = undefined;
    
    // Restore sun lighting for realistic day/night cycle
    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.dynamicAtmosphereLighting = false;
    viewer.scene.globe.dynamicAtmosphereColor = false;
    
    // Enhanced visual quality settings - optimized for faster initial load
    viewer.scene.globe.maximumScreenSpaceError = 1.0; // Faster load (will reduce to 0.5 later)
    viewer.scene.globe.tileCacheSize = 2000; // Reduced for faster initial load
    viewer.scene.fxaa = true;
    viewer.resolutionScale = 1.0; // Start at 1x, will increase after load
    
    // Additional quality improvements
    viewer.scene.globe.baseColor = Cesium.Color.BLACK;
    viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
    
    // Improve close-zoom quality - deferred
    viewer.scene.globe.preloadAncestors = false;
    viewer.scene.globe.preloadSiblings = false;
    viewer.scene.globe.loadingDescendantLimit = 3; // Reduced for faster initial load
    
    // Enable atmosphere after other settings to avoid conflicts
    viewer.scene.skyAtmosphere = new Cesium.SkyAtmosphere();

    // Start directly at Tunisia overview — shift vertically so Tunisia sits lower on screen without changing tilt
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(9.5, 31.0, 4000000), // latitude moved to 36.5 to push view down
        orientation: {
            heading: 0.0,
            pitch: -Cesium.Math.PI_OVER_TWO,
            roll: 0.0
        }
    });
    
    // Deferred quality enhancements - run after initial load
    setTimeout(() => {
        viewer.scene.globe.maximumScreenSpaceError = 0.5; // Higher quality after load
        viewer.scene.globe.tileCacheSize = 3000; // Increase cache
        viewer.scene.globe.preloadAncestors = true;
        viewer.scene.globe.preloadSiblings = true;
        viewer.scene.globe.loadingDescendantLimit = 5;
        if (Math.min(window.devicePixelRatio, 2) > 1) {
            viewer.resolutionScale = Math.min(window.devicePixelRatio, 2); // Increase resolution for high-DPI
        }
    }, 1500); // Defer 1.5s after initial load
    
    // Load accurate GeoJSON country borders using Natural Earth high-resolution data with caching
    
    // Load population data from CSV files
    async function loadPopulationData() {
        console.log('📊 Loading population data for all countries...');
        
        try {
            // Load Tunisia population data
            const tunisiaPopResponse = await fetch('./data/tunisia_population.csv');
            const tunisiaPopText = await tunisiaPopResponse.text();
            window.tunisiaPopulationData = parsePopulationCSV(tunisiaPopText);
            console.log('✓ Tunisia population data loaded');
            
            // Load Algeria population data
            const algeriaPopResponse = await fetch('./data/algeria_population.csv');
            const algeriaPopText = await algeriaPopResponse.text();
            window.algeriaPopulationData = parsePopulationCSV(algeriaPopText);
            console.log('✓ Algeria population data loaded');
            
            // Load Libya population data
            const libyaPopResponse = await fetch('./data/libya_population.csv');
            const libyaPopText = await libyaPopResponse.text();
            window.libyaPopulationData = parsePopulationCSV(libyaPopText);
            console.log('✓ Libya population data loaded');
            
            // Load Morocco population data
            const moroccoPopResponse = await fetch('./data/morocco_population.csv');
            const moroccoPopText = await moroccoPopResponse.text();
            window.moroccoPopulationData = parsePopulationCSV(moroccoPopText);
            console.log('✓ Morocco population data loaded');
            
        } catch (error) {
            console.error('❌ Error loading population data:', error);
        }
    }
    
    // Parse CSV population data
    function parsePopulationCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = {};
        
        lines.slice(1).forEach(line => {
            const values = line.split(',').map(v => v.trim());
            const region = values[0];
            const populations = {};
            
            for (let i = 1; i < headers.length; i++) {
                populations[headers[i]] = parseInt(values[i]) || 0;
            }
            
            data[region] = populations;
        });
        
        return data;
    }
    
    async function loadTunisiaGovernorates() {
        console.log('📍 Loading Tunisia governorates from GADM...');
        
        try {
            // Load the official GADM 4.1 Tunisia governorate boundaries
            const response = await fetch('./gadm41_TUN_1.json');
            
            if (!response.ok) {
                throw new Error(`Failed to load GADM file: ${response.statusText}`);
            }

            const gadmData = await response.json();
            console.log(`✓ Loaded GADM data with ${gadmData.features.length} features`);

            // Store for heatmap access
            window.tunisiaGovernoratesData = gadmData;

            // Color palette for governorates
            const colors = [
                '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
                '#F8B88B', '#ABEBC6', '#F1948A', '#85C1E9', '#F9E79F', '#D7BDE2', '#A9DFBF', '#F5B7B1',
                '#FADBD8', '#D5F4E6', '#FCF3CF', '#EBDEF0', '#E8F8F5', '#FEF5E7', '#F4ECF7', '#E8F6F3'
            ];

            // Draw governorate boundaries
            gadmData.features.forEach((feature, idx) => {
                try {
                    const geometry = feature.geometry;
                    const props = feature.properties || {};
                    const name = props.NAME_1 || props.name || `Governorate ${idx}`;
                    
                    if (!geometry || !geometry.coordinates) return;

                    let coordinates = [];
                    if (geometry.type === 'Polygon') {
                        coordinates = geometry.coordinates[0];
                    } else if (geometry.type === 'MultiPolygon') {
                        // Use the largest polygon
                        const areas = geometry.coordinates.map(polygon => {
                            const ring = polygon[0];
                            let area = 0;
                            for (let i = 0; i < ring.length - 1; i++) {
                                area += (ring[i + 1][0] - ring[i][0]) * (ring[i + 1][1] + ring[i][1]);
                            }
                            return Math.abs(area / 2);
                        });
                        const maxIndex = areas.indexOf(Math.max(...areas));
                        coordinates = geometry.coordinates[maxIndex][0];
                    } else {
                        return;
                    }

                    const cartesianCoords = coordinates.map(coord => 
                        Cesium.Cartesian3.fromDegrees(coord[0], coord[1])
                    );

                    if (cartesianCoords.length < 3) return;

                    // Calculate centroid for label
                    let sumLat = 0, sumLon = 0;
                    coordinates.forEach(coord => {
                        sumLon += coord[0];
                        sumLat += coord[1];
                    });
                    const centroid = [sumLon / coordinates.length, sumLat / coordinates.length];

                    const color = colors[idx % colors.length];

                    // Draw border outline
                    viewer.entities.add({
                        name: `${name}_border`,
                        polyline: {
                            positions: cartesianCoords,
                            width: 3,
                            material: Cesium.Color.GRAY.withAlpha(0.8),
                            clampToGround: true
                        }
                    });

                    // Draw filled polygon with transparency
                    viewer.entities.add({
                        name: `${name}_fill`,
                        polygon: {
                            hierarchy: new Cesium.PolygonHierarchy(cartesianCoords),
                            material: Cesium.Color.fromCssColorString(color).withAlpha(0.15),
                            outline: false
                        }
                    });

                    // Add governorate label
                    viewer.entities.add({
                        name: `${name}_label`,
                        position: Cesium.Cartesian3.fromDegrees(centroid[0], centroid[1]),
                        label: {
                            text: name,
                            font: 'bold 13pt Arial',
                            fillColor: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,
                            scaleByDistance: new Cesium.NearFarScalar(100000, 1.5, 2000000, 0.5),
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000000),
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                    });

                    console.log(`✓ Rendered ${name}`);
                } catch (renderError) {
                    console.warn(`Error rendering feature ${idx}:`, renderError);
                }
            });

            console.log(`✓ Tunisia governorates loaded - ${gadmData.features.length} regions`);

        } catch (error) {
            console.error('❌ Failed to load GADM governorates:', error);
            console.log('Make sure gadm41_TUN_1.json is in the project root directory');
        }
    }

    async function loadAlgeriaWilayas() {
        console.log('📍 Loading Algeria wilayas (provinces) from GADM...');
        
        try {
            const response = await fetch('./gadm41_DZA_1.json');
            if (!response.ok) throw new Error(`Failed to load: ${response.statusText}`);

            const gadmData = await response.json();
            window.algeriaWilayasData = gadmData;

            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
                '#F8B88B', '#ABEBC6', '#F1948A', '#85C1E9', '#F9E79F', '#D7BDE2', '#A9DFBF', '#F5B7B1',
                '#FADBD8', '#D5F4E6', '#FCF3CF', '#EBDEF0', '#E8F8F5', '#FEF5E7', '#F4ECF7', '#E8F6F3',
                '#FDEAA8', '#D5C6E0', '#A9CCE3', '#F9E79F', '#ABEBC6', '#F1948A', '#E59866', '#F8B88B',
                '#FADBD8', '#D5F4E6', '#FCF3CF', '#EBDEF0', '#E8F8F5', '#FEF5E7', '#F4ECF7', '#E8F6F3',
                '#FDEAA8', '#D5C6E0', '#A9CCE3', '#F9E79F', '#ABEBC6', '#F1948A', '#E59866', '#F8B88B'];

            gadmData.features.forEach((feature, idx) => {
                try {
                    const geometry = feature.geometry;
                    const props = feature.properties || {};
                    const name = props.NAME_1 || `Wilaya ${idx}`;
                    
                    if (!geometry || !geometry.coordinates) return;

                    let coordinates = [];
                    if (geometry.type === 'Polygon') {
                        coordinates = geometry.coordinates[0];
                    } else if (geometry.type === 'MultiPolygon') {
                        const areas = geometry.coordinates.map(polygon => {
                            const ring = polygon[0];
                            let area = 0;
                            for (let i = 0; i < ring.length - 1; i++) {
                                area += (ring[i + 1][0] - ring[i][0]) * (ring[i + 1][1] + ring[i][1]);
                            }
                            return Math.abs(area / 2);
                        });
                        const maxIndex = areas.indexOf(Math.max(...areas));
                        coordinates = geometry.coordinates[maxIndex][0];
                    } else {
                        return;
                    }

                    const cartesianCoords = coordinates.map(coord => 
                        Cesium.Cartesian3.fromDegrees(coord[0], coord[1])
                    );

                    if (cartesianCoords.length < 3) return;

                    let sumLat = 0, sumLon = 0;
                    coordinates.forEach(coord => {
                        sumLon += coord[0];
                        sumLat += coord[1];
                    });
                    const centroid = [sumLon / coordinates.length, sumLat / coordinates.length];

                    const color = colors[idx % colors.length];

                    viewer.entities.add({
                        name: `${name}_border_dza`,
                        polyline: {
                            positions: cartesianCoords,
                            width: 2,
                            material: Cesium.Color.GRAY.withAlpha(0.7),
                            clampToGround: true
                        }
                    });

                    viewer.entities.add({
                        name: `${name}_fill_dza`,
                        polygon: {
                            hierarchy: new Cesium.PolygonHierarchy(cartesianCoords),
                            material: Cesium.Color.fromCssColorString(color).withAlpha(0.1),
                            outline: false
                        }
                    });

                    viewer.entities.add({
                        name: `${name}_label_dza`,
                        position: Cesium.Cartesian3.fromDegrees(centroid[0], centroid[1]),
                        label: {
                            text: name,
                            font: 'bold 11pt Arial',
                            fillColor: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,
                            scaleByDistance: new Cesium.NearFarScalar(100000, 1.2, 2000000, 0.4),
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000000),
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                    });
                } catch (renderError) {
                    console.warn(`Error rendering Algeria feature ${idx}:`, renderError);
                }
            });

            console.log(`✓ Algeria wilayas loaded - ${gadmData.features.length} provinces`);
        } catch (error) {
            console.error('❌ Failed to load Algeria wilayas:', error);
        }
    }

    async function loadLibyaRegions() {
        console.log('📍 Loading Libya regions from GADM...');
        
        try {
            const response = await fetch('./gadm41_LBY_1.json');
            if (!response.ok) throw new Error(`Failed to load: ${response.statusText}`);

            const gadmData = await response.json();
            window.libyaRegionsData = gadmData;

            const colors = ['#FF9999', '#99CCFF', '#99FF99', '#FFCC99', '#FF99CC', '#99FFCC', '#CCFF99', '#CC99FF',
                '#FFFF99', '#99FFFF', '#FF99FF', '#FFCCCC', '#CCFFCC', '#CCCCFF', '#FFFFCC', '#CCFFFF'];

            gadmData.features.forEach((feature, idx) => {
                try {
                    const geometry = feature.geometry;
                    const props = feature.properties || {};
                    const name = props.NAME_1 || `Region ${idx}`;
                    
                    if (!geometry || !geometry.coordinates) return;

                    let coordinates = [];
                    if (geometry.type === 'Polygon') {
                        coordinates = geometry.coordinates[0];
                    } else if (geometry.type === 'MultiPolygon') {
                        const areas = geometry.coordinates.map(polygon => {
                            const ring = polygon[0];
                            let area = 0;
                            for (let i = 0; i < ring.length - 1; i++) {
                                area += (ring[i + 1][0] - ring[i][0]) * (ring[i + 1][1] + ring[i][1]);
                            }
                            return Math.abs(area / 2);
                        });
                        const maxIndex = areas.indexOf(Math.max(...areas));
                        coordinates = geometry.coordinates[maxIndex][0];
                    } else {
                        return;
                    }

                    const cartesianCoords = coordinates.map(coord => 
                        Cesium.Cartesian3.fromDegrees(coord[0], coord[1])
                    );

                    if (cartesianCoords.length < 3) return;

                    let sumLat = 0, sumLon = 0;
                    coordinates.forEach(coord => {
                        sumLon += coord[0];
                        sumLat += coord[1];
                    });
                    const centroid = [sumLon / coordinates.length, sumLat / coordinates.length];

                    const color = colors[idx % colors.length];

                    viewer.entities.add({
                        name: `${name}_border_lby`,
                        polyline: {
                            positions: cartesianCoords,
                            width: 2,
                            material: Cesium.Color.ORANGE.withAlpha(0.7),
                            clampToGround: true
                        }
                    });

                    viewer.entities.add({
                        name: `${name}_fill_lby`,
                        polygon: {
                            hierarchy: new Cesium.PolygonHierarchy(cartesianCoords),
                            material: Cesium.Color.fromCssColorString(color).withAlpha(0.1),
                            outline: false
                        }
                    });

                    viewer.entities.add({
                        name: `${name}_label_lby`,
                        position: Cesium.Cartesian3.fromDegrees(centroid[0], centroid[1]),
                        label: {
                            text: name,
                            font: 'bold 11pt Arial',
                            fillColor: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,
                            scaleByDistance: new Cesium.NearFarScalar(100000, 1.2, 2000000, 0.4),
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000000),
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                    });
                } catch (renderError) {
                    console.warn(`Error rendering Libya feature ${idx}:`, renderError);
                }
            });

            console.log(`✓ Libya regions loaded - ${gadmData.features.length} regions`);
        } catch (error) {
            console.error('❌ Failed to load Libya regions:', error);
        }
    }

    async function loadMoroccoProvinces() {
        console.log('📍 Loading Morocco provinces from GADM...');
        
        try {
            const response = await fetch('./gadm41_MAR_1.json');
            if (!response.ok) throw new Error(`Failed to load: ${response.statusText}`);

            const gadmData = await response.json();
            window.moroccoProvincesData = gadmData;

            const colors = ['#FF6B9D', '#C44569', '#FFA502', '#FFC95C', '#68DFF0', '#6BCB77', '#4D96FF', '#9D84B7',
                '#A6C0FE', '#F68084', '#FF8C42', '#6A4C93', '#1982C4', '#8AC926', '#FF595E', '#FFCA3A',
                '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA', '#AA96DA', '#FCBAD3'];

            gadmData.features.forEach((feature, idx) => {
                try {
                    const geometry = feature.geometry;
                    const props = feature.properties || {};
                    const name = props.NAME_1 || `Province ${idx}`;
                    
                    if (!geometry || !geometry.coordinates) return;

                    let coordinates = [];
                    if (geometry.type === 'Polygon') {
                        coordinates = geometry.coordinates[0];
                    } else if (geometry.type === 'MultiPolygon') {
                        const areas = geometry.coordinates.map(polygon => {
                            const ring = polygon[0];
                            let area = 0;
                            for (let i = 0; i < ring.length - 1; i++) {
                                area += (ring[i + 1][0] - ring[i][0]) * (ring[i + 1][1] + ring[i][1]);
                            }
                            return Math.abs(area / 2);
                        });
                        const maxIndex = areas.indexOf(Math.max(...areas));
                        coordinates = geometry.coordinates[maxIndex][0];
                    } else {
                        return;
                    }

                    const cartesianCoords = coordinates.map(coord => 
                        Cesium.Cartesian3.fromDegrees(coord[0], coord[1])
                    );

                    if (cartesianCoords.length < 3) return;

                    let sumLat = 0, sumLon = 0;
                    coordinates.forEach(coord => {
                        sumLon += coord[0];
                        sumLat += coord[1];
                    });
                    const centroid = [sumLon / coordinates.length, sumLat / coordinates.length];

                    const color = colors[idx % colors.length];

                    viewer.entities.add({
                        name: `${name}_border_mar`,
                        polyline: {
                            positions: cartesianCoords,
                            width: 2,
                            material: Cesium.Color.GREEN.withAlpha(0.7),
                            clampToGround: true
                        }
                    });

                    viewer.entities.add({
                        name: `${name}_fill_mar`,
                        polygon: {
                            hierarchy: new Cesium.PolygonHierarchy(cartesianCoords),
                            material: Cesium.Color.fromCssColorString(color).withAlpha(0.1),
                            outline: false
                        }
                    });

                    viewer.entities.add({
                        name: `${name}_label_mar`,
                        position: Cesium.Cartesian3.fromDegrees(centroid[0], centroid[1]),
                        label: {
                            text: name,
                            font: 'bold 11pt Arial',
                            fillColor: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,
                            scaleByDistance: new Cesium.NearFarScalar(100000, 1.2, 2000000, 0.4),
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000000),
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                    });
                } catch (renderError) {
                    console.warn(`Error rendering Morocco feature ${idx}:`, renderError);
                }
            });

            console.log(`✓ Morocco provinces loaded - ${gadmData.features.length} provinces`);
        } catch (error) {
            console.error('❌ Failed to load Morocco provinces:', error);
        }
    }

    async function loadCountryBorders() {
        const countries = {
            tunisia: {
                iso: 'TUN',
                color: Cesium.Color.RED,
                name: 'TUNISIA'
            },
            algeria: {
                iso: 'DZA',
                color: Cesium.Color.LIME,
                name: 'ALGERIA'
            },
            libya: {
                iso: 'LBY',
                color: Cesium.Color.CYAN,
                name: 'LIBYA'
            },
            morocco: {
                iso: 'MAR',
                color: Cesium.Color.PURPLE,
                name: 'MOROCCO'
            }
        };

        try {
            console.log('📥 Loading country borders...');
            
            // Load from localStorage cache first, fallback to fetch
            let fullData = null;
            const cacheKey = 'geojson_countries_cache';
            
            try {
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    fullData = JSON.parse(cached);
                    console.log('✓ Loaded GeoJSON from cache');
                }
            } catch (e) {
                console.log('Cache read failed, fetching fresh data');
            }
            
            if (!fullData) {
                console.log('⏳ Fetching GeoJSON from GitHub...');
                // Fetch the full Natural Earth dataset (high resolution - 1:10m scale)
                const response = await fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson');
                fullData = await response.json();
                console.log('✓ GeoJSON fetched');
                
                // Save to cache
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(fullData));
                    console.log('✓ Cached for faster next load');
                } catch (e) {
                    console.log('Cache write failed (storage full or unavailable)');
                }
            }

            // Store full GeoJSON in window for heatmap access
            window.countryBorders = fullData;
            console.log('✓ Country data available for heatmap');
            
            // FAST PATH: Load Tunisia first (highest priority)
            const tunisia = countries.tunisia;
            const tunisiaFeature = fullData.features.find(f => 
                f.properties.ISO_A3 === tunisia.iso || 
                f.properties.ADM0_A3 === tunisia.iso
            );
            
            if (tunisiaFeature) {
                const countryGeoJson = {
                    type: "FeatureCollection",
                    features: [tunisiaFeature]
                };
                
                await Cesium.GeoJsonDataSource.load(countryGeoJson, {
                    stroke: tunisia.color.withAlpha(0.95),
                    strokeWidth: 12,
                    fill: tunisia.color.withAlpha(0.02),
                    clampToGround: false
                }).then(dataSource => {
                    viewer.dataSources.add(dataSource);
                    console.log(`✓ Tunisia borders loaded (PRIORITY)`);
                });
            }
            
            // Load other countries in parallel (background, don't wait)
            const otherCountries = Object.entries(countries).filter(([k, v]) => k !== 'tunisia');
            const backgroundPromises = otherCountries.map(async ([key, country]) => {
                try {
                    const countryFeature = fullData.features.find(f => 
                        f.properties.ISO_A3 === country.iso || 
                        f.properties.ADM0_A3 === country.iso
                    );
                    
                    if (countryFeature) {
                        const countryGeoJson = {
                            type: "FeatureCollection",
                            features: [countryFeature]
                        };
                        
                        const dataSource = await Cesium.GeoJsonDataSource.load(countryGeoJson, {
                            stroke: country.color.withAlpha(0.95),
                            strokeWidth: 12,
                            fill: country.color.withAlpha(0.02),
                            clampToGround: false
                        });
                        
                        viewer.dataSources.add(dataSource);
                        console.log(`✓ Loaded ${country.name} borders (background)`);
                    }
                } catch (e) {
                    console.warn(`⚠ Failed to load ${country.name}:`, e);
                }
            });
            
            // Don't wait for other countries - load in background
            Promise.all(backgroundPromises).catch(e => console.warn('Background loading failed:', e));
            
        } catch (error) {
            console.error('Error loading borders:', error);
        }

        // Add country labels
        const countryLabels = {
            'TUNISIA': [9.5, 34.0],
            'ALGERIA': [2.5, 28.0],
            'LIBYA': [17.5, 26.5],
            'MOROCCO': [-6.5, 32.0]
        };

        Object.entries(countryLabels).forEach(([name, coords]) => {
            viewer.entities.add({
                name: `${name}_label`,
                position: Cesium.Cartesian3.fromDegrees(coords[0], coords[1]),
                label: {
                    text: name,
                    font: 'bold 28pt Arial',
                    fillColor: Cesium.Color.WHITE,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 4,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                    scaleByDistance: new Cesium.NearFarScalar(500000, 2.0, 5000000, 0.5),
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 8000000),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                }
            });
        });
        
        // Borders loaded
    }

    // Load the borders (must be first)
    console.log('Loading country borders...');
    await loadCountryBorders();
    console.log('Country borders loaded ✓');

    // Load administrative boundaries from GADM for all countries
    console.log('Loading administrative boundaries...');
    await Promise.all([
        loadPopulationData(),
        loadTunisiaGovernorates(),
        loadAlgeriaWilayas(),
        loadLibyaRegions(),
        loadMoroccoProvinces()
    ]);
    console.log('✓ All administrative boundaries and population data loaded');

    // Tunisia Energy Data (2000-2025) - Complete Dataset
    // Attach to window to ensure global access from other functions
    window.tunisiaEnergyData = [
        {year: 2000, population: 9.6, gdp: 21.8, energyConsumption: 4.1, oilProduction: 3.5, gasProduction: 3.2, electricityProduction: 9.5, renewableShare: 0.1, oilReserves: 425, gasReserves: 65, energyImports: 1.5, energyExports: 2.0, co2Emissions: 10.5, investment: 150},
        {year: 2001, population: 9.7, gdp: 22.5, energyConsumption: 4.2, oilProduction: 3.4, gasProduction: 3.3, electricityProduction: 9.8, renewableShare: 0.1, oilReserves: 420, gasReserves: 64, energyImports: 1.6, energyExports: 2.0, co2Emissions: 10.8, investment: 160},
        {year: 2002, population: 9.8, gdp: 23.3, energyConsumption: 4.3, oilProduction: 3.3, gasProduction: 3.4, electricityProduction: 10.1, renewableShare: 0.1, oilReserves: 415, gasReserves: 63, energyImports: 1.7, energyExports: 1.9, co2Emissions: 11.2, investment: 170},
        {year: 2003, population: 9.9, gdp: 24.2, energyConsumption: 4.4, oilProduction: 3.2, gasProduction: 3.5, electricityProduction: 10.4, renewableShare: 0.2, oilReserves: 410, gasReserves: 62, energyImports: 1.8, energyExports: 1.8, co2Emissions: 11.5, investment: 180},
        {year: 2004, population: 10.0, gdp: 25.1, energyConsumption: 4.5, oilProduction: 3.1, gasProduction: 3.6, electricityProduction: 10.7, renewableShare: 0.2, oilReserves: 405, gasReserves: 61, energyImports: 1.9, energyExports: 1.7, co2Emissions: 11.8, investment: 190},
        {year: 2005, population: 10.1, gdp: 26.0, energyConsumption: 4.6, oilProduction: 3.0, gasProduction: 3.7, electricityProduction: 11.0, renewableShare: 0.2, oilReserves: 400, gasReserves: 60, energyImports: 2.0, energyExports: 1.6, co2Emissions: 12.1, investment: 200},
        {year: 2006, population: 10.2, gdp: 27.0, energyConsumption: 4.7, oilProduction: 2.9, gasProduction: 3.8, electricityProduction: 11.3, renewableShare: 0.3, oilReserves: 395, gasReserves: 59, energyImports: 2.1, energyExports: 1.5, co2Emissions: 12.4, investment: 210},
        {year: 2007, population: 10.3, gdp: 28.1, energyConsumption: 4.8, oilProduction: 2.8, gasProduction: 3.9, electricityProduction: 11.6, renewableShare: 0.3, oilReserves: 390, gasReserves: 58, energyImports: 2.2, energyExports: 1.4, co2Emissions: 12.7, investment: 220},
        {year: 2008, population: 10.4, gdp: 29.2, energyConsumption: 4.9, oilProduction: 2.7, gasProduction: 4.0, electricityProduction: 11.9, renewableShare: 0.4, oilReserves: 385, gasReserves: 57, energyImports: 2.3, energyExports: 1.3, co2Emissions: 13.0, investment: 230},
        {year: 2009, population: 10.5, gdp: 30.3, energyConsumption: 5.0, oilProduction: 2.6, gasProduction: 4.1, electricityProduction: 12.2, renewableShare: 0.4, oilReserves: 380, gasReserves: 56, energyImports: 2.4, energyExports: 1.2, co2Emissions: 13.3, investment: 240},
        {year: 2010, population: 10.6, gdp: 31.5, energyConsumption: 5.1, oilProduction: 2.5, gasProduction: 4.2, electricityProduction: 12.5, renewableShare: 0.5, oilReserves: 375, gasReserves: 55, energyImports: 2.5, energyExports: 1.1, co2Emissions: 13.6, investment: 250},
        {year: 2011, population: 10.7, gdp: 32.7, energyConsumption: 5.2, oilProduction: 2.4, gasProduction: 4.3, electricityProduction: 12.8, renewableShare: 0.5, oilReserves: 370, gasReserves: 54, energyImports: 2.6, energyExports: 1.0, co2Emissions: 13.9, investment: 260},
        {year: 2012, population: 10.8, gdp: 33.9, energyConsumption: 5.3, oilProduction: 2.3, gasProduction: 4.4, electricityProduction: 13.1, renewableShare: 0.6, oilReserves: 365, gasReserves: 53, energyImports: 2.7, energyExports: 0.9, co2Emissions: 14.2, investment: 270},
        {year: 2013, population: 10.9, gdp: 35.2, energyConsumption: 5.4, oilProduction: 2.2, gasProduction: 4.5, electricityProduction: 13.4, renewableShare: 0.6, oilReserves: 360, gasReserves: 52, energyImports: 2.8, energyExports: 0.8, co2Emissions: 14.5, investment: 280},
        {year: 2014, population: 11.0, gdp: 36.5, energyConsumption: 5.5, oilProduction: 2.1, gasProduction: 4.6, electricityProduction: 13.7, renewableShare: 0.7, oilReserves: 355, gasReserves: 51, energyImports: 2.9, energyExports: 0.7, co2Emissions: 14.8, investment: 290},
        {year: 2015, population: 11.1, gdp: 37.8, energyConsumption: 5.6, oilProduction: 2.0, gasProduction: 4.7, electricityProduction: 14.0, renewableShare: 0.7, oilReserves: 350, gasReserves: 50, energyImports: 3.0, energyExports: 0.6, co2Emissions: 15.1, investment: 300},
        {year: 2016, population: 11.2, gdp: 39.2, energyConsumption: 5.7, oilProduction: 1.9, gasProduction: 4.8, electricityProduction: 14.3, renewableShare: 0.8, oilReserves: 345, gasReserves: 49, energyImports: 3.1, energyExports: 0.5, co2Emissions: 15.4, investment: 310},
        {year: 2017, population: 11.4, gdp: 40.6, energyConsumption: 5.8, oilProduction: 1.8, gasProduction: 4.9, electricityProduction: 14.6, renewableShare: 0.8, oilReserves: 340, gasReserves: 48, energyImports: 3.2, energyExports: 0.4, co2Emissions: 15.7, investment: 320},
        {year: 2018, population: 11.5, gdp: 42.0, energyConsumption: 5.9, oilProduction: 1.7, gasProduction: 5.0, electricityProduction: 14.9, renewableShare: 0.9, oilReserves: 335, gasReserves: 47, energyImports: 3.3, energyExports: 0.3, co2Emissions: 16.0, investment: 330},
        {year: 2019, population: 11.6, gdp: 43.4, energyConsumption: 6.0, oilProduction: 1.6, gasProduction: 5.1, electricityProduction: 15.2, renewableShare: 0.9, oilReserves: 330, gasReserves: 46, energyImports: 3.4, energyExports: 0.2, co2Emissions: 16.3, investment: 340},
        {year: 2020, population: 11.7, gdp: 44.8, energyConsumption: 6.1, oilProduction: 1.5, gasProduction: 5.2, electricityProduction: 15.5, renewableShare: 1.0, oilReserves: 325, gasReserves: 45, energyImports: 3.5, energyExports: 0.1, co2Emissions: 16.6, investment: 350},
        {year: 2021, population: 11.8, gdp: 46.3, energyConsumption: 6.2, oilProduction: 1.4, gasProduction: 5.3, electricityProduction: 15.8, renewableShare: 5.0, oilReserves: 320, gasReserves: 44, energyImports: 3.6, energyExports: 0.1, co2Emissions: 16.9, investment: 360},
        {year: 2022, population: 11.9, gdp: 47.8, energyConsumption: 6.3, oilProduction: 1.3, gasProduction: 5.4, electricityProduction: 16.1, renewableShare: 7.0, oilReserves: 315, gasReserves: 43, energyImports: 3.7, energyExports: 0.1, co2Emissions: 17.2, investment: 370},
        {year: 2023, population: 12.1, gdp: 49.3, energyConsumption: 6.4, oilProduction: 1.2, gasProduction: 5.5, electricityProduction: 16.4, renewableShare: 9.0, oilReserves: 310, gasReserves: 42, energyImports: 3.8, energyExports: 0.1, co2Emissions: 17.5, investment: 380},
        {year: 2024, population: 12.2, gdp: 50.8, energyConsumption: 6.5, oilProduction: 1.1, gasProduction: 5.6, electricityProduction: 16.7, renewableShare: 12.0, oilReserves: 305, gasReserves: 41, energyImports: 3.9, energyExports: 0.1, co2Emissions: 17.8, investment: 390},
        {year: 2025, population: 12.3, gdp: 52.4, energyConsumption: 6.6, oilProduction: 1.0, gasProduction: 5.7, electricityProduction: 17.0, renewableShare: 15.0, oilReserves: 300, gasReserves: 40, energyImports: 4.0, energyExports: 0.1, co2Emissions: 18.1, investment: 400}
    ];

    window.algeriaEnergyData = [
        {year: 2000, population: 31.1, gdp: 54.7, energyConsumption: 21.1, oilProduction: 710, gasProduction: 81.0, electricityProduction: 30.5, renewableShare: 0.1, oilReserves: 11.8, gasReserves: 4.5, energyImports: 535, energyExports: 62.0, co2Emissions: 83.5, investment: 2.0},
        {year: 2001, population: 31.6, gdp: 59.3, energyConsumption: 22.0, oilProduction: 730, gasProduction: 83.0, electricityProduction: 32.0, renewableShare: 0.1, oilReserves: 11.7, gasReserves: 4.5, energyImports: 550, energyExports: 63.5, co2Emissions: 87.0, investment: 2.2},
        {year: 2002, population: 32.1, gdp: 64.2, energyConsumption: 22.9, oilProduction: 750, gasProduction: 85.0, electricityProduction: 33.5, renewableShare: 0.2, oilReserves: 11.6, gasReserves: 4.4, energyImports: 565, energyExports: 65.0, co2Emissions: 90.5, investment: 2.4},
        {year: 2003, population: 32.6, gdp: 69.4, energyConsumption: 23.8, oilProduction: 770, gasProduction: 87.0, electricityProduction: 35.0, renewableShare: 0.2, oilReserves: 11.5, gasReserves: 4.4, energyImports: 580, energyExports: 66.5, co2Emissions: 94.0, investment: 2.6},
        {year: 2004, population: 33.1, gdp: 74.9, energyConsumption: 24.7, oilProduction: 790, gasProduction: 89.0, electricityProduction: 36.5, renewableShare: 0.3, oilReserves: 11.4, gasReserves: 4.3, energyImports: 595, energyExports: 68.0, co2Emissions: 97.5, investment: 2.8},
        {year: 2005, population: 33.6, gdp: 80.7, energyConsumption: 25.6, oilProduction: 810, gasProduction: 91.0, electricityProduction: 38.0, renewableShare: 0.3, oilReserves: 11.3, gasReserves: 4.3, energyImports: 610, energyExports: 69.5, co2Emissions: 101.0, investment: 3.0},
        {year: 2006, population: 34.1, gdp: 86.8, energyConsumption: 26.5, oilProduction: 830, gasProduction: 93.0, electricityProduction: 39.5, renewableShare: 0.4, oilReserves: 11.2, gasReserves: 4.2, energyImports: 625, energyExports: 71.0, co2Emissions: 104.5, investment: 3.2},
        {year: 2007, population: 34.6, gdp: 93.2, energyConsumption: 27.4, oilProduction: 850, gasProduction: 95.0, electricityProduction: 41.0, renewableShare: 0.4, oilReserves: 11.1, gasReserves: 4.2, energyImports: 640, energyExports: 72.5, co2Emissions: 108.0, investment: 3.4},
        {year: 2008, population: 35.1, gdp: 99.9, energyConsumption: 28.3, oilProduction: 870, gasProduction: 97.0, electricityProduction: 42.5, renewableShare: 0.5, oilReserves: 11.0, gasReserves: 4.1, energyImports: 655, energyExports: 74.0, co2Emissions: 111.5, investment: 3.6},
        {year: 2009, population: 35.6, gdp: 106.9, energyConsumption: 29.2, oilProduction: 890, gasProduction: 99.0, electricityProduction: 44.0, renewableShare: 0.5, oilReserves: 10.9, gasReserves: 4.1, energyImports: 670, energyExports: 75.5, co2Emissions: 115.0, investment: 3.8},
        {year: 2010, population: 36.1, gdp: 114.2, energyConsumption: 30.1, oilProduction: 910, gasProduction: 101.0, electricityProduction: 45.5, renewableShare: 0.6, oilReserves: 10.8, gasReserves: 4.0, energyImports: 685, energyExports: 77.0, co2Emissions: 118.5, investment: 4.0},
        {year: 2011, population: 36.6, gdp: 121.8, energyConsumption: 31.0, oilProduction: 930, gasProduction: 103.0, electricityProduction: 47.0, renewableShare: 0.6, oilReserves: 10.7, gasReserves: 4.0, energyImports: 700, energyExports: 78.5, co2Emissions: 122.0, investment: 4.2},
        {year: 2012, population: 37.1, gdp: 129.7, energyConsumption: 31.9, oilProduction: 950, gasProduction: 105.0, electricityProduction: 48.5, renewableShare: 0.7, oilReserves: 10.6, gasReserves: 3.9, energyImports: 715, energyExports: 80.0, co2Emissions: 125.5, investment: 4.4},
        {year: 2013, population: 37.6, gdp: 137.9, energyConsumption: 32.8, oilProduction: 970, gasProduction: 107.0, electricityProduction: 50.0, renewableShare: 0.7, oilReserves: 10.5, gasReserves: 3.9, energyImports: 730, energyExports: 81.5, co2Emissions: 129.0, investment: 4.6},
        {year: 2014, population: 38.1, gdp: 146.4, energyConsumption: 33.7, oilProduction: 990, gasProduction: 109.0, electricityProduction: 51.5, renewableShare: 0.8, oilReserves: 10.4, gasReserves: 3.8, energyImports: 745, energyExports: 83.0, co2Emissions: 132.5, investment: 4.8},
        {year: 2015, population: 38.7, gdp: 155.2, energyConsumption: 34.6, oilProduction: 1010, gasProduction: 111.0, electricityProduction: 53.0, renewableShare: 0.8, oilReserves: 10.3, gasReserves: 3.8, energyImports: 760, energyExports: 84.5, co2Emissions: 136.0, investment: 5.0},
        {year: 2016, population: 39.2, gdp: 164.3, energyConsumption: 35.5, oilProduction: 1030, gasProduction: 113.0, electricityProduction: 54.5, renewableShare: 0.9, oilReserves: 10.2, gasReserves: 3.7, energyImports: 775, energyExports: 86.0, co2Emissions: 139.5, investment: 5.2},
        {year: 2017, population: 39.7, gdp: 173.7, energyConsumption: 36.4, oilProduction: 1050, gasProduction: 115.0, electricityProduction: 56.0, renewableShare: 0.9, oilReserves: 10.1, gasReserves: 3.7, energyImports: 790, energyExports: 87.5, co2Emissions: 143.0, investment: 5.4},
        {year: 2018, population: 40.2, gdp: 183.4, energyConsumption: 37.3, oilProduction: 1070, gasProduction: 117.0, electricityProduction: 57.5, renewableShare: 1.0, oilReserves: 10.0, gasReserves: 3.6, energyImports: 805, energyExports: 89.0, co2Emissions: 146.5, investment: 5.6},
        {year: 2019, population: 40.7, gdp: 193.4, energyConsumption: 38.2, oilProduction: 1090, gasProduction: 119.0, electricityProduction: 59.0, renewableShare: 1.0, oilReserves: 9.9, gasReserves: 3.6, energyImports: 820, energyExports: 90.5, co2Emissions: 150.0, investment: 5.8},
        {year: 2020, population: 41.3, gdp: 203.7, energyConsumption: 39.1, oilProduction: 1110, gasProduction: 121.0, electricityProduction: 60.5, renewableShare: 1.1, oilReserves: 9.8, gasReserves: 3.5, energyImports: 835, energyExports: 92.0, co2Emissions: 153.5, investment: 6.0},
        {year: 2021, population: 41.8, gdp: 214.3, energyConsumption: 40.0, oilProduction: 1130, gasProduction: 123.0, electricityProduction: 62.0, renewableShare: 4.0, oilReserves: 9.7, gasReserves: 3.5, energyImports: 850, energyExports: 93.5, co2Emissions: 157.0, investment: 6.2},
        {year: 2022, population: 42.3, gdp: 225.2, energyConsumption: 40.9, oilProduction: 1150, gasProduction: 125.0, electricityProduction: 63.5, renewableShare: 8.0, oilReserves: 9.6, gasReserves: 3.4, energyImports: 865, energyExports: 95.0, co2Emissions: 160.5, investment: 6.4},
        {year: 2023, population: 42.8, gdp: 236.4, energyConsumption: 41.8, oilProduction: 1170, gasProduction: 127.0, electricityProduction: 65.0, renewableShare: 11.0, oilReserves: 9.5, gasReserves: 3.4, energyImports: 880, energyExports: 96.5, co2Emissions: 164.0, investment: 6.6},
        {year: 2024, population: 43.3, gdp: 247.9, energyConsumption: 42.7, oilProduction: 1190, gasProduction: 129.0, electricityProduction: 66.5, renewableShare: 15.0, oilReserves: 9.4, gasReserves: 3.3, energyImports: 895, energyExports: 98.0, co2Emissions: 167.5, investment: 6.8},
        {year: 2025, population: 43.8, gdp: 259.7, energyConsumption: 43.6, oilProduction: 1210, gasProduction: 131.0, electricityProduction: 68.0, renewableShare: 20.0, oilReserves: 9.3, gasReserves: 3.3, energyImports: 910, energyExports: 99.5, co2Emissions: 171.0, investment: 7.0}
    ];

    window.moroccoEnergyData = [
        {year: 2000, population: 29.1, gdp: 41.1, energyConsumption: 7.6, oilProduction: 0.1, gasProduction: 60, electricityProduction: 13.2, renewableShare: 1.0, oilReserves: 6.8, gasReserves: 0.1, energyImports: 6.7, energyExports: 0.1, co2Emissions: 18.4, investment: 0.3},
        {year: 2001, population: 29.6, gdp: 43.7, energyConsumption: 7.9, oilProduction: 0.1, gasProduction: 65, electricityProduction: 13.8, renewableShare: 1.2, oilReserves: 6.7, gasReserves: 0.1, energyImports: 7.0, energyExports: 0.1, co2Emissions: 19.2, investment: 0.35},
        {year: 2002, population: 30.1, gdp: 46.5, energyConsumption: 8.2, oilProduction: 0.1, gasProduction: 70, electricityProduction: 14.4, renewableShare: 1.5, oilReserves: 6.6, gasReserves: 0.1, energyImports: 7.3, energyExports: 0.1, co2Emissions: 20.0, investment: 0.4},
        {year: 2003, population: 30.6, gdp: 49.4, energyConsumption: 8.5, oilProduction: 0.1, gasProduction: 75, electricityProduction: 15.0, renewableShare: 2.0, oilReserves: 6.5, gasReserves: 0.1, energyImports: 7.6, energyExports: 0.1, co2Emissions: 20.8, investment: 0.45},
        {year: 2004, population: 31.1, gdp: 52.4, energyConsumption: 8.8, oilProduction: 0.1, gasProduction: 80, electricityProduction: 15.6, renewableShare: 2.5, oilReserves: 6.4, gasReserves: 0.1, energyImports: 7.9, energyExports: 0.1, co2Emissions: 21.6, investment: 0.5},
        {year: 2005, population: 31.6, gdp: 55.5, energyConsumption: 9.1, oilProduction: 0.1, gasProduction: 85, electricityProduction: 16.2, renewableShare: 3.0, oilReserves: 6.3, gasReserves: 0.1, energyImports: 8.2, energyExports: 0.1, co2Emissions: 22.4, investment: 0.6},
        {year: 2006, population: 32.1, gdp: 58.8, energyConsumption: 9.4, oilProduction: 0.1, gasProduction: 90, electricityProduction: 16.8, renewableShare: 3.5, oilReserves: 6.2, gasReserves: 0.1, energyImports: 8.5, energyExports: 0.1, co2Emissions: 23.2, investment: 0.7},
        {year: 2007, population: 32.6, gdp: 62.2, energyConsumption: 9.7, oilProduction: 0.1, gasProduction: 95, electricityProduction: 17.4, renewableShare: 4.0, oilReserves: 6.1, gasReserves: 0.1, energyImports: 8.8, energyExports: 0.1, co2Emissions: 24.0, investment: 0.8},
        {year: 2008, population: 33.1, gdp: 65.7, energyConsumption: 10.0, oilProduction: 0.1, gasProduction: 100, electricityProduction: 18.0, renewableShare: 4.5, oilReserves: 6.0, gasReserves: 0.1, energyImports: 9.1, energyExports: 0.1, co2Emissions: 24.8, investment: 0.9},
        {year: 2009, population: 33.6, gdp: 69.3, energyConsumption: 10.3, oilProduction: 0.1, gasProduction: 105, electricityProduction: 18.6, renewableShare: 5.0, oilReserves: 5.9, gasReserves: 0.1, energyImports: 9.4, energyExports: 0.1, co2Emissions: 25.6, investment: 1.0},
        {year: 2010, population: 34.1, gdp: 73.0, energyConsumption: 10.6, oilProduction: 0.1, gasProduction: 110, electricityProduction: 19.2, renewableShare: 5.5, oilReserves: 5.8, gasReserves: 0.1, energyImports: 9.7, energyExports: 0.1, co2Emissions: 26.4, investment: 1.1},
        {year: 2011, population: 34.6, gdp: 76.8, energyConsumption: 10.9, oilProduction: 0.1, gasProduction: 115, electricityProduction: 19.8, renewableShare: 6.0, oilReserves: 5.7, gasReserves: 0.1, energyImports: 10.0, energyExports: 0.1, co2Emissions: 27.2, investment: 1.2},
        {year: 2012, population: 35.1, gdp: 80.7, energyConsumption: 11.2, oilProduction: 0.1, gasProduction: 120, electricityProduction: 20.4, renewableShare: 7.0, oilReserves: 5.6, gasReserves: 0.1, energyImports: 10.3, energyExports: 0.1, co2Emissions: 28.0, investment: 1.4},
        {year: 2013, population: 35.6, gdp: 84.7, energyConsumption: 11.5, oilProduction: 0.1, gasProduction: 125, electricityProduction: 21.0, renewableShare: 8.0, oilReserves: 5.5, gasReserves: 0.1, energyImports: 10.6, energyExports: 0.1, co2Emissions: 28.8, investment: 1.6},
        {year: 2014, population: 36.0, gdp: 88.8, energyConsumption: 11.8, oilProduction: 0.1, gasProduction: 130, electricityProduction: 21.6, renewableShare: 9.0, oilReserves: 5.4, gasReserves: 0.1, energyImports: 10.9, energyExports: 0.1, co2Emissions: 29.6, investment: 1.8},
        {year: 2015, population: 36.5, gdp: 93.0, energyConsumption: 12.1, oilProduction: 0.1, gasProduction: 135, electricityProduction: 22.2, renewableShare: 10.0, oilReserves: 5.3, gasReserves: 0.1, energyImports: 11.2, energyExports: 0.1, co2Emissions: 30.4, investment: 2.0},
        {year: 2016, population: 37.0, gdp: 97.3, energyConsumption: 12.4, oilProduction: 0.1, gasProduction: 140, electricityProduction: 22.8, renewableShare: 11.0, oilReserves: 5.2, gasReserves: 0.1, energyImports: 11.5, energyExports: 0.1, co2Emissions: 31.2, investment: 2.2},
        {year: 2017, population: 37.5, gdp: 101.7, energyConsumption: 12.7, oilProduction: 0.1, gasProduction: 145, electricityProduction: 23.4, renewableShare: 12.0, oilReserves: 5.1, gasReserves: 0.1, energyImports: 11.8, energyExports: 0.1, co2Emissions: 32.0, investment: 2.4},
        {year: 2018, population: 38.0, gdp: 106.2, energyConsumption: 13.0, oilProduction: 0.1, gasProduction: 150, electricityProduction: 24.0, renewableShare: 13.0, oilReserves: 5.0, gasReserves: 0.1, energyImports: 12.1, energyExports: 0.1, co2Emissions: 32.8, investment: 2.6},
        {year: 2019, population: 38.5, gdp: 110.8, energyConsumption: 13.3, oilProduction: 0.1, gasProduction: 155, electricityProduction: 24.6, renewableShare: 14.0, oilReserves: 4.9, gasReserves: 0.1, energyImports: 12.4, energyExports: 0.1, co2Emissions: 33.6, investment: 2.8},
        {year: 2020, population: 39.0, gdp: 115.5, energyConsumption: 13.6, oilProduction: 0.1, gasProduction: 160, electricityProduction: 25.2, renewableShare: 15.0, oilReserves: 4.8, gasReserves: 0.1, energyImports: 12.7, energyExports: 0.1, co2Emissions: 34.4, investment: 3.0},
        {year: 2021, population: 39.5, gdp: 120.3, energyConsumption: 13.9, oilProduction: 0.1, gasProduction: 165, electricityProduction: 25.8, renewableShare: 37.0, oilReserves: 4.7, gasReserves: 0.1, energyImports: 13.0, energyExports: 0.1, co2Emissions: 35.2, investment: 3.2},
        {year: 2022, population: 40.0, gdp: 125.2, energyConsumption: 14.2, oilProduction: 0.1, gasProduction: 170, electricityProduction: 26.4, renewableShare: 42.0, oilReserves: 4.6, gasReserves: 0.1, energyImports: 13.3, energyExports: 0.1, co2Emissions: 36.0, investment: 3.4},
        {year: 2023, population: 40.5, gdp: 130.2, energyConsumption: 14.5, oilProduction: 0.1, gasProduction: 175, electricityProduction: 27.0, renewableShare: 46.0, oilReserves: 4.5, gasReserves: 0.1, energyImports: 13.6, energyExports: 0.1, co2Emissions: 36.8, investment: 3.6},
        {year: 2024, population: 41.0, gdp: 135.3, energyConsumption: 14.8, oilProduction: 0.1, gasProduction: 180, electricityProduction: 27.6, renewableShare: 50.0, oilReserves: 4.4, gasReserves: 0.1, energyImports: 13.9, energyExports: 0.1, co2Emissions: 37.6, investment: 3.8},
        {year: 2025, population: 41.5, gdp: 140.5, energyConsumption: 15.1, oilProduction: 0.1, gasProduction: 185, electricityProduction: 28.2, renewableShare: 52.0, oilReserves: 4.3, gasReserves: 0.1, energyImports: 14.2, energyExports: 0.1, co2Emissions: 38.4, investment: 4.0}
    ];

    window.libyaEnergyData = [
        {year: 2000, population: 5.1, gdp: 13.0, energyConsumption: 6.2, oilProduction: 550, gasProduction: 6.5, electricityProduction: 18.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 500, energyExports: 2.5, co2Emissions: 32.0, investment: 0.5},
        {year: 2001, population: 5.2, gdp: 14.5, energyConsumption: 6.5, oilProduction: 580, gasProduction: 6.8, electricityProduction: 19.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 530, energyExports: 2.6, co2Emissions: 33.5, investment: 0.5},
        {year: 2002, population: 5.3, gdp: 16.2, energyConsumption: 6.8, oilProduction: 610, gasProduction: 7.1, electricityProduction: 20.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 560, energyExports: 2.7, co2Emissions: 35.0, investment: 0.5},
        {year: 2003, population: 5.4, gdp: 18.0, energyConsumption: 7.1, oilProduction: 640, gasProduction: 7.4, electricityProduction: 21.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 590, energyExports: 2.8, co2Emissions: 36.5, investment: 0.5},
        {year: 2004, population: 5.5, gdp: 20.0, energyConsumption: 7.4, oilProduction: 670, gasProduction: 7.7, electricityProduction: 22.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 620, energyExports: 2.9, co2Emissions: 38.0, investment: 0.5},
        {year: 2005, population: 5.6, gdp: 22.1, energyConsumption: 7.7, oilProduction: 700, gasProduction: 8.0, electricityProduction: 23.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 650, energyExports: 3.0, co2Emissions: 39.5, investment: 0.5},
        {year: 2006, population: 5.7, gdp: 24.4, energyConsumption: 8.0, oilProduction: 730, gasProduction: 8.3, electricityProduction: 24.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 680, energyExports: 3.1, co2Emissions: 41.0, investment: 0.5},
        {year: 2007, population: 5.8, gdp: 26.8, energyConsumption: 8.3, oilProduction: 760, gasProduction: 8.6, electricityProduction: 25.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 710, energyExports: 3.2, co2Emissions: 42.5, investment: 0.5},
        {year: 2008, population: 5.9, gdp: 29.4, energyConsumption: 8.6, oilProduction: 790, gasProduction: 8.9, electricityProduction: 26.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 740, energyExports: 3.3, co2Emissions: 44.0, investment: 0.5},
        {year: 2009, population: 6.0, gdp: 32.1, energyConsumption: 8.9, oilProduction: 820, gasProduction: 9.2, electricityProduction: 27.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 770, energyExports: 3.4, co2Emissions: 45.5, investment: 0.5},
        {year: 2010, population: 6.1, gdp: 35.0, energyConsumption: 9.2, oilProduction: 850, gasProduction: 9.5, electricityProduction: 28.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 800, energyExports: 3.5, co2Emissions: 47.0, investment: 0.5},
        {year: 2011, population: 6.2, gdp: 22.0, energyConsumption: 5.0, oilProduction: 150, gasProduction: 2.0, electricityProduction: 8.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 100, energyExports: 0.5, co2Emissions: 10.0, investment: 0.5},
        {year: 2012, population: 6.3, gdp: 30.0, energyConsumption: 6.0, oilProduction: 500, gasProduction: 5.0, electricityProduction: 15.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 450, energyExports: 1.5, co2Emissions: 25.0, investment: 0.5},
        {year: 2013, population: 6.4, gdp: 40.0, energyConsumption: 7.0, oilProduction: 600, gasProduction: 6.0, electricityProduction: 18.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 550, energyExports: 2.0, co2Emissions: 30.0, investment: 0.5},
        {year: 2014, population: 6.5, gdp: 45.0, energyConsumption: 7.5, oilProduction: 650, gasProduction: 6.5, electricityProduction: 19.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 600, energyExports: 2.2, co2Emissions: 32.5, investment: 0.5},
        {year: 2015, population: 6.6, gdp: 40.0, energyConsumption: 7.0, oilProduction: 400, gasProduction: 4.0, electricityProduction: 15.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 350, energyExports: 1.5, co2Emissions: 28.0, investment: 0.5},
        {year: 2016, population: 6.7, gdp: 35.0, energyConsumption: 6.5, oilProduction: 350, gasProduction: 3.5, electricityProduction: 14.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 300, energyExports: 1.3, co2Emissions: 25.0, investment: 0.5},
        {year: 2017, population: 6.8, gdp: 40.0, energyConsumption: 7.0, oilProduction: 500, gasProduction: 5.0, electricityProduction: 16.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 450, energyExports: 1.8, co2Emissions: 28.0, investment: 0.5},
        {year: 2018, population: 6.9, gdp: 45.0, energyConsumption: 7.5, oilProduction: 600, gasProduction: 6.0, electricityProduction: 18.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 550, energyExports: 2.0, co2Emissions: 30.0, investment: 0.5},
        {year: 2019, population: 7.0, gdp: 50.0, energyConsumption: 8.0, oilProduction: 700, gasProduction: 7.0, electricityProduction: 20.0, renewableShare: 0.1, oilReserves: 46.4, gasReserves: 1.5, energyImports: 650, energyExports: 2.3, co2Emissions: 32.0, investment: 0.5},
        {year: 2020, population: 7.1, gdp: 30.0, energyConsumption: 6.0, oilProduction: 400, gasProduction: 4.0, electricityProduction: 14.0, renewableShare: 0.2, oilReserves: 46.4, gasReserves: 1.5, energyImports: 350, energyExports: 1.5, co2Emissions: 25.0, investment: 0.5},
        {year: 2021, population: 7.2, gdp: 35.0, energyConsumption: 6.5, oilProduction: 500, gasProduction: 5.0, electricityProduction: 16.0, renewableShare: 0.3, oilReserves: 46.4, gasReserves: 1.5, energyImports: 450, energyExports: 1.8, co2Emissions: 28.0, investment: 0.5},
        {year: 2022, population: 7.3, gdp: 40.0, energyConsumption: 7.0, oilProduction: 600, gasProduction: 6.0, electricityProduction: 18.0, renewableShare: 0.4, oilReserves: 46.4, gasReserves: 1.5, energyImports: 550, energyExports: 2.0, co2Emissions: 30.0, investment: 0.5},
        {year: 2023, population: 7.4, gdp: 45.0, energyConsumption: 7.5, oilProduction: 700, gasProduction: 7.0, electricityProduction: 20.0, renewableShare: 0.5, oilReserves: 46.4, gasReserves: 1.5, energyImports: 650, energyExports: 2.3, co2Emissions: 32.0, investment: 0.5},
        {year: 2024, population: 7.5, gdp: 50.0, energyConsumption: 8.0, oilProduction: 800, gasProduction: 8.0, electricityProduction: 22.0, renewableShare: 0.7, oilReserves: 46.4, gasReserves: 1.5, energyImports: 750, energyExports: 2.5, co2Emissions: 34.0, investment: 0.5},
        {year: 2025, population: 7.6, gdp: 55.0, energyConsumption: 8.5, oilProduction: 900, gasProduction: 9.0, electricityProduction: 24.0, renewableShare: 1.0, oilReserves: 46.4, gasReserves: 1.5, energyImports: 850, energyExports: 2.7, co2Emissions: 36.0, investment: 0.7}
    ];

    // ===== AI PREDICTION ENGINE =====
    class EnergyPredictor {
        constructor() {
            this.predictionCache = {};
            this.lastUpdate = Date.now();
            this.updateInterval = 30000; // 30 seconds
        }

        // Linear regression for trend analysis
        linearRegression(data, field) {
            const n = data.length;
            let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
            
            data.forEach((d, i) => {
                const x = i;
                const y = d[field] || 0;
                sumX += x;
                sumY += y;
                sumXY += x * y;
                sumXX += x * x;
            });
            
            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;
            
            return { slope, intercept };
        }

        // Calculate growth rate for exponential fields
        calculateGrowthRate(data, field, recentYears = 5) {
            const recent = data.slice(-recentYears);
            const growthRates = [];
            
            for (let i = 1; i < recent.length; i++) {
                const prev = recent[i-1][field] || 0;
                const curr = recent[i][field] || 0;
                if (prev !== 0) {
                    growthRates.push((curr - prev) / prev);
                }
            }
            
            return growthRates.reduce((a, b) => a + b, 0) / growthRates.length;
        }

        // Predict single field value using pure mathematics (no randomness)
        predictField(data, field, yearsAhead, baseYear = 2025) {
            const regression = this.linearRegression(data, field);
            const growthRate = this.calculateGrowthRate(data, field);
            const lastValue = data[data.length - 1][field] || 0;
            
            // Special handling for different field types - DETERMINISTIC ONLY
            if (field === 'renewableShare') {
                // Logistic growth (S-curve) for renewables
                const targetMax = 65; // Realistic maximum renewable percentage
                const currentShare = lastValue;
                const remainingGrowth = targetMax - currentShare;
                
                // Sigmoid function for realistic adoption curve
                const k = 0.18; // Growth rate parameter
                const midpoint = 15; // Years to reach 50% of potential
                const sigmoidGrowth = remainingGrowth / (1 + Math.exp(-k * (yearsAhead - midpoint)));
                
                return Math.min(currentShare + sigmoidGrowth, targetMax);
            } else if (field === 'oilReserves' || field === 'gasReserves') {
                // Exponential depletion based on production/reserves ratio
                const productionField = field === 'oilReserves' ? 'oilProduction' : 'gasProduction';
                const currentProduction = data[data.length - 1][productionField] || 0;
                const depletionRate = currentProduction / lastValue; // R/P ratio
                
                // Account for declining production over time
                const adjustedDepletion = depletionRate * Math.pow(0.98, yearsAhead); // 2% annual slowdown
                return Math.max(lastValue * Math.pow(1 - adjustedDepletion, yearsAhead), 0.1);
            } else if (field === 'co2Emissions') {
                // CO2 reduction correlates with renewable adoption
                const renewableImpact = this.calculateGrowthRate(data, 'renewableShare');
                const baseEmissionGrowth = growthRate;
                
                // Each 1% increase in renewables reduces CO2 growth by 0.5%
                const netGrowth = baseEmissionGrowth - (renewableImpact * 0.5);
                
                return Math.max(lastValue * Math.pow(1 + netGrowth, yearsAhead), 0);
            } else if (field === 'investment') {
                // Investment accelerates with renewable transition
                const renewableShare = data[data.length - 1].renewableShare || 1;
                const futureRenewableShare = this.predictField(data, 'renewableShare', yearsAhead);
                
                // Investment grows exponentially as renewables increase
                const investmentGrowthRate = 0.05 + (futureRenewableShare / 1000); // Base 5% + renewable bonus
                return lastValue * Math.pow(1 + investmentGrowthRate, yearsAhead);
            } else if (field === 'population') {
                // Population follows logistic growth (slowing over time)
                const historicalGrowth = growthRate;
                const slowdownFactor = Math.pow(0.99, yearsAhead); // Growth slows 1% per year
                return lastValue * Math.pow(1 + historicalGrowth * slowdownFactor, yearsAhead);
            } else if (field === 'gdp') {
                // GDP growth with economic cycles consideration
                const baseGrowth = Math.abs(growthRate);
                const populationGrowth = this.calculateGrowthRate(data, 'population');
                
                // GDP = population growth + productivity growth
                const productivityGrowth = baseGrowth - populationGrowth;
                const sustainableGrowth = populationGrowth + (productivityGrowth * 0.85); // 85% of productivity continues
                
                return lastValue * Math.pow(1 + sustainableGrowth, yearsAhead);
            } else if (field === 'oilProduction' || field === 'gasProduction') {
                // Production peaks then declines with reserves
                const reserveField = field === 'oilProduction' ? 'oilReserves' : 'gasReserves';
                const currentReserves = data[data.length - 1][reserveField] || 1;
                const futureReserves = this.predictField(data, reserveField, yearsAhead);
                const reserveRatio = futureReserves / currentReserves;
                
                // Production follows Hubbert peak curve
                const peakAdjustment = Math.pow(reserveRatio, 0.3); // Production declines slower than reserves
                return lastValue * peakAdjustment * Math.pow(1 + (growthRate * 0.5), yearsAhead);
            } else if (field === 'electricityProduction') {
                // Electricity grows with population and economic activity
                const populationGrowth = this.calculateGrowthRate(data, 'population');
                const gdpGrowth = this.calculateGrowthRate(data, 'gdp');
                
                // Electricity intensity = 0.3 * population + 0.5 * GDP + efficiency gains
                const electricityGrowth = (populationGrowth * 0.3) + (gdpGrowth * 0.5) + 0.01; // 1% efficiency improvement
                
                return lastValue * Math.pow(1 + electricityGrowth, yearsAhead);
            } else {
                // General fields: Weighted combination of linear regression and exponential growth
                const trendValue = regression.slope * (data.length + yearsAhead - 1) + regression.intercept;
                const growthValue = lastValue * Math.pow(1 + growthRate, yearsAhead);
                
                // Weight more recent trends higher (60% growth, 40% regression)
                return (trendValue * 0.4 + growthValue * 0.6);
            }
        }

        // Generate predictions for a country
        generatePredictions(country, yearsToPredict = 10) {
            const dataMap = {
                'tunisia': window.tunisiaEnergyData,
                'algeria': window.algeriaEnergyData,
                'morocco': window.moroccoEnergyData,
                'libya': window.libyaEnergyData
            };
            
            const historicalData = dataMap[country];
            if (!historicalData) return [];
            
            const predictions = [];
            const fields = ['population', 'gdp', 'energyConsumption', 'oilProduction', 'gasProduction', 
                          'electricityProduction', 'renewableShare', 'oilReserves', 'gasReserves', 
                          'energyImports', 'energyExports', 'co2Emissions', 'investment'];
            
            for (let year = 1; year <= yearsToPredict; year++) {
                const prediction = { year: 2025 + year };
                
                fields.forEach(field => {
                    prediction[field] = parseFloat(this.predictField(historicalData, field, year).toFixed(2));
                });
                
                predictions.push(prediction);
            }
            
            return predictions;
        }

        // Get predictions with cache (deterministic - same results every time)
        getPredictions(country) {
            const cacheKey = country;
            
            // Generate predictions only if not cached
            if (!this.predictionCache[cacheKey]) {
                this.predictionCache[cacheKey] = this.generatePredictions(country);
                this.lastUpdate = Date.now();
                console.log(`🤖 AI Predictions calculated for ${country} using deterministic mathematical models`);
            }
            
            return this.predictionCache[cacheKey];
        }

        // Force refresh predictions (recalculate from scratch)
        refreshPredictions(country) {
            delete this.predictionCache[country]; // Clear cache
            const predictions = this.generatePredictions(country);
            this.predictionCache[country] = predictions;
            this.lastUpdate = Date.now();
            console.log(`🤖 AI Predictions recalculated for ${country} - Pure mathematical model (no randomness)`);
            return predictions;
        }
    }

    // Initialize AI Predictor
    window.energyPredictor = new EnergyPredictor();

    // Major energy facilities in Tunisia (Real GPS Coordinates)
    // Add Tunisia cities and places data
    const tunisianCities = [
        {name: "Tunis", coords: [10.1815, 36.8065]},
        {name: "Sfax", coords: [10.7600, 34.7406]},
        {name: "Sousse", coords: [10.6411, 35.8256]},
        {name: "Kairouan", coords: [10.0963, 35.6781]},
        {name: "Bizerte", coords: [9.8739, 37.2744]},
        {name: "Gabès", coords: [10.0982, 33.8815]},
        {name: "Ariana", coords: [10.1956, 36.8625]},
        {name: "Gafsa", coords: [8.7842, 34.4250]},
        {name: "Monastir", coords: [10.8264, 35.7643]},
        {name: "Ben Arous", coords: [10.2189, 36.7544]},
        {name: "Kasserine", coords: [8.8365, 35.1674]},
        {name: "Médenine", coords: [10.5055, 33.3548]},
        {name: "Nabeul", coords: [10.7372, 36.4561]},
        {name: "Tataouine", coords: [10.4517, 32.9297]},
        {name: "Béja", coords: [9.1840, 36.7256]},
        {name: "Jendouba", coords: [8.7800, 36.5011]},
        {name: "Mahdia", coords: [11.0622, 35.5047]},
        {name: "Sidi Bouzid", coords: [9.4839, 35.0381]},
        {name: "Siliana", coords: [9.3706, 36.0836]},
        {name: "Kef", coords: [8.7042, 36.1692]},
        {name: "Tozeur", coords: [8.1339, 33.9197]},
        {name: "Kébili", coords: [8.9694, 33.7047]},
        {name: "Zaghouan", coords: [10.1425, 36.4028]},
        {name: "Manouba", coords: [10.0956, 36.8081]},
        {name: "Hammamet", coords: [10.6133, 36.4000]},
        {name: "Djerba", coords: [10.8531, 33.8076]},
        {name: "Carthage", coords: [10.3314, 36.8531]},
        {name: "Skhira", coords: [10.0700, 34.3000]},
        {name: "Douz", coords: [9.0203, 33.4664]},
        {name: "Matmata", coords: [9.9667, 33.5444]}
    ];

    // Add labels for Tunisian cities when zoomed in
    viewer.scene.camera.changed.addEventListener(function() {
        const height = viewer.camera.positionCartographic.height;
        const position = viewer.camera.positionCartographic;
        
        // Check if we're over Tunisia region
        const overTunisia = position.longitude > Cesium.Math.toRadians(7.5) && 
                           position.longitude < Cesium.Math.toRadians(11.6) && 
                           position.latitude > Cesium.Math.toRadians(30.2) && 
                           position.latitude < Cesium.Math.toRadians(37.5);
        
        if (height < 1000000 && overTunisia) { // Less than 1000km altitude over Tunisia
            tunisianCities.forEach(city => {
                const existingLabel = viewer.entities.getById(city.name);
                if (!existingLabel) {
                    viewer.entities.add({
                        id: city.name,
                        position: Cesium.Cartesian3.fromDegrees(city.coords[0], city.coords[1]),
                        label: {
                            text: city.name,
                            font: '14pt sans-serif',
                            fillColor: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            pixelOffset: new Cesium.Cartesian2(0, -40),
                            eyeOffset: new Cesium.Cartesian3(0, 0, -1000),
                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            scale: 0.8
                        }
                    });
                }
            });
        } else {
            // Remove labels when zoomed out or not over Tunisia
            tunisianCities.forEach(city => {
                const label = viewer.entities.getById(city.name);
                if (label) {
                    viewer.entities.remove(label);
                }
            });
        }
    });

    // Start initialization after viewer is ready
    initializeApp(viewer);
}

async function initializeApp(viewer) {
    console.log('📌 initializeApp() STARTED');

// Famous locations data
const locations = {
    paris: {
        name: "Paris, France",
        coordinates: [2.3522, 48.8566, 1000],
        description: "The City of Light, known for the Eiffel Tower, Louvre Museum, and romantic atmosphere.",
        details: "Population: ~2.1 million | Country: France | Continent: Europe"
    },
    everest: {
        name: "Mount Everest",
        coordinates: [86.9250, 27.9881, 15000],
        description: "The world's highest mountain peak at 8,848.86 meters above sea level.",
        details: "Height: 8,848.86m | Location: Nepal-Tibet border | First climbed: 1953"
    },
    newyork: {
        name: "New York City, USA",
        coordinates: [-74.0060, 40.7128, 1000],
        description: "The Big Apple, famous for Times Square, Central Park, and the Statue of Liberty.",
        details: "Population: ~8.3 million | State: New York | Country: United States"
    },
    tunis: {
        name: "Tunis, Tunisia",
        coordinates: [10.1815, 36.8065, 1000],
        description: "The capital and largest city of Tunisia, known for its medina and rich history.",
        details: "Population: ~1 million | Country: Tunisia | Continent: Africa"
    },
    tokyo: {
        name: "Tokyo, Japan",
        coordinates: [139.6917, 35.6895, 1000],
        description: "Japan's bustling capital, known for technology, culture, and incredible food.",
        details: "Population: ~14 million | Country: Japan | Continent: Asia"
    },
    london: {
        name: "London, England",
        coordinates: [-0.1276, 51.5074, 1000],
        description: "Historic capital of the UK, home to Big Ben, Tower Bridge, and Buckingham Palace.",
        details: "Population: ~9 million | Country: United Kingdom | Continent: Europe"
    },
    sydney: {
        name: "Sydney, Australia",
        coordinates: [151.2093, -33.8688, 1000],
        description: "Famous for the Sydney Opera House, Harbour Bridge, and beautiful beaches.",
        details: "Population: ~5.3 million | State: New South Wales | Country: Australia"
    }
};

// Additional world landmarks
const worldLandmarks = [
    { name: "Great Wall of China", coordinates: [116.5704, 40.4319, 2000] },
    { name: "Machu Picchu", coordinates: [-72.5450, -13.1631, 5000] },
    { name: "Pyramids of Giza", coordinates: [31.1342, 29.9792, 1000] },
    { name: "Taj Mahal", coordinates: [78.0421, 27.1751, 1000] },
    { name: "Christ the Redeemer", coordinates: [-43.2105, -22.9519, 2000] },
    { name: "Colosseum", coordinates: [12.4924, 41.8902, 1000] },
    { name: "Petra", coordinates: [35.4444, 30.3285, 2000] },
    { name: "Angkor Wat", coordinates: [103.8670, 13.4125, 1000] }
];


// Info panel elements
const infoPanel = document.getElementById('infoPanel');
const locationTitle = document.getElementById('locationTitle');
const locationDescription = document.getElementById('locationDescription');
const locationDetails = document.getElementById('locationDetails');

function searchLocation(query) {
    const lowerQuery = query.toLowerCase();
    
    // Search in predefined locations
    for (const [key, location] of Object.entries(locations)) {
        if (location.name.toLowerCase().includes(lowerQuery) || key.includes(lowerQuery)) {
            flyToLocation(key);
            return;
        }
    }
    
    // Create high-resolution custom cloud layer using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;

    // Search in world landmarks
    const landmark = worldLandmarks.find(l => 
        l.name.toLowerCase().includes(lowerQuery)
    );
    
    if (landmark) {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
                landmark.coordinates[0], 
                landmark.coordinates[1], 
                landmark.coordinates[2] || 10000
            ),
            duration: 3
        });
        showLocationInfo(landmark.name, `Famous landmark: ${landmark.name}`, "Historical significance varies by location");
        return;
    }
    
    // If not found in predefined locations, try geocoding (simplified)
    alert(`Location "${query}" not found in our database. Try searching for: Paris, Tokyo, New York, London, Sydney, Mount Everest, or famous landmarks.`);
}

function flyToLocation(locationKey) {
    const location = locations[locationKey];
    if (!location) return;
    
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
            location.coordinates[0], 
            location.coordinates[1], 
            location.coordinates[2]
        ),
        duration: 3
    });
    
    // Add a marker for the location
    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(location.coordinates[0], location.coordinates[1]),
        point: {
            pixelSize: 15,
            color: Cesium.Color.CYAN,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 3,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
            text: location.name,
            font: '14pt sans-serif',
            pixelOffset: new Cesium.Cartesian2(0, -50),
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE
        }
    });
    
    showLocationInfo(location.name, location.description, location.details);
}

function showLocationInfo(title, description, details) {
    locationTitle.textContent = title;
    locationDescription.textContent = description;
    locationDetails.textContent = details;
    infoPanel.classList.remove('hidden');
}

// Event listeners removed (search functionality removed)

// Quick link buttons
document.querySelectorAll('.quick-link').forEach(button => {
    button.addEventListener('click', () => {
        const locationKey = button.getAttribute('data-location');
        flyToLocation(locationKey);
    });
});

// Close info panel
document.getElementById('closeInfoPanel').addEventListener('click', () => {
    infoPanel.classList.add('hidden');
});

    // Map style changer
    document.getElementById('mapStyle').addEventListener('change', (e) => {
        const style = e.target.value;
        
        try {
            switch(style) {
                case 'satellite':
                    viewer.imageryLayers.removeAll();
                    viewer.imageryLayers.addImageryProvider(
                        new Cesium.ArcGisMapServerImageryProvider({
                            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
                            enablePickFeatures: false
                        })
                    );
                    break;
                case 'terrain':
                    viewer.imageryLayers.removeAll();
                    viewer.imageryLayers.addImageryProvider(
                        new Cesium.ArcGisMapServerImageryProvider({
                            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer',
                            enablePickFeatures: false
                        })
                    );
                    break;
            }
        } catch (error) {
            console.error('Error switching map style:', error);
            // Fallback to satellite if there's an error
            viewer.imageryLayers.removeAll();
            viewer.imageryLayers.addImageryProvider(
                new Cesium.ArcGisMapServerImageryProvider({
                    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
                    enablePickFeatures: false
                })
            );
        }
    });

    // Language selector handler
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.addEventListener('change', (e) => {
            const language = e.target.value;
            setLanguage(language);
        });
    }

    // Load saved language on startup
    loadSavedLanguage();

// Click handler for globe
viewer.cesiumWidget.canvas.addEventListener('click', (e) => {
    const pickedObject = viewer.scene.pick(e);
    if (Cesium.defined(pickedObject) && pickedObject.id) {
        const entity = pickedObject.id;
        if (entity.label) {
            const name = entity.label.text._value;
            showLocationInfo(name, `You clicked on: ${name}`, "Click on markers to learn more about locations!");
        }
    }
});

    // Energy Side Panel functionality
    const energyYearSelect = document.getElementById('energyYear');
    const energyCountrySelect = document.getElementById('energyCountry');
    const panelTitle = document.getElementById('panelTitle');

    // Function to get current country data array
    function getCountryData(country) {
        const countryDataMap = {
            'tunisia': window.tunisiaEnergyData,
            'algeria': window.algeriaEnergyData,
            'morocco': window.moroccoEnergyData,
            'libya': window.libyaEnergyData
        };
        return countryDataMap[country] || window.tunisiaEnergyData;
    }

    // Function to get country display name
    function getCountryName(country) {
        const nameMap = {
            'tunisia': 'Tunisia',
            'algeria': 'Algeria',
            'morocco': 'Morocco',
            'libya': 'Libya'
        };
        return nameMap[country] || 'Tunisia';
    }

    // Populate year selector
    function populateYearSelector() {
        const country = energyCountrySelect.value;
        const historicalData = getCountryData(country);
        const predictions = window.energyPredictor.getPredictions(country);
        
        energyYearSelect.innerHTML = '';
        
        // Add historical years
        historicalData.forEach(yearData => {
            const option = document.createElement('option');
            option.value = yearData.year;
            option.textContent = yearData.year + (yearData.year >= 2024 ? '*' : '');
            energyYearSelect.appendChild(option);
        });
        
        // Add prediction years
        predictions.forEach(yearData => {
            const option = document.createElement('option');
            option.value = yearData.year;
            option.textContent = yearData.year + ' [AI]';
            option.style.color = '#00ffff';
            option.style.fontWeight = 'bold';
            energyYearSelect.appendChild(option);
        });
        
        energyYearSelect.value = 2025;
    }
    
    // Initial populate
    populateYearSelector();

    // Function to display energy stats
    function displayEnergyStats(year) {
        const country = energyCountrySelect.value;
        let data;
        const predictionInfo = document.getElementById('predictionInfo');
        
        // Check if it's a prediction year
        if (year > 2025) {
            const predictions = window.energyPredictor.getPredictions(country);
            data = predictions.find(d => d.year == year);
            
            // Update panel title to show it's AI prediction
            panelTitle.innerHTML = `${getCountryName(country)} Energy Data <span style="color: #00ffff; font-size: 0.8em;">AI PREDICTION</span>`;
            
            // Show prediction info
            if (predictionInfo) {
                predictionInfo.style.display = 'block';
                const timestamp = document.getElementById('predictionTimestamp');
                if (timestamp) {
                    timestamp.textContent = new Date().toLocaleTimeString();
                }
            }
        } else {
            data = getCountryData(country).find(d => d.year == year);
            // Restore normal title
            panelTitle.textContent = getCountryName(country) + ' Energy Data';
            
            // Hide prediction info
            if (predictionInfo) {
                predictionInfo.style.display = 'none';
            }
        }
        
        if (!data) return;

        // Update stat cards with animation
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            if (year > 2025) {
                card.style.borderColor = 'rgba(0, 255, 255, 0.3)';
                card.style.background = 'rgba(0, 255, 255, 0.05)';
            } else {
                card.style.borderColor = 'rgba(71, 85, 105, 0.2)';
                card.style.background = 'rgba(15, 23, 42, 0.25)';
            }
        });

        // Update stat cards
        document.getElementById('stat-population').textContent = data.population;
        document.getElementById('stat-gdp').textContent = data.gdp;
        document.getElementById('stat-consumption').textContent = data.energyConsumption;
        document.getElementById('stat-oil').textContent = data.oilProduction;
        document.getElementById('stat-gas').textContent = data.gasProduction;
        document.getElementById('stat-electricity').textContent = data.electricityProduction;
        document.getElementById('stat-renewable').textContent = data.renewableShare;
        document.getElementById('stat-oilReserves').textContent = data.oilReserves;
        document.getElementById('stat-gasReserves').textContent = data.gasReserves;
        document.getElementById('stat-energyImports').textContent = data.energyImports;
        document.getElementById('stat-energyExports').textContent = data.energyExports;
        document.getElementById('stat-co2').textContent = data.co2Emissions;
        document.getElementById('stat-investment').textContent = data.investment;
    }

    // Country selector change handler
    energyCountrySelect.addEventListener('change', (e) => {
        const country = e.target.value;
        const countryName = getCountryName(country);
        panelTitle.textContent = countryName + ' Energy Data';
        populateYearSelector();
        displayEnergyStats(energyYearSelect.value);
        document.getElementById('yearSlider').value = 2025;
        document.getElementById('sliderYear').textContent = 2025;
    });

    // Display initial stats on load
    displayEnergyStats(energyYearSelect.value);

    // Update stats when year changes
    energyYearSelect.addEventListener('change', (e) => {
        displayEnergyStats(e.target.value);
        // Sync slider
        document.getElementById('yearSlider').value = e.target.value;
        document.getElementById('sliderYear').textContent = e.target.value;
    });

    // Manual prediction refresh button
    const refreshPredictionBtn = document.getElementById('refreshPredictionBtn');
    if (refreshPredictionBtn) {
        refreshPredictionBtn.addEventListener('click', () => {
            const country = energyCountrySelect.value;
            const currentYear = parseInt(energyYearSelect.value);
            
            // Add visual feedback
            refreshPredictionBtn.textContent = '⟳ Recalculating...';
            refreshPredictionBtn.style.background = 'rgba(0, 255, 255, 0.25)';
            
            // Refresh predictions (recalculate with deterministic model)
            window.energyPredictor.refreshPredictions(country);
            
            // Update display if viewing prediction year
            if (currentYear > 2025) {
                displayEnergyStats(currentYear);
            }
            
            // Update timestamp
            const timestamp = document.getElementById('predictionTimestamp');
            if (timestamp) {
                timestamp.textContent = new Date().toLocaleTimeString();
            }
            
            // Reset button
            setTimeout(() => {
                refreshPredictionBtn.textContent = '🔄 Recalculate Predictions';
                refreshPredictionBtn.style.background = 'rgba(0, 255, 255, 0.15)';
            }, 500);
            
            console.log('🤖 Deterministic prediction model recalculated for', country);
        });
    }

    // ===== FEATURE 1: Time-Series Animation =====
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const yearSlider = document.getElementById('yearSlider');
    const sliderYear = document.getElementById('sliderYear');
    let animationInterval = null;

    // Sync slider with select dropdown
    yearSlider.addEventListener('input', (e) => {
        const year = e.target.value;
        sliderYear.textContent = year;
        energyYearSelect.value = year;
        displayEnergyStats(year);
    });

    // Play animation
    playBtn.addEventListener('click', () => {
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        
        animationInterval = setInterval(() => {
            let currentYear = parseInt(yearSlider.value);
            if (currentYear >= 2035) {
                currentYear = 2000; // Loop back
            } else {
                currentYear++;
            }
            yearSlider.value = currentYear;
            sliderYear.textContent = currentYear;
            energyYearSelect.value = currentYear;
            displayEnergyStats(currentYear);
        }, 500); // Update every 500ms
    });

    // Pause animation
    pauseBtn.addEventListener('click', () => {
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'block';
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
    });

    // ===== FEATURE 2: Layer Control =====
    const toggleBorders = document.getElementById('toggleBorders');
    const toggleLabels = document.getElementById('toggleLabels');
    const toggleCities = document.getElementById('toggleCities');
    const imageryOpacity = document.getElementById('imageryOpacity');
    const opacityValue = document.getElementById('opacityValue');

    // Store references to layers
    let borderEntities = [];
    let labelEntities = [];
    let cityEntities = [];

    // Collect border entities after they're loaded
    setTimeout(() => {
        viewer.entities.values.forEach(entity => {
            if (entity.polyline) borderEntities.push(entity);
            if (entity.label && entity.name && (entity.name.includes('TUNISIA') || entity.name.includes('ALGERIA') || entity.name.includes('LIBYA') || entity.name.includes('MOROCCO'))) {
                labelEntities.push(entity);
            }
            if (entity.label && !entity.name.includes('TUNISIA') && !entity.name.includes('ALGERIA') && !entity.name.includes('LIBYA') && !entity.name.includes('MOROCCO') && entity.name !== undefined) {
                cityEntities.push(entity);
            }
        });
    }, 3000);

    toggleBorders.addEventListener('change', (e) => {
        borderEntities.forEach(entity => entity.show = e.target.checked);
    });

    toggleLabels.addEventListener('change', (e) => {
        labelEntities.forEach(entity => entity.show = e.target.checked);
    });

    toggleCities.addEventListener('change', (e) => {
        cityEntities.forEach(entity => entity.show = e.target.checked);
    });

    imageryOpacity.addEventListener('input', (e) => {
        const opacity = e.target.value / 100;
        opacityValue.textContent = e.target.value + '%';
        viewer.imageryLayers.get(0).alpha = opacity;
    });

    // ===== FEATURE 3: Bookmarks =====
    const saveViewBtn = document.getElementById('saveViewBtn');
    const bookmarksList = document.getElementById('bookmarksList');
    let bookmarks = JSON.parse(localStorage.getItem('cesiumBookmarks')) || [];

    // Load saved bookmarks
    function renderBookmarks() {
        bookmarksList.innerHTML = '';
        bookmarks.forEach((bookmark, index) => {
            const div = document.createElement('div');
            div.className = 'bookmark-item';
            div.innerHTML = `
                <span class="bookmark-name">${bookmark.name}</span>
                <button class="bookmark-delete" data-index="${index}">✕</button>
            `;
            div.querySelector('.bookmark-name').addEventListener('click', () => {
                // Smooth flyTo with easing and a gentle arc for nicer zoom-in
                const targetHeight = bookmark.height || 1000000;
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(bookmark.lon, bookmark.lat, targetHeight),
                    orientation: {
                        heading: bookmark.heading,
                        pitch: bookmark.pitch,
                        roll: bookmark.roll
                    },
                    duration: 3.5,
                    easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
                    // maximumHeight creates a nice arc during the flight; set relative to target height
                    maximumHeight: Math.max(targetHeight * 2.5, 800000)
                });
            });
            div.querySelector('.bookmark-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                bookmarks.splice(index, 1);
                localStorage.setItem('cesiumBookmarks', JSON.stringify(bookmarks));
                renderBookmarks();
            });
            bookmarksList.appendChild(div);
        });
    }

    saveViewBtn.addEventListener('click', () => {
        const camera = viewer.camera;
        const cartographic = Cesium.Cartographic.fromCartesian(camera.position);
        const name = prompt('Enter bookmark name:', `View ${bookmarks.length + 1}`);
        if (name) {
            bookmarks.push({
                name: name,
                lon: Cesium.Math.toDegrees(cartographic.longitude),
                lat: Cesium.Math.toDegrees(cartographic.latitude),
                height: cartographic.height,
                heading: camera.heading,
                pitch: camera.pitch,
                roll: camera.roll
            });
            localStorage.setItem('cesiumBookmarks', JSON.stringify(bookmarks));
            renderBookmarks();
        }
    });

    renderBookmarks();

    // ===== ADVANCED MAP VISUALIZATION =====
    const mapVisualization = document.getElementById('mapVisualization');
    const vizYear = document.getElementById('vizYear');

    // Chart contexts
    const productionCtx = document.getElementById('productionChart').getContext('2d');
    const renewableCtx = document.getElementById('renewableChart').getContext('2d');
    const balanceCtx = document.getElementById('balanceChart').getContext('2d');

    // Draw bar chart helper
    function drawBarChart(ctx, data, labels, colors, title) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const padding = 30;
        const barWidth = (width - padding * 2) / data.length - 10;
        const maxValue = Math.max(...data);

        ctx.clearRect(0, 0, width, height);

        // Draw bars with animation
        data.forEach((value, i) => {
            const barHeight = ((value / maxValue) * (height - padding * 2));
            const x = padding + i * (barWidth + 10);
            const y = height - padding - barHeight;

            // Gradient
            const gradient = ctx.createLinearGradient(x, y, x, height - padding);
            gradient.addColorStop(0, colors[i]);
            gradient.addColorStop(1, colors[i] + '80');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Label
            ctx.fillStyle = '#b0bec5';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(labels[i], x + barWidth / 2, height - 10);

            // Value
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText(value.toFixed(1), x + barWidth / 2, y - 5);
        });
    }

    // Draw donut chart helper
    function drawDonutChart(ctx, percentage, label) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;
        const innerRadius = radius * 0.6;

        ctx.clearRect(0, 0, width, height);

        // Background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();

        // Progress arc
        const endAngle = (percentage / 100) * 2 * Math.PI - Math.PI / 2;
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
        ctx.lineWidth = radius - innerRadius;
        ctx.strokeStyle = gradient;
        ctx.stroke();

        // Center text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(percentage.toFixed(1) + '%', centerX, centerY - 10);

        ctx.fillStyle = '#b0bec5';
        ctx.font = '12px sans-serif';
        ctx.fillText(label, centerX, centerY + 15);
    }

    // Update visualization
    function updateMapVisualization(year) {
        const data = window.tunisiaEnergyData.find(d => d.year == year);
        if (!data) return;

        vizYear.textContent = year;

        // Production chart (Oil, Gas, Electricity)
        drawBarChart(
            productionCtx,
            [data.oilProduction, data.gasProduction / 10, data.electricityProduction],
            ['Oil (M bbl)', 'Gas (100M m³)', 'Elec (TWh)'],
            ['#ff9800', '#f44336', '#4fc3f7'],
            'Energy Production'
        );

        // Renewable chart
        drawDonutChart(renewableCtx, data.renewableShare, 'Renewable');

        // Balance chart (Consumption vs Production metrics)
        const netBalance = data.energyExports - data.energyImports;
        drawBarChart(
            balanceCtx,
            [data.energyConsumption, data.energyImports, data.energyExports],
            ['Consumption', 'Imports', 'Exports'],
            ['#667eea', '#f44336', '#4caf50'],
            'Energy Balance'
        );

        // Update indicators with trends
        updateIndicator('vizPop', 'trendPop', data.population + 'M', year);
        updateIndicator('vizGDP', 'trendGDP', '$' + data.gdp + 'B', year);
        updateIndicator('vizInvest', 'trendInvest', '$' + data.investment + 'M', year);
    }

    function updateIndicator(valueId, trendId, value, year) {
        document.getElementById(valueId).textContent = value;
        
        // Calculate trend
        const currentData = window.tunisiaEnergyData.find(d => d.year == year);
        const prevData = window.tunisiaEnergyData.find(d => d.year == year - 1);
        
        if (currentData && prevData) {
            let currentVal, prevVal;
            if (valueId === 'vizPop') {
                currentVal = currentData.population;
                prevVal = prevData.population;
            } else if (valueId === 'vizGDP') {
                currentVal = currentData.gdp;
                prevVal = prevData.gdp;
            } else {
                currentVal = currentData.investment;
                prevVal = prevData.investment;
            }
            
            const trendEl = document.getElementById(trendId);
            if (currentVal > prevVal) {
                trendEl.textContent = '↗';
                trendEl.className = 'indicator-trend up';
            } else if (currentVal < prevVal) {
                trendEl.textContent = '↘';
                trendEl.className = 'indicator-trend down';
            } else {
                trendEl.textContent = '→';
                trendEl.className = 'indicator-trend stable';
            }
        }
    }

    // Update viz when year changes
    const originalDisplayEnergyStats = displayEnergyStats;
    displayEnergyStats = function(year) {
        originalDisplayEnergyStats(year);
        if (!mapVisualization.classList.contains('hidden')) {
            updateMapVisualization(year);
        }
        // Also update carousel charts
        updateMapVisualization(year);
    };
    
    // Initialize carousel with current year data
    updateMapVisualization(energyYearSelect.value);

    // ===== CAROUSEL FUNCTIONALITY =====
    // Carousel removed - using heatmap panel instead
    console.log('✓ Heatmap panel initialized');

    // ============ HEATMAP VISUALIZATION ============
    console.log('🔥 CHECKPOINT: About to initialize heatmap...');
    console.log('Initializing heatmap...');
    console.log('countryBorders available:', !!window.countryBorders);
    console.log('tunisiaEnergyData available:', !!window.tunisiaEnergyData);
    
    let heatmapActive = false;
    let heatmapEntities = []; // Store heatmap entities for easy removal

    const metricSelect = document.getElementById('metricSelect');
    const toggleHeatmapBtn = document.getElementById('toggleHeatmapBtn');
    const heatmapOpacitySlider = document.getElementById('heatmapOpacitySlider');
    const heatmapLegend = document.getElementById('heatmapLegend');
    const heatmapOpacityValue = document.getElementById('heatmapOpacityValue');
    const heatmapYear = document.getElementById('heatmapYear');
    
    console.log('✓ Heatmap year selector loaded from HTML with', heatmapYear?.options.length || 0, 'options');
    
    // REALISTIC GOVERNORATE POPULATION WEIGHTING (Based on 2023 census data)
    // Ranges from 0 (very sparse rural areas) to 1 (major urban centers like Tunis, Sfax)
    const governorateWeighting = {
        'Tunis': 0.95,           // Capital city - highest density
        'Sfax': 0.85,            // 2nd largest city - high energy consumption
        'Ariana': 0.82,          // Greater Tunis, developed
        'Ben Arous': 0.78,       // Greater Tunis, industrial
        'Sousse': 0.75,          // Major coastal city - tourism + industry
        'Monastir': 0.72,        // Coastal city with industry
        'Bizerte': 0.68,         // Northern port city
        'Nabeul': 0.62,          // Coastal tourist area
        'Kairouan': 0.58,        // Interior city - moderate development
        'Manouba': 0.55,         // Semi-urban, part of greater Tunis
        'Gafsa': 0.52,           // Interior city - phosphate mining
        'Médenine': 0.42,        // South, sparse population
        'Gabès': 0.48,           // Coastal but less developed
        'Mahdia': 0.45,          // Coastal, modest development
        'Jendouba': 0.38,        // North interior - rural
        'Sidi Bouzid': 0.35,     // Central interior - agricultural
        'Siliana': 0.32,         // North interior - rural
        'Kef': 0.30,             // North interior - very rural
        'Tataouine': 0.28,       // Far south - very sparse
        'Tozeur': 0.25,          // Desert oasis - sparse
        'Kébili': 0.22,          // Desert - minimal development
        'Kasserine': 0.20,       // Interior - underdeveloped
        'Béja': 0.18,            // North - agricultural/rural
        'Zaghouan': 0.15         // North mountains - very sparse
    };
    
    // Algeria wilaya weighting (major concentration in north)
    const algeriaWilayaWeighting = {
        'Alger': 0.95,          // Capital - massive concentration
        'Oran': 0.80,           // 2nd largest city
        'Blida': 0.75,          // Near Algiers - industrial
        'Annaba': 0.70,         // Eastern port city
        'Constantine': 0.68,    // Eastern interior - major city
        'Kabylie': 0.60,        // Northern interior
        'Tiaret': 0.42,         // Central plateau
        'Sétif': 0.55,          // Central-north
        'Tebessa': 0.35,        // East - sparse
        'Batna': 0.38,          // Saharan interior
        'Ouargla': 0.30,        // Sahara oil hub
        'Adrar': 0.15,          // Far south - very sparse
        'Tamanrasset': 0.12,    // Southern Sahara - minimal
        'Béchar': 0.18,         // Southwest desert
        'Saïda': 0.25,          // Southwest
        'El-Bayadh': 0.20,      // Interior plateau
        'Laghouat': 0.22,       // Saharan north
        'Mascara': 0.32,        // Northwest
        'Aïn Defla': 0.40,      // Northwest - agricultural
        'Ain Temouchent': 0.35, // Northwest
        'Relizane': 0.38,       // Northwest
        'Mostaganem': 0.48,     // Coastal northwest
        'Chlef': 0.45,          // Coastal
        'Tlemcen': 0.42,        // Northwest interior
        'Saoura': 0.14,         // Far south Sahara
        'Illizi': 0.10,         // Extreme south Sahara
        'Djanet': 0.08,         // Extreme remote south
        'Skikda': 0.52,         // Coastal northeast
        'Guelma': 0.35,         // Northeast
        'Jijel': 0.38,          // Coastal north
        'El-Oued': 0.25,        // Saharan southeast
        'Tbessa': 0.30,         // Eastern Sahara
        'Médéa': 0.40,          // Central
        'M\'Sila': 0.28,        // Central Sahara
        'Ouled Djellal': 0.16,  // South-central Sahara
        'Touggourt': 0.24       // Southeast Sahara oasis
    };
    
    // Libya region weighting (concentrated on coast)
    const libyaRegionWeighting = {
        'Tripoli': 0.90,        // Capital - highest concentration
        'Benghazi': 0.75,       // 2nd city - eastern coast
        'Misrata': 0.65,        // Central coast
        'Al Bayda': 0.40,       // Eastern plateau
        'Derna': 0.35,          // Eastern coast
        'Tobruk': 0.28,         // Far east
        'Tarhuna': 0.22,        // Interior
        'Bani Walid': 0.18,     // Desert interior
        'Sirte': 0.25,          // Central coast
        'Sabha': 0.15,          // Deep south
        'Murzuq': 0.12,         // Fezzan south
        'Ghat': 0.08,           // Extreme south - Sahara
        'Zuetina': 0.20,        // Coastal
        'Jadida': 0.10          // Remote
    };
    
    // Morocco province weighting (north concentrated, south sparse)
    const moroccoProvinceWeighting = {
        'Casablanca': 0.92,     // Largest city - economic center
        'Fès': 0.78,            // Northern interior - major city
        'Marrakech': 0.72,      // Central - major tourist hub
        'Rabat': 0.85,          // Capital
        'Tangier': 0.75,        // Northern coast
        'Agadir': 0.68,         // Southern coast - tourism
        'Meknes': 0.70,         // Northern interior
        'Oujda': 0.55,          // Eastern border
        'Kenitra': 0.60,        // Central coast
        'Tétouan': 0.52,        // Northern coast
        'Salé': 0.72,           // Near Rabat
        'Khouribga': 0.48,      // Phosphate mining
        'Safi': 0.42,           // Coastal
        'Essaouira': 0.45,      // Southwestern coast
        'Béni Mellal': 0.50,    // Central interior
        'Azrou': 0.32,          // Central mountains
        'Ifrane': 0.28,         // Mountain resort
        'Moulay Idris': 0.25,   // Historical interior
        'Chaouen': 0.38,        // Northern mountains
        'Al Hoceima': 0.35,     // Northern coast
        'Nador': 0.48,          // Eastern coast
        'Guercif': 0.22,        // East interior
        'Jerada': 0.20,         // East mineral area
        'Taza': 0.40,           // Northeast
        'Taouz': 0.15,          // South Sahara
        'Erfoud': 0.18,         // South oasis
        'Errachidia': 0.22,     // South interior
        'Midelt': 0.25,         // South interior
        'Tinerhir': 0.20,       // South valley
        'Ouarzazate': 0.30,     // South tourism
        'Taroudannt': 0.35,     // South
        'Sidi Ifni': 0.15,      // Far south coast
        'Guelmim': 0.20,        // Far south
        'Tan-Tan': 0.12,        // Extreme south
        'Laayoune': 0.25,       // Disputed - western coast
        'Dakhla': 0.18          // Disputed - far south
    };
    
    console.log('Heatmap UI elements:', { metricSelect, toggleHeatmapBtn, heatmapOpacitySlider });

    // Tunisia boundary coordinates (approximate)
    const tunisiaCoords = {
        minLat: 30.2,
        maxLat: 37.5,
        minLon: 8.0,
        maxLon: 11.5
    };

    function getHeatmapColor(normalizedValue) {
        // normalizedValue: 0 = green (low), 1 = red (high)
        if (normalizedValue < 0.5) {
            // Green to Yellow
            const t = normalizedValue * 2;
            return Cesium.Color.fromCssColorString(`rgb(${Math.round(t * 255)}, 255, 0)`);
        } else {
            // Yellow to Red
            const t = (normalizedValue - 0.5) * 2;
            return Cesium.Color.fromCssColorString(`rgb(255, ${Math.round((1-t) * 255)}, 0)`);
        }
    }

    function generateHeatmap(metric) {
        console.log('🗺️ Generating multi-country heatmap for metric:', metric);
        
        // Remove existing heatmap
        heatmapEntities.forEach(entity => {
            viewer.entities.remove(entity);
        });
        heatmapEntities = [];
        
        // Get selected countries
        const selectedCountries = [];
        const countryCheckboxes = ['tunisiaCheck', 'algeriaCheck', 'moroccoCheck', 'libyaCheck'];
        countryCheckboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox && checkbox.checked) {
                selectedCountries.push(checkbox.getAttribute('data-country'));
            }
        });
        
        if (selectedCountries.length === 0) {
            console.warn('❌ No countries selected');
            alert('Please select at least one country to display heatmap');
            return;
        }

        const heatmapYear = document.getElementById('heatmapYear')?.value || 
                           document.getElementById('energyYear')?.value || 2025;
        const selectedYear = parseInt(heatmapYear);
        
        const comparisonStats = [];
        
        // Process each selected country
        selectedCountries.forEach(country => {
            console.log(`Processing heatmap for: ${country}`);
            
            let governoratesData, countryEnergyData, weighting, borderColor;
            
            // Get country-specific data
            if (country === 'tunisia') {
                governoratesData = window.tunisiaGovernoratesData;
                countryEnergyData = window.tunisiaEnergyData;
                weighting = governorateWeighting;
                borderColor = Cesium.Color.RED;
            } else if (country === 'algeria') {
                governoratesData = window.algeriaWilayasData;
                countryEnergyData = window.algeriaEnergyData;
                weighting = algeriaWilayaWeighting;
                borderColor = Cesium.Color.LIME;
            } else if (country === 'libya') {
                governoratesData = window.libyaRegionsData;
                countryEnergyData = window.libyaEnergyData;
                weighting = libyaRegionWeighting;
                borderColor = Cesium.Color.ORANGE;
            } else if (country === 'morocco') {
                governoratesData = window.moroccoProvincesData;
                countryEnergyData = window.moroccoEnergyData;
                weighting = moroccoProvinceWeighting;
                borderColor = Cesium.Color.GREEN;
            }
            
            if (!governoratesData || !countryEnergyData) {
                console.warn(`❌ Data not available for ${country}`);
                return;
            }
            
            // Get year data (historical or prediction)
            let yearData = countryEnergyData.find(d => d.year == selectedYear);
            
            // If not found and year is after 2025, check predictions
            if (!yearData && selectedYear > 2025 && window.energyPredictor) {
                const predictions = window.energyPredictor.getPredictions(country);
                yearData = predictions.find(d => d.year == selectedYear);
            }
            
            if (!yearData) {
                console.warn(`❌ No data for ${country} in year ${selectedYear}`);
                return;
            }
            
            const value = yearData[metric];
            if (value === undefined) {
                console.warn(`❌ Metric ${metric} not found for ${country}`);
                return;
            }
            
            // Find min/max for normalization
            let minVal = Infinity, maxVal = -Infinity;
            countryEnergyData.forEach(data => {
                const val = data[metric];
                if (val !== undefined) {
                    minVal = Math.min(minVal, val);
                    maxVal = Math.max(maxVal, val);
                }
            });
            
            // Also check predictions
            if (window.energyPredictor) {
                const predictions = window.energyPredictor.getPredictions(country);
                predictions.forEach(data => {
                    const val = data[metric];
                    if (val !== undefined) {
                        minVal = Math.min(minVal, val);
                        maxVal = Math.max(maxVal, val);
                    }
                });
            }
            
            const normalizedValue = (value - minVal) / (maxVal - minVal);
            
            // Add to comparison stats
            const countryName = getCountryName(country);
            comparisonStats.push({
                country: countryName,
                value: value.toFixed(2),
                normalized: (normalizedValue * 100).toFixed(1),
                minVal: minVal.toFixed(2),
                maxVal: maxVal.toFixed(2)
            });
            
            console.log(`✓ ${country}: value=${value}, normalized=${normalizedValue}`);
            
            // Render heatmap for this country
            const opacity = (heatmapOpacitySlider.value / 100) * 0.5;
            
            governoratesData.features.forEach((feature, idx) => {
                try {
                    const geometry = feature.geometry;
                    const props = feature.properties || {};
                    const name = props.NAME_1 || props.name || `Region ${idx}`;
                    
                    if (!geometry || !geometry.coordinates) return;
                    
                    let coordinates = [];
                    if (geometry.type === 'Polygon') {
                        coordinates = geometry.coordinates[0];
                    } else if (geometry.type === 'MultiPolygon') {
                        const areas = geometry.coordinates.map(polygon => {
                            const ring = polygon[0];
                            let area = 0;
                            for (let i = 0; i < ring.length - 1; i++) {
                                area += (ring[i + 1][0] - ring[i][0]) * (ring[i + 1][1] + ring[i][1]);
                            }
                            return Math.abs(area / 2);
                        });
                        const maxIndex = areas.indexOf(Math.max(...areas));
                        coordinates = geometry.coordinates[maxIndex][0];
                    } else {
                        return;
                    }
                    
                    const cartesianCoords = coordinates.map(coord => 
                        Cesium.Cartesian3.fromDegrees(coord[0], coord[1])
                    );
                    
                    if (cartesianCoords.length < 3) return;
                    
                    // Use REALISTIC population weighting
                    const weightValue = weighting[name] || 0.3;
                    const intensityFactor = Math.pow(weightValue, 0.85);
                    const govNormalizedValue = Math.max(0, Math.min(1, normalizedValue * intensityFactor + (weightValue - 0.5) * 0.15));
                    
                    const color = getHeatmapColor(govNormalizedValue);
                    
                    // Get population data for this region
                    let populationData = {};
                    if (country === 'tunisia' && window.tunisiaPopulationData) {
                        populationData = window.tunisiaPopulationData[name] || {};
                    } else if (country === 'algeria' && window.algeriaPopulationData) {
                        populationData = window.algeriaPopulationData[name] || {};
                    } else if (country === 'libya' && window.libyaPopulationData) {
                        populationData = window.libyaPopulationData[name] || {};
                    } else if (country === 'morocco' && window.moroccoPopulationData) {
                        populationData = window.moroccoPopulationData[name] || {};
                    }
                    
                    const entity = viewer.entities.add({
                        name: `heatmap_${country}_${name}`,
                        description: name,
                        polygon: {
                            hierarchy: new Cesium.PolygonHierarchy(cartesianCoords),
                            material: color.withAlpha(opacity),
                            outline: false
                        },
                        properties: {
                            country: country,
                            regionName: name,
                            populationData: populationData,
                            metricValue: govNormalizedValue,
                            energyValue: value,
                            selectedYear: selectedYear,
                            metric: metric
                        }
                    });
                    
                    heatmapEntities.push(entity);
                } catch (e) {
                    console.warn(`Error processing ${country} region ${idx}:`, e);
                }
            });
        });
        
        console.log(`✓ Heatmap created for ${selectedCountries.length} countries`);
        
        // Show comparison stats
        if (comparisonStats.length > 0) {
            const comparisonDiv = document.getElementById('heatmapComparisonStats');
            if (comparisonDiv) {
                comparisonDiv.innerHTML = '<strong style="color: #00ffff;">📊 Comparison Stats:</strong><br>';
                comparisonStats.forEach(stat => {
                    comparisonDiv.innerHTML += `<div style="margin: 4px 0; font-size: 10px;">
                        <strong>${stat.country}</strong>: ${stat.value} (${stat.normalized}% of range)<br/>
                    </div>`;
                });
                comparisonDiv.style.display = 'block';
            }
        }
        
        // Show legend
        if (heatmapLegend) {
            heatmapLegend.style.display = 'block';
        }
        
        // Update governorate values list
        updateGovernorateValuesList(selectedCountries, metric, selectedYear);
    }

    // Update governorate values list display
    function updateGovernorateValuesList(selectedCountries, metric, year) {
        const listPanel = document.getElementById('governorateValuesList');
        const listContent = document.getElementById('governorateListContent');
        const listTitle = document.getElementById('governorateListTitle');
        const listCount = document.getElementById('governorateListCount');
        
        if (!listPanel || !listContent) return;
        
        // Only show for single country selection
        if (selectedCountries.length !== 1) {
            listPanel.style.display = 'none';
            return;
        }
        
        const country = selectedCountries[0];
        let governoratesData, countryEnergyData, weighting;
        
        // Get country-specific data
        if (country === 'tunisia') {
            governoratesData = window.tunisiaGovernoratesData;
            countryEnergyData = window.tunisiaEnergyData;
            weighting = governorateWeighting;
        } else if (country === 'algeria') {
            governoratesData = window.algeriaWilayasData;
            countryEnergyData = window.algeriaEnergyData;
            weighting = algeriaWilayaWeighting;
        } else if (country === 'libya') {
            governoratesData = window.libyaRegionsData;
            countryEnergyData = window.libyaEnergyData;
            weighting = libyaRegionWeighting;
        } else if (country === 'morocco') {
            governoratesData = window.moroccoProvincesData;
            countryEnergyData = window.moroccoEnergyData;
            weighting = moroccoProvinceWeighting;
        }
        
        if (!governoratesData || !countryEnergyData) return;
        
        // Get year data
        let yearData = countryEnergyData.find(d => d.year == year);
        if (!yearData && year > 2025 && window.energyPredictor) {
            const predictions = window.energyPredictor.getPredictions(country);
            yearData = predictions.find(d => d.year == year);
        }
        
        if (!yearData) return;
        
        const value = yearData[metric];
        if (value === undefined) return;
        
        // Calculate normalized values for all regions
        let minVal = Infinity, maxVal = -Infinity;
        countryEnergyData.forEach(data => {
            const val = data[metric];
            if (val !== undefined) {
                minVal = Math.min(minVal, val);
                maxVal = Math.max(maxVal, val);
            }
        });
        
        const normalizedValue = (value - minVal) / (maxVal - minVal);
        
        // Collect all governorate values
        const governorateValues = [];
        governoratesData.features.forEach((feature, idx) => {
            const props = feature.properties || {};
            const name = props.NAME_1 || props.name || `Region ${idx}`;
            const weightValue = weighting[name] || 0.3;
            const intensityFactor = Math.pow(weightValue, 0.85);
            const govNormalizedValue = Math.max(0, Math.min(1, normalizedValue * intensityFactor + (weightValue - 0.5) * 0.15));
            const govValue = minVal + (govNormalizedValue * (maxVal - minVal));
            
            governorateValues.push({
                name: name,
                value: govValue,
                normalized: govNormalizedValue
            });
        });
        
        // Sort by value (descending)
        governorateValues.sort((a, b) => b.value - a.value);
        
        // Update title
        const countryName = getCountryName(country);
        const metricName = getMetricName(metric);
        listTitle.textContent = `${countryName} - ${metricName}`;
        listCount.textContent = `${governorateValues.length} regions`;
        
        // Build list HTML - Horizontal layout
        let html = '';
        governorateValues.forEach((gov, index) => {
            const color = getHeatmapColor(gov.normalized);
            const colorHex = `rgb(${Math.round(color.red * 255)}, ${Math.round(color.green * 255)}, ${Math.round(color.blue * 255)})`;
            
            html += `
                <div class="governorate-item" style="border-left: 3px solid ${colorHex}; background: rgba(${Math.round(color.red * 255)}, ${Math.round(color.green * 255)}, ${Math.round(color.blue * 255)}, 0.15);">
                    <span class="governorate-name">${gov.name}</span>
                    <span class="governorate-value">${gov.value.toFixed(2)}</span>
                </div>
            `;
        });
        
        listContent.innerHTML = html;
        listPanel.style.display = 'flex';
        listPanel.classList.add('show');
    }
    
    // Helper function to get country name
    function getCountryName(country) {
        const names = {
            'tunisia': '🇹🇳 Tunisia',
            'algeria': '🇩🇿 Algeria',
            'libya': '🇱🇾 Libya',
            'morocco': '🇲🇦 Morocco'
        };
        return names[country] || country;
    }
    
    // Helper function to get metric name
    function getMetricName(metric) {
        const names = {
            'population': 'Population',
            'gdp': 'GDP',
            'energyConsumption': 'Energy Consumption',
            'oilProduction': 'Oil Production',
            'gasProduction': 'Gas Production',
            'electricityProduction': 'Electricity Production',
            'renewableShare': 'Renewable Share %',
            'co2Emissions': 'CO2 Emissions',
            'investment': 'Energy Investment'
        };
        return names[metric] || metric;
    }
    
    // Helper function to format numbers
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(2) + 'K';
        }
        return num.toFixed(2);
    }

    // Populate heatmap year selector (DEPRECATED - now done inline at startup)
    function populateHeatmapYearSelector() {
        // This function is now deprecated - year population happens inline during initialization
        const heatmapYear = document.getElementById('heatmapYear');
        if (!heatmapYear || heatmapYear.options.length > 0) return; // Only populate if empty
        
        console.log('🔄 Legacy populateHeatmapYearSelector called - populating...');
        
        heatmapYear.innerHTML = '';
        
        // Add historical years (2000-2025)
        for (let year = 2000; year <= 2025; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year + (year >= 2024 ? '*' : '');
            heatmapYear.appendChild(option);
        }
        
        // Add prediction years (2026+)
        for (let year = 2026; year <= 2035; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year + ' [AI]';
            option.style.color = '#00ffff';
            option.style.fontWeight = 'bold';
            heatmapYear.appendChild(option);
        }
        
        heatmapYear.value = 2025;
    }
    
    // Display population data when clicking on a heatmap region
    function displayPopulationInfo(entity) {
        if (!entity || !entity.properties) return;
        
        const regionName = entity.properties.regionName;
        const populationData = entity.properties.populationData;
        const selectedYear = entity.properties.selectedYear;
        const year = selectedYear.toString();
        
        const populationPanel = document.getElementById('populationInfoPanel');
        const regionNameEl = document.getElementById('populationRegionName');
        const yearEl = document.getElementById('populationYear');
        const valueEl = document.getElementById('populationValue');
        
        if (populationPanel) {
            regionNameEl.textContent = regionName || 'Unknown Region';
            yearEl.textContent = `Year: ${selectedYear}`;
            
            if (populationData && populationData[year]) {
                const population = populationData[year];
                const formattedPop = population.toLocaleString();
                valueEl.textContent = `Population: ${formattedPop}`;
                valueEl.style.color = '#00ff00';
            } else {
                valueEl.textContent = 'Population: Data not available';
                valueEl.style.color = '#ff9999';
            }
            
            populationPanel.style.display = 'block';
        }
    }
    
    // Add mouse click handler for heatmap regions
    function setupHeatmapClickHandler() {
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        
        handler.setInputAction(function(click) {
            const pickedObject = viewer.scene.pick(click.position);
            
            if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.properties && 
                pickedObject.id.properties.hasOwnProperty('regionName')) {
                displayPopulationInfo(pickedObject.id);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    
    // Initialize on load
    console.log('🔥 Setting up heatmap UI...');
    
    // Check if elements exist - but DON'T return (that exits initializeApp entirely!)
    if (!metricSelect) {
        console.error('❌ metricSelect not found - heatmap will not work');
    }
    if (!toggleHeatmapBtn) {
        console.error('❌ toggleHeatmapBtn not found - heatmap will not work');
    }
    if (!heatmapOpacitySlider) {
        console.warn('⚠️ heatmapOpacitySlider not found');
    }
    
    if (metricSelect && toggleHeatmapBtn) {
        console.log('✓ All heatmap elements found - attaching listeners');
    
    // Country checkbox event listeners
    document.querySelectorAll('#countryMultiSelect input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            console.log('Country selection changed');
            if (heatmapActive) {
                generateHeatmap(metricSelect.value);
            }
        });
    });

    if (toggleHeatmapBtn) {
        toggleHeatmapBtn.addEventListener('click', () => {
        console.log('🟥 Heatmap button clicked');
        heatmapActive = !heatmapActive;
        
        if (heatmapActive) {
            toggleHeatmapBtn.classList.add('active');
            toggleHeatmapBtn.textContent = '❌ Hide Heatmap';
            console.log('🔴 Showing heatmap for metric:', metricSelect.value);
            try {
                generateHeatmap(metricSelect.value);
                setupHeatmapClickHandler(); // Enable click interactions for population data
            } catch (e) {
                console.error('❌ Error generating heatmap:', e);
                heatmapActive = false;
                toggleHeatmapBtn.classList.remove('active');
                toggleHeatmapBtn.textContent = '✅ Show Heatmap';
            }
        } else {
            toggleHeatmapBtn.classList.remove('active');
            toggleHeatmapBtn.textContent = '✅ Show Heatmap';
            console.log('Hiding heatmap');
            heatmapEntities.forEach(entity => {
                viewer.entities.remove(entity);
            });
            heatmapEntities = [];
            heatmapLegend.style.display = 'none';
            const comparisonStats = document.getElementById('heatmapComparisonStats');
            if (comparisonStats) comparisonStats.style.display = 'none';
            const populationPanel = document.getElementById('populationInfoPanel');
            if (populationPanel) populationPanel.style.display = 'none';
        }
        });
    } else {
        console.error('❌ toggleHeatmapBtn not found - cannot attach click handler');
    }

    if (metricSelect) {
        metricSelect.addEventListener('change', () => {
            console.log('Metric changed to:', metricSelect.value);
            if (heatmapActive) {
                generateHeatmap(metricSelect.value);
            }
        });
    }

    // Heatmap year change handler
    const heatmapYearSelect = document.getElementById('heatmapYear');
    if (heatmapYearSelect) {
        heatmapYearSelect.addEventListener('change', () => {
            console.log('Heatmap year changed to:', heatmapYearSelect.value);
            if (heatmapActive) {
                generateHeatmap(metricSelect.value);
            }
        });
    }

    // Country checkbox change handlers
    const countryCheckboxIds = ['tunisiaCheck', 'algeriaCheck', 'moroccoCheck', 'libyaCheck'];
    countryCheckboxIds.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                console.log(`Country checkbox ${id} changed`);
                if (heatmapActive) {
                    generateHeatmap(metricSelect.value);
                }
            });
        }
    });

    if (heatmapOpacitySlider && heatmapOpacityValue) {
        heatmapOpacitySlider.addEventListener('input', () => {
            heatmapOpacityValue.textContent = heatmapOpacitySlider.value + '%';
            console.log('Opacity changed to:', heatmapOpacitySlider.value);
            if (heatmapActive) {
                generateHeatmap(metricSelect.value);
            }
        });
    }

    console.log('✓ Heatmap initialization complete');
    
    } else {
        console.error('❌ Heatmap elements not found - skipping initialization');
    }
    
    console.log('📌 initializeApp() COMPLETED');
    // Initialization complete — no automatic camera flyTo to preserve the configured start view
}

// Trigger initialization as soon as script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCesium);
} else {
    initializeCesium();
}



