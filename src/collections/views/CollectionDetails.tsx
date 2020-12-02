import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import { useChannelsList } from "@saleor/channels/queries";
import {
  createCollectionChannels,
  createCollectionChannelsData
} from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import AssignProductDialog from "@saleor/components/AssignProductDialog";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, PAGINATE_BY } from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useChannels from "@saleor/hooks/useChannels";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { commonMessages } from "@saleor/intl";
import useProductSearch from "@saleor/searches/useProductSearch";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import { diff } from "fast-array-diff";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getMutationState, maybe } from "../../misc";
import { productUrl } from "../../products/urls";
import { CollectionInput } from "../../types/globalTypes";
import CollectionDetailsPage from "../components/CollectionDetailsPage/CollectionDetailsPage";
import { CollectionUpdateData } from "../components/CollectionDetailsPage/form";
import {
  useCollectionAssignProductMutation,
  useCollectionChannelListingUpdate,
  useCollectionRemoveMutation,
  useCollectionUpdateMutation,
  useUnassignCollectionProductMutation
} from "../mutations";
import { TypedCollectionDetailsQuery } from "../queries";
import { CollectionUpdate } from "../types/CollectionUpdate";
import {
  collectionListUrl,
  collectionUrl,
  CollectionUrlDialog,
  CollectionUrlQueryParams
} from "../urls";

interface CollectionDetailsProps {
  id: string;
  params: CollectionUrlQueryParams;
}

