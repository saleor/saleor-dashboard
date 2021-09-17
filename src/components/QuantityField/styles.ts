import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    innerInput: {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2)
    },
    inputDisabled: {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.grey[500]
    }
  }),
  { name: "ItemsCard" }
);
