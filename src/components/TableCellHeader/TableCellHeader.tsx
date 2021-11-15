import { TableCell } from "@material-ui/core";
import { TableCellProps } from "@material-ui/core/TableCell";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

import ArrowSort from "../../icons/ArrowSort";

const useStyles = makeStyles(
  theme => ({
    arrow: {
      transition: theme.transitions.duration.short + "ms"
    },
    arrowLeft: {
      marginLeft: -24
    },
    arrowUp: {
      transform: "rotate(180deg)"
    },
    disabled: {
      opacity: 0.7,
      "&&": {
        cursor: "unset"
      }
    },
    label: {
      alignSelf: "center",
      display: "inline-block"
    },
    labelContainer: {
      "&:hover": {
        color: theme.palette.text.primary
      },
      display: "flex",
      height: 24
    },
    labelContainerActive: {
      color: theme.palette.text.primary
    },
    labelContainerCenter: {
      justifyContent: "center"
    },
    labelContainerRight: {
      justifyContent: "flex-end"
    },
    root: {
      cursor: "pointer"
    }
  }),
  { name: "TableCellHeader" }
);

export type TableCellHeaderArrowDirection = "asc" | "desc";
export type TableCellHeaderArrowPosition = "left" | "right";
export interface TableCellHeaderProps extends TableCellProps {
  arrowPosition?: TableCellHeaderArrowPosition;
  direction?: TableCellHeaderArrowDirection;
  textAlign?: "left" | "center" | "right";
  disabled?: boolean;
}

const TableCellHeader: React.FC<TableCellHeaderProps> = props => {
  const classes = useStyles(props);
  const {
    arrowPosition,
    children,
    className,
    direction,
    textAlign,
    disabled = false,
    onClick,
    ...rest
  } = props;

  return (
    <TableCell
      {...rest}
      onClick={e => {
        if (!disabled) {
          onClick(e);
        }
      }}
      className={classNames(classes.root, className, {
        [classes.disabled]: disabled
      })}
    >
      <div
        className={classNames(classes.labelContainer, {
          [classes.labelContainerActive]: !!direction && !!arrowPosition,
          [classes.labelContainerCenter]: textAlign === "center",
          [classes.labelContainerRight]: textAlign === "right"
        })}
      >
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
  arrowPosition: "left",
  textAlign: "left"
};
export default TableCellHeader;
