// @ts-strict-ignore
import { Popper } from "@material-ui/core";
import { useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { DashboardCard } from "../Card";
import ChannelsAvailabilityMenuContent from "../ChannelsAvailabilityMenuContent";
import { Pill } from "../Pill";
import { messages } from "./messages";
import { CollectionChannels, getDropdownColor, mapChannelsToPills } from "./utils";

export interface ChannelsAvailabilityDropdownProps {
  channels: CollectionChannels[] | null;
}

export const ChannelsAvailabilityDropdown = ({ channels }: ChannelsAvailabilityDropdownProps) => {
  const intl = useIntl();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  const dropdownColor = useMemo(() => getDropdownColor(channels), [channels]);

  if (!channels?.length) {
    return <Pill label={intl.formatMessage(messages.noChannels)} color="error" />;
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
        <DashboardCard boxShadow="defaultModal">
          <ChannelsAvailabilityMenuContent pills={mapChannelsToPills(channels)} />
        </DashboardCard>
      </Popper>
    </div>
  );
};
ChannelsAvailabilityDropdown.displayName = "ChannelsAvailabilityDropdown";
export default ChannelsAvailabilityDropdown;
