# Population Data Guide - North Africa 3D Energy Map

## 📊 Available Population Data Files

### 1. Tunisia - 24 Governorates
**File**: `data/tunisia_population.csv`

#### Governorates with Population Data (2000-2025):
- **Tunis** (Capital Region) - 964,060 → 1,210,000
- **Ariana** - 363,630 → 620,000
- **Ben Arous** - 520,437 → 800,000
- **Manouba** - 338,655 → 520,000
- **Sfax** (Port City) - 804,878 → 1,120,000
- **Sousse** (Coastal City) - 517,018 → 790,000
- **Kairouan** - 570,445 → 700,000
- **Kasserine** - 423,788 → 520,000
- **Sidi Bouzid** - 328,387 → 400,000
- **Gafsa** - 373,398 → 420,000
- **Tozeur** (Desert Oasis) - 102,600 → 119,000
- **Kébili** - 151,300 → 200,000
- **Médénine** - 428,710 → 670,000
- **Tataouine** (Far South) - 219,621 → 270,000
- **Gabès** - 337,568 → 470,000
- **Mahdia** - 401,099 → 500,000
- **Monastir** - 532,397 → 760,000
- **Nabeul** - 726,157 → 1,080,000
- **Zaghouan** - 168,575 → 206,000
- **Bizerte** (North Coast) - 533,269 → 780,000
- **Jendouba** - 383,433 → 455,000
- **Béja** - 315,088 → 365,000
- **Siliana** - 224,168 → 262,000

**Total Population 2025**: ~13 million people

---

### 2. Algeria - 48 Wilayas (Provinces)
**File**: `data/algeria_population.csv`

#### Major Wilayas with Population Data (2000-2025):
- **Alger** (Capital) - 2,168,000 → 3,650,000
- **Oran** (Western Port) - 1,500,000 → 2,400,000
- **Constantine** (Eastern City) - 944,701 → 1,400,000
- **Sétif** (Interior) - 1,539,968 → 1,940,000
- **Tizi Ouzou** (Kabylie) - 1,129,300 → 1,430,000
- **Blida** (Central) - 809,208 → 1,350,000
- **Annaba** (Northeast Coast) - 809,166 → 1,160,000
- **Batna** (Interior) - 1,144,155 → 1,540,000
- **Béjaïa** (Kabylie Coast) - 908,235 → 1,160,000
- **Biskra** (Sahara) - 715,081 → 1,120,000

**Plus 38 other wilayas with detailed population data**

**Total Population 2025**: ~48 million people

---

### 3. Libya - 13 Regions
**File**: `data/libya_population.csv`

#### Regions with Population Data (2000-2025):
- **Tripolitania** (Northwest - Capital region) - 1,800,000 → 3,800,000
- **Benghazi** (Northeast - 2nd largest city) - 850,000 → 1,760,000
- **Misrata** (Central Coast) - 400,000 → 1,000,000
- **Al Jabal Al Akhdar** (Green Mountains) - 350,000 → 525,000
- **Sebha** (South-Central) - 200,000 → 405,000
- **Derna** (Northeast Coast) - 150,000 → 250,000
- **Tobruk** (Northeast) - 120,000 → 190,000
- **Ghadames** (Southwest Oasis) - 50,000 → 92,000
- **Ghat** (Far Southwest) - 35,000 → 61,000
- **Ubari** (Southeast) - 45,000 → 87,000
- **Murzuq** (South) - 80,000 → 143,000
- **Awbari** (South-Central) - 60,000 → 119,000
- **Kufra** (Far Southeast) - 50,000 → 112,000

**Total Population 2025**: ~11 million people

---

### 4. Morocco - 12 Regions
**File**: `data/morocco_population.csv`

