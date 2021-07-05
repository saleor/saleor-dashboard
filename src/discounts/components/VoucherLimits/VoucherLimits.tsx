import { Card, CardContent, TextField } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import { DiscountErrorFragment } from "@saleor/fragments/types/DiscountErrorFragment";
import { getFormErrors } from "@saleor/utils/errors";
import getDiscountErrorMessage from "@saleor/utils/errors/discounts";
import React from "react";
import { useIntl } from "react-intl";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";
import messages from "./messages";

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
      <CardTitle title={intl.formatMessage(messages.usageLimitsTitle)} />
      <CardContent>
        <ControlledCheckbox
          checked={data.hasUsageLimit}
          label={intl.formatMessage(messages.hasUsageLimit)}
          name={"hasUsageLimit" as keyof VoucherDetailsPageFormData}
          onChange={onChange}
        />
        {data.hasUsageLimit && (
          <TextField
            disabled={disabled}
            error={!!formErrors.usageLimit}
            helperText={getDiscountErrorMessage(formErrors.usageLimit, intl)}
            label={intl.formatMessage(messages.usageLimit)}
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
          label={intl.formatMessage(messages.applyOncePerCustomer)}
          name={"applyOncePerCustomer" as keyof VoucherDetailsPageFormData}
          onChange={onChange}
        />
        <ControlledCheckbox
          checked={data.onlyForStaff}
          label={intl.formatMessage(messages.onlyForStaff)}
          name={"onlyForStaff" as keyof VoucherDetailsPageFormData}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
export default VoucherLimits;
