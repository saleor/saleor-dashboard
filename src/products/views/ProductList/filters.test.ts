// @ts-strict-ignore
import { AttributeInputTypeEnum, StockAvailability } from "@dashboard/graphql";
import {
  ProductListUrlFilters,
  ProductListUrlFiltersAsDictWithMultipleValues,
} from "@dashboard/products/urls";

import {
  FilterParam,
  getAttributeValuesFromParams,
  getExportProductFilter,
  parseFilterValue,
} from "./filters";

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

describe("Get export product filter", () => {
  it("should return empty object when no query params provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {};

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({});
  });

  it("should return empty object when queryParams is null", () => {
    // Arrange
    const params = null as any;

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({});
  });

  it("should include search term when query param is provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      query: "test-product",
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      search: "test-product",
    });
  });

  it("should include channel when channel param is provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      channel: "default-channel",
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      channel: "default-channel",
    });
  });

  it("should include categories when categories param is provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      categories: ["cat-1", "cat-2"],
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      categories: ["cat-1", "cat-2"],
    });
  });

  it("should include collections when collections param is provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      collections: ["col-1", "col-2"],
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      collections: ["col-1", "col-2"],
    });
  });

  it("should include productTypes when productTypes param is provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      productTypes: ["type-1", "type-2"],
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      productTypes: ["type-1", "type-2"],
    });
  });

  it("should include price range when both priceFrom and priceTo are provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      priceFrom: "10.50",
      priceTo: "99.99",
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      minimalPrice: {
        gte: 10.5,
        lte: 99.99,
      },
    });
  });

  it("should include price range when only priceFrom is provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      priceFrom: "25.00",
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      minimalPrice: {
        gte: 25.0,
      },
    });
  });

  it("should include price range when only priceTo is provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      priceTo: "50.00",
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      minimalPrice: {
        lte: 50.0,
      },
    });
  });

  it("should not include price range when price values are empty strings", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      priceFrom: "",
      priceTo: "",
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({});
  });

  it("should include stock availability when stockStatus is provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      stockStatus: StockAvailability.IN_STOCK,
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      stockAvailability: StockAvailability.IN_STOCK,
    });
  });

  it("should include string attributes when provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      "string-attributes": {
        color: ["red", "blue"],
        size: ["large"],
      },
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      attributes: [
        { slug: "color", values: ["red", "blue"] },
        { slug: "size", values: ["large"] },
      ],
    });
  });

  it("should include numeric attributes when provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      "numeric-attributes": {
        weight: ["10", "20"],
      },
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      attributes: [{ slug: "weight", values: ["10", "20"] }],
    });
  });

  it("should include boolean attributes when provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      "boolean-attributes": {
        "is-available": ["true"],
      },
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      attributes: [{ slug: "is-available", values: ["true"] }],
    });
  });

  it("should include date attributes when provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      "date-attributes": {
        "release-date": ["2024-01-01"],
      },
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      attributes: [{ slug: "release-date", values: ["2024-01-01"] }],
    });
  });

  it("should include datetime attributes when provided", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      "datetime-attributes": {
        "created-at": ["2024-01-01T10:00:00"],
      },
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      attributes: [{ slug: "created-at", values: ["2024-01-01T10:00:00"] }],
    });
  });

  it("should combine all attribute types into single attributes array", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      "string-attributes": {
        color: ["red"],
      },
      "numeric-attributes": {
        weight: ["10"],
      },
      "boolean-attributes": {
        available: ["true"],
      },
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter.attributes).toHaveLength(3);
    expect(filter.attributes).toEqual(
      expect.arrayContaining([
        { slug: "color", values: ["red"] },
        { slug: "weight", values: ["10"] },
        { slug: "available", values: ["true"] },
      ]),
    );
  });

  it("should skip attributes with empty values", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      "string-attributes": {
        color: ["red"],
        size: [],
      },
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      attributes: [{ slug: "color", values: ["red"] }],
    });
  });

  it("should combine multiple filters into one object", () => {
    // Arrange
    const params: ProductListUrlFilters = {
      query: "shirt",
      channel: "default-channel",
      categories: ["cat-1"],
      collections: ["col-1"],
      productTypes: ["type-1"],
      priceFrom: "10",
      priceTo: "100",
      stockStatus: StockAvailability.IN_STOCK,
      "string-attributes": {
        color: ["blue"],
      },
    };

    // Act
    const filter = getExportProductFilter({ queryParams: params });

    // Assert
    expect(filter).toEqual({
      search: "shirt",
      channel: "default-channel",
      categories: ["cat-1"],
      collections: ["col-1"],
      productTypes: ["type-1"],
      minimalPrice: {
        gte: 10,
        lte: 100,
      },
      stockAvailability: StockAvailability.IN_STOCK,
      attributes: [{ slug: "color", values: ["blue"] }],
    });
  });
});
