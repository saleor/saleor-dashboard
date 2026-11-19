import { type Ripple } from "@dashboard/ripples/types";

import { RIPPLE_LIFETIME_DAYS, RipplesStorage } from "./useRipplesStorage";

// Polyfill for structuredClone in Node.js test environment in case older node is used
if (!global.structuredClone) {
  global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}

type StoredRipplesRecord = Record<
  string,
  {
    manuallyHidden: boolean;
    firstSeenAt: number;
  }
>;

// Mock ripples for testing
const mockRipple1: Ripple = {
  type: "feature",
  ID: "test-ripple-1",
  TTL_seconds: 3600, // 1 hour
  dateAdded: new Date("2023-01-01"),
  content: {
    oneLiner: "Test ripple 1",
    global: "Global content 1",
    contextual: "Contextual content 1",
  },
};

const mockRipple2: Ripple = {
  type: "improvement",
  ID: "test-ripple-2",
  TTL_seconds: 7200, // 2 hours
  dateAdded: new Date("2023-01-02"),
  content: {
    oneLiner: "Test ripple 2",
    global: "Global content 2",
    contextual: "Contextual content 2",
  },
};

const mockRipple3: Ripple = {
  type: "bugfix",
  ID: "test-ripple-3",
  TTL_seconds: 1800, // 30 minutes
  dateAdded: new Date("2023-01-03"),
  content: {
    oneLiner: "Test ripple 3",
    global: "Global content 3",
    contextual: "Contextual content 3",
  },
};

const mockAllRipples = [mockRipple1, mockRipple2, mockRipple3];

const DAY_MS = 24 * 60 * 60 * 1000;
const existingUserJoinedAt = new Date("2021-01-01T00:00:00Z");

