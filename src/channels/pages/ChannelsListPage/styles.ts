import makeStyles from "@material-ui/core/styles/makeStyles";

export const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colName: {
        "&&": {
          width: "auto"
        }
      }
    },
    colAction: {
      "&&": {
        paddingRight: theme.spacing(1)
      },
      textAlign: "right",
      width: 140
    },
    colName: {
      paddingLeft: 0,
      width: 250
    },
    colRight: {
      textAlign: "right"
    },
    columnPicker: {
      marginRight: theme.spacing(3)
    },
    search: {
      "& > div": {
        width: "100%"
      },
      borderBottom: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 3)
    },
    table: {
      tableLayout: "fixed"
    },
    tableRow: {
      cursor: "pointer"
    },
    tabsRoot: {
      marginBottom: theme.spacing(1)
    }
  }),
  { name: "ChannelsListPage" }
);
