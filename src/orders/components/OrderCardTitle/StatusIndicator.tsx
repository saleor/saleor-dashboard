import { FulfillmentStatus } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import { EraserIcon, PackageIcon, ReplaceIcon, SignatureIcon } from "lucide-react";
import { useIntl } from "react-intl";

import { CardTitleStatus } from "./OrderCardTitle";
import { RefundReturnIcon } from "./RefundReturnIcon";
import { getOrderTitleMessage } from "./utils";

const ICON_SIZE = 17;

interface StatusIcon {
  icon: JSX.Element;
  color?: string;
}

const getStatusIcon = (status: CardTitleStatus): StatusIcon | null => {
  switch (status) {
    case FulfillmentStatus.FULFILLED:
      return { icon: <PackageIcon size={ICON_SIZE} />, color: "iconSuccess" };
    case FulfillmentStatus.REFUNDED:
    case FulfillmentStatus.RETURNED:
      return { icon: <RefundReturnIcon />, color: "default1" };
    case FulfillmentStatus.CANCELED:
      return { icon: <EraserIcon size={ICON_SIZE} />, color: "iconCritical" };
    case FulfillmentStatus.REFUNDED_AND_RETURNED:
    case FulfillmentStatus.REPLACED:
      return { icon: <ReplaceIcon size={ICON_SIZE} />, color: "default1" };
    case FulfillmentStatus.WAITING_FOR_APPROVAL:
      return { icon: <SignatureIcon size={ICON_SIZE} />, color: "default1" };
    case "unfulfilled":
      return null;
    default:
      // Exhaustive check
      const _exhaustive: never = status;

      return _exhaustive;
  }
};

interface StatusIndicatorProps {
  status: CardTitleStatus;
}

export const StatusIndicator = ({ status }: StatusIndicatorProps): JSX.Element | null => {
  const intl = useIntl();
  const statusIcon = getStatusIcon(status);

  if (!statusIcon) {
    return null;
  }

  const messageForStatus = getOrderTitleMessage(status);
  const ariaLabel = intl.formatMessage(messageForStatus);

  return (
    <Box
      marginLeft={2}
      display="flex"
      placeItems="center"
      __color={statusIcon.color}
      aria-label={ariaLabel}
    >
      {statusIcon.icon}
    </Box>
  );
};