describe("RipplesStorage", () => {
  let mockUpdateState: jest.Mock;
  let storage: RipplesStorage;
  // A few days after the mock ripples were released, within their lifetime.
  const currentTime = new Date("2023-01-05T00:00:00Z").getTime();

  const resolveUpdate = (prev: StoredRipplesRecord = {}): StoredRipplesRecord => {
    expect(mockUpdateState).toHaveBeenCalled();

    const updater = mockUpdateState.mock.calls[mockUpdateState.mock.calls.length - 1][0];

    return typeof updater === "function" ? updater(prev) : updater;
  };

  beforeEach(() => {
    mockUpdateState = jest.fn();
    storage = new RipplesStorage({}, mockUpdateState, mockAllRipples, existingUserJoinedAt);

    jest.useFakeTimers();
    jest.setSystemTime(currentTime);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("getShouldShow", () => {
    // Arrange
    it("should return true for new ripple", () => {
      // Act
      const result = storage.getShouldShow(mockRipple1);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for manually hidden ripple", () => {
      // Arrange
      const storageWithHiddenRipple = new RipplesStorage(
        {
          [mockRipple1.ID]: {
            manuallyHidden: true,
            firstSeenAt: currentTime - 1000,
          },
        },
        mockUpdateState,
        mockAllRipples,
        existingUserJoinedAt,
      );

      // Act
      const result = storageWithHiddenRipple.getShouldShow(mockRipple1);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for stale ripple", () => {
      // Arrange
      const staleTime = currentTime - mockRipple1.TTL_seconds * 1000 - 100000; // TTL in ms + 100 seconds ago
      const storageWithStaleRipple = new RipplesStorage(
        {
          [mockRipple1.ID]: {
            manuallyHidden: false,
            firstSeenAt: staleTime,
          },
        },
        mockUpdateState,
        mockAllRipples,
        existingUserJoinedAt,
      );

      // Act
      const result = storageWithStaleRipple.getShouldShow(mockRipple1);

      // Assert
      expect(result).toBe(false);
    });

    it("should return true for ripple within TTL", () => {
      // Arrange
      const recentTime = currentTime - mockRipple1.TTL_seconds * 1000 + 100000; // TTL in ms - 100 seconds ago
      const storageWithRecentRipple = new RipplesStorage(
        {
          [mockRipple1.ID]: {
            manuallyHidden: false,
            firstSeenAt: recentTime,
          },
        },
        mockUpdateState,
        mockAllRipples,
        existingUserJoinedAt,
      );

      // Act
      const result = storageWithRecentRipple.getShouldShow(mockRipple1);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true for ripple that was never seen before", () => {
      // Arrange
      const storageWithOtherRipples = new RipplesStorage(
        {
          [mockRipple2.ID]: {
            manuallyHidden: false,
            firstSeenAt: currentTime - 1000,
          },
        },
        mockUpdateState,
        mockAllRipples,
        existingUserJoinedAt,
      );

      // Act
      const result = storageWithOtherRipples.getShouldShow(mockRipple1);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("getShouldShow within the release lifetime", () => {
    const daysAgo = (days: number): Date => new Date(currentTime - days * DAY_MS);
    const releasedRipple = (releasedDaysAgo: number): Ripple => ({
      ...mockRipple1,
      dateAdded: daysAgo(releasedDaysAgo),
    });
    const storageFor = (userJoinedAt: Date | undefined): RipplesStorage =>
      new RipplesStorage({}, mockUpdateState, mockAllRipples, userJoinedAt);

    it("shows a recent ripple to a user who joined before the release", () => {
      // Arrange
      const ripple = releasedRipple(1);

      // Act
      const result = storageFor(existingUserJoinedAt).getShouldShow(ripple);

      // Assert
      expect(result).toBe(true);
    });

    it("hides the ripple from a user who joined after the release", () => {
      // Arrange
      const ripple = releasedRipple(1);

      // Act
      const result = storageFor(daysAgo(0.5)).getShouldShow(ripple);

      // Assert
      expect(result).toBe(false);
    });

    it("shows the ripple to a user who joined just before the release", () => {
      // Arrange
      const ripple = releasedRipple(1);

      // Act
      const result = storageFor(daysAgo(1.5)).getShouldShow(ripple);

      // Assert
      expect(result).toBe(true);
    });

    it("shows the ripple on the last day of its lifetime", () => {
      // Arrange
      const ripple = releasedRipple(RIPPLE_LIFETIME_DAYS - 1);

      // Act
      const result = storageFor(existingUserJoinedAt).getShouldShow(ripple);

      // Assert
      expect(result).toBe(true);
    });

    it("hides the ripple once its lifetime has passed", () => {
      // Arrange
      const ripple = releasedRipple(RIPPLE_LIFETIME_DAYS + 1);

      // Act
      const result = storageFor(existingUserJoinedAt).getShouldShow(ripple);

      // Assert
      expect(result).toBe(false);
    });

    it("hides the ripple while the user is not loaded", () => {
      // Arrange
      const ripple = releasedRipple(1);

      // Act
      const result = storageFor(undefined).getShouldShow(ripple);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("setFirstSeenFlag", () => {
    it("should set first seen timestamp for new ripple", () => {
      // Arrange & Act
      storage.setFirstSeenFlag(mockRipple1);

      // Assert
      expect(resolveUpdate({})).toEqual({
        [mockRipple1.ID]: {
          firstSeenAt: currentTime,
        },
      });
    });

    it("should not override existing first seen timestamp", () => {
      // Arrange
      const existingTime = currentTime - 1000;
      const existingState = {
        [mockRipple1.ID]: {
          manuallyHidden: false,
          firstSeenAt: existingTime,
        },
      };
      const storageWithExistingRipple = new RipplesStorage(
        existingState,
        mockUpdateState,
        mockAllRipples,
        existingUserJoinedAt,
      );

      // Act
      storageWithExistingRipple.setFirstSeenFlag(mockRipple1);

      // Assert — updater is called but returns the same prev reference
      expect(resolveUpdate(existingState)).toBe(existingState);
    });

    it("should preserve existing manuallyHidden flag when setting first seen", () => {
      // Arrange
      const prev = {
        [mockRipple1.ID]: {
          manuallyHidden: true,
          firstSeenAt: undefined as any,
        },
      };
      const storageWithPartialData = new RipplesStorage(
        prev,
        mockUpdateState,
        mockAllRipples,
        existingUserJoinedAt,
      );

      // Act
      storageWithPartialData.setFirstSeenFlag(mockRipple1);

      // Assert
      expect(resolveUpdate(prev)).toEqual({
        [mockRipple1.ID]: {
          manuallyHidden: true,
          firstSeenAt: currentTime,
        },
      });
    });
  });

  describe("setManuallyHidden", () => {
    it("should set manually hidden flag for new ripple", () => {
      // Arrange & Act
      storage.setManuallyHidden(mockRipple1);

      // Assert
      expect(resolveUpdate({})).toEqual({
        [mockRipple1.ID]: {
          manuallyHidden: true,
        },
      });
    });

    it("should set manually hidden flag for existing ripple", () => {
      // Arrange
      const existingTime = currentTime - 1000;
      const prev = {
        [mockRipple1.ID]: {
          manuallyHidden: false,
          firstSeenAt: existingTime,
        },
      };
      const storageWithExistingRipple = new RipplesStorage(
        prev,
        mockUpdateState,
        mockAllRipples,
        existingUserJoinedAt,
      );

      // Act
      storageWithExistingRipple.setManuallyHidden(mockRipple1);

      // Assert
      expect(resolveUpdate(prev)).toEqual({
        [mockRipple1.ID]: {
          manuallyHidden: true,
          firstSeenAt: existingTime,
        },
      });
    });

    it("should preserve other ripples data when setting one as hidden", () => {
      // Arrange
      const existingData = {
        [mockRipple1.ID]: {
          manuallyHidden: false,
          firstSeenAt: currentTime - 1000,
        },
        [mockRipple2.ID]: {
          manuallyHidden: true,
          firstSeenAt: currentTime - 2000,
        },
      };
      const storageWithMultipleRipples = new RipplesStorage(
        existingData,
        mockUpdateState,
        mockAllRipples,
        existingUserJoinedAt,
      );

      // Act
      storageWithMultipleRipples.setManuallyHidden(mockRipple1);

      // Assert
      expect(resolveUpdate(existingData)).toEqual({
        [mockRipple1.ID]: {
          manuallyHidden: true,
          firstSeenAt: currentTime - 1000,
        },
        [mockRipple2.ID]: {
          manuallyHidden: true,
          firstSeenAt: currentTime - 2000,
        },
      });
    });
  });

  describe("hideAllRipples", () => {
    it("should hide all ripples from injected allRipples array", () => {
      // Arrange & Act
      storage.hideAllRipples();

      // Assert
      expect(resolveUpdate({})).toEqual({
        [mockRipple1.ID]: { manuallyHidden: true },
        [mockRipple2.ID]: { manuallyHidden: true },
        [mockRipple3.ID]: { manuallyHidden: true },
      });
    });

    it("should preserve existing data when hiding all ripples", () => {
      // Arrange
      const existingTime = currentTime - 1000;
      const prev = {
        [mockRipple1.ID]: {
          manuallyHidden: false,
          firstSeenAt: existingTime,
        },
      };
      const storageWithExistingData = new RipplesStorage(
        prev,
        mockUpdateState,
        mockAllRipples,
        existingUserJoinedAt,
      );

      // Act
      storageWithExistingData.hideAllRipples();

      // Assert
      expect(resolveUpdate(prev)).toEqual({
        [mockRipple1.ID]: {
          manuallyHidden: true,
          firstSeenAt: existingTime,
        },
        [mockRipple2.ID]: { manuallyHidden: true },
        [mockRipple3.ID]: { manuallyHidden: true },
      });
    });

    it("should work with empty allRipples array", () => {
      // Arrange
      const storageWithNoRipples = new RipplesStorage(
        {},
        mockUpdateState,
        [],
        existingUserJoinedAt,
      );

      // Act
      storageWithNoRipples.hideAllRipples();

      // Assert
      expect(resolveUpdate({})).toEqual({});
    });

    it("should handle ripples that already exist in storage", () => {
      // Arrange
      const existingData = {
        [mockRipple1.ID]: {
          manuallyHidden: true,
          firstSeenAt: currentTime - 1000,
        },
        [mockRipple2.ID]: {
          manuallyHidden: false,
          firstSeenAt: currentTime - 2000,
        },
        // mockRipple3 doesn't exist in storage yet
      };
      const storageWithMixedData = new RipplesStorage(
        existingData,
        mockUpdateState,
        mockAllRipples,
        existingUserJoinedAt,
      );

      // Act
      storageWithMixedData.hideAllRipples();

      // Assert
      expect(resolveUpdate(existingData)).toEqual({
        [mockRipple1.ID]: {
          manuallyHidden: true,
          firstSeenAt: currentTime - 1000,
        },
        [mockRipple2.ID]: {
          manuallyHidden: true,
          firstSeenAt: currentTime - 2000,
        },
        [mockRipple3.ID]: { manuallyHidden: true },
      });
    });
  });

  describe("state immutability", () => {
    it("should not mutate original stored state in setFirstSeenFlag", () => {
      // Arrange
      const originalState = {};
      const storageWithOriginalState = new RipplesStorage(
        originalState,
        mockUpdateState,
        mockAllRipples,
        existingUserJoinedAt,
      );

      // Act
      storageWithOriginalState.setFirstSeenFlag(mockRipple1);

      // Assert
      expect(originalState).toEqual({});
      expect(resolveUpdate({})).toEqual({
        [mockRipple1.ID]: {
          firstSeenAt: currentTime,
        },
      });
    });

    it("should not mutate original stored state in setManuallyHidden", () => {
      // Arrange
      const originalState = {
        [mockRipple1.ID]: {
          manuallyHidden: false,
          firstSeenAt: currentTime - 1000,
        },
      };
      const storageWithOriginalState = new RipplesStorage(
        originalState,
        mockUpdateState,
        mockAllRipples,
        existingUserJoinedAt,
      );

      // Act
      storageWithOriginalState.setManuallyHidden(mockRipple1);

      // Assert
      expect(originalState[mockRipple1.ID].manuallyHidden).toBe(false);
    });

    it("should not mutate original stored state in hideAllRipples", () => {
      // Arrange
      const originalState = {
        [mockRipple1.ID]: {
          manuallyHidden: false,
          firstSeenAt: currentTime - 1000,
        },
      };
      const storageWithOriginalState = new RipplesStorage(
        originalState,
        mockUpdateState,
        mockAllRipples,
        existingUserJoinedAt,
      );

      // Act
      storageWithOriginalState.hideAllRipples();

      // Assert
      expect(originalState[mockRipple1.ID].manuallyHidden).toBe(false);
    });
  });
});
