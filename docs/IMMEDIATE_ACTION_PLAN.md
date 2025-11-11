# Immediate Action Plan - Top 5 Priorities

## 🎯 Quick Reference: What to Fix First

### 1. **Add Developer Tooling** (2-3 hours)
**Why:** Prevents bugs, enforces standards, improves DX

**Steps:**
```bash
# Install dependencies
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-svelte prettier eslint-config-prettier

# Create .eslintrc.cjs
# Create .prettierrc
# Add scripts to package.json: "lint", "format", "lint:fix"
```

**Impact:** Immediate code quality improvement, catches bugs early

---

### 2. **Remove Global State Pollution** (4-6 hours)
**Why:** Makes code testable, reduces coupling, enables proper DI

**Current Problem:**
- `window.musicPlayer` accessed in 8+ components
- Components can't be tested in isolation
- Unclear dependencies

**Solution:**
- Create `src/services/musicService.js` that exports the music player
- Use Svelte `setContext` in `App.svelte` to provide service
- Update all components to use `getContext` instead of `window.musicPlayer`

**Files to Update:**
- `src/scripts.js` - Remove `window.musicPlayer = musicPlayer`
- `src/components/Footer.svelte` - Use context
- `src/components/SplashSound.svelte` - Use context
- `src/components/folios/MusicPlaylistFolio.svelte` - Use context
- `src/components/Splashscreen.svelte` - Use context

**Impact:** Better testability, clearer dependencies, easier refactoring

---

### 3. **Add Basic Error Handling** (2-3 hours)
**Why:** Prevents silent failures, better UX

**Add to:**
- Music player initialization
- Audio playback operations
- Navigation scroll operations
- Slick carousel initialization

**Example:**
```javascript
// In music.js
play() {
  try {
    if (!this.bgMusicElement) {
      throw new Error('Music element not initialized');
    }
    this.bgMusicElement.play().catch(err => {
      console.error('Playback failed:', err);
      // Show user-friendly message
    });
  } catch (error) {
    console.error('Music play error:', error);
  }
}
```

**Impact:** Better debugging, user feedback, stability

---

### 4. **Fix Debug Mode Default** (5 minutes)
**Why:** Performance, console cleanliness

**Change:**
```javascript
// src/stores.js
config: {
  debug: writable(process.env.NODE_ENV === 'development')
}
```

**Impact:** No debug logs in production

---

### 5. **Add TypeScript Configuration** (1-2 hours)
**Why:** Type safety, better IDE support, catch errors early

**Steps:**
```bash
npm install -D typescript @typescript-eslint/parser
```

**Create `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "checkJs": true,
    "allowJs": true,
    "strict": false,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

**Impact:** Gradual migration path, immediate type checking for JS files

---

## 📅 Suggested Timeline

### Week 1
- **Day 1-2:** Add ESLint/Prettier, fix all linting errors
- **Day 3-4:** Remove global state, implement context API
- **Day 5:** Add error handling to critical paths

### Week 2
- **Day 1-2:** Add TypeScript config, start JSDoc annotations
- **Day 3-4:** Set up testing infrastructure, write first tests
- **Day 5:** Fix debug mode, add environment config

---

## 🔍 Code Smells to Address

### High Priority
1. **Global window access** - 62 instances of `window.*`
2. **Direct DOM queries** - 109+ `document.querySelector` calls
3. **No null checks** - Many operations assume elements exist
4. **Mixed patterns** - Imperative DOM + reactive Svelte

### Medium Priority
1. **Large components** - Footer.svelte (269 lines)
2. **Duplicate logic** - Music player access pattern repeated
3. **Hardcoded values** - Port, paths, etc.
4. **No cleanup** - Some event listeners may not be removed

---

## ✅ Definition of Done

Before considering the codebase "maintainable":

- [ ] ESLint configured and passing
- [ ] Prettier configured and formatting code
- [ ] No `window.*` globals for application state
- [ ] Error handling in critical paths
- [ ] TypeScript config with `checkJs: true`
- [ ] Basic test suite (10+ tests)
- [ ] Debug mode respects environment
- [ ] All components use context instead of globals
- [ ] Documentation for component props
- [ ] CI/CD pipeline with linting and tests

---

## 🚀 Quick Start Commands

Once tooling is added:

```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests (once added)
npm test

# Type check (once TypeScript added)
npm run type-check
```

---

## 📝 Notes

- Start with tooling (ESLint/Prettier) - it's the foundation
- Remove globals incrementally - one component at a time
- Add tests as you refactor - don't try to test everything at once
- TypeScript can be gradual - `checkJs: true` gives immediate benefits
- Document decisions as you make them

