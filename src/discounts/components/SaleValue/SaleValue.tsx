import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CardTitle from "@saleor/components/CardTitle";
import { DiscountErrorFragment } from "@saleor/fragments/types/DiscountErrorFragment";
import { FormChange } from "@saleor/hooks/useForm";
import { SaleType } from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import getDiscountErrorMessage from "@saleor/utils/errors/discounts";
import React from "react";
import { useIntl } from "react-intl";

import { SaleDetailsPageFormData } from "../SaleDetailsPage";

export interface SaleValueProps {
  currencySymbol: string;
  data: SaleDetailsPageFormData;
  disabled: boolean;
  errors: DiscountErrorFragment[];
  onChange: FormChange;
}

const SaleValue: React.FC<SaleValueProps> = ({
  currencySymbol,
  data,
  disabled,
  errors,
  onChange
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["value"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Value",
          description: "sale value, header"
        })}
      />
      <CardContent>
        <TextField
          disabled={disabled}
          fullWidth
          label={intl.formatMessage({
            defaultMessage: "Discount Value",
            description: "sale discount"
          })}
          error={!!formErrors.value}
          name="value"
          InputProps={{
            endAdornment: data.type === SaleType.FIXED ? currencySymbol : "%"
          }}
          helperText={getDiscountErrorMessage(formErrors.value, intl)}
          value={data.value}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};

SaleValue.displayName = "SaleValue";
export default SaleValue;
