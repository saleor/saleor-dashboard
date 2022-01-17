import { makeStyles } from "@saleor/macaw-ui";

export const useTableStyles = makeStyles(
  {
    cardCodeContainer: {
      display: "flex",
      alignItems: "baseline"
    },
    colCardCode: {
      width: 400
    },
    colDelete: {
      width: 80
    },
    colBalance: {
      width: 135
    },
    colBase: {
      width: 150
    },
    row: {
      cursor: "pointer",
      height: 70,
      "& td, & th": {
        padding: "0px 20px",
        height: "auto"
      }
    }
  },
  { name: "GiftCardsListTable" }
);

export const useHeaderStyles = makeStyles(
  theme => ({
    alertLink: {
      fontSize: theme.typography.body2.fontSize
    }
  }),
  { name: "GiftCardsListHeader" }
);
