import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    colStock: {
      textAlign: "right",
      width: 180,
    },
    colName: {
      width: 220,
    },
    colQuantity: {
      textAlign: "right",
      width: 210,
    },
    colSku: {
      textAlign: "right",
      textOverflow: "ellipsis",
      width: 100,
    },
    colWarehouse: {
      width: 200,
      textAlign: "right",
    },
    warningIcon: {
      color: theme.palette.saleor.warning.mid,
      marginRight: theme.spacing(2),
    },
  }),
  { name: "OrderFulfillLine" },
);
