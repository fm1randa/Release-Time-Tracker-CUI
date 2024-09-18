import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  source: {
    tsconfigPath: "../../tsconfig.json",
  },
  plugins: [pluginReact()],
  html: {
    template: "./public/index.html",
  },
  output: {
    assetPrefix: "./",
    distPath: {
      root: "build",
    },
  },
  dev: {
    writeToDisk: true,
  },
});
