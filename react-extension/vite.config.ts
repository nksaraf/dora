import { dirname, relative } from "path";
import { defineConfig, UserConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import { r, port, isDev } from "./scripts/utils";
import react from "@vitejs/plugin-react";
import Icons from "unplugin-icons/vite";
export const sharedConfig: UserConfig = {
  root: r("src"),
  resolve: {
    alias: {
      "~/": `${r("src")}/`,
    },
  },
  define: {
    __DEVELOPMENT__: isDev,
  },
  plugins: [
    // React fast refresh doesn't work, cause injecting of preambleCode into index.html
    // TODO: fix it
    react({ fastRefresh: false }),
    Icons({ compiler: "jsx", jsx: "react" }),
    AutoImport({
      imports: [
        {
          "webextension-polyfill": [["default", "browser"]],
        },
      ],
      dts: r("src/auto-imports.d.ts"),
    }),

    // rewrite assets to use relative path
    {
      name: "assets-rewrite",
      enforce: "post",
      apply: "build",
      transformIndexHtml(html, { path }) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), "/assets")}/`
        );
      },
    },
  ],
  optimizeDeps: {
    include: ["webextension-polyfill"],
  },
};

export default defineConfig(({ command }) => ({
  ...sharedConfig,
  base: command === "serve" ? `http://localhost:${port}/` : "/dist/",
  server: {
    port,
    hmr: {
      host: "localhost",
    },
  },
  build: {
    outDir: r("extension/dist"),
    emptyOutDir: false,
    sourcemap: isDev ? "inline" : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        background: r("src/background/index.html"),
        options: r("src/options/index.html"),
        popup: r("src/popup/index.html"),
      },
    },
  },
  plugins: [...sharedConfig.plugins!],
}));
