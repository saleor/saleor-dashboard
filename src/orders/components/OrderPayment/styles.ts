import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    root: {
      display: "flex",
      flexDirection: "column",
    },
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
    noPaymentContent: {
      display: "flex",
      height: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing(4),
    },
    noPaymentTitle: {
      color: theme.palette.saleor.main[3],
      fontWeight: 400,
    },
  }),
  { name: "styles" },
);
