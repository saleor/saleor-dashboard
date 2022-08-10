import placeholderImg from "@assets/images/placeholder255x255.png";
import { DialogContentText } from "@material-ui/core";
import ChannelsWithVariantsAvailabilityDialog from "@saleor/channels/components/ChannelsWithVariantsAvailabilityDialog";
import {
  ChannelData,
  createChannelsDataWithPrice,
  createSortedChannelsDataFromProduct,
} from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import { AttributeInput } from "@saleor/components/Attributes";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { useShopLimitsQuery } from "@saleor/components/Shop/queries";
import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  DEFAULT_INITIAL_SEARCH_DATA,
  VALUES_PAGINATE_BY,
} from "@saleor/config";
import {
  ProductMediaCreateMutationVariables,
  ProductUpdateMutation,
  useAttributeValueDeleteMutation,
  useFileUploadMutation,
  useProductChannelListingUpdateMutation,
  useProductDeleteMutation,
  useProductDetailsQuery,
  useProductMediaCreateMutation,
  useProductMediaDeleteMutation,
  useProductMediaReorderMutation,
  useProductUpdateMutation,
  useProductVariantBulkDeleteMutation,
  useProductVariantChannelListingUpdateMutation,
  useProductVariantPreorderDeactivateMutation,
  useProductVariantReorderMutation,
  useSimpleProductUpdateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
  useVariantCreateMutation,
  useWarehouseListQuery,
} from "@saleor/graphql";
import { getSearchFetchMoreProps } from "@saleor/hooks/makeTopLevelSearch/utils";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useOnSetDefaultVariant from "@saleor/hooks/useOnSetDefaultVariant";
import useShop from "@saleor/hooks/useShop";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { commonMessages, errorMessages } from "@saleor/intl";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import ProductVariantEndPreorderDialog from "@saleor/products/components/ProductVariantEndPreorderDialog";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import usePageSearch from "@saleor/searches/usePageSearch";
import useProductSearch from "@saleor/searches/useProductSearch";
import { getProductErrorMessage } from "@saleor/utils/errors";
import useAttributeValueSearchHandler from "@saleor/utils/handlers/attributeValueSearchHandler";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { warehouseAddPath } from "@saleor/warehouses/urls";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { getMutationState } from "../../../misc";
import ProductUpdatePage from "../../components/ProductUpdatePage";
import {
  productListUrl,
  productUrl,
  ProductUrlDialog,
  ProductUrlQueryParams,
} from "../../urls";
import {
  CHANNELS_AVAILIABILITY_MODAL_SELECTOR,
  PRODUCT_UPDATE_FORM_ID,
} from "./consts";
import {
  createImageReorderHandler,
  createImageUploadHandler,
  createUpdateHandler,
  createVariantReorderHandler,
} from "./handlers";
import useChannelVariantListings from "./useChannelVariantListings";

const messages = defineMessages({
  deleteProductDialogTitle: {
    id: "TWVx7O",
    defaultMessage: "Delete Product",
    description: "delete product dialog title",
  },
  deleteProductDialogSubtitle: {
    id: "ZHF4Z9",
    defaultMessage: "Are you sure you want to delete {name}?",
    description: "delete product dialog subtitle",
  },
  deleteVariantDialogTitle: {
    id: "6iw4VR",
    defaultMessage: "Delete Product Variants",
    description: "delete variant dialog title",
  },
  deleteVariantDialogSubtitle: {
    id: "ukdRUv",
    defaultMessage:
      "{counter,plural,one{Are you sure you want to delete this variant?} other{Are you sure you want to delete {displayQuantity} variants?}}",
    description: "delete variant dialog subtitle",
  },
});

interface ProductUpdateProps {
  id: string;
  params: ProductUrlQueryParams;
}

