import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => {
    const inputPadding = {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2)
    };

    return {
      cartContent: {
        paddingBottom: 0,
        paddingTop: 0
      },
      colQuantity: {
        textAlign: "right",
        width: 210
      },
      notice: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2)
      },
      orderNumber: {
        display: "inline",
        marginLeft: theme.spacing(1)
      },
      quantityInnerInput: {
        ...inputPadding
      },
      quantityInnerInputNoRemaining: {
        paddingRight: 0
      },
      remainingQuantity: {
        ...inputPadding,
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap"
      },
      setMaximalQuantityButton: {
        marginTop: theme.spacing(1)
      }
    };
  },
  { name: "OrderRefundFulfilledProducts" }
);
