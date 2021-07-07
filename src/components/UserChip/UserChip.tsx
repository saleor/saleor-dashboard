import { FormControlLabel, Switch } from "@material-ui/core";
import { User } from "@saleor/fragments/types/User";
import { makeStyles, UserChipMenu, UserChipMenuItem } from "@saleor/macaw-ui";
import { getUserInitials, getUserName } from "@saleor/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  () => ({
    switch: {
      "&&:hover": {
        background: "transparent"
      }
    }
  }),
  {
    name: "UserChip"
  }
);

export interface UserChipProps {
  isDarkThemeEnabled: boolean;
  user: User;
  onLogout: () => void;
  onProfileClick: () => void;
  onThemeToggle: () => void;
}

const UserChip: React.FC<UserChipProps> = ({
  isDarkThemeEnabled,
  user,
  onLogout,
  onProfileClick,
  onThemeToggle
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <UserChipMenu
      initials={getUserInitials(user)}
      name={getUserName(user, true)}
      avatar={user?.avatar?.url}
    >
      <UserChipMenuItem
        onClick={onProfileClick}
        data-test="accountSettingsButton"
      >
        <FormattedMessage
          defaultMessage="Account Settings"
          description="button"
        />
      </UserChipMenuItem>
      <UserChipMenuItem onClick={onLogout} data-test="logOutButton">
        <FormattedMessage defaultMessage="Log out" description="button" />
      </UserChipMenuItem>
      <UserChipMenuItem
        leaveOpen
        data-test="themeSwitch"
        data-test-is-dark={isDarkThemeEnabled}
      >
        <FormControlLabel
          control={
            <Switch
              classes={{
                switchBase: classes.switch
              }}
              checked={isDarkThemeEnabled}
              color="primary"
              disableRipple
            />
          }
          label={intl.formatMessage({
            defaultMessage: "Enable Dark Mode",
            description: "button"
          })}
          onChange={onThemeToggle}
        />
      </UserChipMenuItem>
    </UserChipMenu>
  );
};
UserChip.displayName = "UserChip";
export default UserChip;
