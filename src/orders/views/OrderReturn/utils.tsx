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
      refundShipmentCosts,
      paymentsToRefund,
      amountCalculationMode
    } = this.formData;

    const fulfillmentLines = this.getParsedLineData<
      OrderReturnFulfillmentLineInput
    >(fulfilledItemsQuantities, "fulfillmentLineId");

    const orderLines = this.getParsedLineData<OrderReturnLineInput>(
      unfulfilledItemsQuantities,
      "orderLineId"
    );

    const paymentsToRefundValues =
      amountCalculationMode === OrderRefundAmountCalculationMode.MANUAL
        ? paymentsToRefund
            .filter(payment => Number(payment.value) > 0)
            .map(field => ({
              paymentId: field.id,
              amount: field.value
            }))
        : paymentsToRefund.map(field => ({
            paymentId: field.id
          }));

    return {
      paymentsToRefund: paymentsToRefundValues,
      fulfillmentLines,
      includeShippingCosts: refundShipmentCosts,
      orderLines,
      refund: this.getShouldRefund(orderLines, fulfillmentLines)
    };
  };

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
