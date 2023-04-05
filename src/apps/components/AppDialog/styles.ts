import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    content: {
      margin: 0,
      padding: 0,
      overflow: "hidden",
      width: 600,
      height: 600,
    },
  }),
  { name: "AppDialog" },
);
