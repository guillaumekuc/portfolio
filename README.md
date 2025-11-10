# Portfolio Website

A PHP-based portfolio website showcasing creative work.

## Local Development Setup

### Prerequisites
- PHP (7.4 or higher recommended)
- Web server (Apache/Nginx) or PHP built-in server
- Git

### Getting Started

1. Clone the repository (if working with remote):
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. Start a local development server:
   
   Using PHP built-in server:
   ```bash
   php -S localhost:8000
   ```
   
   Or configure your Apache/Nginx to point to this directory.

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Project Structure

- `index.php` - Main entry point
- `*.php` - PHP page files
- `styles.css` - Main stylesheet
- `scripts.js` - JavaScript functionality
- `img/` - Image assets
- `vid/` - Video assets
- `sound/` - Audio assets
- `folios/` - Portfolio item pages
- `.htaccess` - Apache configuration (HTTPS redirect)

### Notes

- The `.htaccess` file includes HTTPS redirect rules. For local development, you may want to comment these out or use a local SSL setup.
- Large media files (videos, images) are tracked in git. Consider using Git LFS for large files if needed.

