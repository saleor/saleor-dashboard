import { SMTP_APP_IDENTIFIER } from "@dashboard/notificationsSettings/constants";

import { isHiddenFromExplore } from "./exploreExtensionVisibility";

describe("isHiddenFromExplore", () => {
  it("hides the legacy SMTP app until a shop has it installed", () => {
    // Arrange
    const smtp = { type: "APP", id: SMTP_APP_IDENTIFIER, installed: false };

    // Act
    const hidden = isHiddenFromExplore(smtp);

    // Assert
    expect(hidden).toBe(true);
  });

  it("keeps an installed SMTP app so existing setups can still be opened", () => {
    // Arrange
    const smtp = { type: "APP", id: SMTP_APP_IDENTIFIER, installed: true };

    // Act
    const hidden = isHiddenFromExplore(smtp);

    // Assert
    expect(hidden).toBe(false);
  });

  it("keeps other apps, including ones that are not installed", () => {
    // Arrange
    const customerEmails = { type: "APP", id: "saleor.app.customer-emails", installed: false };

    // Act
    const hidden = isHiddenFromExplore(customerEmails);

    // Assert
    expect(hidden).toBe(false);
  });
});
