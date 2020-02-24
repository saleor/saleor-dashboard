import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { FormChange } from "@saleor/hooks/useForm";
import { UserError } from "@saleor/types";
import { SaleType } from "@saleor/types/globalTypes";
import { getFieldError } from "@saleor/utils/errors";
import { FormData } from "../SaleDetailsPage";

export interface SaleValueProps {
  currencySymbol: string;
  data: FormData;
  disabled: boolean;
  errors: UserError[];
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
          error={!!getFieldError(errors, "value")}
          name="value"
          InputProps={{
            endAdornment: data.type === SaleType.FIXED ? currencySymbol : "%"
          }}
          helperText={getFieldError(errors, "value")?.message}
          value={data.value}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};

SaleValue.displayName = "SaleValue";
export default SaleValue;
