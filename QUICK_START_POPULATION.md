# 🗺️ How to Use Population Data in Your Energy Map

## Quick Start

### Step 1: Open the Map
- Navigate to `http://localhost:8000`
- Wait for all data to load (you'll see console messages)

### Step 2: Enable the Heatmap
1. Scroll to the **"Data Heatmap 🔥"** panel on the left
2. Click the green **"Show Heatmap"** button
3. The map will display colored regions showing energy distribution

### Step 3: View Population Data
1. **Select a Year**: Use the "Year:" dropdown (2000-2025)
2. **Click on a Region**: Click any colored region on the map
3. **See Population Info**: A new panel appears with:
   - Region name
   - Selected year
   - Population count (formatted clearly)

### Example Flow
```
📌 Tunisia Map
  ↓
🟢 Click "Show Heatmap"
  ↓
📅 Select Year 2020
  ↓
🖱️ Click on "Tunis" region
  ↓
📊 Panel shows:
   - Tunis
   - Year: 2020
   - Population: 1,180,000
```

---

## 📊 Population Data Available

### Total Populations by Country (2025 estimates)
- 🇹🇳 **Tunisia**: ~13 million across 24 governorates
- 🇩🇿 **Algeria**: ~48 million across 48 wilayas  
- 🇱🇾 **Libya**: ~11 million across 13 regions
- 🇲🇦 **Morocco**: ~33 million across 12 regions

---

## 🎮 Interactive Features

| Action | Result |
|--------|--------|
| Select multiple countries | Compare heatmaps side-by-side |
| Change year | See how population/energy changed over time |
| Click on region | Display population for that year |
| Adjust opacity slider | Make heatmap more/less transparent |
| Select different metric | Switch between Population, GDP, Energy, etc. |

---

## 📁 Data Files Location

All population data is stored in the `/data` folder:

```
earth-3d-map/
├── data/
│   ├── tunisia_population.csv        ← 24 governorates
│   ├── algeria_population.csv        ← 48 wilayas
│   ├── libya_population.csv          ← 13 regions
│   └── morocco_population.csv        ← 12 regions
```

---

## 💾 CSV Format

Each CSV has this structure:

```csv
governorate,2000,2005,2010,2015,2020,2025
Tunis,964060,1020000,1085000,1150000,1180000,1210000
Sfax,804878,860000,920000,980000,1050000,1120000
```

**Columns:**
- `governorate`: Region name (matches GADM boundary names)
- `2000-2025`: Annual population estimates (numbers only, no commas)

---

## 🔧 For Developers

### Loading Population Data Automatically
```javascript
// Automatically loads when app starts
await loadPopulationData();
// Stores in: window.tunisiaPopulationData, etc.
```

### Accessing Population Data Programmatically
```javascript
// Get population for a region and year
const pop = window.tunisiaPopulationData['Tunis']['2025'];
console.log(pop); // 1210000

// Works with all 4 countries
window.algeriaPopulationData['Alger']['2020']    // 3300000
window.libyaPopulationData['Tripolitania']['2015'] // 2850000
window.moroccoPopulationData['Casablanca-Settat']['2010'] // 4050000
```

### Adding Click Handler for Populations
```javascript
// Automatically called when heatmap is enabled
setupHeatmapClickHandler();
// Displays population info when regions are clicked
```

---

## ⚠️ Notes

- **Data years**: 2000-2020 are historical census/official data
- **Projected years**: 2021-2025 are calculated from growth rates
- **Missing data**: Shows "Data not available" if region/year not found
- **Formatting**: Population numbers automatically formatted with thousands separators

---

## 🆘 Troubleshooting

**Population data not showing?**
- Check browser console (F12) for error messages
- Ensure `/data/` folder exists with CSV files
- Try refreshing the page

**Population panel not appearing after clicking?**
- Make sure heatmap is active (green button)
- Click directly on colored regions (not borders)
- Check if year is selected in dropdown

**CSV not loading?**
- Verify Python HTTP server is running: `python -m http.server 8000`
- Check file names match exactly (case-sensitive on Linux/Mac)
- Look for CORS errors in browser console

---

## 📞 Support

For detailed information, see: `POPULATION_DATA_GUIDE.md`

Need to add more years or regions? CSV format is simple to extend!

---

**Last Updated**: October 2025 | Version 1.0
