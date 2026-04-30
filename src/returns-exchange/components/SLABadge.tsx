import { Box, Text } from "@saleor/macaw-ui-next";

import { type SLATier } from "../types";

interface SLABadgeProps {
  tier: SLATier;
  hoursRemaining: number | null;
}

// Use macaw-ui semantic background tokens so theme overrides (and dark mode) apply.
const tierConfig: Record<
  SLATier,
  { background: "success1" | "warning1" | "critical1"; label: string }
> = {
  SAFE: { background: "success1", label: "Safe" },
  AT_RISK: { background: "warning1", label: "At Risk" },
  CRITICAL: { background: "critical1", label: "Critical" },
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
        backgroundColor={config.background}
        flexShrink="0"
      />
      <Text size={2} color="default2">
        {config.label}
        {timeLabel ? ` · ${timeLabel}` : ""}
      </Text>
    </Box>
  );
};
