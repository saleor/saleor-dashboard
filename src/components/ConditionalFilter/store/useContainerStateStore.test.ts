import { act, renderHook } from "@testing-library/react-hooks";

import { FilterElement } from "../FilterElement";
import { Constraint, GLOBAL } from "../FilterElement/Constraint";
import { FilterStore } from "./FilterStore";
import { useContainerStateStore } from "./useContainerStateStore";

describe("useContainerStateStore", () => {
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
      _notifyListeners: () => listeners.forEach(l => l()),
      ...overrides,
    } as FilterStore & { _notifyListeners: () => void };
  };

  const createMockFilterElement = (
    slug: string,
    options: {
      isEmpty?: boolean;
      constraint?: Constraint;
    } = {},
  ): FilterElement => {
    const element = {
      value: { value: slug },
      constraint: options.constraint,
      isEmpty: jest.fn().mockReturnValue(options.isEmpty ?? false),
      clearConstraint: jest.fn(),
    } as unknown as FilterElement;

    return element;
  };

  beforeEach(() => {
    // Mock FilterElement.isFilterElement
    jest
      .spyOn(FilterElement, "isFilterElement")
      .mockImplementation((item): item is FilterElement => {
        return (
          typeof item === "object" &&
          item !== null &&
          "value" in item &&
          typeof (item as any).value === "object"
        );
      });

    // Mock FilterElement.createEmpty
    jest
      .spyOn(FilterElement, "createEmpty")
      .mockReturnValue(createMockFilterElement("", { isEmpty: true }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("value", () => {
    it("should return persisted value initially", () => {
      // Arrange
      const mockElement = createMockFilterElement("status");
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([mockElement]),
      });

      // Act
      const { result } = renderHook(() => useContainerStateStore(store));

      // Assert
      expect(result.current.value).toEqual([mockElement]);
    });

    it("should return draft value after local modification", () => {
      // Arrange
      const mockElement = createMockFilterElement("status");
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([mockElement]),
      });
      const { result } = renderHook(() => useContainerStateStore(store));

      // Act
      act(() => {
        result.current.clear();
      });

      // Assert
      expect(result.current.value).toEqual([]);
    });
  });

  describe("create", () => {
    it("should add element to empty container", () => {
      // Arrange
      const store = createMockStore();
      const { result } = renderHook(() => useContainerStateStore(store));
      const newElement = createMockFilterElement("status");

      // Act
      act(() => {
        result.current.create(newElement);
      });

      // Assert
      expect(result.current.value).toEqual([newElement]);
    });

    it("should add element with AND separator to non-empty container", () => {
      // Arrange
      const existingElement = createMockFilterElement("category");
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([existingElement]),
      });
      const { result } = renderHook(() => useContainerStateStore(store));
      const newElement = createMockFilterElement("status");

      // Act
      act(() => {
        result.current.create(newElement);
      });

      // Assert
      expect(result.current.value).toEqual([existingElement, "AND", newElement]);
    });
  });

  describe("createEmpty", () => {
    it("should add empty filter element", () => {
      // Arrange
      const store = createMockStore();
      const { result } = renderHook(() => useContainerStateStore(store));

      // Act
      act(() => {
        result.current.createEmpty();
      });

      // Assert
      expect(result.current.value.length).toBe(1);
      expect(FilterElement.createEmpty).toHaveBeenCalled();
    });
  });

  describe("getAt", () => {
    it("should return element at position", () => {
      // Arrange
      const element1 = createMockFilterElement("status");
      const element2 = createMockFilterElement("category");
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([element1, "AND", element2]),
      });
      const { result } = renderHook(() => useContainerStateStore(store));

      // Act & Assert
      expect(result.current.getAt("0")).toBe(element1);
      expect(result.current.getAt("1")).toBe("AND");
      expect(result.current.getAt("2")).toBe(element2);
    });

    it("should return undefined for out of bounds position", () => {
      // Arrange
      const store = createMockStore();
      const { result } = renderHook(() => useContainerStateStore(store));

      // Act & Assert
      expect(result.current.getAt("99")).toBeUndefined();
    });
  });

  describe("updateAt", () => {
    it("should update element at position", () => {
      // Arrange
      const element = createMockFilterElement("status");
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([element]),
      });
      const { result } = renderHook(() => useContainerStateStore(store));
      const callback = jest.fn();

      // Act
      act(() => {
        result.current.updateAt("0", callback);
      });

      // Assert
      expect(callback).toHaveBeenCalledWith(element);
    });

    it("should not update fully disabled constraint element", () => {
      // Arrange
      const constraint = new Constraint(GLOBAL, ["left", "right", "condition"], false);
      const element = createMockFilterElement("productType", { constraint });
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([element]),
      });
      const { result } = renderHook(() => useContainerStateStore(store));
      const callback = jest.fn();

      // Act
      act(() => {
        result.current.updateAt("0", callback);
      });

      // Assert
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("removeAt", () => {
    it("should remove element at position", () => {
      // Arrange
      const element1 = createMockFilterElement("status");
      const element2 = createMockFilterElement("category");
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([element1, "AND", element2]),
      });
      const { result } = renderHook(() => useContainerStateStore(store));

      // Act
      act(() => {
        result.current.removeAt("0");
      });

      // Assert
      expect(result.current.value).toEqual([element2]);
    });

    it("should not remove non-removable constraint element", () => {
      // Arrange
      const constraint = new Constraint(GLOBAL, [], false); // removable = false
      const element = createMockFilterElement("productType", { constraint });
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([element]),
      });
      const { result } = renderHook(() => useContainerStateStore(store));

      // Act
      act(() => {
        result.current.removeAt("0");
      });

      // Assert
      expect(result.current.value).toEqual([element]);
    });

    it("should remove adjacent AND connector", () => {
      // Arrange
      const element1 = createMockFilterElement("status");
      const element2 = createMockFilterElement("category");
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([element1, "AND", element2]),
      });
      const { result } = renderHook(() => useContainerStateStore(store));

      // Act - remove first element
      act(() => {
        result.current.removeAt("0");
      });

      // Assert - AND should be removed too
      expect(result.current.value).not.toContain("AND");
    });
  });

  describe("exist", () => {
    it("should return true if element with slug exists", () => {
      // Arrange
      const element = createMockFilterElement("status");
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([element]),
      });
      const { result } = renderHook(() => useContainerStateStore(store));

      // Act & Assert
      expect(result.current.exist("status")).toBe(true);
    });

    it("should return false if element with slug does not exist", () => {
      // Arrange
      const element = createMockFilterElement("status");
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([element]),
      });
      const { result } = renderHook(() => useContainerStateStore(store));

      // Act & Assert
      expect(result.current.exist("category")).toBe(false);
    });
  });

  describe("clear", () => {
    it("should clear all elements", () => {
      // Arrange
      const element = createMockFilterElement("status");
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([element]),
      });
      const { result } = renderHook(() => useContainerStateStore(store));

      // Act
      act(() => {
        result.current.clear();
      });

      // Assert
      expect(result.current.value).toEqual([]);
    });
  });

  describe("clearEmpty", () => {
    it("should remove empty and non-persisted elements", () => {
      // Arrange
      const persistedElement = createMockFilterElement("status");
      const emptyElement = createMockFilterElement("", { isEmpty: true });
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([persistedElement, "AND", emptyElement]),
        isPersisted: jest.fn().mockImplementation(el => el === persistedElement),
      });
      const { result } = renderHook(() => useContainerStateStore(store));

      // Act
      act(() => {
        result.current.clearEmpty();
      });

      // Assert
      expect(result.current.value).toEqual([persistedElement]);
    });
  });

  describe("updateBySlug", () => {
    it("should update element matching slug", () => {
      // Arrange
      const element = createMockFilterElement("status");
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([element]),
      });
      const { result } = renderHook(() => useContainerStateStore(store));
      const callback = jest.fn();

      // Act
      act(() => {
        result.current.updateBySlug("status", callback);
      });

      // Assert
      expect(callback).toHaveBeenCalledWith(element);
    });

    it("should not call callback for non-matching slug", () => {
      // Arrange
      const element = createMockFilterElement("status");
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([element]),
      });
      const { result } = renderHook(() => useContainerStateStore(store));
      const callback = jest.fn();

      // Act
      act(() => {
        result.current.updateBySlug("category", callback);
      });

      // Assert
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("createAndRemoveEmpty", () => {
    it("should add new element after removing empty ones", () => {
      // Arrange
      const emptyElement = createMockFilterElement("", { isEmpty: true });
      const newElement = createMockFilterElement("status");
      const store = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([emptyElement]),
        isPersisted: jest.fn().mockReturnValue(false),
      });
      const { result } = renderHook(() => useContainerStateStore(store));

      // Act
      act(() => {
        result.current.createAndRemoveEmpty(newElement);
      });

      // Assert
      expect(result.current.value).toEqual([newElement]);
    });
  });
});
