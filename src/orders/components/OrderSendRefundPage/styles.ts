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
      flexDirection: "column",
      alignItems: "center",
      [theme.breakpoints.up("sm")]: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-end",
      },
    },
    priceInput: {
      [theme.breakpoints.up("sm")]: {
        maxWidth: "24rem",
      },
    },
    pspReferenceInput: {
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        maxWidth: "25rem",
      },
    },
    descriptionInput: {
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        maxWidth: "30rem",
      },
    },
    submitButton: {
      flexShrink: 0,
    },
  }),
  { name: "ManualRefundCard" },
);
