import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React from "react";

const ITEM_HEIGHT = 48;

export interface CardMenuItem {
  label: string;
  onSelect: () => void;
}

export interface CardMenuProps {
  className?: string;
  disabled?: boolean;
  menuItems: CardMenuItem[];
}

const useStyles = makeStyles(
  theme => ({
    iconButton: {
      background: theme.palette.background.paper,
      borderRadius: "100%",
      height: 32,
      padding: 0,
      width: 32
    }
  }),
  { name: "CardMenu" }
);

const CardMenu: React.FC<CardMenuProps> = props => {
  const { className, disabled, menuItems } = props;
  const classes = useStyles(props);

  const [anchorEl, setAnchor] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<any>) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const handleMenuClick = (menuItemIndex: number) => {
    menuItems[menuItemIndex].onSelect();
    handleClose();
  };

  const open = !!anchorEl;

  return (
    <div className={className}>
      <IconButton
        aria-label="More"
        aria-owns={open ? "long-menu" : null}
        aria-haspopup="true"
        className={classes.iconButton}
        color="primary"
        disabled={disabled}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5
            // width: 200
          }
        }}
      >
        {menuItems.map((menuItem, menuItemIndex) => (
          <MenuItem
            onClick={() => handleMenuClick(menuItemIndex)}
            key={menuItem.label}
          >
            {menuItem.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
CardMenu.displayName = "CardMenu";
export default CardMenu;
