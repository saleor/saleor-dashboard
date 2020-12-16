import placeholderImg from "@assets/images/placeholder255x255.png";
import { useAttributeValueDeleteMutation } from "@saleor/attributes/mutations";
import {
  getAttributesAfterFileAttributesUpdate,
  mergeAttributeValueDeleteErrors,
  mergeFileUploadErrors
} from "@saleor/attributes/utils/data";
import {
  handleDeleteMultipleAttributeValues,
  handleUploadMultipleFiles,
  prepareAttributesInput
} from "@saleor/attributes/utils/handlers";
import { createVariantChannels } from "@saleor/channels/utils";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { useFileUploadMutation } from "@saleor/files/mutations";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useOnSetDefaultVariant from "@saleor/hooks/useOnSetDefaultVariant";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { useProductVariantChannelListingUpdate } from "@saleor/products/mutations";
import { ProductVariantDetails_productVariant } from "@saleor/products/types/ProductVariantDetails";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import { useWarehouseList } from "@saleor/warehouses/queries";
import { warehouseAddPath } from "@saleor/warehouses/urls";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { weight } from "../../misc";
import ProductVariantDeleteDialog from "../components/ProductVariantDeleteDialog";
import ProductVariantPage from "../components/ProductVariantPage";
import { ProductVariantUpdateSubmitData } from "../components/ProductVariantPage/form";
import {
  useProductVariantReorderMutation,
  useVariantDeleteMutation,
  useVariantImageAssignMutation,
  useVariantImageUnassignMutation,
  useVariantUpdateMutation
} from "../mutations";
import { useProductVariantQuery } from "../queries";
import { VariantUpdate_productVariantUpdate_errors } from "../types/VariantUpdate";
import {
  productUrl,
  productVariantAddUrl,
  productVariantEditUrl,
  ProductVariantEditUrlDialog,
  ProductVariantEditUrlQueryParams
} from "../urls";
import { mapFormsetStockToStockInput } from "../utils/data";
import { createVariantReorderHandler } from "./ProductUpdate/handlers";

interface ProductUpdateProps {
  variantId: string;
  productId: string;
  params: ProductVariantEditUrlQueryParams;
}

