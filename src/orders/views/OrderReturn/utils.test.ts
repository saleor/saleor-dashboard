import { type OrderDetailsFragment } from "@dashboard/graphql";
import { OrderRefundAmountCalculationMode } from "@dashboard/orders/components/OrderRefundPage/form";
import {
  type FormsetLineReasonData,
  type FormsetQuantityData,
  type FormsetReplacementData,
  type OrderReturnFormData,
} from "@dashboard/orders/components/OrderReturnPage/form";

import ReturnFormDataParser from "./utils";

const lineItemData = { isFulfillment: false, isRefunded: false, orderLineId: "order-line-1" };

const baseFormData = (overrides: Partial<OrderReturnFormData> = {}): OrderReturnFormData => ({
  transactionId: "",
  amount: 0,
  refundShipmentCosts: false,
  autoGrantRefund: false,
  autoSendRefund: false,
  amountCalculationMode: OrderRefundAmountCalculationMode.NONE,
  reason: "",
  reasonReference: "",
  refundReason: "",
  refundReasonReference: "",
  itemsToBeReplaced: [] as FormsetReplacementData,
  fulfilledItemsQuantities: [] as FormsetQuantityData,
  waitingItemsQuantities: [] as FormsetQuantityData,
  unfulfilledItemsQuantities: [] as FormsetQuantityData,
  lineReasons: [] as FormsetLineReasonData,
  ...overrides,
});

describe("ReturnFormDataParser - reasons", () => {
  it("maps overall reason and reasonReference onto the products input", () => {
    // Arrange
    const formData = baseFormData({
      reason: "Customer changed their mind",
      reasonReference: "page-overall",
    });
    const parser = new ReturnFormDataParser({
      order: {} as OrderDetailsFragment,
      formData,
      refundsEnabled: false,
    });

    // Act
    const result = parser.getParsedData();

    // Assert
    expect(result.reason).toBe("Customer changed their mind");
    expect(result.reasonReference).toBe("page-overall");
  });

  it("maps per-line reason and reasonReference onto each returned order line", () => {
    // Arrange
    const formData = baseFormData({
      unfulfilledItemsQuantities: [{ id: "order-line-1", label: "", value: 2, data: lineItemData }],
      lineReasons: [
        {
          id: "order-line-1",
          label: "",
          value: { reason: "Damaged", reasonReference: "page-line-1" },
          data: lineItemData,
        },
      ],
    });
    const parser = new ReturnFormDataParser({
      order: {} as OrderDetailsFragment,
      formData,
      refundsEnabled: false,
    });

    // Act
    const result = parser.getParsedData();

    // Assert
    expect(result.orderLines).toEqual([
      {
        orderLineId: "order-line-1",
        quantity: 2,
        replace: false,
        reason: "Damaged",
        reasonReference: "page-line-1",
      },
    ]);
  });

  it("omits empty per-line reasons (sends undefined, not empty strings)", () => {
    // Arrange
    const formData = baseFormData({
      unfulfilledItemsQuantities: [{ id: "order-line-1", label: "", value: 1, data: lineItemData }],
      lineReasons: [
        {
          id: "order-line-1",
          label: "",
          value: { reason: "", reasonReference: "" },
          data: lineItemData,
        },
      ],
    });
    const parser = new ReturnFormDataParser({
      order: {} as OrderDetailsFragment,
      formData,
      refundsEnabled: false,
    });

    // Act
    const result = parser.getParsedData();

    // Assert
    expect(result.orderLines?.[0].reason).toBeUndefined();
    expect(result.orderLines?.[0].reasonReference).toBeUndefined();
  });
});
