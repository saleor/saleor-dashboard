import { GridTable } from "@dashboard/components/GridTable";
import { formatMoney } from "@dashboard/components/Money";
import { type OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { Box } from "@macaw-ui";

import { AlreadyRefundedHelper } from "./AlreadyRefundedHelper";

interface RefundTablePriceCellProps {
  line: OrderDetailsGrantRefundFragment["lines"][number];
  maxQtyToRefund: number;
}

export const RefundTablePriceCell = ({ line, maxQtyToRefund }: RefundTablePriceCellProps) => {
  const locale = useLocale();

  return (
    <GridTable.Cell>
      <Box display="flex" flexDirection="column" overflow="hidden" flexShrink="1" __minWidth="0px">
        {`${line.quantity} ⨉ `}
        {formatMoney(line.unitPrice.gross, locale.locale)}
        <AlreadyRefundedHelper qtyToRefund={line.quantity} maxQtyToRefund={maxQtyToRefund} />
      </Box>
    </GridTable.Cell>
  );
};
