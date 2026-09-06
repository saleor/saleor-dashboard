import { TableCell, TableRow } from "@dashboard/components/Table/Table";
import { SaleorThrobber } from "@dashboard/components/Throbber/SaleorThrobber";
import { Box } from "@saleor/macaw-ui-next";

import styles from "./AssignPickerListPlaceholder.module.css";

export const AssignPickerListLoading = (): React.ReactNode => (
  <Box
    className={styles.container}
    display="flex"
    alignItems="center"
    justifyContent="center"
    data-test-id="assign-picker-list-loading"
  >
    <SaleorThrobber />
  </Box>
);

interface AssignPickerListLoadingRowProps {
  colSpan?: number;
}

export const AssignPickerListLoadingRow = ({
  colSpan = 3,
}: AssignPickerListLoadingRowProps): React.ReactNode => (
  <TableRow>
    <TableCell colSpan={colSpan} className={styles.cell}>
      <AssignPickerListLoading />
    </TableCell>
  </TableRow>
);
