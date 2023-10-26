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
    cardLoading: {
      height: "20em",
    },
    form: {
      display: "contents",
    },
  }),
  { name: "OrderGrantRefund" },
);

export const useProductsCardStyles = makeStyles(
  theme => {
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
      remainingQuantity: {
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap",
      },
    };
  },
  { name: "ProductsCard" },
);
