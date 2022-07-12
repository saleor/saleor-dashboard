import {
  TableCell,
  TableHead as MuiTableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { TableHeadProps as MuiTableHeadProps } from "@material-ui/core/TableHead";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import { Node } from "../../types";
import Checkbox from "../Checkbox";

export interface TableHeadProps extends MuiTableHeadProps {
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
    cell: {
      height: 56,
    },
    container: {
      alignItems: "center",
      display: "flex",
      height: 47,
      marginRight: theme.spacing(-2),
    },
    dragRows: {
      padding: 0,
      width: 52,
    },
    padding: {
      "&:last-child": {
        padding: 0,
      },
    },
    root: {
      paddingLeft: 0,
      paddingRight: theme.spacing(4),
    },
    spacer: {
      flex: 1,
    },
    toolbar: {
      "& > *": {
        marginLeft: theme.spacing(1),
      },
      marginRight: theme.spacing(1.5),
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

const TableHead: React.FC<TableHeadProps> = props => {
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
      <TableRow>
        {dragRows && (items === undefined || items.length > 0) && <TableCell />}
        {(items === undefined || items.length > 0) && (
          <TableCell
            padding="checkbox"
            className={classNames(classes.cell, {
              [classes.dragRows]: dragRows,
            })}
          >
            <Checkbox
              indeterminate={items && items.length > selected && selected > 0}
              checked={selected === 0 ? false : true}
              disabled={disabled}
              onChange={() => toggleAll(items, selected)}
            />
          </TableCell>
        )}
        {selected ? (
          <>
            <TableCell
              className={classNames(classes.cell, classes.root)}
              colSpan={getColSpan(colSpan, dragRows)}
            >
              <div className={classes.container}>
                {selected && (
                  <Typography>
                    <FormattedMessage
                      id="qu/hXD"
                      defaultMessage="Selected {number} items"
                      values={{
                        number: selected,
                      }}
                    />
                  </Typography>
                )}
                <div className={classes.spacer} />
                {toolbar && <div className={classes.toolbar}>{toolbar}</div>}
              </div>
            </TableCell>
          </>
        ) : (
          children
        )}
      </TableRow>
    </MuiTableHead>
  );
};
TableHead.displayName = "TableHead";
export default TableHead;
