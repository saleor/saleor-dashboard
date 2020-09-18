import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import AssignProductDialog from "@saleor/components/AssignProductDialog";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, PAGINATE_BY } from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
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
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getMutationState, maybe } from "../../misc";
import { productUrl } from "../../products/urls";
import { CollectionInput } from "../../types/globalTypes";
import CollectionDetailsPage, {
  CollectionDetailsPageFormData
} from "../components/CollectionDetailsPage/CollectionDetailsPage";
import {
  useCollectionAssignProductMutation,
  useCollectionRemoveMutation,
  useCollectionUpdateMutation,
  useCollectionUpdateWithHomepageMutation,
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
  const { search, result } = useProductSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

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

  const [
    updateCollectionWithHomepage,
    updateCollectionWithHomepageOpts
  ] = useCollectionUpdateWithHomepageMutation({
    onCompleted: data => {
      if (data.homepageCollectionUpdate.errors.length === 0) {
        handleCollectionUpdate(data);
      }
    }
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

  const [openModal, closeModal] = createDialogActionHandlers<
    CollectionUrlDialog,
    CollectionUrlQueryParams
  >(navigate, params => collectionUrl(id, params), params);

  const paginationState = createPaginationState(PAGINATE_BY, params);
  const handleBack = () => navigate(collectionListUrl());

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

        const handleUpdate = async (
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
            const result = await updateCollectionWithHomepage({
              variables: {
                homepageId: formData.isFeatured ? id : null,
                id,
                input
              }
            });
            return [
              ...result.data.collectionUpdate.errors,
              ...result.data.homepageCollectionUpdate.errors
            ];
          } else {
            const result = await updateCollection({
              variables: {
                id,
                input
              }
            });

            return result.data.collectionUpdate.errors;
          }
        };
        const handleSubmit = createMetadataUpdateHandler(
          data?.collection,
          handleUpdate,
          variables => updateMetadata({ variables }),
          variables => updatePrivateMetadata({ variables })
        );

        const formTransitionState = getMutationState(
          updateCollectionOpts.called ||
            updateCollectionWithHomepageOpts.called,
          updateCollectionOpts.loading ||
            updateCollectionWithHomepageOpts.loading,
          updateCollectionOpts.data?.collectionUpdate.errors,
          updateCollectionWithHomepageOpts.data?.collectionUpdate.errors,
          updateCollectionWithHomepageOpts.data?.homepageCollectionUpdate.errors
        );

        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          data?.collection?.products?.pageInfo,
          paginationState,
          params
        );

        return (
          <>
            <WindowTitle title={maybe(() => data.collection.name)} />
            <CollectionDetailsPage
              onAdd={() => openModal("assign")}
              onBack={handleBack}
              disabled={loading}
              collection={data?.collection}
              errors={updateCollectionOpts?.data?.collectionUpdate.errors || []}
              isFeatured={maybe(
                () => data.shop.homepageCollection.id === data.collection.id,
                false
              )}
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
            />
            <AssignProductDialog
              confirmButtonState={assignProductOpts.status}
              open={params.action === "assign"}
              onFetch={search}
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
