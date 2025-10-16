import fs from 'fs';
import path from 'path';

// Generate individual HTML files with correct canonical URLs
export function generateStaticHtmlFiles() {
  const routes = [
    '/',
    '/shop',
    '/blog',
    '/what-is-ikigai',
    '/ikigai-test',
    '/type-test',
    '/about',
    '/privacy',
    '/terms',
    '/ikigai-types/builder',
    '/ikigai-types/explorer',
    '/ikigai-types/dreamer',
    '/ikigai-types/achiever',
    '/ikigai-types/helper',
    '/ikigai-types/creative-enthusiast',
    '/ikigai-types/skilled-expert',
    '/ikigai-types/purpose-driven-leader',
    '/ikigai-types/career-focused-achiever',
    // Add all positive words routes
    ...Array.from({length: 26}, (_, i) => `/positive-words-that-start-with-${String.fromCharCode(97 + i)}`),
    // Spanish routes
    '/es/tienda',
    '/es/blog',
    '/es/que-es-ikigai',
    '/es/test-ikigai',
    '/es/test-tipos',
    '/es/acerca-de',
    '/es/privacidad',
    '/es/terminos',
    // French routes
    '/fr/boutique',
    '/fr/blog',
    '/fr/qu-est-ce-que-ikigai',
    '/fr/test-ikigai',
    '/fr/test-types',
    '/fr/a-propos',
    '/fr/confidentialite',
    '/fr/conditions'
  ];

  // Read the base HTML template
  const baseHtmlPath = path.join(process.cwd(), 'dist', 'index.html');
  if (!fs.existsSync(baseHtmlPath)) {
    console.log('Base HTML file not found, skipping static generation');
    return;
  }

  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

  // Generate HTML file for each route
  routes.forEach(route => {
    const canonicalUrl = `https://www.ikigain.org${route}`;
    const modifiedHtml = baseHtml.replace(
      '<link rel="canonical" href="https://www.ikigain.org/" id="canonical-url">',
      `<link rel="canonical" href="${canonicalUrl}" id="canonical-url">`
    );

    // Create directory structure if needed
    const routePath = route === '/' ? '/index' : route;
    const filePath = path.join(process.cwd(), 'dist', `${routePath}.html`);
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the modified HTML file
    fs.writeFileSync(filePath, modifiedHtml);
    console.log(`✅ Generated: ${filePath} with canonical: ${canonicalUrl}`);
  });

  console.log(`✅ Generated ${routes.length} static HTML files with unique canonical URLs`);
}