export const CollectionDetails: React.FC<CollectionDetailsProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const paginate = usePaginator();
  const intl = useIntl();
  const { search, loadMore, result } = useProductSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    CollectionUrlDialog,
    CollectionUrlQueryParams
  >(navigate, params => collectionUrl(id, params), params);

  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const [
    updateChannels,
    updateChannelsOpts
  ] = useCollectionChannelListingUpdate({});
  const { data: channelsData } = useChannelsList({});

  const handleCollectionUpdate = (data: CollectionUpdate) => {
    if (data.collectionUpdate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(collectionUrl(id));
    } else {
      const backgroundImageError = data.collectionUpdate.errors.find(
        error => error.field === ("backgroundImage" as keyof CollectionInput)
      );
      if (backgroundImageError) {
        notify({
          status: "error",
          text: intl.formatMessage(commonMessages.somethingWentWrong)
        });
      }
    }
  };
  const [updateCollection, updateCollectionOpts] = useCollectionUpdateMutation({
    onCompleted: handleCollectionUpdate
  });

  const [assignProduct, assignProductOpts] = useCollectionAssignProductMutation(
    {
      onCompleted: data => {
        if (data.collectionAddProducts.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage({
              defaultMessage: "Added product to collection"
            })
          });
          navigate(collectionUrl(id), true);
        }
      }
    }
  );

  const [
    unassignProduct,
    unassignProductOpts
  ] = useUnassignCollectionProductMutation({
    onCompleted: data => {
      if (data.collectionRemoveProducts.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Deleted product from collection"
          })
        });
        reset();
        closeModal();
      }
    }
  });

  const [removeCollection, removeCollectionOpts] = useCollectionRemoveMutation({
    onCompleted: data => {
      if (data.collectionDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Deleted collection"
          })
        });
        navigate(collectionListUrl());
      }
    }
  });

  const paginationState = createPaginationState(PAGINATE_BY, params);
  const handleBack = () => navigate(collectionListUrl());

  const [selectedChannel] = useLocalStorage("collectionListChannel", "");

  return (
    <TypedCollectionDetailsQuery
      displayLoader
      variables={{ id, ...paginationState }}
    >
      {({ data, loading }) => {
        const collection = data?.collection;
        if (collection === null) {
          return <NotFoundPage onBack={handleBack} />;
        }
        const allChannels = createCollectionChannels(
          channelsData?.channels
        )?.sort((channel, nextChannel) =>
          channel.name.localeCompare(nextChannel.name)
        );
        const collectionChannelsChoices = createCollectionChannelsData(
          collection
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
          toggleAllChannels
        } = useChannels(collectionChannelsChoices, params?.action, {
          closeModal,
          openModal
        });

        const handleUpdate = async (formData: CollectionUpdateData) => {
          const input: CollectionInput = {
            backgroundImageAlt: formData.backgroundImageAlt,
            descriptionJson: JSON.stringify(formData.description),
            name: formData.name,
            seo: {
              description: formData.seoDescription,
              title: formData.seoTitle
            },
            slug: formData.slug
          };

          const result = await updateCollection({
            variables: {
              id,
              input
            }
          });
          const diffChannels = diff(
            collectionChannelsChoices,
            formData.channelListings,
            (a, b) => a.id === b.id
          );

          updateChannels({
            variables: {
              id: collection.id,
              input: {
                addChannels: formData.channelListings.map(channel => ({
                  channelId: channel.id,
                  isPublished: channel.isPublished,
                  publicationDate: channel.publicationDate
                })),
                removeChannels:
                  diffChannels.removed?.map(
                    removedChannel => removedChannel.id
                  ) || []
              }
            }
          });

          return result.data.collectionUpdate.errors;
        };
        const handleSubmit = createMetadataUpdateHandler(
          data?.collection,
          handleUpdate,
          variables => updateMetadata({ variables }),
          variables => updatePrivateMetadata({ variables })
        );

        const formTransitionState = getMutationState(
          updateCollectionOpts.called,
          updateCollectionOpts.loading,
          updateCollectionOpts.data?.collectionUpdate.errors
        );

        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          data?.collection?.products?.pageInfo,
          paginationState,
          params
        );

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
                  defaultMessage: "Manage Collection Channel Availability"
                })}
                confirmButtonState="default"
                selected={channelListElements.length}
                onConfirm={handleChannelsConfirm}
                toggleAll={toggleAllChannels}
              />
            )}
            <CollectionDetailsPage
              onAdd={() => openModal("assign")}
              onBack={handleBack}
              disabled={loading || updateChannelsOpts.loading}
              collection={data?.collection}
              channelsErrors={
                updateChannelsOpts?.data?.collectionChannelListingUpdate
                  .errors || []
              }
              errors={updateCollectionOpts?.data?.collectionUpdate.errors || []}
              onCollectionRemove={() => openModal("remove")}
              onImageDelete={() => openModal("removeImage")}
              onImageUpload={file =>
                updateCollection({
                  variables: {
                    id,
                    input: {
                      backgroundImage: file
                    }
                  }
                })
              }
              onSubmit={handleSubmit}
              onNextPage={loadNextPage}
              onPreviousPage={loadPreviousPage}
              pageInfo={pageInfo}
              onProductUnassign={(productId, event) => {
                event.stopPropagation();
                unassignProduct({
                  variables: {
                    collectionId: id,
                    productIds: [productId],
                    ...paginationState
                  }
                });
              }}
              onRowClick={id => () => navigate(productUrl(id))}
              saveButtonBarState={formTransitionState}
              toolbar={
                <Button
                  color="primary"
                  onClick={() =>
                    openModal("unassign", {
                      ids: listElements
                    })
                  }
                >
                  <FormattedMessage
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
              hasChannelChanged={
                collectionChannelsChoices?.length !== currentChannels?.length
              }
              channelsCount={channelsData?.channels?.length}
              selectedChannelId={selectedChannel}
              openChannelsModal={handleChannelsModalOpen}
              onChannelsChange={setCurrentChannels}
            />
            <AssignProductDialog
              confirmButtonState={assignProductOpts.status}
              hasMore={result.data?.search?.pageInfo.hasNextPage}
              open={params.action === "assign"}
              onFetch={search}
              onFetchMore={loadMore}
              loading={result.loading}
              onClose={closeModal}
              onSubmit={products =>
                assignProduct({
                  variables: {
                    ...paginationState,
                    collectionId: id,
                    productIds: products.map(product => product.id)
                  }
                })
              }
              products={maybe(() =>
                result.data.search.edges
                  .map(edge => edge.node)
                  .filter(suggestedProduct => suggestedProduct.id)
              )}
            />
            <ActionDialog
              confirmButtonState={removeCollectionOpts.status}
              onClose={closeModal}
              onConfirm={() =>
                removeCollection({
                  variables: { id }
                })
              }
              open={params.action === "remove"}
              title={intl.formatMessage({
                defaultMessage: "Delete Collection",
                description: "dialog title"
              })}
              variant="delete"
            >
              <DialogContentText>
                <FormattedMessage
                  defaultMessage="Are you sure you want to delete {collectionName}?"
                  values={{
                    collectionName: (
                      <strong>
                        {maybe(() => data.collection.name, "...")}
                      </strong>
                    )
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
                    productIds: params.ids
                  }
                })
              }
              open={params.action === "unassign"}
              title={intl.formatMessage({
                defaultMessage: "Unassign products from collection",
                description: "dialog title"
              })}
            >
              <DialogContentText>
                <FormattedMessage
                  defaultMessage="{counter,plural,one{Are you sure you want to unassign this product?} other{Are you sure you want to unassign {displayQuantity} products?}}"
                  values={{
                    counter: maybe(() => params.ids.length),
                    displayQuantity: (
                      <strong>{maybe(() => params.ids.length)}</strong>
                    )
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
                      backgroundImage: null
                    }
                  }
                })
              }
              open={params.action === "removeImage"}
              title={intl.formatMessage({
                defaultMessage: "Delete image",
                description: "dialog title"
              })}
              variant="delete"
            >
              <DialogContentText>
                <FormattedMessage defaultMessage="Are you sure you want to delete collection's image?" />
              </DialogContentText>
            </ActionDialog>
          </>
        );
      }}
    </TypedCollectionDetailsQuery>
  );
};
export default CollectionDetails;
