import { CustomerAddresses_user } from "@saleor/customers/types/CustomerAddresses";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { OrderDetails_shop_countries } from "@saleor/orders/types/OrderDetails";
import React from "react";

import OrderCustomerAddressesEditDialog from "../OrderCustomerAddressesEditDialog";
import {
  AddressEditDialogVariant,
  OrderCustomerAddressesEditDialogOutput
} from "../OrderCustomerAddressesEditDialog/types";

interface OrderAddressFieldsProps {
  action: string;
  isDraft: boolean;
  customerAddressesLoading: boolean;
  customer: CustomerAddresses_user;
  countries: OrderDetails_shop_countries[];
  onClose: () => void;
  onConfirm: (data: OrderCustomerAddressesEditDialogOutput) => SubmitPromise;
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
}

const OrderAddressFields: React.FC<OrderAddressFieldsProps> = ({
  action,
  isDraft,
  customerAddressesLoading,
  customer,
  countries,
  onClose,
  onConfirm,
  confirmButtonState,
  errors
}) => {
  const addressFieldCommonProps = {
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
