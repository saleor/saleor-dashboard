import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%"
    },
    textRight: {
      textAlign: "right"
    },
    totalRow: {
      fontWeight: 600
    },
    paymentStatus: {
      display: "flex"
    },
    paymentStatusTitle: {
      marginRight: 15
    },
    disabled: {
      color: theme.palette.text.disabled
    },
    overpaid: {
      color: "#FE6E76",
      fontWeight: 600
    }
  }),
  { name: "OrderPayment" }
);
