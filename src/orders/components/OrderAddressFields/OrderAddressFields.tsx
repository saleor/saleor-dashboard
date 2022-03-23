import {
  CustomerAddressesQuery,
  OrderDetailsQuery,
  OrderErrorFragment
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";

import OrderCustomerAddressesEditDialog, {
  OrderCustomerAddressesEditDialogProps
} from "../OrderCustomerAddressesEditDialog";
import {
  AddressEditDialogVariant,
  OrderCustomerAddressesEditDialogOutput
} from "../OrderCustomerAddressesEditDialog/types";

interface OrderAddressFieldsProps {
  action: string;
  customerAddressesLoading: boolean;
  customer: CustomerAddressesQuery["user"];
  countries: OrderDetailsQuery["shop"]["countries"];
  onClose: () => void;
  onConfirm: (data: OrderCustomerAddressesEditDialogOutput) => SubmitPromise;
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
}

const getVariant = (action: string) => {
  switch (action) {
    case "edit-customer-address":
      return AddressEditDialogVariant.CHANGE_CUSTOMER_ADDRESS;
    case "edit-shipping-address":
      return AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS;
    case "edit-billing-address":
      return AddressEditDialogVariant.CHANGE_BILLING_ADDRESS;
    default:
      return undefined;
  }
};

const OrderAddressFields: React.FC<OrderAddressFieldsProps> = ({
  action,
  customerAddressesLoading,
  customer,
  countries,
  onClose,
  onConfirm,
  confirmButtonState,
  errors
}) => {
  const addressFieldCommonProps: Omit<
    OrderCustomerAddressesEditDialogProps,
    "open" | "variant"
  > = {
    loading: customerAddressesLoading,
    confirmButtonState,
    countries,
    errors,
    customerAddresses: customer?.addresses,
    defaultShippingAddress: customer?.defaultShippingAddress,
    defaultBillingAddress: customer?.defaultBillingAddress,
    onClose,
    onConfirm
  };

  return (
    <OrderCustomerAddressesEditDialog
      open={!!getVariant(action)}
      variant={getVariant(action)}
      {...addressFieldCommonProps}
    />
  );
};

export default OrderAddressFields;
