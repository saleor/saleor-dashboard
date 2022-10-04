import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import useForm from "@saleor/hooks/useForm";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import React from "react";

export interface OrderGrantRefundFormData {
  amount: string;
  reason: string;
}

const initialFormData: OrderGrantRefundFormData = {
  amount: "0",
  reason: "",
};

interface GrantRefundFormHookProps {
  onSubmit: (data: OrderGrantRefundFormData) => void;
}

export const useGrantRefundForm = ({ onSubmit }: GrantRefundFormHookProps) => {
  const { set, change, data, formId } = useForm(initialFormData, undefined, {
    confirmLeave: true,
  });

  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId,
  });

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
  });

  const submit = () => handleFormSubmit(data);

  React.useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  return { set, change, data, submit };
};
