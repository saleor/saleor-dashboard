import { getExtensionPreferenceKey } from "./getExtensionPreferenceKey";

describe("getExtensionPreferenceKey", () => {
  it("uses app.identifier and extension.identifier when both present", () => {
    // Arrange
    const extension = {
      id: "ext-id",
      identifier: "my.extension",
      app: { id: "app-id", identifier: "my.app" },
    };

    // Act
    const key = getExtensionPreferenceKey(extension);

    // Assert
    expect(key).toBe("my.app:my.extension");
  });

  it("falls back to app.id when app.identifier is null", () => {
    // Arrange
    const extension = {
      id: "ext-id",
      identifier: "my.extension",
      app: { id: "app-id", identifier: null },
    };

    // Act / Assert
    expect(getExtensionPreferenceKey(extension)).toBe("app-id:my.extension");
  });

  it("falls back to extension.id when extension.identifier is null", () => {
    // Arrange
    const extension = {
      id: "ext-id",
      identifier: null,
      app: { id: "app-id", identifier: "my.app" },
    };

    // Act / Assert
    expect(getExtensionPreferenceKey(extension)).toBe("my.app:ext-id");
  });

  it("falls back to both ids when identifier fields are missing", () => {
    // Arrange
    const extension = { id: "ext-id", app: { id: "app-id" } };

    // Act / Assert
    expect(getExtensionPreferenceKey(extension)).toBe("app-id:ext-id");
  });
});
