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
  - Help modal (H key) displays all available shortcuts
- **Modal system** - Reusable modal component with:
  - Help modal for keyboard shortcuts reference
  - Contact modal with profile info and contact actions
  - Escape key and click-outside-to-close support
  - Backdrop blur effects
- **Animated background system** - Grid-based animated background with:
  - Canvas-based character layer with interactive mouse tracking
  - Character propagation effects
  - Configurable layer system (ready for future layers)
- **Tools display component** - Visual tool icons/labels for portfolio items:
  - Config-driven tool definitions (`tools.json`)
  - Icon-only or label display modes
- **Unified gallery component** - Common `PortfolioGallery` component:
  - Supports both images and videos
  - Displays metadata (title, category, client, role, tools)
  - Reduces code duplication across portfolio sections
- **Componentized About page** - Modular components:
  - `ProfileAvatar` - Profile picture with hover effects
  - `ProfileInfo` - Name, headline, and social links
  - `ContactBlocks` - Reusable contact buttons
  - `BlogFeed` - RSS blog feed integration
- **Config-driven architecture** - easily modify content without touching code
- **Markdown content** - edit about page using Markdown
- **Profile page** with avatar (hover effects), social links, and blog feed
- **Contact features** - Email with copy-to-clipboard, resume view/download
- **Integrated music player** with playlist support and persistent volume/mute settings
- **Blog feed integration** via RSS
- **Vertical navigation arrows** - hover-based up/down navigation
- **Responsive design** with global breakpoint system:
  - Small desktop: `max-height: 950px`
  - Tablet: `max-height: 750px`
  - Mobile: `max-height: 500px`
  - Adaptive layouts, font sizes, and component sizing across all breakpoints
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
│   │   │   └── PortfolioGallery.svelte  # Unified gallery component
│   │   ├── About.svelte
│   │   ├── Header.svelte
│   │   ├── Modal.svelte    # Base modal component
│   │   ├── HelpModal.svelte
│   │   ├── ContactModal.svelte
│   │   ├── ToolsDisplay.svelte  # Tool icons/labels display
│   │   ├── ProfileAvatar.svelte
│   │   ├── ProfileInfo.svelte
│   │   ├── ContactBlocks.svelte
│   │   ├── BlogFeed.svelte
│   │   ├── AnimatedBackground.svelte
│   │   └── AnimatedBackgroundCharacterLayer.svelte
│   │   └── ...
│   ├── config/              # Configuration files (JSON)
│   │   ├── nav.json         # Navigation items
│   │   ├── portfolio.json   # Portfolio sections
│   │   ├── profile.json     # Site profile
│   │   ├── socials.json     # Social media links
│   │   ├── tools.json       # Tool definitions (icons/labels)
│   │   ├── site.json        # Site metadata and preload config
│   │   └── assets.json      # Asset URL configuration
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

### Tools Configuration

Edit `src/config/tools.json` to define tool icons and labels used in portfolio items:

```json
{
  "graphic-tablet": {
    "icon": "/img/tools/graphic-tablet.png",
    "label": "Graphic Tablet"
  }
}
```

Tools are automatically displayed in portfolio galleries.

## Architecture

- **Component-based**: Svelte components with scoped styles and reactive state
- **State management**: Centralized stores for navigation, music player, and UI state
- **Modular utilities**: Reusable functions for navigation, animation, storage, etc.
- **IntersectionObserver**: Efficient scroll tracking and visibility detection
- **localStorage**: Persistent user preferences across sessions
- **Modal system**: Reusable modal component with shortcut integration
- **Unified gallery**: Common component for all portfolio sections (images/videos)
- **Global breakpoints**: Consistent responsive design system across components

## Development Notes

- Originally converted from PHP to modern Svelte + Vite stack
- Uses config-driven approach for easy content management
- Keyboard shortcuts available for navigation (arrow keys, Enter, etc.)
- Music player with playlist support and persistent settings
- Email addresses are obfuscated to prevent bot scraping
- Modal system supports three-tier shortcut priority (modal → screen → global)
- Animated background system is implemented but currently commented out in About page
- Global breakpoint system ensures consistent responsive behavior across all components

---
