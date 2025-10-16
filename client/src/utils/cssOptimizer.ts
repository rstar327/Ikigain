// CSS optimization utilities to reduce unused CSS

export const optimizeCSSDelivery = () => {
  // Remove unused CSS classes dynamically
  const stylesheets = Array.from(document.styleSheets);
  
  stylesheets.forEach((stylesheet) => {
    try {
      if (stylesheet.href && !stylesheet.href.includes(window.location.origin)) {
        return; // Skip external stylesheets due to CORS
      }
      
      const rules = Array.from(stylesheet.cssRules || []);
      const unusedRules: number[] = [];
      
      rules.forEach((rule, index) => {
        if (rule.type === CSSRule.STYLE_RULE) {
          const styleRule = rule as CSSStyleRule;
          
          // Check if selector is used in DOM
          try {
            const elements = document.querySelectorAll(styleRule.selectorText);
            if (elements.length === 0) {
              // Check if it's a utility class that might be used dynamically
              const isUtilityClass = /^(hidden|block|flex|grid|absolute|relative|fixed|sticky|z-|opacity-|transform|transition|duration-)/.test(styleRule.selectorText);
              if (!isUtilityClass) {
                unusedRules.push(index);
              }
            }
          } catch {
            // Invalid selector, skip
          }
        }
      });
      
      // Remove unused rules (in reverse order to maintain indices)
      unusedRules.reverse().forEach(index => {
        stylesheet.deleteRule(index);
      });
      
    } catch {
      // CORS or other access errors, skip
      console.warn('Cannot optimize stylesheet:', stylesheet.href);
    }
  });
};

export const deferNonCriticalCSS = () => {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  
  links.forEach((link) => {
    const href = (link as HTMLLinkElement).href;
    
    // Defer non-critical stylesheets
    if (href.includes('fonts.googleapis.com') || 
        href.includes('cdn.jsdelivr.net') ||
        href.includes('unpkg.com')) {
      
      const newLink = link.cloneNode(true) as HTMLLinkElement;
      newLink.rel = 'preload';
      newLink.as = 'style';
      newLink.onload = () => {
        newLink.rel = 'stylesheet';
      };
      
      link.parentNode?.replaceChild(newLink, link);
    }
  });
};

export const inlineSmallCSS = () => {
  // Inline very small CSS files to reduce HTTP requests
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  
  links.forEach(async (link) => {
    const href = (link as HTMLLinkElement).href;
    
    if (href && href.includes(window.location.origin)) {
      try {
        const response = await fetch(href);
        const css = await response.text();
        
        // Only inline if CSS is small (less than 2KB)
        if (css.length < 2048) {
          const style = document.createElement('style');
          style.textContent = css;
          link.parentNode?.replaceChild(style, link);
        }
      } catch {
        // Fetch failed, keep original link
      }
    }
  });
};