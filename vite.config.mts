import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * `src/shared/theme/tokens.js` is copied verbatim from the app, and it is
 * CommonJS (`module.exports = {...}`) because `tailwind.config.js` requires it.
 * Vite serves source files as ES modules, so this rewrites that one export
 * line to `export {...}` in the browser bundle. The file on disk is untouched.
 */
function tokensAsEsm(): Plugin {
  return {
    name: "dmba-tokens-as-esm",
    transform(code, id) {
      if (!id.replace(/\\/g, "/").endsWith("/src/shared/theme/tokens.js")) return null;
      return code.replace(/module\.exports\s*=\s*\{([^}]*)\};?/, "export {$1};");
    },
  };
}

export default defineConfig({
  plugins: [tokensAsEsm(), react()],
  resolve: {
    // Same alias as the app: `@/src/shared/...` resolves from the project root.
    alias: { "@": decodeURIComponent(new URL(".", import.meta.url).pathname).replace(/\/$/, "") },
  },
  server: { port: 5173, strictPort: true },
});
