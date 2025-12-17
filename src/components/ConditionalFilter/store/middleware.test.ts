import { FilterElement } from "../FilterElement";
import { Constraint, GLOBAL } from "../FilterElement/Constraint";
import { FilterStore } from "./FilterStore";
import {
  applyMiddleware,
  composeMiddleware,
  createConstraintMiddleware,
  FilterMiddleware,
  stripGlobalConstraints,
} from "./middleware";

describe("middleware", () => {
  const createMockStore = (overrides: Partial<FilterStore> = {}): FilterStore => ({
    subscribe: jest.fn(),
    getSnapshot: jest.fn().mockReturnValue([]),
    getLoading: jest.fn().mockReturnValue(false),
    getCount: jest.fn().mockReturnValue(0),
    persist: jest.fn(),
    clear: jest.fn(),
    isPersisted: jest.fn().mockReturnValue(false),
    getTokenByName: jest.fn().mockReturnValue(undefined),
    getFetchingParams: jest.fn().mockReturnValue(null),
    dispose: jest.fn(),
    ...overrides,
  });

  const createMockFilterElement = (value: string, constraint?: Constraint): FilterElement => {
    const element = {
      value: { value },
      constraint,
      equals: jest.fn().mockReturnValue(false),
    } as unknown as FilterElement;

    // Mock isFilterElement to return true for this element
    jest
      .spyOn(FilterElement, "isFilterElement")
      .mockImplementation(
        (item): item is FilterElement =>
          item === element || (item as any)?.value?.value !== undefined,
      );

    return element;
  };

  describe("applyMiddleware", () => {
    it("should delegate subscribe to base store", () => {
      // Arrange
      const baseStore = createMockStore();
      const middleware: FilterMiddleware = {};
      const wrappedStore = applyMiddleware(baseStore, middleware);
      const callback = jest.fn();

      // Act
      wrappedStore.subscribe(callback);

      // Assert
      expect(baseStore.subscribe).toHaveBeenCalledWith(callback);
    });

    it("should transform snapshot when middleware provides transformer", () => {
      // Arrange
      const baseStore = createMockStore({
        getSnapshot: jest.fn().mockReturnValue([{ original: true }]),
      });
      const middleware: FilterMiddleware = {
        transformSnapshot: value => [...value, { added: true } as any],
      };
      const wrappedStore = applyMiddleware(baseStore, middleware);

      // Act
      const snapshot = wrappedStore.getSnapshot();

      // Assert
      expect(snapshot).toEqual([{ original: true }, { added: true }]);
    });

    it("should return base snapshot when no transformer", () => {
      // Arrange
      const baseSnapshot = [{ original: true }];
      const baseStore = createMockStore({
        getSnapshot: jest.fn().mockReturnValue(baseSnapshot),
      });
      const middleware: FilterMiddleware = {};
      const wrappedStore = applyMiddleware(baseStore, middleware);

      // Act
      const snapshot = wrappedStore.getSnapshot();

      // Assert
      expect(snapshot).toBe(baseSnapshot);
    });

    it("should transform value before persisting", () => {
      // Arrange
      const baseStore = createMockStore();
      const middleware: FilterMiddleware = {
        transformPersist: value => value.slice(1), // Remove first element
      };
      const wrappedStore = applyMiddleware(baseStore, middleware);
      const originalValue = [{ first: true }, { second: true }] as any;

      // Act
      wrappedStore.persist(originalValue);

      // Assert
      expect(baseStore.persist).toHaveBeenCalledWith([{ second: true }]);
    });

    it("should transform count when middleware provides transformer", () => {
      // Arrange
      const baseStore = createMockStore({
        getCount: jest.fn().mockReturnValue(5),
      });
      const middleware: FilterMiddleware = {
        transformCount: count => count - 1,
      };
      const wrappedStore = applyMiddleware(baseStore, middleware);

      // Act
      const count = wrappedStore.getCount();

      // Assert
      expect(count).toBe(4);
    });

    it("should transform isPersisted when middleware provides transformer", () => {
      // Arrange
      const baseStore = createMockStore({
        isPersisted: jest.fn().mockReturnValue(false),
      });
      const middleware: FilterMiddleware = {
        transformIsPersisted: () => true, // Override to always return true
      };
      const wrappedStore = applyMiddleware(baseStore, middleware);
      const element = createMockFilterElement("test");

      // Act
      const result = wrappedStore.isPersisted(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should fall back to base isPersisted when transformer returns undefined", () => {
      // Arrange
      const baseStore = createMockStore({
        isPersisted: jest.fn().mockReturnValue(true),
      });
      const middleware: FilterMiddleware = {
        transformIsPersisted: () => undefined, // Explicitly return undefined to fall back
      };
      const wrappedStore = applyMiddleware(baseStore, middleware);
      const element = createMockFilterElement("test");

      // Act
      const result = wrappedStore.isPersisted(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should transform getTokenByName when middleware provides transformer", () => {
      // Arrange
      const mockToken = { name: "status", value: "ACTIVE" } as any;
      const baseStore = createMockStore({
        getTokenByName: jest.fn().mockReturnValue(mockToken),
      });
      const middleware: FilterMiddleware = {
        transformGetTokenByName: () => null, // Override to return no token
      };
      const wrappedStore = applyMiddleware(baseStore, middleware);

      // Act
      const token = wrappedStore.getTokenByName("status");

      // Assert
      expect(token).toBeUndefined();
    });
  });

  describe("composeMiddleware", () => {
    it("should apply transformSnapshot in order", () => {
      // Arrange
      const mw1: FilterMiddleware = {
        transformSnapshot: value => [...value, { from: "mw1" } as any],
      };
      const mw2: FilterMiddleware = {
        transformSnapshot: value => [...value, { from: "mw2" } as any],
      };
      const composed = composeMiddleware(mw1, mw2);

      // Act
      const result = composed.transformSnapshot!([{ initial: true }] as any);

      // Assert
      expect(result).toEqual([{ initial: true }, { from: "mw1" }, { from: "mw2" }]);
    });

    it("should apply transformPersist in order", () => {
      // Arrange
      const mw1: FilterMiddleware = {
        transformPersist: value => value.slice(0, -1), // Remove last
      };
      const mw2: FilterMiddleware = {
        transformPersist: value => value.slice(1), // Remove first
      };
      const composed = composeMiddleware(mw1, mw2);

      // Act
      const result = composed.transformPersist!([{ a: 1 }, { b: 2 }, { c: 3 }] as any);

      // Assert - First mw1 removes last (c:3), then mw2 removes first (a:1)
      expect(result).toEqual([{ b: 2 }]);
    });

    it("should return first defined transformIsPersisted result", () => {
      // Arrange
      const mw1: FilterMiddleware = {
        transformIsPersisted: () => undefined, // Falls through
      };
      const mw2: FilterMiddleware = {
        transformIsPersisted: () => true, // Returns value
      };
      const mw3: FilterMiddleware = {
        transformIsPersisted: () => false, // Should not be called
      };
      const composed = composeMiddleware(mw1, mw2, mw3);
      const element = createMockFilterElement("test");

      // Act
      const result = composed.transformIsPersisted!(element, false, []);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("createConstraintMiddleware", () => {
    it("should return no-op middleware when constraint is null", () => {
      // Arrange & Act
      const middleware = createConstraintMiddleware(null);

      // Assert
      expect(middleware.transformSnapshot).toBeUndefined();
      expect(middleware.transformPersist).toBeUndefined();
    });

    it("should inject constraint at beginning of empty snapshot", () => {
      // Arrange
      const constraint = createMockFilterElement("productType");
      const middleware = createConstraintMiddleware(constraint);

      // Act
      const result = middleware.transformSnapshot!([]);

      // Assert
      expect(result).toEqual([constraint]);
    });

    it("should inject constraint with AND separator for non-empty snapshot", () => {
      // Arrange
      const constraint = createMockFilterElement("productType");
      const existingFilter = createMockFilterElement("status");
      const middleware = createConstraintMiddleware(constraint);

      // Act
      const result = middleware.transformSnapshot!([existingFilter]);

      // Assert
      expect(result).toEqual([constraint, "AND", existingFilter]);
    });

    it("should return true for isPersisted when element has GLOBAL constraint", () => {
      // Arrange
      const constraint = createMockFilterElement("productType");
      const globalElement = createMockFilterElement(
        "productType",
        new Constraint(GLOBAL, [], false),
      );
      const middleware = createConstraintMiddleware(constraint);

      // Act
      const result = middleware.transformIsPersisted!(globalElement, false, []);

      // Assert
      expect(result).toBe(true);
    });

    it("should return undefined for isPersisted when element has non-GLOBAL constraint", () => {
      // Arrange
      const constraint = createMockFilterElement("productType");
      // Create a non-global constraint (depends on other field)
      const nonGlobalElement = createMockFilterElement(
        "status",
        new Constraint(["channel"], [], true),
      );
      const middleware = createConstraintMiddleware(constraint);

      // Act
      const result = middleware.transformIsPersisted!(nonGlobalElement, false, []);

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return null for getTokenByName when name matches constraint field", () => {
      // Arrange
      const constraint = createMockFilterElement("productType");
      const middleware = createConstraintMiddleware(constraint);

      // Act
      const result = middleware.transformGetTokenByName!("productType", undefined);

      // Assert
      expect(result).toBeNull();
    });

    it("should return undefined for getTokenByName when name does not match", () => {
      // Arrange
      const constraint = createMockFilterElement("productType");
      const middleware = createConstraintMiddleware(constraint);

      // Act
      const result = middleware.transformGetTokenByName!("status", undefined);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe("stripGlobalConstraints", () => {
    beforeEach(() => {
      // Reset the mock before each test
      jest
        .spyOn(FilterElement, "isFilterElement")
        .mockImplementation((item): item is FilterElement => {
          return typeof item === "object" && item !== null && "constraint" in item;
        });
    });

    it("should remove GLOBAL constraint elements", () => {
      // Arrange
      const globalElement = {
        constraint: { isGlobal: true },
      } as unknown as FilterElement;
      const normalElement = {
        constraint: { isGlobal: false },
      } as unknown as FilterElement;
      const filterValue = [globalElement, "AND", normalElement] as any;

      // Act
      const result = stripGlobalConstraints(filterValue);

      // Assert
      expect(result).toEqual([normalElement]);
    });

    it("should remove orphaned AND at beginning", () => {
      // Arrange
      const globalElement = {
        constraint: { isGlobal: true },
      } as unknown as FilterElement;
      const normalElement = {
        constraint: { isGlobal: false },
      } as unknown as FilterElement;
      const filterValue = [globalElement, "AND", normalElement] as any;

      // Act
      const result = stripGlobalConstraints(filterValue);

      // Assert
      expect(result[0]).not.toBe("AND");
    });

    it("should preserve non-constraint elements", () => {
      // Arrange
      const normalElement1 = {
        constraint: { isGlobal: false },
      } as unknown as FilterElement;
      const normalElement2 = {
        constraint: { isGlobal: false },
      } as unknown as FilterElement;
      const filterValue = [normalElement1, "AND", normalElement2] as any;

      // Act
      const result = stripGlobalConstraints(filterValue);

      // Assert
      expect(result).toEqual([normalElement1, "AND", normalElement2]);
    });

    it("should handle empty array", () => {
      // Arrange & Act
      const result = stripGlobalConstraints([]);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
