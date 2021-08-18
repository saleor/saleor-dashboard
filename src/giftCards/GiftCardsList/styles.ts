import { makeStyles } from "@saleor/macaw-ui";

export const useTableStyles = makeStyles(
  () => ({
    moneyContainer: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "flex-end"
    },
    cardCodeContainer: {
      display: "flex",
      alignItems: "baseline"
    },
    colCardCode: {
      width: 460
    },
    colDelete: {
      width: 100
    },
    colBalance: {
      width: 135
    },
    colBase: {
      width: 150
    },
    row: {
      cursor: "pointer",
      height: 80,
      "& td": {
        padding: "0px 20px",
        height: "auto"
      }
    }
  }),
  { name: "GiftCardsListTable" }
);
