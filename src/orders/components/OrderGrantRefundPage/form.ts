import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { OrderGrantRefundCreateLineInput } from "@dashboard/graphql";
import useForm, { FormChange } from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import React from "react";

export interface OrderGrantRefundFormData {
  amount: string;
  reason: string;
  lines: OrderGrantRefundCreateLineInput[];
  grantRefundForShipping: boolean;
}

const defaultInitialData: OrderGrantRefundFormData = {
  amount: "",
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
  const [isAmountDirty, setIsAmountDirty] = React.useState(false);
  const { set, change, data, formId } = useForm(
    grantedRefund ?? defaultInitialData,
    undefined,
    {
      confirmLeave: true,
    },
  );

  const { setExitDialogSubmitRef, setIsDirty } = useExitFormDialog({
    formId,
  });

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
  });

  const submit = () =>
    handleFormSubmit({
      ...data,
      lines,
      grantRefundForShipping,
    });

  React.useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const handleChange: FormChange = e => {
    if (["amount", "reason"].includes(e.target.name)) setIsAmountDirty(true);
    change(e);
  };

  return { set, change: handleChange, data, submit, setIsDirty, isAmountDirty };
};
