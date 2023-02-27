import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    clickableRow: {
      cursor: "pointer",
      userSelect: "none",
    },
    checkboxCell: {
      paddingLeft: 0,
    },
    table: {
      border: "1px solid " + theme.palette.grey[200],
    },
    wideCell: {
      width: "100%",
    },
  }),
  { name: "ShippingZoneCountriesAssignDialog" },
);
