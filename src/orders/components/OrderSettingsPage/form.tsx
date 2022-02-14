import { ShopOrderSettingsFragment } from "@saleor/fragments/types/ShopOrderSettingsFragment";
import { OrderSettingsFragmentFragment } from "@saleor/graphql";
import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import React from "react";

export interface OrderSettingsFormData {
  automaticallyConfirmAllNewOrders: boolean;
  fulfillmentAutoApprove: boolean;
  fulfillmentAllowUnpaid: boolean;
  automaticallyFulfillNonShippableGiftCard: boolean;
}

export interface UseOrderSettingsFormResult {
  change: FormChange;
  data: OrderSettingsFormData;
  hasChanged: boolean;
  submit: () => SubmitPromise<any[]>;
}

export interface OrderSettingsFormProps {
  children: (props: UseOrderSettingsFormResult) => React.ReactNode;
  orderSettings: OrderSettingsFragmentFragment;
  shop: ShopOrderSettingsFragment;
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise;
}

function getOrderSeettingsFormData(
  orderSettings: OrderSettingsFragmentFragment,
  shop: ShopOrderSettingsFragment
): OrderSettingsFormData {
  return {
    automaticallyFulfillNonShippableGiftCard:
      orderSettings?.automaticallyFulfillNonShippableGiftCard,
    automaticallyConfirmAllNewOrders:
      orderSettings?.automaticallyConfirmAllNewOrders,
    fulfillmentAutoApprove: shop?.fulfillmentAutoApprove,
    fulfillmentAllowUnpaid: shop?.fulfillmentAllowUnpaid
  };
}

function useOrderSettingsForm(
  orderSettings: OrderSettingsFragmentFragment,
  shop: ShopOrderSettingsFragment,
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise
): UseOrderSettingsFormResult {
  const { data, handleChange, formId, hasChanged, setChanged } = useForm(
    getOrderSeettingsFormData(orderSettings, shop),
    undefined,
    {
      confirmLeave: true
    }
  );

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
    setChanged
  });

  const submit = () => handleFormSubmit(data);

  return {
    change: handleChange,
    data,
    hasChanged,
    submit
  };
}

const OrderSettingsForm: React.FC<OrderSettingsFormProps> = ({
  children,
  orderSettings,
  shop,
  onSubmit
}) => {
  const props = useOrderSettingsForm(orderSettings, shop, onSubmit);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

OrderSettingsForm.displayName = "OrderSettingsForm";
export default OrderSettingsForm;
