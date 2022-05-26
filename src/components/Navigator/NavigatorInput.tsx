import { makeStyles, SearchLargeIcon } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { QuickSearchMode } from "./types";

const useStyles = makeStyles(
  theme => {
    const typography = {
      ...theme.typography.body1,
      color: theme.palette.saleor.main[1],
      fontWeight: 500,
      letterSpacing: "0.02rem",
    };

    return {
      adornment: {
        ...typography,
        alignSelf: "center",
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1),
        textAlign: "center",
        width: 32,
      },
      input: {
        "&::placeholder": {
          color: theme.palette.saleor.main[3],
        },
        ...typography,
        background: "transparent",
        border: "none",
        outline: 0,
        padding: 0,
        width: "100%",
      },
      root: {
        background: theme.palette.background.paper,
        display: "flex",
        padding: theme.spacing(2, 3),
        height: 72,
      },
      searchIcon: {
        alignSelf: "center",
        width: 32,
        height: 32,
        marginRight: theme.spacing(1),
      },
    };
  },
  {
    name: "NavigatorInput",
  },
);

interface NavigatorInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  mode: QuickSearchMode;
}

const NavigatorInput = React.forwardRef<HTMLInputElement, NavigatorInputProps>(
  (props, ref) => {
    const { mode, ...rest } = props;
    const classes = useStyles(props);
    const intl = useIntl();

    return (
      <div className={classes.root}>
        {mode !== "default" ? (
          <span className={classes.adornment}>
            {mode === "orders"
              ? "#"
              : mode === "customers"
              ? "@"
              : mode === "catalog"
              ? "$"
              : mode === "help"
              ? "?"
              : ">"}
          </span>
        ) : (
          <SearchLargeIcon className={classes.searchIcon} />
        )}
        <input
          autoFocus
          autoComplete="off"
          className={classes.input}
          placeholder={
            mode === "orders"
              ? intl.formatMessage({
                  id: "8B8E+3",
                  defaultMessage: "Order Number",
                  description: "navigator placeholder",
                })
              : mode === "commands"
              ? intl.formatMessage({
                  id: "NqxvFh",
                  defaultMessage: "Type Command",
                  description: "navigator placeholder",
                })
              : mode === "catalog"
              ? intl.formatMessage({
                  id: "AOI4LW",
                  defaultMessage: "Search in Catalog",
                  description: "navigator placeholder",
                })
              : mode === "customers"
              ? intl.formatMessage({
                  id: "TpPx7V",
                  defaultMessage: "Search Customer",
                  description: "navigator placeholder",
                })
              : mode === "default"
              ? intl.formatMessage(
                  {
                    id: "BooQvo",
                    defaultMessage: "Type {key} to see available actions",
                    description: "navigator placeholder",
                  },
                  {
                    key: "'?'",
                  },
                )
              : null
          }
          ref={ref}
          {...rest}
        />
      </div>
    );
  },
);

NavigatorInput.displayName = "NavigatorInput";
export default NavigatorInput;
