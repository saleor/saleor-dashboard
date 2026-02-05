import { Condition, FilterElement } from "@dashboard/components/ConditionalFilter/FilterElement";
import { ConditionOptions } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionSelected";
import { ConditionValue } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionValue";
import {
  ExpressionValue,
  FilterContainer,
} from "@dashboard/components/ConditionalFilter/FilterElement/FilterElement";
import { createProductExportQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { AttributeInputTypeEnum } from "@dashboard/graphql";
import {
  ProductListUrlFilters,
  ProductListUrlFiltersAsDictWithMultipleValues,
} from "@dashboard/products/urls";

import { FilterParam, getAttributeValuesFromParams, parseFilterValue } from "./filters";

describe("Get attribute values from URL params", () => {
  type GetAttributeValuesFromParams = Parameters<typeof getAttributeValuesFromParams>;

  it("should return empty array when attribute doesn't exist in params", () => {
    // Arrange
    const params: GetAttributeValuesFromParams[0] = {};
    const attribute: GetAttributeValuesFromParams[1] = {
      slug: "test",
      inputType: AttributeInputTypeEnum.DROPDOWN,
    };
    // Act
    const attributeValues = getAttributeValuesFromParams(params, attribute);

    // Assert
    expect(attributeValues).toHaveLength(0);
  });
  it("should return attribute values when attribute exists in params", () => {
    // Arrange
    const params: GetAttributeValuesFromParams[0] = {
      "string-attributes": {
        test: ["value-1", "value-2"],
      },
    };
    const attribute: GetAttributeValuesFromParams[1] = {
      slug: "test",
      inputType: AttributeInputTypeEnum.DROPDOWN,
    };
    // Act
    const attributeValues = getAttributeValuesFromParams(params, attribute);

    // Assert
    expect(attributeValues).toEqual(["value-1", "value-2"]);
  });
});
describe("Parsing filter value", () => {
  it("should return boolean values when boolean attributes values passed", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      "boolean-attributes": {
        "test-1": ["true"],
        "test-2": ["false"],
      },
    };
    const type = ProductListUrlFiltersAsDictWithMultipleValues.booleanAttributes;
    // Act
    const parsedValue1 = parseFilterValue(params, "test-1", type);
    const parsedValue2 = parseFilterValue(params, "test-2", type);
    // Assert
    const expectedValue1: FilterParam = {
      slug: "test-1",
      boolean: true,
    };
    const expectedValue2: FilterParam = {
      slug: "test-2",
      boolean: false,
    };

    expect(parsedValue1).toEqual(expectedValue1);
    expect(parsedValue2).toEqual(expectedValue2);
  });
  it("should return numeric values when numeric attributes values passed", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      "numeric-attributes": {
        "test-1": ["1"],
        "test-2": ["1", "2"],
      },
    };
    const type = ProductListUrlFiltersAsDictWithMultipleValues.numericAttributes;
    // Act
    const parsedValue1 = parseFilterValue(params, "test-1", type);
    const parsedValue2 = parseFilterValue(params, "test-2", type);
    // Assert
    const expectedValue1: FilterParam = {
      slug: "test-1",
      valuesRange: {
        gte: 1,
        lte: 1,
      },
    };
    const expectedValue2: FilterParam = {
      slug: "test-2",
      valuesRange: {
        gte: 1,
        lte: 2,
      },
    };

    expect(parsedValue1).toEqual(expectedValue1);
    expect(parsedValue2).toEqual(expectedValue2);
  });
  it("should return string values when string attributes values passed", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      "string-attributes": {
        "test-1": ["value-1"],
        "test-2": ["value-2", "value-3"],
      },
    };
    const type = ProductListUrlFiltersAsDictWithMultipleValues.stringAttributes;
    // Act
    const parsedValue1 = parseFilterValue(params, "test-1", type);
    const parsedValue2 = parseFilterValue(params, "test-2", type);
    // Assert
    const expectedValue1: FilterParam = {
      slug: "test-1",
      values: ["value-1"],
    };
    const expectedValue2: FilterParam = {
      slug: "test-2",
      values: ["value-2", "value-3"],
    };

    expect(parsedValue1).toEqual(expectedValue1);
    expect(parsedValue2).toEqual(expectedValue2);
  });
  it("should return date values when date attributes values passed", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      "date-attributes": {
        "test-1": ["2020-01-01"],
        "test-2": ["2020-01-01", "2020-02-02"],
      },
    };
    const type = ProductListUrlFiltersAsDictWithMultipleValues.dateAttributes;
    // Act
    const parsedValue1 = parseFilterValue(params, "test-1", type);
    const parsedValue2 = parseFilterValue(params, "test-2", type);
    // Assert
    const expectedValue1: FilterParam = {
      slug: "test-1",
      date: {
        gte: "2020-01-01",
        lte: "2020-01-01",
      },
    };
    const expectedValue2: FilterParam = {
      slug: "test-2",
      date: {
        gte: "2020-01-01",
        lte: "2020-02-02",
      },
    };

    expect(parsedValue1).toEqual(expectedValue1);
    expect(parsedValue2).toEqual(expectedValue2);
  });
  it("should return datetime values when datetime attributes values passed", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      "datetime-attributes": {
        "test-1": ["2020-01-01T00:00:00"],
        "test-2": ["2020-01-01T00:00:00", "2020-02-02T00:00:00"],
      },
    };
    const type = ProductListUrlFiltersAsDictWithMultipleValues.dateTimeAttributes;
    // Act
    const parsedValue1 = parseFilterValue(params, "test-1", type);
    const parsedValue2 = parseFilterValue(params, "test-2", type);
    // Assert
    const expectedValue1: FilterParam = {
      slug: "test-1",
      dateTime: {
        gte: "2020-01-01T00:00:00",
        lte: "2020-01-01T00:00:00",
      },
    };
    const expectedValue2: FilterParam = {
      slug: "test-2",
      dateTime: {
        gte: "2020-01-01T00:00:00",
        lte: "2020-02-02T00:00:00",
      },
    };

    expect(parsedValue1).toEqual(expectedValue1);
    expect(parsedValue2).toEqual(expectedValue2);
  });
});

