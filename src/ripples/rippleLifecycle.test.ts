import { isRippleWithinLifecycle, RIPPLE_LIFETIME_DAYS } from "@dashboard/ripples/rippleLifecycle";
import { type Ripple } from "@dashboard/ripples/types";

const DAY_MS = 24 * 60 * 60 * 1000;
const releasedAt = new Date("2026-11-01T00:00:00Z");

const ripple: Ripple = {
  type: "feature",
  ID: "lifecycle-test",
  TTL_seconds: 3600,
  dateAdded: releasedAt,
  content: {
    oneLiner: "Lifecycle test",
    global: "Global content",
    contextual: "Contextual content",
  },
};

const daysAfterRelease = (days: number): Date => new Date(releasedAt.getTime() + days * DAY_MS);
const existingUserJoinedAt = new Date("2026-01-01T00:00:00Z");

describe("isRippleWithinLifecycle", () => {
  it("shows a recent ripple to a user who joined before the release", () => {
    // Arrange
    const context = { now: daysAfterRelease(1), userJoinedAt: existingUserJoinedAt };

    // Act
    const result = isRippleWithinLifecycle(ripple, context);

    // Assert
    expect(result).toBe(true);
  });

  it("hides the ripple from a user who joined after the release", () => {
    // Arrange
    const context = { now: daysAfterRelease(1), userJoinedAt: daysAfterRelease(0.5) };

    // Act
    const result = isRippleWithinLifecycle(ripple, context);

    // Assert
    expect(result).toBe(false);
  });

  it("shows the ripple to a user who joined just before the release", () => {
    // Arrange
    const context = { now: daysAfterRelease(1), userJoinedAt: daysAfterRelease(-0.5) };

    // Act
    const result = isRippleWithinLifecycle(ripple, context);

    // Assert
    expect(result).toBe(true);
  });

  it("shows the ripple on the last day of its lifetime", () => {
    // Arrange
    const context = {
      now: daysAfterRelease(RIPPLE_LIFETIME_DAYS - 1),
      userJoinedAt: existingUserJoinedAt,
    };

    // Act
    const result = isRippleWithinLifecycle(ripple, context);

    // Assert
    expect(result).toBe(true);
  });

  it("hides the ripple once its lifetime has passed", () => {
    // Arrange
    const context = {
      now: daysAfterRelease(RIPPLE_LIFETIME_DAYS + 1),
      userJoinedAt: existingUserJoinedAt,
    };

    // Act
    const result = isRippleWithinLifecycle(ripple, context);

    // Assert
    expect(result).toBe(false);
  });

  it("hides the ripple while the user is not loaded", () => {
    // Arrange
    const context = { now: daysAfterRelease(1), userJoinedAt: undefined };

    // Act
    const result = isRippleWithinLifecycle(ripple, context);

    // Assert
    expect(result).toBe(false);
  });
});
