// ESM-compatible esbuild configuration for deployment
import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const buildConfig = {
  entryPoints: [join(__dirname, 'server/index.ts')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: join(__dirname, 'dist/index.js'),
  external: [
    'pg-native',
    'lightningcss',
    'esbuild',
    '@esbuild/linux-x64',
    '@esbuild/win32-x64',
    '@esbuild/darwin-x64',
    '@esbuild/darwin-arm64',
    'bufferutil',
    'utf-8-validate'
  ],
  banner: {
    js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
    `.trim()
  },
  define: {
    'import.meta.dirname': '__dirname',
    'process.env.NODE_ENV': '"production"'
  },
  minify: true,
  sourcemap: false,
  logLevel: 'warning'
};

// Run build if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await build(buildConfig);
    console.log('✅ Server build completed');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}