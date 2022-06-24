import { OutputData } from "@editorjs/editorjs";
import { ChannelCollectionData } from "@saleor/channels/utils";
import { createChannelsChangeHandler } from "@saleor/collections/utils";
import { COLLECTION_DETAILS_FORM_ID } from "@saleor/collections/views/consts";
import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import { MetadataFormData } from "@saleor/components/Metadata";
import { CollectionDetailsFragment } from "@saleor/graphql";
import useForm, {
  CommonUseFormResultWithHandlers,
  FormChange,
} from "@saleor/hooks/useForm";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import {
  RichTextContext,
  RichTextContextValues,
} from "@saleor/utils/richText/context";
import useRichText from "@saleor/utils/richText/useRichText";
import React, { useEffect } from "react";

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
  changeChannels: (
    id: string,
    data: Omit<ChannelCollectionData, "name" | "id">,
  ) => void;
}
export type UseCollectionUpdateFormResult = CommonUseFormResultWithHandlers<
  CollectionUpdateData,
  CollectionUpdateHandlers
>;

export interface CollectionUpdateFormProps {
  children: (props: UseCollectionUpdateFormResult) => React.ReactNode;
  collection: CollectionDetailsFragment;
  currentChannels: ChannelCollectionData[];
  setChannels: (data: ChannelCollectionData[]) => void;
  onSubmit: (data: CollectionUpdateData) => Promise<any[]>;
  disabled: boolean;
}

const getInitialData = (
  collection: CollectionDetailsFragment,
  currentChannels: ChannelCollectionData[],
): CollectionUpdateFormData => ({
  backgroundImageAlt: collection?.backgroundImage?.alt || "",
  channelListings: currentChannels,
  metadata: collection?.metadata?.map(mapMetadataItemToInput),
  name: collection?.name || "",
  privateMetadata: collection?.privateMetadata?.map(mapMetadataItemToInput),
  seoDescription: collection?.seoDescription || "",
  seoTitle: collection?.seoTitle || "",
  slug: collection?.slug || "",
});

function useCollectionUpdateForm(
  collection: CollectionDetailsFragment,
  currentChannels: ChannelCollectionData[],
  setChannels: (data: ChannelCollectionData[]) => void,
  onSubmit: (data: CollectionUpdateData) => Promise<any[]>,
  disabled: boolean,
): UseCollectionUpdateFormResult & { richText: RichTextContextValues } {
  const {
    handleChange,
    data: formData,
    triggerChange,
    formId,
    setIsSubmitDisabled,
  } = useForm(getInitialData(collection, currentChannels), undefined, {
    confirmLeave: true,
    formId: COLLECTION_DETAILS_FORM_ID,
  });

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
  });

  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId: COLLECTION_DETAILS_FORM_ID,
  });

  const richText = useRichText({
    initial: collection?.description,
    loading: !collection,
    triggerChange,
  });

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();

  const changeMetadata = makeMetadataChangeHandler(handleChange);

  const data: CollectionUpdateData = {
    ...formData,
    description: null,
  };

  // Need to make it function to always have description.current up to date
  const getData = async (): Promise<CollectionUpdateData> => ({
    ...formData,
    description: await richText.getValue(),
  });

  const getSubmitData = async (): Promise<CollectionUpdateData> => ({
    ...(await getData()),
    ...getMetadata(formData, isMetadataModified, isPrivateMetadataModified),
  });

  const handleChannelChange = createChannelsChangeHandler(
    currentChannels,
    setChannels,
    triggerChange,
  );

  const submit = async () => handleFormSubmit(await getSubmitData());

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  setIsSubmitDisabled(disabled);

  return {
    change: handleChange,
    data,
    handlers: {
      changeChannels: handleChannelChange,
      changeMetadata,
    },
    submit,
    richText,
  };
}

const CollectionUpdateForm: React.FC<CollectionUpdateFormProps> = ({
  collection,
  currentChannels,
  setChannels,
  children,
  onSubmit,
  disabled,
}) => {
  const { richText, ...props } = useCollectionUpdateForm(
    collection,
    currentChannels,
    setChannels,
    onSubmit,
    disabled,
  );

  return (
    <form onSubmit={props.submit}>
      <RichTextContext.Provider value={richText}>
        {children(props)}
      </RichTextContext.Provider>
    </form>
  );
};

CollectionUpdateForm.displayName = "CollectionUpdateForm";
export default CollectionUpdateForm;
