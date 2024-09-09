import { DashboardCard } from "@dashboard/components/Card";
import { DiscountErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { Box, BoxProps, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { VoucherDetailsPageFormData } from "../VoucherDetailsPage";
import messages from "./messages";

interface VoucherLimitsProps {
  data: VoucherDetailsPageFormData;
  disabled: boolean;
  errors: DiscountErrorFragment[];
  initialUsageLimit: number;
  onChange: FormChange;
  setData: (data: Partial<VoucherDetailsPageFormData>) => void;
  isNewVoucher: boolean;
}

const defaultCheckboxInputContainerStyles = {
  marginBottom: 4,
  marginTop: 1,
  width: "100%",
} as BoxProps;

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
  const formErrors = getFormErrors(["usageLimit"], errors);
  const usesLeft = data.usageLimit - data.used;

  return (
    <DashboardCard data-test-id="usage-limit-section">
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(messages.usageLimitsTitle)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content display="flex" flexDirection="column">
        <Checkbox
          data-test-id="has-usage-limit"
          checked={data.hasUsageLimit}
          name={"hasUsageLimit" as keyof VoucherDetailsPageFormData}
          onCheckedChange={value => {
            onChange({
              target: {
                name: "hasUsageLimit",
                value: value,
              },
            });
            setData({ usageLimit: initialUsageLimit });
          }}
          marginY={1}
        >
          <Text>{intl.formatMessage(messages.hasUsageLimit)}</Text>
        </Checkbox>

        {data.hasUsageLimit &&
          (isNewVoucher ? (
            <Box {...defaultCheckboxInputContainerStyles}>
              <Input
                data-test-id="usage-limit"
                disabled={disabled}
                error={!!formErrors.usageLimit || data.usageLimit <= 0}
                helperText={getDiscountErrorMessage(formErrors.usageLimit, intl)}
                label={intl.formatMessage(messages.usageLimit)}
                name={"usageLimit" as keyof VoucherDetailsPageFormData}
                onChange={onChange}
                value={data.usageLimit}
                type="number"
                min={1}
              />
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="row"
              gap={6}
              {...defaultCheckboxInputContainerStyles}
            >
              <Box __flex={1}>
                <Input
                  data-test-id="usage-limit"
                  disabled={disabled}
                  error={!!formErrors.usageLimit || data.usageLimit <= 0}
                  helperText={getDiscountErrorMessage(formErrors.usageLimit, intl)}
                  label={intl.formatMessage(messages.usageLimit)}
                  name={"usageLimit" as keyof VoucherDetailsPageFormData}
                  value={data.usageLimit}
                  onChange={onChange}
                  type="number"
                  min={1}
                />
              </Box>

              <Box display="flex" flexDirection="column" __flex={1}>
                <Text size={2} fontWeight="light">
                  {intl.formatMessage(messages.usesLeftCaption)}
                </Text>
                <Text>{usesLeft >= 0 ? usesLeft : 0}</Text>
              </Box>
            </Box>
          ))}

        <Checkbox
          data-test-id="apply-once-per-customer"
          checked={data.applyOncePerCustomer}
          name={"applyOncePerCustomer" as keyof VoucherDetailsPageFormData}
          onCheckedChange={value => {
            onChange({
              target: {
                name: "applyOncePerCustomer",
                value: value,
              },
            });
          }}
          marginY={1}
        >
          <Text>{intl.formatMessage(messages.applyOncePerCustomer)}</Text>
        </Checkbox>

        <Checkbox
          data-test-id="only-for-staff"
          checked={data.onlyForStaff}
          name={"onlyForStaff" as keyof VoucherDetailsPageFormData}
          onCheckedChange={value => {
            onChange({
              target: {
                name: "onlyForStaff",
                value: value,
              },
            });
          }}
          marginY={1}
        >
          <Text>{intl.formatMessage(messages.onlyForStaff)}</Text>
        </Checkbox>

        <Checkbox
          data-test-id="single-use"
          checked={data.singleUse}
          name={"singleUse" as keyof VoucherDetailsPageFormData}
          onCheckedChange={value => {
            onChange({
              target: {
                name: "singleUse",
                value: value,
              },
            });
          }}
          marginY={1}
        >
          <Text>{intl.formatMessage(messages.singleUse)}</Text>
        </Checkbox>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default VoucherLimits;
