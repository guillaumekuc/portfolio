# Keyboard Shortcut System

## Overview

The shortcut system allows components to register keyboard shortcuts with scope management. Shortcuts are registered at the component level but scoped to full-page sections.

## Architecture

### ShortcutRegistry (`src/utils/shortcuts.js`)

A singleton registry that manages two types of shortcuts:

1. **Global shortcuts** - Always active (e.g., music controls)
2. **Screen-specific shortcuts** - Active only when a full-page section is visible

### Priority Order

1. Global shortcuts (highest priority)
2. Screen-specific shortcuts

## Usage Examples

### Registering a Screen-Specific Shortcut

Components register shortcuts for their full-page section in `onMount` and clean up in `onDestroy`:

```javascript
import { onMount, onDestroy } from 'svelte';
import { shortcutRegistry } from '../utils/shortcuts.js';

onMount(() => {
  // Register shortcuts for this component's screen
  shortcutRegistry.registerScreen(
    'splashscreen',           // screenId (matches the full-page section ID)
    'ArrowDown',              // key
    (event) => {              // handler
      document.querySelector('#rubrics')?.scrollIntoView();
    },
    'splashscreen-down',      // unique id
    true                      // preventDefault (optional, default: true)
  );
});

onDestroy(() => {
  // Cleanup when component unmounts
  shortcutRegistry.unregisterScreen('splashscreen', 'splashscreen-down');
});
```

### Registering a Global Shortcut

Global shortcuts are registered once (typically in initialization code):

```javascript
import { shortcutRegistry } from '../utils/shortcuts.js';

// Register music shortcuts globally
shortcutRegistry.registerGlobal(
  'q',                                    // key
  () => window.musicPlayer?.previousTrackHandler(),  // handler
  'music-prev-track',                     // unique id
  true                                    // preventDefault (optional)
);
```

## Migration Plan

Move section-specific shortcuts from `navigation.js` to their respective components:

1. `handleSplashscreenNavigation` → `SplashNav.svelte` (screen: 'splashscreen')
2. `handleRubricsNavigation` → `Rubrics.svelte` (screen: 'rubrics')
3. `handleMusicPlaylistNavigation` → `MusicPlaylistFolio.svelte` (screen: 'musicPlaylistFolio')
4. `handleWebsitesNavigation` → `Websites.svelte` (screen: 'websitesFolio')
5. `startScreen` Enter handler → `Head.svelte` (screen: 'startScreen')
6. `about` Enter handler → `About.svelte` (screen: 'about')

Global shortcuts (music controls, arrow navigation) remain in `navigation.js` or can be moved to `music.js`.

## Benefits

- **Co-location**: Shortcuts live with their components
- **Conflict prevention**: System warns about conflicts
- **Scope management**: Screen-specific shortcuts only active when needed
- **Maintainability**: Easy to see what shortcuts a component has
- **Cleanup**: Automatic unregistration on component unmount

