import { ClickAwayListener, MenuItem, Paper, Popper } from "@material-ui/core";
import { Button, makeStyles, PlusSmallIcon } from "@saleor/macaw-ui";
import React, { ReactNode, useRef, useState } from "react";

interface HeaderButtonAddRowProps {
  onAddRow: (amount: number) => void;
  children: ReactNode;
}

const useStyles = makeStyles(
  theme => ({
    headerBtn: {
      marginBottom: theme.spacing(2),
    },
    popover: {
      width: 140,
      zIndex: 3,
    },
  }),
  { name: "DatagridHeaderButtonAddRow" },
);

const ADD_ROWS_OPTIONS = [1, 10, 15, 20, 30];

export const HeaderButtonAddRow = ({
  onAddRow,
  children,
}: HeaderButtonAddRowProps) => {
  const classes = useStyles();
  const anchor = useRef<HTMLButtonElement>();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenMenu = () => setIsOpen(true);
  const handleCloseMenu = () => setIsOpen(false);

  const handleSelectMenuItem = (count: number) => {
    setIsOpen(false);
    onAddRow(count);
  };

  return (
    <>
      <Button
        data-test-id="button-add-variant"
        className={classes.headerBtn}
        variant="tertiary"
        onClick={handleOpenMenu}
        ref={anchor}
      >
        <PlusSmallIcon />
        {children}
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
                {count}
              </MenuItem>
            ))}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};
