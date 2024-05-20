import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";
import { useForm } from "react-hook-form";

import { getRefundEditOrderLinesToRefund } from "./formDefaults";
import { LineToRefund, OrderTransactionRefundPageFormData } from "./OrderTransactionRefundPage";
import { canRefundShipping, getMaxQtyToRefund, useRecalculateTotalAmount } from "./utils";

describe("getMaxQtyToRefund", () => {
  it("returns 0 when rowData or order is not provided", () => {
    // Arrange
    const params = {
      rowData: undefined,
      order: null,
      draftRefund: undefined,
    };

    // Act
    const result = getMaxQtyToRefund(params);

    // Assert
    expect(result).toBe(0);
  });

  it("returns the max quantity to refund", () => {
    // max quantity to refund is calculated based on quantity ordered
    // and quantities already refunded in other granted refunds

    // Arrange
    const rowData = {
      id: "1",
      quantity: 10,
    };
    const order = {
      grantedRefunds: [
        {
          id: "2",
          lines: [
            {
              orderLine: {
                id: "1",
              },
              quantity: 2,
            },
          ],
        },
        {
          id: "3",
          lines: [
            {
              orderLine: {
                id: "1",
              },
              quantity: 3,
            },
          ],
        },
      ],
    } as unknown as OrderDetailsGrantRefundFragment;
    const draftRefund = {
      id: "2",
      lines: [
        {
          orderLine: {
            id: "1",
          },
          quantity: 2,
        },
      ],
    } as unknown as OrderDetailsGrantRefundFragment["grantedRefunds"][0];

    // Act
    const result = getMaxQtyToRefund({
      rowData,
      order,
      draftRefund,
    });

    // Assert
    expect(result).toBe(7); // 10 - 3 (from otherGrantedRefunds) = 7
  });
});

describe("useRecalculateTotalAmount", () => {
  it("updates the amount form value when includeShipping is true", () => {
    // Arrange
    const { result } = renderHook(() =>
      useForm({
        defaultValues: {
          linesToRefund: [] as LineToRefund[],
          amount: 5,
          transactionId: "",
          includeShipping: true,
          reason: "",
        } as OrderTransactionRefundPageFormData,
      }),
    );
    const { setValue, getValues } = result.current;
    const params = {
      getValues,
      setValue,
      includeShipping: true,
      order: {
        shippingPrice: {
          gross: {
            amount: 10,
          },
        },
      } as unknown as OrderDetailsGrantRefundFragment,
      selectedProductsValue: 20,
      linesToRefund: [
        {
          row: 0,
          quantity: 2,
          reason: "",
        },
      ],
      isFormDirty: true,
    };

    // Act
    renderHook(() => useRecalculateTotalAmount(params));

    // Assert
    expect(getValues("amount")).toBe(30); // 20 (selectedProductsValue) + 10 (shippingPrice) = 30
  });

  it("updates the amount form value when includeShipping is false", () => {
    // Arrange
    const { result } = renderHook(() =>
      useForm({
        defaultValues: {
          linesToRefund: [] as LineToRefund[],
          amount: 5,
          transactionId: "",
          includeShipping: true,
          reason: "",
        } as OrderTransactionRefundPageFormData,
      }),
    );
    const { setValue, getValues } = result.current;
    const params = {
      getValues,
      setValue,
      includeShipping: false,
      order: null,
      selectedProductsValue: 20,
      linesToRefund: [
        {
          row: 0,
          quantity: 2,
          reason: "",
        },
      ],
      isFormDirty: true,
    };

    // Act
    renderHook(() => useRecalculateTotalAmount(params));

    // Assert
    expect(getValues("amount")).toBe(20); // selectedProductsValue = 20
  });
});

describe("canRefundShipping", () => {
  it("returns true when no refund with shipping costs included is found", () => {
    // Arrange
    const order = {
      grantedRefunds: [
        {
          id: "1",
          shippingCostsIncluded: false,
        },
        {
          id: "2",
          shippingCostsIncluded: false,
        },
      ],
    } as unknown as OrderDetailsGrantRefundFragment;

    // Act
    const result = canRefundShipping(order, undefined);

    // Assert
    expect(result).toBe(true);
  });

  it("returns true when refund with shipping costs included is the current draft refund", () => {
    // Arrange
    const order = {
      grantedRefunds: [
        {
          id: "1",
          shippingCostsIncluded: true,
        },
        {
          id: "2",
          shippingCostsIncluded: false,
        },
      ],
    } as unknown as OrderDetailsGrantRefundFragment;
    const draftRefund = {
      id: "1",
    } as unknown as OrderDetailsGrantRefundFragment["grantedRefunds"][0];

    // Act
    const result = canRefundShipping(order, draftRefund);

    // Assert
    expect(result).toBe(true);
  });

  it("returns false when another refund has shipping costs included", () => {
    // Arrange
    const order = {
      grantedRefunds: [
        {
          id: "1",
          shippingCostsIncluded: true,
        },
        {
          id: "2",
          shippingCostsIncluded: false,
        },
      ],
    } as unknown as OrderDetailsGrantRefundFragment;
    const draftRefund = {
      id: "3",
    } as unknown as OrderDetailsGrantRefundFragment["grantedRefunds"][0];

    // Act
    const result = canRefundShipping(order, draftRefund);

    // Assert
    expect(result).toBe(false);
  });
});

describe("getRefundEditOrderLinesToRefund", () => {
  it("returns undefined when order is not provided", () => {
    // Arrange
    const order = null;
    const draftRefund = undefined;

    // Act
    const result = getRefundEditOrderLinesToRefund(order, draftRefund);

    // Assert
    expect(result).toBeUndefined();
  });

  it("returns refund lines with correct row and value", () => {
    // Arrange
    const order = {
      lines: [
        {
          id: "1",
        },
        {
          id: "2",
        },
      ],
    } as unknown as OrderDetailsGrantRefundFragment;
    const draftRefund = {
      lines: [
        {
          orderLine: {
            id: "1",
          },
          quantity: 2,
        },
        {
          orderLine: {
            id: "2",
          },
          quantity: 3,
        },
      ],
    } as unknown as OrderDetailsGrantRefundFragment["grantedRefunds"][0];

    // Act
    const result = getRefundEditOrderLinesToRefund(order, draftRefund);

    // Assert
    expect(result).toEqual([
      {
        quantity: 2,
        reason: "",
      },
      {
        quantity: 3,
        reason: "",
      },
    ]);
  });
});
