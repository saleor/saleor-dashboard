import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import placeholderImg from "@assets/images/placeholder255x255.png";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { decimal, maybe } from "../../misc";
import ProductVariantDeleteDialog from "../components/ProductVariantDeleteDialog";
import ProductVariantPage, {
  ProductVariantPageSubmitData
} from "../components/ProductVariantPage";
import ProductVariantOperations from "../containers/ProductVariantOperations";
import { TypedProductVariantQuery } from "../queries";
import {
  VariantUpdate,
  VariantUpdate_productVariantUpdate_productErrors
} from "../types/VariantUpdate";
import {
  productUrl,
  productVariantAddUrl,
  productVariantEditUrl,
  ProductVariantEditUrlQueryParams
} from "../urls";

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
    VariantUpdate_productVariantUpdate_productErrors[]
  >([]);
  useEffect(() => {
    setErrors([]);
  }, [variantId]);

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
          if (!data.productVariantUpdate.productErrors.length) {
            notify({ text: intl.formatMessage(commonMessages.savedChanges) });
          } else {
            setErrors(data.productVariantUpdate.productErrors);
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
                  <WindowTitle title={maybe(() => data.productVariant.name)} />
                  <ProductVariantPage
                    errors={errors}
                    saveButtonBarState={updateVariant.opts.status}
                    loading={disableFormSave}
                    placeholderImage={placeholderImg}
                    variant={variant}
                    header={variant ? variant.name || variant.sku : undefined}
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
                    onSubmit={(data: ProductVariantPageSubmitData) => {
                      if (variant) {
                        updateVariant.mutate({
                          attributes: data.attributes.map(attribute => ({
                            id: attribute.id,
                            values: [attribute.value]
                          })),
                          costPrice: decimal(data.costPrice),
                          id: variantId,
                          priceOverride: decimal(data.priceOverride),
                          quantity: parseInt(data.quantity, 0),
                          sku: data.sku,
                          trackInventory: true // FIXME: missing in UI
                        });
                      }
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
                    name={maybe(() => data.productVariant.name)}
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
