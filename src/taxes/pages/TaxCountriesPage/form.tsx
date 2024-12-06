// @ts-strict-ignore
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import {
  TaxClassFragment,
  TaxClassRateInput,
  TaxCountryConfigurationFragment,
} from "@dashboard/graphql";
import useForm, { SubmitPromise } from "@dashboard/hooks/useForm";
import useFormset, { FormsetData } from "@dashboard/hooks/useFormset";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import { taxesMessages } from "@dashboard/taxes/messages";
import * as React from "react";
import { useIntl } from "react-intl";

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
  const intl = useIntl();
  const initialFormsetData = country?.taxClassCountryRates.map(item => ({
    id: item.taxClass?.id ?? null,
    label: item.taxClass?.name ?? intl.formatMessage(taxesMessages.countryDefaultRate),
    value: item.rate?.toString() ?? "",
    data: null,
  }));
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
      rate: isNaN(parsedRate) ? null : parsedRate,
      taxClassId: id,
    };
  });
  const handleSubmit = async (data: TaxClassRateInput[]) => {
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

  React.useEffect(() => setExitDialogSubmitRef(submit), [setExitDialogSubmitRef, submit]);
  setIsSubmitDisabled(disabled);

  return { data: formset.data, handlers: { handleRateChange }, submit };
}

const TaxCountriesForm = ({ children, country, onSubmit, disabled }: TaxCountriesFormProps) => {
  const props = useTaxCountriesForm(country, onSubmit, disabled);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

TaxCountriesForm.displayName = "TaxCountriesForm";
export default TaxCountriesForm;
