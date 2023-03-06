import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colName: {
        paddingLeft: "0 !important",
        "&&": {
          width: "auto",
        },
      },
    },
    colName: {
      paddingLeft: 0,
      minWidth: theme.spacing(30),
    },
    tableRow: {
      cursor: "pointer",
    },
  }),
  { name: "CustomAppsSkeleton" },
);
