import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          icon={<ChevronLeft size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
          data-test-id="pagination-prev"
        />
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={<ChevronRight size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
          data-test-id="pagination-next"
        />
      </Box>
    </Box>
  );
};
