import { GridTable } from "@dashboard/components/GridTable";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import Link from "@dashboard/components/Link";
import { Placeholder } from "@dashboard/components/Placeholder";
import { buttonMessages } from "@dashboard/intl";
import { renderCollection } from "@dashboard/misc";
import { Box, Button, Checkbox, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./AssignableListTable.module.css";
import {
  ASSIGNABLE_LIST_TABLE_ACTION_INSET,
  ASSIGNABLE_LIST_TABLE_ACTIONS_COLUMN_WIDTH,
  ASSIGNABLE_LIST_TABLE_ACTIONS_COLUMN_WIDTH_COMPACT,
  ASSIGNABLE_LIST_TABLE_CARD_LEADING_INSET,
  ASSIGNABLE_LIST_TABLE_LEADING_INSET,
  type AssignableListTableLeadingInset,
  getAssignableListCheckboxColumnWidth,
} from "./assignableListTableLayout";

export interface AssignableListColumn {
  id: string;
  width?: string;
  header: ReactNode;
  /** Hide this column header while bulk-selection is active. */
  hideHeaderWhenSelected?: boolean;
  /** Header text alignment. Pair with `AssignableListCell align` on body cells. */
  align?: "start" | "end";
}

interface AssignableListTableProps<T extends { id: string }> {
  items: Array<T | null | undefined> | undefined;
  columns: AssignableListColumn[];
  disabled?: boolean;
  selected: number;
  isChecked: (id: string) => boolean | undefined;
  toggle: (id: string) => void;
  toggleAll: (items: T[], selected: number) => void;
  onUnassign: (id: string) => void;
  /** Bulk action shown in the header when rows are selected. */
  toolbar?: ReactNode;
  emptyMessage: ReactNode;
  emptyIcon?: ReactNode;
  renderCells: (item: T) => ReactNode;
  rowTestId?: string;
  "data-test-id"?: string;
  /**
   * Left inset before the checkbox. Use `ASSIGNABLE_LIST_TABLE_CARD_LEADING_INSET`
   * when flush inside a DetailSettingsCard so rows align with the title.
   */
  leadingInset?: AssignableListTableLeadingInset;
}

const areAllChecked = <T,>(items: T[], selected: number): boolean | "indeterminate" => {
  if (items.length > selected && selected > 0) {
    return "indeterminate";
  }

  return selected !== 0;
};

export const AssignableListTable = <T extends { id: string }>({
  items,
  columns,
  disabled,
  selected,
  isChecked,
  toggle,
  toggleAll,
  onUnassign,
  toolbar,
  emptyMessage,
  emptyIcon,
  renderCells,
  rowTestId = "assignable-list-row",
  "data-test-id": dataTestId = "assignable-list-table",
  leadingInset = ASSIGNABLE_LIST_TABLE_LEADING_INSET,
}: AssignableListTableProps<T>): JSX.Element => {
  const intl = useIntl();
  const checkboxCellClassName =
    leadingInset === ASSIGNABLE_LIST_TABLE_CARD_LEADING_INSET
      ? styles.checkboxCellCard
      : styles.checkboxCell;
  const checkboxColumnWidth = getAssignableListCheckboxColumnWidth(leadingInset);
  // Compact when idle so content columns keep the space; widen only for bulk toolbar.
  const actionsColumnWidth =
    selected > 0 && toolbar
      ? ASSIGNABLE_LIST_TABLE_ACTIONS_COLUMN_WIDTH
      : ASSIGNABLE_LIST_TABLE_ACTIONS_COLUMN_WIDTH_COMPACT;

  if (items === undefined) {
    return (
      <Box padding={leadingInset}>
        <Skeleton __height="3rem" />
      </Box>
    );
  }

  const concreteItems = items.filter((item): item is T => item != null);

  if (concreteItems.length === 0) {
    return (
      <Box padding={leadingInset} data-test-id={`${dataTestId}-empty`}>
        <Placeholder icon={emptyIcon}>{emptyMessage}</Placeholder>
      </Box>
    );
  }

  const allChecked = areAllChecked(concreteItems, selected);

  return (
    <GridTable borderWidth={0} className={styles.table} data-test-id={dataTestId}>
      <GridTable.Colgroup>
        <GridTable.Col __width={checkboxColumnWidth} />
        {columns.map(column =>
          column.width ? (
            <GridTable.Col key={column.id} style={{ width: column.width }} />
          ) : (
            <GridTable.Col key={column.id} />
          ),
        )}
        <GridTable.Col style={{ width: actionsColumnWidth }} />
      </GridTable.Colgroup>
      <GridTable.Body>
        <GridTable.Row className={styles.headerRow}>
          <GridTable.Cell padding={0} borderWidth={0} className={checkboxCellClassName}>
            <Box display="flex" alignItems="center" height="100%">
              <Checkbox
                data-test-id="select-all-checkbox"
                checked={allChecked}
                disabled={disabled}
                onCheckedChange={() => toggleAll(concreteItems, selected)}
              />
            </Box>
          </GridTable.Cell>
          {columns.map((column, index) => (
            <GridTable.Cell key={column.id} borderWidth={0} padding={0}>
              {selected && index === 0 ? (
                <Text data-test-id="SelectedText" size={2} lineHeight={2}>
                  <FormattedMessage
                    id="qu/hXD"
                    defaultMessage="Selected {number} items"
                    values={{ number: selected }}
                  />
                </Text>
              ) : !selected || !column.hideHeaderWhenSelected ? (
                <Text
                  size={2}
                  lineHeight={2}
                  color="default2"
                  ellipsis
                  display="block"
                  width="100%"
                  textAlign={column.align === "end" ? "right" : "left"}
                >
                  {column.header}
                </Text>
              ) : null}
            </GridTable.Cell>
          ))}
          <GridTable.Cell borderWidth={0} padding={0}>
            <Box
              width="100%"
              paddingRight={ASSIGNABLE_LIST_TABLE_ACTION_INSET}
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              gap={2}
              height="100%"
            >
              {selected ? toolbar : null}
            </Box>
          </GridTable.Cell>
        </GridTable.Row>
        {renderCollection(items, item => {
          if (!item) {
            return (
              <GridTable.Row key="skeleton" __height="50px">
                <GridTable.Cell padding={2}>
                  <Skeleton />
                </GridTable.Cell>
              </GridTable.Row>
            );
          }

          const isSelected = isChecked(item.id);

          return (
            <GridTable.Row
              key={item.id}
              className={styles.row}
              __height="50px"
              data-test-id={rowTestId}
              backgroundColor={{
                hover: "default1Hovered",
                default: "default1",
              }}
              selected={isSelected}
            >
              <GridTable.Cell __height="inherit" padding={0} className={checkboxCellClassName}>
                <Box display="flex" alignItems="center" height="100%">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    onCheckedChange={() => toggle(item.id)}
                  />
                </Box>
              </GridTable.Cell>
              {renderCells(item)}
              <GridTable.Cell __height="inherit" padding={0}>
                <Box
                  className={styles.rowDelete}
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  paddingRight={ASSIGNABLE_LIST_TABLE_ACTION_INSET}
                  width="100%"
                  height="100%"
                >
                  <Button
                    data-test-id="delete-icon"
                    variant="tertiary"
                    type="button"
                    disabled={disabled}
                    onClick={event => {
                      event.stopPropagation();
                      onUnassign(item.id);
                    }}
                    title={intl.formatMessage(buttonMessages.delete)}
                    icon={
                      <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                    }
                  />
                </Box>
              </GridTable.Cell>
            </GridTable.Row>
          );
        })}
      </GridTable.Body>
    </GridTable>
  );
};

export const AssignableListCell = ({
  children,
  truncate = false,
  align = "start",
}: {
  children: ReactNode;
  truncate?: boolean;
  align?: "start" | "end";
}): JSX.Element => (
  <GridTable.Cell
    __height="inherit"
    padding={0}
    className={truncate ? styles.truncateCell : undefined}
  >
    <Box
      className={styles.cellContent}
      justifyContent={align === "end" ? "flex-end" : "flex-start"}
    >
      {children}
    </Box>
  </GridTable.Cell>
);

export const AssignableListLinkCell = ({
  href,
  title,
  children,
}: {
  href: string;
  /** Full label for native browser tooltip when the cell truncates. */
  title?: string;
  children: ReactNode;
}): JSX.Element => (
  <GridTable.Cell __height="inherit" padding={0} className={styles.truncateCell}>
    <Link href={href} inline={false} className={styles.cellLink} title={title}>
      <Box className={styles.cellContent}>{children}</Box>
    </Link>
  </GridTable.Cell>
);

AssignableListTable.displayName = "AssignableListTable";
