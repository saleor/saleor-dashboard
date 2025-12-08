import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Box, Button } from "@saleor/macaw-ui-next";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      icon={<ChevronLeft size={iconSize.small} strokeWidth={iconStrokeWidth} />}
      onClick={() => onPreviousPage(query)}
      disabled={!hasPreviousPage}
      data-test-id="pagination-back"
    />
    <Button
      variant="secondary"
      size="small"
      icon={<ChevronRight size={iconSize.small} strokeWidth={iconStrokeWidth} />}
      onClick={() => onNextPage(query)}
      disabled={!hasNextPage}
      data-test-id="pagination-forward"
    />
  </Box>
);
