import {
  CUSTOMER_EMAILS_APP_IDENTIFIER,
  SMTP_APP_IDENTIFIER,
} from "@dashboard/notificationsSettings/constants";

import { getOfficialAppLogoSource } from "./officialAppLogos";

describe("getOfficialAppLogoSource", () => {
  it("returns the App Store mark for Customer Emails", () => {
    // Arrange & Act
    const source = getOfficialAppLogoSource(CUSTOMER_EMAILS_APP_IDENTIFIER, "defaultLight");

    // Assert
    expect(source).toContain("customer-emails.png");
  });

  it("uses the dark SMTP mark in the dark theme", () => {
    // Arrange & Act
    const source = getOfficialAppLogoSource(SMTP_APP_IDENTIFIER, "defaultDark");

    // Assert
    expect(source).toContain("app-smtp-dark.svg");
  });

  it("returns nothing for an unknown identifier", () => {
    // Arrange & Act
    const source = getOfficialAppLogoSource("saleor.app.unknown", "defaultLight");

    // Assert
    expect(source).toBeUndefined();
  });
});
