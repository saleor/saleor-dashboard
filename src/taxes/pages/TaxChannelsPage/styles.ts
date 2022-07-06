import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    center: {
      margin: 0,
      display: "flex",
      placeContent: "center",
      textAlign: "center"
    },
    dummy: {
      width: "40px",
      height: "40px",
      visiblity: "hidden"
    },
    noDivider: {
      "&::after": { display: "none" }
    },
    toolbarMargin: {
      "&:last-child": {
        marginRight: 0
      }
    }
  }),
  { name: "TaxChannelsPage" }
);
