import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import { User } from "@saleor/fragments/types/User";
import { makeStyles, UserChip as MacawUserChip } from "@saleor/macaw-ui";
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

  const handleLogout = () => {
    onLogout();
  };

  const handleViewerProfile = () => {
    onProfileClick();
  };

  return (
    <MacawUserChip
      initials={getUserInitials(user)}
      name={getUserName(user, true)}
      avatar={user?.avatar?.url}
    >
      <MenuItem onClick={handleViewerProfile} data-test="accountSettingsButton">
        <FormattedMessage
          defaultMessage="Account Settings"
          description="button"
        />
      </MenuItem>
      <MenuItem onClick={handleLogout} data-test="logOutButton">
        <FormattedMessage defaultMessage="Log out" description="button" />
      </MenuItem>
      <MenuItem data-test="themeSwitch" data-test-is-dark={isDarkThemeEnabled}>
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
      </MenuItem>
    </MacawUserChip>
  );
};
UserChip.displayName = "UserChip";
export default UserChip;
