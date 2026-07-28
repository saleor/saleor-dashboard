import { SaleorThrobber } from "@dashboard/components/Throbber";
import { TableCell, TableRow } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui-next";

import styles from "./AssignPickerListPlaceholder.module.css";

export const AssignPickerListLoading = (): JSX.Element => (
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
}: AssignPickerListLoadingRowProps): JSX.Element => (
  <TableRow>
    <TableCell colSpan={colSpan} className={styles.cell}>
      <AssignPickerListLoading />
    </TableCell>
  </TableRow>
);
