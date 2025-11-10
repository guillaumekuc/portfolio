# Refactoring Opportunities: Code Repetition Analysis

This document identifies repetitive code patterns that could be extracted into reusable utilities or shared components.

---

## 4. Focus Class Management (Medium Priority)

### Repeated Focus Toggle Patterns
**Found 58+ occurrences across:**
- `src/components/Header.svelte`
- `src/scripts.js` (47 occurrences)
- `src/components/Rubrics.svelte`
- `src/components/folios/Websites.svelte`

**Common patterns:**
```javascript
// Remove focus from all, then add to one
document.querySelectorAll(".headerNav a").forEach(link => link.classList.remove('focus'));
document.querySelector(target).classList.add('focus');

// Similar for rubrics
allRubrics.forEach(rubric => rubric.classList.remove('focus'));
document.querySelector(idToFocus).classList.add('focus');

// Similar for splashNav
document.querySelectorAll('.splashNav a').forEach(link => link.classList.remove('focus'));
document.querySelector('#worksBtn').classList.add('focus');
```

**Recommendation:** Extract to `src/utils/focusUtils.js`

```javascript
export function setFocus(selector, focusSelector) {
  document.querySelectorAll(selector).forEach(el => el.classList.remove('focus'));
  const target = typeof focusSelector === 'string' 
    ? document.querySelector(focusSelector) 
    : focusSelector;
  if (target) target.classList.add('focus');
}
```

---

## 5. Mobile/Tablet Detection (Medium Priority)

### `mobileAndTabletCheck` Function
**Current location:** `src/utils/navigation.js` (lines 342-348)

**Recommendation:** Extract to `src/utils/deviceUtils.js` for better organization

```javascript
export function isMobileOrTablet() {
  // ... detection logic
}

// Initialize once
if (typeof window !== 'undefined' && !window.mobileAndTabletCheck) {
  window.mobileAndTabletCheck = isMobileOrTablet;
}
```

---

## 7. Link Styling Patterns (Low Priority)

### Similar CSS for Links Component
**In:**
- `src/components/SplashLinks.svelte` (lines 18-60)
- `src/components/HeaderLinks.svelte` (lines 17-37)

Both use the `Links.svelte` component but have similar styling patterns:
- Similar `:global(a)` styles
- Similar hover effects (`background-color: var(--shadePop)`)
- Similar image sizing

**Recommendation:** Consider creating a shared link container component or CSS utility class

---

## 8. DOM Query Patterns (Low Priority)

### Repeated QuerySelector Patterns
**Found 20+ occurrences of `scrollIntoView` across 7 files**

**Common patterns:**
```javascript
document.querySelector('#splashscreen')?.scrollIntoView();
document.querySelector('#rubrics')?.scrollIntoView();
document.querySelector('#' + currentScreenValue);
```

**Also found 54+ occurrences of `querySelectorAll(...).forEach` pattern**

**Recommendation:** Create helper functions for common navigation targets

```javascript
// src/utils/navigation.js
export const navigationTargets = {
  splashscreen: () => document.querySelector('#splashscreen'),
  rubrics: () => document.querySelector('#rubrics'),
  // etc.
};

export function scrollToTarget(targetId) {
  const target = document.querySelector(`#${targetId}`);
  target?.scrollIntoView();
}

// Helper for common forEach patterns
export function forEachElement(selector, callback) {
  document.querySelectorAll(selector).forEach(callback);
}
```

---

## 9. Music Playlist Focus Management (Low Priority)

### Repeated Pattern in `src/scripts.js`
**Found multiple times:**
```javascript
document.querySelectorAll(".musicPlaylist li").forEach(function (track) {
  track.classList.remove('focus');
});
musicArray[musicCurrentIndex].classList.add('focus');
```

**Recommendation:** Use the focus utility from #4 above

---

## 10. Arrow Button Styling (Low Priority)

### Similar Styles in `VerticalClickNav.svelte`
**Lines 109-154:** `.topArrow` and `.bottomArrow` share most styles except positioning

**Recommendation:** Extract shared styles to a base class

```css
.arrow {
  position: fixed;
  left: calc((100% - 17px) / 2);
  transform: translateX(-50%);
  z-index: 100;
  color: var(--shadeWhite);
  background-color: var(--shade1);
  width: 4vh;
  min-width: 25px;
  height: 4vh;
  min-height: 25px;
  box-sizing: content-box;
  border: 7.5px solid var(--shade1);
  border-radius: 7.5px;
}

.topArrow {
  top: calc(2 * var(--safeMargin) + 2px);
}

.bottomArrow {
  bottom: calc(2 * var(--safeMargin) + 2px);
  margin-bottom: 2px;
}
```

---

## Priority Summary

### High Priority (Immediate Impact)
✅ ~~1. DOM Navigation Utilities (#1)~~ - **COMPLETED**: Extracted to `src/utils/dom.js`
✅ ~~2. Rubric Class Mapping (#2)~~ - **COMPLETED**: Extracted to `src/utils/navigation.js` as `Navigation.getRubricClass()`
✅ ~~3. Folio Visibility Management (#3)~~ - **COMPLETED**: Extracted to `src/utils/navigation.js` as `Navigation.hideIrrelevantFolios()`

### Medium Priority (Code Quality)
4. Focus Class Management (#4)
✅ ~~5. Current Screen Subscription (#5)~~ - **COMPLETED**: Components now use `get()` from svelte/store
6. Mobile/Tablet Detection (#6) - Partially done (in navigation.js, could be extracted to deviceUtils.js)

### Low Priority (Nice to Have)
7. Link Styling Patterns (#7)
8. DOM Query Patterns (#8)
9. Music Playlist Focus (#9)
10. Arrow Button Styling (#10)

---

## Implementation Strategy

✅ **Progress Update:**
- ✅ `src/utils/` directory created with multiple utility modules
- ✅ `scripts.js` has been refactored (now ~50 lines, just initialization)
- ✅ Components have been updated to use utilities where applicable

**Remaining work:**
1. Extract focus management utilities (#4)
2. Extract mobile/tablet detection to deviceUtils.js (#6)
3. Consider extracting DOM query patterns (#8)
4. Apply focus utilities to music playlist (#9)

