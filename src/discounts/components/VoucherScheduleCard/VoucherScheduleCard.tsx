import { DiscountDates } from "@dashboard/discounts/components/DiscountDates/DiscountDates";
import {
  getVoucherSchedulePhase,
  type VoucherScheduleDateData,
} from "@dashboard/discounts/components/VoucherChannelAvailabilityCard/getVoucherSchedulePhase";
import { type DiscountErrorFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ChangeEvent } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { voucherScheduleMessages as messages } from "./messages";
import styles from "./VoucherScheduleCard.module.css";

interface VoucherScheduleCardProps {
  data: VoucherScheduleDateData;
  errors: DiscountErrorFragment[];
  disabled?: boolean;
  onChange: (event: ChangeEvent<any>) => void;
}

export const VoucherScheduleCard = ({
  data,
  errors,
  disabled,
  onChange,
}: VoucherScheduleCardProps): JSX.Element => {
  const intl = useIntl();
  const phase = getVoucherSchedulePhase(data);
  const statusMessage =
    phase === "scheduled"
      ? messages.statusScheduled
      : phase === "ended"
        ? messages.statusEnded
        : messages.statusActive;

  return (
    <Box className={styles.card} data-test-id="voucher-schedule-card">
      <Box className={styles.header}>
        <Text size={5} fontWeight="bold" as="h2">
          <FormattedMessage {...messages.title} />
        </Text>
        <Text size={2} color="default2" data-test-id="voucher-schedule-status">
          {intl.formatMessage(statusMessage)}
        </Text>
      </Box>
      <Box className={styles.intro}>
        <Text size={3} color="default2">
          <FormattedMessage {...messages.intro} />
        </Text>
      </Box>
      <Box className={styles.body} data-test-id="voucher-availability-schedule">
        <DiscountDates
          data={data}
          disabled={!!disabled}
          errors={errors}
          onChange={onChange}
          unwrapped
        />
      </Box>
    </Box>
  );
};
