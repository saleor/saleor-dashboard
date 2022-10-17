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
