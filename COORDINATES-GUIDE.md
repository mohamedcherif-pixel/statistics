# How to Set Real Locations for Energy Facilities

## Current Energy Facilities in the Map:

| Facility Name | Type | Current Coordinates | How to Update |
|--------------|------|-------------------|---------------|
| Rades Power Plant | Gas | [10.2756, 36.7694] | Already accurate |
| Sousse Power Plant | Gas | [10.6411, 35.8256] | Already accurate |
| Ghannouch Power Plant | Gas | [10.0982, 33.8815] | Already accurate |
| Bizerte Refinery | Oil Refinery | [9.8739, 37.2744] | Already accurate |
| Miskar Gas Field | Gas Field | [11.2, 34.8] | Updated - offshore location |
| El Borma Oil Field | Oil Field | [9.2667, 31.6833] | Updated - precise location |
| Sidi Daoud Wind Farm | Wind | [10.9667, 37.0333] | Updated - precise location |
| Tozeur Solar Plant | Solar | [8.1339, 33.9197] | Already accurate |
| Tataouine Solar Project | Solar | [10.4517, 32.9297] | Already accurate |

## How to Find and Update Real Coordinates:

### Method 1: Google Maps (Easiest)

1. **Open Google Maps**: https://www.google.com/maps
2. **Search** for the facility (e.g., "Centrale électrique de Radès")
3. **Right-click** on the exact location
4. **Click** "What's here?"
5. **Copy coordinates** shown at bottom (e.g., "36.7694, 10.2756")
6. **IMPORTANT**: Swap the order! Google shows `latitude, longitude`, but we need `[longitude, latitude]`

**Example:**
- Google Maps shows: `36.7694, 10.2756`
- In your code use: `[10.2756, 36.7694]`

### Method 2: OpenStreetMap

1. Go to: https://www.openstreetmap.org
2. Search for the facility
3. Click on the location
4. Coordinates appear in the URL or right sidebar
5. Format: Already in [longitude, latitude] order

### Method 3: GPS Coordinates from Official Sources

- **STEG** (Tunisian Electricity & Gas Company): https://www.steg.com.tn
- **ETAP** (Tunisian Oil Activities Company): https://www.etap.com.tn
- **ANME** (National Agency for Energy Management): https://www.anme.nat.tn

## How to Add New Facilities:

Open `script.js` and find the `energyFacilities` array (around line 181), then add:

```javascript
{name: "New Facility Name", type: "Type", coords: [longitude, latitude], capacity: "XXX MW"},
```

### Available Types:
- `"Gas"` - Orange marker
- `"Oil Refinery"` - Red marker
- `"Gas Field"` - Dark Orange marker
- `"Oil Field"` - Dark Red marker
- `"Wind"` - Light Blue marker
- `"Solar"` - Gold marker

## Example: Adding a New Solar Farm

```javascript
const energyFacilities = [
    // ... existing facilities ...
    {name: "Kebili Solar Farm", type: "Solar", coords: [8.9694, 33.7047], capacity: "50 MW"},
];
```

## Tunisia Energy Infrastructure Reference:

### Major Power Plants:
1. **Rades A & B** - Natural gas, near Tunis
2. **Sousse** - Natural gas, central coast
3. **Ghannouch** - Natural gas, south near Gabès
4. **La Goulette** - Natural gas, Tunis area

### Oil & Gas Fields:
1. **El Borma** - Main oil field, southern desert
2. **Miskar** - Offshore gas field, Gulf of Gabès
3. **Adam** - Gas field, southern region
4. **Hasdrubal** - Offshore gas field

### Renewable Energy Projects:
1. **Sidi Daoud** - Wind farm, Cap Bon
2. **Bizerte** - Wind farm, northern Tunisia
3. **Tozeur** - Solar projects, southwest
4. **Tataouine** - Solar projects (TuNur), south
5. **Kebili** - Solar potential area

## Quick Tips:

✅ **Always test** after adding new coordinates
✅ **Format**: `[longitude, latitude]` - longitude comes FIRST
✅ **Range check**: 
   - Tunisia longitude: 7.5° to 11.6° East
   - Tunisia latitude: 30.2° to 37.5° North
✅ **Decimal precision**: Use 4 decimal places for accuracy (~10m precision)

## Need Help?

If a facility isn't showing up:
1. Check the coordinates are in the right order [lng, lat]
2. Make sure they're within Tunisia's boundaries
3. Verify the facility name is spelled correctly
4. Check the browser console (F12) for errors

---

Last Updated: October 2025
