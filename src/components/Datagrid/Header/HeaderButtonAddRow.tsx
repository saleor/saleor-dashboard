import { ClickAwayListener, MenuItem, Paper, Popper } from "@material-ui/core";
import { Button, ChevronIcon, makeStyles } from "@saleor/macaw-ui";
import React, { ReactNode, useRef, useState } from "react";

interface HeaderButtonAddRowProps {
  onAddRow: (amount: number) => void;
  children: ReactNode;
}

const useStyles = makeStyles<{ isOpen: boolean }>(
  theme => ({
    headerBtn: {
      marginBottom: theme.spacing(2),
      zIndex: 4,
      transition: "borderRadius .2s ease-in-out",
      borderBottomLeftRadius: ({ isOpen }) => (isOpen ? 0 : 4),
      borderBottomRightRadius: ({ isOpen }) => (isOpen ? 0 : 4),
      "& svg": {
        marginRight: 0,
        marginLeft: theme.spacing(1),
      },
    },
    popover: {
      width: "100%",
      zIndex: 3,
      border: `1px solid ${theme.palette.saleor.main[5]}`,
      borderTopWidth: 0,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
    },
    chervonIcon: {
      transition: "transform .2s ease-in-out",
      transform: ({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0)"),
    },
    container: {
      position: "relative",
    },
  }),
  { name: "DatagridHeaderButtonAddRow" },
);

const ADD_ROWS_OPTIONS = [1, 10, 15, 20, 30];

export const HeaderButtonAddRow = ({
  onAddRow,
  children,
}: HeaderButtonAddRowProps) => {
  const anchor = useRef<HTMLButtonElement>();
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles({ isOpen });

  const handleOpenMenu = () => setIsOpen(true);
  const handleCloseMenu = () => setIsOpen(false);

  const handleSelectMenuItem = (count: number) => {
    setIsOpen(false);
    onAddRow(count);
  };

  return (
    <div className={classes.container}>
      <Button
        data-test-id="button-add-variant"
        className={classes.headerBtn}
        variant="tertiary"
        onClick={handleOpenMenu}
        ref={anchor}
      >
        {children}
        <ChevronIcon className={classes.chervonIcon} />
      </Button>
      <Popper
        anchorEl={anchor.current}
        open={isOpen}
        className={classes.popover}
        disablePortal
        placement="bottom-start"
      >
        <ClickAwayListener onClickAway={handleCloseMenu}>
          <Paper elevation={20}>
            {ADD_ROWS_OPTIONS.map(count => (
              <MenuItem key={count} onClick={() => handleSelectMenuItem(count)}>
                +{count}
              </MenuItem>
            ))}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};
