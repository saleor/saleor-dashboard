import CardTitle from "@dashboard/components/CardTitle";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import { DiscountErrorFragment } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { Card, CardContent, TextField } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";
import messages from "./messages";
import { useStyles } from "./styles";

interface VoucherLimitsProps {
  data: VoucherDetailsPageFormData;
  disabled: boolean;
  errors: DiscountErrorFragment[];
  initialUsageLimit: number;
  onChange: (event: React.ChangeEvent<any>) => void;
  setData: (data: Partial<VoucherDetailsPageFormData>) => void;
  isNewVoucher: boolean;
}

const VoucherLimits = ({
  data,
  disabled,
  errors,
  initialUsageLimit,
  onChange,
  setData,
  isNewVoucher,
}: VoucherLimitsProps) => {
  const intl = useIntl();
  const classes = useStyles();

  const formErrors = getFormErrors(["usageLimit"], errors);

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.usageLimitsTitle)} />
      <CardContent className={classes.cardContent}>
        {isNewVoucher && (
          <ControlledCheckbox
            testId="has-usage-limit"
            checked={data.hasUsageLimit}
            label={intl.formatMessage(messages.hasUsageLimit)}
            name={"hasUsageLimit" as keyof VoucherDetailsPageFormData}
            onChange={evt => {
              onChange(evt);
              setData({ usageLimit: initialUsageLimit });
            }}
          />
        )}
        {data.hasUsageLimit && isNewVoucher && (
          <TextField
            data-test-id="usage-limit"
            disabled={disabled}
            error={!!formErrors.usageLimit || data.usageLimit <= 0}
            helperText={getDiscountErrorMessage(formErrors.usageLimit, intl)}
            label={intl.formatMessage(messages.usageLimit)}
            name={"usageLimit" as keyof VoucherDetailsPageFormData}
            value={data.usageLimit}
            onChange={onChange}
            type="number"
            fullWidth
            inputProps={{
              min: 1,
            }}
          />
        )}
        <ControlledCheckbox
          testId="apply-once-per-customer"
          checked={data.applyOncePerCustomer}
          label={intl.formatMessage(messages.applyOncePerCustomer)}
          name={"applyOncePerCustomer" as keyof VoucherDetailsPageFormData}
          onChange={onChange}
        />
        <ControlledCheckbox
          testId="only-for-staff"
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
