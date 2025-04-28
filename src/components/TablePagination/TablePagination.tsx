import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { TableCell } from "@material-ui/core";
import {
  PaginationProps as MacawPaginationProps,
  PaginationRowNumberSelect,
  PaginationRowNumberSelectLabels,
} from "@saleor/macaw-ui";
import { Box, Button, ChevronLeftIcon, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { ListSettings } from "../../types";

export type ListSettingsUpdate = <T extends keyof ListSettings>(
  key: T,
  value: ListSettings[T],
) => void;

export interface PaginationProps
  extends Omit<
    MacawPaginationProps,
    "labels" | "rowNumber" | "nextIconButtonProps" | "prevIconButtonProps"
  > {
  component?: React.ElementType;
  colSpan?: number;
  settings?: ListSettings;
  onUpdateListSettings?: ListSettingsUpdate;
  prevHref?: string;
  nextHref?: string;
  disabled?: boolean;
  labels?: PaginationRowNumberSelectLabels;
}

const choices = [10, 20, 30, 50, 100];

export const TablePagination: React.FC<PaginationProps> = ({
  component,
  colSpan,
  settings,
  onUpdateListSettings,
  nextHref,
  prevHref,
  hasNextPage,
  hasPreviousPage,
  disabled,
  labels,
  onNextPage,
  onPreviousPage,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const Wrapper = component || TableCell;

  const handlers = {
    onPreviousPage: prevHref ? () => navigate(prevHref) : onPreviousPage,
    onNextPage: nextHref ? () => navigate(nextHref) : onNextPage,
  };

  return (
    <Wrapper colSpan={colSpan || 1000}>
      <Box display="flex" justifyContent="space-between" paddingY={4}>
        {settings?.rowNumber && (
          <PaginationRowNumberSelect
            choices={choices}
            disabled={disabled}
            labels={labels || { noOfRows: intl.formatMessage(commonMessages.noOfRows) }}
            rowNumber={settings?.rowNumber}
            onChange={
              onUpdateListSettings ? value => onUpdateListSettings("rowNumber", value) : undefined
            }
          />
        )}

        <Box display="flex" flexDirection="row" alignItems="center" gap={2} marginLeft="auto">
          <Button
            variant="secondary"
            disabled={!hasPreviousPage || disabled}
            onClick={handlers.onPreviousPage}
            icon={<ChevronLeftIcon />}
            data-test-id="button-pagination-back"
          />
          <Button
            variant="secondary"
            disabled={!hasNextPage || disabled}
            onClick={handlers.onNextPage}
            icon={<ChevronRightIcon />}
            data-test-id="button-pagination-next"
          />
        </Box>
      </Box>
    </Wrapper>
  );
};

TablePagination.displayName = "TablePagination";
export default TablePagination;
