// @ts-strict-ignore
import placeholderImg from "@assets/images/placeholder255x255.png";
import {
  getAttributesAfterFileAttributesUpdate,
  mergeAttributeValueDeleteErrors,
  mergeFileUploadErrors,
} from "@dashboard/attributes/utils/data";
import {
  handleDeleteMultipleAttributeValues,
  handleUploadMultipleFiles,
  prepareAttributesInput,
} from "@dashboard/attributes/utils/handlers";
import { createVariantChannels } from "@dashboard/channels/utils";
import { AttributeInput } from "@dashboard/components/Attributes";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  ProductErrorWithAttributesFragment,
  useAttributeValueDeleteMutation,
  useFileUploadMutation,
  useProductVariantDetailsQuery,
  useProductVariantPreorderDeactivateMutation,
  useProductVariantReorderMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
  useVariantDeleteMutation,
  useVariantMediaAssignMutation,
  useVariantMediaUnassignMutation,
  useVariantUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useOnSetDefaultVariant from "@dashboard/hooks/useOnSetDefaultVariant";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import { weight } from "@dashboard/misc";
import { getAttributeInputFromVariant } from "@dashboard/products/utils/data";
import { handleAssignMedia } from "@dashboard/products/utils/handlers";
import usePageSearch from "@dashboard/searches/usePageSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import useAttributeValueSearchHandler from "@dashboard/utils/handlers/attributeValueSearchHandler";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { warehouseAddPath } from "@dashboard/warehouses/urls";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import ProductVariantDeleteDialog from "../../components/ProductVariantDeleteDialog";
import ProductVariantPage from "../../components/ProductVariantPage";
import { ProductVariantUpdateSubmitData } from "../../components/ProductVariantPage/form";
import {
  productUrl,
  productVariantEditUrl,
  ProductVariantEditUrlDialog,
  ProductVariantEditUrlQueryParams,
} from "../../urls";
import { mapFormsetStockToStockInput } from "../../utils/data";
import { createVariantReorderHandler } from "./../ProductUpdate/handlers";
import { useAllWarehouses } from "./useAllWarehouses";
import { useSubmitChannels } from "./useSubmitChannels";

interface ProductUpdateProps {
  variantId: string;
  productId: string;
  params: ProductVariantEditUrlQueryParams;
}

