import { TableCell, Toolbar } from "@material-ui/core";
import { IconButtonProps } from "@material-ui/core/IconButton";
import RowNumberSelect from "@saleor/components/RowNumberSelect";
import { maybe } from "@saleor/misc";
import { makeStyles } from "@saleor/theme";
import React from "react";

import { ListSettings } from "../../types";
import TablePaginationActions from "./TablePaginationActions";

const useStyles = makeStyles(
  theme => ({
    actions: {
      color: theme.palette.text.secondary,
      flexShrink: 0,
      marginLeft: theme.spacing(2.5)
    },
    caption: {
      flexShrink: 0
    },
    input: {
      flexShrink: 0,
      fontSize: "inherit"
    },
    root: {
      "&:last-child": {
        padding: 0
      }
    },
    select: {
      paddingLeft: theme.spacing(),
      paddingRight: theme.spacing(2)
    },
    selectIcon: {
      top: 1
    },
    selectRoot: {
      color: theme.palette.text.secondary,
      marginLeft: theme.spacing(),
      marginRight: theme.spacing(4)
    },
    spacer: {
      flex: "1 1 100%"
    },
    toolbar: {
      height: 56,
      minHeight: 56,
      paddingLeft: 2,
      paddingRight: 2
    }
  }),
  { name: "TablePagination" }
);

export type ListSettingsUpdate = <T extends keyof ListSettings>(
  key: T,
  value: ListSettings[T]
) => void;

interface TablePaginationProps {
  backIconButtonProps?: Partial<IconButtonProps>;
  colSpan: number;
  component?: string | typeof TableCell;
  settings?: ListSettings;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextIconButtonProps?: Partial<IconButtonProps>;
  onUpdateListSettings?: ListSettingsUpdate;
  onNextPage(event);
  onPreviousPage(event);
}

const TablePagination: React.FC<TablePaginationProps> = props => {
  const {
    backIconButtonProps,
    colSpan: colSpanProp,
    component: Component,
    settings,
    hasNextPage,
    hasPreviousPage,
    nextIconButtonProps,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    ...other
  } = props;
  const classes = useStyles(props);

  let colSpan;

  if (Component === TableCell || Component === "td") {
    colSpan = colSpanProp || 1000;
  }

  return (
    <Component className={classes.root} colSpan={colSpan} {...other}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.spacer}>
          {maybe(() => settings.rowNumber) && (
            <RowNumberSelect
              choices={[10, 20, 30, 50, 100]}
              rowNumber={settings.rowNumber}
              onChange={value => onUpdateListSettings("rowNumber", value)}
            />
          )}
        </div>
        <TablePaginationActions
          backIconButtonProps={backIconButtonProps}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          nextIconButtonProps={nextIconButtonProps}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
        />
      </Toolbar>
    </Component>
  );
};
TablePagination.defaultProps = {
  component: TableCell
};

TablePagination.displayName = "TablePagination";
export default TablePagination;
