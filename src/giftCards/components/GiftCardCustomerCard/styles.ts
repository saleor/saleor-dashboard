import { makeStyles } from "@material-ui/core";

interface CustomerGiftCardsCardActionsProps {
  buttonPosition: "left" | "right";
}

export const useCardActionsStyles = makeStyles(
  theme => ({
    cardActions: {
      padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
      flexDirection: ({ buttonPosition }: CustomerGiftCardsCardActionsProps) =>
        buttonPosition === "left" ? "row" : "row-reverse",
    },
    previewPill: {
      marginLeft: theme.spacing(1),
    },
  }),
  { name: "CustomerGiftCardsCard" },
);

export const useListWrapperStyles = makeStyles(
  theme => ({
    listingWrapper: {
      display: "grid",
      gridTemplateColumns: "max-content 1fr min-content",
      margin: theme.spacing(2, 3),
      alignItems: "center",
      justifyItems: "center",
    },
    listingMenu: {
      gridColumn: "3",
    },
  }),
  { name: "CustomerGiftCardListCard" },
);
