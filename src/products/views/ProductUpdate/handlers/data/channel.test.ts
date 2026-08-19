// @ts-strict-ignore
import { type DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { type ProductDetailsVariantFragment } from "@dashboard/graphql";

import { getUpdateVariantChannelInputs, getVariantChannelsInputs } from "./channel";

const channelListings = [
  {
    id: "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjA=",
    channel: {
      id: "Q2hhbm5lbDox",
    },
  },
  {
    id: "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjD=",
    channel: {
      id: "Q2hhbm5lbDot",
    },
  },
];

describe("getUpdateVariantChannelInputs", () => {
  test("should handle updated channels", () => {
    // Arrange
    const changeData: DatagridChangeOpts = {
      added: [],
      removed: [],
      updates: [
        {
          column: "channel:Q2hhbm5lbDox",
          row: 1,
          data: {
            kind: "money-cell",
            value: 43343,
            currency: "USD",
          },
        },
        {
          column: "channel:Q2hhbm5lbDot",
          row: 1,
          data: {
            kind: "money-cell",
            value: 123,
            currency: "PLN",
          },
        },
      ],
    };
    // Act
    const channels = getUpdateVariantChannelInputs(changeData, 1, {
      channelListings,
    } as ProductDetailsVariantFragment);

    // Assert
    expect(channels).toEqual({
      create: [],
      remove: [],
      update: [
        {
          channelListing: "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjA=",
          price: 43343,
        },
        {
          channelListing: "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjD=",
          price: 123,
        },
      ],
    });
  });
  test("should handle removed channels", () => {
    // Arrange
    const changeData: DatagridChangeOpts = {
      added: [],
      removed: [],
      updates: [
        {
          data: false,
          column: "availableInChannel:Q2hhbm5lbDox",
          row: 1,
        },
        {
          data: false,
          column: "availableInChannel:Q2hhbm5lbDot",
          row: 1,
        },
      ],
    };
    // Act
    const channels = getUpdateVariantChannelInputs(changeData, 1, {
      channelListings,
    } as ProductDetailsVariantFragment);

    // Assert
    expect(channels).toEqual({
      create: [],
      remove: [
        "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjA=",
        "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjD=",
      ],
      update: [],
    });
  });
  test("should not overwrite price when re-enabling availability on an existing listing", () => {
    // Arrange — untick then re-tick Available without editing price
    const changeData: DatagridChangeOpts = {
      added: [],
      removed: [],
      updates: [
        {
          data: false,
          column: "availableInChannel:Q2hhbm5lbDox",
          row: 1,
        },
        {
          data: true,
          column: "availableInChannel:Q2hhbm5lbDox",
          row: 1,
        },
      ],
    };
    // Act
    const channels = getUpdateVariantChannelInputs(changeData, 1, {
      channelListings,
    } as ProductDetailsVariantFragment);

    // Assert — no-op preserves existing price and costPrice on the listing
    expect(channels).toEqual({
      create: [],
      remove: [],
      update: [],
    });
  });
  test("should not change price when enabling availability on an already listed channel", () => {
    // Arrange
    const changeData: DatagridChangeOpts = {
      added: [],
      removed: [],
      updates: [
        {
          data: true,
          column: "availableInChannel:Q2hhbm5lbDox",
          row: 1,
        },
      ],
    };
    // Act
    const channels = getUpdateVariantChannelInputs(changeData, 1, {
      channelListings,
    } as ProductDetailsVariantFragment);

    // Assert
    expect(channels).toEqual({
      create: [],
      remove: [],
      update: [],
    });
  });
  test("should keep price edit when availability is re-enabled after editing price", () => {
    // Arrange — price change then Available toggled on (both map to channel column)
    const changeData: DatagridChangeOpts = {
      added: [],
      removed: [],
      updates: [
        {
          column: "channel:Q2hhbm5lbDox",
          row: 1,
          data: {
            kind: "money-cell",
            value: 29.43,
            currency: "EUR",
          },
        },
        {
          data: true,
          column: "availableInChannel:Q2hhbm5lbDox",
          row: 1,
        },
      ],
    };
    // Act
    const channels = getUpdateVariantChannelInputs(changeData, 1, {
      channelListings,
    } as ProductDetailsVariantFragment);

    // Assert
    expect(channels).toEqual({
      create: [],
      remove: [],
      update: [
        {
          channelListing: "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjA=",
          price: 29.43,
        },
      ],
    });
  });
  test("should handle created channels", () => {
    // Arrange
    const changeData: DatagridChangeOpts = {
      added: [],
      removed: [],
      updates: [
        {
          data: true,
          column: "availableInChannel:Q2hhbm5lbDod",
          row: 1,
        },
        {
          data: {
            kind: "money-cell",
            value: 3434,
            currency: "USD",
          },
          column: "channel:Q2hhbm5lbDod",
          row: 1,
        },
      ],
    };
    // Act
    const channels = getUpdateVariantChannelInputs(changeData, 1, {
      channelListings,
    } as ProductDetailsVariantFragment);

    // Assert
    expect(channels).toEqual({
      create: [
        {
          channelId: "Q2hhbm5lbDod",
          price: 3434,
        },
      ],
      remove: [],
      update: [],
    });
  });
  test("should return empty arrays when no changes for given row", () => {
    // Arrange
    const changeData: DatagridChangeOpts = {
      added: [],
      removed: [],
      updates: [
        {
          column: "channel:Q2hhbm5lbDox",
          row: 11,
          data: {
            kind: "money-cell",
            value: 43343,
            currency: "USD",
          },
        },
      ],
    };
    // Act
    const channels = getUpdateVariantChannelInputs(changeData, 1, {
      channelListings,
    } as ProductDetailsVariantFragment);

    // Assert
    expect(channels).toEqual({
      create: [],
      remove: [],
      update: [],
    });
  });
  test("should return empty arrays when no changes for given column", () => {
    // Arrange
    const changeData: DatagridChangeOpts = {
      added: [],
      removed: [],
      updates: [
        { column: "attribute:1", row: 1, data: { value: { value: "test" } } },
        { column: "attribute:2", row: 1, data: { value: { value: "test2" } } },
      ],
    };
    // Act
    const channels = getUpdateVariantChannelInputs(changeData, 1, {
      channelListings,
    } as ProductDetailsVariantFragment);

    // Assert
    expect(channels).toEqual({
      create: [],
      remove: [],
      update: [],
    });
  });
});
describe("getVariantChannelsInputs", () => {
  test("should filter and map change data to channel format", () => {
    // Arrange
    const changeData: DatagridChangeOpts = {
      added: [],
      removed: [],
      updates: [
        {
          column: "channel:Q2hhbm5lbDox",
          row: 1,
          data: {
            kind: "money-cell",
            value: 43343,
            currency: "USD",
          },
        },
      ],
    };
    // Act
    const channels = getVariantChannelsInputs(changeData, 1);

    // Assert

    expect(channels).toEqual([
      {
        channelId: "Q2hhbm5lbDox",
        price: 43343,
      },
    ]);
  });
  test("should filter out changes with null prices", () => {
    // Arrange
    const changeData: DatagridChangeOpts = {
      added: [],
      removed: [],
      updates: [
        {
          data: false,
          column: "availableInChannel:Q2hhbm5lbDox",
          row: 1,
        },
      ],
    };
    // Act
    const channels = getVariantChannelsInputs(changeData, 1);

    // Assert
    expect(channels).toEqual([]);
  });
  test("should create listing with default price when only availability is enabled", () => {
    // Arrange
    const changeData: DatagridChangeOpts = {
      added: [],
      removed: [],
      updates: [
        {
          data: true,
          column: "availableInChannel:Q2hhbm5lbDox",
          row: 1,
        },
      ],
    };
    // Act
    const channels = getVariantChannelsInputs(changeData, 1);

    // Assert
    expect(channels).toEqual([
      {
        channelId: "Q2hhbm5lbDox",
        price: 0,
      },
    ]);
  });
  test("should return empty arrays when no changes for given row", () => {
    // Arrange
    const changeData: DatagridChangeOpts = {
      added: [],
      removed: [],
      updates: [
        {
          column: "channel:Q2hhbm5lbDox",
          row: 11,
          data: {
            kind: "money-cell",
            value: 43343,
            currency: "USD",
          },
        },
      ],
    };
    // Act
    const channels = getVariantChannelsInputs(changeData, 1);

    // Assert
    expect(channels).toEqual([]);
  });
  test("should return empty arrays when no changes for given column", () => {
    // Arrange
    const changeData: DatagridChangeOpts = {
      added: [],
      removed: [],
      updates: [
        { column: "attribute:1", row: 1, data: { value: { value: "test" } } },
        { column: "attribute:2", row: 1, data: { value: { value: "test2" } } },
      ],
    };
    // Act
    const channels = getVariantChannelsInputs(changeData, 1);

    // Assert
    expect(channels).toEqual([]);
  });
});
