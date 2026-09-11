import { columnsMessages } from "@dashboard/orders/components/OrderListDatagrid/messages";
import { type MessageDescriptor } from "react-intl";

type DeliveryMethodLike =
  | { __typename: "ShippingMethod" }
  | { __typename: "Warehouse" }
  | null
  | undefined;

export interface DeliveryMethodInfo {
  labelMessage: MessageDescriptor;
  color: "info" | "attention";
}

export const getDeliveryMethodInfo = (
  deliveryMethod: DeliveryMethodLike,
): DeliveryMethodInfo | null => {
  if (!deliveryMethod) {
    return null;
  }

  if (deliveryMethod.__typename === "Warehouse") {
    return { labelMessage: columnsMessages.deliveryWarehouse, color: "attention" };
  }

  return { labelMessage: columnsMessages.deliveryShipping, color: "info" };
};
