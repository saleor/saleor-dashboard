import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    colQuantityHeader: {
      textAlign: "right",
    },
    colStock: {
      textAlign: "right",
      width: 180,
    },
    colName: {
      width: 250,
    },
    colQuantity: {
      textAlign: "right",
      width: 210,
    },
    colSku: {
      textAlign: "right",
      textOverflow: "ellipsis",
      width: 150,
    },
    table: {
      "&&": {
        tableLayout: "fixed",
      },
    },
    shipmentInformationCard: {
      padding: theme.spacing(3),
      alignSelf: "start",
      display: "grid",
      gridRowGap: theme.spacing(1),
    },
    supportHeader: {
      textTransform: "uppercase",
      color: theme.palette.saleor.main[3],
      fontWeight: 500,
      letterSpacing: "0.1em",
      fontSize: "12px",
      lineHeight: "160%",
      marginBottom: theme.spacing(2),
    },
    warehouseLabel: {
      marginBottom: theme.spacing(4),
    },
  }),
  { name: "OrderFulfillPage" },
);
