import { makeStyles } from "@saleor/macaw-ui";
import { DefaultTheme, vars } from "@saleor/macaw-ui/next";

import { appLoaderHeight } from "./consts";

export const useStyles = makeStyles<{ currentTheme: DefaultTheme }>(
  () => ({
    root: {
      '& div[class*="Pill-root"]': {
        borderRadius: "32px",
        border: "none",
      },
      '& div[class*="Pill-error"]': {
        background: vars.colors.background.surfaceCriticalDepressed,
      },
      '& div[class*="Pill-warning"]': {
        background: ({ currentTheme }) =>
          currentTheme === "defaultDark" ? "#3E2F0A" : "#FBE5AC",
      },
      '& div[class*="Pill-success"]': {
        background: vars.colors.background.decorativeSurfaceSubdued2,
      },
      '& div[class*="Pill-info"]': {
        background: vars.colors.background.surfaceBrandDepressed,
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
