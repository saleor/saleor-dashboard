import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    container: {
      paddingTop: 0
    },
    radioLabelContainer: {
      display: "flex",
      flexDirection: "column"
    },
    searchBox: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    searchInput: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2)
    },
    supportHeader: {
      textTransform: "uppercase",
      color: theme.palette.saleor.main[3],
      fontWeight: 500,
      letterSpacing: "0.1em",
      fontSize: "12px",
      lineHeight: "160%"
    },
    warehouseCell: {
      paddingLeft: 0
    },
    helpText: {
      display: "inline",
      fontSize: "12px",
      lineHeight: "160%",
      color: theme.palette.saleor.main[3]
    },
    supportText: {
      fontSize: "14px",
      lineHeight: "160%",
      color: theme.palette.saleor.main[3]
    }
  }),
  { name: "OrderChangeWarehouseDialog" }
);
