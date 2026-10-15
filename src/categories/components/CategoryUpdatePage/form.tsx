import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { type CategoryDetailsFragment } from "@dashboard/graphql";
import useForm, { type CommonUseFormResult } from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import { RichTextContext, type RichTextContextValues } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { type OutputData } from "@editorjs/editorjs";
import type * as React from "react";
import { useEffect } from "react";

import {
  buildCategorySaveComposition,
  type CategorySaveComposition,
  hasCategorySaveComposition,
} from "./saveComposition";

interface CategoryUpdateFormData {
  backgroundImageAlt: string;
  name: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
}
export interface CategoryUpdateData extends CategoryUpdateFormData {
  description: OutputData | null;
  fullDescription?: OutputData | null;
}

type UseCategoryUpdateFormResult = CommonUseFormResult<CategoryUpdateData> & {
  hasUnsavedChanges: boolean;
  isSaveDisabled: boolean;
  richText: RichTextContextValues;
  fullDescriptionRichText: RichTextContextValues;
  saveComposition: CategorySaveComposition;
};

interface CategoryUpdateFormProps {
  children: (props: UseCategoryUpdateFormResult) => React.ReactNode;
  category: CategoryDetailsFragment | undefined | null;
  onSubmit: (data: CategoryUpdateData) => Promise<any[]>;
  disabled: boolean;
}

const getInitialData = (
  category: CategoryDetailsFragment | undefined | null,
): CategoryUpdateFormData => ({
  backgroundImageAlt: category?.backgroundImage?.alt || "",
  name: category?.name || "",
  seoDescription: category?.seoDescription || "",
  seoTitle: category?.seoTitle || "",
  slug: category?.slug || "",
});

export function useCategoryUpdateForm(
  category: CategoryDetailsFragment | undefined | null,
  onSubmit: (data: CategoryUpdateData) => Promise<any[]>,
  disabled: boolean,
): UseCategoryUpdateFormResult {
  const {
    handleChange,
    data: formData,
    triggerChange,
    formId,
    setIsSubmitDisabled,
    changedData,
  } = useForm(getInitialData(category), undefined, { confirmLeave: true });
  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
  });
  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId,
  });
  const richText = useRichText({
    initial: category?.description,
    loading: !category,
    triggerChange,
  });
  const fullDescriptionRichText = useRichText({
    initial: category?.fullDescription,
    loading: !category,
    triggerChange,
  });
  const data: CategoryUpdateData = {
    ...formData,
    description: null,
  };
  const getData = async (): Promise<CategoryUpdateData> => ({
    ...formData,
    description: await richText.getValue(),
    ...(fullDescriptionRichText.isDirty
      ? { fullDescription: await fullDescriptionRichText.getValue() }
      : {}),
  });
  const submit = async (): Promise<unknown[]> => {
    const descriptionDirty = richText.isDirty;
    const fullDescriptionDirty = fullDescriptionRichText.isDirty;
    const errors = await handleFormSubmit(await getData());

    if (errors.length > 0) {
      if (descriptionDirty) {
        richText.handleChange();
      }

      if (fullDescriptionDirty) {
        fullDescriptionRichText.handleChange();
      }
    }

    return errors;
  };

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const saveComposition = buildCategorySaveComposition(
    Object.keys(changedData),
    richText.isDirty || fullDescriptionRichText.isDirty,
  );
  const hasUnsavedChanges = hasCategorySaveComposition(saveComposition);
  const isSaveDisabled = disabled || !hasUnsavedChanges || !formData.name.trim();

  useEffect(() => {
    triggerChange(hasUnsavedChanges);
  }, [hasUnsavedChanges, triggerChange]);

  setIsSubmitDisabled(isSaveDisabled);

  return {
    change: handleChange,
    data,
    hasUnsavedChanges,
    isSaveDisabled,
    saveComposition,
    submit,
    richText,
    fullDescriptionRichText,
  };
}

const CategoryUpdateForm = ({
  children,
  category,
  onSubmit,
  disabled,
}: CategoryUpdateFormProps) => {
  const { richText, ...props } = useCategoryUpdateForm(category, onSubmit, disabled);

  return (
    <form onSubmit={props.submit}>
      <RichTextContext.Provider value={richText}>
        {children({ ...props, richText })}
      </RichTextContext.Provider>
    </form>
  );
};

CategoryUpdateForm.displayName = "CategoryUpdateForm";
export default CategoryUpdateForm;
