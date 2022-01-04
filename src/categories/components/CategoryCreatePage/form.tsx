import { OutputData } from "@editorjs/editorjs";
import useExitFormDialog from "@saleor/components/Form/useExitFormDialog";
import { MetadataFormData } from "@saleor/components/Metadata";
import { RichTextEditorChange } from "@saleor/components/RichTextEditor";
import useForm, {
  CommonUseFormResult,
  FormChange
} from "@saleor/hooks/useForm";
import useHandleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@saleor/utils/richText/useRichText";
import React, { useEffect } from "react";

export interface CategoryCreateFormData extends MetadataFormData {
  name: string;
  seoDescription: string;
  seoTitle: string;
  slug: string;
}
export interface CategoryCreateData extends CategoryCreateFormData {
  description: OutputData;
}

interface CategoryCreateHandlers {
  changeMetadata: FormChange;
  changeDescription: RichTextEditorChange;
}
export interface UseCategoryCreateFormResult
  extends CommonUseFormResult<CategoryCreateData> {
  handlers: CategoryCreateHandlers;
}

export interface CategoryCreateFormProps {
  children: (props: UseCategoryCreateFormResult) => React.ReactNode;
  onSubmit: (data: CategoryCreateData) => Promise<any[]>;
}

const initialData: CategoryCreateFormData = {
  metadata: [],
  name: "",
  privateMetadata: [],
  seoDescription: "",
  seoTitle: "",
  slug: ""
};

function useCategoryCreateForm(
  onSubmit: (data: CategoryCreateData) => Promise<any[]>
): UseCategoryCreateFormResult {
  const {
    handleChange,
    data,
    hasChanged,
    triggerChange,
    setChanged,
    formId
  } = useForm(initialData, undefined, { confirmLeave: true });

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
    setChanged
  });

  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId
  });

  const [description, changeDescription] = useRichText({
    initial: null,
    triggerChange
  });

  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const changeMetadata = makeMetadataChangeHandler(handleChange);

  // Need to make it function to always have description.current up to date
  const getData = (): CategoryCreateData => ({
    ...data,
    description: description.current
  });

  const submit = () => handleFormSubmit(getData());

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  return {
    change: handleChange,
    data: getData(),
    handlers: {
      changeDescription,
      changeMetadata
    },
    hasChanged,
    submit
  };
}

const CategoryCreateForm: React.FC<CategoryCreateFormProps> = ({
  children,
  onSubmit
}) => {
  const props = useCategoryCreateForm(onSubmit);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

CategoryCreateForm.displayName = "CategoryCreateForm";
export default CategoryCreateForm;
