import { useOverflowDetection } from "@dashboard/hooks/useOverflowDetection/useOverflowDetection";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { type ReactNode, useState } from "react";

interface OrderFulfillSkuCellProps {
  sku: string | null | undefined;
}

export const OrderFulfillSkuCell = ({ sku }: OrderFulfillSkuCellProps): ReactNode => {
  const { elementRef, isOverflowing } = useOverflowDetection<HTMLDivElement>();
  // Measure on hover. The ref is empty during render, so deciding then locks the tooltip shut.
  const [tooltipOpen, setTooltipOpen] = useState(false);

  if (!sku) {
    return null;
  }

  return (
    <Tooltip
      open={tooltipOpen}
      onOpenChange={nextOpen => {
        setTooltipOpen(nextOpen && Boolean(isOverflowing()));
      }}
    >
      <Tooltip.Trigger>
        <Box
          ref={elementRef}
          data-test-id="fulfillment-sku"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          minWidth={0}
          width="100%"
        >
          {sku}
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <Tooltip.Arrow />
        <Box __maxWidth={320} wordBreak="break-all">
          <Text size={2}>{sku}</Text>
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};
