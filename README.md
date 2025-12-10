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

6. Optimize images (optional):
   ```bash
   npm run optimize:images
   ```
   
   This script uses Sharp to optimize images in the configured directories, reducing file sizes while maintaining quality.

### Project Structure

- `index.html` - Main HTML entry point
- `src/` - Source files
  - `main.js` - Main entry point that initializes the Svelte app
  - `App.svelte` - Root Svelte component
  - `components/` - Svelte component modules
    - `Head.svelte`, `Header.svelte`, `Footer.svelte`, etc. - Layout components
    - `portfolioSections/` - Portfolio section components (full-page sections containing portfolio items)
    - `VerticalClickNav.svelte` - Vertical navigation arrows that appear on hover
    - `Splashscreen.svelte` - Initial splash screen with parallax effect
  - `config/` - Configuration files (JSON)
    - `nav.json` - Navigation items configuration (internal/external links, targets, icons)
    - `portfolio.json` - Portfolio sections configuration (components, categories)
    - `profile.json` - Site profile information
    - `socials.json` - Social media links configuration
  - `scripts.js` - Initialization script (~50 lines)
  - `stores.js` - Svelte stores for state management
  - `utils/` - Utility modules
    - `music.js` - Music player functionality
    - `navigation.js` - Navigation controller with IntersectionObserver
    - `dom.js` - DOM utilities including IntersectionObserver setup
    - `shortcuts.js` - Keyboard shortcut system
    - `animation.js` - Animation utilities
    - `performance.js` - Performance measurement utilities
    - `loading.js`, `time.js`, `tooltip.js`, `debuglog.js` - Additional utilities
- `optimize-images.js` - Image optimization script using Sharp
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
- **Config-driven architecture**: Navigation and portfolio sections are configured via JSON files in `src/config/`
- **IntersectionObserver API**: Used for scroll tracking, header/footer visibility, and video pause/play management
- Vite handles bundling, hot module replacement, and asset optimization
- All assets are served from the `public/` directory

### Notes

- The project was converted from PHP to a modern Svelte + Vite stack
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

#### 6. **Improved Code Clarity and Standards**
- **Terminology Updates**

### Recent Updates (Post-November 2025)

#### 7. **Performance Optimizations**
- **Lazy Loading Strategy**: All portfolio images use `loading="lazy"` attribute for deferred loading
- **Deferred Portfolio Loading**: Portfolio sections (~20MB of images) only load after user clicks "Enter" on splashscreen
- **Asset Size Optimization**: Image optimization script using Sharp library
- **CSS Spinner**: Replaced SVG preloader with pure CSS spinner for better performance
- **Performance Monitoring**: Added `performance.js` utility to measure and log page load times

#### 8. **Config-Driven Architecture**
- **Navigation System**: Navigation items are now configured in `src/config/nav.json`
  - Supports internal/external links
  - CTA (Call-to-Action) items can be prioritized
  - Header automatically filters and displays internal navigation items
- **Portfolio Configuration**: Portfolio sections defined in `src/config/portfolio.json`
  - Component mapping to Svelte components
  - Category-based filtering system
  - Dynamic visibility management via stores
- **Removed Rubrics Component**: Navigation now handles all filtering logic directly

#### 9. **IntersectionObserver Implementation**
- Replaced complex DOM ordering and z-index management with **IntersectionObserver API**
- Used for:
  - Header/footer visibility based on splashscreen intersection
  - Scroll tracking and current screen detection
  - Video pause/play when videos leave viewport
- More performant and reliable than scroll event listeners

#### 10. **Responsive Design Improvements**
- **Responsive Breakpoints**: Components adapt to different viewport heights
  - Small desktop (max-height: 950px)
  - Tablet (max-height: 750px)
  - Mobile (max-height: 500px)
- **Icon Collapse**: Navigation icons collapse on small screens for space saving
- **Spacing Rules**: CSS refactoring with consistent spacing variables
- **Splashscreen Responsiveness**: Improved responsive behavior for splashscreen and hero section

#### 11. **UI/UX Enhancements**
- **Header Redesign**: Simplified to single line, removed social links (moved to footer)
- **Vertical Click Navigation**: Added hover-based up/down arrows for navigation
- **External Link Indicators**: North-east arrows (↗) appear after external links
- **Scroll to Top Fix**: Fixed issue where scroll to top would get stuck
- **Splashscreen Parallax**: Added parallax effect to splashscreen background art
- **Removed Trackbar**: Simplified UI by removing trackbar component

#### 12. **Reactivity Improvements**
- **Reactive Portfolio Sections**: Portfolio sections now use Svelte reactivity instead of direct DOM manipulation
- **Store-Based Visibility**: Portfolio section visibility managed through Svelte stores
- **Better State Management**: Improved synchronization between navigation state and UI

### Impact

The project is now significantly more maintainable with:
- **Better code organization** - Modular structure, easier to navigate
- **Modern stack** - Svelte + Vite instead of PHP
- **Improved code quality** - Separation of concerns, reusable utilities
- **Intuitive naming** - Standard terminology that's self-documenting
- **Better developer experience** - Proper reactivity, component lifecycle, clear naming
- **Multiple bug fixes** - Issues resolved throughout development
- **Performance optimized** - Lazy loading, deferred asset loading, image optimization
- **Config-driven** - Easy to modify navigation and portfolio without touching code
- **Responsive** - Works well across all device sizes
- **Modern APIs** - Uses IntersectionObserver for efficient scroll tracking

