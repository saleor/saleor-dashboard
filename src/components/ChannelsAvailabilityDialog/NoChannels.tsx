import { Text } from "@macaw-ui";
import { FormattedMessage } from "react-intl";

import { channelsAvailabilityDialogMessages as messages } from "./messages";

export const NoChannels = () => (
  <Text fontSize={2}>
    <FormattedMessage {...messages.noChannels} />
  </Text>
);