export const ProductVariant: React.FC<ProductUpdateProps> = ({
  variantId,
  productId,
  params,
}) => {
  const shop = useShop();
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [errors, setErrors] = useState<ProductErrorWithAttributesFragment[]>(
    [],
  );
  useEffect(() => {
    setErrors([]);
  }, [variantId]);

  const { data, loading } = useProductVariantDetailsQuery({
    displayLoader: true,
    variables: {
      id: variantId,
      firstValues: 10,
    },
  });
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

  const [openModal] = createDialogActionHandlers<
    ProductVariantEditUrlDialog,
    ProductVariantEditUrlQueryParams
  >(
    navigate,
    params => productVariantEditUrl(productId, variantId, params),
    params,
  );

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

  const [assignMedia, assignMediaOpts] = useVariantMediaAssignMutation({});
  const [unassignMedia, unassignMediaOpts] = useVariantMediaUnassignMutation(
    {},
  );
  const [deleteVariant, deleteVariantOpts] = useVariantDeleteMutation({
    onCompleted: () => {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "BUKMzM",
          defaultMessage: "Variant removed",
        }),
      });
      navigate(productUrl(productId));
    },
  });

  const [updateVariant, updateVariantOpts] = useVariantUpdateMutation({
    onCompleted: data => {
      if (data.productVariantUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
      setErrors(data.productVariantUpdate.errors);
    },
  });

  const [deleteAttributeValue, deleteAttributeValueOpts] =
    useAttributeValueDeleteMutation({});

  const { handleSubmitChannels, updateChannelsOpts } = useSubmitChannels();

  const variant = data?.productVariant;
  const channels = createVariantChannels(variant);

  const warehouses = useAllWarehouses(channels);

  const [deactivatePreorder, deactivatePreoderOpts] =
    useProductVariantPreorderDeactivateMutation({});
  const handleDeactivateVariantPreorder = (id: string) =>
    deactivatePreorder({ variables: { id } });

  const [reorderProductVariants, reorderProductVariantsOpts] =
    useProductVariantReorderMutation({});

  const onSetDefaultVariant = useOnSetDefaultVariant(productId, variant);

  const handleVariantReorder = createVariantReorderHandler(
    variant?.product,
    reorderProductVariants,
  );

  const disableFormSave =
    loading ||
    uploadFileOpts.loading ||
    deleteVariantOpts.loading ||
    updateVariantOpts.loading ||
    assignMediaOpts.loading ||
    unassignMediaOpts.loading ||
    deactivatePreoderOpts.loading ||
    reorderProductVariantsOpts.loading ||
    deleteAttributeValueOpts.loading;

  const handleUpdate = async (data: ProductVariantUpdateSubmitData) => {
    const uploadFilesResult = await handleUploadMultipleFiles(
      data.attributesWithNewFileValue,
      variables => uploadFile({ variables }),
    );

    const deleteAttributeValuesResult =
      await handleDeleteMultipleAttributeValues(
        data.attributesWithNewFileValue,
        variant?.nonSelectionAttributes,
        variables => deleteAttributeValue({ variables }),
      );

    const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
      data.attributesWithNewFileValue,
      uploadFilesResult,
    );

    const assignMediaErrors = await handleAssignMedia(
      data.media,
      variant,
      variables => assignMedia({ variables }),
      variables => unassignMedia({ variables }),
    );

    const result = await updateVariant({
      variables: {
        addStocks: data.addStocks.map(mapFormsetStockToStockInput),
        attributes: prepareAttributesInput({
          attributes: data.attributes,
          prevAttributes: getAttributeInputFromVariant(variant),
          updatedFileAttributes,
        }),
        id: variantId,
        removeStocks: data.removeStocks,
        sku: data.sku,
        quantityLimitPerCustomer: Number(data.quantityLimitPerCustomer) || null,
        stocks: data.updateStocks.map(mapFormsetStockToStockInput),
        trackInventory: data.trackInventory,
        preorder: data.isPreorder
          ? {
              globalThreshold: data.globalThreshold
                ? parseInt(data.globalThreshold, 10)
                : null,
              endDate: data?.preorderEndDateTime || null,
            }
          : null,
        weight: weight(data.weight),
        firstValues: 10,
        name: data.variantName,
      },
    });

    const channelErrors = await handleSubmitChannels(data, variant);

    return [
      ...mergeFileUploadErrors(uploadFilesResult),
      ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult),
      ...result.data?.productVariantStocksCreate.errors,
      ...result.data?.productVariantStocksDelete.errors,
      ...result.data?.productVariantStocksUpdate.errors,
      ...result.data?.productVariantUpdate.errors,
      ...assignMediaErrors,
      ...channelErrors,
    ];
  };
  const handleSubmit = createMetadataUpdateHandler(
    data?.productVariant,
    handleUpdate,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );

  const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
    navigate(
      productVariantEditUrl(productId, variantId, {
        action: "assign-attribute-value",
        id: attribute.id,
      }),
    );

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

  const fetchMoreReferencePages = {
    hasMore: searchPagesOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchPagesOpts.loading,
    onFetchMore: loadMorePages,
  };
  const fetchMoreReferenceProducts = {
    hasMore: searchProductsOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchProductsOpts.loading,
    onFetchMore: loadMoreProducts,
  };
  const fetchMoreAttributeValues = {
    hasMore:
      !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo
        ?.hasNextPage,
    loading: !!searchAttributeValuesOpts.loading,
    onFetchMore: loadMoreAttributeValues,
  };

  const attributeValues =
    mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];

  if (variant === null) {
    return <NotFoundPage backHref={productUrl(productId)} />;
  }

  return (
    <>
      <WindowTitle title={data?.productVariant?.name} />
      <ProductVariantPage
        productId={productId}
        defaultWeightUnit={shop?.defaultWeightUnit}
        defaultVariantId={data?.productVariant.product.defaultVariant?.id}
        errors={errors}
        attributeValues={attributeValues}
        channels={channels}
        channelErrors={
          updateChannelsOpts?.data?.productVariantChannelListingUpdate
            ?.errors || []
        }
        onSetDefaultVariant={onSetDefaultVariant}
        saveButtonBarState={updateVariantOpts.status}
        loading={disableFormSave}
        placeholderImage={placeholderImg}
        variant={variant}
        header={variant?.name || variant?.sku}
        warehouses={warehouses}
        onDelete={() => openModal("remove")}
        onSubmit={handleSubmit}
        onWarehouseConfigure={() => navigate(warehouseAddPath)}
        onVariantPreorderDeactivate={handleDeactivateVariantPreorder}
        variantDeactivatePreoderButtonState={deactivatePreoderOpts.status}
        onVariantReorder={handleVariantReorder}
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
        fetchAttributeValues={searchAttributeValues}
        fetchMoreAttributeValues={fetchMoreAttributeValues}
        onCloseDialog={() =>
          navigate(productVariantEditUrl(productId, variantId))
        }
        onAttributeSelectBlur={searchAttributeReset}
      />
      <ProductVariantDeleteDialog
        confirmButtonState={deleteVariantOpts.status}
        onClose={() => navigate(productVariantEditUrl(productId, variantId))}
        onConfirm={() =>
          deleteVariant({
            variables: {
              id: variantId,
            },
          })
        }
        open={params.action === "remove"}
        name={data?.productVariant?.name}
      />
    </>
  );
};
export default ProductVariant;
