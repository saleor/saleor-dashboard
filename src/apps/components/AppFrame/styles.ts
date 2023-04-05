import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    iframe: {
      width: "100%",
      height: "100%",
      border: "none",
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
