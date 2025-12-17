import { FulfillmentStatus } from "@dashboard/graphql";
import { getStatusColor, PillStatusType } from "@dashboard/misc";
import { Box, useTheme } from "@saleor/macaw-ui-next";
import { EraserIcon, PackageIcon, ReplaceIcon, SignatureIcon } from "lucide-react";
import { useIntl } from "react-intl";

import { RefundedIcon } from "../../../icons/RefundedIcon";
import { ReturnedIcon } from "../../../icons/ReturnedIcon";
import { CardTitleStatus } from "./OrderCardTitle";
import { getOrderTitleMessage } from "./utils";

const ICON_SIZE = 16;
const CIRCLE_SIZE = 28;

const getStatusPillType = (status: CardTitleStatus): PillStatusType | null => {
  switch (status) {
    case FulfillmentStatus.FULFILLED:
      return "success";
    case FulfillmentStatus.REFUNDED:
    case FulfillmentStatus.RETURNED:
    case FulfillmentStatus.REPLACED:
    case FulfillmentStatus.REFUNDED_AND_RETURNED:
      return "info";
    case FulfillmentStatus.CANCELED:
      return "error";
    case FulfillmentStatus.WAITING_FOR_APPROVAL:
      return "warning";
    default:
      return null;
  }
};

interface IconCircleProps {
  children: React.ReactNode;
  backgroundColor: string;
  borderColor: string;
}

const IconCircle = ({ children, backgroundColor, borderColor }: IconCircleProps) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="100%"
    borderStyle="solid"
    borderWidth={1}
    __width={CIRCLE_SIZE}
    __height={CIRCLE_SIZE}
    __backgroundColor={backgroundColor}
    __borderColor={borderColor}
  >
    {children}
  </Box>
);

interface GetIconParams {
  status: CardTitleStatus;
  textColor: string;
  currentTheme: "defaultLight" | "defaultDark";
}

const getIcon = ({ status, textColor, currentTheme }: GetIconParams): JSX.Element | null => {
  const strokeWidth = 1.5;

  switch (status) {
    case FulfillmentStatus.FULFILLED:
      return <PackageIcon color={textColor} size={ICON_SIZE} strokeWidth={strokeWidth} />;
    case FulfillmentStatus.REFUNDED:
      return <RefundedIcon size={ICON_SIZE} color={textColor} strokeWidth={strokeWidth} />;
    case FulfillmentStatus.RETURNED:
      return <ReturnedIcon size={ICON_SIZE} color={textColor} strokeWidth={strokeWidth} />;
    case FulfillmentStatus.CANCELED:
      return <EraserIcon color={textColor} size={ICON_SIZE} strokeWidth={strokeWidth} />;
    case FulfillmentStatus.REPLACED:
      return <ReplaceIcon color={textColor} size={ICON_SIZE} strokeWidth={strokeWidth} />;
    case FulfillmentStatus.WAITING_FOR_APPROVAL:
      return <SignatureIcon color={textColor} size={ICON_SIZE} strokeWidth={strokeWidth} />;
    case FulfillmentStatus.REFUNDED_AND_RETURNED: {
      const infoColors = getStatusColor({ status: "info", currentTheme });

      return (
        <Box display="flex" gap={1}>
          <IconCircle backgroundColor={infoColors.base} borderColor={infoColors.border}>
            <RefundedIcon size={ICON_SIZE} color={infoColors.text} strokeWidth={strokeWidth} />
          </IconCircle>
          <IconCircle backgroundColor={infoColors.base} borderColor={infoColors.border}>
            <ReplaceIcon size={ICON_SIZE} color={infoColors.text} strokeWidth={strokeWidth} />
          </IconCircle>
        </Box>
      );
    }
    default:
      return null;
  }
};

interface StatusIndicatorProps {
  status?: CardTitleStatus;
}

export const StatusIndicator = ({ status }: StatusIndicatorProps): JSX.Element | null => {
  const intl = useIntl();
  const { theme: currentTheme } = useTheme();

  if (!status) {
    return null;
  }

  const pillType = getStatusPillType(status);

  if (!pillType) {
    return null;
  }

  const messageForStatus = getOrderTitleMessage(status);
  const ariaLabel = intl.formatMessage(messageForStatus);
  const { base, border, text } = getStatusColor({ status: pillType, currentTheme });

  const icon = getIcon({ status, textColor: text, currentTheme });

  return (
    <Box marginLeft={2} display="flex" placeItems="center" aria-label={ariaLabel}>
      {status === FulfillmentStatus.REFUNDED_AND_RETURNED ? (
        icon
      ) : (
        <IconCircle backgroundColor={base} borderColor={border}>
          {icon}
        </IconCircle>
      )}
    </Box>
  );
};
