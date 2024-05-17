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
      paddingRight: theme.spacing(1),
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
    actions: {
      gap: theme.spacing(1),
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "right",
    },
  }),
  { name: "OrderPayment" },
);
