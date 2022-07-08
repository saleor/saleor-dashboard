import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    eventSubtitle: {
      marginTop: theme.spacing(1),
    },
    header: {
      fontWeight: 500,
      marginBottom: theme.spacing(1),
    },
    linesTableCell: {
      paddingRight: theme.spacing(3),
    },
    root: { marginTop: theme.spacing(4) },
    user: {
      marginBottom: theme.spacing(1),
    },
  }),
  { name: "OrderHistory" },
);
