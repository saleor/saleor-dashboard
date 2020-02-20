import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import placeholderImg from "@assets/images/placeholder255x255.png";
import ActionDialog from "@saleor/components/ActionDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import ProductVariantCreateDialog from "@saleor/products/components/ProductVariantCreateDialog/ProductVariantCreateDialog";
import { ProductVariantBulkCreate } from "@saleor/products/types/ProductVariantBulkCreate";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { getMutationState, maybe } from "../../../misc";
import ProductUpdatePage from "../../components/ProductUpdatePage";
import ProductUpdateOperations from "../../containers/ProductUpdateOperations";
import { TypedProductDetailsQuery } from "../../queries";
import {
  ProductImageCreate,
  ProductImageCreateVariables
} from "../../types/ProductImageCreate";
import { ProductUpdate as ProductUpdateMutationResult } from "../../types/ProductUpdate";
import { ProductVariantBulkDelete } from "../../types/ProductVariantBulkDelete";
import {
  productImageUrl,
  productListUrl,
  productUrl,
  ProductUrlQueryParams,
  productVariantAddUrl,
  productVariantEditUrl,
  ProductUrlDialog
} from "../../urls";
import {
  createImageReorderHandler,
  createImageUploadHandler,
  createUpdateHandler
} from "./handlers";

interface ProductUpdateProps {
  id: string;
  params: ProductUrlQueryParams;
}

