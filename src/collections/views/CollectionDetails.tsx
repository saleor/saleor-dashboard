import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import AssignProductDialog from "@saleor/components/AssignProductDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { commonMessages } from "@saleor/intl";
import { DEFAULT_INITIAL_SEARCH_DATA, PAGINATE_BY } from "../../config";
import SearchProducts from "../../containers/SearchProducts";
import { getMutationState, maybe } from "../../misc";
import { productUrl } from "../../products/urls";
import { CollectionInput } from "../../types/globalTypes";
import CollectionDetailsPage, {
  CollectionDetailsPageFormData
} from "../components/CollectionDetailsPage/CollectionDetailsPage";
import CollectionOperations from "../containers/CollectionOperations";
import { TypedCollectionDetailsQuery } from "../queries";
import { CollectionAssignProduct } from "../types/CollectionAssignProduct";
import { CollectionUpdate } from "../types/CollectionUpdate";
import { RemoveCollection } from "../types/RemoveCollection";
import { UnassignCollectionProduct } from "../types/UnassignCollectionProduct";
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

export const CollectionDetails: React.StatelessComponent<
  CollectionDetailsProps
> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const paginate = usePaginator();
  const intl = useIntl();

  const closeModal = () =>
    navigate(
      collectionUrl(id, {
        ...params,
        action: undefined
      }),
      true
    );
  const openModal = (action: CollectionUrlDialog) =>
    navigate(
      collectionUrl(id, {
        ...params,
        action
      }),
      false
    );

  const paginationState = createPaginationState(PAGINATE_BY, params);

  return (
    <TypedCollectionDetailsQuery
      displayLoader
      variables={{ id, ...paginationState }}
      require={["collection"]}
    >
      {({ data, loading }) => {
        const handleCollectionUpdate = (data: CollectionUpdate) => {
          if (data.collectionUpdate.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            navigate(collectionUrl(id));
          } else {
            const backgroundImageError = data.collectionUpdate.errors.find(
              error =>
                error.field === ("backgroundImage" as keyof CollectionInput)
            );
            if (backgroundImageError) {
              notify({
                text: backgroundImageError.message
              });
            }
          }
        };

        const handleProductAssign = (data: CollectionAssignProduct) => {
          if (data.collectionAddProducts.errors.length === 0) {
            notify({
              text: intl.formatMessage({
                defaultMessage: "Added product to collection"
              })
            });
            navigate(collectionUrl(id), true);
          }
        };

        const handleProductUnassign = (data: UnassignCollectionProduct) => {
          if (data.collectionRemoveProducts.errors.length === 0) {
            notify({
              text: intl.formatMessage({
                defaultMessage: "Deleted product from collection"
              })
            });
            reset();
            closeModal();
          }
        };

        const handleCollectionRemove = (data: RemoveCollection) => {
          if (data.collectionDelete.errors.length === 0) {
            notify({
              text: intl.formatMessage({
                defaultMessage: "Deleted collection"
              })
            });
            navigate(collectionListUrl());
          }
        };
        return (
          <CollectionOperations
            onUpdate={handleCollectionUpdate}
            onProductAssign={handleProductAssign}
            onProductUnassign={handleProductUnassign}
            onRemove={handleCollectionRemove}
          >
            {({
              updateCollection,
              updateCollectionWithHomepage,
              assignProduct,
              unassignProduct,
              removeCollection
            }) => {
              const handleSubmit = (
                formData: CollectionDetailsPageFormData
              ) => {
                const input: CollectionInput = {
                  backgroundImageAlt: formData.backgroundImageAlt,
                  descriptionJson: JSON.stringify(formData.description),
                  isPublished: formData.isPublished,
                  name: formData.name,
                  publicationDate: formData.publicationDate,
                  seo: {
                    description: formData.seoDescription,
                    title: formData.seoTitle
                  }
                };
                const isFeatured = data.shop.homepageCollection
                  ? data.shop.homepageCollection.id === data.collection.id
                  : false;

                if (formData.isFeatured !== isFeatured) {
                  updateCollectionWithHomepage.mutate({
                    homepageId: formData.isFeatured ? id : null,
                    id,
                    input
                  });
                } else {
                  updateCollection.mutate({
                    id,
                    input
                  });
                }
              };

              const formTransitionState = getMutationState(
                updateCollection.opts.called ||
                  updateCollectionWithHomepage.opts.called,
                updateCollection.opts.loading ||
                  updateCollectionWithHomepage.opts.loading,
                maybe(() => updateCollection.opts.data.collectionUpdate.errors),
                maybe(
                  () =>
                    updateCollectionWithHomepage.opts.data.collectionUpdate
                      .errors
                ),
                maybe(
                  () =>
                    updateCollectionWithHomepage.opts.data
                      .homepageCollectionUpdate.errors
                )
              );
              const assignTransitionState = getMutationState(
                assignProduct.opts.called,
                assignProduct.opts.loading,
                maybe(
                  () => assignProduct.opts.data.collectionAddProducts.errors
                )
              );
              const unassignTransitionState = getMutationState(
                unassignProduct.opts.called,
                unassignProduct.opts.loading,
                maybe(
                  () =>
                    unassignProduct.opts.data.collectionRemoveProducts.errors
                )
              );
              const removeTransitionState = getMutationState(
                removeCollection.opts.called,
                removeCollection.opts.loading,
                maybe(() => removeCollection.opts.data.collectionDelete.errors)
              );
              const imageRemoveTransitionState = getMutationState(
                updateCollection.opts.called,
                updateCollection.opts.loading,
                maybe(() => updateCollection.opts.data.collectionUpdate.errors)
              );

              const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
                maybe(() => data.collection.products.pageInfo),
                paginationState,
                params
              );

              return (
                <>
                  <WindowTitle title={maybe(() => data.collection.name)} />
                  <CollectionDetailsPage
                    onAdd={() => openModal("assign")}
                    onBack={() => navigate(collectionListUrl())}
                    disabled={loading}
                    collection={data.collection}
                    isFeatured={maybe(
                      () =>
                        data.shop.homepageCollection.id === data.collection.id,
                      false
                    )}
                    onCollectionRemove={() => openModal("remove")}
                    onImageDelete={() => openModal("removeImage")}
                    onImageUpload={file =>
                      updateCollection.mutate({
                        id,
                        input: {
                          backgroundImage: file
                        }
                      })
                    }
                    onSubmit={handleSubmit}
                    onNextPage={loadNextPage}
                    onPreviousPage={loadPreviousPage}
                    pageInfo={pageInfo}
                    onProductUnassign={(productId, event) => {
                      event.stopPropagation();
                      unassignProduct.mutate({
                        collectionId: id,
                        productIds: [productId],
                        ...paginationState
                      });
                    }}
                    onRowClick={id => () => navigate(productUrl(id))}
                    saveButtonBarState={formTransitionState}
                    toolbar={
                      <Button
                        color="primary"
                        onClick={() =>
                          navigate(
                            collectionUrl(id, {
                              action: "unassign",
                              ids: listElements
                            })
                          )
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
                  />
                  <SearchProducts variables={DEFAULT_INITIAL_SEARCH_DATA}>
                    {({ search, result }) => (
                      <AssignProductDialog
                        confirmButtonState={assignTransitionState}
                        open={params.action === "assign"}
                        onFetch={search}
                        loading={result.loading}
                        onClose={closeModal}
                        onSubmit={products =>
                          assignProduct.mutate({
                            ...paginationState,
                            collectionId: id,
                            productIds: products.map(product => product.id)
                          })
                        }
                        products={maybe(() =>
                          result.data.search.edges
                            .map(edge => edge.node)
                            .filter(suggestedProduct => suggestedProduct.id)
                        )}
                      />
                    )}
                  </SearchProducts>
                  <ActionDialog
                    confirmButtonState={removeTransitionState}
                    onClose={closeModal}
                    onConfirm={() => removeCollection.mutate({ id })}
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
                    confirmButtonState={unassignTransitionState}
                    onClose={closeModal}
                    onConfirm={() =>
                      unassignProduct.mutate({
                        ...paginationState,
                        collectionId: id,
                        productIds: params.ids
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
                        defaultMessage="Are you sure you want to unassign {counter, plural,
                          one {this product}
                          other {{displayQuantity} products}
                        }?"
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
                    confirmButtonState={imageRemoveTransitionState}
                    onClose={closeModal}
                    onConfirm={() =>
                      updateCollection.mutate({
                        id,
                        input: {
                          backgroundImage: null
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
          </CollectionOperations>
        );
      }}
    </TypedCollectionDetailsQuery>
  );
};
export default CollectionDetails;
