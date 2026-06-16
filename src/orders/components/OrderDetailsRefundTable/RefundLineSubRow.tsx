import { GridTable } from "@dashboard/components/GridTable";
import { type OrderRefundLine } from "@dashboard/orders/utils/OrderRefundsViewModel";
import { Box, Text } from "@saleor/macaw-ui-next";

import { ReasonDisplay } from "../ReasonDisplay/ReasonDisplay";

interface RefundLineSubRowProps {
  line: OrderRefundLine;
}

const TOTAL_COLUMNS = 6;

export const RefundLineSubRow = ({ line }: RefundLineSubRowProps) => {
  return (
    <GridTable.Row>
      <GridTable.Cell colSpan={TOTAL_COLUMNS} paddingLeft={8} backgroundColor="default1">
        <Box display="flex" alignItems="center" gap={3}>
          <Box width={8} height={8} flexShrink="0" data-test-id="refund-sub-row-thumbnail">
            {line.thumbnailUrl && (
              <img src={line.thumbnailUrl} alt={line.productName} width="100%" height="100%" />
            )}
          </Box>
          <Box display="flex" flexDirection="column" minWidth={0}>
            <Text size={2} ellipsis>
              {line.quantity} × {line.productName}
              {line.variantName ? ` · ${line.variantName}` : ""}
            </Text>
            <ReasonDisplay reasonReference={line.reasonType} reason={line.reason} ellipsis />
          </Box>
        </Box>
      </GridTable.Cell>
    </GridTable.Row>
  );
};
