import { usePaginatorContext } from "@dashboard/hooks/usePaginator";
import {
  Box,
  Button,
  ChevronLeftIcon,
  ChevronRightIcon,
  Select,
  Text,
} from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

const ROW_NUMBER_OPTIONS = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];

interface PaginationProps {
  onUpdateListSettings: (key: "rowNumber", value: number) => void;
  numberOfRows: number;
}

export const Pagination = ({ onUpdateListSettings, numberOfRows }: PaginationProps) => {
  const { hasNextPage, hasPreviousPage, loadNextPage, loadPreviousPage } = usePaginatorContext();
  const currentRowNumber = String(numberOfRows);
  const currentRowNumberOption = ROW_NUMBER_OPTIONS.find(
    option => option.value === currentRowNumber,
  );

  const handleRowNumberChange = ({ value }: { value: string; label: string }) => {
    onUpdateListSettings("rowNumber", parseInt(value));
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      width="100%"
      paddingX={6}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Text color="default2" size={1}>
          <FormattedMessage id="nABmvC" defaultMessage="No. of rows" />
        </Text>
        <Select
          options={ROW_NUMBER_OPTIONS}
          value={currentRowNumberOption ?? ROW_NUMBER_OPTIONS[1]}
          onChange={handleRowNumberChange}
        />
      </Box>
      <Box display="flex" gap={2}>
        <Button
          variant="secondary"
          disabled={!hasPreviousPage}
          onClick={loadPreviousPage}
          icon={<ChevronLeftIcon />}
        />
        <Button
          variant="secondary"
          disabled={!hasNextPage}
          onClick={loadNextPage}
          icon={<ChevronRightIcon />}
        />
      </Box>
    </Box>
  );
};
