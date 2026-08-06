import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { usePaginatorContext } from "@dashboard/hooks/usePaginator";
import { Box, Button, Select, Text } from "@saleor/macaw-ui-next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./Pagination.module.css";
import {
  COLLECTION_PRODUCT_TABLE_ACTION_INSET,
  COLLECTION_PRODUCT_TABLE_LEADING_INSET,
} from "./productTableLayout";

const ROW_NUMBER_OPTIONS = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];

interface PaginationProps {
  onUpdateListSettings: (key: "rowNumber", value: number) => void;
  numberOfRows: number;
  /** Override left inset (defaults to product-table leading inset). */
  paddingLeft?: string | number;
  /** Optional action immediately before the pagination arrows (e.g. bulk delete). */
  beforePagination?: ReactNode;
}

export const Pagination = ({
  onUpdateListSettings,
  numberOfRows,
  paddingLeft = COLLECTION_PRODUCT_TABLE_LEADING_INSET,
  beforePagination,
}: PaginationProps): JSX.Element => {
  const intl = useIntl();
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
      __paddingLeft={typeof paddingLeft === "number" ? undefined : paddingLeft}
      paddingLeft={typeof paddingLeft === "number" ? paddingLeft : undefined}
      paddingRight={COLLECTION_PRODUCT_TABLE_ACTION_INSET}
      paddingY={2}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Text color="default2" size={2}>
          <FormattedMessage id="nABmvC" defaultMessage="No. of rows" />
        </Text>
        <Select
          size="small"
          className={styles.rowNumberSelect}
          __width="60px"
          __minWidth="60px"
          options={ROW_NUMBER_OPTIONS}
          value={currentRowNumberOption ?? ROW_NUMBER_OPTIONS[1]}
          onChange={handleRowNumberChange}
        />
      </Box>
      <Box display="flex" alignItems="center" gap={2}>
        {beforePagination}
        <Button
          variant="secondary"
          size="small"
          type="button"
          disabled={!hasPreviousPage}
          onClick={loadPreviousPage}
          data-test-id="button-pagination-back"
          aria-label={intl.formatMessage({
            id: "/suM59",
            defaultMessage: "Previous page",
            description: "pagination previous page button aria label",
          })}
          icon={<ChevronLeft size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
        />
        <Button
          variant="secondary"
          size="small"
          type="button"
          disabled={!hasNextPage}
          onClick={loadNextPage}
          data-test-id="button-pagination-next"
          aria-label={intl.formatMessage({
            id: "xEyXOV",
            defaultMessage: "Next page",
            description: "pagination next page button aria label",
          })}
          icon={<ChevronRight size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
        />
      </Box>
    </Box>
  );
};
