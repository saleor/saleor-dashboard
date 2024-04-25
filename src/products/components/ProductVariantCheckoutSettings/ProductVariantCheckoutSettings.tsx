import { DashboardCard } from "@dashboard/components/Card";
import PreviewPill from "@dashboard/components/PreviewPill";
import { ProductErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import { Input } from "@saleor/macaw-ui-next";
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

const ProductVariantCheckoutSettings: React.FC<ProductVariantCheckoutSettingsProps> = props => {
  const { data, disabled, errors, onChange } = props;
  const intl = useIntl();
  const classes = useStyles();
  const formErrors = getFormErrors(["quantityLimitPerCustomer"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Title>
        {intl.formatMessage(messages.checkoutLimits)}
        <PreviewPill className={classes.preview} />
      </DashboardCard.Title>
      <DashboardCard.Content>
        <Input
          data-test-id="checkout-limit-input"
          width="100%"
          disabled={disabled}
          error={!!formErrors.quantityLimitPerCustomer}
          type="number"
          name="quantityLimitPerCustomer"
          label={intl.formatMessage(messages.checkoutLineLimit)}
          helperText={intl.formatMessage(messages.checkoutLimitsDescription)}
          value={data.quantityLimitPerCustomer ? String(data.quantityLimitPerCustomer) : ""}
          onChange={onChange}
          min={1}
          autoComplete="off"
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductVariantCheckoutSettings.displayName = "ProductVariantCheckoutSettings";
export default ProductVariantCheckoutSettings;
