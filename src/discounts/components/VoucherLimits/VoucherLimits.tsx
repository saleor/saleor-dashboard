import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import { Grid } from "@saleor/components/Grid";
import { DiscountErrorFragment } from "@saleor/graphql";
import { getFormErrors } from "@saleor/utils/errors";
import getDiscountErrorMessage from "@saleor/utils/errors/discounts";
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

  const usesLeft = data.usageLimit - data.used;

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.usageLimitsTitle)} />
      <CardContent className={classes.cardContent}>
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
        {data.hasUsageLimit &&
          (isNewVoucher ? (
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
          ) : (
            <Grid variant="uniform">
              <TextField
                data-test-id="usage-limit"
                disabled={disabled}
                error={!!formErrors.usageLimit || data.usageLimit <= 0}
                helperText={getDiscountErrorMessage(
                  formErrors.usageLimit,
                  intl,
                )}
                label={intl.formatMessage(messages.usageLimit)}
                name={"usageLimit" as keyof VoucherDetailsPageFormData}
                value={data.usageLimit}
                onChange={onChange}
                type="number"
                inputProps={{
                  min: 1,
                }}
              />
              <div className={classes.usesLeftLabelWrapper}>
                <Typography variant="caption">
                  {intl.formatMessage(messages.usesLeftCaption)}
                </Typography>
                <Typography>{usesLeft >= 0 ? usesLeft : 0}</Typography>
              </div>
            </Grid>
          ))}
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
