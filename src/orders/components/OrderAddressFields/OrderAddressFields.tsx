// @ts-strict-ignore
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import {
  AddressFragment,
  CustomerAddressesQuery,
  OrderDetailsQuery,
  OrderErrorFragment,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { transformAddressToForm } from "@dashboard/misc";
import React from "react";

import OrderCustomerAddressesEditDialog, {
  OrderCustomerAddressesEditDialogProps,
} from "../OrderCustomerAddressesEditDialog";
import {
  AddressEditDialogVariant,
  OrderCustomerAddressesEditDialogOutput,
} from "../OrderCustomerAddressesEditDialog/types";

interface OrderAddressFieldsProps {
  action: string;
  isDraft: boolean;
  customerAddressesLoading: boolean;
  customer: CustomerAddressesQuery["user"];
  countries: OrderDetailsQuery["shop"]["countries"];
  onClose: () => void;
  onConfirm: (data: OrderCustomerAddressesEditDialogOutput) => SubmitPromise;
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  orderShippingAddress: AddressFragment;
  orderBillingAddress: AddressFragment;
}

const OrderAddressFields = ({
  action,
  isDraft,
  customerAddressesLoading,
  customer,
  countries,
  onClose,
  onConfirm,
  confirmButtonState,
  errors,
  orderShippingAddress,
  orderBillingAddress,
}: OrderAddressFieldsProps) => {
  const addressFieldCommonProps: Omit<OrderCustomerAddressesEditDialogProps, "open" | "variant"> = {
    loading: customerAddressesLoading,
    confirmButtonState,
    countries,
    errors,
    orderShippingAddress: transformAddressToForm(orderShippingAddress),
    orderBillingAddress: transformAddressToForm(orderBillingAddress),
    customerAddresses: customer?.addresses,
    defaultShippingAddress: customer?.defaultShippingAddress,
    defaultBillingAddress: customer?.defaultBillingAddress,
    onClose,
    onConfirm,
  };

  return (
    <>
      {isDraft && (
        <OrderCustomerAddressesEditDialog
          open={action === "edit-customer-addresses"}
          variant={AddressEditDialogVariant.CHANGE_CUSTOMER}
          {...addressFieldCommonProps}
        />
      )}

      <OrderCustomerAddressesEditDialog
        open={action === "edit-shipping-address"}
        variant={AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS}
        {...addressFieldCommonProps}
      />
      <OrderCustomerAddressesEditDialog
        open={action === "edit-billing-address"}
        variant={AddressEditDialogVariant.CHANGE_BILLING_ADDRESS}
        {...addressFieldCommonProps}
      />
    </>
  );
};

export default OrderAddressFields;
