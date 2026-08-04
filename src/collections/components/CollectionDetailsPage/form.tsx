// @ts-strict-ignore
import { type ChannelCollectionData } from "@dashboard/channels/utils";
import { createChannelsChangeHandler } from "@dashboard/collections/utils";
import { COLLECTION_DETAILS_FORM_ID } from "@dashboard/collections/views/consts";
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { type CollectionDetailsFragment } from "@dashboard/graphql";
import useForm, { type CommonUseFormResultWithHandlers } from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import { RichTextContext, type RichTextContextValues } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { type OutputData } from "@editorjs/editorjs";
import type * as React from "react";
import { useEffect } from "react";

import {
  buildCollectionSaveComposition,
  type CollectionSaveComposition,
  hasCollectionSaveComposition,
} from "./saveComposition";

interface CollectionUpdateFormData {
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
  changeChannels: (id: string, data: Omit<ChannelCollectionData, "name" | "id">) => void;
}
export type UseCollectionUpdateFormResult = CommonUseFormResultWithHandlers<
  CollectionUpdateData,
  CollectionUpdateHandlers
> & {
  changedData: Partial<CollectionUpdateFormData>;
  hasUnsavedChanges: boolean;
  isSaveDisabled: boolean;
  richText: RichTextContextValues;
  saveComposition: CollectionSaveComposition;
};

interface CollectionUpdateFormProps {
  children: (props: UseCollectionUpdateFormResult) => React.ReactNode;
  collection: CollectionDetailsFragment;
  currentChannels: ChannelCollectionData[];
  savedChannelListings: ChannelCollectionData[];
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
  name: collection?.name || "",
  seoDescription: collection?.seoDescription || "",
  seoTitle: collection?.seoTitle || "",
  slug: collection?.slug || "",
});

export function useCollectionUpdateForm(
  collection: CollectionDetailsFragment,
  currentChannels: ChannelCollectionData[],
  savedChannelListings: ChannelCollectionData[],
  setChannels: (data: ChannelCollectionData[]) => void,
  onSubmit: (data: CollectionUpdateData) => Promise<any[]>,
  disabled: boolean,
): UseCollectionUpdateFormResult {
  const {
    handleChange,
    data: formData,
    triggerChange,
    formId,
    setIsSubmitDisabled,
    changedData,
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
  const data: CollectionUpdateData = {
    ...formData,
    description: null,
  };
  const getData = async (): Promise<CollectionUpdateData> => ({
    ...formData,
    channelListings: currentChannels,
    description: await richText.getValue(),
  });
  const handleChannelChange = createChannelsChangeHandler(
    currentChannels,
    setChannels,
    triggerChange,
    savedChannelListings,
  );
  const submit = async () => handleFormSubmit(await getData());

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const saveComposition = buildCollectionSaveComposition(
    Object.keys(changedData),
    richText.isDirty,
    currentChannels,
    savedChannelListings,
  );
  const hasUnsavedChanges = hasCollectionSaveComposition(saveComposition);
  const isSaveDisabled = disabled || !hasUnsavedChanges || !formData.name.trim();

  useEffect(() => {
    triggerChange(hasUnsavedChanges);
  }, [hasUnsavedChanges, triggerChange]);

  setIsSubmitDisabled(isSaveDisabled);

  return {
    change: handleChange,
    changedData,
    data,
    handlers: {
      changeChannels: handleChannelChange,
    },
    hasUnsavedChanges,
    isSaveDisabled,
    saveComposition,
    submit,
    richText,
  };
}

const CollectionUpdateForm = ({
  collection,
  currentChannels,
  savedChannelListings,
  setChannels,
  children,
  onSubmit,
  disabled,
}: CollectionUpdateFormProps) => {
  const { richText, ...props } = useCollectionUpdateForm(
    collection,
    currentChannels,
    savedChannelListings,
    setChannels,
    onSubmit,
    disabled,
  );

  return (
    <form onSubmit={props.submit}>
      <RichTextContext.Provider value={richText}>
        {children({ ...props, richText })}
      </RichTextContext.Provider>
    </form>
  );
};

CollectionUpdateForm.displayName = "CollectionUpdateForm";
export default CollectionUpdateForm;
