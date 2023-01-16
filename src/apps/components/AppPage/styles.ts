import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    container: {
      height: "100%",
    },
    iframeContainer: {
      lineHeight: 0, // It removes extra space between iframe and container
      height: "100%",
      "& > iframe": {
        border: "none",
        minHeight: "60vh",
        height: "100%",
        width: "100%",
      },
    },
  }),
  { name: "AppPage" },
);
