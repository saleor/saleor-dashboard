// @ts-strict-ignore
import { isDarkTheme } from "@dashboard/misc";
import { alpha } from "@material-ui/core/styles";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import ArrowRight from "@material-ui/icons/ArrowRight";
import { IconButton, makeStyles, useTheme } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    dark: {
      "& svg": {
        color: theme.palette.primary.main,
      },
      "&$disabled": {
        "& svg": {
          color: alpha(theme.palette.primary.main, 0.2),
        },
      },
      "&:focus, &:hover": {
        "& > span:first-of-type": {
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
        },
      },
    },
    disabled: {},
    iconButton: {
      "& > span:first-of-type": {
        backgroundColor: theme.palette.background.default,
        borderRadius: "100%",
        transition: theme.transitions.duration.standard + "ms",
      },
      "& svg": {
        border: `solid 1px #BDBDBD`,
        borderRadius: "50%",
      },
      "&:focus, &:hover": {
        "& > span:first-of-type": {
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
        },
        backgroundColor: "transparent",
      },
      padding: 6,
    },
    root: {
      color: theme.palette.text.secondary,
      flexShrink: 0,
      margin: theme.spacing(0, 2.5),
    },
  }),
  { name: "TablePaginationActions" },
);

export interface TablePaginationActionsProps {
  backIconButtonProps?: any;
  className?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextIconButtonProps?: any;
  onNextPage: (event) => any;
  onPreviousPage: (event) => any;
}

export const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const {
    backIconButtonProps,
    className,
    hasNextPage,
    hasPreviousPage,
    nextIconButtonProps,
    onNextPage,
    onPreviousPage,
    ...other
  } = props;
  const classes = useStyles(props);
  const { direction, themeType } = useTheme();
  const isDark = isDarkTheme(themeType);

  return (
    <div className={clsx(classes.root, className)} {...other}>
      <IconButton
        variant="secondary"
        className={clsx(classes.iconButton, {
          [classes.dark]: isDark,
          [classes.disabled]: !hasPreviousPage,
        })}
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        data-test-id="button-pagination-back"
        {...backIconButtonProps}
      >
        {direction === "rtl" ? <ArrowRight /> : <ArrowLeft />}
      </IconButton>
      <IconButton
        className={clsx(classes.iconButton, {
          [classes.dark]: isDark,
          [classes.disabled]: !hasNextPage,
        })}
        onClick={onNextPage}
        disabled={!hasNextPage}
        data-test-id="button-pagination-next"
        {...nextIconButtonProps}
      >
        {direction === "rtl" ? <ArrowLeft /> : <ArrowRight />}
      </IconButton>
    </div>
  );
};

TablePaginationActions.displayName = "TablePaginationActions";
export default TablePaginationActions;
