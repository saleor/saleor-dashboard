import useForm, { FormChange } from "@saleor/hooks/useForm";
import React, { useState } from "react";

export enum CustomerChangeActionEnum {
  KEEP_ADDRESS = "keepAddress",
  CHANGE_ADDRESS = "changeAddress"
}

export interface OrderCustomerChangeData {
  changeActionOption: CustomerChangeActionEnum;
}

interface UseOrderCustomerChangeFormResult {
  submit: (event: React.FormEvent<any>) => void;
  change: FormChange;
  hasChanged: boolean;
  data: OrderCustomerChangeData;
}

export interface OrderCustomerChangeFormProps {
  children: (props: UseOrderCustomerChangeFormResult) => React.ReactNode;
  initial?: Partial<OrderCustomerChangeData>;
  onSubmit: (data: OrderCustomerChangeData) => void;
}

function useOrderCustomerChangeForm(
  initial: Partial<OrderCustomerChangeData>,
  onSubmit: (data: OrderCustomerChangeData) => void
): UseOrderCustomerChangeFormResult {
  const defaultInitialFormData: OrderCustomerChangeData = {
    changeActionOption: CustomerChangeActionEnum.KEEP_ADDRESS
  };

  const form = useForm({
    ...initial,
    ...defaultInitialFormData
  });

  const [changed, setChanged] = useState(false);
  const triggerChange = () => setChanged(true);

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
    triggerChange();
  };

  const submit = (event: React.FormEvent<any>) => {
    event.stopPropagation();
    event.preventDefault();
    return onSubmit(form.data);
  };

  return {
    change: handleChange,
    submit,
    hasChanged: changed,
    data: form.data
  };
}

const OrderCustomerChangeForm: React.FC<OrderCustomerChangeFormProps> = ({
  children,
  initial,
  onSubmit
}) => {
  const props = useOrderCustomerChangeForm(initial || {}, onSubmit);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

OrderCustomerChangeForm.displayName = "OrderCustomerChangeForm";
export default OrderCustomerChangeForm;
