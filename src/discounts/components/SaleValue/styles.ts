import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    card: {
      "&:last-child": {
        paddingBottom: 0,
      },
    },
    colValue: {
      width: 300,
    },
    colName: {
      fontSize: 14,
      paddingLeft: 0,
      width: "auto",
    },
    colType: {
      fontSize: 14,
      textAlign: "right",
      width: 235,
    },
    info: {
      fontSize: 14,
    },
    row: {
      "&:last-child": {
        "& td": {
          borderBottom: "none",
        },
      },
    },
    table: {
      tableLayout: "fixed",
    },
  }),
  {
    name: "SaleValue",
  },
);
