import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { fade } from "@material-ui/core/styles/colorManipulator";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";

import { IMenuItem } from "../AppLayout/menuStructure";

export interface MenuItemProps {
  menuItem: IMenuItem;
  onClick: (url: string, event: React.MouseEvent) => void;
}

const useStyles = makeStyles(
  theme => ({
    paper: {
      borderRadius: 16,
      padding: theme.spacing(3)
    },
    popper: {
      marginLeft: theme.spacing(3),
      zIndex: 2
    }
  }),
  {
    name: "MenuItem"
  }
);

const MenuItem: React.FC<MenuItemProps> = ({ menuItem, onClick }) => {
  const classes = useStyles({});
  const [open, setOpen] = React.useState(false);
  const anchor = React.useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent, menuItem: IMenuItem) => {
    if (menuItem.children) {
      setOpen(true);
    } else {
      onClick(menuItem.url, event);
      setOpen(false);
    }
  };

  return (
    <div ref={anchor} onClick={event => handleClick(event, menuItem)}>
      {menuItem.label}
      {menuItem.children && (
        <Popper
          className={classes.popper}
          open={open}
          anchorEl={anchor.current}
          transition
          disablePortal
          placement="right-start"
        >
          <ClickAwayListener
            onClickAway={() => setOpen(false)}
            mouseEvent="onClick"
          >
            <Paper elevation={6} className={classes.paper}>
              {menuItem.children.map(subMenuItem => (
                <div
                  key={subMenuItem.url}
                  onClick={event => handleClick(event, subMenuItem)}
                  data-test="select-option"
                >
                  {subMenuItem.label}
                </div>
              ))}
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
    </div>
  );
};

MenuItem.displayName = "MenuItem";
export default MenuItem;
