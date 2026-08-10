import { ExtensionsUrls } from "@dashboard/extensions/urls";

import {
  getPulsePromotionLink,
  PULSE_APPS_STORE_URL,
  PULSE_MANIFEST_URL,
} from "./getPulsePromotionLink";

describe("getPulsePromotionLink", () => {
  it("returns the in-dashboard Pulse install path on cloud", () => {
    // Arrange & Act
    const link = getPulsePromotionLink(true);

    // Assert
    expect(link).toEqual({
      kind: "internal",
      to: ExtensionsUrls.resolveInstallCustomExtensionUrl(PULSE_MANIFEST_URL),
      intent: "install",
    });
  });

  it("returns the App Store URL for open-source instances", () => {
    // Arrange & Act
    const link = getPulsePromotionLink(false);

    // Assert
    expect(link).toEqual({
      kind: "external",
      href: PULSE_APPS_STORE_URL,
      intent: "explore",
    });
  });

  it("returns the installed app page when Pulse is already installed", () => {
    // Arrange & Act
    const link = getPulsePromotionLink(true, { installedAppUrl: "/extensions/app/pulse-id" });

    // Assert
    expect(link).toEqual({
      kind: "internal",
      to: "/extensions/app/pulse-id",
      intent: "open",
    });
  });
});
