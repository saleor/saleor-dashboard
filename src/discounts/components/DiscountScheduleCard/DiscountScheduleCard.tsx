import { DiscountDates } from "@dashboard/discounts/components/DiscountDates/DiscountDates";
import {
  getVoucherSchedulePhase,
  type VoucherScheduleDateData,
} from "@dashboard/discounts/components/VoucherChannelAvailabilityCard/getVoucherSchedulePhase";
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
  onChange,
  onBlur,
  "data-test-id": dataTestId = "discount-schedule-card",
  statusTestId,
  fieldsTestId,
  skeletonTestId,
}: DiscountScheduleCardProps<ErrorCode>): JSX.Element => {
  const intl = useIntl();
  const phase = getVoucherSchedulePhase(data);
  const statusMessage =
    phase === "scheduled"
      ? messages.statusScheduled
      : phase === "ended"
        ? messages.statusEnded
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
            onChange={onChange}
            onBlur={onBlur}
            unwrapped
          />
        )}
      </Box>
    </Box>
  );
};
