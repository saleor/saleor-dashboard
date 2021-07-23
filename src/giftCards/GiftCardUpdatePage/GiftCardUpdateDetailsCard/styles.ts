import { makeStyles } from "@saleor/macaw-ui";

export const useGiftCardDetailsBalanceStyles = makeStyles(
  theme => ({
    labelsContainer: {
      display: "flex",
      alignItems: "baseline"
    },
    wideContainer: {
      justifyContent: "space-between"
    },
    balanceBar: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      height: 36,
      padding: "0 4px",
      backgroundColor: theme.palette.background.default,
      borderRadius: 18
    },
    balanceBarProgress: {
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.palette.primary.light
    },
    balanceBarProgressDark: {
      backgroundColor: theme.palette.primary.dark
    }
  }),
  { name: "GiftCardUpdateDetailsBalanceSection" }
);

export const useGiftCardDetailsExpiryStyles = makeStyles(
  () => ({
    radioGroupContainer: {
      display: "flex",
      flexDirection: "row"
    },
    dateField: {
      width: 400
    }
  }),
  { name: "GiftCardUpdateDetailsExpirySection" }
);

export const useTimePeriodTextWithSelectFieldStyles = makeStyles(
  () => ({
    container: {
      position: "relative",
      width: 400
    },
    textField: {
      paddingRight: 300,
      width: "100%",
      "& input": {
        paddingTop: 16,
        paddingBottom: 16
      }
    },
    autocompleteField: {
      position: "absolute",
      height: 52,
      width: 300,
      top: 0,
      right: 0,
      border: "none",
      "& *": {
        border: "none"
      },
      "& *:focus": {
        background: "none"
      }
    }
  }),
  { name: "TimePeriodTextWithSelectField" }
);
