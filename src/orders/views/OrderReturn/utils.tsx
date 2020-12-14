import { OrderRefundAmountCalculationMode } from "@saleor/orders/components/OrderRefundPage/form";
import {
  FormsetQuantityData,
  FormsetReplacementData,
  OrderReturnFormData
} from "@saleor/orders/components/OrderReturnPage/form";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import {
  OrderReturnFulfillmentLineInput,
  OrderReturnLineInput,
  OrderReturnProductsInput
} from "@saleor/types/globalTypes";

export const getParsedData = ({
  amount,
  amountCalculationMode,
  refundShipmentCosts,
  fulfiledItemsQuantities,
  unfulfiledItemsQuantities,
  itemsToBeReplaced
}: OrderReturnFormData): OrderReturnProductsInput => {
  const shouldRefund = !!amount;
  const amountToRefund =
    amountCalculationMode === OrderRefundAmountCalculationMode.MANUAL
      ? amount
      : undefined;

  const orderLines = getParsedLineData<OrderReturnLineInput>(
    unfulfiledItemsQuantities,
    itemsToBeReplaced,
    "orderLineId"
  );

  const fulfillmentLines = getParsedLineData<OrderReturnFulfillmentLineInput>(
    fulfiledItemsQuantities,
    itemsToBeReplaced,
    "fulfillmentLineId"
  );

  return {
    amountToRefund,
    fulfillmentLines,
    includeShippingCosts: refundShipmentCosts,
    orderLines,
    refund: shouldRefund
  };
};

function getParsedLineData<
  T extends OrderReturnFulfillmentLineInput | OrderReturnLineInput
>(
  itemsQuantities: FormsetQuantityData,
  itemsToBeReplaced: FormsetReplacementData,
  idKey: "fulfillmentLineId" | "orderLineId"
): T[] {
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
}
