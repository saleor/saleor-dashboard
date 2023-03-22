import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    swatchInput: {
      paddingTop: 16.5,
      paddingBottom: 16.5,
    },
    swatchPreview: {
      width: 32,
      height: 32,
      borderRadius: 4,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
  }),
  { name: "AttributeRow" },
);
