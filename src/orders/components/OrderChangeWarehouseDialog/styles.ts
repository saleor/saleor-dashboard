import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    container: {
      paddingTop: 0,
    },
    searchInput: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    radioLabelContainer: {
      display: "flex",
      flexDirection: "column",
    },
    warehouseName: {
      maxWidth: "350px",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    tableBody: {
      display: "table",
      width: "100%",
    },
    tableCell: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
  }),
  { name: "OrderChangeWarehouseDialog" },
);
