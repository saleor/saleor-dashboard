import {
  DiscountValueTypeEnum,
  type OrderDetailsFragment,
  OrderDiscountType,
  type OrderLineDiscountFragment,
  type OrderLineFragment,
  VoucherTypeEnum,
} from "@dashboard/graphql";

import { buildLineWaterfall } from "./buildLineWaterfall";

const money = (amount: number, currency = "USD") => ({
  __typename: "Money" as const,
  amount,
  currency,
});

const taxedMoney = (gross: number, currency = "USD", tax = 0) => ({
  __typename: "TaxedMoney" as const,
  gross: money(gross, currency),
  net: money(gross - tax, currency),
  tax: money(tax, currency),
  currency,
});

interface MakeLineOpts {
  id?: string;
  productName?: string;
  variantName?: string;
  quantity?: number;
  undiscountedUnit?: number;
  unit?: number;
  total?: number;
  undiscountedTotal?: number;
  taxOnTotal?: number;
  taxRate?: number;
  voucherCode?: string | null;
  currency?: string;
  discounts?: OrderLineDiscountFragment[];
  isGift?: boolean;
}

function makeLineDiscount(opts: {
  id: string;
  type: OrderDiscountType;
  totalAmount: number;
  unitAmount?: number;
  name?: string | null;
  reason?: string | null;
  currency?: string;
  valueType?: DiscountValueTypeEnum;
  value?: number;
}): OrderLineDiscountFragment {
  const currency = opts.currency ?? "USD";

  return {
    __typename: "OrderLineDiscount",
    id: opts.id,
    type: opts.type,
    name: opts.name ?? null,
    translatedName: null,
    valueType: opts.valueType ?? DiscountValueTypeEnum.FIXED,
    value: opts.value ?? opts.totalAmount,
    reason: opts.reason ?? null,
    total: money(opts.totalAmount, currency),
    unit: money(opts.unitAmount ?? opts.totalAmount, currency),
  };
}

function makeLine({
  id = "L1",
  productName = "Product",
  variantName = "Variant",
  quantity = 1,
  undiscountedUnit = 100,
  unit,
  total,
  undiscountedTotal,
  taxOnTotal = 0,
  taxRate = 0,
  voucherCode = null,
  currency = "USD",
  discounts = [],
  isGift = false,
}: MakeLineOpts = {}): OrderLineFragment {
  const undiscountedTotalAmount = undiscountedTotal ?? undiscountedUnit * quantity;
  const totalAmount =
    (total ?? unit !== undefined) ? (unit as number) * quantity : undiscountedTotalAmount;
  const unitAmount = unit ?? totalAmount / quantity;

  return {
    __typename: "OrderLine",
    id,
    isShippingRequired: true,
    productName,
    productSku: null,
    isGift,
    quantity,
    quantityFulfilled: 0,
    quantityToFulfill: quantity,
    unitDiscountValue: 0,
    unitDiscountReason: null,
    unitDiscountType: null,
    taxRate,
    voucherCode,
    allocations: null,
    variant: {
      __typename: "ProductVariant",
      id: "V1",
      name: variantName,
      quantityAvailable: 100,
      preorder: null,
      stocks: null,
      product: { __typename: "Product", id: "P1", isAvailableForPurchase: true },
    },
    totalPrice: taxedMoney(totalAmount, currency, taxOnTotal),
    undiscountedTotalPrice: taxedMoney(undiscountedTotalAmount, currency, 0),
    unitDiscount: money(undiscountedUnit - unitAmount, currency),
    undiscountedUnitPrice: {
      __typename: "TaxedMoney",
      currency,
      gross: money(undiscountedUnit, currency),
      net: money(undiscountedUnit, currency),
      tax: money(0, currency),
    },
    unitPrice: {
      __typename: "TaxedMoney",
      gross: money(unitAmount, currency),
      net: money(unitAmount - taxOnTotal / quantity, currency),
      tax: money(taxOnTotal / quantity, currency),
    },
    taxClass: null,
    thumbnail: null,
    discounts,
  } as unknown as OrderLineFragment;
}

