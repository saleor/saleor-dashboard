import { DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";
import { useForm } from "react-hook-form";

import {
  LineToRefund,
  OrderTransactionRefundPageFormData,
} from "./OrderTransactionRefundPage";
import {
  canRefundShipping,
  createSetMaxQty,
  getMaxQtyToRefund,
  getRefundEditOrderLinesToRefund,
  getSelectedProductsValue,
  handleLinesToRefundChange,
  useRecalculateTotalAmount,
  validateQty,
  ValidateQtyParams,
} from "./utils";

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

describe("createSetMaxQty", () => {
  it("does nothing when order is not provided", () => {
    // Arrange
    const setValue = jest.fn();
    const params = {
      order: null,
      draftRefund: undefined,
      linesToRefund: [],
      setValue,
    };

    const setMaxQty = createSetMaxQty(params);

    // Act
    setMaxQty([0]);

    // Assert
    expect(setValue).not.toHaveBeenCalled();
  });

  it("updates the qtyToRefund form value", () => {
    // Arrange
    const setValue = jest.fn();
    const params = {
      order: {
        lines: [
          {
            id: "1",
            quantity: 10,
          },
        ],
        grantedRefunds: [],
      } as unknown as OrderDetailsGrantRefundFragment,
      draftRefund: undefined,
      linesToRefund: [],
      setValue,
    };
    const setMaxQty = createSetMaxQty(params);

    // Act
    setMaxQty([0]);

    // Assert
    expect(setValue).toHaveBeenCalledWith(
      "qtyToRefund",
      [
        {
          row: 0,
          value: 10, // max quantity to refund for row 0
        },
      ],
      { shouldDirty: true },
    );
  });
});

describe("getSelectedProductsValue", () => {
  it("returns 0 when qtyToRefund or order is not provided", () => {
    // Arrange
    const params = {
      linesToRefund: [],
      order: null,
    };

    // Act
    const result = getSelectedProductsValue(params);

    // Assert
    expect(result).toBe(0);
  });

  it("returns the total value of selected products", () => {
    // Arrange
    const linesToRefund = [
      {
        row: 0,
        quantity: 2,
        reason: "",
      },
      {
        row: 1,
        quantity: 3,
        reason: "",
      },
    ] as LineToRefund[];

    const order = {
      lines: [
        {
          unitPrice: {
            gross: {
              amount: 10,
            },
          },
        },
        {
          unitPrice: {
            gross: {
              amount: 20,
            },
          },
        },
      ],
    } as unknown as OrderDetailsGrantRefundFragment;

    // Act
    const result = getSelectedProductsValue({
      linesToRefund,
      order,
    });

    // Assert
    expect(result).toBe(80); // (10 * 2) + (20 * 3) = 80
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

describe("validateQty", () => {
  it("returns 0 when update data value or order is not provided", () => {
    const result = validateQty({
      update: { data: { value: null }, row: 0 },
      order: null,
      draftRefund: undefined,
    } as unknown as ValidateQtyParams);

    expect(result).toBe(0);
  });

  it("returns 0 when update data value is not a number", () => {
    const result = validateQty({
      update: { data: { value: "not a number" }, row: 0 },
      order: { lines: [{ id: "1", quantity: 10 }], grantedRefunds: [] },
      draftRefund: undefined,
    } as unknown as ValidateQtyParams);

    expect(result).toBe(0);
  });

  it("returns 0 when update data value is less than 0", () => {
    const result = validateQty({
      update: { data: { value: "-5" }, row: 0 },
      order: { lines: [{ id: "1", quantity: 10 }], grantedRefunds: [] },
      draftRefund: undefined,
    } as unknown as ValidateQtyParams);

    expect(result).toBe(0);
  });

  it("returns maxQtyToRefund when update data value is greater than maxQtyToRefund", () => {
    const result = validateQty({
      update: { data: { value: "15" }, row: 0 },
      order: { lines: [{ id: "1", quantity: 10 }], grantedRefunds: [] },
      draftRefund: undefined,
    } as unknown as ValidateQtyParams);

    expect(result).toBe(10);
  });

  it("returns update data value when it is within the valid range", () => {
    const result = validateQty({
      update: { data: { value: "5" }, row: 0 },
      order: { lines: [{ id: "1", quantity: 10 }], grantedRefunds: [] },
      draftRefund: undefined,
    } as unknown as ValidateQtyParams);

    expect(result).toBe(5);
  });
});

describe("handleLinesToRefundChange", () => {
  it("does nothing when currentUpdate is not provided", () => {
    // Arrange
    const setValue = jest.fn();
    const params = {
      data: { currentUpdate: null } as unknown as DatagridChangeOpts,
      linesToRefund: [],
      order: null,
      draftRefund: undefined,
      setValue,
    };

    // Act
    handleLinesToRefundChange(params);

    // Assert
    expect(setValue).not.toHaveBeenCalled();
  });

  it("updates the qtyToRefund form value", () => {
    // Arrange
    const setValue = jest.fn();
    const params = {
      data: {
        currentUpdate: { row: 0, data: { value: "5" } },
      } as DatagridChangeOpts,
      linesToRefund: [
        {
          row: 0,
          quantity: 2,
          reason: "",
        },
        {
          row: 1,
          quantity: 3,
          reason: "",
        },
      ],
      order: {
        lines: [
          {
            id: "1",
            quantity: 10,
          },
        ],
        grantedRefunds: [],
      } as unknown as OrderDetailsGrantRefundFragment,
      draftRefund: undefined,
      setValue,
    };

    // Act
    handleLinesToRefundChange(params);

    // Assert
    expect(setValue).toHaveBeenCalledWith(
      "qtyToRefund",
      [
        {
          row: 1,
          value: 3,
        },
        {
          row: 0,
          value: 5, // updated value
        },
      ],
      { shouldDirty: true },
    );
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
        row: 0,
        value: 2,
      },
      {
        row: 1,
        value: 3,
      },
    ]);
  });
});
