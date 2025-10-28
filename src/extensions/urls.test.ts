import { ExtensionsUrls, LegacyAppPaths } from "./urls";

describe("ExtensionsUrls - backward compatibility", () => {
  const appId = "test-app-123";

  describe("isAppDeepUrlChange", () => {
    describe("New extension paths only", () => {
      it("detects navigation within same app using new paths", () => {
        // Arrange
        const from = `/extensions/app/${encodeURIComponent(appId)}`;
        const to = `/extensions/app/${encodeURIComponent(appId)}/config`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(true);
      });

      it("detects navigation from app root to deep path using new paths", () => {
        // Arrange
        const from = `/extensions/app/${encodeURIComponent(appId)}`;
        const to = `/extensions/app/${encodeURIComponent(appId)}/settings/webhooks`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(true);
      });

      it("detects navigation between deep paths using new paths", () => {
        // Arrange
        const from = `/extensions/app/${encodeURIComponent(appId)}/config`;
        const to = `/extensions/app/${encodeURIComponent(appId)}/settings`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(true);
      });
    });

    describe("Legacy app paths only", () => {
      it("detects navigation within same app using legacy paths", () => {
        // Arrange
        const from = `/apps/${appId}/app`;
        const to = `/apps/${appId}/app/config`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(true);
      });

      it("detects navigation between deep paths using legacy paths", () => {
        // Arrange
        const from = `/apps/${appId}/app/config`;
        const to = `/apps/${appId}/app/settings`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(true);
      });
    });

    describe("Mixed legacy and new paths (backward compatibility)", () => {
      it("detects navigation from legacy to new path", () => {
        // Arrange
        const from = `/apps/${appId}/app/config`;
        const to = `/extensions/app/${encodeURIComponent(appId)}/settings`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(true);
      });

      it("detects navigation from new to legacy path", () => {
        // Arrange
        const from = `/extensions/app/${encodeURIComponent(appId)}/config`;
        const to = `/apps/${appId}/app/settings`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(true);
      });

      it("detects navigation from legacy root to new deep path", () => {
        // Arrange
        const from = `/apps/${appId}/app`;
        const to = `/extensions/app/${encodeURIComponent(appId)}/settings/advanced`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(true);
      });

      it("detects navigation from new root to legacy deep path", () => {
        // Arrange
        const from = `/extensions/app/${encodeURIComponent(appId)}`;
        const to = `/apps/${appId}/app/config`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(true);
      });
    });

    describe("Navigation outside of app (should return false)", () => {
      it("returns false when navigating from app to different app (new paths)", () => {
        // Arrange
        const from = `/extensions/app/${encodeURIComponent(appId)}`;
        const to = `/extensions/app/different-app-id`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(false);
      });

      it("returns false when navigating from app to different app (legacy paths)", () => {
        // Arrange
        const from = `/apps/${appId}/app`;
        const to = `/apps/different-app-id/app`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(false);
      });

      it("returns false when navigating from app to extensions list", () => {
        // Arrange
        const from = `/extensions/app/${encodeURIComponent(appId)}/config`;
        const to = `/extensions/installed`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(false);
      });

      it("returns false when navigating from app to orders", () => {
        // Arrange
        const from = `/extensions/app/${encodeURIComponent(appId)}`;
        const to = `/orders`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(false);
      });

      it("returns false when navigating from orders to app", () => {
        // Arrange
        const from = `/orders`;
        const to = `/extensions/app/${encodeURIComponent(appId)}`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(false);
      });

      it("returns false when navigating from legacy app to different section", () => {
        // Arrange
        const from = `/apps/${appId}/app/config`;
        const to = `/products`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(false);
      });
    });

    describe("Edge cases", () => {
      it("handles app IDs with special characters (double-encoded)", () => {
        // Arrange
        // Note: This tests the current behavior where appId gets double-encoded
        // The function calls resolveViewManifestExtensionUrl which already encodes,
        // but then passes encodeURIComponent(appId) to it, resulting in double encoding
        const specialAppId = "app:with:colons";
        const doubleEncoded = encodeURIComponent(encodeURIComponent(specialAppId));
        const from = `/extensions/app/${doubleEncoded}`;
        const to = `/extensions/app/${doubleEncoded}/config`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(specialAppId, from, to);

        // Assert
        expect(result).toBe(true);
      });

      it("handles navigation with query parameters", () => {
        // Arrange
        const from = `/extensions/app/${encodeURIComponent(appId)}?foo=bar`;
        const to = `/extensions/app/${encodeURIComponent(appId)}/config?baz=qux`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, from, to);

        // Assert
        expect(result).toBe(true);
      });

      it("returns true for identical paths", () => {
        // Arrange
        const path = `/extensions/app/${encodeURIComponent(appId)}/config`;

        // Act
        const result = ExtensionsUrls.isAppDeepUrlChange(appId, path, path);

        // Assert
        expect(result).toBe(true);
      });
    });
  });

  describe("LegacyAppPaths", () => {
    it("resolves legacy app path correctly", () => {
      // Arrange & Act
      const result = LegacyAppPaths.resolveAppPath(appId);

      // Assert
      expect(result).toBe(`/apps/${appId}/app`);
    });

    it("resolves legacy app list path", () => {
      // Arrange & Act
      const result = LegacyAppPaths.appListPath;

      // Assert
      expect(result).toBe("/apps/");
    });
  });
});
