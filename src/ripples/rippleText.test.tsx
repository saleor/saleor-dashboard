import { createIntl } from "react-intl";

import { formatRippleText } from "./rippleText";

// Jest maps react-intl to a stub; formatting a message needs the real implementation.
jest.mock("react-intl", () => jest.requireActual("react-intl/index.js"));

describe("formatRippleText", () => {
  const intl = createIntl({
    locale: "pt-PT",
    defaultLocale: "en",
    messages: { rippleTitle: "Novidade traduzida" },
  });

  it("translates a message with the active language", () => {
    // Arrange
    const message = { id: "rippleTitle", defaultMessage: "Translated news" };

    // Act
    const text = formatRippleText(intl, message);

    // Assert
    expect(text).toBe("Novidade traduzida");
  });

  it("returns plain strings and React nodes unchanged", () => {
    // Arrange
    const node = <em>Already formatted</em>;

    // Act & Assert
    expect(formatRippleText(intl, "Plain text")).toBe("Plain text");
    expect(formatRippleText(intl, node)).toBe(node);
  });
});
