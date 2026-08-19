import { type DotStatus } from "@dashboard/components/StatusDot/StatusDot";
import { type IntlShape } from "react-intl";

import { messages } from "../VoucherCodesDatagrid/messages";

/** Active → success, Inactive → error, Draft → warning (muted StatusDot tones). */
export const getVoucherCodeStatusDot = (isActive: boolean | undefined): DotStatus => {
  if (isActive === undefined) {
    return "warning";
  }

  return isActive ? "success" : "error";
};

export const getVoucherCodeStatusLabel = (
  isActive: boolean | undefined,
  intl: IntlShape,
): string => {
  if (isActive === undefined) {
    return intl.formatMessage(messages.draft);
  }

  return isActive ? intl.formatMessage(messages.active) : intl.formatMessage(messages.inactive);
};
