import { FormControlLabel, Switch } from "@material-ui/core";
import { UserFragment } from "@saleor/graphql";
import { UserChipMenu, UserChipMenuItem } from "@saleor/macaw-ui";
import { getUserInitials, getUserName } from "@saleor/misc";
import { staffMemberDetailsUrl } from "@saleor/staff/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

export interface UserChipProps {
  isDarkThemeEnabled: boolean;
  user: UserFragment;
  onLogout: () => void;
  onThemeToggle: () => void;
}

const UserChip: React.FC<UserChipProps> = ({
  isDarkThemeEnabled,
  user,
  onLogout,
  onThemeToggle,
}) => {
  const intl = useIntl();

  return (
    <UserChipMenu
      initials={getUserInitials(user)}
      name={getUserName(user, true)}
      avatar={user?.avatar?.url}
    >
      <UserChipMenuItem data-test-id="account-settings-button">
        <Link to={staffMemberDetailsUrl(user?.id)}>
          <FormattedMessage
            id="X8+Lpa"
            defaultMessage="Account Settings"
            description="button"
          />
        </Link>
      </UserChipMenuItem>
      <UserChipMenuItem onClick={onLogout} data-test-id="log-out-button">
        <FormattedMessage
          id="qLbse5"
          defaultMessage="Log out"
          description="button"
        />
      </UserChipMenuItem>
      <UserChipMenuItem
        leaveOpen
        data-test-id="theme-switch"
        data-test-is-dark={isDarkThemeEnabled}
      >
        <FormControlLabel
          control={<Switch checked={isDarkThemeEnabled} disableRipple />}
          label={intl.formatMessage({
            id: "2r4cTE",
            defaultMessage: "Enable Dark Mode",
            description: "button",
          })}
          onChange={onThemeToggle}
        />
      </UserChipMenuItem>
    </UserChipMenu>
  );
};
UserChip.displayName = "UserChip";
export default UserChip;
