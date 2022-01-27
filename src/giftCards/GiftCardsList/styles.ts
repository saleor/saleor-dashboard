import { makeStyles } from "@saleor/macaw-ui";

export const useTableStyles = makeStyles(
  {
    cardCodeContainer: {
      display: "flex",
      alignItems: "baseline"
    },
    colCardCode: {
      paddingLeft: 0,
      width: 400
    },
    colDelete: {
      width: 88
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
        height: "auto"
      }
    },
    skeleton: {
      paddingLeft: 0
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
