import { makeStyles } from "@saleor/macaw-ui";

import { appLoaderHeight } from "./consts";

export const useStyles = makeStyles(
  theme => ({
    appAction: {
      [theme.breakpoints.down("sm")]: {
        left: 0,
        width: "100%",
      },
      bottom: 0,
      gridColumn: 2,
      position: "sticky",
      zIndex: 10,
    },
    appLoader: {
      height: appLoaderHeight,
      zIndex: 1201,
      position: "fixed",
      width: "100%",
      top: 0,
    },
    content: {
      flex: 1,
      [theme.breakpoints.up("md")]: {
        width: 0, // workaround for flex children width expansion affected by their contents
      },
    },
    darkThemeSwitch: {
      [theme.breakpoints.down("sm")]: {
        marginRight: theme.spacing(1),
      },
      marginRight: theme.spacing(2),
    },
    header: {
      display: "grid",
      gridTemplateAreas: `"headerAnchor headerToolbar"`,
      [theme.breakpoints.down("sm")]: {
        gridTemplateAreas: `"headerToolbar" 
        "headerAnchor"`,
      },
      marginBottom: theme.spacing(6),
    },
    headerAnchor: {
      gridArea: "headerAnchor",
    },
    headerToolbar: {
      display: "flex",
      gridArea: "headerToolbar",
      height: 40,
      [theme.breakpoints.down("sm")]: {
        height: "auto",
      },
    },
    root: {
      isolation: "isolate",
      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
      width: `100%`,
    },
    spacer: {
      flex: 1,
    },
    userBar: {
      alignItems: "center",
      display: "flex",
    },

    view: {
      marginLeft: 0,
    },
    viewMargins: {
      paddingBottom: theme.spacing(),
      [theme.breakpoints.up("sm")]: {
        paddingBottom: theme.spacing(3),
      },
    },
    viewContainer: {
      minHeight: `calc(100vh - ${appLoaderHeight + 72}px - ${theme.spacing(4)})`,
    },
  }),
  { name: "AppLayout" },
);

export const useFullSizeStyles = makeStyles(
  () => ({
    content: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    viewContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    view: {
      flex: 1,
    },
    viewContainerWrapper: {},
  }),
  { name: "AppLayoutFullSize" },
);
