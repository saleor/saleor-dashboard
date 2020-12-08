import { FormsetChange } from "@saleor/hooks/useFormset";
import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import React from "react";
import { OrderReturnFormData } from "./form";

import ItemsCard from "./ItemsCard";

interface OrderRefundUnfulfilledProductsProps {
  order?: OrderDetails_order;
  data: OrderReturnFormData;
  onChangeSelected: FormsetChange<boolean>;
  onChangeQuantity: (id: string, value: string) => void;
  onSetMaxQuantity();
}

const OrderReturnUnfulfiledItemsCard: React.FC<OrderRefundUnfulfilledProductsProps> = props => {
  const {
    order,
    onSetMaxQuantity,
    onChangeQuantity,
    onChangeSelected,
    data
  } = props;

  const lines =
    order?.lines.filter(line => line.quantity !== line.quantityFulfilled) || [];

  const { unfulfiledItemsQuantities, itemsToBeReplaced } = data;

  console.log({ order });

  return (
    <ItemsCard
      lines={lines}
      itemsQuantities={unfulfiledItemsQuantities}
      itemsSelections={itemsToBeReplaced}
      onSetMaxQuantity={onSetMaxQuantity}
      onChangeQuantity={onChangeQuantity}
      onChangeSelected={onChangeSelected}
    />
  );
};

OrderReturnUnfulfiledItemsCard.displayName = "OrderReturnUnfulfiledItemsCard";
export default OrderReturnUnfulfiledItemsCard;
