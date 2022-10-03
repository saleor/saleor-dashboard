import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    fulfilmentNumber: {
      display: "inline",
      marginLeft: theme.spacing(1),
    },
    cardsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(2),
    },
  }),
  { name: "OrderGrantRefund" },
);

export const useRefundCardStyles = makeStyles(
  theme => ({
    refundCardHeader: {
      paddingBottom: 0,
    },
    suggestedValue: {
      display: "flex",
      alignItems: "baseline",
      gap: theme.spacing(1),
      flexWrap: "wrap",
      marginBottom: theme.spacing(1),
    },
    totalMoney: {
      fontWeight: 600,
    },
    applyButton: {
      height: "auto",
      padding: 0,
    },
    shippingCostLine: {
      display: "flex",
      gap: theme.spacing(1),
      marginBottom: theme.spacing(1),
      "& .MuiCheckbox-root": {
        padding: 0,
      },
    },
    submitLine: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      marginTop: theme.spacing(1.5),
      gap: theme.spacing(1),
      "& > span": {
        color: theme.palette.saleor.warning.dark,
      },
      "& button": {
        // when line overflows
        marginLeft: "auto",
      },
    },
  }),
  { name: "RefundCard" },
);

export const useProductsCardStyles = makeStyles(
  theme => {
    const inputPadding = {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2),
    };
    return {
      colProduct: {
        width: "auto",
      },
      productVariantName: {},
      productName: {
        display: "flex",
        flexDirection: "column",
        "& $productVariantName": {
          color: theme.palette.saleor.main[3],
          fontSize: "1.25rem",
        },
      },
      colQuantityInput: {
        textAlign: "right",
        width: `${100 + 32 + 32}px`, // 32 = td padding
      },
      colQuantity: {
        textAlign: "right",
        width: `${75 + 32 + 32}px`,
      },
      quantityInnerInput: {
        ...inputPadding,
      },
      remainingQuantity: {
        ...inputPadding,
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap",
      },
    };
  },
  { name: "ProductsCard" },
);
