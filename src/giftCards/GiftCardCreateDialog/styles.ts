import { makeStyles } from "@saleor/macaw-ui";
import { CSSProperties } from "react";

const contentStyles: CSSProperties = {
  maxHeight: "calc(100vh - 230px)",
  overflowY: "auto",
  overflowX: "hidden",
};

export const useGiftCardCreateDialogCodeContentStyles = makeStyles(
  () => ({
    content: {
      ...contentStyles,
    },
  }),
  { name: "GiftCardCreateDialogCodeContent" },
);

export const useGiftCardCreateFormStyles = makeStyles(
  () => ({
    noteField: {
      width: "100%",
    },
    currencySelectField: {
      width: 100,
    },
    fullWidthContainer: { width: "100%" },
    dialogContent: {
      ...contentStyles,
    },
  }),
  { name: "GiftCardCreateDialogForm" },
);
