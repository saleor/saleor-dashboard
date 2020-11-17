import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CardTitle from "@saleor/components/CardTitle";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import { DiscountErrorFragment } from "@saleor/fragments/types/DiscountErrorFragment";
import { getFormErrors } from "@saleor/utils/errors";
import getDiscountErrorMessage from "@saleor/utils/errors/discounts";
import React from "react";
import { useIntl } from "react-intl";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";

interface VoucherLimitsProps {
  data: VoucherDetailsPageFormData;
  disabled: boolean;
  errors: DiscountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const VoucherLimits = ({
  data,
  disabled,
  errors,
  onChange
}: VoucherLimitsProps) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["usageLimit"], errors);

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
          name={"hasUsageLimit" as keyof VoucherDetailsPageFormData}
          onChange={onChange}
        />
        {data.hasUsageLimit && (
          <TextField
            disabled={disabled}
            error={!!formErrors.usageLimit}
            helperText={getDiscountErrorMessage(formErrors.usageLimit, intl)}
            label={intl.formatMessage({
              defaultMessage: "Limit of Uses",
              description: "voucher"
            })}
            name={"usageLimit" as keyof VoucherDetailsPageFormData}
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
          name={"applyOncePerCustomer" as keyof VoucherDetailsPageFormData}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
export default VoucherLimits;
