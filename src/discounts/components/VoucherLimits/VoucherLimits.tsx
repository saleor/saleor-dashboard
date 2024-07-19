import { DashboardCard } from "@dashboard/components/Card";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import { Grid } from "@dashboard/components/Grid";
import { DiscountErrorFragment } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
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
    <DashboardCard data-test-id="usage-limit-section">
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(messages.usageLimitsTitle)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content className={classes.cardContent}>
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
                helperText={getDiscountErrorMessage(formErrors.usageLimit, intl)}
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
                <Text size={2} fontWeight="light">
                  {intl.formatMessage(messages.usesLeftCaption)}
                </Text>
                <Text>{usesLeft >= 0 ? usesLeft : 0}</Text>
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

        <ControlledCheckbox
          testId="single-use"
          checked={data.singleUse}
          label={intl.formatMessage(messages.singleUse)}
          name={"singleUse" satisfies keyof VoucherDetailsPageFormData}
          onChange={onChange}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default VoucherLimits;
