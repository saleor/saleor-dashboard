import FullScreenIcon from "@saleor/icons/FullScreenIcon";
import { Button, makeStyles, PlusSmallIcon } from "@saleor/macaw-ui";
import clsx from "clsx";
import React, { FC, PropsWithChildren } from "react";

import CardTitle from "../CardTitle";

const useStyles = makeStyles(
  theme => ({
    btnContainer: {
      display: "flex",
      flexDirection: "row-reverse",
      gap: theme.spacing(1),
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

interface ButtonFullScreenProps {
  isOpen: boolean;
  onToggle: React.MouseEventHandler<HTMLButtonElement>;
}

const ButtonFullScreen: FC<PropsWithChildren<ButtonFullScreenProps>> = ({
  isOpen,
  onToggle,
  children,
}) => {
  const classes = useStyles();

  return (
    <Button
      data-test-id="button-exit-fullscreen"
      className={classes.headerBtn}
      variant="tertiary"
      onClick={onToggle}
    >
      <FullScreenIcon
        className={clsx(classes.fullScreenIcon, {
          [classes.fullScreenIconClose]: isOpen,
        })}
      />
      {children}
    </Button>
  );
};

interface ButtonAddRowProps {
  onAddRow: React.MouseEventHandler<HTMLButtonElement>;
}

const ButtonAddRow: FC<PropsWithChildren<ButtonAddRowProps>> = ({
  onAddRow,
  children,
}) => {
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

interface HeaderProps {
  title: string;
}

interface GridHeader extends FC<PropsWithChildren<HeaderProps>> {
  ButtonFullScreen: typeof ButtonFullScreen;
  ButtonAddRow: typeof ButtonAddRow;
}

const Header: GridHeader = ({ title, children }) => {
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
