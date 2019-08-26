import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import TableCell from "@material-ui/core/TableCell";
import MuiTableHead, {
  TableHeadProps as MuiTableHeadProps
} from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import { Node } from "../../types";

import Checkbox from "../Checkbox";

export interface TableHeadProps extends MuiTableHeadProps {
  colSpan: number;
  disabled: boolean;
  dragRows?: boolean;
  selected: number;
  items: Node[];
  toolbar: React.ReactNode | React.ReactNodeArray;
  toggleAll: (items: Node[], selected: number) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    cell: {
      padding: 0
    },
    checkboxPartialSelect: {
      "&:after": {
        background: theme.palette.common.white,
        content: "''",
        height: 2,
        position: "absolute",
        width: 4
      }
    },
    checkboxSelected: {
      backgroundColor: fade(theme.palette.primary.main, 0.05)
    },
    container: {
      alignItems: "center",
      display: "flex",
      height: 47,
      marginRight: -theme.spacing.unit * 2
    },
    dragRows: {
      padding: 0,
      width: 52
    },
    padding: {
      "&:last-child": {
        padding: 0
      }
    },
    root: {
      backgroundColor: fade(theme.palette.primary.main, 0.05),
      paddingLeft: 0,
      paddingRight: 24
    },
    spacer: {
      flex: 1
    },
    toolbar: {
      "& > *": {
        marginLeft: theme.spacing.unit
      }
    }
  });

const TableHead = withStyles(styles, {
  name: "TableHead"
})(
  ({
    classes,
    children,
    colSpan,
    disabled,
    dragRows,
    items,
    selected,
    toggleAll,
    toolbar,
    ...muiTableHeadProps
  }: TableHeadProps & WithStyles<typeof styles>) => {
    return (
      <MuiTableHead {...muiTableHeadProps}>
        <TableRow>
          {dragRows && (items === undefined || items.length > 0) && (
            <TableCell
              className={classNames({
                [classes.checkboxSelected]: selected
              })}
            />
          )}
          {(items === undefined || items.length > 0) && (
            <TableCell
              padding="checkbox"
              className={classNames({
                [classes.checkboxSelected]: selected,
                [classes.dragRows]: dragRows
              })}
            >
              <Checkbox
                className={classNames({
                  [classes.checkboxPartialSelect]:
                    items && items.length > selected && selected > 0
                })}
                checked={selected === 0 ? false : true}
                disabled={disabled}
                onChange={() => toggleAll(items, selected)}
              />
            </TableCell>
          )}
          {selected ? (
            <>
              <TableCell
                className={classNames(classes.root)}
                colSpan={colSpan - 1}
              >
                <div className={classes.container}>
                  {selected && (
                    <Typography>
                      <FormattedMessage
                        defaultMessage="Selected {number} items"
                        values={{
                          number: selected
                        }}
                      />
                    </Typography>
                  )}
                  <div className={classes.spacer} />
                  <div className={classes.toolbar}>{toolbar}</div>
                </div>
              </TableCell>
            </>
          ) : (
            children
          )}
        </TableRow>
      </MuiTableHead>
    );
  }
);
TableHead.displayName = "TableHead";
export default TableHead;
