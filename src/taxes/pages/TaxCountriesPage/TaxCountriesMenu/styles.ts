import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    clickable: {
      cursor: "pointer",
    },
    selected: {
      "&&&&::before": {
        position: "absolute",
        left: 0,
        width: "4px",
        height: "100%",
        backgroundColor: theme.palette.saleor.active[1],
      },
    },
    spaceBetween: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    tableRow: {
      minHeight: "48px",
    },
    greyText: {
      color: theme.palette.text.hint,
    },
  }),
  { name: "TaxCountriesMenu" },
);
