import { OutputData } from "@editorjs/editorjs";
import { ChannelCollectionData } from "@saleor/channels/utils";
import { CollectionDetails_collection } from "@saleor/collections/types/CollectionDetails";
import { createChannelsChangeHandler } from "@saleor/collections/utils";
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
  channelListings: ChannelCollectionData[];
  name: string;
  slug: string;
  seoDescription: string;
  seoTitle: string;
}
export interface CollectionUpdateData extends CollectionUpdateFormData {
  description: OutputData;
}

interface CollectionUpdateHandlers {
  changeMetadata: FormChange;
  changeDescription: RichTextEditorChange;
  changeChannels: (
    id: string,
    data: Omit<ChannelCollectionData, "name" | "id">
  ) => void;
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
  currentChannels: ChannelCollectionData[];
  setChannels: (data: ChannelCollectionData[]) => void;
  onSubmit: (data: CollectionUpdateData) => Promise<any[]>;
}

function useCollectionUpdateForm(
  collection: CollectionDetails_collection,
  currentChannels: ChannelCollectionData[],
  setChannels: (data: ChannelCollectionData[]) => void,
  onSubmit: (data: CollectionUpdateData) => Promise<any[]>
): UseCollectionUpdateFormResult {
  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const form = useForm<CollectionUpdateFormData>({
    backgroundImageAlt: collection?.backgroundImage?.alt || "",
    channelListings: currentChannels,
    metadata: collection?.metadata?.map(mapMetadataItemToInput),
    name: collection?.name || "",
    privateMetadata: collection?.privateMetadata?.map(mapMetadataItemToInput),
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
    ...getMetadata(form.data, isMetadataModified, isPrivateMetadataModified)
  });

  const handleChannelChange = createChannelsChangeHandler(
    currentChannels,
    setChannels,
    triggerChange
  );

  const submit = () => handleFormSubmit(getSubmitData(), onSubmit, setChanged);

  return {
    change: handleChange,
    data: getData(),
    handlers: {
      changeChannels: handleChannelChange,
      changeDescription,
      changeMetadata
    },
    hasChanged: changed,
    submit
  };
}

const CollectionUpdateForm: React.FC<CollectionUpdateFormProps> = ({
  collection,
  currentChannels,
  setChannels,
  children,
  onSubmit
}) => {
  const props = useCollectionUpdateForm(
    collection,
    currentChannels,
    setChannels,
    onSubmit
  );

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

CollectionUpdateForm.displayName = "CollectionUpdateForm";
export default CollectionUpdateForm;
