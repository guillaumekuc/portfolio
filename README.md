# Portfolio Website

An interactive portfolio website showcasing creative work across 2D/3D art, music, and web development.

## Features

- **Start screen entry** - Press Enter to begin, with persistent volume/mute toggle
- **Full-page scrolling** with smooth navigation and keyboard shortcuts
- **Animated splashscreen** with parallax effects and hero section
- **Dynamic portfolio filtering** - Click categories (2D, 3D, Music, Dev, Quick Tour) to filter sections
  - Smooth transitions with overlay curtain effect
  - Sections dynamically show/hide based on selected category
- **Interactive portfolio sections** with multiple content types:
  - Video galleries with auto-pause on scroll away
  - Image carousels (Slick)
  - Music playlists with dedicated keyboard shortcuts
- **Comprehensive keyboard shortcuts system** with three-tier priority (modal → screen → global)
  - Global music controls: Space (play/pause), Q/D (prev/next), Z/S (vol up/down), M (mute), L (loop)
  - Navigation: Arrow keys for scrolling between sections
  - Context-aware shortcuts per screen
- **Config-driven architecture** - easily modify content without touching code
- **Markdown content** - edit about page using Markdown
- **Profile page** with avatar (hover effects), social links, and blog feed
- **Contact features** - Email with copy-to-clipboard, resume view/download
- **Integrated music player** with playlist support and persistent volume/mute settings
- **Blog feed integration** via RSS
- **Vertical navigation arrows** - hover-based up/down navigation
- **Responsive design** with optimized breakpoints for all devices
- **Landscape orientation constraint** - Portrait mode displays rotate-device overlay (best viewed horizontally)
- **Performance optimized** with lazy loading and deferred content loading
- **Email obfuscation** for bot protection

## Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Production files will be in the `dist/` directory.

### Optional: Optimize Images

```bash
npm run optimize:images
```

## Tech Stack

### Core
- **Svelte 4.2** - Reactive UI framework
- **Vite 5.0** - Build tool and dev server

### Libraries
- **Marked 12.0** - Markdown parser for content
- **jQuery 3.7** - DOM manipulation (used by Slick carousel)
- **Slick Carousel 1.8** - Image carousel functionality

### Dev Tools
- **Sharp 0.33** - Image optimization
- **Prettier 3.6** - Code formatting

## Project Structure

```
portfolio/
├── src/
│   ├── components/          # Svelte components
│   │   ├── portfolioSections/  # Portfolio content sections
│   │   ├── About.svelte
│   │   ├── Header.svelte
│   │   └── ...
│   ├── config/              # Configuration files (JSON)
│   │   ├── nav.json         # Navigation items
│   │   ├── portfolio.json   # Portfolio sections
│   │   ├── profile.json     # Site profile
│   │   └── socials.json     # Social media links
│   ├── content/             # Markdown content
│   │   └── about.md
│   ├── utils/               # Utility modules
│   ├── stores.js            # Svelte stores
│   └── App.svelte           # Root component
├── public/                  # Static assets
│   ├── img/
│   ├── vid/
│   └── sound/
└── index.html
```

## Configuration

### Navigation

Edit `src/config/nav.json` to modify navigation items:

```json
{
  "id": "3d",
  "label": "3D",
  "type": "internal",
  "target": "portfolio-3d",
  "icon": { "src": "/img/nav/3D.png", "alt": "3D" }
}
```

### Portfolio Sections

Edit `src/config/portfolio.json` to configure portfolio sections and categories.

### Content

Edit `src/content/about.md` to update the about page content using Markdown.

### Profile Information

Edit `src/config/profile.json` for name, headline, location, etc.

### Social Links

Edit `src/config/socials.json` to configure social media links.

## Architecture

- **Component-based**: Svelte components with scoped styles and reactive state
- **State management**: Centralized stores for navigation, music player, and UI state
- **Modular utilities**: Reusable functions for navigation, animation, storage, etc.
- **IntersectionObserver**: Efficient scroll tracking and visibility detection
- **localStorage**: Persistent user preferences across sessions

## Development Notes

- Originally converted from PHP to modern Svelte + Vite stack
- Uses config-driven approach for easy content management
- Keyboard shortcuts available for navigation (arrow keys, Enter, etc.)
- Music player with playlist support and persistent settings
- Email addresses are obfuscated to prevent bot scraping

---

For detailed development history and changelog, see [CHANGELOG.md](CHANGELOG.md)
