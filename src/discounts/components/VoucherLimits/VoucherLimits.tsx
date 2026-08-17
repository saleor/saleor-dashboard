import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import {
  DetailSettingNestedField,
  DetailSettingToggleRow,
} from "@dashboard/components/DetailSettingToggleRow/DetailSettingToggleRow";
import { Grid } from "@dashboard/components/Grid";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { voucherFeedbackMessages } from "@dashboard/discounts/voucherFeedbackMessages";
import { DiscountErrorCode, type DiscountErrorFragment } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { TextField } from "@material-ui/core";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Lock } from "lucide-react";
import { type ChangeEvent, type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type VoucherDetailsPageFormData } from "../VoucherDetailsPage";
import messages from "./messages";
import styles from "./VoucherLimits.module.css";

const LockedSettingNotice = ({
  children,
  "data-test-id": dataTestId,
}: {
  children: ReactNode;
  "data-test-id"?: string;
}): JSX.Element => (
  <div className={styles.lockedNotice} data-test-id={dataTestId} role="status">
    <Lock
      className={styles.lockedNoticeIcon}
      size={iconSize.small}
      strokeWidth={iconStrokeWidthBySize.small}
      aria-hidden
    />
    <Text as="p" size={2} color="default2" className={styles.lockedNoticeText}>
      {children}
    </Text>
  </div>
);

interface VoucherLimitsProps {
  data: VoucherDetailsPageFormData;
  disabled: boolean;
  loading?: boolean;
  errors: DiscountErrorFragment[];
  initialUsageLimit: number;
  onChange: (event: ChangeEvent<any>) => void;
  setData: (data: Partial<VoucherDetailsPageFormData>) => void;
  isNewVoucher: boolean;
}

