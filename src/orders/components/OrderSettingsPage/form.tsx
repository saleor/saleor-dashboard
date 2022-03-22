import {
  OrderSettingsFragment,
  ShopOrderSettingsFragment
} from "@saleor/graphql";
import useForm, {
  CommonUseFormResult,
  SubmitPromise
} from "@saleor/hooks/useForm";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import React from "react";

export interface OrderSettingsFormData {
  automaticallyConfirmAllNewOrders: boolean;
  fulfillmentAutoApprove: boolean;
  fulfillmentAllowUnpaid: boolean;
  automaticallyFulfillNonShippableGiftCard: boolean;
}

export type UseOrderSettingsFormResult = CommonUseFormResult<
  OrderSettingsFormData
>;
export interface OrderSettingsFormProps {
  children: (props: UseOrderSettingsFormResult) => React.ReactNode;
  orderSettings: OrderSettingsFragment;
  shop: ShopOrderSettingsFragment;
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise;
  disabled: boolean;
}

function getOrderSeettingsFormData(
  orderSettings: OrderSettingsFragment,
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
  orderSettings: OrderSettingsFragment,
  shop: ShopOrderSettingsFragment,
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise,
  disabled: boolean
): UseOrderSettingsFormResult {
  const {
    data,
    handleChange,
    formId,
    hasChanged,
    setChanged,
    setIsSubmitDisabled
  } = useForm(getOrderSeettingsFormData(orderSettings, shop), undefined, {
    confirmLeave: true
  });

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
    setChanged
  });

  const submit = () => handleFormSubmit(data);
  const isSaveDisabled = disabled || !hasChanged;
  setIsSubmitDisabled(isSaveDisabled);

  return {
    change: handleChange,
    data,
    hasChanged,
    submit,
    isSaveDisabled
  };
}

const OrderSettingsForm: React.FC<OrderSettingsFormProps> = ({
  children,
  orderSettings,
  shop,
  onSubmit,
  disabled
}) => {
  const props = useOrderSettingsForm(orderSettings, shop, onSubmit, disabled);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

OrderSettingsForm.displayName = "OrderSettingsForm";
export default OrderSettingsForm;
