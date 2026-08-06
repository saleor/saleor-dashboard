import {
  findInstalledAppByManifestUrl,
  normalizeManifestUrl,
} from "./findInstalledAppByManifestUrl";

describe("normalizeManifestUrl", () => {
  it("normalizes URLs with trailing slashes", () => {
    // Arrange & Act & Assert
    expect(normalizeManifestUrl("https://example.com/manifest/")).toBe(
      "https://example.com/manifest/",
    );
    expect(normalizeManifestUrl("https://example.com/manifest")).toBe(
      "https://example.com/manifest",
    );
  });
});

describe("findInstalledAppByManifestUrl", () => {
  const installedApps = [
    { id: "app-1", manifestUrl: "https://pulse.saleor.app/api/manifest" },
    { id: "app-2", manifestUrl: "https://other.app/api/manifest" },
  ];

  it("returns the installed app with a matching manifest URL", () => {
    // Arrange & Act
    const app = findInstalledAppByManifestUrl(
      installedApps,
      "https://pulse.saleor.app/api/manifest",
    );

    // Assert
    expect(app?.id).toBe("app-1");
  });

  it("returns undefined when no installed app matches", () => {
    // Arrange & Act
    const app = findInstalledAppByManifestUrl(installedApps, "https://unknown.app/api/manifest");

    // Assert
    expect(app).toBeUndefined();
  });
});
