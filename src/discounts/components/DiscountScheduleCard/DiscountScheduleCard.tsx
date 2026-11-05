import { DiscountDates } from "@dashboard/discounts/components/DiscountDates/DiscountDates";
import { type ScheduleDateField } from "@dashboard/discounts/components/DiscountDates/incompleteScheduleFields";
import { type VoucherScheduleDateData } from "@dashboard/discounts/components/VoucherChannelAvailabilityCard/getVoucherSchedulePhase";
import { getVoucherFormStatus } from "@dashboard/discounts/voucherStatus";
import { voucherStatusMessages } from "@dashboard/discounts/voucherStatusMessages";
import { type CommonError } from "@dashboard/utils/errors/common";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { type ChangeEvent, type FocusEvent, type ReactNode } from "react";
import { type FieldError } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./DiscountScheduleCard.module.css";
import { discountScheduleMessages as messages } from "./messages";

interface DiscountScheduleCardProps<ErrorCode> {
  data: VoucherScheduleDateData;
  errors: Array<CommonError<ErrorCode>>;
  /** Leading copy under the header — voucher vs promotion wording. */
  intro: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  formErrors?: {
    startDate?: FieldError;
  };
  incompleteFields?: readonly ScheduleDateField[];
  onIncompleteFieldsChange?: (fields: ScheduleDateField[]) => void;
  /** Vouchers only: every use the usage limit allows is taken. */
  usageLimitReached?: boolean;
  onChange: (event: ChangeEvent<any>) => void;
  onBlur?: (event: FocusEvent<any>) => void;
  "data-test-id"?: string;
  statusTestId?: string;
  fieldsTestId?: string;
  skeletonTestId?: string;
}

/**
 * Shared sidebar Schedule card for vouchers and promotions.
 * Date fields come from {@link DiscountDates}; only `intro` (and optional RHF props) differ per entity.
 */
export const DiscountScheduleCard = <ErrorCode,>({
  data,
  errors,
  intro,
  disabled,
  loading = false,
  formErrors,
  incompleteFields,
  onIncompleteFieldsChange,
  usageLimitReached = false,
  onChange,
  onBlur,
  "data-test-id": dataTestId = "discount-schedule-card",
  statusTestId,
  fieldsTestId,
  skeletonTestId,
}: DiscountScheduleCardProps<ErrorCode>): React.ReactNode => {
  const intl = useIntl();
  const status = getVoucherFormStatus({ scheduleData: data, usageLimitReached });
  const statusMessage =
    status === "scheduled"
      ? messages.statusScheduled
      : status === "finished"
        ? messages.statusEnded
        : status === "usedUp"
          ? voucherStatusMessages.usedUp
          : messages.statusActive;
  const resolvedStatusTestId = statusTestId ?? `${dataTestId}-status`;
  const resolvedFieldsTestId = fieldsTestId ?? `${dataTestId}-fields`;
  const resolvedSkeletonTestId = skeletonTestId ?? `${dataTestId}-skeleton`;

  return (
    <Box className={styles.card} data-test-id={dataTestId}>
      <Box className={styles.header}>
        <Text size={5} fontWeight="bold" as="h2">
          <FormattedMessage {...messages.title} />
        </Text>
        {loading ? (
          <Skeleton __width="4rem" __height="0.875rem" data-test-id={resolvedStatusTestId} />
        ) : (
          <Text size={2} color="default2" data-test-id={resolvedStatusTestId}>
            {intl.formatMessage(statusMessage)}
          </Text>
        )}
      </Box>
      <Box className={styles.intro}>
        <Text size={3} color="default2">
          {intro}
        </Text>
      </Box>
      <Box className={styles.body} data-test-id={resolvedFieldsTestId}>
        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            gap={3}
            data-test-id={resolvedSkeletonTestId}
            aria-busy="true"
          >
            <Skeleton __height="2.5rem" />
            <Skeleton __height="2.5rem" />
            <Skeleton __height="2.5rem" />
          </Box>
        ) : (
          <DiscountDates
            data={data}
            disabled={!!disabled}
            errors={errors}
            formErrors={formErrors}
            incompleteFields={incompleteFields}
            onIncompleteFieldsChange={onIncompleteFieldsChange}
            onChange={onChange}
            onBlur={onBlur}
            unwrapped
          />
        )}
      </Box>
    </Box>
  );
};
