import { STATIC_PRODUCT_OPTIONS } from "../ConditionalFilter/constants";
import { Condition } from "../ConditionalFilter/FilterElement/Condition";
import { ConditionOptions } from "../ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "../ConditionalFilter/FilterElement/ConditionSelected";
import { Constraint, GLOBAL } from "../ConditionalFilter/FilterElement/Constraint";
import {
  ExpressionValue,
  FilterContainer,
  FilterElement,
} from "../ConditionalFilter/FilterElement/FilterElement";
import { FilterValueProvider } from "../ConditionalFilter/FilterValueProvider";
import { UrlToken } from "../ConditionalFilter/ValueProvider/UrlToken";
import { InitialConstraints, ProductTypeConstraint } from "./ModalProductFilterProvider";
import {
  createProductTypeConstraintElement,
  createWrappedValueProvider,
  getFilteredProductOptions,
  stripGlobalConstraints,
} from "./useModalProductFilter";

const createProductTypeConstraints = (
  productTypes: Array<{ id: string; name: string }>,
): InitialConstraints => ({
  productTypes,
});

const createStaticPriceElement = (): FilterElement => {
  return new FilterElement(
    new ExpressionValue("price", "Price", "price"),
    new Condition(
      ConditionOptions.fromStaticElementName("price"),
      new ConditionSelected(
        { label: "is", slug: "is", value: "input-1" },
        { type: "price", value: "100", label: "100" },
        [],
        false,
      ),
      false,
    ),
    false,
  );
};

const createStaticCategoryElement = (): FilterElement => {
  return new FilterElement(
    new ExpressionValue("category", "Category", "category"),
    new Condition(
      ConditionOptions.fromStaticElementName("category"),
      new ConditionSelected(
        { label: "is", slug: "is", value: "input-1" },
        { type: "category", value: "cat-1", label: "Category 1" },
        [],
        false,
      ),
      false,
    ),
    false,
  );
};

const createGlobalConstraintElement = (): FilterElement => {
  const element = new FilterElement(
    new ExpressionValue("productType", "ProductType", "productType"),
    new Condition(
      ConditionOptions.fromStaticElementName("productType"),
      new ConditionSelected(
        { label: "in", slug: "in", value: "input-2" },
        { type: "multiselect", value: "input-2", label: "in" },
        [],
        false,
      ),
      false,
    ),
    false,
  );

  element.setConstraint(new Constraint(GLOBAL, ["left", "right", "condition"], false));

  return element;
};

describe("useModalProductFilter / getFilteredProductOptions", () => {
  it("should return all options when no filters are excluded", () => {
    // Arrange & Act
    const options = getFilteredProductOptions();

    // Assert
    expect(options).toEqual(STATIC_PRODUCT_OPTIONS);
    expect(options.length).toBe(STATIC_PRODUCT_OPTIONS.length);
  });

  it("should filter out excluded filters", () => {
    // Arrange
    const excludedFilters = ["price", "channel"];

    // Act
    const options = getFilteredProductOptions(excludedFilters);

    // Assert
    expect(options.find(o => o.value === "price")).toBeUndefined();
    expect(options.find(o => o.value === "channel")).toBeUndefined();
    expect(options.find(o => o.value === "category")).toBeDefined();
    expect(options.length).toBe(STATIC_PRODUCT_OPTIONS.length - 2);
  });

  it("should exclude productType when constraints are provided", () => {
    // Arrange
    const initialConstraints = createProductTypeConstraints([{ id: "pt-1", name: "Simple" }]);

    // Act
    const options = getFilteredProductOptions(undefined, initialConstraints);

    // Assert
    expect(options.find(o => o.value === "productType")).toBeUndefined();
    expect(options.find(o => o.value === "category")).toBeDefined();
  });

  it("should combine excluded filters and constraints", () => {
    // Arrange
    const excludedFilters = ["price"];
    const initialConstraints = createProductTypeConstraints([{ id: "pt-1", name: "Simple" }]);

    // Act
    const options = getFilteredProductOptions(excludedFilters, initialConstraints);

    // Assert
    expect(options.find(o => o.value === "price")).toBeUndefined();
    expect(options.find(o => o.value === "productType")).toBeUndefined();
    expect(options.find(o => o.value === "category")).toBeDefined();
  });

  it("should return all options when constraints have empty productTypes", () => {
    // Arrange
    const initialConstraints: InitialConstraints = { productTypes: [] };

    // Act
    const options = getFilteredProductOptions(undefined, initialConstraints);

    // Assert
    expect(options.find(o => o.value === "productType")).toBeDefined();
    expect(options.length).toBe(STATIC_PRODUCT_OPTIONS.length);
  });
});

