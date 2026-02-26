import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Locale } from "@dashboard/components/Locale";
import { type VoucherFragment } from "@dashboard/graphql";

import { createGetCellContent } from "./datagrid";

const columns: AvailableColumn[] = [
  { id: "code", title: "Code", width: 350 },
  { id: "min-spent", title: "Min. Spent", width: 200 },
  { id: "start-date", title: "Starts", width: 200 },
  { id: "end-date", title: "Ends", width: 200 },
  { id: "value", title: "Value", width: 200 },
  { id: "limit", title: "Uses", width: 200 },
];

const createVoucher = (overrides: Partial<VoucherFragment> = {}): VoucherFragment =>
  ({
    __typename: "Voucher" as const,
    id: "voucher-1",
    name: "SUMMER2024",
    startDate: "2024-01-15T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    usageLimit: 100,
    type: "ENTIRE_ORDER",
    discountValueType: "FIXED",
    minCheckoutItemsQuantity: null,
    countries: [],
    channelListings: [
      {
        __typename: "VoucherChannelListing" as const,
        id: "vcl-1",
        discountValue: 10,
        currency: "USD",
        channel: {
          __typename: "Channel" as const,
          id: "channel-1",
          name: "Default Channel",
          currencyCode: "USD",
        },
        minSpent: {
          __typename: "Money" as const,
          amount: 50,
          currency: "USD",
        },
      },
    ],
    metadata: [],
    privateMetadata: [],
    ...overrides,
  }) as VoucherFragment;

describe("VoucherListDatagrid createGetCellContent", () => {
  it("returns formatted start date for start-date column", () => {
    // Arrange
    const vouchers = [createVoucher()];
    const getCellContent = createGetCellContent({
      vouchers,
      columns,
      locale: Locale.EN,
      selectedChannelId: "channel-1",
    });

    // Act
    const cell = getCellContent([2, 0]);

    // Assert
    expect(cell).toHaveProperty("data", "Jan 15, 2024 12:00 AM");
  });

  it("returns formatted end date for end-date column", () => {
    // Arrange
    const vouchers = [createVoucher()];
    const getCellContent = createGetCellContent({
      vouchers,
      columns,
      locale: Locale.EN,
      selectedChannelId: "channel-1",
    });

    // Act
    const cell = getCellContent([3, 0]);

    // Assert
    expect(cell).toHaveProperty("data", "Dec 31, 2024 11:59 PM");
  });

  it("returns PLACEHOLDER for null start date", () => {
    // Arrange
    const vouchers = [createVoucher({ startDate: null })];
    const getCellContent = createGetCellContent({
      vouchers,
      columns,
      locale: Locale.EN,
      selectedChannelId: "channel-1",
    });

    // Act
    const cell = getCellContent([2, 0]);

    // Assert
    expect(cell).toHaveProperty("data", PLACEHOLDER);
  });

  it("returns PLACEHOLDER for null end date", () => {
    // Arrange
    const vouchers = [createVoucher({ endDate: null })];
    const getCellContent = createGetCellContent({
      vouchers,
      columns,
      locale: Locale.EN,
      selectedChannelId: "channel-1",
    });

    // Act
    const cell = getCellContent([3, 0]);

    // Assert
    expect(cell).toHaveProperty("data", PLACEHOLDER);
  });

  it("returns empty text cell for missing row data", () => {
    // Arrange
    const vouchers: VoucherFragment[] = [];
    const getCellContent = createGetCellContent({
      vouchers,
      columns,
      locale: Locale.EN,
    });

    // Act
    const cell = getCellContent([0, 0]);

    // Assert
    expect(cell).toHaveProperty("data", "");
  });
});