export const ProductVariant: React.FC<ProductUpdateProps> = ({
  variantId,
  productId,
  params
}) => {
  const shop = useShop();
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [errors, setErrors] = useState<
    VariantUpdate_productVariantUpdate_errors[]
  >([]);
  useEffect(() => {
    setErrors([]);
  }, [variantId]);

  const warehouses = useWarehouseList({
    displayLoader: true,
    variables: {
      first: 50
    }
  });

  const { data, loading } = useProductVariantQuery({
    displayLoader: true,
    variables: {
      id: variantId
    }
  });
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const [
    updateChannels,
    updateChannelsOpts
  ] = useProductVariantChannelListingUpdate({});

  const [openModal] = createDialogActionHandlers<
    ProductVariantEditUrlDialog,
    ProductVariantEditUrlQueryParams
  >(
    navigate,
    params => productVariantEditUrl(productId, variantId, params),
    params
  );

  const handleBack = () => navigate(productUrl(productId));

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

  const [assignImage, assignImageOpts] = useVariantImageAssignMutation({});
  const [unassignImage, unassignImageOpts] = useVariantImageUnassignMutation(
    {}
  );
  const [deleteVariant, deleteVariantOpts] = useVariantDeleteMutation({
    onCompleted: () => {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Variant removed"
        })
      });
      navigate(productUrl(productId));
    }
  });
  const [updateVariant, updateVariantOpts] = useVariantUpdateMutation({
    onCompleted: data => {
      if (data.productVariantUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
      }
      setErrors(data.productVariantUpdate.errors);
    }
  });

  const [
    deleteAttributeValue,
    deleteAttributeValueOpts
  ] = useAttributeValueDeleteMutation({});

  const handleSubmitChannels = async (
    data: ProductVariantUpdateSubmitData,
    variant: ProductVariantDetails_productVariant
  ) => {
    const isChannelPriceChange = data.channelListings.some(channel => {
      const variantChannel = variant.channelListings.find(
        variantChannel => variantChannel.channel.id === channel.id
      );
      return (
        channel.value.price !== variantChannel?.price?.amount.toString() ||
        channel.value.costPrice !== variantChannel?.costPrice?.amount.toString()
      );
    });
    if (isChannelPriceChange) {
      await updateChannels({
        variables: {
          id: variant.id,
          input: data.channelListings.map(listing => ({
            channelId: listing.id,
            costPrice: listing.value.costPrice || null,
            price: listing.value.price
          }))
        }
      });
    }
  };

  const variant = data?.productVariant;
  const channels = createVariantChannels(variant);

  if (variant === null) {
    return <NotFoundPage onBack={handleBack} />;
  }

  const [
    reorderProductVariants,
    reorderProductVariantsOpts
  ] = useProductVariantReorderMutation({});

  const onSetDefaultVariant = useOnSetDefaultVariant(productId, variant);

  const handleVariantReorder = createVariantReorderHandler(
    variant?.product,
    variables => reorderProductVariants({ variables })
  );

  const disableFormSave =
    loading ||
    uploadFileOpts.loading ||
    deleteVariantOpts.loading ||
    updateVariantOpts.loading ||
    assignImageOpts.loading ||
    unassignImageOpts.loading ||
    reorderProductVariantsOpts.loading ||
    deleteAttributeValueOpts.loading;

  const handleImageSelect = (id: string) => () => {
    if (variant) {
      if (variant?.images?.map(image => image.id).indexOf(id) !== -1) {
        unassignImage({
          variables: {
            imageId: id,
            variantId: variant.id
          }
        });
      } else {
        assignImage({
          variables: {
            imageId: id,
            variantId: variant.id
          }
        });
      }
    }
  };

  const handleUpdate = async (data: ProductVariantUpdateSubmitData) => {
    const uploadFilesResult = await handleUploadMultipleFiles(
      data.attributesWithNewFileValue,
      variables => uploadFile({ variables })
    );

    const deleteAttributeValuesResult = await handleDeleteMultipleAttributeValues(
      data.attributesWithNewFileValue,
      variant?.nonSelectionAttributes,
      variables => deleteAttributeValue({ variables })
    );

    const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
      data.attributesWithNewFileValue,
      uploadFilesResult
    );

    const result = await updateVariant({
      variables: {
        addStocks: data.addStocks.map(mapFormsetStockToStockInput),
        attributes: prepareAttributesInput({
          attributes: data.attributes,
          updatedFileAttributes
        }),
        id: variantId,
        removeStocks: data.removeStocks,
        sku: data.sku,
        stocks: data.updateStocks.map(mapFormsetStockToStockInput),
        trackInventory: data.trackInventory,
        weight: weight(data.weight)
      }
    });
    await handleSubmitChannels(data, variant);

    return [
      ...mergeFileUploadErrors(uploadFilesResult),
      ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult),
      ...result.data?.productVariantStocksCreate.errors,
      ...result.data?.productVariantStocksDelete.errors,
      ...result.data?.productVariantStocksUpdate.errors,
      ...result.data?.productVariantUpdate.errors
    ];
  };
  const handleSubmit = createMetadataUpdateHandler(
    data?.productVariant,
    handleUpdate,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables })
  );

  return (
    <>
      <WindowTitle title={data?.productVariant?.name} />
      <ProductVariantPage
        defaultWeightUnit={shop?.defaultWeightUnit}
        defaultVariantId={data?.productVariant.product.defaultVariant?.id}
        errors={errors}
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
        warehouses={
          warehouses.data?.warehouses.edges.map(edge => edge.node) || []
        }
        onAdd={() => navigate(productVariantAddUrl(productId))}
        onBack={handleBack}
        onDelete={() => openModal("remove")}
        onImageSelect={handleImageSelect}
        onSubmit={async data => {
          await handleSubmit(data);
          await handleSubmitChannels(data, variant);
        }}
        onWarehouseConfigure={() => navigate(warehouseAddPath)}
        onVariantClick={variantId => {
          navigate(productVariantEditUrl(productId, variantId));
        }}
        onVariantReorder={handleVariantReorder}
      />
      <ProductVariantDeleteDialog
        confirmButtonState={deleteVariantOpts.status}
        onClose={() => navigate(productVariantEditUrl(productId, variantId))}
        onConfirm={() =>
          deleteVariant({
            variables: {
              id: variantId
            }
          })
        }
        open={params.action === "remove"}
        name={data?.productVariant?.name}
      />
    </>
  );
};
export default ProductVariant;
