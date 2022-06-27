import { makeStyles } from "@saleor/macaw-ui";

const useStyles = makeStyles(
  theme => {
    const colAction: React.CSSProperties = {
      textAlign: "right",
      width: 130,
    };
    const colName: React.CSSProperties = {
      width: 220,
    };

    return {
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
        verticalAlign: "top",
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
      },
      header: {
        "&&": {
          paddingBottom: theme.spacing(1),
        },
      },
      input: {
        padding: theme.spacing(0.5, 2),
      },
      nameInput: {
        padding: `13px 16px`,
      },
      table: {
        marginTop: theme.spacing(2),
        tableLayout: "fixed",
      },
      rotate: {
        transform: "rotate(-180deg)",
      },
    };
  },
  {
    name: "Metadata",
  },
);

export default useStyles;
