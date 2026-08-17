import { tableStyles } from "@dashboard/components/ResponsiveTable";
import { TableCell, TableRow } from "@material-ui/core";
import { Box, Skeleton } from "@saleor/macaw-ui-next";

import columnStyles from "./attributeListTableColumns.module.css";

interface AttributeListTableSkeletonRowsProps {
  rowCount?: number;
  variantColumn?: "selection" | "spacer";
}

export const AttributeListTableSkeletonRows = ({
  rowCount = 3,
  variantColumn,
}: AttributeListTableSkeletonRowsProps): JSX.Element => (
  <>
    {Array.from({ length: rowCount }, (_, index) => (
      <TableRow key={index} className={tableStyles.row}>
        <TableCell className={tableStyles.dragCell} />
        <TableCell className={tableStyles.checkboxCell}>
          <Box display="flex" alignItems="center" height="100%">
            <Skeleton __width="16px" __height="16px" borderRadius={1} />
          </Box>
        </TableCell>
        <TableCell>
          <Box display="flex" flexDirection="column" gap={1}>
            <Skeleton __height="14px" __width="58%" />
            <Skeleton __height="12px" __width="42%" />
          </Box>
        </TableCell>
        <TableCell className={columnStyles.colValueRequired}>
          <Skeleton __height="14px" __width="4.5rem" />
        </TableCell>
        {variantColumn === "selection" ? (
          <TableCell className={columnStyles.colVariant}>
            <Skeleton __height="24px" __width="9rem" borderRadius={8} />
          </TableCell>
        ) : variantColumn === "spacer" ? (
          <TableCell className={columnStyles.colVariant} aria-hidden />
        ) : null}
        <TableCell className={tableStyles.actionsCell} />
      </TableRow>
    ))}
  </>
);
