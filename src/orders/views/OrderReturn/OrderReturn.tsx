import makeQuery from "@saleor/hooks/makeQuery";
import { FormsetData } from "@saleor/hooks/useFormset";
import useNavigator from "@saleor/hooks/useNavigator";
import { OrderRefundAmountCalculationMode } from "@saleor/orders/components/OrderRefundPage/form";
import OrderReturnPage from "@saleor/orders/components/OrderReturnPage";
import {
  FormsetQuantityData,
  FormsetReplacementData,
  LineItemData,
  OrderReturnFormData
} from "@saleor/orders/components/OrderReturnPage/form";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { useOrderReturnCreateMutation } from "@saleor/orders/mutations";
import { orderDetailsQuery } from "@saleor/orders/queries";
import { orderUrl } from "@saleor/orders/urls";
import {
  OrderReturnFulfillmentLineInput,
  OrderReturnLineInput,
  OrderReturnProductsInput
} from "@saleor/types/globalTypes";
import React from "react";

interface OrderReturnProps {
  orderId: string;
}

const OrderReturn: React.FC<OrderReturnProps> = ({ orderId }) => {
  const navigate = useNavigator();

  const useOrderQuery = makeQuery(orderDetailsQuery);

  const { data, loading } = useOrderQuery({
    displayLoader: true,
    variables: {
      id: orderId
    }
  });

  const [returnCreate] = useOrderReturnCreateMutation({
    // onCompleted: ({}) => {
    //   if (!!errors.length) {
    //     navigateBackToOrder();
    //   }
    // }
  });

  const getParsedLineData = (
    itemsQuantities: FormsetQuantityData,
    itemsToBeReplaced: FormsetReplacementData,
    idKey: "fullfilmentLineId" | "orderLineId"
  ) =>
    itemsQuantities.reduce((result, { value: quantity, id }) => {
      if (!!quantity) {
        return result;
      }

      const shouldReplace = !!itemsToBeReplaced.find(getById(id))?.value;

      return [...result, { [idKey]: id, quantity, replace: shouldReplace }];
    }, []);

  const getParsedData = ({
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

    const orderLines = getParsedLineData(
      unfulfiledItemsQuantities,
      itemsToBeReplaced,
      "orderLineId"
    ) as OrderReturnLineInput[];

    const fulfillmentLines = getParsedLineData(
      fulfiledItemsQuantities,
      itemsToBeReplaced,
      "fullfilmentLineId"
    ) as OrderReturnFulfillmentLineInput[];

    return {
      amountToRefund,
      fulfillmentLines,
      includeShippingCosts: refundShipmentCosts,
      orderLines,
      refund: shouldRefund
    };
  };

  const handleSubmit = async (formData: OrderReturnFormData) => {
    if (!data?.order) {
      return;
    }

    const result = await returnCreate({
      variables: {
        id: data.order.id,
        input: getParsedData(formData)
      }
    });

    console.log({ result });
  };

  const navigateBackToOrder = () => navigate(orderUrl(orderId));

  return (
    <OrderReturnPage
      // fixes in next pr, with connecting form
      // @ts-ignore
      order={data?.order}
      loading={loading}
      onSubmit={handleSubmit}
      onBack={navigateBackToOrder}
    />
  );
};

OrderReturn.displayName = "OrderReturn";
export default OrderReturn;
