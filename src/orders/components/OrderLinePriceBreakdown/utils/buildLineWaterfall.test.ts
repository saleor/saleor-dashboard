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
  discounts?: OrderLineDiscountFragment[];
}

function makeLineDiscount(opts: {
  id: string;
  type: OrderDiscountType;
  totalAmount: number;
  unitAmount?: number;
  name?: string | null;
  reason?: string | null;
  valueType?: DiscountValueTypeEnum;
  value?: number;
}): OrderLineDiscountFragment {
  return {
    __typename: "OrderLineDiscount",
    id: opts.id,
    type: opts.type,
    name: opts.name ?? null,
    translatedName: null,
    valueType: opts.valueType ?? DiscountValueTypeEnum.FIXED,
    value: opts.value ?? opts.totalAmount,
    reason: opts.reason ?? null,
    total: money(opts.totalAmount),
    unit: money(opts.unitAmount ?? opts.totalAmount),
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
  discounts = [],
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
    isGift: false,
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
    totalPrice: taxedMoney(totalAmount, "USD", taxOnTotal),
    undiscountedTotalPrice: taxedMoney(undiscountedTotalAmount, "USD", 0),
    unitDiscount: money(undiscountedUnit - unitAmount),
    undiscountedUnitPrice: {
      __typename: "TaxedMoney",
      currency: "USD",
      gross: money(undiscountedUnit),
      net: money(undiscountedUnit),
      tax: money(0),
    },
    unitPrice: {
      __typename: "TaxedMoney",
      gross: money(unitAmount),
      net: money(unitAmount - taxOnTotal / quantity),
      tax: money(taxOnTotal / quantity),
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
      // Single order-level record => allocation is exact, no approximation note
      expect(wf.warnings.map(w => w.id)).not.toContain("order_discount_propagated_to_line");
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

    it("multi-record order discount: per-record split is approximate but total reconciles", () => {
      // Arrange: 1 line, $45 undiscounted, recorded final $40.50.
      // Order has TWO order-level records that together caused the $4.50 drop:
      // a manual order discount of $13.45 and a voucher of $0.45 (real-world
      // order had multiple lines, but for this single line the absorption is
      // $4.50). The dashboard cannot know how the backend split those across
      // lines, but it must always reconcile to $40.50.
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

      // Two order-level shares emitted (one per record)
      const shares = wf.factors.filter(
        f => f.kind === "manual_order_share" || f.kind === "voucher_order_share",
      );

      expect(shares).toHaveLength(2);

      // Sum of shares == total absorbed by the line ($4.50)
      const sumShares = shares.reduce(
        (acc, f) =>
          acc +
          (f.kind === "voucher_order_share" || f.kind === "manual_order_share"
            ? f.lineShare.amount
            : 0),
        0,
      );

      expect(sumShares).toBeCloseTo(4.5, 2);

      // And we surface that the per-record split is approximate
      expect(wf.warnings.map(w => w.id)).toContain("order_discount_propagated_to_line");
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

      // Single record => allocation is exact, no approximation warning
      expect(wf.warnings.map(w => w.id)).not.toContain("order_discount_propagated_to_line");
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
