// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { getStatusColor } from "@dashboard/misc";
import { Box, Text, useTheme } from "@saleor/macaw-ui-next";
import { CircleAlert } from "lucide-react";
import { type ReactNode } from "react";

interface DevPanelWarningCalloutProps {
  children: ReactNode;
}

export const DevPanelWarningCallout = ({ children }: DevPanelWarningCalloutProps): JSX.Element => {
  const { theme } = useTheme();
  const backgroundColor = getStatusColor({ status: "warning", currentTheme: theme }).base;

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      gap={2}
      padding={2}
      borderRadius={3}
      __backgroundColor={backgroundColor}
    >
      <Box color="warning1" __lineHeight="0" flexShrink="0" __marginTop="1px">
        <CircleAlert size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      </Box>
      <Text size={1} color="default1">
        {children}
      </Text>
    </Box>
  );
};
