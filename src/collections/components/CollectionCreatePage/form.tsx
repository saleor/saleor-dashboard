import { OutputData } from "@editorjs/editorjs";
import { MetadataFormData } from "@saleor/components/Metadata";
import { RichTextEditorChange } from "@saleor/components/RichTextEditor";
import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@saleor/utils/richText/useRichText";
import React from "react";

export interface CollectionCreateFormData extends MetadataFormData {
  backgroundImage: {
    url: string;
    value: string;
  };
  backgroundImageAlt: string;
  name: string;
  slug: string;
  publicationDate: string;
  isPublished: boolean;
  seoDescription: string;
  seoTitle: string;
}
export interface CollectionCreateData extends CollectionCreateFormData {
  description: OutputData;
}

interface CollectionCreateHandlers {
  changeMetadata: FormChange;
  changeDescription: RichTextEditorChange;
}
export interface UseCollectionCreateFormResult {
  change: FormChange;
  data: CollectionCreateData;
  handlers: CollectionCreateHandlers;
  hasChanged: boolean;
  submit: () => Promise<boolean>;
}

export interface CollectionCreateFormProps {
  children: (props: UseCollectionCreateFormResult) => React.ReactNode;
  onSubmit: (data: CollectionCreateData) => SubmitPromise;
}

function useCollectionCreateForm(
  onSubmit: (data: CollectionCreateData) => SubmitPromise
): UseCollectionCreateFormResult {
  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const form = useForm<CollectionCreateFormData>({
    backgroundImage: {
      url: null,
      value: null
    },
    backgroundImageAlt: "",
    isPublished: false,
    metadata: [],
    name: "",
    privateMetadata: [],
    publicationDate: "",
    seoDescription: "",
    seoTitle: "",
    slug: ""
  });
  const [description, changeDescription] = useRichText({
    initial: null,
    triggerChange
  });

  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
    triggerChange();
  };
  const changeMetadata = makeMetadataChangeHandler(handleChange);

  // Need to make it function to always have description.current up to date
  const getData = (): CollectionCreateData => ({
    ...form.data,
    description: description.current
  });

  const submit = () => handleFormSubmit(getData(), onSubmit, setChanged);

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

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  children,
  onSubmit
}) => {
  const props = useCollectionCreateForm(onSubmit);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

CollectionCreateForm.displayName = "CollectionCreateForm";
export default CollectionCreateForm;
