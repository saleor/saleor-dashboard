import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    iframe: {
      width: "100%",
      height: "100%",
      border: "none",
    },
    /**
     * Detail-page sidebar widgets: height is driven by the app via postMessage
     * (see useWidgetIframeAutoHeight), so it must NOT be constrained to 100% here.
     */
    iframeWidget: {
      width: "100%",
      border: "none",
      display: "block",
    },
    iframeHidden: {
      visibility: "hidden",
    },
    loader: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: -1,
    },
  }),
  { name: "AppFrame" },
);
