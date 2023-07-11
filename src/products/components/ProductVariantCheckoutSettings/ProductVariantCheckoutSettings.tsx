import CardTitle from "@dashboard/components/CardTitle";
import PreviewPill from "@dashboard/components/PreviewPill";
import { ProductErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import { Card, CardContent, TextField } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import useStyles from "./styles";

interface ProductVariantCheckoutSettingsProps {
  data: {
    quantityLimitPerCustomer: number | null;
  };
  disabled: boolean;
  errors: ProductErrorFragment[];
  onChange: FormChange;
}

const ProductVariantCheckoutSettings: React.FC<
  ProductVariantCheckoutSettingsProps
> = props => {
  const { data, disabled, errors, onChange } = props;

  const intl = useIntl();
  const classes = useStyles();

  const formErrors = getFormErrors(["quantityLimitPerCustomer"], errors);

  return (
    <Card>
      <CardTitle
        title={
          <>
            {intl.formatMessage(messages.checkoutLimits)}
            <PreviewPill className={classes.preview} />
          </>
        }
      />
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
          onChange={onChange}
          InputProps={{
            inputProps: {
              autoComplete: "none",
              min: 1,
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

ProductVariantCheckoutSettings.displayName = "ProductVariantCheckoutSettings";
export default ProductVariantCheckoutSettings;
