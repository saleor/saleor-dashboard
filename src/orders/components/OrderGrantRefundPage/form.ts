import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import useForm from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import React from "react";

export interface OrderGrantRefundFormData {
  amount: string;
  reason: string;
}

const defaultInitialData: OrderGrantRefundFormData = {
  amount: "",
  reason: "",
};

interface GrantRefundFormHookProps {
  onSubmit: (data: OrderGrantRefundFormData) => void;
  initialData?: OrderGrantRefundFormData;
}

export const useGrantRefundForm = ({
  onSubmit,
  initialData,
}: GrantRefundFormHookProps) => {
  const { set, change, data, formId } = useForm(
    initialData ?? defaultInitialData,
    undefined,
    {
      confirmLeave: true,
    },
  );

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
