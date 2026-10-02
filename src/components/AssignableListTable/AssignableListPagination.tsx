import { PaginationButtons } from "@dashboard/components/PaginationButtons/PaginationButtons";
import { usePaginatorContext } from "@dashboard/hooks/usePaginator";
import { Box, type BoxProps, Select, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import styles from "./AssignableListPagination.module.css";
import {
  ASSIGNABLE_LIST_TABLE_ACTION_INSET,
  ASSIGNABLE_LIST_TABLE_CARD_LEADING_INSET,
  ASSIGNABLE_LIST_TABLE_DRAG_ALIGNED_LEADING_INSET,
  ASSIGNABLE_LIST_TABLE_LEADING_INSET,
  ASSIGNABLE_LIST_TABLE_PAGINATION_PADDING_Y,
} from "./assignableListTableLayout";

const ROW_NUMBER_OPTIONS = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];

type AssignableListPaginationInset = "card" | "nested" | "drag";

const INSET: Record<AssignableListPaginationInset, number | string> = {
  card: ASSIGNABLE_LIST_TABLE_CARD_LEADING_INSET,
  nested: ASSIGNABLE_LIST_TABLE_LEADING_INSET,
  drag: ASSIGNABLE_LIST_TABLE_DRAG_ALIGNED_LEADING_INSET,
};

interface AssignableListPaginationProps {
  onUpdateListSettings: (key: "rowNumber", value: number) => void;
  numberOfRows: number;
  /**
   * Left inset aligned to the table’s first content column.
   * `card` — flush DetailSettingsCard (spacing-6).
   * `nested` — catalogue / inset panels (spacing-4).
   * `drag` — tables with a 40px drag column (grip-aligned).
   */
  inset?: AssignableListPaginationInset;
  /**
   * Override left inset. Numbers are Macaw spacing tokens.
   * Strings are raw CSS (e.g. `calc(...)`). Prefer `inset` when possible.
   */
  paddingLeft?: number | string;
  /** Optional action immediately before the pagination arrows (e.g. bulk delete). */
  beforePagination?: ReactNode;
}

const getPaddingLeftProps = (
  paddingLeft: number | string,
): Pick<BoxProps, "paddingLeft"> | { __paddingLeft: string } => {
  if (typeof paddingLeft === "string") {
    return { __paddingLeft: paddingLeft };
  }

  return { paddingLeft: paddingLeft as BoxProps["paddingLeft"] };
};

export const AssignableListPagination = ({
  onUpdateListSettings,
  numberOfRows,
  inset = "card",
  paddingLeft,
  beforePagination,
}: AssignableListPaginationProps): React.ReactNode => {
  const { hasNextPage, hasPreviousPage, loadNextPage, loadPreviousPage } = usePaginatorContext();
  const currentRowNumber = String(numberOfRows);
  const currentRowNumberOption = ROW_NUMBER_OPTIONS.find(
    option => option.value === currentRowNumber,
  );
  const resolvedPaddingLeft = paddingLeft ?? INSET[inset];

  const handleRowNumberChange = ({ value }: { value: string; label: string }): void => {
    onUpdateListSettings("rowNumber", parseInt(value, 10));
  };

  return (
    <Box
      className={styles.footer}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      {...getPaddingLeftProps(resolvedPaddingLeft)}
      paddingRight={ASSIGNABLE_LIST_TABLE_ACTION_INSET}
      paddingY={ASSIGNABLE_LIST_TABLE_PAGINATION_PADDING_Y}
      data-test-id="assignable-list-pagination"
    >
      <Box display="flex" alignItems="center">
        <Text color="default2" size={2} className={styles.rowNumberLabel}>
          <FormattedMessage id="nABmvC" defaultMessage="No. of rows" />
        </Text>
        <Select
          size="small"
          className={styles.rowNumberSelect}
          __width="60px"
          __minWidth="60px"
          options={ROW_NUMBER_OPTIONS}
          value={currentRowNumberOption ?? ROW_NUMBER_OPTIONS[0]}
          onChange={handleRowNumberChange}
        />
      </Box>
      <Box display="flex" alignItems="center" gap={2}>
        {beforePagination}
        <PaginationButtons
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          onPreviousPage={loadPreviousPage}
          onNextPage={loadNextPage}
        />
      </Box>
    </Box>
  );
};

AssignableListPagination.displayName = "AssignableListPagination";
