import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { OrderGrantRefundCreateLineInput } from "@dashboard/graphql";
import useForm, { FormChange } from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import React from "react";

export interface OrderGrantRefundFormData {
  amount: number | undefined;
  reason: string;
  lines: OrderGrantRefundCreateLineInput[];
  grantRefundForShipping: boolean;
}

const defaultInitialData: OrderGrantRefundFormData = {
  amount: 0,
  reason: "",
  lines: [],
  grantRefundForShipping: false,
};

export interface Line {
  id: string;
  quantity: number;
}

interface GrantRefundFormHookProps {
  onSubmit: (data: OrderGrantRefundFormData) => void;
  grantedRefund?: OrderGrantRefundFormData;
  lines: Line[];
  grantRefundForShipping: boolean;
}

export const useGrantRefundForm = ({
  onSubmit,
  grantedRefund,
  lines,
  grantRefundForShipping,
}: GrantRefundFormHookProps) => {
  const [isFormDirty, setIsFormDirty] = React.useState({
    amount: false,
    reason: false,
  });
  const { set, change, data, formId } = useForm(grantedRefund ?? defaultInitialData, undefined, {
    confirmLeave: true,
  });
  const { setExitDialogSubmitRef, setIsDirty } = useExitFormDialog({
    formId,
  });
  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
  });
  const getAmountValue = () => {
    // When editing always return the amount value
    if (grantedRefund) {
      return data.amount;
    }

    // When creating and user doesn not provide value, value will be calculated base on lines and shipping
    if (!isFormDirty.amount) {
      return undefined;
    }

    // When creating and user provide value, return the provided value
    return data.amount;
  };
  const submit = () =>
    handleFormSubmit({
      ...data,
      amount: getAmountValue(),
      lines,
      grantRefundForShipping,
    });

  React.useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const handleChange: FormChange = e => {
    if (e.target.name === "amount") setIsFormDirty({ ...isFormDirty, amount: true });
    if (e.target.name === "reason") setIsFormDirty({ ...isFormDirty, reason: true });

    change(e);
  };

  return {
    set,
    change: handleChange,
    data,
    submit,
    setIsDirty,
    isFormDirty,
  };
};
