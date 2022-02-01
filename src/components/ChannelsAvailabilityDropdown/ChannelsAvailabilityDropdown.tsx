import { Card, Popper } from "@material-ui/core";
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
  const [isPopupOpen, setPopupOpen] = React.useState(false);
  const anchor = React.useRef<HTMLDivElement>(null);

  const dropdownColor = React.useMemo(() => getDropdownColor(channels), [
    channels
  ]);

  const handleMouseOver = () => setPopupOpen(true);
  const handleMouseLeave = () => setPopupOpen(false);

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
      ref={anchor}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <div aria-controls="availability-menu" aria-haspopup="true" role="button">
        <Pill
          label={intl.formatMessage(messages.dropdownLabel, {
            channelCount: channels.length
          })}
          color={dropdownColor}
          onClick={() => null} // required for dashed border
        />
      </div>
      <Popper anchorEl={anchor.current} open={isPopupOpen} placement={"left"}>
        <Card elevation={8}>
          <ChannelsAvailabilityMenuContent
            channels={channels}
            labelFunction={getChannelAvailabilityLabel}
            colorFunction={getChannelAvailabilityColor}
          />
        </Card>
      </Popper>
    </div>
  );
};
ChannelsAvailabilityDropdown.displayName = "ChannelsAvailabilityDropdown";
export default ChannelsAvailabilityDropdown;
