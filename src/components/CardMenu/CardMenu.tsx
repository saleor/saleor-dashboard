import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper
} from "@material-ui/core";
import { IconButton, makeStyles, MoreIcon } from "@saleor/macaw-ui";
import React from "react";

const ITEM_HEIGHT = 48;

export interface CardMenuItem {
  disabled?: boolean;
  label: string;
  testId?: string;
  onSelect: () => void;
}

export interface CardMenuProps {
  className?: string;
  disabled?: boolean;
  menuItems: CardMenuItem[];
  outlined?: boolean;
}

const useStyles = makeStyles(
  theme => ({
    container: {
      zIndex: 1
    },
    iconButton: {
      background: theme.palette.background.paper,
      borderRadius: "100%",
      height: 32,
      padding: 0,
      width: 32
    },
    paper: {
      marginTop: theme.spacing(2),
      maxHeight: ITEM_HEIGHT * 4.5
    }
  }),
  { name: "CardMenu" }
);

const CardMenu: React.FC<CardMenuProps> = props => {
  const { className, disabled, menuItems, outlined, ...rest } = props;
  const classes = useStyles(props);

  const anchorRef = React.useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleToggle = () => setOpen(prevOpen => !prevOpen);

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleMenuClick = (index: number) => {
    menuItems[index].onSelect();
    setOpen(false);
  };

  return (
    <div className={className} {...rest}>
      <IconButton
        data-test-id="showMoreButton"
        aria-label="More"
        aria-owns={open ? "long-menu" : null}
        aria-haspopup="true"
        color="primary"
        disabled={disabled}
        ref={anchorRef}
        onClick={handleToggle}
        variant={outlined ? "primary" : "secondary"}
      >
        <MoreIcon />
      </IconButton>
      <Popper
        placement="bottom-end"
        className={classes.container}
        open={open}
        anchorEl={anchorRef.current}
        transition
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "right top" : "right bottom"
            }}
          >
            <Paper className={classes.paper} elevation={8}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  {menuItems.map((menuItem, menuItemIndex) => (
                    <MenuItem
                      data-test-id={menuItem.testId}
                      disabled={menuItem.disabled}
                      onClick={() => handleMenuClick(menuItemIndex)}
                      key={menuItem.label}
                      data-test={menuItem.testId}
                    >
                      {menuItem.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};
CardMenu.displayName = "CardMenu";
export default CardMenu;
