import { CustomerAddresses_user } from "@saleor/customers/types/CustomerAddresses";
import OrderCustomerAddressesEditDialog, {
  AddressEditDialogVariant,
  OrderCustomerAddressesEditDialogOutput
} from "@saleor/orders/components/OrderCustomerAddressesEditDialog";
import { OrderDetails_shop_countries } from "@saleor/orders/types/OrderDetails";
import {
  OrderDraftUpdate,
  OrderDraftUpdateVariables
} from "@saleor/orders/types/OrderDraftUpdate";
import {
  OrderUpdate,
  OrderUpdateVariables
} from "@saleor/orders/types/OrderUpdate";
import { PartialMutationProviderOutput } from "@saleor/types";
import React from "react";

interface OrderAddressFieldsProps {
  action: string;
  id: string;
  isDraft: boolean;
  customerAddressesLoading: boolean;
  customer: CustomerAddresses_user;
  countries: OrderDetails_shop_countries[];
  onClose: () => void;
  onConfirm: (data: OrderCustomerAddressesEditDialogOutput) => Promise<any>;
  orderUpdate?: PartialMutationProviderOutput<
    OrderUpdate,
    OrderUpdateVariables
  >;
  orderDraftUpdate?: PartialMutationProviderOutput<
    OrderDraftUpdate,
    OrderDraftUpdateVariables
  >;
}

const OrderAddressFields = ({
  action,
  id,
  isDraft,
  customerAddressesLoading,
  customer,
  countries,
  onClose,
  onConfirm,
  orderUpdate,
  orderDraftUpdate
}: OrderAddressFieldsProps) => {
  if (!orderUpdate && !orderDraftUpdate) {
    return;
  }

  const addressFieldCommonProps = {
    loading: customerAddressesLoading,
    confirmButtonState: isDraft
      ? orderDraftUpdate.opts.status
      : orderUpdate.opts.status,
    countries,
    errors: isDraft
      ? orderDraftUpdate.opts.data?.draftOrderUpdate.errors
      : orderUpdate.opts.data?.orderUpdate.errors,
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
