import placeholderImg from "@assets/images/placeholder255x255.png";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { useChannelsList } from "@saleor/channels/queries";
import {
  ChannelData,
  createChannelsDataFromProduct,
  createChannelsDataWithPrice
} from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListActions from "@saleor/hooks/useListActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { commonMessages } from "@saleor/intl";
import {
  useProductChannelListingUpdate,
  useProductDeleteMutation,
  useProductImageCreateMutation,
  useProductImageDeleteMutation,
  useProductImagesReorder,
  useProductUpdateMutation,
  useProductVariantBulkDeleteMutation,
  useProductVariantChannelListingUpdate,
  useSimpleProductUpdateMutation,
  useVariantCreateMutation
} from "@saleor/products/mutations";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import getProductErrorMessage from "@saleor/utils/errors/product";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { useWarehouseList } from "@saleor/warehouses/queries";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getMutationState } from "../../../misc";
import ProductUpdatePage from "../../components/ProductUpdatePage";
import { useProductDetailsQuery } from "../../queries";
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
  const [
    productVariantCreate,
    productVariantCreateOpts
  ] = useVariantCreateMutation({
    onCompleted: data => {
      const errors = data.productVariantCreate.errors;
      if (errors.length) {
        errors.map(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl)
          })
        );
      }
    }
  });

  const { data: channelsData } = useChannelsList({});
  const { data, loading, refetch } = useProductDetailsQuery({
    displayLoader: true,
    variables: { channel: "default-channel", id }
  });
  const product = data?.product;

  const allChannels: ChannelData[] = createChannelsDataWithPrice(
    product?.channelListing,
    channelsData?.channels
  );
  const productChannelsChoices: ChannelData[] = createChannelsDataFromProduct(
    product?.channelListing
  );
  const [currentChannels, setCurrentChannels] = useStateFromProps(
    productChannelsChoices
  );

  const {
    isSelected: isChannelSelected,
    listElements: channelListElements,
    set: setChannels,
    toggle: channelsToggle
  } = useListActions<ChannelData>(currentChannels, (a, b) => a.id === b.id);
  useEffect(() => {
    if (!currentChannels.length && productChannelsChoices.length) {
      setCurrentChannels(productChannelsChoices);
    }
  }, [productChannelsChoices]);

  const [updateChannels, updateChannelsOpts] = useProductChannelListingUpdate({
    onCompleted: data => {
      if (
        data.productChannelListingUpdate.productChannelListingErrors.length ===
        0
      ) {
        const updatedProductChannelsChoices: ChannelData[] = createChannelsDataFromProduct(
          data.productChannelListingUpdate.product.channelListing
        );
        setCurrentChannels(updatedProductChannelsChoices);
      } else {
        data.productChannelListingUpdate.productChannelListingErrors.map(
          error =>
            notify({
              status: "error",
              text: getProductErrorMessage(error, intl)
            })
        );
      }
    }
  });
  const [
    updateVariantChannels,
    updateVariantChannelsOpts
  ] = useProductVariantChannelListingUpdate({});

  const [isChannelsModalOpen, setChannelsModalOpen] = React.useState(false);
  const [openModal, closeModal] = createDialogActionHandlers<
    ProductUrlDialog,
    ProductUrlQueryParams
  >(navigate, params => productUrl(id, params), params);

  const handleChannelsModalClose = () => {
    setChannelsModalOpen(false);
    setChannels(currentChannels);
  };

  const handleChannelsConfirm = () => {
    setCurrentChannels(channelListElements);
    setChannelsModalOpen(false);
  };

  const handleBack = () => navigate(productListUrl());

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

  const handleVariantAdd = () => navigate(productVariantAddUrl(id));

  const handleImageDelete = (id: string) => () =>
    deleteProductImage({ variables: { id } });
  const handleImageEdit = (imageId: string) => () =>
    navigate(productImageUrl(id, imageId));

  const handleSubmit = createUpdateHandler(
    product,
    variables => updateProduct({ variables }),
    variables => updateSimpleProduct({ variables }),
    updateChannels,
    updateVariantChannels,
    productVariantCreate
  );
  const handleImageUpload = createImageUploadHandler(id, variables =>
    createProductImage({ variables })
  );
  const handleImageReorder = createImageReorderHandler(product, variables =>
    reorderProductImages({ variables })
  );

  const disableFormSave =
    createProductImageOpts.loading ||
    deleteProductOpts.loading ||
    reorderProductImagesOpts.loading ||
    updateProductOpts.loading ||
    updateChannelsOpts.loading ||
    updateVariantChannelsOpts.loading ||
    productVariantCreateOpts.loading ||
    loading;
  const formTransitionState = getMutationState(
    updateProductOpts.called || updateSimpleProductOpts.called,
    updateProductOpts.loading || updateSimpleProductOpts.loading,
    updateProductOpts?.data?.productUpdate?.errors,
    updateSimpleProductOpts?.data?.productUpdate?.errors,
    updateSimpleProductOpts?.data?.productVariantUpdate?.errors
  );

  const categories =
    searchCategoriesOpts?.data?.search?.edges || [].map(edge => edge.node);
  const collections =
    searchCollectionsOpts?.data?.search?.edges || [].map(edge => edge.node);
  const errors = [
    ...(updateProductOpts?.data?.productUpdate?.errors || []),
    ...(updateSimpleProductOpts?.data?.productUpdate?.errors || [])
  ];
  const channelsErrors = [
    ...(updateChannelsOpts?.data?.productChannelListingUpdate
      ?.productChannelListingErrors || []),
    ...(updateVariantChannelsOpts?.data?.productVariantChannelListingUpdate
      ?.productChannelListingErrors || [])
  ];
  return product === null ? (
    <NotFoundPage onBack={handleBack} />
  ) : (
    <>
      <WindowTitle title={data?.product?.name} />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          disabled={!channelListElements.length}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            defaultMessage: "Manage Products Channel Availability"
          })}
          confirmButtonState="default"
          onConfirm={handleChannelsConfirm}
        />
      )}
      <ProductUpdatePage
        allChannelsCount={allChannels?.length}
        hasChannelChanged={
          productChannelsChoices?.length !== currentChannels?.length
        }
        categories={categories}
        collections={collections}
        currentChannels={currentChannels}
        disabled={disableFormSave}
        errors={errors}
        channelsErrors={channelsErrors}
        fetchCategories={searchCategories}
        fetchCollections={searchCollections}
        saveButtonBarState={formTransitionState}
        images={data?.product?.images}
        header={product?.name}
        placeholderImage={placeholderImg}
        product={product}
        warehouses={
          warehouses.data?.warehouses.edges.map(edge => edge.node) || []
        }
        variants={product?.variants}
        onBack={handleBack}
        onDelete={() => openModal("remove")}
        onImageReorder={handleImageReorder}
        onSubmit={handleSubmit}
        onVariantAdd={handleVariantAdd}
        onVariantsAdd={() => navigate(productVariantCreatorUrl(id))}
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
          hasMore: searchCategoriesOpts?.data?.search?.pageInfo?.hasNextPage,
          loading: searchCategoriesOpts.loading,
          onFetchMore: loadMoreCategories
        }}
        fetchMoreCollections={{
          hasMore: searchCollectionsOpts?.data?.search?.pageInfo?.hasNextPage,
          loading: searchCollectionsOpts.loading,
          onFetchMore: loadMoreCollections
        }}
        openChannelsModal={() => setChannelsModalOpen(true)}
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
              counter: params?.ids?.length,
              displayQuantity: <strong>{params?.ids?.length}</strong>
            }}
          />
        </DialogContentText>
      </ActionDialog>
    </>
  );
};
export default ProductUpdate;
