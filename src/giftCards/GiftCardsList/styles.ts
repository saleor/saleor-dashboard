import { drawerWidthExpanded } from "@saleor/components/AppLayout/consts";
import { makeStyles } from "@saleor/macaw-ui";

export const usePageStyles = makeStyles(
  theme => ({
    container: {
      [theme.breakpoints.up("md")]: {
        width: `calc(100vw - ${drawerWidthExpanded}px)`
      }
    }
  }),
  { name: "GiftCardsListPage" }
);

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

export const useHeaderStyles = makeStyles(
  theme => ({
    alertLink: {
      fontSize: theme.typography.body2.fontSize
    }
  }),
  { name: "GiftCardsListHeader" }
);
