import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { fade } from "@material-ui/core/styles/colorManipulator";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import classNames from "classnames";
import React from "react";
import SVG from "react-inlinesvg";

import { IMenuItem } from "../AppLayout/menuStructure";

export interface MenuItemProps {
  active: boolean;
  isMenuShrunk: boolean;
  menuItem: IMenuItem;
  onClick: UseNavigatorResult;
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
    menuItemBtn: {
      "&:focus": {
        color: theme.palette.primary.main,
        outline: 0
      },
      background: "none",
      border: "none",
      color: "inherit",
      cursor: "pointer",
      display: "inline-flex",
      margin: 0,
      padding: 0
    },
    paper: {
      borderRadius: 16,
      boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.16)",
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
        color: theme.palette.primary.main,
        outline: 0
      },
      background: "none",
      border: "none",
      color: fade(theme.palette.text.primary, 0.6),
      textAlign: "left",
      whiteSpace: "nowrap"
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
  const anchor = React.useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent, menuItem: IMenuItem) => {
    event.stopPropagation();
    if (menuItem.children) {
      setOpen(true);
    } else {
      onClick(menuItem.url);
      setOpen(false);
    }
  };

  return (
    <div
      className={classNames(classes.root, {
        [classes.rootActive]: active,
        [classes.rootExpanded]: !isMenuShrunk
      })}
      ref={anchor}
      onClick={event => handleClick(event, menuItem)}
    >
      <button
        className={classes.menuItemBtn}
        data-test="menu-item-label"
        data-test-id={menuItem.testingContextId}
      >
        {menuItem.icon && <SVG className={classes.icon} src={menuItem.icon} />}
        <Typography
          aria-label={menuItem.ariaLabel}
          className={classNames(classes.label, {
            [classes.hideLabel]: isMenuShrunk
          })}
          variant="body2"
        >
          {menuItem.label}
        </Typography>
      </button>
      {menuItem.children && (
        <Popper
          className={classes.popper}
          open={open}
          anchorEl={anchor.current}
          transition
          disablePortal
          placement="right-start"
        >
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Paper className={classes.paper}>
              {menuItem.children.map(subMenuItem => (
                <Typography
                  aria-label={subMenuItem.ariaLabel}
                  component="button"
                  className={classNames(classes.label, classes.subMenuLabel)}
                  key={subMenuItem.url}
                  onClick={event => handleClick(event, subMenuItem)}
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
    </div>
  );
};

MenuItem.displayName = "MenuItem";
export default MenuItem;
