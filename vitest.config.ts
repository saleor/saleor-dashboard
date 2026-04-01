import path from "node:path";
import { fileURLToPath } from "node:url";

// @ts-expect-error -- moduleResolution "node" cannot resolve package.json "exports"; Vite/Vitest use "bundler" resolution at runtime
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    coverage: {
      reportsDirectory: path.join(dirname, "coverage", "storybook"),
    },
    onConsoleLog(log) {
      if (
        log.includes("Warning: findDOMNode") ||
        log.includes("Warning: validateDOMNesting") ||
        log.includes("Warning: Unknown event handler property") ||
        log.includes("Warning: Encountered two children with the same key")
      ) {
        return false;
      }
    },
    projects: [
      {
        extends: ".storybook/vite.storybook.config.js",
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
          setupFiles: ["./.storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
