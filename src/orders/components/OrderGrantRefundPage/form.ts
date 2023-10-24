import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { OrderGrantRefundCreateLineInput } from "@dashboard/graphql";
import useForm from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import React from "react";

export interface OrderGrantRefundFormData {
  amount: string;
  reason: string;
  lines: OrderGrantRefundCreateLineInput[];
}

const defaultInitialData: OrderGrantRefundFormData = {
  amount: "",
  reason: "",
  lines: [],
};

export interface Line {
  id: string;
  quantity: number;
}

interface GrantRefundFormHookProps {
  onSubmit: (data: OrderGrantRefundFormData) => void;
  initialData?: OrderGrantRefundFormData;
  lines: Line[];
}

export const useGrantRefundForm = ({
  onSubmit,
  initialData,
  lines,
}: GrantRefundFormHookProps) => {
  const { set, change, data, formId } = useForm(
    initialData ?? defaultInitialData,
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
    });

  React.useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  return { set, change, data, submit, setIsDirty };
};
