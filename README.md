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
  - `main.js` - Main entry point that assembles components
  - `components/` - Component modules (converted from PHP)
    - `Head.js`, `Header.js`, `Footer.js`, etc. - Layout components
    - `folios/` - Portfolio item components
  - `scripts.js` - JavaScript functionality
  - `styles.css` - Main stylesheet
- `public/` - Static assets (images, videos, sounds)
  - `img/` - Image assets
  - `vid/` - Video assets
  - `sound/` - Audio assets
  - `slick/` - Slick carousel assets
- `vite.config.js` - Vite configuration
- `package.json` - Node.js dependencies and scripts

### Architecture

The project uses a component-based architecture with ES6 modules:
- Components are JavaScript modules that return HTML strings
- Components can import and use other components
- Vite handles bundling, hot module replacement, and asset optimization
- All assets are served from the `public/` directory

### Notes

- The project was converted from PHP to use Vite for modern development workflow
- Large media files (videos, images) are tracked in git. Consider using Git LFS for large files if needed
- For production deployment, use `npm run build` and serve the `dist/` directory

