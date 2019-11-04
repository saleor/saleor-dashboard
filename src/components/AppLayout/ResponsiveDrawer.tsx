import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import {
  drawerWidth,
  drawerWidthExpanded,
  drawerWidthExpandedMobile
} from "./consts";

const useStyles = makeStyles(
  theme => ({
    drawerDesktop: {
      backgroundColor: theme.palette.background.paper,
      border: "none",
      height: "100vh",
      overflow: "visible",
      padding: 0,
      position: "fixed" as "fixed",
      transition: "width 0.3s ease",
      width: drawerWidthExpanded
    },
    drawerDesktopSmall: {
      overflow: "visible",
      transition: "width 0.2s ease",
      width: drawerWidth
    },
    drawerMobile: {
      width: drawerWidthExpandedMobile
    }
  }),
  { name: "ResponsiveDrawer" }
);

interface ResponsiveDrawerProps {
  children?: React.ReactNode;
  open: boolean;
  small: boolean;
  onClose?();
}

const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = props => {
  const { children, onClose, open, small } = props;

  const classes = useStyles(props);

  return (
    <>
      <Hidden smDown>
        <Drawer
          variant="persistent"
          open
          classes={{
            paper: small ? classes.drawerDesktop : classes.drawerDesktopSmall
          }}
        >
          {children}
        </Drawer>
      </Hidden>
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          onClose={onClose}
          open={open}
          classes={{ paper: classes.drawerMobile }}
        >
          {children}
        </Drawer>
      </Hidden>
    </>
  );
};
export default ResponsiveDrawer;
