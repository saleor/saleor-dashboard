import { Card, Popper } from "@material-ui/core";
import { Pill } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import ChannelsAvailabilityMenuContent from "../ChannelsAvailabilityMenuContent";
import { messages } from "./messages";
import {
  CollectionChannels,
  getDropdownColor,
  mapChannelsToPills,
} from "./utils";

export interface ChannelsAvailabilityDropdownProps {
  channels: CollectionChannels[] | null;
}

export const ChannelsAvailabilityDropdown: React.FC<ChannelsAvailabilityDropdownProps> = ({
  channels,
}) => {
  const intl = useIntl();
  const [isPopupOpen, setPopupOpen] = React.useState(false);
  const anchor = React.useRef<HTMLDivElement>(null);

  const dropdownColor = React.useMemo(() => getDropdownColor(channels), [
    channels,
  ]);

  if (!channels?.length) {
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
      onMouseOver={() => setPopupOpen(true)}
      onMouseLeave={() => setPopupOpen(false)}
    >
      <div aria-controls="availability-menu" aria-haspopup="true" role="button">
        <Pill
          label={intl.formatMessage(messages.dropdownLabel, {
            channelCount: channels.length,
          })}
          color={dropdownColor}
          outlined
        />
      </div>
      <Popper anchorEl={anchor.current} open={isPopupOpen} placement={"left"}>
        <Card elevation={8}>
          <ChannelsAvailabilityMenuContent
            pills={mapChannelsToPills(channels)}
          />
        </Card>
      </Popper>
    </div>
  );
};
ChannelsAvailabilityDropdown.displayName = "ChannelsAvailabilityDropdown";
export default ChannelsAvailabilityDropdown;
