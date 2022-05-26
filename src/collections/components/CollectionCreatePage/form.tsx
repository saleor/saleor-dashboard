import { OutputData } from "@editorjs/editorjs";
import { ChannelCollectionData } from "@saleor/channels/utils";
import { createChannelsChangeHandler } from "@saleor/collections/utils";
import { COLLECTION_CREATE_FORM_ID } from "@saleor/collections/views/consts";
import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import { MetadataFormData } from "@saleor/components/Metadata";
import useForm, {
  CommonUseFormResultWithHandlers,
  FormChange,
  SubmitPromise,
} from "@saleor/hooks/useForm";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import {
  RichTextContext,
  RichTextContextValues,
} from "@saleor/utils/richText/context";
import useRichText from "@saleor/utils/richText/useRichText";
import React, { useEffect } from "react";

export interface CollectionCreateFormData extends MetadataFormData {
  backgroundImage: {
    url: string;
    value: string;
  };
  backgroundImageAlt: string;
  channelListings: ChannelCollectionData[];
  name: string;
  slug: string;
  seoDescription: string;
  seoTitle: string;
}
export interface CollectionCreateData extends CollectionCreateFormData {
  description: OutputData;
}

interface CollectionCreateHandlers {
  changeMetadata: FormChange;
  changeChannels: (
    id: string,
    data: Omit<ChannelCollectionData, "name" | "id">,
  ) => void;
}
export type UseCollectionCreateFormResult = CommonUseFormResultWithHandlers<
  CollectionCreateData,
  CollectionCreateHandlers
>;

export interface CollectionCreateFormProps {
  currentChannels: ChannelCollectionData[];
  setChannels: (data: ChannelCollectionData[]) => void;
  children: (props: UseCollectionCreateFormResult) => React.ReactNode;
  onSubmit: (data: CollectionCreateData) => SubmitPromise;
  disabled: boolean;
}

const getInitialData = (
  currentChannels: ChannelCollectionData[],
): CollectionCreateFormData => ({
  backgroundImage: {
    url: null,
    value: null,
  },
  backgroundImageAlt: "",
  channelListings: currentChannels,
  metadata: [],
  name: "",
  privateMetadata: [],
  seoDescription: "",
  seoTitle: "",
  slug: "",
});

function useCollectionCreateForm(
  currentChannels: ChannelCollectionData[],
  setChannels: (data: ChannelCollectionData[]) => void,
  onSubmit: (data: CollectionCreateData) => SubmitPromise,
  disabled: boolean,
): UseCollectionCreateFormResult & { richText: RichTextContextValues } {
  const {
    handleChange,
    data: formData,
    triggerChange,
    formId,
    setIsSubmitDisabled,
  } = useForm(getInitialData(currentChannels), undefined, {
    confirmLeave: true,
    formId: COLLECTION_CREATE_FORM_ID,
  });

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
  });

  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId,
  });

  const richText = useRichText({
    initial: null,
    triggerChange,
  });

  const {
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();

  const changeMetadata = makeMetadataChangeHandler(handleChange);

  const data: CollectionCreateData = {
    ...formData,
    description: null,
  };

  // Need to make it function to always have description.current up to date
  const getData = async (): Promise<CollectionCreateData> => ({
    ...formData,
    description: await richText.getValue(),
  });

  const handleChannelChange = createChannelsChangeHandler(
    currentChannels,
    setChannels,
    triggerChange,
  );

  const submit = async () => handleFormSubmit(await getData());

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const isSaveDisabled = disabled;
  setIsSubmitDisabled(isSaveDisabled);

  return {
    change: handleChange,
    data,
    handlers: {
      changeChannels: handleChannelChange,
      changeMetadata,
    },
    submit,
    isSaveDisabled,
    richText,
  };
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  currentChannels,
  setChannels,
  children,
  onSubmit,
  disabled,
}) => {
  const { richText, ...props } = useCollectionCreateForm(
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

CollectionCreateForm.displayName = "CollectionCreateForm";
export default CollectionCreateForm;
