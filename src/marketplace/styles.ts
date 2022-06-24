import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  () => ({
    iframe: {
      height: "100vh",
      position: "sticky",
    },
  }),
  {
    name: "marketplaceStyles",
  },
);

export { useStyles };
