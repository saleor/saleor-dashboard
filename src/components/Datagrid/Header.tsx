import FullScreenIcon from "@saleor/icons/FullScreenIcon";
import { Button, makeStyles, PlusSmallIcon } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

import CardTitle from "../CardTitle";

const useStyles = makeStyles(
  theme => ({
    btnContainer: {
      display: "flex",
      flexDirection: "row-reverse",
      gap: "10px",
    },
    headerBtn: {
      marginBottom: theme.spacing(2),
    },

    fullScreenIcon: {
      fontSize: 14,
    },
    fullScreenIconClose: {
      transform: "rotate(180deg)",
    },
  }),
  { name: "Datagrid" },
);

const ButtonFullScreen = ({ isOpen, onToggle, children }) => {
  const classes = useStyles();

  return (
    <Button
      data-test-id="button-exit-fullscreen"
      className={classes.headerBtn}
      variant="tertiary"
      onClick={onToggle}
    >
      <FullScreenIcon
        className={classNames(classes.fullScreenIcon, {
          [classes.fullScreenIconClose]: isOpen,
        })}
      />
      {children}
    </Button>
  );
};

const ButtonAddRow = ({ onAddRow, children }) => {
  const classes = useStyles();

  return (
    <Button
      data-test-id="button-add-variant"
      className={classes.headerBtn}
      variant="tertiary"
      onClick={onAddRow}
    >
      <PlusSmallIcon />
      {children}
    </Button>
  );
};

const Header = ({ title, children }) => {
  const classes = useStyles();

  return (
    <CardTitle
      title={title}
      toolbar={<div className={classes.btnContainer}>{children}</div>}
    />
  );
};

Header.ButtonFullScreen = ButtonFullScreen;
Header.ButtonAddRow = ButtonAddRow;

export { Header };
