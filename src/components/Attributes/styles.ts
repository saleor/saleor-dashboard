import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    fileField: {
      float: "right",
    },
    pullRight: {
      display: "flex",
      justifyContent: "flex-end",
    },
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
