import { type Channel } from "@dashboard/channels/utils";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import { Text } from "@saleor/macaw-ui-next";

import styles from "./ChannelsAvailabilityDialogChannelsList.module.css";

interface ChannelsAvailabilityContentProps {
  isChannelSelected: (channel: Channel) => boolean;
  channels: Channel[];
  onChange: (option: Channel) => void;
}

const ChannelsAvailabilityContent = ({
  isChannelSelected,
  channels,
  onChange,
}: ChannelsAvailabilityContentProps) => {
  return (
    <>
      {channels.map((option, index) => (
        <div
          key={option.id}
          className={styles.row}
          data-test-id="channel-row"
          data-last-row={index === channels.length - 1 ? true : undefined}
        >
          <ControlledCheckbox
            checked={isChannelSelected(option)}
            name={option.name}
            label={<Text className={styles.label}>{option.name}</Text>}
            onChange={() => onChange(option)}
          />
        </div>
      ))}
    </>
  );
};

export default ChannelsAvailabilityContent;
