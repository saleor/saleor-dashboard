import { isAppPath } from "@dashboard/hooks/useLocationState";

describe("useLocationState - isAppPath backward compatibility", () => {
  // Arrange
  const appId = "test-app-123";

  describe("New extension paths", () => {
    it("detects new extension app path", () => {
      // Arrange
      const pathname = `/extensions/app/${appId}`;

      // Act
      const result = isAppPath(pathname);

      // Assert
      expect(result).toBe(true);
    });

    it("detects new extension app deep path", () => {
      // Arrange
      const pathname = `/extensions/app/${appId}/config/settings`;

      // Act
      const result = isAppPath(pathname);

      // Assert
      expect(result).toBe(true);
    });

    it("detects new extension app path with encoded ID", () => {
      // Arrange
      const pathname = `/extensions/app/${encodeURIComponent("app:with:colons")}`;

      // Act
      const result = isAppPath(pathname);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("Legacy app paths", () => {
    it("detects legacy app path", () => {
      // Arrange
      const pathname = `/apps/${appId}`;

      // Act
      const result = isAppPath(pathname);

      // Assert
      expect(result).toBe(true);
    });

    it("detects legacy app deep path", () => {
      // Arrange
      const pathname = `/apps/${appId}/app/config`;

      // Act
      const result = isAppPath(pathname);

      // Assert
      expect(result).toBe(true);
    });

    it("detects legacy app root path", () => {
      // Arrange
      const pathname = `/apps/`;

      // Act
      const result = isAppPath(pathname);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("Non-app paths", () => {
    it("returns false for root path", () => {
      // Arrange
      const pathname = "/";

      // Act
      const result = isAppPath(pathname);

      // Assert
      expect(result).toBe(false);
    });

    it("returns false for extensions list path", () => {
      // Arrange
      const pathname = "/extensions/installed";

      // Act
      const result = isAppPath(pathname);

      // Assert
      expect(result).toBe(false);
    });

    it("returns false for orders path", () => {
      // Arrange
      const pathname = "/orders";

      // Act
      const result = isAppPath(pathname);

      // Assert
      expect(result).toBe(false);
    });

    it("returns false for products path", () => {
      // Arrange
      const pathname = "/products/123";

      // Act
      const result = isAppPath(pathname);

      // Assert
      expect(result).toBe(false);
    });

    it("returns false for custom extension path", () => {
      // Arrange
      const pathname = "/extensions/custom/123";

      // Act
      const result = isAppPath(pathname);

      // Assert
      expect(result).toBe(false);
    });

    it("returns false for plugin extension path", () => {
      // Arrange
      const pathname = "/extensions/plugin/123";

      // Act
      const result = isAppPath(pathname);

      // Assert
      expect(result).toBe(false);
    });
  });
});
