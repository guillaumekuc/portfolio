# Portfolio Website

A modern portfolio website built with Vite, showcasing creative work.

## Local Development Setup

### Prerequisites
- Node.js (16.x or higher recommended)
- npm or yarn
- Git

### Getting Started

1. Clone the repository (if working with remote):
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The site will be available at `http://localhost:3000`

4. Build for production:
   ```bash
   npm run build
   ```
   
   The built files will be in the `dist/` directory.

5. Preview production build:
   ```bash
   npm run preview
   ```

### Project Structure

- `index.html` - Main HTML entry point
- `src/` - Source files
  - `main.js` - Main entry point that initializes the Svelte app
  - `App.svelte` - Root Svelte component
  - `components/` - Svelte component modules
    - `Head.svelte`, `Header.svelte`, `Footer.svelte`, etc. - Layout components
    - `portfolioSections/` - Portfolio section components (full-page sections containing portfolio items)
    - `Rubrics.svelte` - Categories navigation component
  - `scripts.js` - Initialization script (~50 lines)
  - `stores.js` - Svelte stores for state management
  - `utils/` - Utility modules
    - `music.js` - Music player functionality
    - `navigation.js` - Navigation controller
    - `dom.js` - DOM utilities
    - `shortcuts.js` - Keyboard shortcut system
    - `animation.js` - Animation utilities
    - `init.js` - Initialization logic
    - And more...
- `public/` - Static assets (images, videos, sounds)
  - `img/` - Image assets
  - `vid/` - Video assets
  - `sound/` - Audio assets
  - `slick/` - Slick carousel assets
- `vite.config.js` - Vite configuration
- `package.json` - Node.js dependencies and scripts

### Architecture

The project uses **Svelte** framework with a modern component-based architecture:
- Components are `.svelte` files with reactive state management
- State management via Svelte stores (`src/stores.js`)
- Component lifecycle hooks (`onMount`, `onDestroy`) for proper cleanup
- Modular utility functions in `src/utils/` directory
- Vite handles bundling, hot module replacement, and asset optimization
- All assets are served from the `public/` directory

### Notes

- The project was converted from PHP to a modern Svelte + Vite stack
- Large media files (videos, images) are tracked in git. Consider using Git LFS for large files if needed
- For production deployment, use `npm run build` and serve the `dist/` directory

---

## Recent Development Recap

### Major Transformation (November 10, 2025)

The project underwent a complete architectural overhaul, migrating from a PHP-based monolithic structure to a modern Svelte + Vite application.

### Key Achievements

#### 1. **Framework Migration**
- Converted all components from PHP/template strings to **Svelte** components
- Removed 21 PHP component files
- Implemented proper component lifecycle and reactivity
- Built-in XSS protection through Svelte's templating

#### 2. **JavaScript Modularization**
- Reduced `scripts.js` from **1,117 lines to ~50 lines** (initialization only)
- Created modular utility system in `src/utils/`:
  - `music.js` - Music player functionality (436 lines)
  - `navigation.js` - Navigation controller
  - `dom.js` - DOM utilities
  - `shortcuts.js` - Keyboard shortcut system (142 lines)
  - `animation.js`, `loading.js`, `time.js`, `tooltip.js`, `debuglog.js` - Additional utilities
- Proper ES6 module structure with dependency injection

#### 3. **CSS Refactoring**
- Moved styles from global `styles.css` (1,790 lines) to component-scoped styles
- Each component now has its own `<style>` block
- Better organization and maintainability

#### 4. **State Management**
- Implemented Svelte stores (`src/stores.js`)
- Replaced global variables with reactive stores
- Improved reactivity across all components

#### 5. **Keyboard Shortcut System**
- Built comprehensive shortcut system with:
  - **Modal shortcuts** (highest priority)
  - **Screen-specific shortcuts** (scoped to sections)
  - **Global shortcuts** (always active)
- Migrated shortcuts to their respective components
- Added conflict prevention and scope management

### Naming Refactoring (Latest)

#### **Improved Code Clarity and Standards**
- **Terminology Updates:**
  - `rubrics` → `categories` - More intuitive terminology for portfolio categories
  - `folios` → `portfolioSections` - Clearer naming for full-page portfolio sections
  - Folder renamed: `components/folios/` → `components/portfolioSections/`
  
- **Abbreviated IDs Replaced:**
  - `rBtn1-5` → `categoryButton1-5` - Descriptive button IDs
  - `hnBtn1-5` → `headerNavButton1-5` - Clear header navigation button IDs
  - `L0-L5` → Descriptive link classes (`contactLink`, `blogLink`, `artstationLink`, etc.)

- **Method and Variable Names:**
  - `cartography` → `scrollTracking` - Standard terminology
  - `fakeHoverEvent` → `programmaticHover` - More accurate description
  - `sleekHandler` → `seekHandler` - Corrected typo
  - `menuSelected` → `selectedMenuItem` - More descriptive
  - `showNavClues` → `showNavigationHints` - Clearer intent

- **CSS Class Names:**
  - `folio3D`, `folio2D`, etc. → `portfolio-3d`, `portfolio-2d`, etc. - Consistent kebab-case
  - `scrollThis` → `scrollable` - Standard naming
  - `extraClass` → `additionalClass` - More descriptive
  - `folioWrapper` → `portfolioSectionWrapper` - Consistent with new terminology

- **Element IDs and Variables:**
  - `myPic` → `profilePicture`
  - `myDescription` → `aboutDescription`
  - `myHello` → `greeting`
  - `myMail` → `emailLink`
  - `oneLiner` → `tagline`

### Impact

The project is now significantly more maintainable with:
- **Better code organization** - Modular structure, easier to navigate
- **Modern stack** - Svelte + Vite instead of PHP
- **Improved code quality** - Separation of concerns, reusable utilities
- **Intuitive naming** - Standard terminology that's self-documenting
- **Better developer experience** - Proper reactivity, component lifecycle, clear naming
- **Comprehensive documentation** - Clear guides for future work
- **Multiple bug fixes** - Issues resolved throughout development

### Remaining Work

See `docs/MAINTAINABILITY_ANALYSIS.md` and `docs/CODE_QUALITY_ISSUES.md` for:
- CSS module organization
- ESLint/Prettier setup
- Testing framework integration
- Focus management utilities extraction
- jQuery dependency removal (still used for slick-carousel)

