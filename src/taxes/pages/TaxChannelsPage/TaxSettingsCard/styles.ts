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
      // width: "100%",
      gap: theme.spacing(2),
      "&>:first-child": {
        paddingTop: "2rem",
      },
    },
    singleSelectField: {
      // width: "275px",
      // height: "32px",
    },
    singleSelectWrapper: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
    },
    hint: {
      marginLeft: 0,
      color: theme.palette.saleor.main[3],
    },
  }),
  { name: "TaxSettingsCard" },
);
