import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    date: {
      marginBottom: theme.spacing(3),
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 0,
    },
  }),
  {
    name: "OrderDetailsPage",
  },
);
