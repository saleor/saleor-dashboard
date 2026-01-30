import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    clickableRow: {
      cursor: "pointer",
      userSelect: "none",
    },
    checkboxCell: {},
    wideCell: {
      width: "100%",
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  }),
  { name: "ShippingZoneCountriesAssignDialog" },
);
