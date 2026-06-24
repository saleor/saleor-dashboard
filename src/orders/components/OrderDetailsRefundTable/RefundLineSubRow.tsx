import { GridTable } from "@dashboard/components/GridTable";
import { type OrderRefundLine } from "@dashboard/orders/utils/OrderRefundsViewModel";
import { Box, Text } from "@saleor/macaw-ui-next";

import { ReasonDisplay } from "../ReasonDisplay/ReasonDisplay";
import styles from "./RefundLineSubRow.module.css";

interface RefundLineSubRowProps {
  line: OrderRefundLine;
  isFirst?: boolean;
}

export const RefundLineSubRow = ({ line, isFirst }: RefundLineSubRowProps) => {
  return (
    <GridTable.Row className={isFirst ? styles.dashedTop : undefined}>
      <GridTable.Cell colSpan={3} paddingLeft={8} backgroundColor="default1">
        <Box display="flex" alignItems="center" gap={3}>
          <Box width={8} height={8} flexShrink="0" data-test-id="refund-sub-row-thumbnail">
            {line.thumbnailUrl && (
              <img src={line.thumbnailUrl} alt={line.productName} width="100%" height="100%" />
            )}
          </Box>
          <Text size={2} ellipsis>
            {line.quantity} × {line.productName}
            {line.variantName ? ` · ${line.variantName}` : ""}
          </Text>
        </Box>
      </GridTable.Cell>
      <GridTable.Cell backgroundColor="default1">
        <ReasonDisplay reasonReference={line.reasonType} reason={line.reason} ellipsis />
      </GridTable.Cell>
      <GridTable.Cell backgroundColor="default1" />
    </GridTable.Row>
  );
};
