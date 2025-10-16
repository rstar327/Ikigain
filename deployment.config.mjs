// Deployment configuration for Replit
export const deploymentConfig = {
  // ESM Build Configuration
  buildOptions: {
    format: 'esm',
    platform: 'node',
    target: 'node18',
    bundle: true,
    mainFields: ['module', 'main'],
    conditions: ['import', 'module'],
    
    // External dependencies that should not be bundled
    external: [
      'pg-native',
      'lightningcss',
      '@replit/vite-plugin-runtime-error-modal',
      '@replit/vite-plugin-cartographer',
      'esbuild-linux-64',
      'esbuild-linux-arm64',
      'esbuild-darwin-64',
      'esbuild-darwin-arm64',
      'esbuild-win32-64',
      'esbuild-win32-arm64',
      'esbuild-freebsd-64',
      'esbuild-freebsd-arm64',
      'bufferutil',
      'utf-8-validate',
      'vite',
      'vite/*'
    ],
    
    // ESM compatibility banner
    banner: {
      js: `import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname as __dirname_func } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = __dirname_func(__filename);`
    }
  },
  
  // Production settings
  production: {
    port: 3000,
    host: '0.0.0.0',
    nodeEnv: 'production'
  },
  
  // Development settings
  development: {
    port: 5000,
    host: '0.0.0.0',
    nodeEnv: 'development'
  }
};

export default deploymentConfig;