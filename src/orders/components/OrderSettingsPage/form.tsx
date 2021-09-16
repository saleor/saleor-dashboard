import { OrderSettingsFragment } from "@saleor/fragments/types/OrderSettingsFragment";
import { ShopOrderSettingsFragment } from "@saleor/fragments/types/ShopOrderSettingsFragment";
import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
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
  submit: () => Promise<boolean>;
}

export interface OrderSettingsFormProps {
  children: (props: UseOrderSettingsFormResult) => React.ReactNode;
  orderSettings: OrderSettingsFragment;
  shop: ShopOrderSettingsFragment;
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise;
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
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise
): UseOrderSettingsFormResult {
  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const form = useForm(getOrderSeettingsFormData(orderSettings, shop));

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
    triggerChange();
  };

  const data: OrderSettingsFormData = {
    ...form.data
  };

  const submit = () => handleFormSubmit(form.data, onSubmit, setChanged);

  return {
    change: handleChange,
    data,
    hasChanged: changed,
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