describe("useModalProductFilter / createProductTypeConstraintElement", () => {
  it("should create element with correct ExpressionValue", () => {
    // Arrange
    const productTypes: ProductTypeConstraint[] = [{ id: "pt-1", name: "Simple Product" }];

    // Act
    const element = createProductTypeConstraintElement(productTypes);

    // Assert
    expect(element.value.value).toBe("productType");
    expect(element.value.label).toBe("ProductType");
    expect(element.value.type).toBe("productType");
  });

  it("should create element with GLOBAL constraint", () => {
    // Arrange
    const productTypes: ProductTypeConstraint[] = [{ id: "pt-1", name: "Simple Product" }];

    // Act
    const element = createProductTypeConstraintElement(productTypes);

    // Assert
    expect(element.constraint).toBeDefined();
    expect(element.constraint?.isGlobal).toBe(true);
    expect(element.constraint?.dependsOn).toEqual([]);
  });

  it("should create element with all controls disabled", () => {
    // Arrange
    const productTypes: ProductTypeConstraint[] = [{ id: "pt-1", name: "Simple Product" }];

    // Act
    const element = createProductTypeConstraintElement(productTypes);

    // Assert
    expect(element.constraint?.disabled).toEqual(["left", "right", "condition"]);
  });

  it("should create element with removable set to false", () => {
    // Arrange
    const productTypes: ProductTypeConstraint[] = [{ id: "pt-1", name: "Simple Product" }];

    // Act
    const element = createProductTypeConstraintElement(productTypes);

    // Assert
    expect(element.constraint?.removable).toBe(false);
  });

  it("should create condition with correct productType values for single productType", () => {
    // Arrange
    const productTypes: ProductTypeConstraint[] = [{ id: "pt-1", name: "Simple Product" }];

    // Act
    const element = createProductTypeConstraintElement(productTypes);

    // Assert
    // selected.value holds the actual values (array of ItemOption)
    expect(element.condition.selected.value).toEqual([
      { label: "Simple Product", value: "pt-1", slug: "pt-1" },
    ]);
  });

  it("should create condition with correct productType values for multiple productTypes", () => {
    // Arrange
    const productTypes: ProductTypeConstraint[] = [
      { id: "pt-1", name: "Simple" },
      { id: "pt-2", name: "Configurable" },
      { id: "pt-3", name: "Bundle" },
    ];

    // Act
    const element = createProductTypeConstraintElement(productTypes);

    // Assert
    // selected.value holds the actual values (array of ItemOption)
    expect(element.condition.selected.value).toEqual([
      { label: "Simple", value: "pt-1", slug: "pt-1" },
      { label: "Configurable", value: "pt-2", slug: "pt-2" },
      { label: "Bundle", value: "pt-3", slug: "pt-3" },
    ]);
  });

  it("should use 'in' condition operator", () => {
    // Arrange
    const productTypes: ProductTypeConstraint[] = [{ id: "pt-1", name: "Simple" }];

    // Act
    const element = createProductTypeConstraintElement(productTypes);

    // Assert
    // selected.conditionValue holds the condition item with label "in"
    expect(element.condition.selected.conditionValue?.label).toBe("in");
  });
});

