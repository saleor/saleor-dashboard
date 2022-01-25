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

export const useGiftCardCreateFormStyles = makeStyles(
  () => ({
    noteField: {
      width: "100%"
    },
    currencySelectField: {
      width: 100
    },
    fullWidthContainer: { width: "100%" },
    dialogContent: {
      minWidth: 550,
      overflowY: "auto",
      overflowX: "hidden"
    }
  }),
  { name: "GiftCardCreateDialogForm" }
);
