#!/usr/bin/env node
// Replit-specific deployment configuration

export default {
  build: {
    commands: [
      "node build-deploy.mjs"
    ]
  },
  
  run: {
    command: "cd dist && PORT=3000 NODE_ENV=production node index.js"
  },
  
  environment: {
    NODE_ENV: "production",
    PORT: "3000"
  },
  
  dependencies: {
    external: [
      "pg-native",
      "lightningcss", 
      "esbuild",
      "bufferutil",
      "utf-8-validate"
    ]
  }
};