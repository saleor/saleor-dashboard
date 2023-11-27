import { makeStyles } from "@saleor/macaw-ui";

export const useProductsCardStyles = makeStyles(
  theme => {
    return {
      colProduct: {
        width: "auto",
      },
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
      colUnitPrice: {
        textAlign: "right",
        width: `${100 + 32 + 32}px`,
      },
    };
  },
  { name: "ProductsCard" },
);
