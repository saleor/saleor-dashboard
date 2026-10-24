import { PaginationButtons } from "@dashboard/components/PaginationButtons/PaginationButtons";
import { Box } from "@saleor/macaw-ui-next";

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
  <Box display="flex" gap={2} padding={3}>
    <PaginationButtons
      hasPreviousPage={hasPreviousPage}
      hasNextPage={hasNextPage}
      onPreviousPage={() => onPreviousPage(query)}
      onNextPage={() => onNextPage(query)}
      previousTestId="pagination-back"
      nextTestId="pagination-forward"
    />
  </Box>
);
