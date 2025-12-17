import { createMemoryHistory, History } from "history";

import { FilterElement } from "../FilterElement";
import { createFilterStore, FilterStore, FilterStoreConfig } from "./FilterStore";

// Mock the TokenArray to avoid complex URL parsing in unit tests
jest.mock("../ValueProvider/TokenArray", () => {
  return {
    TokenArray: jest.fn().mockImplementation((urlString: string) => {
      // Parse simple key=value pairs from URL
      const params = new URLSearchParams(urlString);
      const tokens: Array<{ name: string; value: string }> = [];

      params.forEach((value, key) => {
        // Simple token format: s0.fieldName=value
        const match = key.match(/^s\d+\.(.+)$/);

        if (match) {
          tokens.push({ name: match[1], value });
        }
      });

      return {
        asFilterValuesFromResponse: jest.fn().mockReturnValue([]),
        asFilterValueFromEmpty: jest.fn().mockReturnValue([]),
        asFlatArray: jest.fn().mockReturnValue(tokens),
        getFetchingParams: jest.fn().mockReturnValue({
          category: [],
          collection: [],
          channel: [],
          productType: [],
          attribute: {},
          attributeReference: {},
        }),
      };
    }),
  };
});

jest.mock("../ValueProvider/TokenArray/fetchingParams", () => ({
  getEmptyFetchingPrams: jest.fn().mockReturnValue({
    category: [],
    collection: [],
    channel: [],
    productType: [],
    attribute: {},
    attributeReference: {},
  }),
}));

