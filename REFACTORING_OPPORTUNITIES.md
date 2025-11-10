# Refactoring Opportunities: Code Repetition Analysis

This document identifies repetitive code patterns that could be extracted into reusable utilities or shared components.

## 1. DOM Navigation Utilities (High Priority)

### `nextVisibleSibling` and `previousVisibleSibling` Functions
**Duplicated in:**
- `src/components/VerticalClickNav.svelte` (lines 8-32)
- `src/components/Header.svelte` (lines 6-17) - only `nextVisibleSibling`
- `src/scripts.js` (lines 415-439)
- `src/components/Rubrics.svelte` (lines 23-39) - similar logic in `goToFolios`

**Recommendation:** Extract to `src/utils/domNavigation.js`

```javascript
// Proposed utility
export function nextVisibleSibling(element) {
  let nextVisibleElement;
  let nextElement = element.nextElementSibling;
  while (nextElement) {
    if (!nextElement.classList.contains('hidden')) {
      nextVisibleElement = nextElement;
      break;
    }
    nextElement = nextElement.nextElementSibling;
  }
  return nextVisibleElement;
}

export function previousVisibleSibling(element) {
  let previousVisibleElement;
  let previousElement = element.previousElementSibling;
  while (previousElement) {
    if (!previousElement.classList.contains('hidden')) {
      previousVisibleElement = previousElement;
      break;
    }
    previousElement = previousElement.previousElementSibling;
  }
  return previousVisibleElement;
}
```

---

## 2. Rubric Class Mapping (High Priority)

### `updateRubricClass` Function
**Duplicated in:**
- `src/components/Rubrics.svelte` (lines 7-15)
- `src/scripts.js` (lines 280-286)

**Recommendation:** Extract to `src/utils/rubricUtils.js` or `src/stores.js`

```javascript
// Proposed utility
export function getRubricClass(focused) {
  const mapping = {
    1: "folio3D",
    2: "folio2D",
    3: "folioAll",
    4: "folioMusic",
    5: "folioWeb"
  };
  return mapping[focused] || "folioAll";
}
```

---

## 3. Folio Visibility Management (High Priority)

### `hideIrrelevantFolios` Function
**Similar logic in:**
- `src/components/Rubrics.svelte` (lines 17-21)
- `src/components/Header.svelte` (lines 19-41) - in `sortHeaderNav` function
- `src/scripts.js` (lines 409-413)
- `src/components/Head.svelte` (lines 14-16) - hides all folios

**Pattern:**
```javascript
document.querySelectorAll('.folio').forEach(folio => folio.classList.add('hidden'));
document.querySelectorAll('.' + rubricClass).forEach(folio => folio.classList.remove('hidden'));
```

**Recommendation:** Extract to `src/utils/folioUtils.js`

```javascript
export function hideAllFolios() {
  document.querySelectorAll('.folio').forEach(folio => folio.classList.add('hidden'));
}

export function showFoliosByClass(rubricClass) {
  hideAllFolios();
  document.querySelectorAll(`.${rubricClass}`).forEach(folio => folio.classList.remove('hidden'));
}
```

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

## 5. Current Screen Subscription Pattern (Medium Priority)

### Repeated Store Subscription
**In `src/components/VerticalClickNav.svelte`:**
- Lines 35-36: `currentScreen.subscribe(value => currentScreenValue = value)()`
- Lines 50-51: Same pattern
- Lines 61-62: Same pattern

**Recommendation:** Use Svelte's `get()` function or reactive statements

```javascript
import { get } from 'svelte/store';
// Then use: const currentScreenValue = get(currentScreen);
```

---

## 6. Mobile/Tablet Detection (Medium Priority)

### `mobileAndTabletCheck` Function
**Duplicated in:**
- `src/components/Rubrics.svelte` (lines 63-69)
- `src/scripts.js` (lines 878-883)

**Recommendation:** Extract to `src/utils/deviceUtils.js` and attach to `window` once

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
1. DOM Navigation Utilities (#1)
2. Rubric Class Mapping (#2)
3. Folio Visibility Management (#3)

### Medium Priority (Code Quality)
4. Focus Class Management (#4)
5. Current Screen Subscription (#5)
6. Mobile/Tablet Detection (#6)

### Low Priority (Nice to Have)
7. Link Styling Patterns (#7)
8. DOM Query Patterns (#8)
9. Music Playlist Focus (#9)
10. Arrow Button Styling (#10)

---

## Implementation Strategy

1. **Start with utilities** - Create `src/utils/` directory and extract pure functions first
2. **Update components incrementally** - Refactor one component at a time
3. **Test after each refactor** - Ensure functionality remains intact
4. **Update scripts.js last** - It's the most complex file with many interdependencies

