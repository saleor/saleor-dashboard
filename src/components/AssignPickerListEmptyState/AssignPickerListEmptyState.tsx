import { TableCell, TableRow } from "@dashboard/components/Table/Table";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import styles from "../AssignPickerListLoading/AssignPickerListPlaceholder.module.css";

interface AssignPickerListEmptyStateProps {
  children: ReactNode;
}

export const AssignPickerListEmptyState = ({
  children,
}: AssignPickerListEmptyStateProps): React.ReactNode => (
  <Box
    className={styles.container}
    display="flex"
    alignItems="center"
    justifyContent="center"
    data-test-id="assign-picker-list-empty"
  >
    <Text size={2} color="default2" textAlign="center">
      {children}
    </Text>
  </Box>
);

interface AssignPickerListEmptyStateRowProps {
  colSpan?: number;
  children: ReactNode;
}

export const AssignPickerListEmptyStateRow = ({
  colSpan = 3,
  children,
}: AssignPickerListEmptyStateRowProps): React.ReactNode => (
  <TableRow>
    <TableCell colSpan={colSpan} className={styles.cell}>
      <AssignPickerListEmptyState>{children}</AssignPickerListEmptyState>
    </TableCell>
  </TableRow>
);
