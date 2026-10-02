import { PaginationButtons } from "@dashboard/components/PaginationButtons/PaginationButtons";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { channelAvailabilityMessages } from "./messages";

interface ChannelPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const ChannelPagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: ChannelPaginationProps) => {
  const intl = useIntl();
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Text size={2} color="default2">
        {intl.formatMessage(channelAvailabilityMessages.paginationShowing, {
          start,
          end,
          total: totalItems,
        })}
      </Text>
      <Box display="flex" alignItems="center" gap={2}>
        <PaginationButtons
          hasPreviousPage={currentPage > 1}
          hasNextPage={currentPage < totalPages}
          onPreviousPage={() => onPageChange(currentPage - 1)}
          onNextPage={() => onPageChange(currentPage + 1)}
          previousTestId="pagination-prev"
          nextTestId="pagination-next"
        />
      </Box>
    </Box>
  );
};
