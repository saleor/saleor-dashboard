import { SMTP_APP_IDENTIFIER } from "@dashboard/notificationsSettings/constants";

import {
  appsForLegacySmtpLink,
  legacySmtpAppHref,
  type LegacySmtpAppLink,
} from "./useLegacySmtpAppHref";

const smtpApp = (overrides: Partial<LegacySmtpAppLink> = {}): LegacySmtpAppLink => ({
  identifier: SMTP_APP_IDENTIFIER,
  ...overrides,
});

describe("legacySmtpAppHref", () => {
  it("returns nothing when the shop has no SMTP app", () => {
    // Arrange
    const apps = [smtpApp({ identifier: "saleor.app.customer-emails" })];

    // Act
    const href = legacySmtpAppHref(apps);

    // Assert
    expect(href).toBeNull();
  });

  it("opens the installed SMTP app by its manifest identifier", () => {
    // Arrange
    const apps = [smtpApp()];

    // Act
    const href = legacySmtpAppHref(apps);

    // Assert
    expect(href).toContain("/extensions/app/saleor.app.smtp");
  });
});

describe("appsForLegacySmtpLink", () => {
  it("uses the cached snapshot before the query resolves", () => {
    // Arrange
    const cached = [smtpApp()];

    // Act
    const apps = appsForLegacySmtpLink(undefined, cached);

    // Assert
    expect(legacySmtpAppHref(apps)).toContain("/extensions/app/saleor.app.smtp");
  });

  it("trusts an empty query over a snapshot that still lists SMTP", () => {
    // Arrange
    const cached = [smtpApp()];

    // Act
    const apps = appsForLegacySmtpLink([], cached);

    // Assert
    expect(legacySmtpAppHref(apps)).toBeNull();
  });
});
