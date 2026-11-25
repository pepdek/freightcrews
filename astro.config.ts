import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config.ts";

export default defineConfig({
  site: SITE.DOMAIN,
  trailingSlash: "always",
  integrations: [sitemap({ filter: (page) => !page.endsWith("/thanks/") })],
  // One small stylesheet: inlining it removes the only render-blocking request.
  build: { inlineStylesheets: "always" },
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
});
