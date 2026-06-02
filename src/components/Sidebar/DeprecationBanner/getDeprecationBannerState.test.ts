import { getDeprecationBannerState } from "./getDeprecationBannerState";

describe("getDeprecationBannerState", () => {
  const timestamp = "2026-09-01";

  it("shows the banner when connected version equals deprecated version", () => {
    // Arrange
    // Act
    const result = getDeprecationBannerState({
      deprecatedVersion: "3.20",
      deprecatedVersionTimestamp: timestamp,
      connectedVersion: "3.20.0",
    });

    // Assert
    expect(result).not.toBeNull();
    expect(result?.upgradeDate.toISOString()).toBe(new Date(timestamp).toISOString());
  });

  it("shows the banner when connected version is older than deprecated version", () => {
    // Arrange
    // Act
    const result = getDeprecationBannerState({
      deprecatedVersion: "3.20",
      deprecatedVersionTimestamp: timestamp,
      connectedVersion: "3.19.5",
    });

    // Assert
    expect(result).not.toBeNull();
  });

  it("shows the banner when connected major is older even if minor is higher", () => {
    // Arrange
    // Act
    const result = getDeprecationBannerState({
      deprecatedVersion: "3.5",
      deprecatedVersionTimestamp: timestamp,
      connectedVersion: "2.99.0",
    });

    // Assert
    expect(result).not.toBeNull();
  });

  it("does not show the banner when connected version is newer than deprecated version", () => {
    // Arrange
    // Act
    const result = getDeprecationBannerState({
      deprecatedVersion: "3.20",
      deprecatedVersionTimestamp: timestamp,
      connectedVersion: "3.21.0",
    });

    // Assert
    expect(result).toBeNull();
  });

  it("ignores patch and pre-release suffixes on the connected version", () => {
    // Arrange
    // Act
    const result = getDeprecationBannerState({
      deprecatedVersion: "3.21",
      deprecatedVersionTimestamp: timestamp,
      connectedVersion: "3.21.0a0",
    });

    // Assert
    expect(result).not.toBeNull();
  });

  it("drops the feature when the deprecated version is missing", () => {
    // Arrange
    // Act
    const result = getDeprecationBannerState({
      deprecatedVersion: undefined,
      deprecatedVersionTimestamp: timestamp,
      connectedVersion: "3.20.0",
    });

    // Assert
    expect(result).toBeNull();
  });

  it("drops the feature when the timestamp is missing", () => {
    // Arrange
    // Act
    const result = getDeprecationBannerState({
      deprecatedVersion: "3.20",
      deprecatedVersionTimestamp: undefined,
      connectedVersion: "3.20.0",
    });

    // Assert
    expect(result).toBeNull();
  });

  it("drops the feature when the connected version is missing", () => {
    // Arrange
    // Act
    const result = getDeprecationBannerState({
      deprecatedVersion: "3.20",
      deprecatedVersionTimestamp: timestamp,
      connectedVersion: undefined,
    });

    // Assert
    expect(result).toBeNull();
  });

  it.each(["3.20.0", "3", "v3.20", "3.x", "latest", "", "3."])(
    "drops the feature when the deprecated version env is invalid: %s",
    invalidVersion => {
      // Arrange
      // Act
      const result = getDeprecationBannerState({
        deprecatedVersion: invalidVersion,
        deprecatedVersionTimestamp: timestamp,
        connectedVersion: "3.20.0",
      });

      // Assert
      expect(result).toBeNull();
    },
  );

  it("drops the feature when the timestamp is not a valid date", () => {
    // Arrange
    // Act
    const result = getDeprecationBannerState({
      deprecatedVersion: "3.20",
      deprecatedVersionTimestamp: "not-a-date",
      connectedVersion: "3.20.0",
    });

    // Assert
    expect(result).toBeNull();
  });

  it("drops the feature when the connected version is unparseable", () => {
    // Arrange
    // Act
    const result = getDeprecationBannerState({
      deprecatedVersion: "3.20",
      deprecatedVersionTimestamp: timestamp,
      connectedVersion: "unknown",
    });

    // Assert
    expect(result).toBeNull();
  });

  it("accepts a full ISO timestamp and exposes it as the upgrade date", () => {
    // Arrange
    const isoTimestamp = "2026-09-01T12:30:00.000Z";

    // Act
    const result = getDeprecationBannerState({
      deprecatedVersion: "3.20",
      deprecatedVersionTimestamp: isoTimestamp,
      connectedVersion: "3.20.0",
    });

    // Assert
    expect(result?.upgradeDate.toISOString()).toBe(isoTimestamp);
  });
});
