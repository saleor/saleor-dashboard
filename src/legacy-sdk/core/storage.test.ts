import { SALEOR_AUTH_PLUGIN_ID, SALEOR_REFRESH_TOKEN } from "./constants";
import { createStorage, storage } from "./storage";

describe("legacy-sdk storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("createStorage with autologin enabled", () => {
    it("initializes refreshToken from localStorage when autologin is enabled", () => {
      // Arrange
      localStorage.setItem(SALEOR_REFRESH_TOKEN, "stored-refresh-token");

      // Act
      createStorage(true);

      // Assert
      expect(storage.getRefreshToken()).toBe("stored-refresh-token");
    });

    it("initializes authPluginId from localStorage", () => {
      // Arrange
      localStorage.setItem(SALEOR_AUTH_PLUGIN_ID, "plugin-id");

      // Act
      createStorage(true);

      // Assert
      expect(storage.getAuthPluginId()).toBe("plugin-id");
    });

    it("initializes accessToken as null", () => {
      // Arrange & Act
      createStorage(true);

      // Assert
      expect(storage.getAccessToken()).toBeNull();
    });
  });

  describe("createStorage with autologin disabled", () => {
    it("does NOT initialize refreshToken from localStorage when autologin is disabled", () => {
      // Arrange
      localStorage.setItem(SALEOR_REFRESH_TOKEN, "stored-refresh-token");

      // Act
      createStorage(false);

      // Assert
      expect(storage.getRefreshToken()).toBeNull();
    });

    it("initializes authPluginId from localStorage regardless of autologin", () => {
      // Arrange
      localStorage.setItem(SALEOR_AUTH_PLUGIN_ID, "plugin-id");

      // Act
      createStorage(false);

      // Assert
      expect(storage.getAuthPluginId()).toBe("plugin-id");
    });

    it("initializes accessToken as null", () => {
      // Arrange & Act
      createStorage(false);

      // Assert
      expect(storage.getAccessToken()).toBeNull();
    });
  });

  describe("setAccessToken / getAccessToken", () => {
    beforeEach(() => {
      createStorage(false);
    });

    it("stores and retrieves an access token", () => {
      // Arrange
      const token = "access-token-123";

      // Act
      storage.setAccessToken(token);

      // Assert
      expect(storage.getAccessToken()).toBe(token);
    });

    it("clears access token when set to null", () => {
      // Arrange
      storage.setAccessToken("access-token-123");

      // Act
      storage.setAccessToken(null);

      // Assert
      expect(storage.getAccessToken()).toBeNull();
    });

    it("does not persist access token to localStorage", () => {
      // Arrange & Act
      storage.setAccessToken("access-token-123");

      // Assert
      expect(localStorage.getItem("accessToken")).toBeNull();
    });
  });

  describe("setRefreshToken / getRefreshToken", () => {
    beforeEach(() => {
      createStorage(false);
    });

    it("stores and retrieves a refresh token", () => {
      // Arrange
      const token = "refresh-token-456";

      // Act
      storage.setRefreshToken(token);

      // Assert
      expect(storage.getRefreshToken()).toBe(token);
    });

    it("persists refresh token to localStorage", () => {
      // Arrange
      const token = "refresh-token-456";

      // Act
      storage.setRefreshToken(token);

      // Assert
      expect(localStorage.getItem(SALEOR_REFRESH_TOKEN)).toBe(token);
    });

    it("removes refresh token from localStorage when set to null", () => {
      // Arrange
      storage.setRefreshToken("refresh-token-456");

      // Act
      storage.setRefreshToken(null);

      // Assert
      expect(storage.getRefreshToken()).toBeNull();
      expect(localStorage.getItem(SALEOR_REFRESH_TOKEN)).toBeNull();
    });
  });

  describe("setAuthPluginId / getAuthPluginId", () => {
    beforeEach(() => {
      createStorage(false);
    });

    it("stores and retrieves auth plugin id", () => {
      // Arrange
      const pluginId = "mirumee.authentication.openidconnect";

      // Act
      storage.setAuthPluginId(pluginId);

      // Assert
      expect(storage.getAuthPluginId()).toBe(pluginId);
    });

    it("persists auth plugin id to localStorage", () => {
      // Arrange
      const pluginId = "mirumee.authentication.openidconnect";

      // Act
      storage.setAuthPluginId(pluginId);

      // Assert
      expect(localStorage.getItem(SALEOR_AUTH_PLUGIN_ID)).toBe(pluginId);
    });

    it("removes auth plugin id from localStorage when set to null", () => {
      // Arrange
      storage.setAuthPluginId("some-plugin");

      // Act
      storage.setAuthPluginId(null);

      // Assert
      expect(storage.getAuthPluginId()).toBeNull();
      expect(localStorage.getItem(SALEOR_AUTH_PLUGIN_ID)).toBeNull();
    });
  });

  describe("setTokens", () => {
    beforeEach(() => {
      createStorage(false);
    });

    it("sets both access and refresh tokens", () => {
      // Arrange
      const tokens = {
        accessToken: "access-123",
        refreshToken: "refresh-456",
      };

      // Act
      storage.setTokens(tokens);

      // Assert
      expect(storage.getAccessToken()).toBe("access-123");
      expect(storage.getRefreshToken()).toBe("refresh-456");
      expect(localStorage.getItem(SALEOR_REFRESH_TOKEN)).toBe("refresh-456");
    });

    it("clears both tokens when set to null", () => {
      // Arrange
      storage.setTokens({
        accessToken: "access-123",
        refreshToken: "refresh-456",
      });

      // Act
      storage.setTokens({
        accessToken: null,
        refreshToken: null,
      });

      // Assert
      expect(storage.getAccessToken()).toBeNull();
      expect(storage.getRefreshToken()).toBeNull();
      expect(localStorage.getItem(SALEOR_REFRESH_TOKEN)).toBeNull();
    });
  });

  describe("clear", () => {
    it("removes all tokens from memory and localStorage", () => {
      // Arrange
      createStorage(false);
      storage.setAuthPluginId("plugin-id");
      storage.setAccessToken("access-token");
      storage.setRefreshToken("refresh-token");

      // Act
      storage.clear();

      // Assert
      expect(storage.getAuthPluginId()).toBeNull();
      expect(storage.getAccessToken()).toBeNull();
      expect(storage.getRefreshToken()).toBeNull();
      expect(localStorage.getItem(SALEOR_AUTH_PLUGIN_ID)).toBeNull();
      expect(localStorage.getItem(SALEOR_REFRESH_TOKEN)).toBeNull();
    });

    it("works when tokens were never set", () => {
      // Arrange
      createStorage(false);

      // Act
      storage.clear();

      // Assert
      expect(storage.getAuthPluginId()).toBeNull();
      expect(storage.getAccessToken()).toBeNull();
      expect(storage.getRefreshToken()).toBeNull();
    });
  });

  describe("re-initialization", () => {
    it("resets in-memory state when createStorage is called again", () => {
      // Arrange
      createStorage(false);
      storage.setAccessToken("old-access-token");
      storage.setRefreshToken("old-refresh-token");

      // Act
      createStorage(false);

      // Assert
      expect(storage.getAccessToken()).toBeNull();
      expect(storage.getRefreshToken()).toBeNull();
    });

    it("picks up localStorage values on re-initialization with autologin", () => {
      // Arrange
      createStorage(false);
      storage.setRefreshToken("persisted-token");
      storage.setAuthPluginId("persisted-plugin");

      // Act
      createStorage(true);

      // Assert
      expect(storage.getRefreshToken()).toBe("persisted-token");
      expect(storage.getAuthPluginId()).toBe("persisted-plugin");
      expect(storage.getAccessToken()).toBeNull();
    });
  });
});
