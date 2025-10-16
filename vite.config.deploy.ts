import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(async ({ command, mode }) => {
  const plugins = [react(), runtimeErrorOverlay()];
  
  // Handle Replit-specific plugins without top-level await
  if (mode !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const { cartographer } = await import("@replit/vite-plugin-cartographer");
      plugins.push(cartographer());
    } catch (error) {
      console.warn("Failed to load cartographer plugin:", error.message);
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      target: 'esnext',
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
    esbuild: {
      target: 'esnext',
      format: 'esm'
    }
  };
});