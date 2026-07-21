import { OrderDiscountType } from "@dashboard/graphql";

import { type LinePriceWaterfall } from "./utils/types";

const money = (amount: number, currency = "USD") =>
  ({ __typename: "Money", amount, currency }) as const;

/** A plain discounted line: catalogue promotion, no override. */
export const discountedWaterfall: LinePriceWaterfall = {
  lineId: "line-1",
  productName: "White Plimsolls",
  variantName: "41",
  productSku: "white-plimsolls-41",
  thumbnailUrl: "https://example.com/thumb.png",
  quantity: 1,
  fractionDigits: 2,
  start: money(100),
  end: money(60),
  factors: [
    {
      kind: "catalogue_promotion",
      name: "Summer sale",
      signedDelta: money(40),
      sourceType: OrderDiscountType.SALE,
    },
  ],
  isPriceOverridden: false,
  priceOverrideReason: null,
  warnings: [],
};

/** Price overridden with a recorded reason and no other discounts:
 *  `start === end`, the base row carries the "Overridden" badge + reason. */
export const overriddenNoDiscountWaterfall: LinePriceWaterfall = {
  lineId: "line-2",
  productName: "Leather Boots",
  variantName: "42",
  productSku: "leather-boots-42",
  thumbnailUrl: "https://example.com/boots.png",
  quantity: 2,
  fractionDigits: 2,
  start: money(180),
  end: money(180),
  factors: [],
  isPriceOverridden: true,
  priceOverrideReason: "Loyalty pricing agreed with customer",
  warnings: [],
};

/** Price overridden AND further discounted: badge + reason on the base row,
 *  plus the usual discount steps below. */
export const overriddenWithDiscountWaterfall: LinePriceWaterfall = {
  lineId: "line-3",
  productName: "Wool Scarf",
  variantName: "One size",
  productSku: "wool-scarf",
  thumbnailUrl: "https://example.com/scarf.png",
  quantity: 1,
  fractionDigits: 2,
  start: money(50),
  end: money(40),
  factors: [
    {
      kind: "voucher_line",
      name: "Autumn voucher",
      code: "AUTUMN10",
      signedDelta: money(10),
    },
  ],
  isPriceOverridden: true,
  priceOverrideReason: "Price matched competitor",
  warnings: [],
};

/** Overridden without a recorded reason: badge shows, detail falls back to the
 *  generic "custom price set" explainer. */
export const overriddenNoReasonWaterfall: LinePriceWaterfall = {
  lineId: "line-4",
  productName: "Canvas Tote",
  variantName: "One size",
  productSku: "canvas-tote",
  thumbnailUrl: "https://example.com/tote.png",
  quantity: 1,
  fractionDigits: 2,
  start: money(25),
  end: money(25),
  factors: [],
  isPriceOverridden: true,
  priceOverrideReason: null,
  warnings: [],
};