describe("useModalProductFilter / stripGlobalConstraints", () => {
  it("should return empty array for empty input", () => {
    // Arrange
    const filterValue: FilterContainer = [];

    // Act
    const result = stripGlobalConstraints(filterValue);

    // Assert
    expect(result).toEqual([]);
  });

  it("should strip GLOBAL constraint element at beginning", () => {
    // Arrange
    const constraintElement = createGlobalConstraintElement();
    const priceElement = createStaticPriceElement();
    const filterValue: FilterContainer = [constraintElement, "AND", priceElement];

    // Act
    const result = stripGlobalConstraints(filterValue);

    // Assert
    expect(result).toEqual([priceElement]);
  });

  it("should strip GLOBAL constraint and remove orphaned AND", () => {
    // Arrange
    const constraintElement = createGlobalConstraintElement();
    const priceElement = createStaticPriceElement();
    const categoryElement = createStaticCategoryElement();
    const filterValue: FilterContainer = [
      constraintElement,
      "AND",
      priceElement,
      "AND",
      categoryElement,
    ];

    // Act
    const result = stripGlobalConstraints(filterValue);

    // Assert
    expect(result).toEqual([priceElement, "AND", categoryElement]);
  });

  it("should return user filters unchanged when no GLOBAL constraints", () => {
    // Arrange
    const priceElement = createStaticPriceElement();
    const categoryElement = createStaticCategoryElement();
    const filterValue: FilterContainer = [priceElement, "AND", categoryElement];

    // Act
    const result = stripGlobalConstraints(filterValue);

    // Assert
    expect(result).toEqual([priceElement, "AND", categoryElement]);
  });

  it("should return empty array when only GLOBAL constraint exists", () => {
    // Arrange
    const constraintElement = createGlobalConstraintElement();
    const filterValue: FilterContainer = [constraintElement];

    // Act
    const result = stripGlobalConstraints(filterValue);

    // Assert
    expect(result).toEqual([]);
  });

  it("should handle constraint element with non-GLOBAL constraint", () => {
    // Arrange - element with regular constraint (not GLOBAL)
    const priceElement = createStaticPriceElement();

    priceElement.setConstraint(new Constraint(["channel"], ["left", "condition"], false));

    const filterValue: FilterContainer = [priceElement];

    // Act
    const result = stripGlobalConstraints(filterValue);

    // Assert - should keep elements with non-GLOBAL constraints
    expect(result).toEqual([priceElement]);
  });
});

const createMockValueProvider = (
  value: FilterContainer = [],
  overrides: Partial<FilterValueProvider> = {},
): FilterValueProvider => ({
  value,
  loading: false,
  persist: jest.fn(),
  clear: jest.fn(),
  isPersisted: jest.fn().mockReturnValue(false),
  getTokenByName: jest.fn().mockReturnValue(undefined),
  count: value.filter(v => typeof v !== "string").length,
  ...overrides,
});

