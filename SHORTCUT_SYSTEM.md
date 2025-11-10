# Keyboard Shortcut System

## Overview

The shortcut system allows components to register keyboard shortcuts with scope management. Shortcuts are registered at the component level but scoped to full-page sections.

## Architecture

### Shortcuts (`src/utils/shortcuts.js`)

A singleton registry that manages three types of shortcuts:

1. **Modal shortcuts** - Highest priority, active when a modal is open (e.g., startScreen)
2. **Screen-specific shortcuts** - Active only when a full-page section is visible
3. **Global shortcuts** - Always active (e.g., music controls)

### Priority Order

1. Modal shortcuts (highest priority - when active, all other shortcuts are blocked)
2. Screen-specific shortcuts
3. Global shortcuts

## Usage Examples

### Registering a Screen-Specific Shortcut

Components register shortcuts for their full-page section in `onMount` and clean up in `onDestroy`:

```javascript
import { onMount, onDestroy } from 'svelte';
import { shortcuts } from '../utils/shortcuts.js';

onMount(() => {
  // Register shortcuts for this component's screen
  shortcuts.addScreenShortcut(
    'splashscreen',           // screenId (matches the full-page section ID)
    'ArrowDown',              // key
    (event) => {              // handler
      document.querySelector('#rubrics')?.scrollIntoView();
    },
    true                      // preventDefault (optional, default: true)
  );
});

onDestroy(() => {
  // Cleanup when component unmounts
  shortcuts.removeScreenShortcuts('splashscreen');
});
```

### Registering a Global Shortcut

Global shortcuts are registered once (typically in initialization code):

```javascript
import { shortcuts } from '../utils/shortcuts.js';

// Register music shortcuts globally
shortcuts.addGlobalShortcut(
  'q',                                    // key
  () => window.musicPlayer?.handleKeyboardShortcut('q'),  // handler
  'music-prev',                           // unique id
  true                                    // preventDefault (optional)
);
```

### Registering a Modal Shortcut

Modal shortcuts have the highest priority and block all other shortcuts when active:

```javascript
import { onMount, onDestroy } from 'svelte';
import { shortcuts } from '../utils/shortcuts.js';

onMount(() => {
  shortcuts.addModalShortcut(
    'startScreen',            // modalId
    'Enter',                  // key
    () => {                   // handler
      // Handle Enter key
    },
    true                      // preventDefault (optional)
  );
});

onDestroy(() => {
  shortcuts.removeModalShortcuts('startScreen');
});
```

## Migration Status

✅ **Migration Complete** - All section-specific shortcuts have been moved to their respective components:

1. ✅ `SplashNav.svelte` - Registers shortcuts for 'splashscreen' screen
2. ✅ `Rubrics.svelte` - Registers shortcuts for 'rubrics' screen
3. ✅ `MusicPlaylistFolio.svelte` - Registers shortcuts for 'musicPlaylistFolio' screen
4. ✅ `Websites.svelte` - Registers shortcuts for 'websitesFolio' screen
5. ✅ `Head.svelte` - Registers modal shortcuts for 'startScreen'
6. ✅ `About.svelte` - Registers shortcuts for 'about' screen
7. ✅ Additional folio components (AnimFolio1, MusicFolio1, P4bookFolio, Gridz) also register their own shortcuts

Global shortcuts (music controls, arrow navigation) remain in `navigation.js` as they should be available globally.

## Benefits

- **Co-location**: Shortcuts live with their components
- **Conflict prevention**: System warns about conflicts
- **Scope management**: Screen-specific shortcuts only active when needed
- **Maintainability**: Easy to see what shortcuts a component has
- **Cleanup**: Automatic unregistration on component unmount

