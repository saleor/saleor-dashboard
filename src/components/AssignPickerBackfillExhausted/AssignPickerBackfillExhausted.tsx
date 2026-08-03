import { TableCell, TableRow } from "@material-ui/core";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import styles from "../AssignPickerListLoading/AssignPickerListPlaceholder.module.css";

interface AssignPickerBackfillExhaustedProps {
  colSpan?: number;
  loading?: boolean;
  message: ReactNode;
  buttonLabel: ReactNode;
  onLoadMore: () => void;
}

/**
 * Shown when a picker's client-side exclusion emptied every page loaded so far but the
 * backend still has more. Without an explicit way forward the picker dead-ends on
 * "nothing found" while assignable rows sit on later pages.
 */
export const AssignPickerBackfillExhaustedRow = ({
  colSpan = 3,
  loading = false,
  message,
  buttonLabel,
  onLoadMore,
}: AssignPickerBackfillExhaustedProps): JSX.Element => (
  <TableRow>
    <TableCell colSpan={colSpan} className={styles.cell}>
      <Box
        className={styles.container}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={3}
        data-test-id="assign-picker-backfill-exhausted"
      >
        <Text size={2} color="default2" textAlign="center">
          {message}
        </Text>
        <Button
          variant="secondary"
          disabled={loading}
          onClick={onLoadMore}
          data-test-id="assign-picker-load-more"
        >
          {buttonLabel}
        </Button>
      </Box>
    </TableCell>
  </TableRow>
);
