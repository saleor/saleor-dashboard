import {
  OrderReturnFulfillmentLineInput,
  OrderReturnLineInput,
  OrderReturnProductsInput,
} from "@saleor/graphql";
import { getById } from "@saleor/misc";
import {
  FormsetQuantityData,
  OrderReturnFormData,
} from "@saleor/orders/components/OrderReturnPage/form";

class ReturnFormDataParser {
  private formData: OrderReturnFormData;

  constructor(formData: OrderReturnFormData) {
    this.formData = formData;
  }

  public getParsedData = (): OrderReturnProductsInput => {
    const {
      fulfilledItemsQuantities,
      waitingItemsQuantities,
      unfulfilledItemsQuantities,
      refundShipmentCosts,
    } = this.formData;

    const fulfillmentLines = this.getParsedLineData<
      OrderReturnFulfillmentLineInput
    >(fulfilledItemsQuantities, "fulfillmentLineId");

    const waitingLines = this.getParsedLineData<
      OrderReturnFulfillmentLineInput
    >(waitingItemsQuantities, "fulfillmentLineId");

    const orderLines = this.getParsedLineData<OrderReturnLineInput>(
      unfulfilledItemsQuantities,
      "orderLineId",
    );

    return {
      fulfillmentLines: fulfillmentLines.concat(waitingLines),
      orderLines,
      amountToRefund: 0,
      includeShippingCosts: refundShipmentCosts, // tood: remove once removed in API
      refund: false, // todo: remove once removed in API
    };
  };

  private getParsedLineData = <
    T extends OrderReturnFulfillmentLineInput | OrderReturnLineInput
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

      return [
        ...result,
        ({ [idKey]: id, quantity, replace: shouldReplace } as unknown) as T,
      ];
    }, []);
  };
}

export default ReturnFormDataParser;
