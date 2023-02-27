import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.down("md")]: {
      colNote: {
        width: 200,
      },
    },
    colActions: {
      textAlign: "right",
      width: 100,
    },
    colKey: {
      width: 200,
    },
    colNote: {},
    table: {
      tableLayout: "fixed",
    },
  }),
  { name: "CustomAppTokens" },
);
