import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  {
    container: {
      display: "",
    },
    dataList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    cardLoading: {
      height: "20em",
      background: "white",
    },
  },
  { name: "OrderSendRefundPage" },
);

export const useDataLineStyles = makeStyles(
  {
    wrapper: {
      display: "flex",
      justifyContent: "space-between",

      "& dd": {
        margin: 0,
      },
    },
  },
  { name: "DataLine" },
);

export const useDataLineMoneyStyles = makeStyles(
  {
    amount: {
      fontWeight: 600,
    },
  },
  {
    name: "DataLineMoney",
  },
);

export const useDataLineSettledStyles = makeStyles(
  theme => ({
    text: {
      fontWeight: 600,
    },
    unsettled: {
      color: theme.palette.saleor.fail.dark,
    },
    settled: {
      color: theme.palette.saleor.success.dark,
    },
  }),
  {
    name: "DataLineSettled",
  },
);

export const useManualRefundCardStyles = makeStyles(
  theme => ({
    wrapper: {
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(2),
      alignItems: "flex-end",
      gap: theme.spacing(1),
    },
    form: {
      display: "flex",
      gap: theme.spacing(1),
      width: "100%",
      justifyContent: "flex-end",
    },
    priceInput: {
      maxWidth: "24rem",
    },
    descriptionInput: {
      width: "100%",
      maxWidth: "30rem",
    },
    submitButton: {
      flexShrink: 0,
    },
  }),
  { name: "ManualRefundCard" },
);
