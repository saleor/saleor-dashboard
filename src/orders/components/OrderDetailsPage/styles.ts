import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    date: {
      marginBottom: theme.spacing(3),
    },
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: theme.spacing(2),
      paddingRight: theme.spacing(4),
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
