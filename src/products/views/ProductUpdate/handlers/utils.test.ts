import { DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { ProductFragment } from "@dashboard/graphql";
import { ProductUpdateSubmitData } from "@dashboard/products/components/ProductUpdatePage/types";

import { product } from "../../../fixtures";
import {
  getBulkVariantUpdateInputs,
  getCreateVariantInput,
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
          column:
            "stock:V2FyZWhvdXNlOmQ0YzI0ODQxLTg2MDgtNGFiNC04MDkzLWUxNmQ4NWNlYjdkYQ==",
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
    const createDataInput = getCreateVariantInput(inputData, 1);

    // Assert
    expect(createDataInput).toEqual({
      attributes: [
        {
          id: "QXR0cmlidXRlOjE1",
          values: ["1l"],
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
          warehouse:
            "V2FyZWhvdXNlOmQ0YzI0ODQxLTg2MDgtNGFiNC04MDkzLWUxNmQ4NWNlYjdkYQ==",
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
    const createDataInput = getCreateVariantInput(inputData, 1);

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
    const variants: ProductFragment["variants"] =
      product("http://google.com").variants;

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
          column: `stock:${variants[2].stocks[0].warehouse.id}`,
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
            id: variants[2].attributes[0].attribute.id,
            values: ["2l"],
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
});
