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
    }
  }),
  { name: "TaxChannelsPage" }
);
