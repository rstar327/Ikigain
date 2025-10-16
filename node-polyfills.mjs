// Node.js polyfills for ESM builds
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Create global require for ESM environment
global.require = createRequire(import.meta.url);

// Provide __filename and __dirname polyfills
if (typeof globalThis.__filename === 'undefined') {
  globalThis.__filename = fileURLToPath(import.meta.url);
}

if (typeof globalThis.__dirname === 'undefined') {
  globalThis.__dirname = dirname(globalThis.__filename);
}