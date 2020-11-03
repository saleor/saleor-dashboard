import { OutputData } from "@editorjs/editorjs";
import { CollectionDetails_collection } from "@saleor/collections/types/CollectionDetails";
import { MetadataFormData } from "@saleor/components/Metadata";
import { RichTextEditorChange } from "@saleor/components/RichTextEditor";
import useForm, { FormChange } from "@saleor/hooks/useForm";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@saleor/utils/richText/useRichText";
import React from "react";

export interface CollectionUpdateFormData extends MetadataFormData {
  backgroundImageAlt: string;
  name: string;
  slug: string;
  publicationDate: string;
  seoDescription: string;
  seoTitle: string;
  isFeatured: boolean;
  isPublished: boolean;
}
export interface CollectionUpdateData extends CollectionUpdateFormData {
  description: OutputData;
}

interface CollectionUpdateHandlers {
  changeMetadata: FormChange;
  changeDescription: RichTextEditorChange;
}
export interface UseCollectionUpdateFormResult {
  change: FormChange;
  data: CollectionUpdateData;
  handlers: CollectionUpdateHandlers;
  hasChanged: boolean;
  submit: () => Promise<boolean>;
}

export interface CollectionUpdateFormProps {
  children: (props: UseCollectionUpdateFormResult) => React.ReactNode;
  collection: CollectionDetails_collection;
  isFeatured: boolean;
  onSubmit: (data: CollectionUpdateData) => Promise<any[]>;
}

function useCollectionUpdateForm(
  collection: CollectionDetails_collection,
  onSubmit: (data: CollectionUpdateData) => Promise<any[]>,
  isFeatured: boolean
): UseCollectionUpdateFormResult {
  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const form = useForm<CollectionUpdateFormData>({
    backgroundImageAlt: collection?.backgroundImage?.alt || "",
    isFeatured,
    isPublished: !!collection?.isPublished,
    metadata: collection?.metadata?.map(mapMetadataItemToInput),
    name: collection?.name || "",
    privateMetadata: collection?.privateMetadata?.map(mapMetadataItemToInput),
    publicationDate: collection?.publicationDate || "",
    seoDescription: collection?.seoDescription || "",
    seoTitle: collection?.seoTitle || "",
    slug: collection?.slug || ""
  });
  const [description, changeDescription] = useRichText({
    initial: collection?.descriptionJson,
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
  const getData = (): CollectionUpdateData => ({
    ...form.data,
    description: description.current
  });

  const getSubmitData = (): CollectionUpdateData => ({
    ...getData(),
    ...getMetadata(form.data, isMetadataModified, isPrivateMetadataModified),
    isPublished: form.data.isPublished || !!form.data.publicationDate
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

const CollectionUpdateForm: React.FC<CollectionUpdateFormProps> = ({
  children,
  collection,
  isFeatured,
  onSubmit
}) => {
  const props = useCollectionUpdateForm(collection, onSubmit, isFeatured);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

CollectionUpdateForm.displayName = "CollectionUpdateForm";
export default CollectionUpdateForm;
