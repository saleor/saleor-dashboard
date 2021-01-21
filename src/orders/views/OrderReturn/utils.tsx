/* eslint-disable @typescript-eslint/member-ordering */
import { OrderRefundAmountCalculationMode } from "@saleor/orders/components/OrderRefundPage/form";
import {
  FormsetQuantityData,
  OrderReturnFormData
} from "@saleor/orders/components/OrderReturnPage/form";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import {
  OrderReturnFulfillmentLineInput,
  OrderReturnLineInput,
  OrderReturnProductsInput
} from "@saleor/types/globalTypes";

class ReturnFormDataParser {
  private order: OrderDetails_order;
  private formData: OrderReturnFormData;

  constructor(order: OrderDetails_order, formData: OrderReturnFormData) {
    this.order = order;
    this.formData = formData;
  }

  public getParsedData = (): OrderReturnProductsInput => {
    const {
      fulfilledItemsQuantities,
      unfulfilledItemsQuantities,
      refundShipmentCosts
    } = this.formData;

    const fulfillmentLines = this.getParsedLineData<
      OrderReturnFulfillmentLineInput
    >(fulfilledItemsQuantities, "fulfillmentLineId");

    const orderLines = this.getParsedLineData<OrderReturnLineInput>(
      unfulfilledItemsQuantities,
      "orderLineId"
    );

    return {
      amountToRefund: this.getAmountToRefund(),
      fulfillmentLines,
      includeShippingCosts: refundShipmentCosts,
      orderLines,
      refund: this.getShouldRefund(orderLines, fulfillmentLines)
    };
  };

  private getAmountToRefund = (): number | undefined =>
    this.formData.amountCalculationMode ===
    OrderRefundAmountCalculationMode.MANUAL
      ? this.formData.amount
      : undefined;

  private getParsedLineData = function<
    T extends OrderReturnFulfillmentLineInput | OrderReturnLineInput
  >(
    itemsQuantities: FormsetQuantityData,
    idKey: "fulfillmentLineId" | "orderLineId"
  ): T[] {
    const { itemsToBeReplaced } = this.formData;

    return itemsQuantities.reduce((result, { value: quantity, id }) => {
      if (!quantity) {
        return result;
      }

      const shouldReplace = !!itemsToBeReplaced.find(getById(id))?.value;

      return [
        ...result,
        ({ [idKey]: id, quantity, replace: shouldReplace } as unknown) as T
      ];
    }, []);
  };

  private getShouldRefund = (
    orderLines: OrderReturnLineInput[],
    fulfillmentLines: OrderReturnFulfillmentLineInput[]
  ) => {
    if (
      !this.order.totalCaptured?.amount ||
      this.formData.amountCalculationMode ===
        OrderRefundAmountCalculationMode.NONE
    ) {
      return false;
    }

    if (!!this.getAmountToRefund()) {
      return true;
    }

    return (
      orderLines.some(ReturnFormDataParser.isLineRefundable) ||
      fulfillmentLines.some(ReturnFormDataParser.isLineRefundable)
    );
  };

  private static isLineRefundable = function<
    T extends OrderReturnLineInput | OrderReturnFulfillmentLineInput
  >({ replace }: T) {
    return !replace;
  };
}

export default ReturnFormDataParser;
