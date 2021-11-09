import { makeStyles } from "@saleor/macaw-ui";

export const useGiftCardCreateExpirySelectStyles = makeStyles(
  theme => ({
    radioGroupContainer: {
      display: "flex",
      flexDirection: "row"
    },
    dateField: {
      width: 400
    },
    periodField: {
      display: "flex"
    },
    dateText: {
      marginTop: theme.spacing(0.5)
    }
  }),
  { name: "GiftCardExpirySelect" }
);
