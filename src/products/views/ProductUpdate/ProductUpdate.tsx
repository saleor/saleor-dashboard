import placeholderImg from "@assets/images/placeholder255x255.png";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ActionDialog from "@saleor/components/ActionDialog";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useOnSetDefaultVariant from "@saleor/hooks/useOnSetDefaultVariant";
import useShop from "@saleor/hooks/useShop";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { commonMessages } from "@saleor/intl";
import {
  useProductDeleteMutation,
  useProductImageCreateMutation,
  useProductImageDeleteMutation,
  useProductImagesReorder,
  useProductSetAvailabilityForPurchase,
  useProductUpdateMutation,
  useProductVariantBulkDeleteMutation,
  useProductVariantReorderMutation,
  useSimpleProductUpdateMutation
} from "@saleor/products/mutations";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import { useWarehouseList } from "@saleor/warehouses/queries";
import { warehouseAddPath } from "@saleor/warehouses/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getMutationState, maybe } from "../../../misc";
import ProductUpdatePage from "../../components/ProductUpdatePage";
import { useProductDetails } from "../../queries";
import { ProductImageCreateVariables } from "../../types/ProductImageCreate";
import { ProductUpdate as ProductUpdateMutationResult } from "../../types/ProductUpdate";
import {
  productImageUrl,
  productListUrl,
  productUrl,
  ProductUrlDialog,
  ProductUrlQueryParams,
  productVariantAddUrl,
  productVariantCreatorUrl,
  productVariantEditUrl
} from "../../urls";
import {
  createImageReorderHandler,
  createImageUploadHandler,
  createUpdateHandler,
  createVariantReorderHandler
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
  const warehouses = useWarehouseList({
    displayLoader: true,
    variables: {
      first: 50
    }
  });
  const shop = useShop();
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const { data, loading, refetch } = useProductDetails({
    displayLoader: true,
    variables: {
      id
    }
  });

  const handleUpdate = (data: ProductUpdateMutationResult) => {
    if (data.productUpdate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    }
  };
  const [updateProduct, updateProductOpts] = useProductUpdateMutation({
    onCompleted: handleUpdate
  });
  const [
    updateSimpleProduct,
    updateSimpleProductOpts
  ] = useSimpleProductUpdateMutation({
    onCompleted: handleUpdate
  });

  const [
    reorderProductImages,
    reorderProductImagesOpts
  ] = useProductImagesReorder({});

  const [deleteProduct, deleteProductOpts] = useProductDeleteMutation({
    onCompleted: () => {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Product removed"
        })
      });
      navigate(productListUrl());
    }
  });

  const [
    createProductImage,
    createProductImageOpts
  ] = useProductImageCreateMutation({
    onCompleted: data => {
      const imageError = data.productImageCreate.errors.find(
        error => error.field === ("image" as keyof ProductImageCreateVariables)
      );
      if (imageError) {
        notify({
          status: "error",
          text: intl.formatMessage(commonMessages.somethingWentWrong)
        });
      }
    }
  });

  const [deleteProductImage] = useProductImageDeleteMutation({
    onCompleted: () =>
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      })
  });

  const [
    bulkProductVariantDelete,
    bulkProductVariantDeleteOpts
  ] = useProductVariantBulkDeleteMutation({
    onCompleted: data => {
      if (data.productVariantBulkDelete.errors.length === 0) {
        closeModal();
        reset();
        refetch();
      }
    }
  });

  const [
    setProductAvailability,
    productAvailabilityOpts
  ] = useProductSetAvailabilityForPurchase({
    onCompleted: data => {
      const errors = data?.productSetAvailabilityForPurchase?.errors;
      if (errors?.length === 0) {
        const updatedProduct = data?.productSetAvailabilityForPurchase?.product;
        setProduct(product => ({
          ...product,
          availableForPurchase: updatedProduct.availableForPurchase,
          isAvailableForPurchase: updatedProduct.isAvailableForPurchase
        }));
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Product availability updated",
            description: "snackbar text"
          })
        });
      }
    }
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    ProductUrlDialog,
    ProductUrlQueryParams
  >(navigate, params => productUrl(id, params), params);

  const handleBack = () => navigate(productListUrl());

  const [product, setProduct] = useStateFromProps(data?.product);

  if (product === null) {
    return <NotFoundPage onBack={handleBack} />;
  }

  const handleVariantAdd = () => navigate(productVariantAddUrl(id));

  const handleImageDelete = (id: string) => () =>
    deleteProductImage({ variables: { id } });
  const handleImageEdit = (imageId: string) => () =>
    navigate(productImageUrl(id, imageId));
  const handleSubmit = createMetadataUpdateHandler(
    product,
    createUpdateHandler(
      product,
      variables => updateProduct({ variables }),
      variables => updateSimpleProduct({ variables }),
      variables => setProductAvailability({ variables })
    ),
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables })
  );
  const handleImageUpload = createImageUploadHandler(id, variables =>
    createProductImage({ variables })
  );
  const handleImageReorder = createImageReorderHandler(product, variables =>
    reorderProductImages({ variables })
  );

  const [
    reorderProductVariants,
    reorderProductVariantsOpts
  ] = useProductVariantReorderMutation({});

  const handleVariantReorder = createVariantReorderHandler(product, variables =>
    reorderProductVariants({ variables })
  );

  const disableFormSave =
    createProductImageOpts.loading ||
    deleteProductOpts.loading ||
    reorderProductImagesOpts.loading ||
    updateProductOpts.loading ||
    productAvailabilityOpts.loading ||
    reorderProductVariantsOpts.loading ||
    loading;

  const formTransitionState = getMutationState(
    updateProductOpts.called || updateSimpleProductOpts.called,
    updateProductOpts.loading || updateSimpleProductOpts.loading,
    maybe(() => updateProductOpts.data.productUpdate.errors),
    maybe(() => updateSimpleProductOpts.data.productUpdate.errors),
    maybe(() => updateSimpleProductOpts.data.productVariantUpdate.errors)
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
    ...maybe(() => updateProductOpts.data.productUpdate.errors, []),
    ...maybe(() => updateSimpleProductOpts.data.productUpdate.errors, [])
  ];
  const onSetDefaultVariant = useOnSetDefaultVariant(
    product ? product.id : null,
    null
  );

  return (
    <>
      <WindowTitle title={maybe(() => data.product.name)} />
      <ProductUpdatePage
        categories={categories}
        collections={collections}
        defaultWeightUnit={shop?.defaultWeightUnit}
        disabled={disableFormSave}
        onSetDefaultVariant={onSetDefaultVariant}
        errors={errors}
        fetchCategories={searchCategories}
        fetchCollections={searchCollections}
        saveButtonBarState={formTransitionState}
        images={maybe(() => data.product.images)}
        header={maybe(() => product.name)}
        placeholderImage={placeholderImg}
        product={product}
        warehouses={
          warehouses.data?.warehouses.edges.map(edge => edge.node) || []
        }
        taxTypes={data?.taxTypes}
        variants={maybe(() => product.variants)}
        onBack={handleBack}
        onDelete={() => openModal("remove")}
        onImageReorder={handleImageReorder}
        onSubmit={handleSubmit}
        onWarehouseConfigure={() => navigate(warehouseAddPath)}
        onVariantAdd={handleVariantAdd}
        onVariantsAdd={() => navigate(productVariantCreatorUrl(id))}
        onVariantShow={variantId => () =>
          navigate(productVariantEditUrl(product.id, variantId))}
        onVariantReorder={handleVariantReorder}
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
            () => searchCategoriesOpts.data.search.pageInfo.hasNextPage
          ),
          loading: searchCategoriesOpts.loading,
          onFetchMore: loadMoreCategories
        }}
        fetchMoreCollections={{
          hasMore: maybe(
            () => searchCollectionsOpts.data.search.pageInfo.hasNextPage
          ),
          loading: searchCollectionsOpts.loading,
          onFetchMore: loadMoreCollections
        }}
      />
      <ActionDialog
        open={params.action === "remove"}
        onClose={closeModal}
        confirmButtonState={deleteProductOpts.status}
        onConfirm={() => deleteProduct({ variables: { id } })}
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
        confirmButtonState={bulkProductVariantDeleteOpts.status}
        onConfirm={() =>
          bulkProductVariantDelete({
            variables: {
              ids: params.ids
            }
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
              displayQuantity: <strong>{maybe(() => params.ids.length)}</strong>
            }}
          />
        </DialogContentText>
      </ActionDialog>
    </>
  );
};
export default ProductUpdate;
