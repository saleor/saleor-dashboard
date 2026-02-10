const loadEnvMock = jest.fn();
const searchForWorkspaceRootMock = jest.fn((_root: string) => "/workspace");

jest.mock("@sentry/vite-plugin", () => ({
  sentryVitePlugin: jest.fn(() => ({ name: "sentry" })),
}));
jest.mock("@vitejs/plugin-react-swc", () => jest.fn(() => ({ name: "react" })));
jest.mock("code-inspector-plugin", () => ({
  CodeInspectorPlugin: jest.fn(() => ({ name: "code-inspector" })),
}));
jest.mock("rollup-plugin-polyfill-node", () => jest.fn(() => ({ name: "node-polyfills" })));
jest.mock("vite-plugin-html", () => ({
  createHtmlPlugin: jest.fn(() => ({ name: "html" })),
}));
jest.mock("vite", () => ({
  defineConfig: (factory: (args: { command: string; mode: string }) => unknown) => factory,
  loadEnv: (...args: [string, string, string]) => loadEnvMock(args[0], args[1], args[2]),
  searchForWorkspaceRoot: (root: string) => searchForWorkspaceRootMock(root),
}));

import viteConfigFactory from "../vite.config.js";

describe("vite config", () => {
  beforeEach(() => {
    loadEnvMock.mockReset();
    searchForWorkspaceRootMock.mockClear();
  });

  it("should use PORT_DEVSERVER when provided", () => {
    // Arrange
    loadEnvMock.mockReturnValue({
      PORT_DEVSERVER: "9123",
    });

    // Act
    const config = viteConfigFactory({ command: "serve", mode: "development" });

    // Assert
    expect(config.server.port).toBe("9123");
  });

  it("should fallback to default dev server port when PORT_DEVSERVER is missing", () => {
    // Arrange
    loadEnvMock.mockReturnValue({});

    // Act
    const config = viteConfigFactory({ command: "serve", mode: "development" });

    // Assert
    expect(config.server.port).toBe(9000);
  });
});
