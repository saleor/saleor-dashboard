import { OutputData } from "@editorjs/editorjs";
import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import { MetadataFormData } from "@saleor/components/Metadata";
import { RichTextEditorChange } from "@saleor/components/RichTextEditor";
import { CategoryDetailsFragment } from "@saleor/graphql";
import useForm, {
  CommonUseFormResult,
  FormChange
} from "@saleor/hooks/useForm";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@saleor/utils/richText/useRichText";
import React, { useEffect } from "react";

export interface CategoryUpdateFormData extends MetadataFormData {
  backgroundImageAlt: string;
  name: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
}
export interface CategoryUpdateData extends CategoryUpdateFormData {
  description: OutputData;
}

interface CategoryUpdateHandlers {
  changeMetadata: FormChange;
  changeDescription: RichTextEditorChange;
}
export interface UseCategoryUpdateFormResult
  extends CommonUseFormResult<CategoryUpdateData> {
  handlers: CategoryUpdateHandlers;
}

export interface CategoryUpdateFormProps {
  children: (props: UseCategoryUpdateFormResult) => React.ReactNode;
  category: CategoryDetailsFragment;
  onSubmit: (data: CategoryUpdateData) => Promise<any[]>;
  disabled: boolean;
}

const getInitialData = (category?: CategoryDetailsFragment) => ({
  backgroundImageAlt: category?.backgroundImage?.alt || "",
  metadata: category?.metadata?.map(mapMetadataItemToInput),
  name: category?.name || "",
  privateMetadata: category?.privateMetadata?.map(mapMetadataItemToInput),
  seoDescription: category?.seoDescription || "",
  seoTitle: category?.seoTitle || "",
  slug: category?.slug || ""
});

function useCategoryUpdateForm(
  category: CategoryDetailsFragment,
  onSubmit: (data: CategoryUpdateData) => Promise<any[]>,
  disabled: boolean
): UseCategoryUpdateFormResult {
  const {
    handleChange,
    data,
    triggerChange,
    hasChanged,
    setChanged,
    formId,
    setIsSubmitDisabled
  } = useForm(getInitialData(category), undefined, { confirmLeave: true });

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
    setChanged
  });

  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId
  });

  const [description, changeDescription] = useRichText({
    initial: category?.description,
    triggerChange
  });

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const changeMetadata = makeMetadataChangeHandler(handleChange);

  // Need to make it function to always have description.current up to date
  const getData = (): CategoryUpdateData => ({
    ...data,
    description: description.current
  });

  const getSubmitData = (): CategoryUpdateData => ({
    ...getData(),
    ...getMetadata(data, isMetadataModified, isPrivateMetadataModified)
  });

  const submit = () => handleFormSubmit(getSubmitData());

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const isSaveDisabled = disabled || !hasChanged;
  setIsSubmitDisabled(isSaveDisabled);

  return {
    change: handleChange,
    data: getData(),
    handlers: {
      changeDescription,
      changeMetadata
    },
    hasChanged,
    submit,
    isSaveDisabled
  };
}

const CategoryUpdateForm: React.FC<CategoryUpdateFormProps> = ({
  children,
  category,
  onSubmit,
  disabled
}) => {
  const props = useCategoryUpdateForm(category, onSubmit, disabled);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

CategoryUpdateForm.displayName = "CategoryUpdateForm";
export default CategoryUpdateForm;
