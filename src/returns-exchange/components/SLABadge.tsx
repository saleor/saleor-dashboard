import { Box, Text } from "@saleor/macaw-ui-next";

import { type SLATier } from "../types";

interface SLABadgeProps {
  tier: SLATier;
  hoursRemaining: number | null;
}

const tierConfig = {
  SAFE: { color: "#22c55e", label: "Safe" },
  AT_RISK: { color: "#f59e0b", label: "At Risk" },
  CRITICAL: { color: "#ef4444", label: "Critical" },
};

export const SLABadge = ({ tier, hoursRemaining }: SLABadgeProps) => {
  const config = tierConfig[tier];
  const timeLabel =
    hoursRemaining !== null
      ? hoursRemaining < 1
        ? `${Math.round(hoursRemaining * 60)}m left`
        : `${hoursRemaining.toFixed(1)}h left`
      : null;

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box
        __width={8}
        __height={8}
        borderRadius="50%"
        __backgroundColor={config.color}
        flexShrink="0"
      />
      <Text size={2} color="default2">
        {config.label}
        {timeLabel ? ` · ${timeLabel}` : ""}
      </Text>
    </Box>
  );
};
