import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Locale } from "@dashboard/components/Locale";
import { DiscountValueTypeEnum, type VoucherFragment, VoucherTypeEnum } from "@dashboard/graphql";
import { createIntl } from "react-intl";

import {
  createGetCellContent,
  formatDateTime,
  getVoucherListNameLabel,
  getVoucherListNameParts,
  getVoucherListRedemptionsLabel,
  getVoucherListScopeIconKind,
  getVoucherListScopeLabel,
  getVoucherListStatusLabel,
} from "./datagrid";

const intl = createIntl({ locale: "en" });

const columns: AvailableColumn[] = [
  { id: "code", title: "Name", width: 280 },
  { id: "status", title: "Status", width: 180 },
  { id: "value", title: "Offer", width: 160 },
  { id: "type", title: "Scope", width: 140 },
  { id: "limit", title: "Redemptions", width: 150 },
  { id: "start-date", title: "Starts", width: 180 },
  { id: "end-date", title: "Ends", width: 180 },
];

const createVoucher = (overrides: Partial<VoucherFragment> = {}): VoucherFragment =>
  ({
    __typename: "Voucher" as const,
    id: "voucher-1",
    name: "Summer sale",
    startDate: "2024-01-15T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    usageLimit: 100,
    used: 12,
    type: VoucherTypeEnum.ENTIRE_ORDER,
    discountValueType: DiscountValueTypeEnum.FIXED,
    minCheckoutItemsQuantity: null,
    countries: [],
    codesCount: {
      __typename: "VoucherCodeCountableConnection" as const,
      totalCount: 3,
    },
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

describe("formatDateTime", () => {
  it("formats date with EN locale", () => {
    // Arrange & Act
    const result = formatDateTime("2024-06-15T09:30:00Z", Locale.EN);

    // Assert
    expect(result).toBe("Jun 15, 2024, 9:30 AM");
  });
});

describe("voucher list cell helpers", () => {
  it("builds name with muted codes count suffix", () => {
    // Arrange & Act
    const parts = getVoucherListNameParts(createVoucher(), intl);

    // Assert
    expect(parts).toEqual({ primary: "Summer sale", secondary: " · 3 codes" });
    expect(getVoucherListNameLabel(createVoucher(), intl)).toBe("Summer sale · 3 codes");
  });

  it("falls back to codes count when voucher has no name", () => {
    // Arrange & Act
    const parts = getVoucherListNameParts(createVoucher({ name: null }), intl);

    // Assert
    expect(parts).toEqual({ primary: "", secondary: "3 codes" });
  });

  it("summarizes redemptions with a usage limit", () => {
    // Arrange & Act
    const label = getVoucherListRedemptionsLabel(createVoucher(), intl);

    // Assert
    expect(label).toBe("12 of 100");
  });

  it("summarizes unlimited redemptions", () => {
    // Arrange & Act
    const label = getVoucherListRedemptionsLabel(createVoucher({ usageLimit: null }), intl);

    // Assert
    expect(label).toBe("12 used · no cap");
  });

  it("maps voucher types to scope labels and icons", () => {
    // Assert
    expect(getVoucherListScopeLabel(createVoucher(), intl)).toBe("Entire order");
    expect(getVoucherListScopeIconKind(createVoucher())).toBe("entireOrder");
    expect(
      getVoucherListScopeLabel(createVoucher({ type: VoucherTypeEnum.SPECIFIC_PRODUCT }), intl),
    ).toBe("Products");
    expect(
      getVoucherListScopeIconKind(createVoucher({ type: VoucherTypeEnum.SPECIFIC_PRODUCT })),
    ).toBe("products");
    expect(getVoucherListScopeIconKind(createVoucher({ type: VoucherTypeEnum.SHIPPING }))).toBe(
      "shipping",
    );
  });

  it("summarizes free-shipping scope by country reach", () => {
    // Assert — empty countries = worldwide
    expect(getVoucherListScopeLabel(createVoucher({ type: VoucherTypeEnum.SHIPPING }), intl)).toBe(
      "Worldwide",
    );
    expect(
      getVoucherListScopeLabel(
        createVoucher({
          type: VoucherTypeEnum.SHIPPING,
          countries: [{ __typename: "CountryDisplay", code: "DE", country: "Germany" }],
        }),
        intl,
      ),
    ).toBe("Germany");
    expect(
      getVoucherListScopeLabel(
        createVoucher({
          type: VoucherTypeEnum.SHIPPING,
          countries: [
            { __typename: "CountryDisplay", code: "DE", country: "Germany" },
            { __typename: "CountryDisplay", code: "PL", country: "Poland" },
          ],
        }),
        intl,
      ),
    ).toBe("2 countries");
  });

  it("marks a future voucher as scheduled", () => {
    // Arrange
    const now = new Date("2024-01-01T00:00:00Z");

    // Act
    const result = getVoucherListStatusLabel({
      voucher: createVoucher({
        startDate: "2024-06-01T00:00:00Z",
        endDate: "2024-12-31T00:00:00Z",
      }),
      intl,
      now,
    });

    // Assert
    expect(result.status).toBe("scheduled");
    expect(result.label.startsWith("Scheduled")).toBe(true);
  });
});

describe("VoucherListDatagrid createGetCellContent", () => {
  it("renders name with primary/secondary text cell", () => {
    // Arrange
    const getCellContent = createGetCellContent({
      vouchers: [createVoucher()],
      columns,
      locale: Locale.EN,
      intl,
    });

    // Act
    const cell = getCellContent([0, 0]);

    // Assert
    expect(cell).toMatchObject({
      copyData: "Summer sale · 3 codes",
      data: {
        kind: "primary-secondary-text-cell",
        primary: "Summer sale",
        secondary: " · 3 codes",
      },
    });
  });

  it("renders scope with matching type icon", () => {
    // Arrange
    const getCellContent = createGetCellContent({
      vouchers: [createVoucher({ type: VoucherTypeEnum.SHIPPING })],
      columns,
      locale: Locale.EN,
      intl,
    });

    // Act
    const cell = getCellContent([3, 0]);

    // Assert
    expect(cell).toMatchObject({
      copyData: "Worldwide",
      data: {
        kind: "voucher-scope-cell",
        scopeKind: "shipping",
        label: "Worldwide",
      },
    });
  });

  it("returns free shipping offer without needing a selected channel", () => {
    // Arrange
    const vouchers = [
      createVoucher({
        type: VoucherTypeEnum.SHIPPING,
        discountValueType: DiscountValueTypeEnum.PERCENTAGE,
        channelListings: [],
      }),
    ];
    const getCellContent = createGetCellContent({
      vouchers,
      columns,
      locale: Locale.EN,
      intl,
    });

    // Act
    const cell = getCellContent([2, 0]);

    // Assert
    expect(cell).toHaveProperty("data", "Free shipping");
  });

  it("returns varies-by-channel when percentage amounts differ", () => {
    // Arrange
    const vouchers = [
      createVoucher({
        discountValueType: DiscountValueTypeEnum.PERCENTAGE,
        channelListings: [
          {
            __typename: "VoucherChannelListing" as const,
            id: "vcl-1",
            discountValue: 10,
            currency: "USD",
            channel: {
              __typename: "Channel" as const,
              id: "channel-1",
              name: "US",
              currencyCode: "USD",
            },
            minSpent: null,
          },
          {
            __typename: "VoucherChannelListing" as const,
            id: "vcl-2",
            discountValue: 20,
            currency: "EUR",
            channel: {
              __typename: "Channel" as const,
              id: "channel-2",
              name: "EU",
              currencyCode: "EUR",
            },
            minSpent: null,
          },
        ],
      }),
    ];
    const getCellContent = createGetCellContent({
      vouchers,
      columns,
      locale: Locale.EN,
      intl,
    });

    // Act
    const cell = getCellContent([2, 0]);

    // Assert
    expect(cell).toHaveProperty("data", "Varies by channel");
  });

  it("returns PLACEHOLDER for null start date", () => {
    // Arrange
    const vouchers = [createVoucher({ startDate: null })];
    const getCellContent = createGetCellContent({
      vouchers,
      columns,
      locale: Locale.EN,
      intl,
    });

    // Act
    const cell = getCellContent([5, 0]);

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
      intl,
    });

    // Act
    const cell = getCellContent([0, 0]);

    // Assert
    expect(cell).toHaveProperty("data", "");
  });
});
