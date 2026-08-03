import { TableCell, TableRow } from "@material-ui/core";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import styles from "../AssignPickerListLoading/AssignPickerListPlaceholder.module.css";
import { messages } from "./messages";

interface AssignProductPickerBackfillExhaustedProps {
  colSpan?: number;
  loading?: boolean;
  onLoadMore: () => void;
}

/**
 * Shown when the picker's client-side exclusion emptied every page loaded so far but the
 * catalog still has more. Without an explicit way forward the picker dead-ends on
 * "no products found" while thousands of assignable products sit on later pages.
 */
export const AssignProductPickerBackfillExhausted = ({
  colSpan = 3,
  loading = false,
  onLoadMore,
}: AssignProductPickerBackfillExhaustedProps) => (
  <TableRow>
    <TableCell colSpan={colSpan} className={styles.cell}>
      <Box
        className={styles.container}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={3}
        data-test-id="assign-product-backfill-exhausted"
      >
        <Text size={2} color="default2" textAlign="center">
          <FormattedMessage {...messages.allLoadedProductsFilteredOut} />
        </Text>
        <Button
          variant="secondary"
          disabled={loading}
          onClick={onLoadMore}
          data-test-id="assign-product-load-more-products"
        >
          <FormattedMessage {...messages.loadMoreProducts} />
        </Button>
      </Box>
    </TableCell>
  </TableRow>
);
