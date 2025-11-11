# DOM Manipulation Refactoring Plan

## Overview
Replace direct `document.querySelector`/`querySelectorAll` calls with Svelte's reactive patterns: `bind:this`, reactive class bindings, and component props.

---

## 🎯 Strategy

1. **Use `bind:this`** for element references needed for imperative operations (scroll, focus, etc.)
2. **Use reactive class bindings** (`class:focus={condition}`) instead of manually adding/removing classes
3. **Use stores** for cross-component state instead of querying DOM
4. **Pass elements as props** or use context for cross-component access
5. **Keep querySelector only** for truly cross-component operations that can't be avoided

---

## 📋 Files to Refactor (Priority Order)

### 🔴 **Priority 1: Core Utilities**

#### 1. `src/utils/init.js` 
**Current Issues:**
- Returns 13+ DOM elements via `querySelector`
- Elements are queried before components mount
- Creates tight coupling between utilities and DOM structure

**Refactoring Plan:**
- **Remove `init.js` entirely** - it's an anti-pattern
- Components should use `bind:this` to get their own element references
- Pass element references via props or context when needed
- Music player should receive audio element via `bind:this` from component
- Update `scripts.js` to not use `Init.initScripts()`

**Changes:**
- `Music.init()` will accept element directly from component
- `Navigation` will receive element arrays from components
- Remove all `querySelector` calls from this file

**Impact:** High - affects initialization flow

---

#### 2. `src/utils/navigation.js`
**Current Issues:**
- 20+ `querySelector` calls
- Some are cross-component (acceptable), but many can be reactive
- `hideIrrelevantFolios()` manipulates DOM directly

**Refactoring Plan:**
- **Keep cross-component queries** (e.g., `#splashscreen`, `#rubrics`) - these are acceptable
- **Remove queries for elements in same component** - use `bind:this`
- **Create reactive store for folio visibility** instead of direct DOM manipulation
- `hideIrrelevantFolios()` should update a store, components react to it

**Changes:**
- Add `folioVisibility` store (Map of folio ID → visible boolean)
- Components react to store changes
- Keep queries for truly cross-component elements only

**Impact:** High - affects navigation system

---

### 🟡 **Priority 2: Component Files**

#### 3. `src/components/Rubrics.svelte`
**Current Issues:**
- `updateRubricFocus()` uses `querySelector` to add/remove `focus` class
- Queries header nav links (cross-component)
- Already has reactive `class:focus` binding but doesn't use it consistently

**Refactoring Plan:**
- **Remove `updateRubricFocus()` function** - reactive binding already handles this
- **Remove `allRubrics` querySelector** - not needed, reactive binding handles focus
- **Keep header nav query** - cross-component, acceptable
- Use reactive statement to sync header nav focus

**Changes:**
```javascript
// REMOVE:
allRubrics = document.querySelectorAll('.rubric');
allRubrics.forEach((rubric) => rubric.classList.remove('focus'));
const rubricElement = document.querySelector(idToFocus);

// KEEP (already working):
class:focus={rubricFocused === rubric.focused}
```

**Impact:** Medium - simplifies component logic

---

#### 4. `src/components/Websites.svelte`
**Current Issues:**
- `focusNextWebsite()` and `focusPreviousWebsite()` use `querySelectorAll` to manipulate classes
- Already has reactive `class:focus` binding but doesn't use it

**Refactoring Plan:**
- **Remove all `querySelectorAll` calls** for focus management
- **Use reactive binding** - already has `class:focus={websitesCurrentIndex === index}`
- **Remove manual class manipulation** - store update triggers reactivity

**Changes:**
```javascript
// REMOVE:
document.querySelectorAll('.websiteLink').forEach((link) => {
  link.classList.remove('focus');
});
const websiteLink = document.querySelectorAll('.websiteLink')[newIndex];
if (websiteLink) websiteLink.classList.add('focus');

// KEEP (already working):
class:focus={websitesCurrentIndex === index}
```

**Impact:** Low - already mostly reactive

---

#### 5. `src/components/VerticalClickNav.svelte`
**Current Issues:**
- `scrollToElement()` uses `querySelector` for scrolling
- `clickTopArrow()` and `clickBottomArrow()` query current screen element

**Refactoring Plan:**
- **Use `bind:this`** for screen elements in parent component
- **Pass element references** via props or context
- **Alternative:** Use reactive scroll function that reads from store

**Changes:**
- Create `scrollToScreenId(screenId)` utility that uses store
- Or pass element references from parent via context
- Remove `scrollToElement()` function

**Impact:** Medium - affects navigation UX

---

#### 6. `src/components/Header.svelte`
**Current Issues:**
- `handleHeaderNavClick()` uses `querySelector` for `#rubrics`
- `handleTitleClick()` uses `querySelector` for `#splashscreen`

**Refactoring Plan:**
- **Keep cross-component queries** - these are acceptable (different components)
- **OR** use context to pass element references
- **OR** use scroll utility that works with IDs from store

**Changes:**
- Keep as-is (acceptable cross-component query)
- OR create `scrollToScreen(screenId)` utility

