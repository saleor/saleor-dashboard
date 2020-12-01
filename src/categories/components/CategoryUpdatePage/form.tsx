import { OutputData } from "@editorjs/editorjs";
import { CategoryDetails_category } from "@saleor/categories/types/CategoryDetails";
import { MetadataFormData } from "@saleor/components/Metadata";
import { RichTextEditorChange } from "@saleor/components/RichTextEditor";
import useForm, { FormChange } from "@saleor/hooks/useForm";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@saleor/utils/richText/useRichText";
import React from "react";

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
export interface UseCategoryUpdateFormResult {
  change: FormChange;
  data: CategoryUpdateData;
  handlers: CategoryUpdateHandlers;
  hasChanged: boolean;
  submit: () => Promise<boolean>;
}

export interface CategoryUpdateFormProps {
  children: (props: UseCategoryUpdateFormResult) => React.ReactNode;
  category: CategoryDetails_category;
  onSubmit: (data: CategoryUpdateData) => Promise<any[]>;
}

function useCategoryUpdateForm(
  category: CategoryDetails_category,
  onSubmit: (data: CategoryUpdateData) => Promise<any[]>
): UseCategoryUpdateFormResult {
  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const form = useForm<CategoryUpdateFormData>({
    backgroundImageAlt: category?.backgroundImage?.alt || "",
    metadata: category?.metadata?.map(mapMetadataItemToInput),
    name: category?.name || "",
    privateMetadata: category?.privateMetadata?.map(mapMetadataItemToInput),
    seoDescription: category?.seoDescription || "",
    seoTitle: category?.seoTitle || "",
    slug: category?.slug || ""
  });
  const [description, changeDescription] = useRichText({
    initial: category?.descriptionJson,
    triggerChange
  });

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
    triggerChange();
  };
  const changeMetadata = makeMetadataChangeHandler(handleChange);

  // Need to make it function to always have description.current up to date
  const getData = (): CategoryUpdateData => ({
    ...form.data,
    description: description.current
  });

  const getSubmitData = (): CategoryUpdateData => ({
    ...getData(),
    ...getMetadata(form.data, isMetadataModified, isPrivateMetadataModified)
  });

  const submit = () => handleFormSubmit(getSubmitData(), onSubmit, setChanged);

  return {
    change: handleChange,
    data: getData(),
    handlers: {
      changeDescription,
      changeMetadata
    },
    hasChanged: changed,
    submit
  };
}

const CategoryUpdateForm: React.FC<CategoryUpdateFormProps> = ({
  children,
  category,
  onSubmit
}) => {
  const props = useCategoryUpdateForm(category, onSubmit);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

CategoryUpdateForm.displayName = "CategoryUpdateForm";
export default CategoryUpdateForm;
