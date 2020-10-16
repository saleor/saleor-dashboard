import placeholderImg from "@assets/images/placeholder255x255.png";
import { createVariantChannels } from "@saleor/channels/utils";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { useProductVariantChannelListingUpdate } from "@saleor/products/mutations";
import { ProductVariantDetails_productVariant } from "@saleor/products/types/ProductVariantDetails";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { useWarehouseList } from "@saleor/warehouses/queries";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import ProductVariantDeleteDialog from "../components/ProductVariantDeleteDialog";
import ProductVariantPage, {
  ProductVariantPageSubmitData
} from "../components/ProductVariantPage";
import ProductVariantOperations from "../containers/ProductVariantOperations";
import { TypedProductVariantQuery } from "../queries";
import {
  VariantUpdate,
  VariantUpdate_productVariantUpdate_errors
} from "../types/VariantUpdate";
import {
  productUrl,
  productVariantAddUrl,
  productVariantEditUrl,
  ProductVariantEditUrlDialog,
  ProductVariantEditUrlQueryParams
} from "../urls";
import { mapFormsetStockToStockInput } from "../utils/data";

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

  const handleSubmitChannels = (
    data: ProductVariantPageSubmitData,
    variant: ProductVariantDetails_productVariant
  ) => {
    if (
      data.channelListing.some((channel, index) => {
        const variantChannel = variant.channelListing[index];
        return (
          channel.price !== variantChannel?.price.amount ||
          channel.price !== variantChannel?.costPrice.amount
        );
      })
    ) {
      updateChannels({
        variables: {
          id: variant.id,
          input: data.channelListing.map(listing => ({
            channelId: listing.id,
            costPrice: listing.costPrice,
            price: listing.price
          }))
        }
      });
    }
  };

  return (
    <TypedProductVariantQuery displayLoader variables={{ id: variantId }}>
      {({ data, loading }) => {
        const variant = data?.productVariant;
        const channels = createVariantChannels(variant);

        if (variant === null) {
          return <NotFoundPage onBack={handleBack} />;
        }

        const handleDelete = () => {
          notify({
            status: "success",
            text: intl.formatMessage({
              defaultMessage: "Variant removed"
            })
          });
          navigate(productUrl(productId));
        };
        const handleUpdate = (data: VariantUpdate) => {
          if (data.productVariantUpdate.errors.length === 0) {
            notify({
              status: "success",
              text: intl.formatMessage(commonMessages.savedChanges)
            });
          } else {
            setErrors(data.productVariantUpdate.errors);
          }
        };

        return (
          <ProductVariantOperations
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          >
            {({ assignImage, deleteVariant, updateVariant, unassignImage }) => {
              const disableFormSave =
                loading ||
                deleteVariant.opts.loading ||
                updateVariant.opts.loading ||
                assignImage.opts.loading ||
                unassignImage.opts.loading ||
                updateChannelsOpts.loading;

              const handleImageSelect = (id: string) => () => {
                if (variant) {
                  if (
                    variant.images &&
                    variant.images.map(image => image.id).indexOf(id) !== -1
                  ) {
                    unassignImage.mutate({
                      imageId: id,
                      variantId: variant.id
                    });
                  } else {
                    assignImage.mutate({
                      imageId: id,
                      variantId: variant.id
                    });
                  }
                }
              };

              return (
                <>
                  <WindowTitle title={data?.productVariant?.name} />
                  <ProductVariantPage
                    errors={errors}
                    channels={channels}
                    channelErrors={
                      updateChannelsOpts?.data
                        ?.productVariantChannelListingUpdate?.errors || []
                    }
                    saveButtonBarState={updateVariant.opts.status}
                    loading={disableFormSave}
                    placeholderImage={placeholderImg}
                    variant={variant}
                    header={variant?.name || variant?.sku}
                    warehouses={
                      warehouses.data?.warehouses.edges.map(
                        edge => edge.node
                      ) || []
                    }
                    onAdd={() => navigate(productVariantAddUrl(productId))}
                    onBack={handleBack}
                    onDelete={() => openModal("remove")}
                    onImageSelect={handleImageSelect}
                    onSubmit={(data: ProductVariantPageSubmitData) => {
                      updateVariant.mutate({
                        addStocks: data.addStocks.map(
                          mapFormsetStockToStockInput
                        ),
                        attributes: data.attributes.map(attribute => ({
                          id: attribute.id,
                          values: [attribute.value]
                        })),
                        id: variantId,
                        removeStocks: data.removeStocks,
                        sku: data.sku,
                        stocks: data.updateStocks.map(
                          mapFormsetStockToStockInput
                        ),
                        trackInventory: data.trackInventory
                      });
                      handleSubmitChannels(data, variant);
                    }}
                    onVariantClick={variantId => {
                      navigate(productVariantEditUrl(productId, variantId));
                    }}
                  />
                  <ProductVariantDeleteDialog
                    confirmButtonState={deleteVariant.opts.status}
                    onClose={() =>
                      navigate(productVariantEditUrl(productId, variantId))
                    }
                    onConfirm={() =>
                      deleteVariant.mutate({
                        id: variantId
                      })
                    }
                    open={params.action === "remove"}
                    name={data?.productVariant?.name}
                  />
                </>
              );
            }}
          </ProductVariantOperations>
        );
      }}
    </TypedProductVariantQuery>
  );
};
export default ProductVariant;
