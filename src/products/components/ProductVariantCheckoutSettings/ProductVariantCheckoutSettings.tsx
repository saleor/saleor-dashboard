import { Card, CardContent, TextField } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { getFormErrors } from "@saleor/utils/errors";
import createPositiveValueChangeHandler from "@saleor/utils/handlers/positiveValueChangeHandler";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface ProductVariantCheckoutSettingsProps {
  data: {
    quantityLimitPerCustomer: number | null;
  };
  disabled: boolean;
  errors: ProductErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductVariantCheckoutSettings: React.FC<ProductVariantCheckoutSettingsProps> = props => {
  const { data, disabled, errors, onChange } = props;

  const intl = useIntl();

  const formErrors = getFormErrors(["quantityLimitPerCustomer"], errors);
  const handleChange = createPositiveValueChangeHandler(onChange);

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.checkoutLimits)} />
      <CardContent>
        <TextField
          disabled={disabled}
          error={!!formErrors.quantityLimitPerCustomer}
          type="number"
          fullWidth
          name="quantityLimitPerCustomer"
          label={intl.formatMessage(messages.checkoutLineLimit)}
          helperText={intl.formatMessage(messages.checkoutLimitsDescription)}
          value={
            !!data.quantityLimitPerCustomer
              ? String(data.quantityLimitPerCustomer)
              : ""
          }
          onChange={handleChange}
          InputProps={{
            inputProps: {
              autoComplete: "none",
              min: 1
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

ProductVariantCheckoutSettings.displayName = "ProductVariantCheckoutSettings";
export default ProductVariantCheckoutSettings;
