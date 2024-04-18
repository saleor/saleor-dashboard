import { Box, Button, ChevronLeftIcon, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React from "react";

export interface ColumnPickerPagination {
  query: string;
  onNextPage: (query: string) => void;
  onPreviousPage: (query: string) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const ColumnPickerPagination = ({
  query,
  onNextPage,
  onPreviousPage,
  hasNextPage,
  hasPreviousPage,
}: ColumnPickerPagination) => (
  <Box display="flex" gap={1.5} padding={3}>
    <Button
      variant="secondary"
      size="small"
      icon={<ChevronLeftIcon size="small" />}
      onClick={() => onPreviousPage(query)}
      disabled={!hasPreviousPage}
      data-test-id="pagination-back"
    />
    <Button
      variant="secondary"
      size="small"
      icon={<ChevronRightIcon size="small" />}
      onClick={() => onNextPage(query)}
      disabled={!hasNextPage}
      data-test-id="pagination-forward"
    />
  </Box>
);
