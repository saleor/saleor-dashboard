import { act, renderHook } from "@testing-library/react-hooks";

import { FilterStore } from "./FilterStore";
import {
  useFilterCount,
  useFilterLoading,
  useFilterValue,
  useFilterValueProvider,
} from "./useFilterStore";

describe("useFilterStore hooks", () => {
  const createMockStore = (overrides: Partial<FilterStore> = {}): FilterStore => {
    const listeners = new Set<() => void>();

    return {
      subscribe: jest.fn((callback: () => void) => {
        listeners.add(callback);

        return () => listeners.delete(callback);
      }),
      getSnapshot: jest.fn().mockReturnValue([]),
      getLoading: jest.fn().mockReturnValue(false),
      getCount: jest.fn().mockReturnValue(0),
      persist: jest.fn(),
      clear: jest.fn(),
      isPersisted: jest.fn().mockReturnValue(false),
      getTokenByName: jest.fn().mockReturnValue(undefined),
      getFetchingParams: jest.fn().mockReturnValue(null),
      dispose: jest.fn(),
      // Helper to trigger updates in tests
      _notifyListeners: () => listeners.forEach(l => l()),
      ...overrides,
    } as FilterStore & { _notifyListeners: () => void };
  };

  describe("useFilterValue", () => {
    it("should return snapshot from store", () => {
      // Arrange
      const mockValue = [{ type: "filter" }] as any;
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue(mockValue),
      });

      // Act
      const { result } = renderHook(() => useFilterValue(store));

      // Assert
      expect(result.current).toBe(mockValue);
      expect(store.getSnapshot).toHaveBeenCalled();
    });

    it("should subscribe to store on mount", () => {
      // Arrange
      const store = createMockStore();

      // Act
      renderHook(() => useFilterValue(store));

      // Assert
      expect(store.subscribe).toHaveBeenCalled();
    });

    it("should update when store notifies", () => {
      // Arrange
      const store = createMockStore() as FilterStore & { _notifyListeners: () => void };
      const { result, rerender } = renderHook(() => useFilterValue(store));

      // Change the mock return value
      (store.getSnapshot as jest.Mock).mockReturnValue([{ updated: true }]);

      // Act
      act(() => {
        store._notifyListeners();
      });
      rerender();

      // Assert
      expect(result.current).toEqual([{ updated: true }]);
    });
  });

  describe("useFilterLoading", () => {
    it("should return loading state from store", () => {
      // Arrange
      const store = createMockStore({
        getLoading: jest.fn().mockReturnValue(true),
      });

      // Act
      const { result } = renderHook(() => useFilterLoading(store));

      // Assert
      expect(result.current).toBe(true);
    });

    it("should return false when not loading", () => {
      // Arrange
      const store = createMockStore({
        getLoading: jest.fn().mockReturnValue(false),
      });

      // Act
      const { result } = renderHook(() => useFilterLoading(store));

      // Assert
      expect(result.current).toBe(false);
    });
  });

  describe("useFilterCount", () => {
    it("should return count from store", () => {
      // Arrange
      const store = createMockStore({
        getCount: jest.fn().mockReturnValue(5),
      });

      // Act
      const { result } = renderHook(() => useFilterCount(store));

      // Assert
      expect(result.current).toBe(5);
    });
  });

  describe("useFilterValueProvider", () => {
    it("should return FilterValueProvider interface", () => {
      // Arrange
      const mockValue = [{ type: "filter" }] as any;
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue(mockValue),
        getLoading: jest.fn().mockReturnValue(false),
        getCount: jest.fn().mockReturnValue(1),
      });

      // Act
      const { result } = renderHook(() => useFilterValueProvider(store));

      // Assert
      expect(result.current.value).toBe(mockValue);
      expect(result.current.loading).toBe(false);
      expect(result.current.count).toBe(1);
      expect(typeof result.current.persist).toBe("function");
      expect(typeof result.current.clear).toBe("function");
      expect(typeof result.current.isPersisted).toBe("function");
      expect(typeof result.current.getTokenByName).toBe("function");
    });

    it("should delegate persist to store", () => {
      // Arrange
      const store = createMockStore();
      const { result } = renderHook(() => useFilterValueProvider(store));
      const mockValue = [{ type: "filter" }] as any;

      // Act
      result.current.persist(mockValue);

      // Assert
      expect(store.persist).toHaveBeenCalledWith(mockValue);
    });

    it("should delegate clear to store", () => {
      // Arrange
      const store = createMockStore();
      const { result } = renderHook(() => useFilterValueProvider(store));

      // Act
      result.current.clear();

      // Assert
      expect(store.clear).toHaveBeenCalled();
    });

    it("should delegate isPersisted to store", () => {
      // Arrange
      const store = createMockStore({
        isPersisted: jest.fn().mockReturnValue(true),
      });
      const { result } = renderHook(() => useFilterValueProvider(store));
      const mockElement = { type: "element" } as any;

      // Act
      const isPersisted = result.current.isPersisted(mockElement);

      // Assert
      expect(store.isPersisted).toHaveBeenCalledWith(mockElement);
      expect(isPersisted).toBe(true);
    });

    it("should delegate getTokenByName to store", () => {
      // Arrange
      const mockToken = { name: "status", value: "ACTIVE" } as any;
      const store = createMockStore({
        getTokenByName: jest.fn().mockReturnValue(mockToken),
      });
      const { result } = renderHook(() => useFilterValueProvider(store));

      // Act
      const token = result.current.getTokenByName("status");

      // Assert
      expect(store.getTokenByName).toHaveBeenCalledWith("status");
      expect(token).toBe(mockToken);
    });

    it("should return stable reference when values unchanged", () => {
      // Arrange
      const store = createMockStore();
      const { result, rerender } = renderHook(() => useFilterValueProvider(store));
      const firstResult = result.current;

      // Act
      rerender();

      // Assert - same reference because values didn't change
      expect(result.current).toBe(firstResult);
    });

    it("should return new reference when values change", () => {
      // Arrange
      const store = createMockStore() as FilterStore & { _notifyListeners: () => void };
      const { result, rerender } = renderHook(() => useFilterValueProvider(store));
      const firstResult = result.current;

      // Change the mock return value
      (store.getSnapshot as jest.Mock).mockReturnValue([{ new: true }]);

      // Act
      act(() => {
        store._notifyListeners();
      });
      rerender();

      // Assert - new reference because value changed
      expect(result.current).not.toBe(firstResult);
      expect(result.current.value).toEqual([{ new: true }]);
    });
  });
});
