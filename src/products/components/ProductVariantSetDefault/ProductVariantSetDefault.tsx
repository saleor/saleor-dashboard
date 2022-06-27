import CardMenu from "@saleor/components/CardMenu";
import React from "react";
import { useIntl } from "react-intl";

interface ProductVariantSetDefaultProps {
  onSetDefaultVariant: () => void;
}

const ProductVariantSetDefault: React.FC<ProductVariantSetDefaultProps> = ({
  onSetDefaultVariant,
}) => {
  const intl = useIntl();

  return (
    <CardMenu
      menuItems={[
        {
          label: intl.formatMessage({
            id: "SZH0fw",
            defaultMessage: "Set as default",
            description: "set variant as default, button",
          }),
          onSelect: onSetDefaultVariant,
          testId: "setDefault",
        },
      ]}
      data-test-id="menu"
    />
  );
};

ProductVariantSetDefault.displayName = "ProductVariantSetDefault";
export default ProductVariantSetDefault;
