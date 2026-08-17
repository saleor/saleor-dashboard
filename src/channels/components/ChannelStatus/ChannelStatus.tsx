import { Button } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

interface ChannelStatusProps {
  isActive: boolean;
  disabled: boolean;
  onClick: () => void;
}

/** TopNav toggle — Active/Inactive is shown in the title pill. */
export const ChannelStatus = ({ isActive, disabled, onClick }: ChannelStatusProps): ReactNode => (
  <Button
    variant="secondary"
    type="button"
    disabled={disabled}
    onClick={onClick}
    data-test-id="channel-status-button"
  >
    {isActive ? (
      <FormattedMessage {...messages.deactivateChannel} />
    ) : (
      <FormattedMessage {...messages.activateChannel} />
    )}
  </Button>
);
