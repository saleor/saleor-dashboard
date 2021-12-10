import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => {
    const colAction: React.CSSProperties = {
      textAlign: "right",
      width: 130
    };
    const colName: React.CSSProperties = {
      width: 220
    };

    return {
      colAction: {
        "&:last-child": {
          ...colAction,
          paddingRight: theme.spacing(3)
        }
      },
      colActionHeader: {
        ...colAction
      },
      colName: {
        ...colName,
        verticalAlign: "top"
      },
      colNameHeader: {
        ...colName
      },
      colValue: {},
      actions: {
        "&&": {
          paddingBottom: theme.spacing(2),
          paddingTop: theme.spacing(2)
        }
      },
      content: {
        paddingBottom: 0,
        paddingTop: theme.spacing()
      },
      emptyContainer: {
        paddingBottom: theme.spacing(4),
        paddingTop: theme.spacing(3),
        textAlign: "center"
      },
      emptyImage: {
        marginBottom: theme.spacing(2)
      },
      input: {
        padding: theme.spacing(0.5, 2)
      },
      nameInput: {
        padding: `13px 16px`
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
