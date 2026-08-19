// @ts-strict-ignore
import { createCollectionChannels, createCollectionChannelsData } from "@dashboard/channels/utils";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import ChannelsAvailabilityDialog from "@dashboard/components/ChannelsAvailabilityDialog";
import { useEntityBackgroundImageUpload } from "@dashboard/components/EntityBackgroundImageField/useEntityBackgroundImageUpload";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import {
  CollectionErrorCode,
  type CollectionInput,
  type CollectionUpdateMutation,
  useCollectionChannelListingUpdateMutation,
  useCollectionDetailsQuery,
  useCollectionUpdateMutation,
  useRemoveCollectionMutation,
} from "@dashboard/graphql";
import useChannels from "@dashboard/hooks/useChannels";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages, errorMessages } from "@dashboard/intl";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { getParsedDataForJsonStringField } from "@dashboard/utils/richText/misc";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { getMutationErrors, getMutationState, maybe } from "../../misc";
import { CollectionDeleteDialog } from "../components/CollectionDeleteDialog/CollectionDeleteDialog";
import { CollectionDeleteImageDialog } from "../components/CollectionDeleteImageDialog/CollectionDeleteImageDialog";
import CollectionDetailsPage from "../components/CollectionDetailsPage/CollectionDetailsPage";
import { type CollectionUpdateData } from "../components/CollectionDetailsPage/form";
import { CollectionMetadataDialog } from "../components/CollectionMetadataDialog/CollectionMetadataDialog";
import {
  collectionListUrl,
  collectionUrl,
  type CollectionUrlDialog,
  type CollectionUrlQueryParams,
} from "../urls";
import { getCollectionChannelsUpdateVariables } from "../utils";
import { COLLECTION_DETAILS_FORM_ID } from "./consts";

interface CollectionDetailsProps {
  id: string;
  params: CollectionUrlQueryParams;
}

