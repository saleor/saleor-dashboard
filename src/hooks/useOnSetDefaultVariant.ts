import useNotifier from "@saleor/hooks/useNotifier";
import { useProductVariantSetDefaultMutation } from "@saleor/products/mutations";
import { getProductErrorMessage } from "@saleor/utils/errors";
import { useIntl } from "react-intl";

import { ProductDetails_product_variants } from "../products/types/ProductDetails";
import { VariantUpdate_productVariantUpdate_productVariant } from "../products/types/VariantUpdate";

function useOnSetDefaultVariant(
  productId: string,
  variant:
    | ProductDetails_product_variants
    | VariantUpdate_productVariantUpdate_productVariant
) {
  const notify = useNotifier();
  const intl = useIntl();

  const [productVariantSetDefault] = useProductVariantSetDefaultMutation({
    onCompleted: data => {
      const errors = data.productVariantSetDefault.errors;
      if (errors.length) {
        errors.map(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl)
          })
        );
      } else {
        const defaultVariant = data.productVariantSetDefault.product.variants.find(
          variant =>
            variant.id ===
            data.productVariantSetDefault.product.defaultVariant.id
        );
        if (defaultVariant) {
          notify({
            status: "success",
            text: intl.formatMessage(
              {
                defaultMessage: "Variant {name} has been set as default."
              },
              { name: defaultVariant.name }
            )
          });
        }
      }
    }
  });

  const onSetDefaultVariant = (selectedVariant = null) => {
    productVariantSetDefault({
      variables: {
        productId,
        variantId: variant ? variant.id : selectedVariant.id
      }
    });
  };

  return onSetDefaultVariant;
}
export default useOnSetDefaultVariant;
