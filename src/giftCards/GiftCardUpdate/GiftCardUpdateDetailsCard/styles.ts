import { makeStyles } from "@saleor/macaw-ui";

export const useGiftCardDetailsBalanceStyles = makeStyles(
  theme => ({
    labelsContainer: {
      display: "flex",
      alignItems: "baseline",
    },
    wideContainer: {
      justifyContent: "space-between",
    },
    balanceBar: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      height: 36,
      padding: "0 4px",
      backgroundColor: theme.palette.background.default,
      borderRadius: 18,
    },
    balanceBarProgress: {
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.palette.primary.light,
    },
  }),
  { name: "GiftCardUpdateDetailsBalanceSection" },
);
