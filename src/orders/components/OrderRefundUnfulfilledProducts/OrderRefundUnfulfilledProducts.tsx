import { FormsetChange } from "@saleor/hooks/useFormset";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import React from "react";

import { OrderRefundFormData } from "../OrderRefundPage/form";
import OrderReturnRefurnLinesCard from "../OrderReturnPage/OrderRefundReturnLinesCard";

interface OrderRefundUnfulfilledProductsProps {
  order?: OrderDetails_order;
  data: OrderRefundFormData;
  // disabled: boolean;
  onRefundedProductQuantityChange: FormsetChange<string>;
  onSetMaximalQuantities: () => void;
}

const OrderRefundUnfulfilledProducts: React.FC<OrderRefundUnfulfilledProductsProps> = props => {
  const {
    order,
    data,
    // disabled,
    onRefundedProductQuantityChange,
    onSetMaximalQuantities
  } = props;

  const lines =
    order?.lines.filter(line => line.quantity !== line.quantityFulfilled) || [];

  console.log({ order });

  return <OrderReturnRefurnLinesCard lines={lines} canReplace />;
};
OrderRefundUnfulfilledProducts.displayName = "OrderRefundUnfulfilledProducts";
export default OrderRefundUnfulfilledProducts;
