import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    center: {
      margin: 0,
      display: "flex",
      placeContent: "center",
      textAlign: "center",
    },
    left: {
      margin: 0,
      display: "flex",
      placeContent: "flex-start",
      textAlign: "left",
    },
    dummy: {
      width: "40px",
      height: "40px",
      visiblity: "hidden",
    },
    noDivider: {
      "&::after, &::before": { display: "none" },
    },
    toolbarMargin: {
      "&:last-child": {
        marginRight: 0,
      },
    },
    selectField: {
      textAlign: "left",
    },
  }),
  { name: "TaxChannelsPage" },
);