describe("FilterStore", () => {
  let history: History;
  let store: FilterStore;

  const createStore = (overrides: Partial<FilterStoreConfig> = {}): FilterStore => {
    return createFilterStore({
      history,
      location: history.location,
      type: "product",
      ...overrides,
    });
  };

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ["/products?activeTab=all"],
    });
  });

  afterEach(() => {
    store?.dispose();
  });

  describe("subscribe", () => {
    it("should add listener and return unsubscribe function", () => {
      // Arrange
      store = createStore();

      const listener = jest.fn();

      // Act
      const unsubscribe = store.subscribe(listener);

      // Assert
      expect(typeof unsubscribe).toBe("function");
    });

    it("should notify listeners when URL changes", () => {
      // Arrange
      store = createStore();

      const listener = jest.fn();

      store.subscribe(listener);

      // Act
      history.push("/products?s0.status=ACTIVE");

      // Assert
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("should not notify after unsubscribe", () => {
      // Arrange
      store = createStore();

      const listener = jest.fn();
      const unsubscribe = store.subscribe(listener);

      // Act
      unsubscribe();
      history.push("/products?s0.status=ACTIVE");

      // Assert
      expect(listener).not.toHaveBeenCalled();
    });

    it("should support multiple listeners", () => {
      // Arrange
      store = createStore();

      const listener1 = jest.fn();
      const listener2 = jest.fn();

      store.subscribe(listener1);
      store.subscribe(listener2);

      // Act
      history.push("/products?s0.status=ACTIVE");

      // Assert
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe("getSnapshot", () => {
    it("should return empty array when no filters in URL", () => {
      // Arrange
      store = createStore();

      // Act
      const snapshot = store.getSnapshot();

      // Assert
      expect(snapshot).toEqual([]);
    });

    it("should return cached snapshot on subsequent calls without URL change", () => {
      // Arrange
      store = createStore();

      // Act
      const snapshot1 = store.getSnapshot();
      const snapshot2 = store.getSnapshot();

      // Assert
      expect(snapshot1).toBe(snapshot2); // Same reference (cached)
    });
  });

  describe("getLoading", () => {
    it("should return false when no initialState provided", () => {
      // Arrange
      store = createStore();

      // Act & Assert
      expect(store.getLoading()).toBe(false);
    });

    it("should return loading state from initialState", () => {
      // Arrange
      const mockInitialState = {
        data: {},
        loading: true,
        fetchQueries: jest.fn(),
      };

      store = createStore({ initialState: mockInitialState as any });

      // Act & Assert
      expect(store.getLoading()).toBe(true);
    });
  });

  describe("persist", () => {
    it("should update URL with filter structure", () => {
      // Arrange
      store = createStore();

      const mockFilterValue = [
        {
          asUrlEntry: () => ({ "s0.status": "ACTIVE" }),
        },
      ] as any;

      // Act
      store.persist(mockFilterValue);

      // Assert
      // URL encoding converts dots to nested objects, so check for the encoded form
      const search = decodeURIComponent(history.location.search);

      expect(search).toContain("s0.status");
      expect(search).toContain("ACTIVE");
    });

    it("should preserve existing params like activeTab", () => {
      // Arrange
      history = createMemoryHistory({
        initialEntries: ["/products?activeTab=all&query=test"],
      });
      store = createStore();

      const mockFilterValue = [
        {
          asUrlEntry: () => ({ "s0.status": "ACTIVE" }),
        },
      ] as any;

      // Act
      store.persist(mockFilterValue);

      // Assert
      expect(history.location.search).toContain("activeTab=all");
      expect(history.location.search).toContain("query=test");
    });

    it("should notify listeners after persist", () => {
      // Arrange
      store = createStore();

      const listener = jest.fn();

      store.subscribe(listener);

      // Act
      store.persist([]);

      // Assert
      expect(listener).toHaveBeenCalled();
    });
  });

  describe("clear", () => {
    it("should remove all filter params from URL", () => {
      // Arrange
      history = createMemoryHistory({
        initialEntries: ["/products?s0.status=ACTIVE&activeTab=all"],
      });
      store = createStore();

      // Act
      store.clear();

      // Assert
      expect(history.location.search).not.toContain("s0.status");
    });

    it("should preserve non-filter params", () => {
      // Arrange
      history = createMemoryHistory({
        initialEntries: ["/products?s0.status=ACTIVE&activeTab=all"],
      });
      store = createStore();

      // Act
      store.clear();

      // Assert
      expect(history.location.search).toContain("activeTab=all");
    });

    it("should notify listeners after clear", () => {
      // Arrange
      store = createStore();

      const listener = jest.fn();

      store.subscribe(listener);

      // Act
      store.clear();

      // Assert
      expect(listener).toHaveBeenCalled();
    });
  });

  describe("isPersisted", () => {
    it("should return false for non-persisted element", () => {
      // Arrange
      store = createStore();

      const mockElement = {
        equals: jest.fn().mockReturnValue(false),
      } as unknown as FilterElement;

      // Act
      const result = store.isPersisted(mockElement);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("getTokenByName", () => {
    it("should return undefined when token not found", () => {
      // Arrange
      store = createStore();

      // Act
      const token = store.getTokenByName("nonexistent");

      // Assert
      expect(token).toBeUndefined();
    });
  });

  describe("getCount", () => {
    it("should return 0 for empty snapshot", () => {
      // Arrange
      store = createStore();

      // Act
      const count = store.getCount();

      // Assert
      expect(count).toBe(0);
    });
  });

  describe("getFetchingParams", () => {
    it("should return fetching params from token array", () => {
      // Arrange
      store = createStore();

      // Act
      const params = store.getFetchingParams();

      // Assert
      expect(params).toBeDefined();
      expect(params).toHaveProperty("category");
      expect(params).toHaveProperty("collection");
    });
  });

  describe("dispose", () => {
    it("should stop listening to history changes", () => {
      // Arrange
      store = createStore();

      const listener = jest.fn();

      store.subscribe(listener);

      // Act
      store.dispose();
      history.push("/products?new=value");

      // Assert
      expect(listener).not.toHaveBeenCalled();
    });

    it("should clear all listeners", () => {
      // Arrange
      store = createStore();

      const listener = jest.fn();

      store.subscribe(listener);
      store.dispose();

      // Act - try to trigger via internal mechanism (shouldn't happen after dispose)
      history.push("/products?test=1");

      // Assert
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("history navigation", () => {
    it("should handle browser back navigation", () => {
      // Arrange
      history = createMemoryHistory({
        initialEntries: ["/products", "/products?s0.status=ACTIVE"],
        initialIndex: 1,
      });
      store = createStore();

      const listener = jest.fn();

      store.subscribe(listener);

      // Act - history v4/v5 uses go(-1) instead of back()
      history.go(-1);

      // Assert
      expect(listener).toHaveBeenCalled();
    });

    it("should handle browser forward navigation", () => {
      // Arrange
      history = createMemoryHistory({
        initialEntries: ["/products", "/products?s0.status=ACTIVE"],
        initialIndex: 0,
      });
      store = createStore();

      const listener = jest.fn();

      store.subscribe(listener);

      // Act - history v4/v5 uses go(1) instead of forward()
      history.go(1);

      // Assert
      expect(listener).toHaveBeenCalled();
    });
  });
});
