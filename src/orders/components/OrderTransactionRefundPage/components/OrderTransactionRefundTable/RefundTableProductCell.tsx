import { GridTable } from "@dashboard/components/GridTable";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import { useOverflowDetection } from "@dashboard/hooks/useOverflowDetection/useOverflowDetection";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";

interface RefundTableProductCellProps {
  line: OrderDetailsGrantRefundFragment["lines"][number];
  index: number;
}

export const RefundTableProductCell: React.FC<RefundTableProductCellProps> = ({ line, index }) => {
  const { setRef: setProductNameRef, isOverflowing: isProductOverflowing } =
    useOverflowDetection<HTMLElement>();
  const { setRef: setVariantNameRef, isOverflowing: isVariantOverflowing } =
    useOverflowDetection<HTMLElement>();

  const isAnyOverflowing = isProductOverflowing(index) || isVariantOverflowing(index);

  return (
    <Tooltip open={isAnyOverflowing}>
      <Tooltip.Trigger>
        <GridTable.Cell>
          <Box display="grid" __gridTemplateColumns="min-content auto" gap={2} alignItems="start">
            <Box width={8} height={8}>
              <img src={line.thumbnail?.url} alt="product thumbnail" />
            </Box>
            <Box overflow="hidden" minWidth={0}>
              <Box
                ref={setProductNameRef(index)}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                <Text size={2} textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                  {line.productName}
                </Text>
              </Box>
              <Box
                ref={setVariantNameRef(index)}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                <Text size={2} color="default2" textOverflow="ellipsis" overflow="hidden">
                  {line.variantName}
                </Text>
              </Box>
            </Box>
          </Box>
        </GridTable.Cell>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Box display="flex" flexDirection="column" __maxWidth="200px" wordBreak="break-all">
          <Text size={2}>{line.productName}</Text>
          <Text size={2} color="default2">
            {line.variantName}
          </Text>
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
};