interface MakeOrderOpts {
  lines: OrderLineFragment[];
  voucherCode?: string | null;
  voucher?: { id: string; name: string | null; code: string | null; type: VoucherTypeEnum } | null;
  discounts?: OrderDetailsFragment["discounts"];
  shippingPrice?: number;
  total?: number;
}

function makeOrder({
  lines,
  voucherCode = null,
  voucher = null,
  discounts = [],
  shippingPrice = 0,
  total,
}: MakeOrderOpts): OrderDetailsFragment {
  const linesTotal = lines.reduce((acc, l) => acc + l.totalPrice.gross.amount, 0);
  const totalAmount = total ?? linesTotal + shippingPrice;

  return {
    __typename: "Order",
    id: "O1",
    voucher,
    voucherCode,
    discounts,
    lines,
    shippingPrice: { __typename: "TaxedMoney", gross: money(shippingPrice) },
    total: {
      __typename: "TaxedMoney",
      gross: money(totalAmount),
      net: money(totalAmount),
      tax: money(0),
    },
    undiscountedTotal: {
      __typename: "TaxedMoney",
      gross: money(totalAmount),
      net: money(totalAmount),
    },
    subtotal: { __typename: "TaxedMoney", gross: money(linesTotal), net: money(linesTotal) },
  } as unknown as OrderDetailsFragment;
}

function makeOrderDiscount({
  id,
  type,
  totalAmount,
  name = null,
  reason = null,
}: {
  id: string;
  type: OrderDiscountType;
  totalAmount: number;
  name?: string | null;
  reason?: string | null;
}) {
  return {
    __typename: "OrderDiscount" as const,
    id,
    type,
    name,
    translatedName: null,
    calculationMode: DiscountValueTypeEnum.FIXED,
    value: totalAmount,
    reason,
    amount: money(totalAmount),
    total: money(totalAmount),
  };
}

