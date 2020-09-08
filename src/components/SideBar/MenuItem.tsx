import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { fade } from "@material-ui/core/styles/colorManipulator";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import React from "react";
import SVG from "react-inlinesvg";

import { IMenuItem } from "../AppLayout/menuStructure";

export interface MenuItemProps {
  active: boolean;
  isMenuShrunk: boolean;
  menuItem: IMenuItem;
  onClick: (url: string, event: React.MouseEvent) => void;
}

export const menuWidth = 210;
export const shrunkMenuWidth = 72;

const useStyles = makeStyles(
  theme => ({
    hideLabel: {
      "&$label": {
        opacity: 0
      }
    },
    icon: {
      "& svg": {
        height: 24,
        width: 24
      },
      marginRight: theme.spacing(1.5),
      transition: theme.transitions.duration.shortest + "ms"
    },
    label: {
      cursor: "pointer",
      display: "block",
      fontSize: 16,
      fontWeight: "bold",
      opacity: 1,
      transition: theme.transitions.duration.shortest + "ms"
    },
    paper: {
      borderRadius: 16,
      cursor: "default",
      padding: theme.spacing(3),
      textAlign: "left"
    },
    popper: {
      marginLeft: theme.spacing(3),
      zIndex: 2
    },
    root: {
      "&:hover, &:focus": {
        color: theme.palette.primary.main,
        outline: 0
      },
      background: "none",
      border: "none",
      borderBottomRightRadius: 100,
      borderTopRightRadius: 100,
      color: fade(theme.palette.text.primary, 0.6),
      cursor: "pointer",
      display: "flex",
      height: 56,
      marginBottom: theme.spacing(),
      overflow: "hidden",
      padding: theme.spacing(2, 3, 2, 3.5),
      transition: theme.transitions.duration.shortest + "ms",
      width: shrunkMenuWidth
    },
    rootActive: {
      "&$root": {
        background: theme.palette.background.paper,
        boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.16)",
        color: theme.palette.primary.main
      }
    },
    rootExpanded: {
      width: menuWidth
    },
    subMenuLabel: {
      "&$label": {
        "&:not(:last-child)": {
          marginBottom: theme.spacing(2)
        }
      },
      "&:hover, &:focus": {
        color: theme.palette.primary.main
      },
      background: "none",
      border: "none",
      color: fade(theme.palette.text.primary, 0.6)
    }
  }),
  {
    name: "MenuItem"
  }
);

const MenuItem: React.FC<MenuItemProps> = ({
  active,
  menuItem,
  isMenuShrunk,
  onClick
}) => {
  const classes = useStyles({});
  const [open, setOpen] = React.useState(false);
  const anchor = React.useRef<HTMLButtonElement>(null);

  const handleClick = (event: React.MouseEvent, menuItem: IMenuItem) => {
    if (menuItem.children) {
      setOpen(true);
    } else {
      onClick(menuItem.url, event);
      setOpen(false);
    }
  };

  return (
    <button
      className={classNames(classes.root, {
        [classes.rootActive]: active,
        [classes.rootExpanded]: !isMenuShrunk
      })}
      ref={anchor}
      onClick={event => handleClick(event, menuItem)}
    >
      {menuItem.icon && <SVG className={classes.icon} src={menuItem.icon} />}
      <Typography
        aria-label={menuItem.ariaLabel}
        className={classNames(classes.label, {
          [classes.hideLabel]: isMenuShrunk
        })}
        variant="body2"
        data-test="menu-item-label"
        data-test-id={menuItem.testingContextId}
      >
        {menuItem.label}
      </Typography>
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
                <Typography
                  aria-label={subMenuItem.ariaLabel}
                  component="button"
                  className={classNames(classes.label, classes.subMenuLabel)}
                  key={subMenuItem.url}
                  onClick={event => {
                    event.preventDefault();
                    handleClick(event, subMenuItem);
                  }}
                  data-test="submenu-item-label"
                  data-test-id={subMenuItem.testingContextId}
                  variant="body2"
                >
                  {subMenuItem.label}
                </Typography>
              ))}
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
    </button>
  );
};

MenuItem.displayName = "MenuItem";
export default MenuItem;
