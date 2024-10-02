// @ts-strict-ignore
import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { ProductListUrlFilters } from "@dashboard/products/urls";

import { ProductListUrlFiltersAsDictWithMultipleValues } from "../../urls";
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
