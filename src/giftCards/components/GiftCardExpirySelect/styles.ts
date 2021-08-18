import { makeStyles } from "@saleor/macaw-ui";

export const useGiftCardExpirySelectStyles = makeStyles(
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
