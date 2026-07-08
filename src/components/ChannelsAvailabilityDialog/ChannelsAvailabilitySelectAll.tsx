import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { FormattedMessage } from "react-intl";

import listStyles from "../ChannelsAvailabilityDialogChannelsList/ChannelsAvailabilityDialogChannelsList.module.css";
import { channelsAvailabilityDialogWrapperMessages } from "../ChannelsAvailabilityDialogWrapper/ChannelsAvailabilityDialogWrapper";

interface ChannelsAvailabilitySelectAllProps {
  checked: boolean;
  inPickerToolbar?: boolean;
  isSearchActive?: boolean;
  onToggle: () => void;
}

export const ChannelsAvailabilitySelectAll = ({
  checked,
  inPickerToolbar = false,
  isSearchActive = false,
  onToggle,
}: ChannelsAvailabilitySelectAllProps) => {
  const labelMessage = isSearchActive
    ? channelsAvailabilityDialogWrapperMessages.selectAllMatchingChannelsLabel
    : channelsAvailabilityDialogWrapperMessages.selectAllChannelsLabel;

  return (
    <div
      className={clsx(inPickerToolbar ? listStyles.selectAllToolbar : listStyles.selectAllInline)}
    >
      <ControlledCheckbox
        checked={checked}
        name="allChannels"
        label={
          <Text size={2} fontWeight="light" color="default2">
            <FormattedMessage {...labelMessage} />
          </Text>
        }
        onChange={onToggle}
      />
    </div>
  );
};
