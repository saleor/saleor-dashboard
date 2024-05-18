import { GridTable } from "@dashboard/components/GridTable";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";

interface RefundTableProductCellProps {
  line: OrderDetailsGrantRefundFragment["lines"][number];
  index: number;
}

export const RefundTableProductCell: React.FC<RefundTableProductCellProps> = ({ line, index }) => {
  // TODO: Abstract and move it to dedicated hook in MERX-359
  const productNameRefs = React.useRef([]);
  const variantNameRefs = React.useRef([]);
  const isOverflowing = (index: number): false | undefined => {
    const productElement = productNameRefs.current[index];
    const variantElement = variantNameRefs.current[index];

    if (!productElement || !variantElement) {
      return undefined;
    }

    const productOverflow = productElement.scrollWidth > productElement.clientWidth;
    const variantOverflow = variantElement.scrollWidth > variantElement.clientWidth;

    return productOverflow || variantOverflow ? undefined : false;
  };

  return (
    <Tooltip open={isOverflowing(index)}>
      <Tooltip.Trigger>
        <GridTable.Cell>
          <Box display="grid" __gridTemplateColumns="min-content auto" gap={2} alignItems="start">
            <Box width={8} height={8}>
              <img src={line.thumbnail?.url} alt="product thumbnail" />
            </Box>
            <Box overflow="hidden" minWidth={0}>
              <Box
                ref={el => (productNameRefs.current[index] = el)}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                <Text size={2} textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                  {index === 0 ? line.productName : line.productName}
                </Text>
              </Box>
              <Box
                ref={el => (variantNameRefs.current[index] = el)}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                <Text size={2} color="default2" textOverflow="ellipsis" overflow="hidden">
                  {index === 0 ? line.variantName : line.variantName}
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
