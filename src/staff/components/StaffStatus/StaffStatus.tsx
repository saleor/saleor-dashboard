import { Button } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { staffStatusMessages as messages } from "./messages";

interface StaffStatusProps {
  isActive: boolean;
  disabled: boolean;
  onClick: () => void;
}

/** TopNav toggle — Active / Pending invite / Inactive is shown in the title pill. */
export const StaffStatus = ({ isActive, disabled, onClick }: StaffStatusProps): ReactNode => (
  <Button
    variant="secondary"
    type="button"
    disabled={disabled}
    onClick={onClick}
    data-test-id="staff-status-button"
    alignSelf="center"
  >
    {isActive ? (
      <FormattedMessage {...messages.deactivate} />
    ) : (
      <FormattedMessage {...messages.activate} />
    )}
  </Button>
);
