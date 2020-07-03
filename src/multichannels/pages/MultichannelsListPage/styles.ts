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
    table: {
      tableLayout: "fixed"
    },
    tableRow: {
      cursor: "pointer"
    }
  }),
  { name: "ChannelsListPage" }
);