**Impact:** Low - acceptable pattern

---

#### 7. `src/components/About.svelte`
**Current Issues:**
- `handleBackToTop()` uses `querySelector` for `#splashscreen`
- `scrollContentUp/Down()` use `querySelector` for `.scrollThis`

**Refactoring Plan:**
- **Use `bind:this`** for `.scrollThis` element
- **Keep `#splashscreen` query** - cross-component, acceptable
- **OR** use scroll utility

**Changes:**
```javascript
let scrollThisElement;
// Then use: scrollThisElement.scrollTop
```

**Impact:** Low - simple fix

---

#### 8. `src/components/Head.svelte`
**Current Issues:**
- `handleEnter()` uses multiple `querySelector` calls for animation elements
- These are cross-component (splashscreen elements)

**Refactoring Plan:**
- **Keep cross-component queries** - acceptable for animation system
- **OR** pass element references via props/context from Splashscreen component
- **OR** use `bind:this` in Splashscreen and expose via context

**Changes:**
- Keep as-is (acceptable for cross-component animation)
- OR refactor animation system to accept element refs

**Impact:** Low - acceptable pattern

---

#### 9. `src/components/Footer.svelte`
**Current Issues:**
- `onMount()` uses `querySelector` for `#bgMusic`
- Already uses `bind:this` for sliders (good!)

**Refactoring Plan:**
- **Use `bind:this`** for audio element
- **Pass audio element** to music player via context or props
- Remove querySelector from onMount

**Changes:**
```javascript
let bgMusicElement;
// Pass to music player via context
```

**Impact:** Medium - affects music player initialization

---

### 🟢 **Priority 3: Keep As-Is (Acceptable Patterns)**

#### 10. `src/components/Folios.svelte`
**Status:** ✅ **SKIP** - jQuery/slick initialization (user requested to ignore)

---

## 🔧 Implementation Strategy

### Phase 1: Remove `init.js` Anti-Pattern
1. Update components to use `bind:this` for their elements
2. Pass element references via context or props
3. Update `Music` and `Navigation` classes to accept elements directly
4. Remove `Init.initScripts()` from `scripts.js`

### Phase 2: Reactive Class Management
1. Remove manual `classList.add/remove` calls
2. Ensure all components use `class:focus={condition}` pattern
3. Update stores to drive class changes reactively

### Phase 3: Element References
1. Add `bind:this` to elements that need imperative access
2. Pass references via context for cross-component access
3. Remove unnecessary `querySelector` calls

### Phase 4: Scroll Utilities
1. Create reactive scroll utility that uses stores
2. Replace `querySelector` + `scrollIntoView` with utility
3. Keep cross-component queries only where necessary

---

## 📊 Expected Results

### Before:
- 109+ `querySelector` calls
- Tight coupling between utilities and DOM
- Manual class management
- Elements queried before mount

### After:
- ~20-30 `querySelector` calls (only cross-component)
- Components manage their own elements
- Reactive class bindings
- Elements available after mount via `bind:this`

---

## ⚠️ Breaking Changes

1. **`init.js` will be removed** - all callers must be updated
2. **`Music.init()` signature changes** - now accepts element directly
3. **`Navigation` constructor changes** - receives arrays differently
4. **Component initialization order** - elements must be bound before passing to utilities

---

## 🧪 Testing Strategy

1. Test music player initialization with `bind:this`
2. Test navigation scrolling with reactive utilities
3. Test focus management with reactive bindings
4. Verify cross-component queries still work
5. Test component unmounting/cleanup

---

## 📝 Files to Modify

### Delete:
- `src/utils/init.js` (after refactoring)

### Modify:
1. `src/scripts.js` - Remove `Init.initScripts()` usage
2. `src/utils/music.js` - Accept element directly
3. `src/utils/navigation.js` - Accept arrays directly, add folio visibility store
4. `src/components/Rubrics.svelte` - Remove manual focus management
5. `src/components/Websites.svelte` - Remove manual focus management
6. `src/components/VerticalClickNav.svelte` - Use element refs
7. `src/components/Header.svelte` - Keep as-is or use utility
8. `src/components/About.svelte` - Use `bind:this` for scroll element
9. `src/components/Head.svelte` - Keep as-is (acceptable)
10. `src/components/Footer.svelte` - Use `bind:this` for audio
11. `src/stores.js` - Add folio visibility store

---

## ✅ Success Criteria

- [ ] `init.js` removed
- [ ] No `querySelector` in component logic (only utilities for cross-component)
- [ ] All focus management uses reactive bindings
- [ ] All element references use `bind:this`
- [ ] Music player receives element via binding
- [ ] Navigation uses stores for folio visibility
- [ ] Components are self-contained
- [ ] No breaking changes to functionality

---

## 🚀 Ready to Proceed?

This plan will:
- ✅ Remove 80+ unnecessary DOM queries
- ✅ Make components more reactive
- ✅ Improve maintainability
- ✅ Follow Svelte best practices
- ✅ Keep cross-component queries where necessary

**Estimated time:** 4-6 hours of focused work

