import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    supportHeader: {
      fontWeight: 500,
      fontSize: "12px",
      lineHeight: "160%",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
    showCheckboxShadows: {
      "&&": {
        overflow: "visible",
      },
    },
    taxStrategySection: {
      display: "flex",
      alignItems: "flex-start",
    },
    singleSelectField: {
      width: "275px",
    },
    infoIcon: {
      "& > svg": {
        width: "20px",
        height: "20px",
        verticalAlign: "middle",
      },
    },
  }),
  { name: "TaxSettingsCard" },
);
