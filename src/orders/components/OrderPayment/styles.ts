import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    refundsButtons: {
      display: "flex",
      gap: theme.spacing(1),
    },
    legacyActions: {
      display: "flex",
      gap: theme.spacing(1),
      marginTop: theme.spacing(2),
    },
    amountGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    explainText: {
      color: theme.palette.saleor.main[3],
    },
    paymentStatus: {
      alignSelf: "flex-end",
    },
  }),
  { name: "styles" },
);
