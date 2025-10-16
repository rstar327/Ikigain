# URL Rewrite Solution for Canonical URLs

## Manual .replit File Configuration

Since I can't edit the .replit file directly, you need to manually add this configuration:

### Add to your .replit file:

```toml
[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]

# URL rewrites for unique canonical URLs
[[deployment.rewrites]]
from = "/what-is-ikigai"
to = "/index.html"

[[deployment.rewrites]]
from = "/ikigai-test"
to = "/index.html"

[[deployment.rewrites]]
from = "/ikigai-type-test"
to = "/index.html"

[[deployment.rewrites]]
from = "/about"
to = "/index.html"

[[deployment.rewrites]]
from = "/blog"
to = "/index.html"

[[deployment.rewrites]]
from = "/shop"
to = "/index.html"

[[deployment.rewrites]]
from = "/ikigai-types/*"
to = "/index.html"

[[deployment.rewrites]]
from = "/positive-words-that-start-with-*"
to = "/index.html"

# Spanish routes
[[deployment.rewrites]]
from = "/es/*"
to = "/index.html"

# French routes
[[deployment.rewrites]]
from = "/fr/*"
to = "/index.html"
```

## How This Works:

1. **URL rewrites preserve the original URL** in the browser
2. **All routes serve index.html** (your React app)
3. **React Router detects the URL** and renders the correct page
4. **SEO middleware can read the URL** and inject unique meta tags

## Next Step: Enhanced SEO Middleware

The URL rewrites allow the SEO middleware to work properly by preserving the original URL path.