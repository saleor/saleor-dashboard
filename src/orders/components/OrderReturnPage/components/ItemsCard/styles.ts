import { makeStyles } from "@saleor/macaw-ui";
import { CSSProperties } from "react";

export const useItemCardStyles = makeStyles(
  theme => {
    const inputPadding: CSSProperties = {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2),
    };

    return {
      cartContent: {
        paddingBottom: 0,
        paddingTop: 0,
      },

      notice: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2),
      },

      quantityField: {
        minWidth: "80px",
      },
      quantityInnerInput: {
        ...inputPadding,
      },
      quantityInnerInputNoRemaining: {
        paddingRight: 0,
      },
      remainingQuantity: {
        ...inputPadding,
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap",
      },
      setMaximalQuantityButton: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2),
        padding: 0,
      },
    };
  },
  { name: "ItemsCard" },
);
