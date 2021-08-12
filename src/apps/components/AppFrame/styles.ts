import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    iframe: {
      width: 600,
      height: 600,
      maxWidth: "80vw",
      maxHeight: "100vh",
      border: "none"
    }
  }),
  { name: "AppFrame" }
);
