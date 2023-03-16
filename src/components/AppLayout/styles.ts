import { getStatusColor } from "@dashboard/misc";
import { makeStyles } from "@saleor/macaw-ui";
import { DefaultTheme } from "@saleor/macaw-ui/next";

import { appLoaderHeight } from "./consts";

export const useStyles = makeStyles<{ currentTheme: DefaultTheme }>(
  () => ({
    root: {
      '& div[class*="Pill-root"]': {
        borderRadius: "32px",
        border: "none",
      },
      '& div[class*="Pill-error"]': {
        background: getStatusColor("error"),
      },
      '& div[class*="Pill-warning"]': {
        background: ({ currentTheme }) =>
          getStatusColor("warning", currentTheme),
      },
      '& div[class*="Pill-success"]': {
        background: getStatusColor("success"),
      },
      '& div[class*="Pill-info"]': {
        background: getStatusColor("info"),
      },
    },
    appLoader: {
      height: appLoaderHeight,
      zIndex: 1201,
      position: "fixed",
      width: "100%",
      top: 0,
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
