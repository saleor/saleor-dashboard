import { makeStyles } from "@material-ui/core";

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
