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
        paddingLeft: theme.spacing(1),
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
          paddingRight: theme.spacing(3),
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
      actions: {
        "&&": {
          paddingBottom: theme.spacing(2),
          paddingTop: theme.spacing(2),
        },
      },
      content: {
        paddingBottom: 0,
        paddingTop: theme.spacing(),
      },
      emptyContainer: {
        paddingBottom: 0,
        paddingTop: 0,
      },
      expandBtn: {
        position: "relative",
        left: theme.spacing(1),
        top: -2,
        transition: theme.transitions.create("transform", {
          duration: theme.transitions.duration.shorter,
        }),
        border: 0,
      },
      header: {
        "&&": {
          paddingBottom: theme.spacing(1),
        },
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
      rotate: {
        transform: "rotate(-180deg)",
      },
    };
  },
  {
    name: "WebhookHeaders",
  },
);

export default useStyles;
