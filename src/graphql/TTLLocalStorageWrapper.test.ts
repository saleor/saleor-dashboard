import { TTLLocalStorageWrapper } from "./TTLLocalStorageWrapper";

describe("TTLLocalStorageWrapper", () => {
  let storage: Storage;
  let wrapper: TTLLocalStorageWrapper;
  const cacheKey = "test-cache";
  const timestampKey = "test-cache-timestamp";
  const maxAge = 60 * 60 * 1000; // 1 hour

  beforeEach(() => {
    storage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      length: 0,
      clear: jest.fn(),
      key: jest.fn(),
    };
    wrapper = new TTLLocalStorageWrapper(storage, cacheKey, maxAge);
  });

  describe("getItem", () => {
    it("should return cached data when timestamp is fresh", () => {
      // Arrange
      const freshTimestamp = String(Date.now() - 1000); // 1 second ago

      (storage.getItem as jest.Mock)
        .mockReturnValueOnce(freshTimestamp) // timestamp key
        .mockReturnValueOnce('{"data":"value"}'); // cache key

      // Act
      const result = wrapper.getItem(cacheKey);

      // Assert
      expect(result).toBe('{"data":"value"}');
      expect(storage.removeItem).not.toHaveBeenCalled();
    });

    it("should return null and clear storage when cache is expired", () => {
      // Arrange
      const expiredTimestamp = String(Date.now() - maxAge - 1000); // 1h + 1s ago

      (storage.getItem as jest.Mock).mockReturnValueOnce(expiredTimestamp);

      // Act
      const result = wrapper.getItem(cacheKey);

      // Assert
      expect(result).toBeNull();
      expect(storage.removeItem).toHaveBeenCalledWith(cacheKey);
      expect(storage.removeItem).toHaveBeenCalledWith(timestampKey);
    });

    it("should return data when no timestamp exists", () => {
      // Arrange
      (storage.getItem as jest.Mock)
        .mockReturnValueOnce(null) // no timestamp
        .mockReturnValueOnce('{"data":"value"}'); // cache data exists

      // Act
      const result = wrapper.getItem(cacheKey);

      // Assert
      expect(result).toBe('{"data":"value"}');
      expect(storage.removeItem).not.toHaveBeenCalled();
    });
  });

  describe("setItem", () => {
    it("should write both data and timestamp", () => {
      // Arrange
      const now = Date.now();

      jest.spyOn(Date, "now").mockReturnValue(now);

      // Act
      wrapper.setItem(cacheKey, '{"data":"value"}');

      // Assert
      expect(storage.setItem).toHaveBeenCalledWith(cacheKey, '{"data":"value"}');
      expect(storage.setItem).toHaveBeenCalledWith(timestampKey, String(now));

      jest.restoreAllMocks();
    });

    it("should call removeItem when value is null", () => {
      // Act
      wrapper.setItem(cacheKey, null);

      // Assert
      expect(storage.setItem).not.toHaveBeenCalled();
      expect(storage.removeItem).toHaveBeenCalledWith(cacheKey);
      expect(storage.removeItem).toHaveBeenCalledWith(timestampKey);
    });
  });

  describe("removeItem", () => {
    it("should clear both cache and timestamp keys", () => {
      // Act
      wrapper.removeItem(cacheKey);

      // Assert
      expect(storage.removeItem).toHaveBeenCalledWith(cacheKey);
      expect(storage.removeItem).toHaveBeenCalledWith(timestampKey);
    });
  });
});
