# How to Get Real GeoJSON Country Border Data

## Method 1: Using GitHub Repository (EASIEST)

### Step-by-step:

1. **Go to this GitHub repo:**
   ```
   https://github.com/datasets/geo-countries
   ```

2. **Download the GeoJSON file:**
   - Click on `data/countries.geojson`
   - Click "Raw" button
   - Right-click → Save As → `countries.geojson`

3. **Or use direct links for specific countries:**
   ```
   Tunisia: https://raw.githubusercontent.com/datasets/geo-countries/master/data/tn.geojson
   Algeria: https://raw.githubusercontent.com/datasets/geo-countries/master/data/dz.geojson
   Libya: https://raw.githubusercontent.com/datasets/geo-countries/master/data/ly.geojson
   Morocco: https://raw.githubusercontent.com/datasets/geo-countries/master/data/ma.geojson
   ```

## Method 2: Using Natural Earth Data (HIGH QUALITY)

### Step-by-step:

1. **Visit Natural Earth Data:**
   ```
   https://www.naturalearthdata.com/downloads/
   ```

2. **Choose resolution:**
   - 1:10m (High detail, large file) - Best for zoomed-in views
   - 1:50m (Medium detail) - Good balance
   - 1:110m (Low detail, small file) - Good for world view

3. **Download:**
   - Click "Cultural" → "Admin 0 - Countries"
   - Download the shapefile
   - Convert to GeoJSON using online tool: https://mapshaper.org/

4. **Convert Shapefile to GeoJSON:**
   - Go to https://mapshaper.org/
   - Upload the .shp file
   - Click "Export" → Choose "GeoJSON"
   - Download

## Method 3: Using Online GeoJSON APIs

### Direct API calls:

```javascript
// Fetch Tunisia border
fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/tn.geojson')
  .then(response => response.json())
  .then(data => {
    console.log(data); // This is your GeoJSON data
  });
```

## Method 4: Using Overpass API (OpenStreetMap)

### Query for Tunisia:

```
https://overpass-api.de/api/interpreter?data=[out:json];relation["ISO3166-1"="TN"]["admin_level"="2"];out geom;
```

## What GeoJSON Looks Like:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Tunisia",
        "iso_a2": "TN",
        "iso_a3": "TUN"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [10.4515, 36.8914],
            [10.4458, 36.8758],
            [10.4386, 36.8603],
            ... (many more coordinate pairs)
          ]
        ]
      }
    }
  ]
}
```

## How to Use in Your Project:

### Option A: Save as separate file

1. Download GeoJSON file
2. Save in your project folder as `countries.geojson`
3. Load in your script

### Option B: Embed in JavaScript

1. Copy the coordinates array
2. Paste directly in your script.js

### Option C: Fetch from CDN/GitHub

1. Use fetch API to load from online source
2. Parse and use in Cesium

## Example Implementation in Cesium:

```javascript
// Load GeoJSON file
fetch('countries.geojson')
  .then(response => response.json())
  .then(geojsonData => {
    // Add to Cesium viewer
    viewer.dataSources.add(Cesium.GeoJsonDataSource.load(geojsonData, {
      stroke: Cesium.Color.YELLOW,
      strokeWidth: 3,
      fill: Cesium.Color.YELLOW.withAlpha(0.1)
    }));
  });
```

## Recommended Approach for Your Project:

**Use the GitHub method** - it's the easiest and provides good quality data for all countries.

### Quick Links for North African Countries:

- **Tunisia GeoJSON:** https://raw.githubusercontent.com/datasets/geo-countries/master/data/tn.geojson
- **Algeria GeoJSON:** https://raw.githubusercontent.com/datasets/geo-countries/master/data/dz.geojson
- **Libya GeoJSON:** https://raw.githubusercontent.com/datasets/geo-countries/master/data/ly.geojson
- **Morocco GeoJSON:** https://raw.githubusercontent.com/datasets/geo-countries/master/data/ma.geojson

Just right-click these links → "Save Link As" to download!
