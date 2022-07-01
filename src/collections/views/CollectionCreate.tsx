import { ChannelsAction } from "@saleor/channels/urls";
import { createCollectionChannels } from "@saleor/channels/utils";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  CollectionCreateInput,
  useCollectionChannelListingUpdateMutation,
  useCreateCollectionMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@saleor/graphql";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { getMutationErrors } from "@saleor/misc";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import { getParsedDataForJsonStringField } from "@saleor/utils/richText/misc";
import React from "react";
import { useIntl } from "react-intl";

import CollectionCreatePage from "../components/CollectionCreatePage/CollectionCreatePage";
import { CollectionCreateData } from "../components/CollectionCreatePage/form";
import {
  collectionAddUrl,
  CollectionCreateUrlQueryParams,
  collectionUrl,
} from "../urls";
import { COLLECTION_CREATE_FORM_ID } from "./consts";

interface CollectionCreateProps {
  params: CollectionCreateUrlQueryParams;
}

export const CollectionCreate: React.FC<CollectionCreateProps> = ({
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelsAction,
    CollectionCreateUrlQueryParams
  >(navigate, params => collectionAddUrl(params), params);

  const [
    updateChannels,
    updateChannelsOpts,
  ] = useCollectionChannelListingUpdateMutation({});
  const { availableChannels } = useAppChannel(false);

  const allChannels = createCollectionChannels(
    availableChannels,
  )?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name),
  );

  const {
    channelListElements,
    channelsToggle,
    currentChannels,
    handleChannelsConfirm,
    handleChannelsModalClose,
    handleChannelsModalOpen,
    isChannelSelected,
    isChannelsModalOpen,
    setCurrentChannels,
    toggleAllChannels,
  } = useChannels(
    allChannels,
    params?.action,
    { closeModal, openModal },
    { formId: COLLECTION_CREATE_FORM_ID },
  );

  const [createCollection, createCollectionOpts] = useCreateCollectionMutation({
    onCompleted: data => {
      if (data.collectionCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate(collectionUrl(data.collectionCreate.collection.id));
      } else {
        const backgroundImageError = data.collectionCreate.errors.find(
          error =>
            error.field === ("backgroundImage" as keyof CollectionCreateInput),
        );
        if (backgroundImageError) {
          notify({
            status: "error",
            text: intl.formatMessage(commonMessages.somethingWentWrong),
          });
        }
      }
    },
  });

  const handleCreate = async (formData: CollectionCreateData) => {
    const result = await createCollection({
      variables: {
        input: {
          backgroundImage: formData.backgroundImage.value,
          backgroundImageAlt: formData.backgroundImageAlt,
          description: getParsedDataForJsonStringField(formData.description),
          name: formData.name,
          seo: {
            description: formData.seoDescription,
            title: formData.seoTitle,
          },
        },
      },
    });

    const id = result.data?.collectionCreate.collection?.id || null;
    if (id) {
      updateChannels({
        variables: {
          id,
          input: {
            addChannels: formData.channelListings.map(channel => ({
              channelId: channel.id,
              isPublished: channel.isPublished,
              publicationDate: channel.publicationDate,
            })),
            removeChannels: [],
          },
        },
      });
    }

    return { id, errors: getMutationErrors(result) };
  };

  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata,
  );

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          id: "ttMauu",
          defaultMessage: "Create collection",
          description: "window title",
        })}
      />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          disabled={!channelListElements.length}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            id: "I1Mz7h",
            defaultMessage: "Manage Collection Channel Availability",
          })}
          confirmButtonState="default"
          selected={channelListElements.length}
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}
      <CollectionCreatePage
        errors={createCollectionOpts.data?.collectionCreate.errors || []}
        channelsErrors={
          updateChannelsOpts?.data?.collectionChannelListingUpdate.errors || []
        }
        currentChannels={currentChannels}
        channelsCount={availableChannels.length}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        disabled={createCollectionOpts.loading || updateChannelsOpts.loading}
        onSubmit={handleSubmit}
        saveButtonBarState={createCollectionOpts.status}
      />
    </>
  );
};
export default CollectionCreate;
