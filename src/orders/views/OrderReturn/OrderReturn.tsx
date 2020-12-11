import makeQuery from "@saleor/hooks/makeQuery";
import useNavigator from "@saleor/hooks/useNavigator";
import OrderReturnPage from "@saleor/orders/components/OrderReturnPage";
import { OrderReturnFormData } from "@saleor/orders/components/OrderReturnPage/form";
import { useOrderReturnCreateMutation } from "@saleor/orders/mutations";
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

  const [returnCreate, returnCreateOpts] = useOrderReturnCreateMutation({
    // onCompleted: data => {
    //   if (data.attributeCreate.errors.length === 0) {
    //     notify({
    //       status: "success",
    //       text: intl.formatMessage({
    //         defaultMessage: "Successfully created attribute"
    //       })
    //     });
    //     navigate(attributeUrl(data.attributeCreate.attribute.id));
    //   }
    // }
  });

  const handleSubmit = async (data: OrderReturnFormData) => {
    const input = {};

    console.log({ data });
    // const result = await returnCreate({
    //   variables: {
    //     input
    //   }
    // });
  };

  return (
    <OrderReturnPage
      // fixes in next pr, with connecting form
      // @ts-ignore
      order={data?.order}
      loading={loading}
      onSubmit={handleSubmit}
      onBack={() => navigate(orderUrl(orderId))}
    />
  );
};

OrderReturn.displayName = "OrderReturn";
export default OrderReturn;
