import { transformAddressToForm } from "@saleor/misc";
import OrderAddressEditDialog from "@saleor/orders/components/OrderAddressEditDialog";
import { OrderDetails } from "@saleor/orders/types/OrderDetails";
import {
  OrderDraftUpdate,
  OrderDraftUpdateVariables
} from "@saleor/orders/types/OrderDraftUpdate";
import {
  OrderUpdate,
  OrderUpdateVariables
} from "@saleor/orders/types/OrderUpdate";
import { PartialMutationProviderOutput } from "@saleor/types";
import { AddressInput } from "@saleor/types/globalTypes";
import React from "react";

enum FieldType {
  shipping = "shippingAddress",
  billing = "billingAddress"
}

interface Props {
  action: string;
  id: string;
  isDraft: boolean;
  data: OrderDetails;
  onClose: () => void;
  orderUpdate: PartialMutationProviderOutput<OrderUpdate, OrderUpdateVariables>;
  orderDraftUpdate: PartialMutationProviderOutput<
    OrderDraftUpdate,
    OrderDraftUpdateVariables
  >;
}

const OrderAddressFields = ({
  action,
  isDraft,
  id,
  onClose,
  orderUpdate,
  orderDraftUpdate,
  data
}: Props) => {
  const order = data?.order;

  const handleConfirm = (type: FieldType) => (value: AddressInput) => {
    const updateMutation = isDraft ? orderDraftUpdate : orderUpdate;

    updateMutation.mutate({
      id,
      input: {
        [type]: value
      }
    });
  };

  const addressFieldCommonProps = {
    confirmButtonState: isDraft
      ? orderDraftUpdate.opts.status
      : orderUpdate.opts.status,
    countries: data?.shop?.countries.map(country => ({
      code: country.code,
      label: country.country
    })),
    errors: isDraft
      ? orderDraftUpdate.opts.data?.draftOrderUpdate.errors
      : orderUpdate.opts.data?.orderUpdate.errors,
    onClose
  };

  return (
    <>
      <OrderAddressEditDialog
        {...addressFieldCommonProps}
        address={transformAddressToForm(order?.shippingAddress)}
        open={action === "edit-shipping-address"}
        variant="shipping"
        onConfirm={handleConfirm(FieldType.shipping)}
      />
      <OrderAddressEditDialog
        {...addressFieldCommonProps}
        address={transformAddressToForm(order?.billingAddress)}
        open={action === "edit-billing-address"}
        variant="billing"
        onConfirm={handleConfirm(FieldType.billing)}
      />
    </>
  );
};

export default OrderAddressFields;
