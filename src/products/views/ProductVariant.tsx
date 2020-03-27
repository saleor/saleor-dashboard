import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import placeholderImg from "@assets/images/placeholder255x255.png";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import NotFoundPage from "@saleor/components/NotFoundPage";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useWarehouseSearch from "@saleor/searches/useWarehouseSearch";
import { decimal } from "../../misc";
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
  ProductVariantEditUrlQueryParams,
  ProductVariantEditUrlDialog
} from "../urls";
import ProductWarehousesDialog from "../components/ProductWarehousesDialog";
import { useAddOrRemoveStocks } from "../mutations";

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

  const { result: searchWarehousesOpts } = useWarehouseSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 20
    }
  });

  const [addOrRemoveStocks, addOrRemoveStocksOpts] = useAddOrRemoveStocks({
    onCompleted: data => {
      if (
        data.productVariantStocksCreate.errors.length === 0 &&
        data.productVariantStocksDelete.errors.length === 0
      ) {
        notify({
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
      }
    }
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    ProductVariantEditUrlDialog,
    ProductVariantEditUrlQueryParams
  >(
    navigate,
    params => productVariantEditUrl(productId, variantId, params),
    params
  );

  const handleBack = () => navigate(productUrl(productId));

  return (
    <TypedProductVariantQuery displayLoader variables={{ id: variantId }}>
      {({ data, loading }) => {
        const variant = data?.productVariant;

        if (variant === null) {
          return <NotFoundPage onBack={handleBack} />;
        }

        const handleDelete = () => {
          notify({
            text: intl.formatMessage({
              defaultMessage: "Variant removed"
            })
          });
          navigate(productUrl(productId));
        };
        const handleUpdate = (data: VariantUpdate) => {
          if (data.productVariantUpdate.errors.length === 0) {
            notify({ text: intl.formatMessage(commonMessages.savedChanges) });
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
                unassignImage.opts.loading;

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
                    saveButtonBarState={updateVariant.opts.status}
                    loading={disableFormSave}
                    placeholderImage={placeholderImg}
                    variant={variant}
                    header={variant?.name || variant?.sku}
                    onAdd={() => navigate(productVariantAddUrl(productId))}
                    onBack={handleBack}
                    onDelete={() =>
                      navigate(
                        productVariantEditUrl(productId, variantId, {
                          action: "remove"
                        })
                      )
                    }
                    onImageSelect={handleImageSelect}
                    onSubmit={(data: ProductVariantPageSubmitData) =>
                      updateVariant.mutate({
                        attributes: data.attributes.map(attribute => ({
                          id: attribute.id,
                          values: [attribute.value]
                        })),
                        costPrice: decimal(data.costPrice),
                        id: variantId,
                        priceOverride: decimal(data.priceOverride),
                        sku: data.sku,
                        stocks: data.stocks.map(stock => ({
                          quantity: parseInt(stock.value, 10),
                          warehouse: stock.id
                        })),
                        trackInventory: data.trackInventory
                      })
                    }
                    onVariantClick={variantId => {
                      navigate(productVariantEditUrl(productId, variantId));
                    }}
                    onWarehousesEdit={() => openModal("edit-stocks")}
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
                  <ProductWarehousesDialog
                    confirmButtonState={addOrRemoveStocksOpts.status}
                    disabled={addOrRemoveStocksOpts.loading}
                    errors={[
                      ...(addOrRemoveStocksOpts.data?.productVariantStocksCreate
                        .errors || []),
                      ...(addOrRemoveStocksOpts.data?.productVariantStocksDelete
                        .errors || [])
                    ]}
                    onClose={closeModal}
                    open={params.action === "edit-stocks"}
                    warehouses={searchWarehousesOpts.data?.search.edges.map(
                      edge => edge.node
                    )}
                    warehousesWithStocks={
                      variant?.stocks.map(stock => stock.warehouse.id) || []
                    }
                    onConfirm={data =>
                      addOrRemoveStocks({
                        variables: {
                          add: data.added.map(id => ({
                            quantity: 0,
                            warehouse: id
                          })),
                          remove: data.removed,
                          variantId
                        }
                      })
                    }
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
