import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import {
  CountryCode,
  TaxClassCreateInput,
  TaxClassFragment,
  TaxClassRateInput,
  TaxClassUpdateInput,
} from "@saleor/graphql";
import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
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
  change: FormChange;
  handlers: { handleRateChange: (id: string, value: string) => void };
}

interface TaxClassesFormProps {
  children: (props: any) => React.ReactNode;
  taxClass: TaxClassFragment | undefined;
  onTaxClassCreate: (data: TaxClassCreateInput) => SubmitPromise;
  onTaxClassUpdate: (id: string, data: TaxClassUpdateInput) => SubmitPromise;
  disabled: boolean;
}

function useTaxClassesForm(
  taxClass: TaxClassFragment,
  onTaxClassCreate,
  onTaxClassUpdate,
  disabled,
): UseTaxClassesFormResult {
  // Initial
  const initialFormData: TaxClassUpdateInput = {
    name: taxClass?.name ?? "",
  };

  const isNewTaxClass = taxClass?.id === "new";

  const initialFormsetData = taxClass?.countries.map(item => ({
    id: item.country.code,
    label: item.country.country,
    value: item.rate.toString(),
    data: null,
  }));

  const { formId, triggerChange, data, handleChange } = useForm(
    initialFormData,
    undefined,
    {
      confirmLeave: true,
    },
  );

  const formset = useFormset(initialFormsetData);

  // Handlers
  const handleRateChange = (id: string, value: string) => {
    triggerChange();
    formset.change(id, value);
  };

  // Submit
  const submitData = {
    name: data.name,
    [isNewTaxClass
      ? "createCountryRates"
      : "updateCountryRates"]: formset.data.map(item => {
      const { id, value } = item;
      const parsedRate = parseFloat(value);
      return {
        rate: parsedRate,
        countryCode: id as CountryCode,
      };
    }),
  };

  const handleSubmit = async (data: TaxClassUpdateInput) => {
    const errors = isNewTaxClass
      ? await onTaxClassCreate(data)
      : await onTaxClassUpdate(taxClass.id, data);

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
    change: handleChange,
    submit,
  };
}

const TaxClassesForm: React.FC<TaxClassesFormProps> = ({
  children,
  taxClass,
  onTaxClassCreate,
  onTaxClassUpdate,
  disabled,
}) => {
  const props = useTaxClassesForm(
    taxClass,
    onTaxClassCreate,
    onTaxClassUpdate,
    disabled,
  );

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

TaxClassesForm.displayName = "TaxClassesForm";
export default TaxClassesForm;
