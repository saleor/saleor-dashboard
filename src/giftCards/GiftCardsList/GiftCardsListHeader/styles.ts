import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => ({
    preview: {
      position: "absolute",
      top: theme.spacing(-4),
    },
    title: {
      position: "relative",
    },
  }),
  { name: "GiftCardListHeader" },
);

export default useStyles;
