import { Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { defineMessages, FormattedMessage } from "react-intl";

import styles from "./ChannelsAvailabilityDialogWrapper.module.css";

export const channelsAvailabilityDialogWrapperMessages = defineMessages({
  selectTitle: {
    id: "7scATx",
    defaultMessage: "Select channels you want for {contentType} to be available on",
    description: "select title",
  },
  selectAllChannelsLabel: {
    id: "LvsFO1",
    defaultMessage: "Select all channels",
    description: "select all channels label",
  },
  selectAllMatchingChannelsLabel: {
    id: "hIhJpk",
    defaultMessage: "Select all matching channels",
    description: "select all channels label when channel search is active",
  },
  confirmCountedButton: {
    id: "PbDaM4",
    defaultMessage: "Confirm ({count, plural, one {# channel} other {# channels}})",
    description: "confirm button with selected channel count",
  },
  notFoundTitle: {
    id: "PctLol",
    defaultMessage: "No Channels Found",
    description: "no channels found title",
  },
});

interface ChannelsAvailabilityContentProps {
  contentType?: string;
  children: ReactNode;
  hasAnyChannelsToDisplay: boolean;
}

const ChannelsAvailabilityContentWrapper = ({
  contentType = "",
  children,
  hasAnyChannelsToDisplay,
}: ChannelsAvailabilityContentProps) => {
  return (
    <>
      {!!contentType && (
        <Text className={styles.contentType} size={2} fontWeight="light">
          <FormattedMessage
            {...channelsAvailabilityDialogWrapperMessages.selectTitle}
            values={{ contentType }}
          />
        </Text>
      )}
      {hasAnyChannelsToDisplay ? (
        children
      ) : (
        <div className={styles.notFound}>
          <FormattedMessage {...channelsAvailabilityDialogWrapperMessages.notFoundTitle} />
        </div>
      )}
    </>
  );
};

export default ChannelsAvailabilityContentWrapper;
