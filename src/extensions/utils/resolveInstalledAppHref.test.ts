import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppTypeEnum } from "@dashboard/graphql";

import {
  resolveAlreadyInstalledAppLinkTarget,
  resolveInstalledAppHref,
} from "./resolveInstalledAppHref";

describe("resolveAlreadyInstalledAppLinkTarget", () => {
  it("returns app when the extension is active and has an app URL", () => {
    // Arrange & Act
    const linkTarget = resolveAlreadyInstalledAppLinkTarget({
      type: AppTypeEnum.THIRDPARTY,
      isActive: true,
      appUrl: "https://example.com",
    });

    // Assert
    expect(linkTarget).toBe("app");
  });

  it("returns settings when the extension is disabled", () => {
    // Arrange & Act
    const linkTarget = resolveAlreadyInstalledAppLinkTarget({
      type: AppTypeEnum.THIRDPARTY,
      isActive: false,
      appUrl: "https://example.com",
    });

    // Assert
    expect(linkTarget).toBe("settings");
  });
});

describe("resolveInstalledAppHref", () => {
  it("returns the custom extension edit URL for local apps", () => {
    // Arrange & Act
    const href = resolveInstalledAppHref({
      id: "local-app",
      type: AppTypeEnum.LOCAL,
      isActive: true,
      appUrl: "https://example.com",
    });

    // Assert
    expect(href).toBe(ExtensionsUrls.editCustomExtensionUrl("local-app"));
  });

  it("returns the manifest edit URL when the app is inactive", () => {
    // Arrange & Act
    const href = resolveInstalledAppHref({
      id: "manifest-app",
      type: AppTypeEnum.THIRDPARTY,
      isActive: false,
      appUrl: "https://example.com",
    });

    // Assert
    expect(href).toBe(ExtensionsUrls.resolveEditManifestExtensionUrl("manifest-app"));
  });

  it("returns the manifest view URL for active apps with an app URL", () => {
    // Arrange & Act
    const href = resolveInstalledAppHref({
      id: "manifest-app",
      type: AppTypeEnum.THIRDPARTY,
      isActive: true,
      appUrl: "https://example.com",
    });

    // Assert
    expect(href).toBe(ExtensionsUrls.resolveViewManifestExtensionUrl("manifest-app"));
  });
});
