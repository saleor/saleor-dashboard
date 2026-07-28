// @ts-strict-ignore
import {
  type OrderDetailsFragment,
  type OrderReturnFulfillmentLineInput,
  type OrderReturnLineInput,
  type OrderReturnProductsInput,
} from "@dashboard/graphql";
import { getById } from "@dashboard/misc";
import { OrderRefundAmountCalculationMode } from "@dashboard/orders/components/OrderRefundPage/form";
import {
  type FormsetQuantityData,
  type OrderReturnFormData,
} from "@dashboard/orders/components/OrderReturnPage/form";
import { type MessageDescriptor } from "react-intl";

import { messages } from "./messages";

type ReturnRefundInput = Pick<OrderReturnProductsInput, "amountToRefund" | "refund">;

/**
 * Turns the return form state into the mutation input. Payment-neutral: it
 * knows nothing about payments or transactions. `getParsedData` returns what
 * every return sends; the legacy view adds `getRefundInput()` on top, the
 * transactions view refunds through its own grant/send mutations instead.
 */
class ReturnFormDataParser {
  private readonly order: OrderDetailsFragment;

  private readonly formData: OrderReturnFormData;

  constructor(data: { order: OrderDetailsFragment; formData: OrderReturnFormData }) {
    this.order = data.order;
    this.formData = data.formData;
  }

  public getParsedData = (): OrderReturnProductsInput => {
    const { fulfillmentLines, orderLines } = this.getLines();

    return {
      fulfillmentLines,
      orderLines,
      includeShippingCosts: this.formData.refundShipmentCosts,
      reason: this.formData.reason || undefined,
      reasonReference: this.formData.reasonReference || undefined,
    };
  };

  /** Legacy Payments API only: the return mutation performs the refund itself. */
  public getRefundInput = (): ReturnRefundInput => {
    const { fulfillmentLines, orderLines } = this.getLines();

    return {
      amountToRefund: this.getAmountToRefund(),
      refund: this.getShouldRefund(orderLines, fulfillmentLines),
    };
  };

  private readonly getLines = () => {
    const { fulfilledItemsQuantities, waitingItemsQuantities, unfulfilledItemsQuantities } =
      this.formData;

    return {
      fulfillmentLines: this.getParsedLineData<OrderReturnFulfillmentLineInput>(
        fulfilledItemsQuantities,
        "fulfillmentLineId",
      ).concat(
        this.getParsedLineData<OrderReturnFulfillmentLineInput>(
          waitingItemsQuantities,
          "fulfillmentLineId",
        ),
      ),
      orderLines: this.getParsedLineData<OrderReturnLineInput>(
        unfulfilledItemsQuantities,
        "orderLineId",
      ),
    };
  };

  private readonly getAmountToRefund = (): number | undefined =>
    this.formData.amountCalculationMode === OrderRefundAmountCalculationMode.MANUAL
      ? this.formData.amount
      : undefined;

  private readonly getParsedLineData = <
    T extends OrderReturnFulfillmentLineInput | OrderReturnLineInput,
  >(
    itemsQuantities: FormsetQuantityData,
    idKey: "fulfillmentLineId" | "orderLineId",
  ): T[] => {
    const { itemsToBeReplaced, lineReasons } = this.formData;

    return itemsQuantities.reduce((result, { value: quantity, id }) => {
      if (!quantity) {
        return result;
      }

      const shouldReplace = !!itemsToBeReplaced.find(getById(id))?.value;
      const lineReason = lineReasons?.find(getById(id))?.value;

      return [
        ...result,
        {
          [idKey]: id,
          quantity,
          replace: shouldReplace,
          reason: lineReason?.reason || undefined,
          reasonReference: lineReason?.reasonReference || undefined,
        } as unknown as T,
      ];
    }, []);
  };

  private readonly getShouldRefund = (
    orderLines: OrderReturnLineInput[],
    fulfillmentLines: OrderReturnFulfillmentLineInput[],
  ) => {
    if (
      !this.order.totalCaptured?.amount ||
      this.formData.amountCalculationMode === OrderRefundAmountCalculationMode.NONE
    ) {
      return false;
    }

    if (this.getAmountToRefund()) {
      return true;
    }

    return (
      orderLines.some(ReturnFormDataParser.isLineRefundable) ||
      fulfillmentLines.some(ReturnFormDataParser.isLineRefundable)
    );
  };

  private static readonly isLineRefundable = function <
    T extends OrderReturnLineInput | OrderReturnFulfillmentLineInput,
  >({ replace }: T) {
    return !replace;
  };
}

export default ReturnFormDataParser;

export const getSuccessMessage = (isGrantRefund, isSendRefund): MessageDescriptor => {
  if (isSendRefund) {
    return messages.successAlertWithSend;
  }

  if (isGrantRefund) {
    return messages.successAlertWithGrant;
  }

  return messages.successAlert;
};
