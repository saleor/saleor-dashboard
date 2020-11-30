import { OrderSettingsFragment } from "@saleor/fragments/types/OrderSettingsFragment";
import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import React from "react";

export interface OrderSettingsFormData {
  automaticallyConfirmAllNewOrders: boolean;
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
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise;
}

function getOrderSeettingsFormData(
  orderSettings: OrderSettingsFragment
): OrderSettingsFormData {
  return {
    automaticallyConfirmAllNewOrders:
      orderSettings?.automaticallyConfirmAllNewOrders
  };
}

function useOrderSettingsForm(
  orderSettings: OrderSettingsFragment,
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise
): UseOrderSettingsFormResult {
  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const form = useForm(getOrderSeettingsFormData(orderSettings));

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
  onSubmit
}) => {
  const props = useOrderSettingsForm(orderSettings, onSubmit);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

OrderSettingsForm.displayName = "OrderSettingsForm";
export default OrderSettingsForm;
