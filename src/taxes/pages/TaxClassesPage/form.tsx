import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import {
  TaxClassFragment,
  TaxClassRateInput,
  TaxClassUpdateInput,
} from "@saleor/graphql";
import useForm, { SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, { FormsetData } from "@saleor/hooks/useFormset";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import React from "react";

export interface TaxClassesPageFormData {
  updateTaxClassRates: FormsetData<TaxClassRateInput>;
  name?: string;
}
export interface UseTaxClassesFormResult {
  data: TaxClassesPageFormData;
  submit: () => SubmitPromise;
  handlers: { handleRateChange: (id: string, value: string) => void };
}

interface TaxClassesFormProps {
  children: (props: any) => React.ReactNode;
  taxClass: TaxClassFragment;
  onSubmit: (data: TaxClassUpdateInput) => SubmitPromise;
  disabled: boolean;
}

function useTaxClassesForm(
  taxClass: TaxClassFragment,
  onSubmit,
  disabled,
): UseTaxClassesFormResult {
  // Initial
  const initialFormData: TaxClassUpdateInput = {
    name: taxClass?.name ?? "",
  };

  const initialFormsetData = taxClass?.countries.map(item => ({
    id: item.country.code,
    label: item.country.country,
    value: item.rate.toString(),
    data: null,
  }));

  const { formId, triggerChange, data } = useForm(initialFormData, undefined, {
    confirmLeave: true,
  });

  const formset = useFormset(initialFormsetData);

  // Handlers
  const handleRateChange = (id: string, value: string) => {
    triggerChange();
    formset.change(id, value);
  };

  // Submit
  const submitData = {
    name: data.name,
    updateTaxClasses: formset.data.map(item => {
      const { id, value } = item;
      const parsedRate = parseFloat(value);
      return {
        rate: parsedRate,
        countryCode: id,
      };
    }),
  };

  const handleSubmit = async (data: TaxClassUpdateInput) => {
    const errors = await onSubmit(data);

    return errors;
  };

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit: handleSubmit,
  });

  const submit = () => handleFormSubmit(submitData);

  // Exit form util

  const { setExitDialogSubmitRef, setIsSubmitDisabled } = useExitFormDialog({
    formId,
  });

  React.useEffect(() => setExitDialogSubmitRef(submit), [
    setExitDialogSubmitRef,
    submit,
  ]);
  setIsSubmitDisabled(disabled);

  return {
    data: { ...data, updateTaxClassRates: formset.data },
    handlers: { handleRateChange },
    submit,
  };
}

const TaxClassesForm: React.FC<TaxClassesFormProps> = ({
  children,
  taxClass,
  onSubmit,
  disabled,
}) => {
  const props = useTaxClassesForm(taxClass, onSubmit, disabled);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

TaxClassesForm.displayName = "TaxClassesForm";
export default TaxClassesForm;
