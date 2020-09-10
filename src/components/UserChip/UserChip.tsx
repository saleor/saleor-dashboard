import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { User } from "@saleor/fragments/types/User";
import ArrowDropdown from "@saleor/icons/ArrowDropdown";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    arrow: {
      marginLeft: theme.spacing(2),
      transition: theme.transitions.duration.standard + "ms"
    },
    avatar: {
      "&&": {
        height: 32,
        width: 32
      }
    },
    popover: {
      zIndex: 1
    },
    rotate: {
      transform: "rotate(180deg)"
    },
    userChip: {
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
  user: User;
  onLogout: () => void;
  onProfileClick: () => void;
}

const UserChip: React.FC<UserChipProps> = ({
  user,
  onLogout,
  onProfileClick
}) => {
  const classes = useStyles({});
  const [isMenuOpened, setMenuState] = React.useState(false);
  const anchor = React.useRef<HTMLDivElement>();

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
        avatar={user.avatar && <Avatar alt="user" src={user.avatar.url} />}
        classes={{
          avatar: classes.avatar
        }}
        className={classes.userChip}
        label={
          <>
            {user.email}
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
