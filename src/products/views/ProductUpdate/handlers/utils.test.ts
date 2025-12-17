// @ts-strict-ignore
import { DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { ProductFragment } from "@dashboard/graphql";
import { ProductUpdateSubmitData } from "@dashboard/products/components/ProductUpdatePage/types";

import { product, variantAttributes } from "../../../fixtures";
import {
  getBulkVariantUpdateInputs,
  getCreateVariantInput,
  getProductUpdateVariables,
  inferProductChannelsAfterUpdate,
} from "./utils";

describe("Product update utils", () => {
  it("should infer product channels after update with data", () => {
    const product = {
      channelListings: [
        {
          channel: {
            id: "1",
          },
        },
        {
          channel: {
            id: "2",
          },
        },
        {
          channel: {
            id: "3",
          },
        },
      ],
    } as ProductFragment;
    const submitData = {
      channels: {
        updateChannels: [
          {
            channelId: "1",
          },
          {
            channelId: "4",
          },
        ],
        removeChannels: ["2"],
      },
    } as ProductUpdateSubmitData;
    const result = inferProductChannelsAfterUpdate(product, submitData);

    expect(result).toEqual(["1", "3", "4"]);
  });
  it("should infer product channels after update without data", () => {
    const product = {
      channelListings: [
        {
          channel: {
            id: "1",
          },
        },
        {
          channel: {
            id: "2",
          },
        },
        {
          channel: {
            id: "3",
          },
        },
      ],
    } as ProductFragment;
    const submitData = {
      channels: {},
    } as ProductUpdateSubmitData;
    const result = inferProductChannelsAfterUpdate(product, submitData);

    expect(result).toEqual(["1", "2", "3"]);
  });
});
describe("getCreateVariantInput", () => {
  test("should return input data base on datagrid change data", () => {
    // Arrange
    const inputData: DatagridChangeOpts = {
      updates: [
        {
          data: "new item",
          column: "name",
          row: 1,
        },
        {
          data: "23423",
          column: "sku",
          row: 1,
        },
        {
          data: true,
          column: "availableInChannel:Q2hhbm5lbDoyMjQz",
          row: 1,
        },
        {
          data: {
            kind: "money-cell",
            value: 33434,
            currency: "USD",
          },
          column: "channel:Q2hhbm5lbDoyMjQz",
          row: 1,
        },
        {
          data: true,
          column: "availableInChannel:Q2hhbm5lbDoyNTQy",
          row: 1,
        },
        {
          data: {
            kind: "money-cell",
            value: 434,
            currency: "BHD",
          },
          column: "channel:Q2hhbm5lbDoyNTQy",
          row: 1,
        },
        {
          data: {
            kind: "number-cell",
            value: 3223,
          },
          column: "warehouse:V2FyZWhvdXNlOmQ0YzI0ODQxLTg2MDgtNGFiNC04MDkzLWUxNmQ4NWNlYjdkYQ==",
          row: 1,
        },
        {
          data: {
            allowCustomValues: true,
            emptyOption: true,
            kind: "dropdown-cell",
            value: {
              label: "1l",
              value: "1l",
            },
          },
          column: "attribute:QXR0cmlidXRlOjE1",
          row: 1,
        },
      ],
      removed: [],
      added: [1],
    };
    // Act
    const createDataInput = getCreateVariantInput(inputData, 1, variantAttributes);

    // Assert
    expect(createDataInput).toEqual({
      attributes: [
        {
          id: "QXR0cmlidXRlOjE1",
          dropdown: {
            value: "1l",
          },
        },
      ],
      sku: "23423",
      name: "new item",
      channelListings: [
        {
          channelId: "Q2hhbm5lbDoyMjQz",
          price: 33434,
        },
        {
          channelId: "Q2hhbm5lbDoyNTQy",
          price: 434,
        },
      ],
      stocks: [
        {
          warehouse: "V2FyZWhvdXNlOmQ0YzI0ODQxLTg2MDgtNGFiNC04MDkzLWUxNmQ4NWNlYjdkYQ==",
          quantity: 3223,
        },
      ],
    });
  });
  test("should return only sku and name", () => {
    // Arrange
    const inputData: DatagridChangeOpts = {
      updates: [
        {
          data: "new item",
          column: "name",
          row: 1,
        },
        {
          data: "23423",
          column: "sku",
          row: 1,
        },
      ],
      removed: [],
      added: [1],
    };
    // Act
    const createDataInput = getCreateVariantInput(inputData, 1, variantAttributes);

    // Assert
    expect(createDataInput).toEqual({
      attributes: [],
      sku: "23423",
      name: "new item",
      channelListings: [],
      stocks: [],
    });
  });
});
describe("getBulkVariantUpdateInputs", () => {
  test("should return input data base on datagrid change data for multiple variants", () => {
    // Arrange
    const variants: ProductFragment["variants"] = product("http://google.com").variants;
    const inputData: DatagridChangeOpts = {
      updates: [
        {
          data: "item 1",
          column: "name",
          row: 1,
        },
        {
          data: "new item",
          column: "name",
          row: 2,
        },
        {
          data: "2345555",
          column: "sku",
          row: 2,
        },
        {
          data: {
            kind: "money-cell",
            value: 234,
            currency: "USD",
          },
          column: `channel:${variants[2].channelListings[0].channel.id}`,
          row: 2,
        },
        {
          data: {
            kind: "money-cell",
            value: 565,
            currency: "BHD",
          },
          column: `channel:${variants[2].channelListings[1].channel.id}`,
          row: 2,
        },
        {
          data: {
            kind: "number-cell",
            value: 2344,
          },
          column: `warehouse:${variants[2].stocks[0].warehouse.id}`,
          row: 2,
        },
        {
          data: {
            allowCustomValues: true,
            emptyOption: true,
            kind: "dropdown-cell",
            value: {
              label: "2l",
              value: "2l",
            },
          },
          column: `attribute:${variants[2].attributes[0].attribute.id}`,
          row: 2,
        },
      ],
      removed: [],
      added: [],
    };
    // Act
    const bulkVariantUpdateInput = getBulkVariantUpdateInputs(
      variants,
      inputData,
      variantAttributes,
    );

    // Assert

    expect(bulkVariantUpdateInput).toEqual([
      {
        id: variants[1].id,
        attributes: [],
        name: "item 1",
        stocks: {
          create: [],
          remove: [],
          update: [],
        },
        channelListings: {
          create: [],
          remove: [],
          update: [],
        },
      },
      {
        id: variants[2].id,
        attributes: [
          {
            id: "QXR0cmlidXRlOjE1",
            dropdown: {
              value: "2l",
            },
          },
        ],
        sku: "2345555",
        name: "new item",
        stocks: {
          update: [
            {
              stock: variants[2].stocks[0].id,
              quantity: 2344,
            },
          ],
          create: [],
          remove: [],
        },
        channelListings: {
          update: [
            {
              channelListing: variants[2].channelListings[0].id,
              price: 234,
            },
            {
              channelListing: variants[2].channelListings[1].id,
              price: 565,
            },
          ],
          remove: [],
          create: [],
        },
      },
    ]);
  });
  test("should return input data base on datagrid change data for simultaneous bulk operations", () => {
    // Arrange
    const variants: ProductFragment["variants"] = product("http://google.com").variants;
    const inputData: DatagridChangeOpts = {
      updates: [
        {
          data: "2345555",
          column: "sku",
          row: 0, // initially 0
        },
        {
          data: {
            kind: "money-cell",
            value: 234,
            currency: "USD",
          },
          column: `channel:${variants[0].channelListings[0].channel.id}`,
          row: 0, // initially 0
        },
        {
          data: "edited variant",
          column: "name",
          row: 1, // initially 2
        },
        {
          data: {
            kind: "number-cell",
            value: 2344,
          },
          column: `warehouse:${variants[2].stocks[0].warehouse.id}`,
          row: 1, // initially 2
        },
        // row 2 (initially 4) is unchanged
        {
          data: "completely new variant",
          column: "name",
          row: 3, // initially 5
        },
      ],
      // DatagridChangeOpts generates removed indices based on initial grid,
      // meanwhile added and updates indices are calculated on the grid after removal
      // of rows. This is why we have 3 as an index both in removed and added.
      removed: [1, 3],
      added: [3],
    };
    // Act
    const bulkVariantUpdateInput = getBulkVariantUpdateInputs(
      variants,
      inputData,
      variantAttributes,
    );

    // Assert
    expect(bulkVariantUpdateInput).toEqual([
      {
        id: variants[0].id,
        attributes: [],
        sku: "2345555",
        name: undefined,
        stocks: { create: [], update: [], remove: [] },
        channelListings: {
          create: [],
          remove: [],
          update: [
            {
              channelListing: variants[0].channelListings[0].id,
              price: 234,
            },
          ],
        },
      },
      {
        id: variants[2].id,
        attributes: [],
        sku: undefined,
        name: "edited variant",
        stocks: {
          create: [],
          update: [
            {
              stock: variants[2].stocks[0].id,
              quantity: 2344,
            },
          ],
          remove: [],
        },
        channelListings: { create: [], remove: [], update: [] },
      },
    ]);
  });
});

describe("getProductUpdateVariables", () => {
  const baseProduct = product("http://google.com");
  const baseData = {
    attributes: [],
    attributesWithNewFileValue: [],
    category: null,
    collections: [],
    description: null,
    name: "Test Product",
    rating: null,
    slug: "test-product",
    taxClassId: null,
    seoDescription: null,
    seoTitle: null,
  } as ProductUpdateSubmitData;

  it("should include weight when valid number is provided", () => {
    // Arrange
    const data = {
      ...baseData,
      weight: "10.5",
    } as ProductUpdateSubmitData;

    // Act
    const result = getProductUpdateVariables(baseProduct, data, []);

    // Assert
    expect(result.input.weight).toBe(10.5);
  });

  it("should include weight when zero is provided", () => {
    // Arrange
    const data = {
      ...baseData,
      weight: "0",
    } as ProductUpdateSubmitData;

    // Act
    const result = getProductUpdateVariables(baseProduct, data, []);

    // Assert
    expect(result.input.weight).toBe(0);
  });

  it("should include null when empty string is provided to clear weight", () => {
    // Arrange
    const data = {
      ...baseData,
      weight: "",
    } as ProductUpdateSubmitData;

    // Act
    const result = getProductUpdateVariables(baseProduct, data, []);

    // Assert
    expect(result.input.weight).toBeNull();
  });

  it("should not include weight when undefined is provided", () => {
    // Arrange
    const data = {
      ...baseData,
      weight: undefined,
    } as ProductUpdateSubmitData;

    // Act
    const result = getProductUpdateVariables(baseProduct, data, []);

    // Assert
    expect(result.input.weight).toBeUndefined();
  });

  it("should handle decimal weight values", () => {
    // Arrange
    const data = {
      ...baseData,
      weight: "0.001",
    } as ProductUpdateSubmitData;

    // Act
    const result = getProductUpdateVariables(baseProduct, data, []);

    // Assert
    expect(result.input.weight).toBe(0.001);
  });

  it("should include NaN when invalid non-numeric string is provided", () => {
    // Arrange
    const data = {
      ...baseData,
      weight: "invalid",
    } as ProductUpdateSubmitData;

    // Act
    const result = getProductUpdateVariables(baseProduct, data, []);

    // Assert
    // parseFloat("invalid") returns NaN, backend should validate
    expect(result.input.weight).toBeNaN();
  });

  it("should include negative number when provided", () => {
    // Arrange
    const data = {
      ...baseData,
      weight: "-5",
    } as ProductUpdateSubmitData;

    // Act
    const result = getProductUpdateVariables(baseProduct, data, []);

    // Assert
    // Backend should validate if negative weights are allowed
    expect(result.input.weight).toBe(-5);
  });
});
