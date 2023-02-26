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
  }),
  { name: "AppFrame" },
);
