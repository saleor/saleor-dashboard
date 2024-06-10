import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    title: {
      width: "100%",
      display: "flex",
      justifyContent: "flex-start",
    },
    orderNumber: {
      display: "inline",
      marginLeft: theme.spacing(1),
    },
    warehouseName: {
      float: "right",
      alignSelf: "center",
      color: theme.palette.text.secondary,
      margin: `auto ${theme.spacing(1)} auto auto`,
    },
    cardHeader: {
      fontSize: "24px",
      fontWeight: 500,
      lineHeight: "29px",
      letterSpacing: "0.02em",
      textAlign: "left",
    },
    indicator: {
      display: "flex",
      alignItems: "center",
      marginBottom: "1px",
    },
  }),
  { name: "OrderCardTitle" },
);
