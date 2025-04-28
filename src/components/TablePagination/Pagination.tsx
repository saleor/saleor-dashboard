import { PageInfo, PaginatorContextValues } from "@dashboard/hooks/usePaginator";
import { commonMessages } from "@dashboard/intl";
import { ListSettings } from "@dashboard/types";
import { PaginationRowNumberSelect, PaginationRowNumberSelectLabels } from "@saleor/macaw-ui";
import { Box, Button, ChevronLeftIcon, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

const ROW_NUMBER_OPTIONS = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];
// TODO: Remove this when we replace legacy Select component
const LEGACY_ROW_NUMBER_OPTIONS = ROW_NUMBER_OPTIONS.map(option => Number(option.value));

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
  const intl = useIntl();
  const showRowsSelect = !!numberOfRows;

  const defaultLabels = {
    noOfRows: intl.formatMessage(commonMessages.noOfRows),
  };

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
          <PaginationRowNumberSelect
            choices={LEGACY_ROW_NUMBER_OPTIONS}
            disabled={disabled}
            labels={(labels as PaginationRowNumberSelectLabels) ?? defaultLabels}
            rowNumber={numberOfRows}
            onChange={value =>
              handleRowNumberChange({ value: String(value), label: String(value) })
            }
          />
        </Box>
      )}
      <Box display="flex" gap={2} marginLeft="auto">
        {getNavigationButtons()}
      </Box>
    </Box>
  );
};
