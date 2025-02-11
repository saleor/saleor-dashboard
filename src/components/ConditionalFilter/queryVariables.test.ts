import { Condition, FilterContainer, FilterElement } from "./FilterElement";
import { ConditionOptions } from "./FilterElement/ConditionOptions";
import { ConditionSelected } from "./FilterElement/ConditionSelected";
import { ExpressionValue } from "./FilterElement/FilterElement";
import {
  createPageQueryVariables,
  createProductQueryVariables,
  creatVoucherQueryVariables,
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

describe("ConditionalFilter / queryVariables / creatVoucherQueryVariables", () => {
  it("should return empty variables for empty filters", () => {
    // Arrange
    const filters: FilterContainer = [];
    const expectedOutput = {};
    // Act
    const result = creatVoucherQueryVariables(filters);

    // Assert
    expect(result).toEqual({
      filters: expectedOutput,
      channel: undefined,
    });
  });

  it("should create variables with selected filters", () => {
    // Arrange
    const channelFilterElement = new FilterElement(
      new ExpressionValue("channel", "Channel", "channel"),
      new Condition(
        ConditionOptions.fromStaticElementName("channel"),
        new ConditionSelected(
          { label: "Channel 1", slug: "channel-1", value: "channel-1" },
          { type: "select", label: "is", value: "input-5" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    const discuntTypeFilterElement = new FilterElement(
      new ExpressionValue("discountType", "Discount Type", "discountType"),
      new Condition(
        ConditionOptions.fromStaticElementName("discountType"),
        new ConditionSelected(
          [
            { value: "discount-1", slug: "discount-1", label: "Discount 1" },
            { value: "discount-2", slug: "discount-2", label: "Discount 2" },
          ],
          { type: "multiselect", label: "in", value: "input-2" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    const startedFilterElement = new FilterElement(
      new ExpressionValue("started", "Started", "started"),
      new Condition(
        ConditionOptions.fromStaticElementName("started"),
        new ConditionSelected(
          ["2025-01-31T16:24", "2025-02-15T16:24"],
          { type: "datetime.range", label: "between", value: "input-3" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    const voucherStatusFilterElement = new FilterElement(
      new ExpressionValue("voucherStatus", "Voucher status", "voucherStatus"),
      new Condition(
        ConditionOptions.fromStaticElementName("voucherStatus"),
        new ConditionSelected(
          { value: "status-1", slug: "status-1", label: "Status 1" },
          { type: "combobox", label: "is", value: "input-1" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    const timeUSedFilterElement = new FilterElement(
      new ExpressionValue("timesUsed", "Time used", "timesUsed"),
      new Condition(
        ConditionOptions.fromStaticElementName("timesUsed"),
        new ConditionSelected("10", { type: "number", label: "is", value: "input-2" }, [], false),
        false,
      ),
      false,
    );

    const filters: FilterContainer = [
      channelFilterElement,
      "AND",
      discuntTypeFilterElement,
      "AND",
      timeUSedFilterElement,
      "AND",
      voucherStatusFilterElement,
      "AND",
      startedFilterElement,
    ];
    const expectedChannel = "channel-1";
    const expectedOutput = {
      discountType: ["discount-1", "discount-2"],
      started: { lte: "2025-02-15T16:24", gte: "2025-01-31T16:24" },
      timesUsed: { gte: 10, lte: 10 },
      status: "status-1",
    };
    // Act
    const result = creatVoucherQueryVariables(filters);

    // Assert
    expect(result).toEqual({
      filters: expectedOutput,
      channel: expectedChannel,
    });
  });
});

describe("ConditionalFilter / queryVariables / createPageQueryVariables", () => {
  it("should return empty variables for empty filters", () => {
    // Arrange
    const filters: FilterContainer = [];
    const expectedOutput = {};
    // Act
    const result = createPageQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
  it("should create variables with selected filters", () => {
    // Arrange
    const filters: FilterContainer = [
      new FilterElement(
        new ExpressionValue("pageTypes", "Product types", "pageTypes"),
        new Condition(
          ConditionOptions.fromStaticElementName("pageTypes"),
          new ConditionSelected(
            [
              { label: "pageTypes1", slug: "pageTypes1", value: "value1" },
              { label: "pageTypes2", slug: "pageTypes2", value: "value2" },
            ],
            { type: "multiselect", label: "in", value: "input-1" },
            [],
            false,
          ),
          false,
        ),
        false,
      ),
    ];
    const expectedOutput = {
      pageTypes: ["value1", "value2"],
    };
    // Act
    const result = createPageQueryVariables(filters);

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
