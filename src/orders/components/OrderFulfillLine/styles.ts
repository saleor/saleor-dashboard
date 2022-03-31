import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    colStock: {
      textAlign: "right",
      width: 180
    },
    colName: {
      width: 250
    },
    colQuantity: {
      textAlign: "right",
      width: 210
    },
    colSku: {
      textAlign: "right",
      textOverflow: "ellipsis",
      width: 150
    },
    warningIcon: {
      color: theme.palette.saleor.warning.mid,
      marginRight: theme.spacing(2)
    },
    error: {
      color: theme.palette.error.main
    },
    warning: {
      color: theme.palette.warning.main,
      borderColor: theme.palette.warning.main + " !important"
    },
    quantityInnerInput: {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2)
    },
    quantityInnerInputNoRemaining: {
      paddingRight: 0
    },
    remainingQuantity: {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2),
      color: theme.palette.text.secondary,
      whiteSpace: "nowrap"
    }
  }),
  { name: "OrderFulfillLine" }
);
