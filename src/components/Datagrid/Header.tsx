import {
  ClickAwayListener,
  MenuItem,
  Paper,
  Popper,
  Typography,
} from "@material-ui/core";
import FullScreenIcon from "@saleor/icons/FullScreenIcon";
import { Button, makeStyles, PlusSmallIcon } from "@saleor/macaw-ui";
import clsx from "clsx";
import React, { FC, PropsWithChildren, useRef, useState } from "react";

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
    popover: {
      width: 150,
      zIndex: 3,
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
  onAddRow: (amount: number) => void;
}

const ButtonAddRow: FC<PropsWithChildren<ButtonAddRowProps>> = ({
  onAddRow,
  children,
}) => {
  const classes = useStyles();
  const anchor = useRef<HTMLDivElement>();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div ref={anchor}>
      <Button
        data-test-id="button-add-variant"
        className={classes.headerBtn}
        variant="tertiary"
        onClick={() => setIsOpen(true)}
      >
        <PlusSmallIcon />
        {children}
      </Button>
      <Popper
        anchorEl={anchor as any}
        open={isOpen}
        className={classes.popover}
        disablePortal
        placement="bottom-start"
      >
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
          <Paper elevation={20}>
            <div>
              <Typography color="textSecondary" variant="caption">
                How many varaints ?
              </Typography>
            </div>
            {[1, 5, 10, 15, 20].map((count, idx) => (
              <MenuItem
                key={idx}
                onClick={() => {
                  setIsOpen(false);
                  onAddRow(count);
                }}
              >
                {count}
              </MenuItem>
            ))}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
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