#### Regions with Population Data (2000-2025):
- **Casablanca-Settat** (Economic Hub) - 3,200,000 → 5,700,000
- **Fes-Meknes** (Central North) - 1,800,000 → 2,720,000
- **Rabat-Salé-Kénitra** (Capital region) - 2,100,000 → 3,780,000
- **Marrakech-Safi** (South-Central) - 1,600,000 → 2,870,000
- **Souss-Massa** (South Coast) - 1,400,000 → 2,450,000
- **Tanger-Tétouan-Al Hoceïma** (North) - 800,000 → 1,510,000
- **Oriental** (Northeast) - 700,000 → 1,240,000
- **Drâa-Tafilalet** (Sahara South) - 600,000 → 965,000
- **Béni Mellal-Khénifra** (Interior) - 900,000 → 1,410,000
- **Guelmim-Oued Noun** (Southwest) - 350,000 → 620,000
- **Laâyoune-Sakia El Hamra** (Sahrawi region) - 200,000 → 510,000
- **Dakhla-Oued Ed-Dahab** (Far South) - 150,000 → 440,000

**Total Population 2025**: ~33 million people

---

## 📈 How to Use Population Data

### 1. **View Population by Clicking on Regions**
   - Enable "Show Heatmap" button
   - Click on any governorate/region on the map
   - See population data for selected year in the "Population Data 👥" panel

### 2. **Year Selection**
   - Use the "Year:" dropdown to select different years (2000-2025)
   - Population changes are tracked showing growth over time

### 3. **Data Format in CSV**
   ```
   governorate,2000,2005,2010,2015,2020,2025
   Tunis,964060,1020000,1085000,1150000,1180000,1210000
   ```

### 4. **Integration with Energy Heatmap**
   - Population data is used as weighting factor for heatmap visualization
   - More populated areas show more intense heatmap colors
   - Realistic representation of energy distribution patterns

---

## 📍 Data Coverage Summary

| Country | Regions | Years | Data Type |
|---------|---------|-------|-----------|
| **Tunisia** | 24 governorates | 2000-2025 | Historical + Projected |
| **Algeria** | 48 wilayas | 2000-2025 | Historical + Projected |
| **Libya** | 13 regions | 2000-2025 | Historical + Projected |
| **Morocco** | 12 regions | 2000-2025 | Historical + Projected |

**Total**: ~97 regions across 4 countries | 26 years of data

---

## 🔍 Data Quality Notes

✅ **High Confidence Data**:
- Major urban centers (Tunis, Algiers, Casablanca, Benghazi, Tripoli)
- Well-documented regions with census data
- Years 2000-2020 based on official census data

⚠️ **Projected Data**:
- Years 2021-2025 are calculated projections
- Based on growth rates from 2000-2020 period
- Assumed stable growth patterns

---

## 🎯 Accessing Population Data in Code

```javascript
// Tunisia population data
window.tunisiaPopulationData['Tunis']['2025']  // Returns: 1210000

// Algeria population data
window.algeriaPopulationData['Alger']['2025']  // Returns: 3650000

// Libya population data
window.libyaPopulationData['Tripolitania']['2025']  // Returns: 3800000

// Morocco population data
window.moroccoPopulationData['Casablanca-Settat']['2025']  // Returns: 5700000
```

---

## 🌐 External Data Sources

If you want to update or add more detailed data:

1. **Tunisia**: Institut National de la Statistique (INS)
   - www.ins.tn

2. **Algeria**: Office National des Statistiques (ONS)
   - www.ons.dz

3. **Libya**: Libyan Bureau of Statistics
   - www.bsc.ly

4. **Morocco**: Haut-Commissariat au Plan (HCP)
   - www.hcp.ma

5. **UN World Population Prospects**
   - https://population.un.org/

---

## 📊 Feature: Click to See Population

**How it works:**
1. Activate heatmap with "Show Heatmap" button
2. Click any region/governorate on the map
3. Population info appears in the "Population Data 👥" panel showing:
   - Region name
   - Selected year
   - Population count (formatted with thousands separator)

**Example**: Click on Tunis governorate → Shows "Population: 1,210,000" for year 2025

---

Generated: October 2025
Last Updated: With energy heatmap visualization system
