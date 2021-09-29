import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  {
    colActions: {
      "&:last-child": {
        paddingRight: 0
      },
      width: 80
    },
    colName: {
      width: "auto"
    },
    colProducts: {
      textAlign: "right",
      width: 140
    },
    tableRow: {
      cursor: "pointer"
    }
  },
  { name: "DiscountCollections" }
);
