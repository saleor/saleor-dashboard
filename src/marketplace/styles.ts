import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    iframe: {
      height: "100vh",
      position: "sticky",
    },
    previewPill: {
      marginBottom: theme.spacing(2),
    },
  }),
  {
    name: "marketplaceStyles",
  },
);

export { useStyles };
