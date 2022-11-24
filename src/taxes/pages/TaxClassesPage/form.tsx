import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import { MetadataFormData } from "@saleor/components/Metadata";
import {
  TaxClassFragment,
  TaxClassRateInput,
  TaxClassUpdateErrorCode,
} from "@saleor/graphql";
import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, { FormsetData } from "@saleor/hooks/useFormset";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import { validateTaxClassFormData } from "@saleor/taxes/utils/validation";
import { CommonError } from "@saleor/utils/errors/common";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React, { useState } from "react";

export type TaxClassesErrors = Array<CommonError<TaxClassUpdateErrorCode>>;

export interface TaxClassesPageFormData extends MetadataFormData {
  id: string;
  updateTaxClassRates: FormsetData<TaxClassRateInput>;
  name?: string;
}

interface TaxClassesFormHandlers {
  handleRateChange: (id: string, value: string) => void;
  changeMetadata: FormChange;
}

export interface UseTaxClassesFormResult {
  validationErrors: TaxClassesErrors;
  data: TaxClassesPageFormData;
  submit: () => SubmitPromise<TaxClassesErrors>;
  change: FormChange;
  handlers: TaxClassesFormHandlers;
}

interface TaxClassesFormProps {
  children: (props: UseTaxClassesFormResult) => React.ReactNode;
  taxClass: TaxClassFragment | undefined;
  onTaxClassCreate: (
    data: TaxClassesPageFormData,
  ) => SubmitPromise<TaxClassesErrors>;
  onTaxClassUpdate: (
    data: TaxClassesPageFormData,
  ) => SubmitPromise<TaxClassesErrors>;
  disabled: boolean;
}

function useTaxClassesForm(
  taxClass: TaxClassFragment,
  onTaxClassCreate: (
    data: TaxClassesPageFormData,
  ) => SubmitPromise<TaxClassesErrors>,
  onTaxClassUpdate: (
    data: TaxClassesPageFormData,
  ) => SubmitPromise<TaxClassesErrors>,
  disabled: boolean,
): UseTaxClassesFormResult {
  // Initial

  const isNewTaxClass = taxClass?.id === "new";

  const initialFormsetData = taxClass?.countries
    .map(item => ({
      id: item.country.code,
      label: item.country.country,
      value: item.rate?.toString() ?? "",
      data: null,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const initialFormData: TaxClassesPageFormData = {
    id: taxClass?.id,
    name: taxClass?.name ?? "",
    metadata: taxClass?.metadata?.map(mapMetadataItemToInput),
    privateMetadata: taxClass?.privateMetadata?.map(mapMetadataItemToInput),
    updateTaxClassRates: initialFormsetData,
  };

  const formset = useFormset(initialFormsetData);

  const { formId, triggerChange, data, handleChange } = useForm(
    initialFormData,
    undefined,
    {
      confirmLeave: true,
    },
  );

  const [validationErrors, setValidationErrors] = useState<TaxClassesErrors>(
    [],
  );

  if (isNewTaxClass) {
    triggerChange();
  }

  // Handlers

  const handleRateChange = (id: string, value: string) => {
    triggerChange();
    formset.change(id, value);
  };

  const {
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();

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

  React.useEffect(() => setExitDialogSubmitRef(submit), [
    setExitDialogSubmitRef,
    submit,
  ]);
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
