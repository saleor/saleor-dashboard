// @ts-strict-ignore
import TableRowLink from "@dashboard/components/TableRowLink";
import { TableCell, TableHead as MuiTableHead } from "@material-ui/core";
import { TableHeadProps as MuiTableHeadProps } from "@material-ui/core/TableHead";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { Node } from "../../types";
import Checkbox from "../Checkbox";

interface TableHeadProps extends MuiTableHeadProps {
  colSpan: number;
  disabled: boolean;
  dragRows?: boolean;
  selected?: number;
  items: Node[];
  toolbar?: React.ReactNode | React.ReactNodeArray;
  toggleAll?: (items: Node[], selected: number) => void;
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

const TableHead = (props: TableHeadProps) => {
  const {
    children,
    colSpan,
    disabled,
    dragRows,
    items,
    selected,
    toggleAll,
    toolbar,
    ...muiTableHeadProps
  } = props;
  const classes = useStyles(props);

  return (
    <MuiTableHead {...muiTableHeadProps}>
      <TableRowLink>
        {dragRows && (items === undefined || items.length > 0) && <TableCell />}
        {(items === undefined || items.length > 0) && (
          <TableCell padding="checkbox" className={clsx({ [classes.dragRows]: dragRows })}>
            <Checkbox
              data-test-id="select-all-checkbox"
              indeterminate={items && items.length > selected && selected > 0}
              checked={selected !== 0}
              disabled={disabled}
              onChange={() => toggleAll(items, selected)}
            />
          </TableCell>
        )}
        {selected ? (
          <TableCell colSpan={getColSpan(colSpan, dragRows)}>
            <div className={classes.container}>
              <Text data-test-id="SelectedText">
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
