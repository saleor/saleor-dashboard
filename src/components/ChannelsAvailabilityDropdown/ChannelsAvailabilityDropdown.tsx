import { Menu } from "@material-ui/core";
import { Pill } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import ChannelsAvailabilityMenuContent from "../ChannelsAvailabilityMenuContent";
import { messages } from "./messages";
import {
  CollectionChannels,
  getChannelAvailabilityColor,
  getChannelAvailabilityLabel,
  getDropdownColor
} from "./utils";

export interface ChannelsAvailabilityDropdownProps {
  channels: CollectionChannels[] | null;
}

export const ChannelsAvailabilityDropdown: React.FC<ChannelsAvailabilityDropdownProps> = ({
  channels
}) => {
  const intl = useIntl();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const dropdownColor = React.useMemo(() => getDropdownColor(channels), [
    channels
  ]);

  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  if (!channels || channels.length === 0) {
    return (
      <Pill label={intl.formatMessage(messages.noChannels)} color="error" />
    );
  }

  return (
    <div
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div aria-controls="availability-menu" aria-haspopup="true" role="button">
        <Pill
          label={intl.formatMessage(messages.dropdownLabel, {
            channelCount: channels.length
          })}
          color={dropdownColor}
          onClick={handleClick}
        />
      </div>
      <Menu
        id="availability-menu"
        anchorEl={anchorEl}
        keepMounted
        elevation={8}
        open={!!anchorEl}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom"
        }}
        transformOrigin={{
          horizontal: "center",
          vertical: "top"
        }}
      >
        <ChannelsAvailabilityMenuContent
          channels={channels}
          labelFunction={getChannelAvailabilityLabel}
          colorFunction={getChannelAvailabilityColor}
        />
      </Menu>
    </div>
  );
};
ChannelsAvailabilityDropdown.displayName = "ChannelsAvailabilityDropdown";
export default ChannelsAvailabilityDropdown;
