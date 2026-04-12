import { Box, Text } from "@saleor/macaw-ui-next";

import { type CXReturnStatus } from "../types";

interface StatusChipProps {
  status: CXReturnStatus;
}

type StatusConfig = {
  label: string;
  color: "default1" | "warning1" | "success1" | "critical1";
};

const statusConfig: Record<CXReturnStatus, StatusConfig> = {
  RETURN_PENDING: { label: "Pending", color: "default1" },
  CX_REVIEW: { label: "CX Review", color: "warning1" },
  CX_ACTION: { label: "CX Action", color: "warning1" },
  EXCHANGED: { label: "Exchanged", color: "success1" },
  APPROVED: { label: "Approved", color: "success1" },
  AUTO_APPROVED: { label: "Auto Approved", color: "success1" },
};

export const StatusChip = ({ status }: StatusChipProps) => {
  const config: StatusConfig = statusConfig[status] ?? { label: status, color: "default1" };

  return (
    <Box display="inline-flex" alignItems="center" borderRadius={3} paddingX={2} paddingY={1}>
      <Text size={2} color={config.color} fontWeight="bold">
        {config.label}
      </Text>
    </Box>
  );
};
