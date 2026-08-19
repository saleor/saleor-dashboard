import { findInstalledAppFromUniqueError } from "./findInstalledAppFromUniqueError";

describe("findInstalledAppFromUniqueError", () => {
  const installedApps = [
    { id: "app-1", name: "Saleor Pulse" },
    { id: "app-2", name: "Other App" },
  ];

  it("returns the installed app named in Saleor's UNIQUE error message", () => {
    // Arrange & Act
    const app = findInstalledAppFromUniqueError(installedApps, {
      field: "identifier",
      message: "App with the same identifier is already installed: Saleor Pulse",
    });

    // Assert
    expect(app?.id).toBe("app-1");
  });

  it("returns undefined when the error is not on the identifier field", () => {
    // Arrange & Act
    const app = findInstalledAppFromUniqueError(installedApps, {
      field: "manifestUrl",
      message: "App with the same identifier is already installed: Saleor Pulse",
    });

    // Assert
    expect(app).toBeUndefined();
  });
});
