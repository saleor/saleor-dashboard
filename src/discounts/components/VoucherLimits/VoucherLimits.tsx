import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import { getFieldError } from "@saleor/utils/errors";
import { UserError } from "../../../types";
import { FormData } from "../VoucherDetailsPage";

interface VoucherLimitsProps {
  data: FormData;
  defaultCurrency: string;
  disabled: boolean;
  errors: UserError[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const VoucherLimits = ({
  data,
  disabled,
  errors,
  onChange
}: VoucherLimitsProps) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Usage Limit",
          description: "voucher usage limit, header"
        })}
      />
      <CardContent>
        <ControlledCheckbox
          checked={data.hasUsageLimit}
          label={intl.formatMessage({
            defaultMessage:
              "Limit number of times this discount can be used in total"
          })}
          name={"hasUsageLimit" as keyof FormData}
          onChange={onChange}
        />
        {data.hasUsageLimit && (
          <TextField
            disabled={disabled}
            error={!!getFieldError(errors, "usageLimit")}
            helperText={getFieldError(errors, "usageLimit")?.message}
            label={intl.formatMessage({
              defaultMessage: "Limit of Uses",
              description: "voucher"
            })}
            name={"usageLimit" as keyof FormData}
            value={data.usageLimit}
            onChange={onChange}
            type="number"
            inputProps={{
              min: 0
            }}
            fullWidth
          />
        )}
        <ControlledCheckbox
          checked={data.applyOncePerCustomer}
          label={intl.formatMessage({
            defaultMessage: "Limit to one use per customer",
            description: "limit voucher"
          })}
          name={"applyOncePerCustomer" as keyof FormData}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
export default VoucherLimits;
