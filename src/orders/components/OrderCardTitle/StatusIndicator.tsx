import { FulfillmentStatus } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import { EraserIcon, PackageIcon, ReplaceIcon, SignatureIcon } from "lucide-react";
import { useIntl } from "react-intl";

import { CardTitleStatus } from "./OrderCardTitle";
import { RefundReturnIcon } from "./RefundReturnIcon";
import { getOrderTitleMessage } from "./utils";

const ICON_SIZE = 17;

const getStatusIcon = (status: CardTitleStatus): JSX.Element | null => {
  switch (status) {
    case FulfillmentStatus.FULFILLED:
      return <PackageIcon color="hsla(152, 98%, 44%, 1)" size={ICON_SIZE} />;
    case FulfillmentStatus.REFUNDED:
    case FulfillmentStatus.RETURNED:
      return <RefundReturnIcon />;
    case FulfillmentStatus.CANCELED:
      return <EraserIcon color="hsla(3, 90%, 64%, 1)" size={ICON_SIZE} />;
    case FulfillmentStatus.REFUNDED_AND_RETURNED:
    case FulfillmentStatus.REPLACED:
      return <ReplaceIcon size={ICON_SIZE} />;
    case FulfillmentStatus.WAITING_FOR_APPROVAL:
      return <SignatureIcon size={ICON_SIZE} />;
    default:
      return null;
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
    <Box marginLeft={2} display="flex" placeItems="center" aria-label={ariaLabel}>
      {statusIcon}
    </Box>
  );
};
