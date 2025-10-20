# Bottom Visualization Carousel Guide

## Overview

The map visualization has been moved from a toggleable panel to a beautiful carousel at the bottom of the webpage. The visualizations now display **one at a time** with smooth transitions and transparent styling.

## Features

### 🎠 Carousel Display
- **4 Visualization Cards** displayed sequentially:
  1. **Energy Production** - Bar chart showing Oil, Gas, and Electricity production
  2. **Renewable Transition** - Donut chart showing renewable energy percentage
  3. **Energy Balance** - Bar chart showing consumption, imports, and exports
  4. **Economic Indicators** - Population, GDP, and Investment metrics

- **Transparent Design** - No dark containers, cards blend seamlessly with the background
- **Auto-Play** - Automatically advances to the next card every 5 seconds
- **One Card at a Time** - Only one visualization visible at any moment

### 🎮 Navigation Controls

#### Navigation Buttons
- **◀ (Previous)** - Go to previous slide
- **▶ (Next)** - Go to next slide
- **Dots** - Click any dot to jump to that specific slide

#### Auto-Play Features
- **Auto-advance**: Automatically cycles through all 4 cards every 5 seconds
- **Pause on Hover**: Stops auto-play when you hover over the carousel
- **Resume on Leave**: Resumes auto-play when you move mouse away
- **Manual Control**: Any button/dot click resets the 5-second timer

#### Keyboard Shortcuts
- **→ (Right Arrow)** - Next slide
- **← (Left Arrow)** - Previous slide

### 📊 Chart Updates
- **Real-time Updates**: Charts automatically update when you change the year or country in the left panel
- **Data Sync**: All carousel data stays synchronized with the selected country and year

## Layout

```
┌─────────────────────────────────────────────────────────┐
│                    3D CESIUM MAP                         │
│                                                          │
│  [Left Panel - Controls]                                │
│  - Country Selection                                    │
│  - Year Selection                                       │
│  - Stats Cards                                          │
├─────────────────────────────────────────────────────────┤
│                   CAROUSEL (Bottom)                      │
│                                                          │
│         [Current Visualization Card]                    │
│         (Energy Production / Renewable / etc)           │
│                                                          │
│  [◀]  [●  ○  ○  ○]  [▶]                               │
│  Prev   Dots Controls   Next                            │
└─────────────────────────────────────────────────────────┘
```

## Styling

### Transparent Design
- Background: Fully transparent, lets map show through
- Cards: No dark containers or boxes
- Charts: Display with clean cyan (#00ffff) text
- Smooth fade-in animation when switching cards

### Colors
- **Primary Text**: Cyan (#00ffff) with glow effect
- **Secondary Text**: Light gray (#94a3b8)
- **Accents**: Cyan with 0.3+ opacity for interactive elements
- **Trends**: Green for positive (↗), Red for negative (↘), Gray for stable (→)

### Responsive
- Adapts to any screen width
- Charts scale appropriately
- Touch-friendly button sizes
- Works on desktop and tablet

## Technical Details

### HTML Structure
```html
<div id="vizCarousel" class="viz-carousel">
    <div class="carousel-container">
        <div class="carousel-track">
            <div class="carousel-card"> ... </div>
            <div class="carousel-card"> ... </div>
            <!-- etc -->
        </div>
    </div>
    <div class="carousel-controls">
        <!-- Navigation buttons and dots -->
    </div>
</div>
```

### CSS Classes
- `.viz-carousel` - Main container
- `.carousel-track` - Animated container (translates on slide change)
- `.carousel-card` - Individual slide
- `.carousel-controls` - Navigation area
- `.carousel-btn` - Navigation buttons
- `.dot` - Slide indicator dots (add `.active` class)

### JavaScript
- **updateCarouselPosition()** - Updates slide position and active dot
- **nextSlide()** - Move to next card
- **prevSlide()** - Move to previous card
- **goToSlide(index)** - Jump to specific slide
- **startAutoPlay()** - Begin auto-advance timer
- **resetAutoPlay()** - Reset 5-second timer

### Auto-Play Configuration
```javascript
autoPlayInterval = setInterval(() => {
    nextSlide();
}, 5000); // Change this value to adjust auto-play speed (milliseconds)
```

## Customization

### Change Auto-Play Speed
Edit line in `script.js`:
```javascript
}, 5000); // Change 5000 to your desired milliseconds
```

### Disable Auto-Play
Comment out in `script.js`:
```javascript
// startAutoPlay(); // Disable auto-play
```

### Change Number of Slides
1. Update `totalSlides` constant in `script.js`
2. Add/remove `.carousel-card` elements in HTML
3. Add/remove `.dot` elements and update `data-slide` attributes

### Modify Slide Order
Reorder the `.carousel-card` divs in HTML (within `.carousel-track`)

## Removed Features

### What Changed
- ✅ **Removed**: "Show Map Visualization" button (was in left panel)
- ✅ **Removed**: Toggle functionality for showing/hiding visualization
- ✅ **Removed**: Old visualization panel header with close button
- ✅ **Changed**: Visualization location moved to bottom of page
- ✅ **Changed**: Display style changed to transparent, one-at-a-time carousel

### What Stayed the Same
- ✅ Chart rendering functions (drawBarChart, drawDonutChart)
- ✅ Data calculation and update logic
- ✅ Country and year synchronization
- ✅ Trend calculations
- ✅ All numerical data and metrics

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile Browsers**: Supported (landscape view recommended)

## Performance Notes

- Carousel uses CSS `transform` for smooth animations (GPU accelerated)
- Auto-play uses `setInterval` (can be optimized with `requestAnimationFrame` if needed)
- Charts are drawn only when updating visualization
- Memory efficient: Only 1 active slide rendered at a time

## Troubleshooting

### Carousel not showing?
- Check that `#vizCarousel` element exists in HTML
- Verify CSS file is loaded
- Check console for JavaScript errors

### Charts not rendering?
- Ensure canvas elements have correct IDs (productionChart, renewableChart, balanceChart)
- Verify chart contexts are initialized
- Check that energy data is loaded in window variables

### Auto-play not working?
- Check if `startAutoPlay()` is being called
- Verify `setInterval` is not being immediately cleared
- Check console for errors

### Navigation buttons not working?
- Verify button IDs match HTML (`carouselPrev`, `carouselNext`)
- Check that event listeners are attached
- Ensure `nextSlide()` and `prevSlide()` functions exist

## Updates & Enhancements

### Future Ideas
- [ ] Swipe gesture support for touch devices
- [ ] Keyboard pagination (1-4 keys)
- [ ] Mini preview thumbnails
- [ ] Slide transition effects (fade, slide, scale)
- [ ] Chart animation on slide change
- [ ] Export chart images as PNG/SVG
- [ ] Tooltip information on hover
