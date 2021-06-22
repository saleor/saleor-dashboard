import { OutputData } from "@editorjs/editorjs";
import { ExitFormDialogContext } from "@saleor/components/Form/ExitFormDialogProvider";
import { MetadataFormData } from "@saleor/components/Metadata";
import { RichTextEditorChange } from "@saleor/components/RichTextEditor";
import useForm, {
  CommonUseFormResult,
  FormChange
} from "@saleor/hooks/useForm";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@saleor/utils/richText/useRichText";
import React, { useContext, useEffect } from "react";

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
  onSubmit: (data: CategoryCreateData) => Promise<any[]>,
  confirmLeave
): UseCategoryCreateFormResult {
  const { change, data, hasChanged, triggerChange, setChanged } = useForm<
    CategoryCreateFormData
  >({ initialData, confirmLeave });

  const { setExitDialogSubmitRef, setEnableExitDialog } = useContext(
    ExitFormDialogContext
  );

  const [description, changeDescription] = useRichText({
    initial: null,
    triggerChange
  });

  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const handleChange: FormChange = (event, cb) => {
    change(event, cb);
    triggerChange();
  };
  const changeMetadata = makeMetadataChangeHandler(handleChange);

  // Need to make it function to always have description.current up to date
  const getData = (): CategoryCreateData => ({
    ...data,
    description: description.current
  });

  const submit = () =>
    handleFormSubmit(getData(), onSubmit, setChanged, setEnableExitDialog);

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
  onSubmit,
  confirmLeave
}) => {
  const props = useCategoryCreateForm(onSubmit, confirmLeave);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

CategoryCreateForm.displayName = "CategoryCreateForm";
export default CategoryCreateForm;