describe("useModalProductFilter / createWrappedValueProvider", () => {
  describe("without constraint element", () => {
    it("should return the original value provider unchanged", () => {
      // Arrange
      const mockProvider = createMockValueProvider();

      // Act
      const result = createWrappedValueProvider(mockProvider, null);

      // Assert
      expect(result).toBe(mockProvider);
    });
  });

  describe("with constraint element", () => {
    it("should inject constraint element at beginning when value is empty", () => {
      // Arrange
      const mockProvider = createMockValueProvider([]);
      const constraintElement = createProductTypeConstraintElement([
        { id: "pt-1", name: "Simple" },
      ]);

      // Act
      const result = createWrappedValueProvider(mockProvider, constraintElement);

      // Assert
      expect(result.value).toEqual([constraintElement]);
    });

    it("should inject constraint element with AND when value has filters", () => {
      // Arrange
      const priceElement = createStaticPriceElement();
      const mockProvider = createMockValueProvider([priceElement]);
      const constraintElement = createProductTypeConstraintElement([
        { id: "pt-1", name: "Simple" },
      ]);

      // Act
      const result = createWrappedValueProvider(mockProvider, constraintElement);

      // Assert
      expect(result.value).toEqual([constraintElement, "AND", priceElement]);
    });

    it("should exclude GLOBAL constraint from count", () => {
      // Arrange
      const priceElement = createStaticPriceElement();
      const categoryElement = createStaticCategoryElement();
      const mockProvider = createMockValueProvider([priceElement, "AND", categoryElement]);
      const constraintElement = createProductTypeConstraintElement([
        { id: "pt-1", name: "Simple" },
      ]);

      // Act
      const result = createWrappedValueProvider(mockProvider, constraintElement);

      // Assert
      // Count should be 2 (price + category), not 3 (constraint + price + category)
      expect(result.count).toBe(2);
    });

    it("should return 0 count when only constraint exists", () => {
      // Arrange
      const mockProvider = createMockValueProvider([]);
      const constraintElement = createProductTypeConstraintElement([
        { id: "pt-1", name: "Simple" },
      ]);

      // Act
      const result = createWrappedValueProvider(mockProvider, constraintElement);

      // Assert
      expect(result.count).toBe(0);
    });

    it("should strip GLOBAL constraints when persisting", () => {
      // Arrange
      const mockPersist = jest.fn();
      const priceElement = createStaticPriceElement();
      const mockProvider = createMockValueProvider([priceElement], { persist: mockPersist });
      const constraintElement = createProductTypeConstraintElement([
        { id: "pt-1", name: "Simple" },
      ]);

      // Act
      const result = createWrappedValueProvider(mockProvider, constraintElement);

      result.persist([constraintElement, "AND", priceElement]);

      // Assert - persist should be called with stripped value (without constraint)
      expect(mockPersist).toHaveBeenCalledWith([priceElement]);
    });

    it("should return undefined for productType GLOBAL constraint in getTokenByName", () => {
      // Arrange
      const mockGetTokenByName = jest.fn().mockReturnValue({ name: "productType" } as UrlToken);
      const mockProvider = createMockValueProvider([], { getTokenByName: mockGetTokenByName });
      const constraintElement = createProductTypeConstraintElement([
        { id: "pt-1", name: "Simple" },
      ]);

      // Act
      const result = createWrappedValueProvider(mockProvider, constraintElement);
      const token = result.getTokenByName("productType");

      // Assert
      expect(token).toBeUndefined();
      expect(mockGetTokenByName).not.toHaveBeenCalled();
    });

    it("should not change getTokenByName for non-productType fields", () => {
      // Arrange
      const mockToken = { name: "price" } as UrlToken;
      const mockGetTokenByName = jest.fn().mockReturnValue(mockToken);
      const mockProvider = createMockValueProvider([], { getTokenByName: mockGetTokenByName });
      const constraintElement = createProductTypeConstraintElement([
        { id: "pt-1", name: "Simple" },
      ]);

      // Act
      const result = createWrappedValueProvider(mockProvider, constraintElement);
      const token = result.getTokenByName("price");

      // Assert
      expect(token).toBe(mockToken);
      expect(mockGetTokenByName).toHaveBeenCalledWith("price");
    });

    it("should return true for isPersisted when element has GLOBAL constraint", () => {
      // Arrange
      const mockIsPersisted = jest.fn().mockReturnValue(false);
      const mockProvider = createMockValueProvider([], { isPersisted: mockIsPersisted });
      const constraintElement = createProductTypeConstraintElement([
        { id: "pt-1", name: "Simple" },
      ]);

      // Act
      const result = createWrappedValueProvider(mockProvider, constraintElement);
      const isPersisted = result.isPersisted(constraintElement);

      // Assert
      expect(isPersisted).toBe(true);
      expect(mockIsPersisted).not.toHaveBeenCalled();
    });

    it("should check original value for isPersisted when element is not GLOBAL", () => {
      // Arrange
      const priceElement = createStaticPriceElement();
      const mockProvider = createMockValueProvider([priceElement]);
      const constraintElement = createProductTypeConstraintElement([
        { id: "pt-1", name: "Simple" },
      ]);

      // Act
      const result = createWrappedValueProvider(mockProvider, constraintElement);
      const isPersisted = result.isPersisted(priceElement);

      // Assert - priceElement is in the original value, so it should be persisted
      expect(isPersisted).toBe(true);
    });

    it("should return false for isPersisted when element is not in original value", () => {
      // Arrange
      const priceElement = createStaticPriceElement();
      const categoryElement = createStaticCategoryElement();
      const mockProvider = createMockValueProvider([priceElement]);
      const constraintElement = createProductTypeConstraintElement([
        { id: "pt-1", name: "Simple" },
      ]);

      // Act
      const result = createWrappedValueProvider(mockProvider, constraintElement);
      const isPersisted = result.isPersisted(categoryElement);

      // Assert - categoryElement is NOT in the original value
      expect(isPersisted).toBe(false);
    });
  });
});
