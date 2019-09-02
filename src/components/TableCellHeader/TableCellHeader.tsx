import { Theme } from "@material-ui/core/styles";
import TableCell, { TableCellProps } from "@material-ui/core/TableCell";
import makeStyles from "@material-ui/styles/makeStyles";
import classNames from "classnames";
import React from "react";

import ArrowSort from "../../icons/ArrowSort";

const useStyles = makeStyles((theme: Theme) => ({
  arrow: {
    transition: theme.transitions.duration.short + "ms"
  },
  arrowLeft: {
    marginLeft: -24
  },
  arrowUp: {
    transform: "rotate(180deg)"
  },
  label: {
    alignSelf: "center",
    display: "inline-block"
  },
  labelContainer: {
    display: "flex",
    height: 24
  },
  root: {
    cursor: "pointer"
  }
}));

export type TableCellHeaderArrowDirection = "asc" | "desc";
export type TableCellHeaderArrowPosition = "left" | "right";
export interface TableCellHeader extends TableCellProps {
  arrowPosition?: TableCellHeaderArrowPosition;
  direction?: TableCellHeaderArrowDirection;
}

const TableCellHeader: React.FC<TableCellHeader> = props => {
  const classes = useStyles(props);
  const { arrowPosition, children, className, direction, ...rest } = props;

  return (
    <TableCell {...rest} className={classNames(className, classes.root)}>
      <div className={classes.labelContainer}>
        {!!direction && arrowPosition === "left" && (
          <ArrowSort
            className={classNames(classes.arrow, classes.arrowLeft, {
              [classes.arrowUp]: direction === "asc"
            })}
          />
        )}
        <div className={classes.label}>{children}</div>
        {!!direction && arrowPosition === "right" && (
          <ArrowSort
            className={classNames(classes.arrow, {
              [classes.arrowUp]: direction === "asc"
            })}
          />
        )}
      </div>
    </TableCell>
  );
};

TableCellHeader.displayName = "TableCellHeader";
TableCellHeader.defaultProps = {
  arrowPosition: "left"
};
export default TableCellHeader;