const CollectionDetails = ({ id, params }: CollectionDetailsProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [openModal, closeModal] = createDialogActionHandlers<
    CollectionUrlDialog,
    CollectionUrlQueryParams
  >(navigate, params => collectionUrl(id, params), params);
  const [updateChannels, updateChannelsOpts] = useCollectionChannelListingUpdateMutation({});
  const { availableChannels } = useAppChannel(false);
  const channelCurrencies = useMemo(
    () => Object.fromEntries(availableChannels.map(channel => [channel.id, channel.currencyCode])),
    [availableChannels],
  );
  const {
    backgroundImageRevision,
    backgroundImageUploadPreview,
    isBackgroundImageUploading,
    onBackgroundImageUploadPreviewLoaded,
    runImageMutation,
  } = useEntityBackgroundImageUpload();
  const notifyCollectionUpdated = () => {
    notify({
      status: "success",
      text: intl.formatMessage({ id: "E2uiWk", defaultMessage: "Collection updated" }),
    });
  };
  const handleCollectionUpdateSuccess = () => {
    notifyCollectionUpdated();
    navigate(collectionUrl(id));
  };
  const handleCollectionUpdateErrors = (data: CollectionUpdateMutation) => {
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
  };
  const [updateCollection, updateCollectionOpts] = useCollectionUpdateMutation({});

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
  const { data, loading, refetch } = useCollectionDetailsQuery({
    displayLoader: true,
    variables: { id },
  });

  useRegisterEntityRefresh(refetch);

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
    hasChannelSelectionChanged,
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
    { formId: COLLECTION_DETAILS_FORM_ID, deferDirtyOnConfirm: true },
  );
  const handleImmediateCollectionImageMutation = async (
    input: Pick<CollectionInput, "backgroundImage"> &
      Partial<Pick<CollectionInput, "backgroundImageAlt">>,
  ) => {
    const uploadFile = input.backgroundImage instanceof File ? input.backgroundImage : null;

    try {
      await runImageMutation({
        file: uploadFile,
        mutate: async () => {
          const result = await updateCollection({
            variables: {
              id,
              input,
            },
          });
          const errors = getMutationErrors(result);

          if (errors.length === 0) {
            notifyCollectionUpdated();
            closeModal();

            if (uploadFile) {
              await refetch();
            }

            return true;
          }

          if (result.data) {
            handleCollectionUpdateErrors(result.data);
          }

          return false;
        },
      });
    } catch {
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.somethingWentWrong),
      });
    }
  };
  const handleUpdate = async (formData: CollectionUpdateData) => {
    try {
      if (!collection?.id) {
        return [];
      }

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
      const collectionErrors = getMutationErrors(result);

      if (collectionErrors.length > 0) {
        if (result.data) {
          handleCollectionUpdateErrors(result.data);
        }

        return collectionErrors;
      }

      const channelUpdateVariables = getCollectionChannelsUpdateVariables(
        collection.id,
        collectionChannelsChoices,
        formData.channelListings,
      );
      let channelErrors = [];

      if (channelUpdateVariables) {
        const channelResult = await updateChannels({
          variables: channelUpdateVariables,
        });

        channelErrors = channelResult.data?.collectionChannelListingUpdate?.errors ?? [];
      }

      const errors = [...collectionErrors, ...channelErrors];

      if (errors.length === 0) {
        handleCollectionUpdateSuccess();

        const refetchResult = await refetch();

        // Keep local channel draft aligned with the server payload so scheduled
        // publishedAt serialization differences cannot leave the form dirty.
        setCurrentChannels(createCollectionChannelsData(refetchResult.data?.collection));
      }

      return errors;
    } catch {
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.somethingWentWrong),
      });

      return [
        {
          __typename: "CollectionError",
          code: CollectionErrorCode.GRAPHQL_ERROR,
          field: null,
          message: intl.formatMessage(commonMessages.somethingWentWrong),
        },
      ];
    }
  };
  const saveErrors = [
    ...(updateCollectionOpts.data?.collectionUpdate.errors ?? []),
    ...(updateChannelsOpts.data?.collectionChannelListingUpdate.errors ?? []),
  ];
  const formTransitionState = getMutationState(
    updateCollectionOpts.called || updateChannelsOpts.called,
    updateCollectionOpts.loading || updateChannelsOpts.loading,
    saveErrors,
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
          hasSelectionChanged={hasChannelSelectionChanged}
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}
      <CollectionDetailsPage
        disabled={loading || updateChannelsOpts.loading}
        collection={data?.collection}
        backgroundImageRevision={backgroundImageRevision}
        backgroundImageUploadPreview={backgroundImageUploadPreview}
        isBackgroundImageUploading={isBackgroundImageUploading}
        onBackgroundImageUploadPreviewLoaded={onBackgroundImageUploadPreviewLoaded}
        channelsErrors={updateChannelsOpts?.data?.collectionChannelListingUpdate.errors || []}
        errors={updateCollectionOpts?.data?.collectionUpdate.errors || []}
        onCollectionRemove={() => openModal("remove")}
        onImageDelete={() => openModal("removeImage")}
        onImageUpload={file => handleImmediateCollectionImageMutation({ backgroundImage: file })}
        onSubmit={handleUpdate}
        saveButtonBarState={formTransitionState}
        currentChannels={currentChannels}
        savedChannelListings={collectionChannelsChoices}
        channelsCount={availableChannels.length}
        channelCurrencies={channelCurrencies}
        selectedChannelId={selectedChannel}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        onShowMetadata={() => openModal("view-metadata")}
        params={params}
      />

      <CollectionMetadataDialog
        open={params.action === "view-metadata" && !!collection}
        onClose={closeModal}
        collection={collection}
      />

      <CollectionDeleteDialog
        collectionName={<strong>{maybe(() => data.collection.name, "...")}</strong>}
        confirmButtonState={removeCollectionOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          removeCollection({
            variables: { id },
          })
        }
        open={params.action === "remove"}
      />

      <CollectionDeleteImageDialog
        confirmButtonState={updateCollectionOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          handleImmediateCollectionImageMutation({
            backgroundImage: null,
            backgroundImageAlt: "",
          })
        }
        open={params.action === "removeImage"}
      />
    </>
  );
};

export default CollectionDetails;
