import IconButton from "@material-ui/core/IconButton";
import { makeStyles, useTheme as useMuiTheme } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import ArrowRight from "@material-ui/icons/ArrowRight";
import useTheme from "@saleor/hooks/useTheme";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    dark: {
      "& svg": {
        color: theme.palette.primary.main
      },
      "&$disabled": {
        "& svg": {
          color: fade(theme.palette.primary.main, 0.2)
        }
      },
      "&:focus, &:hover": {
        "& > span:first-of-type": {
          backgroundColor: fade(theme.palette.primary.main, 0.2)
        }
      }
    },
    disabled: {},
    iconButton: {
      "& > span:first-of-type": {
        backgroundColor: theme.palette.background.default,
        borderRadius: "100%",
        transition: theme.transitions.duration.standard + "ms"
      },
      "& svg": {
        border: `solid 1px #BDBDBD`,
        borderRadius: "50%"
      },
      "&:focus, &:hover": {
        "& > span:first-of-type": {
          backgroundColor: fade(theme.palette.primary.main, 0.2)
        },
        backgroundColor: "transparent"
      },
      padding: 6
    },
    root: {
      color: theme.palette.text.secondary,
      flexShrink: 0,
      margin: theme.spacing(0, 2.5)
    }
  }),
  { name: "TablePaginationActions" }
);

export interface TablePaginationActionsProps {
  backIconButtonProps?: any;
  className?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextIconButtonProps?: any;
  onNextPage(event);
  onPreviousPage(event);
}

export const TablePaginationActions: React.FC<
  TablePaginationActionsProps
> = props => {
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

  const { isDark } = useTheme();
  const { direction } = useMuiTheme();

  return (
    <div className={classNames(classes.root, className)} {...other}>
      <IconButton
        className={classNames(classes.iconButton, {
          [classes.dark]: isDark,
          [classes.disabled]: !hasPreviousPage
        })}
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        data-tc="button-pagination-back"
        {...backIconButtonProps}
      >
        {direction === "rtl" ? <ArrowRight /> : <ArrowLeft />}
      </IconButton>
      <IconButton
        className={classNames(classes.iconButton, {
          [classes.dark]: isDark,
          [classes.disabled]: !hasNextPage
        })}
        onClick={onNextPage}
        disabled={!hasNextPage}
        data-tc="button-pagination-next"
        {...nextIconButtonProps}
      >
        {direction === "rtl" ? <ArrowLeft /> : <ArrowRight />}
      </IconButton>
    </div>
  );
};

TablePaginationActions.displayName = "TablePaginationActions";
export default TablePaginationActions;
