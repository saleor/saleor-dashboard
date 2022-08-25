import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import {
  TaxClassFragment,
  TaxClassRateInput,
  TaxCountryConfigurationFragment,
} from "@saleor/graphql";
import useForm, { SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, { FormsetData } from "@saleor/hooks/useFormset";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import React from "react";

export interface TaxCountriesPageFormData {
  rates: Array<{
    rate: string;
    taxClass: Omit<TaxClassFragment, "countries">;
  }>;
  country: string;
}
export interface UseTaxCountriesFormResult {
  data: FormsetData<TaxClassRateInput>;
  submit: () => SubmitPromise;
  handlers: { handleRateChange: (id: string, value: string) => void };
}

interface TaxCountriesFormProps {
  children: (props: any) => React.ReactNode;
  country: TaxCountryConfigurationFragment;
  onSubmit: (data: TaxClassRateInput[]) => SubmitPromise;
  disabled: boolean;
}

function useTaxCountriesForm(
  country: TaxCountryConfigurationFragment,
  onSubmit,
  disabled,
): UseTaxCountriesFormResult {
  // Initial
  const initialFormsetData = React.useMemo(
    () =>
      country?.taxClassCountryRates.map(item => ({
        id: item.taxClass.id,
        label: item.taxClass.name,
        value: item.rate?.toString() ?? "",
        data: null,
      })),
    [country],
  );

  const { formId, triggerChange } = useForm({}, undefined, {
    confirmLeave: true,
  });

  const formset = useFormset(initialFormsetData);

  // Handlers
  const handleRateChange = (id: string, value: string) => {
    triggerChange();
    formset.change(id, value);
  };

  // Submit
  const submitData = formset.data.map(item => {
    const { id, value } = item;
    const parsedRate = parseFloat(value);
    return {
      taxClassId: id,
      rate: isNaN(parsedRate) ? 0 : parsedRate,
    };
  });

  const handleSubmit = async (data: TaxClassRateInput[]) => {
    const errors = await onSubmit(data);
    if (!errors?.length) {
      formset.reset();
    }
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

  return { data: formset.data, handlers: { handleRateChange }, submit };
}

const TaxCountriesForm: React.FC<TaxCountriesFormProps> = ({
  children,
  country,
  onSubmit,
  disabled,
}) => {
  const props = useTaxCountriesForm(country, onSubmit, disabled);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

TaxCountriesForm.displayName = "TaxCountriesForm";
export default TaxCountriesForm;