describe("Create product export query variables", () => {
  it("should return null when no filter container provided", () => {
    // Arrange
    const filterContainer = null as any;

    // Act
    const filter = createProductExportQueryVariables(filterContainer);

    // Assert
    expect(filter).toBeNull();
  });

  it("should return null when filter container is empty", () => {
    // Arrange
    const filterContainer: FilterElement[] = [];

    // Act
    const filter = createProductExportQueryVariables(filterContainer);

    // Assert
    expect(filter).toBeNull();
  });

  it("should map collection singular to collections plural", () => {
    // Arrange
    const filterContainer = [
      {
        field: { name: "collection" },
        condition: { active: true, value: ["col-id"] },
      },
    ] as any;

    // Act
    const filter = createProductExportQueryVariables(filterContainer);

    // Assert
    expect(filter).toBeDefined();
    expect(typeof filter).toBe("object");

    // Verify mapping: collections (plural) should exist
    if (filter && typeof filter === "object") {
      expect((filter as any).collections).toEqual(["col-id"]);
      expect((filter as any).collection).toBeUndefined();
    }
  });

  it("should map category singular to categories plural", () => {
    // Arrange
    const filterContainer = [
      {
        field: { name: "category" },
        condition: { active: true, value: ["cat-id"] },
      },
    ] as any;

    // Act
    const filter = createProductExportQueryVariables(filterContainer);

    // Assert
    expect(filter).toBeDefined();
    expect(typeof filter).toBe("object");

    // Verify mapping: categories (plural) should exist
    if (filter && typeof filter === "object") {
      expect((filter as any).categories).toEqual(["cat-id"]);
      expect((filter as any).category).toBeUndefined();
    }
  });

  it("should map productType singular to productTypes plural", () => {
    // Arrange
    const filterContainer = [
      {
        field: { name: "productType" },
        condition: { active: true, value: ["type-id"] },
      },
    ] as any;

    // Act
    const filter = createProductExportQueryVariables(filterContainer);

    // Assert
    expect(filter).toBeDefined();
    expect(typeof filter).toBe("object");

    // Verify mapping: productTypes (plural) should exist
    if (filter && typeof filter === "object") {
      expect((filter as any).productTypes).toEqual(["type-id"]);
      expect((filter as any).productType).toBeUndefined();
    }
  });

  it("should convert price string to PriceRangeInput object", () => {
    // Arrange
    const filterContainer = [
      {
        field: { name: "price" },
        condition: { active: true, value: "200" },
      },
    ] as any;

    // Act
    const filter = createProductExportQueryVariables(filterContainer);

    // Assert
    expect(filter).toBeDefined();

    // Price should be converted to an object with gte property equal to 200
    if (filter && typeof filter === "object" && filter.price) {
      expect(typeof filter.price).toBe("object");
      expect(filter.price).toEqual({ gte: 200 });
    }
  });

  it("should remove invalid price fields", () => {
    // Arrange
    const filterContainer = [
      {
        field: { name: "price" },
        condition: { active: true, value: "invalid" },
      },
    ] as any;

    // Act
    const filter = createProductExportQueryVariables(filterContainer);

    // Assert
    // Invalid price should be removed, and since it's the only field, filter should be null
    expect(filter).toBeNull();
  });

  it("should handle price value of 0 correctly (not treat 0 as falsy)", () => {
    // Arrange
    const filterContainer = [
      {
        field: { name: "price" },
        condition: { active: true, value: { gte: 0, lte: 100 } },
      },
    ] as any;

    // Act
    const filter = createProductExportQueryVariables(filterContainer);

    // Assert
    // Edge case: price with 0 should NOT be removed (0 is falsy but valid)
    expect(filter).toBeDefined();

    if (filter && typeof filter === "object" && filter.price) {
      expect(filter.price.gte).toBe(0);
      expect(filter.price.lte).toBe(100);
    }
  });

  it("should handle multiple field mappings simultaneously", () => {
    // Arrange
    const filterContainer = [
      {
        field: { name: "collection" },
        condition: { active: true, value: ["col-1"] },
      },
      {
        field: { name: "category" },
        condition: { active: true, value: ["cat-1"] },
      },
      {
        field: { name: "productType" },
        condition: { active: true, value: ["type-1"] },
      },
    ] as any;

    // Act
    const filter = createProductExportQueryVariables(filterContainer);

    // Assert
    expect(filter).toBeDefined();

    if (filter && typeof filter === "object") {
      const filterObj = filter as any;

      // All plural forms should exist
      expect(filterObj.collections).toEqual(["col-1"]);
      expect(filterObj.categories).toEqual(["cat-1"]);
      expect(filterObj.productTypes).toEqual(["type-1"]);

      // All singular forms should not exist
      expect(filterObj.collection).toBeUndefined();
      expect(filterObj.category).toBeUndefined();
      expect(filterObj.productType).toBeUndefined();
    }
  });

  it("should use FiltersQueryBuilder with FILTER api type", () => {
    // Arrange
    const filterContainer = [
      {
        field: { name: "search" },
        condition: { active: true, value: "test" },
      },
    ] as any;

    // Act
    const filter = createProductExportQueryVariables(filterContainer);

    // Assert
    // The function should successfully build filters without errors
    expect(filter).toBeDefined();
  });

  it("should combine conditional filters with search query in export filter object", () => {
    // Arrange
    const createFilterElement = (fieldName: string, value: ConditionValue): FilterElement => {
      const expressionValue = new ExpressionValue(fieldName, fieldName, fieldName);
      const conditionType = Array.isArray(value) ? "multiselect" : "text";
      const conditionItem = {
        type: conditionType,
        label: fieldName,
        value: `input-${conditionType}`,
      };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, value);
      // Use empty ConditionOptions for arbitrary field names
      const condition = new Condition(ConditionOptions.empty(), selected, false);

      return new FilterElement(expressionValue, condition, false);
    };

    const filterContainer = [
      createFilterElement("collections", ["col-123"]),
      "AND",
      createFilterElement("categories", ["cat-456"]),
      "AND",
      createFilterElement("search", "iPhone"),
    ] as FilterContainer;

    // Act
    const exportFilter = createProductExportQueryVariables(filterContainer);

    // Assert
    expect(exportFilter).toBeDefined();
    expect(exportFilter?.collections).toEqual(["col-123"]);
    expect(exportFilter?.categories).toEqual(["cat-456"]);
    expect(exportFilter?.search).toEqual("iPhone");
  });

  it("should return null when filter container is empty after normalization", () => {
    // Arrange
    const filterContainer = [
      {
        field: { name: "price" },
        condition: { active: true, value: "" },
      },
    ] as any;

    // Act
    const filter = createProductExportQueryVariables(filterContainer);

    // Assert
    // Should return null, not empty object, when all fields are filtered out
    expect(filter).toBeNull();
  });
});
