import { type PillStatusType } from "@dashboard/misc";
import { type MessageDescriptor } from "react-intl";

import { giftCardStatusMessages } from "./messages";

interface GiftCardStatusFields {
  isActive: boolean;
  isExpired: boolean;
}

export interface GiftCardStatusPresentation {
  color: PillStatusType;
  label: MessageDescriptor;
}

/** Shared Active / Inactive / Expired presentation for detail chip and list status. */
export const getGiftCardStatusPresentation = ({
  isActive,
  isExpired,
}: GiftCardStatusFields): GiftCardStatusPresentation => {
  if (isExpired) {
    return {
      color: "info",
      label: giftCardStatusMessages.expired,
    };
  }

  if (!isActive) {
    return {
      color: "neutral",
      label: giftCardStatusMessages.inactive,
    };
  }

  return {
    color: "success",
    label: giftCardStatusMessages.active,
  };
};
