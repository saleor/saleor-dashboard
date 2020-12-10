import makeQuery from "@saleor/hooks/makeQuery";
import useNavigator from "@saleor/hooks/useNavigator";
import OrderReturnPage from "@saleor/orders/components/OrderReturnPage";
import { orderDetailsQuery } from "@saleor/orders/queries";
import { orderUrl } from "@saleor/orders/urls";
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

  return (
    <OrderReturnPage
      // fixes in next pr, with connecting form
      // @ts-ignore
      order={data?.order}
      loading={loading}
      // @ts-ignore
      // eslint-disable-next-line
      onSubmit={() => {}}
      onBack={() => navigate(orderUrl(orderId))}
    />
  );
};

OrderReturn.displayName = "OrderReturn";
export default OrderReturn;
