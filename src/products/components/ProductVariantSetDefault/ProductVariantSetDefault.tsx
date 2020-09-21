import CardMenu from "@saleor/components/CardMenu";
import useNotifier from "@saleor/hooks/useNotifier";
import { useProductVariantSetDefaultMutation } from "@saleor/products/mutations";
import { getProductErrorMessage } from "@saleor/utils/errors";
import React from "react";
import { useIntl } from "react-intl";

interface SimpleProductVariant {
  id: string;
  sku: string;
  default?: boolean;
  name: string;
}

interface ProductVariantSetDefaultProps {
  variant: SimpleProductVariant;
  productId?: string;
}

const ProductVariantSetDefault: React.FC<ProductVariantSetDefaultProps> = ({
  variant,
  productId
}) => {
  const intl = useIntl();
  const notify = useNotifier();

  const getProductVariantSetDefaultVariables = (
    productId: string,
    variantId: string
  ) => ({
    variables: {
      productId,
      variantId
    }
  });

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
        notify({
          status: "success",
          text: intl.formatMessage(
            {
              defaultMessage: "Variant {name} has been set as default!."
            },
            { name: variant.name }
          )
        });
      }
    }
  });

  const onSetDefaultVariant = variant => {
    productVariantSetDefault(
      getProductVariantSetDefaultVariables(
        productId || variant.product.id,
        variant.id
      )
    );
  };

  return (
    <CardMenu
      menuItems={[
        {
          label: intl.formatMessage({
            defaultMessage: "Set as default",
            description: "set variant as default, button"
          }),
          onSelect: () => onSetDefaultVariant(variant),
          testId: "setDefault"
        }
      ]}
      data-test="menu"
    />
  );
};
export default ProductVariantSetDefault;
