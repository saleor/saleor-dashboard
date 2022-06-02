import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    clickable: {
      cursor: "pointer"
    },
    scrollWrapper: {
      overflow: "scroll",
      maxHeight: 600
    },
    selected: {
      borderLeft: `4px solid ${theme.palette.saleor.active[1]}`
    },
    spaceBetween: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    tableRow: {
      minHeight: "48px"
    }
  }),
  { name: "TaxCountriesMenu" }
);
