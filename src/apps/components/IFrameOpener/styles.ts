import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    iframeContainer: {
      width: 600,
      height: 600,
      "& > iframe": {
        border: "none",
        height: "100%",
        width: "100%"
      }
    }
  }),
  { name: "AppContainer" }
);
