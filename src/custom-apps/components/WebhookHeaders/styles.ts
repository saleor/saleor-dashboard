import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => {
    const colAction: React.CSSProperties = {
      textAlign: "right",
      width: 130,
    };
    const colName: React.CSSProperties = {
      width: 250,
      textAlign: "right",
    };

    return {
      tableCell: {
        paddingTop: theme.spacing(3),
        paddingLeft: "3.2rem !important",
        paddingRight: theme.spacing(1),

        "& .MuiFormHelperText-root": {
          margin: 0,
        },

        "&.MuiTableCell-root:first-child:not(.MuiTableCell-paddingCheckbox)": {
          paddingRight: theme.spacing(0),
          paddingTop: theme.spacing(3),
        },
      },
      colAction: {
        "&:last-child": {
          ...colAction,
          paddingRight: "3.2rem",
        },
      },
      colActionHeader: {
        ...colAction,
      },
      colName: {
        ...colName,
      },
      colNameHeader: {
        ...colName,
      },
      colValue: {},
      content: {
        paddingBottom: 0,
        paddingTop: theme.spacing(),
      },
      emptyContainer: {
        paddingBottom: 0,
        paddingTop: 0,
      },
      input: {
        padding: theme.spacing(1.5, 2),
      },
      table: {
        marginTop: theme.spacing(2),
        tableLayout: "fixed",

        head: {
          padding: 0,
        },
      },
    };
  },
  {
    name: "WebhookHeaders",
  },
);

export default useStyles;
