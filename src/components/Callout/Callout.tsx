import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { getStatusColor, PillStatusType } from "@dashboard/misc";
import { Box, Text, useTheme } from "@saleor/macaw-ui-next";
import { AlertTriangle, CircleAlert, Info, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type CalloutType = "info" | "warning" | "error";

interface CalloutStyles {
  status: PillStatusType;
  iconColor: "warning1" | "critical1" | "default1";
  Icon: LucideIcon;
}

const calloutStylesMap: Record<CalloutType, CalloutStyles> = {
  warning: {
    status: "warning",
    iconColor: "warning1",
    Icon: CircleAlert,
  },
  error: {
    status: "error",
    iconColor: "critical1",
    Icon: AlertTriangle,
  },
  info: {
    status: "neutral",
    iconColor: "default1",
    Icon: Info,
  },
};

interface CalloutProps {
  children?: ReactNode;
  title: ReactNode;
  type: CalloutType;
}

export const Callout = ({ children, title, type }: CalloutProps): JSX.Element => {
  const { theme: currentTheme } = useTheme();
  const { status, iconColor, Icon } = calloutStylesMap[type];
  const backgroundColor = getStatusColor({ status, currentTheme }).base;

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      gap={3}
      padding={4}
      borderRadius={4}
      __backgroundColor={backgroundColor}
    >
      <Box color={iconColor} __lineHeight="0" flexShrink="0">
        <Icon size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Box>{title}</Box>
        {children && (
          <Text size={3} color="default2">
            {children}
          </Text>
        )}
      </Box>
    </Box>
  );
};
