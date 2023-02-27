import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    dateField: {
      borderRadius: "4px 0 0 4px",
    },
    timeField: {
      borderRadius: "0 4px 4px 0",
      "& > fieldset": {
        borderLeftWidth: "0 !important",
      },
    },
    [theme.breakpoints.down("md")]: {
      dateField: {
        borderRadius: "4px 4px 0 0",
      },
      timeField: {
        borderRadius: "0 0 4px 4px",
        "& > fieldset": {
          borderTopWidth: "0 !important",
          borderLeftWidth: "1px !important",
        },
      },
    },
  }),
  { name: "DateTimeField" },
);
