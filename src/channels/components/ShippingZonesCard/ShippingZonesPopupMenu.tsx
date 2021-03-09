import {
  ClickAwayListener,
  MenuItem,
  MenuList,
  Popper
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { Channel_channel_shippingZones } from "@saleor/channels/types/Channel";
import React from "react";

interface ShippingZonesPopupMenuProps {
  anchor: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  onClose: () => void;
  zonesChoices: Channel_channel_shippingZones[];
}

const ShippingZonesPopupMenu: React.FC<ShippingZonesPopupMenuProps> = ({
  isOpen,
  anchor,
  onClose,
  zonesChoices
}) => {
  return (
    <Popper
      open={isOpen}
      anchorEl={anchor.current}
      transition
      placement="bottom-end"
    >
      <Paper>
        <ClickAwayListener onClickAway={onClose} mouseEvent="onClick">
          <MenuList>
            <MenuItem>lol</MenuItem>
          </MenuList>
        </ClickAwayListener>
      </Paper>
    </Popper>
  );
};

export default ShippingZonesPopupMenu;
