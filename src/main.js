import { Head } from './components/Head.js';
import { VerticalClickNav } from './components/VerticalClickNav.js';
import { Splashscreen } from './components/Splashscreen.js';
import { Header } from './components/Header.js';
import { Rubrics } from './components/Rubrics.js';
import { Folios } from './components/Folios.js';
import { About } from './components/About.js';
import { Footer } from './components/Footer.js';
import { Foot } from './components/Foot.js';

// Import styles
import './styles.css';
// Import slick base styles from npm package
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Import scripts
import { bgMusicControls, navigation, slickCarousel, toolTips, initScripts, initLoadingScreen } from './scripts.js';

// Assemble the page
document.addEventListener('DOMContentLoaded', () => {
  const html = 
    Head() +
    VerticalClickNav() +
    Splashscreen() +
    Header() +
    Rubrics() +
    Folios() +
    About() +
    Footer() +
    Foot();
  
  // Insert into app container
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = html;
  } else {
    // Fallback: insert directly into body
    document.body.insertAdjacentHTML('afterbegin', html);
  }
  
  // Initialize scripts after DOM is ready
  initScripts();
  initLoadingScreen();
  
  // Initialize scripts - slick needs a bit more time for DOM to be fully ready
  setTimeout(() => {
    bgMusicControls();
    navigation();
    toolTips();
  }, 50);
  
  // Initialize slick after galleries are fully in DOM
  setTimeout(() => {
    slickCarousel();
  }, 300);
});

