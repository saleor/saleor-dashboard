// @ts-strict-ignore
import TableRowLink from "@dashboard/components/TableRowLink";
import { TableCell, TableHead as MuiTableHead } from "@material-ui/core";
import { type TableHeadProps as MuiTableHeadProps } from "@material-ui/core/TableHead";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Checkbox as MacawCheckbox, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import type * as React from "react";
import { FormattedMessage } from "react-intl";

import { type Node } from "../../types";
import Checkbox from "../Checkbox";
import styles from "./TableHead.module.css";

interface TableHeadProps extends MuiTableHeadProps {
  colSpan: number;
  disabled: boolean;
  dragRows?: boolean;
  selected?: number;
  items: Node[] | undefined;
  toolbar?: React.ReactNode | React.ReactNodeArray;
  toggleAll?: (items: Node[], selected: number) => void;
  /** Macaw checkbox + compact header type, matching collection product tables. */
  compact?: boolean;
  /** Keep column labels visible while rows are selected (bulk actions live elsewhere). */
  keepColumnHeaders?: boolean;
}

const useStyles = makeStyles(
  theme => ({
    container: {
      alignItems: "center",
      display: "flex",
      gap: theme.spacing(1),
    },
    dragRows: {
      padding: 0,
      width: 52,
    },
    compactDrag: {
      padding: 0,
      width: 40,
    },
    compactCheckbox: {
      padding: 0,
      width: 20,
      height: "100%",
      lineHeight: 0,
      verticalAlign: "middle",
    },
    spacer: {
      flex: 1,
    },
    toolbar: {
      display: "flex",
      gap: theme.spacing(1),
    },
  }),
  { name: "TableHead" },
);

function getColSpan(colSpan: number, dragRows: boolean): number {
  if (dragRows) {
    return colSpan - 2;
  }

  return colSpan - 1;
}

const getSelectAllChecked = (
  items: Node[] | undefined,
  selected: number | undefined,
): boolean | "indeterminate" => {
  if (items && items.length > (selected ?? 0) && (selected ?? 0) > 0) {
    return "indeterminate";
  }

  return selected !== 0;
};

const TableHead = (props: TableHeadProps) => {
  const {
    children,
    colSpan,
    compact,
    disabled,
    dragRows,
    items,
    keepColumnHeaders,
    selected,
    toggleAll,
    toolbar,
    ...muiTableHeadProps
  } = props;
  const classes = useStyles(props);
  const selectAllChecked = getSelectAllChecked(items, selected);

  return (
    <MuiTableHead {...muiTableHeadProps}>
      <TableRowLink>
        {dragRows && (items === undefined || items.length > 0) && (
          <TableCell
            className={clsx(compact && classes.compactDrag, styles.dragSpacer)}
            aria-hidden
            data-test-id="drag-column-spacer"
          >
            <span className={styles.dragSpacerFill} />
          </TableCell>
        )}
        {(items === undefined || items.length > 0) && (
          <TableCell
            padding={compact ? "none" : "checkbox"}
            className={clsx({
              [classes.dragRows]: dragRows && !compact,
              [classes.compactCheckbox]: compact,
            })}
          >
            {compact ? (
              <Box display="flex" alignItems="center" height="100%">
                <MacawCheckbox
                  data-test-id="select-all-checkbox"
                  checked={selectAllChecked}
                  disabled={disabled}
                  onCheckedChange={() => toggleAll(items, selected)}
                />
              </Box>
            ) : (
              <Checkbox
                data-test-id="select-all-checkbox"
                indeterminate={items && items.length > selected && selected > 0}
                checked={selected !== 0}
                disabled={disabled}
                onChange={() => toggleAll(items, selected)}
              />
            )}
          </TableCell>
        )}
        {selected && !keepColumnHeaders ? (
          <TableCell colSpan={getColSpan(colSpan, dragRows)}>
            <div className={classes.container}>
              <Text
                data-test-id="SelectedText"
                size={compact ? 2 : undefined}
                lineHeight={compact ? 2 : undefined}
              >
                <FormattedMessage
                  id="imYtnq"
                  defaultMessage="Selected {number, plural, one {# item} other {# items}}"
                  values={{
                    number: selected,
                  }}
                />
              </Text>
              <div className={classes.spacer} />
              {toolbar && (
                <div data-test-id="bulk-delete-button" className={classes.toolbar}>
                  {toolbar}
                </div>
              )}
            </div>
          </TableCell>
        ) : (
          children
        )}
      </TableRowLink>
    </MuiTableHead>
  );
};

TableHead.displayName = "TableHead";
export default TableHead;
