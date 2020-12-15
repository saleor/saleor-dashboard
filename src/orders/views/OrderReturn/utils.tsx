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

  const shouldRefund = getShouldRefund({
    amount,
    fulfillmentLines,
    orderLines
  });

  return {
    amountToRefund,
    fulfillmentLines,
    includeShippingCosts: refundShipmentCosts,
    orderLines,
    refund: shouldRefund
  };
};

const getShouldRefund = ({
  amount,
  orderLines,
  fulfillmentLines
}: {
  amount?: number;
  orderLines: OrderReturnLineInput[];
  fulfillmentLines: OrderReturnFulfillmentLineInput[];
}) => {
  if (amount) {
    return true;
  }

  return (
    orderLines.some(isLineRefundable) || fulfillmentLines.some(isLineRefundable)
  );
};

function isLineRefundable<
  T extends OrderReturnLineInput | OrderReturnFulfillmentLineInput
>({ replace }: T) {
  return !replace;
}

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
