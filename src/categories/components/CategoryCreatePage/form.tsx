import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { MetadataFormData } from "@dashboard/components/Metadata";
import useForm, { CommonUseFormResult, FormChange } from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { RichTextContext, RichTextContextValues } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { OutputData } from "@editorjs/editorjs";
import React, { useEffect } from "react";

export interface CategoryCreateFormData extends MetadataFormData {
  name: string;
  seoDescription: string;
  seoTitle: string;
  slug: string;
}
export interface CategoryCreateData extends CategoryCreateFormData {
  description: OutputData | null;
}

interface CategoryCreateHandlers {
  changeMetadata: FormChange;
}

export interface UseCategoryCreateFormResult extends CommonUseFormResult<CategoryCreateData> {
  handlers: CategoryCreateHandlers;
}

export interface CategoryCreateFormProps {
  children: (props: UseCategoryCreateFormResult) => React.ReactNode;
  onSubmit: (data: CategoryCreateData) => Promise<any[]>;
  disabled: boolean;
}

const initialData: CategoryCreateFormData = {
  metadata: [],
  name: "",
  privateMetadata: [],
  seoDescription: "",
  seoTitle: "",
  slug: "",
};

function useCategoryCreateForm(
  onSubmit: (data: CategoryCreateData) => Promise<any[]>,
  disabled: boolean,
): UseCategoryCreateFormResult & { richText: RichTextContextValues } {
  const {
    handleChange,
    data: formData,
    triggerChange,
    formId,
    setIsSubmitDisabled,
  } = useForm(initialData, undefined, { confirmLeave: true });
  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
  });
  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId,
  });
  const richText = useRichText({
    initial: null,
    triggerChange,
  });
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();
  const changeMetadata = makeMetadataChangeHandler(handleChange);
  const data: CategoryCreateData = {
    ...formData,
    description: null,
  };
  // Need to make it function to always have description.current up to date
  const getData = async (): Promise<CategoryCreateData> => ({
    ...formData,
    description: await richText.getValue(),
  });
  const submit = async () => handleFormSubmit(await getData());

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);
  setIsSubmitDisabled(disabled);

  return {
    change: handleChange,
    data,
    handlers: {
      changeMetadata,
    },
    submit,
    isSaveDisabled: disabled,
    richText,
  };
}

const CategoryCreateForm = ({ children, onSubmit, disabled }: CategoryCreateFormProps) => {
  const { richText, ...props } = useCategoryCreateForm(onSubmit, disabled);

  return (
    <form onSubmit={props.submit}>
      <RichTextContext.Provider value={richText}>{children(props)}</RichTextContext.Provider>
    </form>
  );
};

CategoryCreateForm.displayName = "CategoryCreateForm";
export default CategoryCreateForm;
