// @ts-strict-ignore
import { ChannelsAction } from "@dashboard/channels/urls";
import { createCollectionChannels } from "@dashboard/channels/utils";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import ChannelsAvailabilityDialog from "@dashboard/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  CollectionCreateInput,
  useCollectionChannelListingUpdateMutation,
  useCreateCollectionMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useChannels from "@dashboard/hooks/useChannels";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { getMutationErrors } from "@dashboard/misc";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@dashboard/utils/handlers/metadataCreateHandler";
import { getParsedDataForJsonStringField } from "@dashboard/utils/richText/misc";
import React from "react";
import { useIntl } from "react-intl";

import CollectionCreatePage from "../components/CollectionCreatePage/CollectionCreatePage";
import { CollectionCreateData } from "../components/CollectionCreatePage/form";
import { collectionAddUrl, CollectionCreateUrlQueryParams, collectionUrl } from "../urls";
import { COLLECTION_CREATE_FORM_ID } from "./consts";

interface CollectionCreateProps {
  params: CollectionCreateUrlQueryParams;
}

export const CollectionCreate: React.FC<CollectionCreateProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelsAction,
    CollectionCreateUrlQueryParams
  >(navigate, params => collectionAddUrl(params), params);
  const [updateChannels, updateChannelsOpts] = useCollectionChannelListingUpdateMutation({});
  const { availableChannels } = useAppChannel(false);
  const allChannels = createCollectionChannels(availableChannels)?.sort((channel, nextChannel) =>
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
  const [createCollection, createCollectionOpts] = useCreateCollectionMutation({});
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
      await updateChannels({
        variables: {
          id,
          input: {
            addChannels: formData.channelListings.map(channel => ({
              channelId: channel.id,
              isPublished: channel.isPublished,
              publishedAt: channel.publishedAt,
            })),
            removeChannels: [],
          },
        },
      });
    }

    if (result.data.collectionCreate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
      navigate(collectionUrl(id));
    } else {
      const backgroundImageError = result.data.collectionCreate.errors.find(
        error => error.field === ("backgroundImage" as keyof CollectionCreateInput),
      );

      if (backgroundImageError) {
        notify({
          status: "error",
          text: intl.formatMessage(commonMessages.somethingWentWrong),
        });
      }
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
        channelsErrors={updateChannelsOpts?.data?.collectionChannelListingUpdate.errors || []}
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
