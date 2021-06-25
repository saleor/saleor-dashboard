import { ExitFormDialogContext } from "@saleor/components/Form/ExitFormDialogProvider";
import useForm, { CommonUseFormResult } from "@saleor/hooks/useForm";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import React, { useContext, useEffect } from "react";

export enum CustomerChangeActionEnum {
  KEEP_ADDRESS = "keepAddress",
  CHANGE_ADDRESS = "changeAddress"
}

export interface OrderCustomerChangeData {
  changeActionOption: CustomerChangeActionEnum;
}

type UseOrderCustomerChangeFormResult = CommonUseFormResult<
  OrderCustomerChangeData
>;

export interface OrderCustomerChangeFormProps {
  children: (props: UseOrderCustomerChangeFormResult) => React.ReactNode;
  initial?: Partial<OrderCustomerChangeData>;
  onSubmit: (data: OrderCustomerChangeData) => void;
}

const defaultInitialFormData: OrderCustomerChangeData = {
  changeActionOption: CustomerChangeActionEnum.KEEP_ADDRESS
};

function useOrderCustomerChangeForm(
  initial: Partial<OrderCustomerChangeData>,
  onSubmit: (data: OrderCustomerChangeData) => void
): UseOrderCustomerChangeFormResult {
  const { handleChange, hasChanged, data, setChanged } = useForm({
    ...initial,
    ...defaultInitialFormData
  });

  const { setExitDialogSubmitRef, setEnableExitDialog } = useContext(
    ExitFormDialogContext
  );

  const handleSubmit = () =>
    handleFormSubmit(data, onSubmit, setChanged, setEnableExitDialog);

  const submit = (event: React.FormEvent<any>) => {
    event.stopPropagation();
    event.preventDefault();
    return onSubmit(data);
  };

  useEffect(() => setExitDialogSubmitRef(submit), [handleSubmit]);

  return {
    change: handleChange,
    submit,
    hasChanged,
    data
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
