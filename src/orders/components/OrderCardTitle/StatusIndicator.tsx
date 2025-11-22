import { FulfillmentStatus } from "@dashboard/graphql";
import { DEFAULT_ICON_SIZE } from "@dashboard/icons/utils";
import { Box, sprinkles } from "@saleor/macaw-ui-next";
import { EraserIcon, PackageIcon, ReplaceIcon, SignatureIcon } from "lucide-react";
import { useIntl } from "react-intl";

import { RefundedIcon } from "../../../icons/RefundedIcon";
import { ReturnedIcon } from "../../../icons/ReturnedIcon";
import { CardTitleStatus } from "./OrderCardTitle";
import { getOrderTitleMessage } from "./utils";

const getStatusIcon = (status?: CardTitleStatus): JSX.Element | null => {
  if (!status) {
    return null;
  }

  switch (status) {
    case "FULFILLED":
      return <PackageIcon color="hsla(152, 98%, 44%, 1)" size={DEFAULT_ICON_SIZE} />;
    case "REFUNDED":
      return <RefundedIcon size={DEFAULT_ICON_SIZE} color="hsla(214, 100%, 55%, 1)" />;
    case "RETURNED":
      return <ReturnedIcon size={DEFAULT_ICON_SIZE} color="hsla(214, 100%, 63.1%, 1)" />;
    case "CANCELED":
      return <EraserIcon color="hsla(3, 90%, 64%, 1)" size={DEFAULT_ICON_SIZE} />;
    case "REPLACED":
      return <ReplaceIcon size={DEFAULT_ICON_SIZE} />;
    case "WAITING_FOR_APPROVAL":
      return <SignatureIcon size={DEFAULT_ICON_SIZE} />;
    case "REFUNDED_AND_RETURNED":
      return (
        <>
          <RefundedIcon size={DEFAULT_ICON_SIZE} className={sprinkles({ marginRight: 1 })} />
          <ReplaceIcon size={DEFAULT_ICON_SIZE} />
        </>
      );
    default:
      return null;
  }
};

interface StatusIndicatorProps {
  status?: CardTitleStatus;
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