export const ProductUpdate: React.FC<ProductUpdateProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids,
  );
  const intl = useIntl();
  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts,
  } = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreCollections,
    search: searchCollections,
    result: searchCollectionsOpts,
  } = useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMorePages,
    search: searchPages,
    result: searchPagesOpts,
  } = usePageSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreProducts,
    search: searchProducts,
    result: searchProductsOpts,
  } = useProductSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreAttributeValues,
    search: searchAttributeValues,
    result: searchAttributeValuesOpts,
    reset: searchAttributeReset,
  } = useAttributeValueSearchHandler(DEFAULT_INITIAL_SEARCH_DATA);
  const shop = useShop();
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const [
    productVariantCreate,
    productVariantCreateOpts,
  ] = useVariantCreateMutation({});

  const { data, loading, refetch } = useProductDetailsQuery({
    displayLoader: true,
    variables: {
      id,
      firstValues: VALUES_PAGINATE_BY,
    },
  });

  const isSimpleProduct = !data?.product?.productType?.hasVariants;

  const { availableChannels, channel } = useAppChannel(!isSimpleProduct);

  const limitOpts = useShopLimitsQuery({
    variables: {
      productVariants: true,
    },
  });

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

  const handleUpdate = (data: ProductUpdateMutation) => {
    if (data.productUpdate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
    }
  };
  const [updateProduct, updateProductOpts] = useProductUpdateMutation({
    onCompleted: handleUpdate,
  });
  const [
    updateSimpleProduct,
    updateSimpleProductOpts,
  ] = useSimpleProductUpdateMutation({
    onCompleted: handleUpdate,
  });

  const [
    reorderProductImages,
    reorderProductImagesOpts,
  ] = useProductMediaReorderMutation({});

  const [deleteProduct, deleteProductOpts] = useProductDeleteMutation({
    onCompleted: () => {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "vlVTmY",
          defaultMessage: "Product removed",
        }),
      });
      navigate(productListUrl());
    },
  });

  const [
    createProductImage,
    createProductImageOpts,
  ] = useProductMediaCreateMutation({
    onCompleted: data => {
      const imageError = data.productMediaCreate.errors.find(
        error =>
          error.field ===
          ("image" as keyof ProductMediaCreateMutationVariables),
      );
      if (imageError) {
        notify({
          status: "error",
          title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
          text: intl.formatMessage(errorMessages.imageUploadErrorText),
        });
      }
    },
  });

  const [deleteProductImage] = useProductMediaDeleteMutation({
    onCompleted: () =>
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      }),
  });

  const [
    bulkProductVariantDelete,
    bulkProductVariantDeleteOpts,
  ] = useProductVariantBulkDeleteMutation({
    onCompleted: data => {
      if (data.productVariantBulkDelete.errors.length === 0) {
        closeModal();
        reset();
        refetch();
        limitOpts.refetch();
      }
    },
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    ProductUrlDialog,
    ProductUrlQueryParams
  >(navigate, params => productUrl(id, params), params);

  const [
    isEndPreorderModalOpened,
    setIsEndPreorderModalOpened,
  ] = React.useState(false);

  const product = data?.product;

  // useMemo saves, like, 46 rerenders here
  const allChannels: ChannelData[] = React.useMemo(
    () =>
      createChannelsDataWithPrice(
        product,
        availableChannels,
      ).sort((channel, nextChannel) =>
        channel.name.localeCompare(nextChannel.name),
      ),
    [product, availableChannels],
  );

  const [channelsData, setChannelsData] = useStateFromProps(allChannels);
  const {
    channels: updatedChannels,
    channelsWithVariantsData,
    setChannelVariantListing,
  } = useChannelVariantListings(allChannels);

  const productChannelsChoices: ChannelData[] = createSortedChannelsDataFromProduct(
    product,
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
    productChannelsChoices,
    params?.action,
    {
      closeModal,
      openModal,
    },
    { formId: PRODUCT_UPDATE_FORM_ID },
  );

  const warehouses = useWarehouseListQuery({
    displayLoader: true,
    variables: {
      first: 50,
      filter: {
        channels: currentChannels.map(channel => channel.id),
      },
    },
  });

  const [
    updateChannels,
    updateChannelsOpts,
  ] = useProductChannelListingUpdateMutation({
    onCompleted: data => {
      if (!!data.productChannelListingUpdate.errors.length) {
        data.productChannelListingUpdate.errors.forEach(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl),
          }),
        );
      }
    },
  });

  const [
    updateVariantChannels,
    updateVariantChannelsOpts,
  ] = useProductVariantChannelListingUpdateMutation({});

  const [
    createProductMedia,
    createProductMediaOpts,
  ] = useProductMediaCreateMutation({
    onCompleted: data => {
      const errors = data.productMediaCreate.errors;

      if (errors.length) {
        errors.map(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl),
          }),
        );
      } else {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  const handleMediaUrlUpload = (mediaUrl: string) => {
    const variables = {
      alt: "",
      mediaUrl,
      product: product.id,
    };

    createProductMedia({
      variables,
    });
  };

  const [
    deleteAttributeValue,
    deleteAttributeValueOpts,
  ] = useAttributeValueDeleteMutation({});

  const onSetDefaultVariant = useOnSetDefaultVariant(
    product ? product.id : null,
    null,
  );

  const [
    reorderProductVariants,
    reorderProductVariantsOpts,
  ] = useProductVariantReorderMutation({});

  const handleBack = () => navigate(productListUrl());

  const handleImageDelete = (id: string) => () =>
    deleteProductImage({ variables: { id } });

  const handleSubmit = createMetadataUpdateHandler(
    product,
    createUpdateHandler(
      product,
      allChannels,
      variables => uploadFile({ variables }),
      variables => updateProduct({ variables }),
      variables => updateSimpleProduct({ variables }),
      updateChannels,
      updateVariantChannels,
      productVariantCreate,
      variables => deleteAttributeValue({ variables }),
    ),
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );

  const handleImageUpload = createImageUploadHandler(id, variables =>
    createProductImage({ variables }),
  );
  const handleImageReorder = createImageReorderHandler(product, variables =>
    reorderProductImages({ variables }),
  );

  const handleVariantReorder = createVariantReorderHandler(product, variables =>
    reorderProductVariants({ variables }),
  );

  const handleDeactivatePreorder = async () => {
    await handleDeactivateVariantPreorder(product.variants[0].id);
    setIsEndPreorderModalOpened(false);
  };

  const [
    deactivatePreorder,
    deactivatePreoderOpts,
  ] = useProductVariantPreorderDeactivateMutation({});
  const handleDeactivateVariantPreorder = (id: string) =>
    deactivatePreorder({ variables: { id } });

  const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
    navigate(
      productUrl(id, {
        action: "assign-attribute-value",
        id: attribute.id,
      }),
      { resetScroll: false },
    );

  const disableFormSave =
    uploadFileOpts.loading ||
    createProductImageOpts.loading ||
    deleteProductOpts.loading ||
    reorderProductImagesOpts.loading ||
    updateProductOpts.loading ||
    reorderProductVariantsOpts.loading ||
    updateChannelsOpts.loading ||
    updateVariantChannelsOpts.loading ||
    productVariantCreateOpts.loading ||
    deactivatePreoderOpts.loading ||
    deleteAttributeValueOpts.loading ||
    createProductMediaOpts.loading ||
    loading;

  const formTransitionState = getMutationState(
    updateProductOpts.called || updateSimpleProductOpts.called,
    updateProductOpts.loading || updateSimpleProductOpts.loading,
    updateProductOpts.data?.productUpdate.errors,
    updateSimpleProductOpts.data?.productUpdate.errors,
    updateSimpleProductOpts.data?.productVariantUpdate.errors,
    createProductMediaOpts.data?.productMediaCreate.errors,
  );

  const categories = mapEdgesToItems(searchCategoriesOpts?.data?.search) || [];

  const collections =
    mapEdgesToItems(searchCollectionsOpts?.data?.search) || [];

  const attributeValues =
    mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];

  const errors = [
    ...(updateProductOpts.data?.productUpdate.errors || []),
    ...(updateSimpleProductOpts.data?.productUpdate.errors || []),
    ...(productVariantCreateOpts.data?.productVariantCreate.errors || []),
  ];

  const channelsErrors = [
    ...(updateChannelsOpts?.data?.productChannelListingUpdate?.errors || []),
    ...(updateVariantChannelsOpts?.data?.productVariantChannelListingUpdate
      ?.errors || []),
  ];

  const fetchMoreCollections = getSearchFetchMoreProps(
    searchCollectionsOpts,
    loadMoreCollections,
  );

  const fetchMoreCategories = getSearchFetchMoreProps(
    searchCategoriesOpts,
    loadMoreCategories,
  );

  const fetchMoreReferencePages = getSearchFetchMoreProps(
    searchPagesOpts,
    loadMorePages,
  );

  const fetchMoreReferenceProducts = getSearchFetchMoreProps(
    searchProductsOpts,
    loadMoreProducts,
  );

  const fetchMoreAttributeValues = {
    hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo
      ?.hasNextPage,
    loading: !!searchAttributeValuesOpts.loading,
    onFetchMore: loadMoreAttributeValues,
  };

  if (product === null) {
    return <NotFoundPage onBack={handleBack} />;
  }

  return (
    <>
      <WindowTitle title={data?.product?.name} />
      {!!allChannels?.length &&
        (isSimpleProduct || product?.variants.length === 0 ? (
          <ChannelsAvailabilityDialog
            isSelected={isChannelSelected}
            channels={allChannels}
            onChange={channelsToggle}
            onClose={handleChannelsModalClose}
            open={isChannelsModalOpen}
            title={intl.formatMessage({
              id: "Eau5AV",
              defaultMessage: "Manage Products Channel Availability",
            })}
            confirmButtonState="default"
            selected={channelListElements.length}
            onConfirm={handleChannelsConfirm}
            toggleAll={toggleAllChannels}
          />
        ) : (
          <ChannelsWithVariantsAvailabilityDialog
            channels={updatedChannels}
            variants={product?.variants}
            open={params.action === CHANNELS_AVAILIABILITY_MODAL_SELECTOR}
            onClose={closeModal}
            onConfirm={listings => {
              closeModal();
              setChannelVariantListing(listings);
            }}
          />
        ))}
      <ProductUpdatePage
        productId={id}
        isSimpleProduct={isSimpleProduct}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        channelsErrors={channelsErrors}
        currentChannels={currentChannels}
        allChannelsCount={allChannels?.length}
        channelsData={channelsData}
        setChannelsData={setChannelsData}
        categories={categories}
        collections={collections}
        attributeValues={attributeValues}
        channelsWithVariantsData={channelsWithVariantsData}
        defaultWeightUnit={shop?.defaultWeightUnit}
        disabled={disableFormSave}
        onSetDefaultVariant={onSetDefaultVariant}
        errors={errors}
        fetchCategories={searchCategories}
        fetchCollections={searchCollections}
        fetchAttributeValues={searchAttributeValues}
        limits={limitOpts.data?.shop.limits}
        saveButtonBarState={formTransitionState}
        media={data?.product?.media}
        header={product?.name}
        placeholderImage={placeholderImg}
        product={product}
        warehouses={mapEdgesToItems(warehouses?.data?.warehouses) || []}
        taxTypes={data?.taxTypes}
        variants={product?.variants}
        onDelete={() => openModal("remove")}
        onImageReorder={handleImageReorder}
        onMediaUrlUpload={handleMediaUrlUpload}
        onSubmit={handleSubmit}
        onWarehouseConfigure={() => navigate(warehouseAddPath)}
        onVariantReorder={handleVariantReorder}
        onVariantEndPreorderDialogOpen={() => setIsEndPreorderModalOpened(true)}
        onImageUpload={handleImageUpload}
        onImageDelete={handleImageDelete}
        toolbar={
          <IconButton
            variant="secondary"
            color="primary"
            onClick={() =>
              openModal("remove-variants", {
                ids: listElements,
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
        fetchMoreCategories={fetchMoreCategories}
        fetchMoreCollections={fetchMoreCollections}
        selectedChannelId={channel?.id}
        assignReferencesAttributeId={
          params.action === "assign-attribute-value" && params.id
        }
        onAssignReferencesClick={handleAssignAttributeReferenceClick}
        referencePages={mapEdgesToItems(searchPagesOpts?.data?.search) || []}
        referenceProducts={
          mapEdgesToItems(searchProductsOpts?.data?.search) || []
        }
        fetchReferencePages={searchPages}
        fetchMoreReferencePages={fetchMoreReferencePages}
        fetchReferenceProducts={searchProducts}
        fetchMoreReferenceProducts={fetchMoreReferenceProducts}
        fetchMoreAttributeValues={fetchMoreAttributeValues}
        onCloseDialog={() => navigate(productUrl(id), { resetScroll: false })}
        onAttributeSelectBlur={searchAttributeReset}
      />
      <ActionDialog
        open={params.action === "remove"}
        onClose={closeModal}
        confirmButtonState={deleteProductOpts.status}
        onConfirm={() => deleteProduct({ variables: { id } })}
        variant="delete"
        title={intl.formatMessage(messages.deleteProductDialogTitle)}
      >
        <DialogContentText>
          <FormattedMessage
            {...messages.deleteProductDialogSubtitle}
            values={{ name: product?.name }}
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
              ids: params.ids,
            },
          })
        }
        variant="delete"
        title={intl.formatMessage(messages.deleteVariantDialogTitle)}
      >
        <DialogContentText>
          <FormattedMessage
            {...messages.deleteVariantDialogSubtitle}
            values={{
              counter: params?.ids?.length,
              displayQuantity: <strong>{params?.ids?.length}</strong>,
            }}
          />
        </DialogContentText>
      </ActionDialog>
      {isSimpleProduct && !!product?.variants?.[0]?.preorder && (
        <ProductVariantEndPreorderDialog
          confirmButtonState={deactivatePreoderOpts.status}
          onClose={() => setIsEndPreorderModalOpened(false)}
          onConfirm={handleDeactivatePreorder}
          open={isEndPreorderModalOpened}
          variantGlobalSoldUnits={product.variants[0].preorder.globalSoldUnits}
        />
      )}
    </>
  );
};
export default ProductUpdate;
