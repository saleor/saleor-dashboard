import { Box, Button } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

interface ProductVariantSetDefaultProps {
  onSetDefaultVariant: () => void;
}

const ProductVariantSetDefault = ({ onSetDefaultVariant }: ProductVariantSetDefaultProps) => {
  const intl = useIntl();

  return (
    <Box display="flex" alignItems="center" height="100%">
      <Button variant="secondary" onClick={onSetDefaultVariant} data-test-id="setDefault">
        {intl.formatMessage({
          id: "SZH0fw",
          defaultMessage: "Set as default",
          description: "set variant as default, button",
        })}
      </Button>
    </Box>
  );
};

ProductVariantSetDefault.displayName = "ProductVariantSetDefault";
export default ProductVariantSetDefault;
