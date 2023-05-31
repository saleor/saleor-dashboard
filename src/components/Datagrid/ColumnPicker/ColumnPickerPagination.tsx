import {
  Box,
  Button,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@saleor/macaw-ui/next";
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
  <Box display="flex" gap={4} padding={6}>
    <Button
      variant="secondary"
      size="small"
      icon={<ChevronLeftIcon size="small" />}
      onClick={() => onPreviousPage(query)}
      disabled={!hasPreviousPage}
    />
    <Button
      variant="secondary"
      size="small"
      icon={<ChevronRightIcon size="small" />}
      onClick={() => onNextPage(query)}
      disabled={!hasNextPage}
    />
  </Box>
);
