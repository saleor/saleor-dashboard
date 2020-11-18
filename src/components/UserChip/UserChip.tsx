import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grow from "@material-ui/core/Grow";
import Hidden from "@material-ui/core/Hidden";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Switch from "@material-ui/core/Switch";
import { User } from "@saleor/fragments/types/User";
import ArrowDropdown from "@saleor/icons/ArrowDropdown";
import { getUserInitials, getUserName } from "@saleor/misc";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    arrow: {
      [theme.breakpoints.down("sm")]: {
        marginLeft: 0
      },
      marginLeft: theme.spacing(2),
      transition: theme.transitions.duration.standard + "ms"
    },
    avatar: {
      "&&": {
        [theme.breakpoints.down("sm")]: {
          height: 40,
          width: 40
        },
        height: 32,
        width: 32
      }
    },
    avatarInitials: {
      color: theme.palette.primary.contrastText
    },
    avatarPlaceholder: {
      alignItems: "center",
      background: theme.palette.primary.main,
      borderRadius: "100%",
      display: "flex",
      justifyContent: "center"
    },
    popover: {
      marginTop: theme.spacing(2),
      zIndex: 10
    },
    rotate: {
      transform: "rotate(180deg)"
    },
    switch: {
      "&&:hover": {
        background: "transparent"
      }
    },
    userChip: {
      [theme.breakpoints.down("sm")]: {
        height: 48
      },
      backgroundColor: theme.palette.background.paper,
      borderRadius: 24,
      color: theme.palette.text.primary,
      height: 40,
      padding: theme.spacing(0.5)
    },
    userMenuContainer: {
      position: "relative"
    },
    userMenuItem: {
      textAlign: "right"
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
  const [isMenuOpened, setMenuState] = React.useState(false);
  const anchor = React.useRef<HTMLDivElement>();
  const intl = useIntl();

  const handleLogout = () => {
    setMenuState(false);
    onLogout();
  };

  const handleViewerProfile = () => {
    setMenuState(false);
    onProfileClick();
  };

  return (
    <div className={classes.userMenuContainer} ref={anchor}>
      <Chip
        avatar={
          user.avatar ? (
            <Avatar alt="user" src={user.avatar.url} />
          ) : (
            <div className={classes.avatarPlaceholder}>
              <div className={classes.avatarInitials}>
                {getUserInitials(user)}
              </div>
            </div>
          )
        }
        classes={{
          avatar: classes.avatar
        }}
        className={classes.userChip}
        label={
          <>
            <Hidden smDown>{getUserName(user, true)}</Hidden>
            <ArrowDropdown
              className={classNames(classes.arrow, {
                [classes.rotate]: isMenuOpened
              })}
            />
          </>
        }
        onClick={() => setMenuState(!isMenuOpened)}
        data-test="userMenu"
      />
      <Popper
        className={classes.popover}
        open={isMenuOpened}
        anchorEl={anchor.current}
        transition
        placement="bottom-end"
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "right top" : "right bottom"
            }}
          >
            <Paper>
              <ClickAwayListener
                onClickAway={() => setMenuState(false)}
                mouseEvent="onClick"
              >
                <Menu>
                  <MenuItem
                    className={classes.userMenuItem}
                    onClick={handleViewerProfile}
                    data-test="accountSettingsButton"
                  >
                    <FormattedMessage
                      defaultMessage="Account Settings"
                      description="button"
                    />
                  </MenuItem>
                  <MenuItem
                    className={classes.userMenuItem}
                    onClick={handleLogout}
                    data-test="logOutButton"
                  >
                    <FormattedMessage
                      defaultMessage="Log out"
                      description="button"
                    />
                  </MenuItem>
                  <MenuItem
                    className={classes.userMenuItem}
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
                  </MenuItem>
                </Menu>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};
UserChip.displayName = "UserChip";
export default UserChip;
