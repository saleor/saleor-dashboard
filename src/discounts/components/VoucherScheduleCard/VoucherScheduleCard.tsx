import { DiscountScheduleCard } from "@dashboard/discounts/components/DiscountScheduleCard/DiscountScheduleCard";
import { type VoucherScheduleDateData } from "@dashboard/discounts/components/VoucherChannelAvailabilityCard/getVoucherSchedulePhase";
import { type DiscountErrorFragment } from "@dashboard/graphql";
import { type ChangeEvent } from "react";
import { FormattedMessage } from "react-intl";

import { voucherScheduleMessages as messages } from "./messages";

interface VoucherScheduleCardProps {
  data: VoucherScheduleDateData;
  errors: DiscountErrorFragment[];
  disabled?: boolean;
  loading?: boolean;
  onChange: (event: ChangeEvent<any>) => void;
}

/** Voucher sidebar schedule — shared {@link DiscountScheduleCard} with voucher intro copy. */
export const VoucherScheduleCard = ({
  data,
  errors,
  disabled,
  loading = false,
  onChange,
}: VoucherScheduleCardProps): JSX.Element => (
  <DiscountScheduleCard
    data={data}
    errors={errors}
    disabled={disabled}
    loading={loading}
    onChange={onChange}
    data-test-id="voucher-schedule-card"
    statusTestId="voucher-schedule-status"
    fieldsTestId="voucher-availability-schedule"
    skeletonTestId="voucher-schedule-skeleton"
    intro={<FormattedMessage {...messages.intro} />}
  />
);
