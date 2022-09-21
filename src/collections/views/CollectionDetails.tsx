import { DialogContentText } from "@material-ui/core";
import {
  createCollectionChannels,
  createCollectionChannelsData,
} from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import AssignProductDialog from "@saleor/components/AssignProductDialog";
import { Button } from "@saleor/components/Button";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, PAGINATE_BY } from "@saleor/config";
import {
  CollectionInput,
  CollectionUpdateMutation,
  useCollectionAssignProductMutation,
  useCollectionChannelListingUpdateMutation,
  useCollectionDetailsQuery,
  useCollectionUpdateMutation,
  useRemoveCollectionMutation,
  useUnassignCollectionProductMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@saleor/graphql";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useChannels from "@saleor/hooks/useChannels";
import useLocalPaginator, {
  useLocalPaginationState,
} from "@saleor/hooks/useLocalPaginator";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { PaginatorContext } from "@saleor/hooks/usePaginator";
import { commonMessages, errorMessages } from "@saleor/intl";
import useProductSearch from "@saleor/searches/useProductSearch";
import { arrayDiff } from "@saleor/utils/arrays";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { getParsedDataForJsonStringField } from "@saleor/utils/richText/misc";
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
import { getAssignedProductIdsToCollection } from "../utils";
import { COLLECTION_DETAILS_FORM_ID } from "./consts";

interface CollectionDetailsProps {
  id: string;
  params: CollectionUrlQueryParams;
}

export const CollectionDetails: React.FC<CollectionDetailsProps> = ({
  id,
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids,
  );
  const intl = useIntl();
  const { search, loadMore, result } = useProductSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    CollectionUrlDialog,
    CollectionUrlQueryParams
  >(navigate, params => collectionUrl(id, params), params);

  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

  const [
    updateChannels,
    updateChannelsOpts,
  ] = useCollectionChannelListingUpdateMutation({});
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

  const [assignProduct, assignProductOpts] = useCollectionAssignProductMutation(
    {
      onCompleted: data => {
        if (data.collectionAddProducts.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage({
              id: "56vUeQ",
              defaultMessage: "Added product to collection",
            }),
          });
          navigate(collectionUrl(id), { replace: true });
        }
      },
    },
  );

  const [
    unassignProduct,
    unassignProductOpts,
  ] = useUnassignCollectionProductMutation({
    onCompleted: data => {
      if (data.collectionRemoveProducts.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "WW+Ruy",
            defaultMessage: "Deleted product from collection",
          }),
        });
        reset();
        closeModal();
      }
    },
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

  const [paginationState, setPaginationState] = useLocalPaginationState(
    PAGINATE_BY,
  );
  const paginate = useLocalPaginator(setPaginationState);

  const [selectedChannel] = useLocalStorage("collectionListChannel", "");

  const { data, loading } = useCollectionDetailsQuery({
    displayLoader: true,
    variables: { id, ...paginationState },
  });

  const collection = data?.collection;
  const allChannels = createCollectionChannels(
    availableChannels,
  )?.sort((channel, nextChannel) =>
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
            publicationDate: channel.publicationDate,
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

  const handleAssignationChange = async products => {
    const toUnassignIds = Object.keys(assignedProductDict).filter(
      s => assignedProductDict[s] && !products.includes(s),
    );

    const baseVariables = { ...paginationState, collectionId: id };

    if (products.length > 0) {
      await assignProduct({
        variables: { ...baseVariables, productIds: products },
      });
    }

    if (toUnassignIds.length > 0) {
      await unassignProduct({
        variables: { ...baseVariables, productIds: toUnassignIds },
      });
    }

    await result.refetch(DEFAULT_INITIAL_SEARCH_DATA);
  };

  const formTransitionState = getMutationState(
    updateCollectionOpts.called,
    updateCollectionOpts.loading,
    updateCollectionOpts.data?.collectionUpdate.errors,
  );

  const { pageInfo, ...paginationValues } = paginate(
    data?.collection?.products?.pageInfo,
    paginationState,
  );

  if (collection === null) {
    return <NotFoundPage backHref={collectionListUrl()} />;
  }

  const assignedProductDict = getAssignedProductIdsToCollection(
    collection,
    result.data?.search,
  );

  return (
    <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
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
        onAdd={() => openModal("assign")}
        disabled={loading || updateChannelsOpts.loading}
        collection={data?.collection}
        channelsErrors={
          updateChannelsOpts?.data?.collectionChannelListingUpdate.errors || []
        }
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
        onProductUnassign={async (productId, event) => {
          event.stopPropagation();
          await unassignProduct({
            variables: {
              collectionId: id,
              productIds: [productId],
              ...paginationState,
            },
          });

          await result.refetch(DEFAULT_INITIAL_SEARCH_DATA);
        }}
        saveButtonBarState={formTransitionState}
        toolbar={
          <Button
            onClick={() =>
              openModal("unassign", {
                ids: listElements,
              })
            }
          >
            <FormattedMessage
              id="67V0c0"
              defaultMessage="Unassign"
              description="unassign product from collection, button"
            />
          </Button>
        }
        isChecked={isSelected}
        selected={listElements.length}
        toggle={toggle}
        toggleAll={toggleAll}
        currentChannels={currentChannels}
        channelsCount={availableChannels.length}
        selectedChannelId={selectedChannel}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
      />
      <AssignProductDialog
        selectedIds={assignedProductDict}
        confirmButtonState={assignProductOpts.status}
        hasMore={result.data?.search?.pageInfo.hasNextPage}
        open={params.action === "assign"}
        onFetch={search}
        onFetchMore={loadMore}
        loading={result.loading}
        onClose={closeModal}
        onSubmit={handleAssignationChange}
        products={mapEdgesToItems(result?.data?.search)?.filter(
          suggestedProduct => suggestedProduct.id,
        )}
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
        <DialogContentText>
          <FormattedMessage
            id="pVFoOk"
            defaultMessage="Are you sure you want to delete {collectionName}?"
            values={{
              collectionName: (
                <strong>{maybe(() => data.collection.name, "...")}</strong>
              ),
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ActionDialog
        confirmButtonState={unassignProductOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          unassignProduct({
            variables: {
              ...paginationState,
              collectionId: id,
              productIds: params.ids,
            },
          })
        }
        open={params.action === "unassign"}
        title={intl.formatMessage({
          id: "5OtU+V",
          defaultMessage: "Unassign products from collection",
          description: "dialog title",
        })}
      >
        <DialogContentText>
          <FormattedMessage
            id="AulH/n"
            defaultMessage="{counter,plural,one{Are you sure you want to unassign this product?} other{Are you sure you want to unassign {displayQuantity} products?}}"
            values={{
              counter: maybe(() => params.ids.length),
              displayQuantity: (
                <strong>{maybe(() => params.ids.length)}</strong>
              ),
            }}
          />
        </DialogContentText>
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
        <DialogContentText>
          <FormattedMessage
            id="MxhVZv"
            defaultMessage="Are you sure you want to delete collection's image?"
          />
        </DialogContentText>
      </ActionDialog>
    </PaginatorContext.Provider>
  );
};
export default CollectionDetails;
