import { Condition, FilterContainer, FilterElement } from "./FilterElement";
import { ConditionOptions } from "./FilterElement/ConditionOptions";
import { ConditionSelected } from "./FilterElement/ConditionSelected";
import { ExpressionValue } from "./FilterElement/FilterElement";
import {
  createGiftCardQueryVariables,
  createProductQueryVariables,
  mapStaticQueryPartToLegacyVariables,
} from "./queryVariables";

describe("ConditionalFilter / queryVariables / createProductQueryVariables", () => {
  it("should return empty variables for empty filters", () => {
    // Arrange
    const filters: FilterContainer = [];
    const expectedOutput = {};
    // Act
    const result = createProductQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
  it("should create variables with selected filters", () => {
    // Arrange
    const filters: FilterContainer = [
      new FilterElement(
        new ExpressionValue("price", "Price", "price"),
        new Condition(
          ConditionOptions.fromStaticElementName("price"),
          new ConditionSelected(
            { label: "price", slug: "price", value: "123" },
            { type: "price", value: "123", label: "Price" },
            [],
            false,
          ),
          false,
        ),
        false,
      ),
      "AND",
      new FilterElement(
        new ExpressionValue("bottle-size", "Bottle size", "DROPDOWN"),
        new Condition(
          ConditionOptions.fromAttributeType("DROPDOWN"),
          new ConditionSelected(
            {
              label: "bottle-size",
              slug: "bottle-id",
              value: "bottle-id",
              originalSlug: "0-5l",
            },
            {
              type: "DROPDOWN",
              value: "bottle-id",
              label: "Bottle size",
            },
            [
              {
                label: "bottle-size",
                slug: "bottle-id",
                value: "bottle-id",
                originalSlug: "0-5l",
              },
            ],
            false,
          ),
          false,
        ),
        false,
      ),
    ];
    const expectedOutput = {
      attributes: [{ slug: "bottle-size", values: ["0-5l"] }],
      price: { eq: "123" },
    };
    // Act
    const result = createProductQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});

describe("ConditionalFilter / queryVariables / createGiftCardQueryVariables", () => {
  it("should return empty variables for empty filters", () => {
    // Arrange
    const filters: FilterContainer = [];
    const expectedOutput = {};
    // Act
    const result = createGiftCardQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should create variables with selected filters", () => {
    // Arrange
    const productsFilterElement = new FilterElement(
      new ExpressionValue("products", "Products", "products"),
      new Condition(
        ConditionOptions.fromStaticElementName("products"),
        new ConditionSelected(
          [
            { label: "product1", slug: "product1", value: "value1" },
            { label: "product2", slug: "product2", value: "value2" },
          ],
          { type: "multiselect", label: "in", value: "input-1" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    const currencyFilterElement = new FilterElement(
      new ExpressionValue("currency", "Currency", "currency"),
      new Condition(
        ConditionOptions.fromStaticElementName("currency"),
        new ConditionSelected(
          { label: "USD", slug: "usd", value: "usd" },
          { type: "select", label: "is", value: "input-1" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    const currentBalanceFilterElement = new FilterElement(
      new ExpressionValue("currentBalance", "Current balance", "currentBalance"),
      new Condition(
        ConditionOptions.fromStaticElementName("currentBalance"),
        new ConditionSelected(
          ["1", "22"],
          { type: "number.range", label: "between", value: "input-3" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    const initialBalanceFilterElement = new FilterElement(
      new ExpressionValue("initialBalance", "Initial balance", "initialBalance"),
      new Condition(
        ConditionOptions.fromStaticElementName("initialBalance"),
        new ConditionSelected(
          "10",
          { type: "number", label: "greater", value: "input-2" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    const isActiveFilterElement = new FilterElement(
      new ExpressionValue("isActive", "Is active", "isActive"),
      new Condition(
        ConditionOptions.fromStaticElementName("isActive"),
        new ConditionSelected(
          { label: "Yes", value: "true", slug: "true" },
          { type: "select", label: "is", value: "input-1" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    const tagsFilterElement = new FilterElement(
      new ExpressionValue("tags", "Tags", "tags"),
      new Condition(
        ConditionOptions.fromStaticElementName("tags"),
        new ConditionSelected(
          [
            { label: "Tag 1", value: "tag-1", slug: "tag-1" },
            { label: "Tag 2", value: "tag-2", slug: "tag-2" },
          ],
          { type: "multiselect", label: "in", value: "input-1" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    const usedByFilterElement = new FilterElement(
      new ExpressionValue("usedBy", "Used by", "usedBy"),
      new Condition(
        ConditionOptions.fromStaticElementName("usedBy"),
        new ConditionSelected(
          [
            { label: "Customer 1", value: "customer-1", slug: "customer-1" },
            { label: "Customer 2", value: "customer-2", slug: "customer-2" },
          ],
          { type: "multiselect", label: "in", value: "input-1" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    const filters: FilterContainer = [
      currencyFilterElement,
      "AND",
      productsFilterElement,
      "AND",
      currentBalanceFilterElement,
      "AND",
      initialBalanceFilterElement,
      "AND",
      isActiveFilterElement,
      "AND",
      tagsFilterElement,
      "AND",
      usedByFilterElement,
    ];
    const expectedOutput = {
      currency: "usd",
      currentBalance: {
        gte: "1",
        lte: "22",
      },
      initialBalance: {
        gte: "10",
      },
      isActive: true,
      products: ["value1", "value2"],
      tags: ["tag-1", "tag-2"],
      usedBy: ["customer-1", "customer-2"],
    };

    // Act
    const result = createGiftCardQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});

describe("ConditionalFilter / queryVariables / mapStaticQueryPartToLegacyVariables", () => {
  it("should return queryPart if it is not an object", () => {
    // Arrange
    const queryPart = "queryPart";
    const expectedOutput = "queryPart";

    // Act
    const result = mapStaticQueryPartToLegacyVariables(queryPart);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should transform range input to legacy format", () => {
    // Arrange
    const queryPart = { range: { lte: "value" } };
    const expectedOutput = { lte: "value" };

    // Act
    const result = mapStaticQueryPartToLegacyVariables(queryPart);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should transform eq input to legacy format", () => {
    // Arrange
    const queryPart = { eq: "value" };
    const expectedOutput = "value";
    // Act
    const result = mapStaticQueryPartToLegacyVariables(queryPart);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should transform oneOf input to legacy format", () => {
    // Arrange
    const queryPart = { oneOf: ["value1", "value2"] };
    const expectedOutput = ["value1", "value2"];
    // Act
    const result = mapStaticQueryPartToLegacyVariables(queryPart);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
