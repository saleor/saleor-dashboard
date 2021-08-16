import { makeStyles } from "@saleor/macaw-ui";

export const useGiftCardCreateDialogCodeContentStyles = makeStyles(
  () => ({
    buttonsContainer: {
      display: "flex",
      justifyContent: "flex-end",
      minWidth: 450
    }
  }),
  { name: "GiftCardCreateDialogCodeContent" }
);

export const useGiftCardCreateDialogFormStyles = makeStyles(
  () => ({
    noteField: {
      width: "100%"
    },
    currencySelectField: {
      width: 100
    },
    balanceContainer: { width: "100%" }
  }),
  { name: "GiftCardCreateDialogForm" }
);
