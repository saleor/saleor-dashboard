import { Menu, Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import { Pill } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";
import {
  Channels,
  getChannelAvailabilityColor,
  getChannelAvailabilityLabel,
  getDropdownColor
} from "./utils";

export interface ChannelsAvailabilityDropdownProps {
  channels: Channels[];
}

export const ChannelsAvailabilityDropdown: React.FC<ChannelsAvailabilityDropdownProps> = ({
  channels
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const [anchorEl, setAnchorEl] = React.useState(null);

  const dropdownColor = React.useMemo(() => getDropdownColor(channels), [
    channels
  ]);

  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
        <div className={classes.menuContainer}>
          <div className={classes.row}>
            <Typography variant="caption" className={classes.caption}>
              {intl.formatMessage(messages.channel)}
            </Typography>
            <Typography variant="caption" className={classes.caption}>
              {intl.formatMessage(messages.status)}
            </Typography>
          </div>
          {channels.map(channelData => (
            <div key={channelData.channel.id} className={classes.row}>
              <Typography>{channelData.channel.name}</Typography>
              <HorizontalSpacer spacing={4} />
              <Pill
                label={intl.formatMessage(
                  getChannelAvailabilityLabel(channelData)
                )}
                color={getChannelAvailabilityColor(channelData)}
              />
            </div>
          ))}
        </div>
      </Menu>
    </div>
  );
};
ChannelsAvailabilityDropdown.displayName = "ChannelsAvailabilityDropdown";
export default ChannelsAvailabilityDropdown;
