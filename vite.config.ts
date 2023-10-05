import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Weather App",
        short_name: "WeatherBase",
        description: "A progressive weather app",
        theme_color: "#eeeeee",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,svg}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  //@ts-ignore
  test: {
    environment: "jsdom",
    testMatch: ["./tests/**/*.test.tsx"],
    setupFiles: './tests/setup.js',
    globals: true,
  },
});
