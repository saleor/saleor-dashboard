import { isExternalAppUrl } from "./isExternalAppUrl";

const setCloudDomain = (value: string | undefined): void => {
  window.__SALEOR_CONFIG__ = { ...window.__SALEOR_CONFIG__, SALEOR_CLOUD_APP_DOMAIN: value };
};

describe("isExternalAppUrl", () => {
  const originalConfig = window.__SALEOR_CONFIG__;

  afterEach(() => {
    window.__SALEOR_CONFIG__ = originalConfig;
  });

  it("returns true when cloud domain env var is not set", () => {
    // Arrange
    setCloudDomain(undefined);

    // Act
    const result = isExternalAppUrl("https://anything.example.com/widget");

    // Assert
    expect(result).toBe(true);
  });

  it("returns true when cloud domain env var is empty string", () => {
    // Arrange
    setCloudDomain("");

    // Act
    const result = isExternalAppUrl("https://app.saleor.app/widget");

    // Assert
    expect(result).toBe(true);
  });

  it("returns false for URL hosted exactly on the cloud domain", () => {
    // Arrange
    setCloudDomain("saleor.app");

    // Act
    const result = isExternalAppUrl("https://saleor.app/widget");

    // Assert
    expect(result).toBe(false);
  });

  it("returns false for URL hosted on a subdomain of the cloud domain", () => {
    // Arrange
    setCloudDomain("saleor.app");

    // Act
    const result = isExternalAppUrl("https://my-app.saleor.app/widget");

    // Assert
    expect(result).toBe(false);
  });

  it("returns true for URL hosted outside the cloud domain", () => {
    // Arrange
    setCloudDomain("saleor.app");

    // Act
    const result = isExternalAppUrl("https://example.com/widget");

    // Assert
    expect(result).toBe(true);
  });

  it("does not match a domain that merely ends with the cloud domain string", () => {
    // Arrange
    setCloudDomain("saleor.app");

    // Act - "evilsaleor.app" must not be treated as a subdomain of "saleor.app"
    const result = isExternalAppUrl("https://evilsaleor.app/widget");

    // Assert
    expect(result).toBe(true);
  });

  it("returns true when URL cannot be parsed", () => {
    // Arrange
    setCloudDomain("saleor.app");

    // Act
    const result = isExternalAppUrl("not-a-url");

    // Assert
    expect(result).toBe(true);
  });
});