export const VoucherLimits = ({
  data,
  disabled,
  loading = false,
  errors,
  initialUsageLimit,
  onChange,
  setData,
  isNewVoucher,
}: VoucherLimitsProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["usageLimit", "singleUse"], errors);
  const usesLeft = data.usageLimit - data.used;
  const hasInvalidUsageLimit = data.hasUsageLimit && data.usageLimit <= 0;
  const usageLimitHelperText =
    getDiscountErrorMessage(formErrors.usageLimit, intl) ||
    (hasInvalidUsageLimit ? intl.formatMessage(voucherFeedbackMessages.usageLimitMin) : undefined);
  // API also locks when a code sits on an open checkout (voucher.used can still be 0).
  // Disable only for recorded redemptions; on VOUCHER_ALREADY_USED keep the control
  // enabled so the merchant can undo the rejected change, but show the notice.
  const usageSettingsLocked = !isNewVoucher && data.used > 0;
  const singleUseShowLockNotice =
    usageSettingsLocked ||
    errors.some(
      error => error.code === DiscountErrorCode.VOUCHER_ALREADY_USED && error.field === "singleUse",
    );
  const usageLimitShowLockNotice =
    usageSettingsLocked ||
    errors.some(
      error =>
        error.code === DiscountErrorCode.VOUCHER_ALREADY_USED && error.field === "usageLimit",
    );
  const singleUseLockedNotice = intl.formatMessage(messages.singleUseLockedNotice);
  const usageLimitLockedNotice = intl.formatMessage(messages.usageLimitLockedNotice);

  return (
    <DetailSettingsCard
      data-test-id="usage-limit-section"
      title={intl.formatMessage(messages.usageLimitsTitle)}
      intro={
        <Text size={3} color="default2">
          <FormattedMessage
            id="tU6CwL"
            defaultMessage="Control how many times this voucher can be redeemed and who can use it."
            description="voucher limits section intro"
          />
        </Text>
      }
      contentFlush
    >
      {loading ? (
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          paddingX={6}
          paddingY={4}
          data-test-id="usage-limit-section-skeleton"
        >
          <Skeleton __height="3.5rem" />
          <Skeleton __height="3.5rem" />
          <Skeleton __height="3.5rem" />
          <Skeleton __height="3.5rem" />
        </Box>
      ) : (
        <>
          <DetailSettingToggleRow
            testId="has-usage-limit"
            title={intl.formatMessage(messages.hasUsageLimit)}
            description={
              <FormattedMessage
                id="jVfo2X"
                defaultMessage="Caps total redemptions across all customers and codes."
                description="voucher total usage limit description"
              />
            }
            pressed={data.hasUsageLimit}
            onPressedChange={pressed => {
              onChange({
                target: {
                  name: "hasUsageLimit",
                  value: pressed,
                },
              } as ChangeEvent<any>);
              setData({ usageLimit: initialUsageLimit });
            }}
            disabled={disabled || usageSettingsLocked}
            notice={
              usageLimitShowLockNotice ? (
                <LockedSettingNotice data-test-id="usage-limit-locked-notice">
                  {usageLimitLockedNotice}
                </LockedSettingNotice>
              ) : null
            }
          >
            {data.hasUsageLimit ? (
              <DetailSettingNestedField>
                {isNewVoucher ? (
                  <TextField
                    data-test-id="usage-limit"
                    disabled={disabled || usageSettingsLocked}
                    error={!!formErrors.usageLimit || hasInvalidUsageLimit}
                    helperText={usageLimitHelperText}
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
                      disabled={disabled || usageSettingsLocked}
                      error={!!formErrors.usageLimit || hasInvalidUsageLimit}
                      helperText={usageLimitHelperText}
                      label={intl.formatMessage(messages.usageLimit)}
                      name={"usageLimit" as keyof VoucherDetailsPageFormData}
                      value={data.usageLimit}
                      onChange={onChange}
                      type="number"
                      inputProps={{
                        min: 1,
                      }}
                    />
                    <div className={styles.usesLeftLabelWrapper}>
                      <Text size={2} fontWeight="light">
                        {intl.formatMessage(messages.usesLeftCaption)}
                      </Text>
                      <Text>{usesLeft >= 0 ? usesLeft : 0}</Text>
                    </div>
                  </Grid>
                )}
              </DetailSettingNestedField>
            ) : null}
          </DetailSettingToggleRow>

          <DetailSettingToggleRow
            testId="apply-once-per-customer"
            title={intl.formatMessage(messages.applyOncePerCustomer)}
            description={<FormattedMessage {...messages.applyOncePerCustomerDescription} />}
            pressed={data.applyOncePerCustomer}
            onPressedChange={pressed =>
              onChange({
                target: {
                  name: "applyOncePerCustomer",
                  value: pressed,
                },
              } as ChangeEvent<any>)
            }
            disabled={disabled}
          />

          <DetailSettingToggleRow
            testId="single-use"
            title={intl.formatMessage(messages.singleUse)}
            description={<FormattedMessage {...messages.singleUseDescription} />}
            pressed={data.singleUse}
            onPressedChange={pressed =>
              onChange({
                target: {
                  name: "singleUse",
                  value: pressed,
                },
              } as ChangeEvent<any>)
            }
            disabled={disabled || usageSettingsLocked}
            notice={
              singleUseShowLockNotice ? (
                <LockedSettingNotice data-test-id="single-use-locked-notice">
                  {singleUseLockedNotice}
                </LockedSettingNotice>
              ) : null
            }
          />

          <DetailSettingToggleRow
            testId="only-for-staff"
            title={intl.formatMessage(messages.onlyForStaff)}
            description={
              <FormattedMessage
                id="jT/uX4"
                defaultMessage="Only staff users can apply this voucher at checkout."
                description="voucher staff only description"
              />
            }
            pressed={data.onlyForStaff}
            onPressedChange={pressed =>
              onChange({
                target: {
                  name: "onlyForStaff",
                  value: pressed,
                },
              } as ChangeEvent<any>)
            }
            disabled={disabled}
          />
        </>
      )}
    </DetailSettingsCard>
  );
};

export default VoucherLimits;
