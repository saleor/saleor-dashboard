import { ProductTypeConfigurable, ProductTypeEnum } from "@dashboard/graphql";

import { Condition, FilterContainer, FilterElement } from "./FilterElement";
import { ConditionOptions } from "./FilterElement/ConditionOptions";
import { ConditionSelected } from "./FilterElement/ConditionSelected";
import { ExpressionValue } from "./FilterElement/FilterElement";
import {
  creatAttributesQueryVariables,
  creatDraftOrderQueryVariables,
  createCustomerQueryVariables,
  createGiftCardQueryVariables,
  createPageQueryVariables,
  createProductQueryVariables,
  createProductTypesQueryVariables,
  createStaffMembersQueryVariables,
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

describe("ConditionalFilter / queryVariables / creatDraftOrderQueryVariables", () => {
  it("should return empty variables for empty filters", () => {
    // Arrange
    const filters: FilterContainer = [];
    const expectedOutput = {};
    // Act
    const result = creatDraftOrderQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should create variables with selected filters", () => {
    // Arrange
    const filters: FilterContainer = [
      new FilterElement(
        new ExpressionValue("customer", "Customer", "customer"),
        new Condition(
          ConditionOptions.fromStaticElementName("customer"),
          new ConditionSelected(
            { label: "customer1", slug: "customer1", value: "value1" },
            { type: "text", label: "is", value: "input-1" },
            [],
            false,
          ),
          false,
        ),
        false,
      ),
      "AND",
      new FilterElement(
        new ExpressionValue("created", "Created", "created"),
        new Condition(
          ConditionOptions.fromStaticElementName("customer"),
          new ConditionSelected(
            ["2025-02-01", "2025-02-05"],
            { type: "date.range", label: "between", value: "input-3" },
            [],
            false,
          ),
          false,
        ),
        false,
      ),
    ];
    const expectedOutput = {
      created: { gte: "2025-02-01", lte: "2025-02-05" },
      customer: "value1",
    };
    // Act
    const result = creatDraftOrderQueryVariables(filters);

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

describe("ConditionalFilter / queryVariables / createCustomerQueryVariables", () => {
  it("should return empty variables for empty filters", () => {
    // Arrange
    const filters: FilterContainer = [];
    const expectedOutput = {};
    // Act
    const result = createCustomerQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should create variables with selected filters", () => {
    // Arrange
    const filters: FilterContainer = [
      new FilterElement(
        new ExpressionValue("dateJoined", "Date joined", "dateJoined"),
        new Condition(
          ConditionOptions.fromStaticElementName("dateJoined"),
          new ConditionSelected(
            ["2025-02-01", "2025-02-08"],
            { type: "number.range", label: "between", value: "input-2" },
            [],
            false,
          ),
          false,
        ),
        false,
      ),
      "AND",
      new FilterElement(
        new ExpressionValue("numberOfOrders", "Number of orders", "numberOfOrders"),
        new Condition(
          ConditionOptions.fromStaticElementName("numberOfOrders"),
          new ConditionSelected(
            ["1", "100"],
            { type: "number.range", label: "between", value: "input-2" },
            [],
            false,
          ),
          false,
        ),
        false,
      ),
    ];
    const expectedOutput = {
      dateJoined: { gte: "2025-02-01", lte: "2025-02-08" },
      numberOfOrders: { gte: "1", lte: "100" },
    };
    // Act
    const result = createCustomerQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});

describe("ConditionalFilter / queryVariables / createProductTypesQueryVariables", () => {
  it("should return empty variables for empty filters", () => {
    // Arrange
    const filters: FilterContainer = [];
    const expectedOutput = {};
    // Act
    const result = createProductTypesQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should create variables with selected filters", () => {
    // Arrange
    const filters: FilterContainer = [
      new FilterElement(
        new ExpressionValue("typeOfProduct", "Product type", "typeOfProduct"),
        new Condition(
          ConditionOptions.fromStaticElementName("typeOfProduct"),
          new ConditionSelected(
            ProductTypeEnum.DIGITAL,
            { type: "select", label: "is", value: "input-1" },
            [],
            false,
          ),
          false,
        ),
        false,
      ),
      "AND",
      new FilterElement(
        new ExpressionValue("configurable", "Configurable", "configurable"),
        new Condition(
          ConditionOptions.fromStaticElementName("configurable"),
          new ConditionSelected(
            ProductTypeConfigurable.SIMPLE,
            { type: "select", label: "is", value: "input-1" },
            [],
            false,
          ),
          false,
        ),
        false,
      ),
    ];
    const expectedOutput = {
      productType: "DIGITAL",
      configurable: "SIMPLE",
    };
    // Act
    const result = createProductTypesQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});

describe("ConditionalFilter / queryVariables / createStaffMembersQueryVariables", () => {
  it("should return empty variables for empty filters", () => {
    // Arrange
    const filters: FilterContainer = [];
    const expectedOutput = {};
    // Act
    const result = createStaffMembersQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should create variables with selected filters", () => {
    // Arrange
    const filters: FilterContainer = [
      new FilterElement(
        new ExpressionValue("staffMemberStatus", "Status", "staffMemberStatus"),
        new Condition(
          ConditionOptions.fromStaticElementName("staffMemberStatus"),
          new ConditionSelected(
            "active",
            { type: "select", label: "is", value: "input-1" },
            [],
            false,
          ),
          false,
        ),
        false,
      ),
    ];
    const expectedOutput = {
      status: "active",
    };
    // Act
    const result = createStaffMembersQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});

describe("ConditionalFilter / queryVariables / creatAttributesQueryVariables", () => {
  it("should return empty variables for empty filters", () => {
    // Arrange
    const filters: FilterContainer = [];
    const expectedOutput = {};
    // Act
    const result = creatAttributesQueryVariables(filters);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should create variables with selected filters", () => {
    // Arrange
    const channelFilterElemen = new FilterElement(
      new ExpressionValue("channel", "Channel", "channel"),
      new Condition(
        ConditionOptions.fromStaticElementName("channel"),
        new ConditionSelected(
          "default-channel",
          { type: "select", label: "is", value: "input-5" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    const typeFilterElement = new FilterElement(
      new ExpressionValue("attributeType", "Attribute type", "attributeType"),
      new Condition(
        ConditionOptions.fromStaticElementName("attributeType"),
        new ConditionSelected(
          "PRODUCT_TYPE",
          { type: "select", label: "is", value: "input-1" },
          [],
          false,
        ),
        false,
      ),
      false,
    );

    const filters: FilterContainer = [channelFilterElemen, "AND", typeFilterElement];
    const expectedOutput = {
      channel: "default-channel",
      type: "PRODUCT_TYPE",
    };
    // Act
    const result = creatAttributesQueryVariables(filters);

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
