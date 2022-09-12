import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    title: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    methodName: {
      display: "flex",
      gap: theme.spacing(1),
      alignItems: "center",
      fontWeight: 600,
    },
    dataDisplay: {
      display: "flex",
      gap: theme.spacing(2),

      "& > dl": {
        minWidth: "73px", // aligns amounts with < 10 to each other
      },
    },
  }),
  { name: "OrderTransactionCardTitle" },
);

export const useMoneyDisplayStyles = makeStyles(
  theme => ({
    wrapper: {
      color: theme.palette.saleor.main[2],
      margin: 0,
      textAlign: "left",
    },
    label: {
      fontWeight: 600,
      lineHeight: "12px",
      fontSize: theme.spacing(1.25),
      textTransform: "uppercase",
    },
    moneyWrapper: {
      margin: 0,
      fontSize: 14,
    },
    currency: {
      fontWeight: 400,
    },
    amount: {
      fontWeight: 600,
    },
  }),
  {
    name: "MoneyDisplay",
  },
);
