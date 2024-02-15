import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    center: {
      margin: 0,
      display: "flex",
      placeContent: "center",
      textAlign: "center",
    },
    cell: {
      display: "grid",
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
      display: "grid",
      gridTemplateColumns: "1fr 500px 1fr 1fr",
    },
    toolbarMargin: {
      "&:last-child": {
        marginRight: 0,
      },
    },
  }),
  { name: "TaxChannelsPage" },
);
