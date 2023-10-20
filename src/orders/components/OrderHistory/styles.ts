import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";

export const useStyles = makeStyles(
  theme => ({
    eventSubtitle: {
      marginTop: theme.spacing(1),
    },
    header: {
      fontWeight: 500,
      marginBottom: theme.spacing(1),
      paddingLeft: 0,
    },
    linesTableCell: {
      paddingRight: theme.spacing(3),
    },
    root: {
      marginTop: theme.spacing(4),
      paddingRight: vars.spacing[6],
      paddingLeft: vars.spacing[6],
    },
    user: {
      marginBottom: theme.spacing(1),
    },
  }),
  { name: "OrderHistory" },
);
