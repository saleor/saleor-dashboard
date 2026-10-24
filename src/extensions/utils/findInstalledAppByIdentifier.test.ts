import { CUSTOMER_EMAILS_APP_IDENTIFIER } from "@dashboard/notificationsSettings/constants";

import {
  findAlreadyInstalledApp,
  findInstalledAppByIdentifier,
  findInstalledAppForIdentifier,
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

describe("findInstalledAppForIdentifier", () => {
  type InstalledApp = {
    id: string;
    identifier: string | null;
    name: string;
    manifestUrl: string | null;
  };

  it("matches a known app by hosted manifest URL when identifier is missing on the record", () => {
    // Arrange
    const apps: InstalledApp[] = [
      {
        id: "customer-1",
        identifier: null,
        name: "Customer Emails",
        manifestUrl: "https://customer-emails.saleor.app/api/manifest",
      },
    ];

    // Act
    const app = findInstalledAppForIdentifier(apps, CUSTOMER_EMAILS_APP_IDENTIFIER);

    // Assert
    expect(app?.id).toBe("customer-1");
  });

  it.each([null, "other.app"])("does not match by name when identifier is %s", identifier => {
    // Arrange
    const apps: InstalledApp[] = [
      {
        id: "customer-local",
        identifier,
        name: "Customer Emails",
        manifestUrl: "http://localhost:3000/api/manifest",
      },
    ];

    // Act
    const app = findInstalledAppForIdentifier(apps, CUSTOMER_EMAILS_APP_IDENTIFIER);

    // Assert
    expect(app).toBeUndefined();
  });

  it("rejects a matching manifest URL with a conflicting identifier", () => {
    // Arrange
    const apps: InstalledApp[] = [
      {
        id: "other-app",
        identifier: "other.app",
        name: "Customer Emails",
        manifestUrl: "https://customer-emails.saleor.app/api/manifest",
      },
    ];

    // Act
    const app = findInstalledAppForIdentifier(apps, CUSTOMER_EMAILS_APP_IDENTIFIER);

    // Assert
    expect(app).toBeUndefined();
  });

  it("prefers an identifier match over a manifest URL fallback", () => {
    // Arrange
    const apps: InstalledApp[] = [
      {
        id: "legacy-app",
        identifier: null,
        name: "Customer Emails",
        manifestUrl: "https://customer-emails.saleor.app/api/manifest",
      },
      {
        id: "customer-local",
        identifier: CUSTOMER_EMAILS_APP_IDENTIFIER,
        name: "Custom name",
        manifestUrl: "http://localhost:3000/api/manifest",
      },
    ];

    // Act
    const app = findInstalledAppForIdentifier(apps, CUSTOMER_EMAILS_APP_IDENTIFIER);

    // Assert
    expect(app?.id).toBe("customer-local");
  });
});
