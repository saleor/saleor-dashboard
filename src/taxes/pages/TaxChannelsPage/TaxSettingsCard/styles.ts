import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
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
      alignItems: "center",
      gap: theme.spacing(2),
      "&>:first-child": {
        paddingTop: "2rem",
      },
    },
    singleSelectField: {
      width: "275px",
    },
    singleSelectWrapper: {
      display: "flex",
      flexDirection: "column",
    },
    hint: {
      marginLeft: 0,
      color: theme.palette.saleor.main[3],
    },
  }),
  { name: "TaxSettingsCard" },
);
