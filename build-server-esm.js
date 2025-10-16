const esbuild = require('esbuild');

// Build server with ESM format to support import.meta and top-level await
esbuild.build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/index.js',
    format: 'esm',
    external: ['pg-native', 'lightningcss'],
    target: 'node18',
}).then(() => {
    console.log('✅ Server built successfully in ESM format');
}).catch((err) => {
    console.error('❌ Server build failed:', err);
    process.exit(1);
});