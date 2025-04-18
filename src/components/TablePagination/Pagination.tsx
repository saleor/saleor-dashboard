import { PageInfo, PaginatorContextValues } from "@dashboard/hooks/usePaginator";
import { ListSettings } from "@dashboard/types";
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
import { Link } from "react-router-dom";

const ROW_NUMBER_OPTIONS = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];

export interface PaginationProps extends Omit<PageInfo, "endCursor" | "startCursor"> {
  paginatorSettings: PaginatorContextValues;
  numberOfRows?: number;
  disabled?: boolean;
  labels?: {
    noOfRows?: string;
  };
  settings?: ListSettings;
  onUpdateListSettings?: (key: "rowNumber", value: number) => void;
}

export const Pagination = ({
  onUpdateListSettings,
  numberOfRows,
  disabled,
  labels,
  hasNextPage,
  hasPreviousPage,
  paginatorSettings: { loadNextPage, loadPreviousPage, paginatorType, nextHref, prevHref },
  ...props
}: PaginationProps) => {
  const showRowsSelect = !!numberOfRows;
  const currentRowNumber = String(numberOfRows);
  const currentRowNumberOption = ROW_NUMBER_OPTIONS.find(
    option => option.value === currentRowNumber,
  );

  const handleRowNumberChange = ({ value }: { value: string; label: string }) => {
    if (onUpdateListSettings) {
      onUpdateListSettings("rowNumber", parseInt(value));
    }
  };

  const getNavigationButtons = () => {
    if (paginatorType === "click") {
      return (
        <>
          <Button
            variant="secondary"
            disabled={!hasPreviousPage || disabled}
            onClick={loadPreviousPage}
            icon={<ChevronLeftIcon />}
            data-test-id="button-pagination-back"
          />
          <Button
            variant="secondary"
            disabled={!hasNextPage || disabled}
            onClick={loadNextPage}
            icon={<ChevronRightIcon />}
            data-test-id="button-pagination-next"
          />
        </>
      );
    }

    return (
      <>
        <Link to={prevHref || ""}>
          <Button
            variant="secondary"
            disabled={!hasPreviousPage || disabled}
            icon={<ChevronLeftIcon />}
            data-test-id="button-pagination-back"
          />
        </Link>

        <Link to={nextHref || ""}>
          <Button
            variant="secondary"
            disabled={!hasNextPage || disabled}
            icon={<ChevronRightIcon />}
            data-test-id="button-pagination-next"
          />
        </Link>
      </>
    );
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      width="100%"
      {...props}
    >
      {showRowsSelect && (
        <Box display="flex" alignItems="center" gap={2}>
          <Text color="default2" size={1}>
            {labels?.noOfRows ?? <FormattedMessage id="nABmvC" defaultMessage="No. of rows" />}
          </Text>
          <Select
            options={ROW_NUMBER_OPTIONS}
            value={currentRowNumberOption ?? ROW_NUMBER_OPTIONS[1]}
            onChange={handleRowNumberChange}
            data-test-id="select-rows-per-page"
          />
        </Box>
      )}
      <Box display="flex" gap={2} marginLeft="auto">
        {getNavigationButtons()}
      </Box>
    </Box>
  );
};
