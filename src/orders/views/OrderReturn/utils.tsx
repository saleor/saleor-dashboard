// @ts-strict-ignore
import {
  OrderDetailsFragment,
  OrderReturnFulfillmentLineInput,
  OrderReturnLineInput,
  OrderReturnProductsInput,
} from "@dashboard/graphql";
import { getById } from "@dashboard/misc";
import { OrderRefundAmountCalculationMode } from "@dashboard/orders/components/OrderRefundPage/form";
import {
  FormsetQuantityData,
  OrderReturnFormData,
} from "@dashboard/orders/components/OrderReturnPage/form";
import { MessageDescriptor } from "react-intl";

import { messages } from "./messages";

class ReturnFormDataParser {
  private readonly order: OrderDetailsFragment;

  private readonly formData: OrderReturnFormData;

  private readonly refundsEnabled: boolean;

  constructor(data: {
    order: OrderDetailsFragment;
    formData: OrderReturnFormData;
    refundsEnabled: boolean;
  }) {
    this.order = data.order;
    this.formData = data.formData;
    this.refundsEnabled = data.refundsEnabled;
  }

  public getParsedData = (): OrderReturnProductsInput => {
    const {
      fulfilledItemsQuantities,
      waitingItemsQuantities,
      unfulfilledItemsQuantities,
      refundShipmentCosts,
    } = this.formData;
    const fulfillmentLines = this.getParsedLineData<OrderReturnFulfillmentLineInput>(
      fulfilledItemsQuantities,
      "fulfillmentLineId",
    );
    const waitingLines = this.getParsedLineData<OrderReturnFulfillmentLineInput>(
      waitingItemsQuantities,
      "fulfillmentLineId",
    );
    const orderLines = this.getParsedLineData<OrderReturnLineInput>(
      unfulfilledItemsQuantities,
      "orderLineId",
    );

    if (this.refundsEnabled) {
      return {
        amountToRefund: this.getAmountToRefund(),
        fulfillmentLines: fulfillmentLines.concat(waitingLines),
        includeShippingCosts: refundShipmentCosts,
        orderLines,
        refund: this.getShouldRefund(orderLines, fulfillmentLines),
      };
    }

    return {
      fulfillmentLines: fulfillmentLines.concat(waitingLines),
      orderLines,
      amountToRefund: 0,
      includeShippingCosts: refundShipmentCosts, // tood: remove once removed in API
      refund: false, // todo: remove once removed in API
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
    const { itemsToBeReplaced } = this.formData;

    return itemsQuantities.reduce((result, { value: quantity, id }) => {
      if (!quantity) {
        return result;
      }

      const shouldReplace = !!itemsToBeReplaced.find(getById(id))?.value;

      return [...result, { [idKey]: id, quantity, replace: shouldReplace } as unknown as T];
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

  // eslint-disable-next-line @typescript-eslint/member-ordering
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