describe("buildLineWaterfall", () => {
  describe("line-level discounts", () => {
    it("returns no factors when nothing applies", () => {
      // Arrange
      const line = makeLine({ undiscountedUnit: 100, quantity: 2 });
      const order = makeOrder({ lines: [line] });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      expect(wf.factors).toEqual([]);
      expect(wf.start).toEqual(money(200));
      expect(wf.end).toEqual(money(200));
      expect(wf.warnings).toEqual([]);
    });

    it("emits a manual_line factor for a manual line discount", () => {
      // Arrange
      const discount = makeLineDiscount({
        id: "D1",
        type: OrderDiscountType.MANUAL,
        totalAmount: 10,
        reason: "VIP",
      });
      const line = makeLine({
        undiscountedUnit: 100,
        quantity: 1,
        unit: 90,
        discounts: [discount],
      });
      const order = makeOrder({ lines: [line] });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      expect(wf.factors).toHaveLength(1);
      expect(wf.factors[0]).toMatchObject({
        kind: "manual_line",
        reason: "VIP",
        signedDelta: { amount: 10 },
      });
    });

    it("emits a voucher_line factor for a SPECIFIC_PRODUCT-style line voucher", () => {
      // Arrange
      const discount = makeLineDiscount({
        id: "D1",
        type: OrderDiscountType.VOUCHER,
        totalAmount: 5,
        name: "SAVE5",
      });
      const line = makeLine({
        undiscountedUnit: 50,
        quantity: 1,
        unit: 45,
        voucherCode: "SAVE5",
        discounts: [discount],
      });
      const order = makeOrder({
        lines: [line],
        voucher: {
          id: "V1",
          name: "SAVE5",
          code: "SAVE5",
          type: VoucherTypeEnum.SPECIFIC_PRODUCT,
        },
        voucherCode: "SAVE5",
      });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      expect(wf.factors).toHaveLength(1);
      expect(wf.factors[0]).toMatchObject({
        kind: "voucher_line",
        name: "SAVE5",
        code: "SAVE5",
        signedDelta: { amount: 5 },
      });
    });

    it("emits a catalogue_promotion factor for a PROMOTION line discount", () => {
      // Arrange
      const discount = makeLineDiscount({
        id: "D1",
        type: OrderDiscountType.PROMOTION,
        totalAmount: 15,
        name: "Summer Sale",
      });
      const line = makeLine({
        undiscountedUnit: 100,
        quantity: 1,
        unit: 85,
        discounts: [discount],
      });
      const order = makeOrder({ lines: [line] });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      expect(wf.factors).toHaveLength(1);
      expect(wf.factors[0]).toMatchObject({
        kind: "catalogue_promotion",
        name: "Summer Sale",
        signedDelta: { amount: 15 },
        sourceType: OrderDiscountType.PROMOTION,
      });
    });

    it("emits multiple line factors when catalogue + line voucher coexist", () => {
      // Arrange (the bug `getLineDiscountsSummary` had: it only saw the first)
      const cat = makeLineDiscount({
        id: "D1",
        type: OrderDiscountType.PROMOTION,
        totalAmount: 10,
        name: "Sale",
      });
      const vou = makeLineDiscount({
        id: "D2",
        type: OrderDiscountType.VOUCHER,
        totalAmount: 5,
        name: "SAVE5",
      });
      const line = makeLine({
        undiscountedUnit: 100,
        quantity: 1,
        unit: 85,
        voucherCode: "SAVE5",
        discounts: [cat, vou],
      });
      const order = makeOrder({ lines: [line], voucherCode: "SAVE5" });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      expect(wf.factors.map(f => f.kind)).toEqual(["catalogue_promotion", "voucher_line"]);
    });

    it("orders manual_line LAST when stacked with non-manual line discounts", () => {
      // Arrange
      const cat = makeLineDiscount({
        id: "D1",
        type: OrderDiscountType.PROMOTION,
        totalAmount: 10,
        name: "Sale",
      });
      const man = makeLineDiscount({
        id: "D2",
        type: OrderDiscountType.MANUAL,
        totalAmount: 5,
        reason: "loyalty",
      });
      const line = makeLine({
        undiscountedUnit: 100,
        quantity: 1,
        unit: 85,
        discounts: [man, cat],
      });
      const order = makeOrder({ lines: [line] });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      expect(wf.factors.map(f => f.kind)).toEqual(["catalogue_promotion", "manual_line"]);
      expect(wf.warnings.map(w => w.id)).toContain("manual_overrides_automatic");
    });
  });

  describe("gift lines", () => {
    it("emits gift_line for an ORDER_PROMOTION discount on a line with isGift=true (full zero-out)", () => {
      // Arrange — Saleor's free-gift line: catalog price $75, billed $0,
      // with a single OrderLineDiscount of type ORDER_PROMOTION and amount
      // $75 attached to the gift line itself.
      const giftDiscount = makeLineDiscount({
        id: "GD1",
        type: OrderDiscountType.ORDER_PROMOTION,
        totalAmount: 75,
        name: "Buy 2 get 1 free",
      });
      const line = makeLine({
        undiscountedUnit: 75,
        quantity: 1,
        unit: 0,
        isGift: true,
        discounts: [giftDiscount],
      });
      const order = makeOrder({ lines: [line] });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      expect(wf.factors).toHaveLength(1);
      expect(wf.factors[0]).toMatchObject({
        kind: "gift_line",
        promotionName: "Buy 2 get 1 free",
        signedDelta: { amount: 75 },
      });
      expect(wf.start.amount).toBe(75);
      expect(wf.end.amount).toBe(0);
      expect(wf.warnings).toEqual([]);
    });

    it("falls back to catalogue_promotion when ORDER_PROMOTION appears on a non-gift line (defensive)", () => {
      // Arrange — backend contract says ORDER_PROMOTION should not appear
      // on `line.discounts[]` outside of gift lines, but if it does we must
      // still attribute the amount honestly rather than silently dropping it
      // (which previously left an empty waterfall while still subtracting
      // the amount from the residual).
      const orphanDiscount = makeLineDiscount({
        id: "D1",
        type: OrderDiscountType.ORDER_PROMOTION,
        totalAmount: 10,
        name: "Mystery rule",
      });
      const line = makeLine({
        undiscountedUnit: 100,
        quantity: 1,
        unit: 90,
        isGift: false,
        discounts: [orphanDiscount],
      });
      const order = makeOrder({ lines: [line] });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      expect(wf.factors).toHaveLength(1);
      expect(wf.factors[0]).toMatchObject({
        kind: "catalogue_promotion",
        name: "Mystery rule",
        signedDelta: { amount: 10 },
      });
    });
  });

  describe("order-level propagation", () => {
    it("propagates an order-level voucher proportionally across lines", () => {
      // Arrange: two lines, $100 + $200, $30 order voucher
      const line1 = makeLine({ id: "L1", undiscountedUnit: 100, quantity: 1, unit: 100 });
      const line2 = makeLine({ id: "L2", undiscountedUnit: 200, quantity: 1, unit: 200 });
      // After voucher proportional split: line1 gets $10 share, line2 gets $20.
      const line1Final = makeLine({ id: "L1", undiscountedUnit: 100, quantity: 1, unit: 90 });
      const line2Final = makeLine({ id: "L2", undiscountedUnit: 200, quantity: 1, unit: 180 });
      const order = makeOrder({
        lines: [line1Final, line2Final],
        voucher: { id: "V1", name: "ORDER10", code: "ORDER10", type: VoucherTypeEnum.ENTIRE_ORDER },
        voucherCode: "ORDER10",
        discounts: [
          makeOrderDiscount({
            id: "OD1",
            type: OrderDiscountType.VOUCHER,
            totalAmount: 30,
            name: "ORDER10",
          }),
        ],
      });

      // Act
      const wf1 = buildLineWaterfall(line1Final, order);
      const wf2 = buildLineWaterfall(line2Final, order);

      // Assert
      const share1 = wf1.factors.find(f => f.kind === "voucher_order_share");
      const share2 = wf2.factors.find(f => f.kind === "voucher_order_share");

      expect(share1).toBeDefined();
      expect(share2).toBeDefined();

      // 100/(100+200) * 30 = 10
      if (share1 && share1.kind === "voucher_order_share") {
        expect(share1.lineShare.amount).toBeCloseTo(10, 2);
        expect(share1.code).toBe("ORDER10");
      }

      if (share2 && share2.kind === "voucher_order_share") {
        expect(share2.lineShare.amount).toBeCloseTo(20, 2);
      }

      // Suppress unused var lint by using line1/line2
      void line1;
      void line2;
    });

    it("propagates an order_promotion as a per-line share", () => {
      // Arrange
      const line = makeLine({ undiscountedUnit: 100, quantity: 1, unit: 90 });
      const order = makeOrder({
        lines: [line],
        discounts: [
          makeOrderDiscount({
            id: "OD1",
            type: OrderDiscountType.ORDER_PROMOTION,
            totalAmount: 10,
            name: "Spend $100 get $10 off",
          }),
        ],
      });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      const f = wf.factors.find(x => x.kind === "order_promotion_share");

      expect(f).toBeDefined();
      // Single order-level record => allocation is exact, no warnings.
      expect(wf.warnings).toEqual([]);
    });

    it("propagates a manual order discount as a per-line share", () => {
      // Arrange
      const line = makeLine({ undiscountedUnit: 100, quantity: 1, unit: 95 });
      const order = makeOrder({
        lines: [line],
        discounts: [
          makeOrderDiscount({
            id: "OD1",
            type: OrderDiscountType.MANUAL,
            totalAmount: 5,
            reason: "Comp",
          }),
        ],
      });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      const f = wf.factors.find(x => x.kind === "manual_order_share");

      expect(f).toBeDefined();

      if (f && f.kind === "manual_order_share") {
        expect(f.reason).toBe("Comp");
        expect(f.lineShare.amount).toBeCloseTo(5, 2);
      }
    });

    it("does NOT propagate a SHIPPING voucher to line waterfalls", () => {
      // Arrange
      const line = makeLine({ undiscountedUnit: 100, quantity: 1, unit: 100 });
      const order = makeOrder({
        lines: [line],
        voucher: {
          id: "V1",
          name: "FREESHIP",
          code: "FREESHIP",
          type: VoucherTypeEnum.SHIPPING,
        },
        voucherCode: "FREESHIP",
        discounts: [
          makeOrderDiscount({
            id: "OD1",
            type: OrderDiscountType.VOUCHER,
            totalAmount: 5,
            name: "FREESHIP",
          }),
        ],
      });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      expect(wf.factors).toEqual([]);
    });
  });

  describe("manual line + automatic order coexistence", () => {
    it("emits both: manual_line and order-level share", () => {
      // Arrange (legal per backend precedence: manual line + order voucher)
      const manual = makeLineDiscount({
        id: "D1",
        type: OrderDiscountType.MANUAL,
        totalAmount: 10,
        reason: "loyalty",
      });
      const line = makeLine({
        undiscountedUnit: 100,
        quantity: 1,
        unit: 85, // 100 - 10 manual - 5 voucher share
        discounts: [manual],
      });
      const order = makeOrder({
        lines: [line],
        voucher: { id: "V1", name: "ORDER5", code: "ORDER5", type: VoucherTypeEnum.ENTIRE_ORDER },
        voucherCode: "ORDER5",
        discounts: [
          makeOrderDiscount({
            id: "OD1",
            type: OrderDiscountType.VOUCHER,
            totalAmount: 5,
          }),
        ],
      });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      const kinds = wf.factors.map(f => f.kind);

      expect(kinds).toContain("manual_line");
      expect(kinds).toContain("voucher_order_share");
    });
  });

  describe("reconciliation to recorded line total", () => {
    /**
     * Helper: walk the waterfall and return the running total at the end.
     * The new algorithm guarantees this exactly equals `wf.end.amount`.
     */
    const runningTotal = (wf: ReturnType<typeof buildLineWaterfall>) =>
      wf.factors.reduce((acc, f) => {
        if ("signedDelta" in f) return acc - f.signedDelta.amount;

        if ("lineShare" in f) return acc - f.lineShare.amount;

        if (f.kind === "other_adjustment") {
          return f.direction === "minus" ? acc - f.value.amount : acc + f.value.amount;
        }

        return acc;
      }, wf.start.amount);

    it("multi-record order discount: collapsed into one combined factor with named contributors and exact slice", () => {
      // Arrange: 1 line, $45 undiscounted, recorded final $40.50.
      // Order has TWO order-level records that together caused the $4.50 drop:
      // a manual order discount and a voucher. Saleor does not surface a
      // per-record-per-line split, so the dashboard collapses the two into
      // a single combined factor — exact slice, named contributors, no
      // fabricated per-record amounts.
      const line = makeLine({ undiscountedUnit: 45, quantity: 1, unit: 40.5 });
      const order = makeOrder({
        lines: [line],
        voucher: {
          id: "V1",
          name: "Cheapest line voucher",
          code: "VCODE",
          type: VoucherTypeEnum.ENTIRE_ORDER,
        },
        voucherCode: "VCODE",
        discounts: [
          makeOrderDiscount({
            id: "OD1",
            type: OrderDiscountType.MANUAL,
            totalAmount: 13.45,
            reason: "Service recovery",
          }),
          makeOrderDiscount({
            id: "OD2",
            type: OrderDiscountType.VOUCHER,
            totalAmount: 0.45,
            name: "Cheapest line voucher",
          }),
        ],
      });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert: math reconciles by construction
      expect(wf.start.amount).toBe(45);
      expect(wf.end.amount).toBe(40.5);
      expect(runningTotal(wf)).toBeCloseTo(wf.end.amount, 2);

      // No per-record shares; one combined factor instead.
      const perRecordShares = wf.factors.filter(
        f =>
          f.kind === "manual_order_share" ||
          f.kind === "voucher_order_share" ||
          f.kind === "order_promotion_share",
      );

      expect(perRecordShares).toHaveLength(0);

      const combined = wf.factors.find(f => f.kind === "order_level_combined");

      expect(combined).toBeDefined();

      if (combined && combined.kind === "order_level_combined") {
        // Slice equals the residual: 45 − 0 line-level − 40.50 = 4.50
        expect(combined.lineShare.amount).toBeCloseTo(4.5, 2);

        // Both records named, in source order, no per-record amounts.
        expect(combined.contributors).toHaveLength(2);
        expect(combined.contributors[0]).toMatchObject({
          kind: "manual",
          reason: "Service recovery",
        });
        expect(combined.contributors[1]).toMatchObject({
          kind: "voucher",
          name: "Cheapest line voucher",
          link: { kind: "voucher", voucherId: "V1" },
        });
      }

      // No approximation warning is emitted any more — the displayed slice
      // is exact, and we never invent per-record amounts.
      expect(wf.warnings).toEqual([]);
    });

    it("single-record order discount: derived share equals the actual residual (no warning)", () => {
      // Arrange: $100 line, $90 final, single $30 order-level voucher
      // (backend allocated $10 of the $30 to this line).
      const line = makeLine({ undiscountedUnit: 100, quantity: 1, unit: 90 });
      const order = makeOrder({
        lines: [line],
        voucher: { id: "V1", name: "ORDER10", code: "ORDER10", type: VoucherTypeEnum.ENTIRE_ORDER },
        voucherCode: "ORDER10",
        discounts: [
          makeOrderDiscount({
            id: "OD1",
            type: OrderDiscountType.VOUCHER,
            totalAmount: 30,
            name: "ORDER10",
          }),
        ],
      });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      const share = wf.factors.find(f => f.kind === "voucher_order_share");

      expect(share).toBeDefined();

      if (share && share.kind === "voucher_order_share") {
        // Derived from start - lineDeltas - end = 100 - 0 - 90 = 10
        expect(share.lineShare.amount).toBeCloseTo(10, 2);
      }

      // Single record => allocation is exact, no warnings.
      expect(wf.warnings).toEqual([]);
      expect(runningTotal(wf)).toBeCloseTo(wf.end.amount, 2);
    });

    it("emits other_adjustment when end < expected and no order-level discounts exist", () => {
      // Arrange: $100 undiscounted, $95 final, no recorded discounts at all.
      // The dashboard cannot attribute the $5 to any record but must still
      // reconcile.
      const line = makeLine({ undiscountedUnit: 100, quantity: 1, unit: 95 });
      const order = makeOrder({ lines: [line] });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      const adj = wf.factors.find(f => f.kind === "other_adjustment");

      expect(adj).toBeDefined();

      if (adj && adj.kind === "other_adjustment") {
        expect(adj.value.amount).toBeCloseTo(5, 2);
        expect(adj.direction).toBe("minus");
      }

      expect(runningTotal(wf)).toBeCloseTo(wf.end.amount, 2);
    });

    it("emits other_adjustment in the 'plus' direction when end > expected (price-up)", () => {
      // Arrange: $100 undiscounted, $105 final (e.g. plugin re-pricing), no
      // recorded discounts.
      const line = makeLine({ undiscountedUnit: 100, quantity: 1, unit: 105 });
      const order = makeOrder({ lines: [line] });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      const adj = wf.factors.find(f => f.kind === "other_adjustment");

      expect(adj).toBeDefined();

      if (adj && adj.kind === "other_adjustment") {
        expect(adj.value.amount).toBeCloseTo(5, 2);
        expect(adj.direction).toBe("plus");
      }

      expect(runningTotal(wf)).toBeCloseTo(wf.end.amount, 2);
    });

    it("rounds to currency precision: JPY (0 decimals) keeps integer amounts", () => {
      // Arrange — JPY with proportional split that would round oddly under
      // a hard-coded 2-decimal assumption.
      const lineDiscount = makeLineDiscount({
        id: "D1",
        type: OrderDiscountType.PROMOTION,
        totalAmount: 200,
        currency: "JPY",
        name: "JP-SALE",
      });
      const line = makeLine({
        currency: "JPY",
        undiscountedUnit: 1000,
        quantity: 1,
        unit: 700,
        discounts: [lineDiscount],
      });
      const order = makeOrder({
        lines: [line],
        discounts: [
          {
            __typename: "OrderDiscount",
            id: "OD1",
            type: OrderDiscountType.MANUAL,
            name: "manual",
            translatedName: null,
            calculationMode: DiscountValueTypeEnum.FIXED,
            value: 100,
            reason: null,
            amount: money(100, "JPY"),
            total: money(100, "JPY"),
          },
        ],
      });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert: every emitted amount is an integer (no JS-introduced cents).
      for (const f of wf.factors) {
        const amount =
          "signedDelta" in f
            ? f.signedDelta.amount
            : "lineShare" in f
              ? f.lineShare.amount
              : f.value.amount;

        expect(Number.isInteger(amount)).toBe(true);
      }

      // And the math reconciles to the recorded line total.
      expect(wf.end.amount).toBe(700);
    });

    it("absorbs sub-cent floating-point residuals silently (no factor emitted)", () => {
      // Arrange: $1 line, $0.70 final, $0.30 line discount — perfect reconcile.
      // Use a fractional currency that risks floating-point noise.
      const lineDiscount = makeLineDiscount({
        id: "D1",
        type: OrderDiscountType.PROMOTION,
        totalAmount: 0.1 + 0.2, // 0.30000000000000004 in JS
        name: "FP-noise",
      });
      const line = makeLine({
        undiscountedUnit: 1,
        quantity: 1,
        unit: 0.7,
        discounts: [lineDiscount],
      });
      const order = makeOrder({ lines: [line] });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert: only the line discount, no spurious other_adjustment
      expect(wf.factors).toHaveLength(1);
      expect(wf.factors[0].kind).toBe("catalogue_promotion");
    });
  });

  describe("source entity links", () => {
    it("links voucher_line factor to the order voucher when one is attached", () => {
      // Arrange
      const discount = makeLineDiscount({
        id: "D1",
        type: OrderDiscountType.VOUCHER,
        totalAmount: 5,
        name: "SAVE5",
      });
      const line = makeLine({
        undiscountedUnit: 50,
        quantity: 1,
        unit: 45,
        voucherCode: "SAVE5",
        discounts: [discount],
      });
      const order = makeOrder({
        lines: [line],
        voucher: {
          id: "Vch:abc",
          name: "SAVE5",
          code: "SAVE5",
          type: VoucherTypeEnum.SPECIFIC_PRODUCT,
        },
        voucherCode: "SAVE5",
      });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      const f = wf.factors.find(x => x.kind === "voucher_line");

      expect(f).toBeDefined();

      if (f && f.kind === "voucher_line") {
        expect(f.link).toEqual({ kind: "voucher", voucherId: "Vch:abc" });
      }
    });

    it("omits the voucher link when no Order.voucher.id is available", () => {
      // Arrange (legacy data: voucherCode is set but the voucher relation is null)
      const discount = makeLineDiscount({
        id: "D1",
        type: OrderDiscountType.VOUCHER,
        totalAmount: 5,
        name: "SAVE5",
      });
      const line = makeLine({
        undiscountedUnit: 50,
        quantity: 1,
        unit: 45,
        voucherCode: "SAVE5",
        discounts: [discount],
      });
      const order = makeOrder({ lines: [line], voucherCode: "SAVE5", voucher: null });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      const f = wf.factors.find(x => x.kind === "voucher_line");

      expect(f).toBeDefined();

      if (f && f.kind === "voucher_line") {
        expect(f.link).toBeUndefined();
      }
    });

    it("links voucher_order_share factor to the order voucher", () => {
      // Arrange
      const line = makeLine({ undiscountedUnit: 100, quantity: 1, unit: 90 });
      const order = makeOrder({
        lines: [line],
        voucher: {
          id: "Vch:order",
          name: "ORDER10",
          code: "ORDER10",
          type: VoucherTypeEnum.ENTIRE_ORDER,
        },
        voucherCode: "ORDER10",
        discounts: [
          makeOrderDiscount({
            id: "OD1",
            type: OrderDiscountType.VOUCHER,
            totalAmount: 10,
            name: "ORDER10",
          }),
        ],
      });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      const f = wf.factors.find(x => x.kind === "voucher_order_share");

      expect(f).toBeDefined();

      if (f && f.kind === "voucher_order_share") {
        expect(f.link).toEqual({ kind: "voucher", voucherId: "Vch:order" });
      }
    });

    it("does not attach a link to catalogue_promotion factors (no promotionId on the schema)", () => {
      // Arrange
      const discount = makeLineDiscount({
        id: "D1",
        type: OrderDiscountType.PROMOTION,
        totalAmount: 15,
        name: "Summer Sale",
      });
      const line = makeLine({
        undiscountedUnit: 100,
        quantity: 1,
        unit: 85,
        discounts: [discount],
      });
      const order = makeOrder({ lines: [line] });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      const f = wf.factors.find(x => x.kind === "catalogue_promotion");

      expect(f).toBeDefined();
      expect(f).not.toHaveProperty("link");
    });

    it("does not attach a link to order_promotion_share factors", () => {
      // Arrange
      const line = makeLine({ undiscountedUnit: 100, quantity: 1, unit: 90 });
      const order = makeOrder({
        lines: [line],
        discounts: [
          makeOrderDiscount({
            id: "OD1",
            type: OrderDiscountType.ORDER_PROMOTION,
            totalAmount: 10,
            name: "Spend $100 get $10 off",
          }),
        ],
      });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      const f = wf.factors.find(x => x.kind === "order_promotion_share");

      expect(f).toBeDefined();
      expect(f).not.toHaveProperty("link");
    });

    it("falls through empty-string voucher name to the discount record's name (uses || not ??)", () => {
      // Arrange — `Order.voucher.name` is the empty string (rare but valid),
      // but the order discount record carries a usable display name.
      const orderDiscount = makeOrderDiscount({
        id: "OD1",
        type: OrderDiscountType.VOUCHER,
        totalAmount: 6,
        name: "BLACKFRIDAY",
      });
      const line = makeLine({ undiscountedUnit: 100, quantity: 1, unit: 94 });
      const order = makeOrder({
        lines: [line],
        voucher: { id: "V1", name: "", code: "BF", type: VoucherTypeEnum.ENTIRE_ORDER },
        discounts: [orderDiscount],
      });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      const f = wf.factors.find(x => x.kind === "voucher_order_share");

      expect(f).toBeDefined();

      if (f && f.kind === "voucher_order_share") {
        expect(f.name).toBe("BLACKFRIDAY");
      }
    });

    it("absent name on a catalogue_promotion still emits the factor (no link, no crash)", () => {
      // Arrange
      const discount = makeLineDiscount({
        id: "D1",
        type: OrderDiscountType.PROMOTION,
        totalAmount: 15,
        name: null,
      });
      const line = makeLine({
        undiscountedUnit: 100,
        quantity: 1,
        unit: 85,
        discounts: [discount],
      });
      const order = makeOrder({ lines: [line] });

      // Act
      const wf = buildLineWaterfall(line, order);

      // Assert
      const f = wf.factors.find(x => x.kind === "catalogue_promotion");

      expect(f).toBeDefined();

      if (f && f.kind === "catalogue_promotion") {
        expect(f.name).toBeNull();
      }
    });
  });
});