export const ProductUpdate: React.FC<ProductUpdateProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const intl = useIntl();
  const shop = useShop();
  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts
  } = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const {
    loadMore: loadMoreCollections,
    search: searchCollections,
    result: searchCollectionsOpts
  } = useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    ProductUrlDialog,
    ProductUrlQueryParams
  >(navigate, params => productUrl(id, params), params);

  const handleBack = () => navigate(productListUrl());

  return (
    <TypedProductDetailsQuery displayLoader variables={{ id }}>
      {({ data, loading, refetch }) => {
        const product = data?.product;

        if (product === null) {
          return <NotFoundPage onBack={handleBack} />;
        }

        const handleDelete = () => {
          notify({
            text: intl.formatMessage({
              defaultMessage: "Product removed"
            })
          });
          navigate(productListUrl());
        };
        const handleUpdate = (data: ProductUpdateMutationResult) => {
          if (data.productUpdate.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
          } else {
            const attributeError = data.productUpdate.errors.find(
              err => err.field === "attributes"
            );
            if (!!attributeError) {
              notify({ text: attributeError.message });
            }
          }
        };

        const handleImageCreate = (data: ProductImageCreate) => {
          const imageError = data.productImageCreate.errors.find(
            error =>
              error.field === ("image" as keyof ProductImageCreateVariables)
          );
          if (imageError) {
            notify({
              text: imageError.message
            });
          }
        };
        const handleImageDeleteSuccess = () =>
          notify({
            text: intl.formatMessage(commonMessages.savedChanges)
          });
        const handleVariantAdd = () => navigate(productVariantAddUrl(id));

        const handleBulkProductVariantCreate = (
          data: ProductVariantBulkCreate
        ) => {
          if (data.productVariantBulkCreate.errors.length === 0) {
            closeModal();
            refetch();
          }
        };

        const handleBulkProductVariantDelete = (
          data: ProductVariantBulkDelete
        ) => {
          if (data.productVariantBulkDelete.errors.length === 0) {
            closeModal();
            reset();
            refetch();
          }
        };

        return (
          <ProductUpdateOperations
            product={product}
            onBulkProductVariantCreate={handleBulkProductVariantCreate}
            onBulkProductVariantDelete={handleBulkProductVariantDelete}
            onDelete={handleDelete}
            onImageCreate={handleImageCreate}
            onImageDelete={handleImageDeleteSuccess}
            onUpdate={handleUpdate}
          >
            {({
              bulkProductVariantCreate,
              bulkProductVariantDelete,
              createProductImage,
              deleteProduct,
              deleteProductImage,
              reorderProductImages,
              updateProduct,
              updateSimpleProduct
            }) => {
              const handleImageDelete = (id: string) => () =>
                deleteProductImage.mutate({ id });
              const handleImageEdit = (imageId: string) => () =>
                navigate(productImageUrl(id, imageId));
              const handleSubmit = createUpdateHandler(
                product,
                updateProduct.mutate,
                updateSimpleProduct.mutate
              );
              const handleImageUpload = createImageUploadHandler(
                id,
                createProductImage.mutate
              );
              const handleImageReorder = createImageReorderHandler(
                product,
                reorderProductImages.mutate
              );

              const disableFormSave =
                createProductImage.opts.loading ||
                deleteProduct.opts.loading ||
                reorderProductImages.opts.loading ||
                updateProduct.opts.loading ||
                loading;
              const formTransitionState = getMutationState(
                updateProduct.opts.called || updateSimpleProduct.opts.called,
                updateProduct.opts.loading || updateSimpleProduct.opts.loading,
                maybe(() => updateProduct.opts.data.productUpdate.errors),
                maybe(() => updateSimpleProduct.opts.data.productUpdate.errors),
                maybe(
                  () =>
                    updateSimpleProduct.opts.data.productVariantUpdate.errors
                )
              );

              const categories = maybe(
                () => searchCategoriesOpts.data.search.edges,
                []
              ).map(edge => edge.node);
              const collections = maybe(
                () => searchCollectionsOpts.data.search.edges,
                []
              ).map(edge => edge.node);
              const errors = [
                ...maybe(
                  () => updateProduct.opts.data.productUpdate.errors,
                  []
                ),
                ...maybe(
                  () => updateSimpleProduct.opts.data.productUpdate.errors,
                  []
                )
              ];

              return (
                <>
                  <WindowTitle title={maybe(() => data.product.name)} />
                  <ProductUpdatePage
                    categories={categories}
                    collections={collections}
                    disabled={disableFormSave}
                    errors={errors}
                    fetchCategories={searchCategories}
                    fetchCollections={searchCollections}
                    saveButtonBarState={formTransitionState}
                    images={maybe(() => data.product.images)}
                    header={maybe(() => product.name)}
                    placeholderImage={placeholderImg}
                    product={product}
                    variants={maybe(() => product.variants)}
                    onBack={handleBack}
                    onDelete={() => openModal("remove")}
                    onProductShow={() => {
                      if (product) {
                        window.open(product.url);
                      }
                    }}
                    onImageReorder={handleImageReorder}
                    onSubmit={handleSubmit}
                    onVariantAdd={handleVariantAdd}
                    onVariantsAdd={() => openModal("create-variants")}
                    onVariantShow={variantId => () =>
                      navigate(productVariantEditUrl(product.id, variantId))}
                    onImageUpload={handleImageUpload}
                    onImageEdit={handleImageEdit}
                    onImageDelete={handleImageDelete}
                    toolbar={
                      <IconButton
                        color="primary"
                        onClick={() =>
                          openModal("remove-variants", {
                            ids: listElements
                          })
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                    isChecked={isSelected}
                    selected={listElements.length}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    fetchMoreCategories={{
                      hasMore: maybe(
                        () =>
                          searchCategoriesOpts.data.search.pageInfo.hasNextPage
                      ),
                      loading: searchCategoriesOpts.loading,
                      onFetchMore: loadMoreCategories
                    }}
                    fetchMoreCollections={{
                      hasMore: maybe(
                        () =>
                          searchCollectionsOpts.data.search.pageInfo.hasNextPage
                      ),
                      loading: searchCollectionsOpts.loading,
                      onFetchMore: loadMoreCollections
                    }}
                  />
                  <ActionDialog
                    open={params.action === "remove"}
                    onClose={closeModal}
                    confirmButtonState={deleteProduct.opts.status}
                    onConfirm={() => deleteProduct.mutate({ id })}
                    variant="delete"
                    title={intl.formatMessage({
                      defaultMessage: "Delete Product",
                      description: "dialog header"
                    })}
                  >
                    <DialogContentText>
                      <FormattedMessage
                        defaultMessage="Are you sure you want to delete {name}?"
                        description="delete product"
                        values={{
                          name: product ? product.name : undefined
                        }}
                      />
                    </DialogContentText>
                  </ActionDialog>
                  <ActionDialog
                    open={params.action === "remove-variants"}
                    onClose={closeModal}
                    confirmButtonState={bulkProductVariantDelete.opts.status}
                    onConfirm={() =>
                      bulkProductVariantDelete.mutate({
                        ids: params.ids
                      })
                    }
                    variant="delete"
                    title={intl.formatMessage({
                      defaultMessage: "Delete Product Variants",
                      description: "dialog header"
                    })}
                  >
                    <DialogContentText>
                      <FormattedMessage
                        defaultMessage="{counter,plural,one{Are you sure you want to delete this variant?} other{Are you sure you want to delete {displayQuantity} variants?}}"
                        description="dialog content"
                        values={{
                          counter: maybe(() => params.ids.length),
                          displayQuantity: (
                            <strong>{maybe(() => params.ids.length)}</strong>
                          )
                        }}
                      />
                    </DialogContentText>
                  </ActionDialog>
                  <ProductVariantCreateDialog
                    defaultPrice={maybe(() =>
                      data.product.basePrice.amount.toFixed(2)
                    )}
                    errors={maybe(
                      () =>
                        bulkProductVariantCreate.opts.data
                          .productVariantBulkCreate.bulkProductErrors,
                      []
                    )}
                    open={params.action === "create-variants"}
                    attributes={maybe(
                      () => data.product.productType.variantAttributes,
                      []
                    )}
                    currencySymbol={maybe(() => shop.defaultCurrency)}
                    onClose={closeModal}
                    onSubmit={inputs =>
                      bulkProductVariantCreate.mutate({
                        id,
                        inputs
                      })
                    }
                  />
                </>
              );
            }}
          </ProductUpdateOperations>
        );
      }}
    </TypedProductDetailsQuery>
  );
};
export default ProductUpdate;
