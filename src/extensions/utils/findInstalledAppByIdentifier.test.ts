import {
  findAlreadyInstalledApp,
  findInstalledAppByIdentifier,
} from "./findInstalledAppByIdentifier";

describe("findInstalledAppByIdentifier", () => {
  const installedApps = [
    {
      id: "app-1",
      identifier: "saleor.pulse",
      manifestUrl: "https://pulse.saleor.app/api/manifest",
      name: "Saleor Pulse",
    },
    {
      id: "app-2",
      identifier: "other.app",
      manifestUrl: "https://other.app/api/manifest",
      name: "Other App",
    },
  ];

  it("returns the installed app with a matching identifier", () => {
    // Arrange & Act
    const app = findInstalledAppByIdentifier(installedApps, "saleor.pulse");

    // Assert
    expect(app?.id).toBe("app-1");
  });

  it("returns undefined when no installed app matches", () => {
    // Arrange & Act
    const app = findInstalledAppByIdentifier(installedApps, "unknown.app");

    // Assert
    expect(app).toBeUndefined();
  });
});

describe("findAlreadyInstalledApp", () => {
  const installedApps = [
    {
      id: "app-1",
      identifier: "saleor.pulse",
      manifestUrl: "https://pulse.saleor.app/api/manifest",
      name: "Saleor Pulse",
    },
    {
      id: "app-2",
      identifier: "other.app",
      manifestUrl: "https://other.app/api/manifest",
      name: "Other App",
    },
  ];

  it("prefers identifier match over manifest URL", () => {
    // Arrange & Act
    const app = findAlreadyInstalledApp(installedApps, {
      identifier: "saleor.pulse",
      manifestUrl: "https://different-host.example/api/manifest",
    });

    // Assert
    expect(app?.id).toBe("app-1");
  });

  it("resolves the app from Saleor's UNIQUE error message", () => {
    // Arrange & Act
    const app = findAlreadyInstalledApp(installedApps, {
      manifestUrl: "https://staging.pulse.saleor.app/api/manifest",
      uniqueError: {
        field: "identifier",
        message: "App with the same identifier is already installed: Saleor Pulse",
      },
    });

    // Assert
    expect(app?.id).toBe("app-1");
  });

  it("falls back to manifest URL when identifier is missing", () => {
    // Arrange & Act
    const app = findAlreadyInstalledApp(installedApps, {
      manifestUrl: "https://other.app/api/manifest",
    });

    // Assert
    expect(app?.id).toBe("app-2");
  });
});
