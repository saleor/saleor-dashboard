import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    caption: {
      fontSize: 14,
      padding: theme.spacing(0, 3, 2, 3),
    },
    colName: {
      fontSize: 14,
      width: "auto",
    },
    colType: {
      fontSize: 14,
      width: 220,
    },
    pricingContent: {
      "&:last-child": {
        paddingBottom: 0,
      },
    },
    table: {
      tableLayout: "fixed",
    },
  }),
  {
    name: "PricingCard",
  },
);
