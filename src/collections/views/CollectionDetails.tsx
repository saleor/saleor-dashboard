// @ts-strict-ignore
import { createCollectionChannels, createCollectionChannelsData } from "@dashboard/channels/utils";
import ActionDialog from "@dashboard/components/ActionDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import ChannelsAvailabilityDialog from "@dashboard/components/ChannelsAvailabilityDialog";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  CollectionInput,
  CollectionUpdateMutation,
  useCollectionChannelListingUpdateMutation,
  useCollectionDetailsQuery,
  useCollectionUpdateMutation,
  useRemoveCollectionMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useChannels from "@dashboard/hooks/useChannels";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages, errorMessages } from "@dashboard/intl";
import { arrayDiff } from "@dashboard/utils/arrays";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { getParsedDataForJsonStringField } from "@dashboard/utils/richText/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getMutationErrors, getMutationState, maybe } from "../../misc";
import CollectionDetailsPage from "../components/CollectionDetailsPage/CollectionDetailsPage";
import { CollectionUpdateData } from "../components/CollectionDetailsPage/form";
import {
  collectionListUrl,
  collectionUrl,
  CollectionUrlDialog,
  CollectionUrlQueryParams,
} from "../urls";
import { COLLECTION_DETAILS_FORM_ID } from "./consts";

interface CollectionDetailsProps {
  id: string;
  params: CollectionUrlQueryParams;
}

export const CollectionDetails: React.FC<CollectionDetailsProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [openModal, closeModal] = createDialogActionHandlers<
    CollectionUrlDialog,
    CollectionUrlQueryParams
  >(navigate, params => collectionUrl(id, params), params);
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const [updateChannels, updateChannelsOpts] = useCollectionChannelListingUpdateMutation({});
  const { availableChannels } = useAppChannel(false);
  const handleCollectionUpdate = (data: CollectionUpdateMutation) => {
    if (data.collectionUpdate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
      navigate(collectionUrl(id));
    } else {
      const backgroundImageError = data.collectionUpdate.errors.find(
        error => error.field === ("backgroundImage" as keyof CollectionInput),
      );

      if (backgroundImageError) {
        notify({
          status: "error",
          title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
          text: intl.formatMessage(errorMessages.imageUploadErrorText),
        });
      }
    }
  };
  const [updateCollection, updateCollectionOpts] = useCollectionUpdateMutation({
    onCompleted: handleCollectionUpdate,
  });

  const [removeCollection, removeCollectionOpts] = useRemoveCollectionMutation({
    onCompleted: data => {
      if (data.collectionDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "Q8wHwJ",
            defaultMessage: "Deleted collection",
          }),
        });
        navigate(collectionListUrl());
      }
    },
  });

  const [selectedChannel] = useLocalStorage("collectionListChannel", "");
  const { data, loading } = useCollectionDetailsQuery({
    displayLoader: true,
    variables: { id },
  });

  const collection = data?.collection;
  const allChannels = createCollectionChannels(availableChannels)?.sort((channel, nextChannel) =>
    channel.name.localeCompare(nextChannel.name),
  );
  const collectionChannelsChoices = createCollectionChannelsData(collection);
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
    collectionChannelsChoices,
    params?.action,
    {
      closeModal,
      openModal,
    },
    { formId: COLLECTION_DETAILS_FORM_ID },
  );
  const handleUpdate = async (formData: CollectionUpdateData) => {
    const input: CollectionInput = {
      backgroundImageAlt: formData.backgroundImageAlt,
      description: getParsedDataForJsonStringField(formData.description),
      name: formData.name,
      seo: {
        description: formData.seoDescription,
        title: formData.seoTitle,
      },
      slug: formData.slug,
    };
    const result = await updateCollection({
      variables: {
        id,
        input,
      },
    });
    const initialIds = collectionChannelsChoices.map(channel => channel.id);
    const modifiedIds = formData.channelListings.map(channel => channel.id);
    const idsDiff = arrayDiff(initialIds, modifiedIds);

    updateChannels({
      variables: {
        id: collection.id,
        input: {
          addChannels: formData.channelListings.map(channel => ({
            channelId: channel.id,
            isPublished: channel.isPublished,
            publishedAt: channel.publishedAt,
          })),
          removeChannels: idsDiff.removed,
        },
      },
    });

    return getMutationErrors(result);
  };
  const handleSubmit = createMetadataUpdateHandler(
    data?.collection,
    handleUpdate,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );

  const formTransitionState = getMutationState(
    updateCollectionOpts.called,
    updateCollectionOpts.loading,
    updateCollectionOpts.data?.collectionUpdate.errors,
  );

  if (collection === null) {
    return <NotFoundPage backHref={collectionListUrl()} />;
  }

  return (
    <>
      <WindowTitle title={data?.collection?.name} />
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
      <CollectionDetailsPage
        disabled={loading || updateChannelsOpts.loading}
        collection={data?.collection}
        channelsErrors={updateChannelsOpts?.data?.collectionChannelListingUpdate.errors || []}
        errors={updateCollectionOpts?.data?.collectionUpdate.errors || []}
        onCollectionRemove={() => openModal("remove")}
        onImageDelete={() => openModal("removeImage")}
        onImageUpload={file =>
          updateCollection({
            variables: {
              id,
              input: {
                backgroundImage: file,
              },
            },
          })
        }
        onSubmit={handleSubmit}
        saveButtonBarState={formTransitionState}
        currentChannels={currentChannels}
        channelsCount={availableChannels.length}
        selectedChannelId={selectedChannel}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        params={params}
      />

      <ActionDialog
        confirmButtonState={removeCollectionOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          removeCollection({
            variables: { id },
          })
        }
        open={params.action === "remove"}
        title={intl.formatMessage({
          id: "+wpvnk",
          defaultMessage: "Delete Collection",
          description: "dialog title",
        })}
        variant="delete"
      >
        <FormattedMessage
          id="pVFoOk"
          defaultMessage="Are you sure you want to delete {collectionName}?"
          values={{
            collectionName: <strong>{maybe(() => data.collection.name, "...")}</strong>,
          }}
        />
      </ActionDialog>

      <ActionDialog
        confirmButtonState={updateCollectionOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          updateCollection({
            variables: {
              id,
              input: {
                backgroundImage: null,
              },
            },
          })
        }
        open={params.action === "removeImage"}
        title={intl.formatMessage({
          id: "fzk04H",
          defaultMessage: "Delete image",
          description: "dialog title",
        })}
        variant="delete"
      >
        <FormattedMessage
          id="MxhVZv"
          defaultMessage="Are you sure you want to delete collection's image?"
        />
      </ActionDialog>
    </>
  );
};
export default CollectionDetails;
