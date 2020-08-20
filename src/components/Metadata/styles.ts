import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const colAction: React.CSSProperties = {
      textAlign: "right",
      width: 130
    };

    return {
      colAction: {
        "&:last-child": {
          ...colAction,
          paddingRight: theme.spacing()
        }
      },
      colActionHeader: {
        ...colAction
      },
      colName: {
        width: 220
      },
      colValue: {},
      content: {
        paddingBottom: 0,
        paddingTop: theme.spacing()
      },
      emptyContainer: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        paddingBottom: theme.spacing(4),
        paddingTop: theme.spacing(3),
        textAlign: "center"
      },
      emptyImage: {
        display: "block",
        marginBottom: theme.spacing(2)
      },
      input: {
        padding: theme.spacing(0.5, 2)
      },
      table: {
        tableLayout: "fixed"
      },
      togglable: {
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between"
      }
    };
  },
  {
    name: "Metadata"
  }
);

export default useStyles;
