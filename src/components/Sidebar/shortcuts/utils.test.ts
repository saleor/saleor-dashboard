import { getShortcutLeadingKey } from "./utils";

describe("getShortcutLeadingKey", () => {
  it('should return "⌘" if navigator.appVersion includes "mac"', () => {
    // Arrange
    Object.defineProperty(navigator, "appVersion", {
      value:
        "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      writable: true,
    });

    // Act
    const result = getShortcutLeadingKey();

    // Assert
    expect(result).toBe("⌘");
  });

  it('should return "Ctrl" if navigator.appVersion does not include "mac"', () => {
    // Arrange
    Object.defineProperty(navigator, "appVersion", {
      value:
        "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      writable: true,
    });

    // Act
    const result = getShortcutLeadingKey();

    // Assert
    expect(result).toBe("Ctrl");
  });
});
