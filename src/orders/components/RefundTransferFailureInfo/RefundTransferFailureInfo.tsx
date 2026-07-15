import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { Info } from "lucide-react";

interface RefundTransferFailureInfoProps {
  message: string;
  testId?: string;
}

export const RefundTransferFailureInfo = ({
  message,
  testId = "refund-transfer-failure-info",
}: RefundTransferFailureInfoProps): JSX.Element => (
  <Tooltip>
    <Tooltip.Trigger>
      <Box display="flex" cursor="pointer" padding={1} flexShrink="0" data-test-id={testId}>
        <Info size={16} />
      </Box>
    </Tooltip.Trigger>
    <Tooltip.Content side="bottom">
      <Tooltip.Arrow />
      <Box __maxWidth="500px">
        <Text size={2}>{message}</Text>
      </Box>
    </Tooltip.Content>
  </Tooltip>
);
