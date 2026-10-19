import { type ChannelData } from "@dashboard/channels/utils";
import { type DatagridChange } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type ProductDetailsVariantFragment } from "@dashboard/graphql";
import { type MutableRefObject } from "react";

import { getData } from "./utils";

const CHANNEL_ID = "channel-1";
const MUTED = "#999999";

const columns: AvailableColumn[] = [
  { id: `channel:${CHANNEL_ID}`, title: "Price", width: 150 },
  { id: `availableInChannel:${CHANNEL_ID}`, title: "Available", width: 150 },
];
const channels: ChannelData[] = [{ id: CHANNEL_ID, name: "Channel", currency: "USD" }];

const variantWithListing = (isAvailableForPurchase: boolean): ProductDetailsVariantFragment =>
  ({
    id: "variant-1",
    channelListings: [
      {
        id: "listing-1",
        isAvailableForPurchase,
        channel: { id: CHANNEL_ID, name: "Channel", currencyCode: "USD" },
        price: { amount: 10, currency: "USD" },
        costPrice: null,
      },
    ],
    stocks: [],
    attributes: [],
  }) as unknown as ProductDetailsVariantFragment;

const getCell = (
  column: number,
  variant: ProductDetailsVariantFragment,
  changes: DatagridChange[] = [],
) =>
  getData({
    availableColumns: columns,
    column,
    row: 0,
    channels,
    variants: [variant],
    variantAttributes: [],
    changes: { current: changes } as MutableRefObject<DatagridChange[]>,
    added: [],
    removed: [],
    searchAttributeValues: jest.fn(),
    getChangeIndex: (column, row) =>
      changes.findIndex(change => change.column === column && change.row === row),
    mutedTextColor: MUTED,
  });

describe("ProductVariants getData channel cells", () => {
  it("shows availability from the listing flag, not listing existence", () => {
    // Arrange
    const variant = variantWithListing(false);

    // Act
    const cell = getCell(1, variant);

    // Assert
    expect(cell).toMatchObject({ data: false });
  });

  it("keeps price of an unavailable listing visible but muted", () => {
    // Arrange
    const variant = variantWithListing(false);

    // Act
    const cell = getCell(0, variant);

    // Assert
    expect(cell).toMatchObject({ data: { kind: "money-cell", value: 10 } });
    expect(cell.themeOverride).toEqual({ textDark: MUTED });
  });

  it("does not mute price of an available listing", () => {
    // Arrange
    const variant = variantWithListing(true);

    // Act
    const cell = getCell(0, variant);

    // Assert
    expect(cell.themeOverride).toBeUndefined();
  });

  it("mutes price after availability is unticked in the grid", () => {
    // Arrange
    const variant = variantWithListing(true);
    const changes: DatagridChange[] = [
      { column: `availableInChannel:${CHANNEL_ID}`, row: 0, data: false },
    ];

    // Act
    const cell = getCell(0, variant, changes);

    // Assert
    expect(cell).toMatchObject({ data: { value: 10 } });
    expect(cell.themeOverride).toEqual({ textDark: MUTED });
  });
});
