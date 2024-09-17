import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: "./public/index.html",
  },
  output: {
    assetPrefix: "./",
    distPath: {
      root: "build",
    },
    manifest: "asset-manifest.json",
  },
  dev: {
    writeToDisk: true,
  },
});
