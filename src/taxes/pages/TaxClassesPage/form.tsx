// @ts-strict-ignore
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { TaxClassFragment } from "@dashboard/graphql";
import useForm, { FormChange, SubmitPromise } from "@dashboard/hooks/useForm";
import useFormset from "@dashboard/hooks/useFormset";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import { TaxClassesPageFormData } from "@dashboard/taxes/types";
import { getTaxClassInitialFormData } from "@dashboard/taxes/utils/data";
import { validateTaxClassFormData } from "@dashboard/taxes/utils/validation";
import { TaxClassError } from "@dashboard/utils/errors/taxes";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import React, { useState } from "react";

interface TaxClassesFormHandlers {
  handleRateChange: (id: string, value: string) => void;
  changeMetadata: FormChange;
}

interface UseTaxClassesFormResult {
  validationErrors: TaxClassError[];
  data: TaxClassesPageFormData;
  submit: () => SubmitPromise<TaxClassError[]>;
  change: FormChange;
  handlers: TaxClassesFormHandlers;
}

interface TaxClassesFormProps {
  children: (props: UseTaxClassesFormResult) => React.ReactNode;
  taxClass: TaxClassFragment | undefined;
  onTaxClassCreate: (data: TaxClassesPageFormData) => SubmitPromise<TaxClassError[]>;
  onTaxClassUpdate: (data: TaxClassesPageFormData) => SubmitPromise<TaxClassError[]>;
  disabled: boolean;
}

function useTaxClassesForm(
  taxClass: TaxClassFragment,
  onTaxClassCreate: (data: TaxClassesPageFormData) => SubmitPromise<TaxClassError[]>,
  onTaxClassUpdate: (data: TaxClassesPageFormData) => SubmitPromise<TaxClassError[]>,
  disabled: boolean,
): UseTaxClassesFormResult {
  // Initial

  const isNewTaxClass = taxClass?.id === "new";
  const initialFormData = getTaxClassInitialFormData(taxClass);
  const initialFormsetData = initialFormData.updateTaxClassRates;
  const formset = useFormset(initialFormsetData);
  const { formId, triggerChange, data, handleChange } = useForm(initialFormData, undefined, {
    confirmLeave: true,
  });
  const [validationErrors, setValidationErrors] = useState<TaxClassError[]>([]);

  if (isNewTaxClass) {
    triggerChange();
  }

  // Handlers

  const handleRateChange = (id: string, value: string) => {
    triggerChange();
    formset.change(id, value);
  };
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();
  const changeMetadata = makeMetadataChangeHandler(handleChange);

  // Submit

  const handleSubmit = async (data: TaxClassesPageFormData) => {
    const errors = validateTaxClassFormData(data);

    setValidationErrors(errors);

    if (errors.length) {
      return errors;
    }

    if (isNewTaxClass) {
      return onTaxClassCreate(data);
    }

    return onTaxClassUpdate(data);
  };
  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit: handleSubmit,
  });
  const submit = () =>
    handleFormSubmit({
      ...data,
      updateTaxClassRates: formset.data,
    });

  // Exit form util

  const { setExitDialogSubmitRef, setIsSubmitDisabled } = useExitFormDialog({
    formId,
  });

  React.useEffect(() => setExitDialogSubmitRef(submit), [setExitDialogSubmitRef, submit]);
  setIsSubmitDisabled(disabled);

  return {
    validationErrors,
    data: { ...data, updateTaxClassRates: formset.data },
    handlers: { handleRateChange, changeMetadata },
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
  const props = useTaxClassesForm(taxClass, onTaxClassCreate, onTaxClassUpdate, disabled);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

TaxClassesForm.displayName = "TaxClassesForm";
export default TaxClassesForm;
